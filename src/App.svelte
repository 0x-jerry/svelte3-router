<script>
  import { Route, navigateTo } from "../lib";
  import Test from "./Test.svelte";

  export let name = "hello";
  let path = "/";

  function clickHanlder() {
    if (path === "/") {
      path = "/test";
      navigateTo("/test");
    } else {
      path = "/";
      navigateTo("/");
    }
  }
</script>

<div class="test">
  <!-- <button on:click={clickHanlder}>changeRoute</button> -->
  <Test prop="hello" />
  <Route />
</div>
