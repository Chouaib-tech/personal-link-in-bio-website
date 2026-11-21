'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Globe, Mail, Phone } from 'lucide-react'
import { BrandIcon, type BrandName } from '@/components/BrandIcons'
import { COPY, LINKS, type Lang } from '@/lib/content'

const ICON = 'h-7 w-7 sm:h-9 sm:w-9 lg:h-12 lg:w-12'

// Painted, slightly desaturated: mint, cobalt, orange, deep violet.
// Cycled by index, so no two neighbours match (3-column phone grid or 5/4 desktop rows).
const COLORS = ['#5f9c86', '#34599a', '#c06a35', '#583f7c']

type DoorDef = { key: string; label: string; href: string; icon: ReactNode; color: string }

const brand = (name: BrandName) => <BrandIcon name={name} className={ICON} />
const stroke = { 'aria-hidden': true, className: ICON, strokeWidth: 1.75 } as const

function buildDoors(lang: Lang): DoorDef[] {
  const c = COPY[lang]
  const list: Omit<DoorDef, 'color'>[] = [
    { key: 'whatsapp', label: 'WhatsApp', href: LINKS.whatsapp, icon: brand('WhatsApp') },
    { key: 'call', label: c.shortCall, href: LINKS.call, icon: <Phone {...stroke} /> },
    { key: 'email', label: c.shortEmail, href: LINKS.email, icon: <Mail {...stroke} /> },
    { key: 'portfolio', label: c.shortPortfolio, href: LINKS.portfolio, icon: <Globe {...stroke} /> },
    { key: 'linkedin', label: 'LinkedIn', href: LINKS.linkedin, icon: brand('LinkedIn') },
    { key: 'github', label: 'GitHub', href: LINKS.github, icon: brand('GitHub') },
    { key: 'telegram', label: 'Telegram', href: LINKS.telegram, icon: brand('Telegram') },
    { key: 'instagram', label: 'Instagram', href: LINKS.instagram, icon: brand('Instagram') },
    { key: 'facebook', label: 'Facebook', href: LINKS.facebook, icon: brand('Facebook') },
  ]
  return list.map((d, i) => ({ ...d, color: COLORS[i % COLORS.length] }))
}

const isWeb = (href: string) => href.startsWith('http')
const staysAlive = (href: string) => href.startsWith('tel:') || href.startsWith('mailto:')

// Timeline (ms): push 250 -> 950, overlay 600 -> 950.
// http(s): new tab at 900 (still inside the user-gesture window); tel/mailto: location.assign at 1000.
const OPEN_TAB_AT = 900
const NAVIGATE_AT = 1000
const REDUCED_NAVIGATE_AT = 150
const TAB_FALLBACK_RESET = 1200 // zoom back out if the new tab did not hide this one
const ALIVE_RESET = 1500 // tel / mailto
const PUSH_SCALE = 14
const SCROLL_KEYS = [' ', 'PageUp', 'PageDown', 'ArrowUp', 'ArrowDown', 'Home', 'End']

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
  const [enter, setEnter] = useState<{ key: string } | null>(null)
  const [fine, setFine] = useState(true) // (hover: hover) and (pointer: fine)
  const [reduced, setReduced] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)
  const lastPointer = useRef<string>('mouse')
  const busy = useRef(false)
  const timers = useRef<number[]>([])
  const scrollY0 = useRef<number | null>(null)
  const detachReturn = useRef<(() => void) | null>(null)

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }

  const lockScroll = useCallback((on: boolean) => {
    const stop = (e: Event) => e.preventDefault()
    const stopKeys = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.includes(e.key)) e.preventDefault()
    }
    const w = window as unknown as { __doorLock?: () => void }
    w.__doorLock?.()
    w.__doorLock = undefined
    if (!on) return
    window.addEventListener('wheel', stop, { passive: false })
    window.addEventListener('touchmove', stop, { passive: false })
    window.addEventListener('keydown', stopKeys)
    w.__doorLock = () => {
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchmove', stop)
      window.removeEventListener('keydown', stopKeys)
    }
  }, [])

  const scene = () => listRef.current?.closest<HTMLElement>('.scene') ?? null

  /** Instant reset: no transition, overlay removed, doors closed. */
  const reset = useCallback(() => {
    clearTimers()
    detachReturn.current?.()
    detachReturn.current = null
    busy.current = false
    const el = scene()
    if (el) {
      el.style.transition = 'none'
      el.removeAttribute('data-push')
      el.style.transformOrigin = ''
      el.style.removeProperty('--tx')
      el.style.removeProperty('--ty')
      el.style.removeProperty('--s')
      void el.offsetHeight // commit the cleared transform before transitions come back
      el.style.transition = ''
    }
    lockScroll(false)
    setEnter(null)
    setOpenKey(null)
    if (scrollY0.current !== null) window.scrollTo(0, scrollY0.current)
    scrollY0.current = null
  }, [lockScroll])

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
    // Back button / bfcache: restore every door, the camera and the scroll position
    window.addEventListener('pageshow', reset)
    return () => {
      hoverMq.removeEventListener('change', sync)
      motionMq.removeEventListener('change', sync)
      window.removeEventListener('pageshow', reset)
      clearTimers()
      detachReturn.current?.()
      lockScroll(false)
    }
  }, [reset, lockScroll])

  // Tap outside closes the open door
  useEffect(() => {
    if (!openKey) return
    const onDown = (e: Event) => {
      if (!busy.current && !(e.target as Element).closest?.('[data-door]')) setOpenKey(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [openKey])

  /** The page stays alive (tel:, mailto:, new tab): zoom back out and re-enable everything. */
  const reverse = useCallback(() => {
    if (!busy.current) return // already reset (idempotent)
    const el = scene()
    busy.current = false
    setEnter(null)
    setOpenKey(null)
    el?.removeAttribute('data-push') // base transition plays the camera back
    timers.current.push(
      window.setTimeout(() => {
        if (el) {
          el.style.transformOrigin = ''
          el.style.removeProperty('--tx')
          el.style.removeProperty('--ty')
          el.style.removeProperty('--s')
        }
        lockScroll(false)
        scrollY0.current = null
      }, 650),
    )
  }, [lockScroll])

  /** http(s): open in a new tab; if the browser blocks it, fall back to this tab. */
  const openNewTab = useCallback(
    (href: string) => {
      let w: Window | null = null
      try {
        w = window.open(href, '_blank') // no "noopener" feature: we need the return value to detect blocking
      } catch {}
      if (!w) {
        window.location.assign(href)
        return
      }
      try {
        w.opener = null
      } catch {}
      // (a) coming back to this tab: clean hall, instantly
      const onVisible = () => {
        if (document.visibilityState === 'visible') reset()
      }
      const onFocus = () => reset()
      document.addEventListener('visibilitychange', onVisible)
      window.addEventListener('focus', onFocus)
      detachReturn.current = () => {
        document.removeEventListener('visibilitychange', onVisible)
        window.removeEventListener('focus', onFocus)
      }
      // (b) fallback for browsers where the new tab does not hide this one
      timers.current.push(window.setTimeout(reverse, TAB_FALLBACK_RESET))
    },
    [reset, reverse],
  )

  const go = useCallback(
    (d: DoorDef) => {
      if (busy.current) return
      busy.current = true
      scrollY0.current = window.scrollY
      lockScroll(true)
      setOpenKey(d.key) // force it open if it is still swinging
      setEnter({ key: d.key })

      const el = scene()
      const doorway = document.getElementById(`doorway-${d.key}`)
      if (!reduced && el && doorway) {
        // Camera push: origin = doorway centre (scene coords), translate it to the viewport centre
        const sr = el.getBoundingClientRect()
        const dr = doorway.getBoundingClientRect()
        const dx = dr.left + dr.width / 2
        const dy = dr.top + dr.height / 2
        el.style.transformOrigin = `${dx - sr.left}px ${dy - sr.top}px`
        el.style.setProperty('--tx', `${window.innerWidth / 2 - dx}px`)
        el.style.setProperty('--ty', `${window.innerHeight / 2 - dy}px`)
        el.style.setProperty('--s', String(PUSH_SCALE))
        el.setAttribute('data-push', 'true')
      }

      const web = isWeb(d.href)
      timers.current.push(
        window.setTimeout(
          () => {
            if (web) return openNewTab(d.href)
            window.location.assign(d.href)
            if (staysAlive(d.href)) timers.current.push(window.setTimeout(reverse, ALIVE_RESET))
          },
          reduced ? REDUCED_NAVIGATE_AT : web ? OPEN_TAB_AT : NAVIGATE_AT,
        ),
      )
    },
    [reduced, reverse, lockScroll, openNewTab],
  )

  const onClick = (e: MouseEvent<HTMLAnchorElement>, d: DoorDef) => {
    // Ctrl / Cmd / Shift / Alt / non-primary: normal browser behaviour, no animation
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    if (busy.current) return e.preventDefault()
    e.preventDefault()
    const touch = (!fine || lastPointer.current === 'touch') && e.detail !== 0
    if (touch && openKey !== d.key) return setOpenKey(d.key) // 1st tap: open
    go(d) // desktop click / Enter / 2nd tap
  }

  return (
    <>
      <BrassDefs />
      <ul ref={listRef} className="doors" data-busy={!!enter}>
        {doors.map((d, i) => {
          const isOpen = openKey === d.key
          const isEntering = enter?.key === d.key
          return (
            <li
              key={d.key}
              data-door
              data-open={isOpen || isEntering}
              data-entering={isEntering}
              data-first={i === 0 ? '' : undefined}
              data-sm-start={i % 3 === 0 ? '' : undefined}
              data-sm-last={i === 6 ? '' : undefined}
              data-lg-start={i === 0 || i === 5 ? '' : undefined}
              data-lg-shift={i === 5 ? '' : undefined}
              data-lg-last={i === 5 ? '' : undefined}
              className="door-slot"
              style={{ '--dc': d.color } as CSSProperties}
            >
              <span aria-hidden className="cornice" data-c-sm={i > 0 && i % 3 === 0 ? '' : undefined} data-c-lg={i === 5 ? '' : undefined} />
              <a
                href={d.href}
                aria-label={`${c.open} ${d.label}`}
                {...(isWeb(d.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="door-link block rounded-t-[999px] focus-visible:ring-offset-4"
                style={{ zIndex: isOpen || isEntering ? 10 : undefined }}
                onPointerDown={(e) => (lastPointer.current = e.pointerType)}
                onPointerEnter={(e) => {
                  if (!busy.current && e.pointerType !== 'touch' && fine) setOpenKey(d.key)
                }}
                onPointerLeave={(e) => {
                  if (!busy.current && e.pointerType !== 'touch' && fine) setOpenKey((k) => (k === d.key ? null : k))
                }}
                onFocus={(e) => {
                  if (!busy.current && e.currentTarget.matches(':focus-visible')) setOpenKey(d.key)
                }}
                onBlur={() => {
                  if (!busy.current) setOpenKey((k) => (k === d.key ? null : k))
                }}
                onClick={(e) => onClick(e, d)}
              >
                <span className="frame">
                  <span className="recess">
                    <span id={`doorway-${d.key}`} className="doorway">
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
      {/* Portaled to <body>: the scene is transformed during the push, which would capture a fixed overlay */}
      {enter && createPortal(<div aria-hidden className="flood" data-reduced={reduced ? '' : undefined} />, document.body)}
    </>
  )
}
