import { initTRPC } from "@trpc/server";
import { getBlocks, getBlocksArgs, getLatestBlocks } from './api/blocks'
import { z } from 'zod'
import { txDefault } from "./zod/transaction";
import superjson from 'superjson'
import { blockDefault, blockLight } from "./zod/blocks";
import { tryGetBlock } from "./api/blocks";
import { getLatestTransactions, getTransactions, getTransactionsArgs } from "./api/transactions";


const t = initTRPC.create({
  transformer: superjson
})

const p = t.procedure
const r = t.router

export const appRouter = r({
  latestBlocks: p.output(z.array(blockLight)).query(getLatestBlocks),
  latestTransactions: p.output(z.array(txDefault)).query(getLatestTransactions),

  getBlocks: p.input(getBlocksArgs.default({})).output(z.array(blockLight)).query(({ input }) => getBlocks(input)),
  getBlockDetail: p.input(z.number()).output(blockDefault).query(({ input }) => tryGetBlock(BigInt(input))),

  getTransactions: p.input(getTransactionsArgs.default({})).output(z.array(txDefault)).query(({ input }) => getTransactions(input))
})

export type AppRouter = typeof appRouter
