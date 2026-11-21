'use client'

import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { COPY, type Lang } from '@/lib/content'

const ZONE = 'Africa/Algiers'

/** One location pill: pin + place + live local time (client only, after mount). */
export default function StatusRow({ lang }: { lang: Lang }) {
  const [time, setTime] = useState<string | null>(null)

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
    <p className="tc mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-semibold">
      <MapPin aria-hidden className="h-3.5 w-3.5 text-brass-text" strokeWidth={2} />
      <span>{COPY[lang].location}</span>
      <span aria-hidden>·</span>
      {/* reserved width: no layout shift when the time appears */}
      <time className="inline-block min-w-[5ch] tabular-nums">{time ?? ''}</time>
    </p>
  )
}
