import { eq } from "drizzle-orm";
import db from "../db";
import { TxDefault, txDefault } from "../zod/transaction";
import { transactions, blocks } from '../db/schema'
import { getNetworkBlock } from '../crypto/blocks'

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
