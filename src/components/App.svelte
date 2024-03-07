<script>
  import Graph from '../components/Graph.svelte'
  import Polynomial from 'polynomial';
  import * as math from 'mathjs';
  import { validPolyAvail, polyFunction } from '../lib/store.js'
  // import {updatePoly} from '../components/Graph.svelte'
  // import * as d3 from 'd3';

  
  let poly;

  // function checkValidParentheses(str) {
  //   const stack = [];
  //   const map = {
  //     '(': ')'
  //   }

  //   for (let i = 0; i < str.length; i++) {
  //     if (str[i] === '(') {
  //       stack.push(str[i]);
  //     } else if (str[i] === ')'){
  //       if (stack.length === 0) {
  //         return false;
  //       }
  //       let last = stack.pop();
  //     }
  //   }

  //   if (stack.length !== 0) {
  //     return false;
  //   }

  //   return true;
  // }

  function isValidPolynomial(str) {
    // Remove whitespace from the string
    // str = str.replace(/\s/g, '');

    // // Make sure there are no back to back operators
    // const noBackToBackOperators = str.match(/(\+|\-|\*\/){2,}/);
    // if (noBackToBackOperators) {
    //   console.log('I failed at back to back operators');
    //   return false;
    // }

    // // if there are parentheses, make sure they are valid
    // if (str.includes('(') || str.includes(')')) {
    //     const validParentheses = checkValidParentheses(str);
    //     if (!validParentheses) {
    //       console.log('I failed at valid parentheses');
    //       return false;
    //     }
    //   }

    // // if the term ends with an operator, it is invalid
    // const endsWithOperator = str.match(/(\+|\-|\*\/)$/);
    // if (endsWithOperator) {
    //   console.log('I failed at ends with operator');
    //   return false;
    // }

    // const terms = str.match(/(\+|\-|\*\/)?[a-z0-9.^]+/gi);

    // console.log("Terms: " + terms);

    // for (let i = 0; i < terms.length; i++) {
    //   const term = terms[i];
    //   // make sure term only contains valid characters
    //   const validTerm = term.match(/^(\+|\-|\*\/)?[0-9x.]+(\^)?[0-9x.]*?$/i);

    //   if (!validTerm) {
    //     console.log('I failed at valid term');
    //     return false;
    //   }
    // }

    // return true;

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

    // if (validPoly) {}
  }

  // function mouseInGraph() {
  //   console.log('Mouse in graph');

  //   // if mouse is in the graph, disable page scrolling
  //   document.querySelector('#chart').classList.add('disable-scroll');
  // }

  // function mouseOutGraph() {
  //   console.log('Mouse out graph');

  //   // if mouse is out of the graph, enable page scrolling
  //   document.querySelector('#chart').classList.remove('disable-scroll');
  // }

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

</style>

