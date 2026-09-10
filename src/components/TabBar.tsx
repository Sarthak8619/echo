'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { TodayIcon, EchoesIcon, JournalIcon } from './icons'

const TABS = [
  { href: '/', label: 'Today', Icon: TodayIcon },
  { href: '/past', label: 'Echoes', Icon: EchoesIcon },
  { href: '/entries', label: 'Journal', Icon: JournalIcon },
]

export function TabBar() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 md:top-5 md:right-auto md:bottom-auto md:left-1/2 md:-translate-x-1/2"
    >
      <ul className="material flex border-t border-separator pb-[env(safe-area-inset-bottom)] md:gap-1 md:rounded-full md:border md:p-1 md:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.18)]">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
          return (
            <li key={href} className="flex-1 md:flex-none">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center gap-0.5 pt-2 pb-1.5 text-[0.625rem] font-medium transition-colors duration-300 ease-apple md:flex-row md:gap-2 md:rounded-full md:px-4 md:py-2 md:text-subhead ${
                  active
                    ? 'text-tint md:bg-segment md:shadow-[0_1px_3px_rgba(0,0,0,0.1)]'
                    : 'text-label-2 hover:text-label'
                }`}
              >
                <Icon className="size-6 md:size-[18px]" strokeWidth={active ? 2 : 1.75} />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
