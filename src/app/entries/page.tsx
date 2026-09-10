import { getAllEntries } from '@/lib/db/queries'
import Link from 'next/link'
import { EntryCard } from '@/components/EntryCard'

export default async function AllEntriesPage() {
  const userId = process.env.SINGLE_USER_ID!
  const allEntries = await getAllEntries(userId)

  return (
    <main className="relative max-w-2xl mx-auto py-14 px-6">
      <header className="mb-10 animate-fade-in-up">
        <Link href="/past" className="text-sm text-amber-800 hover:text-amber-900 font-medium transition-colors">
          ← Echoes
        </Link>
        <h1 className="text-4xl font-serif text-stone-900 tracking-tight mt-5">All entries</h1>
        <p className="text-stone-600 text-sm mt-1.5">Everything you&apos;ve written, newest first</p>
      </header>

      {allEntries.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-amber-200 bg-white/40 p-6">
          <p className="text-stone-500 text-sm italic font-serif">Nothing written yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {allEntries.map((entry, i) => (
            <div
              key={entry.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${Math.min(i, 6) * 60}ms` }}
            >
              <EntryCard entry={entry} />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
