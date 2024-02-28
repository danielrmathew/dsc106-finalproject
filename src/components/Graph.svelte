<script>
    import { onMount } from "svelte";
  
    onMount(() => {
      // Any additional setup or interactions can be added here
    });
  </script>
  
  <style>
    .graph-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  
    .quadrant {
      position: absolute;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  
    .x-axis,
    .y-axis {
      position: absolute;
      background-color: #ccc;
      box-sizing: border-box;
    }
  
    .x-axis {
      height: 1px;
      width: 100%;
      left: 0;
    }
  
    .y-axis {
      height: 100%;
      width: 1px;
      top: 0;
    }
  </style>
  
  <div class="graph-container">
    <!-- Quadrant 1 -->
    <div class="quadrant" style="top: 0; left: 0; width: 50%; height: 50%;"></div>
    <!-- Quadrant 2 -->
    <div class="quadrant" style="top: 0; left: 50%; width: 50%; height: 50%;"></div>
    <!-- Quadrant 3 -->
    <div class="quadrant" style="top: 50%; left: 0; width: 50%; height: 50%;"></div>
    <!-- Quadrant 4 -->
    <div class="quadrant" style="top: 50%; left: 50%; width: 50%; height: 50%;"></div>
  
    <!-- X-Axis -->
    <div class="x-axis" style="top: 50%;"></div>
    <!-- Y-Axis -->
    <div class="y-axis" style="left: 50%;"></div>
  </div>
  