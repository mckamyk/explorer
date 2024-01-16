import { initTRPC } from "@trpc/server";
import { getBlocks, getBlocksArgs, getBlocksReturn, latestBlocksSummary, latestTransactions } from "./client";
import { z } from 'zod'
import { txDefault } from "./zod/transaction";
import superjson from 'superjson'
import { blockLight } from "./zod/blocks";


const t = initTRPC.create({
  transformer: superjson
})

const p = t.procedure
const r = t.router

export const appRouter = r({
  latestBlocks: p.output(z.array(blockLight)).query(latestBlocksSummary),
  latestTransactions: p.output(z.array(txDefault)).query(latestTransactions),
  getBlocks: p.input(getBlocksArgs.default({})).output(getBlocksReturn).query(({ input }) => {
    return getBlocks(input)
  })
})

export type AppRouter = typeof appRouter
