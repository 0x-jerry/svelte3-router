<script>
  import { Router, Route, updateRoute } from "./lib";
  import Test from "./pages/Test.svelte";

  export let name = "hello";
  let path = "/";

  function clickHanlder() {
    if (path === "/") {
      path = "/child";
      updateRoute("/child");
    } else {
      path = "/";
      updateRoute("/");
    }
  }
</script>

<Router>
  <div class="test">
    <button on:click={clickHanlder}>changeRoute</button>
    <Route />
  </div>
</Router>
