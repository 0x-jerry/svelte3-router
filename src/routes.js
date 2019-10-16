import { initializeRoutes } from './lib'

import Test from './pages/Test.svelte'
import Test2 from './pages/nest/Test2.svelte'

initializeRoutes([
  {
    path: '/',
    component: Test,
    children: [
      {
        path: 'child',
        component: Test2
      }
    ]
  }
])
