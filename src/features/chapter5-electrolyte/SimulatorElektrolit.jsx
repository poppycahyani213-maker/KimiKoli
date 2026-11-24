import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { calculateVantHoffFactor } from '../../utils/vantHoff';
import { calculateBoilingPointElevation, calculateFreezingPointDepression } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';
import solventsData from '../../data/solvents.json';

/**
 * Komponen SimulatorElektrolit
 * 
 * Simulator Eksplorasi Sifat Koligatif Elektrolit:
 * - Slider molalitas (0,1 m – 3,0 m)
 * - Tampilan ΔTf (titik beku) di samping ΔTb (titik didih)
 * - Pilihan zat nyata: Glukosa, NaCl, CaCl2, FeCl3, CH3COOH, dan Kustom
 * - Pola "Prediksi Lalu Amati" (Predict-Observe-Explain)
 * - Catatan ilmiah bahwa -3,72°C NaCl adalah nilai ideal teoritis
 */

const REAL_SOLUTES = [
  {
    id: 'glucose',
    name: 'Glukosa (C₆H₁₂O₆)',
    typeLabel: 'Nonelektrolit',
    n: 1,
    alpha: 0,
    formulaDesc: 'Tidak terionisasi dalam air (i = 1)',
    badgeColor: '#64748B',
    badgeBg: '#F1F5F9'
  },
  {
    id: 'nacl',
    name: 'Garam Dapur (NaCl)',
    typeLabel: 'Elektrolit Kuat Biner',
    n: 2,
    alpha: 1,
    formulaDesc: 'Na⁺ + Cl⁻ (n = 2 ion, α = 1)',
    badgeColor: '#0284C7',
    badgeBg: '#E0F2FE'
  },
  {
    id: 'cacl2',
    name: 'Kalsium Klorida (CaCl₂)',
    typeLabel: 'Elektrolit Kuat Terner',
    n: 3,
    alpha: 1,
    formulaDesc: 'Ca²⁺ + 2Cl⁻ (n = 3 ion, α = 1)',
    badgeColor: '#7C3AED',
    badgeBg: '#EDE9FE'
  },
  {
    id: 'fecl3',
    name: 'Besi(III) Klorida (FeCl₃)',
    typeLabel: 'Elektrolit Kuat Kuaterner',
    n: 4,
    alpha: 1,
    formulaDesc: 'Fe³⁺ + 3Cl⁻ (n = 4 ion, α = 1)',
    badgeColor: '#C026D3',
    badgeBg: '#FAE8FF'
  },
  {
    id: 'ch3cooh',
    name: 'Asam Asetat / Cuka (CH₃COOH)',
    typeLabel: 'Elektrolit Lemah',
    n: 2,
    alpha: 0.05,
    formulaDesc: 'CH₃COO⁻ + H⁺ (n = 2, terurai sebagian α ≈ 0,05)',
    badgeColor: '#D97706',
    badgeBg: '#FEF3C7'
  },
  {
    id: 'custom',
    name: '🧪 Zat Eksperimen Kustom',
    typeLabel: 'Bebas Diatur',
    n: 2,
    alpha: 0.5,
    formulaDesc: 'Atur bebas n dan α sesuai kebutuhanmu',
    badgeColor: '#059669',
    badgeBg: '#ECFDF5'
  }
];

export default function SimulatorElektrolit({ onSelesaiEksplorasi }) {
  const water = solventsData[0] || { kb: 0.52, kf: 1.86, normalBoilingPoint: 100, normalFreezingPoint: 0 };

  const [selectedSoluteId, setSelectedSoluteId] = useState('nacl');
  const [ionsN, setIonsN] = useState(2);
  const [alpha, setAlpha] = useState(1);
  const [molality, setMolality] = useState(1.0); // Slider molalitas 0.1 - 3.0 m

  // State Fitur Prediksi Lalu Amati (POPE)
  const [prediction, setPrediction] = useState('');
  const [hasObserved, setHasObserved] = useState(false);

  // Handler pergantian zat nyata
  const handleSelectSolute = (soluteId) => {
    setSelectedSoluteId(soluteId);
    const chosen = REAL_SOLUTES.find(s => s.id === soluteId);
    if (chosen && soluteId !== 'custom') {
      setIonsN(chosen.n);
      setAlpha(chosen.alpha);
    }
    setHasObserved(false);
    setPrediction('');
  };

  // Kalkulasi faktor van 't Hoff dan sifat koligatif
  const vantHoff_i = calculateVantHoffFactor(ionsN, alpha);

  // Kenaikan Titik Didih
  const boilingElectrolyte = calculateBoilingPointElevation(water.kb, molality, vantHoff_i, water.normalBoilingPoint);
  const boilingNonElectrolyte = calculateBoilingPointElevation(water.kb, molality, 1, water.normalBoilingPoint);

  // Penurunan Titik Beku
  const freezingElectrolyte = calculateFreezingPointDepression(water.kf, molality, vantHoff_i, water.normalFreezingPoint);
  const freezingNonElectrolyte = calculateFreezingPointDepression(water.kf, molality, 1, water.normalFreezingPoint);

  const selectedSolute = REAL_SOLUTES.find(s => s.id === selectedSoluteId) || REAL_SOLUTES[1];

  const handleObserve = () => {
    setHasObserved(true);
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", marginBottom: '1.5rem' }}>
      <Card
        title="Laboratorium Simulasi & Kalkulator Interaktif van 't Hoff"
        subtitle="Eksplorasi bagaimana jumlah ion terurai (n), derajat ionisasi (α), dan konsentrasi molalitas (m) melipatgandakan efek kenaikan titik didih dan penurunan titik beku larutan."
      >
        {/* 1. KONTROL PEMILIHAN ZAT NYATA */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.5rem' }}>
            Pilih Zat Terlarut untuk Eksperimen:
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.6rem'
          }}>
            {REAL_SOLUTES.map((sol) => {
              const isSelected = selectedSoluteId === sol.id;
              return (
                <button
                  key={sol.id}
                  type="button"
                  onClick={() => handleSelectSolute(sol.id)}
                  style={{
                    padding: '0.65rem 0.8rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #0284C7' : '1.5px solid #E2E8F0',
                    background: isSelected ? '#EFF6FF' : '#FFFFFF',
                    color: isSelected ? '#0369A1' : '#334155',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.15)' : 'none',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                >
                  <div style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: sol.badgeColor,
                    background: sol.badgeBg,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    display: 'inline-block',
                    marginBottom: '0.25rem'
                  }}>
                    {sol.typeLabel}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                    {sol.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem' }}>
                    {sol.formulaDesc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. SLIDER PARAMETER (MOLALITAS, JUMLAH ION n, DAN DERAJAT IONISASI α) */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px solid #E2E8F0',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {/* Slider Molalitas (m) */}
            <div className="control-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>
                  Konsentrasi Molalitas (m):
                </span>
                <span style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#0284C7',
                  background: '#E0F2FE',
                  padding: '0.15rem 0.6rem',
                  borderRadius: '6px'
                }}>
                  {formatIndonesianNumber(molality, 2)} m
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={molality}
                onChange={(e) => {
                  setMolality(Number(e.target.value));
                  setHasObserved(false);
                }}
                className="slider-input"
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                <span>0,1 molal (sangat encer)</span>
                <span>1,5 m</span>
                <span>3,0 molal (pekat)</span>
              </div>
            </div>

            {/* Pilihan / Slider Derajat Ionisasi (α) */}
            <div className="control-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>
                  Derajat Ionisasi (α):
                </span>
                <span style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#D97706',
                  background: '#FEF3C7',
                  padding: '0.15rem 0.6rem',
                  borderRadius: '6px'
                }}>
                  α = {formatIndonesianNumber(alpha, 2)} {alpha === 1 ? '(100% Kuat)' : alpha === 0 ? '(Nonelektrolit)' : '(Lemah)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={alpha}
                disabled={selectedSoluteId !== 'custom' && selectedSoluteId !== 'ch3cooh'}
                onChange={(e) => {
                  setAlpha(Number(e.target.value));
                  setHasObserved(false);
                }}
                className="slider-input"
                style={{ width: '100%', opacity: (selectedSoluteId !== 'custom' && selectedSoluteId !== 'ch3cooh') ? 0.6 : 1 }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.2rem' }}>
                <span>0,00 (Nonelektrolit)</span>
                <span>0,50 (Terurai 50%)</span>
                <span>1,00 (Terurai Total)</span>
              </div>
            </div>

            {/* Jumlah Ion (n) */}
            <div className="control-group" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A' }}>
                  Jumlah Ion per Satuan Rumus (n):
                </span>
                <span style={{
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  color: '#7C3AED',
                  background: '#EDE9FE',
                  padding: '0.15rem 0.6rem',
                  borderRadius: '6px'
                }}>
                  n = {ionsN} ion
                </span>
              </div>
              {selectedSoluteId === 'custom' ? (
                <select
                  value={ionsN}
                  onChange={(e) => {
                    setIonsN(Number(e.target.value));
                    setHasObserved(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="1">n = 1 (Nonelektrolit)</option>
                  <option value="2">n = 2 (Garam biner: NaCl, KCl)</option>
                  <option value="3">n = 3 (Garam terner: CaCl₂, Na₂SO₄)</option>
                  <option value="4">n = 4 (Garam kuaterner: FeCl₃, AlCl₃)</option>
                </select>
              ) : (
                <div style={{ fontSize: '0.85rem', color: '#64748B', paddingTop: '0.4rem' }}>
                  Terkunci otomatis sesuai formula <strong>{selectedSolute.name}</strong> ({ionsN} ion bebas).
                </div>
              )}
            </div>
          </div>

          {/* Nilai Hitung Faktor van 't Hoff (i) */}
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: '#FFFFFF',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#334155' }}>
              Formula Faktor van 't Hoff: <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>i = 1 + ({ionsN} − 1) × {formatIndonesianNumber(alpha, 2)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Faktor Pengali (i) =</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284C7' }}>
                {formatIndonesianNumber(vantHoff_i, 2)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. FITUR POLA PREDIKSI LALU AMATI (POPE: PREDICT-OBSERVE-EXPLAIN) */}
        <div style={{
          background: '#FFFBEB',
          border: '1.5px solid #FCD34D',
          borderRadius: '12px',
          padding: '1.15rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🤔</span>
            <strong style={{ fontSize: '0.98rem', color: '#92400E' }}>
              Tahap 1 POPE: Buat Prediksimu Terlebih Dahulu Sebelum Melihat Pengukuran!
            </strong>
          </div>
          <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.92rem', color: '#78350F', lineHeight: 1.55 }}>
            Kamu telah mengatur <strong>{selectedSolute.name}</strong> dengan molalitas <strong>{formatIndonesianNumber(molality, 1)} m</strong> (faktor i = <strong>{formatIndonesianNumber(vantHoff_i, 2)}</strong>). Menurut prediksimu, bagaimana titik didih dan titik beku larutan ini dibandingkan larutan <em>Glukosa</em> dengan konsentrasi molal yang sama?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
            {[
              { key: 'same', text: 'Titik didih dan titik bekunya sama persis dengan glukosa karena konsentrasinya sama-sama ' + formatIndonesianNumber(molality, 1) + ' m.' },
              { key: 'multiplier', text: 'Kenaikan titik didih (ΔTb) dan penurunan titik beku (ΔTf) akan berlipat ganda sekitar ' + formatIndonesianNumber(vantHoff_i, 2) + ' kali lipat dibanding glukosa.' },
              { key: 'weaker', text: 'Titik didihnya justru lebih rendah daripada air murni.' }
            ].map((pOpt) => (
              <label
                key={pOpt.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  background: prediction === pOpt.key ? '#FEF3C7' : '#FFFFFF',
                  padding: '0.5rem 0.8rem',
                  borderRadius: '6px',
                  border: prediction === pOpt.key ? '1.5px solid #D97706' : '1px solid #E2E8F0',
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  color: '#451A03'
                }}
              >
                <input
                  type="radio"
                  name="predictionOption"
                  value={pOpt.key}
                  checked={prediction === pOpt.key}
                  onChange={(e) => setPrediction(e.target.value)}
                />
                <span>{pOpt.text}</span>
              </label>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="primary"
              onClick={handleObserve}
              disabled={!prediction}
              style={{
                padding: '0.6rem 1.4rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                background: prediction ? '#D97706' : '#94A3B8'
              }}
            >
              👁️ Uji & Amati Hasil Pengukuran Termometer Virtual →
            </Button>
          </div>
        </div>

        {/* 4. HASIL OBSERVASI TERMOMETER (TITIK DIDIH ΔTb & TITIK BEKU ΔTf) */}
        {hasObserved && (
          <div className="fade-in" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🌡️</span>
              <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>
                Hasil Pengukuran Sifat Koligatif Elektrolit vs Non-Elektrolit:
              </strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {/* KARTU KENAIKAN TITIK DIDIH (ΔTb) */}
              <div style={{
                background: '#FFFFFF',
                border: '1.5px solid #FECDD3',
                borderTop: '5px solid #EF4444',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#B91C1C', textTransform: 'uppercase' }}>
                    🔥 Kenaikan Titik Didih (ΔTb)
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Kb air = 0,52 °C/m
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#BE123C' }}>
                    {formatIndonesianNumber(boilingElectrolyte.boilingPoint, 3)} °C
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#BE123C', fontWeight: 700 }}>
                    (ΔTb = +{formatIndonesianNumber(boilingElectrolyte.deltaTb, 3)} °C)
                  </span>
                </div>

                <div style={{
                  background: '#FFF1F2',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: '#9F1239'
                }}>
                  <div>• <strong>Larutan Non-elektrolit ({formatIndonesianNumber(molality, 1)} m):</strong> Tb = {formatIndonesianNumber(boilingNonElectrolyte.boilingPoint, 3)} °C (ΔTb = +{formatIndonesianNumber(boilingNonElectrolyte.deltaTb, 3)} °C)</div>
                  <div>• <strong>Faktor Pengali:</strong> {formatIndonesianNumber(vantHoff_i, 2)}× lipat lebih tinggi berkat partikel ion bebas!</div>
                </div>
              </div>

              {/* KARTU PENURUNAN TITIK BEKU (ΔTf) */}
              <div style={{
                background: '#FFFFFF',
                border: '1.5px solid #BAE6FD',
                borderTop: '5px solid #0284C7',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase' }}>
                    ❄️ Penurunan Titik Beku (ΔTf)
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Kf air = 1,86 °C/m
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284C7' }}>
                    {formatIndonesianNumber(freezingElectrolyte.freezingPoint, 3)} °C
                  </span>
                  <span style={{ fontSize: '0.9rem', color: '#0369A1', fontWeight: 700 }}>
                    (ΔTf = {formatIndonesianNumber(freezingElectrolyte.deltaTf, 3)} °C)
                  </span>
                </div>

                <div style={{
                  background: '#F0F9FF',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  color: '#075985'
                }}>
                  <div>• <strong>Larutan Non-elektrolit ({formatIndonesianNumber(molality, 1)} m):</strong> Tf = {formatIndonesianNumber(freezingNonElectrolyte.freezingPoint, 3)} °C (ΔTf = {formatIndonesianNumber(freezingNonElectrolyte.deltaTf, 3)} °C)</div>
                  <div>• <strong>Faktor Pengali:</strong> Titik beku turun {formatIndonesianNumber(vantHoff_i, 2)}× lipat lebih dingin di bawah 0°C!</div>
                </div>
              </div>
            </div>

            {/* CATATAN PENTING: NILAI IDEAL TEORITIS vs REALITA LAB */}
            <div style={{
              marginTop: '1rem',
              background: '#F1F5F9',
              borderLeft: '4px solid #0284C7',
              borderRadius: '8px',
              padding: '0.85rem 1.1rem',
              fontSize: '0.88rem',
              color: '#334155',
              lineHeight: 1.6
            }}>
              <strong>⚠️ Catatan Guru & Standar Ilmiah:</strong> Nilai titik beku <strong>−3,72 °C</strong> pada larutan garam NaCl 1 molal (atau nilai pada simulator di atas) adalah <strong>nilai ideal teoritis</strong> yang mengasumsikan seluruh ion bergerak 100% bebas tanpa saling mengganggu.<br />
              Pada kondisi laboratorium riil, tarikan elektrostatik antar-ion (gaya interionik Debye-Hückel) mengurangi sedikit mobilitas ion, sehingga titik beku terukur sesungguhnya berkisar antara <strong>−3,4 °C hingga −3,5 °C</strong> (nilai i aktual ≈ 1,87).
            </div>

            {/* EVALUASI PREDIKSI POPE */}
            <div style={{
              marginTop: '1rem',
              background: prediction === 'multiplier' ? '#ECFDF5' : '#FFFBEB',
              border: prediction === 'multiplier' ? '1.5px solid #86EFAC' : '1.5px solid #FCD34D',
              borderRadius: '8px',
              padding: '0.85rem 1.1rem',
              fontSize: '0.9rem',
              color: prediction === 'multiplier' ? '#065F46' : '#92400E'
            }}>
              {prediction === 'multiplier' ? (
                <div>
                  <strong>🎉 Prediksimu Tepat Sekali!</strong> Sifat koligatif sebanding langsung dengan total konsentrasi partikel bebas. Kehadiran faktor van 't Hoff {formatIndonesianNumber(vantHoff_i, 2)} melipatgandakan nilai ΔTb maupun ΔTf secara proporsional.
                </div>
              ) : (
                <div>
                  <strong>💡 Refleksi Pengamatanmu:</strong> Perhatikan data di atas! Titik didih larutan elektrolit terbukti lebih tinggi dan titik bekunya jauh lebih rendah dibandingkan glukosa karena setiap molekul garam terurai menjadi beberapa partikel ion independen.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TOMBOL KONFIRMASI PENYELESAIAN EKSPLORASI */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
          <Button
            variant="primary"
            onClick={onSelesaiEksplorasi}
            style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem', fontWeight: 700, background: '#0284C7' }}
          >
            ✓ Tandai Eksplorasi Selesai & Lanjut ke Penjelasan Ilmiah (Explanation) →
          </Button>
        </div>
      </Card>
    </div>
  );
}
