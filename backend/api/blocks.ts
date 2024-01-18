import { and, desc, eq, gte, lte, } from 'drizzle-orm'
import { client } from '../crypto/client.ts'
import db from '../db'
import { BlockDefault, BlockLight, blockDefault, blockLight } from '../zod/blocks.ts'
import { getNetworkBlock } from '../crypto/blocks'
import { blocks, transactions } from '../db/schema.ts'
import { getDbBlock, getDbBlockLight } from '../db/blocks.ts'
import { z } from 'zod'

export const tryGetBlockLight = async (number: bigint): Promise<BlockLight> => {
  const fromDb = await getDbBlockLight(number)
  if (fromDb) {
    return fromDb
  }

  const b = await getNetworkBlock(number).then(b => blockDefault.parse(b))
  await Promise.all([
    await db.insert(blocks).values(b.toDb()).onConflictDoNothing({ target: blocks.number }),
    await db.insert(transactions).values([...b.transactions.map(t => t.toDb())]).onConflictDoNothing(({ target: transactions.hash }))
  ])

  const newB = await getDbBlockLight(number)
  if (!newB) throw new Error(`Error ingesting new block ${number}`)

  return newB
}

export const tryGetBlock = async (number: bigint): Promise<BlockDefault> => {
  const fromDb = await getDbBlock(number)
  if (fromDb) {
    return blockDefault.parse(fromDb)
  } else {
    console.log(`Cache miss on ${number}`)
    const b = await getNetworkBlock(number)
    const blk = blockDefault.parse(b)
    await Promise.all([
      db.insert(blocks).values(blk.toDb()).returning().onConflictDoNothing({ target: blocks.number }),
      db.insert(transactions).values([...blk.transactions.map(t => t.toDb())]).onConflictDoNothing({ target: transactions.hash })
    ])

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

export const getBlocksArgs = z.object({
  pageSize: z.number().default(20),
  page: z.number().default(0)
})

export const getBlocks = async ({ page, pageSize }: z.infer<typeof getBlocksArgs>): Promise<BlockLight[]> => {
  const currentBlock = await client.getBlockNumber();

  const numbers: bigint[] = []
  for (let i = page * pageSize; i < page * pageSize + pageSize; i++) {
    numbers.push(currentBlock - BigInt(i))
  }

  const min = Number(numbers.sort()[0])
  const max = Number(numbers.sort()[numbers.length - 1])

  const dbNumbers = await db.query.blocks.findMany({
    where: and(lte(blocks.number, max), gte(blocks.number, min)),
    columns: { number: true }
  }).then(r => r.map(({ number }) => BigInt(number)))

  const missing = numbers.filter(n => !dbNumbers.includes(n))
  await Promise.all(missing.map(tryGetBlock))

  const allBlocks = db.query.blocks.findMany({
    where: and(lte(blocks.number, max), gte(blocks.number, min)),
    orderBy: [desc(blocks.number)]
  }).then(r => r.map(b => blockLight.parse(b)))

  return allBlocks
}
