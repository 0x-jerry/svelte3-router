<script>
  import { Router, Route, navigateTo } from "./lib";

  let switchFlag = true;

  function clickHandler() {
    if (switchFlag) {
      navigateTo("/child3");
    } else {
      navigateTo("/child2");
    }

    switchFlag = !switchFlag;
  }
</script>

<Router>
  <div class="test">
    <button on:click={clickHandler}>changeRoute</button>
    <Route />
  </div>
</Router>
