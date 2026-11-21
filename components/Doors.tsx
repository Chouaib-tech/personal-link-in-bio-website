'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { Globe, Mail, Phone } from 'lucide-react'
import { BrandIcon } from '@/components/BrandIcons'
import { COPY, LINKS, type Lang } from '@/lib/content'

const COLORS = ['#2f5d8a', '#6b4a7a', '#5f8f6f', '#c0652d', '#2d7d7a']
const ICON = 'h-7 w-7 lg:h-9 lg:w-9'

type DoorDef = { key: string; label: string; href: string; icon: ReactNode }

const isWeb = (href: string) => href.startsWith('http')

function buildDoors(lang: Lang): DoorDef[] {
  const c = COPY[lang]
  return [
    { key: 'whatsapp', label: 'WhatsApp', href: LINKS.whatsapp, icon: <BrandIcon name="WhatsApp" className={ICON} /> },
    { key: 'call', label: c.shortCall, href: LINKS.call, icon: <Phone aria-hidden className={ICON} strokeWidth={2} /> },
    { key: 'email', label: c.shortEmail, href: LINKS.email, icon: <Mail aria-hidden className={ICON} strokeWidth={2} /> },
    { key: 'portfolio', label: c.shortPortfolio, href: LINKS.portfolio, icon: <Globe aria-hidden className={ICON} strokeWidth={2} /> },
    { key: 'linkedin', label: 'LinkedIn', href: LINKS.linkedin, icon: <BrandIcon name="LinkedIn" className={ICON} /> },
    { key: 'github', label: 'GitHub', href: LINKS.github, icon: <BrandIcon name="GitHub" className={ICON} /> },
    { key: 'telegram', label: 'Telegram', href: LINKS.telegram, icon: <BrandIcon name="Telegram" className={ICON} /> },
    { key: 'instagram', label: 'Instagram', href: LINKS.instagram, icon: <BrandIcon name="Instagram" className={ICON} /> },
    { key: 'facebook', label: 'Facebook', href: LINKS.facebook, icon: <BrandIcon name="Facebook" className={ICON} /> },
  ]
}

export default function Doors({ lang }: { lang: Lang }) {
  const c = COPY[lang]
  const doors = buildDoors(lang)
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [enter, setEnter] = useState<{ key: string; scale: number } | null>(null)
  const [fine, setFine] = useState(true) // (hover: hover) and (pointer: fine)
  const [reduced, setReduced] = useState(false)
  const lastPointer = useRef<string>('mouse')
  const timer = useRef<number>()

  useEffect(() => {
    const hoverMq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => {
      setFine(hoverMq.matches)
      setReduced(motionMq.matches)
    }
    sync()
    hoverMq.addEventListener('change', sync)
    motionMq.addEventListener('change', sync)

    // Back button / bfcache: restore every door to its initial state
    const reset = () => {
      window.clearTimeout(timer.current)
      setOpenKey(null)
      setEnter(null)
    }
    window.addEventListener('pageshow', reset)
    return () => {
      hoverMq.removeEventListener('change', sync)
      motionMq.removeEventListener('change', sync)
      window.removeEventListener('pageshow', reset)
      window.clearTimeout(timer.current)
    }
  }, [])

  // Tap outside closes the open door
  useEffect(() => {
    if (!openKey) return
    const onDown = (e: Event) => {
      if (!(e.target as Element).closest?.('[data-door]')) setOpenKey(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [openKey])

  const go = useCallback(
    (d: DoorDef) => {
      if (reduced) {
        setEnter({ key: d.key, scale: 1 })
        timer.current = window.setTimeout(() => window.location.assign(d.href), 150)
        return
      }
      const el = document.getElementById(`doorway-${d.key}`)
      let scale = 7
      if (el) {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const sx = (Math.max(cx, window.innerWidth - cx) * 2) / r.width
        const sy = (Math.max(cy, window.innerHeight - cy) * 2) / r.height
        scale = Math.max(6, Math.min(Math.max(sx, sy) * 1.05, 14))
      }
      setEnter({ key: d.key, scale })
      timer.current = window.setTimeout(() => window.location.assign(d.href), 600)
    },
    [reduced],
  )

  const onClick = (e: MouseEvent<HTMLAnchorElement>, d: DoorDef) => {
    if (enter) return e.preventDefault()
    if (e.detail === 0) return // keyboard / assistive tech: plain link activation
    const touch = !fine || lastPointer.current === 'touch'
    if (!touch) return // mouse: door already open on hover, click follows the link
    e.preventDefault()
    if (openKey !== d.key) setOpenKey(d.key)
    else go(d)
  }

  return (
    <>
      <ul className="grid grid-cols-3 gap-x-3 gap-y-14 px-1 pb-6 pt-2 lg:flex lg:flex-wrap lg:justify-center lg:gap-x-6 lg:gap-y-16 lg:pb-8">
        {doors.map((d, i) => {
          const isOpen = openKey === d.key
          const isEntering = enter?.key === d.key
          const col = i % 3
          const aria = `${c.open} ${d.label}`
          return (
            <li
              key={d.key}
              data-door
              data-open={isOpen || isEntering}
              data-entering={isEntering}
              className="door-slot relative min-w-0 lg:w-[160px] xl:w-[184px]"
              style={{ zIndex: isEntering ? 60 : isOpen ? 10 : undefined, '--dc': COLORS[i % COLORS.length], '--s': enter?.scale } as CSSProperties}
            >
              <a
                href={d.href}
                aria-label={aria}
                {...(isWeb(d.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="block rounded-t-[999px] focus-visible:ring-offset-4"
                onPointerDown={(e) => (lastPointer.current = e.pointerType)}
                onPointerEnter={(e) => {
                  if (e.pointerType !== 'touch' && fine) setOpenKey(d.key)
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType !== 'touch' && fine) setOpenKey((k) => (k === d.key ? null : k))
                }}
                onFocus={(e) => {
                  if (e.currentTarget.matches(':focus-visible')) setOpenKey(d.key)
                }}
                onBlur={() => setOpenKey((k) => (k === d.key ? null : k))}
                onClick={(e) => onClick(e, d)}
              >
                <span className="door-frame block">
                  <span id={`doorway-${d.key}`} className="doorway">
                    {d.icon}
                    <span className="text-[11px] font-extrabold lg:text-sm">{d.label}</span>
                  </span>
                  <span className="door-leaf">
                    <span className="door-plate">{d.label}</span>
                    <span className="door-knob" />
                  </span>
                </span>
              </a>
              {!fine && (
                <span
                  aria-hidden
                  className={`door-hint ${col === 0 ? 'left-0' : col === 1 ? 'left-1/2 -translate-x-1/2' : 'right-0'} lg:left-1/2 lg:right-auto lg:-translate-x-1/2`}
                >
                  {c.tapAgain}
                </span>
              )}
            </li>
          )
        })}
      </ul>
      <div aria-hidden className="flood" data-on={!!enter} />
    </>
  )
}
