//leaflet globals
const bounds = new L.LatLngBounds(new L.LatLng(-89.93411921886802, -1326.0937500000002), new L.LatLng(89.93411921886802, 1326.0937500000002));
const map = new L.map('map').setView([0, 0], 0);


let geoJsonMaker;
let map_legend;

//global data to be loaded
let map_geoJsonDData;
let map_alpha2WeHave2;
let map_csvData_rates

/*Set up leaflet map*/
function mkMap() {
    //the data
    let geo_json = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/custom.geo.json";
    let coords = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/average-latitude-longitude-countries.csv";
    let data_source = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/avg_height_human_country_gdp.csv";
    let data_source_rate_change_per_country = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/avg_rate_change_per_country_gdp.csv";

    //The zoom settings
    //https://gis.stackexchange.com/questions/179630/setting-bounds-and-making-map-bounce-back-if-moved-away
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 7,
        minZoom: 3,
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    }).addTo(map);

    map.setMaxBounds(bounds);

    //Load the date up
    Promise.all([
        d3.json(geo_json),
        d3.csv(data_source, d => (
            {
                country: d['Entity'],
                country_code_alpha3: d['Code'],
                country_code_alpha2: d['code_alpha2'],
                year: new Date(d['Year']),
                male_height_cm: Number(d['Mean male height (cm)']),
                female_height_cm: Number(d['Mean female height (cm)']),
                male_height_change_rate: Number(d['change in male height']),
                female_height_change_rate: Number(d['change in female height']),
                GDP_change_rate: Number(d['GDP annual growth']),
                GDP_change_USD: Number(d['GDP annual USD']),
                Male_to_female_height_ratio: Number(d['Male-to-female height ratio']),
            }
        )),
        d3.csv(data_source_rate_change_per_country, d => (
            {
                country_code_alpha2: d['code_alpha2'],
                change_rate_male: Number(d['change_rate_male']),
                change_rate_female: Number(d['change_rate_female']),
                change_rate_avg: Number(d['change_rate_avg']),
            }
        ))

    ])
        .then(data => {
            map_geoJsonDData = data[0];
            let csvData = data[1];
            map_csvData_rates = data[2];
            //Get list of 2 country codes
            map_alpha2WeHave2 = mk2CountryCodes(csvData);

            mkChoropleth();

            //scale
            L.control.scale().addTo(map);
        });
}

/*Filter countries by 2 alpha country code */
function mk2CountryCodes(csvData_input) {
    let temp = [];
    csvData_input.filter(d => {
        temp.push(d.country_code_alpha2);
    });
    return temp.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
}

function mkChoropleth(changeRateAttr = "male", removeCurrent = false) {
    let property;
    if (removeCurrent) {
        map.removeLayer(geoJsonMaker);
        map.removeControl(map_legend);
    }
    switch (changeRateAttr) {
        case "female":
            property = 'change_rate_female';
            break;
        case "avg":
            property = 'change_rate_avg';
            break;
        default:
            property = 'change_rate_male';
            break;
    }


    let first = d3.extent(map_csvData_rates, d => d[property])[0];
    let last = d3.extent(map_csvData_rates, d => d[property])[1];


    let colorScale = d3.scaleLinear()
        .domain([first, last])
        .range(d3.quantize(d3.interpolateHcl("#ff0000", "#1ece2f"), 2));

    function returnColorBasedOnCode(code, prop) {
        let value = 0;
        for (let i = 0; i < map_csvData_rates.length; ++i) {
            if (code === map_csvData_rates[i].country_code_alpha2) {
                value = map_csvData_rates[i][prop];
                break;
            }
        }
        return colorScale(value);
    }

    function geojsonStyles(features) {
        // Try to filter out countries we do not have!
        if (!map_alpha2WeHave2.includes(features.properties.iso_a2_eh)) {
            return {
                fillColor: "rgba(232,0,0,0)",
                fillOpacity: "rgba(169,75,75,0)",
                color: "rgba(169,75,75,0)",
            }
        } else {
            return {
                // fillColor: "rgb(0,25,189)",
                fillColor: `${returnColorBasedOnCode(features.properties.iso_a2_eh,property)}`,
                fillOpacity: "0.3",
                color: "rgba(255,255,255, 0.75)",
            };
        }
    }

    //make the geo json!!!
    geoJsonMaker = L.geoJson(map_geoJsonDData, {
        style: geojsonStyles,
    });
    geoJsonMaker.addTo(map);

    //add the legend
    map_legend = L.control({position: 'bottomright'});
    map_legend.onAdd = function (map) {
        function mkColorListRec(l, f, d) {
            let list = [];
            while (f > l) {
                list.push(l)
                l += d;
            }
            return list;
        }
        function mkColorListRecV2(l, f, d) {
            let list = [];
            let biggest = Math.abs(l) + f;
            let step = biggest / d;
            console.log(biggest);
            console.log(step);
            while (biggest > l) {
                list.push(l)
                l += step;
            }
            console.log(l);
            console.log(list);
            return list;
        }

        function mkToolTip(value) {
            return `<span class="tooltiptext"> height change ≈ <br> ${value.toFixed(3)} (CM) </span>`;
        }

        let div = L.DomUtil.create('div', 'info legend');
        let colorList = mkColorListRec(first, last, 1);
        let labels = [];
        // loop through our intervals and generate a label with a colored square for each interval
        div.innerHTML = "<b>( - )</b<br>";
        for (let i = 0; i < colorList.length; i++) {
            if (i < colorList.length - 2) {
                div.innerHTML += `<i class="tooltip" style="background: ${colorScale(colorList[i])}"> ${mkToolTip(colorList[i])} </i> <br>`;
            } else {
                div.innerHTML += `<i class="tooltip" style="background: ${colorScale(colorList[i])}"> ${mkToolTip(colorList[i])} </i>`;
            }
        }
        div.innerHTML += "<b>( + )</b>";
        return div;
    };
    map_legend.addTo(map);
}

//Document on load / ready
$(function () {

    //Make the map
    mkMap();

    //Listen for color changes
    let radBtrn = $("#radio-list-inputs").children("input");
    //Default to the first once
    radBtrn[0].click()
    //How to read them
    radBtrn.on("click", (d)=>{
        // console.log(d.currentTarget.value)
        mkChoropleth(d.currentTarget.value,true)
    });

});