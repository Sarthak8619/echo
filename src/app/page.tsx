'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getDailyLine } from '@/lib/quotes'

type Mode = 'freeform' | 'prompted'

const PROMPTED_FIELDS = [
  { key: 'gratitude', label: "Things I'm grateful for", placeholder: 'Three things, big or small...' },
  { key: 'todo', label: 'My to-do list', placeholder: 'What needs to get done today...' },
  { key: 'affirmations', label: 'My goals, already achieved', placeholder: "Write as if it's already true..." },
  { key: 'didRight', label: 'What I did right today', placeholder: 'Acknowledge what went well...' },
  { key: 'didWrong', label: 'What I did wrong today', placeholder: "And what you'd do differently..." },
] as const

type PromptedKey = typeof PROMPTED_FIELDS[number]['key']

const MOOD_WORDS = ['Heavy', 'Low', 'Tired', 'Flat', 'Okay', 'Steady', 'Good', 'Bright', 'Great', 'Radiant']

function moodColor(n: number) {
  // cool slate at 1 -> warm amber/rose at 10
  const stops = [
    '#8892a6', '#8f92a0', '#a08f8a', '#b08d75',
    '#c08c66', '#cf8b58', '#d88a4d', '#e08843', '#e5813a', '#e2732e',
  ]
  return stops[n - 1]
}

export default function JournalPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('freeform')
  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [freeformText, setFreeformText] = useState('')
  const [prompted, setPrompted] = useState<Record<PromptedKey, string>>({
    gratitude: '', todo: '', affirmations: '', didRight: '', didWrong: '',
  })

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const todayISO = new Date().toISOString().split('T')[0]
  const line = getDailyLine()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!moodScore) return
    setSubmitting(true)
    setError(null)

    const payload = mode === 'freeform'
      ? { mode, freeformText, moodScore, date: todayISO }
      : { mode, ...prompted, moodScore, date: todayISO }

    try {
      const res = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/past')
      } else {
        setError("Couldn't save your entry. Please try again.")
        setSubmitting(false)
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.")
      setSubmitting(false)
    }
  }

  return (
    <main className="relative max-w-5xl mx-auto py-14 px-6 lg:grid lg:grid-cols-[1fr_18rem] lg:gap-10">
      <div>
        <header className="mb-8 flex items-baseline justify-between animate-fade-in-up">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 animate-blink" />
              </span>
              <h1 className="text-4xl font-serif text-stone-900 tracking-tight">Echo</h1>
            </div>
            <p className="text-stone-600 text-sm mt-1.5">{today}</p>
          </div>
          <Link href="/past" className="text-sm text-amber-800 hover:text-amber-900 font-medium transition-colors">
            Past entries →
          </Link>
        </header>

        {/* Mode toggle */}
        <div className="inline-flex p-1 bg-stone-900/5 rounded-full mb-8 gap-1 animate-fade-in-up" style={{ animationDelay: '80ms' }}>
          {(['freeform', 'prompted'] as Mode[]).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                mode === m
                  ? 'bg-white text-amber-800 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Paper */}
          <div
            className="rounded-[2rem] border border-amber-100 bg-white/70 backdrop-blur-sm shadow-[0_10px_40px_-15px_rgba(120,80,30,0.25)] p-8 sm:p-10 animate-fade-in-up"
            style={{ animationDelay: '140ms' }}
          >
            {mode === 'freeform' ? (
              <div className="paper-lines">
                <textarea
                  value={freeformText}
                  onChange={e => setFreeformText(e.target.value)}
                  placeholder="What's on your mind today?"
                  className="w-full min-h-64 bg-transparent text-stone-900 placeholder-stone-400 text-xl leading-[2.3rem] resize-none focus:outline-none font-serif"
                  required
                />
              </div>
            ) : (
              <div className="paper-lines -m-2 p-2">
                {PROMPTED_FIELDS.map(({ key, label, placeholder }, i) => (
                  <div key={key} className={i > 0 ? 'mt-2' : ''}>
                    <label className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs font-medium text-amber-700/80 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-medium text-stone-600 tracking-wide">
                        {label}
                      </span>
                    </label>
                    <textarea
                      value={prompted[key]}
                      onChange={e => setPrompted(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full min-h-[2.3rem] bg-transparent text-stone-900 placeholder-stone-400 text-lg leading-[2.3rem] resize-none focus:outline-none font-serif"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mood */}
          <div
            className="rounded-[2rem] border border-amber-100 bg-white/70 backdrop-blur-sm shadow-[0_10px_40px_-15px_rgba(120,80,30,0.25)] p-8 animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-stone-600 tracking-wide">How did today feel?</span>
              <span
                className="text-sm font-medium transition-colors duration-300"
                style={{ color: moodScore ? moodColor(moodScore) : '#a8a29e' }}
              >
                {moodScore ? MOOD_WORDS[moodScore - 1] : 'Pick one'}
              </span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setMoodScore(n)}
                  aria-label={MOOD_WORDS[n - 1]}
                  className={`w-10 h-10 rounded-full text-sm font-semibold transition-all duration-300 ${
                    moodScore === n ? 'text-white scale-110 shadow-md' : 'text-stone-600 hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: moodScore === n ? moodColor(n) : `${moodColor(n)}22`,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-rose-700 text-center -mb-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !moodScore}
            className="w-full py-4 rounded-full bg-gradient-to-r from-amber-800 to-orange-700 text-white text-sm font-medium tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-900/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            {submitting ? 'Saving...' : 'Save entry'}
          </button>
        </form>
      </div>

      {/* Side rail */}
      <aside className="hidden lg:block mt-2">
        <div className="sticky top-14 space-y-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="rounded-3xl border border-amber-100 bg-white/60 backdrop-blur-sm p-6">
            <span className="font-serif text-4xl text-amber-300 leading-none block mb-1">&ldquo;</span>
            <p className="font-serif text-stone-700 text-base leading-relaxed -mt-3">{line}</p>
          </div>
          <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <p className="text-sm text-stone-600 leading-relaxed">
              A week, a month, a year from now — Echo brings this page back to you.
            </p>
          </div>
        </div>
      </aside>
    </main>
  )
}
