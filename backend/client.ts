import { createPublicClient, webSocket } from "viem";
import { mainnet } from "viem/chains";

export const client = createPublicClient({
  transport: webSocket("ws://10.0.8.1:30845"),
  chain: mainnet
})

export const latestBlocksSummary = async () => {
  const blockNumber = await client.getBlockNumber().catch(console.error)
  if (!blockNumber) return []

  const a: bigint[] = []
  for (let i = 0; i < 10; i++) {
    a.push(blockNumber - BigInt(i))
  }

  return Promise.all(a.map(blockNumber => client.getBlock({ blockNumber }))).catch(console.error)
}
