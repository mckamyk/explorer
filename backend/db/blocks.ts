import { eq } from "drizzle-orm"
import db from "."
import { blocks } from './schema'
import { type BlockDefault, blockDefault } from "../zod/blocks"

export const getDbBlock = async (blockNumber: bigint): Promise<BlockDefault | undefined> => {
  const resp = await db.query.blocks.findFirst({
    where: eq(blocks.number, Number(blockNumber)),
    with: {
      transactions: true
    }
  })

  return resp ? blockDefault.parse(resp) : undefined
}
