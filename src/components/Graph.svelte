<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import * as d3 from 'd3';
    import Polynomial from 'polynomial';
    import { validPolyAvail, polyFunction } from '../lib/store.js'
    // export function updatePoly(poly){
    //     console.log(poly);
    // }


    // const data = [
    //             { x: 10, y: 10},
    //             { x: 5, y: 4 },
    //             { x: 2, y: 3 },
    //             { x: 0, y: 0},
    //             { x: -1, y: -1},   
    //         ];

    // let poly_data = [];
    

    // const domain = d3.range(10)
    // const test_map = {1: 2, 3: 4, 5: 6};
    // for (let poly_x in test_map) {
    //     // console.log(poly_x + " " + test_map[poly_x]);
    // }

    // for (let i = 0; i < domain.length; i++) {
    //     let poly_y;
    //     // for (let j = 0; )

    // }

    // console.log('poly = ' + poly);

    let poly;
    

    onMount(() => {
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = 460 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;
        
        // append the SVG object to the body of the page
        var SVG = d3.select("#graph")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        
        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 8])
            .range([ 0, width ]);
        var xAxis = SVG.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        xAxis
            .append('g')
            .attr('class', 'grid')
            .call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(''));
        
        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, 9])
            .range([ height, 0]);
        var yAxis = SVG.append("g")
            .call(d3.axisLeft(y));

        yAxis
            .append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''));

        // Add gridlines styling
        SVG.selectAll('.grid line')
            .style('stroke', 'lightgrey') //stroke lines
            .style('stroke-opacity', 0.7)
            .style('shape-rendering', 'crispEdges');
        
        // Add a clipPath: everything out of this area won't be drawn.
        var clip = SVG.append("defs").append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
            .attr("width", width )
            .attr("height", height )
            .attr("x", 0)
            .attr("y", 0);

        // Add line
        // var line = d3.line()
        //     .x(function(d) { return x(d.x); })
        //     .y(function(d) { return y(d.y); })
        //     .curve(d3.curveMonotoneX);

        // SVG.append("path")
        //     .datum(data)
        //     .attr("fill", "none")
        //     .attr("stroke", "#61a3a9")
        //     .attr("stroke-width", 2)
        //     .attr("class", "line")
        //     .attr("d", line)
        //     .attr("clip-path", "url(#clip)");

        // add poly line
        const drawPoly = validPolyAvail.subscribe(value => {
            if (value) {
                polyFunction.subscribe(funcVal => {
                    poly = funcVal;
                });
                console.log('Poly String');
                console.log(poly);
                const polyFunc = new Polynomial(poly);
                const xValues = d3.range(10);
                const polyData = xValues.map(x => ({ [x]: polyFunc.eval(x) }));
                console.log('Poly Data:')
                console.log(polyData);
                var xExample = 2;
                console.log('example x= ' + xExample, ' y = ' + polyFunc.eval(xExample));

                var polyLine = d3.line()
                    .x(d => x(Object.keys(d)[0]))
                    .y(d => y(Object.values(d)[0]))
                    .curve(d3.curveMonotoneX);

                SVG.append("path")
                    .datum(polyData)
                    .attr("fill", "none")
                    .attr("stroke", "red")
                    .attr("stroke-width", 2)
                    .attr("class", "poly-line")
                    .attr("d", polyLine);
            } else {
                console.log("if False print here: " + value);
            }
        });
        
        // Apply clip path to the line
        // SVG.select("path").attr("clip-path", "url(#clip)");

        
        // Create the scatter variable: where both the circles and the brush take place
        // var scatter = SVG.append('g')
        //     .attr("clip-path", "url(#clip)")

        // A function that updates the chart when the user zoom and thus new boundaries are available
        function updateChart(event) {
        
            // recover the new scale
            var newX = event.transform.rescaleX(x);
            var newY = event.transform.rescaleY(y);
        
            // update axes with these new boundaries
            xAxis.call(d3.axisBottom(newX));
            yAxis.call(d3.axisLeft(newY));

            // Update gridlines -- tried to
            SVG.selectAll('.grid line')
                .attr('x1', newX.range()[0])
                .attr('x2', newX.range()[1])
                .attr('y1', newY.range()[0])
                .attr('y2', newY.range()[1]);
            
            // update line position
            var newLine = d3.line()
                .x(function(d) { return newX(d.x); })
                .y(function(d) { return newY(d.y); })
                .curve(d3.curveMonotoneX);

            SVG.select('.line')
                .attr("d", newLine);

        }
        
        // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
        var zoom = d3.zoom()
            .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
            .extent([[0, 0], [width, height]])
            .on("zoom", (event) => updateChart(event));
        
        // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
        SVG.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom);
        // now the user can zoom and it will trigger the function called updateChart
            
        // return () => unsubscribe();
    }) 
    
</script>

<main>
    <script src="https://d3js.org/d3.v4.js"></script>
    <div id="graph"></div>
</main> 
  
<style>
    main {
        position: relative;
        width: 100%;
        height: 100%;
        padding-top: 5%;
        padding-bottom: 5%
    }

</style> 