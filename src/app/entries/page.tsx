import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllEntries } from '@/lib/db/queries'
import type { Entry } from '@/lib/db/schema'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { entryExcerpt, modeLabel } from '@/components/EntryBody'
import { MoodTag } from '@/components/MoodTag'
import { SavedToast } from '@/components/SavedToast'
import { JournalIcon, ChevronRightIcon } from '@/components/icons'
import { formatEntryDate } from '@/lib/dates'

export const metadata: Metadata = { title: 'Journal' }
// Without this, Next prerenders the page once at build time and it never shows new data.
export const dynamic = 'force-dynamic'

function groupByMonth(list: Entry[]) {
  const groups: { month: string; entries: Entry[] }[] = []
  for (const entry of list) {
    const month = entry.date.slice(0, 7)
    const last = groups.at(-1)
    if (last?.month === month) last.entries.push(entry)
    else groups.push({ month, entries: [entry] })
  }
  return groups
}

export default async function JournalPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams
  const all = await getAllEntries(process.env.SINGLE_USER_ID!)

  return (
    <>
      {saved && <SavedToast />}
      <PageHeader eyebrow={`${all.length} ${all.length === 1 ? 'entry' : 'entries'}`} title="Journal" />

      {all.length === 0 ? (
        <EmptyState
          Icon={JournalIcon}
          title="Your journal is empty"
          body="Everything you write lives here, newest first."
          action={{ href: '/', label: "Write Today's Entry" }}
        />
      ) : (
        <div className="space-y-8">
          {groupByMonth(all).map(({ month, entries }, g) => (
            <section
              key={month}
              aria-labelledby={`month-${month}`}
              className="animate-rise"
              style={{ animationDelay: `${Math.min(g, 4) * 70}ms` }}
            >
              <h2 id={`month-${month}`} className="px-1 pb-2 text-title-3 text-label">
                {formatEntryDate(`${month}-01`, { month: 'long', year: 'numeric' })}
              </h2>
              <ul className="overflow-hidden rounded-card bg-card shadow-card">
                {entries.map((entry, i) => (
                  <li key={entry.id} className="relative">
                    {i > 0 && (
                      <span aria-hidden="true" className="absolute top-0 right-0 left-[4.75rem] h-px bg-separator" />
                    )}
                    <EntryRow entry={entry} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  )
}

function EntryRow({ entry }: { entry: Entry }) {
  return (
    <Link
      href={`/entries/${entry.id}`}
      className="flex items-start gap-4 px-4 py-3.5 transition-colors hover:bg-fill/60 active:bg-fill"
    >
      <div className="w-11 shrink-0 pt-0.5 text-center">
        <p className="text-caption font-semibold uppercase text-label-2">
          {formatEntryDate(entry.date, { weekday: 'short' })}
        </p>
        <p className="font-rounded text-title-2 leading-tight text-label tabular-nums">
          {formatEntryDate(entry.date, { day: 'numeric' })}
        </p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 font-serif text-body text-label">{entryExcerpt(entry)}</p>
        <p className="mt-1.5 flex items-center gap-2 text-footnote text-label-2">
          <MoodTag score={entry.moodScore} />
          <span aria-hidden="true">·</span>
          {modeLabel(entry)}
        </p>
      </div>
      <ChevronRightIcon className="mt-3 size-4 shrink-0 text-label-3" />
    </Link>
  )
}
