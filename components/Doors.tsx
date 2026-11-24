'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Globe, Mail, Phone } from 'lucide-react'
import { BrandIcon, type BrandName } from '@/components/BrandIcons'
import { COPY, GMAIL_COMPOSE, LINKS, type Lang } from '@/lib/content'
import { PREVIEWS, type PreviewKey } from '@/lib/images'

const ICON = 'h-7 w-7 sm:h-9 sm:w-9 lg:h-12 lg:w-12'

type DoorDef = { key: string; label: string; href: string; icon: ReactNode }

// Brand light: the strip under each door and the dot on its nameplate. [colour, optional second colour]
const BRAND: Record<string, [string, string?]> = {
  whatsapp: ['#25d366'],
  call: ['#7ddc5b'],
  email: ['#ea4335'],
  portfolio: ['#d4a568'],
  linkedin: ['#2f8fe8'],
  github: ['#c9bbff', '#ffffff'],
  telegram: ['#2aabee'],
  instagram: ['#f58529', '#dd2a7b'],
  facebook: ['#3b86f7'],
}

const brand = (name: BrandName) => <BrandIcon name={name} className={ICON} />
const stroke = { 'aria-hidden': true, className: ICON, strokeWidth: 1.75 } as const

function buildDoors(lang: Lang): DoorDef[] {
  const c = COPY[lang]
  return [
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
}

// MediaQueryList.addEventListener does not exist on Safari < 14
const listen = (mq: MediaQueryList, fn: () => void) => (mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn))
const unlisten = (mq: MediaQueryList, fn: () => void) => (mq.removeEventListener ? mq.removeEventListener('change', fn) : mq.removeListener(fn))

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
        <clipPath id="lever-clip">
          <path d="M34 8.2 L9 8.8 Q3 9.2 3 12 Q3 14.8 9 15.2 L34 15.8 Z" />
        </clipPath>
        <linearGradient id="lever-shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fff" stopOpacity=".95" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
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
    <svg viewBox="0 0 44 24" className="lever" aria-hidden focusable="false">
      {/* baked shadow: no CSS filter on the animated leaf */}
      <g transform="translate(-1.6 2.2)" fill="#000" opacity=".38">
        <circle cx="34" cy="12" r="9" />
        <path d="M34 8.2 L9 8.8 Q3 9.2 3 12 Q3 14.8 9 15.2 L34 15.8 Z" />
      </g>
      <circle cx="34" cy="12" r="9" fill="url(#brass-rose)" stroke="rgb(0 0 0 / .4)" strokeWidth=".6" />
      <circle cx="34" cy="12" r="6.2" fill="none" stroke="rgb(255 255 255 / .35)" strokeWidth=".7" />
      <path d="M34 8.2 L9 8.8 Q3 9.2 3 12 Q3 14.8 9 15.2 L34 15.8 Z" fill="url(#brass-bar)" stroke="rgb(0 0 0 / .35)" strokeWidth=".5" />
      <path d="M8.5 10.1 H30" stroke="#fffbe8" strokeOpacity=".85" strokeWidth="1" strokeLinecap="round" />
      <ellipse cx="36.5" cy="8.4" rx="3" ry="1.5" fill="#fff" opacity=".5" />
      {/* a highlight that sweeps along the brass when the door opens (CSS, one shot) */}
      <rect className="lever-shine" x="-18" y="6" width="14" height="14" fill="url(#lever-shine)" clipPath="url(#lever-clip)" />
    </svg>
  )
}

function Keyhole() {
  return (
    <svg viewBox="0 0 14 22" className="keyhole" aria-hidden focusable="false">
      <ellipse cx="5.6" cy="12.6" rx="6" ry="10" fill="#000" opacity=".38" />
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
  // Preview images: no request until the doors are near the viewport, or a door is touched / hovered / focused.
  const [near, setNear] = useState(false)
  const [warm, setWarm] = useState<Record<string, true>>({})
  const heat = (key: string) => setWarm((w) => (w[key] ? w : { ...w, [key]: true }))
  // Doors fade up with a small stagger, once, when the hall scrolls into view. Nothing is hidden before JS runs,
  // when the hall is already on screen at load, or with reduced motion.
  const [reveal, setReveal] = useState<'off' | 'armed' | 'in'>('off')
  const lastPointer = useRef<string>('mouse')
  const viaKeyboard = useRef(false) // Enter/Space on a focused door (NOT click.detail: some phones send 0 for taps)
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
    listen(hoverMq, sync)
    listen(motionMq, sync)
    // Back button / bfcache: restore every door, the camera and the scroll position
    window.addEventListener('pageshow', reset)
    return () => {
      unlisten(hoverMq, sync)
      unlisten(motionMq, sync)
      window.removeEventListener('pageshow', reset)
      clearTimers()
      detachReturn.current?.()
      lockScroll(false)
    }
  }, [reset, lockScroll])

  useEffect(() => {
    const el = listRef.current
    if (!el || !('IntersectionObserver' in window)) return setNear(true)
    let io: IntersectionObserver | undefined
    // Wait for the window "load" event so the previews never compete with the hero photo (LCP).
    const watch = () => {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            setNear(true)
            io?.disconnect()
          }
        },
        { rootMargin: '100px 0px' },
      )
      io.observe(el)
    }
    if (document.readyState === 'complete') watch()
    else window.addEventListener('load', watch, { once: true })
    return () => {
      window.removeEventListener('load', watch)
      io?.disconnect()
    }
  }, [])

  useEffect(() => {
    const el = listRef.current
    if (!el || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return // already visible: no animation
    let done = 0
    setReveal('armed')
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        setReveal('in')
        done = window.setTimeout(() => setReveal('off'), 1700) // drop the transitions once everything has landed
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(done)
    }
  }, [])

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
    (d: DoorDef, href: string) => {
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

      const web = isWeb(href)
      timers.current.push(
        window.setTimeout(
          () => {
            if (web) return openNewTab(href)
            window.location.assign(href)
            if (staysAlive(href)) timers.current.push(window.setTimeout(reverse, ALIVE_RESET))
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
    const touch = (!fine || lastPointer.current === 'touch') && !viaKeyboard.current
    if (touch && openKey !== d.key) return setOpenKey(d.key) // 1st tap: open
    // desktop: no mail app is guaranteed, so the email door opens Gmail compose; touch keeps mailto:
    go(d, d.key === 'email' && !touch ? GMAIL_COMPOSE : d.href) // desktop click / Enter / 2nd tap
  }

  return (
    <>
      <BrassDefs />
      <ul ref={listRef} className="doors" data-busy={!!enter} data-reveal={reveal === 'off' ? undefined : reveal}>
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
              data-sm-end={i % 3 === 2 ? '' : undefined}
              data-sm-last={i === 6 ? '' : undefined}
              data-lg-start={i === 0 || i === 5 ? '' : undefined}
              data-lg-end={i === 4 || i === 8 ? '' : undefined}
              data-lg-shift={i === 5 || i === 8 ? '' : undefined}
              data-lg-last={i === 5 ? '' : undefined}
              className="door-slot"
              style={{ '--gi': i, '--bc': BRAND[d.key][0], '--bc2': BRAND[d.key][1] ?? BRAND[d.key][0] } as CSSProperties}
            >
              <span aria-hidden className="wainscot" />
              <span aria-hidden className="wpanel" />
              <span aria-hidden className="cornice" data-c-sm={i > 0 && i % 3 === 0 ? '' : undefined} data-c-lg={i === 5 ? '' : undefined} />
              <span aria-hidden className="spot" />
              <span aria-hidden className="sconce" />
              <a
                href={d.href}
                aria-label={`${c.open} ${d.label}`}
                {...(isWeb(d.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="door-link block rounded-sm focus-visible:ring-offset-4"
                style={{ zIndex: isOpen || isEntering ? 10 : undefined }}
                onPointerOver={() => heat(d.key)}
                onTouchStartCapture={() => heat(d.key)}
                onFocusCapture={() => heat(d.key)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') viaKeyboard.current = true
                }}
                onTouchStart={() => {
                  lastPointer.current = 'touch'
                  viaKeyboard.current = false
                }}
                onPointerDown={(e) => {
                  lastPointer.current = e.pointerType || lastPointer.current
                  viaKeyboard.current = false
                }}
                onPointerEnter={(e) => {
                  if (!busy.current && e.pointerType !== 'touch' && fine) setOpenKey(d.key)
                }}
                onPointerLeave={(e) => {
                  if (!busy.current && e.pointerType !== 'touch' && fine) setOpenKey((k) => (k === d.key ? null : k))
                }}
                onFocus={(e) => {
                  if (busy.current) return
                  let visible = false
                  try {
                    visible = e.currentTarget.matches(':focus-visible')
                  } catch {} // older Safari has no :focus-visible
                  if (visible) setOpenKey(d.key)
                }}
                onBlur={() => {
                  if (!busy.current) setOpenKey((k) => (k === d.key ? null : k))
                }}
                onClick={(e) => onClick(e, d)}
              >
                <span className="frame">
                  <span className="recess">
                    <span id={`doorway-${d.key}`} className="doorway" data-img={d.key in PREVIEWS ? '' : undefined}>
                      {d.key in PREVIEWS && (
                        <>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            className="doorway-img"
                            src={near || warm[d.key] ? PREVIEWS[d.key as PreviewKey].src : undefined}
                            width={PREVIEWS[d.key as PreviewKey].width}
                            height={PREVIEWS[d.key as PreviewKey].height}
                            alt={c.previewAlt[d.key as PreviewKey]}
                            decoding="async"
                            draggable={false}
                            style={{ objectPosition: PREVIEWS[d.key as PreviewKey].pos }}
                          />
                          <span aria-hidden className="doorway-shade" />
                        </>
                      )}
                    </span>
                    <span className="leaf">
                      <span className="leaf-face">
                        <span className="panel p1" />
                        <span className="panel p2" />
                        <span className="panel p3" />
                        <span className="panel p4" />
                        <span className="panel p5" />
                        <span className="hinges" />
                        <span className="peep" />
                        <span className="plate">{d.label}</span>
                        <Lever />
                        <Keyhole />
                        <span className="leaf-shade" />
                      </span>
                      <span className="leaf-edge" />
                    </span>
                    {/* brand icon + label: a tag centred on the door, drawn in FRONT of the open leaf so the leaf never hides it */}
                    <span className="doorway-chip">
                      {d.icon}
                      <span className="doorway-label">{d.label}</span>
                    </span>
                  </span>
                </span>
              </a>
              <span aria-hidden className="reflect" />
              <span aria-hidden className="contact" />
              <span aria-hidden className="brand-strip" />
              <span aria-hidden className="mat" />
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
