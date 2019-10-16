<script>
  import s from "svelte";
  import { mountRoute, destroyRoute, nextRouteId, updateRouteOb } from "./core";
  const { onMount, onDestroy } = s;

  let id = nextRouteId();
  let route = {};

  updateRouteOb.on(id.toString(), r => {
    route = r;
  });

  onMount(() => {
    mountRoute(id);
  });

  onDestroy(() => {
    destroyRoute(id);
  });
</script>

<style>
  .router {
    border: 1px solid red;
  }
</style>

<div class="router" route-id={id}>
  {#if !!route.component}
    <svelte:component this={route.component} {route} />
  {/if}
</div>
