import { initTRPC } from "@trpc/server";
import { getBlocks, getBlocksArgs, getBlocksReturn, latestBlocksSummary, latestTransactions } from "./client";

const t = initTRPC.create()

const p = t.procedure
const r = t.router

export const appRouter = r({
  latestBlocks: p.query(latestBlocksSummary),
  latestTransactions: p.query(latestTransactions),
  getBlocks: p.input(getBlocksArgs.default({})).output(getBlocksReturn).query(({ input }) => {
    return getBlocks(input)
  })
})

export type AppRouter = typeof appRouter
