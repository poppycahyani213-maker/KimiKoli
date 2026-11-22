import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';
import { formatIndonesianNumber } from '../../utils/formatNumber';

// Helper kunci penyimpanan status simulasi Pipa U per siswa
export function getCh4PipaUKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch4_pipau_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch4_pipau_v1_guest';
}

// Suhu konstan 27 °C = 300 K, R = 0,082 L·atm/(mol·K)
const TEMP_K = 300;
const R_CONST = 0.082;
const FACTOR_RT = R_CONST * TEMP_K; // 24,6 atm / M

export default function SimulasiPipaU({ onReverseOsmosisAchieved, isReverseOsmosisDone }) {
  // Slider konsentrasi: awal kiri = 0 M (air murni), kanan = 0,5 M
  const [concLeft, setConcLeft] = useState(0.0);
  const [concRight, setConcRight] = useState(0.5);

  // Slider tekanan eksternal pada sisi pekat (0–30 atm)
  const [appliedPressure, setAppliedPressure] = useState(0);

  // Status apakah siswa sudah berhasil mencoba osmosis balik
  const [hasTestedReverseOsmosis, setHasTestedReverseOsmosis] = useState(() => {
    if (isReverseOsmosisDone) return true;
    const key = getCh4PipaUKey();
    const saved = getStoredData(key, null);
    return Boolean(saved?.reverseOsmosisTested);
  });

  // Animasi berkelanjutan via requestAnimationFrame untuk partikel air & glukosa
  const [tick, setTick] = useState(0);
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

  // Perhitungan Tekanan Osmotik (Π = M × R × T)
  const piLeft = concLeft * FACTOR_RT;
  const piRight = concRight * FACTOR_RT;

  // Menentukan sisi pekat & sisi encer
  const isRightPekat = concRight > concLeft;
  const isLeftPekat = concLeft > concRight;
  const isIsotonic = Math.abs(concRight - concLeft) < 0.001;

  const mPekat = isRightPekat ? concRight : concLeft;
  const mEncer = isRightPekat ? concLeft : concRight;
  const deltaPi = Math.abs(piRight - piLeft);

  // Status kesetimbangan dan osmosis berdasarkan tekanan yang diberikan
  // tekanan < selisih Π: Osmosis normal
  // tekanan ≈ selisih Π (±0,5 atm): Seimbang
  // tekanan > selisih Π: Osmosis balik
  let statusMode = 'osmosis'; // 'osmosis' | 'seimbang' | 'balik' | 'isotonik_awal'
  let statusText = '';
  let statusBg = '#F0F9FF';
  let statusBorder = '#BAE6FD';
  let statusColor = '#0369A1';
  let statusIcon = '💧';

  if (isIsotonic) {
    statusMode = 'isotonik_awal';
    statusText = 'Seimbang (isotonik): kedua sisi memiliki konsentrasi sama, tidak ada aliran netto air.';
    statusBg = '#ECFDF5';
    statusBorder = '#A7F3D0';
    statusColor = '#047857';
    statusIcon = '⚖️';
  } else {
    const diff = appliedPressure - deltaPi;
    if (diff < -0.5) {
      statusMode = 'osmosis';
      statusText = 'Osmosis: air masih mengalir ke sisi pekat.';
      statusBg = '#F0F9FF';
      statusBorder = '#BAE6FD';
      statusColor = '#0284C7';
      statusIcon = '💧';
    } else if (Math.abs(diff) <= 0.5) {
      statusMode = 'seimbang';
      statusText = 'Seimbang: tekanan yang diberikan = tekanan osmotik.';
      statusBg = '#ECFDF5';
      statusBorder = '#A7F3D0';
      statusColor = '#059669';
      statusIcon = '⚖️';
    } else {
      statusMode = 'balik';
      statusText = 'Osmosis balik! Air dipaksa mengalir ke sisi encer, seperti desalinasi.';
      statusBg = '#F5F3FF';
      statusBorder = '#DDD6FE';
      statusColor = '#6D28D9';
      statusIcon = '🚀';
    }
  }

  // Rekam pencapaian osmosis balik saat siswa mencapai status 'balik'
  useEffect(() => {
    if (statusMode === 'balik' && !hasTestedReverseOsmosis) {
      setHasTestedReverseOsmosis(true);
      const key = getCh4PipaUKey();
      setStoredData(key, { reverseOsmosisTested: true, lastTestedAt: new Date().toISOString() });
      if (onReverseOsmosisAchieved) {
        onReverseOsmosisAchieved();
      }
    }
  }, [statusMode, hasTestedReverseOsmosis, onReverseOsmosisAchieved]);

  // Perhitungan Ketinggian Cairan (y baseline = 110 px)
  // Base: 110 px. Net driving pressure = deltaPi - appliedPressure
  // Semakin besar deltaPi - appliedPressure, sisi pekat semakin tinggi (y semakin kecil)
  const baseY = 110;
  const netPressure = isIsotonic ? 0 : deltaPi - appliedPressure;
  // Batas perpindahan ketinggian maks ±45 px
  const maxDisplacement = 42;
  const displacement = Math.max(-maxDisplacement, Math.min(maxDisplacement, (netPressure / 24.6) * maxDisplacement));

  let yLeft = baseY;
  let yRight = baseY;

  if (isRightPekat) {
    yRight = baseY - displacement; // naik ke atas saat displacement positif
    yLeft = baseY + displacement;  // turun ke bawah
  } else if (isLeftPekat) {
    yLeft = baseY - displacement;
    yRight = baseY + displacement;
  }

  // Partikel Glukosa (titik oranye lebih besar, r = 5)
  // Deterministic generator untuk partikel glukosa
  const numGlucoseLeft = Math.round(concLeft * 22);
  const numGlucoseRight = Math.round(concRight * 22);

  const glucoseLeftParticles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 25; i++) {
      // Posisi acak di kolom kiri (x: 75..125, y: 130..250)
      const bx = 75 + ((i * 19) % 50);
      const by = 130 + ((i * 23) % 115);
      list.push({ bx, by, phase: i * 1.3 });
    }
    return list;
  }, []);

  const glucoseRightParticles = useMemo(() => {
    const list = [];
    for (let i = 0; i < 25; i++) {
      // Posisi acak di kolom kanan (x: 335..385, y: 130..250)
      const bx = 335 + ((i * 17) % 50);
      const by = 130 + ((i * 29) % 115);
      list.push({ bx, by, phase: i * 1.5 });
    }
    return list;
  }, []);

  // Air Partikel di Dasar Pipa yang Bergerak Menembus Membran (x = 230)
  // 10 partikel air khusus aliran membran
  const tSec = tick / 1000;
  // Arah aliran:
  // Jika osmosis normal ke kanan (isRightPekat): arah kiri -> kanan (+1)
  // Jika osmosis normal ke kiri (isLeftPekat): arah kanan -> kiri (-1)
  // Jika osmosis balik (isRightPekat): arah kanan -> kiri (-1)
  // Jika osmosis balik (isLeftPekat): arah kiri -> kanan (+1)
  // Jika seimbang/isotonik: kecepatan 0 atau osilasi kecil
  let flowDir = 0; // +1 = kiri ke kanan, -1 = kanan ke kiri, 0 = seimbang
  let flowSpeed = 28; // px per second

  if (statusMode === 'osmosis') {
    flowDir = isRightPekat ? 1 : -1;
    flowSpeed = 32;
  } else if (statusMode === 'balik') {
    flowDir = isRightPekat ? -1 : 1; // terbalik!
    flowSpeed = 40;
  } else {
    flowDir = 0;
    flowSpeed = 8;
  }

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1.5px solid #CBD5E1',
      borderRadius: '16px',
      padding: '1.4rem',
      marginTop: '2rem',
      boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
      fontFamily: "'Times New Roman', Times, serif"
    }}>

      {/* ── HEADER BAGIAN B ────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.8rem',
        borderBottom: '1px solid #E2E8F0',
        paddingBottom: '0.9rem',
        marginBottom: '1.25rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.35rem' }}>🧪</span>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
              Bagian B: Simulasi Pipa U &amp; Membran Semipermeabel
            </h3>
          </div>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem', color: '#64748B' }}>
            Pelajari perpindahan molekul air melintasi membran semipermeabel, tekanan osmotik (Π), serta fenomena osmosis balik (desalinasi).
          </p>
        </div>

        {/* Badge Misi Osmosis Balik */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.4rem 0.85rem',
          borderRadius: '999px',
          fontSize: '0.82rem',
          fontWeight: 700,
          background: hasTestedReverseOsmosis ? '#ECFDF5' : '#FFFBEB',
          border: `1.5px solid ${hasTestedReverseOsmosis ? '#86EFAC' : '#FDE68A'}`,
          color: hasTestedReverseOsmosis ? '#059669' : '#B45309'
        }}>
          <span>{hasTestedReverseOsmosis ? '✓' : '🎯'}</span>
          <span>
            {hasTestedReverseOsmosis ? 'Osmosis Balik Teruji' : 'Target: Coba Osmosis Balik'}
          </span>
        </div>
      </div>

      {/* ── GRID UTAMA: SVG PIPA U (Kiri) & KONTROL / KALKULASI (Kanan) ─── */}
      <div className="pipau-grid">

        {/* ── KOLOM 1: VISUALISASI SVG PIPA U REALISTIS ────────────────── */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '14px',
          border: '1px solid #E2E8F0',
          padding: '0.75rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Legenda Komponen di atas SVG */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.2rem',
            fontSize: '0.78rem',
            color: '#475569',
            marginBottom: '0.5rem',
            fontWeight: 700
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284C7', border: '1px solid #0369A1' }}></span>
              Air murni (pelarut)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '13px', height: '13px', borderRadius: '50%', background: '#F97316', border: '1.5px solid #C2410C' }}></span>
              Glukosa (terlarut)
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '14px', height: '0', borderTop: '2.5px dashed #64748B' }}></span>
              Membran semipermeabel
            </span>
          </div>

          {/* SVG PIPA U */}
          <svg
            viewBox="0 0 460 300"
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '310px' }}
          >
            <defs>
              {/* Gradien Cairan Air */}
              <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0.95" />
              </linearGradient>
              {/* Gradien Kaca Pipa U */}
              <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.5" />
                <stop offset="15%" stopColor="#FFFFFF" stopOpacity="0.1" />
                <stop offset="85%" stopColor="#FFFFFF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
              </linearGradient>
              {/* Gradien Piston Logam */}
              <linearGradient id="pistonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#64748B" />
                <stop offset="50%" stopColor="#94A3B8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>

            {/* Garis Ketinggian Awal / Baseline (Dashed) */}
            <line
              x1="55"
              y1={baseY}
              x2="405"
              y2={baseY}
              stroke="#94A3B8"
              strokeDasharray="3 3"
              strokeWidth="1.2"
            />
            <text x="230" y={baseY - 4} textAnchor="middle" fontSize="9" fill="#94A3B8" fontWeight="600">
              - - - Ketinggian awal seimbang - - -
            </text>

            {/* 1. CAIRAN CONTINUOUS DI DALAM PIPA U */}
            <path
              d={`
                M 60,${yLeft}
                L 140,${yLeft}
                L 140,210
                L 320,210
                L 320,${yRight}
                L 400,${yRight}
                L 400,270
                L 60,270
                Z
              `}
              fill="url(#liquidGrad)"
            />

            {/* Efek Meniskus Cairan di Permukaan Kiri & Kanan */}
            <ellipse cx="100" cy={yLeft} rx="40" ry="4" fill="#38BDF8" opacity="0.6" />
            <ellipse cx="360" cy={yRight} rx="40" ry="4" fill="#38BDF8" opacity="0.6" />

            {/* 2. DINDING TABUNG KACA PIPA U */}
            {/* Dinding Luar */}
            <path
              d="M 60,25 L 60,270 L 400,270 L 400,25"
              fill="none"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Dinding Dalam (Lengkungan Bawah Dalam) */}
            <path
              d="M 140,25 L 140,210 L 320,210 L 320,25"
              fill="none"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* 3. MEMBRAN SEMIPERMEABEL DI TENGAH BAWAH (x = 230) */}
            <line
              x1="230"
              y1="210"
              x2="230"
              y2="270"
              stroke="#334155"
              strokeDasharray="4 3"
              strokeWidth="3.5"
            />
            {/* Klem/Penyangga Membran */}
            <rect x="226" y="206" width="8" height="6" fill="#1E293B" rx="1" />
            <rect x="226" y="268" width="8" height="6" fill="#1E293B" rx="1" />

            {/* 4. PARTIKEL GLUKOSA (ORANYE BESAR, r = 5.5) */}
            {/* Sisi Kiri */}
            {glucoseLeftParticles.slice(0, numGlucoseLeft).map((p, idx) => {
              // Osilasi termal lembut
              const ox = Math.sin(tSec * 2 + p.phase) * 3;
              const oy = Math.cos(tSec * 2.5 + p.phase) * 3;
              const px = Math.min(133, Math.max(67, p.bx + ox));
              const py = Math.min(262, Math.max(yLeft + 8, p.by + oy));
              return (
                <g key={`g-left-${idx}`}>
                  <circle cx={px} cy={py} r="5.5" fill="#F97316" stroke="#C2410C" strokeWidth="1.2" />
                  <circle cx={px - 1.5} cy={py - 1.5} r="1.5" fill="#FED7AA" />
                </g>
              );
            })}

            {/* Sisi Kanan */}
            {glucoseRightParticles.slice(0, numGlucoseRight).map((p, idx) => {
              const ox = Math.sin(tSec * 2.2 + p.phase) * 3;
              const oy = Math.cos(tSec * 1.8 + p.phase) * 3;
              const px = Math.min(393, Math.max(327, p.bx + ox));
              const py = Math.min(262, Math.max(yRight + 8, p.by + oy));
              return (
                <g key={`g-right-${idx}`}>
                  <circle cx={px} cy={py} r="5.5" fill="#F97316" stroke="#C2410C" strokeWidth="1.2" />
                  <circle cx={px - 1.5} cy={py - 1.5} r="1.5" fill="#FED7AA" />
                </g>
              );
            })}

            {/* 5. PARTIKEL AIR MELINTASI MEMBRAN (Titik Biru Kecil, r = 2.5) */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              // Menghitung perpindahan x melintasi membran (x: 170 hingga 290)
              const offsetBase = (i * 15) % 120;
              let currentX = 230;
              if (flowDir !== 0) {
                const distanceTraveled = ((tSec * flowSpeed) + offsetBase) % 120;
                currentX = flowDir > 0
                  ? 170 + distanceTraveled      // Kiri ke kanan
                  : 290 - distanceTraveled;     // Kanan ke kiri
              } else {
                currentX = 180 + offsetBase + Math.sin(tSec * 2 + i) * 8;
              }
              const currentY = 222 + ((i * 5) % 38);

              return (
                <circle
                  key={`w-mem-${i}`}
                  cx={currentX}
                  cy={currentY}
                  r="2.6"
                  fill="#0284C7"
                  stroke="#0369A1"
                  strokeWidth="0.8"
                />
              );
            })}

            {/* Indikator Panah Aliran Air di Dekat Membran */}
            {flowDir !== 0 && (
              <g>
                <text
                  x={230}
                  y={196}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill={flowDir > 0 ? '#0284C7' : '#7C3AED'}
                >
                  {flowDir > 0 ? 'Aliran air: ➔' : 'Aliran balik: ⬅'}
                </text>
              </g>
            )}

            {/* 6. PISTON TEKANAN EKSTERNAL PADA SISI PEKAT */}
            {/* Ditampilkan di sisi yang lebih pekat jika ada selisih konsentrasi */}
            {!isIsotonic && (
              <g>
                {/* Posisi sisi kanan jika kanan pekat, atau sisi kiri jika kiri pekat */}
                {isRightPekat ? (
                  <>
                    {/* Kepala Piston di Permukaan Kanan */}
                    <rect
                      x="322"
                      y={yRight - 7}
                      width="76"
                      height="8"
                      rx="2"
                      fill="url(#pistonGrad)"
                      stroke="#1E293B"
                      strokeWidth="1.2"
                    />
                    {/* Batang Piston */}
                    <rect
                      x="356"
                      y={Math.max(15, yRight - 55)}
                      width="8"
                      height={Math.max(10, yRight - 7 - Math.max(15, yRight - 55))}
                      fill="#64748B"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    {/* Blok Beban / Penekan */}
                    <rect
                      x="332"
                      y={Math.max(8, yRight - 66)}
                      width="56"
                      height="14"
                      rx="3"
                      fill={appliedPressure > 0 ? '#DC2626' : '#475569'}
                      stroke="#1E293B"
                      strokeWidth="1"
                    />
                    <text
                      x="360"
                      y={Math.max(8, yRight - 66) + 10}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#FFFFFF"
                      fontWeight="bold"
                    >
                      P = {formatIndonesianNumber(appliedPressure, 1)} atm
                    </text>
                  </>
                ) : (
                  <>
                    {/* Kepala Piston di Permukaan Kiri */}
                    <rect
                      x="62"
                      y={yLeft - 7}
                      width="76"
                      height="8"
                      rx="2"
                      fill="url(#pistonGrad)"
                      stroke="#1E293B"
                      strokeWidth="1.2"
                    />
                    {/* Batang Piston */}
                    <rect
                      x="96"
                      y={Math.max(15, yLeft - 55)}
                      width="8"
                      height={Math.max(10, yLeft - 7 - Math.max(15, yLeft - 55))}
                      fill="#64748B"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    {/* Blok Beban / Penekan */}
                    <rect
                      x="72"
                      y={Math.max(8, yLeft - 66)}
                      width="56"
                      height="14"
                      rx="3"
                      fill={appliedPressure > 0 ? '#DC2626' : '#475569'}
                      stroke="#1E293B"
                      strokeWidth="1"
                    />
                    <text
                      x="100"
                      y={Math.max(8, yLeft - 66) + 10}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#FFFFFF"
                      fontWeight="bold"
                    >
                      P = {formatIndonesianNumber(appliedPressure, 1)} atm
                    </text>
                  </>
                )}
              </g>
            )}

            {/* Label Lengan Kiri & Lengan Kanan */}
            <text x="100" y="290" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0F172A">
              Lengan Kiri ({formatIndonesianNumber(concLeft, 2)} M)
            </text>
            <text x="360" y="290" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0F172A">
              Lengan Kanan ({formatIndonesianNumber(concRight, 2)} M)
            </text>
            <text x="230" y="285" textAnchor="middle" fontSize="9" fill="#64748B">
              Membran
            </text>
          </svg>

          {/* Nilai Tekanan Osmotik (Π) Masing-masing Lengan */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '0.4rem',
            padding: '0.35rem 0.6rem',
            background: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            fontSize: '0.84rem'
          }}>
            <div>
              <span style={{ color: '#64748B' }}>Π Kiri: </span>
              <strong style={{ color: '#0369A1' }}>{formatIndonesianNumber(piLeft, 2)} atm</strong>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Π Kanan: </span>
              <strong style={{ color: '#0369A1' }}>{formatIndonesianNumber(piRight, 2)} atm</strong>
            </div>
          </div>
        </div>

        {/* ── KOLOM 2: SLIDER KONSENTRASI, TEKANAN, & KALKULASI ─────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

          {/* Kotak Status Dinamis */}
          <div style={{
            background: statusBg,
            border: `1.5px solid ${statusBorder}`,
            borderRadius: '12px',
            padding: '0.75rem 0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem'
          }}>
            <span style={{ fontSize: '1.4rem' }}>{statusIcon}</span>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Status Sistem
              </div>
              <strong style={{ fontSize: '0.92rem', color: statusColor, display: 'block', lineHeight: 1.35 }}>
                {statusText}
              </strong>
            </div>
          </div>

          {/* Slider 1: Glukosa Kiri */}
          <div style={{
            background: '#F8FAFC',
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155' }}>
                Konsentrasi Glukosa Kiri:
              </label>
              <span style={{
                fontSize: '0.86rem',
                fontWeight: 800,
                color: '#0284C7',
                background: '#E0F2FE',
                padding: '0.1rem 0.5rem',
                borderRadius: '6px'
              }}>
                {formatIndonesianNumber(concLeft, 2)} M
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1.0"
              step="0.05"
              value={concLeft}
              onChange={(e) => setConcLeft(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#0284C7' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8' }}>
              <span>0,00 M (Air murni)</span>
              <span>1,00 M (Pekat)</span>
            </div>
          </div>

          {/* Slider 2: Glukosa Kanan */}
          <div style={{
            background: '#F8FAFC',
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            border: '1px solid #E2E8F0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155' }}>
                Konsentrasi Glukosa Kanan:
              </label>
              <span style={{
                fontSize: '0.86rem',
                fontWeight: 800,
                color: '#EA580C',
                background: '#FFEDD5',
                padding: '0.1rem 0.5rem',
                borderRadius: '6px'
              }}>
                {formatIndonesianNumber(concRight, 2)} M
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1.0"
              step="0.05"
              value={concRight}
              onChange={(e) => setConcRight(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#EA580C' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8' }}>
              <span>0,00 M (Air murni)</span>
              <span>1,00 M (Pekat)</span>
            </div>
          </div>

          {/* Slider 3: Tekanan Eksternal pada Sisi Pekat */}
          <div style={{
            background: '#FFF7ED',
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            border: '1.5px solid #FED7AA'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#9A3412' }}>
                Tekanan yang diberikan pada sisi pekat (P):
              </label>
              <span style={{
                fontSize: '0.86rem',
                fontWeight: 800,
                color: '#C2410C',
                background: '#FFEDD5',
                padding: '0.1rem 0.5rem',
                borderRadius: '6px',
                border: '1px solid #FDBA74'
              }}>
                {formatIndonesianNumber(appliedPressure, 1)} atm
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={appliedPressure}
              onChange={(e) => setAppliedPressure(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: '#EA580C' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#9A3412' }}>
              <span>0 atm (Spontan)</span>
              <span>15 atm</span>
              <span>30 atm (Osmosis Balik)</span>
            </div>
          </div>

          {/* Kotak Perhitungan Matematika / Kimia */}
          <div style={{
            background: '#F1F5F9',
            borderRadius: '10px',
            padding: '0.75rem 0.9rem',
            border: '1px solid #CBD5E1',
            fontSize: '0.84rem'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
              📐 RUMUS &amp; BARIS PERHITUNGAN (pada 27 °C / 300 K):
            </div>
            <div style={{
              fontFamily: "'Courier New', Courier, monospace",
              background: '#FFFFFF',
              padding: '0.45rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid #E2E8F0',
              color: '#0F172A',
              fontSize: '0.85rem',
              fontWeight: 700
            }}>
              ΔΠ = ({formatIndonesianNumber(mPekat, 2)} − {formatIndonesianNumber(mEncer, 2)}) × 0,082 × 300 = {formatIndonesianNumber(deltaPi, 2)} atm
            </div>
            <div style={{ marginTop: '0.35rem', fontSize: '0.74rem', color: '#64748B', lineHeight: 1.35 }}>
              *Keterangan: Tekanan osmotik netto (ΔΠ) adalah gaya dorong alami molekul air. Jika P luar &gt; ΔΠ, terjadi <strong>osmosis balik</strong>.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
