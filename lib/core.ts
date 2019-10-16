import { SvelteComponent } from 'svelte/internal'
import { readable } from 'svelte/store'
import { Event } from './Event'
import { sequenceGenerator, traverseNode } from './utils'

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

let appRootEl: HTMLElement | null = null

const routeComponentIds: number[] = []

export const nextRouteId = sequenceGenerator()

let _currentRoute: IRoute = {
  path: location.href
}

export const updateRouteOb = new Event<IRoute>()

export const currentRoute = readable(_currentRoute, (set) => {
  const handler = updateRouteOb.on((val) => {
    set(val)
  })!

  set(_currentRoute)

  return () => updateRouteOb.off(handler)
})

export function setRouterRootEl(el: HTMLElement) {
  appRootEl = el
}

export function updateRouteComponentsRelation() {
  if (!appRootEl) {
    return
  }

  traverseNode(appRootEl, (n: HTMLElement) => n.hasAttribute('route-id'), (el) => {
    console.log(el)
  })
}

export function updateRoute(option: IRoute): void
export function updateRoute(path: string, query: any, params: any): void
export function updateRoute(pathOrOption: string | IRoute, query?: any, params?: any): void {
  const option =
    typeof pathOrOption === 'string'
      ? {
          path: pathOrOption,
          query,
          params
        }
      : pathOrOption

  updateRouteOb.emit(option)
}

export function initializeRoutes(routes: IRouteConfig[]) {
  routes = routes
}

export function appendRoutes(...routes: IRouteConfig[]) {
  routes.push(...routes)
}

export function mountRoute(id: number) {
  routeComponentIds.push(id)
  updateRouteComponentsRelation()
}

export function destroyRoute(id: number) {
  const idx = routeComponentIds.indexOf(id)

  routeComponentIds.splice(idx, 1)
  updateRouteComponentsRelation()
}
