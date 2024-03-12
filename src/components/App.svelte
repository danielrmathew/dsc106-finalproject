<script>
  import Graph from '../components/Graph.svelte'
  import BallGraph from '../components/BallGraph.svelte'
  import StockGraph from '../components/StockGraph.svelte';
  import Polynomial from 'polynomial';
  import * as math from 'mathjs';
  import { validPolyAvail, polyFunction } from '../lib/store.js'
  import { global_basketball_page, global_stock_page} from '../lib/store.js'

  let poly;

  var curr_basketball_page = 1;
  const basketball_pages = 5;

  var curr_stock_page = 1;
  const stock_pages = 5;

  function isValidPolynomial(str) {
    try {
      const parser = math.parser();
      parser.evaluate(`t(x) = ${poly}`)
      parser.evaluate('t(0)')
    } catch {
      return false;
    }
    return true;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function validatePoly() {
    if (isValidPolynomial(poly)) {
      console.log('Valid polynomial');
      console.log(poly);
      polyFunction.set(poly);
      validPolyAvail.set(true);
      scrollToSection('chart');
    } else {
      console.log('Invalid polynomial');
    }
  }

  function nextPage(page_type) {
    if (page_type == 'basketball') {
      curr_basketball_page = (curr_basketball_page) % basketball_pages + 1;
      global_basketball_page.set(curr_basketball_page);
    } else if (page_type == 'stock') {
      curr_stock_page = (curr_stock_page) % stock_pages + 1;
      global_stock_page.set(curr_stock_page);
    }
  }

  function displaySectionPages(curr_section_page, section_pages) {
    return curr_section_page + ' / ' + section_pages;
  }

</script>

<main>
  <head>
    <title>Keep Calm and Derive!</title>
  </head>
  <div class="container">
    <section id="intro">
      <p style="font-size: 23px; width: 400px;">Welcome to <b>Keep Calm and Derive!</b> This explanation is for those of you who still doubt the 
        importance of calculus. We shall do what AP Calculus only tried to do in high school: show why the derivative is important.</p>
    </section>
    <section id="scenario-1" onload="displayBasketballPages('basket_pages');">
      <div class="ball"></div>
      <div class="page_controls">
        <button on:click={() => nextPage('basketball')} type="page_handler" class="arrow"></button>
        <p id = 'page_counter'>{displaySectionPages(curr_basketball_page, basketball_pages)}</p>
      </div>
      <div id ="BallGraph">
        <BallGraph />
      </div>
    </section>
    <section id="scenario-2" onload="displayStockPages('stock_pages');">
      <div class="page_controls">
        <button on:click={() => nextPage('stock')} type="page_handler" class="arrow"></button>
        <p id='page_counter'>{displaySectionPages(curr_stock_page, stock_pages)}</p>
      </div>
      <div id ="StockGraph">
        <StockGraph />
      </div>
    </section>
    <section id="chart">
      <div id="intro-div">
        <span style="font-size: 25px;">Input your favorite</span> <span style="font-size: 10px;"> (single variable)</span> <span style="font-size: 25px;"> function!</span>
        <div class = 'input_container'>
          <p id='yequals'>f(x) =</p>
          <input style='height: 30px;' id="input" bind:value={poly} type="text" placeholder=" Enter function here" />
          <button style='transform: translate(5px, 5px);' on:click={validatePoly} type="submit">Enter</button>
        </div>
      </div>
      <div id="Graph">
        <Graph />
      </div>
    </section>
    <section id="conclusion">
      <p style="font-size: 23px; width: 400px;">Hopefully you leave this site with a greater appreciation for the wonders of the derivative! While it may have been annoying to learn years ago, the real world applications go far beyond what we have shown so far. Keep Calm and Derive!</p>
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

  #input {
    height:60px;
    font-size:22pt;
  }

  .page_controls {
    position: absolute;
    top: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: auto;
  }

  .arrow {
    position: absolute;
    right : 46%;
    display: block;
    width: 25px;
    height: 25px;
    border: none;
    background-image: url("Screen Shot 2024-03-08 at 12.06.26 PM.jpg");
    background-size: cover;
  }

  #page_counter {
    position: absolute;
    font-size: 15pt;
    display: block;
  }

  .input_container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: 100vh;
  }

  section {
    height: 100vh;
    justify-content: center;
    align-items: center;
    scroll-snap-align: start;
    text-align: center;
    padding: 0;
    border-style: solid;
    position: relative;
  }

  #intro, #conclusion {
    background-color: rgba(255,255,255,0.5);
    background-image: url('intro-background.jpg'); /* would prefer this file to be in assets but it doesn't work there for some reason, so has to be in components*/
    background-blend-mode: lighten;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #intro-div {
    margin-top: 20px;
  }

  #yequals {
    font-size: 25px;
    position: relative;
    right: 10px;
    transform: translate(0px, 4px)
  }

  #input {
    margin-top: 10px;
  }

  #Graph {
    /* center the graph */
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    top: 0%;
  }

  #BallGraph {
    /* center the graph */
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    top: 20%;
  }

  .ball {
      position: absolute;
      top: 50%;
      left: 5%;
      width: 100px;
      height: 100px;
      border-radius: 50%;         /* Turns a square into a circle   */
      background-color: #FF5722;  /* Sets color to Orange           */

      animation: bounce 0.5s;
      animation-direction: alternate;
      animation-iteration-count: infinite;
  }

  @keyframes bounce {
      to { transform: translate3d(0, 0, 0);     }
      from   { transform: translate3d(0, 200px, 0); }
  }

  #StockGraph {
    /* center the graph */
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    top: 20%;
  }

  #chart {
    background-color: rgb(205, 224, 227);
  }

</style>