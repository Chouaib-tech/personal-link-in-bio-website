'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { UserPlus } from 'lucide-react'
import Doors from '@/components/Doors'
import PullLamp from '@/components/ui/pull-lamp'
import { COPY, GREETINGS, downloadVCard, type Lang } from '@/lib/content'
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
          <p className="-mt-2 text-center text-xs font-semibold text-brass-text lg:text-sm">↑ {c.pullCord}</p>
        </div>

        {/* Greeting */}
        <div className="rise flex flex-col items-center gap-3 text-center lg:col-start-1 lg:row-start-1 lg:items-start lg:pt-14 lg:text-left" style={{ '--i': 0 } as React.CSSProperties}>
          <GreetingBubble avatarAlt={c.avatarAlt} />
          <p className="text-balance text-[15px] font-medium leading-snug text-muted lg:text-lg">{c.welcome}</p>
        </div>

        {/* Photo in arch frame */}
        <div className="rise mx-auto w-[min(68vw,260px)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:w-full lg:pt-14" style={{ '--i': 1 } as React.CSSProperties}>
          <div className="aspect-[4/5] overflow-hidden rounded-t-[999px] border-[3px] border-brass bg-panel shadow-2xl shadow-black/25">
            <Image
              src={IMAGES.hero}
              alt={c.photoAlt}
              {...IMAGES.heroSize}
              priority
              sizes="(min-width: 1280px) 340px, (min-width: 1024px) 280px, 260px"
              className="h-full w-full object-cover object-[50%_18%]"
            />
          </div>
        </div>

        {/* Identity */}
        <header className="rise text-center lg:col-start-1 lg:row-start-2 lg:self-start lg:text-left" style={{ '--i': 2 } as React.CSSProperties}>
          <h1 className="text-[34px] font-extrabold leading-tight tracking-tight lg:text-5xl">Chouaib Ramoul</h1>
          <p className="mx-auto mt-1.5 max-w-[22rem] text-balance text-[17px] font-semibold leading-snug text-brass-text lg:mx-0 lg:max-w-none lg:text-xl">{c.title}</p>
          <span className="tc mt-3 inline-block rounded-full border border-line bg-panel px-4 py-1.5 text-[13px] font-semibold">{c.badge}</span>
          <p className="mx-auto mt-4 max-w-[26rem] text-balance text-[15px] leading-relaxed text-muted lg:mx-0 lg:max-w-md lg:text-[16px]">{c.pitch}</p>
          <ul className="mt-4 flex flex-wrap justify-center gap-1.5 lg:justify-start">
            {c.chips.map((chip) => (
              <li key={chip} className="tc rounded-full border border-brass/50 px-3 py-1 text-xs font-semibold text-brass-text">
                {chip}
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => downloadVCard(lang)}
            className="mt-6 inline-flex h-14 w-full max-w-sm items-center justify-center gap-3 rounded-2xl bg-brass px-8 text-[17px] font-bold text-forest shadow-lg shadow-black/20 transition duration-200 hover:bg-brass-hi motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.97] lg:w-auto"
          >
            <UserPlus aria-hidden className="h-5 w-5" />
            {c.save}
          </button>
        </header>
      </section>

      {/* CORRIDOR: wall + floor + doors */}
      <section aria-labelledby="doors-title" className="relative mt-12 lg:mt-16">
        <h2 id="doors-title" className="mb-4 text-center text-xs font-bold uppercase tracking-[0.18em] text-muted">
          {c.followMe}
        </h2>
        <div className="wall relative rounded-3xl border border-line px-3 pb-8 pt-8 lg:px-10 lg:pt-12">
          <div aria-hidden className="pool pointer-events-none absolute inset-x-0 top-0 h-48 rounded-t-3xl lg:inset-x-auto lg:right-10 lg:h-[420px] lg:w-[520px]" />
          <Doors lang={lang} />
        </div>
      </section>

      <footer className="mt-10 text-center text-xs text-muted">© 2026 Ramoul Chouaib</footer>
    </main>
  )
}
