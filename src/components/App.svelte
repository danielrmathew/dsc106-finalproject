<script>
  // nothing for now
</script>

<main>
  <div class="container">
    <section class="one">
      <h1>First Page - Intro to Project</h1>
    </section>
    <section class="two">
      <h1>Graph Component</h1>
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
    display: flex;
    justify-content: center;
    align-items: center;
    scroll-snap-align: start;
  }
  
  .container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100vh;
  }
</style>
