import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

/**
 * Komponen PerbandinganKonsentrasi
 * 
 * Menjelaskan perbandingan Molaritas (M), Molalitas (m), dan Fraksi Mol (X).
 * Dilengkapi animasi interaktif pemuaian larutan dalam gelas kimia untuk
 * membuktikan alasan ilmiah mengapa perhitungan sifat koligatif wajib menggunakan Molalitas (m).
 */
export default function PerbandinganKonsentrasi() {
  const [isHeated, setIsHeated] = useState(false);

  return (
    <div style={{ marginBottom: '1.75rem', fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Perbandingan Satuan Konsentrasi & Alasan Penggunaan Molalitas"
        subtitle="Analisis perbedaan Molaritas (M), Molalitas (m), dan Fraksi Mol (X) terhadap pengaruh perubahan suhu"
      >
        {/* BAGIAN 1: TABEL PERBANDINGAN */}
        <div style={{ overflowX: 'auto', marginBottom: '2rem' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.95rem'
          }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                <th style={{ padding: '0.85rem 1rem', color: '#0F172A', fontWeight: 800 }}>Karakteristik</th>
                <th style={{ padding: '0.85rem 1rem', color: '#B45309', fontWeight: 800 }}>Molaritas (M)</th>
                <th style={{ padding: '0.85rem 1rem', color: '#0369A1', fontWeight: 800, background: '#E0F2FE' }}>
                  Molalitas (m) ★
                </th>
                <th style={{ padding: '0.85rem 1rem', color: '#4338CA', fontWeight: 800 }}>Fraksi Mol (X)</th>
              </tr>
            </thead>
            <tbody>
              {/* Baris 1: Pembagi */}
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>
                  Faktor Pembagi
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#0F172A' }}>
                  <strong>Volume larutan</strong> (Liter)
                  <div style={{ fontSize: '0.82rem', color: '#64748B' }}>M = mol zat / Volume (L)</div>
                </td>
                <td style={{ padding: '0.85rem 1rem', background: '#F0F9FF', color: '#0F172A' }}>
                  <strong>Massa pelarut</strong> (kg)
                  <div style={{ fontSize: '0.82rem', color: '#0284C7' }}>m = mol zat / Massa pelarut (kg)</div>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#0F172A' }}>
                  <strong>Mol total campuran</strong> (mol)
                  <div style={{ fontSize: '0.82rem', color: '#64748B' }}>X<sub>t</sub> = n<sub>t</sub> / (n<sub>t</sub> + n<sub>p</sub>)</div>
                </td>
              </tr>

              {/* Baris 2: Satuan */}
              <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#FAFAFA' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>
                  Satuan
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ background: '#FEF3C7', color: '#92400E', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    mol/L
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', marginLeft: '0.4rem' }}>(Molar)</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', background: '#F0F9FF' }}>
                  <span style={{ background: '#BAE6FD', color: '#0369A1', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    mol/kg
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#0284C7', marginLeft: '0.4rem' }}>(molal)</span>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ background: '#EEF2FF', color: '#4338CA', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    Tanpa Satuan
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', marginLeft: '0.4rem' }}>(0 ≤ X ≤ 1)</span>
                </td>
              </tr>

              {/* Baris 3: Dipengaruhi Suhu */}
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>
                  Dipengaruhi Suhu?
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#DC2626', fontWeight: 700 }}>
                    <span>⚠️ Ya</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>
                    Cairan memuai saat panas → volume membesar → nilai M turun.
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1rem', background: '#F0F9FF' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontWeight: 700 }}>
                    <span>✓ Tidak</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#0284C7', marginTop: '0.2rem' }}>
                    Massa pelarut konstan, tidak terpengaruh pemuaian suhu.
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#059669', fontWeight: 700 }}>
                    <span>✓ Tidak</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '0.2rem' }}>
                    Jumlah mol partikel tidak dipengaruhi oleh suhu.
                  </div>
                </td>
              </tr>

              {/* Baris 4: Dipakai Untuk */}
              <tr style={{ background: '#FAFAFA' }}>
                <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#334155' }}>
                  Dipakai Untuk
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#0F172A' }}>
                  <strong>Stoikiometri dan titrasi</strong> larutan pada suhu ruang tetap (isotermal).
                </td>
                <td style={{ padding: '0.85rem 1rem', background: '#F0F9FF', color: '#0F172A' }}>
                  <strong>ΔT<sub>b</sub> (Kenaikan Titik Didih)</strong> dan <strong>ΔT<sub>f</sub> (Penurunan Titik Beku)</strong> yang mengalami perubahan suhu besar.
                </td>
                <td style={{ padding: '0.85rem 1rem', color: '#0F172A' }}>
                  <strong>ΔP (Penurunan Tekanan Uap / Hukum Raoult)</strong> dan kesetimbangan fase uap-cair.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BAGIAN 2: ANIMASI PEMUAIAN LARUTAN */}
        <div style={{
          background: isHeated ? '#FFFBEB' : '#F8FAFC',
          border: isHeated ? '1.5px solid #FCD34D' : '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '1.5rem',
          transition: 'all 0.4s ease'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{isHeated ? '🔥' : '🧪'}</span>
                <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>
                  Animasi: Uji Pengaruh Pemanasan terhadap Nilai M dan m
                </strong>
              </div>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: '#64748B' }}>
                Klik tombol di sebelah kanan untuk melihat perbedaan respon Molaritas (M) vs Molalitas (m) saat larutan dipanaskan.
              </p>
            </div>

            <Button
              variant={isHeated ? 'secondary' : 'primary'}
              onClick={() => setIsHeated(!isHeated)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.3rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                background: isHeated ? '#EA580C' : '#0284C7',
                color: '#FFFFFF',
                boxShadow: isHeated ? '0 4px 12px rgba(234, 88, 12, 0.3)' : '0 4px 12px rgba(2, 132, 199, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              {isHeated ? '❄️ Kembalikan ke Suhu Ruang (25°C)' : '🔥 Panaskan Larutan (25°C → 80°C)'}
            </Button>
          </div>

          {/* AREA VISUALISASI GELAS KIMIA & NILAI KONSENTRASI */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center'
          }}>
            {/* Visual Gelas Kimia (SVG Dinamis) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative'
            }}>
              {/* Badge Suhu */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: isHeated ? '#FEE2E2' : '#EFF6FF',
                color: isHeated ? '#DC2626' : '#1D4ED8',
                padding: '0.25rem 0.65rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: isHeated ? '1px solid #FECACA' : '1px solid #BFDBFE'
              }}>
                🌡️ Suhu: {isHeated ? '80°C (Panas)' : '25°C (Ruang)'}
              </div>

              {/* SVG Beaker */}
              <svg width="220" height="230" viewBox="0 0 220 230" style={{ overflow: 'visible' }}>
                <defs>
                  {/* Gradien Cairan */}
                  <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={isHeated ? '#38BDF8' : '#0EA5E9'} stopOpacity="0.85" />
                    <stop offset="100%" stopColor={isHeated ? '#0284C7' : '#0369A1'} stopOpacity="0.95" />
                  </linearGradient>

                  {/* Gradien Api */}
                  <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="60%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#FDE047" />
                  </linearGradient>
                </defs>

                {/* Uap Panas (Hanya tampil saat dipanaskan) */}
                {isHeated && (
                  <g style={{ opacity: 0.75, transition: 'opacity 0.5s ease' }}>
                    <path
                      d="M 65 30 Q 75 18 65 5 Q 55 -5 65 -15"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="4 2"
                    />
                    <path
                      d="M 110 32 Q 120 20 110 7 Q 100 -3 110 -15"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="4 2"
                    />
                    <path
                      d="M 155 30 Q 165 18 155 5 Q 145 -5 155 -15"
                      fill="none"
                      stroke="#94A3B8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="4 2"
                    />
                  </g>
                )}

                {/* Dinding Kaca Beaker (Dasar) */}
                <path
                  d="M 40 40 L 40 180 Q 40 195 55 195 L 165 195 Q 180 195 180 180 L 180 40"
                  fill="#F8FAFC"
                  stroke="#94A3B8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Bibir/Spout Beaker */}
                <path
                  d="M 32 40 L 40 40 M 180 40 L 188 40"
                  stroke="#94A3B8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Cairan di dalam Beaker (Ketinggian berubah halus dengan CSS transition) */}
                {/* 25°C: y=95, height=95 | 80°C (Memuai): y=72, height=118 */}
                <rect
                  x="43"
                  y={isHeated ? 72 : 95}
                  width="134"
                  height={isHeated ? 120 : 97}
                  rx="6"
                  fill="url(#liquidGrad)"
                  style={{
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                />

                {/* Meniscus / Permukaan Cekung Cairan */}
                <ellipse
                  cx="110"
                  cy={isHeated ? 72 : 95}
                  rx="67"
                  ry="5"
                  fill={isHeated ? '#7DD3FC' : '#38BDF8'}
                  style={{
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }}
                />

                {/* Garis Skala Pengukur Volume pada Gelas */}
                {/* Garis 600 mL */}
                <line x1="43" y1="60" x2="68" y2="60" stroke="#CBD5E1" strokeWidth="2" />
                <text x="72" y="64" fontSize="10" fill="#64748B" fontWeight="600">600 mL</text>

                {/* Garis 500 mL (Tanda batas awal pada 25°C) */}
                <line x1="43" y1="95" x2="73" y2="95" stroke={isHeated ? '#CBD5E1' : '#0284C7'} strokeWidth={isHeated ? 2 : 2.5} />
                <text x="77" y="99" fontSize="10" fill={isHeated ? '#64748B' : '#0284C7'} fontWeight="700">500 mL (Awal)</text>

                {/* Garis batas pemuaian (510 mL) */}
                {isHeated && (
                  <g style={{ transition: 'opacity 0.4s ease' }}>
                    <line x1="43" y1="72" x2="80" y2="72" stroke="#EF4444" strokeWidth="2.5" strokeDasharray="3 2" />
                    <text x="84" y="76" fontSize="10" fill="#DC2626" fontWeight="800">510 mL (Memuai!)</text>
                  </g>
                )}

                {/* Garis 400 mL */}
                <line x1="43" y1="125" x2="68" y2="125" stroke="#CBD5E1" strokeWidth="2" />
                <text x="72" y="129" fontSize="10" fill="#64748B" fontWeight="600">400 mL</text>

                {/* Garis 300 mL */}
                <line x1="43" y1="155" x2="65" y2="155" stroke="#CBD5E1" strokeWidth="2" />
                <text x="70" y="159" fontSize="10" fill="#64748B" fontWeight="600">300 mL</text>

                {/* Partikel Terlarut (Jumlah partikel SELALU TETAP = 8 butir, hanya jarak renggangnya membesar) */}
                <g fill="#FEF08A" stroke="#CA8A04" strokeWidth="1">
                  <circle cx="70" cy={isHeated ? 115 : 125} r="4.5" />
                  <circle cx="110" cy={isHeated ? 100 : 115} r="4.5" />
                  <circle cx="150" cy={isHeated ? 118 : 128} r="4.5" />
                  <circle cx="85" cy={isHeated ? 145 : 150} r="4.5" />
                  <circle cx="130" cy={isHeated ? 142 : 148} r="4.5" />
                  <circle cx="65" cy={isHeated ? 170 : 172} r="4.5" />
                  <circle cx="105" cy={isHeated ? 168 : 170} r="4.5" />
                  <circle cx="152" cy={isHeated ? 172 : 173} r="4.5" />
                </g>

                {/* Penyangga Kasa Asbes & Nyala Api Pemanas */}
                <line x1="25" y1="200" x2="195" y2="200" stroke="#475569" strokeWidth="3" />
                {isHeated ? (
                  <g style={{ transition: 'opacity 0.3s ease' }}>
                    <path
                      d="M 95 228 Q 110 203 110 203 Q 110 203 125 228 Z"
                      fill="url(#flameGrad)"
                    />
                    <path
                      d="M 102 228 Q 110 214 110 214 Q 110 214 118 228 Z"
                      fill="#FEF08A"
                    />
                  </g>
                ) : (
                  <text x="110" y="218" fontSize="11" fill="#94A3B8" textAnchor="middle">
                    (Pembakar Mati)
                  </text>
                )}
              </svg>

              <div style={{ marginTop: '0.75rem', fontSize: '0.82rem', color: '#64748B', textAlign: 'center' }}>
                {isHeated ? (
                  <span style={{ color: '#DC2626', fontWeight: 700 }}>
                    ⚠️ Cairan memuai ke atas (+10 mL), namun 8 butir partikel tetap utuh!
                  </span>
                ) : (
                  <span>Kondisi standar larutan pada suhu ruang 25°C</span>
                )}
              </div>
            </div>

            {/* Kotak Bandingan Angka Real-Time */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Kartu Molaritas (M) */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                border: isHeated ? '2px solid #F87171' : '1px solid #E2E8F0',
                boxShadow: isHeated ? '0 4px 12px rgba(239, 68, 68, 0.15)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
                      Satuan Berbasis Volume
                    </span>
                    <h4 style={{ margin: '0.15rem 0', color: '#0F172A', fontSize: '1.15rem' }}>
                      Molaritas (M)
                    </h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '1.6rem',
                      fontWeight: 900,
                      color: isHeated ? '#DC2626' : '#0284C7',
                      transition: 'color 0.3s ease'
                    }}>
                      {isHeated ? '0,196 M' : '0,200 M'}
                    </span>
                  </div>
                </div>

                <div style={{
                  marginTop: '0.5rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid #F1F5F9',
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#64748B' }}>
                    Volume larutan: <strong>{isHeated ? '510 mL (Memuai ↑)' : '500 mL'}</strong>
                  </span>
                  <span style={{
                    color: isHeated ? '#DC2626' : '#10B981',
                    fontWeight: 700,
                    fontSize: '0.8rem'
                  }}>
                    {isHeated ? '📉 Nilai Turun (Berubah!)' : '✓ Normal'}
                  </span>
                </div>
              </div>

              {/* Kartu Molalitas (m) */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                border: '2px solid #0284C7',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.12)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#0369A1', fontWeight: 700, textTransform: 'uppercase' }}>
                      Satuan Berbasis Massa
                    </span>
                    <h4 style={{ margin: '0.15rem 0', color: '#0F172A', fontSize: '1.15rem' }}>
                      Molalitas (m) ★
                    </h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontSize: '1.6rem',
                      fontWeight: 900,
                      color: '#059669'
                    }}>
                      0,203 m
                    </span>
                  </div>
                </div>

                <div style={{
                  marginTop: '0.5rem',
                  paddingTop: '0.5rem',
                  borderTop: '1px solid #F1F5F9',
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#64748B' }}>
                    Massa pelarut air: <strong>500 gram (Tetap)</strong>
                  </span>
                  <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.8rem' }}>
                    ✅ Tetap Konstan (Stabil)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* KETERANGAN KESIMPULAN PEDAGOGIS */}
          <div style={{
            marginTop: '1.25rem',
            background: '#FFFFFF',
            borderLeft: '4px solid #0284C7',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)'
          }}>
            <strong style={{ color: '#0F172A', fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>💡</span> Mengapa Sifat Koligatif Menggunakan Molalitas (m)?
            </strong>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.92rem', color: '#334155', lineHeight: 1.6 }}>
              Eksperimen sifat koligatif larutan seperti <strong>Kenaikan Titik Didih (ΔT<sub>b</sub>)</strong> dan <strong>Penurunan Titik Beku (ΔT<sub>f</sub>)</strong> selalu melibatkan perubahan suhu yang sangat ekstrem (dari membeku di bawah 0°C hingga mendidih di atas 100°C). 
              Jika perhitungan menggunakan <strong>Molaritas (M)</strong>, nilai konsentrasi larutan akan terus berubah-ubah akibat pemuaian atau penyusutan volume cairan. 
              Oleh sebab itu, kimiawan menggunakan <strong>Molalitas (m)</strong> karena berbasis <em>massa pelarut (kg)</em> yang nilainya <strong>selalu tetap dan tidak terpengaruh oleh suhu</strong>, sehingga rumus perhitungan sifat koligatif tetap valid dan akurat!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
