/**
 * A laptop seen from BEHIND: the lid back faces the visitor, the screen faces him (he sits behind the desk).
 * Pure SVG, drawn once, never animated. Lighting follows the theme through CSS variables (see globals.css):
 *   dark  (--lampOff = 1): cool blue-green rim from the screen behind the lid, faint cool reflection
 *   light (--lampOn  = 1): warm highlight from the lamp side (right)
 * The viewBox ends exactly at the rubber feet (y = 198), so the bottom of the SVG is the contact line on the desk.
 */
const LID = 'M19.6 20 Q20 12 28 12 L292 12 Q300 12 300.4 20 L307.8 177 Q308 182 303 182 L17 182 Q12 182 12.2 177 Z'
const BASE = 'M12 187 H308 Q310 187 310 189 V192 Q310 196 305 196 H15 Q10 196 10 192 V189 Q10 187 12 187 Z'

export default function Laptop() {
  return (
    <div aria-hidden className="lap">
      <svg viewBox="0 0 320 198" className="lap-svg" focusable="false">
        <defs>
          <linearGradient id="lp-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#eef0f2" />
            <stop offset=".3" stopColor="#c6cbd0" />
            <stop offset=".66" stopColor="#a4abb1" />
            <stop offset="1" stopColor="#868d94" />
          </linearGradient>
          <linearGradient id="lp-base" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d3d8dc" />
            <stop offset=".5" stopColor="#a6adb3" />
            <stop offset="1" stopColor="#70777d" />
          </linearGradient>
          <linearGradient id="lp-hinge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#101417" />
            <stop offset=".4" stopColor="#4a5157" />
            <stop offset=".7" stopColor="#2a3035" />
            <stop offset="1" stopColor="#0d1012" />
          </linearGradient>
          <linearGradient id="lp-edge-top" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".1" stopColor="#fff" stopOpacity=".95" />
            <stop offset=".85" stopColor="#fff" stopOpacity=".7" />
            <stop offset="1" stopColor="#fff" stopOpacity=".15" />
          </linearGradient>
          <linearGradient id="lp-edge-left" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".9" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lp-ao" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity=".3" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lp-mono" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff3cf" />
            <stop offset=".5" stopColor="#e3bf80" />
            <stop offset="1" stopColor="#b88c42" />
          </linearGradient>
          <radialGradient id="lp-mono-glow">
            <stop offset="0" stopColor="#ffe2a0" stopOpacity=".5" />
            <stop offset=".5" stopColor="#ffd58a" stopOpacity=".16" />
            <stop offset="1" stopColor="#ffd58a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lp-warm" x1="0" y1="0" x2="1" y2="0">
            <stop offset=".3" stopColor="#ffd9a0" stopOpacity="0" />
            <stop offset="1" stopColor="#ffd9a0" stopOpacity=".5" />
          </linearGradient>
          <radialGradient id="lp-spec" cx="1" cy="0" r="1">
            <stop offset="0" stopColor="#fff2d4" stopOpacity=".75" />
            <stop offset=".5" stopColor="#ffdcA8" stopOpacity=".18" />
            <stop offset="1" stopColor="#ffdca8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lp-shadow">
            <stop offset="0" stopColor="#000" stopOpacity=".6" />
            <stop offset=".6" stopColor="#000" stopOpacity=".22" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lp-pool-cool">
            <stop offset="0" stopColor="#6fe3d0" stopOpacity=".32" />
            <stop offset="1" stopColor="#6fe3d0" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="lp-pool-warm">
            <stop offset="0" stopColor="#ffd18a" stopOpacity=".42" />
            <stop offset="1" stopColor="#ffd18a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="lp-refl-fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity=".55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="lp-refl-mask" maskUnits="userSpaceOnUse" x="0" y="198" width="320" height="40">
            <rect x="0" y="198" width="320" height="40" fill="url(#lp-refl-fade)" />
          </mask>
          <clipPath id="lp-clip">
            <path d={LID} />
          </clipPath>
          {/* brushed aluminium: noise stretched along x (horizontal streaks), drawn once */}
          <filter id="lp-brush" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.005 0.7" numOctaves="2" seed="4" />
            <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1" />
            <feComponentTransfer>
              <feFuncR type="linear" slope="2.6" intercept="-0.8" />
              <feFuncG type="linear" slope="2.6" intercept="-0.8" />
              <feFuncB type="linear" slope="2.6" intercept="-0.8" />
            </feComponentTransfer>
          </filter>
          <g id="lp-flat">
            <path d={LID} fill="#9aa2a8" />
            <rect x="48" y="181" width="224" height="6" fill="#2a3035" />
            <path d={BASE} fill="#7f878d" />
          </g>
        </defs>

        {/* light on the desk around it: cool from the screen (dark) / warm from the lamp (light) */}
        <ellipse className="lap-pool-cool" cx="160" cy="196" rx="215" ry="24" fill="url(#lp-pool-cool)" />
        <ellipse className="lap-pool-warm" cx="250" cy="196" rx="190" ry="22" fill="url(#lp-pool-warm)" />
        {/* contact shadow + faint mirror reflection on the walnut */}
        <ellipse cx="160" cy="198" rx="162" ry="8" fill="url(#lp-shadow)" />
        <g mask="url(#lp-refl-mask)">
          <g transform="translate(0 396) scale(1 -1)" opacity=".5">
            <use href="#lp-flat" />
          </g>
        </g>

        {/* thin blue-green halo: the screen glowing behind the lid (dark theme only) */}
        <g className="lap-halo" fill="none" stroke="#6fe3d0" strokeLinejoin="round">
          <path d={LID} strokeWidth="20" strokeOpacity=".05" />
          <path d={LID} strokeWidth="11" strokeOpacity=".09" />
          <path d={LID} strokeWidth="5" strokeOpacity=".17" />
        </g>

        {/* rubber feet, base lip, hinge */}
        <rect x="34" y="195" width="30" height="3.2" rx="1.6" fill="#101315" />
        <rect x="256" y="195" width="30" height="3.2" rx="1.6" fill="#101315" />
        <path d={BASE} fill="url(#lp-base)" stroke="#0d1012" strokeWidth=".7" />
        <path d="M13 188.2 H307" stroke="#fff" strokeOpacity=".55" strokeWidth=".9" />
        <path d={BASE} className="lap-dim" fill="#0a1418" />
        <path d="M50 181 H270 L266 188 H54 Z" fill="url(#lp-hinge)" />
        <path d="M52 182.6 H268" stroke="#fff" strokeOpacity=".22" strokeWidth=".8" />

        {/* the lid back */}
        <g clipPath="url(#lp-clip)">
          <path d={LID} fill="url(#lp-metal)" />
          <rect x="0" y="0" width="320" height="190" filter="url(#lp-brush)" opacity=".13" />
          <path d={LID} className="lap-dim" fill="#0a1418" />
          <rect x="0" y="160" width="320" height="26" fill="url(#lp-ao)" />
          <rect className="lap-warm" x="0" y="0" width="320" height="190" fill="url(#lp-warm)" />
          <ellipse className="lap-warm" cx="302" cy="12" rx="120" ry="80" fill="url(#lp-spec)" />
          {/* bright edges: top and left */}
          <path d="M26 13 H294" stroke="url(#lp-edge-top)" strokeWidth="2.4" fill="none" />
          <path d="M19.2 22 L12.6 176" stroke="url(#lp-edge-left)" strokeWidth="2.4" fill="none" />
          <path d="M25 17 H295 L303 176" stroke="#000" strokeOpacity=".12" strokeWidth="1" fill="none" />
          {/* champagne monogram "R", backlit softly */}
          <g transform="translate(160 97) scale(1.18)">
            <circle className="lap-mono-glow" r="48" fill="url(#lp-mono-glow)" />
            <circle r="19.5" fill="none" stroke="url(#lp-mono)" strokeWidth="1.4" opacity=".92" />
            <path
              d="M-6.5 11.5 V-11.5 H1.5 a7.2 7.2 0 0 1 0 14.4 H-6.5 M-0.5 2.9 L7.5 11.5"
              fill="none"
              stroke="url(#lp-mono)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
        <path d={LID} fill="none" stroke="#000" strokeOpacity=".45" strokeWidth=".9" />
        <path className="lap-cool" d={LID} fill="none" stroke="#8ff5e0" strokeOpacity=".42" strokeWidth="1.2" />
      </svg>
    </div>
  )
}
