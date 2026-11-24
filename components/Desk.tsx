/** The walnut desk in front of the bust (CSS/SVG only). Static: the tilt moves the avatar, never the desk. */
export default function Desk({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`desk ${className}`}>
      <div className="desk-front" />
      <div className="desk-top" />
      <div className="desk-glow" />
      <div className="desk-props">
        <div className="desk-props-in">
          {/* laptop turned toward him (CSS perspective on a flat drawing): code on the screen, blinking cursor */}
          <div className="prop-laptop">
            <div className="lap-pool" />
            <svg viewBox="0 0 220 134" className="lap-svg">
              <defs>
                <radialGradient id="lap-halo" cx=".5" cy=".42" r=".6">
                  <stop offset="0" stopColor="#6fe3d0" stopOpacity=".28" />
                  <stop offset="1" stopColor="#6fe3d0" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="lap-lid" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#6c7378" />
                  <stop offset=".5" stopColor="#3b4146" />
                  <stop offset="1" stopColor="#23282c" />
                </linearGradient>
                <linearGradient id="lap-screen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#0d2a2e" />
                  <stop offset="1" stopColor="#0a1c24" />
                </linearGradient>
                <linearGradient id="lap-base" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#c3c9cd" />
                  <stop offset="1" stopColor="#7c848a" />
                </linearGradient>
              </defs>
              <ellipse cx="110" cy="60" rx="130" ry="80" fill="url(#lap-halo)" />
              <ellipse cx="112" cy="128" rx="104" ry="5" fill="#000" opacity=".4" />
              <rect x="16" y="4" width="188" height="112" rx="6" fill="url(#lap-lid)" stroke="#0d1012" strokeWidth="1" />
              <rect x="23" y="11" width="174" height="98" rx="2.5" fill="url(#lap-screen)" />
              {/* code lines */}
              <g className="lap-code">
                <rect x="31" y="20" width="26" height="4" rx="1" fill="#ff8fa3" />
                <rect x="61" y="20" width="44" height="4" rx="1" fill="#e6edf2" />
                <rect x="39" y="30" width="38" height="4" rx="1" fill="#6fe3d0" />
                <rect x="81" y="30" width="60" height="4" rx="1" fill="#e6edf2" />
                <rect x="39" y="40" width="22" height="4" rx="1" fill="#ffd27a" />
                <rect x="65" y="40" width="70" height="4" rx="1" fill="#9ab8c4" />
                <rect x="47" y="50" width="52" height="4" rx="1" fill="#6fe3d0" />
                <rect x="103" y="50" width="30" height="4" rx="1" fill="#ff8fa3" />
                <rect x="47" y="60" width="34" height="4" rx="1" fill="#e6edf2" />
                <rect x="85" y="60" width="50" height="4" rx="1" fill="#ffd27a" />
                <rect x="39" y="70" width="46" height="4" rx="1" fill="#9ab8c4" />
                <rect x="31" y="80" width="16" height="4" rx="1" fill="#ff8fa3" />
                <rect x="51" y="80" width="64" height="4" rx="1" fill="#6fe3d0" />
                <rect x="31" y="90" width="38" height="4" rx="1" fill="#e6edf2" />
              </g>
              <rect x="73" y="89" width="4" height="6" fill="#6fe3d0" className="lap-cursor" />
              <rect x="23" y="11" width="174" height="98" rx="2.5" fill="#6fe3d0" opacity=".05" />
              <rect x="23" y="11" width="174" height="14" fill="#fff" opacity=".04" />
              {/* base */}
              <path d="M6 116 H214 L204 128 H16 Z" fill="url(#lap-base)" stroke="#0d1012" strokeWidth=".8" />
              <rect x="88" y="116" width="44" height="3.4" rx="1.4" fill="#5d646a" />
            </svg>
          </div>
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
    </div>
  )
}
