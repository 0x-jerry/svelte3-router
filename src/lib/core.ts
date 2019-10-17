import { SvelteComponent } from 'svelte/internal'
import { sequenceGenerator, traverseNode, isGrandparent } from './utils'

export interface IRouteProps {
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
  children?: IRouteProps[]
}

interface IRouteConfig extends IRouteProps {
  /**
   * start with 0
   */
  deep?: number
  fullPath?: string
  parent?: IRouteConfig
  children?: IRouteConfig[]
}

interface IRouteCompNode {
  id: number
  el: HTMLElement
  /**
   * start with 0
   */
  deep: number
  parent?: IRouteCompNode
  children: IRouteCompNode[]
}

export interface IRouteUpdateProps {
  path: string
  query?: any
  params?: any
}

export const nextRouteId = sequenceGenerator()

const _routes: IRouteConfig[] = []

let routerRootEl: HTMLElement | undefined

const allRouteComps: IRouteCompNode[] = []

let _currentRoute: IRouteUpdateProps & {
  /**
   * the routes that current active
   */
  active?: Partial<IRouteConfig>
} = {
  path: location.pathname
}

/**
 *
 * @param cb return true to break
 */
function traverseRouteConfig(cb: (route: IRouteConfig) => any) {
  const traverse = (route: IRouteConfig) => {
    if (!!cb(route)) {
      return
    }

    route.children &&
      route.children.forEach((r) => {
        traverse(r)
      })
  }

  _routes.forEach((r) => traverse(r))
}

const routeUpdateListens: { [key: string]: (r: IRouteUpdateProps) => void } = {}

export function addRouteUpdateListener(id: string, cb: (r: IRouteUpdateProps) => void) {
  routeUpdateListens[id] = cb

  setTimeout(() => {
    navigateTo(_currentRoute.path)
  }, 1)
}

export function removeRouteUpdateListener(id: string) {
  delete routeUpdateListens[id]
}

function notifyUpdateRoutes(prop: IRouteUpdateProps) {
  let updateRoute: IRouteConfig | undefined
  const updateRoutes: IRouteConfig[] = []

  traverseRouteConfig((r) => {
    if (r.fullPath === prop.path) {
      updateRoute = r
      return true
    }
  })

  while (updateRoute && updateRoute!.children && updateRoute.children.length > 0) {
    updateRoute = updateRoute!.children[0]
  }

  while (updateRoute) {
    updateRoutes.unshift(updateRoute)
    updateRoute = updateRoute.parent
  }

  if (updateRoutes.length <= 0) {
    console.warn("Can't find routes with path:", prop.path)
    return
  }

  console.log(routeUpdateListens)

  updateRoutes.forEach((r, deep) => {
    const comp = allRouteComps.find((r) => r.deep === deep)

    const cb = comp && routeUpdateListens[comp.id]
    cb && cb(r)
  })
}

export function navigateTo(option: IRouteUpdateProps): void
export function navigateTo(path: string, query?: any, params?: any): void
export function navigateTo(pathOrOption: string | IRouteUpdateProps, query?: any, params?: any): void {
  console.log('navigateTo', _routes, allRouteComps)
  const option: IRouteUpdateProps =
    typeof pathOrOption === 'string'
      ? {
          path: pathOrOption,
          query,
          params
        }
      : pathOrOption

  notifyUpdateRoutes(option)
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

    route.parent = parent

    route.children &&
      route.children.forEach((r) => {
        traverse(r, route)
      })
  }

  _routes.forEach((r) => {
    traverse(r)
  })
}

export function initializeRoutes(routes: IRouteProps[]) {
  _routes.splice(0)
  appendRoutes(...routes)
}

export function appendRoutes(...routes: IRouteProps[]) {
  _routes.push(...routes)
  updateRoutesProps()
}

export function mountRoute() {
  updateRouteCompRelations()
}

export function destroyRoute() {
  updateRouteCompRelations()
}

export function setRouterRootEl(el: HTMLElement) {
  routerRootEl = el
  updateRouteCompRelations()
}

export function updateRouteCompRelations() {
  if (!routerRootEl) {
    return
  }

  const treeRoot: IRouteCompNode = {
    id: null!,
    el: routerRootEl,
    deep: -1,
    parent: undefined,
    children: []
  }

  allRouteComps.splice(0)
  allRouteComps.push(treeRoot)

  traverseNode(
    routerRootEl,
    (n: HTMLElement) => n.hasAttribute('route-id'),
    (el) => {
      let parentComp: IRouteCompNode | null = null

      for (let i = allRouteComps.length - 1; i >= 0; i--) {
        if (isGrandparent(el, allRouteComps[i].el)) {
          parentComp = allRouteComps[i]
          break
        }
      }

      const id = Number(el.getAttribute('route-id'))

      if (parentComp) {
        const route: IRouteCompNode = {
          id,
          el,
          deep: parentComp.deep + 1,
          parent: parentComp === treeRoot ? undefined : parentComp,
          children: []
        }

        parentComp.children.push(route)

        allRouteComps.push(route)
      } else {
        console.warn('Can not find the grandparent node:', id)
      }
    }
  )

  allRouteComps.shift()
  console.log('allRouteComps', allRouteComps)
}
