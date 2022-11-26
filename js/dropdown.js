

//button population function
function dropdown() {

//load wikipedia iso csv
    Promise.all([d3.csv('https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/wikipedia-iso-country-codes.csv')
    ]).then(data => {
        const select = document.getElementById("menu");
        const countries = data[0]
        console.log(countries)
        countries.forEach(element => {
            //console.log(element.Country)
            const el = document.createElement("option");
            el.textContent = element.Country
            el.value = element.Alpha2
            //console.log(element.Alpha2)
            select.appendChild(el);
        })
    })
}

function changeFunc() {
    var selectBox = document.getElementById("menu")
    var selected = selectBox.options[selectBox.selectedIndex].value;

    relocate(selected);

    addToBar(selected)

}

function relocate(code){
    Promise.all([
        d3.csv(coords)

    ]).then(data => {
        //spacial horizon intercontinental translocator
        const shit = data[0]
        console.log(shit);
        shit.forEach(element =>{
            if(code === element.CountryCode){
                   var latlng = L.latLng(element.Latitude, element.Longitude);
                    map.flyTo(latlng);

            }
        })


    })
}