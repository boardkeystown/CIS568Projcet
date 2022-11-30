const geo_json = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/custom.geo.json";
const coords = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/average-latitude-longitude-countries.csv";

const data_source = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/avg_height_human_country_gdp.csv";

const data_source_rate_change_per_country = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/avg_rate_change_per_country_gdp.csv";

const bounds = new L.LatLngBounds(new L.LatLng(-89.93411921886802, -1326.0937500000002), new L.LatLng(89.93411921886802, 1326.0937500000002));

var map = new L.map('map').setView([0, 0], 0);
//L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 7,
    minZoom: 3,
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
}).addTo(map);

//L.Control.geocoder().addTo(map);
// https://gis.stackexchange.com/questions/179630/setting-bounds-and-making-map-bounce-back-if-moved-away

map.setMaxBounds(bounds);

// console.log(map.getBounds());
//icons
var female = L.icon({
    iconUrl: './assets/female-icon.png',
    iconSize: [38, 60], // size of the icon
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var male = L.icon({
    iconUrl: './assets/male icon.png',
    iconSize: [38, 60], // size of the icon
    iconAnchor: [35, 94], // point of the icon which will correspond to marker's location
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});


// map.createPane("D3GEOJSON");
// map.getPanes().D3GEOJSON.style.pointerEvents = 'all';
// map.getPanes().D3GEOJSON = 'mapPath';




// var svg = d3.select(map.getPanes().markerPane)
// var svg = d3.select(map.getPanes().tilePane)
// var svg = d3.select(map.getPanes().svgOverlay)
// var svg = d3.select(map.getPanes().overlayPane)

// var svg = d3.select(map.getPanes().D3GEOJSON)
//     .append("svg").attr("id", "mapSVG")
//
// var g = svg.append("g")
//     .attr("class", "leaflet-zoom-hide");

Promise.all([
    //d3.csv(coords),
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
    d3.csv(data_source_rate_change_per_country, d=> (
        {
            country_code_alpha2: d['code_alpha2'],
            change_rate_male: Number(d['change_rate_male']),
            change_rate_female: Number(d['change_rate_female']),
            change_rate_avg: Number(d['change_rate_avg']),
        }
    ))

]).then(data => {
    /*
    //Leaflet marks
    const shit = data[0]

    shit.forEach((x, i) => {
        // console.log(x);
        //https://stackoverflow.com/questions/23874561/leafletjs-marker-bindpopup-with-options
        //https://leafletjs.com/index.html#popup-option
        return L.marker([x.Latitude, x.Longitude], {icon: female}).addTo(map).bindPopup(x.Country)
    })
    shit.forEach((x, i) =>
        L.marker([x.Latitude, x.Longitude], {icon: male}).addTo(map).bindPopup(x.Country)
    )
    */
    // //GEO JSON
    /*
    const collection = data[1]
    // console.log(collection)
    var transform = d3.geoTransform({point: projectPoint});
    var path = d3.geoPath().projection(transform);

    var feature = g.selectAll("path")
        .data(collection.features)
        .enter()
        .append("path")
        .attr("class", "mapPath")

    function reset() {
        var bounds2 = path.bounds(collection),
            topLeft = bounds2[0],
            bottomRight = bounds2[1];
        svg.attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
        feature.attr("pointer-events", "all").attr("d", path);
    }

    // Use Leaflet to implement a D3 geometric transformation.
    function projectPoint(x, y) {
        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
        this.stream.point(point.x, point.y);
    }

    map.on('zoomend', reset);
    map.on("viewreset", reset);
    reset();
    */

    // geojson map attempt no 2
    const jsonData = data[0];
    const csvData = data[1];
    const csvData_rates = data[2];

    let temp = []
    csvData.filter(d => {
        temp.push(d.country_code_alpha2);
    });

    let alpah2WeHave2 = temp.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    })

    let first = d3.extent(csvData_rates,d=> d.change_rate_male)[0]
    let last = d3.extent(csvData_rates,d=> d.change_rate_male)[1]

    let colorScale = d3.scaleLinear()
        .domain([first,last])
        .range(d3.quantize(d3.interpolateHcl("#be0000", "#00ff15"), 2));

    function returnColorBasedOnCode(code) {
        let value = 0;
        for (let i = 0; i < csvData_rates.length; ++i) {
            if (code === csvData_rates[i].country_code_alpha2) {
                value = csvData_rates[i].change_rate_male;
                break;
            }
        }
        return colorScale(value);
    }

    function styles(features) {
        // console.log("HERER")
        // console.log(features);
        // if (!alpah2WeHave2.includes(features.properties.iso_a2_eh)) {
        //     console.log(features.properties.iso_a2_eh)
        //     console.log(alpah2WeHave2.includes(features.properties.iso_a2_eh))
        // }

        // Try to filter out countires we do not have!
        if (!alpah2WeHave2.includes(features.properties.iso_a2_eh))
        {
            return {
                fillColor: "rgba(232,0,0,0)",
                fillOpacity: "rgba(169,75,75,0)",
                color: "rgba(169,75,75,0)",
            }
        }
        else {
            return  {
                // fillColor: "rgb(0,25,189)",
                fillColor: `${returnColorBasedOnCode(features.properties.iso_a2_eh)}`,
                fillOpacity: "0.3",
                color: "rgba(255,255,255, 0.75)",
            };
        }
    }

    let geoJsonMaker = L.geoJson(data, {style: styles});
    geoJsonMaker.addTo(map);


    // L.geoJson(data).addTo(map);



    //scale
    L.control.scale().addTo(map);

    //legend
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        function mkColorListRec(l, f, d) {
            let list = [];
            while (f > l) {
                list.push(l)
                l += d;
            }
            return list;
        }
        let div = L.DomUtil.create('div', 'info legend');
        let colorList = mkColorListRec(first, last, 1);
        let labels = [];
        // loop through our density intervals and generate a label with a colored square for each interval
        div.innerHTML = "<b>(-)Rate Of Change</b<br>";
        for (let i = 0; i < colorList.length; i++) {
            if (i < colorList.length-2) {
                div.innerHTML += `<i style="background: ${colorScale(colorList[i])}"></i> <br>`;
            } else {
                div.innerHTML += `<i style="background: ${colorScale(colorList[i])}"></i>`;
            }
        }
        div.innerHTML +="<b>(+)Rate Of Change</b>";
        return div;
    };

    legend.addTo(map);




})


/*map.on('click', function(e) {
    var temp = e.latlng
    //var popup = L.popup(e.latlng, {content: '<p>Hello world!<br />This is a nice popup.</p>'}).openOn(map)
});*/

var marker = {};

// const apiKey = "AAPK920a0bb6164f4771baac441d0777575211yFWL2LGNrd0dDnqiWYxTHLbFtOeOkNSLpat_-3ep2q84eDxGvbV_Ipyn6WCPhi"

const layerGroup = L.layerGroup().addTo(map);

map.on('click', function (e) {

    // //stop using the API for now.
    // if (marker != undefined) {
    //     map.removeLayer(marker);
    // }
    // marker = new L.marker(e.latlng, {draggable: true}).addTo(map);
    // L.esri.Geocoding
    //     .reverseGeocode({
    //         apikey: apiKey
    //     })
    //     .latlng(e.latlng)
    //
    //     .run(function (error, result) {
    //         if (error) {
    //             return;
    //         }
    //
    //         layerGroup.clearLayers();
    //
    //         console.log(result)
    //         console.log(result.address.CntryName)
    //     });
});