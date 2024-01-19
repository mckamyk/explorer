import { eq } from "drizzle-orm";
import { ingestBlock } from "../crypto/blocks";
import db from "../db";
import { blocks, transactions } from "../db/schema";

const numbers = await db.query.blocks.findMany({
  columns: {
    number: true
  },
}).then(r => r.map(b => BigInt(b.number)))

const networkBlocks = await Promise.all(numbers.map(ingestBlock))
const networkTxns = networkBlocks.map(b => b.transactions).flat()

// @ts-ignore
const updates = await db.batch([
  ...networkBlocks.map(b => {
    const d = b.toDb()
    return db.update(blocks).set(d).where(eq(blocks.number, d.number))
  }),
  ...networkTxns.map(t => {
    const x = t.toDb()
    return db.update(transactions).set(x).where(eq(transactions.hash, x.hash))
  })
])

console.log(updates)

// const blocksResponses = Promise.allSettled(networkBlocks.map(async b => {
//   const toInsert = b.toDb()
//   return db.update(blocks).set(toInsert).where(eq(blocks.number, toInsert.number))
// }))
// const txResponses = Promise.allSettled(networkTxns.map(async t => {
//   const toInsert = t.toDb();
//   return db.update(transactions).set(toInsert).where(eq(transactions.hash, toInsert.hash))
// }))


// const blockCounts = (await blocksResponses).reduce((p, c) => {
//   p[c.status]++
//   return p
// }, { fulfilled: 0, rejected: 0 })
// const txCounts = (await txResponses).reduce((p, c) => {
//   p[c.status]++
//   return p
// }, { fulfilled: 0, rejected: 0 })

// console.log("Block Counts:")
// console.table(blockCounts)
// console.log("Txn Counts:")
// console.table(txCounts)

// const foo = (await txResponses).filter(r => r.status === 'rejected')

// console.log(foo[0])

