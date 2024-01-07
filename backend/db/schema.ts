import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const dbBlock = sqliteTable('blocks', {
  number: integer('number').primaryKey().notNull().unique(),
  hash: text('hash').notNull(),
  recipient: text('recipient').notNull(),
  transactions: text('transactions').notNull(),
  reward: text('reward'),
  timestamp: integer('timestamp').notNull(),
  gasUsed: integer('gasUsed').notNull(),
  gasLimit: integer('gasLimit').notNull(),
  baseFee: integer('baseFee').notNull(),
  burntFees: integer('burntFees').notNull(),
})

export type DbBlock = typeof dbBlock.$inferSelect
export type DbBlockInsert = typeof dbBlock.$inferInsert

