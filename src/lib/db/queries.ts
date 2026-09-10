import { db } from '@/lib/db'
import { entries, reflections, users, type Entry, type User } from '@/lib/db/schema'
import { and, gte, lte, eq, desc } from 'drizzle-orm'

const RESURFACE_WINDOWS = [
  { label: 'A week ago', days: 7 },
  { label: 'A month ago', days: 30 },
  { label: 'A year ago', days: 365 },
]

function windowAround(daysAgo: number, radius = 3) {
  const center = new Date()
  center.setDate(center.getDate() - daysAgo)

  const from = new Date(center)
  from.setDate(center.getDate() - radius)

  const to = new Date(center)
  to.setDate(center.getDate() + radius)

  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  }
}

export async function getResurfacedEntries(userId: string) {
  return Promise.all(
    RESURFACE_WINDOWS.map(async ({ label, days }) => {
      const { from, to } = windowAround(days)
      const [entry] = await db
        .select()
        .from(entries)
        .where(and(eq(entries.userId, userId), gte(entries.date, from), lte(entries.date, to)))
        .limit(1)
      return { label, days, entry: entry ?? null }
    })
  )
}

export async function getAllEntries(userId: string): Promise<Entry[]> {
  return db
    .select()
    .from(entries)
    .where(eq(entries.userId, userId))
    .orderBy(desc(entries.date), desc(entries.createdAt))
}

export async function getEntryById(userId: string, id: string): Promise<Entry | null> {
  const [entry] = await db
    .select()
    .from(entries)
    .where(and(eq(entries.id, id), eq(entries.userId, userId)))
  return entry ?? null
}

export async function getAllUsers(): Promise<User[]> {
  return db.select().from(users)
}

export async function getCachedReflection(sourceEntryId: string, targetDate: string) {
  const [row] = await db
    .select()
    .from(reflections)
    .where(and(eq(reflections.sourceEntryId, sourceEntryId), eq(reflections.targetDate, targetDate)))
  return row ?? null
}

export async function cacheReflection(userId: string, sourceEntryId: string, targetDate: string, reflectionText: string) {
  const [row] = await db
    .insert(reflections)
    .values({ userId, sourceEntryId, targetDate, reflectionText })
    .returning()
  return row
}
