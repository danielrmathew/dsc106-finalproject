<script>
  import Graph from '../components/Graph.svelte'
  import Polynomial from 'polynomial';
  import { validPolyAvail, polyFunction } from '../lib/store.js'
  // import {updatePoly} from '../components/Graph.svelte'
  // import * as d3 from 'd3';

  
  let poly;

  function checkValidParentheses(str) {
    const stack = [];
    const map = {
      '(': ')'
    }

    for (let i = 0; i < str.length; i++) {
      if (str[i] === '(') {
        stack.push(str[i]);
      } else if (str[i] === ')'){
        if (stack.length === 0) {
          return false;
        }
        let last = stack.pop();
      }
    }

    if (stack.length !== 0) {
      return false;
    }

    return true;
  }

  function isValidPolynomial(str) {
    // Remove whitespace from the string
    str = str.replace(/\s/g, '');

    // Make sure there are no back to back operators
    const noBackToBackOperators = str.match(/(\+|\-|\*\/){2,}/);
    if (noBackToBackOperators) {
      console.log('I failed at back to back operators');
      return false;
    }

    // if there are parentheses, make sure they are valid
    if (str.includes('(') || str.includes(')')) {
        const validParentheses = checkValidParentheses(str);
        if (!validParentheses) {
          console.log('I failed at valid parentheses');
          return false;
        }
      }

    // if the term ends with an operator, it is invalid
    const endsWithOperator = str.match(/(\+|\-|\*\/)$/);
    if (endsWithOperator) {
      console.log('I failed at ends with operator');
      return false;
    }

    const terms = str.match(/(\+|\-|\*\/)?[a-z0-9.^]+/gi);

    console.log("Terms: " + terms);

    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      // make sure term only contains valid characters
      const validTerm = term.match(/^(\+|\-|\*\/)?[0-9x.]+(\^)?[0-9x.]*?$/i);

      if (!validTerm) {
        console.log('I failed at valid term');
        return false;
      }
    }

    return true;
}

  function validatePoly() {
    if (isValidPolynomial(poly)) {
      console.log('Valid polynomial');
      // var p = new Polynomial(poly);
      // console.log(p);
      // console.log('Poly value:', poly);
      polyFunction.set(poly);
      validPolyAvail.set(true);
    } else {
      console.log('Invalid polynomial');
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
      <center>
        <div id = 'writeup'>
          <h1>Prototype Writeup</h1>
          <br>
          <p>
            Our end goal is to create a visualization that teaches calculus fundamentals surrounding the derivative via "scrollytelling". 
            So far we've layed the ground work for our first 2 pages, and have come together to brainstorm functional features as well as aesthetic choices that we want to execute on. 
            Users can enter a polynomial with the text box which later sections will use to graph it and its derivatives.
            We've implemented a function that checks if the polynomial is valid (parentheses, single-variable, no weird characters, etc.) and if so, creates a Polynomial object from the input using the Polynomial.js package.
            The Polynomial objects are useful because of the in-built methods that allow us to calculate the derivative of the polynomial.
            Upon scrolldown, the webpage snaps to the second section of the visualization.
            The second page has a graph that will display the polynomial and its derivative(s) as the user scrolls down. We want to add to add features like animating the lines being drawn however our main priority as of now is functionality.
          </p>
          <br>
          <p>
            The biggest hurdle we've faced so far is implementing the graph with the level of interactivity we're hoping for.
            Our idea was to make the graph have 4 quadrants and take up the entire page, allowing the user to pan and zoom in on the graph after it's finished drawing.
            We've managed to get a basic graph with zoom + panning capabilities but there are not many examples of the kind of immersive graph we want.
            However, we're confident that with some time we'll be able to implement the graph we're envisioning. 
            There are some JavaScript and Svelte elements that may prove challenging but we've found a lot of resources and examples that we can use to guide us.
        </div>
      </center>
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

  #writeup {
    margin-top: 50px;
    width: 1000px;
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
