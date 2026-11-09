import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

/**
 * Komponen ContohSoal
 * 
 * Menyajikan 3 contoh soal terstruktur seputar perhitungan satuan konsentrasi larutan:
 * 1. Urea dalam Air: Molalitas (m) dan Fraksi Mol (X)
 * 2. Glukosa dengan Massa Jenis: Konversi Molaritas (M) ke Molalitas (m)
 * 3. Kadar % Massa: Konversi ke Molalitas (m) dan Fraksi Mol (X)
 * 
 * Pembahasan dibuka bertahap langkah demi langkah dengan tombol "Langkah berikutnya"
 * dan dapat diulang kembali dengan tombol "Ulangi".
 */
export default function ContohSoal() {
  const [activeQuestion, setActiveQuestion] = useState(0); // 0, 1, 2
  const [stepsRevealed, setStepsRevealed] = useState({ 0: 1, 1: 1, 2: 1 });

  const questionsData = [
    // SOAL 1: Urea dalam Air
    {
      id: 1,
      badge: "Contoh 1 • Molalitas & Fraksi Mol",
      title: "Urea dalam Air Murni",
      problem: "Sebanyak 6 gram urea (CO(NH₂)₂, Mr = 60) dilarutkan ke dalam 200 gram air murni (Mr = 18). Hitunglah: (a) Molalitas larutan urea, (b) Fraksi mol urea, dan (c) Fraksi mol air.",
      given: [
        { label: "Massa urea (terlarut)", value: "6 gram" },
        { label: "Mr urea", value: "60 g/mol" },
        { label: "Massa air (pelarut, p)", value: "200 gram = 0,2 kg" },
        { label: "Mr air (H₂O)", value: "18 g/mol" }
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Menghitung Jumlah Mol Zat Terlarut (Urea)",
          formula: "n = massa / Mr",
          calculation: "n_urea = 6 g / 60 g/mol = 0,1 mol",
          result: "0,1 mol urea",
          explanation: "Pondasi perhitungan sifat koligatif diawali dengan mencari kuantitas partikel (mol)."
        },
        {
          stepNumber: 2,
          title: "Menghitung Molalitas Larutan (m)",
          formula: "m = n_terlarut / p (kg)  atau  m = (massa / Mr) × (1000 / p)",
          calculation: "m = 0,1 mol / 0,2 kg = 0,5 m",
          result: "0,5 m (molal)",
          explanation: "Massa pelarut air (200 g) wajib diubah ke kilogram (0,2 kg), sehingga menghasilkan 0,5 mol urea per kg pelarut air."
        },
        {
          stepNumber: 3,
          title: "Menghitung Jumlah Mol Pelarut (Air)",
          formula: "n_air = massa air / Mr air",
          calculation: "n_air = 200 g / 18 g/mol = 11,11 mol",
          result: "11,11 mol air",
          explanation: "Mol pelarut air diperlukan untuk mencari perbandingan fraksi mol dalam campuran."
        },
        {
          stepNumber: 4,
          title: "Menghitung Fraksi Mol Urea (X_urea)",
          formula: "X_urea = n_urea / (n_urea + n_air)",
          calculation: "X_urea = 0,1 / (0,1 + 11,11) = 0,1 / 11,21 = 0,0089",
          result: "X_urea = 0,0089",
          explanation: "Fraksi mol urea bernilai 0,0089 (tanpa satuan), yang berarti 0,89% dari seluruh partikel di dalam larutan adalah molekul urea."
        },
        {
          stepNumber: 5,
          title: "Menghitung Fraksi Mol Pelarut Air (X_air)",
          formula: "X_air = 1 − X_urea  atau  X_air = n_air / n_total",
          calculation: "X_air = 1 − 0,0089 = 0,9911  (atau 11,11 / 11,21 = 0,9911)",
          result: "X_air = 0,9911",
          explanation: "Jumlah total seluruh fraksi mol komponen larutan selalu tepat bernilai 1 (X_urea + X_air = 1)."
        }
      ]
    },

    // SOAL 2: Glukosa dengan Massa Jenis
    {
      id: 2,
      badge: "Contoh 2 • Konversi Molaritas (M) ke Molalitas (m)",
      title: "Glukosa dengan Massa Jenis Larutan",
      problem: "Sebanyak 9 gram glukosa (C₆H₁₂O₆, Mr = 180) dilarutkan dalam air hingga volume larutan tepat 250 mL. Jika massa jenis larutan (ρ) terukur 1,02 g/mL, hitunglah Molaritas (M), Molalitas (m), dan bandingkan nilai keduanya.",
      given: [
        { label: "Massa glukosa", value: "9 gram" },
        { label: "Mr glukosa", value: "180 g/mol" },
        { label: "Volume larutan (V)", value: "250 mL = 0,25 L" },
        { label: "Massa jenis larutan (ρ)", value: "1,02 g/mL" }
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Menghitung Jumlah Mol Glukosa",
          formula: "n = massa / Mr",
          calculation: "n_glukosa = 9 g / 180 g/mol = 0,05 mol",
          result: "0,05 mol glukosa",
          explanation: "Jumlah mol zat terlarut yang sama akan digunakan untuk mencari Molaritas (M) maupun Molalitas (m)."
        },
        {
          stepNumber: 2,
          title: "Menghitung Molaritas Larutan (M)",
          formula: "M = n / V (Liter)",
          calculation: "M = 0,05 mol / 0,25 L = 0,20 M",
          result: "0,20 M (Molar)",
          explanation: "Molaritas membagi mol zat dengan total volume larutan dalam Liter (250 mL = 0,25 L)."
        },
        {
          stepNumber: 3,
          title: "Menghitung Massa Total Larutan dari Massa Jenis",
          formula: "massa larutan = ρ × V",
          calculation: "massa larutan = 1,02 g/mL × 250 mL = 255 gram",
          result: "255 gram larutan",
          explanation: "Massa jenis menghubungkan volume larutan dengan massa total seluruh larutan (terlarut + pelarut)."
        },
        {
          stepNumber: 4,
          title: "Menghitung Massa Pelarut Air Murni (p)",
          formula: "massa air (p) = massa larutan − massa zat terlarut",
          calculation: "massa air = 255 g − 9 g = 246 gram = 0,246 kg",
          result: "246 gram air (0,246 kg)",
          explanation: "Ingat! Molalitas hanya memerlukan massa pelarut air murni, BUKAN massa larutan total."
        },
        {
          stepNumber: 5,
          title: "Menghitung Molalitas Larutan (m)",
          formula: "m = n / p (kg)",
          calculation: "m = 0,05 mol / 0,246 kg = 0,203 m",
          result: "0,203 m (molal)",
          explanation: "Molalitas diperoleh dengan membagi 0,05 mol dengan 0,246 kg pelarut air murni."
        },
        {
          stepNumber: 6,
          title: "Kesimpulan & Analisis Perbandingan Nilai M vs m",
          formula: "M = 0,20 M   vs   m = 0,203 m",
          calculation: "0,20 M ≈ 0,203 m  (Hampir sama, namun tidak identik)",
          result: "M ≈ m pada larutan sangat encer",
          explanation: "Pada larutan yang sangat encer (kadar zat terlarut sedikit), nilai Molaritas (M) hampir sama dengan Molalitas (m) karena kerapatan larutan mendekati air murni (1 g/mL). Namun keduanya tetap berbeda konsep: Molaritas berbasis volume larutan (terpengaruh suhu), sedangkan Molalitas berbasis massa pelarut (kebal suhu)."
        }
      ]
    },

    // SOAL 3: Kadar % Massa
    {
      id: 3,
      badge: "Contoh 3 • Konversi Kadar % Massa",
      title: "Larutan Glukosa 18% Massa",
      problem: "Suatu larutan glukosa (Mr = 180) di laboratorium memiliki konsentrasi 18% massa dalam pelarut air (Mr = 18). Hitunglah Molalitas (m) dan Fraksi mol glukosa (X_glukosa) larutan tersebut.",
      given: [
        { label: "Kadar larutan", value: "18% massa glukosa" },
        { label: "Mr glukosa", value: "180 g/mol" },
        { label: "Mr air", value: "18 g/mol" }
      ],
      steps: [
        {
          stepNumber: 1,
          title: "Pemisalan Basis 100 gram Larutan",
          formula: "Basis = 100 gram larutan",
          calculation: "Massa glukosa = 18% × 100 g = 18 g  |  Massa air = 100 g − 18 g = 82 g = 0,082 kg",
          result: "18 g glukosa & 82 g air",
          explanation: "Strategi termudah menyelesaikan soal persen massa adalah mengasumsikan kita memiliki 100 gram larutan total."
        },
        {
          stepNumber: 2,
          title: "Menghitung Jumlah Mol Masing-masing Komponen",
          formula: "n_glukosa = 18 / 180   |   n_air = 82 / 18",
          calculation: "n_glukosa = 18 g / 180 g/mol = 0,1 mol  |  n_air = 82 g / 18 g/mol = 4,556 mol",
          result: "n_glukosa = 0,1 mol ; n_air = 4,556 mol",
          explanation: "Diperoleh 0,1 mol glukosa terlarut di dalam 4,556 mol molekul pelarut air."
        },
        {
          stepNumber: 3,
          title: "Menghitung Molalitas Larutan (m)",
          formula: "m = n_glukosa / p (kg)",
          calculation: "m = 0,1 mol / 0,082 kg = 1,22 m  (atau 0,1 × 1000 / 82 = 1,22 m)",
          result: "1,22 m (molal)",
          explanation: "Molalitas larutan glukosa 18% massa adalah 1,22 molal (terdapat 1,22 mol glukosa per 1 kg air murni)."
        },
        {
          stepNumber: 4,
          title: "Menghitung Fraksi Mol Glukosa (X_glukosa)",
          formula: "X_glukosa = n_glukosa / (n_glukosa + n_air)",
          calculation: "n_total = 0,1 + 4,556 = 4,656 mol  |  X_glukosa = 0,1 / 4,656 = 0,0215",
          result: "X_glukosa = 0,0215",
          explanation: "Fraksi mol glukosa adalah 0,0215. Artinya, dari setiap 10.000 partikel dalam larutan, terdapat 215 partikel molekul glukosa."
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
        [activeQuestion]: prev[activeQuestion] + 1
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
        title="Contoh Soal & Pembahasan Terbimbing"
        subtitle="Pelajari teknik menghitung satuan konsentrasi larutan langkah demi langkah secara mandiri"
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
          {currentQ.steps.slice(0, currentStepCount).map((step, idx) => (
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
