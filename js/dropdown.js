

//button population function
function dropdown() {
    let _data_source = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/avg_height_human_country_gdp.csv";

    //load wikipedia iso csv
    Promise.all([
                        d3.csv('https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/wikipedia-iso-country-codes.csv'),
        d3.csv(_data_source, d => (
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
        ))
                    ]
    ).then(data => {
        const select = document.getElementById("menu");
        const countries = data[0]
        const _data_source = data[1]

        let temp = [];
        _data_source.filter(d => {
            temp.push(d.country_code_alpha2)
        });
        let alpah2WeHave2 = temp.filter(function (value, index, self) {
            return self.indexOf(value) === index;
        })
        // console.log(countries)
        countries.forEach(element => {
            //console.log(element.Country)
            const el = document.createElement("option");
            if (alpah2WeHave2.includes(element.Alpha2)) {
                el.textContent = element.Country
                el.value = element.Alpha2
                //console.log(element.Alpha2)
                select.appendChild(el);
            }
        })
    })
}

function changeFunc() {
    var selectBox = document.getElementById("menu")
    var selected = selectBox.options[selectBox.selectedIndex].value;

    relocate(selected);

    addToBarRateOfChange(selected);
    addToBarHeightvsGDP(selected);

}

function zoom(){
    map.setZoom(3);
}

function relocate(code){
    Promise.all([
        d3.csv(coords)

    ]).then(data => {
        //spacial horizon intercontinental translocator
        const shit = data[0]
        // console.log(shit);
        shit.forEach(element =>{
            if(code === element.CountryCode){
                   var latlng = L.latLng(element.Latitude, element.Longitude);
                    map.flyTo(latlng);
            }
        })
    })
}