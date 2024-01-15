import { eq, } from 'drizzle-orm'
import { client } from '../crypto/client.ts'
import db from '../db'
import { BlockDefault, blockDefault } from '../zod/blocks.ts'
import { getNetworkBlock } from '../client.ts'
import { blocks, transactions } from '../db/schema.ts'
import { getDbBlock } from '../db/blocks.ts'

export const tryGetBlock = async (number: bigint): Promise<BlockDefault> => {
  console.log("tryGetBlock:", number)
  const fromDb = await getDbBlock(number)
  console.log("fromDB:", fromDb?.number)
  if (fromDb) {
    return blockDefault.parse(fromDb)
  } else {
    const b = await getNetworkBlock(number)
    const blk = blockDefault.parse(b)
    const newB = await db.insert(blocks).values(blk.toDb()).returning()
    await db.insert(transactions).values([...blk.transactions.map(t => t.toDb())])

    console.log("newB:", newB.length ? newB[0].number : undefined)

    const fromDb = await db.query.blocks.findFirst({
      where: block => eq(block.number, Number(number)), with: {
        transactions: true
      }
    })
    return blockDefault.parse(fromDb)
  }
}

export const getLatestBlocks = async () => {
  const currentBlock = await client.getBlockNumber();

  const outBlocks: Promise<BlockDefault>[] = []
  for (let i = 0; i < 10; i++) {
    outBlocks.push(tryGetBlock(currentBlock - BigInt(i)))
  }

  const blocks = await Promise.all(outBlocks);
  return blocks
}
