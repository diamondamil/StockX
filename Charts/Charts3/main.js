
d3.csv('test.csv')
    .then(function(data) {
        // START THEN

        const svg = d3.select('svg');
        const svgContainer = d3.select('#container');

        const margin = 80;
        const width = 1200 - 2 * margin;
        const height = 800 - 2 * margin;

        const chart = svg.append('g')
            .attr('transform', `translate(${margin}, ${margin})`);
        var max = d3.entries(data)
        // sort by value descending
            .sort(function(a, b) { return d3.descending(a.Number_of_Sales, b.Number_of_Sales); })
            // take the first option
            [0];
        console.log(max.value);
        var iMax = parseInt(max.value.Number_of_Sales);
        const xScale = d3.scaleBand()
            .range([0, width])
            .domain(data.map((s) => s.Model))
            .padding(0.3)

        const yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, iMax]);

// vertical grid lines
// const makeXLines = () => d3.axisBottom()
//   .scale(xScale)

        const makeYLines = () => d3.axisLeft()
            .scale(yScale)

        chart.append('g')
            .attr("class", "axis")
            .attr("class", "g1")
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale).ticks(95));

        chart.append('g')
            .attr("class", "g2")
            .call(d3.axisLeft(yScale));

// vertical grid lines
// chart.append('g')
//   .attr('class', 'grid')
//   .attr('transform', `translate(0, ${height})`)
//   .call(makeXLines()
//     .tickSize(-height, 0, 0)
//     .tickFormat('')
//   )

        chart.append('g')
            .attr('class', 'grid')
            .call(makeYLines()
                .tickSize(-width, 0, 0)
                .tickFormat('')
            )

        const barGroups = chart.selectAll()
            .data(data)
            .enter()
            .append('g')

        barGroups
            .append('rect')
            .attr('class', 'bar')
            .attr('x', (g) => xScale(g.Model))
            .attr('y', (g) => yScale(g.Number_of_Sales))
            .attr('height', (g) => height - yScale(g.Number_of_Sales))
            .attr('width', xScale.bandwidth())
            .on('mouseenter', function (actual, i) {
                d3.selectAll('.value')
                    .attr('opacity', 0)

                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr('opacity', 0.6)
                    .attr('x', (a) => xScale(a.Model) - 5)
                    .attr('width', xScale.bandwidth() + 10)

                const y = yScale(actual.Number_of_Sales)

                line = chart.append('line')
                    .attr('id', 'limit')
                    .attr('x1', 0)
                    .attr('y1', y)
                    .attr('x2', width)
                    .attr('y2', y)

                barGroups.append('text')
                    .attr('class', 'divergence')
                    .attr('x', (a) => xScale(a.Model) + xScale.bandwidth() / 2)
                    .attr('y', (a) => yScale(a.Number_of_Sales) + 30)
                    .attr('fill', 'white')
                    .attr('text-anchor', 'middle')
                    .text((a, idx) => {
                        const divergence = (a.Number_of_Sales - actual.Number_of_Sales).toFixed(1)

                        let text = ''
                        if (divergence > 0) text += '+'
                        text += `${divergence}`

                        return idx !== i ? text : '';
                    })

            })
            .on('mouseleave', function () {
                d3.selectAll('.value')
                    .attr('opacity', 1)

                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr('opacity', 1)
                    .attr('x', (a) => xScale(a.Model))
                    .attr('width', xScale.bandwidth())

                chart.selectAll('#limit').remove()
                chart.selectAll('.divergence').remove()
            })

        barGroups
            .append('text')
            .attr('class', 'value')
            .attr('x', (a) => xScale(a.Model) + xScale.bandwidth() / 2)
            .attr('y', (a) => yScale(a.Number_of_Sales) + 30)
            .attr('text-anchor', 'middle')
            ///.text((a) => `${a.Number_of_Sales}%`)

        svg
            .append('text')
            .attr('class', 'label')
            .attr('x', -(height / 2) - margin)
            .attr('y', margin / 2.4)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text('# of Sold Units')

        svg.append('text')
            .attr('class', 'label')
            .attr('x', width / 2 + margin)
            .attr('y', height + margin * 1.7)
            .attr('text-anchor', 'middle')
            .text('Items')

        svg.append('text')
            .attr('class', 'title')
            .attr('x', width / 2 + margin)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text('Sales Record')



        // END THEN

    });

  