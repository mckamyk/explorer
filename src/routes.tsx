import { Outlet, RootRoute, Route, Router } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Dashboard from './dashboard'
import Blocks from './block'
import Header from './header'
import BlockDetail from './block/detail'

const rootRoute = new RootRoute({
  component: () => (
    <>
      <Header />
      <div className="flex justify-center my-10">
        <div className="max-w-[1200px] w-full">
          <Outlet />
        </div>
      </div>
      <TanStackRouterDevtools />
    </>
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
      blockNumber: Number(blockNumber)
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

