'use client'

import { useEffect, useState } from 'react'
import { CheckIcon } from './icons'

export function SavedToast() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Drop ?saved=1 without navigating, so a refresh doesn't replay the toast.
    window.history.replaceState(null, '', window.location.pathname)
    const show = requestAnimationFrame(() => setVisible(true))
    const hide = setTimeout(() => setVisible(false), 2600)
    return () => {
      cancelAnimationFrame(show)
      clearTimeout(hide)
    }
  }, [])

  return (
    <div
      role="status"
      className={`pointer-events-none fixed inset-x-0 top-[calc(env(safe-area-inset-top)+0.75rem)] z-50 flex justify-center transition-all duration-500 ease-apple md:top-20 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
      }`}
    >
      <div className="material flex items-center gap-2 rounded-full border border-separator py-2.5 pr-4 pl-2.5 text-subhead font-medium text-label shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]">
        <span className="grid size-5 place-items-center rounded-full bg-[#34c759] text-white">
          <CheckIcon className="size-3.5" strokeWidth={3} />
        </span>
        Entry saved
      </div>
    </div>
  )
}
