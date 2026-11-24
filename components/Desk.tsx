import Laptop from '@/components/Laptop'

/**
 * The walnut desk in front of the bust (CSS/SVG only). Static: the tilt moves the avatar, never the desk.
 * Props stand in a "zone" that has exactly the avatar's box (same column on desktop, same width on phone),
 * so their sizes and positions are percentages of the avatar and can never drift onto the text column.
 * Lighting classes: .m-warm shows with the lamp on (light theme), .m-cool with it off (dark theme).
 */
export default function Desk({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`desk ${className}`}>
      <div className="desk-front" />
      <div className="desk-top" />
      <div className="desk-glow" />
      <div className="desk-props">
        <div className="desk-props-in">
          <div className="prop-zone">
            <Laptop />

            {/* small mug, deep green with a brass band */}
            <svg viewBox="0 0 30 34" className="prop-mug">
              <ellipse cx="14" cy="32" rx="12" ry="2.4" fill="#000" opacity=".35" />
              <path d="M23.5 11 h2.6 a4.4 4.4 0 0 1 0 12.4 h-3" fill="none" stroke="#2c5a46" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M3 7 h22 v18.5 a6 6 0 0 1 -6 6 h-10 a6 6 0 0 1 -6 -6 z" fill="#2f6650" />
              <path d="M3 7 h4 v24 h-1 a6 6 0 0 1 -3 -5.5 z" fill="#fff" opacity=".12" />
              <path className="m-cool" d="M3 7 h3 v24.4 a6 6 0 0 1 -3 -5.9 z" fill="#8ff5e0" opacity=".4" />
              <path className="m-warm" d="M18 7 H25 V25.5 a6 6 0 0 1 -6 6 H18 Z" fill="#ffd9a0" opacity=".42" />
              <rect x="3" y="12" width="22" height="2.4" fill="#d4a568" />
              <ellipse cx="14" cy="7" rx="11" ry="2.6" fill="#1b2a24" />
              <ellipse cx="14" cy="7.4" rx="9" ry="1.8" fill="#4a2e1d" />
            </svg>

            {/* closed notebook */}
            <svg viewBox="0 0 60 24" className="prop-book">
              <defs>
                <linearGradient id="nb-warm" x1="0" y1="0" x2="1" y2="0">
                  <stop offset=".35" stopColor="#ffd9a0" stopOpacity="0" />
                  <stop offset="1" stopColor="#ffd9a0" stopOpacity=".5" />
                </linearGradient>
                <linearGradient id="nb-cool" x1="1" y1="0" x2="0" y2="0">
                  <stop offset=".4" stopColor="#8ff5e0" stopOpacity="0" />
                  <stop offset="1" stopColor="#8ff5e0" stopOpacity=".4" />
                </linearGradient>
              </defs>
              <ellipse cx="31" cy="22" rx="28" ry="2.4" fill="#000" opacity=".3" />
              <path d="M4 8 L50 5 L56 9 L56 20 L10 22 L4 18 Z" fill="#1d2f27" />
              <path d="M4 8 L50 5 L56 9 L10 12 Z" fill="#3a5a4a" />
              <path d="M10 12 L56 9 L56 20 L10 22 Z" fill="#162720" />
              <path d="M10 12 L10 22 L4 18 L4 8 Z" fill="#e8dcc0" />
              <path className="m-warm" d="M4 8 L50 5 L56 9 L10 12 Z" fill="url(#nb-warm)" />
              <path className="m-cool" d="M10 12 L10 22 L4 18 L4 8 Z M4 8 L50 5 L56 9 L10 12 Z" fill="url(#nb-cool)" />
              <rect x="30" y="13.5" width="14" height="1.6" transform="rotate(-4 30 13.5)" fill="#c79551" opacity=".9" />
            </svg>

            {/* phone lying flat: dark glass, a diagonal sheen */}
            <svg viewBox="0 0 54 28" className="prop-phone">
              <ellipse cx="28" cy="25" rx="24" ry="2.4" fill="#000" opacity=".3" />
              <path d="M7 8 Q7 4.6 10.4 4.2 L44.4 2 Q48 1.8 48.6 5.2 L50.6 18.6 Q51 22 47.6 22.6 L12 25.4 Q8.4 25.6 8 22.2 Z" fill="#0b0e11" stroke="#59616a" strokeWidth=".7" />
              <path d="M9.4 6.2 L45 3.8 L46.8 6.6 L11.4 9.6 Z" fill="#fff" opacity=".06" />
              <path d="M24 5.4 L40 4.4 L42 22.4 L26 23.6 Z" fill="#fff" opacity=".045" />
              <circle cx="12.6" cy="8.4" r="1.7" fill="#1d252c" stroke="#3b444c" strokeWidth=".5" />
              <path className="m-cool" d="M7 8 Q7 4.6 10.4 4.2 L44.4 2 Q48 1.8 48.6 5.2" fill="none" stroke="#8ff5e0" strokeOpacity=".5" strokeWidth=".8" />
              <path className="m-warm" d="M44.4 2 Q48 1.8 48.6 5.2 L50.6 18.6 Q51 22 47.6 22.6" fill="none" stroke="#ffd9a0" strokeOpacity=".7" strokeWidth=".9" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
