import { client } from './client'
import { db, getBlock } from './db'
import { z } from 'zod'
import { dbBlock } from './db/schema'
import { getBlockFromNetwork } from './client'

const b = await getBlockFromNetwork(BigInt(16999999), { calculateReward: true })

tryDbForBlock();

