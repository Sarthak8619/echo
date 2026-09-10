// Entry dates are calendar days (YYYY-MM-DD). Anchoring at noon keeps formatting on the
// same day regardless of the server's timezone.
export function formatEntryDate(date: string, options: Intl.DateTimeFormatOptions) {
  return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', options)
}
