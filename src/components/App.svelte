<script>
  import Graph from '../components/Graph.svelte'
  import BallGraph from '../components/BallGraph.svelte'
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
  <div class="container">
    <section id="intro">
      <div id="intro-div">
        <span style="font-size: 50px;">Hello! Input your favorite</span> <span style="font-size: 20px;"> (single variable)</span> <span style="font-size: 50px;"> math function!</span>
        <div class = 'input_container'>
          <p id = 'yequals'>y =</p>
          <input id="input" bind:value={poly} type="text" placeholder=" Enter function here" />
          <button on:click={validatePoly} type="submit">Enter</button>
        </div>
      </div>
    </section>
    <section id="chart">
      <div id="Graph">
        <Graph />
      </div>
    </section>
    <section id="scenario-1" onload="displayBasketballPages('basket_pages');">
      <button on:click={() => nextPage('basketball')} type="page_handler" class="arrow right"></button>
      <p id = 'page_counter'>{displaySectionPages(curr_basketball_page, basketball_pages)}</p>
      <div id ="BallGraph">
        <BallGraph />
      </div>
    </section>
    <section id="scenario-2">

    </section>
    <section id="scenario-3">
      
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

  /* .disable-scroll{
    overflow-y: hidden;
  } */

  #input {
    height:60px;
    font-size:22pt;
  }

  .arrow {
        position: absolute;
        border: solid black;
        top: 15%;
        border-width: 0 4px 4px 0;
        display: inline-block;
        padding: 4px;
    }

    #page_counter {
      position: absolute;
      top: 10%;
      left: 50%;
      transform: translate(-33%, 0);
      font-size: 15pt;
    }

    .right {
    transform: rotate(-45deg);
    -webkit-transform: rotate(-45deg);
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

  #intro {
    background-color: rgba(255,255,255,0.5);
    background-image: url('intro-background.jpg'); /* would prefer this file to be in assets but it doesn't work there for some reason, so has to be in components*/
    background-blend-mode: lighten;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #yequals {
    font-size: 22pt;
    position: relative;
    right: 10px;
  }

  #input {
    margin-top: 15px;
  }

  #Graph {
    /* center the graph */
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    top: 10%;
  }

  #BallGraph {
    /* center the graph */
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    top: 20%;
  }


</style>