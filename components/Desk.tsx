/** The walnut desk in front of the bust (CSS/SVG only). Static: the tilt moves the avatar, never the desk. */
export default function Desk({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`desk ${className}`}>
      <div className="desk-front" />
      <div className="desk-top" />
      <div className="desk-glow" />
      <div className="desk-props">
        {/* laptop seen from behind: graphite lid, brass logo, faint screen glow around the edges */}
        <svg viewBox="0 0 100 70" className="prop-laptop">
          <defs>
            <radialGradient id="lap-glow" cx=".5" cy=".4" r=".7">
              <stop offset="0" stopColor="#8ec9ff" stopOpacity=".16" />
              <stop offset=".5" stopColor="#8ec9ff" stopOpacity=".08" />
              <stop offset="1" stopColor="#8ec9ff" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="lap-lid" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6c7378" />
              <stop offset=".45" stopColor="#3d4348" />
              <stop offset="1" stopColor="#23282c" />
            </linearGradient>
            <radialGradient id="lap-logo" cx=".35" cy=".3" r=".8">
              <stop offset="0" stopColor="#fff1c8" />
              <stop offset=".6" stopColor="#c79551" />
              <stop offset="1" stopColor="#7e5b24" />
            </radialGradient>
          </defs>
          <ellipse cx="50" cy="30" rx="62" ry="40" fill="url(#lap-glow)" />
          <ellipse cx="52" cy="66" rx="52" ry="4" fill="#000" opacity=".35" />
          <rect x="9" y="3" width="82" height="56" rx="3.5" fill="url(#lap-lid)" stroke="#0d1012" strokeWidth=".8" />
          <rect x="9.8" y="3.8" width="80.4" height="1.6" rx=".8" fill="#fff" opacity=".22" />
          <circle cx="50" cy="31" r="9" fill="#8ec9ff" opacity=".14" />
          <circle cx="50" cy="31" r="4.2" fill="url(#lap-logo)" />
          <rect x="4" y="59" width="92" height="6" rx="2.2" fill="#9aa1a6" stroke="#0d1012" strokeWidth=".6" />
          <rect x="4.6" y="59.4" width="90.8" height="1.4" rx=".7" fill="#fff" opacity=".5" />
        </svg>
        {/* small mug, deep green with a brass band */}
        <svg viewBox="0 0 30 34" className="prop-mug">
          <ellipse cx="14" cy="32" rx="12" ry="2.4" fill="#000" opacity=".35" />
          <path d="M23.5 11 h2.6 a4.4 4.4 0 0 1 0 12.4 h-3" fill="none" stroke="#2c5a46" strokeWidth="2.6" strokeLinecap="round" />
          <path d="M3 7 h22 v18.5 a6 6 0 0 1 -6 6 h-10 a6 6 0 0 1 -6 -6 z" fill="#2f6650" />
          <path d="M3 7 h4 v24 h-1 a6 6 0 0 1 -3 -5.5 z" fill="#fff" opacity=".13" />
          <rect x="3" y="12" width="22" height="2.4" fill="#d4a568" />
          <ellipse cx="14" cy="7" rx="11" ry="2.6" fill="#1b2a24" />
          <ellipse cx="14" cy="7.4" rx="9" ry="1.8" fill="#4a2e1d" />
        </svg>
        {/* closed notebook */}
        <svg viewBox="0 0 60 24" className="prop-book">
          <ellipse cx="31" cy="22" rx="28" ry="2.4" fill="#000" opacity=".3" />
          <path d="M4 8 L50 5 L56 9 L56 20 L10 22 L4 18 Z" fill="#1d2f27" />
          <path d="M4 8 L50 5 L56 9 L10 12 Z" fill="#3a5a4a" />
          <path d="M10 12 L56 9 L56 20 L10 22 Z" fill="#162720" />
          <path d="M10 12 L10 22 L4 18 L4 8 Z" fill="#e8dcc0" />
          <rect x="30" y="13.5" width="14" height="1.6" transform="rotate(-4 30 13.5)" fill="#c79551" opacity=".9" />
        </svg>
      </div>
    </div>
  )
}
