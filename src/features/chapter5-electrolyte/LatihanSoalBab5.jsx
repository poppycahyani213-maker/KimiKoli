import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { NUMERIC_QUESTIONS_BAB5, MC_QUESTIONS_BAB5 } from './chapter5Data';

/**
 * Komponen LatihanSoalBab5
 * 
 * Mengikuti pola ketat Bab 1 (LatihanSoal.jsx):
 * - 8 soal dinilai (6 numerik + 2 pilihan ganda) + 1 soal refleksi (wajib diisi, tidak dinilai otomatis)
 * - Setiap soal dinilai dari jawaban pertama; setelah dijawab, input terkunci
 * - Isian angka: toleransi ±2%, menerima koma (,) atau titik (.) sebagai desimal
 * - Hint jika salah: memberikan panduan langkah bertahap tanpa membocorkan angka jawaban
 * - Setelah 8 soal dijawab dan refleksi diisi → tampilkan panel ringkasan skor (x/8)
 *   - Skor ≥ 6 (KKM 75%): tampilkan pembahasan lengkap semua soal, panggil onLatihanLulus
 *   - Skor < 6: tampilkan nomor soal yang salah + tombol "Ulangi Latihan"
 */
export default function LatihanSoalBab5({ onLatihanLulus, savedState = null }) {
  const initAnswers = () => ({
    q1: savedState?.answers?.q1 || '',
    q2: savedState?.answers?.q2 || '',
    q3: savedState?.answers?.q3 || '',
    q4: savedState?.answers?.q4 || '',
    q5: savedState?.answers?.q5 || '',
    q6: savedState?.answers?.q6 || '',
    q7: savedState?.answers?.q7 || '',
    q8: savedState?.answers?.q8 || ''
  });

  const initStatus = () => ({
    q1: savedState?.status?.q1 || null,
    q2: savedState?.status?.q2 || null,
    q3: savedState?.status?.q3 || null,
    q4: savedState?.status?.q4 || null,
    q5: savedState?.status?.q5 || null,
    q6: savedState?.status?.q6 || null,
    q7: savedState?.status?.q7 || null,
    q8: savedState?.status?.q8 || null
  });

  const [answers, setAnswers] = useState(initAnswers);
  const [status, setStatus] = useState(initStatus);
  const [refleksi, setRefleksi] = useState(savedState?.refleksi || '');
  const [refleksiSubmitted, setRefleksiSubmitted] = useState(Boolean(savedState?.refleksiSubmitted));
  const [showSummary, setShowSummary] = useState(Boolean(savedState?.showSummary));
  const [passed, setPassed] = useState(Boolean(savedState?.passed));

  // Hitung jumlah benar
  const correctCount = Object.values(status).filter(v => v === 'correct').length;

  // Cek apakah seluruh 8 soal sudah dijawab
  const allAnswered = Object.values(status).every(v => v !== null);

  // Siap tampilkan ringkasan: 8 soal sudah dijawab DAN refleksi diisi
  const readyToShowSummary = allAnswered && refleksiSubmitted;

  // Efek: munculkan panel skor otomatis saat syarat lengkap
  useEffect(() => {
    if (readyToShowSummary && !showSummary) {
      setShowSummary(true);
    }
  }, [readyToShowSummary, showSummary]);

  // Efek: jika lulus (skor ≥ 6/8), picu callback ke komponen induk
  useEffect(() => {
    if (showSummary && correctCount >= 6 && !passed) {
      setPassed(true);
      if (typeof onLatihanLulus === 'function') {
        onLatihanLulus({
          score: correctCount,
          total: 8,
          percentage: Math.round((correctCount / 8) * 100),
          answers,
          status,
          refleksi
        });
      }
    }
  }, [showSummary, correctCount, passed, onLatihanLulus, answers, status, refleksi]);

  // ── Handler Cek Numerik ────────────────────────────────────────────────────
  const handleCheckNumeric = (qId, target) => {
    if (status[qId] !== null) return;
    const raw = (answers[qId] || '').trim().replace(',', '.');
    const val = parseFloat(raw);
    if (isNaN(val)) {
      setStatus(prev => ({ ...prev, [qId]: 'incorrect' }));
      return;
    }
    const tolerance = Math.abs(target) * 0.02 + 0.0001;
    const isCorrect = Math.abs(val - target) <= tolerance;
    setStatus(prev => ({ ...prev, [qId]: isCorrect ? 'correct' : 'incorrect' }));
  };

  // ── Handler Pilihan Ganda ──────────────────────────────────────────────────
  const handleSelectOption = (qId, optKey) => {
    if (status[qId] !== null) return;
    setAnswers(prev => ({ ...prev, [qId]: optKey }));
  };

  const handleCheckMC = (qId, correctKey) => {
    if (status[qId] !== null) return;
    if (!answers[qId]) return;
    const isCorrect = answers[qId] === correctKey;
    setStatus(prev => ({ ...prev, [qId]: isCorrect ? 'correct' : 'incorrect' }));
  };

  // ── Handler Soal Refleksi ──────────────────────────────────────────────────
  const handleRefleksiSubmit = (e) => {
    e.preventDefault();
    if (!refleksi.trim()) return;
    setRefleksiSubmitted(true);
  };

  // ── Reset Latihan ──────────────────────────────────────────────────────────
  const handleReset = () => {
    setAnswers({
      q1: '', q2: '', q3: '', q4: '', q5: '', q6: '',
      q7: '', q8: ''
    });
    setStatus({
      q1: null, q2: null, q3: null, q4: null, q5: null, q6: null,
      q7: null, q8: null
    });
    setRefleksi('');
    setRefleksiSubmitted(false);
    setShowSummary(false);
    setPassed(false);
  };

  // Nomor soal yang salah
  const wrongNumbers = [
    ...NUMERIC_QUESTIONS_BAB5.filter(q => status[q.id] === 'incorrect').map(q => q.number),
    ...MC_QUESTIONS_BAB5.filter(q => status[q.id] === 'incorrect').map(q => q.number)
  ].sort((a, b) => a - b);

  return (
    <div style={{ marginBottom: '2rem', fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Latihan Pemahaman Mandiri Bab 5"
        subtitle="8 soal dinilai (jawaban pertama terkunci) + 1 refleksi wajib. KKM ≥ 6/8 (75%) sebagai salah satu syarat membuka tahap akhir."
      >
        {/* ══════════════════════════════════════════════
            PANEL SKOR (muncul setelah seluruh soal diisi)
            ══════════════════════════════════════════════ */}
        {showSummary && (
          <div
            className="fade-in"
            style={{
              marginBottom: '2rem',
              borderRadius: '14px',
              padding: '1.4rem 1.5rem',
              border: correctCount >= 6 ? '2px solid #10B981' : '2px solid #F59E0B',
              background: correctCount >= 6 ? '#ECFDF5' : '#FFFBEB'
            }}
          >
            {correctCount >= 6 ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '2.2rem' }}>🎉</span>
                <div>
                  <strong style={{ color: '#065F46', fontSize: '1.15rem', display: 'block' }}>
                    Lulus! Skor kamu: {correctCount}/8 ({Math.round((correctCount / 8) * 100)}%)
                  </strong>
                  <span style={{ color: '#047857', fontSize: '0.92rem' }}>
                    Hebat! Kamu telah memenuhi KKM (≥ 75%) untuk sifat koligatif larutan elektrolit dan faktor van 't Hoff. Pembahasan lengkap telah terbuka di bawah setiap soal!
                  </span>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>📋</span>
                  <div>
                    <strong style={{ color: '#92400E', fontSize: '1.1rem', display: 'block' }}>
                      Skor kamu: {correctCount}/8 — Belum mencapai KKM (6/8)
                    </strong>
                    <span style={{ color: '#78350F', fontSize: '0.9rem' }}>
                      Nomor soal yang perlu kamu perbaiki:{' '}
                      <strong>{wrongNumbers.map(n => `Soal ${n}`).join(', ')}</strong>
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  style={{
                    padding: '0.6rem 1.4rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    background: '#D97706',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                >
                  🔄 Ulangi Latihan
                </button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════
            SOAL NUMERIK 1 – 6
            ══════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          {NUMERIC_QUESTIONS_BAB5.map(q => {
            const st = status[q.id];
            const locked = st !== null;
            const isCorrect = st === 'correct';
            const isIncorrect = st === 'incorrect';
            const showSolution = isCorrect && showSummary && correctCount >= 6;

            return (
              <div
                key={q.id}
                style={{
                  background: isCorrect ? '#F0FDF4' : isIncorrect ? '#FFF5F5' : '#FFFFFF',
                  border: isCorrect
                    ? '1.5px solid #86EFAC'
                    : isIncorrect
                      ? '1.5px solid #FCA5A5'
                      : '1.5px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Header Soal */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: isCorrect ? '#DCFCE7' : isIncorrect ? '#FEE2E2' : '#F1F5F9',
                    color: isCorrect ? '#15803D' : isIncorrect ? '#B91C1C' : '#475569',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '6px'
                  }}>
                    Soal {q.number} • Isian Singkat Numerik
                  </span>
                  {locked && (
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: isCorrect ? '#16A34A' : '#DC2626'
                    }}>
                      {isCorrect ? '✓ Benar' : '✗ Salah'}
                    </span>
                  )}
                </div>

                {/* Teks Pertanyaan */}
                <p style={{ margin: '0 0 1rem 0', fontSize: '1.02rem', color: '#0F172A', lineHeight: 1.55 }}>
                  <strong>{q.number}.</strong> {q.question}
                </p>

                {/* Input Jawaban */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Ketik angka hasilmu..."
                    value={answers[q.id]}
                    disabled={locked}
                    onChange={e => {
                      if (!locked) setAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !locked) handleCheckNumeric(q.id, q.target);
                    }}
                    style={{
                      padding: '0.6rem 0.9rem',
                      fontSize: '1rem',
                      borderRadius: '8px',
                      border: isCorrect ? '2px solid #22C55E' : isIncorrect ? '2px solid #EF4444' : '1.5px solid #CBD5E1',
                      background: locked ? '#F8FAFC' : '#FFFFFF',
                      color: '#0F172A',
                      width: '210px',
                      outline: 'none',
                      fontFamily: "'Times New Roman', Times, serif"
                    }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>{q.unit}</span>

                  {!locked && (
                    <Button
                      variant="primary"
                      onClick={() => handleCheckNumeric(q.id, q.target)}
                      disabled={!answers[q.id].trim()}
                      style={{ padding: '0.6rem 1.15rem', fontSize: '0.9rem', fontWeight: 700, background: '#0284C7' }}
                    >
                      Periksa
                    </Button>
                  )}
                </div>

                {/* Panduan Langkah Terarah jika Salah (Tanpa Bocoran Angka) */}
                {isIncorrect && (
                  <div
                    className="fade-in"
                    style={{
                      marginTop: '0.85rem',
                      background: '#FFFBEB',
                      borderLeft: '4px solid #F59E0B',
                      borderRadius: '8px',
                      padding: '0.85rem 1.1rem',
                      fontSize: '0.88rem',
                      color: '#92400E'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#B45309', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span>🧭</span> Panduan Langkah Pengerjaan (Tanpa Bocoran Angka):
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', lineHeight: 1.55 }}>
                      {Array.isArray(q.hint) ? (
                        q.hint.map((stepText, sIdx) => (
                          <div key={sIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                            <span style={{ color: '#D97706', fontWeight: 800 }}>•</span>
                            <span>{stepText}</span>
                          </div>
                        ))
                      ) : (
                        <div>{q.hint}</div>
                      )}
                    </div>
                    <div style={{ marginTop: '0.45rem', fontSize: '0.8rem', fontStyle: 'italic', color: '#B45309', borderTop: '1px dashed #FDE68A', paddingTop: '0.35rem' }}>
                      💡 Periksa kembali urutan perhitungan di atas, lalu masukkan kembali jawabanmu!
                    </div>
                  </div>
                )}

                {/* Pembahasan Lengkap (Hanya jika Lulus) */}
                {showSolution && (
                  <div
                    className="fade-in"
                    style={{
                      marginTop: '0.85rem',
                      background: '#ECFDF5',
                      borderLeft: '4px solid #10B981',
                      borderRadius: '8px',
                      padding: '0.75rem 1.1rem',
                      fontSize: '0.88rem',
                      color: '#065F46'
                    }}
                  >
                    <strong>📖 Pembahasan Lengkap:</strong> {q.solution}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════
            SOAL PILIHAN GANDA 7 – 8
            ══════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          {MC_QUESTIONS_BAB5.map(q => {
            const st = status[q.id];
            const locked = st !== null;
            const isCorrect = st === 'correct';
            const isIncorrect = st === 'incorrect';
            const showSolution = isCorrect && showSummary && correctCount >= 6;

            return (
              <div
                key={q.id}
                style={{
                  background: isCorrect ? '#F0FDF4' : isIncorrect ? '#FFF5F5' : '#FFFFFF',
                  border: isCorrect
                    ? '1.5px solid #86EFAC'
                    : isIncorrect
                      ? '1.5px solid #FCA5A5'
                      : '1.5px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: isCorrect ? '#DCFCE7' : isIncorrect ? '#FEE2E2' : '#F1F5F9',
                    color: isCorrect ? '#15803D' : isIncorrect ? '#B91C1C' : '#475569',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '6px'
                  }}>
                    Soal {q.number} • Pilihan Ganda Konseptual
                  </span>
                  {locked && (
                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      color: isCorrect ? '#16A34A' : '#DC2626'
                    }}>
                      {isCorrect ? '✓ Benar' : '✗ Salah'}
                    </span>
                  )}
                </div>

                {/* Pertanyaan */}
                <p style={{ margin: '0 0 1rem 0', fontSize: '1.02rem', color: '#0F172A', lineHeight: 1.55, whiteSpace: 'pre-line' }}>
                  <strong>{q.number}.</strong> {q.question}
                </p>

                {/* Pilihan Jawaban */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {q.options.map(opt => {
                    const isSelected = answers[q.id] === opt.key;
                    let optBg = '#F8FAFC';
                    let optBorder = '1.5px solid #E2E8F0';
                    let optColor = '#334155';

                    if (locked) {
                      if (isSelected && isCorrect) {
                        optBg = '#DCFCE7'; optBorder = '2px solid #22C55E'; optColor = '#14532D';
                      } else if (isSelected && isIncorrect) {
                        optBg = '#FEE2E2'; optBorder = '2px solid #EF4444'; optColor = '#7F1D1D';
                      } else {
                        optBg = '#F8FAFC'; optBorder = '1px solid #E2E8F0'; optColor = '#94A3B8';
                      }
                    } else if (isSelected) {
                      optBg = '#EFF6FF'; optBorder = '2px solid #0284C7'; optColor = '#1E3A5F';
                    }

                    return (
                      <div
                        key={opt.key}
                        onClick={() => handleSelectOption(q.id, opt.key)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '0.65rem 0.9rem',
                          borderRadius: '8px',
                          background: optBg,
                          border: optBorder,
                          color: optColor,
                          cursor: locked ? 'default' : 'pointer',
                          transition: 'all 0.15s ease',
                          lineHeight: 1.5,
                          fontSize: '0.95rem'
                        }}
                      >
                        <span style={{
                          fontWeight: 800,
                          minWidth: '22px',
                          color: locked && isSelected && isCorrect ? '#16A34A'
                            : locked && isSelected && isIncorrect ? '#DC2626'
                              : 'inherit'
                        }}>
                          {opt.key}.
                        </span>
                        <span style={{ flex: 1 }}>{opt.text}</span>
                        {locked && isSelected && isCorrect && <span style={{ color: '#16A34A', fontWeight: 800 }}>✓</span>}
                        {locked && isSelected && isIncorrect && <span style={{ color: '#DC2626', fontWeight: 800 }}>✗</span>}
                      </div>
                    );
                  })}
                </div>

                {/* Tombol Periksa */}
                {!locked && (
                  <Button
                    variant="primary"
                    onClick={() => handleCheckMC(q.id, q.correctKey)}
                    disabled={!answers[q.id]}
                    style={{ padding: '0.6rem 1.4rem', fontSize: '0.9rem', fontWeight: 700, background: '#0284C7' }}
                  >
                    Periksa Jawaban
                  </Button>
                )}

                {/* Petunjuk jika salah */}
                {isIncorrect && (
                  <div
                    className="fade-in"
                    style={{
                      marginTop: '0.85rem',
                      background: '#FFFBEB',
                      borderLeft: '4px solid #F59E0B',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      color: '#92400E'
                    }}
                  >
                    <strong>💡 Petunjuk Konseptual:</strong> {q.hint}
                  </div>
                )}

                {/* Pembahasan Lengkap (Hanya jika Lulus) */}
                {showSolution && (
                  <div
                    className="fade-in"
                    style={{
                      marginTop: '0.85rem',
                      background: '#ECFDF5',
                      borderLeft: '4px solid #10B981',
                      borderRadius: '8px',
                      padding: '0.65rem 1rem',
                      fontSize: '0.88rem',
                      color: '#065F46'
                    }}
                  >
                    <strong>📖 Pembahasan:</strong> {q.solution}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════
            SOAL REFLEKSI (wajib diisi, tidak dinilai otomatis)
            ══════════════════════════════════════════════ */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          borderRadius: '14px',
          padding: '1.35rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              background: '#EEF2FF',
              color: '#4338CA',
              padding: '0.2rem 0.65rem',
              borderRadius: '6px'
            }}>
              Soal 9 • Refleksi Saintifik (Wajib diisi untuk membuka panel skor)
            </span>
            {refleksiSubmitted && (
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16A34A' }}>✓ Jawaban Refleksi Disimpan</span>
            )}
          </div>

          <p style={{ margin: '0 0 0.85rem 0', fontSize: '1.02rem', color: '#0F172A', lineHeight: 1.55 }}>
            <strong>9.</strong> Mengapa penurunan titik beku larutan garam dapur (NaCl 1 m) sebesar <strong>−3,72°C</strong> dikategorikan sebagai <em>nilai ideal teoritis</em>, dan mengapa pada pengukuran nyata di laboratorium nilainya sedikit berbeda (sekitar <strong>−3,4°C hingga −3,5°C</strong>)? Jelaskan ditinjau dari interaksi partikel ion!
          </p>

          <form onSubmit={handleRefleksiSubmit}>
            <textarea
              rows={4}
              placeholder="Tuliskan analisis ilmiahmu berdasarkan interaksi antar-ion di sini..."
              value={refleksi}
              onChange={e => setRefleksi(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                borderRadius: '8px',
                border: refleksiSubmitted ? '1.5px solid #10B981' : '1.5px solid #CBD5E1',
                outline: 'none',
                fontFamily: "'Times New Roman', Times, serif",
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.65rem',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                * Refleksi melatih penalaran kritis kimia tingkat tinggi (HOTS).
              </span>
              <Button
                type="submit"
                variant="primary"
                disabled={!refleksi.trim()}
                style={{
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  background: refleksiSubmitted ? '#059669' : '#0284C7'
                }}
              >
                {refleksiSubmitted ? 'Perbarui Jawaban ✓' : 'Kirim Jawaban & Buka Skor'}
              </Button>
            </div>
          </form>

          {/* Model Kunci Jawaban Refleksi — Tampil setelah dikirim */}
          {refleksiSubmitted && (
            <div
              className="fade-in"
              style={{
                marginTop: '1.25rem',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderLeft: '4px solid #4338CA',
                borderRadius: '8px',
                padding: '1rem 1.25rem'
              }}
            >
              <strong style={{ color: '#312E81', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📖</span> Kunci Penjelasan Konsep Saintifik Guru:
              </strong>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.92rem', color: '#334155', lineHeight: 1.65 }}>
                Nilai <strong>−3,72°C</strong> dihitung dari rumus model ideal (ΔTf = 1,86 × 1 × 2 = 3,72°C) yang mengasumsikan bahwa seluruh ion Na⁺ dan Cl⁻ terpisah total dan bergerak 100% bebas tanpa saling berinteraksi (kondisi pengenceran tak terhingga).<br />
                Namun di dunia nyata pada konsentrasi 1 m, jarak antar-ion cukup dekat sehingga terjadi <strong>gaya tarik-menarik elektrostatik (interaksi Debye-Hückel)</strong> yang membentuk pasangan ion sesaat (*ion pairing*). Akibatnya, kebebasan efektif ion sedikit berkurang sehingga nilai faktor van 't Hoff nyata terukur adalah sekitar <strong>i ≈ 1,85–1,88</strong> (bukan tepat 2,00). Oleh karena itu, penurunan titik beku riil terukur di laboratorium berkisar antara <strong>−3,4°C hingga −3,5°C</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Keterangan Progres Pengerjaan */}
        {!showSummary && (
          <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#94A3B8', textAlign: 'right' }}>
            {Object.values(status).filter(v => v !== null).length}/8 soal dinilai telah dijawab
            {allAnswered && !refleksiSubmitted && ' — silakan isi refleksi di atas untuk melihat skor akhir'}
          </p>
        )}
      </Card>
    </div>
  );
}
