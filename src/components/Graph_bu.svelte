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
  