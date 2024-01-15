import { createPublicClient, webSocket } from "viem";
import { mainnet } from "viem/chains";

export const client = createPublicClient({
  transport: webSocket("ws://10.0.8.1:30845"),
  chain: mainnet,
})

