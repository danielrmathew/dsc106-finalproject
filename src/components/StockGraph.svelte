<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import * as d3 from 'd3';
    import Polynomial from 'polynomial';
    import { validPolyAvail, polyFunction } from '../lib/store.js'
    import * as math from 'mathjs';
    import { parse } from 'svelte/compiler';
    
    let poly = 'abs((10/(1+x)) * sin(2x))';

    onMount(() => {

        function createGridlines(SVG, x, y, height, width) {

            SVG.selectAll('.grid').remove();

            // Add horizontal gridlines
            SVG.append('g')
                .attr('class', 'grid')
                .attr('transform', 'translate(0,' + height + ')')   
                .call(d3.axisBottom(x).ticks(5).tickSize(-height).tickFormat(''));

            // Add vertical gridlines
            SVG.append('g')
                .attr('class', 'grid')
                .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''));
            
            // Add gridlines styling
            SVG.selectAll('.grid line')
                .style('stroke', 'lightgrey') //stroke lines
                .style('stroke-opacity', 0.7)
                .style('shape-rendering', 'crispEdges');
        }

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = (window.innerWidth / 1.5) - margin.left - margin.right,
            height = (window.innerHeight / 1.5) - margin.top - margin.bottom;
        
        // append the SVG object to the body of the page
        var SVG = d3.select("#BallGraph")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        
        // Add X axis
        var x = d3.scaleLinear()
            .domain([-10, 10])
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
            .domain([-20, 20])
            .range([ height, 0]);
        var yAxis = SVG.append("g")
            .call(d3.axisLeft(y));

        yAxis
            .append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(''));

        // Add gridlines styling
        createGridlines(SVG, x, y, height, width);
        
        // Add a clipPath: everything out of this area won't be drawn.
        var clip = SVG.append("defs").append("SVG:clipPath")
            .attr("id", "clip")
            .append("SVG:rect")
            .attr("width", width )
            .attr("height", height )
            .attr("x", 0)
            .attr("y", 0);


        // add poly line
        const drawPoly = validPolyAvail.subscribe(value => {
            if (value) {
                polyFunction.subscribe(funcVal => {
                    poly = funcVal;
                });
                
                // testing math.js
                const parser = math.parser();
                // parser.evaluate(poly);
                parser.evaluate(`f(x) = ${poly}`);

                // throws an error if a function is undefined or if the syntax throws an error
                // can use a try catch block to check for input error instead of what we have rn
                // console.log(parser.evaluate("si(2)"));                

                const xValues = d3.range(0, 21, 0.1);
                // const polyData = xValues.map(x => ({ [x]: polyFunc.eval(x) }));
                const polyData = xValues.map(x => ({ [x]: parser.evaluate(`f(${x})`) }));
                // console.log('example x= ' + xExample, ' y = ' + polyFunc.eval(xExample));

                const polyLine = d3.line()
                    .x(d => x(Object.keys(d)[0]))
                    .y(d => y(Object.values(d)[0]))
                    .curve(d3.curveMonotoneX);


                // Add invisible line for tooltip
                SVG.append("path")
                    .datum(polyData)
                    .attr("clip-path", "url(#clip)")
                    .attr("fill", "orange")
                    .attr("stroke", "red")
                    .attr("stroke-width", 12)
                    .attr("opacity", 0)
                    .attr("class", "invisible-trigger")
                    .attr("d", polyLine);
       
            } else {
                console.log("if False print here: " + value);
            }

        });
    })
    
</script>

<main>
    <script src="https://d3js.org/d3.v4.js"></script>
    <div id="BallGraph"></div>
</main> 
  
<style>
    /* main {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding-top: 5%;
        padding-bottom: 5%
    } */
</style> 