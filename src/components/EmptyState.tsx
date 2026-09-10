import Link from 'next/link'
import type { ComponentType, SVGProps } from 'react'

export function EmptyState({
  Icon,
  title,
  body,
  action,
}: {
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  body: string
  action?: { href: string; label: string }
}) {
  return (
    <div className="flex animate-rise flex-col items-center px-8 pt-14 pb-8 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-tint/12 text-tint">
        <Icon className="size-8" />
      </div>
      <h2 className="mt-5 text-title-3 text-label">{title}</h2>
      <p className="mt-2 max-w-xs text-callout text-label-2">{body}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-7 inline-flex h-11 items-center rounded-full bg-tint px-6 text-headline text-on-tint transition-opacity hover:opacity-90"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
