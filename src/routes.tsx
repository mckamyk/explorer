import { Outlet, RootRoute, Route, Router } from '@tanstack/react-router'
import dashboard from './dashboard'
import blocks from './dashboard/blocks'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

const rootRoute = new RootRoute({
  component: () => {
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  }
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: dashboard
})

const blocksRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/blocks',
  component: blocks
})

const routeTree = rootRoute.addChildren([indexRoute, blocksRoute])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

