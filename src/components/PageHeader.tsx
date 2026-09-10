import type { ReactNode } from 'react'

export function PageHeader({ eyebrow, title }: { eyebrow?: ReactNode; title: string }) {
  return (
    <header className="animate-rise pt-[calc(env(safe-area-inset-top)+1.75rem)] pb-6 md:pt-2">
      <p className="text-footnote font-semibold uppercase tracking-wide text-label-2">
        {eyebrow || ' '}
      </p>
      <h1 className="mt-0.5 text-large-title text-label">{title}</h1>
    </header>
  )
}
