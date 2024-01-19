import { getNetworkBlock } from "../crypto/blocks"
import { type BlockDefault, blockDefault, BlockLight, blockLight } from "../zod/blocks"
import { txDb } from "../zod/transaction"
import { prisma } from "./prisma"

export const ingestBlock = async (blockNumber: bigint) => {
  if (await getDbBlockLight(blockNumber)) return

  const block = await getNetworkBlock(blockNumber)
  await prisma.block.upsert({
    where: {
      number: blockNumber
    },
    include: {
      transactions: true
    },
    update: {},
    create: {
      ...block.toDb(),
      transactions: {
        createMany: {
          data: block.transactions.map(tx => ({
            ...txDb.parse(tx),
            blockNumber: undefined
          }))
        }
      }
    }
  })
}

export const getDbBlockLight = async (blockNumber: bigint): Promise<BlockLight | undefined> => {
  const resp = await prisma.block.findUnique({
    where: {
      number: blockNumber
    }
  })

  return resp ? blockLight.parse(resp) : undefined
}

export const getDbBlock = async (blockNumber: bigint): Promise<BlockDefault | undefined> => {
  const resp = await prisma.block.findUnique({
    where: {
      number: blockNumber,
    },
    include: {
      transactions: true
    }
  })

  return resp ? blockDefault.parse(resp) : undefined
}
