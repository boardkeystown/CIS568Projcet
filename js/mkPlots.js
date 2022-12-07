
//The scatter plot with rate of change
function mkPlots(countryAlpha2="", idName="") {
    //Guard
    if (countryAlpha2==="" || idName == "") return;

    //Scatter plot dimensions
    const sp_margin = {top:40, right: 5, bottom: 30, left: 65};
    const sp_width = 700 - sp_margin.left - sp_margin.right;
    const sp_height = 430 - sp_margin.top - sp_margin.bottom;
    const sp_data_source = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/avg_height_human_country_gdp.csv";
    const sp_colorBG = "#ffffff";
    const sp_colorGDP = "#85bb65";
    const sp_colorMale = "#347DC1";
    const sp_colorFemale = "#CC6594";

    //Load the data
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
                    GDP_change_USD: Number(d['GDP annual USD']),
                    Male_to_female_height_ratio: Number(d['Male-to-female height ratio']),
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
}

//The scatter plot with height cm and gdp
function mkScatterH(countryAlpha2="",idName="") {
    //guard
    if (countryAlpha2==="" || idName == "") return;

    //Scatter plot dimensions
    const sp_margin = {top:40, right: 5, bottom: 30, left: 65};
    const sp_width = 700 - sp_margin.left - sp_margin.right;
    const sp_height = 430 - sp_margin.top - sp_margin.bottom;
    const sp_data_source = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/avg_height_human_country_gdp.csv";
    const sp_colorBG = "#ffffff";
    const sp_colorGDP = "#85bb65";
    const sp_colorMale = "#347DC1";
    const sp_colorFemale = "#CC6594";

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
                    GDP_change_USD: Number(d['GDP annual USD']),
                    Male_to_female_height_ratio: Number(d['Male-to-female height ratio']),
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
            .attr("width",sp_width+(2*sp_margin.left)+sp_margin.right)
            .attr("height",sp_height+sp_margin.top+sp_margin.bottom)
        //background of graph
        sp_svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill",`${sp_colorBG}`);


        let xAxis = mkYearAxisH(theData);

        // Add X Axis
        sp_svg.append("g")
            .attr("transform",`translate(0,${sp_height})`)
            .call(d3.axisBottom(xAxis).tickFormat(d3.timeFormat("%Y")));

        //Add Y Axis
        let yAxisRate_change = mkMFAxisH(theData);

        sp_svg.append("g")
            .attr("transform",`translate(${sp_margin.left},0)`)
            .call(d3.axisLeft(yAxisRate_change));

        let yAxisGDPRate_change = mkGPDAxisH(theData);
        sp_svg.append("g")
            .attr("transform",`translate(${sp_width},${0})`)
            .call(d3.axisRight(yAxisGDPRate_change));

        //Draw DOTS
        sp_svg.append('g')
            .selectAll("dot")
            .data(theData)
            .enter()
            .append("circle")
            .attr("cy", function (d) { return yAxisGDPRate_change(d.GDP_change_USD); } )
            .attr("cx", function (d) { return xAxis(d.year); } )
            .attr("r", 3.5)
            .style("fill", sp_colorGDP)

        sp_svg.append('g')
            .selectAll("dot")
            .data(theData)
            .enter()
            .append("circle")
            .attr("cy", function (d) { return yAxisRate_change(d.male_height_cm); } )
            .attr("cx", function (d) { return xAxis(d.year); } )
            .attr("r", 3.5)
            .style("fill", sp_colorMale)

        sp_svg.append('g')
            .selectAll("dot")
            .data(theData)
            .enter()
            .append("circle")
            .attr("cy", function (d) { return yAxisRate_change(d.female_height_cm); } )
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
            .text("Male & Female Height (in cm)")

        sp_svg.append("text")
            .attr("transform","rotate(-90)")
            .attr("y",sp_width+(2*sp_margin.left)-30)
            .attr("x",0-(sp_height/2))
            .attr("dy","1em")
            .style("text-anchor","middle")
            .text("GDP (in USD)")

    });

    function mkYearAxisH(data) {
        let years_extent = d3.extent(data,d=> {
            return d.year
        });
        let axisScale = d3.scaleLinear()
            .domain(years_extent)
            .range([sp_margin.left,sp_width]);
        return axisScale;
    }

    function mkMFAxisH(data) {
        let mf_change_rate = []
        for (let i = 0; i < data.length; ++i) {
            mf_change_rate.push(data[i].male_height_cm);
            mf_change_rate.push(data[i].female_height_cm);
        }
        let joint_extent = d3.extent(mf_change_rate);
        let axisScale = d3.scaleLinear()
            .domain(joint_extent)
            .range([sp_height,sp_margin.top]);
        return axisScale;
    }


    function mkGPDAxisH(data) {
        let gdp_change_rate = d3.extent(data,d=>{
            return d.GDP_change_USD;
        });
        let axisScale = d3.scaleLinear()
            .domain(gdp_change_rate)
            .range([sp_height,sp_margin.top]);
        return axisScale;
    }
}

function mkLineGraph(countryAlpha2="",idName="") {
    //guard
    if (countryAlpha2==="" || idName == "") return;

    //Scatter plot dimensions
    const sp_margin = {top:40, right: 5, bottom: 30, left: 65};
    const sp_width = 700 - sp_margin.left - sp_margin.right;
    const sp_height = 430 - sp_margin.top - sp_margin.bottom;
    const sp_data_source = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/avg_height_human_country_gdp.csv";
    const sp_colorBG = "#ffffff";
    const sp_colorGDP = "#85bb65";
    const sp_colorMale = "#347DC1";
    const sp_colorFemale = "#CC6594";

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
                    GDP_change_USD: Number(d['GDP annual USD']),
                    Male_to_female_height_ratio: Number(d['Male-to-female height ratio']),
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
            .attr("width",sp_width+(2*sp_margin.left)+sp_margin.right)
            .attr("height",sp_height+sp_margin.top+sp_margin.bottom)

        //background of graph
        sp_svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill",`${sp_colorBG}`);


        let xAxis = mkYearAxisH(theData);

        // Add X Axis
        sp_svg.append("g")
            .attr("transform",`translate(0,${sp_height})`)
            .call(d3.axisBottom(xAxis).ticks(15).tickFormat(d3.timeFormat("%Y")));

        //Add Y Axis
        let yAxisRate_change = mkMFAxisH(theData);

        sp_svg.append("g")
            .attr("transform",`translate(${sp_margin.left},0)`)
            .call(d3.axisLeft(yAxisRate_change).ticks(15));

        let yAxisGDPRate_change = mkGPDAxisH(theData);
        sp_svg.append("g")
            .attr("transform",`translate(${sp_width},${0})`)
            .call(d3.axisRight(yAxisGDPRate_change).ticks(15).tickFormat(d3.format(".2e")));

        //Line generators!
        let lineGen_gdp = d3.line()
            .x(d=> xAxis(d.year))
            .y(d=> yAxisGDPRate_change(d.GDP_change_USD));

        let lineGen_male_height = d3.line()
            .x(d=> xAxis(d.year))
            .y(d=> yAxisRate_change(d.male_height_cm))

        let lineGen_female_height = d3.line()
            .x(d=> xAxis(d.year))
            .y(d=> yAxisRate_change(d.female_height_cm))

        //Draw DOTS
        sp_svg.append('g')
            .selectAll("lines")
            .data([theData])
            .enter()
            .append("path")
            .attr("d",d=>lineGen_gdp(d))
            .style("fill","none")
            .style("stroke",sp_colorGDP)
            .style("stroke-width",'3px');

        sp_svg.append('g')
            .selectAll("line")
            .data([theData])
            .enter()
            .append("path")
            .attr("d", d=>lineGen_male_height(d))
            .style("fill","none")
            .style("stroke",sp_colorMale)
            .style("stroke-width",'3px');

        sp_svg.append('g')
            .selectAll("line")
            .data([theData])
            .enter()
            .append("path")
            .attr("d", d=>lineGen_female_height(d))
            .style("fill","none")
            .style("stroke",sp_colorFemale)
            .style("stroke-width",'3px');

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
            .text("Male & Female Height (in cm)")

        sp_svg.append("text")
            .attr("transform","rotate(-90)")
            .attr("y",sp_width+(2*sp_margin.left)-30)
            .attr("x",0-(sp_height/2))
            .attr("dy","1em")
            .style("text-anchor","middle")
            .text("GDP (in USD)")

    });

    function mkYearAxisH(data) {
        let years_extent = d3.extent(data,d=> {
            return d.year
        });
        let axisScale = d3.scaleLinear()
            .domain(years_extent)
            .range([sp_margin.left,sp_width]);
        return axisScale;
    }

    function mkMFAxisH(data) {
        let mf_change_rate = []
        for (let i = 0; i < data.length; ++i) {
            mf_change_rate.push(data[i].male_height_cm);
            mf_change_rate.push(data[i].female_height_cm);
        }
        let joint_extent = d3.extent(mf_change_rate);
        let axisScale = d3.scaleLinear()
            .domain(joint_extent)
            .range([sp_height,sp_margin.top]);

        return axisScale;
    }


    function mkGPDAxisH(data) {
        let gdp_change_rate = d3.extent(data,d=>{
            return d.GDP_change_USD;
        });
        let axisScale = d3.scaleLinear()
            .domain(gdp_change_rate)
            .range([sp_height,sp_margin.top]);
        return axisScale;
    }
}

//Scatter 2D over GDP
function mkScattery(countryAlpha2="",idName="") {
    //guard
    if (countryAlpha2==="" || idName == "") return;
    //Scatter plot dimensions
    const sp_margin = {top:40, right: 5, bottom: 30, left: 65};
    const sp_width = 800 - sp_margin.left - sp_margin.right;
    const sp_height = 430 - sp_margin.top - sp_margin.bottom;
    const sp_data_source = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/avg_height_human_country_gdp.csv";
    const sp_colorBG = "#ffffff";
    const sp_colorGDP = "#85bb65";
    const sp_colorAVG = "#7a00ff";
    const sp_colorMale = "#347DC1";
    const sp_colorFemale = "#CC6594";
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
                    GDP_change_USD: Number(d['GDP annual USD']),
                    Male_to_female_height_ratio: Number(d['Male-to-female height ratio']),
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
            .attr("width",sp_width+(sp_margin.left)+sp_margin.right)
            .attr("height",sp_height+sp_margin.top+sp_margin.bottom)
        //background of graph
        sp_svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill",`${sp_colorBG}`);


        let xAxis = mkYearAxisH(theData);

        // Add X Axis
        // sp_svg.append("g")
        //     .attr("transform",`translate(0,${sp_height})`)
        //     .call(d3.axisBottom(xAxis).tickFormat(d3.timeFormat("%Y")));

        let yAxisGDPRate_change = mkGPDAxisH(theData);
        sp_svg.append("g")
            .attr("transform",`translate(0,${sp_height})`)
            .call(d3.axisBottom(yAxisGDPRate_change).ticks(10).tickFormat(d3.format(".2e")));

        //Add Y Axis
        let yAxisRate_change = mkMFAxisH(theData);

        sp_svg.append("g")
            .attr("transform",`translate(${sp_margin.left},0)`)
            .call(d3.axisLeft(yAxisRate_change));

        //Draw DOTS
        sp_svg.append('g')
            .selectAll("dot")
            .data(theData)
            .enter()
            .append("circle")
            .attr("cy", function (d) { return (yAxisRate_change(d.male_height_cm)+yAxisRate_change(d.female_height_cm))/2; } )
            .attr("cx", function (d) { return yAxisGDPRate_change(d.GDP_change_USD); } )
            .attr("r", 3.5)
            .style("fill", sp_colorAVG)
        sp_svg.append('g')
            .selectAll("dot")
            .data(theData)
            .enter()
            .append("circle")
            .attr("cy", function (d) { return yAxisRate_change(d.male_height_cm); } )
            .attr("cx", function (d) { return yAxisGDPRate_change(d.GDP_change_USD); } )
            .attr("r", 3.5)
            .style("fill", sp_colorMale)

        sp_svg.append('g')
            .selectAll("dot")
            .data(theData)
            .enter()
            .append("circle")
            .attr("cy", function (d) { return yAxisRate_change(d.female_height_cm); } )
            .attr("cx", function (d) { return yAxisGDPRate_change(d.GDP_change_USD); } )
            .attr("r", 3.5)
            .style("fill", sp_colorFemale)
        //Legend and labels

        //Legend
        let legend = sp_svg.append('g')
            .attr("transform","translate(0,50)")
            .selectAll()
            .data([
                    {name:"Avg"},
                    // {name:"GDP"},
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
                } else if (d.name==="Avg") {
                        color=sp_colorAVG;
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
            .text("Male & Female Height (in cm)")

        sp_svg.append("text")
            .attr("transform","rotate(0)")
            .attr("y",sp_height+15)
            .attr("x",(sp_width/2))
            .attr("dy","1em")
            .style("text-anchor","middle")
            .text("GDP in USD")

    });

    function mkYearAxisH(data) {
        let years_extent = d3.extent(data,d=> {
            return d.year
        });
        let axisScale = d3.scaleLinear()
            .domain(years_extent)
            .range([sp_margin.left,sp_width]);
        return axisScale;
    }

    function mkMFAxisH(data) {
        let mf_change_rate = []
        for (let i = 0; i < data.length; ++i) {
            mf_change_rate.push(data[i].male_height_cm);
            mf_change_rate.push(data[i].female_height_cm);
        }
        let joint_extent = d3.extent(mf_change_rate);
        let axisScale = d3.scaleLinear()
            .domain(joint_extent)
            .range([sp_height,sp_margin.top]);
        return axisScale;
    }

    function mkGPDAxisH(data) {
        let gdp_change_rate = d3.extent(data,d=>{
            return d.GDP_change_USD;
        });
        let axisScale = d3.scaleLinear()
            .domain(gdp_change_rate)
            .range([sp_margin.left,sp_width]);
        return axisScale;
    }
}





//Scatter 2D With Regression over AVG
function mkRegression(countryAlpha2="",idName="") {
    //guard
    if (countryAlpha2==="" || idName == "") return;
    //Scatter plot dimensions
    const sp_margin = {top:40, right: 5, bottom: 30, left: 65};
    const sp_width = 700 - sp_margin.left - sp_margin.right;
    const sp_height = 430 - sp_margin.top - sp_margin.bottom;
    const sp_data_source = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/avg_height_human_country_gdp.csv";
    const sp_colorBG = "#ffffff";
    const sp_colorGDP = "#85bb65";
    const sp_colorAVG = "#7a00ff";
    const sp_colorMale = "#347DC1";
    const sp_colorFemale = "#CC6594";
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
                    GDP_change_USD: Number(d['GDP annual USD']),
                    Male_to_female_height_ratio: Number(d['Male-to-female height ratio']),
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
            .attr("width",sp_width+(sp_margin.left)+sp_margin.right)
            .attr("height",sp_height+sp_margin.top+sp_margin.bottom)
        //background of graph
        sp_svg.append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill",`${sp_colorBG}`);


        let xAxis = mkYearAxisH(theData);


        let yAxisGDPRate_change = mkGPDAxisH(theData);
        sp_svg.append("g")
            .attr("transform",`translate(0,${sp_height})`)
            .call(d3.axisBottom(yAxisGDPRate_change).ticks(10).tickFormat(d3.format(".2e")));




        //Add Y Axis
        let yAxisRate_change = mkMFAxisH(theData);

        sp_svg.append("g")
            .attr("transform",`translate(${sp_margin.left},0)`)
            .call(d3.axisLeft(yAxisRate_change));

        //Draw DOTS
        sp_svg.append('g')
            .selectAll("dot")
            .data(theData)
            .enter()
            .append("circle")
            .attr("cy", function (d) { return (yAxisRate_change((d.male_height_cm + d.female_height_cm)/2)); } )
            .attr("cx", function (d) { return yAxisGDPRate_change(d.GDP_change_USD); } )
            .attr("r", 3.5)
            .style("fill", sp_colorAVG)

        let extent_x = gdp_change_rate = d3.extent(theData,d=>{
            return yAxisGDPRate_change(d.GDP_change_USD);
        });
        console.log(extent_x)

        let linearRegression = d3.regressionLinear()
            .x(d => {
                return yAxisGDPRate_change(d.GDP_change_USD);
                }
            )
            .y(d => { return (yAxisRate_change((d.male_height_cm + d.female_height_cm)/2));})
            .domain(extent_x)

        let result = linearRegression(theData)

        console.log(result)

        let lineGen_height = d3.line()
            .x(d=>{
                console.log(d[0])
                return d[0]
            })
            .y(d=> d[1])


        //Draw DOTS
        sp_svg.append('g')
            .selectAll("lines")
            .data([result])
            .enter()
            .append("path")
            .attr("d",d=>lineGen_height(d))
            .style("fill","none")
            .style("stroke",sp_colorGDP)
            .style("stroke-width",'3px');


        //Legend
        let legend = sp_svg.append('g')
            .attr("transform","translate(0,50)")
            .selectAll()
            .data([
                    {name:"Avg Height (M & F)"},
                    {name:"Regression Line"},
                    //{name:"Male"},
                    //{name:"Female"},
                ]
            )
            .enter()
            .append("g")
            .attr("transform",(d,i)=>{
                return `translate(${(i*65)+sp_width/2.5},${sp_height})`
            })




        let xAdj = 0;
        const textPadding = 90
        legend.append("text")
            .text(d=>d.name)
            .attr("x",d=> {
                let xtemp = xAdj;
                xAdj = xAdj + textPadding;
                return xtemp;
            })

        xAdj = 0;
        const xTranslate=-20;
        const YTranslate=-15;
        legend.append("circle")
            .attr('width',"10px")
            .attr('height',"2px")
            .attr("transform",d=> {
                let xtemp = xAdj;
                xAdj = xAdj - 93;
                return `translate(${xTranslate-xtemp}, ${YTranslate})`
            })
            .attr('cx',"10px")
            .attr('cy',"10px")
            .attr('r',"5.5px")
            .attr("fill",d=> {
                let color = sp_colorGDP;
                if (d.name==="Male") {
                    color=sp_colorMale;
                } else if (d.name==="Female") {
                    color=sp_colorFemale;
                } else if (d.name==="Avg Height (M & F)") {
                    color=sp_colorAVG;
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
            .text("Male & Female Height (in cm)")

        sp_svg.append("text")
            .attr("transform","rotate(0)")
            .attr("y",sp_height+15)
            .attr("x",(sp_width/2))
            .attr("dy","1em")
            .style("text-anchor","middle")
            .text("GDP in USD")

    });

    function mkYearAxisH(data) {
        let years_extent = d3.extent(data,d=> {
            return d.year
        });
        let axisScale = d3.scaleLinear()
            .domain(years_extent)
            .range([sp_margin.left,sp_width]);
        return axisScale;
    }

    function mkMFAxisH(data) {
        let mf_change_rate = []

        // (d.male_height_cm + d.female_height_cm)/2)

        //
        // for (let i = 0; i < data.length; ++i) {
        //     mf_change_rate.push(data[i].male_height_cm);
        //     mf_change_rate.push(data[i].female_height_cm);
        // }


        for (let i = 0; i < data.length; ++i) {
            mf_change_rate.push((data[i].male_height_cm + data[i].female_height_cm)/2);
        }

        let joint_extent = d3.extent(mf_change_rate);
        let axisScale = d3.scaleLinear()
            .domain(joint_extent)
            .range([sp_height,sp_margin.top]);

        return axisScale;



    }

    function mkGPDAxisH(data) {
        let gdp_change_rate = d3.extent(data,d=>{
            return d.GDP_change_USD;
        });
        let axisScale = d3.scaleLinear()
            .domain(gdp_change_rate)
            .range([sp_margin.left,sp_width]);
        return axisScale;
    }
}