import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getEntryById } from '@/lib/db/queries'
import { EntryBody, modeLabel } from '@/components/EntryBody'
import { MoodTag } from '@/components/MoodTag'
import { ChevronLeftIcon } from '@/components/icons'
import { formatEntryDate } from '@/lib/dates'

export const metadata: Metadata = { title: 'Entry' }
export const dynamic = 'force-dynamic'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function EntryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Postgres throws on a malformed uuid, so treat anything that isn't one as not found.
  const entry = UUID.test(id) ? await getEntryById(process.env.SINGLE_USER_ID!, id) : null
  if (!entry) notFound()

  return (
    <article className="animate-rise">
      <Link
        href="/entries"
        className="-ml-1.5 inline-flex items-center pt-[calc(env(safe-area-inset-top)+1rem)] text-body text-tint md:pt-2"
      >
        <ChevronLeftIcon className="size-6" strokeWidth={2} />
        Journal
      </Link>

      <header className="pt-3 pb-6">
        <p className="text-footnote font-semibold uppercase tracking-wide text-label-2">
          {formatEntryDate(entry.date, { weekday: 'long' })} · {entry.date.slice(0, 4)}
        </p>
        <h1 className="mt-0.5 text-large-title text-label">
          {formatEntryDate(entry.date, { month: 'long', day: 'numeric' })}
        </h1>
        <p className="mt-2 flex items-center gap-2 text-footnote text-label-2">
          <MoodTag score={entry.moodScore} />
          <span aria-hidden="true">·</span>
          {modeLabel(entry)}
        </p>
      </header>

      <div className="rounded-card bg-card p-5 shadow-card sm:p-6">
        <EntryBody entry={entry} />
      </div>
    </article>
  )
}
