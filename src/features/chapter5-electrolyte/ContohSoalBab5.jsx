import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { GUIDED_EXAMPLES_BAB5 } from './chapter5Data';

/**
 * Komponen ContohSoalBab5
 * 
 * Menyajikan 2 contoh soal terstruktur seputar Sifat Koligatif Elektrolit & Faktor van 't Hoff:
 * 1. Kalsium Klorida CaCl2 (Elektrolit Kuat Terner, n = 3, α = 1)
 * 2. Penentuan Derajat Ionisasi (α) Asam Lemah HA dari Penurunan Titik Beku
 * 
 * Menggunakan progressive disclosure bertahap dengan tombol langkah berikutnya, buka semua, dan ulangi.
 */
export default function ContohSoalBab5() {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [stepsRevealed, setStepsRevealed] = useState({ 0: 1, 1: 1 });

  const currentQ = GUIDED_EXAMPLES_BAB5[activeQuestion];
  const currentStep = stepsRevealed[activeQuestion] || 1;
  const totalSteps = currentQ.steps.length;

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setStepsRevealed(prev => ({ ...prev, [activeQuestion]: currentStep + 1 }));
    }
  };

  const handleRevealAll = () => {
    setStepsRevealed(prev => ({ ...prev, [activeQuestion]: totalSteps }));
  };

  const handleReset = () => {
    setStepsRevealed(prev => ({ ...prev, [activeQuestion]: 1 }));
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", marginBottom: '1.5rem' }}>
      <Card
        title="Contoh Soal & Pembahasan Terbimbing (Elaborasi Mandiri)"
        subtitle="Pelajari cara menerapkan rumus faktor van 't Hoff (i) pada perhitungan kenaikan titik didih, penurunan titik beku, dan derajat ionisasi secara bertahap."
      >
        {/* Tab Pemilihan Contoh Soal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '0.65rem',
          marginBottom: '1.5rem'
        }}>
          {GUIDED_EXAMPLES_BAB5.map((q, idx) => {
            const isActive = activeQuestion === idx;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setActiveQuestion(idx)}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: isActive ? '2px solid #0284C7' : '1.5px solid #E2E8F0',
                  background: isActive ? '#EFF6FF' : '#FFFFFF',
                  color: isActive ? '#0369A1' : '#475569',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isActive ? '0 2px 8px rgba(2, 132, 199, 0.12)' : 'none',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: isActive ? '#0284C7' : '#64748B' }}>
                  {q.badge}
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 700, marginTop: '0.2rem', color: '#0F172A' }}>
                  {q.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Kotak Soal Aktif */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          borderRadius: '14px',
          padding: '1.35rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📖</span>
            <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>
              {currentQ.title}
            </strong>
          </div>

          <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#1E293B', lineHeight: 1.65 }}>
            {currentQ.problem}
          </p>

          {/* Variabel Diketahui */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '0.85rem 1.1rem'
          }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.45rem' }}>
              Data yang Diketahui dari Soal:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
              {currentQ.given.map((item, gIdx) => (
                <div key={gIdx} style={{ fontSize: '0.88rem', color: '#334155' }}>
                  <span style={{ color: '#64748B' }}>• {item.label}:</span>{' '}
                  <strong style={{ color: '#0F172A' }}>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Langkah Pembahasan Bertahap (Progressive Disclosure) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {currentQ.steps.slice(0, currentStep).map((st) => (
            <div
              key={st.stepNumber}
              className="fade-in"
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #BAE6FD',
                borderLeft: '5px solid #0284C7',
                borderRadius: '12px',
                padding: '1.15rem 1.35rem',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.05)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  background: '#ECFEFF',
                  color: '#0891B2',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px'
                }}>
                  Langkah {st.stepNumber} dari {totalSteps}
                </span>
                <strong style={{ fontSize: '0.95rem', color: '#0369A1' }}>
                  {st.title}
                </strong>
              </div>

              {/* Rumus */}
              <div style={{
                background: '#F8FAFC',
                border: '1px dashed #CBD5E1',
                borderRadius: '8px',
                padding: '0.55rem 0.85rem',
                marginBottom: '0.65rem',
                fontSize: '0.92rem',
                color: '#1E293B',
                fontFamily: 'monospace'
              }}>
                <span style={{ color: '#64748B', fontFamily: "'Times New Roman', Times, serif" }}>Rumus: </span>
                <strong>{st.formula}</strong>
              </div>

              {/* Perhitungan */}
              <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', color: '#334155', lineHeight: 1.6 }}>
                <strong>Substitusi Nilai:</strong> {st.calculation}
              </p>

              {/* Hasil Langkah */}
              <div style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '8px',
                padding: '0.5rem 0.85rem',
                marginBottom: '0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}>
                <span style={{ color: '#059669', fontWeight: 800 }}>✓ Hasil Langkah {st.stepNumber}:</span>
                <strong style={{ color: '#065F46' }}>{st.result}</strong>
              </div>

              {/* Penjelasan Makna Fisis */}
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>
                💡 {st.explanation}
              </p>
            </div>
          ))}
        </div>

        {/* Kontrol Langkah */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid #E2E8F0'
        }}>
          <div style={{ fontSize: '0.88rem', color: '#64748B' }}>
            Menampilkan langkah <strong>{currentStep}</strong> dari <strong>{totalSteps}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '0.5rem 0.9rem',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#64748B',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                ↺ Ulangi Pembahasan
              </button>
            )}

            {currentStep < totalSteps ? (
              <>
                <button
                  type="button"
                  onClick={handleRevealAll}
                  style={{
                    padding: '0.5rem 0.9rem',
                    border: '1px solid #CBD5E1',
                    background: '#F8FAFC',
                    color: '#334155',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                >
                  Buka Semua Langkah
                </button>
                <Button
                  variant="primary"
                  onClick={handleNextStep}
                  style={{
                    padding: '0.55rem 1.25rem',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    background: '#0284C7'
                  }}
                >
                  Langkah Berikutnya ({currentStep + 1}/{totalSteps}) →
                </Button>
              </>
            ) : (
              <span style={{
                background: '#ECFDF5',
                color: '#065F46',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                border: '1px solid #A7F3D0'
              }}>
                ✓ Seluruh Langkah Selesai Dipelajari
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
