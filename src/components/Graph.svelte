<script>
  import { onMount } from 'svelte';

  let width, height;
  let xScale, yScale;
  let svg;

  onMount(() => {
    if (typeof window !== 'undefined') {
      // Set up initial dimensions
      width = window.innerWidth;
      height = window.innerHeight;

      // Set up initial scale and translate
      xScale = d3.scaleLinear().domain([-10, 10]).range([0, width]);
      yScale = d3.scaleLinear().domain([-10, 10]).range([height, 0]);

      // Initialize zoom behavior
      const zoom = d3.zoom()
        .scaleExtent([1, 10])
        .on("zoom", zoomed);

      // Create SVG container
      svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .call(zoom);

      // Create axes
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);

      // Draw axes
      svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height / 2})`)
        .call(xAxis);

      svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${width / 2}, 0)`)
        .call(yAxis);

      // Draw initial points or other content
      svg.append("circle")
        .attr("cx", xScale(0))
        .attr("cy", yScale(0))
        .attr("r", 5)
        .attr("fill", "red");
    }
  });

  function zoomed(event) {
    const { transform } = event;

    // Update scales with new transform
    xScale = transform.rescaleX(xScale);
    yScale = transform.rescaleY(yScale);

    // Update axes with new scales
    svg.select(".x-axis").call(d3.axisBottom(xScale));
    svg.select(".y-axis").call(d3.axisLeft(yScale));

    // Update points or other content with new scales
    svg.selectAll("circle")
      .attr("cx", xScale(0))
      .attr("cy", yScale(0));
  }
</script>

<style>
  #chart {
    width: 100%;
    height: 100vh;
  }
</style>

<div id="chart"></div>
