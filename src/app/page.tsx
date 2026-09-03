'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Mode = 'freeform' | 'prompted'

const PROMPTED_FIELDS = [
  { key: 'gratitude', label: "Things I'm grateful for", placeholder: 'Three things, big or small...' },
  { key: 'todo', label: 'My to-do list', placeholder: 'What needs to get done today...' },
  { key: 'affirmations', label: 'My goals, already achieved', placeholder: 'Write as if it\'s already true...' },
  { key: 'didRight', label: 'What I did right today', placeholder: 'Acknowledge what went well...' },
  { key: 'didWrong', label: 'What I did wrong today', placeholder: 'And what you\'d do differently...' },
] as const

type PromptedKey = typeof PROMPTED_FIELDS[number]['key']

export default function JournalPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('freeform')
  const [moodScore, setMoodScore] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [freeformText, setFreeformText] = useState('')
  const [prompted, setPrompted] = useState<Record<PromptedKey, string>>({
    gratitude: '', todo: '', affirmations: '', didRight: '', didWrong: '',
  })

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  const todayISO = new Date().toISOString().split('T')[0]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!moodScore) return
    setSubmitting(true)

    const payload = mode === 'freeform'
      ? { mode, freeformText, moodScore, date: todayISO }
      : { mode, ...prompted, moodScore, date: todayISO }

    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/past')
    } else {
      setSubmitting(false)
    }
  }

  return (
    <main className="max-w-2xl mx-auto py-14 px-6">
      <header className="mb-10 flex items-baseline justify-between">
        <div>
          <h1 className="text-3xl font-serif text-stone-800 tracking-tight">Echo</h1>
          <p className="text-stone-400 text-sm mt-1">{today}</p>
        </div>
        <Link href="/past" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
          Past entries →
        </Link>
      </header>

      {/* Mode tabs */}
      <div className="flex gap-6 border-b border-stone-200 mb-10">
        {(['freeform', 'prompted'] as Mode[]).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`pb-3 text-sm font-medium capitalize transition-colors ${
              mode === m
                ? 'border-b-2 border-amber-700 text-amber-700 -mb-px'
                : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {mode === 'freeform' ? (
          <textarea
            value={freeformText}
            onChange={e => setFreeformText(e.target.value)}
            placeholder="What's on your mind today?"
            className="w-full min-h-56 bg-transparent text-stone-800 placeholder-stone-300 text-lg leading-relaxed resize-none focus:outline-none font-serif"
            required
          />
        ) : (
          <div className="space-y-8">
            {PROMPTED_FIELDS.map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-3">
                  {label}
                </label>
                <textarea
                  value={prompted[key]}
                  onChange={e => setPrompted(p => ({ ...p, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full min-h-20 bg-transparent text-stone-800 placeholder-stone-300 text-base leading-relaxed resize-none focus:outline-none font-serif"
                />
                <div className="border-b border-stone-100 mt-3" />
              </div>
            ))}
          </div>
        )}

        {/* Mood */}
        <div>
          <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-4">
            Mood today
          </label>
          <div className="flex gap-2 flex-wrap">
            {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setMoodScore(n)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-all ${
                  moodScore === n
                    ? 'bg-amber-700 text-white shadow-sm scale-110'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !moodScore}
          className="w-full py-3.5 rounded-full bg-stone-800 text-white text-sm font-medium disabled:opacity-40 hover:bg-stone-700 transition-colors"
        >
          {submitting ? 'Saving...' : 'Save entry'}
        </button>
      </form>
    </main>
  )
}
