'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { COPY, type Lang } from '@/lib/content'
import { IMAGES } from '@/lib/images'

const MAX_TILT = 8 // degrees
const FIRST_POP_MS = 1800
const BUBBLE_MS = 2800
const clamp = (n: number) => Math.max(-1, Math.min(1, n))

/**
 * The 3D bust. Desktop: tilts toward the pointer (spring, rAF, stops when idle). Touch: slow idle sway (CSS).
 * Reduced motion: static. Click = say hi (squish + speech bubble cycling through COPY[lang].bubbles).
 */
export default function Avatar({ lang, className = '' }: { lang: Lang; className?: string }) {
  const c = COPY[lang]
  const [line, setLine] = useState(0)
  const [shown, setShown] = useState(false)
  const next = useRef(0)
  const hideTimer = useRef<number>()
  const stageRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const squishRef = useRef<HTMLDivElement>(null)
  const rimRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)

  const say = useCallback(() => {
    const i = next.current % COPY.fr.bubbles.length
    next.current += 1
    setLine(i)
    setShown(true)
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => setShown(false), BUBBLE_MS)
  }, [])

  const onClick = () => {
    say()
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      squishRef.current?.animate(
        [
          { transform: 'scale(1, 1)' },
          { transform: 'scale(1.035, 0.93)', offset: 0.3 },
          { transform: 'scale(0.985, 1.03)', offset: 0.62 },
          { transform: 'scale(1, 1)' },
        ],
        { duration: 440, easing: 'cubic-bezier(.3,.7,.4,1)' },
      )
    }
  }

  // auto-pop the first bubble once, so visitors discover the avatar is clickable
  useEffect(() => {
    const t = window.setTimeout(say, FIRST_POP_MS)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(hideTimer.current)
    }
  }, [say])

  // pointer tilt (mouse only, no reduced motion)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const tilt = tiltRef.current
    const rim = rimRef.current
    const shadow = shadowRef.current
    const stage = stageRef.current
    if (!tilt || !rim || !shadow || !stage) return

    const s = { tx: 0, ty: 0, x: 0, y: 0, vx: 0, vy: 0, raf: 0 }
    const apply = () => {
      tilt.style.transform = `rotateX(${s.x.toFixed(2)}deg) rotateY(${s.y.toFixed(2)}deg)`
      rim.style.transform = `translateX(${(-s.y * 2.2).toFixed(1)}px)` // light and shadow move opposite the tilt
      shadow.style.transform = `translateX(${(-s.y * 2.6).toFixed(1)}px) scaleX(${(1 - Math.abs(s.y) * 0.012).toFixed(3)})`
    }
    const step = () => {
      // damped spring toward the target
      s.vx = (s.vx + (s.tx - s.x) * 0.085) * 0.78
      s.vy = (s.vy + (s.ty - s.y) * 0.085) * 0.78
      s.x += s.vx
      s.y += s.vy
      apply()
      const settled = Math.abs(s.tx - s.x) < 0.01 && Math.abs(s.ty - s.y) < 0.01 && Math.abs(s.vx) < 0.01 && Math.abs(s.vy) < 0.01
      s.raf = settled ? 0 : requestAnimationFrame(step)
    }
    const kick = () => {
      if (!s.raf) s.raf = requestAnimationFrame(step)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const r = stage.getBoundingClientRect()
      s.ty = clamp((e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)) * MAX_TILT
      s.tx = -clamp((e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)) * MAX_TILT
      kick()
    }
    const onLeave = () => {
      s.tx = 0
      s.ty = 0
      kick()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(s.raf)
    }
  }, [])

  return (
    <div ref={stageRef} className={`avatar-stage ${className}`}>
      <div ref={shadowRef} aria-hidden className="avatar-shadow" />
      <button type="button" onClick={onClick} aria-label={c.avatarLabel} className="avatar-btn">
        <div ref={tiltRef} className="avatar-tilt">
          <div ref={squishRef} className="avatar-squish">
            <div className="avatar-mask">
              <Image
                src={IMAGES.hero}
                alt={c.photoAlt}
                {...IMAGES.heroSize}
                priority
                sizes="(min-width: 1024px) 540px, 350px"
                className="avatar-img"
                draggable={false}
              />
              {/* lights are clipped to his silhouette with the cutout itself */}
              <div aria-hidden className="avatar-fx" style={{ '--cutout': `url(${IMAGES.hero})` } as CSSProperties}>
                <div className="avatar-cone" />
                <div className="avatar-screen" />
                <div ref={rimRef} className="avatar-rim" />
              </div>
            </div>
          </div>
        </div>
      </button>
      <p role="status" aria-live="polite" data-shown={shown} className="avatar-bubble">
        {c.bubbles[line]}
      </p>
    </div>
  )
}
