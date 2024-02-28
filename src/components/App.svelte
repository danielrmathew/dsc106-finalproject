<script>
  import Graph from '../components/Graph.svelte'
</script>

<main>
  <div class="container">
    <section class="one">
      <h1>First Page - Intro to Project</h1>
      <p>text here about our project</p>
    </section>
    <section class="two">
      <Graph />
    </section>
  </div>
</main>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
  }

  :global(body) {
    margin: 0;
    padding: 0;
  }

  section {
    height: 100vh;
    justify-content: center;
    align-items: center;
    scroll-snap-align: start;
    text-align: center;
    padding: 50% 0;
    border-style: solid;
  }
  
  .container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100vh;
  }
</style>
