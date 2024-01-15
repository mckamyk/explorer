import { blockDefault } from "../zod/blocks"
import { client } from "./client"

export const getNetworkBlockFull = async (blockNumber: bigint) => {
  const b = await client.getBlock({ blockNumber, includeTransactions: true })

  const fees = b.transactions.map(async t => {
    const receipt = await client.getTransactionReceipt({ hash: t.hash })
    return receipt.gasUsed * (t.gasPrice! - b.baseFeePerGas!)
  })

  const newTx = b.transactions.map(t => {
    return {
      ...t,
      timestamp: Number(b.timestamp) * 1000,
      blockNumber: b.number
    }
  })

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
    transactions: newTx,
    hash: b.hash
  })
}
