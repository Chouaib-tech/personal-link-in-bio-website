import { BrandIcon, type BrandName } from '@/components/BrandIcons'
import { COPY, LINKS, type Lang } from '@/lib/content'

const SOCIALS: { name: BrandName; href: string }[] = [
  { name: 'LinkedIn', href: LINKS.linkedin },
  { name: 'GitHub', href: LINKS.github },
  { name: 'Telegram', href: LINKS.telegram },
  { name: 'Instagram', href: LINKS.instagram },
  { name: 'Facebook', href: LINKS.facebook },
]

export default function Socials({ lang }: { lang: Lang }) {
  return (
    <div className="mt-9 lg:mt-12">
      <div className="mx-auto flex max-w-md items-center gap-4">
        <span aria-hidden className="hairline flex-1" />
        <h2 className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-muted">{COPY[lang].followMe}</h2>
        <span aria-hidden className="hairline flex-1" />
      </div>
      <ul className="mt-5 flex flex-wrap items-center justify-center gap-4">
        {SOCIALS.map((s) => (
          <li key={s.name}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name} className="ring-btn focus-visible:ring-offset-4">
              <BrandIcon name={s.name} className="h-5 w-5" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
