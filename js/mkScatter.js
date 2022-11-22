//Make Scatter Plot

//Scatter plot dimensions
const sp_margin = {top:40, right: 5, bottom: 30, left: 65};
const sp_width = 700 - sp_margin.left - sp_margin.right;
const sp_height = 430 - sp_margin.top - sp_margin.bottom;
const sp_data_source = "./data/avg_height_human_country_gdp.csv";
const sp_colorBG = "#ffffff";
const sp_colorGDP = "#85bb65";
const sp_colorMale = "#347DC1";
const sp_colorFemale = "#CC6594";

function mkScatter(countryAlpha2="",idName="") {
    if (countryAlpha2==="" || idName == "") return;
    Promise.all(
        [
            d3.csv(sp_data_source,d=>(
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
                    GDP_change_USD: Number(d['GDP annual USD'])
                }
            ))
        ]
    ).then(data=>{
        let theData = data[0];

        //Filter the DATA by country code

        theData = theData.filter(d=> {
            if (d.country_code_alpha2 === countryAlpha2) {
                return d;
            }
        });

        //attach svg to id
        let sp_svg = d3.select(idName)
            .append("svg")
            .attr("width",sp_width+sp_margin.left+sp_margin.right)
            .attr("height",sp_height+sp_margin.top+sp_margin.bottom)
        //background of graph
        sp_svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill",`${sp_colorBG}`);


        let xAxis = mkYearAxis(theData);

        // Add X Axis
        sp_svg.append("g")
            .attr("transform",`translate(0,${sp_height})`)
            .call(d3.axisBottom(xAxis).tickFormat(d3.timeFormat("%Y")));

        //Add Y Axis
        let yAxisRate_change = mkMFAxis(theData);

        sp_svg.append("g")
            .attr("transform",`translate(${sp_margin.left},0)`)
            .call(d3.axisLeft(yAxisRate_change));

        let yAxisGDPRate_change = mkGPDAxis(theData);
        sp_svg.append("g")
            .attr("transform",`translate(${sp_width},${0})`)
            .call(d3.axisRight(yAxisGDPRate_change));

        //Draw DOTS
        sp_svg.append('g')
            .selectAll("dot")
            .data(theData)
            .enter()
            .append("circle")
            .attr("cy", function (d) { return yAxisGDPRate_change(d.GDP_change_rate); } )
            .attr("cx", function (d) { return xAxis(d.year); } )
            .attr("r", 3.5)
            .style("fill", sp_colorGDP)

        sp_svg.append('g')
            .selectAll("dot")
            .data(theData)
            .enter()
            .append("circle")
            .attr("cy", function (d) { return yAxisRate_change(d.male_height_change_rate); } )
            .attr("cx", function (d) { return xAxis(d.year); } )
            .attr("r", 3.5)
            .style("fill", sp_colorMale)

        sp_svg.append('g')
            .selectAll("dot")
            .data(theData)
            .enter()
            .append("circle")
            .attr("cy", function (d) { return yAxisRate_change(d.female_height_change_rate); } )
            .attr("cx", function (d) { return xAxis(d.year); } )
            .attr("r", 3.5)
            .style("fill", sp_colorFemale)

        //Legend and labels

        //Legend

        let legend = sp_svg.append('g')
            .attr("transform","translate(0,50)")
            .selectAll()
            .data([
                    {name:"GDP"},
                    {name:"Male"},
                    {name:"Female"},
                ]
            )
            .enter()
            .append("g")
            .attr("transform",(d,i)=>{
                return `translate(${(i*65)+sp_width/2.5},${sp_height})`
            })

        legend.append("text")
            .text(d=>d.name)

        legend.append("circle")
            .attr('width',"10px")
            .attr('height',"2px")
            .attr("transform","translate(-20, -15)")
            .attr('cx',"10px")
            .attr('cy',"10px")
            .attr('r',"5.5px")
            .attr("fill",d=> {
                let color = sp_colorGDP;
                if (d.name==="Male") {
                    color=sp_colorMale;
                } else if (d.name==="Female") {
                    color=sp_colorFemale;
                }
                return color;
            })

        //Labels
        sp_svg.append("text")
            .attr("class","label")
            .attr("y",0-sp_height+sp_margin.top)
            .attr("transform",`translate(${sp_width/2}, ${(sp_height)-15})` )
            .style("text-anchor", "middle")
            .text(`${theData[0].country}`)

        sp_svg.append("text")
            .attr("transform","rotate(-90)")
            .attr("y",0)
            .attr("x",0-(sp_height/2))
            .attr("dy","1em")
            .style("text-anchor","middle")
            .text("Male & Female Height (rate of change)")

        sp_svg.append("text")
            .attr("transform","rotate(-90)")
            .attr("y",sp_width+20)
            .attr("x",0-(sp_height/2))
            .attr("dy","1em")
            .style("text-anchor","middle")
            .text("GDP (rate of change)")

    });
}

function mkYearAxis(data) {
    let years_extent = d3.extent(data,d=> {
        return d.year
    });
    let axisScale = d3.scaleLinear()
        .domain(years_extent)
        .range([sp_margin.left,sp_width]);
    return axisScale;
}

function mkMFAxis(data) {
    let mf_change_rate = []
    for (let i = 0; i < data.length; ++i) {
        mf_change_rate.push(data[i].male_height_change_rate);
        mf_change_rate.push(data[i].female_height_change_rate);
    }
    let joint_extent = d3.extent(mf_change_rate);
    let axisScale = d3.scaleLinear()
        .domain(joint_extent)
        .range([sp_height,sp_margin.top]);
    return axisScale;
}


function mkGPDAxis(data) {
    let gdp_change_rate = d3.extent(data,d=>{
        return d.GDP_change_rate;
    });
    let axisScale = d3.scaleLinear()
        .domain(gdp_change_rate)
        .range([sp_height,sp_margin.top]);
    return axisScale;
}



function mkLegend() {
    legend.append("rect")
        .attr('width',"90px")
        .attr('height',"25px")
        .attr("transform","translate(-5, -15)")
        .attr('fill',"black")

    legend.append("rect")
        .attr('width',"90px")
        .attr('height',"25px")
        .attr("transform","translate(-5, -15)")
        .attr('fill',"white")

    legend.append("circle")
        .attr('width',"10px")
        .attr('height',"2px")
        .attr("transform","translate(-5, -12)")
        .attr('cx',"10px")
        .attr('cy',"10px")
        .attr('r',"8px")

    legend.append("text")
        .text(d=>d.name)
        .attr("dx","20px")
        .attr("dy","5px")
}