import { pgTable, uuid, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const entries = pgTable('entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  mode: text('mode', { enum: ['freeform', 'prompted'] }).notNull(),
  freeformText: text('freeform_text'),
  gratitude: text('gratitude'),
  todo: text('todo'),
  affirmations: text('affirmations'),
  didRight: text('did_right'),
  didWrong: text('did_wrong'),
  moodScore: integer('mood_score').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type Entry = typeof entries.$inferSelect
export type NewEntry = typeof entries.$inferInsert
