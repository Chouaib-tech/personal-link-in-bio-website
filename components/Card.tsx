'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { ChevronDown } from 'lucide-react'
import Avatar from '@/components/Avatar'
import Doors from '@/components/Doors'
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
    <div role="group" aria-label={label} className="tc absolute right-4 top-4 z-20 flex rounded-full border border-line bg-panel p-0.5 text-[13px] font-bold">
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
    <main className="relative mx-auto w-full max-w-[1280px] px-4 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:px-6 lg:pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <LangToggle lang={lang} onChange={setLang} label={c.langSwitch} />

      {/* HERO = one room: wall + wainscot + floor, the bust, the lamp, the name.
          Phone: bust on top, lamp small at the top right, text below. Desktop: text | bust | lamp. */}
      <section
        className="hero relative lg:grid lg:grid-cols-[minmax(0,1fr)_clamp(380px,36vw,540px)_clamp(170px,16vw,240px)] lg:items-end lg:gap-x-7 mt-3 lg:mt-4 lg:px-10 lg:pb-[var(--fh)] lg:pt-14 min-[1360px]:-mx-12"
        style={{ '--lampw': 'clamp(170px, 16vw, 240px)' } as CSSProperties}
      >
        <div className="stage relative pb-[var(--fh)] pt-3 lg:contents">
          <div aria-hidden className="room-bg">
            <i className="rb-wain" />
            <i className="rb-skirt" />
            <i className="rb-floor" />
          </div>

          <Avatar lang={lang} className="relative z-[1] w-[min(92%,350px)] lg:col-start-2 lg:row-start-1 lg:w-full" />

          {/* Lamp (theme switch): on a little wall shelf on phones, standing on the floor on desktop */}
          <div
            className="absolute right-1 top-[78px] z-[2] w-[88px] lg:relative lg:right-auto lg:top-auto lg:z-[1] lg:col-start-3 lg:row-start-1 lg:mb-[calc(var(--lampw)*-0.128)] lg:w-full"
            onKeyDownCapture={() => (lampKey.current = true)}
            onPointerDownCapture={() => (lampKey.current = false)}
            onClickCapture={(e) => {
              if (!lampKey.current) e.stopPropagation()
            }}
          >
            <PullLamp on={theme === 'light'} onThemeChange={onThemeChange} />
            <i aria-hidden className="lamp-shelf lg:hidden" />
            <p className="lamp-hint">{c.pullCord}</p>
          </div>
          <Dust />
        </div>

        {/* Identity */}
        <header className="rise relative z-[2] mt-7 text-center lg:col-start-1 lg:row-start-1 lg:mt-0 lg:self-center lg:text-left" style={{ '--i': 2 } as CSSProperties}>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brass-text">{c.eyebrow}</p>
          <h1 className="mt-2 text-balance font-display text-[40px] font-semibold leading-[1.04] tracking-tight lg:text-[clamp(2.2rem,4.2vw,4rem)]">
            <span className="block">Ramoul Chouaib</span>
            <span className="block font-normal text-brass-text">Taki Eddine</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[22rem] text-balance text-[16px] font-semibold leading-snug text-brass-text lg:mx-0 lg:max-w-none lg:text-lg">{c.title}</p>
          <span className="tc mt-4 inline-block rounded-full border border-line bg-panel px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]">{c.badge}</span>
          <StatusRow lang={lang} />
          {about && <p className="mx-auto mt-4 max-w-[46ch] text-balance text-[15px] leading-relaxed text-muted lg:mx-0 lg:text-[16px]">{about}</p>}
        </header>
      </section>

      <a href="#doors-title" aria-label={c.seeDoors} className="chev mx-auto mt-6 grid h-11 w-11 place-items-center rounded-full text-brass-text lg:mt-8">
        <ChevronDown aria-hidden className="h-6 w-6" strokeWidth={2.2} />
      </a>

      {/* DOORS: one continuous wall, then social buttons */}
      <section aria-labelledby="doors-title" className="mt-6 scroll-mt-4 lg:mt-8">
        <div aria-hidden className="hairline mb-8" />
        <h2 id="doors-title" className="text-center font-display text-2xl font-semibold tracking-tight lg:text-3xl">
          {c.doorsTitle}
        </h2>
        <p className="mx-auto mb-5 mt-2 min-h-[2.6rem] max-w-md text-balance text-center text-sm leading-snug text-muted sm:min-h-0">
          {fine ? c.doorsHintMouse : c.doorsHintTouch}
        </p>
        <div className="scene rise" style={{ '--i': 4 } as React.CSSProperties}>
          <Doors lang={lang} />
        </div>
      </section>
    </main>
  )
}
