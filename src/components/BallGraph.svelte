<script>
    import { onMount } from 'svelte';
    import { get, writable } from 'svelte/store';
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
    let draw_fifth_page;
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
        
        d3.select("#annotation").html("This is a graph of a basketball bouncing up and down. The x-axis represents <u>time</u>, and the y-axis represents the <u>height</u> of the basketball.<br><br>The ball is thrown in the air 6 feet and continues to bounce on the ground until it eventually stops.")

        draw_first_page = () => {
            SVG.append("path")
                    .datum(polyData)
                    .attr("class", "invisible-trigger")
                    .attr("clip-path", "url(#clip)")
                    .attr("fill", "none")
                    .attr("stroke-width", 20)
                    .attr("stroke", "orange")
                    .attr("opacity", 0)
                    .attr("d", polyLine);
                    
            SVG.append("path")
                    .datum(polyData)
                    .attr("clip-path", "url(#clip)")
                    .attr("fill", "none")
                    .attr("stroke", "orange")
                    .attr("class", "poly-line")
                    .attr("stroke-width", 3)
                    .attr("d", polyLine);
            
            function calculateSlope(event, xScale, yScale) {
                // Assuming your line data is stored in polyData
                const [xPointer, yPointer] = d3.pointer(event);
                const xValue = xScale.invert(xPointer);
                const slope = firstDerivativeData.find(d => Object.keys(d)[0] > xValue);

                // return x position, y position, and slope rounded to 2 decimal places
                return math.round(Object.values(slope)[0], 2);
                }

            SVG.select('.poly-line')
                    .on('mouseover', (event,d)  =>{
                        if (curr_basketball_page == 2) {
                            const slope = calculateSlope(event, x, y); // Calculate slope at the point where the cursor is hovering

                            //Draws a line with our calculated slope that passes through the cursor's position
                            const get_current_x = x.invert(d3.pointer(event)[0]);
                            const get_current_y = y.invert(d3.pointer(event)[1]);

                            const start = get_current_x - 0.5;
                            const end = get_current_x + 0.5;
                            const slopeLineData = [{x: x(start), y: y(get_current_y + slope * (start - get_current_x))}, {x: x(end), y: y(get_current_y + slope * (end - get_current_x))}];
                            
                            const slopeLine = d3.line()
                                .x(d => d.x)
                                .y(d => d.y);
                            SVG.append('path') // Draw line representing the slope
                                .datum(slopeLineData)
                                .attr('class', 'slope-line')
                                .attr('stroke', 'red')
                                .attr('stroke-width', 2)
                                .attr('fill', 'none')
                                .attr('d', slopeLine);
                            }
                    })
                    .on('mouseout', function() {
                        SVG.selectAll('.slope-line').remove(); // Remove the slope line when mouse leaves the line
                    });
            
            SVG.select('.invisible-trigger')
                    .on('mouseover', (event,d)  =>{

                        if (curr_basketball_page == 2) {
                            const slope = calculateSlope(event, x, y); // Calculate slope at the point where the cursor is hovering

                            //Draws a line with our calculated slope that passes through the cursor's position
                            const get_current_x = x.invert(d3.pointer(event)[0]);
                            const get_current_y = y.invert(d3.pointer(event)[1]);

                            const start = get_current_x - 0.5;
                            const end = get_current_x + 0.5;
                            const slopeLineData = [{x: x(start), y: y(get_current_y + slope * (start - get_current_x))}, {x: x(end), y: y(get_current_y + slope * (end - get_current_x))}];
                            
                            const slopeLine = d3.line()
                                .x(d => d.x)
                                .y(d => d.y);
                            SVG.append('path') // Draw line representing the slope
                                .datum(slopeLineData)
                                .attr('class', 'slope-line')
                                .attr('stroke', 'red')
                                .attr('stroke-width', 2)
                                .attr('fill', 'none')
                                .attr('d', slopeLine);}
                    })
                    .on('mouseout', function() {
                        SVG.selectAll('.slope-line').remove(); // Remove the slope line when mouse leaves the line
                    });

            d3.select("#annotation").html("This is the <mark><em>position</em></mark> of the basketball. You can see it bouncing up and down, slowly losing height until it eventually stops bouncing.<br><br>If this graph looks somewhat familiar, that's because it's a transformation of a <u>sinusoidal function</u> <br><br>Hover over the line to see how slope changes around <mark style='background-color:grey; opacity : 0.7'>minima</mark> and <mark style='background-color:gold'>maxima</mark>.");
            
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
                .attr("id", "max-line-ball")
                .attr("stroke-width", 5)
                .attr("stroke-dasharray", "10,5")
                .attr("d", exLines);

            const maxLineBall = d3.select("#max-line-ball");
            const maxBoxBall = maxLineBall.node().getBBox();

            SVG.append('text')
                .attr("x", maxBoxBall.x + maxBoxBall.width + 5) 
                .attr("y", maxBoxBall.y + maxBoxBall.height / 2) 
                .attr("text-anchor", "start")
                .attr("dy", -10) // Adjust the vertical position as needed
                .attr("dx", -55) // Adjust the horizontal position as needed
                .attr("id", "max-text-ball")
                .text('Local Maxima')
                .style("fill", "black")
                .style("font-size", "large") 
                .style("font-family", "Indie Flower") 
                .style("font-weight", "bold");

            const xMin = d3.range(4, 5.5, 0.1); 
            const minData = xMin.map(x => ({ [x]: 0 }));

            SVG.append("path")
                .datum(minData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "silver")
                .attr("class", "poly-line")
                .attr("id", "min-line-ball")
                .attr("stroke-width", 5)
                .attr("stroke-dasharray", "10,5")
                .attr("d", exLines);

            const minLineBall = d3.select("#min-line-ball");
            const minBoxBall = minLineBall.node().getBBox();

            SVG.append('text')
                .attr("x", minBoxBall.x + minBoxBall.width + 5) 
                .attr("y", minBoxBall.y + minBoxBall.height / 2) 
                .attr("text-anchor", "start")
                .attr("dy", 20) // Adjust the vertical position as needed
                .attr("dx", -55) // Adjust the horizontal position as needed
                .attr("id", "min-text-ball")
                .text('Local Minima')
                .style("fill", "black")
                .style("font-size", "large") 
                .style("font-family", "Indie Flower") 
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
            SVG.selectAll("#max-text-ball, #min-text-ball").remove();

            // Add first derivative line to graph
            SVG.append("path")
                .datum(firstDerivativeData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "aqua")
                .attr("class", "first-derivative-line")
                .attr("stroke-width", 3)
                .attr("d", firstDerivativeLine);

            d3.select("#annotation").html("This is the derivative of the position of the basketball, more commonly recognized as its <mark><em>velocity</em></mark>.<br><br> This line is modeling the <u>rate of change of the basketball's position over time.</u> You can see that the velocity instantly shoots up to a positive value after the curve reaches its minimum. <br><br> This is because the basketball is <u>bouncing back up.</u>")               
            
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

            d3.select("#annotation").html("Finally, we have the <u>second derivative</u> of the position, or the <u>first derivative</u> of the velocity. This is the basketball's <mark><em>acceleration</em></mark>, i.e. the rate of change of its velocity. <br><br>A positive acceleration would mean an increasing velocity, and a negative accleration is the opposite.")
            
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
            d3.select('#annotation').html("Take a look at <mark style='background-color:orange'>position</mark>, <mark style='background-color:aqua'>velocity</mark>, and <mark style='background-color:lightgreen'>acceleration</mark> overlayed on each other.<br><br>When the ball is at its maximum height, the velocity is <u>zero.</u> The then velocity dips into the negative and the ball begins to fall, eventually hitting the ground. Once again, the velocity at this time is <u>zero!</u>");
            SVG.selectAll('.poly-line').transition().duration(2500).ease(d3.easeLinear).attr("opacity", 1);
            SVG.selectAll('.first-derivative-line').transition().duration(2500).ease(d3.easeLinear).attr("opacity", 1);
            // SVG.selectAll('.exLines').attr('opacity', 0);
        }

        draw_fifth_page = () => {
            d3.select('#annotation').html("Obtaining an object's speed from its position is <u>extremely powerful.</u><br><br>You can't use calculus to get better at basketball, but you <span style='font-size: larger; font-weight:bold'>CAN</span> use it to understand the physics that make some players the best in the world.<br><br>And that's why we're here today. To show you that calculus is not just a tool for solving math problems, but a tool for <mark>understanding the world around us.</mark>");
            SVG.selectAll('.first-derivative-line').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);
            SVG.selectAll('.second-derivative-line').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);
            SVG.selectAll('#max-line-ball').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);
            SVG.selectAll('#min-line-ball').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);

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
        }

        else if (curr_basketball_page == 6) {
            console.log('Drawing fifth page');
            draw_fifth_page();
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
    @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');

    #ball-header {
        position: absolute;
        top: 2%;
        right: 1%;
        max-width: 300px; /* Set the maximum width as needed */
        overflow: hidden; /* Optional: hide content if it overflows */
        white-space: wrap; /* Optional: prevent line breaks */
        font-family: 'Indie Flower';
        font-size: 30px; /* Adjust font size as needed */
        font-weight: bold; /* Adjust font weight as needed */
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
        flex:1;
        top: 20%; 
        right: 0.2%; 
        font-family: 'Indie Flower';
        font-size: 17px; /* Adjust font size as desired */
        width: 15vw; /* Set the width as needed */
    }
</style> 