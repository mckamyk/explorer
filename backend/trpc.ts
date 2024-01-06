import { initTRPC } from "@trpc/server";
import { latestBlocksSummary, latestTransactions } from "./client";

const t = initTRPC.create()

const p = t.procedure
const r = t.router

export const appRouter = r({
  latestBlocks: p.query(latestBlocksSummary),
  latestTransactions: p.query(latestTransactions),
})

export type AppRouter = typeof appRouter
