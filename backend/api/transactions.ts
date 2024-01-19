import { desc, eq } from "drizzle-orm";
import db from "../db";
import { type TxDefault, txDefault } from "../zod/transaction";
import { transactions, blocks } from '../db/schema'
import { getNetworkBlock } from '../crypto/blocks'
import { z } from "zod";

export const getTransactionsArgs = z.object({
  pageSize: z.number().default(20),
  page: z.number().default(0)
})

export const getTransactions = async (args: z.infer<typeof getTransactionsArgs>): Promise<TxDefault[]> => {
  const { page, pageSize } = args
  const resp = await db.query.transactions.findMany({
    orderBy: [desc(transactions.blockNumber)],
    limit: pageSize,
    offset: pageSize * page,
  }).then(txs => txs.map(tx => txDefault.parse(tx)))

  return resp
}

export const getTransactionsInBLock = async (blockNumber: bigint): Promise<TxDefault[]> => {
  const txns = await db.query.transactions.findMany({
    where: eq(transactions.blockNumber, Number(blockNumber))
  })

  if (txns) return txns.map(t => txDefault.parse(t))

  const isIngested = await db.query.blocks.findFirst({
    where: eq(blocks.number, Number(blockNumber))
  }).then(b => !!b)

  if (!isIngested) {
    const block = await getNetworkBlock(blockNumber);
    return block.transactions
  }

  return []
}
