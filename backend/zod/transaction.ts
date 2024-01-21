import { z } from 'zod'

const coerce = true

export const txDefault = z.object({
  from: z.string().startsWith("0x"),
  to: z.string().startsWith("0x").optional().nullable(),
  hash: z.string().startsWith("0x"),
  timestamp: z.number({ coerce }),
  value: z.bigint({ coerce }),
  blockNumber: z.bigint({ coerce }),
  burntFees: z.bigint({ coerce }),
  paidFees: z.bigint({ coerce }),
  gasPrice: z.bigint({ coerce }),
}).transform(tx => {
  return {
    ...tx,
    toDb: () => txDb.parse(tx),
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
