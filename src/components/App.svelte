<script>
  import Graph from '../components/Graph.svelte'
  import BallGraph from '../components/BallGraph.svelte'
  import StockGraph from '../components/StockGraph.svelte';
  import { global_basketball_page, global_stock_page} from '../lib/store.js'

  let poly;

  var curr_basketball_page = 1;
  const basketball_pages = 6;

  var curr_stock_page = 1;
  const stock_pages = 7;

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
      <p style="font-size: 23px; width: 350px;"><mark>Welcome to <br><b style="font-size: 27px">Keep Calm and Derive!</b> Have you ever banged your head against
        the wall trying to learn the derivative? Did it leave you wondering why you even had to learn it in the first place?
        Then this is for you! This explanation is for those of you who still doubt the importance of calculus. 
        We shall do what AP Calculus failed to do in high school: show how the derivaive can be fun!</mark></p>
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

        <div class="ticker-wrap">
          <div class="ticker">
            <div class="ticker__item">AAPL: <mark style='background-color:#FF7F7F; font-family:IBM Plex Mono'>−0.38 (0.22%)↓</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      COST: <mark style='background-color:lightgreen; font-family:IBM Plex Mono'>+6.32 (0.86%)↑</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      GOOGL: <mark style='background-color:lightgreen; font-family:IBM Plex Mono'>+0.50 (0.33%)↑</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      MSFT: <mark style='background-color:lightgreen; font-family:IBM Plex Mono'>+0.25 (0.18%)↑</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      AMZN: <mark style='background-color:#FF7F7F; font-family:IBM Plex Mono'>-1.20 (0.65%)↓</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp 
                                      TSLA: <mark style='background-color:lightgreen; font-family:IBM Plex Mono'>+1.80 (1.20%)↑</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      CALCGRADE: <mark style='background-color:lightgreen; font-family:IBM Plex Mono'>+1000 (1428%)↑</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      NFLX: <mark style='background-color:#FF7F7F; font-family:IBM Plex Mono'>-0.90 (0.60%)↓</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      JPM: <mark style='background-color:lightgreen; font-family:IBM Plex Mono'>+0.70 (0.45%)↑</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      PG: <mark style='background-color:lightgreen; font-family:IBM Plex Mono'>+0.20 (0.15%)↑</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      NVDA: <mark style='background-color:lightgreen; font-family:IBM Plex Mono'>+2.10 (1.50%)↑</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      MA: <mark style='background-color:#FF7F7F; font-family:IBM Plex Mono'>-0.55 (0.40%)↓</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      BA: <mark style='background-color:#FF7F7F; font-family:IBM Plex Mono'>-0.95 (0.70%)↓</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      CRM: <mark style='background-color:lightgreen; font-family:IBM Plex Mono'>+1.30 (0.85%)↑</mark> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      HD: <mark style='background-color:lightgreen; font-family:IBM Plex Mono'>+0.90(0.60%)↑</mark>  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  
                                      </div>
          </div>
      </div>
    </div>
    </section>
    <section id="chart">
      <div id="Graph">
        <Graph />
      </div>
    </section>
    <section id="conclusion">
      <p style="font-size: 23px; width: 450px;"><mark>Hopefully you leave this site with a greater appreciation for the wonders of the derivative! While it may have been 
        annoying to learn years ago, the real world applications go far beyond what we have shown so far. They're used in measuring the size of earthquakes, modeling the growth rate 
        of a virus, estimating profit and loss of a business, and much, much more. We hope that the demos and the special input graph let you learn about and explore different derivatives and 
        their purposes. Thank you for viewing our site!<br> <b style="font-size: 27px">Keep Calm and Derive!</b></mark></p>
    </section>
  </div>
</main>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');

  mark {
    background-color: white;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: Georgia, serif;
  }

  :global(body) {
    margin: 0;
    padding: 0;
  }

  
  .page_controls {
    position: relative;
    top: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: auto;
    left: 5%;
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

  .container {
    scroll-snap-type: y mandatory;
    overflow-x: hidden;
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
    background-image: url('confetti_lines.png'); /* would prefer this file to be in assets but it doesn't work there for some reason, so has to be in components*/
    background-blend-mode: lighten;
    /* background-repeat: no-repeat; */
    /* background-size: cover; */
    display: flex;
    justify-content: center;
    align-items: center;
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
    left: -2%;
  }

  .ball {
      position: absolute;
      top: 50%;
      left: 5%;
      width: 100px;
      height: 100px;
      border-radius: 50%;         /* Turns a square into a circle   */
      background-image: url("Basketball.png");
      background-size: cover;

      animation: bounce 0.5s alternate infinite;

  }

  @keyframes bounce {
      to { transform: translate3d(0, 0, 0)}
      from   { transform: translate3d(0, 20vh, 0)}
  }

  #StockGraph {
    /* center the graph */
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    top: 20%;
    }

  @-webkit-keyframes ticker {
        0% {
          -webkit-transform: translate3d(0, 0, 0);
          transform: translate3d(0, 0, 0);
          visibility: visible;
        }

        100% {
          -webkit-transform: translate3d(-100%, 0, 0);
          transform: translate3d(-100%, 0, 0);
        }
  }

@keyframes ticker {
      0% {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        visibility: visible;
      }

      100% {
        -webkit-transform: translate3d(-100%, 0, 0);
        transform: translate3d(-100%, 0, 0);
      }
}

.ticker-wrap {
  position: absolute;
  bottom: -20%;
  width: 100%;
  overflow: hidden;
  height: 4rem;
  background-color: rgba(#000, 0.9); 
  padding-left: 100%;
  box-sizing: content-box;
  }

.ticker {

    display: inline-block;
    height: 4rem;
    line-height: 4rem;  
    white-space: nowrap;
    padding-right: 100%;
    box-sizing: content-box;

    -webkit-animation-iteration-count: infinite; 
            animation-iteration-count: infinite;
    -webkit-animation-timing-function: linear;
            animation-timing-function: linear;
   -webkit-animation-name: ticker;
           animation-name: ticker;
    -webkit-animation-duration: 150s;
            animation-duration: 150s;

    &__item {

      display: inline-block;

      padding: 0 2rem;
      font-size: 2rem;
      color: white;   

    }

  }

  .ticker__item {
    font-family: 'IBM Plex Mono';
    font-size: 20px;
  }

</style>