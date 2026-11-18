import React, { useState, useEffect } from 'react';
import { formatIndonesianNumber } from '../../utils/formatNumber';

/**
 * Komponen SubmikroskopikTitikBeku
 *
 * Visualisasi Level 2 Johnstone untuk Penurunan Titik Beku:
 * 1. Dua panel berdampingan: "Air murni · 0 °C" dan "Larutan urea 1 m".
 * 2. Bagian atas: kisi es teratur (label: "es (kisi teratur)").
 * 3. Garis putus-putus sebagai permukaan es.
 * 4. Bagian bawah: cairan molekul air yang bergerak acak.
 *    Pada larutan urea: ada partikel urea oranye di dekat permukaan es.
 * 5. Animasi molekul bergabung (↑, biru) dan lepas (↓, merah muda).
 * 6. Batang laju bergabung vs lepas di bawah tiap panel.
 * 7. Slider suhu 0 sampai −4 °C dan indikator status kesetimbangan.
 */
export default function SubmikroskopikTitikBeku() {
  const [temp, setTemp] = useState(0.0);
  const [tick, setTick] = useState(0);

  // Animasi berkelanjutan via requestAnimationFrame
  useEffect(() => {
    let animId;
    let start = Date.now();
    const frame = () => {
      setTick(Date.now() - start);
      animId = requestAnimationFrame(frame);
    };
    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Perhitungan Laju
  const ratePureBergabung = 10.0;
  const ratePureLepas = 10.0;

  const rateSolBergabung = 6.3; // Tetap: sebagian permukaan dihalangi urea
  const rateSolLepas = 10.0 * (1.0 + 0.2 * temp); // Lepas melambat jika suhu dingin

  const diffSol = rateSolLepas - rateSolBergabung;

  // Status kesetimbangan larutan
  let statusColor = '#B91C1C';
  let statusBg = '#FEF2F2';
  let statusBorder = '#FCA5A5';
  let statusIcon = '⚠️';
  let statusText = 'Lebih banyak yang lepas: es di larutan MENCAIR. Turunkan suhunya!';

  if (Math.abs(diffSol) < 0.25) {
    statusColor = '#15803D';
    statusBg = '#F0FDF4';
    statusBorder = '#86EFAC';
    statusIcon = '❄️';
    const tempFormatted = temp === 0 ? '0,00' : `−${formatIndonesianNumber(Math.abs(temp), 2)}`;
    statusText = `Seimbang: inilah titik beku larutan (${tempFormatted} °C)`;
  } else if (diffSol < -0.25) {
    statusColor = '#1D4ED8';
    statusBg = '#EFF6FF';
    statusBorder = '#93C5FD';
    statusIcon = '🧊';
    statusText = 'Es BERTAMBAH (membeku)';
  }

  // Koordinat kisi es (Hexagonal-like ordered nodes)
  const iceNodes = [
    // Baris 1 (y = 16)
    { x: 25, y: 16 }, { x: 60, y: 16 }, { x: 95, y: 16 }, { x: 130, y: 16 },
    { x: 165, y: 16 }, { x: 200, y: 16 }, { x: 235, y: 16 }, { x: 265, y: 16 },
    // Baris 2 (y = 34)
    { x: 42, y: 34 }, { x: 77, y: 34 }, { x: 112, y: 34 }, { x: 147, y: 34 },
    { x: 182, y: 34 }, { x: 217, y: 34 }, { x: 252, y: 34 },
    // Baris 3 (y = 52)
    { x: 25, y: 52 }, { x: 60, y: 52 }, { x: 95, y: 52 }, { x: 130, y: 52 },
    { x: 165, y: 52 }, { x: 200, y: 52 }, { x: 235, y: 52 }, { x: 265, y: 52 },
  ];

  // Garis sambungan kisi kristal es
  const latticeLines = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
    [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14],
    [15, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22],
    [0, 8], [8, 1], [1, 9], [9, 2], [2, 10], [10, 3], [3, 11], [11, 4], [4, 12], [12, 5], [5, 13], [13, 6], [6, 14], [14, 7],
    [8, 15], [8, 16], [9, 16], [9, 17], [10, 17], [10, 18], [11, 18], [11, 19], [12, 19], [12, 20], [13, 20], [13, 21], [14, 21], [14, 22],
  ];

  // Titik awal molekul air cair (Panel 1)
  const pureLiquidMolecules = [
    { bx: 30, by: 92 }, { bx: 65, by: 120 }, { bx: 95, by: 85 }, { bx: 130, by: 135 },
    { bx: 160, by: 96 }, { bx: 195, by: 125 }, { bx: 230, by: 88 }, { bx: 260, by: 110 },
    { bx: 48, by: 145 }, { bx: 80, by: 110 }, { bx: 115, by: 140 }, { bx: 175, by: 142 },
    { bx: 215, by: 105 }, { bx: 245, by: 140 }
  ];

  // Titik awal molekul air cair (Panel 2)
  const solLiquidMolecules = [
    { bx: 30, by: 95 }, { bx: 65, by: 135 }, { bx: 100, by: 100 }, { bx: 135, by: 138 },
    { bx: 165, by: 98 }, { bx: 200, by: 135 }, { bx: 235, by: 95 }, { bx: 262, by: 125 },
    { bx: 50, by: 115 }, { bx: 150, by: 120 }
  ];

  // Partikel urea oranye (Panel 2)
  // 2 partikel menempel/menghalangi tepat di permukaan es (y=66), 2 di dalam cairan
  const ureaParticles = [
    { bx: 92, by: 66, isSurface: true },
    { bx: 198, by: 66, isSurface: true },
    { bx: 55, by: 108, isSurface: false },
    { bx: 240, by: 120, isSurface: false },
  ];

  // ── Animasi Transisi Partikel Air Murni ──
  // Laju sama (10 vs 10): Periode 1100ms
  const purePeriod = 1100;
  const purePhase1 = (tick % purePeriod) / purePeriod;
  const purePhase2 = ((tick + 550) % purePeriod) / purePeriod;

  // Pure Upward (Bergabung ↑)
  const pureUpY1 = 100 - purePhase1 * 44; // 100 -> 56
  const pureUpY2 = 100 - purePhase2 * 44;
  // Pure Downward (Lepas ↓)
  const pureDownY1 = 56 + purePhase1 * 44; // 56 -> 100
  const pureDownY2 = 56 + purePhase2 * 44;

  // ── Animasi Transisi Partikel Larutan ──
  // Bergabung tetap 6.3 -> Periode lebih lama (~1750ms)
  const solUpPeriod = 1750;
  const solUpPhase = (tick % solUpPeriod) / solUpPeriod;
  const solUpY = 100 - solUpPhase * 44;

  // Lepas bergantung pada suhu: rateSolLepas = 10 * (1 + 0.2*T)
  // Saat T=0 -> rate=10 (periode 1100ms)
  // Saat T=-1.86 -> rate=6.28 (periode ~1750ms)
  // Saat T=-4.0 -> rate=2.0 (periode ~5500ms)
  const clampedRateLepas = Math.max(0.4, rateSolLepas);
  const solDownPeriod = (1100 * 10) / clampedRateLepas;
  const solDownPhase = (tick % solDownPeriod) / solDownPeriod;
  const solDownY = 56 + solDownPhase * 44;

  // Animasi molekul air memantul karena nabrak partikel urea di x=92 (y=66)
  const bouncePeriod = 1600;
  const bouncePhase = (tick % bouncePeriod) / bouncePeriod; // 0..1
  // 0..0.5 naik (y: 98 -> 76), 0.5..1.0 mantul turun (y: 76 -> 98)
  const bounceY = bouncePhase < 0.5
    ? 98 - (bouncePhase / 0.5) * 22
    : 76 + ((bouncePhase - 0.5) / 0.5) * 22;
  const isBouncingImpact = bouncePhase >= 0.42 && bouncePhase <= 0.62;

  return (
    <div style={{ width: '100%', fontFamily: "'Times New Roman', Times, serif" }}>

      {/* ── 2 PANEL BERDAMPINGAN (Responsive Grid: Stack di HP) ─────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '0.85rem',
        width: '100%',
      }}>

        {/* ══════════════════════════════════════════════════════════════════
            PANEL 1: AIR MURNI · 0 °C
            ══════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1.5px solid #BAE6FD',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.05)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Header Panel */}
          <div style={{
            padding: '0.45rem 0.85rem',
            background: '#F0F9FF',
            borderBottom: '1px solid #BAE6FD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <strong style={{ fontSize: '0.92rem', color: '#0369A1' }}>
              Air murni · 0 °C
            </strong>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              background: '#E0F2FE',
              color: '#0284C7',
              padding: '0.12rem 0.45rem',
              borderRadius: '4px',
            }}>
              Pelarut Murni
            </span>
          </div>

          {/* Kanvas Animasi SVG */}
          <div style={{ width: '100%', position: 'relative', background: '#F8FAFC' }}>
            <svg viewBox="0 0 290 155" style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Latar Bagian Es (Atas) */}
              <rect x="0" y="0" width="290" height="66" fill="#E0F2FE" opacity="0.65" />

              {/* Latar Bagian Cairan (Bawah) */}
              <rect x="0" y="66" width="290" height="89" fill="#F0F9FF" opacity="0.9" />

              {/* Garis-garis kisi es teratur */}
              {latticeLines.map(([i1, i2], idx) => (
                <line
                  key={idx}
                  x1={iceNodes[i1].x}
                  y1={iceNodes[i1].y}
                  x2={iceNodes[i2].x}
                  y2={iceNodes[i2].y}
                  stroke="#BAE6FD"
                  strokeWidth="1.2"
                />
              ))}

              {/* Titik kisi es teratur */}
              {iceNodes.map((n, idx) => (
                <circle
                  key={idx}
                  cx={n.x}
                  cy={n.y}
                  r="4.8"
                  fill="#0284C7"
                  stroke="#0369A1"
                  strokeWidth="1.2"
                />
              ))}

              {/* Label Kisi Es */}
              <g transform="translate(185, 8)">
                <rect x="0" y="0" width="98" height="17" rx="4" fill="rgba(255,255,255,0.85)" stroke="#7DD3FC" strokeWidth="0.8" />
                <text x="49" y="12" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0369A1">
                  es (kisi teratur)
                </text>
              </g>

              {/* Garis Putus-putus Permukaan Es */}
              <line
                x1="0"
                y1="66"
                x2="290"
                y2="66"
                stroke="#0284C7"
                strokeWidth="2"
                strokeDasharray="5,4"
              />
              <text x="6" y="63" fontSize="8.5" fontWeight="bold" fill="#0369A1" opacity="0.85">
                permukaan es
              </text>

              {/* Molekul Air Cair Bergerak Acak */}
              {pureLiquidMolecules.map((m, idx) => {
                const dx = Math.sin(tick / 220 + idx * 1.8) * 2.8;
                const dy = Math.cos(tick / 260 + idx * 2.1) * 2.4;
                return (
                  <circle
                    key={idx}
                    cx={m.bx + dx}
                    cy={m.by + dy}
                    r="4.2"
                    fill="#38BDF8"
                    stroke="#0284C7"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Animasi Bergabung ke Es (↑, Biru) */}
              <g transform={`translate(75, ${pureUpY1})`}>
                <circle cx="0" cy="0" r="4.8" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />
                <text x="8" y="3" fontSize="9.5" fontWeight="bold" fill="#0284C7">↑</text>
              </g>
              <g transform={`translate(210, ${pureUpY2})`}>
                <circle cx="0" cy="0" r="4.8" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />
                <text x="8" y="3" fontSize="9.5" fontWeight="bold" fill="#0284C7">↑</text>
              </g>

              {/* Animasi Lepas dari Es (↓, Merah Muda) */}
              <g transform={`translate(115, ${pureDownY1})`}>
                <circle cx="0" cy="0" r="4.8" fill="#F43F5E" stroke="#BE123C" strokeWidth="1" />
                <text x="8" y="3" fontSize="9.5" fontWeight="bold" fill="#F43F5E">↓</text>
              </g>
              <g transform={`translate(160, ${pureDownY2})`}>
                <circle cx="0" cy="0" r="4.8" fill="#F43F5E" stroke="#BE123C" strokeWidth="1" />
                <text x="8" y="3" fontSize="9.5" fontWeight="bold" fill="#F43F5E">↓</text>
              </g>
            </svg>
          </div>

          {/* Batang Laju Air Murni */}
          <div style={{ padding: '0.55rem 0.85rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
            {/* Laju Bergabung Bar */}
            <div style={{ marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#0369A1' }}>
                <span>Laju bergabung (↑):</span>
                <span>{formatIndonesianNumber(ratePureBergabung, 1)}</span>
              </div>
              <div style={{ height: '7px', background: '#E0F2FE', borderRadius: '4px', overflow: 'hidden', marginTop: '2px' }}>
                <div style={{ width: `${(ratePureBergabung / 12) * 100}%`, height: '100%', background: '#0284C7', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Laju Lepas Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#BE123C' }}>
                <span>Laju lepas (↓):</span>
                <span>{formatIndonesianNumber(ratePureLepas, 1)}</span>
              </div>
              <div style={{ height: '7px', background: '#FFE4E6', borderRadius: '4px', overflow: 'hidden', marginTop: '2px' }}>
                <div style={{ width: `${(ratePureLepas / 12) * 100}%`, height: '100%', background: '#F43F5E', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            PANEL 2: LARUTAN UREA 1 m
            ══════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '12px',
          border: '1.5px solid #FCD34D',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(217, 119, 6, 0.05)',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Header Panel */}
          <div style={{
            padding: '0.45rem 0.85rem',
            background: '#FFFBEB',
            borderBottom: '1px solid #FCD34D',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <strong style={{ fontSize: '0.92rem', color: '#92400E' }}>
              Larutan urea 1 m
            </strong>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              background: '#FEF3C7',
              color: '#B45309',
              padding: '0.12rem 0.45rem',
              borderRadius: '4px',
            }}>
              Suhu: {temp === 0 ? '0,00' : `−${formatIndonesianNumber(Math.abs(temp), 2)}`} °C
            </span>
          </div>

          {/* Kanvas Animasi SVG */}
          <div style={{ width: '100%', position: 'relative', background: '#F8FAFC' }}>
            <svg viewBox="0 0 290 155" style={{ width: '100%', height: 'auto', display: 'block' }}>
              {/* Latar Bagian Es (Atas) */}
              <rect x="0" y="0" width="290" height="66" fill="#E0F2FE" opacity="0.65" />

              {/* Latar Bagian Larutan (Bawah) */}
              <rect x="0" y="66" width="290" height="89" fill="#FFFBEB" opacity="0.8" />

              {/* Garis-garis kisi es teratur */}
              {latticeLines.map(([i1, i2], idx) => (
                <line
                  key={idx}
                  x1={iceNodes[i1].x}
                  y1={iceNodes[i1].y}
                  x2={iceNodes[i2].x}
                  y2={iceNodes[i2].y}
                  stroke="#BAE6FD"
                  strokeWidth="1.2"
                />
              ))}

              {/* Titik kisi es teratur */}
              {iceNodes.map((n, idx) => (
                <circle
                  key={idx}
                  cx={n.x}
                  cy={n.y}
                  r="4.8"
                  fill="#0284C7"
                  stroke="#0369A1"
                  strokeWidth="1.2"
                />
              ))}

              {/* Label Kisi Es */}
              <g transform="translate(185, 8)">
                <rect x="0" y="0" width="98" height="17" rx="4" fill="rgba(255,255,255,0.85)" stroke="#7DD3FC" strokeWidth="0.8" />
                <text x="49" y="12" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0369A1">
                  es (kisi teratur)
                </text>
              </g>

              {/* Garis Putus-putus Permukaan Es */}
              <line
                x1="0"
                y1="66"
                x2="290"
                y2="66"
                stroke="#0284C7"
                strokeWidth="2"
                strokeDasharray="5,4"
              />
              <text x="6" y="63" fontSize="8.5" fontWeight="bold" fill="#0369A1" opacity="0.85">
                permukaan es
              </text>

              {/* Molekul Air Cair */}
              {solLiquidMolecules.map((m, idx) => {
                const dx = Math.sin(tick / 220 + idx * 1.8) * 2.8;
                const dy = Math.cos(tick / 260 + idx * 2.1) * 2.4;
                return (
                  <circle
                    key={idx}
                    cx={m.bx + dx}
                    cy={m.by + dy}
                    r="4.2"
                    fill="#38BDF8"
                    stroke="#0284C7"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Partikel Urea Oranye (sebagian di dekat permukaan es) */}
              {ureaParticles.map((u, idx) => {
                const dx = u.isSurface ? Math.sin(tick / 350 + idx) * 0.8 : Math.sin(tick / 240 + idx) * 2.5;
                const dy = u.isSurface ? 0 : Math.cos(tick / 280 + idx) * 2.0;
                return (
                  <g key={idx} transform={`translate(${u.bx + dx}, ${u.by + dy})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r="6.8"
                      fill="#EA580C"
                      stroke="#C2410C"
                      strokeWidth="1.6"
                    />
                    {u.isSurface && (
                      <text x="0" y="2.5" textAnchor="middle" fontSize="6.5" fill="#FFFFFF" fontWeight="bold">
                        U
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Animasi Bergabung ke Es (↑, Biru) - Terbatas karena ada partikel urea */}
              <g transform={`translate(145, ${solUpY})`}>
                <circle cx="0" cy="0" r="4.8" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />
                <text x="8" y="3" fontSize="9.5" fontWeight="bold" fill="#0284C7">↑</text>
              </g>

              {/* Molekul Air Memantul karena Terhalang Urea di x=92 */}
              <g transform={`translate(92, ${bounceY})`}>
                <circle cx="0" cy="0" r="4.2" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
                {isBouncingImpact && (
                  <text x="7" y="-2" fontSize="7.8" fontWeight="bold" fill="#DC2626">✕ memantul</text>
                )}
              </g>

              {/* Animasi Lepas dari Es (↓, Merah Muda) */}
              <g transform={`translate(45, ${solDownY})`}>
                <circle cx="0" cy="0" r="4.8" fill="#F43F5E" stroke="#BE123C" strokeWidth="1" />
                <text x="8" y="3" fontSize="9.5" fontWeight="bold" fill="#F43F5E">↓</text>
              </g>
            </svg>
          </div>

          {/* Batang Laju Larutan Urea */}
          <div style={{ padding: '0.55rem 0.85rem', background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
            {/* Laju Bergabung Bar */}
            <div style={{ marginBottom: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#0369A1' }}>
                <span>Laju bergabung (↑):</span>
                <span>{formatIndonesianNumber(rateSolBergabung, 1)} (tetap)</span>
              </div>
              <div style={{ height: '7px', background: '#E0F2FE', borderRadius: '4px', overflow: 'hidden', marginTop: '2px' }}>
                <div style={{ width: `${(rateSolBergabung / 12) * 100}%`, height: '100%', background: '#0284C7', borderRadius: '4px' }} />
              </div>
            </div>

            {/* Laju Lepas Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#BE123C' }}>
                <span>Laju lepas (↓):</span>
                <span>{formatIndonesianNumber(Math.max(0, rateSolLepas), 1)}</span>
              </div>
              <div style={{ height: '7px', background: '#FFE4E6', borderRadius: '4px', overflow: 'hidden', marginTop: '2px' }}>
                <div style={{
                  width: `${Math.min(100, Math.max(0, (rateSolLepas / 12) * 100))}%`,
                  height: '100%',
                  background: '#F43F5E',
                  borderRadius: '4px',
                  transition: 'width 0.1s linear',
                }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── LEGENDA RINGKAS ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.85rem',
        fontSize: '0.78rem',
        color: '#475569',
        marginTop: '0.75rem',
        padding: '0.35rem 0.65rem',
        background: '#F8FAFC',
        borderRadius: '8px',
        border: '1px solid #E2E8F0',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0284C7', display: 'inline-block' }} />
          Molekul air (H₂O)
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#EA580C', display: 'inline-block' }} />
          Partikel urea (penghalang)
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#0284C7', fontWeight: 700 }}>
          ↑ Bergabung
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: '#BE123C', fontWeight: 700 }}>
          ↓ Lepas
        </span>
      </div>

      {/* ── SLIDER SUHU LARUTAN (0 s.d. −4 °C) ─────────────────────────── */}
      <div style={{
        marginTop: '0.85rem',
        padding: '0.75rem 1rem',
        background: '#F8FAFC',
        borderRadius: '10px',
        border: '1px solid #E2E8F0',
        width: '100%',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
          <label htmlFor="submicro-temp-slider" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>
            Suhu larutan:
          </label>
          <span style={{
            fontSize: '0.95rem',
            fontWeight: 800,
            color: temp < 0 ? '#0284C7' : '#0F172A',
            background: '#FFFFFF',
            padding: '0.15rem 0.55rem',
            borderRadius: '6px',
            border: '1px solid #CBD5E1',
          }}>
            {temp === 0 ? '0,00' : `−${formatIndonesianNumber(Math.abs(temp), 2)}`} °C
          </span>
        </div>

        <input
          id="submicro-temp-slider"
          type="range"
          min="-4"
          max="0"
          step="0.01"
          value={temp}
          onChange={(e) => setTemp(parseFloat(e.target.value))}
          style={{
            width: '100%',
            cursor: 'pointer',
            accentColor: '#0284C7',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginTop: '0.2rem' }}>
          <span>0,00 °C</span>
          <span style={{ color: '#0284C7', fontWeight: 700 }}>−1,86 °C (Titik Beku)</span>
          <span>−4,00 °C</span>
        </div>
      </div>

      {/* ── STATUS KESETIMBANGAN DINAMIS ─────────────────────────────────── */}
      <div style={{
        marginTop: '0.65rem',
        padding: '0.65rem 0.95rem',
        borderRadius: '8px',
        background: statusBg,
        border: `1.5px solid ${statusBorder}`,
        color: statusColor,
        fontSize: '0.88rem',
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: '0.55rem',
        lineHeight: 1.45,
        width: '100%',
      }}>
        <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{statusIcon}</span>
        <span>{statusText}</span>
      </div>

      {/* ── KOTAK ANALOGI KONSEPTUAL ───────────────────────────────────────── */}
      <div style={{
        marginTop: '0.85rem',
        background: '#F0FDF4',
        border: '1.5px solid #86EFAC',
        borderRadius: '10px',
        padding: '0.85rem 1.1rem',
        color: '#166534',
        fontSize: '0.88rem',
        lineHeight: 1.55,
        display: 'flex',
        gap: '0.65rem',
        alignItems: 'flex-start',
        boxShadow: '0 1px 4px rgba(22, 101, 52, 0.05)',
      }}>
        <span style={{ fontSize: '1.35rem', flexShrink: 0, marginTop: '0.05rem' }}>💡</span>
        <div>
          <strong style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.92rem', color: '#14532D' }}>
            Analogi Sederhana: "Pintu Masuk &amp; Keluar Minimarket"
          </strong>
          <span>
            Bayangkan kristal es seperti ruangan minimarket. Pada 0 °C, jumlah orang yang <em>masuk</em> (membeku) sama persis dengan yang <em>keluar</em> (mencair).
            Saat partikel urea datang dan <strong>menghalangi pintu</strong>, orang luar jadi sulit masuk (laju bergabung turun). Akibatnya orang di dalam lebih cepat habis keluar (es mencair).
            Agar seimbang kembali, suhu ruangan harus <strong>didinginkan di bawah 0 °C</strong> supaya orang di dalam berjalan lebih santai/lambat sehingga laju keluar berkurang dan seimbang lagi dengan laju masuk!
          </span>
        </div>
      </div>

    </div>
  );
}
