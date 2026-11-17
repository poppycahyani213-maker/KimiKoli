import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

/**
 * Komponen ContohSoalBab2
 * 
 * Menyajikan 3 contoh soal terstruktur seputar Hukum Raoult & Kenaikan Titik Didih:
 * 1. Penurunan Tekanan Uap (Glukosa dalam Air pada 20°C)
 * 2. Kenaikan Titik Didih (Urea dalam Air, Kb = 0,52 °C/m)
 * 3. Penentuan Massa Molar (Mr) zat tak dikenal dari data kenaikan titik didih
 * 
 * Menggunakan progressive disclosure bertahap dengan tombol langkah berikutnya dan ulangi.
 */
export default function ContohSoalBab2() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [stepsRevealed, setStepsRevealed] = useState({ 0: 1, 1: 1, 2: 1 });

  const questionsData = [
    // CONTOH 1: Penurunan Tekanan Uap (Hukum Raoult)
    {
      id: 1,
      badge: "Contoh 1 • Penurunan Tekanan Uap (Raoult)",
      title: "Glukosa dalam Air pada Suhu 20°C",
      problem: "Sebanyak 18 gram glukosa (C₆H₁₂O₆, Mr = 180) dilarutkan ke dalam 90 gram air murni (Mr = 18). Jika tekanan uap jenuh air murni (P°) pada suhu 20°C adalah 17,5 mmHg, hitunglah: (a) Fraksi mol glukosa (Xt) dan air (Xp), (b) Penurunan tekanan uap jenuh larutan (ΔP), dan (c) Tekanan uap jenuh larutan (P).",
      given: [
        { label: "Massa glukosa (zat terlarut)", value: "18 gram" },
        { label: "Mr glukosa", value: "180 g/mol" },
        { label: "Massa air (pelarut)", value: "90 gram" },
        { label: "Mr air (H₂O)", value: "18 g/mol" },
        { label: "Tekanan uap air murni (P°)", value: "17,5 mmHg pada 20°C" }
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Menghitung Jumlah Mol Masing-Masing Komponen",
          formula: "n = massa / Mr",
          calculation: "n_glukosa = 18 g / 180 g/mol = 0,1 mol  |  n_air = 90 g / 18 g/mol = 5,0 mol",
          result: "n_glukosa = 0,1 mol ; n_air = 5,0 mol",
          explanation: "Hitung mol zat terlarut dan pelarut terlebih dahulu untuk menentukan perbandingan fraksi partikel."
        },
        {
          stepNumber: 2,
          title: "Menghitung Fraksi Mol Terlarut (Xt) dan Pelarut (Xp)",
          formula: "Xt = nt / (nt + np)   dan   Xp = 1 − Xt",
          calculation: "ntot = 0,1 + 5,0 = 5,1 mol  →  Xt = 0,1 / 5,1 = 0,0196  →  Xp = 5,0 / 5,1 = 0,9804",
          result: "Xt = 0,0196  ;  Xp = 0,9804",
          explanation: "Sekitar 1,96% dari seluruh molekul di permukaan larutan adalah molekul glukosa penghalang penguapan."
        },
        {
          stepNumber: 3,
          title: "Menghitung Penurunan Tekanan Uap (ΔP)",
          formula: "ΔP = Xt × P°",
          calculation: "ΔP = 0,0196 × 17,5 mmHg = 0,343 mmHg",
          result: "ΔP = 0,343 mmHg",
          explanation: "Kehadiran glukosa menurunkan kemampuan molekul air lepas ke udara sebesar 0,343 mmHg."
        },
        {
          stepNumber: 4,
          title: "Menghitung Tekanan Uap Jenuh Larutan (P)",
          formula: "P = P° − ΔP   (atau P = Xp × P°)",
          calculation: "P = 17,5 mmHg − 0,343 mmHg = 17,157 mmHg  (atau 0,9804 × 17,5 = 17,157 mmHg)",
          result: "P = 17,157 mmHg",
          explanation: "Tekanan uap larutan selalu lebih rendah daripada pelarut murninya (17,157 mmHg < 17,5 mmHg)."
        }
      ]
    },

    // CONTOH 2: Kenaikan Titik Didih Nonelektrolit
    {
      id: 2,
      badge: "Contoh 2 • Kenaikan Titik Didih",
      title: "Larutan Urea dalam Air",
      problem: "Sebanyak 15 gram urea (CO(NH₂)₂, Mr = 60) dilarutkan ke dalam 500 gram air murni. Diketahui tetapan kenaikan titik didih molal air Kb = 0,52 °C/m dan titik didih air murni adalah 100 °C pada 1 atm. Hitunglah: (a) Kenaikan titik didih larutan (ΔTb), dan (b) Titik didih larutan urea (Tb).",
      given: [
        { label: "Massa urea (terlarut)", value: "15 gram" },
        { label: "Mr urea", value: "60 g/mol" },
        { label: "Massa air (pelarut, p)", value: "500 gram = 0,5 kg" },
        { label: "Tetapan kenaikan titik didih air (Kb)", value: "0,52 °C/m" },
        { label: "Titik didih normal air (Tb°)", value: "100 °C" }
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Menghitung Jumlah Mol Urea (n)",
          formula: "n = massa / Mr",
          calculation: "n_urea = 15 g / 60 g/mol = 0,25 mol",
          result: "0,25 mol urea",
          explanation: "Urea adalah zat nonelektrolit, sehingga tidak terurai menjadi ion (faktor van 't Hoff i = 1)."
        },
        {
          stepNumber: 2,
          title: "Menghitung Molalitas Larutan (m)",
          formula: "m = n / p(kg)   atau   m = (massa / Mr) × (1000 / p)",
          calculation: "m = 0,25 mol / 0,5 kg = 0,50 m",
          result: "0,50 m (molal)",
          explanation: "Massa air 500 gram wajib dikonversi ke kilogram (0,5 kg). Dihasilkan larutan berkonsentrasi 0,50 molal."
        },
        {
          stepNumber: 3,
          title: "Menghitung Kenaikan Titik Didih (ΔTb)",
          formula: "ΔTb = Kb × m",
          calculation: "ΔTb = 0,52 °C/m × 0,50 m = 0,26 °C",
          result: "ΔTb = +0,26 °C",
          explanation: "Titik didih naik sebesar 0,26 °C karena molekul air memerlukan energi termal lebih untuk mencapai tekanan 1 atm."
        },
        {
          stepNumber: 4,
          title: "Menghitung Titik Didih Akhir Larutan (Tb)",
          formula: "Tb = Tb° + ΔTb",
          calculation: "Tb = 100 °C + 0,26 °C = 100,26 °C",
          result: "Tb = 100,26 °C",
          explanation: "Larutan urea akan mulai mendidih pada suhu 100,26 °C pada tekanan atmosfer standar 1 atm."
        }
      ]
    },

    // CONTOH 3: Penentuan Massa Molar (Mr)
    {
      id: 3,
      badge: "Contoh 3 • Penentuan Mr Zat Tak Dikenal",
      title: "Massa Molar dari Kenaikan Titik Didih",
      problem: "Suatu zat nonelektrolit seberat 9 gram dilarutkan ke dalam 250 gram air murni. Larutan tersebut mendidih pada suhu 100,104 °C pada tekanan 1 atm (Kb air = 0,52 °C/m, Tb° air = 100 °C). Tentukan massa molar (Mr) zat nonelektrolit tersebut!",
      given: [
        { label: "Massa zat tak dikenal", value: "9 gram" },
        { label: "Massa pelarut air (p)", value: "250 gram = 0,25 kg" },
        { label: "Titik didih larutan (Tb)", value: "100,104 °C" },
        { label: "Tetapan Kb air", value: "0,52 °C/m" },
        { label: "Titik didih air murni (Tb°)", value: "100,000 °C" }
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Menghitung Nilai Kenaikan Titik Didih (ΔTb)",
          formula: "ΔTb = Tb − Tb°",
          calculation: "ΔTb = 100,104 °C − 100,000 °C = 0,104 °C",
          result: "ΔTb = 0,104 °C",
          explanation: "Selisih titik didih larutan terhadap pelarut murni merupakan nilai ΔTb yang disebabkan oleh partikel terlarut."
        },
        {
          stepNumber: 2,
          title: "Menghitung Molalitas Larutan (m)",
          formula: "m = ΔTb / Kb",
          calculation: "m = 0,104 °C / 0,52 °C/m = 0,20 m",
          result: "m = 0,20 molal",
          explanation: "Dari tetapan Kb air, kita dapat membalik rumus untuk memperoleh konsentrasi molal larutan."
        },
        {
          stepNumber: 3,
          title: "Menghitung Jumlah Mol Zat Terlarut (n)",
          formula: "n = m × p(kg)",
          calculation: "n = 0,20 mol/kg × 0,25 kg = 0,05 mol",
          result: "0,05 mol zat terlarut",
          explanation: "Karena massa pelarut air adalah 0,25 kg, maka terdapat tepat 0,05 mol molekul zat tak dikenal di dalam larutan."
        },
        {
          stepNumber: 4,
          title: "Menghitung Massa Molar (Mr) Zat",
          formula: "Mr = massa / n",
          calculation: "Mr = 9 gram / 0,05 mol = 180 g/mol",
          result: "Mr = 180 g/mol (Glukosa)",
          explanation: "Massa molar zat terlarut tersebut adalah 180 g/mol, yang cocok dengan senyawa glukosa (C₆H₁₂O₆)!"
        }
      ]
    }
  ];

  const currentQ = questionsData[activeQuestion];
  const currentStepCount = stepsRevealed[activeQuestion] || 1;
  const totalSteps = currentQ.steps.length;
  const isAllStepsRevealed = currentStepCount >= totalSteps;

  const handleNextStep = () => {
    if (currentStepCount < totalSteps) {
      setStepsRevealed(prev => ({
        ...prev,
        [activeQuestion]: (prev[activeQuestion] || 1) + 1
      }));
    }
  };

  const handleResetSteps = () => {
    setStepsRevealed(prev => ({
      ...prev,
      [activeQuestion]: 1
    }));
  };

  const handleRevealAll = () => {
    setStepsRevealed(prev => ({
      ...prev,
      [activeQuestion]: totalSteps
    }));
  };

  return (
    <div style={{ marginBottom: '2rem', fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Contoh Soal & Pembahasan Terbimbing Bab 2"
        subtitle="Pelajari cara menghitung penurunan tekanan uap dan kenaikan titik didih langkah demi langkah"
      >
        {/* TAB NAVIGASI PILIHAN SOAL */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.6rem',
          marginBottom: '1.5rem',
          background: '#F1F5F9',
          padding: '0.4rem',
          borderRadius: '12px'
        }}>
          {questionsData.map((q, idx) => {
            const isActive = activeQuestion === idx;
            const progress = stepsRevealed[idx] || 1;
            const isDone = progress >= q.steps.length;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setActiveQuestion(idx)}
                style={{
                  padding: '0.75rem 1rem',
                  border: 'none',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  background: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? '#0284C7' : '#475569',
                  boxShadow: isActive ? '0 2px 8px rgba(15, 23, 42, 0.08)' : 'none',
                  borderLeft: isActive ? '4px solid #0284C7' : '4px solid transparent',
                  transition: 'all 0.2s ease',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: isActive ? '#0369A1' : '#64748B' }}>
                  Contoh {q.id} {isDone ? '✓' : ''}
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '0.15rem', color: '#0F172A' }}>
                  {q.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* KOTAK SOAL AKTIF */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <span style={{
              background: '#E0F2FE',
              color: '#0369A1',
              padding: '0.25rem 0.65rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 700
            }}>
              {currentQ.badge}
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
              Progress: Langkah {currentStepCount} dari {totalSteps}
            </span>
          </div>

          <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.5 }}>
            {currentQ.problem}
          </h4>

          {/* Data yang Diketahui */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginTop: '0.75rem'
          }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
              📋 Data Diketahui:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.4rem 1rem', fontSize: '0.88rem' }}>
              {currentQ.given.map((item, i) => (
                <div key={i} style={{ color: '#334155' }}>
                  • {item.label}: <strong style={{ color: '#0F172A' }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* DAFTAR LANGKAH PENYELESAIAN (PROGRESSIVE DISCLOSURE) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
          {currentQ.steps.slice(0, currentStepCount).map((step) => (
            <div
              key={step.stepNumber}
              className="fade-in"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                borderLeft: '5px solid #0284C7',
                borderRadius: '12px',
                padding: '1.15rem 1.35rem',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                  <strong style={{ fontSize: '1.02rem', color: '#0F172A' }}>
                    {step.title}
                  </strong>
                </div>
                <span style={{
                  background: '#ECFDF5',
                  color: '#065F46',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  {step.result}
                </span>
              </div>

              {/* Kotak Perhitungan */}
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                margin: '0.65rem 0',
                fontSize: '0.92rem'
              }}>
                <div style={{ color: '#64748B', fontSize: '0.82rem', marginBottom: '0.2rem' }}>
                  Rumus: <code style={{ color: '#0369A1', fontWeight: 700 }}>{step.formula}</code>
                </div>
                <div style={{ color: '#0F172A', fontWeight: 700, fontSize: '1rem', marginTop: '0.3rem' }}>
                  Perhitungan: <span style={{ color: '#0284C7' }}>{step.calculation}</span>
                </div>
              </div>

              <p style={{ margin: '0.4rem 0 0', fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                💡 <em>{step.explanation}</em>
              </p>
            </div>
          ))}
        </div>

        {/* CONTROLS: TOMBOL LANGKAH BERIKUTNYA & ULANGI */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #E2E8F0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              onClick={handleNextStep}
              disabled={isAllStepsRevealed}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.65rem 1.35rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                background: isAllStepsRevealed ? '#94A3B8' : '#0284C7',
                cursor: isAllStepsRevealed ? 'not-allowed' : 'pointer'
              }}
            >
              {isAllStepsRevealed ? '✓ Seluruh Langkah Terbuka' : `Langkah berikutnya (${currentStepCount + 1}/${totalSteps}) →`}
            </Button>

            {!isAllStepsRevealed && (
              <button
                type="button"
                onClick={handleRevealAll}
                className="btn btn-outline"
                style={{
                  padding: '0.65rem 1.15rem',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#475569',
                  borderColor: '#CBD5E1',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                Buka Semua Langkah
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleResetSteps}
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.65rem 1.25rem',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: '#475569',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer'
            }}
          >
            <span>↺</span> Ulangi Pembahasan
          </button>
        </div>
      </Card>
    </div>
  );
}

