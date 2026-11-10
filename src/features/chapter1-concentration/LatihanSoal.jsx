import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';

/**
 * LatihanSoal – Bab 1: Konsentrasi Larutan
 *
 * Aturan penilaian:
 * - 8 soal dinilai (6 numerik + 2 pilihan ganda) + 1 soal refleksi (tidak dinilai)
 * - Setiap soal hanya dinilai dari JAWABAN PERTAMA; setelah dijawab, kotak terkunci
 * - Isian angka: toleransi ±2%, menerima koma atau titik sebagai desimal
 * - Setelah 8 soal dijawab dan refleksi diisi → tampilkan skor (x/8)
 *   - Skor ≥ 6 (KKM 75%): tampilkan pembahasan lengkap semua soal, panggil onSemuaSelesai
 *   - Skor < 6: tampilkan nomor soal yang salah + tombol "Ulangi Latihan" (kunci tidak tampil)
 * - Status lulus disimpan ke localStorage dengan kunci yang sama dengan sistem syarat Bab 1
 */

// ─── Fungsi kunci penyimpanan yang selaras dengan Chapter1Page ───────────────
function getCh1StorageKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch1_requirements_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch1_requirements_v1_guest';
}

// ─── Data Soal ───────────────────────────────────────────────────────────────
const NUMERIC_QUESTIONS = [
  {
    id: 'q1',
    number: 1,
    question: 'Sebanyak 12 g urea (Mr = 60) dilarutkan dalam 500 g air murni. Berapakah molalitas (m) larutan tersebut?',
    target: 0.4,
    unit: 'm (molal)',
    hint: 'Ubah gram air ke kg terlebih dahulu (500 g = 0,5 kg).',
    solution: 'n urea = 12 / 60 = 0,2 mol; massa pelarut = 500 g = 0,5 kg; molalitas m = 0,2 / 0,5 = 0,4 m.'
  },
  {
    id: 'q2',
    number: 2,
    question: 'Sebanyak 18 g glukosa (Mr = 180) dilarutkan ke dalam 400 g air. Berapakah molalitas larutan tersebut?',
    target: 0.25,
    unit: 'm (molal)',
    hint: 'Hitung mol glukosa terlebih dahulu sebelum membagi dengan massa pelarut.',
    solution: 'n = 18 / 180 = 0,1 mol; massa pelarut = 400 g = 0,4 kg; m = 0,1 / 0,4 = 0,25 m.'
  },
  {
    id: 'q3',
    number: 3,
    question: '0,25 mol glukosa dicampurkan dengan 4,75 mol air. Berapakah fraksi mol glukosa (X\u209c\u1d49\u02b3\u1d43\u02b3\u1d43\u02b3\u1d43)?',
    target: 0.05,
    unit: '(tanpa satuan)',
    hint: 'Bagi mol glukosa dengan mol total (glukosa + air).',
    solution: 'n total = 0,25 + 4,75 = 5,0 mol; X glukosa = 0,25 / 5,0 = 0,05.'
  },
  {
    id: 'q4',
    number: 4,
    question: '4,6 g etanol (Mr = 46) dicampurkan dengan 16,2 g air (Mr = 18). Berapakah fraksi mol etanol?',
    target: 0.1,
    unit: '(tanpa satuan)',
    hint: 'Ubah kedua massa menjadi mol terlebih dahulu, lalu hitung fraksi mol.',
    solution: 'n etanol = 4,6 / 46 = 0,1 mol; n air = 16,2 / 18 = 0,9 mol; X = 0,1 / (0,1 + 0,9) = 0,1.'
  },
  {
    id: 'q5',
    number: 5,
    question: 'Berapa gram glukosa (Mr = 180) yang harus dilarutkan ke dalam 250 g air agar diperoleh larutan 0,4 m?',
    target: 18,
    unit: 'gram',
    hint: 'Gunakan rumus n = molalitas × massa pelarut (kg) untuk mencari mol, lalu ubah ke gram.',
    solution: 'n = 0,4 m × 0,25 kg = 0,1 mol; massa = 0,1 × 180 = 18 g.'
  },
  {
    id: 'q6',
    number: 6,
    question: 'Larutan urea (Mr = 60) dengan kadar 20% massa. Berapakah molalitasnya?',
    target: 4.17,
    unit: 'm (molal)',
    hint: 'Misalkan 100 g larutan: 20 g urea dan 80 g air. Hitung mol urea lalu bagi dengan massa air (kg).',
    solution: 'Basis 100 g larutan: urea = 20 g → n = 20/60 = 0,333 mol; air = 80 g = 0,08 kg; m = 0,333/0,08 = 4,17 m.'
  }
];

const MC_QUESTIONS = [
  {
    id: 'q7',
    number: 7,
    question: 'Larutan glukosa pada 25°C memiliki molaritas M dan molalitas m. Larutan dipanaskan hingga 60°C, volume sedikit memuai, dan tidak ada air yang menguap. Apa yang terjadi pada M dan m?',
    options: [
      { key: 'A', text: 'M dan m sama-sama turun' },
      { key: 'B', text: 'M turun, m tetap' },
      { key: 'C', text: 'M tetap, m turun' },
      { key: 'D', text: 'M dan m sama-sama naik' },
      { key: 'E', text: 'M dan m tetap' }
    ],
    correctKey: 'B',
    hint: 'Pikirkan: masing-masing satuan bergantung pada besaran apa — volume atau massa?',
    solution: 'Molaritas bergantung pada volume larutan; volume memuai saat dipanaskan sehingga M turun. Molalitas bergantung pada massa pelarut yang tidak berubah, sehingga m tetap.'
  },
  {
    id: 'q8',
    number: 8,
    question: 'Siswa ingin membuat larutan urea 1 m. Ia melarutkan 6 g urea (Mr = 60) ke dalam 100 mL air (massa jenis 1 g/mL). Apakah larutannya sudah 1 m?',
    options: [
      { key: 'A', text: 'Ya, karena 100 mL air = 100 g = 0,1 kg, sehingga m = 0,1 mol / 0,1 kg = 1 m' },
      { key: 'B', text: 'Tidak, karena yang dipakai seharusnya volume larutan, bukan volume air' },
      { key: 'C', text: 'Tidak, molalitasnya 0,1 m' },
      { key: 'D', text: 'Tidak, molalitasnya 10 m' },
      { key: 'E', text: 'Tidak bisa ditentukan tanpa mengetahui volume larutan' }
    ],
    correctKey: 'A',
    hint: 'Molalitas memakai massa pelarut, bukan volume larutan. Gunakan massa jenis untuk mengonversi.',
    solution: 'Molalitas memakai massa pelarut: 100 mL × 1 g/mL = 100 g = 0,1 kg. n urea = 6/60 = 0,1 mol. m = 0,1/0,1 = 1 m. Jawaban A benar.'
  }
];

// ─── Komponen utama ───────────────────────────────────────────────────────────
export default function LatihanSoal({ onSemuaSelesai }) {
  // Jawaban: q1–q6 = string angka; q7, q8 = key pilihan ganda (string)
  const initAnswers = () => ({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '',
    q7: '', q8: ''
  });

  // Status soal q1–q8: null | 'correct' | 'incorrect'
  // null = belum dijawab, setelah dijawab pertama kali TERKUNCI
  const initStatus = () => ({
    q1: null, q2: null, q3: null, q4: null, q5: null, q6: null,
    q7: null, q8: null
  });

  const [answers, setAnswers]       = useState(initAnswers);
  const [status, setStatus]         = useState(initStatus);
  const [refleksi, setRefleksi]     = useState('');
  const [refleksiSubmitted, setRefleksiSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false); // tampilkan panel skor
  const [passed, setPassed]         = useState(false);

  // Hitung skor dari status yang sudah ada (untuk re-render)
  const correctCount = Object.values(status).filter(v => v === 'correct').length;

  // Semua 8 soal sudah dijawab (tidak peduli benar/salah)
  const allAnswered = Object.values(status).every(v => v !== null);

  // Siap tampilkan skor: semua 8 dijawab DAN refleksi diisi
  const readyToShowSummary = allAnswered && refleksiSubmitted;

  // Efek: tampilkan panel skor otomatis saat kondisi terpenuhi
  useEffect(() => {
    if (readyToShowSummary && !showSummary) {
      setShowSummary(true);
    }
  }, [readyToShowSummary]);

  // Efek: kalau lulus, simpan ke localStorage dan panggil onSemuaSelesai
  useEffect(() => {
    if (showSummary && correctCount >= 6 && !passed) {
      setPassed(true);
      // Simpan status lulus ke kunci yang sama dengan Chapter1Page
      const key = getCh1StorageKey();
      const saved = getStoredData(key, { isMissionDone: false, isExerciseDone: false });
      setStoredData(key, { ...saved, isExerciseDone: true });
      if (typeof onSemuaSelesai === 'function') {
        onSemuaSelesai();
      }
    }
  }, [showSummary, correctCount]);

  // ── Handler numerik ────────────────────────────────────────────────────────
  const handleCheckNumeric = (qId, target) => {
    // Hanya proses jika belum pernah dijawab
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

  // ── Handler pilihan ganda ──────────────────────────────────────────────────
  const handleSelectOption = (qId, optKey) => {
    // Hanya proses jika belum dijawab
    if (status[qId] !== null) return;
    setAnswers(prev => ({ ...prev, [qId]: optKey }));
  };

  const handleCheckMC = (qId, correctKey) => {
    if (status[qId] !== null) return;
    if (!answers[qId]) return;
    const isCorrect = answers[qId] === correctKey;
    setStatus(prev => ({ ...prev, [qId]: isCorrect ? 'correct' : 'incorrect' }));
  };

  // ── Handler refleksi ───────────────────────────────────────────────────────
  const handleRefleksiSubmit = (e) => {
    e.preventDefault();
    if (!refleksi.trim()) return;
    setRefleksiSubmitted(true);
  };

  // ── Ulangi latihan (reset semua, tidak reset refleksi) ────────────────────
  const handleReset = () => {
    setAnswers(initAnswers());
    setStatus(initStatus());
    setRefleksi('');
    setRefleksiSubmitted(false);
    setShowSummary(false);
    setPassed(false);
  };

  // ── Nomor soal yang salah (untuk panel gagal) ─────────────────────────────
  const wrongNumbers = [
    ...NUMERIC_QUESTIONS.filter(q => status[q.id] === 'incorrect').map(q => q.number),
    ...MC_QUESTIONS.filter(q => status[q.id] === 'incorrect').map(q => q.number)
  ].sort((a, b) => a - b);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ marginBottom: '2.5rem', fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Latihan Pemahaman Mandiri Bab 1"
        subtitle="8 soal dinilai (jawaban pertama) + 1 refleksi wajib. Skor ≥ 6/8 untuk lulus."
      >

        {/* ══════════════════════════════════════════════
            PANEL SKOR (muncul setelah semua selesai)
            ══════════════════════════════════════════════ */}
        {showSummary && (
          <div
            className="fade-in"
            style={{
              marginBottom: '2rem',
              borderRadius: '14px',
              padding: '1.4rem 1.5rem',
              border: correctCount >= 6
                ? '2px solid #10B981'
                : '2px solid #F59E0B',
              background: correctCount >= 6 ? '#ECFDF5' : '#FFFBEB'
            }}
          >
            {correctCount >= 6 ? (
              <>
                {/* LULUS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '2rem' }}>🎉</span>
                  <div>
                    <strong style={{ color: '#065F46', fontSize: '1.1rem', display: 'block' }}>
                      Lulus! Skor kamu: {correctCount}/8
                    </strong>
                    <span style={{ color: '#047857', fontSize: '0.9rem' }}>
                      Kamu memenuhi KKM (≥ 6/8). Pembahasan lengkap tersedia di bawah setiap soal.
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* TIDAK LULUS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>📋</span>
                  <div>
                    <strong style={{ color: '#92400E', fontSize: '1.1rem', display: 'block' }}>
                      Skor kamu: {correctCount}/8 — belum mencapai KKM (6/8)
                    </strong>
                    <span style={{ color: '#78350F', fontSize: '0.9rem' }}>
                      Nomor soal yang perlu diperbaiki:{' '}
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
                    cursor: 'pointer'
                  }}
                >
                  🔄 Ulangi Latihan
                </button>
              </>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════
            SOAL NUMERIK 1 – 6
            ══════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          {NUMERIC_QUESTIONS.map(q => {
            const st = status[q.id];
            const locked = st !== null; // sudah dijawab
            const isCorrect  = st === 'correct';
            const isIncorrect = st === 'incorrect';
            // Tampilkan pembahasan hanya jika lulus
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
                    fontSize: '0.8rem', fontWeight: 700,
                    background: isCorrect ? '#DCFCE7' : isIncorrect ? '#FEE2E2' : '#F1F5F9',
                    color: isCorrect ? '#15803D' : isIncorrect ? '#B91C1C' : '#475569',
                    padding: '0.2rem 0.65rem', borderRadius: '6px'
                  }}>
                    Soal {q.number} • Isian Angka
                  </span>
                  {locked && (
                    <span style={{
                      fontSize: '0.82rem', fontWeight: 800,
                      color: isCorrect ? '#16A34A' : '#DC2626'
                    }}>
                      {isCorrect ? '✓ Benar' : '✗ Salah'}
                    </span>
                  )}
                </div>

                {/* Pertanyaan */}
                <p style={{ margin: '0 0 1rem 0', fontSize: '1.02rem', color: '#0F172A', lineHeight: 1.55 }}>
                  <strong>{q.number}.</strong> {q.question}
                </p>

                {/* Input + Tombol */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Ketik angka (contoh: 0,4)"
                    value={answers[q.id]}
                    disabled={locked}
                    onChange={e => {
                      if (!locked) setAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !locked) handleCheckNumeric(q.id, q.target);
                    }}
                    style={{
                      padding: '0.6rem 0.9rem', fontSize: '1rem',
                      borderRadius: '8px',
                      border: isCorrect ? '2px solid #22C55E' : isIncorrect ? '2px solid #EF4444' : '1.5px solid #CBD5E1',
                      background: locked ? '#F8FAFC' : '#FFFFFF',
                      color: '#0F172A', width: '210px', outline: 'none',
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

                {/* Petunjuk (muncul jika salah) */}
                {isIncorrect && (
                  <div className="fade-in" style={{
                    marginTop: '0.85rem', background: '#FFFBEB',
                    borderLeft: '4px solid #F59E0B', borderRadius: '6px',
                    padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#92400E'
                  }}>
                    <strong>💡 Petunjuk:</strong> {q.hint}
                  </div>
                )}

                {/* Pembahasan lengkap (hanya jika lulus) */}
                {showSolution && (
                  <div className="fade-in" style={{
                    marginTop: '0.85rem', background: '#ECFDF5',
                    borderLeft: '4px solid #10B981', borderRadius: '6px',
                    padding: '0.65rem 1rem', fontSize: '0.88rem', color: '#065F46'
                  }}>
                    <strong>📖 Pembahasan:</strong> {q.solution}
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
          {MC_QUESTIONS.map(q => {
            const st = status[q.id];
            const locked = st !== null;
            const isCorrect   = st === 'correct';
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
                    fontSize: '0.8rem', fontWeight: 700,
                    background: isCorrect ? '#DCFCE7' : isIncorrect ? '#FEE2E2' : '#F1F5F9',
                    color: isCorrect ? '#15803D' : isIncorrect ? '#B91C1C' : '#475569',
                    padding: '0.2rem 0.65rem', borderRadius: '6px'
                  }}>
                    Soal {q.number} • Pilihan Ganda
                  </span>
                  {locked && (
                    <span style={{
                      fontSize: '0.82rem', fontWeight: 800,
                      color: isCorrect ? '#16A34A' : '#DC2626'
                    }}>
                      {isCorrect ? '✓ Benar' : '✗ Salah'}
                    </span>
                  )}
                </div>

                {/* Pertanyaan */}
                <p style={{ margin: '0 0 1rem 0', fontSize: '1.02rem', color: '#0F172A', lineHeight: 1.55 }}>
                  <strong>{q.number}.</strong> {q.question}
                </p>

                {/* Pilihan */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                  {q.options.map(opt => {
                    const isSelected = answers[q.id] === opt.key;
                    // Styling tombol pilihan
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
                          display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                          padding: '0.65rem 0.9rem', borderRadius: '8px',
                          background: optBg, border: optBorder, color: optColor,
                          cursor: locked ? 'default' : 'pointer',
                          transition: 'all 0.15s ease', lineHeight: 1.5, fontSize: '0.95rem'
                        }}
                      >
                        <span style={{
                          fontWeight: 800, minWidth: '20px',
                          color: locked && isSelected && isCorrect ? '#16A34A'
                            : locked && isSelected && isIncorrect ? '#DC2626'
                            : 'inherit'
                        }}>
                          {opt.key}.
                        </span>
                        <span style={{ flex: 1 }}>{opt.text}</span>
                        {locked && isSelected && isCorrect  && <span style={{ color: '#16A34A', fontWeight: 800 }}>✓</span>}
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
                  <div className="fade-in" style={{
                    marginTop: '0.85rem', background: '#FFFBEB',
                    borderLeft: '4px solid #F59E0B', borderRadius: '6px',
                    padding: '0.75rem 1rem', fontSize: '0.9rem', color: '#92400E'
                  }}>
                    <strong>💡 Petunjuk:</strong> {q.hint}
                  </div>
                )}

                {/* Pembahasan lengkap (hanya jika lulus) */}
                {showSolution && (
                  <div className="fade-in" style={{
                    marginTop: '0.85rem', background: '#ECFDF5',
                    borderLeft: '4px solid #10B981', borderRadius: '6px',
                    padding: '0.65rem 1rem', fontSize: '0.88rem', color: '#065F46'
                  }}>
                    <strong>📖 Pembahasan:</strong> {q.solution}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════
            SOAL REFLEKSI (tidak dinilai, wajib diisi)
            ══════════════════════════════════════════════ */}
        <div style={{
          background: '#F8FAFC', border: '1.5px solid #CBD5E1',
          borderRadius: '14px', padding: '1.35rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
            <span style={{
              fontSize: '0.8rem', fontWeight: 700,
              background: '#EEF2FF', color: '#4338CA',
              padding: '0.2rem 0.65rem', borderRadius: '6px'
            }}>
              Soal 9 • Refleksi (wajib diisi, tidak dinilai)
            </span>
            {refleksiSubmitted && (
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16A34A' }}>✓ Jawaban Disimpan</span>
            )}
          </div>

          <p style={{ margin: '0 0 0.85rem 0', fontSize: '1.02rem', color: '#0F172A', lineHeight: 1.55 }}>
            <strong>9.</strong> Mengapa percobaan titik beku memakai <strong>molalitas</strong>, bukan{' '}
            <strong>molaritas</strong>?
          </p>

          <form onSubmit={handleRefleksiSubmit}>
            <textarea
              rows={3}
              placeholder="Tuliskan alasan ilmiahmu di sini..."
              value={refleksi}
              onChange={e => setRefleksi(e.target.value)}
              style={{
                width: '100%', padding: '0.75rem 1rem', fontSize: '0.95rem',
                borderRadius: '8px',
                border: refleksiSubmitted ? '1.5px solid #10B981' : '1.5px solid #CBD5E1',
                outline: 'none', fontFamily: "'Times New Roman', Times, serif",
                resize: 'vertical', boxSizing: 'border-box'
              }}
            />

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: '0.65rem', flexWrap: 'wrap', gap: '0.5rem'
            }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                * Soal refleksi tidak dinilai otomatis — wajib diisi untuk membuka panel skor.
              </span>
              <Button
                type="submit"
                variant="primary"
                disabled={!refleksi.trim()}
                style={{
                  padding: '0.55rem 1.25rem', fontSize: '0.9rem', fontWeight: 700,
                  background: refleksiSubmitted ? '#059669' : '#0284C7'
                }}
              >
                {refleksiSubmitted ? 'Perbarui Jawaban ✓' : 'Kirim & Lihat Contoh'}
              </Button>
            </div>
          </form>

          {/* Contoh jawaban — tampil setelah dikirim */}
          {refleksiSubmitted && (
            <div className="fade-in" style={{
              marginTop: '1.25rem', background: '#FFFFFF',
              border: '1px solid #E2E8F0', borderLeft: '4px solid #4338CA',
              borderRadius: '8px', padding: '1rem 1.25rem'
            }}>
              <strong style={{ color: '#312E81', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📖</span> Contoh Jawaban:
              </strong>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.92rem', color: '#334155', lineHeight: 1.65 }}>
                Suhu berubah sangat besar selama percobaan titik beku.{' '}
                <strong>Molaritas (M)</strong> bergantung pada <em>volume larutan</em> yang ikut memuai atau
                menyusut ketika suhu berubah, sehingga nilainya tidak stabil.{' '}
                <strong>Molalitas (m)</strong> bergantung pada <em>massa pelarut (kg)</em> yang{' '}
                <strong>selalu tetap dan tidak dipengaruhi perubahan suhu</strong>, sehingga rumus
                sifat koligatif tetap konsisten dan akurat.
              </p>
            </div>
          )}
        </div>

        {/* Keterangan progres bawah */}
        {!showSummary && (
          <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: '#94A3B8', textAlign: 'right' }}>
            {Object.values(status).filter(v => v !== null).length}/8 soal dijawab
            {allAnswered && !refleksiSubmitted && ' — isi refleksi untuk melihat skor'}
          </p>
        )}

      </Card>
    </div>
  );
}
