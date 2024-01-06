import { z } from 'zod'

export const hexString = z.string().startsWith("0x")
