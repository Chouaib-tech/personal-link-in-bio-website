/**
 * Static art for the door hall. Two pieces:
 *  - Gallery: three small framed prints with brass picture lights, hung above the first row (phones, tablets and
 *    laptops, where there is no spare wall beside the doors)
 *  - Console: a framed print above a marble console with a brass lamp, at the ends of each row (screens 1640px+)
 * Static art for the wide wall at the two ends of each row (wide screens only): a framed art-deco print above a
 * marble console with a brass table lamp, books and a brass sphere. Think hotel corridor, not garden.
 * Pure SVG, drawn once, never animated. The shape lives in <HallDefs/> (declared once); each use is a small <svg><use/></svg>.
 */
import type { CSSProperties } from 'react'

const GALLERY_X = [22, 116, 210]

const RAYS = Array.from({ length: 11 }, (_, i) => {
  const a = ((-75 + i * 15) * Math.PI) / 180
  return { x: Math.round((100 + Math.sin(a) * 120) * 10) / 10, y: Math.round((146 - Math.cos(a) * 120) * 10) / 10 }
})

export function HallDefs() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" className="absolute">
      <defs>
        <linearGradient id="hp-brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1c8" />
          <stop offset=".35" stopColor="#e0bb78" />
          <stop offset=".7" stopColor="#b98b46" />
          <stop offset="1" stopColor="#6f4d1c" />
        </linearGradient>
        <linearGradient id="hp-brass-v" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6f4d1c" />
          <stop offset=".4" stopColor="#f3d796" />
          <stop offset=".7" stopColor="#c8985a" />
          <stop offset="1" stopColor="#7a5522" />
        </linearGradient>
        <linearGradient id="hp-art" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0d2f30" />
          <stop offset="1" stopColor="#1d5a55" />
        </linearGradient>
        <linearGradient id="hp-marble" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6f1e4" />
          <stop offset=".6" stopColor="#dcd4c0" />
          <stop offset="1" stopColor="#efe8d6" />
        </linearGradient>
        <linearGradient id="hp-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a2f1b" />
          <stop offset="1" stopColor="#2a190d" />
        </linearGradient>
        <linearGradient id="hp-shade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e9c98a" />
          <stop offset=".5" stopColor="#fff3d4" />
          <stop offset="1" stopColor="#efd196" />
        </linearGradient>
        <radialGradient id="hp-orb" cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#fff6d6" />
          <stop offset=".45" stopColor="#d9b06a" />
          <stop offset="1" stopColor="#6a4819" />
        </radialGradient>
        <radialGradient id="hp-lamp-glow">
          <stop offset="0" stopColor="#ffd98a" stopOpacity=".55" />
          <stop offset=".5" stopColor="#ffcf86" stopOpacity=".16" />
          <stop offset="1" stopColor="#ffcf86" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hp-shadow">
          <stop offset="0" stopColor="#000" stopOpacity=".55" />
          <stop offset=".6" stopColor="#000" stopOpacity=".2" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="hp-pl-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe2a6" stopOpacity=".42" />
          <stop offset="1" stopColor="#ffe2a6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hp-pl-hi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff3d0" stopOpacity=".28" />
          <stop offset=".55" stopColor="#fff3d0" stopOpacity="0" />
        </linearGradient>
        {GALLERY_X.map((x, i) => (
          <clipPath key={i} id={`hp-gc-${i}`}>
            <rect x={x + 9} y="23" width="50" height="70" />
          </clipPath>
        ))}

        <g id="hp-gallery">
          {GALLERY_X.map((x, i) => {
            const cx = x + 34
            return (
              <g key={i}>
                {/* picture light: a brass bar on two posts, throwing a warm cone down the frame */}
                <path d={`M${cx - 17} 8 L${cx + 17} 8 L${cx + 38} 62 L${cx - 38} 62 Z`} fill="url(#hp-pl-cone)" style={{ opacity: 'var(--hall-glow)' } as CSSProperties} />
                <rect x={cx - 11} y="8" width="2" height="6" fill="url(#hp-brass-v)" />
                <rect x={cx + 9} y="8" width="2" height="6" fill="url(#hp-brass-v)" />
                <rect x={cx - 18} y="4" width="36" height="4.2" rx="2" fill="url(#hp-brass)" />
                <rect x={cx - 15} y="8" width="30" height="1.4" fill="#fff3c8" opacity=".9" />
                {/* the frame */}
                <rect x={x + 2} y="17" width="68" height="88" fill="#000" opacity=".28" />
                <rect x={x} y="14" width="68" height="88" rx="1.5" fill="url(#hp-brass)" />
                <rect x={x + 4} y="18" width="60" height="80" fill="#12201d" />
                <rect x={x + 9} y="23" width="50" height="70" fill="url(#hp-art)" />
                <g clipPath={`url(#hp-gc-${i})`} fill="none" stroke="#d9b06a" strokeLinecap="round">
                  {i === 0 && (
                    <>
                      {Array.from({ length: 9 }, (_, k) => {
                        const a = ((-64 + k * 16) * Math.PI) / 180
                        return <path key={k} d={`M${cx} 93 L${Math.round((cx + Math.sin(a) * 80) * 10) / 10} ${Math.round((93 - Math.cos(a) * 80) * 10) / 10}`} strokeWidth=".7" opacity=".75" />
                      })}
                      <circle cx={cx} cy="93" r="13" strokeWidth="1" />
                      <circle cx={cx} cy="93" r="26" strokeWidth=".8" />
                      <circle cx={cx} cy="93" r="40" strokeWidth=".6" />
                      <circle cx={cx} cy="93" r="5" fill="url(#hp-orb)" stroke="none" />
                    </>
                  )}
                  {i === 1 && (
                    <>
                      <circle cx={cx + 8} cy="40" r="7.5" fill="url(#hp-orb)" stroke="none" />
                      {[
                        [x + 11, 66, 8],
                        [x + 20, 58, 9],
                        [x + 30, 46, 10],
                        [x + 41, 60, 8],
                        [x + 50, 68, 8],
                      ].map(([bx, by, bw], k) => (
                        <rect key={k} x={bx} y={by} width={bw} height={93 - by} fill="#0a1f20" stroke="#d9b06a" strokeWidth=".7" />
                      ))}
                      {[0, 1, 2].map((k) => (
                        <path key={k} d={`M${x + 33} ${52 + k * 9} h4`} strokeWidth=".8" opacity=".8" />
                      ))}
                    </>
                  )}
                  {i === 2 && (
                    <>
                      {[0, 1, 2, 3, 4, 5].map((k) => (
                        <path key={k} d={`M${x + 8} ${34 + k * 9} q6 -7 12 0 t12 0 t12 0 t12 0`} strokeWidth={k % 2 ? 0.7 : 1} opacity={0.9 - k * 0.1} />
                      ))}
                    </>
                  )}
                </g>
                <rect x={x + 9} y="23" width="50" height="70" fill="url(#hp-pl-hi)" />
                <rect x={x + 9} y="23" width="50" height="70" fill="none" stroke="#d9b06a" strokeOpacity=".7" />
              </g>
            )
          })}
        </g>
        <clipPath id="hp-art-clip">
          <rect x="44" y="22" width="112" height="124" />
        </clipPath>

        <g id="hp-console">
          {/* the lamp lights the wall around it */}
          <circle cx="152" cy="168" r="54" fill="url(#hp-lamp-glow)" style={{ opacity: 'var(--hall-glow)' } as CSSProperties} />
          <ellipse cx="100" cy="289" rx="84" ry="5" fill="url(#hp-shadow)" />

          {/* framed art-deco print: dark teal, a gold fan and arcs */}
          <rect x="31" y="9" width="141" height="145" fill="#000" opacity=".28" />
          <rect x="28" y="6" width="144" height="148" rx="2" fill="url(#hp-brass)" />
          <rect x="34" y="12" width="132" height="136" fill="#12201d" />
          <rect x="34" y="12" width="132" height="136" fill="none" stroke="#000" strokeOpacity=".5" />
          <rect x="44" y="22" width="112" height="124" fill="url(#hp-art)" />
          <g clipPath="url(#hp-art-clip)" fill="none" stroke="#d9b06a" strokeLinecap="round">
            {RAYS.map((r, i) => (
              <path key={i} d={`M100 146 L${r.x} ${r.y}`} strokeWidth=".8" opacity=".75" />
            ))}
            <circle cx="100" cy="146" r="26" strokeWidth="1.2" />
            <circle cx="100" cy="146" r="46" strokeWidth="1" />
            <circle cx="100" cy="146" r="66" strokeWidth=".8" />
            <circle cx="100" cy="146" r="86" strokeWidth=".6" opacity=".7" />
            <circle cx="100" cy="146" r="9" fill="url(#hp-orb)" stroke="none" />
          </g>
          <rect x="44" y="22" width="112" height="124" fill="none" stroke="#d9b06a" strokeOpacity=".7" strokeWidth="1" />

          {/* marble console, walnut apron, brass legs */}
          <path d="M30 288 L34 224 H40 L38 288 Z" fill="url(#hp-brass-v)" />
          <path d="M170 288 L166 224 H160 L162 288 Z" fill="url(#hp-brass-v)" />
          <rect x="26" y="213" width="148" height="13" fill="url(#hp-wood)" />
          <rect x="26" y="224" width="148" height="2" fill="url(#hp-brass)" />
          <rect x="18" y="203" width="164" height="11" rx="1.5" fill="url(#hp-marble)" />
          <path d="M40 204 Q70 210 96 205 T150 211" fill="none" stroke="#8d8466" strokeOpacity=".4" strokeWidth=".8" />
          <rect x="18" y="212" width="164" height="2" fill="#000" opacity=".2" />

          {/* books and a brass sphere */}
          <rect x="38" y="195" width="40" height="8" fill="#1d3a36" />
          <rect x="38" y="197.6" width="40" height="1" fill="#d9b06a" />
          <rect x="42" y="187" width="32" height="8" fill="#e6d7b0" />
          <circle cx="58" cy="180" r="7" fill="url(#hp-orb)" />

          {/* brass lamp with a pleated cream shade */}
          <ellipse cx="150" cy="203" rx="11" ry="2.2" fill="url(#hp-brass)" />
          <rect x="146" y="184" width="8" height="19" fill="url(#hp-brass-v)" />
          <circle cx="150" cy="184" r="4" fill="url(#hp-orb)" />
          <path d="M132 182 H168 L164 150 H136 Z" fill="url(#hp-shade)" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${139 + i * 4.4} 150 L${136.5 + i * 5.4} 182`} stroke="#b98b46" strokeOpacity=".35" strokeWidth=".6" />
          ))}
          <rect x="136" y="148.6" width="28" height="2.4" fill="url(#hp-brass)" />
          <rect x="132" y="181.2" width="36" height="2" fill="url(#hp-brass)" />
        </g>
      </defs>
    </svg>
  )
}

/** Three framed prints with picture lights (300 x 104). */
export function Gallery({ className }: { className?: string }) {
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 300 104" className={className}>
      <use href="#hp-gallery" />
    </svg>
  )
}

/** The art + console group. The right-hand one is mirrored in CSS so the lamp always faces the doors. */
export function Console({ className }: { className?: string }) {
  return (
    <svg aria-hidden focusable="false" viewBox="0 0 200 300" className={className}>
      <use href="#hp-console" />
    </svg>
  )
}
