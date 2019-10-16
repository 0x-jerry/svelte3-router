import { SvelteComponent } from 'svelte/internal'
import { readable } from 'svelte/store'
import { Event } from './Event'
import { sequenceGenerator } from './utils'

export interface IRouteConfig {
  component: SvelteComponent
  /**
   * eg.
   * - /
   * - test
   * - :query
   * - test/:query
   */
  path: string
  children: IRouteConfig[]
}

export interface IRoute {
  path: string
  params?: any
  query?: any
}

export interface IRouteComponent {
  id: number
  component: SvelteComponent
}

let routes: IRouteConfig[] = []

const routeComponentIds: number[] = []

export const nextRouteId = sequenceGenerator()

let _currentRoute: IRoute = {
  path: location.href
}

export const updateOb = new Event<IRoute>()

export const currentRoute = readable(_currentRoute, (set) => {
  const handler = updateOb.on((val) => {
    set(val)
  })!

  set(_currentRoute)

  return () => updateOb.off(handler)
})

export function initializeRoutes(routes: IRouteConfig[]) {
  routes = routes
}

export function appendRoutes(...routes: IRouteConfig[]) {
  routes.push(...routes)
}

export function mountRoute(id: number) {
  routeComponentIds.push(id)
}

export function destroyRoute(id: number) {
  const idx = routeComponentIds.indexOf(id)

  routeComponentIds.splice(idx, 1)
}
