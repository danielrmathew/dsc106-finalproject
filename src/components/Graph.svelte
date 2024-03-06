<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import * as d3 from 'd3';
    import Polynomial from 'polynomial';
    import { validPolyAvail, polyFunction } from '../lib/store.js'
    import * as math from 'mathjs';
    import { parse } from 'svelte/compiler';
    
    let poly;

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
        var SVG = d3.select("#graph")
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

                // first derivative using math.js
                
                const math_first = math.string(math.derivative(poly, 'x'));
                parser.evaluate(`g(x) = ${math_first}`);

                const math_second = math.string(math.derivative(math_first, 'x'));
                parser.evaluate(`h(x) = ${math_second}`);
                
                const polyFunc = new Polynomial(poly);

                const first_derivative = polyFunc.derive(1);
                // console.log('First Derivative: ' + first_derivative);

                const second_derivative = first_derivative.derive(1);
                // console.log('Second Derivative: ' + second_derivative);

                const xValues = d3.range(-10, 11, 0.1);
                // const polyData = xValues.map(x => ({ [x]: polyFunc.eval(x) }));
                const polyData = xValues.map(x => ({ [x]: parser.evaluate(`f(${x})`) }));
                // console.log('example x= ' + xExample, ' y = ' + polyFunc.eval(xExample));

                const polyLine = d3.line()
                    .x(d => x(Object.keys(d)[0]))
                    .y(d => y(Object.values(d)[0]))
                    .curve(d3.curveMonotoneX);


                SVG.append("path")
                    .datum(polyData)
                    .attr("clip-path", "url(#clip)")
                    .attr("fill", "none")
                    .attr("stroke", "red")
                    .attr("stroke-width", 2)
                    .attr("class", "poly-line")
                    .attr("d", polyLine);

                var totalLength = SVG.select('.poly-line').node().getTotalLength();
                // console.log(totalLength);
                SVG.select('.poly-line')
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .duration(2500)
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0);

                // Add the first derivative line
                // const firstDerivativeData = xValues.map(x => ({ [x]: first_derivative.eval(x) }));
                const firstDerivativeData = xValues.map(x => ({ [x]: parser.evaluate(`g(${x})`) }));
                var firstDerivativeLine = d3.line()
                    .x(d => x(Object.keys(d)[0]))
                    .y(d => y(Object.values(d)[0]))
                    .curve(d3.curveMonotoneX);
                
                SVG.append("path")
                    .datum(firstDerivativeData)
                    .attr("clip-path", "url(#clip)")
                    .attr("fill", "none")
                    .attr("stroke", "blue")
                    .attr("stroke-width", 2)
                    .attr("class", "first-derivative-line")
                    .attr("d", firstDerivativeLine);
                
                var totalLength = SVG.select('.first-derivative-line').node().getTotalLength();
                // console.log(totalLength);
                SVG.select('.first-derivative-line')
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .duration(2500)
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0);
                
                // Add the second derivative line
                // const secondDerivativeData = xValues.map(x => ({ [x]: second_derivative.eval(x) }));
                const secondDerivativeData = xValues.map(x => ({ [x]: parser.evaluate(`h(${x})`) }));
                var secondDerivativeLine = d3.line()
                    .x(d => x(Object.keys(d)[0]))
                    .y(d => y(Object.values(d)[0]))
                    .curve(d3.curveMonotoneX);
                
                SVG.append("path")
                    .datum(secondDerivativeData)
                    .attr("clip-path", "url(#clip)")
                    .attr("fill", "none")
                    .attr("stroke", "green")
                    .attr("stroke-width", 2)
                    .attr("class", "second-derivative-line")
                    .attr("d", secondDerivativeLine);
                
                var totalLength = SVG.select('.second-derivative-line').node().getTotalLength();
                // console.log(totalLength);
                SVG.select('.second-derivative-line')
                    .attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .duration(2500)
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0);
                
                
            } else {
                console.log("if False print here: " + value);
            }
        });

        // A function that updates the chart when the user zoom and thus new boundaries are available
        function updateChart(event) {
        
            // recover the new scale
            const newX = event.transform.rescaleX(x);
            const newY = event.transform.rescaleY(y);
            const x_domain = newX.domain();
            // console.log(newX.domain());
        
            // update axes with these new boundaries
            xAxis.call(d3.axisBottom(newX));
            yAxis.call(d3.axisLeft(newY));

            // update gridlines
            createGridlines(SVG, newX, newY, height, width);
                
            // update line position
            // var polyFunc = new Polynomial(poly);
            const parser = math.parser();
            parser.evaluate(`f(x) = ${poly}`)
            const xValues = d3.range(x_domain[0], x_domain[1]+1, 0.1);
            const polyData = xValues.map(x => ({ [x]: parser.evaluate(`f(${x})`) }));

            var polyLine = d3.line()
                .x(d => newX(Object.keys(d)[0]))
                .y(d => newY(Object.values(d)[0]))
                .curve(d3.curveMonotoneX);

            // Select and update the existing polynomial line
            SVG.select('.poly-line')
                .datum(polyData)
                .attr("stroke-dasharray", 0)
                .attr("d", polyLine);
            
            // Update the first and second derivative lines
            const math_first = math.string(math.derivative(poly, 'x'));
            parser.evaluate(`g(x) = ${math_first}`);

            const math_second = math.string(math.derivative(math_first, 'x'));
            parser.evaluate(`h(x) = ${math_second}`);
            // const first_derivative = polyFunc.derive(1);
            
            const firstDerivativeData = xValues.map(x => ({ [x]: parser.evaluate(`g(${x})`) }));
            const firstDerivativeLine = d3.line()
                .x(d => newX(Object.keys(d)[0]))
                .y(d => newY(Object.values(d)[0]))
                .curve(d3.curveMonotoneX);
            
            SVG.select('.first-derivative-line')
                .datum(firstDerivativeData)
                .attr("stroke-dasharray", 0)
                .attr("d", firstDerivativeLine);
            
            // Update the second derivative line
            // const second_derivative = first_derivative.derive(1);
            const secondDerivativeData = xValues.map(x => ({ [x]: parser.evaluate(`h(${x})`) }));
            const secondDerivativeLine = d3.line()
                .x(d => newX(Object.keys(d)[0]))
                .y(d => newY(Object.values(d)[0]))
                .curve(d3.curveMonotoneX);
            
            SVG.select('.second-derivative-line')
                .datum(secondDerivativeData)
                .attr("stroke-dasharray", 0)
                .attr("d", secondDerivativeLine);

        }
        
        // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
        var zoom = d3.zoom()
            .scaleExtent([.0, 20])  // This control how much you can unzoom (x0.0) and zoom (x20)
            .extent([[0, 0], [width, height]])
            .on("zoom", (event) => updateChart(event));
        
        var drag = d3.drag()
            .on("drag", (event) => updateChart(event));
        
        // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
        SVG.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .call(zoom)
            .call(drag)
            ;
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