import { type TxDefault, txDefault } from "../zod/transaction";
import { getNetworkBlock } from '../crypto/blocks'
import { z } from "zod";
import { prisma } from "../db/prisma";

export const getTransactionsArgs = z.object({
  pageSize: z.number().default(20),
  page: z.number().default(0)
})

export const getTransactionDetail = async (hash: string) => {
  const resp = await prisma.transaction.findUnique({
    where: { hash }
  })

  return txDefault.parse(resp)
}

export const getTransactions = async (args: z.infer<typeof getTransactionsArgs>): Promise<TxDefault[]> => {
  const { page, pageSize } = args
  const resp = await prisma.transaction.findMany({
    orderBy: {
      blockNumber: 'desc'
    },
    take: pageSize,
    skip: page * pageSize,
  }).then(txs => txs.map(tx => txDefault.parse(tx)))

  return resp
}

export const getLatestTransactions = async () => {
  return prisma.transaction.findMany({
    orderBy: {
      blockNumber: 'desc'
    },
    take: 10
  }).then(txs => txs.map(tx => txDefault.parse(tx)))
}

export const getTransactionsInBlock = async (blockNumber: bigint): Promise<TxDefault[]> => {
  const txns = await prisma.transaction.findMany({
    where: {
      blockNumber
    }
  }).then(txs => txs.map(tx => txDefault.parse(tx)))

  const isIngested = await prisma.block.findFirst({
    where: {
      number: blockNumber
    }
  }).then(b => !!b)

  if (!isIngested) {
    const block = await getNetworkBlock(blockNumber);
    return block.transactions
  }

  return txns
}
