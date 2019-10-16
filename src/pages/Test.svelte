<script>
  import { Route } from "../lib";

  export let prop = "ok";
  export let route = {};
  console.log("test", route);
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>
  Hello {prop}!
  <Route />
</h1>
