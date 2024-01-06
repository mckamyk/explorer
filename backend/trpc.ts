import { initTRPC } from "@trpc/server";
import { latestBlocksSummary } from "./client";

const t = initTRPC.create()

const p = t.procedure
const r = t.router

export const appRouter = r({
  latestBlocks: p.query(async () => {
    const blocks = await latestBlocksSummary();
    return blocks ? blocks.map(block => {
      return {
        number: block.number.toString(),
        timestamp: Number(block.timestamp.toString()) * 1000,
        miner: block.miner,
        numTxns: block.transactions.length,
      }
    }) : []
  })
})

export type AppRouter = typeof appRouter
