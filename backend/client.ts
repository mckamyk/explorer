import { Address, GetTransactionReturnType, createPublicClient, webSocket } from "viem";
import { mainnet } from "viem/chains";
import { z } from 'zod'
import { hexString } from "../src/utilities/zod";

export const client = createPublicClient({
  transport: webSocket("ws://10.0.8.1:30845"),
  chain: mainnet,

})

export type LatestBlocksSummaryReturn = {
  hash: string;
  number: number;
  timestamp: number;
  numTxns: number;
  recipient: Address;
  value: number;
}[]

export const latestBlocksSummary = async (): Promise<LatestBlocksSummaryReturn> => {
  const blockNumber = await client.getBlockNumber().catch(console.error)
  if (!blockNumber) return []

  const a: bigint[] = []
  for (let i = 0; i < 10; i++) {
    a.push(blockNumber - BigInt(i))
  }

  const blocks = await Promise.all(a.map(blockNumber => client.getBlock({ blockNumber, includeTransactions: true })))
  const enriched: LatestBlocksSummaryReturn = blocks.map(block => {
    return {
      number: Number(block.number),
      hash: block.hash,
      timestamp: Number(block.timestamp) * 1000,
      numTxns: block.transactions.length || 0,
      recipient: block.miner,
      value: Number(block.transactions.reduce((p, c) => p + (c.gasPrice || BigInt(0)) * c.gas, BigInt(0)))
    }
  })

  return enriched
}

type LatestTransactionsReturn = {
  from: Address,
  to?: Address,
  hash: string,
  timestamp: number,
  value: string,
}[]

export const latestTransactions = async (): Promise<LatestTransactionsReturn> => {
  const lastBlock = await client.getBlock({ includeTransactions: true });
  const prevBlock = await client.getBlock({ blockNumber: lastBlock.number - BigInt(1), includeTransactions: true })

  let txns = lastBlock.transactions.slice(lastBlock.transactions.length - 10)
  if (txns.length < 10) {
    const older = prevBlock.transactions.slice(prevBlock.transactions.length - 10 + txns.length)
    txns = [...older, ...txns]
  }

  return txns.map(t => {
    return {
      value: t.value.toString(),
      timestamp: Number(lastBlock.number === t.blockNumber ? lastBlock.timestamp : prevBlock.timestamp) * 1000,
      to: t.to || undefined,
      from: t.from,
      hash: t.hash
    }
  })

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
