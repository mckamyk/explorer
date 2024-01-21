import { client } from '../crypto/client.ts'
import { BlockBase, BlockDefault, BlockEnriched, BlockLight, blockDefault, blockEnriched, blockLight } from '../zod/blocks.ts'
import { getDbBlock, getDbBlockLight, ingestBlock } from '../db/blocks.ts'
import { z } from 'zod'
import { prisma } from '../db/prisma.ts'
import { getEns } from './helpers.ts'

export const enrichBlock = async (block: BlockBase): Promise<BlockEnriched> => {
  const recipientEns = await getEns(block.recipient)

  return blockEnriched.parse({
    ...block,
    recipientEns
  } as BlockEnriched)
}

export const tryGetBlockLight = async (number: bigint): Promise<BlockLight> => {
  const fromDb = await getDbBlockLight(number)
  if (fromDb) {
    return fromDb
  }

  await ingestBlock(number)

  const newB = await getDbBlockLight(number)
  if (!newB) throw new Error(`Error ingesting new block ${number}`)

  return newB
}

export const tryGetBlock = async (number: bigint): Promise<BlockDefault> => {
  const fromDb = await getDbBlock(number)
  if (fromDb) {
    return blockDefault.parse(fromDb)
  }

  await ingestBlock(number)

  const newB = await getDbBlock(number)
  if (!newB) throw new Error(`Error ingesting new block ${number}`)

  return newB
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

  const dbNumbers = await prisma.block.findMany({
    where: {
      number: {
        lte: max,
        gte: min,
      }
    },
    select: {
      number: true
    }
  }).then(r => r.map(d => d.number))

  const missing = numbers.filter(n => !dbNumbers.includes(n))
  await Promise.all(missing.map(tryGetBlock))

  const allBlocks = await prisma.block.findMany({
    where: {
      number: {
        lte: max,
        gte: min,
      }
    },
  }).then(r => r.map(b => blockLight.parse(b)))

  return allBlocks
}
