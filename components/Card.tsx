'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import Doors from '@/components/Doors'
import Socials from '@/components/Socials'
import PullLamp from '@/components/ui/pull-lamp'
import { COPY, GREETINGS, type Lang } from '@/lib/content'
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
  const c = COPY[lang]

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
    <main className="relative mx-auto w-full max-w-[1280px] px-4 pb-10 lg:px-6">
      <LangToggle lang={lang} onChange={setLang} label={c.langSwitch} />

      {/* HERO: single column on phones, 3 columns (text | photo | lamp) from lg */}
      <section className="grid grid-cols-1 items-start gap-x-8 gap-y-5 lg:grid-cols-[minmax(0,1fr)_280px_260px] lg:gap-x-10 xl:grid-cols-[minmax(0,1fr)_340px_340px]">
        {/* Lamp */}
        <div className="mx-auto w-[200px] lg:col-start-3 lg:row-span-2 lg:row-start-1 lg:w-full">
          <PullLamp on={theme === 'light'} onThemeChange={onThemeChange} />
          <p className="mx-auto -mt-2 max-w-[15rem] text-balance text-center text-xs font-semibold leading-snug text-brass-text lg:max-w-[18rem] lg:text-sm">{c.pullCord}</p>
        </div>

        {/* Greeting */}
        <div className="rise flex flex-col items-center gap-3 text-center lg:col-start-1 lg:row-start-1 lg:items-start lg:pt-14 lg:text-left" style={{ '--i': 0 } as React.CSSProperties}>
          <GreetingBubble avatarAlt={c.avatarAlt} />
          <p className="text-balance text-[15px] font-medium leading-snug text-muted lg:text-lg">{c.welcome}</p>
        </div>

        {/* Photo in arch frame */}
        <div className="rise mx-auto w-[min(68vw,260px)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:w-full lg:pt-14" style={{ '--i': 1 } as React.CSSProperties}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] border-[3px] border-brass bg-panel shadow-[0_24px_48px_-20px_rgb(0_0_0/0.55)]">
            <Image
              src={IMAGES.hero}
              alt={c.photoAlt}
              {...IMAGES.heroSize}
              priority
              sizes="(min-width: 1280px) 340px, (min-width: 1024px) 280px, 260px"
              className="h-full w-full object-cover"
              style={{ objectPosition: IMAGES.heroFocus }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-[7px] rounded-t-[999px] border border-brass/55" />
          </div>
        </div>

        {/* Identity */}
        <header className="rise text-center lg:col-start-1 lg:row-start-2 lg:self-start lg:text-left" style={{ '--i': 2 } as React.CSSProperties}>
          <h1 className="font-display text-[40px] font-semibold leading-[1.05] tracking-tight lg:text-[58px]">Chouaib Ramoul</h1>
          <p className="mx-auto mt-2 max-w-[22rem] text-balance text-[16px] font-semibold leading-snug text-brass-text lg:mx-0 lg:max-w-none lg:text-lg">{c.title}</p>
          <span className="tc mt-4 inline-block rounded-full border border-line bg-panel px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em]">{c.badge}</span>
          <p className="mx-auto mt-4 max-w-[26rem] text-balance text-[15px] leading-relaxed text-muted lg:mx-0 lg:max-w-md lg:text-[16px]">{c.pitch}</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-1.5 pb-2 lg:justify-start">
            {c.chips.map((chip) => (
              <li key={chip} className="tc rounded-full border border-brass/40 px-3 py-1 text-xs font-semibold text-brass-text">
                {chip}
              </li>
            ))}
          </ul>
        </header>
      </section>

      {/* DOORS: one continuous wall, then social buttons */}
      <section aria-labelledby="doors-title" className="mt-10 lg:mt-14">
        <div aria-hidden className="hairline mb-8" />
        <h2 id="doors-title" className="mb-5 text-center font-display text-2xl font-semibold tracking-tight lg:text-3xl">
          {c.doorsTitle}
        </h2>
        <div className="scene rise" style={{ '--i': 4 } as React.CSSProperties}>
          <Doors lang={lang} />
        </div>
        <Socials lang={lang} />
      </section>

      <footer className="mt-12 text-center text-xs text-muted">© 2026 Ramoul Chouaib</footer>
    </main>
  )
}
