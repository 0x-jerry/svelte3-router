<script>
  import { Router, Route, navigateTo } from "./lib";
  import Test from "./pages/Test.svelte";

  export let name = "hello";
  let path = "/";

  function clickHanlder() {
    if (path === "/") {
      path = "/child2";
      navigateTo("/child2");
    } else {
      path = "/";
      navigateTo("/child3");
    }
  }
</script>

<Router>
  <div class="test">
    <button on:click={clickHanlder}>changeRoute</button>
    <Route />
  </div>
</Router>
