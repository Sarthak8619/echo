import { db } from '@/lib/db'
import { entries, type Entry } from '@/lib/db/schema'
import { and, gte, lte, eq } from 'drizzle-orm'
import Link from 'next/link'
import { getDailyLine } from '@/lib/quotes'

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

function moodColor(n: number) {
  const stops = [
    '#8892a6', '#8f92a0', '#a08f8a', '#b08d75',
    '#c08c66', '#cf8b58', '#d88a4d', '#e08843', '#e5813a', '#e2732e',
  ]
  return stops[n - 1]
}

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

  const line = getDailyLine(1)

  return (
    <main className="relative max-w-2xl mx-auto py-14 px-6">
      <header className="mb-10 animate-fade-in-up">
        <Link href="/" className="text-sm text-amber-800 hover:text-amber-900 font-medium transition-colors">
          ← Write today
        </Link>
        <h1 className="text-4xl font-serif text-stone-900 tracking-tight mt-5">Echoes</h1>
        <p className="text-stone-600 text-sm mt-1.5">Entries from the past, resurfaced</p>
      </header>

      <div className="space-y-10">
        {results.map(({ label, entry }, i) => (
          <section
            key={label}
            className="animate-fade-in-up"
            style={{ animationDelay: `${80 + i * 90}ms` }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-4">
              {label}
            </h2>
            {entry ? (
              <EntryCard entry={entry} />
            ) : (
              <div className="rounded-3xl border border-dashed border-amber-200 bg-white/40 p-6">
                <p className="text-stone-500 text-sm italic font-serif">Nothing written around this time yet.</p>
              </div>
            )}
          </section>
        ))}
      </div>

      <div
        className="mt-12 rounded-3xl border border-amber-100 bg-white/60 backdrop-blur-sm p-6 animate-fade-in-up"
        style={{ animationDelay: '360ms' }}
      >
        <span className="font-serif text-4xl text-amber-300 leading-none block mb-1">&ldquo;</span>
        <p className="font-serif text-stone-700 text-base leading-relaxed -mt-3">{line}</p>
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
    <div className="rounded-3xl bg-white/70 backdrop-blur-sm p-7 shadow-[0_10px_40px_-18px_rgba(120,80,30,0.3)] border border-amber-100">
      <div className="flex items-center justify-between mb-5">
        <span className="text-sm text-stone-700 font-medium">{formatted}</span>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
          style={{ backgroundColor: moodColor(entry.moodScore) }}
        >
          Mood {entry.moodScore}/10
        </span>
      </div>

      {entry.mode === 'freeform' && entry.freeformText && (
        <p className="text-stone-800 leading-relaxed font-serif text-base line-clamp-5">
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
                <span className="text-xs uppercase tracking-widest text-amber-700/80 font-medium">{label}</span>
                <p className="font-serif text-stone-800 mt-1 leading-relaxed line-clamp-3">{value}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
