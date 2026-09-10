import type { Entry } from '@/lib/db/schema'
import { PROMPTS, PromptTile } from './prompts'

export function EntryBody({ entry }: { entry: Entry }) {
  if (entry.mode === 'freeform') {
    return (
      <p className="whitespace-pre-line font-serif text-[1.125rem] leading-[1.7] text-label">
        {entry.freeformText}
      </p>
    )
  }

  return (
    <dl className="space-y-5">
      {PROMPTS.filter(p => entry[p.key]).map(prompt => (
        <div key={prompt.key}>
          <dt className="flex items-center gap-2 text-footnote font-semibold text-label-2">
            <PromptTile prompt={prompt} size="sm" />
            {prompt.label}
          </dt>
          <dd className="mt-1.5 whitespace-pre-line font-serif text-[1.125rem] leading-[1.65] text-label">
            {entry[prompt.key]}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function entryExcerpt(entry: Entry) {
  if (entry.mode === 'freeform') return entry.freeformText ?? ''
  return PROMPTS.map(p => entry[p.key]).find(Boolean) ?? ''
}

export function modeLabel(entry: Entry) {
  return entry.mode === 'prompted' ? 'Guided' : 'Free write'
}
