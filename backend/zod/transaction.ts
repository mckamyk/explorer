import { z } from 'zod'

const coerce = true

export const txDefault = z.object({
  from: z.string().startsWith("0x"),
  to: z.string().startsWith("0x").optional(),
  hash: z.string().startsWith("0x"),
  timestamp: z.number({ coerce }),
  value: z.bigint({ coerce }),
}).transform(tx => {
  return {
    ...tx,
    toDb: () => txDb.parse(tx)
  }
})


export type TxDefault = z.infer<typeof txDefault>

export const txDb = z.object({
  from: z.string().startsWith("0x"),
  to: z.string().startsWith("0x").optional(),
  hash: z.string().startsWith("0x"),
  timestamp: z.number({ coerce }),
  value: z.string({ coerce })
}).transform(tx => {
  return {
    ...tx,
    toDefault: () => txDefault.parse(tx)
  }
})

export type TxDb = z.infer<typeof txDb>
