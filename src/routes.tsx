import { Outlet, RootRoute, Route, Router } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Dashboard from './dashboard'
import Blocks from './block'
import Header from './header'
import BlockDetail from './block/detail'

const rootRoute = new RootRoute({
  component: () => (
    <div>
      <Header />
      <Outlet />
      <TanStackRouterDevtools />
    </div>
  )
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Dashboard />
})

const blocksRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/block/',

  component: () => <Blocks />
})

export const blockDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/block/$blockNumber/',
  parseParams({ blockNumber }) {
    return {
      blockNumber: BigInt(blockNumber)
    }
  },
  component: () => <BlockDetail />
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  blocksRoute,
  blockDetailRoute
])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

