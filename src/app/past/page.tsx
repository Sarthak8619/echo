import type { Metadata } from 'next'
import Link from 'next/link'
import { getResurfacedEntries, getCachedReflection } from '@/lib/db/queries'
import type { Entry, Reflection } from '@/lib/db/schema'
import { PageHeader } from '@/components/PageHeader'
import { EmptyState } from '@/components/EmptyState'
import { EntryBody, entryExcerpt } from '@/components/EntryBody'
import { MoodTag } from '@/components/MoodTag'
import { EchoesIcon, SparklesIcon, ChevronDownIcon } from '@/components/icons'
import { moodColor } from '@/lib/mood'
import { formatEntryDate } from '@/lib/dates'

export const metadata: Metadata = { title: 'Echoes' }
// Without this, Next prerenders the page once at build time and it never shows new data.
export const dynamic = 'force-dynamic'

export default async function EchoesPage() {
  const userId = process.env.SINGLE_USER_ID!
  const today = new Date().toISOString().split('T')[0]

  const windows = await getResurfacedEntries(userId)
  const echoes = await Promise.all(
    windows.map(async w => ({
      ...w,
      reflection: w.entry ? await getCachedReflection(w.entry.id, today) : null,
    }))
  )

  const found = echoes.filter((e): e is (typeof echoes)[number] & { entry: Entry } => e.entry !== null)
  const missing = echoes.filter(e => e.entry === null).map(e => e.label.toLowerCase())

  return (
    <>
      <PageHeader eyebrow="Resurfaced today" title="Echoes" />

      {found.length === 0 ? (
        <EmptyState
          Icon={EchoesIcon}
          title="No echoes yet"
          body="What you write comes back here a week, a month, and a year later — with a reflection on how you felt."
          action={{ href: '/', label: "Write Today's Entry" }}
        />
      ) : (
        <div className="space-y-5">
          {found.map((echo, i) => (
            <EchoCard key={echo.label} label={echo.label} entry={echo.entry} reflection={echo.reflection} delay={i * 70} />
          ))}
          {missing.length > 0 && (
            <p className="px-6 pt-2 text-center text-footnote text-label-2">
              Nothing yet from {missing.join(' or ')}.
            </p>
          )}
        </div>
      )}
    </>
  )
}

function EchoCard({
  label,
  entry,
  reflection,
  delay,
}: {
  label: string
  entry: Entry
  reflection: Reflection | null
  delay: number
}) {
  const color = moodColor(entry.moodScore)

  return (
    <article
      className="animate-rise overflow-hidden rounded-card bg-card shadow-card"
      style={{
        animationDelay: `${delay}ms`,
        backgroundImage: `linear-gradient(to bottom, color-mix(in srgb, ${color} 14%, transparent), transparent 8rem)`,
      }}
    >
      <header className="flex items-start justify-between gap-4 px-5 pt-5">
        <div>
          <p className="text-footnote font-semibold uppercase tracking-wide text-tint">{label}</p>
          <p className="mt-0.5 text-subhead text-label-2">
            {formatEntryDate(entry.date, { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <MoodTag score={entry.moodScore} />
      </header>

      {reflection ? (
        <>
          <div className="px-5 pt-4 pb-5">
            <p className="flex items-center gap-1.5 text-caption font-semibold uppercase tracking-wide text-label-2">
              <SparklesIcon className="size-3.5" />
              Reflection
            </p>
            <p className="mt-2 font-serif text-[1.25rem] leading-[1.6] text-label">{reflection.reflectionText}</p>
          </div>
          <details className="group border-t border-separator">
            <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3.5 text-subhead font-medium text-tint [&::-webkit-details-marker]:hidden">
              What you wrote
              <ChevronDownIcon className="size-4 transition-transform duration-300 ease-apple group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5">
              <EntryBody entry={entry} />
            </div>
          </details>
        </>
      ) : (
        <div className="px-5 pt-4 pb-5">
          <p className="line-clamp-4 font-serif text-[1.125rem] leading-[1.65] text-label">{entryExcerpt(entry)}</p>
          <Link href={`/entries/${entry.id}`} className="mt-3 inline-block text-subhead font-medium text-tint">
            Read entry
          </Link>
          <p className="mt-3 text-footnote text-label-2">A reflection on this day arrives each morning.</p>
        </div>
      )}
    </article>
  )
}
