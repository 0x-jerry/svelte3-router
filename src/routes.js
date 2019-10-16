import { addRoutes } from '../lib'

import Test from './Test.svelte'
import Test2 from './Test2.svelte'

addRoutes([
  {
    path: '/',
    component: Test,
    children: [
      {
        path: 'child1',
        component: Test2
      }
    ]
  }
])
