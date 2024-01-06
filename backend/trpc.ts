import { initTRPC } from "@trpc/server";
import { z } from 'zod'

const t = initTRPC.create()

const p = t.procedure
const r = t.router

export const appRouter = r({
  hello: p.input(z.string()).output(z.string()).query(({ input }) => {
    return `Hello, ${input}`
  })
})

export type AppRouter = typeof appRouter
