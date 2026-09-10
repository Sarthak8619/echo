import { getResurfacedEntries, getCachedReflection } from '@/lib/db/queries'
import Link from 'next/link'
import { getDailyLine } from '@/lib/quotes'
import { EntryCard } from '@/components/EntryCard'

export default async function PastEntriesPage() {
  const userId = process.env.SINGLE_USER_ID!
  const today = new Date().toISOString().split('T')[0]

  const windows = await getResurfacedEntries(userId)
  const results = await Promise.all(
    windows.map(async ({ label, entry }) => ({
      label,
      entry,
      reflection: entry ? await getCachedReflection(entry.id, today) : null,
    }))
  )

  const line = getDailyLine(1)

  return (
    <main className="relative max-w-2xl mx-auto py-14 px-6">
      <header className="mb-10 animate-fade-in-up">
        <Link href="/" className="text-sm text-amber-800 hover:text-amber-900 font-medium transition-colors">
          ← Write today
        </Link>
        <div className="flex items-baseline justify-between mt-5">
          <h1 className="text-4xl font-serif text-stone-900 tracking-tight">Echoes</h1>
          <Link href="/entries" className="text-sm text-amber-800 hover:text-amber-900 font-medium transition-colors">
            All entries →
          </Link>
        </div>
        <p className="text-stone-600 text-sm mt-1.5">Entries from the past, resurfaced</p>
      </header>

      <div className="space-y-10">
        {results.map(({ label, entry, reflection }, i) => (
          <section
            key={label}
            className="animate-fade-in-up"
            style={{ animationDelay: `${80 + i * 90}ms` }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-4">
              {label}
            </h2>
            {entry ? (
              <div className="space-y-4">
                <EntryCard entry={entry} />
                {reflection && (
                  <div className="rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
                    <span className="text-xs font-semibold uppercase tracking-widest text-amber-700 block mb-2">
                      Echo&apos;s reflection
                    </span>
                    <p className="font-serif text-stone-800 leading-relaxed italic">
                      {reflection.reflectionText}
                    </p>
                  </div>
                )}
              </div>
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
