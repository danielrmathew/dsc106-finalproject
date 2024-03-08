<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import * as d3 from 'd3';
    import Polynomial from 'polynomial';
    // import { validPolyAvail, polyFunction } from '../lib/store.js'
    import * as math from 'mathjs';
    import { parse } from 'svelte/compiler';
    import { global_stock_page } from '../lib/store.js'
    
    let poly = '3x^3 + 1/2 (1 - x) - 2/3 x^5 - sin(x)';

    let curr_stock_page;
    let draw_first_page;
    let draw_second_page;
    let draw_third_page;
    let draw_fourth_page;
    let reset_to_first_page;

    $: {
            global_stock_page.subscribe(funcVal => {
                    curr_stock_page = funcVal;
            });
            console.log('Reactive update', curr_stock_page);
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
                .style('stroke', 'lightgrey') //stroke lines
                .style('stroke-opacity', 0.7)
                .style('shape-rendering', 'crispEdges');
        }

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = (window.innerWidth / 1.5) - margin.left - margin.right,
            height = (window.innerHeight / 1.5) - margin.top - margin.bottom;
        
        // append the SVG object to the body of the page
        var SVG = d3.select("#StockGraph")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        
        // Add X axis
        var x = d3.scaleLinear()
            .domain([-5, 5])
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
        
        
        const parser = math.parser();
        // parser.evaluate(poly);
        parser.evaluate(`f(x) = ${poly}`);

        const math_first = math.string(math.derivative(poly, 'x'));
        parser.evaluate(`g(x) = ${math_first}`);

        const math_second = math.string(math.derivative(math_first, 'x'));
        parser.evaluate(`h(x) = ${math_second}`);
        
        const polyFunc = new Polynomial(poly);

        const first_derivative = polyFunc.derive(1);
        console.log('First Derivative: ' + first_derivative);

        const second_derivative = first_derivative.derive(1);
        console.log('Second Derivative: ' + second_derivative);

        const xValues = d3.range(-5, 5.1, 0.1);

        const polyData = xValues.map(x => ({ [x]: parser.evaluate(`f(${x})`) }));
        const polyLine = d3.line()
            .x(d => x(Object.keys(d)[0]))
            .y(d => y(Object.values(d)[0]))
            .curve(d3.curveMonotoneX);

        const firstDerivativeData = xValues.map(x => ({ [x]: parser.evaluate(`g(${x})`) }));
        const firstDerivativeLine = d3.line()
            .x(d => x(Object.keys(d)[0]))
            .y(d => y(Object.values(d)[0]))
            .curve(d3.curveMonotoneX);

        const secondDerivativeData = xValues.map(x => ({ [x]: parser.evaluate(`h(${x})`) }));
        const secondDerivativeLine = d3.line()
            .x(d => x(Object.keys(d)[0]))
            .y(d => y(Object.values(d)[0]))
            .curve(d3.curveMonotoneX);

        // TOOL TIP
        var tooltip = d3.select("#StockGraph")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("width", "100px")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");
        
        // tooltip explaining function's significance
        var tooltipText = d3.select("#tooltip-text")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("width", "350px")
            .style("right", "0px")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px");

        var valueTooltip = d3.select("#StockGraph")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .style("width", "100px")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")


        function showTooltip(event, lineName) {
            console.log('showing tooltip');
            const [x, y] = d3.pointer(event);
            tooltip.transition().duration(200).style("opacity", 0.9);
            tooltip.html(`<strong>${lineName}</strong>`)
                .style("left", (x + 10) + "px")
                .style("top", (y - 20) + "px");
        }

        function showSignificanceTooltip(event, lineName) {
            console.log('showing tooltip');
            const [x, y] = d3.pointer(event);
            tooltipText.transition().duration(200).style("opacity", 0.9);

            if (lineName == 'f(x)') {
                //console.log('Got here') // gets here
                tooltipText.html(`<p>This line depicts what a potential stock's (lets call it Company X) growth and decline can look like\n
                    We can see by the annotations the highs and lows of Company X -- we would consider these to be the lcoal mins and maxes \n
                    of the company's stock./p>`)
                    .style("left", (x + 10) + "px")
                    .style("top", (y - 20) + "px");
            }

            else if (lineName == "f'(x)") {
                tooltipText.html(`<p>This line is f'(x).
                    \nIt represents the CHANGE of your original function.\n
                    If f(x) represents the position of a car on a track at a given time,
                    f'(x) would represent the car's velocity at that time.\n
                    </p>`)
                    .style("left", (x + 10) + "px")
                    .style("top", (y - 20) + "px");
                }
            
            else if (lineName == "f''(x)") {
                tooltipText.html(`<p>This line is f''(x).
                    \nIt represents the CHANGE of the CHANGE of your original function.\n
                    If f(x) represents the position of a car on a track at a given time,
                    f''(x) would represent the car's acceleration at that time.\n
                    </p>`)
                    .style("left", (x + 10) + "px")
                    .style("top", (y - 20) + "px");
                }
            }
        

        function hideTooltip() {
            tooltip.transition().duration(200).style("opacity", 0);
        }

        function hideSignificanceTooltip() {
            tooltipText.transition().duration(200).style("opacity", 0);
        }

        draw_first_page = () => {
            SVG.append("path")
                    .datum(polyData)
                    .attr("clip-path", "url(#clip)")
                    .attr("fill", "none")
                    .attr("stroke", "orange")
                    .attr("class", "poly-line")
                    .attr("stroke-width", 3)
                    .attr("d", polyLine)
                    .on("mouseover", (event, d) => {
                        // showTooltip(event, "f(x)");
                        showSignificanceTooltip(event, "f(x)");
                    })
                    .on("mousemove", (event, d) => showSignificanceTooltip(event, 'f(x)'))
                    .on("mouseout", () => {
                        // hideTooltip();
                        hideSignificanceTooltip();
                    });
                
        // animate the line drawing
        var totalLength = SVG.select('.poly-line').node().getTotalLength();
        // console.log(totalLength);
        SVG.select('.poly-line')
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
            .duration(2500)
            .ease(d3.easeLinear)
            .attr("stroke-dashoffset", 0);
        }        

        draw_second_page = () => {
            // Add first derivative line to graph
            SVG.append("path")
                .datum(firstDerivativeData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "aqua")
                .attr("class", "first-derivative-line")
                .attr("stroke-width", 3)
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

            SVG.selectAll('.poly-line').attr("opacity", 0);
        }

        draw_third_page = () => {
            // Add second derivative line to graph
            SVG.append("path")
                .datum(secondDerivativeData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "lightgreen")
                .attr("class", "second-derivative-line")
                .attr("stroke-width", 3)
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
            
            SVG.selectAll('.first-derivative-line').attr("opacity", 0);
        }

        draw_fourth_page = () => {
            SVG.selectAll('.poly-line').transition().duration(2500).ease(d3.easeLinear).attr("opacity", 1);
            SVG.selectAll('.first-derivative-line').transition().duration(2500).ease(d3.easeLinear).attr("opacity", 1);
        }

        reset_to_first_page = () => {
            SVG.selectAll('.poly-line').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);
            SVG.selectAll('.first-derivative-line').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);
            SVG.selectAll('.second-derivative-line').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);
        }
    });

    $ : {
        console.log('Reactive update 2', curr_stock_page);
        drawPages();
    }

    var reset = false;
    function drawPages() {

        if (reset & curr_stock_page == 1) {
            reset_to_first_page();
        }

        else if (curr_stock_page == 2) {
            console.log('Drawing first page');
            draw_first_page();
        }
        else if (curr_stock_page == 3) {
            console.log('Drawing second page');
            draw_second_page();
        }
        else if (curr_stock_page == 4) {
            console.log('Drawing third page');
            draw_third_page();
        }
        else if (curr_stock_page == 5){
            console.log('Drawing fourth page');
            draw_fourth_page();
            reset = true;
        }
    }

</script>

<main>
    <script src="https://d3js.org/d3.v4.js"></script>
    <div id="StockGraph"></div>
    <div id="tooltip-text"></div>
</main> 
  
<style>
    main {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 5%;
        padding-bottom: 5%
    }

    #tooltip-text {
        position: absolute;
        top: 15%;
    }
</style> 