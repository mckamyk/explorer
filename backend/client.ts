import { GetTransactionReturnType, createPublicClient, webSocket } from "viem";
import { mainnet } from "viem/chains";
import { z } from 'zod'
import { hexString } from "../src/utilities/zod";
import { BlockLight, blockDefault } from "./zod/blocks";
import { tryGetBlockLight } from "./api/blocks";
import { getTransactionsInBLock } from "./api/transactions";
import { TxDefault } from "./zod/transaction";

export const client = createPublicClient({
  transport: webSocket("ws://10.0.8.1:30845"),
  chain: mainnet,
})

export const getNetworkBlock = async (blockNumber: bigint) => {
  const b = await client.getBlock({ blockNumber, includeTransactions: true })

  const fees = b.transactions.map(async t => {
    const receipt = await client.getTransactionReceipt({ hash: t.hash })
    return receipt.gasUsed * (t.gasPrice! - b.baseFeePerGas!)
  })

  const txns = b.transactions.map(t => ({
    ...t,
    timestamp: Number(b.timestamp) * 1000,
    blockNumber: b.number,
  }))

  return blockDefault.parse({
    timestamp: Number(b.timestamp) * 1000,
    number: b.number,
    gasUsed: b.gasUsed,
    gasLimit: b.gasLimit,
    reward: await Promise.all(fees).then(fee => fee.reduce((p, c) => p + c)),
    numTxns: b.transactions.length,
    baseFee: b.baseFeePerGas,
    burntFees: b.baseFeePerGas! * b.gasUsed,
    recipient: b.miner,
    transactions: txns,
    hash: b.hash
  })
}

export const latestBlocksSummary = async (): Promise<BlockLight[]> => {
  const blockNumber = await client.getBlockNumber().catch(console.error)
  if (!blockNumber) return []

  const proms: Promise<BlockLight>[] = []
  for (let i = 0; i < 10; i++) {
    const number = blockNumber - BigInt(i)
    proms.push(tryGetBlockLight(number))
  }

  return Promise.all(proms)
}

export const latestTransactions = async (): Promise<TxDefault[]> => {
  const blockNumber = await client.getBlockNumber();
  const transactions = await getTransactionsInBLock(blockNumber)
  if (transactions.length < 10) transactions.push(...(await getTransactionsInBLock(blockNumber - BigInt(1))))

  return transactions.slice(0, 10)
}

export const getBlocksReturn = z.array(z.object({
  number: z.number({ coerce: true }),
  timestamp: z.number({ coerce: true }),
  numTxns: z.number(),
  recipient: hexString,
  gas: z.object({
    used: z.number({ coerce: true }),
    limit: z.number({ coerce: true })
  }),
  baseFee: z.number({ coerce: true }),
  reward: z.number({ coerce: true }),
  burntFees: z.number({ coerce: true })
}))

export const getBlocksArgs = z.object({
  pageSize: z.number().default(20),
  page: z.number().default(0)
})

export const getBlocks = async ({ page, pageSize }: z.infer<typeof getBlocksArgs>): Promise<z.infer<typeof getBlocksReturn>> => {
  const currentBlock = await client.getBlockNumber();

  const numbers: bigint[] = []
  for (let i = page * pageSize; i < page * pageSize + pageSize; i++) {
    numbers.push(currentBlock - BigInt(i))
  }

  const blocks = await Promise.all(numbers.map(blockNumber => client.getBlock({ blockNumber, includeTransactions: true })))
  const formatted = blocks.map(async b => {
    const burned = maybeBigInt(b.baseFeePerGas) * b.gasUsed
    const fees = b.transactions.map(async t => {
      const receipt = await client.getTransactionReceipt({ hash: t.hash })
      return receipt.gasUsed * (t.gasPrice! - b.baseFeePerGas!)
    })

    return {
      timestamp: b.timestamp * BigInt(1000),
      number: b.number,
      gas: {
        used: b.gasUsed,
        limit: b.gasLimit
      },
      reward: await Promise.all(fees).then(fee => fee.reduce((p, c) => p + c)),
      numTxns: b.transactions.length,
      baseFee: b.baseFeePerGas,
      burntFees: burned,
      recipient: b.miner
    }
  })

  return getBlocksReturn.parse(await Promise.all(formatted))
}

export const calculateTransactionReward = (tx: GetTransactionReturnType, base: bigint): bigint => {
  const price = tx.gasPrice!

  return price - base
}

const maybeBigInt = (n: bigint | null | undefined): bigint => {
  return n ? n : BigInt(0)
}
