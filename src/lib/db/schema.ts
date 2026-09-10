import { pgTable, uuid, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core'

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

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email'),
  timezone: text('timezone').notNull(), // IANA name, e.g. "America/New_York" — never assume UTC or local dev time
  telegramChatId: text('telegram_chat_id'),
  whatsappNumber: text('whatsapp_number'),
  notifyEmail: boolean('notify_email').notNull().default(false),
  notifyTelegram: boolean('notify_telegram').notNull().default(false),
  notifyWhatsapp: boolean('notify_whatsapp').notNull().default(false),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const reflections = pgTable('reflections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  sourceEntryId: uuid('source_entry_id').notNull(),
  targetDate: text('target_date').notNull(), // YYYY-MM-DD — the day this reflection is meant to surface
  reflectionText: text('reflection_text').notNull(),
  generatedAt: timestamp('generated_at').defaultNow().notNull(),
})

export type Reflection = typeof reflections.$inferSelect
export type NewReflection = typeof reflections.$inferInsert
