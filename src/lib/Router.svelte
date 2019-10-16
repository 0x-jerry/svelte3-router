<script>
  import s from "svelte";
  import { setRouterRootEl } from "./core";
  const { onMount } = s;

  let routerEl = null;

  onMount(() => {
    setRouterRootEl(routerEl);
  });
</script>

<div class="router" bind:this={routerEl}>
  <slot />
</div>
