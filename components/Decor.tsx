/** Low-contrast wall decor (CSS/SVG only): diploma, night window, small shelf with books and a plant. */
export default function Decor() {
  return (
    <div aria-hidden className="decor">
      <div className="decor-in">
        {/* framed diploma, above the text column (desktop only) */}
        <svg viewBox="0 0 150 108" className="d-diploma">
          <defs>
            <linearGradient id="dip-brass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#f0d59a" />
              <stop offset=".5" stopColor="#b98b46" />
              <stop offset="1" stopColor="#6f4d1c" />
            </linearGradient>
          </defs>
          <rect x="3" y="5" width="146" height="102" rx="2" fill="#000" opacity=".25" />
          <rect x="0" y="2" width="146" height="102" rx="2" fill="url(#dip-brass)" />
          <rect x="7" y="9" width="132" height="88" fill="#efe3c4" />
          <rect x="7" y="9" width="132" height="88" fill="none" stroke="#000" strokeOpacity=".25" />
          <rect x="14" y="16" width="118" height="74" fill="none" stroke="#b98b46" strokeWidth="1" />
          <rect x="44" y="24" width="58" height="4" rx="1" fill="#2f4a3c" opacity=".8" />
          <rect x="30" y="34" width="86" height="2" fill="#2f4a3c" opacity=".4" />
          <rect x="36" y="40" width="74" height="2" fill="#2f4a3c" opacity=".4" />
          <rect x="24" y="52" width="60" height="2" fill="#2f4a3c" opacity=".35" />
          <rect x="24" y="58" width="52" height="2" fill="#2f4a3c" opacity=".35" />
          <path d="M26 78 q8 -7 16 0 q8 6 16 0" fill="none" stroke="#2f4a3c" strokeWidth="1.2" opacity=".6" />
          {/* gold seal with ribbon */}
          <path d="M104 70 l-6 18 l8 -4 l4 7 l4 -21z" fill="#a33a2e" />
          <circle cx="106" cy="66" r="10" fill="url(#dip-brass)" />
          <circle cx="106" cy="66" r="6.4" fill="none" stroke="#fff" strokeOpacity=".5" />
        </svg>

        {/* window: night sky + skyline (dark theme), pale daylight (light theme) */}
        <svg viewBox="0 0 120 150" className="d-window">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" className="sky-a" />
              <stop offset="1" className="sky-b" />
            </linearGradient>
            <clipPath id="glass">
              <rect x="10" y="10" width="100" height="130" />
            </clipPath>
          </defs>
          <rect x="0" y="0" width="120" height="150" rx="3" className="win-frame" />
          <g clipPath="url(#glass)">
            <rect x="10" y="10" width="100" height="130" fill="url(#sky)" />
            <circle cx="84" cy="38" r="14" className="moon-glow" />
            <circle cx="84" cy="38" r="6" className="moon" />
            <circle cx="30" cy="30" r="1" className="star" />
            <circle cx="52" cy="22" r="1.2" className="star" />
            <circle cx="64" cy="48" r="0.9" className="star" />
            <circle cx="22" cy="58" r="0.9" className="star" />
            <path
              className="city"
              d="M10 140 V104 h9 V92 h8 V108 h6 V84 h10 V100 h7 V96 h8 V110 h8 V88 h9 V104 h8 V98 h9 V140 z"
            />
            <g className="lights">
              <rect x="22" y="97" width="2" height="2" />
              <rect x="37" y="90" width="2" height="2" />
              <rect x="43" y="104" width="2" height="2" />
              <rect x="56" y="100" width="2" height="2" />
              <rect x="72" y="94" width="2" height="2" />
              <rect x="88" y="102" width="2" height="2" />
              <rect x="97" y="108" width="2" height="2" />
            </g>
          </g>
          <rect x="58" y="10" width="4" height="130" className="win-frame" />
          <rect x="10" y="70" width="100" height="4" className="win-frame" />
          <rect x="10" y="10" width="100" height="130" fill="none" stroke="#000" strokeOpacity=".35" strokeWidth="1.5" />
          <rect x="-4" y="146" width="128" height="6" rx="1.5" className="win-frame" />
        </svg>

        {/* shelf with books and a plant */}
        <svg viewBox="0 0 220 96" className="d-shelf">
          <g>
            <rect x="14" y="30" width="15" height="60" rx="1.5" fill="#6a3b2b" />
            <rect x="14" y="40" width="15" height="3" fill="#d4a568" />
            <rect x="30" y="22" width="13" height="68" rx="1.5" fill="#2f5d8a" />
            <rect x="30" y="34" width="13" height="3" fill="#d4a568" />
            <rect x="44" y="34" width="16" height="56" rx="1.5" fill="#2f6650" />
            <rect x="44" y="46" width="16" height="3" fill="#d4a568" />
            <g transform="rotate(14 66 90)">
              <rect x="63" y="26" width="13" height="64" rx="1.5" fill="#8a2f3a" />
              <rect x="63" y="38" width="13" height="3" fill="#d4a568" />
            </g>
            {/* plant */}
            <path d="M138 90 l-5 -26 h40 l-5 26 z" fill="#a55a3a" />
            <rect x="131" y="60" width="44" height="6" rx="2" fill="#b86a46" />
            <path d="M153 60 C146 40 130 36 124 22 C140 22 152 36 153 60z" fill="#3f7a52" />
            <path d="M153 60 C158 36 172 28 184 20 C182 40 168 52 153 60z" fill="#2f6650" />
            <path d="M153 60 C152 38 152 24 156 10 C162 28 160 46 153 60z" fill="#4a8a60" />
          </g>
          <rect x="4" y="90" width="212" height="6" rx="1.5" fill="#6a4426" />
          <rect x="4" y="90" width="212" height="1.6" rx="1" fill="#fff" opacity=".25" />
          <path d="M30 96 l-8 0 l0 0" fill="none" />
        </svg>
      </div>
      <div className="decor-warm" />
    </div>
  )
}
