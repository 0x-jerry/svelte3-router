<script>
  import { onMount, onDestroy } from 'svelte';
  import { mountRoute, destroyRoute, nextRouteId } from "./core";

  let id = nextRouteId()

  onMount(() => {
    mountRoute(id)
  })

  onDestroy(() => {
    destroyRoute(id)
  })
</script>

<style>
  .router {
    border: 1px solid red;
  }
</style>

<div class="router" route-id={id}>
  <!-- {#if !!selfRoute.component}
    <svelte:component this={selfRoute.component} route={selfRoute} />
  {/if} -->
</div>
