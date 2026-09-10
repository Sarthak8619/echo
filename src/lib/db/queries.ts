import { db } from '@/lib/db'
import { entries, type Entry } from '@/lib/db/schema'
import { and, gte, lte, eq, desc } from 'drizzle-orm'

const RESURFACE_WINDOWS = [
  { label: '1 week ago', days: 7 },
  { label: '1 month ago', days: 30 },
  { label: '1 year ago', days: 365 },
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
      return { label, entry: entry ?? null }
    })
  )
}

export async function getAllEntries(userId: string): Promise<Entry[]> {
  return db
    .select()
    .from(entries)
    .where(eq(entries.userId, userId))
    .orderBy(desc(entries.date))
}
