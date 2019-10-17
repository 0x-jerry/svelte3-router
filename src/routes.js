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
