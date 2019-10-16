import { SvelteComponent, identity } from 'svelte/internal'
import { readable } from 'svelte/store'
import { Event } from './Event'
import { sequenceGenerator, traverseNode, isGrandparent } from './utils'

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
  name?: string
  children?: IRouteConfig[]
  /**
   * @private
   */
  deep?: number
  /**
   * @private
   */
  fullPath?: string
}

export interface IRoute {
  path: string
  component?: SvelteComponent
  params?: any
  query?: any
}

export interface IRouteNode {
  id: number
  el: HTMLElement
  deep: number
  children: IRouteNode[]
}

export interface IRouteComponent {
  id: number
  component: SvelteComponent
}

let _routes: IRouteConfig[] = []

let appRootEl: HTMLElement | null = null

const routeTree: IRouteNode = {
  id: null!,
  el: null!,
  deep: 0,
  children: []
}

let allRouteComponents: IRouteNode[] = []

const routeComponentIds: number[] = []

export const nextRouteId = sequenceGenerator()

let _currentRoute: IRoute = {
  path: location.href
}

export const updateRouteOb = new Event<IRoute>()

export const currentRoute = readable(_currentRoute, (set) => {
  const handler = updateRouteOb.on('default', (val) => {
    set(val)
  })!

  set(_currentRoute)

  return () => updateRouteOb.off('default', handler)
})

export function setRouterRootEl(el: HTMLElement) {
  appRootEl = el
}

export function updateRouteComponentsRelation() {
  if (!appRootEl) {
    setTimeout(() => {
      updateRouteComponentsRelation()
    }, 1)
    return
  }

  routeTree.el = appRootEl
  routeTree.deep = 0
  routeTree.children = []
  allRouteComponents = [routeTree]

  traverseNode(
    appRootEl,
    (n: HTMLElement) => n.hasAttribute('route-id'),
    (el) => {
      const parent = allRouteComponents.find((info) => isGrandparent(el, info.el))
      const id = Number(el.getAttribute('route-id'))
      console.log('id', id, el)

      if (parent) {
        const route: IRouteNode = {
          id,
          el,
          deep: parent.deep + 1,
          children: []
        }

        parent.children.push(route)

        allRouteComponents.push(route)
      } else {
        console.warn('Can not find the grandparent node:', id)
      }
    }
  )
}

function traverseRouteConfig(cb: (route: IRouteConfig) => void) {
  const traverse = (route: IRouteConfig) => {
    cb(route)
    route.children &&
      route.children.forEach((r) => {
        traverse(r)
      })
  }

  _routes.forEach((r) => traverse(r))
}

function notifyRoutes(option: IRoute) {
  let route: IRouteConfig | null = null

  traverseRouteConfig((r) => {
    if (r.fullPath === option.path) {
      route = r
    }
  })

  if (route) {
    const comp = allRouteComponents.find((r) => r.deep === route!.deep)
    if (!comp) return

    option.component = route!.component
    console.log(`Update route ${comp.id}:`, route, comp)

    updateRouteOb.emit('default', option)
    updateRouteOb.emit(comp.id.toString(), option)
  }
}

export function updateRoute(option: IRoute): void
export function updateRoute(path: string, query?: any, params?: any): void
export function updateRoute(pathOrOption: string | IRoute, query?: any, params?: any): void {
  const option =
    typeof pathOrOption === 'string'
      ? {
          path: pathOrOption,
          query,
          params
        }
      : pathOrOption

  notifyRoutes(option)
}

function updateRoutesProps() {
  const traverse = (route: IRouteConfig, parent?: IRouteConfig) => {
    if (parent) {
      route.deep = parent.deep! + 1

      route.fullPath = parent.fullPath! + (parent.fullPath!.endsWith('/') ? '' : '/') + route.path
    } else {
      route.deep = 0
      route.fullPath = route.path
    }

    route.children &&
      route.children.forEach((r) => {
        traverse(r, route)
      })
  }

  _routes.forEach((r) => {
    traverse(r)
  })
}

export function initializeRoutes(routes: IRouteConfig[]) {
  _routes = routes
  updateRoutesProps()
}

export function appendRoutes(...routes: IRouteConfig[]) {
  _routes.push(...routes)
  updateRoutesProps()
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
