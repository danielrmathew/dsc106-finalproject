<script>
  import Graph from '../components/Graph.svelte'
  import Polynomial from 'polynomial';
  
  let poly;
  function validatePoly() {
    var p = new Polynomial(poly);
    let validPoly = true;
    console.log(p);
    let arr = Object.keys(p.coeff);
    for (let i = 0; i < arr.length; i++) {
      console.log(arr[i]);
      if (isNaN(p.coeff[arr[i]])) {
        console.log('shitass poly')
        validPoly = false;
      }
    }

    // if (validPoly) {}
  }
</script>

<main>
  <div class="container">
    <section class="one">
      <h1>Hello! Input your favorite function!</h1>
      <div>
        <input class="input" bind:value={poly} type="text" placeholder="Enter function here" />
        <button on:click={validatePoly} type="submit">Enter</button>
      </div>
    </section>
    <section class="chart">
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
    padding: 0;
    border-style: solid;
  }
  
  .container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100vh;
  }

  .input {
    margin-top: 10px;
  }
</style>
