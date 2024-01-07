import { z } from 'zod'
import { txDefault } from './transaction'

const coerce = true

export const blockBase = z.object({
  number: z.bigint({ coerce }),
  hash: z.string().startsWith("0x"),
  recipient: z.string().startsWith("0x"),
  reward: z.bigint({ coerce }).optional(),
  timestamp: z.number({ coerce }),
  gasUsed: z.bigint({ coerce }),
  gasLimit: z.bigint({ coerce }),
  baseFee: z.bigint({ coerce }),
  burntFees: z.bigint({ coerce }),
  transactions: z.array(z.string()),
})

export type BlockBase = z.infer<typeof blockBase>

export const blockLight = blockBase.transform(b => {
  return {
    ...b,
    toDb: () => blockDb.parse(b)
  }
})

export type BlockDefault = z.infer<typeof blockLight>

export const blockDb = z.object({
  number: z.number({ coerce }),
  hash: z.string().startsWith("0x"),
  recipient: z.string().startsWith("0x"),
  reward: z.string({ coerce }),
  timestamp: z.number({ coerce }),
  gasUsed: z.string({ coerce }),
  gasLimit: z.string({ coerce }),
  baseFee: z.number({ coerce }),
  burntFees: z.string({ coerce }),
  transactions: z.array(z.string()).transform(a => JSON.stringify(a)),
}).transform(b => {
  return {
    ...b,
    toLight: () => blockLight.parse(b),
  }
})

export type BlockDb = z.infer<typeof blockDb>

export const blockWithTransactions = blockBase.extend({
  transactions: z.array(txDefault)
}).transform(b => {
  return {
    ...b,
    toDefault: () => blockLight.parse({
      ...b,
      transactions: b.transactions.map(t => t.hash)
    }),
    toDb: () => blockDb.parse({
      ...b,
      transaction: b.transactions.map(t => t.hash)
    })
  }
})

export type BlockWithTransactions = z.infer<typeof blockWithTransactions>

