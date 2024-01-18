import { eq } from "drizzle-orm";
import { ingestBlock } from "../crypto/blocks";
import db from "../db";
import { blocks } from "../db/schema";

const numbers = await db.query.blocks.findMany({
  columns: {
    number: true
  },
}).then(r => r.map(b => BigInt(b.number)))

const networkBlocks = await Promise.all(numbers.map(ingestBlock)).then(bs => bs.map(b => b.toDb()))

const responses = await Promise.allSettled(networkBlocks.map(async b => {
  return db.update(blocks).set({ ...b }).where(eq(blocks.number, b.number))
}))

const counts = responses.reduce((p, c) => {
  p[c.status]++
  return p
}, { fulfilled: 0, rejected: 0 })

console.table(counts)

