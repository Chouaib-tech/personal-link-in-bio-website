'use client'

import Image from 'next/image'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { FaArrowRight, FaFacebookF, FaGithub, FaInstagram, FaLinkedinIn, FaPhoneAlt, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import { FaEnvelope, FaUserPlus } from 'react-icons/fa6'
import { COPY, GREETINGS, LINKS, downloadVCard, type Lang } from '@/lib/content'
import { IMAGES } from '@/lib/images'

const delay = (i: number) => ({ '--i': i }) as CSSProperties
const isWeb = (href: string) => href.startsWith('http')
const webProps = (href: string) => (isWeb(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})

const press = 'transition duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.97]'

function GreetingBubble({ avatarAlt }: { avatarAlt: string }) {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((n) => (n + 1) % GREETINGS.length), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="glass absolute left-4 top-4 flex items-center gap-2.5 rounded-full bg-ink/50 py-1.5 pl-1.5 pr-4 shadow-lg shadow-black/30">
      <Image
        src={IMAGES.avatar}
        alt={avatarAlt}
        {...IMAGES.avatarSize}
        className="h-9 w-9 rounded-full object-cover ring-2 ring-accent/80"
      />
      <span className="grid text-[17px] font-bold leading-none">
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
    <div role="group" aria-label={label} className="glass absolute right-4 top-4 flex rounded-full bg-ink/50 p-0.5 text-[13px] font-bold shadow-lg shadow-black/30">
      {(['fr', 'en'] as const).map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          aria-label={l === 'fr' ? 'Français' : 'English'}
          onClick={() => onChange(l)}
          className={`h-11 min-w-[44px] rounded-full px-3 uppercase transition ${lang === l ? 'bg-paper text-ink' : 'text-paper/80 hover:text-paper'}`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

function ActionLink({ href, icon, children, className = '' }: { href: string; icon: ReactNode; children: ReactNode; className?: string }) {
  return (
    <a href={href} {...webProps(href)} className={`${press} flex h-14 items-center justify-center gap-3 rounded-2xl text-base font-bold ${className}`}>
      {icon}
      <span>{children}</span>
    </a>
  )
}

export default function Card() {
  const [lang, setLang] = useState<Lang>('fr')
  const c = COPY[lang]

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const socials = [
    { label: 'LinkedIn', href: LINKS.linkedin, icon: <FaLinkedinIn /> },
    { label: 'GitHub', href: LINKS.github, icon: <FaGithub /> },
    { label: 'Telegram', href: LINKS.telegram, icon: <FaTelegramPlane /> },
    { label: 'Instagram', href: LINKS.instagram, icon: <FaInstagram /> },
    { label: 'Facebook', href: LINKS.facebook, icon: <FaFacebookF /> },
    { label: c.email, href: LINKS.email, icon: <FaEnvelope /> },
  ]

  return (
    <main className="relative flex min-h-dvh items-start justify-center overflow-hidden sm:items-center sm:px-4 sm:py-10">
      {/* Desktop backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-0">
        <div className="absolute left-1/2 top-[-18%] h-[70vh] w-[90vw] max-w-[900px] -translate-x-1/2 rounded-full bg-accent/25 blur-[120px]" />
        <div className="absolute bottom-[-25%] right-[-10%] h-[55vh] w-[55vw] rounded-full bg-accent-deep/25 blur-[140px]" />
      </div>

      <article className="relative z-10 w-full max-w-[480px] overflow-hidden bg-ink/90 shadow-2xl shadow-black/60 sm:rounded-[32px] sm:border sm:border-white/10">
        {/* HERO */}
        <section className="relative">
          <div aria-hidden className="absolute inset-x-0 top-0 h-3/4 bg-[radial-gradient(60%_60%_at_50%_30%,rgba(255,77,31,0.45),transparent_70%)]" />
          <div className="relative aspect-square w-full [mask-image:linear-gradient(to_bottom,#000_58%,transparent_100%)]">
            <Image
              src={IMAGES.hero}
              alt={c.photoAlt}
              {...IMAGES.heroSize}
              priority
              sizes="(max-width: 480px) 100vw, 480px"
              className="h-full w-full object-cover"
            />
          </div>
          <GreetingBubble avatarAlt={c.avatarAlt} />
          <LangToggle lang={lang} onChange={setLang} label={c.langSwitch} />
          <p className="absolute inset-x-5 bottom-3 text-balance text-center text-[15px] font-medium leading-snug text-paper/90">{c.welcome}</p>
        </section>

        <div className="px-5 pb-8 pt-4 sm:px-7">
          {/* IDENTITY */}
          <header className="rise text-center" style={delay(0)}>
            <h1 className="text-[32px] font-extrabold leading-tight tracking-tight">Chouaib Ramoul</h1>
            <p className="mx-auto mt-1.5 max-w-[22rem] text-balance text-[17px] font-semibold leading-snug text-accent">{c.title}</p>
            <span className="glass mt-3 inline-block rounded-full px-4 py-1.5 text-[13px] font-semibold text-paper/90">{c.badge}</span>
            <p className="mx-auto mt-4 max-w-[26rem] text-balance text-[15px] leading-relaxed text-paper/75">{c.pitch}</p>
            <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
              {c.chips.map((chip) => (
                <li key={chip} className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-paper/90">
                  {chip}
                </li>
              ))}
            </ul>
          </header>

          {/* TOP ACTIONS */}
          <div className="mt-7 flex flex-col gap-3">
            <div className="rise" style={delay(1)}>
              <button
                type="button"
                onClick={() => downloadVCard(lang)}
                className={`${press} flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-accent-gradient text-[17px] font-bold text-white shadow-lg shadow-accent/25 [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]`}
              >
                <FaUserPlus aria-hidden className="text-lg" />
                {c.save}
              </button>
            </div>
            <div className="rise" style={delay(2)}>
              <ActionLink href={LINKS.whatsapp} icon={<FaWhatsapp aria-hidden className="text-2xl text-[#25D366]" />} className="glass w-full">
                {c.whatsapp}
              </ActionLink>
            </div>
            <div className="rise" style={delay(3)}>
              <ActionLink href={LINKS.call} icon={<FaPhoneAlt aria-hidden className="text-lg text-accent" />} className="glass w-full">
                {c.call}
              </ActionLink>
            </div>
          </div>

          {/* SOCIALS */}
          <h2 className="rise mb-3 mt-8 text-center text-xs font-bold uppercase tracking-[0.18em] text-paper/60" style={delay(4)}>
            {c.followMe}
          </h2>
          <ul className="grid grid-cols-3 gap-3">
            {socials.map((s, idx) => (
              <li key={s.label} className="rise" style={delay(5 + idx)}>
                <a
                  href={s.href}
                  {...webProps(s.href)}
                  aria-label={s.label}
                  className={`${press} glass group flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl px-1 py-3 hover:border-accent/50 hover:bg-white/10`}
                >
                  <span aria-hidden className="text-2xl text-paper transition group-hover:text-accent">
                    {s.icon}
                  </span>
                  <span className="text-[13px] font-semibold text-paper/85">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>

          {/* PORTFOLIO */}
          <div className="rise mt-5" style={delay(11)}>
            <ActionLink href={LINKS.portfolio} icon={<FaArrowRight aria-hidden className="order-2 text-sm" />} className="w-full bg-paper text-ink">
              {c.portfolio}
            </ActionLink>
          </div>

          <footer className="rise mt-8 text-center text-xs text-paper/55" style={delay(12)}>
            © 2026 Ramoul Chouaib
          </footer>
        </div>
      </article>
    </main>
  )
}
