'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ChevronDown } from 'lucide-react'
import Avatar from '@/components/Avatar'
import Decor from '@/components/Decor'
import Desk from '@/components/Desk'
import Doors from '@/components/Doors'
import { Gallery } from '@/components/HallArt'
import StatusRow from '@/components/StatusRow'
import PullLamp from '@/components/ui/pull-lamp'
import { ABOUT_EN, ABOUT_FR, COPY, type Lang } from '@/lib/content'
import { applyTheme, readTheme, type Theme } from '@/lib/theme'

// Tiny dust motes drifting in the lamp's light: position, drift, duration, delay (max 10, CSS only)
const MOTES = [
  [74, 22, 14, -26, 11, 0], [80, 40, -12, -30, 9, -3], [88, 30, 10, -22, 13, -6], [70, 55, 16, -34, 10, -2], [92, 52, -10, -28, 12, -8],
  [78, 66, 12, -24, 9, -5], [85, 18, -14, -20, 14, -9], [66, 38, 10, -30, 11, -4], [95, 70, -8, -26, 10, -7], [72, 74, 14, -28, 13, -1],
] as const

function Dust() {
  return (
    <div aria-hidden className="dust">
      {MOTES.map(([x, y, dx, dy, d, delay], i) => (
        <i key={i} style={{ '--x': `${x}%`, '--y': `${y}%`, '--dx': `${dx}px`, '--dy': `${dy}px`, '--d': `${d}s`, '--delay': `${delay}s` } as CSSProperties} />
      ))}
    </div>
  )
}

function LangToggle({ lang, onChange, label }: { lang: Lang; onChange: (l: Lang) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="tc absolute right-4 top-4 z-20 flex rounded-full lg:right-[max(1rem,calc((100%-1360px)/2+1.5rem))] border border-line bg-panel p-0.5 text-[13px] font-bold">
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          aria-label={l === 'fr' ? 'Français' : 'English'}
          onClick={() => onChange(l)}
          className={`h-11 min-w-[44px] rounded-full px-3 uppercase transition ${lang === l ? 'bg-brass text-forest' : 'text-muted hover:text-ink'}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

export default function Card() {
  const [lang, setLang] = useState<Lang>('fr')
  const [theme, setTheme] = useState<Theme>('dark')
  const [fine, setFine] = useState(true) // (hover: hover) and (pointer: fine), same query as the doors
  const c = COPY[lang]
  // The lamp toggles on pointer-up AND on a click with detail 0 (its keyboard path). Some phone browsers send
  // detail 0 for finger taps too, which toggled twice (looked dead). Only let clicks through after a key press.
  const lampKey = useRef(false)
  const about = lang === 'fr' ? ABOUT_FR : ABOUT_EN

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setFine(mq.matches)
    sync()
    // Safari < 14 only has addListener
    if (mq.addEventListener) mq.addEventListener('change', sync)
    else mq.addListener(sync)
    return () => (mq.removeEventListener ? mq.removeEventListener('change', sync) : mq.removeListener(sync))
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    document.documentElement.setAttribute('data-hydrated', '1') // read by the /?debug panel
    setTheme(readTheme()) // value already applied before first paint by the inline script
  }, [])

  const onThemeChange = (t: Theme) => {
    applyTheme(t)
    setTheme(t)
  }

  return (
    <main className="relative w-full pb-[calc(4rem+env(safe-area-inset-bottom))] lg:pb-[calc(5rem+env(safe-area-inset-bottom))]">
      {/* HERO = one full-bleed room: wall + wainscot + desk + floor, wall decor, the bust, the lamp, the name.
          The room fades into the page at the bottom, so it flows into the doors hall below.
          Phone: bust on top, text below the room. Desktop: text | bust | lamp, all inside the room. */}
      <section className="hero relative lg:pb-[var(--fh)]">
        <LangToggle lang={lang} onChange={setLang} label={c.langSwitch} />
        <div className="mx-auto max-w-[1360px] px-4 lg:grid lg:grid-cols-[minmax(0,1fr)_clamp(380px,36vw,540px)_clamp(170px,16vw,240px)] lg:items-end lg:gap-x-7 lg:px-10 lg:pt-14">
          <div className="stage relative -mx-4 px-4 pb-[var(--fh)] pt-3 lg:contents">
            <div aria-hidden className="room-bg">
              <i className="rb-wain" />
              <i className="rb-skirt" />
              <i className="rb-floor" />
            </div>
            <Decor />

            <Avatar lang={lang} className="relative z-[1] w-[min(79%,300px)] lg:col-start-2 lg:row-start-1 lg:w-full" />

            {/* The desk is in front of him (z above) and runs across the full width. */}
            <Desk />

            {/* Lamp (theme switch) standing on the desk, right side. Its base sits in the middle of the desk top. */}
            <div
              className="absolute right-0 bottom-[calc(var(--deskB)+var(--deskH)-var(--deskTop)/2-var(--lampw)*0.128)] z-[4] w-[var(--lampw)] lg:relative lg:bottom-auto lg:right-auto lg:col-start-3 lg:row-start-1 lg:mb-[calc(var(--deskH)-var(--deskDrop)-var(--deskTop)/2-var(--lampw)*0.128)] lg:w-full"
              onKeyDownCapture={() => (lampKey.current = true)}
              onPointerDownCapture={() => (lampKey.current = false)}
              onClickCapture={(e) => {
                if (!lampKey.current) e.stopPropagation()
              }}
            >
              <PullLamp on={theme === 'light'} onThemeChange={onThemeChange} />
              <p className="lamp-hint">{c.pullCord}</p>
            </div>
            <Dust />
          </div>

          {/* Identity */}
          <header className="rise relative z-[2] mt-7 text-center lg:col-start-1 lg:row-start-1 lg:mb-[calc(var(--deskH)-var(--deskDrop)+20px)] lg:mt-0 lg:self-end lg:text-left" style={{ '--i': 2 } as CSSProperties}>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brass-text">{c.eyebrow}</p>
            <h1 className="mt-2 text-balance font-display text-[40px] font-semibold leading-[1.04] tracking-tight lg:text-[clamp(2.2rem,4.2vw,3.6rem)]">
              <span className="block">Ramoul Chouaib</span>
              <span className="block font-normal text-brass-text">Taki Eddine</span>
            </h1>
            <p className="mx-auto mt-3 max-w-[22rem] text-balance text-[16px] font-semibold leading-snug text-brass-text lg:mx-0 lg:max-w-none lg:text-base">{c.title}</p>
            <span className="tc mt-4 inline-block rounded-full border border-line bg-panel px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]">{c.badge}</span>
            <StatusRow lang={lang} />
            {about && <p className="mx-auto mt-4 max-w-[46ch] text-balance text-[15px] leading-relaxed text-muted lg:mx-0 lg:text-[16px]">{about}</p>}
          </header>
        </div>
      </section>

      <a href="#doors-title" aria-label={c.seeDoors} className="chev mx-auto mt-6 grid h-11 w-11 place-items-center rounded-full text-brass-text lg:mt-8">
        <ChevronDown aria-hidden className="h-6 w-6" strokeWidth={2.2} />
      </a>

      {/* DOORS: one full-width hall (crown, wall, wainscot, floor), doors in the middle, plants and garlands between them */}
      <section aria-labelledby="doors-title" className="mt-6 scroll-mt-4 lg:mt-8">
        <div className="mx-auto max-w-[1280px] px-4 lg:px-6">
          <div aria-hidden className="hairline mb-8" />
          <h2 id="doors-title" className="text-center font-display text-2xl font-semibold tracking-tight lg:text-3xl">
            {c.doorsTitle}
          </h2>
          <p className="mx-auto mb-5 mt-2 min-h-[2.6rem] max-w-md text-balance text-center text-sm leading-snug text-muted sm:min-h-0">
            {fine ? c.doorsHintMouse : c.doorsHintTouch}
          </p>
        </div>
        <div className="scene rise" style={{ '--i': 4 } as React.CSSProperties}>
          <span aria-hidden className="crown" />
          <span aria-hidden className="gallery">
            <Gallery className="hall-svg" />
          </span>
          <Doors lang={lang} />
        </div>
      </section>
    </main>
  )
}
