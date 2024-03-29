import { z } from 'zod'
import { txDefault } from './transaction'
import { enrichBlock } from '../api/blocks'

const coerce = true

const blockBase = z.object({
  number: z.bigint({ coerce }),
  hash: z.string().startsWith("0x"),
  recipient: z.string().startsWith("0x"),
  reward: z.bigint({ coerce }),
  timestamp: z.number({ coerce }),
  gasUsed: z.bigint({ coerce }),
  gasLimit: z.bigint({ coerce }),
  baseFee: z.bigint({ coerce }),
  burntFees: z.bigint({ coerce }),
  numTransactions: z.number(),
  extraData: z.string({ coerce }).optional(),
  extraDataParsed: z.string({ coerce }),
  size: z.bigint({ coerce }),
  totalDifficulty: z.bigint({ coerce }),
})

export type BlockBase = z.infer<typeof blockBase>

export const blockLight = blockBase.transform(block => {
  return {
    ...block,
    toDb: () => {
      const newBlock = { ...block } as any
      delete newBlock['transactions']
      return blockDb.parse(newBlock)
    }
  }
})

export type BlockLight = z.infer<typeof blockLight>

export const blockDefault = blockBase.extend({
  transactions: z.array(txDefault),
}).transform(block => {
  return {
    ...block,
    toDb: () => {
      const newBlock = { ...block } as any
      delete newBlock['transactions']
      return blockDb.parse(newBlock)
    },
    toLight: () => {
      const newBlock = { ...block } as any;
      delete newBlock['transatction']
      return blockLight.parse(newBlock)
    },
    enrich: async () => {
      return enrichBlock(block)
    }
  }
})

export type BlockDefault = z.infer<typeof blockDefault>

export const blockDb = z.object({
  number: z.bigint({ coerce }),
  hash: z.string().startsWith("0x"),
  recipient: z.string().startsWith("0x"),
  reward: z.string({ coerce }),
  timestamp: z.number({ coerce }),
  gasUsed: z.string({ coerce }),
  gasLimit: z.string({ coerce }),
  baseFee: z.bigint({ coerce }),
  burntFees: z.string({ coerce }),
  numTransactions: z.number({ coerce }),
  size: z.bigint({ coerce }),
  extraData: z.string({ coerce }),
  extraDataParsed: z.string({ coerce }),
  totalDifficulty: z.string({ coerce }),
}).strict()

export type BlockDb = z.infer<typeof blockDb>

export const blockEnriched = blockBase.extend({
  recipientEns: z.string().nullable(),
})

export type BlockEnriched = z.infer<typeof blockEnriched>
