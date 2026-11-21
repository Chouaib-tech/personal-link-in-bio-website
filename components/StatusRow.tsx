'use client'

import { useEffect, useState } from 'react'
import { AVAILABLE, COPY, type Lang } from '@/lib/content'

const ZONE = 'Africa/Algiers'
const pill = 'tc inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-semibold'

export default function StatusRow({ lang }: { lang: Lang }) {
  const c = COPY[lang]
  const [time, setTime] = useState<string | null>(null)

  // Client only, after mount: no hydration mismatch. The time slot has a reserved width.
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {
      timeZone: ZONE,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = window.setInterval(tick, 30_000)
    return () => window.clearInterval(id)
  }, [lang])

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
      {AVAILABLE && (
        <span className={pill}>
          <span aria-hidden className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#5fcf8a] opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#5fcf8a]" />
          </span>
          {c.available}
        </span>
      )}
      <span className={pill}>
        <span>{c.city}</span>
        <span aria-hidden>·</span>
        <time className="inline-block min-w-[5ch] tabular-nums">
          {time ?? ''}
        </time>
      </span>
    </div>
  )
}
