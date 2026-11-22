import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { DIAGNOSTIC_QUESTIONS } from './chapter5Data';

/**
 * Komponen DiagnosticTest
 * 
 * Digunakan pada:
 * 1. Mode 'pre' (Fase 1: Engagement):
 *    - 4 soal pilihan ganda pemetaan miskonsepsi awal.
 *    - Tidak dinilai / bebas penghakiman; jawaban disimpan ke localStorage.
 * 2. Mode 'post' (Fase 5: Evaluation):
 *    - Mengulang 4 soal yang sama setelah belajar.
 *    - Menampilkan tabel perbandingan reflektif (Jawaban Pra vs Jawaban Pasca)
 *      beserta kunci konsep ilmiah untuk mengukur perubahan konseptual siswa.
 */
export default function DiagnosticTest({
  mode = 'pre', // 'pre' | 'post'
  initialAnswers = {},
  preAnswers = {},
  onComplete
}) {
  const [answers, setAnswers] = useState(() => ({
    d1: initialAnswers?.d1 || '',
    d2: initialAnswers?.d2 || '',
    d3: initialAnswers?.d3 || '',
    d4: initialAnswers?.d4 || ''
  }));

  const [isSubmitted, setIsSubmitted] = useState(() => {
    return Boolean(initialAnswers?.d1 && initialAnswers?.d2 && initialAnswers?.d3 && initialAnswers?.d4);
  });

  const allAnswered = Boolean(answers.d1 && answers.d2 && answers.d3 && answers.d4);

  const handleSelect = (questionId, key) => {
    if (isSubmitted && mode === 'pre') return;
    setAnswers(prev => ({ ...prev, [questionId]: key }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!allAnswered) return;
    setIsSubmitted(true);
    if (typeof onComplete === 'function') {
      onComplete(answers);
    }
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", marginBottom: '1.5rem' }}>
      <Card
        title={mode === 'pre' ? "🧭 Uji Diagnostik Pra-Konsepsi Awal (Fase Engagement)" : "📊 Post-Test Diagnostik & Analisis Perubahan Konseptual"}
        subtitle={
          mode === 'pre'
            ? "Pilihlah jawaban menurut pemahaman atau intuisimu saat ini. Uji ini TIDAK dinilai dengan skor menghakimi, melainkan untuk memetakan pemahaman awalmu sebelum melakukan eksperimen."
            : "Jawab kembali 4 pertanyaan awal ini setelah kamu mempelajari teori dan eksperimen untuk melihat perkembangan pemahaman kimiamu!"
        }
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {DIAGNOSTIC_QUESTIONS.map((q) => {
              const selectedKey = answers[q.id];
              return (
                <div
                  key={q.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      background: '#EFF6FF',
                      color: '#0284C7',
                      padding: '0.2rem 0.65rem',
                      borderRadius: '6px'
                    }}>
                      Pertanyaan Diagnostik {q.number} dari 4
                    </span>
                    {selectedKey && (
                      <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
                        ✓ Terpilih: Opsi {selectedKey}
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '0 0 1rem 0', fontSize: '1.02rem', color: '#0F172A', lineHeight: 1.6 }}>
                    <strong>{q.number}.</strong> {q.question}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {q.options.map((opt) => {
                      const isSelected = selectedKey === opt.key;
                      return (
                        <div
                          key={opt.key}
                          onClick={() => handleSelect(q.id, opt.key)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            padding: '0.65rem 0.9rem',
                            borderRadius: '8px',
                            background: isSelected ? '#F0F9FF' : '#F8FAFC',
                            border: isSelected ? '2px solid #0284C7' : '1.5px solid #E2E8F0',
                            color: isSelected ? '#0369A1' : '#334155',
                            cursor: isSubmitted && mode === 'pre' ? 'default' : 'pointer',
                            transition: 'all 0.15s ease',
                            fontSize: '0.95rem',
                            lineHeight: 1.5
                          }}
                        >
                          <span style={{
                            fontWeight: 800,
                            minWidth: '22px',
                            color: isSelected ? '#0284C7' : '#64748B'
                          }}>
                            {opt.key}.
                          </span>
                          <span style={{ flex: 1 }}>{opt.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tombol Simpan / Kirim */}
          {(!isSubmitted || mode === 'post') && (
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="primary"
                disabled={!allAnswered}
                style={{
                  padding: '0.75rem 1.6rem',
                  fontSize: '0.98rem',
                  fontWeight: 700,
                  background: allAnswered ? '#0284C7' : '#94A3B8',
                  boxShadow: allAnswered ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none'
                }}
              >
                {mode === 'pre'
                  ? 'Simpan Prediksi Awal & Siap Eksplorasi →'
                  : 'Bandingkan Hasil Pre vs Post Test →'}
              </Button>
            </div>
          )}
        </form>

        {/* FEEDBACK MODE PRE (Pemberitahuan ramah) */}
        {mode === 'pre' && isSubmitted && (
          <div
            className="fade-in"
            style={{
              marginTop: '1.25rem',
              background: '#ECFDF5',
              border: '1.5px solid #A7F3D0',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div>
              <strong style={{ color: '#065F46', fontSize: '0.98rem', display: 'block' }}>
                🎉 Prediksi Awal Berhasil Disimpan!
              </strong>
              <span style={{ color: '#047857', fontSize: '0.88rem' }}>
                Pilihanmu telah tercatat aman. Sekarang, mari uji prediksimu secara langsung di laboratorium simulasi pada tahap Eksplorasi!
              </span>
            </div>
          </div>
        )}

        {/* TABEL PERBANDINGAN SEBELUM DAN SESUDAH (Hanya di Mode Post-Test) */}
        {mode === 'post' && isSubmitted && (
          <div
            className="fade-in"
            style={{
              marginTop: '2rem',
              background: '#FFFFFF',
              border: '2px solid #86EFAC',
              borderRadius: '14px',
              padding: '1.35rem',
              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.08)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
              <div>
                <strong style={{ fontSize: '1.1rem', color: '#065F46', display: 'block' }}>
                  Matriks Perubahan Konsepsi Ilmiah (Conceptual Change Matrix)
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Bandingkan jawaban intuitifmu di awal bab (Engagement) dengan pemahaman barumu di akhir bab (Evaluation).
                </span>
              </div>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#334155' }}>
                    <th style={{ padding: '0.75rem 0.85rem', textAlign: 'left', width: '22%' }}>Fokus Konsep</th>
                    <th style={{ padding: '0.75rem 0.85rem', textAlign: 'center', width: '15%' }}>Jawaban Awal (Pre)</th>
                    <th style={{ padding: '0.75rem 0.85rem', textAlign: 'center', width: '18%' }}>Jawaban Akhir (Post)</th>
                    <th style={{ padding: '0.75rem 0.85rem', textAlign: 'left', width: '45%' }}>Konsep Ilmiah yang Benar</th>
                  </tr>
                </thead>
                <tbody>
                  {DIAGNOSTIC_QUESTIONS.map((q) => {
                    const preVal = preAnswers?.[q.id] || answers[q.id];
                    const postVal = answers[q.id];
                    const isCorrectNow = postVal === q.correctKey;
                    const changedForBetter = preVal !== q.correctKey && postVal === q.correctKey;

                    return (
                      <tr key={q.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '0.75rem 0.85rem', fontWeight: 700, color: '#0F172A' }}>
                          Soal {q.number}: {q.id === 'd1' ? 'Disosiasi Ion Partikel' : q.id === 'd2' ? 'Perbandingan Titik Beku' : q.id === 'd3' ? 'Faktor i Tiap Garam' : 'Elektrolit Lemah vs Kuat'}
                        </td>
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center', color: '#64748B' }}>
                          <span style={{ background: '#F1F5F9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                            Opsi {preVal || '-'}
                          </span>
                        </td>
                        <td style={{ padding: '0.75rem 0.85rem', textAlign: 'center' }}>
                          <span style={{
                            background: isCorrectNow ? '#DCFCE7' : '#FEE2E2',
                            color: isCorrectNow ? '#15803D' : '#B91C1C',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            <span>{isCorrectNow ? '✓' : '✗'}</span> Opsi {postVal}
                          </span>
                          {changedForBetter && (
                            <span style={{ display: 'block', fontSize: '0.72rem', color: '#059669', fontWeight: 800, marginTop: '0.2rem' }}>
                              📈 Mengalami Kemajuan!
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 0.85rem', color: '#334155', lineHeight: 1.5 }}>
                          <strong style={{ color: '#0284C7' }}>Kunci: Opsi {q.correctKey}</strong>
                          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#475569' }}>
                            {q.explanation}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
