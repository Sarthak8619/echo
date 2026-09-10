const REFLECTIVE_LINES = [
  'Some days ask to be remembered exactly as they were.',
  "Write it plainly today — you'll thank yourself in a year.",
  'The smallest details are the ones memory loses first.',
  'A feeling named on paper is easier to carry.',
  'This page will meet you again, a year from now.',
  'Not every day needs a lesson. Some just need a record.',
  'What felt ordinary today might feel precious later.',
  "You don't have to make sense of it yet. Just write it down.",
  'Future you is reading over your shoulder.',
  'The quiet moments deserve a line too.',
  'Nothing here needs to be impressive. It just needs to be true.',
  'A year from now, this sentence will be a small time machine.',
]

export function getDailyLine(offset = 0) {
  const start = new Date(new Date().getFullYear(), 0, 0).getTime()
  const dayOfYear = Math.floor((Date.now() - start) / 86_400_000)
  return REFLECTIVE_LINES[(dayOfYear + offset) % REFLECTIVE_LINES.length]
}
