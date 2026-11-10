import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getUserExerciseState, saveUserExerciseState } from '../../utils/storage';

/**
 * Komponen LatihanSoal
 * 
 * Modul Latihan Mandiri Interaktif untuk Bab 1:
 * - 5 Soal Numerik dengan kolom isian angka (menerima titik atau koma, toleransi ±2%)
 *   dan umpan balik langsung serta petunjuk terarah jika keliru.
 * - 1 Soal Uraian Konseptual (refleksi tanpa penilaian otomatis) disertai contoh jawaban ideal.
 * - Jawaban tersimpan otomatis per akun siswa sehingga tidak hilang saat login ulang.
 * - Prop onSemuaSelesai dipanggil saat soal 1–5 benar dan soal 6 telah diisi.
 */
export default function LatihanSoal({ onSemuaSelesai }) {
  // State Jawaban Siswa
  const [answers, setAnswers] = useState(() => {
    const saved = getUserExerciseState(null, 'chapter1_latihan_soal');
    return saved?.answers || {
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: '',
      q6: ''
    };
  });

  // State Status Pemeriksaan: 'unanswered' | 'correct' | 'incorrect'
  const [status, setStatus] = useState(() => {
    const saved = getUserExerciseState(null, 'chapter1_latihan_soal');
    return saved?.status || {
      q1: 'unanswered',
      q2: 'unanswered',
      q3: 'unanswered',
      q4: 'unanswered',
      q5: 'unanswered',
      q6: 'unanswered'
    };
  });

  // State untuk menampilkan Petunjuk
  const [showHint, setShowHint] = useState(() => {
    const saved = getUserExerciseState(null, 'chapter1_latihan_soal');
    return saved?.showHint || {
      q1: false,
      q2: false,
      q3: false,
      q4: false,
      q5: false
    };
  });

  // State untuk menampilkan Contoh Jawaban Soal 6
  const [isQ6Submitted, setIsQ6Submitted] = useState(() => {
    const saved = getUserExerciseState(null, 'chapter1_latihan_soal');
    return Boolean(saved?.isQ6Submitted);
  });

  // Simpan progres latihan hanya setelah ada interaksi nyata dari siswa
  const hasUserInteracted = Object.values(answers).some(a => Boolean(a && a.trim())) || isQ6Submitted;

  useEffect(() => {
    if (hasUserInteracted) {
      saveUserExerciseState(null, 'chapter1_latihan_soal', {
        answers,
        status,
        showHint,
        isQ6Submitted
      });
    }
  }, [answers, status, showHint, isQ6Submitted, hasUserInteracted]);

  // Cek kelengkapan saat pertama kali dimuat jika sudah pernah dikerjakan sebelumnya
  useEffect(() => {
    const allNumericCorrect = ['q1', 'q2', 'q3', 'q4', 'q5'].every(k => status[k] === 'correct');
    if (allNumericCorrect && isQ6Submitted && typeof onSemuaSelesai === 'function') {
      onSemuaSelesai();
    }
  }, []);

  // Daftar Definisi Soal Numerik (Soal 1 - 5)
  const numericQuestions = [
    {
      id: 'q1',
      number: 1,
      question: "Sebanyak 3 gram urea (CO(NH₂)₂, Mr = 60) dilarutkan dalam 250 gram air murni. Berapakah molalitas (m) larutan tersebut?",
      target: 0.2,
      unit: "m (molal)",
      hint: "Ubah massa air ke kg (250 g = 0,25 kg). Hitung mol urea: n = 3 / 60 = 0,05 mol. Kemudian m = n / p = 0,05 / 0,25.",
      solution: "n = 3 g / 60 g/mol = 0,05 mol. p = 250 g = 0,25 kg. Molalitas m = 0,05 / 0,25 = 0,2 m."
    },
    {
      id: 'q2',
      number: 2,
      question: "Sebanyak 36 gram glukosa (Mr = 180) dilarutkan ke dalam 500 gram air. Berapakah molalitas larutan tersebut?",
      target: 0.4,
      unit: "m (molal)",
      hint: "Hitung mol glukosa: n = 36 / 180 = 0,2 mol. Massa pelarut p = 500 g = 0,5 kg. Molalitas m = 0,2 / 0,5 = 0,4 m.",
      solution: "n = 36 / 180 = 0,2 mol; p = 0,5 kg; m = 0,2 / 0,5 = 0,4 m."
    },
    {
      id: 'q3',
      number: 3,
      question: "Sebuah larutan dibuat dengan mencampurkan 0,5 mol etanol ke dalam 4,5 mol air. Berapakah fraksi mol etanol (X_etanol)?",
      target: 0.1,
      unit: "tanpa satuan",
      hint: "Hitung mol total larutan: n_total = 0,5 + 4,5 = 5,0 mol. Fraksi mol X = n_etanol / n_total.",
      solution: "n_total = 0,5 mol + 4,5 mol = 5,0 mol. X_etanol = 0,5 / 5,0 = 0,1."
    },
    {
      id: 'q4',
      number: 4,
      question: "Berapa gram urea (Mr = 60) yang harus dilarutkan ke dalam 400 gram air agar diperoleh larutan dengan konsentrasi 0,25 m?",
      target: 6.0,
      unit: "gram",
      hint: "Ubah massa air: p = 400 g = 0,4 kg. Cari mol urea: n = m × p = 0,25 × 0,4 = 0,1 mol. Lalu cari massa: massa = n × Mr = 0,1 × 60.",
      solution: "p = 0,4 kg. n = 0,25 m × 0,4 kg = 0,1 mol. Massa urea = 0,1 mol × 60 g/mol = 6 gram."
    },
    {
      id: 'q5',
      number: 5,
      question: "Suatu larutan glukosa dalam air memiliki fraksi mol glukosa sebesar 0,1. Berapakah nilai molalitas (m) larutan tersebut?",
      target: 6.17,
      unit: "m (molal)",
      hint: "Anggap mol total = 1 mol. Maka n_glukosa = 0,1 mol dan n_air = 0,9 mol. Massa air = 0,9 × 18 = 16,2 g = 0,0162 kg. Hitung m = 0,1 / 0,0162.",
      solution: "Basis 1 mol campuran: n_glukosa = 0,1 mol, n_air = 0,9 mol. Massa air = 0,9 mol × 18 g/mol = 16,2 g = 0,0162 kg. Molalitas m = 0,1 / 0,0162 = 6,17 m."
    }
  ];

  // Helper Pemeriksa Jawaban Numerik (Toleransi ±2%, menerima koma atau titik)
  const checkNumericAnswer = (qId, target) => {
    const rawVal = answers[qId] || '';
    const normalized = rawVal.trim().replace(',', '.');
    const parsed = parseFloat(normalized);

    if (isNaN(parsed)) {
      setStatus(prev => ({ ...prev, [qId]: 'incorrect' }));
      setShowHint(prev => ({ ...prev, [qId]: true }));
      return;
    }

    // Toleransi ±2%
    const tolerance = 0.02 * target;
    const isCorrect = Math.abs(parsed - target) <= (tolerance + 0.0001);

    const newStatus = isCorrect ? 'correct' : 'incorrect';
    setStatus(prev => {
      const updated = { ...prev, [qId]: newStatus };
      checkAllCompletion(updated, isQ6Submitted);
      return updated;
    });

    if (!isCorrect) {
      setShowHint(prev => ({ ...prev, [qId]: true }));
    }
  };

  // Handler Kirim Jawaban Soal Uraian (Soal 6)
  const handleQ6Submit = (e) => {
    e.preventDefault();
    if (!answers.q6.trim()) return;

    setIsQ6Submitted(true);
    setStatus(prev => {
      const updated = { ...prev, q6: 'correct' };
      checkAllCompletion(updated, true);
      return updated;
    });
  };

  // Cek apakah seluruh kriteria soal 1–5 benar dan soal 6 diisi
  const checkAllCompletion = (currentStatus, q6Done) => {
    const allNumericCorrect = ['q1', 'q2', 'q3', 'q4', 'q5'].every(k => currentStatus[k] === 'correct');
    if (allNumericCorrect && q6Done) {
      if (typeof onSemuaSelesai === 'function') {
        onSemuaSelesai();
      }
    }
  };

  const allCompleted = ['q1', 'q2', 'q3', 'q4', 'q5'].every(k => status[k] === 'correct') && isQ6Submitted;

  return (
    <div style={{ marginBottom: '2.5rem', fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Latihan Pemahaman Mandiri Bab 1"
        subtitle="Uji pemahamanmu tentang satuan konsentrasi larutan dengan umpan balik langsung"
      >
        {/* BANNER STATUS KELENGKAPAN */}
        {allCompleted && (
          <div
            className="fade-in"
            style={{
              background: '#ECFDF5',
              border: '2px solid #10B981',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}
          >
            <span style={{ fontSize: '1.6rem' }}>🎉</span>
            <div>
              <strong style={{ color: '#065F46', fontSize: '1.05rem', display: 'block' }}>
                Luar Biasa! Semua Soal Telah Berhasil Diselesaikan!
              </strong>
              <span style={{ color: '#047857', fontSize: '0.9rem' }}>
                Kamu telah menguasai konsep molalitas, fraksi mol, konversi kadar, dan alasan ilmiah sifat koligatif dengan sempurna.
              </span>
            </div>
          </div>
        )}

        {/* DAFTAR SOAL NUMERIK (SOAL 1 - 5) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          {numericQuestions.map(q => {
            const isCorrect = status[q.id] === 'correct';
            const isIncorrect = status[q.id] === 'incorrect';
            const isAnswered = isCorrect || isIncorrect;

            return (
              <div
                key={q.id}
                style={{
                  background: isCorrect ? '#F0FDF4' : '#FFFFFF',
                  border: isCorrect ? '1.5px solid #86EFAC' : isIncorrect ? '1.5px solid #FCA5A5' : '1.5px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)',
                  transition: 'all 0.25s ease'
                }}
              >
                {/* Header Soal */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: isCorrect ? '#DCFCE7' : '#F1F5F9',
                    color: isCorrect ? '#15803D' : '#475569',
                    padding: '0.2rem 0.65rem',
                    borderRadius: '6px'
                  }}>
                    Soal {q.number} • Isian Angka
                  </span>
                  {isCorrect && (
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16A34A' }}>
                      ✓ Jawaban Benar!
                    </span>
                  )}
                  {isIncorrect && (
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#DC2626' }}>
                      ✗ Belum Tepat
                    </span>
                  )}
                </div>

                {/* Teks Soal */}
                <p style={{ margin: '0 0 1rem 0', fontSize: '1.02rem', color: '#0F172A', lineHeight: 1.55 }}>
                  <strong>{q.number}.</strong> {q.question}
                </p>

                {/* Form Input Jawaban Angka */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Ketik angka (contoh: 0,2)"
                      value={answers[q.id]}
                      onChange={(e) => {
                        setAnswers(prev => ({ ...prev, [q.id]: e.target.value }));
                        if (status[q.id] !== 'unanswered') {
                          setStatus(prev => ({ ...prev, [q.id]: 'unanswered' }));
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          checkNumericAnswer(q.id, q.target);
                        }
                      }}
                      disabled={isCorrect}
                      style={{
                        padding: '0.6rem 0.9rem',
                        fontSize: '1rem',
                        borderRadius: '8px',
                        border: isCorrect ? '2px solid #22C55E' : isIncorrect ? '2px solid #EF4444' : '1.5px solid #CBD5E1',
                        background: isCorrect ? '#F0FDF4' : '#FFFFFF',
                        color: '#0F172A',
                        width: '210px',
                        outline: 'none',
                        fontFamily: "'Times New Roman', Times, serif"
                      }}
                    />
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
                      {q.unit}
                    </span>
                  </div>

                  <Button
                    variant={isCorrect ? 'secondary' : 'primary'}
                    onClick={() => checkNumericAnswer(q.id, q.target)}
                    disabled={isCorrect || !answers[q.id].trim()}
                    style={{
                      padding: '0.6rem 1.15rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      background: isCorrect ? '#10B981' : '#0284C7'
                    }}
                  >
                    {isCorrect ? '✓ Tepat' : 'Periksa'}
                  </Button>

                  {/* Tombol Petunjuk jika salah */}
                  {isIncorrect && !showHint[q.id] && (
                    <button
                      type="button"
                      onClick={() => setShowHint(prev => ({ ...prev, [q.id]: true }))}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#D97706',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      💡 Buka Petunjuk
                    </button>
                  )}
                </div>

                {/* Box Petunjuk Terarah jika Salah */}
                {isIncorrect && showHint[q.id] && (
                  <div
                    className="fade-in"
                    style={{
                      marginTop: '0.85rem',
                      background: '#FFFBEB',
                      borderLeft: '4px solid #F59E0B',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      color: '#92400E'
                    }}
                  >
                    <strong>💡 Petunjuk Pengerjaan:</strong> {q.hint}
                  </div>
                )}

                {/* Box Pembahasan Lengkap jika Benar */}
                {isCorrect && (
                  <div
                    className="fade-in"
                    style={{
                      marginTop: '0.85rem',
                      background: '#ECFDF5',
                      borderLeft: '4px solid #10B981',
                      borderRadius: '6px',
                      padding: '0.65rem 1rem',
                      fontSize: '0.88rem',
                      color: '#065F46'
                    }}
                  >
                    <strong>Kunci Jawaban:</strong> {q.solution}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* =========================================================
            SOAL 6: REFLEKSI KONSEPTUAL (URAIAN)
            ========================================================= */}
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
              Soal 6 • Uraian Konseptual & Refleksi
            </span>
            {isQ6Submitted && (
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16A34A' }}>
                ✓ Jawaban Disimpan
              </span>
            )}
          </div>

          <p style={{ margin: '0 0 0.85rem 0', fontSize: '1.02rem', color: '#0F172A', lineHeight: 1.55 }}>
            <strong>6.</strong> Mengapa percobaan penurunan titik beku (dan sifat koligatif lainnya) menggunakan satuan <strong>Molalitas (m)</strong>, bukan <strong>Molaritas (M)</strong>?
          </p>

          <form onSubmit={handleQ6Submit}>
            <textarea
              rows="3"
              placeholder="Tuliskan alasan ilmiahmu di sini berdasarkan pengaruh suhu..."
              value={answers.q6}
              onChange={(e) => setAnswers(prev => ({ ...prev, q6: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                fontSize: '0.95rem',
                borderRadius: '8px',
                border: isQ6Submitted ? '1.5px solid #10B981' : '1.5px solid #CBD5E1',
                outline: 'none',
                fontFamily: "'Times New Roman', Times, serif",
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                *Soal uraian ini bertujuan melatih penalaran ilmiah dan tidak dinilai otomatis oleh sistem.
              </span>

              <Button
                type="submit"
                variant="primary"
                disabled={!answers.q6.trim()}
                style={{
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  background: isQ6Submitted ? '#059669' : '#0284C7'
                }}
              >
                {isQ6Submitted ? 'Perbarui Jawaban ✓' : 'Kirim Jawaban & Lihat Kunci'}
              </Button>
            </div>
          </form>

          {/* CONTOH JAWABAN IDEAL (TAMPIL SETELAH SISWA MENGIRIM JAWABAN) */}
          {isQ6Submitted && (
            <div
              className="fade-in"
              style={{
                marginTop: '1.25rem',
                background: '#FFFFFF',
                borderLeft: '4px solid #4338CA',
                border: '1px solid #E2E8F0',
                borderLeftWidth: '4px',
                borderRadius: '8px',
                padding: '1rem 1.25rem'
              }}
            >
              <strong style={{ color: '#312E81', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📖</span> Contoh Jawaban Ideal:
              </strong>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.92rem', color: '#334155', lineHeight: 1.6 }}>
                Percobaan titik beku (dan titik didih) melibatkan perubahan suhu yang sangat besar. 
                <strong> Molaritas (M)</strong> berbasis pada <em>volume larutan (Liter)</em> yang nilainya dapat memuai atau menyusut ketika suhu berubah, sehingga konsentrasi larutan akan bergeser saat didinginkan. 
                Sebaliknya, <strong>Molalitas (m)</strong> berbasis pada <em>massa pelarut (kg)</em> yang nilainya <strong>selalu konstan dan tidak dipengaruhi oleh perubahan suhu</strong>, sehingga rumus perhitungan sifat koligatif tetap konsisten dan akurat.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
