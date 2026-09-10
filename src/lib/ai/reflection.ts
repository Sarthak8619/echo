const GEMINI_MODEL = 'gemini-2.5-flash'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

interface EntryForReflection {
  mode: 'freeform' | 'prompted'
  freeformText: string | null
  gratitude: string | null
  todo: string | null
  affirmations: string | null
  didRight: string | null
  didWrong: string | null
}

const SYSTEM_PROMPT = `You are writing a short reflective passage for someone revisiting a journal entry they wrote in the past. Base your reflection STRICTLY and ONLY on what is written in the entry below — never invent details, events, people, or emotions that are not explicitly present in the text. If the entry is short or sparse, keep the reflection short and sparse too, rather than padding it with invented context. Write 2-4 sentences, addressed to the reader as "you", calm and grounded in tone — not generic self-help language.`

function entryToText(entry: EntryForReflection): string {
  if (entry.mode === 'freeform') {
    return entry.freeformText ?? ''
  }
  return [
    entry.gratitude && `Grateful for: ${entry.gratitude}`,
    entry.todo && `To-do: ${entry.todo}`,
    entry.affirmations && `Affirmations: ${entry.affirmations}`,
    entry.didRight && `Did right: ${entry.didRight}`,
    entry.didWrong && `Did wrong: ${entry.didWrong}`,
  ].filter(Boolean).join('\n')
}

export async function generateReflection(entry: EntryForReflection, daysAgo: number): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

  const entryText = entryToText(entry).trim()
  if (!entryText) throw new Error('Entry has no text to reflect on')

  const userPrompt = `This entry was written ${daysAgo} days ago:\n\n"""\n${entryText}\n"""\n\nWrite the reflection now.`

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 300 },
    }),
  })

  if (!res.ok) {
    throw new Error(`Gemini API error ${res.status}: ${await res.text()}`)
  }

  const data = await res.json()
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini API returned no reflection text')
  return text.trim()
}
