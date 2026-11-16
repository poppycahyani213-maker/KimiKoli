import React, { useState } from 'react';
import Card from '../../components/common/Card';
import { formatIndonesianNumber } from '../../utils/formatNumber';

/**
 * Komponen KontrasDidihBeku
 *
 * Menghubungkan Bab 2 (Kenaikan Titik Didih) dan Bab 3 (Penurunan Titik Beku):
 * 1. Dua termometer SVG interaktif berdampingan dengan slider molalitas urea (0–3 m).
 * 2. Tiga kotak ringkasan angka (Tb, Tf, rentang fase cair Tb - Tf) & baris perhitungan.
 * 3. Tabel kontras komparatif dua kolom (Titik Didih vs Titik Beku).
 * 4. Kotak penutup "Satu zat, dua manfaat" (etilen glikol pada radiator mobil).
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

  // -------------------------------------------------------------
  // Perhitungan Koordinat Skala Termometer SVG
  // -------------------------------------------------------------
  // Skala Termometer Didih: 99.5°C s.d. 102.0°C (Rentang = 2.5°C)
  const boilMin = 99.5;
  const boilMax = 102.0;
  const boilYTop = 50;
  const boilYBottom = 260;

  const getBoilY = (temp) => {
    const clamped = Math.max(boilMin, Math.min(boilMax, temp));
    return boilYBottom - ((clamped - boilMin) / (boilMax - boilMin)) * (boilYBottom - boilYTop);
  };

  // Skala Termometer Beku: -6.0°C s.d. 1.0°C (Rentang = 7.0°C)
  const freezeMin = -6.0;
  const freezeMax = 1.0;
  const freezeYTop = 50;
  const freezeYBottom = 260;

  const getFreezeY = (temp) => {
    const clamped = Math.max(freezeMin, Math.min(freezeMax, temp));
    return freezeYBottom - ((clamped - freezeMin) / (freezeMax - freezeMin)) * (freezeYBottom - freezeYTop);
  };

  const yBoilWater = getBoilY(100.0);
  const yBoilSolution = getBoilY(Tb);

  const yFreezeWater = getFreezeY(0.0);
  const yFreezeSolution = getFreezeY(Tf);

  return (
    <div style={{ marginBottom: '2rem', fontFamily: "'Times New Roman', Times, serif" }}>
      {/* 1. CARD SIMULASI TERMORETIS BERDAMPINGAN DENGAN SLIDER */}
      <Card
        title="Simulasi Kontras: Termometer Titik Didih (Bab 2) vs Titik Beku (Bab 3)"
        subtitle="Geser konsentrasi molalitas urea untuk mengamati bagaimana fase cair melebar ke atas dan ke bawah secara bersamaan."
      >
        {/* Slider Pengatur Molalitas */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '12px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.5rem',
            marginBottom: '0.5rem'
          }}>
            <label htmlFor="molality-slider" style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>
              Konsentrasi Molalitas Urea (Nonelektrolit, i = 1):
            </label>
            <span style={{
              background: '#0284C7',
              color: '#FFFFFF',
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontWeight: 800,
              fontSize: '1rem'
            }}>
              m = {formatIndonesianNumber(molality, 1)} m
            </span>
          </div>

          <input
            id="molality-slider"
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={molality}
            onChange={(e) => setMolality(parseFloat(e.target.value))}
            style={{ width: '100%', cursor: 'pointer', accentColor: '#0284C7' }}
          />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: '#64748B',
            marginTop: '0.25rem'
          }}>
            <span>0 m (Air Murni)</span>
            <span>1,0 m</span>
            <span>2,0 m</span>
            <span>3,0 m (Pekat)</span>
          </div>
        </div>

        {/* Baris Dua Termometer SVG Berdampingan */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          {/* Termometer Kiri: Titik Didih (Bab 2) */}
          <div style={{
            background: 'linear-gradient(180deg, #FFF7ED 0%, #FFFFFF 100%)',
            border: '1.5px solid #FDBA74',
            borderRadius: '14px',
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(234, 88, 12, 0.06)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#C2410C',
                background: '#FFEDD5',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px'
              }}>
                BAB 2 · KENAIKAN TITIK DIDIH
              </span>
              <h4 style={{ margin: '0.35rem 0 0', color: '#9A3412', fontSize: '1.1rem', fontWeight: 800 }}>
                Titik Didih (Skala 99,5 – 102 °C)
              </h4>
            </div>

            <svg viewBox="0 0 310 320" style={{ width: '100%', height: 'auto', display: 'block' }}>
              <defs>
                <linearGradient id="boilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EA580C" />
                  <stop offset="100%" stopColor="#FB923C" />
                </linearGradient>
                <marker
                  id="arrowBoilUp"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="3"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 6 L 5 0 L 10 6 z" fill="#DC2626" />
                </marker>
              </defs>

              {/* Skala & Angka Penggaris */}
              {[99.5, 100.0, 100.5, 101.0, 101.5, 102.0].map((t) => {
                const y = getBoilY(t);
                const isBase = t === 100.0;
                return (
                  <g key={`boil-scale-${t}`}>
                    <line
                      x1={isBase ? "40" : "50"}
                      y1={y}
                      x2="70"
                      y2={y}
                      stroke={isBase ? "#0F172A" : "#94A3B8"}
                      strokeWidth={isBase ? "2" : "1"}
                    />
                    <text
                      x="35"
                      y={y + 4}
                      textAnchor="end"
                      fontSize="11"
                      fontWeight={isBase ? "700" : "500"}
                      fill={isBase ? "#0F172A" : "#64748B"}
                      fontFamily="Times New Roman, serif"
                    >
                      {formatIndonesianNumber(t, 1)}°
                    </text>
                  </g>
                );
              })}

              {/* Badan Tabung Termometer Kaca Luar */}
              <rect x="70" y="40" width="22" height="230" rx="11" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="81" cy="275" r="22" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />

              {/* Cairan Termometer di Dalam */}
              <circle cx="81" cy="275" r="18" fill="url(#boilGrad)" />
              <rect
                x="74"
                y={yBoilSolution}
                width="14"
                height={275 - yBoilSolution}
                fill="url(#boilGrad)"
                rx="4"
              />

              {/* Garis Putus-putus Air Murni (100°C) */}
              <line
                x1="70"
                y1={yBoilWater}
                x2="225"
                y2={yBoilWater}
                stroke="#64748B"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text x="230" y={yBoilWater + 4} fontSize="11" fill="#475569" fontWeight="600" fontFamily="Times New Roman, serif">
                100,00 °C (Air)
              </text>

              {/* Garis Merah/Oranye Larutan */}
              <line
                x1="70"
                y1={yBoilSolution}
                x2="225"
                y2={yBoilSolution}
                stroke="#DC2626"
                strokeWidth="2.5"
              />
              <text x="230" y={yBoilSolution + 4} fontSize="12" fill="#DC2626" fontWeight="800" fontFamily="Times New Roman, serif">
                {formatIndonesianNumber(Tb, 2)} °C
              </text>

              {/* Panah Indikator Kenaikan (Naik x °C) */}
              {deltaTb > 0.01 ? (
                <g>
                  <line
                    x1="165"
                    y1={yBoilWater - 2}
                    x2="165"
                    y2={yBoilSolution + 6}
                    stroke="#DC2626"
                    strokeWidth="2"
                    markerEnd="url(#arrowBoilUp)"
                  />
                  <rect
                    x="172"
                    y={(yBoilWater + yBoilSolution) / 2 - 10}
                    width="54"
                    height="18"
                    rx="4"
                    fill="#FEF2F2"
                    stroke="#FCA5A5"
                    strokeWidth="1"
                  />
                  <text
                    x="199"
                    y={(yBoilWater + yBoilSolution) / 2 + 3}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="800"
                    fill="#DC2626"
                    fontFamily="Times New Roman, serif"
                  >
                    naik {formatIndonesianNumber(deltaTb, 2)} °C
                  </text>
                </g>
              ) : (
                <text x="160" y={yBoilWater - 8} fontSize="11" fill="#64748B" fontStyle="italic" fontFamily="Times New Roman, serif">
                  (belum naik)
                </text>
              )}
            </svg>
          </div>

          {/* Termometer Kanan: Titik Beku (Bab 3) */}
          <div style={{
            background: 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)',
            border: '1.5px solid #7DD3FC',
            borderRadius: '14px',
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.06)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#0369A1',
                background: '#E0F2FE',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px'
              }}>
                BAB 3 · PENURUNAN TITIK BEKU
              </span>
              <h4 style={{ margin: '0.35rem 0 0', color: '#075985', fontSize: '1.1rem', fontWeight: 800 }}>
                Titik Beku (Skala −6 s.d. 1 °C)
              </h4>
            </div>

            <svg viewBox="0 0 310 320" style={{ width: '100%', height: 'auto', display: 'block' }}>
              <defs>
                <linearGradient id="freezeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#0284C7" />
                </linearGradient>
                <marker
                  id="arrowFreezeDown"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="7"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 0 L 5 6 L 10 0 z" fill="#0284C7" />
                </marker>
              </defs>

              {/* Skala & Angka Penggaris */}
              {[1.0, 0.0, -1.0, -2.0, -3.0, -4.0, -5.0, -6.0].map((t) => {
                const y = getFreezeY(t);
                const isBase = t === 0.0;
                return (
                  <g key={`freeze-scale-${t}`}>
                    <line
                      x1={isBase ? "40" : "50"}
                      y1={y}
                      x2="70"
                      y2={y}
                      stroke={isBase ? "#0F172A" : "#94A3B8"}
                      strokeWidth={isBase ? "2" : "1"}
                    />
                    <text
                      x="35"
                      y={y + 4}
                      textAnchor="end"
                      fontSize="11"
                      fontWeight={isBase ? "700" : "500"}
                      fill={isBase ? "#0F172A" : "#64748B"}
                      fontFamily="Times New Roman, serif"
                    >
                      {t > 0 ? `+${formatIndonesianNumber(t, 0)}` : formatIndonesianNumber(t, 0)}°
                    </text>
                  </g>
                );
              })}

              {/* Badan Tabung Termometer Kaca Luar */}
              <rect x="70" y="40" width="22" height="230" rx="11" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />
              <circle cx="81" cy="275" r="22" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="2" />

              {/* Cairan Termometer di Dalam */}
              <circle cx="81" cy="275" r="18" fill="url(#freezeGrad)" />
              <rect
                x="74"
                y={yFreezeSolution}
                width="14"
                height={275 - yFreezeSolution}
                fill="url(#freezeGrad)"
                rx="4"
              />

              {/* Garis Putus-putus Air Murni (0°C) */}
              <line
                x1="70"
                y1={yFreezeWater}
                x2="225"
                y2={yFreezeWater}
                stroke="#64748B"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text x="230" y={yFreezeWater + 4} fontSize="11" fill="#475569" fontWeight="600" fontFamily="Times New Roman, serif">
                0,00 °C (Air)
              </text>

              {/* Garis Biru Larutan */}
              <line
                x1="70"
                y1={yFreezeSolution}
                x2="225"
                y2={yFreezeSolution}
                stroke="#0284C7"
                strokeWidth="2.5"
              />
              <text x="230" y={yFreezeSolution + 4} fontSize="12" fill="#0284C7" fontWeight="800" fontFamily="Times New Roman, serif">
                {formatIndonesianNumber(Tf, 2)} °C
              </text>

              {/* Panah Indikator Penurunan (Turun x °C) */}
              {deltaTf > 0.01 ? (
                <g>
                  <line
                    x1="165"
                    y1={yFreezeWater + 2}
                    x2="165"
                    y2={yFreezeSolution - 6}
                    stroke="#0284C7"
                    strokeWidth="2"
                    markerEnd="url(#arrowFreezeDown)"
                  />
                  <rect
                    x="170"
                    y={(yFreezeWater + yFreezeSolution) / 2 - 10}
                    width="58"
                    height="18"
                    rx="4"
                    fill="#F0F9FF"
                    stroke="#BAE6FD"
                    strokeWidth="1"
                  />
                  <text
                    x="199"
                    y={(yFreezeWater + yFreezeSolution) / 2 + 3}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="800"
                    fill="#0284C7"
                    fontFamily="Times New Roman, serif"
                  >
                    turun {formatIndonesianNumber(deltaTf, 2)} °C
                  </text>
                </g>
              ) : (
                <text x="160" y={yFreezeWater + 16} fontSize="11" fill="#64748B" fontStyle="italic" fontFamily="Times New Roman, serif">
                  (belum turun)
                </text>
              )}
            </svg>
          </div>
        </div>

        {/* Tiga Kotak Ringkasan Angka */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          {/* Kotak 1: Titik Didih */}
          <div style={{
            background: '#FFF7ED',
            border: '1.5px solid #FDBA74',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#9A3412', fontWeight: 700 }}>
              Titik Didih Larutan (Tb)
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#EA580C', margin: '0.25rem 0' }}>
              {formatIndonesianNumber(Tb, 2)} °C
            </div>
            <div style={{ fontSize: '0.8rem', color: '#C2410C' }}>
              100,00 °C + {formatIndonesianNumber(deltaTb, 2)} °C (Naik)
            </div>
          </div>

          {/* Kotak 2: Titik Beku */}
          <div style={{
            background: '#F0F9FF',
            border: '1.5px solid #7DD3FC',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#075985', fontWeight: 700 }}>
              Titik Beku Larutan (Tf)
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284C7', margin: '0.25rem 0' }}>
              {formatIndonesianNumber(Tf, 2)} °C
            </div>
            <div style={{ fontSize: '0.8rem', color: '#0369A1' }}>
              0,00 °C − {formatIndonesianNumber(deltaTf, 2)} °C (Turun)
            </div>
          </div>

          {/* Kotak 3: Rentang Fase Cair */}
          <div style={{
            background: '#ECFDF5',
            border: '1.5px solid #6EE7B7',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', color: '#065F46', fontWeight: 700 }}>
              Rentang Fase Cair (Tb − Tf)
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', margin: '0.25rem 0' }}>
              {formatIndonesianNumber(liquidRange, 2)} °C
            </div>
            <div style={{ fontSize: '0.8rem', color: '#047857' }}>
              Melebar +{formatIndonesianNumber(deltaTb + deltaTf, 2)} °C (Semula 100,00 °C)
            </div>
          </div>
        </div>

        {/* Baris Perhitungan ΔTb dan ΔTf */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '0.9rem 1.25rem',
          fontSize: '0.92rem',
          color: '#1E293B',
          lineHeight: 1.6
        }}>
          <div style={{ fontWeight: 700, color: '#0F172A', marginBottom: '0.35rem' }}>
            Detail Baris Perhitungan (Air: Kb = 0,52 °C/m; Kf = 1,86 °C/m; Urea i = 1):
          </div>
          <div>
            • <strong>Kenaikan Titik Didih:</strong> ΔTb = Kb × m × i = 0,52 × {formatIndonesianNumber(molality, 1)} × 1 = <strong>{formatIndonesianNumber(deltaTb, 2)} °C</strong> &nbsp;→&nbsp; Tb = 100,00 + {formatIndonesianNumber(deltaTb, 2)} = <strong>{formatIndonesianNumber(Tb, 2)} °C</strong>
          </div>
          <div style={{ marginTop: '0.2rem' }}>
            • <strong>Penurunan Titik Beku:</strong> ΔTf = Kf × m × i = 1,86 × {formatIndonesianNumber(molality, 1)} × 1 = <strong>{formatIndonesianNumber(deltaTf, 2)} °C</strong> &nbsp;→&nbsp; Tf = 0,00 − {formatIndonesianNumber(deltaTf, 2)} = <strong>{formatIndonesianNumber(Tf, 2)} °C</strong>
          </div>
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

