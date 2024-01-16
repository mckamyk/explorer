import { relations } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const blocks = sqliteTable('blocks', {
  number: integer('number').notNull().primaryKey(),
  hash: text('hash').notNull(),
  recipient: text('recipient').notNull(),
  reward: text('reward'),
  timestamp: integer('timestamp').notNull(),
  gasUsed: text('gasUsed').notNull(),
  gasLimit: text('gasLimit').notNull(),
  baseFee: integer('baseFee').notNull(),
  burntFees: text('burntFees').notNull(),
  numTransactions: integer('numTransactions').notNull()
})

export type Block = typeof blocks.$inferSelect
export type BlockInsert = typeof blocks.$inferInsert

export const transactions = sqliteTable('transactions', {
  hash: text("hash").notNull().primaryKey(),
  from: text('from').notNull(),
  to: text('to'),
  timestamp: integer("timestamp").notNull(),
  value: text("value"),
  blockNumber: integer('blockNumber').notNull(),
})

export type Transaction = typeof transactions.$inferSelect
export type TransactionInsert = typeof transactions.$inferInsert

export const blockTxnRelations = relations(blocks, ({ many }) => ({
  transactions: many(transactions)
}))

export const txnBlockRelation = relations(transactions, ({ one }) => ({
  blockNumber: one(blocks, {
    fields: [transactions.blockNumber],
    references: [blocks.number]
  })
}))

