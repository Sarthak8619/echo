import type { Entry } from '@/lib/db/schema'

function moodColor(n: number) {
  const stops = [
    '#8892a6', '#8f92a0', '#a08f8a', '#b08d75',
    '#c08c66', '#cf8b58', '#d88a4d', '#e08843', '#e5813a', '#e2732e',
  ]
  return stops[n - 1]
}

export function EntryCard({ entry }: { entry: Entry }) {
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
