<script>
  import { Router, Route, navigateTo } from "./lib";
  import Test from "./pages/Test.svelte";

  export let name = "hello";
  let switchPath = true;

  function clickHanlder() {
    if (switchPath) {
      navigateTo("/child3");
    } else {
      navigateTo("/child2");
    }

    switchPath = !switchPath;
  }
</script>

<Router>
  <div class="test">
    <button on:click={clickHanlder}>changeRoute</button>
    <Route />
  </div>
</Router>
