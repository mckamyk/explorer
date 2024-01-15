import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { trpcServer } from '@hono/trpc-server'
import { appRouter } from './trpc'
import "./db"

const app = new Hono()

app.use('*', logger())
app.use('/trpc/*', trpcServer({ router: appRouter }))

export default {
  port: 4000,
  fetch: app.fetch
}

