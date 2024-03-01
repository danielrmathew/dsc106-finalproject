<script>
  import Graph from '../components/Graph.svelte'
  import Polynomial from 'polynomial';
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
      } else {
        let last = stack.pop();
        if (str[i] !== map[last]) {
          return false;
        }
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

    // if the term ends with an operator, it is invalid
    const endsWithOperator = str.match(/(\+|\-|\*\/)$/);
    if (endsWithOperator) {
      console.log('I failed at ends with operator');
      return false;
    }

    const terms = str.match(/(\+|\-|\*\/)?[a-z0-9.^]+/gi);

    console.log(terms);

    for (let i = 0; i < terms.length; i++) {
      const term = terms[i];
      // make sure term only contains valid characters
      const validTerm = term.match(/^(\+|\-|\*\/)?[0-9x.]+(\^)?[0-9x.]*?$/i);

      if (!validTerm) {
        console.log('I failed at valid term');
        return false;
      }

      // if there are parentheses, make sure they are valid
      if (term.includes('(') || term.includes(')')) {
        const validParentheses = checkValidParentheses(term);
        if (!validParentheses) {
          console.log('I failed at valid parentheses');
          return false;
        }
      }
    }

    return true;
}

  function validatePoly() {
    if (isValidPolynomial(poly)) {
      console.log('Valid polynomial');
      var p = new Polynomial(poly);
      console.log(p);
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
