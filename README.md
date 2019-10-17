# Svelte3 Router

**Note: This is a test project, just verify my thought.**

Core code in `src/lib`.

routes.js

```js
import { initializeRoutes } from './lib'

import Test from './pages/Test.svelte'
import Test2 from './pages/nest/Test2.svelte'
import Test3 from './pages/nest/Test3.svelte'

initializeRoutes([
  {
    path: '/',
    component: Test,
    children: [
      {
        path: 'child2',
        component: Test2
      },
      {
        path: 'child3',
        component: Test3
      }
    ]
  }
])
```

App.svelte

```html
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
```

Test.svelte

```html
<script>
  import { Route } from "../lib";
</script>

<style>
  h1 {
    color: purple;
  }
</style>

<h1>
  Nest Route
  <Route />
</h1>

```
