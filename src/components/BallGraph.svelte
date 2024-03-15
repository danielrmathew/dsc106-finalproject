<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import * as d3 from 'd3';
    import Polynomial from 'polynomial';
    // import { validPolyAvail, polyFunction } from '../lib/store.js'
    import * as math from 'mathjs';
    import { parse } from 'svelte/compiler';
    import { global_basketball_page } from '../lib/store.js'
    
    let poly = 'abs((10/(1+x)) * sin(2x))';

    let curr_basketball_page;
    let draw_first_page;
    let draw_second_page;
    let draw_third_page;
    let draw_fourth_page;
    let reset_to_first_page;

    $: {
            global_basketball_page.subscribe(funcVal => {
                    curr_basketball_page = funcVal;
            });
            console.log('Reactive update', curr_basketball_page);
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
        var SVG = d3.select("#BallGraph")
            .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
            .append("g")
              .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        
        // Add X axis
        var x = d3.scaleLinear()
            .domain([0, 20])
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

        const xValues = d3.range(0.01, 20, 0.1);

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
        
        d3.select("#annotation").html("This is a graph of a basketball bouncing up and down. The x-axis represents time, and the y-axis represents the height of the basketball. The basketball starts at a height of 10, and bounces up and down with a period of 2.5 seconds. The graph is a sinusoidal function, and the basketball will eventually stop bouncing.")

        draw_first_page = () => {
            SVG.append("path")
                    .datum(polyData)
                    .attr("clip-path", "url(#clip)")
                    .attr("fill", "none")
                    .attr("stroke", "orange")
                    .attr("class", "poly-line")
                    .attr("stroke-width", 3)
                    .attr("d", polyLine);

            d3.select("#annotation").html("This is the <em>position</em> of the basketball. You can see it bouncing up and down, slowly losing height until it eventually stops bouncing.");
            
            // max line
            const exLines = d3.line()
                .x(d => x(Object.keys(d)[0]))
                .y(d => y(Object.values(d)[0]))
                .curve(d3.curveMonotoneX);
            const xMax = d3.range(0, 1.5, 0.1); 
            const maxData = xMax.map(x => ({ [x]: 5.842 }));

            SVG.append("path")
                .datum(maxData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "gold")
                .attr("class", "poly-line")
                .attr("id", "max-line")
                .attr("stroke-width", 5)
                .attr("stroke-dasharray", "10,5")
                .attr("d", exLines);

            const maxLine = d3.select("#max-line");
            const maxBox = maxLine.node().getBBox();

            SVG.append('text')
                .attr("x", maxBox.x + maxBox.width + 5) 
                .attr("y", maxBox.y + maxBox.height / 2) 
                .attr("text-anchor", "start")
                .attr("dy", 0) // Adjust the vertical position as needed
                .attr("dx", 0) // Adjust the horizontal position as needed
                .text('Local Maxima')
                .style("fill", "black")
                .style("font-size", "medium") 
                .style("font-family", "ui-monospace") 
                .style("font-weight", "bold");

            const xMin = d3.range(4, 5.5, 0.1); 
            const minData = xMin.map(x => ({ [x]: 0 }));

            SVG.append("path")
                    .datum(minData)
                    .attr("clip-path", "url(#clip)")
                    .attr("fill", "none")
                    .attr("stroke", "silver")
                    .attr("class", "poly-line")
                    .attr("id", "min-line")
                    .attr("stroke-width", 5)
                    .attr("stroke-dasharray", "10,5")
                    .attr("d", exLines);

            const minLine = d3.select("#min-line");
            const minBox = minLine.node().getBBox();

            SVG.append('text')
                .attr("x", minBox.x + minBox.width + 5) 
                .attr("y", minBox.y + minBox.height / 2) 
                .attr("text-anchor", "start")
                .attr("dy", 0) // Adjust the vertical position as needed
                .attr("dx", 0) // Adjust the horizontal position as needed
                .text('Local Minima')
                .style("fill", "black")
                .style("font-size", "medium") 
                .style("font-family", "ui-monospace") 
                .style("font-weight", "bold");


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
            SVG.selectAll('.poly-text').remove();
            // SVG.selectAll('text').remove();
            SVG.selectAll("#max-line, #min-line");

            // Add first derivative line to graph
            SVG.append("path")
                .datum(firstDerivativeData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "aqua")
                .attr("class", "first-derivative-line")
                .attr("stroke-width", 3)
                .attr("d", firstDerivativeLine);

            d3.select("#annotation").html("This is the derivative of the position of the basketball, more commonly recognized as its <em>velocity</em>. This line is modeling the rate of change of the basketball's position over time. You can see that the velocity immediately shoots back up to a positive value after the curve reaches its minimum. This is because the basketball is bouncing back up.")               
            
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
            SVG.selectAll('.poly-text').remove();

            // Add second derivative line to graph
            SVG.append("path")
                .datum(secondDerivativeData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "lightgreen")
                .attr("class", "second-derivative-line")
                .attr("stroke-width", 3)
                .attr("d", secondDerivativeLine);

            d3.select("#annotation").html("Finally, we have the second derivative of the position, or the first derivative of the velocity. This is the basketball's <em>acceleration</em>, the rate of change of its velocity. A positive acceleration would mean an increasing velocity, and a negative accleration is the opposite.")
            
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
            d3.select('#annotation').html("You can roughly see how the lines relate to each other. When the ball is at its peak, the velocity is 0. The velocity dips into the negative and the ball begins to fall, eventually hitting the ground. This is a good example of how derivatives can be used to model real-world phenomena.  Move onto the next section to see how derivatives are used in another interesting way.");
            SVG.selectAll('.poly-line').transition().duration(2500).ease(d3.easeLinear).attr("opacity", 1);
            SVG.selectAll('.first-derivative-line').transition().duration(2500).ease(d3.easeLinear).attr("opacity", 1);
            // SVG.selectAll('.exLines').attr('opacity', 0);
        }

        reset_to_first_page = () => {
            SVG.selectAll('.poly-line').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);
            SVG.selectAll('.first-derivative-line').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);
            SVG.selectAll('.second-derivative-line').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);
        }
    });

    $ : {
        console.log('Reactive update 2', curr_basketball_page);
        drawPages();
    }

    var reset = false;
    function drawPages() {

        if (reset & curr_basketball_page == 1) {
            reset_to_first_page();
        }

        else if (curr_basketball_page == 2) {
            console.log('Drawing first page');
            draw_first_page();
        }
        else if (curr_basketball_page == 3) {
            console.log('Drawing second page');
            draw_second_page();
        }
        else if (curr_basketball_page == 4) {
            console.log('Drawing third page');
            draw_third_page();
        }
        else if (curr_basketball_page == 5){
            console.log('Drawing fourth page');
            draw_fourth_page();
            reset = true;
        }
    }

</script>

<main>
    <script src="https://d3js.org/d3.v4.js"></script>
    <div id="BallGraph"></div>
    <h1 id='ball-header'>Basketball Graph</h1>
    <div id="annotation"></div>
</main> 
  
<style>

    #ball-header {
        position: absolute;
        top: 10%;
        right: 3%;
        max-width: 300px; /* Set the maximum width as needed */
        overflow: hidden; /* Optional: hide content if it overflows */
        white-space: wrap; /* Optional: prevent line breaks */
        /* padding-left: 20%;         */
    }

    main {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 5%;
        padding-bottom: 5%
    }

    #annotation {
        position: absolute; /* Position the annotation absolutely within the main container */
        top: 120px; 
        right: 50px; 
        font-size: 16px; /* Adjust font size as desired */
        width: 200px;
    }
</style> 