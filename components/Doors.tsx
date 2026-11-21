'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { Globe, Mail, Phone } from 'lucide-react'
import { BrandIcon } from '@/components/BrandIcons'
import { COPY, LINKS, type Lang } from '@/lib/content'

const ICON = 'h-9 w-9 lg:h-12 lg:w-12'

// Painted, slightly desaturated: mint, cobalt, orange, deep violet
type DoorDef = { key: string; label: string; href: string; icon: ReactNode; color: string }

const isWeb = (href: string) => href.startsWith('http')

function buildDoors(lang: Lang): DoorDef[] {
  const c = COPY[lang]
  return [
    { key: 'whatsapp', label: 'WhatsApp', href: LINKS.whatsapp, color: '#5f9c86', icon: <BrandIcon name="WhatsApp" className={ICON} /> },
    { key: 'call', label: c.shortCall, href: LINKS.call, color: '#34599a', icon: <Phone aria-hidden className={ICON} strokeWidth={1.75} /> },
    { key: 'email', label: c.shortEmail, href: LINKS.email, color: '#c06a35', icon: <Mail aria-hidden className={ICON} strokeWidth={1.75} /> },
    { key: 'portfolio', label: c.shortPortfolio, href: LINKS.portfolio, color: '#583f7c', icon: <Globe aria-hidden className={ICON} strokeWidth={1.75} /> },
  ]
}

/** Shared brass gradients, referenced by every lever / keyhole (declared once). */
function BrassDefs() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" className="absolute">
      <defs>
        <linearGradient id="brass-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff1c8" />
          <stop offset=".22" stopColor="#e6c27c" />
          <stop offset=".55" stopColor="#b98a45" />
          <stop offset="1" stopColor="#6f4d1c" />
        </linearGradient>
        <radialGradient id="brass-rose" cx=".34" cy=".3" r=".85">
          <stop offset="0" stopColor="#fff1c8" />
          <stop offset=".35" stopColor="#d9b06a" />
          <stop offset=".75" stopColor="#a47838" />
          <stop offset="1" stopColor="#6a4819" />
        </radialGradient>
      </defs>
    </svg>
  )
}

function Lever() {
  return (
    <svg viewBox="0 0 64 28" className="lever" aria-hidden focusable="false">
      <circle cx="50" cy="14" r="10" fill="url(#brass-rose)" stroke="rgb(0 0 0 / .4)" strokeWidth=".6" />
      <circle cx="50" cy="14" r="7" fill="none" stroke="rgb(255 255 255 / .35)" strokeWidth=".7" />
      <path d="M50 10 L18 10.6 Q9.5 11 9.5 14 Q9.5 17 18 17.4 L50 18 Z" fill="url(#brass-bar)" stroke="rgb(0 0 0 / .35)" strokeWidth=".5" />
      <path d="M17 12 H44" stroke="#fffbe8" strokeOpacity=".85" strokeWidth="1.1" strokeLinecap="round" />
      <ellipse cx="46.5" cy="10.5" rx="3.2" ry="1.6" fill="#fff" opacity=".55" />
    </svg>
  )
}

function Keyhole() {
  return (
    <svg viewBox="0 0 14 22" className="keyhole" aria-hidden focusable="false">
      <ellipse cx="7" cy="11" rx="6" ry="10" fill="url(#brass-rose)" stroke="rgb(0 0 0 / .4)" strokeWidth=".6" />
      <circle cx="7" cy="9" r="2.2" fill="#140d05" />
      <path d="M5.8 10.4 H8.2 L8.9 16 H5.1 Z" fill="#140d05" />
    </svg>
  )
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
      <BrassDefs />
      <ul className="doors">
        {doors.map((d) => {
          const isOpen = openKey === d.key
          const isEntering = enter?.key === d.key
          return (
            <li
              key={d.key}
              data-door
              data-open={isOpen || isEntering}
              data-entering={isEntering}
              className="door-slot"
              style={{ zIndex: isEntering ? 60 : isOpen ? 10 : undefined, '--dc': d.color, '--s': enter?.scale } as CSSProperties}
            >
              <a
                href={d.href}
                aria-label={`${c.open} ${d.label}`}
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
                <span className="frame">
                  <span className="recess">
                    <span id={`doorway-${d.key}`} className="doorway">
                      <span className="doorway-core" />
                      {d.icon}
                      <span className="doorway-label">{d.label}</span>
                    </span>
                    <span className="leaf">
                      <span className="leaf-face">
                        <span className="plate">{d.label}</span>
                        <Lever />
                        <Keyhole />
                        <span className="leaf-shade" />
                      </span>
                      <span className="leaf-edge" />
                    </span>
                  </span>
                </span>
              </a>
              <span aria-hidden className="reflect" />
              <span aria-hidden className="contact" />
              <span aria-hidden className="spill" />
              {!fine && (
                <span aria-hidden className="door-hint">
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
