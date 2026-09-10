export const MOOD_WORDS = [
  'Heavy', 'Low', 'Tired', 'Flat', 'Okay', 'Steady', 'Good', 'Bright', 'Great', 'Radiant',
] as const

// Indigo (heavy) through teal (neutral) to orange (radiant), after Apple Health's State of Mind.
const MOOD_COLORS = [
  '#5856d6', '#5b6ee8', '#3a82f7', '#2f9bd6', '#30b0c7',
  '#36bfa0', '#6acb6b', '#e6c52f', '#ffab2e', '#ff8a1f',
]

export const MOOD_GRADIENT = `linear-gradient(90deg, ${MOOD_COLORS.join(', ')})`

export function moodColor(score: number) {
  return MOOD_COLORS[score - 1]
}

export function moodWord(score: number) {
  return MOOD_WORDS[score - 1]
}
