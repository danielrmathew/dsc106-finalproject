<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto';
    
  
    onMount(() => {

    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');

    // Example data for the graph
    const data = {
    labels: [0, 1, 2, 3, 4, 5], // X-axis labels
    datasets: [{
        label: 'My Dataset',
        borderColor: 'rgb(75, 192, 192)',
        data: [0, 1, 4, 9, 16, 25], // Y-axis data
    }]
    };
  
    // Configuration for the chart
    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    min: -10,
                    max: 10
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    min: -10,
                    max: 10
                }
            },
            responsive: true,
            maintainAspectRatio: true, // Allow the chart to expand to the entire container
            plugins: {
                legend: {
                    display: false, // Disable legend
                },
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                        },
                        pinch: {
                            enabled: true,
                        },
                        mode: 'xy',
                    },
                    pan: {
                        enabled: true,
                        mode: 'xy',
                    },
                },
            },
        },
    };

    // Create the chart
    const myChart = new Chart(ctx, config);
});
</script>
  
<main>
    <canvas id="myChart"></canvas>
</main>
  
<style>
    main {
        position: relative;
        width: 100%;
        height: 100%;
        padding-top: 5%;
        padding-bottom: 5%
    }

    canvas {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #2c3e50; /* Dark background color */
        padding-top: 10%;
        margin: 0; /* Remove any margin */
        padding: 0; /* Remove any padding */
    }
</style>
  






<!-- EXAMPLE -->

<!-- <script>
    import { onMount } from "svelte";
  
    onMount(() => {
      // Any additional setup or interactions can be added here
    });
  </script> -->
  
  <!-- <style>
    .graph-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .quadrant {
      position: absolute;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  
    .x-axis,
    .y-axis {
      position: absolute;
      background-color: #ccc;
      box-sizing: border-box;
    }
  
    .x-axis {
      height: 1px;
      width: 100%;//
      left: 0;
    }
  
    .y-axis {
      height: 100%;
      width: 1px;
      top: 0;
    }
  </style> -->

  
  <!-- <div class="graph-container">
    Quadrant 1
    <div class="quadrant" style="top: 0; left: 0; width: 50%; height: 50%;"></div>
    Quadrant 2
    <div class="quadrant" style="top: 0; left: 50%; width: 50%; height: 50%;"></div>
    Quadrant 3
    <div class="quadrant" style="top: 50%; left: 0; width: 50%; height: 50%;"></div>
    Quadrant 4
    <div class="quadrant" style="top: 50%; left: 50%; width: 50%; height: 50%;"></div>
  
    X-Axis
    <div class="x-axis" style="top: 50%;"></div>
    Y-Axis
    <div class="y-axis" style="left: 50%;"></div>
  </div>
   -->