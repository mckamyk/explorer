import { z } from 'zod'
import { enrichTransaction } from '../api/transactions'

const coerce = true

export const txBase = z.object({
  from: z.string().startsWith("0x"),
  to: z.string().startsWith("0x").optional().nullable(),
  hash: z.string().startsWith("0x"),
  timestamp: z.number({ coerce }),
  value: z.bigint({ coerce }),
  blockNumber: z.bigint({ coerce }),
  burntFees: z.bigint({ coerce }),
  paidFees: z.bigint({ coerce }),
  gasPrice: z.bigint({ coerce }),
})

export type TxBase = z.infer<typeof txBase>

export const txDefault = txBase.transform(tx => {
  return {
    ...tx,
    toDb: () => txDb.parse(tx),
    enrich: async () => enrichTransaction(tx)
  }
})


export type TxDefault = z.infer<typeof txDefault>

export const txDb = z.object({
  from: z.string().startsWith("0x"),
  to: z.string().startsWith("0x").optional().nullable(),
  hash: z.string().startsWith("0x"),
  timestamp: z.number({ coerce }),
  value: z.string({ coerce }),
  blockNumber: z.bigint({ coerce }),
  burntFees: z.string({ coerce }),
  paidFees: z.string({ coerce }),
  gasPrice: z.string({ coerce }),
})

export type TxDb = z.infer<typeof txDb>

export const txEnriched = txBase.extend({
  fromEns: z.string().nullable(),
  toEns: z.string().nullable(),
})

export type TxEnriched = z.infer<typeof txEnriched>
