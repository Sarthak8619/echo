import { HeartIcon, ChecklistIcon, SparklesIcon, CheckCircleIcon, UndoIcon } from './icons'

export const PROMPTS = [
  { key: 'gratitude', label: 'Grateful for', placeholder: 'Three things, big or small', color: '#ff375f', Icon: HeartIcon },
  { key: 'todo', label: 'To-do', placeholder: 'What needs doing today', color: '#0a84ff', Icon: ChecklistIcon },
  { key: 'affirmations', label: 'Goals, already achieved', placeholder: "Write them as if they're already true", color: '#bf5af2', Icon: SparklesIcon },
  { key: 'didRight', label: 'What went right', placeholder: 'Give yourself some credit', color: '#30d158', Icon: CheckCircleIcon },
  { key: 'didWrong', label: 'What went wrong', placeholder: 'Honest, not harsh', color: '#ff9f0a', Icon: UndoIcon },
] as const

export type PromptKey = (typeof PROMPTS)[number]['key']

export function PromptTile({ prompt, size = 'md' }: { prompt: (typeof PROMPTS)[number]; size?: 'sm' | 'md' }) {
  const { Icon, color } = prompt
  return (
    <span
      className={`grid shrink-0 place-items-center text-white ${
        size === 'md' ? 'size-7 rounded-[8px]' : 'size-5 rounded-[6px]'
      }`}
      style={{ backgroundColor: color }}
    >
      <Icon className={size === 'md' ? 'size-[17px]' : 'size-3'} strokeWidth={2.25} />
    </span>
  )
}
