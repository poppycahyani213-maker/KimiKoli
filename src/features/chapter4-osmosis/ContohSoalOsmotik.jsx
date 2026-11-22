import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';

// Helper kunci penyimpanan status contoh soal per siswa
export function getCh4ContohKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch4_contoh_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch4_contoh_v1_guest';
}

const CONTOH_DATA = [
  // CONTOH 1: Menghitung Tekanan Osmotik Glukosa
  {
    id: 1,
    badge: 'Contoh 1 • Perhitungan Dasar Tekanan Osmotik',
    title: 'Tekanan Osmotik Larutan Glukosa',
    problem: 'Hitunglah tekanan osmotik larutan glukosa 0,1 M pada suhu 27 °C (tetapan gas R = 0,082 L·atm/mol·K).',
    given: [
      { label: 'Konsentrasi glukosa (M)', value: '0,1 M' },
      { label: 'Suhu (t)', value: '27 °C' },
      { label: 'Tetapan gas (R)', value: '0,082 L·atm/(mol·K)' },
      { label: 'Sifat zat', value: 'Glukosa (nonelektrolit)' }
    ],
    note: 'Jangan lupa selalu mengubah suhu Celsius (°C) menjadi Kelvin (K) dengan menambahkan 273!',
    steps: [
      {
        stepNumber: 1,
        title: 'Mengonversi Suhu Celsius ke Kelvin',
        formula: 'T (Kelvin) = t (°C) + 273',
        calculation: 'T = 27 + 273 = 300 K',
        result: 'T = 300 K',
        explanation: 'Dalam persamaan van \'t Hoff (yang diturunkan dari hukum gas ideal PV = nRT), temperatur mutlak mutlak harus dinyatakan dalam skala Kelvin.'
      },
      {
        stepNumber: 2,
        title: 'Menentukan Faktor van \'t Hoff (i)',
        formula: 'Glukosa adalah senyawa kovalen nonelektrolit',
        calculation: 'i = 1',
        result: 'i = 1',
        explanation: 'Glukosa tidak terionisasi saat larut di dalam air, sehingga jumlah partikelnya tetap (i = 1).'
      },
      {
        stepNumber: 3,
        title: 'Memasukkan Nilai ke Rumus van \'t Hoff',
        formula: 'Π = M × R × T',
        calculation: 'Π = 0,1 M × 0,082 L·atm/(mol·K) × 300 K',
        result: 'Π = 0,1 × 24,6',
        explanation: 'Substitusikan molaritas (0,1 M), tetapan gas R (0,082), dan suhu mutlak T (300 K).'
      },
      {
        stepNumber: 4,
        title: 'Menghitung Hasil Akhir Tekanan Osmotik',
        formula: 'Π = 2,46 atm',
        calculation: 'Π = 2,46 atm',
        result: 'Π = 2,46 atm',
        explanation: 'Jadi, tekanan osmotik larutan glukosa 0,1 M pada 27 °C adalah sebesar 2,46 atm.'
      }
    ]
  },

  // CONTOH 2: Cairan Infus Medis yang Isotonik dengan Darah
  {
    id: 2,
    badge: 'Contoh 2 • Penerapan Medis (Cairan Infus Isotonik)',
    title: 'Konsentrasi dan Kadar Infus Glukosa',
    problem: 'Tekanan osmotik darah manusia adalah sekitar 7,7 atm pada suhu tubuh normal 37 °C. Berapakah konsentrasi infus glukosa yang isotonik dengan darah, dan berapa gram glukosa (Mr = 180 g/mol) yang terlarut dalam setiap 1 liter larutan?',
    given: [
      { label: 'Tekanan osmotik darah (Π)', value: '7,7 atm' },
      { label: 'Suhu tubuh (t)', value: '37 °C' },
      { label: 'Mr glukosa', value: '180 g/mol' },
      { label: 'Volume larutan (V)', value: '1 Liter' }
    ],
    note: 'Inilah alasan ilmiah mengapa rumah sakit di seluruh dunia memakai infus dekstrosa / glukosa 5% untuk pasien.',
    steps: [
      {
        stepNumber: 1,
        title: 'Mengonversi Suhu Tubuh ke Kelvin',
        formula: 'T = t (°C) + 273',
        calculation: 'T = 37 + 273 = 310 K',
        result: 'T = 310 K',
        explanation: 'Suhu tubuh manusia normal 37 °C setara dengan 310 Kelvin.'
      },
      {
        stepNumber: 2,
        title: 'Menerapkan Konsep Larutan Isotonik',
        formula: 'Π_infus = Π_darah = 7,7 atm',
        calculation: 'Π = 7,7 atm',
        result: 'Isotonik (Π sama)',
        explanation: 'Cairan infus harus memiliki tekanan osmotik yang sama dengan sel darah agar tidak terjadi krenasi (mengerut) maupun hemolisis (pecah).'
      },
      {
        stepNumber: 3,
        title: 'Menghitung Molaritas (M) Infus',
        formula: 'M = Π / (R × T)',
        calculation: 'M = 7,7 / (0,082 × 310) = 7,7 / 25,42 = 0,3029... M ≈ 0,30 M',
        result: 'M = 0,30 M',
        explanation: 'Konsentrasi infus glukosa yang isotonik dengan plasma darah manusia adalah 0,30 M.'
      },
      {
        stepNumber: 4,
        title: 'Menghitung Massa Glukosa per Liter Larutan',
        formula: 'Massa = M × Mr × Volume = 0,30 mol/L × 180 g/mol × 1 L',
        calculation: 'Massa = 54 gram glukosa per 1 Liter (1000 mL) air ≈ 5,4% (b/v) ≈ 5%',
        result: 'Massa ≈ 54 gram/L (atau Infus Glukosa 5%)',
        explanation: 'Massa 54 gram dalam 1000 mL menghasilkan larutan dengan kadar sekitar 5% massa/volume (dikenal di medis sebagai larutan D5W / Dekstrosa 5%).'
      }
    ]
  }
];

export default function ContohSoalOsmotik({ onContohComplete, isCompletedInitially = false }) {
  const [activeTab, setActiveTab] = useState(0); // 0 = Contoh 1, 1 = Contoh 2
  const [stepsRevealed, setStepsRevealed] = useState(() => {
    const key = getCh4ContohKey();
    const saved = getStoredData(key, null);
    if (saved && saved.stepsRevealed) {
      return saved.stepsRevealed;
    }
    return { 0: 1, 1: 1 };
  });

  const [hasCompletedBoth, setHasCompletedBoth] = useState(() => {
    if (isCompletedInitially) return true;
    const key = getCh4ContohKey();
    const saved = getStoredData(key, null);
    return Boolean(saved?.bothCompleted);
  });

  const currentContoh = CONTOH_DATA[activeTab];
  const maxSteps = currentContoh.steps.length;
  const currentRevealed = stepsRevealed[activeTab] || 1;

  // Cek apakah kedua contoh sudah dibuka sampai langkah terakhir
  useEffect(() => {
    const c1Done = (stepsRevealed[0] || 1) >= CONTOH_DATA[0].steps.length;
    const c2Done = (stepsRevealed[1] || 1) >= CONTOH_DATA[1].steps.length;

    if (c1Done && c2Done && !hasCompletedBoth) {
      setHasCompletedBoth(true);
      const key = getCh4ContohKey();
      setStoredData(key, {
        bothCompleted: true,
        stepsRevealed,
        completedAt: new Date().toISOString()
      });
      if (onContohComplete) {
        onContohComplete();
      }
    }
  }, [stepsRevealed, hasCompletedBoth, onContohComplete]);

  const handleNextStep = () => {
    if (currentRevealed < maxSteps) {
      const nextSteps = {
        ...stepsRevealed,
        [activeTab]: currentRevealed + 1
      };
      setStepsRevealed(nextSteps);
      const key = getCh4ContohKey();
      const saved = getStoredData(key, {}) || {};
      setStoredData(key, {
        ...saved,
        stepsRevealed: nextSteps
      });
    }
  };

  const handleResetSteps = () => {
    const nextSteps = {
      ...stepsRevealed,
      [activeTab]: 1
    };
    setStepsRevealed(nextSteps);
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", marginTop: '2.5rem' }}>
      <div style={{
        background: '#FFFFFF',
        border: '1.5px solid #CBD5E1',
        borderRadius: '16px',
        padding: '1.4rem',
        boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
      }}>

        {/* ── HEADER CONTOH SOAL ─────────────────────────────────────── */}
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
              <span style={{ fontSize: '1.35rem' }}>💡</span>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                Contoh Soal Terbimbing Tekanan Osmotik
              </h3>
            </div>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem', color: '#64748B' }}>
              Pelajari pembahasan sistematis langkah demi langkah untuk menguasai perhitungan tekanan osmotik (Π).
            </p>
          </div>

          {/* Indikator Status Kelengkapan Contoh */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            background: hasCompletedBoth ? '#ECFDF5' : '#FFFBEB',
            border: `1.5px solid ${hasCompletedBoth ? '#86EFAC' : '#FDE68A'}`,
            color: hasCompletedBoth ? '#059669' : '#B45309'
          }}>
            <span>{hasCompletedBoth ? '✓' : '📖'}</span>
            <span>{hasCompletedBoth ? 'Semua Contoh Terbuka' : 'Buka Semua Langkah (2 Contoh)'}</span>
          </div>
        </div>

        {/* ── NAVIGASI TAB ANTARA CONTOH 1 & 2 ───────────────────────── */}
        <div style={{ display: 'flex', gap: '0.65rem', marginBottom: '1.25rem' }}>
          {CONTOH_DATA.map((item, idx) => {
            const isTabActive = activeTab === idx;
            const isTabDone = (stepsRevealed[idx] || 1) >= item.steps.length;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(idx)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: isTabActive ? '2px solid #0284C7' : '1px solid #E2E8F0',
                  background: isTabActive ? '#F0F9FF' : '#FFFFFF',
                  color: isTabActive ? '#0369A1' : '#475569',
                  fontWeight: isTabActive ? 800 : 600,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.45rem',
                  fontFamily: "'Times New Roman', Times, serif",
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{item.id === 1 ? '1️⃣' : '2️⃣'}</span>
                <span>{item.title}</span>
                {isTabDone && (
                  <span style={{ fontSize: '0.75rem', color: '#059669', background: '#ECFDF5', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── KOTAK SOAL & DATA DIKETAHUI ────────────────────────────── */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          padding: '1.2rem',
          border: '1px solid #E2E8F0',
          marginBottom: '1.25rem'
        }}>
          <div style={{
            fontSize: '0.76rem',
            fontWeight: 800,
            color: '#0284C7',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '0.35rem'
          }}>
            {currentContoh.badge}
          </div>
          <h4 style={{ margin: '0 0 0.65rem', fontSize: '1.08rem', color: '#0F172A', fontWeight: 800 }}>
            {currentContoh.problem}
          </h4>

          {/* Grid Informasi Diketahui */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.5rem',
            background: '#FFFFFF',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            fontSize: '0.84rem'
          }}>
            {currentContoh.given.map((g, i) => (
              <div key={i}>
                <span style={{ color: '#64748B' }}>{g.label}: </span>
                <strong style={{ color: '#0F172A' }}>{g.value}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* ── LANGKAH-LANGKAH PEMBAHASAN BERTURUT-TURUT ──────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.25rem' }}>
          {currentContoh.steps.slice(0, currentRevealed).map((step, sIdx) => (
            <div
              key={step.stepNumber}
              className="fade-in"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1rem 1.2rem',
                borderLeft: '4px solid #0284C7'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{
                  background: '#0284C7',
                  color: '#FFFFFF',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 800
                }}>
                  {step.stepNumber}
                </span>
                <strong style={{ fontSize: '0.96rem', color: '#0F172A' }}>
                  {step.title}
                </strong>
              </div>

              {/* Rumus & Perhitungan Monospace */}
              <div style={{
                background: '#F1F5F9',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: '0.88rem',
                color: '#0F172A',
                marginBottom: '0.45rem',
                border: '1px solid #CBD5E1'
              }}>
                <div style={{ color: '#475569', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                  Rumus: {step.formula}
                </div>
                <div style={{ fontWeight: 800, color: '#0369A1' }}>
                  Perhitungan: {step.calculation}
                </div>
              </div>

              <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.45 }}>
                {step.explanation}
              </p>
            </div>
          ))}
        </div>

        {/* Kotak Catatan Penting Saat Langkah Terakhir Terbuka */}
        {currentRevealed >= maxSteps && (
          <div className="fade-in" style={{
            background: '#FEF3C7',
            border: '1.5px solid #FCD34D',
            borderRadius: '10px',
            padding: '0.85rem 1.1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem'
          }}>
            <span style={{ fontSize: '1.3rem' }}>💡</span>
            <div style={{ fontSize: '0.88rem', color: '#92400E', lineHeight: 1.45 }}>
              <strong>Catatan Penting: </strong>{currentContoh.note}
            </div>
          </div>
        )}

        {/* ── KONTROL LANGKAH (LANGKAH BERIKUTNYA & ULANGI) ─────────── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderTop: '1px solid #F1F5F9',
          paddingTop: '0.9rem'
        }}>
          <Button
            variant="outline"
            onClick={handleResetSteps}
            disabled={currentRevealed <= 1}
            style={{
              padding: '0.6rem 1.1rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            ↺ Ulangi Dari Awal
          </Button>

          {currentRevealed < maxSteps ? (
            <Button
              variant="primary"
              onClick={handleNextStep}
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.94rem',
                fontWeight: 700,
                background: '#0284C7',
                fontFamily: "'Times New Roman', Times, serif"
              }}
            >
              Langkah Berikutnya ({currentRevealed + 1}/{maxSteps}) →
            </Button>
          ) : (
            <div style={{
              fontSize: '0.88rem',
              fontWeight: 800,
              color: '#059669',
              background: '#ECFDF5',
              border: '1px solid #86EFAC',
              padding: '0.45rem 1rem',
              borderRadius: '8px'
            }}>
              ✓ Pembahasan Lengkap Terbuka
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
