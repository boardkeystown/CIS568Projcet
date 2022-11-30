
function mkLegend(idselector = "") {
    if (idselector === "") return;

    let _data_source_rate_change_per_country = "https://raw.githubusercontent.com/boardkeystown/CIS568Project/main/data/avg_rate_change_per_country_gdp.csv";
    //SCALE TEST
    Promise.all([
        d3.csv(_data_source_rate_change_per_country, d => (
            {
                country_code_alpha2: d['code_alpha2'],
                change_rate_male: Number(d['change_rate_male']),
                change_rate_female: Number(d['change_rate_female']),
                change_rate_avg: Number(d['change_rate_avg']),
            }
        ))

    ]).then(data => {

        let csvData_rates = data[0]

        // console.log(csvData_rates)
        let svg =  d3.selectAll(idselector)
            .append("svg")
            .attr("height", 150);

        let width = 200

        let first = d3.extent(csvData_rates, d => d.change_rate_male)[0]
        let last = d3.extent(csvData_rates, d => d.change_rate_male)[1]


        console.log(first)
        console.log(last)

        function mkColorListRec(l, f, d) {
            let list = [];
            console.log(f)
            while (f > l) {
                list.push(l)
                l += d;
            }
            return list;
        }

        let colorList = mkColorListRec(first, last, 1)

        console.log(colorList)

        let colorScale = d3.scaleLinear()
            .domain([first, last])
            .range(d3.quantize(d3.interpolateHcl("#be0000", "#00ff15"), 2));

        let legend = svg.selectAll('g')
            .data(colorList)
            .enter()
            .append('g')
            .attr('class', 'legend');


        legend.append('rect')
            .attr('x', width)
            .attr('y', function (d, i) {
                return i * 11;
            })
            .attr('width', 10)
            .attr('height', 10)
            .style('fill', function (d) {
                return colorScale(d);
            });

        legend.append('text')
            .attr('x', width - 150)
            .attr('y', 10)
            .text('Male Height (-) Rate Of Change')
            .attr("font-size", "10px")
            .attr("fill", "#fffff0")

        legend.append('text')
            .attr('x', width - 150)
            .attr('y', 11 * colorList.length - 2)
            .text('Male Height (+) Rate Of Change')
            .attr("font-size", "10px")
            .attr("fill", "#fffff0")

        // legend.append('text')
        //     .attr('x', width - 8)
        //     .attr('y', function(d, i){ return (i *  20) + 9;})
        //     .text(function(d){ return d.index; });


    })
}
