import { drizzle } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import { dbBlock } from './schema'
import { eq } from 'drizzle-orm'

const sqlite = new Database('./backend/db/db.sqlite')
export const db = drizzle(sqlite)

export const getBlock = async (number: number) => {
  const resp = await db.select().from(dbBlock).where(eq(dbBlock.number, number)).limit(1)

  if (!resp.length) {
    throw new Error(`Block ${number} not found!`)
  }

  return resp[0]
}

