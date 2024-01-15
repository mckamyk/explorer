import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema'
import { createClient } from '@libsql/client'

if (!Bun.env.DB_URL || !Bun.env.DB_TOKEN) throw new Error("DB Creds and/or URL not specified (DB_HOST DB_TOKEN)")

const sqlite = createClient({ url: Bun.env.DB_URL, authToken: Bun.env.DB_TOKEN })
const db = drizzle(sqlite, { schema })

export default db

