import { moodColor, moodWord } from '@/lib/mood'

export function MoodTag({ score }: { score: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-footnote text-label-2">
      <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: moodColor(score) }} />
      <span className="sr-only">Mood: </span>
      {moodWord(score)}
    </span>
  )
}
