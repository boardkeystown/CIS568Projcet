//button population function
function dropdown() {

//load wikipedia iso csv
    Promise.all([d3.csv('./../data/wikipedia-iso-country-codes.csv')
    ]).then(data => {
        const select = document.getElementById("menu");
        const countries = data[0]
        //console.log(countries)
        countries.forEach(element => {
            //console.log(element.Country)
            const el = document.createElement("option");
            el.textContent = element.Country
            el.value = element.Numeric_code
            select.appendChild(el);
        })
    })
}

