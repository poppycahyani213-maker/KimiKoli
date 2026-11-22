import React from 'react';
import Card from '../../components/common/Card';

export default function OrientasiMasalah() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* ── 1. Ilustrasi SVG Gerobak Es Puter ────────────────────────────── */}
      <Card style={{ padding: '1.25rem', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            color: '#0284C7',
            background: '#E0F2FE',
            padding: '0.25rem 0.75rem',
            borderRadius: '999px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Ilustrasi Fenomena: Tabung Es Puter Tradisional
          </span>
        </div>

        <div style={{ width: '100%', maxWidth: '720px', margin: '0 auto' }}>
          <svg
            viewBox="0 0 700 360"
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '55vh' }}
            role="img"
            aria-label="Ilustrasi realistis gerobak es puter: tabung logam bertutup dengan engkol pemutar, dikelilingi campuran es batu semitransparan dan garam kasar di dalam ember kayu, dengan termometer tercelup menunjukkan -8 °C"
          >
            <defs>
              {/* Wood Gradients */}
              <linearGradient id="woodGradReal" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#5C2607" />
                <stop offset="15%" stopColor="#78350F" />
                <stop offset="45%" stopColor="#92400E" />
                <stop offset="70%" stopColor="#B45309" />
                <stop offset="90%" stopColor="#78350F" />
                <stop offset="100%" stopColor="#451A03" />
              </linearGradient>
              <linearGradient id="ironBandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="25%" stopColor="#475569" />
                <stop offset="50%" stopColor="#64748B" />
                <stop offset="75%" stopColor="#334155" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>

              {/* Metal Cylinder Gradients */}
              <linearGradient id="steelWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="18%" stopColor="#94A3B8" />
                <stop offset="38%" stopColor="#E2E8F0" />
                <stop offset="55%" stopColor="#FFFFFF" />
                <stop offset="72%" stopColor="#CBD5E1" />
                <stop offset="90%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <linearGradient id="lidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="50%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#64748B" />
              </linearGradient>

              {/* Ice Chunks Gradients (Semi-transparent & crystalline) */}
              <linearGradient id="iceFacet1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#BAE6FD" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.65" />
              </linearGradient>
              <linearGradient id="iceFacet2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#7DD3FC" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient id="iceFacet3" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0.9" />
              </linearGradient>

              {/* Meltwater / Chilled Brine Slush Pool */}
              <linearGradient id="brinePoolGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0369A1" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0284C7" stopOpacity="0.5" />
              </linearGradient>

              {/* Frost & Condensation Overlay */}
              <linearGradient id="frostWallGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.7" />
                <stop offset="40%" stopColor="#BAE6FD" stopOpacity="0.45" />
                <stop offset="75%" stopColor="#F0F9FF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </linearGradient>

              {/* Cold Vapor / Mist Gradient */}
              <radialGradient id="mistVaporGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#E0F2FE" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>

              {/* Drop Shadows */}
              <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="5" stdDeviation="5" floodOpacity="0.2" />
              </filter>
              <filter id="subtleGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background container canvas */}
            <rect x="0" y="0" width="700" height="360" rx="14" fill="#F8FAFC" />

            {/* Base floor shadow */}
            <ellipse cx="350" cy="320" rx="245" ry="20" fill="#CBD5E1" opacity="0.6" filter="url(#softShadow)" />

            {/* ══════════════════════════════════════════════════════════════════
                1. EMBER KAYU (WOODEN TUB / BARREL)
            ══════════════════════════════════════════════════════════════════ */}
            {/* Outer wooden tub body */}
            <path
              d="M 165 140 L 192 310 Q 350 330 508 310 L 535 140 Q 350 162 165 140 Z"
              fill="url(#woodGradReal)"
              filter="url(#softShadow)"
            />

            {/* Individual wood stave plank outlines */}
            <path d="M 215 145 L 235 313" stroke="#381402" strokeWidth="1.5" opacity="0.5" />
            <path d="M 270 150 L 285 316" stroke="#381402" strokeWidth="1.5" opacity="0.5" />
            <path d="M 325 152 L 332 318" stroke="#381402" strokeWidth="1.5" opacity="0.5" />
            <path d="M 375 152 L 368 318" stroke="#381402" strokeWidth="1.5" opacity="0.5" />
            <path d="M 430 150 L 415 316" stroke="#381402" strokeWidth="1.5" opacity="0.5" />
            <path d="M 485 145 L 465 313" stroke="#381402" strokeWidth="1.5" opacity="0.5" />

            {/* Iron hoops/bands around barrel with rivets */}
            {/* Top Hoop */}
            <path
              d="M 174 195 Q 350 216 526 195 L 528 208 Q 350 229 172 208 Z"
              fill="url(#ironBandGrad)"
            />
            <circle cx="215" cy="204" r="2.2" fill="#94A3B8" />
            <circle cx="350" cy="217" r="2.2" fill="#94A3B8" />
            <circle cx="485" cy="204" r="2.2" fill="#94A3B8" />

            {/* Bottom Hoop */}
            <path
              d="M 186 268 Q 350 288 514 268 L 516 280 Q 350 300 184 280 Z"
              fill="url(#ironBandGrad)"
            />
            <circle cx="230" cy="276" r="2.2" fill="#94A3B8" />
            <circle cx="350" cy="289" r="2.2" fill="#94A3B8" />
            <circle cx="470" cy="276" r="2.2" fill="#94A3B8" />

            {/* Wooden rim (mulut ember kayu) */}
            <ellipse cx="350" cy="140" rx="185" ry="34" fill="#451A03" />
            <ellipse cx="350" cy="140" rx="177" ry="29" fill="#1C1917" opacity="0.8" />

            {/* ══════════════════════════════════════════════════════════════════
                2. AIR LELEHAN (MELTWATER / CHILLED BRINE SLUSH POOL)
            ══════════════════════════════════════════════════════════════════ */}
            {/* Liquid pool at the base of the ice inside the tub */}
            <ellipse cx="350" cy="142" rx="173" ry="26" fill="url(#brinePoolGrad)" />
            {/* Glistening surface ripple lines */}
            <path d="M 210 144 Q 250 148 290 144" stroke="#E0F2FE" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M 410 145 Q 460 149 500 143" stroke="#E0F2FE" strokeWidth="1.5" fill="none" opacity="0.7" />
            <path d="M 310 152 Q 350 155 390 152" stroke="#BAE6FD" strokeWidth="1.2" fill="none" opacity="0.5" />

            {/* ══════════════════════════════════════════════════════════════════
                3. TABUNG LOGAM TENGAH DENGAN TUTUP, ENGKOL & EMBUN/BUNGA ES
            ══════════════════════════════════════════════════════════════════ */}
            <g filter="url(#softShadow)">
              {/* Tabung Logam Utama (Cylinder Body) */}
              <path
                d="M 292 82 L 292 245 Q 350 262 408 245 L 408 82 Z"
                fill="url(#steelWallGrad)"
              />

              {/* Specular metallic highlights & shadow strips */}
              <line x1="318" y1="82" x2="318" y2="252" stroke="#FFFFFF" strokeWidth="5" opacity="0.7" />
              <line x1="382" y1="82" x2="382" y2="252" stroke="#475569" strokeWidth="3" opacity="0.35" />
              <line x1="396" y1="82" x2="396" y2="249" stroke="#334155" strokeWidth="2" opacity="0.4" />

              {/* Embun & Bunga Es pada Dinding Luar Tabung (Frost & Beads) */}
              {/* Frost gradient overlay near ice contact zone */}
              <path
                d="M 292 125 L 292 245 Q 350 262 408 245 L 408 125 Z"
                fill="url(#frostWallGrad)"
              />
              {/* Bunga es / kristal es halus (Frost crystalline clusters) */}
              <g stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
                {/* Cluster 1 */}
                <line x1="305" y1="170" x2="311" y2="170" />
                <line x1="308" y1="167" x2="308" y2="173" />
                <line x1="306" y1="168" x2="310" y2="172" />
                {/* Cluster 2 */}
                <line x1="324" y1="195" x2="330" y2="195" />
                <line x1="327" y1="192" x2="327" y2="198" />
                {/* Cluster 3 */}
                <line x1="390" y1="175" x2="396" y2="175" />
                <line x1="393" y1="172" x2="393" y2="178" />
                {/* Cluster 4 */}
                <line x1="375" y1="205" x2="381" y2="205" />
                <line x1="378" y1="202" x2="378" y2="208" />
              </g>

              {/* Titik-titik butiran embun air dingin (Condensation droplets) */}
              <g fill="#FFFFFF" opacity="0.75">
                <circle cx="304" cy="148" r="1.5" />
                <circle cx="307" cy="154" r="1.2" />
                <circle cx="315" cy="182" r="1.6" />
                <circle cx="335" cy="165" r="1.3" />
                <circle cx="365" cy="175" r="1.4" />
                <circle cx="385" cy="155" r="1.7" />
                <circle cx="395" cy="188" r="1.5" />
                <circle cx="370" cy="220" r="1.6" />
                <circle cx="330" cy="225" r="1.5" />
              </g>

              {/* Tutup Tabung Logam (Metallic Lid with rim & lip) */}
              <ellipse cx="350" cy="82" rx="60" ry="14" fill="#64748B" />
              <ellipse cx="350" cy="79" rx="58" ry="13" fill="url(#lidGrad)" stroke="#CBD5E1" strokeWidth="1" />
              <ellipse cx="350" cy="78" rx="48" ry="9" fill="#94A3B8" opacity="0.6" />
              {/* Center mount boss/bushing for crank axle */}
              <ellipse cx="350" cy="76" rx="14" ry="5" fill="#475569" stroke="#E2E8F0" strokeWidth="1" />
              <circle cx="350" cy="74" r="5" fill="#1E293B" />

              {/* ── ENGKOL / PEGANGAN PEMUTAR MANUAL (CRANK HANDLE) ── */}
              {/* As vertikal (vertical spindle axle) */}
              <rect x="347" y="32" width="6" height="42" rx="2" fill="#334155" stroke="#94A3B8" strokeWidth="0.8" />

              {/* Lengan engkol horizontal (horizontal crank lever arm) */}
              <path
                d="M 345 34 L 412 24 L 414 30 L 347 40 Z"
                fill="url(#ironBandGrad)"
                stroke="#64748B"
                strokeWidth="0.8"
              />
              <circle cx="350" cy="36" r="4.5" fill="#64748B" />
              <circle cx="410" cy="27" r="4" fill="#64748B" />

              {/* Pegangan putar vertikal (Wooden/Bakelite handle grip) */}
              <rect x="406" y="6" width="8" height="23" rx="4" fill="#78350F" stroke="#381402" strokeWidth="1" />
              <rect x="407.5" y="8" width="5" height="19" rx="2.5" fill="#B45309" />
              <circle cx="410" cy="6" r="3" fill="#D97706" />
            </g>

            {/* ══════════════════════════════════════════════════════════════════
                4. BONGKAHAN ES SEMITRANSPARAN & BUTIRAN GARAM KASAR (REALISTIS)
            ══════════════════════════════════════════════════════════════════ */}
            {/* ── Bongkahan Es Sisi Kiri ── */}
            <g filter="url(#softShadow)">
              {/* Bongkahan Es 1 (Besar, bersudut) */}
              <polygon points="185,142 225,126 250,140 215,158" fill="url(#iceFacet1)" stroke="#FFFFFF" strokeWidth="1" />
              <polygon points="185,142 215,158 210,182 180,165" fill="url(#iceFacet2)" />
              <polygon points="215,158 250,140 245,170 210,182" fill="url(#iceFacet3)" />

              {/* Bongkahan Es 2 (Menumpuk di samping) */}
              <polygon points="220,152 258,144 278,160 240,172" fill="url(#iceFacet1)" stroke="#FFFFFF" strokeWidth="1" />
              <polygon points="220,152 240,172 235,194 215,174" fill="url(#iceFacet2)" />
              <polygon points="240,172 278,160 272,185 235,194" fill="url(#iceFacet3)" />

              {/* Bongkahan Es 3 (Di sela dekat ember) */}
              <polygon points="175,155 205,148 220,162 190,172" fill="url(#iceFacet2)" stroke="#FFFFFF" strokeWidth="0.8" />
              <polygon points="175,155 190,172 185,190 170,175" fill="url(#iceFacet3)" />

              {/* Bongkahan Es 4 (Dekat dasar tabung kiri) */}
              <polygon points="248,168 285,160 295,178 258,188" fill="url(#iceFacet1)" stroke="#E0F2FE" strokeWidth="1" />
              <polygon points="258,188 295,178 290,202 252,208" fill="url(#iceFacet3)" />
            </g>

            {/* ── Bongkahan Es Sisi Kanan ── */}
            <g filter="url(#softShadow)">
              {/* Bongkahan Es 5 (Kanan dekat tabung) */}
              <polygon points="410,165 445,152 465,168 428,182" fill="url(#iceFacet1)" stroke="#FFFFFF" strokeWidth="1" />
              <polygon points="410,165 428,182 422,204 405,188" fill="url(#iceFacet2)" />
              <polygon points="428,182 465,168 460,195 422,204" fill="url(#iceFacet3)" />

              {/* Bongkahan Es 6 (Tengah kanan mengelilingi termometer) */}
              <polygon points="440,145 478,136 498,154 460,166" fill="url(#iceFacet2)" stroke="#FFFFFF" strokeWidth="1" />
              <polygon points="460,166 498,154 492,182 452,192" fill="url(#iceFacet3)" />

              {/* Bongkahan Es 7 (Pinggir kanan ember) */}
              <polygon points="475,148 512,140 528,158 495,168" fill="url(#iceFacet1)" stroke="#E0F2FE" strokeWidth="0.8" />
              <polygon points="475,148 495,168 488,190 470,172" fill="url(#iceFacet2)" />

              {/* Bongkahan Es 8 (Di depan agak bawah) */}
              <polygon points="435,185 470,175 488,194 450,206" fill="url(#iceFacet3)" stroke="#FFFFFF" strokeWidth="1" />
            </g>

            {/* Kilau Specular pada Ujung Kristal Es */}
            <g stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.9">
              <line x1="218" y1="128" x2="225" y2="126" />
              <line x1="240" y1="142" x2="247" y2="140" />
              <line x1="445" y1="138" x2="453" y2="136" />
              <line x1="472" y1="156" x2="480" y2="154" />
            </g>

            {/* ── Butiran Garam Kasar Putih (NaCl Granules) Tersebar di Sela-sela Es ── */}
            <g filter="url(#subtleGlow)">
              {/* Garam di Sisi Kiri */}
              <polygon points="214,136 218,134 220,138 216,140" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="228,138 232,136 235,141 230,143" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="238,132 242,130 244,135 240,137" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="202,148 206,146 208,151 204,153" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="248,150 252,148 255,153 250,155" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="222,165 226,163 228,168 224,170" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="262,158 266,156 268,161 264,163" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="234,180 238,178 240,183 236,185" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="274,172 278,170 280,175 276,177" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />

              {/* Garam di Sisi Kanan (Di sekitar es dan termometer) */}
              <polygon points="446,146 450,144 452,149 448,151" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="458,140 462,138 464,143 460,145" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="470,148 474,146 476,151 472,153" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="432,158 436,156 438,161 434,163" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="485,152 489,150 491,155 487,157" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="442,176 446,174 448,179 444,181" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="468,168 472,166 474,171 470,173" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="496,164 500,162 502,167 498,169" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
              <polygon points="458,196 462,194 464,199 460,201" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="0.5" />
            </g>

            {/* Cold mist / vapor clouds (kabut dingin di atas ember) */}
            <ellipse cx="235" cy="130" rx="55" ry="16" fill="url(#mistVaporGrad)" />
            <ellipse cx="465" cy="130" rx="60" ry="18" fill="url(#mistVaporGrad)" />

            {/* ══════════════════════════════════════════════════════════════════
                5. TERMOMETER TERCELUP DI DALAM CAMPURAN ES-GARAM (DI DALAM EMBER)
            ══════════════════════════════════════════════════════════════════ */}
            <g filter="url(#softShadow)">
              {/* Tabung Kaca Termometer (Glass stem dipping into ice) */}
              {/* Outer glass tube */}
              <rect x="466" y="55" width="12" height="135" rx="6" fill="#F8FAFC" fillOpacity="0.85" stroke="#475569" strokeWidth="1.4" />
              {/* Glass reflection streak on left */}
              <line x1="468.5" y1="58" x2="468.5" y2="175" stroke="#FFFFFF" strokeWidth="1.8" opacity="0.9" />

              {/* Ujung Bola Cairan Merkuri/Alkohol (Bulb submerged in ice at bottom) */}
              <circle cx="472" cy="184" r="10" fill="#0284C7" stroke="#334155" strokeWidth="1.5" />
              <circle cx="469" cy="181" r="3.5" fill="#7DD3FC" opacity="0.8" />

              {/* Kolom Cairan Termometer (Liquid column showing low temperature down to -8 °C) */}
              {/* The liquid column goes down past 0°C to -8°C */}
              <rect x="470" y="142" width="4" height="42" rx="2" fill="#0284C7" />

              {/* Skala Ukur & Garis Tanda */}
              {/* Garis 0 °C (Patokan Titik Beku Air Normal) */}
              <line x1="460" y1="105" x2="466" y2="105" stroke="#EF4444" strokeWidth="1.8" />
              <text x="456" y="108" fontSize="9" fontWeight="800" fill="#EF4444" textAnchor="end">0°C</text>

              {/* Tanda skala sedang */}
              <line x1="462" y1="117" x2="466" y2="117" stroke="#64748B" strokeWidth="1.2" />
              <line x1="462" y1="129" x2="466" y2="129" stroke="#64748B" strokeWidth="1.2" />

              {/* Garis Penunjuk −8 °C (Suhu Campuran Es + Garam) */}
              <line x1="460" y1="142" x2="466" y2="142" stroke="#0284C7" strokeWidth="2" />
              <text x="456" y="145" fontSize="9.5" fontWeight="800" fill="#0284C7" textAnchor="end">−8°C</text>

              {/* Tanda skala di bawah -8 °C */}
              <line x1="462" y1="154" x2="466" y2="154" stroke="#64748B" strokeWidth="1.2" />
            </g>

            {/* Bongkahan es parsial yang menutupi bagian bola termometer bawah agar benar-benar tercelup */}
            <polygon points="460,175 488,170 495,188 465,195" fill="url(#iceFacet1)" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.75" />
            <polygon points="455,182 468,178 472,192 458,196" fill="#FFFFFF" opacity="0.9" />

            {/* ══════════════════════════════════════════════════════════════════
                6. CALLOUT LABELS & PENUNJUK ELEGAN
            ══════════════════════════════════════════════════════════════════ */}
            {/* Label 1: Tabung Logam Berisi Adonan */}
            <g>
              <path d="M 350 48 L 350 18 L 260 18" fill="none" stroke="#0F172A" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="350" cy="48" r="3.5" fill="#0F172A" />
              <rect x="50" y="6" width="205" height="26" rx="13" fill="#0F172A" filter="url(#softShadow)" />
              <text x="152" y="23" fill="#FFFFFF" fontSize="11" fontWeight="700" textAnchor="middle">
                tabung logam berisi adonan
              </text>
            </g>

            {/* Label 2: Es Batu + Garam Kasar */}
            <g>
              <path d="M 235 155 L 140 185 L 85 185" fill="none" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="235" cy="155" r="3.5" fill="#0284C7" />
              <rect x="15" y="195" width="165" height="26" rx="13" fill="#0284C7" filter="url(#softShadow)" />
              <text x="97" y="212" fill="#FFFFFF" fontSize="11" fontWeight="700" textAnchor="middle">
                es batu + garam kasar
              </text>
            </g>

            {/* Label 3: Termometer: −8 °C */}
            <g>
              <path d="M 472 135 L 530 115 L 575 115" fill="none" stroke="#0369A1" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="472" cy="135" r="3.5" fill="#0369A1" />
              <rect x="520" y="70" width="160" height="28" rx="14" fill="#0369A1" filter="url(#softShadow)" />
              <text x="600" y="88" fill="#FFFFFF" fontSize="11.5" fontWeight="700" textAnchor="middle">
                termometer: −8 °C
              </text>
            </g>
          </svg>
        </div>
      </Card>

      {/* ── 2. Cerita Singkat Pak Darmo ─────────────────────────────────── */}
      <Card style={{
        background: '#FFFFFF',
        borderLeft: '5px solid #0284C7',
        padding: '1.25rem 1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>🍨</span>
          <div>
            <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', color: '#0F172A', fontWeight: 800 }}>
              Kisah Gerobak Es Puter Tradisional
            </h4>
            <p style={{
              margin: 0,
              fontSize: '1.05rem',
              lineHeight: 1.7,
              color: '#334155',
              fontStyle: 'normal'
            }}>
              “Pak Darmo berjualan es puter keliling. Ia tidak punya freezer, hanya gerobak berisi es batu yang ditaburi garam kasar. Anehnya, es batunya justru cepat mencair, tetapi adonan di dalam tabung logam malah membeku menjadi es krim.”
            </p>
          </div>
        </div>
      </Card>

      {/* ── 3. Pertanyaan Pemantik Kotak Menonjol ────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        border: '2px solid #3B82F6',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          background: '#2563EB',
          color: '#FFFFFF',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.4rem',
          flexShrink: 0,
          fontWeight: 800
        }}>
          ?
        </div>
        <div>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#1D4ED8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Pertanyaan Pemantik Penyelidikan
          </span>
          <p style={{
            margin: '0.25rem 0 0',
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#1E3A8A',
            lineHeight: 1.5
          }}>
            “Mengapa adonan bisa membeku tanpa freezer, padahal es batu di sekitarnya malah mencair?”
          </p>
        </div>
      </div>
    </div>
  );
}
