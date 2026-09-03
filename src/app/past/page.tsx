import { db } from '@/lib/db'
import { entries, type Entry } from '@/lib/db/schema'
import { and, gte, lte, eq } from 'drizzle-orm'
import Link from 'next/link'

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

const WINDOWS = [
  { label: '1 week ago', days: 7 },
  { label: '1 month ago', days: 30 },
  { label: '1 year ago', days: 365 },
]

export default async function PastEntriesPage() {
  const userId = process.env.SINGLE_USER_ID!

  const results = await Promise.all(
    WINDOWS.map(async ({ label, days }) => {
      const { from, to } = windowAround(days)
      const [entry] = await db
        .select()
        .from(entries)
        .where(and(eq(entries.userId, userId), gte(entries.date, from), lte(entries.date, to)))
        .limit(1)
      return { label, entry: entry ?? null }
    })
  )

  return (
    <main className="max-w-2xl mx-auto py-14 px-6">
      <header className="mb-10">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
          ← Write today
        </Link>
        <h1 className="text-3xl font-serif text-stone-800 tracking-tight mt-6">Echoes</h1>
        <p className="text-stone-400 text-sm mt-1">Entries from the past, resurfaced</p>
      </header>

      <div className="space-y-12">
        {results.map(({ label, entry }) => (
          <section key={label}>
            <h2 className="text-xs font-medium uppercase tracking-widest text-amber-700 mb-5">
              {label}
            </h2>
            {entry ? <EntryCard entry={entry} /> : (
              <p className="text-stone-400 text-sm italic">Nothing written around this time yet.</p>
            )}
          </section>
        ))}
      </div>
    </main>
  )
}

function EntryCard({ entry }: { entry: Entry }) {
  const date = new Date(entry.date + 'T12:00:00')
  const formatted = date.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm text-stone-500 font-medium">{formatted}</span>
        <span className="text-xs text-stone-400 bg-stone-50 px-2.5 py-1 rounded-full">
          Mood {entry.moodScore}/10
        </span>
      </div>

      {entry.mode === 'freeform' && entry.freeformText && (
        <p className="text-stone-700 leading-relaxed font-serif text-base line-clamp-5">
          {entry.freeformText}
        </p>
      )}

      {entry.mode === 'prompted' && (
        <div className="space-y-4 text-sm">
          {[
            { label: 'Grateful for', value: entry.gratitude },
            { label: 'Did right', value: entry.didRight },
            { label: 'Worked on', value: entry.todo },
          ]
            .filter(f => f.value)
            .map(({ label, value }) => (
              <div key={label}>
                <span className="text-xs uppercase tracking-widest text-stone-400">{label}</span>
                <p className="font-serif text-stone-700 mt-1 leading-relaxed line-clamp-3">{value}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
