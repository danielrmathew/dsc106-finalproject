<script>
    import { onMount } from 'svelte';
    import * as d3 from 'd3';
    // import { validPolyAvail, polyFunction } from '../lib/store.js'
    import * as math from 'mathjs';
    
    let poly;
    var valueTooltip;
    var drawFunction;

    function validatePoly() {
        if (isValidPolynomial(poly)) {
            console.log('Valid polynomial');
            drawFunction(poly);
        } else {
            console.log('Invalid polynomial');
        }
    }

    function isValidPolynomial(str) {
        try {
            const parser = math.parser();
            parser.evaluate(`t(x) = ${poly}`)
            parser.evaluate('t(0)')
        } catch {
            return false;
        }
        return true;
    }

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
                .style('stroke', 'grey') //stroke lines
                .style('stroke-opacity', .5)
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
            .domain([-10, 10])
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

        drawFunction = (poly) => {
            console.log(poly);
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

            const xValues = d3.range(-10, 11, 0.1);
            const polyData = xValues.map(x => ({ [x]: parser.evaluate(`f(${x})`) }));

            const polyLine = d3.line()
                .x(d => x(Object.keys(d)[0]))
                .y(d => y(Object.values(d)[0]))
                .curve(d3.curveMonotoneX);

            d3.selectAll('.tooltip, .poly-line, .invisible-trigger, .invisible-trigger2, .invisible-trigger3, .first-derivative-line, .second-derivative-line').remove();
            
            xAxis.call(d3.axisBottom(x));
            yAxis.call(d3.axisLeft(y));

            // TOOL TIP
            var tooltip = d3.select("#tooltip")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .attr("id", "line-name")
                .style("background-color", "white")
                .style("border", "solid")
                .style("width", "100px")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px");
            
            // tooltip explaining function's significance
            // var tooltipText = d3.select("#tooltip-text")
            //     .append("div")
            //     .style("opacity", 0)
            //     .attr("class", "tooltip")
            //     .style("background-color", "white")
            //     .style("border", "solid")
            //     .style("width", "350px")
            //     .style("right", "0px")
            //     .style("border-width", "2px")
            //     .style("border-radius", "5px")
            //     .style("padding", "5px");

            valueTooltip = d3.select("#tooltip")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .attr("id", "line-value")
                .style("background-color", "white")
                .style("border", "solid")
                .style("width", "100px")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")


            function showTooltip(event, lineName) {
                // console.log('showing tooltip');
                const [x, y] = d3.pointer(event);
                tooltip.transition().duration(100).style("opacity", 0.9);
                tooltip.html(`<strong>${lineName}</strong>`)
                    .style("left", (x + 10) + "px")
                    .style("top", (y - 20) + "px");
            }

            function showValueTooltip(event, xScale, yScale, valueTooltip) {
                const [xPointer, yPointer] = d3.pointer(event);
                const xValue = xScale.invert(xPointer);
                const yValue = yScale.invert(yPointer);
                valueTooltip.transition().duration(100).style("opacity", 0.9);
                valueTooltip.html(`<strong>X:</strong> ${xValue.toFixed(2)}<br><strong>Y:</strong> ${yValue.toFixed(2)}`)
                    .style("left", (x + 10) + "px")
                    .style("top", (y - 20) + "px");
            }

            // function showSignificanceTooltip(event, lineName) {
            //     console.log('showing tooltip');
            //     const [x, y] = d3.pointer(event);
            //     tooltipText.transition().duration(200).style("opacity", 0.9);

            //     if (lineName == 'f(x)') {
            //         tooltipText.html(`<p>This line is f(x).
            //             \nIt represents your original function. Depending on the scenario,
            //             it can describe a variety of different systems.\n
            //             The position of a car on a track at a given time.\n
            //             The amount of money in a bank account.\n
            //             The height of a rocket at a given time.\n</p>`)
            //             .style("left", (x + 10) + "px")
            //             .style("top", (y - 20) + "px");
            //     }

            //     else if (lineName == "f'(x)") {
            //         tooltipText.html(`<p>This line is f'(x).
            //             \nIt represents the CHANGE of your original function.\n
            //             If f(x) represents the position of a car on a track at a given time,
            //             f'(x) would represent the car's velocity at that time.\n
            //             </p>`)
            //             .style("left", (x + 10) + "px")
            //             .style("top", (y - 20) + "px");
            //         }
                
            //     else if (lineName == "f''(x)") {
            //         tooltipText.html(`<p>This line is f''(x).
            //             \nIt represents the CHANGE of the CHANGE of your original function.\n
            //             If f(x) represents the position of a car on a track at a given time,
            //             f''(x) would represent the car's acceleration at that time.\n
            //             </p>`)
            //             .style("left", (x + 10) + "px")
            //             .style("top", (y - 20) + "px");
            //         }
            //     }
            

            function hideTooltip() {
                tooltip.transition().duration(200).style("opacity", 0);
            }

            // function hideSignificanceTooltip() {
            //     tooltipText.transition().duration(200).style("opacity", 0);
            // }

            function hideValueTooltip() {
                valueTooltip.transition().duration(200).style("opacity", 0);
            }

            // Add invisible line for tooltip
            SVG.append("path")
                .datum(polyData)
                .attr("class", "invisible-trigger")
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 20)
                .attr("opacity", 0)
                .attr("d", polyLine)
                .on("mouseover", (event, d) => {
                    showTooltip(event, "f(x)");
                    // showSignificanceTooltip(event, "f(x)");
                })
                .on("mousemove", (event, d) => showValueTooltip(event, x, y, valueTooltip))
                .on("mouseout", () => {
                    hideTooltip();
                    hideValueTooltip();
                    // hideSignificanceTooltip();
                });

            SVG.append("path")
                .datum(polyData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 3)
                .attr("class", "poly-line")
                .attr("d", polyLine)
                .on("mouseover", (event, d) => {
                    showTooltip(event, "f(x)");
                    // showSignificanceTooltip(event, "f(x)");
                })
                .on("mousemove", (event, d) => showValueTooltip(event, x, y, valueTooltip))
                .on("mouseout", () => {
                    hideTooltip();
                    hideValueTooltip();
                    // hideSignificanceTooltip();
                });


            var totalLength = SVG.select('.poly-line').node().getTotalLength();
            SVG.select('.poly-line')
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2500)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);

            // Add the first derivative line
            const firstDerivativeData = xValues.map(x => ({ [x]: parser.evaluate(`g(${x})`) }));
            var firstDerivativeLine = d3.line()
                .x(d => x(Object.keys(d)[0]))
                .y(d => y(Object.values(d)[0]))
                .curve(d3.curveMonotoneX);

            // Add invisible first derivative line for tooltip
            SVG.append("path")
                .datum(firstDerivativeData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", 20)
                .attr("opacity", 0)
                .attr("class", "invisible-trigger2")
                .attr("d", firstDerivativeLine)
                .on("mouseover", (event, d) => {
                    showTooltip(event, "f'(x)");
                    // showSignificanceTooltip(event, "f'(x)");
                })
                .on("mousemove", (event, d) => showValueTooltip(event, x, y, valueTooltip))
                .on("mouseout", () => {
                    hideTooltip();
                    hideValueTooltip();
                    // hideSignificanceTooltip();
                });
            
            SVG.append("path")
                .datum(firstDerivativeData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "blue")
                .attr("stroke-width", 3)
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

            // Add invisible second derivative line for tooltip
            SVG.append("path")
                .datum(secondDerivativeData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("opacity", 0)
                .attr("stroke-width", 20)
                .attr("class", "invisible-trigger3")
                .attr("d", secondDerivativeLine)
                .on("mouseover", (event, d) => {
                    showTooltip(event, "f''(x)");
                    // showSignificanceTooltip(event, "f''(x)");
                })
                .on("mousemove", (event, d) => showValueTooltip(event, x, y, valueTooltip))
                .on("mouseout", () => {
                    hideTooltip();
                    hideValueTooltip();
                    // hideSignificanceTooltip();
                });
            
            SVG.append("path")
                .datum(secondDerivativeData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("stroke-width", 3)
                .attr("class", "second-derivative-line")
                .attr("d", secondDerivativeLine)
                .on("mouseover", (event, d) => {
                    showTooltip(event, "f''(x)");
                    // showSignificanceTooltip(event, "f''(x)");
                })
                .on("mousemove", (event, d) => showValueTooltip(event, x, y, valueTooltip))
                .on("mouseout", () => {
                    hideTooltip();
                    hideValueTooltip();
                    // hideSignificanceTooltip();
                });
            
            var totalLength = SVG.select('.second-derivative-line').node().getTotalLength();
            // console.log(totalLength);
            SVG.select('.second-derivative-line')
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(2500)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);  
        };

        // A function that updates the chart when the user zoom and thus new boundaries are available
        function updateChart(event) {
            function showValueTooltip(event, xScale, yScale) {
                const [xPointer, yPointer] = d3.pointer(event);
                const xValue = xScale.invert(xPointer);
                const yValue = yScale.invert(yPointer);
                valueTooltip.transition().duration(100).style("opacity", 0.9);
                valueTooltip.html(`<strong>X:</strong> ${xValue.toFixed(2)}<br><strong>Y:</strong> ${yValue.toFixed(2)}`);
            }
        
            // recover the new scale
            const newX = event.transform.rescaleX(x);
            const newY = event.transform.rescaleY(y);
            const x_domain = newX.domain();
        
            // update axes with these new boundaries
            xAxis.call(d3.axisBottom(newX));
            yAxis.call(d3.axisLeft(newY));

            // update gridlines
            createGridlines(SVG, newX, newY, height, width);
                
            // update line position
            const parser = math.parser();
            parser.evaluate(`f(x) = ${poly}`)
            const xValues = d3.range(x_domain[0], x_domain[1]+1, 0.1);
            const polyData = xValues.map(x => ({ [x]: parser.evaluate(`f(${x})`) }));

            var polyLine = d3.line()
                .x(d => newX(Object.keys(d)[0]))
                .y(d => newY(Object.values(d)[0]))
                .curve(d3.curveMonotoneX);
            
            var invisibleTriggerLine = d3.line()
                .x(d => newX(Object.keys(d)[0]))
                .y(d => newY(Object.values(d)[0]))
                .curve(d3.curveMonotoneX);

            // Select and update the existing polynomial line
            SVG.select('.poly-line')
                .datum(polyData)
                .attr("stroke-dasharray", 0)
                .attr("d", polyLine)
                .on("mousemove", (event, d) => showValueTooltip(event, newX, newY));
            
            SVG.select('.invisible-trigger')
                .datum(polyData)
                .attr("stroke-dasharray", 0)
                .attr("d", invisibleTriggerLine)
                .on("mousemove", (event, d) => showValueTooltip(event, newX, newY));
            
                // Update the first and second derivative lines
                const math_first = math.string(math.derivative(poly, 'x'));
                parser.evaluate(`g(x) = ${math_first}`);

                const math_second = math.string(math.derivative(math_first, 'x'));
                parser.evaluate(`h(x) = ${math_second}`);
                
                const firstDerivativeData = xValues.map(x => ({ [x]: parser.evaluate(`g(${x})`) }));
                const firstDerivativeLine = d3.line()
                    .x(d => newX(Object.keys(d)[0]))
                    .y(d => newY(Object.values(d)[0]))
                    .curve(d3.curveMonotoneX);
                
                const invisibleTriggerLine2 = d3.line()
                    .x(d => newX(Object.keys(d)[0]))
                    .y(d => newY(Object.values(d)[0]))
                    .curve(d3.curveMonotoneX);
                
                SVG.select('.first-derivative-line')
                    .datum(firstDerivativeData)
                    .attr("stroke-dasharray", 0)
                    .attr("d", firstDerivativeLine)
                    .on("mousemove", (event, d) => showValueTooltip(event, newX, newY));
                
                SVG.select('.invisible-trigger2')
                    .datum(firstDerivativeData)
                    .attr("stroke-dasharray", 0)
                    .attr("d", invisibleTriggerLine2)
                    .on("mousemove", (event, d) => showValueTooltip(event, newX, newY));
                
                // Update the second derivative line
                const secondDerivativeData = xValues.map(x => ({ [x]: parser.evaluate(`h(${x})`) }));
                const secondDerivativeLine = d3.line()
                    .x(d => newX(Object.keys(d)[0]))
                    .y(d => newY(Object.values(d)[0]))
                    .curve(d3.curveMonotoneX);
                
                const invisibleTriggerLine3 = d3.line()
                    .x(d => newX(Object.keys(d)[0]))
                    .y(d => newY(Object.values(d)[0]))
                    .curve(d3.curveMonotoneX);
                
                SVG.select('.second-derivative-line')
                    .datum(secondDerivativeData)
                    .attr("stroke-dasharray", 0)
                    .attr("d", secondDerivativeLine)
                    .on("mousemove", (event, d) => showValueTooltip(event, newX, newY));
                
                SVG.select('.invisible-trigger3')
                    .datum(secondDerivativeData)
                    .attr("stroke-dasharray", 0)
                    .attr("d", invisibleTriggerLine3)
                    .on("mousemove", (event, d) => showValueTooltip(event, newX, newY));
            }
        
        // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
        var zoom = d3.zoom()
            .scaleExtent([0.5, 20])  
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
    })
    
</script>

<main>
    <script src="https://d3js.org/d3.v4.js"></script>
    <div id="intro-div">
        <span style="font-size: 30px; font-family: Indie Flower">Input your favorite</span> <span style="font-size: 15px; font-family: Indie Flower"> (single variable)</span> <span style="font-size: 30px; font-family: Indie Flower"> function!</span>
        <div class = 'input_container'>
          <p id='yequals'>f(x) =</p>
          <input style='height: 30px; font-family: Indie Flower' id="input" bind:value={poly} type="text" placeholder="i.e. 1/2x^2" />
          <button style='transform: translate(5px, 5px); font-family: Indie Flower' on:click={validatePoly} type="submit">Enter</button>
        </div>
    </div>
    <div id="graph-container">
        <div id="graph"></div>
        <div id="tooltip"></div>
    </div>
    <!-- <div id="tooltip-text"></div> -->
</main> 
  
<style>
     @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
    }
/* 
    #tooltip-text {
        position: absolute;
        top: 15%;
        font-family: "Indie Flower", cursive;
    } */

    #intro-div {
        margin-top: 20px;
    }

    .input_container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    

    #yequals {
        font-size: 30px;
        font-family: "Indie Flower", cursive;
        position: relative;
        right: 10px;
        transform: translate(0px, 4px)
    }

    #input {
        margin-top: 10px;
    }

    #input {
        height:60px;
        font-size:22pt;
    }

    #graph-container {
        position: relative;
    }

    #tooltip {
        position: absolute;
        left: calc(100% + 20px); /* Adjust the value as needed for proper spacing */
        top: 0;
    }
    
</style> 