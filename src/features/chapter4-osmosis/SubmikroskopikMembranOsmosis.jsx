import React, { useState, useEffect, useMemo } from 'react';
import { formatIndonesianNumber } from '../../utils/formatNumber';

/**
 * Komponen SubmikroskopikMembranOsmosis
 * 
 * Visualisasi Level 2 Johnstone untuk Tekanan Osmotik:
 * Menampilkan dinamika partikulat molekuler seleksi pori-pori membran semipermeabel:
 * 1. Sisi Kiri (Larutan Encer / Air Murni): konsentrasi molekul air bebas tinggi.
 * 2. Membran Semipermeabel (Tengah): memiliki 3 saluran pori selektif (lebar cukup untuk H2O, sempit untuk zat terlarut).
 * 3. Sisi Kanan (Larutan Pekat): molekul air + partikel zat terlarut besar dengan mantel hidrasi.
 * 4. Tiga Mode Eksplorasi:
 *    - Osmosis Alami: laju air menembus ke sisi pekat lebih tinggi (aliran bersih ke kanan).
 *    - Kesetimbangan Osmotik (P = Π): laju air bolak-balik seimbang (aliran bersih = 0).
 *    - Osmosis Balik (P > Π): tekanan luar menekan sisi pekat, memaksa air murni mengalir ke kiri!
 */
export default function SubmikroskopikMembranOsmosis() {
  const [mode, setMode] = useState('alami'); // 'alami' | 'seimbang' | 'balik'
  const [temp, setTemp] = useState(25); // 25°C vs 45°C
  const [tick, setTick] = useState(0);

  // Animasi kontinu via requestAnimationFrame
  useEffect(() => {
    let animId;
    let start = Date.now();
    const frame = () => {
      if (!document.hidden) {
        setTick(Date.now() - start);
      }
      animId = requestAnimationFrame(frame);
    };
    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);

  const tSec = tick / 1000;
  const speedMultiplier = 1 + (temp - 25) * 0.02;

  // Laju fluks teoritis berdasarkan mode
  let rateToRight = 12.0 * speedMultiplier;
  let rateToLeft = 5.0 * speedMultiplier;
  let netDirection = 'kanan';

  if (mode === 'seimbang') {
    rateToRight = 9.0 * speedMultiplier;
    rateToLeft = 9.0 * speedMultiplier;
    netDirection = 'nol';
  } else if (mode === 'balik') {
    rateToRight = 3.0 * speedMultiplier;
    rateToLeft = 14.0 * speedMultiplier;
    netDirection = 'kiri';
  }

  const netFlux = Math.abs(rateToRight - rateToLeft);

  // Partikel Zat Terlarut Besar (Glukosa / Solute, d = 22px) di Sisi Kanan
  // Hanya bergerak di sisi kanan (x: 290..495, y: 35..215) dan tidak pernah masuk ke pori (lebar pori hanya 16px)
  const soluteParticles = useMemo(() => {
    return [
      { bx: 310, by: 55, phX: 1.2, phY: 0.8 },
      { bx: 345, by: 115, phX: 2.1, phY: 1.4 },
      { bx: 320, by: 175, phX: 0.7, phY: 2.2 },
      { bx: 385, by: 65, phX: 1.8, phY: 0.9 },
      { bx: 410, by: 135, phX: 2.5, phY: 1.7 },
      { bx: 375, by: 195, phX: 1.1, phY: 2.8 },
      { bx: 460, by: 85, phX: 0.5, phY: 1.9 },
      { bx: 470, by: 165, phX: 1.9, phY: 0.4 },
    ];
  }, []);

  // 12 Molekul Air yang Bergerak Melewati 3 Saluran Pori Membran
  // Saluran Pori: Pori 1 (y = 55), Pori 2 (y = 120), Pori 3 (y = 185)
  // X: melintasi membran (x: 235 sampai 285)
  const poreYs = [55, 120, 185];

  return (
    <div style={{
      width: '100%',
      fontFamily: "'Times New Roman', Times, serif",
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem'
    }}>

      {/* ── KONTROL MODE & ENERGI KINETIK ──────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.65rem',
        padding: '0.5rem 0.85rem',
        background: '#F8FAFC',
        borderRadius: '12px',
        border: '1px solid #E2E8F0'
      }}>
        {/* Toggle 3 Mode */}
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setMode('alami')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              border: mode === 'alami' ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
              background: mode === 'alami' ? '#E0F2FE' : '#FFFFFF',
              color: mode === 'alami' ? '#0369A1' : '#475569',
              fontWeight: mode === 'alami' ? 800 : 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>💧</span>
            <span>Osmosis Alami (P = 0)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('seimbang')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              border: mode === 'seimbang' ? '1.5px solid #059669' : '1px solid #CBD5E1',
              background: mode === 'seimbang' ? '#ECFDF5' : '#FFFFFF',
              color: mode === 'seimbang' ? '#047857' : '#475569',
              fontWeight: mode === 'seimbang' ? 800 : 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>⚖️</span>
            <span>Setimbang (P = Π)</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('balik')}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              border: mode === 'balik' ? '1.5px solid #7C3AED' : '1px solid #CBD5E1',
              background: mode === 'balik' ? '#F5F3FF' : '#FFFFFF',
              color: mode === 'balik' ? '#6D28D9' : '#475569',
              fontWeight: mode === 'balik' ? 800 : 600,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>🚀</span>
            <span>Osmosis Balik (P &gt; Π)</span>
          </button>
        </div>

        {/* Toggle Suhu / Gerak Termal */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: '#475569' }}>
          <span>🌡️ Suhu:</span>
          <button
            type="button"
            onClick={() => setTemp((t) => (t === 25 ? 45 : 25))}
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              fontWeight: 700,
              color: temp === 25 ? '#0284C7' : '#DC2626',
              cursor: 'pointer'
            }}
          >
            {temp === 25 ? '25 °C (Sedang)' : '45 °C (Cepat)'}
          </button>
        </div>
      </div>

      {/* ── SIMULASI SVG SUBMIKROSKOPIK PORI MEMBRAN ───────────────────── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1.5px solid #BAE6FD',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(2, 132, 199, 0.06)'
      }}>
        <svg
          viewBox="0 0 520 240"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <defs>
            {/* Gradien Pelarut Air Sisi Kiri */}
            <linearGradient id="leftChamberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F0F9FF" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>

            {/* Gradien Larutan Pekat Sisi Kanan */}
            <linearGradient id="rightChamberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="100%" stopColor="#FEF3C7" />
            </linearGradient>

            {/* Pola Dinding Membran Semipermeabel */}
            <linearGradient id="membraneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Gradien Pori Saluran */}
            <linearGradient id="poreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* 1. LATAR WADAH KIRI (AIR MURNI / ENCER) */}
          <rect x="10" y="25" width="240" height="195" fill="url(#leftChamberGrad)" rx="8" />

          {/* 2. LATAR WADAH KANAN (LARUTAN PEKAT) */}
          <rect x="270" y="25" width="240" height="195" fill="url(#rightChamberGrad)" rx="8" />

          {/* Header Label Wadah */}
          <text x="130" y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369A1">
            SISI ENCER (Air Murni)
          </text>
          <text x="390" y="42" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#92400E">
            SISI PEKAT (Zat Terlarut + Air)
          </text>

          {/* Garis Dasar Wadah Kaca Luar */}
          <rect x="10" y="25" width="500" height="195" fill="none" stroke="#64748B" strokeWidth="2.5" rx="8" />

          {/* 3. MEMBRAN SEMIPERMEABEL DI TENGAH (x: 250..270) DENGAN 3 PORI */}
          {/* Blok 1: Paling Atas (y: 25..45) */}
          <rect x="250" y="25" width="20" height="20" fill="url(#membraneGrad)" stroke="#1E293B" strokeWidth="1" />
          {/* Saluran Pori 1 (y: 45..65) */}
          <rect x="250" y="45" width="20" height="20" fill="url(#poreGrad)" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />

          {/* Blok 2: Antara Pori 1 & 2 (y: 65..110) */}
          <rect x="250" y="65" width="20" height="45" fill="url(#membraneGrad)" stroke="#1E293B" strokeWidth="1" />
          {/* Saluran Pori 2 (y: 110..130) */}
          <rect x="250" y="110" width="20" height="20" fill="url(#poreGrad)" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />

          {/* Blok 3: Antara Pori 2 & 3 (y: 130..175) */}
          <rect x="250" y="130" width="20" height="45" fill="url(#membraneGrad)" stroke="#1E293B" strokeWidth="1" />
          {/* Saluran Pori 3 (y: 175..195) */}
          <rect x="250" y="175" width="20" height="20" fill="url(#poreGrad)" stroke="#38BDF8" strokeWidth="1" strokeDasharray="2 2" />

          {/* Blok 4: Paling Bawah (y: 195..220) */}
          <rect x="250" y="195" width="20" height="25" fill="url(#membraneGrad)" stroke="#1E293B" strokeWidth="1" />

          {/* Label Membran Semipermeabel */}
          <text x="260" y="18" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#334155">
            MEMBRAN (Pori Ø 0,3 nm)
          </text>

          {/* Efek Piston Hidrostatik Luar di Sisi Kanan (Jika Osmosis Balik) */}
          {mode === 'balik' && (
            <g className="fade-in">
              <rect x="496" y="26" width="12" height="193" fill="#DC2626" rx="2" />
              <text x="475" y="125" fontSize="16" fill="#DC2626" fontWeight="bold">⬅</text>
              <text x="445" y="38" fontSize="10" fontWeight="bold" fill="#DC2626">
                Tekanan Luar (P &gt; Π)
              </text>
            </g>
          )}

          {/* 4. PARTIKEL ZAT TERLARUT BESAR (d = 20px) DI SISI KANAN */}
          {soluteParticles.map((s, idx) => {
            // Gerak termal Brownian
            const ox = Math.sin(tSec * 1.8 * speedMultiplier + s.phX) * 12;
            const oy = Math.cos(tSec * 2.1 * speedMultiplier + s.phY) * 12;

            // Memastikan partikel tidak menembus membran (x >= 286)
            const sx = Math.max(288, Math.min(485, s.bx + ox));
            const sy = Math.max(52, Math.min(205, s.by + oy));

            return (
              <g key={`solute-${idx}`}>
                {/* Cincin Mantel Hidrasi (Molekul pelarut yang mengikat zat terlarut) */}
                <circle cx={sx} cy={sy} r="14" fill="#F97316" fillOpacity="0.18" stroke="#F97316" strokeDasharray="2 2" />
                {/* Inti Zat Terlarut (Glukosa, berukuran besar tidak muat pori) */}
                <circle cx={sx} cy={sy} r="9" fill="#EA580C" stroke="#C2410C" strokeWidth="1.5" />
                <circle cx={sx - 2.5} cy={sy - 2.5} r="2.5" fill="#FED7AA" />
                {/* Label Mr besar */}
                <text x={sx} y={sy + 3} textAnchor="middle" fontSize="7" fill="#FFFFFF" fontWeight="bold">
                  Glukosa
                </text>
              </g>
            );
          })}

          {/* Indikator Partikel Terpental Saat Menabrak Pori */}
          <g>
            {/* Tanda benturan di dekat pori jika zat terlarut mendekat */}
            <circle cx="282" cy="120" r="3" fill="#EF4444" opacity="0.7" />
            <text x="315" y="123" fontSize="8" fill="#DC2626" fontWeight="bold">
              ✕ Tertahan (Ø terlalu besar)
            </text>
          </g>

          {/* 5. MOLEKUL AIR BEBAS DI SISI KIRI (Banyak & Bebas Menabrak Pori) */}
          {[
            { x: 35, y: 70 }, { x: 75, y: 55 }, { x: 120, y: 65 }, { x: 160, y: 55 }, { x: 200, y: 65 },
            { x: 45, y: 120 }, { x: 90, y: 110 }, { x: 140, y: 130 }, { x: 180, y: 115 }, { x: 215, y: 125 },
            { x: 40, y: 175 }, { x: 80, y: 190 }, { x: 130, y: 175 }, { x: 170, y: 185 }, { x: 210, y: 170 },
            { x: 60, y: 90 }, { x: 110, y: 150 }, { x: 155, y: 95 }, { x: 195, y: 145 }, { x: 105, y: 85 }
          ].map((w, idx) => {
            const ox = Math.sin(tSec * 3 * speedMultiplier + idx) * 5;
            const oy = Math.cos(tSec * 2.7 * speedMultiplier + idx * 1.3) * 5;
            return (
              <g key={`water-left-${idx}`}>
                {/* Model Polar Molekul Air: 1 Oksigen + 2 Hidrogen */}
                <circle cx={w.x + ox} cy={w.y + oy} r="4.2" fill="#0284C7" stroke="#0369A1" strokeWidth="0.8" />
                <circle cx={w.x + ox - 2.5} cy={w.y + oy - 2.5} r="1.8" fill="#BAE6FD" />
                <circle cx={w.x + ox + 2.5} cy={w.y + oy - 2.5} r="1.8" fill="#BAE6FD" />
              </g>
            );
          })}

          {/* 6. MOLEKUL AIR YANG MENEMBUS SALURAN PORI MEMBRAN (x: 230 hingga 290) */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
            const poreIndex = i % 3;
            const py = poreYs[poreIndex];
            const phase = (tSec * (mode === 'balik' ? 1.4 : 1.1) * speedMultiplier + (i / 9)) % 1;

            let px = 235;
            if (mode === 'alami') {
              // Air mengalir deras dari KIRI ke KANAN
              px = 220 + phase * 70;
            } else if (mode === 'balik') {
              // Air dipaksa mengalir dari KANAN ke KIRI
              px = 290 - phase * 70;
            } else {
              // Setimbang: sebagian ke kanan, sebagian ke kiri
              px = i % 2 === 0 ? 220 + phase * 70 : 290 - phase * 70;
            }

            return (
              <g key={`pore-water-${i}`}>
                <circle cx={px} cy={py} r="4" fill="#0284C7" stroke="#38BDF8" strokeWidth="1" />
                <circle cx={px - 2} cy={py - 2} r="1.6" fill="#FFFFFF" />
              </g>
            );
          })}

          {/* Indikator Panah Aliran Bersih di Membran */}
          <g>
            {netDirection === 'kanan' && (
              <text x="260" y="232" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0284C7">
                Aliran Bersih Air: ➔ (Ke Sisi Pekat)
              </text>
            )}
            {netDirection === 'kiri' && (
              <text x="260" y="232" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7C3AED">
                Aliran Balik Air: ⬅ (Ke Sisi Murni)
              </text>
            )}
            {netDirection === 'nol' && (
              <text x="260" y="232" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#059669">
                Aliran Bersih: 0 (Setimbang Dinamis ⇄)
              </text>
            )}
          </g>
        </svg>
      </div>

      {/* ── METERAN LAJU PERPINDAHAN MOLEKUL AIR (FLUKS PARTIKEL) ────────── */}
      <div style={{
        background: '#F0F9FF',
        border: '1px solid #BAE6FD',
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.75rem',
        alignItems: 'center',
        fontSize: '0.86rem'
      }}>
        {/* Laju Kiri ke Kanan */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ color: '#0369A1', fontWeight: 700 }}>Laju Air (Kiri ➔ Kanan):</span>
            <strong>{formatIndonesianNumber(rateToRight, 1)} mol/dtk</strong>
          </div>
          <div style={{ height: '7px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              width: `${(rateToRight / 16) * 100}%`,
              height: '100%',
              background: '#0284C7',
              borderRadius: '999px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Laju Kanan ke Kiri */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span style={{ color: '#7C3AED', fontWeight: 700 }}>Laju Air (Kanan ⬅ Kiri):</span>
            <strong>{formatIndonesianNumber(rateToLeft, 1)} mol/dtk</strong>
          </div>
          <div style={{ height: '7px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{
              width: `${(rateToLeft / 16) * 100}%`,
              height: '100%',
              background: mode === 'balik' ? '#7C3AED' : '#059669',
              borderRadius: '999px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        {/* Status Aliran Bersih */}
        <div style={{
          background: '#FFFFFF',
          padding: '0.45rem 0.75rem',
          borderRadius: '8px',
          border: '1px solid #CBD5E1',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block' }}>Aliran Bersih (Net Flux):</span>
          <strong style={{
            color: netDirection === 'kanan' ? '#0284C7' : netDirection === 'kiri' ? '#7C3AED' : '#059669',
            fontSize: '0.94rem'
          }}>
            {netDirection === 'kanan' && `➔ ${formatIndonesianNumber(netFlux, 1)} mol/dtk (Osmosis)`}
            {netDirection === 'kiri' && `⬅ ${formatIndonesianNumber(netFlux, 1)} mol/dtk (Osmosis Balik)`}
            {netDirection === 'nol' && `0,0 mol/dtk (Setimbang)`}
          </strong>
        </div>
      </div>

      {/* ── PENJELASAN KONSEP KUNCI SUBMIKROSKOPIK ───────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        fontSize: '0.88rem',
        color: '#334155',
        lineHeight: 1.55
      }}>
        💡 <strong>Penjelasan Submikroskopis:</strong>{' '}
        {mode === 'alami' && (
          <span>
            Pada <strong>Osmosis Alami</strong>, di sisi encer terdapat lebih banyak molekul air bebas yang bertumbukan dengan pori-pori membran per detik dibanding di sisi pekat (di mana air terhalang/terikat oleh zat terlarut). Akibatnya, timbul <strong>aliran bersih molekul air menuju larutan pekat</strong>.
          </span>
        )}
        {mode === 'seimbang' && (
          <span>
            Pada <strong>Kesetimbangan Osmotik (P = Π)</strong>, tekanan hidrostatik luar yang diberikan pada larutan pekat meningkatkan frekuensi molekul air di sisi kanan untuk menembus pori-pori ke kiri, sehingga laju air masuk = laju air keluar (aliran bersih = 0).
          </span>
        )}
        {mode === 'balik' && (
          <span>
            Pada <strong>Osmosis Balik (P &gt; Π)</strong>, tekanan luar yang jauh lebih besar menekan molekul air di larutan pekat sehingga dipaksa menembus pori-pori membran menuju sisi air murni, sementara molekul zat terlarut tetap tertahan karena ukurannya melebihi diameter pori.
          </span>
        )}
      </div>

      {/* Legenda Partikel */}
      <div style={{
        fontSize: '0.8rem',
        color: '#64748B',
        textAlign: 'center',
        fontWeight: 600
      }}>
        <span style={{ color: '#0284C7', fontWeight: 800 }}>●</span> Molekul air ($H_2O$, Ø ~0,28 nm) muat menembus pori ·{' '}
        <span style={{ color: '#EA580C', fontWeight: 800 }}>●</span> Partikel zat terlarut (Ø ~1 nm) tertahan oleh membran
      </div>

    </div>
  );
}
