<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import * as d3 from 'd3';
    import Polynomial from 'polynomial';
    // import { validPolyAvail, polyFunction } from '../lib/store.js'
    import * as math from 'mathjs';
    import { parse } from 'svelte/compiler';

    // previously import { global_stock_page, global_stock_text } from '../lib/store.js'
    import { global_stock_page} from '../lib/store.js'
    
    let poly = '3x^3 + 1/2 (1 - x) - 2/3 x^5 - sin(x)';

    let curr_stock_page;
    let draw_first_page;
    let second_page_annotation;
    let draw_third_page;
    let draw_fourth_page;
    let draw_fifth_page;
    let draw_sixth_page;
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
        var margin = {top: 10, right: 30, bottom: 30, left: 250},
            width = (window.innerWidth / 1.5) - margin.left / 2 - margin.right,
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

        const xValues = d3.range(-2.4, 2.5, 0.1);

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
        // var tooltip = d3.select("#StockGraph")
        //     .append("div")
        //     .style("opacity", 0)
        //     .attr("class", "tooltip")
        //     .style("background-color", "white")
        //     .style("border", "solid")
        //     .style("position", "absolute")
        //     .style("width", "100px")
        //     .style("border-width", "2px")
        //     .style("border-radius", "5px")
        //     .style("padding", "5px");
        
        // // tooltip explaining function's significance
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

        // var valueTooltip = d3.select("#StockGraph")
        //     .append("div")
        //     .style("opacity", 0)
        //     .attr("class", "tooltip")
        //     .style("background-color", "white")
        //     .style("border", "solid")
        //     .style("width", "100px")
        //     .style("border-width", "2px")
        //     .style("border-radius", "5px")
        //     .style("padding", "5px")


        // function showTooltip(event, lineName) {
        //     console.log('showing tooltip');
        //     const [x, y] = d3.pointer(event);
        //     tooltip.transition().duration(200).style("opacity", 0.9);
        //     tooltip.html(`<strong>${lineName}</strong>`)
        //         .style("left", (x + 10) + "px")
        //         .style("top", (y - 20) + "px");
        // }

        // function showSignificanceTooltip(event, lineName) {
        //     console.log('showing tooltip');
        //     const [x, y] = d3.pointer(event);
        //     tooltipText.transition().duration(200).style("opacity", 0.9);

        //     if (lineName == 'f(x)') {
        //         //console.log('Got here') // gets here
        //         tooltipText.html(`This line depicts what a potential stock's (lets call it Company X) growth and decline can look like\n
        //             We can see by the annotations the highs and lows of Company X -- we would consider these to be the lcoal mins and maxes \n
        //             of the company's stock.`)
        //             .style("left", (x + 10) + "px")
        //             .style("top", (y - 20) + "px");

        //         // stock_text = 'looking at f(x)';
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
        

        // function hideTooltip() {
        //     tooltip.transition().duration(200).style("opacity", 0);
        // }

        // function hideSignificanceTooltip() {
        //     tooltipText.transition().duration(200).style("opacity", 0);
        // }

        d3.select("#stock-text").html("Welcome to the world of <u>stock trading!</u><br><br>Let's go through an example of how a function's derivatives can be used to understand a company's <u>stock trends.</u><br><br>Specifically, we will be looking into the <mark>local mins and maxes</mark>, along with their relationship to the first derivative of the original function.")
        
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

            // max line
            const exLines = d3.line()
                .x(d => x(Object.keys(d)[0]))
                .y(d => y(Object.values(d)[0]))
                .curve(d3.curveMonotoneX);


            const xMax1 = d3.range(-1.1, 0.4, 0.1); 
            const maxData1 = xMax1.map(x => ({ [x]: 0.93 }));

            SVG.append("path")
                .datum(maxData1)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "gold")
                .attr("id", "max-line-stock")
                .attr("class", "poly-line")
                .attr("stroke-width", 5)
                .attr("stroke-dasharray", "10,5")
                .attr("d", exLines);

            const maxLineStock = d3.select("#max-line-stock")
            console.log(maxLineStock);
            const maxBoxStock = maxLineStock.node().getBBox();
            console.log(maxBoxStock);

            const xMax2 = d3.range(1, 2.5, 0.1); 
            const maxData2 = xMax2.map(x => ({ [x]: 4.1 }));

            SVG.append("path")
                    .datum(maxData2)
                    .attr("clip-path", "url(#clip)")
                    .attr("fill", "none")
                    .attr("stroke", "gold")
                    .attr("class", "poly-line")
                    .attr("stroke-width", 5)
                    .attr("stroke-dasharray", "10,5")
                    .attr("d", exLines);

            SVG.append('text')
                .attr("x", maxBoxStock.x + maxBoxStock.width + 5) 
                .attr("y", maxBoxStock.y + maxBoxStock.height / 2) 
                .attr("text-anchor", "start")
                .attr("dy", -10) // Adjust the vertical position as needed
                .attr("dx", -90) // Adjust the horizontal position as needed
                .attr("id", "max-text-stock")
                .text('Local Maximas')
                .style("fill", "black")
                .style("font-size", "large") 
                .style("font-family", "Indie Flower") 
                .style("font-weight", "bold");

            const xMin = d3.range(-2.3, -0.8, 0.1); 
            const minData = xMin.map(x => ({ [x]: -3 }));

            SVG.append("path")
                .datum(minData)
                .attr("clip-path", "url(#clip)")
                .attr("fill", "none")
                .attr("stroke", "silver")
                .attr("id" ,"min-line-stock")
                .attr("class", "poly-line")
                .attr("stroke-width", 5)
                .attr("stroke-dasharray", "10,5")
                .attr("d", exLines);

            const minLineStock = d3.select("#min-line-stock")
            const minBoxStock = minLineStock.node().getBBox();

            SVG.append('text')
                .attr("x", minBoxStock.x + minBoxStock.width + 5) 
                .attr("y", minBoxStock.y + minBoxStock.height / 2)
                .attr("text-anchor", "start")
                .attr("dy", 20) // Adjust the vertical position as needed
                .attr("dx", -90) // Adjust the horizontal position as needed
                .attr("id", "min-text-stock")
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

            d3.select("#stock-text").html("Here's a function that looks similar to what a company's stock trends could look like over a short period of time. It rises and falls just as normal stocks would do in real life with real companies.<br><br>The key thing to note here is how we are able to <u>simulate real life stock conditions with mathematical functions.</u>")
        }
        
        second_page_annotation = () => {
            d3.select("#stock-text").html("Notice how we label the local mins and maxes of the stock's growth. For the min @ x = -1.75, this would be the <mark style='background-color:lightgreen'> optimal time to buy</mark> the stock for Company X. Why? - because this is the <mark>lowest point</mark> for the Company X's stock price for a long time since it's decline (which occurs much earlier).<br><br>Take a look at the local max @ 1.75. This would be the <mark style='background-color:#FF7F7F'>optimal time to sell</mark> Company X stock because this would be the <mark>highest point</mark> for the stock price before a sharp decline in value. Let's dive deeper into what these values mean.")
        }

        draw_third_page = () => {
            SVG.selectAll('#max-text-stock, #min-text-stock').remove();

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
            
           d3.select("#stock-text").html("The function drawn to the right is our original function's <mark style='background-color:aqua'>first derivative</mark>. Hopefully with the page above, you got a feel for how we find extrema.<br><br>Once again, note how the x-intercepts (where the line crosses the x-axis) is exactly where we noted the local minimas and maximas in the original function.<br><br> In the context of stocks, these points in time often signify potential turning points in a stock's performance, <u>indicating periods of significant growth or decline.</u> The first derivative represents the rate of change of a stock's value over time, similar to the basketball's change in position in the previous example.")

        }

        draw_fourth_page = () => {
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

            d3.select("#stock-text").html("The function drawn to the right is our original function's <mark style='background-color:lightgreen'>second derivative</mark>. In the context of stocks, the second derivative represents the rate of change of the first derivative, akin to acceleration in physics. Financial acceleration provides deeper insights into the acceleration or deceleration of a <u>stock's price movements</u>.<br><br>The local minimas and maximas in the second derivative can illuminate inflection points in a stock's trajectory, indicating potential shifts in the rate of ascent or descent which we call points of <mark>convexity</mark> / <mark>concavity</mark>.<br><br>These points provide valuable cues such as if as stock is entering a phase of <u>sustained growth</u>, <u>leveling off</u>, or <u>experiencing heightened volatility.</u>")
        }

        draw_fifth_page = () => {
            SVG.selectAll('.poly-line').transition().duration(2500).ease(d3.easeLinear).attr("opacity", 1);
            SVG.selectAll('.first-derivative-line').transition().duration(2500).ease(d3.easeLinear).attr("opacity", 1);

            d3.select("#stock-text").html("Considering all forms of our stock function - f(x), f'(x), and f''(x) - <mark>we can start making some money</mark>! Minimas and maximas of f(x) align with the zeros of f'(x), and same goes for f'(x) with f''(x). We can see how the zeroes of f''(x) align with the points of convexity and concavity of our original function.<br><br>When the first derivative goes from <u>negative to positive</u>, we have a local minima. We should try to buy there. When the first derivative goes from <u>positive to negative</u>, we have a local maxima. We should try to sell there.<br><br> The concavity of function can tell us if the stock is is increasing or decreasing in rate of growth.")
        }

        draw_sixth_page = () => {
            SVG.selectAll('.first-derivative-line').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);
            SVG.selectAll('.second-derivative-line').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);
            SVG.selectAll('#max-line-stock').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);
            SVG.selectAll('#min-line-stock').transition().duration(1000).ease(d3.easeLinear).attr("opacity", 0);

            d3.select("#stock-text").html("Obviously, there are many more factors to consider when investing in stocks.<br><br>There is no way to magically attain a function that perfectly models a stock's growth and decline. If there was, you and I would be in the Bahamas!<br><br>However, a holistic understanding of these terms and practiced application of these ideas in the stock market can yield informed decisions that generate massive wealth for a stock enthusiast.<br><br>Continue scrolling to explore more or press the arrow to rewatch the series.")
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
            console.log('func for first page');
            // global_stock_text.set("Welcome to the stock graph. Here we are going to go through an example of how understanding the key components of a function can be utilized to understand a company's stock trends. Specifically, we will be looking into the local mins and maxes, along with their relationship to the first derivative of the original function. For this graph, we generated a function that looks similar to what a company's stock trends could look like over a short period of time. f(x) = 3x^3 + 1/2 (1 - x) - 2/3 x^5 - sin(x).");
            reset_to_first_page();
        }

        else if (curr_stock_page == 2) {
            console.log('Drawing first page');
            // global_stock_text.set("Now this is the original function that we dicussed on the previous page. This function clearly falls and rises just as normal stocks would do in real life with real companies. The key thing to note here is how we are able to simulate real life stock conditions with mathematical functions. In the visualization to the right notice how we label the local mins and maxes of the stock's growth. For the min that occurs around x = -1.75, this would be the optimal time to buy the stock for Company X. Why? - because this is the lowest point for the Company X's stock price for a long time since it's decline (which occurs much earlier). The local max occcurs around x = 1.75. This would be the optimal time to sell Company X stock because this would be the highest point for the stock price before a sharp decline in value. Let's dive deeper into what these values mean. ");
            draw_first_page();
        }
        else if (curr_stock_page == 3) {
            console.log('Drawing second page')
            // global_stock_text.set("The function drawn to the right is our original function's first derivative f'(x) = -cos(x) - 10x^4 / 3 + 9x^2 - 1/2. You are probably wondering how the first derivative relates to understanding stocks. It is significant when identifying critical points in a stock's trajectory, such as local minima and maxima. These points often signify potential turning points in a stock's performance, indicating periods of significant growth or decline.  The first derivative essentially represents the rate of change of a stock's value over time, analogous to the velocity of a moving object as we saw with the basektball's motion in the previous example. In the visualization to the right note how the x-intercepts (where the line crosses the x-axis) is exactly where we noted the local minimas and maximas in the original function. ");
            second_page_annotation();
        }
        else if (curr_stock_page == 4) {
            console.log('Drawing third page');
            // global_stock_text.set("The function drawn to the right is our original function's second derivative f''(x) = sin(x) - 40x^3 / 3 + 18x . In the context of stocks, the second derivative represents the rate of change of the first derivative, akin to acceleration in physics, and financial acceleration provides deeper insights into the acceleration or deceleration of a stock's price movements. The local minimas and maximas in the second derivative can illuminate inflection points in a stock's trajectory, indicating potential shifts in the rate of ascent or descent which we call points of convexity / concavity. These points provide valuable cues such as if as stock is entering a phase of sustained growth, leveling off, or experiencing heightened volatility.");
            draw_third_page();
        }
        else if (curr_stock_page == 5){
            console.log('Drawing fourth page');
            // global_stock_text.set("Considering all forms of our stock function - f(x), f'(x), and f''(x) - we are able to consider all we have discussed thus far and their relationships with one another. We note the minimas and maximas of f(x) align with the zeros of the f'(x), and same goes for f'(x) with f''(x). Further more, we can see how the zeroes of f''(x) align with the points of convexity and concavity of our original function. Overall, a holistic understanding of these terms and practiced application of these ideas in the stock market can yield informed decisions that generate massive wealth for a stock enthusiast. Continue scrolling to explore more or press the arrow to rewatch the series.");
            draw_fourth_page();
        }

        else if (curr_stock_page == 6){
            console.log('Drawing fifth page');
            draw_fifth_page();
        }

        else if (curr_stock_page == 7){
            console.log('Drawing sixth page');
            draw_sixth_page();
            reset = true;
        }
    }

</script>

<main>
    <script src="https://d3js.org/d3.v4.js"></script>
    <div id="StockGraph"></div>
    <div id='StockText'>
        <h1 id='stock-header'>Stock Graph</h1>
        
        <!-- previously <p id="stock-text"> {$global_stock_text}</p> -->
        <p id="stock-text"></p>
    </div>
    <div id="tooltip-text"></div>
</main> 
  
<style>
    @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');

    main {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-top: 5%;
        padding-bottom: 5%
    }

    #tooltip-text {
        position: relative;
        /* margin-right: 200px; */
        top: 15%;

    }

    #StockGraph {
        position: relative;
        margin: 0 auto 0 20%;
    }

    #stock-header {
        position: absolute;
        top: -15%;
        left: 8%;
        max-width: 300px; /* Set the maximum width as needed */
        overflow: hidden; /* Optional: hide content if it overflows */
        white-space: wrap;
        font-family: "Indie Flower";
        font-size: 30px;
    }

    #stock-text {
        position: absolute;
        top: -2%;
        left: 2%;
        max-width: 350px; /* Set the maximum width as needed */
        overflow: hidden; /* Optional: hide content if it overflows */
        white-space: wrap; /* Optional: prevent line breaks */
        font-size: 17px;
        font-family: "Indie Flower";
    }
</style> 