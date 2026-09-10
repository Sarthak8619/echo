'use client'

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from './PageHeader'
import { PROMPTS, PromptTile, type PromptKey } from './prompts'
import { MOOD_GRADIENT, moodColor, moodWord } from '@/lib/mood'
import { getDailyLine } from '@/lib/quotes'

type Mode = 'freeform' | 'prompted'

const MODES: { value: Mode; label: string }[] = [
  { value: 'freeform', label: 'Free write' },
  { value: 'prompted', label: 'Guided' },
]

const EMPTY_PROMPTS: Record<PromptKey, string> = {
  gratitude: '', todo: '', affirmations: '', didRight: '', didWrong: '',
}

// The entry's date is the writer's local calendar day, not UTC.
function localISODate(d: Date) {
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

export function Composer() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('freeform')
  const [freeformText, setFreeformText] = useState('')
  const [prompted, setPrompted] = useState(EMPTY_PROMPTS)
  const [mood, setMood] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dateLabel, setDateLabel] = useState('')
  const [placeholder, setPlaceholder] = useState("What's on your mind?")
  const freeformRef = useRef<HTMLTextAreaElement>(null)
  const firstPromptRef = useRef<HTMLTextAreaElement>(null)
  const moodRef = useRef<HTMLInputElement>(null)

  // Both depend on the viewer's clock, so resolve them after hydration rather than at build time.
  useEffect(() => {
    setDateLabel(new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
    setPlaceholder(getDailyLine())
  }, [])

  function pickMood(value: number) {
    setMood(value)
    setError(null)
  }

  function updatePrompt(key: PromptKey, value: string) {
    setPrompted(p => ({ ...p, [key]: value }))
    setError(null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const hasContent = mode === 'freeform'
      ? freeformText.trim() !== ''
      : Object.values(prompted).some(v => v.trim() !== '')

    if (!hasContent) {
      setError(mode === 'freeform' ? 'Write a few words first.' : 'Answer at least one prompt.')
      ;(mode === 'freeform' ? freeformRef : firstPromptRef).current?.focus()
      return
    }
    if (mood === null) {
      setError('Choose how today felt.')
      moodRef.current?.focus()
      return
    }

    setSubmitting(true)
    setError(null)

    const date = localISODate(new Date())
    const payload = mode === 'freeform'
      ? { mode, freeformText, moodScore: mood, date }
      : { mode, ...prompted, moodScore: mood, date }

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/entries?saved=1')
      } else {
        setError("Couldn't save your entry. Please try again.")
        setSubmitting(false)
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.")
      setSubmitting(false)
    }
  }

  const color = mood ? moodColor(mood) : null
  const orbStyle: CSSProperties = color
    ? {
        background: `radial-gradient(circle at 32% 28%, color-mix(in srgb, ${color} 45%, white), ${color} 72%)`,
        boxShadow: `0 8px 22px -6px ${color}aa`,
        transform: `scale(${0.86 + mood! * 0.02})`,
      }
    : { background: 'var(--fill)' }

  return (
    <>
      <PageHeader eyebrow={dateLabel} title="Today" />

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div
          role="radiogroup"
          aria-label="Entry style"
          className="relative grid animate-rise grid-cols-2 rounded-[9px] bg-fill p-0.5"
          style={{ animationDelay: '60ms' }}
        >
          <span
            aria-hidden="true"
            className={`absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-[7px] bg-segment shadow-[0_3px_8px_rgba(0,0,0,0.12),0_3px_1px_rgba(0,0,0,0.04)] transition-transform duration-300 ease-apple ${
              mode === 'prompted' ? 'translate-x-full' : ''
            }`}
          />
          {MODES.map(m => (
            <button
              key={m.value}
              type="button"
              role="radio"
              aria-checked={mode === m.value}
              onClick={() => setMode(m.value)}
              className={`relative z-10 py-1.5 text-subhead font-medium transition-colors duration-300 ${
                mode === m.value ? 'text-label' : 'text-label-2 hover:text-label'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div
          className="animate-rise rounded-card bg-card shadow-card transition-shadow duration-300 focus-within:ring-[3px] focus-within:ring-tint/20"
          style={{ animationDelay: '120ms' }}
        >
          {mode === 'freeform' ? (
            <textarea
              ref={freeformRef}
              value={freeformText}
              onChange={e => { setFreeformText(e.target.value); setError(null) }}
              placeholder={placeholder}
              aria-label="Today's entry"
              className="block min-h-[15rem] w-full resize-none rounded-card bg-transparent px-5 py-4 font-serif text-[1.1875rem] leading-[1.7] text-label placeholder:text-label-3 focus:outline-none"
            />
          ) : (
            <div>
              {PROMPTS.map((prompt, i) => (
                <label key={prompt.key} className="relative flex cursor-text gap-3.5 px-4 py-3.5">
                  {i > 0 && (
                    <span aria-hidden="true" className="absolute top-0 right-0 left-[3.625rem] h-px bg-separator" />
                  )}
                  <PromptTile prompt={prompt} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-subhead font-semibold text-label">{prompt.label}</span>
                    <textarea
                      ref={i === 0 ? firstPromptRef : undefined}
                      rows={1}
                      value={prompted[prompt.key]}
                      onChange={e => updatePrompt(prompt.key, e.target.value)}
                      placeholder={prompt.placeholder}
                      className="mt-0.5 block w-full resize-none bg-transparent font-serif text-body leading-relaxed text-label placeholder:text-label-3 focus:outline-none"
                    />
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        <section
          aria-labelledby="mood-label"
          className="animate-rise rounded-card bg-card px-5 pt-5 pb-3 shadow-card"
          style={{ animationDelay: '180ms' }}
        >
          <div className="flex items-center gap-4">
            <span aria-hidden="true" className="size-14 shrink-0 rounded-full transition-all duration-500 ease-apple" style={orbStyle} />
            <div className="min-w-0">
              <p id="mood-label" className="text-footnote font-semibold uppercase tracking-wide text-label-2">
                How did today feel?
              </p>
              <p className="text-title-2 text-label">{mood ? moodWord(mood) : 'Slide to choose'}</p>
            </div>
            {mood && <span className="ml-auto text-subhead text-label-2 tabular-nums">{mood}/10</span>}
          </div>

          <input
            ref={moodRef}
            type="range"
            min={1}
            max={10}
            step={1}
            value={mood ?? 5}
            onChange={e => pickMood(Number(e.target.value))}
            // A tap on the resting midpoint doesn't fire onChange, so commit on release too.
            onPointerUp={e => pickMood(Number(e.currentTarget.value))}
            aria-labelledby="mood-label"
            aria-valuetext={mood ? `${moodWord(mood)}, ${mood} of 10` : 'Not chosen yet'}
            data-untouched={mood === null}
            className="mood-slider mt-3"
            style={{ '--mood-gradient': MOOD_GRADIENT } as CSSProperties}
          />
          <div className="-mt-1 flex justify-between text-caption text-label-2">
            <span>Heavy</span>
            <span>Radiant</span>
          </div>
        </section>

        <div className="animate-rise space-y-3 pt-1" style={{ animationDelay: '240ms' }}>
          {error && (
            <p role="alert" className="text-center text-subhead text-danger">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="h-[3.25rem] w-full rounded-full bg-tint text-headline text-on-tint transition-[transform,opacity] duration-200 ease-apple hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save Entry'}
          </button>
          <p className="px-6 text-center text-footnote text-label-2">
            Echo brings this back to you in a week, a month, and a year.
          </p>
        </div>
      </form>
    </>
  )
}
