'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import Doors from '@/components/Doors'
import StatusRow from '@/components/StatusRow'
import PullLamp from '@/components/ui/pull-lamp'
import { ABOUT_EN, ABOUT_FR, COPY, GREETINGS, type Lang } from '@/lib/content'
import { IMAGES } from '@/lib/images'
import { applyTheme, readTheme, type Theme } from '@/lib/theme'

function GreetingBubble({ avatarAlt }: { avatarAlt: string }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % GREETINGS.length), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="tc inline-flex items-center gap-2.5 rounded-full border border-line bg-panel py-1.5 pl-1.5 pr-5 shadow-lg shadow-black/10">
      <Image
        src={IMAGES.avatar}
        alt={avatarAlt}
        {...IMAGES.avatarSize}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-brass"
      />
      <span className="grid text-[18px] font-bold leading-none">
        {GREETINGS.map((g, idx) => (
          <span
            key={g.text}
            lang={g.lang}
            dir={g.dir}
            aria-hidden={idx !== i}
            className={`whitespace-nowrap text-left transition-opacity duration-500 [grid-area:1/1] ${idx === i ? 'opacity-100' : 'opacity-0'}`}
          >
            {g.text}
          </span>
        ))}
      </span>
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
    setTheme(readTheme()) // value already applied before first paint by the inline script
  }, [])

  const onThemeChange = (t: Theme) => {
    applyTheme(t)
    setTheme(t)
  }

  return (
    <main className="relative mx-auto w-full max-w-[1280px] px-4 pb-[calc(4rem+env(safe-area-inset-bottom))] lg:px-6 lg:pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <LangToggle lang={lang} onChange={setLang} label={c.langSwitch} />

      {/* HERO. Phone: greeting top-left (FR/EN is top-right), then photo + lamp side by side, then the text.
          Desktop (lg): 3 columns (text | photo | lamp). */}
      <section className="grid grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] items-center gap-x-3 gap-y-5 pt-4 lg:grid-cols-[minmax(0,1fr)_280px_260px] lg:grid-rows-[1fr_auto_auto_1fr] lg:items-start lg:gap-x-10 lg:gap-y-0 lg:pt-0 xl:grid-cols-[minmax(0,1fr)_340px_340px]">
        {/* Greeting */}
        <div className="rise col-span-2 row-start-1 flex justify-self-start lg:col-span-1 lg:col-start-1 lg:row-start-2 lg:pb-5 lg:pt-14" style={{ '--i': 0 } as React.CSSProperties}>
          <GreetingBubble avatarAlt={c.avatarAlt} />
        </div>

        {/* Photo in arch frame */}
        <div className="rise col-start-1 row-start-2 w-full max-w-[300px] justify-self-center lg:col-start-2 lg:row-span-4 lg:row-start-1 lg:max-w-none lg:pt-14" style={{ '--i': 1 } as React.CSSProperties}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] border-[3px] border-brass bg-panel shadow-[0_24px_48px_-20px_rgb(0_0_0/0.55)]">
            <Image
              src={IMAGES.hero}
              alt={c.photoAlt}
              {...IMAGES.heroSize}
              priority
              sizes="(min-width: 1280px) 340px, (min-width: 1024px) 280px, (min-width: 640px) 300px, 200px"
              className="h-full w-full object-cover"
              style={{ objectPosition: IMAGES.heroFocus }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-[7px] rounded-t-[999px] border border-brass/55" />
          </div>
        </div>

        {/* Lamp (theme switch) */}
        <div
          className="col-start-2 row-start-2 w-full max-w-[230px] justify-self-center lg:col-start-3 lg:row-span-4 lg:row-start-1 lg:max-w-none"
          onKeyDownCapture={() => (lampKey.current = true)}
          onPointerDownCapture={() => (lampKey.current = false)}
          onClickCapture={(e) => {
            if (!lampKey.current) e.stopPropagation()
          }}
        >
          <PullLamp on={theme === 'light'} onThemeChange={onThemeChange} />
          <p className="mx-auto -mt-2 max-w-[15rem] text-balance text-center text-[11px] font-semibold leading-snug text-brass-text sm:text-xs lg:max-w-[18rem] lg:text-sm">{c.pullCord}</p>
        </div>

        {/* Identity */}
        <header className="rise col-span-2 row-start-3 text-center lg:col-span-1 lg:col-start-1 lg:self-start lg:text-left" style={{ '--i': 2 } as React.CSSProperties}>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brass-text">{c.eyebrow}</p>
          <h1 className="mt-2 text-balance font-display text-[40px] font-semibold leading-[1.04] tracking-tight lg:text-[44px] xl:text-[58px]">
            <span className="block">Ramoul Chouaib</span>
            <span className="block font-normal text-brass-text">Taki Eddine</span>
          </h1>
          <p className="mx-auto mt-3 max-w-[22rem] text-balance text-[16px] font-semibold leading-snug text-brass-text lg:mx-0 lg:max-w-none lg:text-lg">{c.title}</p>
          <span className="tc mt-4 inline-block rounded-full border border-line bg-panel px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]">{c.badge}</span>
          <StatusRow lang={lang} />
          {about && <p className="mx-auto mt-4 max-w-[46ch] text-balance text-[15px] leading-relaxed text-muted lg:mx-0 lg:text-[16px]">{about}</p>}
        </header>
      </section>

      {/* DOORS: one continuous wall, then social buttons */}
      <section aria-labelledby="doors-title" className="mt-10 lg:mt-14">
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
