import React from 'react';

/**
 * Komponen Ilustrasi SVG: Dua Gelas Larutan Gula Makroskopik
 * 
 * Pengamatan Makroskopik (Kasat Mata):
 * - Gula yang telah larut sempurna tidak terlihat oleh mata telanjang (tanpa titik partikel).
 * - Kedua gelas hanya berisi air yang tampak jernih/bening homogen.
 * - Indikator takaran gula hanya berupa ikon sendok di bibir gelas:
 *   - 1 sendok di bibir gelas kiri
 *   - 5 sendok di bibir gelas kanan
 * - Keterangan bawah: "Air tetap jernih (encer)" dan "Air tetap jernih (lebih pekat)"
 */
export default function SugarGlassesIllustration() {
  return (
    <div style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '6px 0'
    }}>
      <svg
        viewBox="0 0 500 174"
        style={{
          width: '100%',
          maxWidth: '520px',
          height: 'auto',
          maxHeight: '174px',
          display: 'block'
        }}
        aria-label="Ilustrasi makroskopik dua gelas air jernih: 1 sendok gula vs 5 sendok gula"
      >
        <defs>
          {/* Gradien Dinding Kaca Bening */}
          <linearGradient id="glassWallGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="20%" stopColor="#E2E8F0" />
            <stop offset="80%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Gradien Cairan Air Bening/Jernih (Transparan murni, tanpa partikel kasat mata) */}
          <linearGradient id="clearWaterGrad" x1="0" y1="0" x2="0" y2="100%">
            <stop offset="0%" stopColor="#F0F9FF" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#E0F2FE" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.8" />
          </linearGradient>

          {/* Simbol Vektor Sendok Kecil Berisi Gula Pasir */}
          <g id="miniSpoonIcon">
            {/* Gagang sendok perak */}
            <path d="M -11 -7 Q -6 -3 0 0" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" fill="none" />
            <path d="M -11 -7 Q -6 -3 0 0" stroke="#CBD5E1" strokeWidth="0.8" strokeLinecap="round" fill="none" />
            {/* Cekungan kepala sendok */}
            <ellipse cx="5" cy="3.2" rx="6" ry="3.8" fill="#E2E8F0" stroke="#64748B" strokeWidth="0.9" transform="rotate(18 5 3.2)" />
            {/* Gundukan gula pasir putih di atas sendok */}
            <ellipse cx="5" cy="2.2" rx="4.5" ry="2.5" fill="#FFFFFF" stroke="#FDE68A" strokeWidth="0.7" transform="rotate(18 5 2.2)" />
            {/* Kilau butiran gula */}
            <circle cx="4.2" cy="1.8" r="0.6" fill="#F59E0B" />
            <circle cx="6" cy="2.6" r="0.5" fill="#F59E0B" />
          </g>
        </defs>

        {/* =========================================================
            GELAS 1: 1 SENDOK GULA (KIRI)
            ========================================================= */}
        {/* Badge Label Atas */}
        <rect x="58" y="5" width="104" height="23" rx="7" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1.2" />
        <text
          x="110"
          y="20.5"
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="700"
          fill="#0284C7"
          fontFamily="'Times New Roman', Times, serif"
        >
          1 Sendok Gula
        </text>

        {/* 1 Sendok di Bibir Gelas Kiri */}
        <g transform="translate(108, 30) scale(1.1)">
          <use href="#miniSpoonIcon" />
        </g>

        {/* Bibir Belakang Gelas Kiri */}
        <ellipse cx="110" cy="42" rx="38" ry="4.5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />

        {/* Cairan Air Bening Gelas Kiri (Murni Jernih, Tanpa Titik Partikel) */}
        <path
          d="M 74 60 L 79 126 Q 80 134 90 134 L 130 134 Q 140 134 141 126 L 146 60 Z"
          fill="url(#clearWaterGrad)"
        />
        {/* Meniscus / Permukaan Cekung Air Bening */}
        <ellipse cx="110" cy="60" rx="36" ry="4" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="0.8" />

        {/* Pantulan Cahaya Kaca (Highlight Bening Bersih) */}
        <path d="M 78 50 L 82 122" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />

        {/* Dinding Kaca Depan Gelas Kiri */}
        <path
          d="M 72 42 L 79 126 Q 80 134 90 134 L 130 134 Q 140 134 141 126 L 148 42"
          fill="none"
          stroke="url(#glassWallGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <ellipse cx="110" cy="42" rx="38" ry="4.5" fill="none" stroke="#94A3B8" strokeWidth="1.5" />

        {/* Keterangan Bawah Gelas Kiri */}
        <text
          x="110"
          y="156"
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="700"
          fill="#0284C7"
          fontFamily="'Times New Roman', Times, serif"
        >
          Air tetap jernih (encer)
        </text>


        {/* =========================================================
            BAGIAN TENGAH: INDIKATOR KONTROL & PENGAMATAN
            ========================================================= */}
        {/* Indikator Volume Air Sama */}
        <rect x="176" y="44" width="148" height="24" rx="12" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.2" />
        <text
          x="250"
          y="60"
          textAnchor="middle"
          fontSize="10"
          fontWeight="700"
          fill="#475569"
          fontFamily="'Times New Roman', Times, serif"
        >
          💧 Volume Pelarut Sama (200 mL)
        </text>

        {/* Garis Panah Penghubung */}
        <line x1="152" y1="56" x2="172" y2="56" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />
        <line x1="328" y1="56" x2="348" y2="56" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" />

        {/* Kotak Pengamatan Makroskopik */}
        <rect x="172" y="80" width="156" height="54" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeDasharray="3 3" />
        <text
          x="250"
          y="97"
          textAnchor="middle"
          fontSize="9.5"
          fill="#64748B"
          fontFamily="'Times New Roman', Times, serif"
        >
          Pengamatan Makroskopik:
        </text>
        <text
          x="250"
          y="111"
          textAnchor="middle"
          fontSize="10"
          fontWeight="800"
          fill="#0F172A"
          fontFamily="'Times New Roman', Times, serif"
        >
          Keduanya Bening & Homogen
        </text>
        <text
          x="250"
          y="125"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
          fill="#D97706"
          fontFamily="'Times New Roman', Times, serif"
        >
          Rasa: Kanan jauh lebih manis!
        </text>


        {/* =========================================================
            GELAS 2: 5 SENDOK GULA (KANAN)
            ========================================================= */}
        {/* Badge Label Atas */}
        <rect x="338" y="5" width="104" height="23" rx="7" fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.2" />
        <text
          x="390"
          y="20.5"
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="700"
          fill="#B45309"
          fontFamily="'Times New Roman', Times, serif"
        >
          5 Sendok Gula
        </text>

        {/* 5 Ikon Sendok di Bibir Gelas Kanan */}
        <g transform="translate(348, 30) scale(0.95)">
          <g transform="translate(0, 0)"><use href="#miniSpoonIcon" /></g>
          <g transform="translate(21, 0)"><use href="#miniSpoonIcon" /></g>
          <g transform="translate(42, 0)"><use href="#miniSpoonIcon" /></g>
          <g transform="translate(63, 0)"><use href="#miniSpoonIcon" /></g>
          <g transform="translate(84, 0)"><use href="#miniSpoonIcon" /></g>
        </g>

        {/* Bibir Belakang Gelas Kanan */}
        <ellipse cx="390" cy="42" rx="38" ry="4.5" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />

        {/* Cairan Air Bening Gelas Kanan (Sama Persis Jernihnya, Tanpa Titik Partikel) */}
        <path
          d="M 354 60 L 359 126 Q 360 134 370 134 L 410 134 Q 420 134 421 126 L 426 60 Z"
          fill="url(#clearWaterGrad)"
        />
        {/* Meniscus / Permukaan Cekung Air Bening */}
        <ellipse cx="390" cy="60" rx="36" ry="4" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="0.8" />

        {/* Pantulan Cahaya Kaca (Highlight Bening Bersih) */}
        <path d="M 358 50 L 362 122" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />

        {/* Dinding Kaca Depan Gelas Kanan */}
        <path
          d="M 352 42 L 359 126 Q 360 134 370 134 L 410 134 Q 420 134 421 126 L 428 42"
          fill="none"
          stroke="url(#glassWallGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <ellipse cx="390" cy="42" rx="38" ry="4.5" fill="none" stroke="#94A3B8" strokeWidth="1.5" />

        {/* Keterangan Bawah Gelas Kanan */}
        <text
          x="390"
          y="156"
          textAnchor="middle"
          fontSize="11.5"
          fontWeight="700"
          fill="#B45309"
          fontFamily="'Times New Roman', Times, serif"
        >
          Air tetap jernih (lebih pekat)
        </text>
      </svg>
    </div>
  );
}
