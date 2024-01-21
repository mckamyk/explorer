import { client } from "../crypto/client";
import { ingestBlock } from "../db/blocks";

const currentBn = await client.getBlockNumber();

for (let i = 0; i < 20; i++) {
  const bn = currentBn - BigInt(i)
  await ingestBlock(bn)
  console.log("Ingested Block", bn)
}


