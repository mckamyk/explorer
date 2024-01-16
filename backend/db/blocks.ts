import { eq } from "drizzle-orm"
import db from "."
import { blocks } from './schema'
import { type BlockDefault, blockDefault, BlockLight, blockLight } from "../zod/blocks"

export const getDbBlockLight = async (blockNumber: bigint): Promise<BlockLight | undefined> => {
  const resp = await db.query.blocks.findFirst({
    where: eq(blocks.number, Number(blockNumber))
  })

  return resp ? blockLight.parse(resp) : undefined
}

export const getDbBlock = async (blockNumber: bigint): Promise<BlockDefault | undefined> => {
  const resp = await db.query.blocks.findFirst({
    where: eq(blocks.number, Number(blockNumber)),
    with: {
      transactions: true
    }
  })

  return resp ? blockDefault.parse(resp) : undefined
}
