import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { formatIndonesianNumber } from '../../utils/formatNumber';

/**
 * Komponen KontrasDidihBeku
 *
 * Menghubungkan Bab 2 (Kenaikan Titik Didih) dan Bab 3 (Penurunan Titik Beku):
 * 1. Dua termometer SVG realistis berdampingan (skala simetris di sekitar patokan air murni di tengah).
 * 2. Slider molalitas urea 0–3 m dengan animasi halus dan panah tebal 5px berlabel pil.
 * 3. Ringkasan satu baris rentang fase cair.
 * 4. Tabel kontras komparatif dua kolom (Titik Didih vs Titik Beku).
 * 5. Kotak penutup "Satu zat, dua manfaat" (etilen glikol pada radiator mobil).
 */
export default function KontrasDidihBeku() {
  const [molality, setMolality] = useState(1.0);

  // Tetapan sifat koligatif air
  const Kb = 0.52; // °C/m
  const Kf = 1.86; // °C/m

  // Urea adalah nonelektrolit (i = 1)
  const deltaTb = Kb * molality;
  const Tb = 100 + deltaTb;

  const deltaTf = Kf * molality;
  const Tf = 0 - deltaTf;

  const liquidRange = Tb - Tf;

  const formatTf = (val) => {
    if (Math.abs(val) < 0.001) return '0,00';
    if (val < 0) return `−${formatIndonesianNumber(Math.abs(val), 2)}`;
    return formatIndonesianNumber(val, 2);
  };

  // -------------------------------------------------------------
  // Perhitungan Koordinat Skala Termometer SVG (Simetris di Tengah)
  // Patokan di tengah y = 112 (Rentang skala y: 32 s.d. 192, tinggi = 160px)
  // -------------------------------------------------------------
  const yCenter = 112;
  const yTop = 32;
  const yBottom = 192;

  // Termometer Kiri (Didih): 98,4 – 101,6 °C (Tengah 100,0 °C, Rentang 3,2 °C)
  const boilMin = 98.4;
  const boilMax = 101.6;
  const getBoilY = (temp) => {
    const clamped = Math.max(boilMin, Math.min(boilMax, temp));
    return yBottom - ((clamped - boilMin) / (boilMax - boilMin)) * (yBottom - yTop);
  };

  // Termometer Kanan (Beku): −6,0 s.d. +6,0 °C (Tengah 0,0 °C, Rentang 12,0 °C)
  const freezeMin = -6.0;
  const freezeMax = 6.0;
  const getFreezeY = (temp) => {
    const clamped = Math.max(freezeMin, Math.min(freezeMax, temp));
    return yBottom - ((clamped - freezeMin) / (freezeMax - freezeMin)) * (yBottom - yTop);
  };

  const yTb = getBoilY(Tb);
  const yTf = getFreezeY(Tf);

  // Ticks Skala
  const boilMajorTicks = [98.5, 99.0, 99.5, 100.0, 100.5, 101.0, 101.5];
  const boilMinorTicks = [];
  for (let t = 98.4; t <= 101.65; t += 0.1) {
    const rounded = Math.round(t * 10) / 10;
    if (Math.abs((rounded * 10) % 5) !== 0) {
      boilMinorTicks.push(rounded);
    }
  }

  const freezeMajorTicks = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6];
  const freezeMinorTicks = [-5.5, -4.5, -3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5, 4.5, 5.5];

  // Posisi Y Pill Label di Samping Panah
  const pillYBoil = Math.min(yCenter - 22, Math.max(yTop, (yCenter + yTb) / 2 - 10));
  const pillYFreeze = Math.max(yCenter + 2, Math.min(yBottom - 18, (yCenter + yTf) / 2 - 10));

  return (
    <div style={{ marginBottom: '2rem', fontFamily: "'Times New Roman', Times, serif" }}>
      {/* 1. CARD SIMULASI TERMORETIS KOMPAK (MAX-HEIGHT 75vh) */}
      <Card
        className="compact-sim-card"
        title="Simulasi Rentang Fase Cair (Didih vs Beku)"
        subtitle="Amati pergeseran simetris titik didih (naik) dan titik beku (turun) saat konsentrasi larutan urea diubah."
      >
        {/* Slider Pengatur Molalitas (Kompak & Elegan) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '0.45rem 0.85rem',
          marginBottom: '0.65rem',
          flexWrap: 'wrap'
        }}>
          <label htmlFor="molality-slider" style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
            Molalitas Urea (Nonelektrolit, i = 1):
          </label>
          <input
            id="molality-slider"
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={molality}
            onChange={(e) => setMolality(parseFloat(e.target.value))}
            style={{ flex: 1, minWidth: '140px', cursor: 'pointer', accentColor: '#0284C7' }}
          />
          <span style={{
            background: '#0284C7',
            color: '#FFFFFF',
            padding: '0.2rem 0.65rem',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.88rem'
          }}>
            m = {formatIndonesianNumber(molality, 1)} m
          </span>
        </div>

        {/* Dua Termometer SVG Realistis Berdampingan di Layar Lebar */}
        <div className="thermo-grid-dual">
          {/* Termometer Kiri: Titik Didih (Bab 2) */}
          <div style={{
            background: 'linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 100%)',
            border: '1.5px solid #FDBA74',
            borderRadius: '12px',
            padding: '0.5rem 0.75rem',
            boxShadow: '0 2px 6px rgba(234, 88, 12, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#9A3412', textTransform: 'uppercase' }}>
                🔥 Titik Didih (Bab 2)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#EA580C' }}>
                Tb = {formatIndonesianNumber(Tb, 2)} °C
              </span>
            </div>

            <svg viewBox="0 0 340 236" style={{ width: '100%', maxHeight: '200px', display: 'block' }}>
              <defs>
                <linearGradient id="boilGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#EA580C" />
                  <stop offset="60%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#DC2626" />
                </linearGradient>
                <linearGradient id="glassReflection" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
                </linearGradient>
              </defs>

              {/* Teks Kecil Samar: di atas / di bawah patokan */}
              <text x="145" y="24" fontSize="8.5" fill="#94A3B8" fontStyle="italic" fontFamily="Times New Roman, serif">
                ▲ di atas patokan
              </text>
              <text x="145" y="206" fontSize="8.5" fill="#94A3B8" fontStyle="italic" fontFamily="Times New Roman, serif">
                ▼ di bawah patokan
              </text>

              {/* Skala Minor Ticks (Langkah 0,1 °C) */}
              {boilMinorTicks.map((t) => {
                const y = getBoilY(t);
                return (
                  <line
                    key={`b-min-${t}`}
                    x1="49"
                    y1={y}
                    x2="55"
                    y2={y}
                    stroke="#CBD5E1"
                    strokeWidth="0.8"
                  />
                );
              })}

              {/* Skala Major Ticks & Label (Langkah 0,5 °C) */}
              {boilMajorTicks.map((t) => {
                const y = getBoilY(t);
                const isBase = t === 100.0;
                return (
                  <g key={`b-maj-${t}`}>
                    <line
                      x1={isBase ? "40" : "44"}
                      y1={y}
                      x2="56"
                      y2={y}
                      stroke={isBase ? "#0F172A" : "#64748B"}
                      strokeWidth={isBase ? "1.8" : "1.2"}
                    />
                    <text
                      x="39"
                      y={y + 3.5}
                      textAnchor="end"
                      fontSize="9"
                      fontWeight={isBase ? "800" : "500"}
                      fill={isBase ? "#0F172A" : "#64748B"}
                      fontFamily="Times New Roman, serif"
                    >
                      {formatIndonesianNumber(t, 1)}
                    </text>
                  </g>
                );
              })}

              {/* Garis Patokan di Tengah (Air Murni 100 °C) */}
              <line
                x1="58"
                y1={yCenter}
                x2="295"
                y2={yCenter}
                stroke="#475569"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
              <text x="145" y={yCenter - 6} fontSize="9.5" fontWeight="700" fill="#334155" fontFamily="Times New Roman, serif">
                patokan: air murni 100 °C
              </text>

              {/* Badan Kaca Termometer Realistis */}
              <rect x="58" y="16" width="16" height="186" rx="8" fill="rgba(241, 245, 249, 0.7)" stroke="#94A3B8" strokeWidth="1.5" />
              <circle cx="66" cy="208" r="16" fill="rgba(241, 245, 249, 0.7)" stroke="#94A3B8" strokeWidth="1.5" />

              {/* Cairan Didih (Oranye-Merah dengan Animasi Transisi Halus) */}
              <circle cx="66" cy="208" r="13" fill="url(#boilGrad)" />
              <rect
                x="61"
                y={yTb}
                width="10"
                height={Math.max(0, 208 - yTb)}
                rx="3"
                fill="url(#boilGrad)"
                style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />

              {/* Kilau Kaca Tipis di Sisi Kiri Tabung */}
              <line x1="60" y1="20" x2="60" y2="198" stroke="url(#glassReflection)" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 56 202 A 11 11 0 0 1 66 197" stroke="rgba(255,255,255,0.8)" strokeWidth="1.6" fill="none" strokeLinecap="round" />

              {/* Posisi Titik Didih Larutan & Panah Naik (Hanya Muncul Jika m > 0) */}
              {molality > 0 && (
                <g style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  {/* Garis Horizontal Larutan */}
                  <line
                    x1="66"
                    y1={yTb}
                    x2="275"
                    y2={yTb}
                    stroke="#EA580C"
                    strokeWidth="2"
                    style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                  <text
                    x="280"
                    y={yTb + 3.5}
                    fontSize="11"
                    fontWeight="800"
                    fill="#EA580C"
                    fontFamily="Times New Roman, serif"
                    style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    {formatIndonesianNumber(Tb, 2)} °C
                  </text>

                  {/* Panah Tebal 5px dengan Kepala Segitiga */}
                  <line
                    x1="108"
                    y1={yCenter}
                    x2="108"
                    y2={yTb + 8}
                    stroke="#EA580C"
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                  <polygon
                    points={`108,${yTb} 102,${yTb + 9} 114,${yTb + 9}`}
                    fill="#EA580C"
                    style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />

                  {/* Label Berbentuk Pil Berwarna di Samping Panah */}
                  <g style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <rect
                      x="118"
                      y={pillYBoil}
                      width="80"
                      height="20"
                      rx="10"
                      fill="#FFF7ED"
                      stroke="#F97316"
                      strokeWidth="1.2"
                    />
                    <text
                      x="158"
                      y={pillYBoil + 14}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill="#C2410C"
                      fontFamily="Times New Roman, serif"
                    >
                      naik {formatIndonesianNumber(deltaTb, 2)} °C
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>

          {/* Termometer Kanan: Titik Beku (Bab 3) */}
          <div style={{
            background: 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)',
            border: '1.5px solid #7DD3FC',
            borderRadius: '12px',
            padding: '0.5rem 0.75rem',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.05)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#075985', textTransform: 'uppercase' }}>
                ❄️ Titik Beku (Bab 3)
              </span>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0284C7' }}>
                Tf = {formatTf(Tf)} °C
              </span>
            </div>

            <svg viewBox="0 0 340 236" style={{ width: '100%', maxHeight: '200px', display: 'block' }}>
              <defs>
                <linearGradient id="freezeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="60%" stopColor="#0284C7" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
              </defs>

              {/* Teks Kecil Samar: di atas / di bawah patokan */}
              <text x="145" y="24" fontSize="8.5" fill="#94A3B8" fontStyle="italic" fontFamily="Times New Roman, serif">
                ▲ di atas patokan
              </text>
              <text x="145" y="206" fontSize="8.5" fill="#94A3B8" fontStyle="italic" fontFamily="Times New Roman, serif">
                ▼ di bawah patokan
              </text>

              {/* Skala Minor Ticks (Langkah 0,5 °C) */}
              {freezeMinorTicks.map((t) => {
                const y = getFreezeY(t);
                return (
                  <line
                    key={`f-min-${t}`}
                    x1="49"
                    y1={y}
                    x2="55"
                    y2={y}
                    stroke="#CBD5E1"
                    strokeWidth="0.8"
                  />
                );
              })}

              {/* Skala Major Ticks & Label (Langkah 1 °C) */}
              {freezeMajorTicks.map((t) => {
                const y = getFreezeY(t);
                const isBase = t === 0;
                let labelText = `${t}`;
                if (t > 0) labelText = `+${t}`;
                else if (t < 0) labelText = `−${Math.abs(t)}`;

                return (
                  <g key={`f-maj-${t}`}>
                    <line
                      x1={isBase ? "40" : "44"}
                      y1={y}
                      x2="56"
                      y2={y}
                      stroke={isBase ? "#0F172A" : "#64748B"}
                      strokeWidth={isBase ? "1.8" : "1.2"}
                    />
                    <text
                      x="39"
                      y={y + 3.5}
                      textAnchor="end"
                      fontSize="9"
                      fontWeight={isBase ? "800" : "500"}
                      fill={isBase ? "#0F172A" : "#64748B"}
                      fontFamily="Times New Roman, serif"
                    >
                      {labelText}
                    </text>
                  </g>
                );
              })}

              {/* Garis Patokan di Tengah (Air Murni 0 °C) */}
              <line
                x1="58"
                y1={yCenter}
                x2="295"
                y2={yCenter}
                stroke="#475569"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
              <text x="145" y={yCenter - 6} fontSize="9.5" fontWeight="700" fill="#334155" fontFamily="Times New Roman, serif">
                patokan: air murni 0 °C
              </text>

              {/* Badan Kaca Termometer Realistis */}
              <rect x="58" y="16" width="16" height="186" rx="8" fill="rgba(241, 245, 249, 0.7)" stroke="#94A3B8" strokeWidth="1.5" />
              <circle cx="66" cy="208" r="16" fill="rgba(241, 245, 249, 0.7)" stroke="#94A3B8" strokeWidth="1.5" />

              {/* Cairan Beku (Biru dengan Animasi Transisi Halus) */}
              <circle cx="66" cy="208" r="13" fill="url(#freezeGrad)" />
              <rect
                x="61"
                y={yTf}
                width="10"
                height={Math.max(0, 208 - yTf)}
                rx="3"
                fill="url(#freezeGrad)"
                style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />

              {/* Kilau Kaca Tipis di Sisi Kiri Tabung */}
              <line x1="60" y1="20" x2="60" y2="198" stroke="url(#glassReflection)" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M 56 202 A 11 11 0 0 1 66 197" stroke="rgba(255,255,255,0.8)" strokeWidth="1.6" fill="none" strokeLinecap="round" />

              {/* Posisi Titik Beku Larutan & Panah Turun (Hanya Muncul Jika m > 0) */}
              {molality > 0 && (
                <g style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  {/* Garis Horizontal Larutan */}
                  <line
                    x1="66"
                    y1={yTf}
                    x2="275"
                    y2={yTf}
                    stroke="#0284C7"
                    strokeWidth="2"
                    style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                  <text
                    x="280"
                    y={yTf + 3.5}
                    fontSize="11"
                    fontWeight="800"
                    fill="#0284C7"
                    fontFamily="Times New Roman, serif"
                    style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  >
                    {formatTf(Tf)} °C
                  </text>

                  {/* Panah Tebal 5px dengan Kepala Segitiga */}
                  <line
                    x1="108"
                    y1={yCenter}
                    x2="108"
                    y2={yTf - 8}
                    stroke="#0284C7"
                    strokeWidth="5"
                    strokeLinecap="round"
                    style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />
                  <polygon
                    points={`108,${yTf} 102,${yTf - 9} 114,${yTf - 9}`}
                    fill="#0284C7"
                    style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}
                  />

                  {/* Label Berbentuk Pil Berwarna di Samping Panah */}
                  <g style={{ transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                    <rect
                      x="118"
                      y={pillYFreeze}
                      width="84"
                      height="20"
                      rx="10"
                      fill="#F0F9FF"
                      stroke="#0284C7"
                      strokeWidth="1.2"
                    />
                    <text
                      x="160"
                      y={pillYFreeze + 14}
                      textAnchor="middle"
                      fontSize="9.5"
                      fontWeight="800"
                      fill="#0369A1"
                      fontFamily="Times New Roman, serif"
                    >
                      turun {formatIndonesianNumber(deltaTf, 2)} °C
                    </text>
                  </g>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Ringkasan Satu Baris di Bawah */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          borderRadius: '10px',
          padding: '0.45rem 1rem',
          textAlign: 'center',
          fontSize: '0.92rem',
          color: '#0F172A',
          fontWeight: 700
        }}>
          Rentang fase cair: <span style={{ color: '#0284C7' }}>{formatTf(Tf)} °C</span> sampai{' '}
          <span style={{ color: '#EA580C' }}>{formatIndonesianNumber(Tb, 2)} °C</span>{' '}
          (lebar <span style={{ color: '#059669' }}>{formatIndonesianNumber(liquidRange, 2)} °C</span>)
        </div>
      </Card>

      {/* 3. TABEL KONTRAS DUA KOLOM: DIDIH (BAB 2) VS BEKU (BAB 3) */}
      <div style={{ marginTop: '1.5rem' }}>
        <Card
          title="Tabel Kontras: Titik Didih (Bab 2) vs Titik Beku (Bab 3)"
          subtitle="Rangkuman komparatif sifat koligatif fase cair air pada suhu tinggi vs suhu rendah"
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '0.95rem'
            }}>
              <thead>
                <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ padding: '0.85rem 1rem', width: '22%', color: '#0F172A', fontWeight: 800 }}>
                    Parameter / Aspek
                  </th>
                  <th style={{ padding: '0.85rem 1rem', width: '39%', color: '#C2410C', background: '#FFEDD5', fontWeight: 800 }}>
                    🔥 Titik Didih (Bab 2)
                  </th>
                  <th style={{ padding: '0.85rem 1rem', width: '39%', color: '#0369A1', background: '#E0F2FE', fontWeight: 800 }}>
                    ❄️ Titik Beku (Bab 3)
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Baris 1: Arah Perubahan */}
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>
                    Arah Perubahan
                  </td>
                  <td style={{ padding: '0.85rem 1rem', background: '#FFF7ED', color: '#9A3412', fontWeight: 700 }}>
                    Naik di atas 100 °C (Tb &gt; 100 °C)
                  </td>
                  <td style={{ padding: '0.85rem 1rem', background: '#F0F9FF', color: '#075985', fontWeight: 700 }}>
                    Turun di bawah 0 °C (Tf &lt; 0 °C)
                  </td>
                </tr>

                {/* Baris 2: Rumus */}
                <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#FAFAFA' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>
                    Rumus Perhitungan
                  </td>
                  <td style={{ padding: '0.85rem 1rem', background: '#FFF7ED' }}>
                    <div><strong>ΔTb = Kb × m × i</strong></div>
                    <div style={{ color: '#C2410C', fontSize: '0.9rem', marginTop: '0.15rem' }}>Tb = 100 + ΔTb</div>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', background: '#F0F9FF' }}>
                    <div><strong>ΔTf = Kf × m × i</strong></div>
                    <div style={{ color: '#0369A1', fontSize: '0.9rem', marginTop: '0.15rem' }}>Tf = 0 − ΔTf</div>
                  </td>
                </tr>

                {/* Baris 3: Tetapan Air */}
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>
                    Tetapan Pelarut Air
                  </td>
                  <td style={{ padding: '0.85rem 1rem', background: '#FFF7ED' }}>
                    <span style={{ background: '#FED7AA', color: '#9A3412', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700 }}>
                      Kb = 0,52 °C/m
                    </span>
                  </td>
                  <td style={{ padding: '0.85rem 1rem', background: '#F0F9FF' }}>
                    <span style={{ background: '#BAE6FD', color: '#0369A1', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700 }}>
                      Kf = 1,86 °C/m
                    </span>
                    <span style={{ fontSize: '0.82rem', color: '#0369A1', marginLeft: '0.4rem' }}>(efek 3,5× lebih besar)</span>
                  </td>
                </tr>

                {/* Baris 4: Contoh Urea 1 m */}
                <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#FAFAFA' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>
                    Contoh Urea 1 m
                  </td>
                  <td style={{ padding: '0.85rem 1rem', background: '#FFF7ED', fontWeight: 700, color: '#EA580C' }}>
                    Tb = 100,52 °C
                  </td>
                  <td style={{ padding: '0.85rem 1rem', background: '#F0F9FF', fontWeight: 700, color: '#0284C7' }}>
                    Tf = −1,86 °C
                  </td>
                </tr>

                {/* Baris 5: Penyebab Level Partikel */}
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>
                    Penyebab Level Partikel
                  </td>
                  <td style={{ padding: '0.85rem 1rem', background: '#FFF7ED', color: '#431407', lineHeight: 1.55 }}>
                    Tekanan uap larutan turun, jadi perlu suhu lebih tinggi agar tekanan uapnya sama dengan tekanan udara luar.
                  </td>
                  <td style={{ padding: '0.85rem 1rem', background: '#F0F9FF', color: '#082F49', lineHeight: 1.55 }}>
                    Zat terlarut mengurangi molekul air yang bisa bergabung ke kristal es, jadi kesetimbangan padat–cair baru tercapai di suhu lebih rendah.
                  </td>
                </tr>

                {/* Baris 6: Konteks Kehidupan Nyata */}
                <tr>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>
                    Konteks Nyata
                  </td>
                  <td style={{ padding: '0.85rem 1rem', background: '#FFF7ED', color: '#7C2D12' }}>
                    Air radiator tidak cepat mendidih saat mesin panas, masakan berkuah garam mendidih pada suhu lebih tinggi sehingga lebih cepat matang.
                  </td>
                  <td style={{ padding: '0.85rem 1rem', background: '#F0F9FF', color: '#0C4A6E' }}>
                    Pembuatan es puter tradisional dengan es batu + garam kasar, penaburan garam di jalan raya bersalju agar es mencair.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 4. KOTAK PENUTUP: SATU ZAT, DUA MANFAAT */}
      <div style={{
        marginTop: '1.5rem',
        background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 50%, #E0F2FE 100%)',
        border: '1.5px solid #86EFAC',
        borderRadius: '16px',
        padding: '1.25rem 1.5rem',
        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🚗</span>
          <h4 style={{
            margin: 0,
            fontSize: '1.15rem',
            fontWeight: 800,
            color: '#065F46'
          }}>
            Satu Zat, Dua Manfaat
          </h4>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            background: '#10B981',
            color: '#FFFFFF',
            padding: '0.2rem 0.55rem',
            borderRadius: '12px'
          }}>
            Aplikasi Terpadu Bab 2 & Bab 3
          </span>
        </div>

        <p style={{
          margin: 0,
          fontSize: '0.98rem',
          color: '#166534',
          lineHeight: 1.65
        }}>
          Cairan antibeku radiator (<strong>etilen glikol</strong>) mencegah air radiator membeku di musim dingin sekaligus mencegahnya mendidih saat mesin panas. Satu zat terlarut yang sama bekerja memperluas rentang fase cair pelarut air ke dua arah secara serempak!
        </p>
      </div>
    </div>
  );
}
