import { Outlet, RootRoute, Route, Router } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Dashboard from './dashboard'
import Blocks from './block'
import Header from './header'

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
  path: '/block',
  component: () => <Blocks />
})

const routeTree = rootRoute.addChildren([indexRoute, blocksRoute])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

