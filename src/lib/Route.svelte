<script>
  import s from "svelte";
  import {
    mountRoute,
    destroyRoute,
    nextRouteId,
    addRouteUpdateListener,
    removeRouteUpdateListener
  } from "./core";
  const { onMount, onDestroy } = s;

  let id = nextRouteId();
  let route = {};

  $: routeProp = {
    fullpath: route.fullPath,
    query: route.query,
    params: route.params
  };

  onMount(() => {
    mountRoute();
    addRouteUpdateListener(id, r => {
      if (route.component === r.component) {
        return;
      }
      route = r;
    });
  });

  onDestroy(() => {
    destroyRoute();
    removeRouteUpdateListener(id);
  });
</script>

<style>
  .router {
    border: 1px solid red;
  }
</style>

<div class="router" route-id={id}>
  {#if !!route.component}
    <svelte:component this={route.component} route={routeProp} />
  {/if}
</div>
