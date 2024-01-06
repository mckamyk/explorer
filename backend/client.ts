import { Address, createPublicClient, webSocket } from "viem";
import { mainnet } from "viem/chains";

export const client = createPublicClient({
  transport: webSocket("ws://10.0.8.1:30845"),
  chain: mainnet
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
