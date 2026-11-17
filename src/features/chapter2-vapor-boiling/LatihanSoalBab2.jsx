import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

/**
 * Komponen LatihanSoalBab2
 * 
 * Modul Latihan Mandiri Interaktif untuk Bab 2:
 * - 5 Soal Isian Pendek (Numerik / Nilai Eksak) dengan toleransi wajar (±2%),
 *   menerima tanda titik (.) atau koma (,) serta petunjuk terarah jika salah.
 * - 1 Soal Isian Panjang (Uraian Konseptual Teori Kinetik Partikel) disertai
 *   rubrik kunci jawaban ideal dan evaluasi mandiri.
 * - Persentase kelulusan: Minimal 80% (minimal 5 dari 6 soal dijawab benar).
 * - Menyalurkan status kelulusan via callback onEvaluasiLatihan.
 */
export default function LatihanSoalBab2({ onEvaluasiLatihan, savedAnswers = null }) {
  // State Jawaban Siswa
  const [answers, setAnswers] = useState({
    q1: savedAnswers?.q1 || '',
    q2: savedAnswers?.q2 || '',
    q3: savedAnswers?.q3 || '',
    q4: savedAnswers?.q4 || '',
    q5: savedAnswers?.q5 || '',
    q6: savedAnswers?.q6 || ''
  });

  // State Status Pemeriksaan: 'unanswered' | 'correct' | 'incorrect'
  const [status, setStatus] = useState({
    q1: 'unanswered',
    q2: 'unanswered',
    q3: 'unanswered',
    q4: 'unanswered',
    q5: 'unanswered',
    q6: savedAnswers?.q6 ? 'correct' : 'unanswered'
  });

  // State Petunjuk
  const [showHint, setShowHint] = useState({
    q1: false,
    q2: false,
    q3: false,
    q4: false,
    q5: false
  });

  // State pengiriman soal uraian 6
  const [isQ6Submitted, setIsQ6Submitted] = useState(Boolean(savedAnswers?.q6));

  // Daftar 5 Soal Isian Pendek Numerik
  const numericQuestions = [
    {
      id: 'q1',
      number: 1,
      question: "Sebanyak 18 gram glukosa (C₆H₁₂O₆, Mr = 180) dilarutkan ke dalam 500 gram air murni. Jika tetapan Kb air = 0,52 °C/m, berapakah kenaikan titik didih (ΔTb) larutan tersebut dalam °C?",
      target: 0.104,
      unit: "°C",
      hint: [
        "Langkah 1: Hitung jumlah mol glukosa dengan rumus n = massa / Mr.",
        "Langkah 2: Konversikan massa pelarut air dari gram ke kilogram (p = 500 g / 1000).",
        "Langkah 3: Hitung molalitas larutan: m = n / p(kg).",
        "Langkah 4: Gunakan rumus kenaikan titik didih nonelektrolit: ΔTb = Kb × m (dengan Kb air = 0,52 °C/m)."
      ],
      solution: "n = 18/180 = 0,1 mol. p = 0,5 kg. m = 0,1 / 0,5 = 0,2 m. ΔTb = 0,52 × 0,2 = 0,104 °C."
    },
    {
      id: 'q2',
      number: 2,
      question: "Sebanyak 6 gram urea (CO(NH₂)₂, Mr = 60) dilarutkan dalam 250 gram air (Kb air = 0,52 °C/m, titik didih normal air = 100 °C). Berapakah titik didih larutan urea (Tb) dalam °C? (Tuliskan dengan 3 angka desimal)",
      target: 100.208,
      unit: "°C",
      hint: [
        "Langkah 1: Hitung mol urea: n = massa / Mr, dan konversikan 250 gram air ke satuan kg.",
        "Langkah 2: Hitung molalitas larutan: m = n / p(kg).",
        "Langkah 3: Hitung kenaikan titik didih: ΔTb = Kb × m.",
        "Langkah 4: Ingat! Yang ditanyakan adalah titik didih larutan (Tb), bukan kenaikannya. Gunakan Tb = Tb° + ΔTb (Tb° air = 100 °C)."
      ],
      solution: "m = 0,4 m. ΔTb = 0,52 × 0,4 = 0,208 °C. Tb = 100 + 0,208 = 100,208 °C."
    },
    {
      id: 'q3',
      number: 3,
      question: "Pada suhu 25 °C, tekanan uap air murni adalah 23,76 mmHg. Jika ke dalam 90 gram air (Mr = 18) dilarutkan 0,5 mol zat nonelektrolit nonvolatil, berapakah penurunan tekanan uap jenuh (ΔP) larutan tersebut dalam mmHg? (Gunakan 2 desimal)",
      target: 2.16,
      unit: "mmHg",
      hint: [
        "Langkah 1: Hitung mol pelarut air terlebih dahulu: np = massa air / Mr air (Mr H₂O = 18 g/mol).",
        "Langkah 2: Hitung mol total larutan: n_total = nt + np (dengan nt = 0,5 mol).",
        "Langkah 3: Hitung fraksi mol zat terlarut: Xt = nt / n_total.",
        "Langkah 4: Terapkan Hukum Raoult untuk penurunan tekanan uap: ΔP = Xt × P° (P° air = 23,76 mmHg)."
      ],
      solution: "np = 5 mol. ntot = 5,5 mol. Xt = 0,5 / 5,5 = 0,0909. ΔP = 0,0909 × 23,76 = 2,16 mmHg."
    },
    {
      id: 'q4',
      number: 4,
      question: "Tekanan uap air murni pada 30 °C adalah 31,8 mmHg. Suatu larutan memiliki fraksi mol pelarut air (Xp) sebesar 0,95. Berapakah tekanan uap jenuh larutan (P) tersebut dalam mmHg?",
      target: 30.21,
      unit: "mmHg",
      hint: [
        "Langkah 1: Perhatikan besaran yang diketahui: fraksi mol pelarut (Xp = 0,95) dan tekanan uap pelarut murni (P° = 31,8 mmHg).",
        "Langkah 2: Gunakan rumus Hukum Raoult untuk tekanan uap larutan: P = Xp × P°.",
        "Langkah 3: Kalikan kedua nilai tersebut untuk mendapatkan tekanan uap larutan (P)."
      ],
      solution: "P = Xp × P° = 0,95 × 31,8 = 30,21 mmHg."
    },
    {
      id: 'q5',
      number: 5,
      question: "Berapa gram sukrosa (C₁₂H₂₂O₁₁, Mr = 342) yang harus dilarutkan ke dalam 200 gram air agar larutan mendidih pada suhu 100,26 °C? (Kb air = 0,52 °C/m, Tb° = 100 °C)",
      target: 34.2,
      unit: "gram",
      hint: [
        "Langkah 1: Cari kenaikan titik didih: ΔTb = Tb − Tb° (dengan Tb° air = 100 °C).",
        "Langkah 2: Balikkan rumus ΔTb = Kb × m untuk memperoleh molalitas: m = ΔTb / Kb.",
        "Langkah 3: Tentukan mol sukrosa yang dibutuhkan: n = m × p(kg) (ingat 200 g air = 0,2 kg).",
        "Langkah 4: Konversikan mol ke massa sukrosa dalam gram: massa = n × Mr (Mr sukrosa = 342 g/mol)."
      ],
      solution: "ΔTb = 0,26 °C. m = 0,26 / 0,52 = 0,5 m. n = 0,5 × 0,2 = 0,1 mol. Massa = 0,1 × 342 = 34,2 gram."
    }
  ];

  // Helper Pemeriksa Jawaban Numerik (Toleransi ±2%, menerima koma atau titik)
  const checkNumericAnswer = (qId, target) => {
    const rawVal = answers[qId] || '';
    const normalized = rawVal.trim().replace(',', '.');
    const parsed = parseFloat(normalized);

    if (isNaN(parsed)) {
      setStatus(prev => {
        const next = { ...prev, [qId]: 'incorrect' };
        syncCompletion(next, isQ6Submitted);
        return next;
      });
      setShowHint(prev => ({ ...prev, [qId]: true }));
      return;
    }

    // Toleransi ±2% (khusus soal 2 toleransi 0.05% agar presisi pada 100.208)
    const tolPercent = target > 50 ? 0.0005 : 0.02;
    const tolerance = Math.max(0.01, tolPercent * target);
    const isCorrect = Math.abs(parsed - target) <= tolerance;

    const newStatus = isCorrect ? 'correct' : 'incorrect';
    setStatus(prev => {
      const next = { ...prev, [qId]: newStatus };
      syncCompletion(next, isQ6Submitted);
      return next;
    });

    if (!isCorrect) {
      setShowHint(prev => ({ ...prev, [qId]: true }));
    }
  };

  // Handler Kirim Jawaban Soal Uraian (Soal 6)
  const handleQ6Submit = (e) => {
    e.preventDefault();
    if (!answers.q6.trim() || answers.q6.trim().length < 20) {
      alert("Mohon tuliskan penjelasan minimal 20 karakter agar mencakup alasan ilmiah secara memadai.");
      return;
    }

    setIsQ6Submitted(true);
    setStatus(prev => {
      const next = { ...prev, q6: 'correct' };
      syncCompletion(next, true);
      return next;
    });
  };

  // Sinkronisasi status nilai & kelulusan 80% ke parent component
  const syncCompletion = (currStatus, q6Done) => {
    const correctCount = ['q1', 'q2', 'q3', 'q4', 'q5'].filter(k => currStatus[k] === 'correct').length + (q6Done ? 1 : 0);
    const totalQuestions = 6;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = percentage >= 80; // 80% dari 6 soal = minimal 5 soal benar (83%)

    if (typeof onEvaluasiLatihan === 'function') {
      onEvaluasiLatihan({
        score: correctCount,
        total: totalQuestions,
        percentage,
        isPassed,
        answers
      });
    }
  };

  // Hitung Skor Terkini
  const correctCount = ['q1', 'q2', 'q3', 'q4', 'q5'].filter(k => status[k] === 'correct').length + (isQ6Submitted ? 1 : 0);
  const totalQuestions = 6;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = percentage >= 80;

  return (
    <div style={{ marginBottom: '2.5rem', fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Latihan Pemahaman Mandiri Bab 2"
        subtitle="Uji kemampuanmu pada konsep penurunan tekanan uap dan kenaikan titik didih (Syarat Lulus: Minimal 80% Benar)"
      >
        {/* REKAPITULASI SKOR SISWA */}
        <div style={{
          background: isPassed ? '#ECFDF5' : '#FFFBEB',
          border: isPassed ? '2px solid #10B981' : '2px solid #F59E0B',
          borderRadius: '14px',
          padding: '1.15rem 1.35rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{isPassed ? '🏆' : '📝'}</span>
              <strong style={{ fontSize: '1.1rem', color: isPassed ? '#065F46' : '#92400E' }}>
                {isPassed ? 'Hebat! Syarat 80% Latihan Soal Terpenuhi' : 'Progres Pengerjaan Latihan Soal'}
              </strong>
            </div>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.88rem', color: isPassed ? '#047857' : '#78350F' }}>
              {isPassed
                ? `Kamu telah menjawab ${correctCount} dari ${totalQuestions} soal dengan benar (${percentage}%). Kamu berhak melanjutkan ke Bab 3!`
                : `Saat ini kamu baru menjawab ${correctCount} dari ${totalQuestions} soal (${percentage}%). Butuh minimal 80% (5 dari 6 soal benar) untuk membuka bab selanjutnya.`}
            </p>
          </div>

          <div style={{
            background: '#FFFFFF',
            border: isPassed ? '1.5px solid #10B981' : '1.5px solid #F59E0B',
            borderRadius: '10px',
            padding: '0.5rem 1.25rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
              Skor Latihan
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: isPassed ? '#059669' : '#D97706' }}>
              {correctCount} / {totalQuestions} ({percentage}%)
            </div>
          </div>
        </div>

        {/* BAGIAN A: 5 SOAL ISIAN PENDEK NUMERIK */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ background: '#0284C7', color: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 800 }}>
              Bagian A
            </span>
            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              5 Soal Isian Pendek (Perhitungan Numerik)
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {numericQuestions.map(q => {
              const isCorrect = status[q.id] === 'correct';
              const isIncorrect = status[q.id] === 'incorrect';

              return (
                <div
                  key={q.id}
                  style={{
                    background: isCorrect ? '#F0FDF4' : '#FFFFFF',
                    border: isCorrect ? '1.5px solid #86EFAC' : isIncorrect ? '1.5px solid #FCA5A5' : '1.5px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1.2rem',
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
                      Soal {q.number} • Isian Singkat
                    </span>
                    {isCorrect && (
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#16A34A' }}>
                        ✓ Jawaban Benar!
                      </span>
                    )}
                    {isIncorrect && (
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#DC2626' }}>
                        ✗ Belum Tepat, periksa kembali
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
                        placeholder="Ketik angka (misal: 0,104)"
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
                          borderRadius: '8px',
                          border: isCorrect ? '2px solid #22C55E' : isIncorrect ? '2px solid #EF4444' : '1px solid #CBD5E1',
                          background: isCorrect ? '#DCFCE7' : '#FFFFFF',
                          color: '#0F172A',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          width: '210px',
                          outline: 'none',
                          fontFamily: "'Times New Roman', Times, serif"
                        }}
                      />
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                        {q.unit}
                      </span>
                    </div>

                    <Button
                      variant={isCorrect ? 'outline' : 'primary'}
                      onClick={() => checkNumericAnswer(q.id, q.target)}
                      disabled={isCorrect || !answers[q.id].trim()}
                      style={{
                        padding: '0.55rem 1.15rem',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        background: isCorrect ? '#F1F5F9' : '#0284C7',
                        color: isCorrect ? '#16A34A' : '#FFFFFF',
                        borderColor: isCorrect ? '#86EFAC' : 'transparent',
                        cursor: isCorrect ? 'default' : 'pointer'
                      }}
                    >
                      {isCorrect ? '✓ Benar' : 'Periksa Jawaban'}
                    </Button>
                  </div>

                  {/* Petunjuk Langkah Pengerjaan jika salah (Tanpa bocoran angka jawaban) */}
                  {showHint[q.id] && !isCorrect && (
                    <div
                      className="fade-in"
                      style={{
                        marginTop: '0.85rem',
                        background: '#FFFBEB',
                        border: '1.5px solid #FCD34D',
                        borderRadius: '10px',
                        padding: '0.85rem 1.1rem',
                        fontSize: '0.88rem',
                        color: '#92400E',
                        boxShadow: '0 2px 6px rgba(245, 158, 11, 0.08)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.45rem', fontWeight: 800, color: '#B45309' }}>
                        <span>🧭</span> Panduan Langkah Pengerjaan (Tanpa Bocoran Angka):
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', lineHeight: 1.55 }}>
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
                      <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontStyle: 'italic', color: '#B45309', borderTop: '1px dashed #FDE68A', paddingTop: '0.4rem' }}>
                        💡 Hitung kembali nilai di atas menggunakan kertas buram / kalkulator, lalu masukkan jawabanmu kembali!
                      </div>
                    </div>
                  )}

                  {isCorrect && (
                    <div
                      className="fade-in"
                      style={{
                        marginTop: '0.75rem',
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        borderRadius: '8px',
                        padding: '0.65rem 0.9rem',
                        fontSize: '0.84rem',
                        color: '#065F46'
                      }}
                    >
                      <strong>✓ Pembahasan Lengkap:</strong> {q.solution}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* BAGIAN B: 1 SOAL ISIAN PANJANG (URAIAN KONSEPTUAL) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ background: '#7C3AED', color: '#FFFFFF', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 800 }}>
              Bagian B
            </span>
            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              1 Soal Isian Panjang (Uraian Konseptual & Teori Partikel)
            </h4>
          </div>

          <div style={{
            background: isQ6Submitted ? '#F5F3FF' : '#FFFFFF',
            border: isQ6Submitted ? '1.5px solid #C4B5FD' : '1.5px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1.35rem',
            boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                background: isQ6Submitted ? '#EDE9FE' : '#F1F5F9',
                color: isQ6Submitted ? '#6D28D9' : '#475569',
                padding: '0.2rem 0.65rem',
                borderRadius: '6px'
              }}>
                Soal 6 • Isian Panjang (Uraian)
              </span>
              {isQ6Submitted && (
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#7C3AED' }}>
                  ✓ Jawaban Uraian Tersimpan (+1 Poin)
                </span>
              )}
            </div>

            <p style={{ margin: '0 0 1rem 0', fontSize: '1.02rem', color: '#0F172A', lineHeight: 1.6 }}>
              <strong>6.</strong> Jelaskan secara mendalam berdasarkan <em>teori kinetik partikel di permukaan cairan</em>, mengapa penambahan zat terlarut nonvolatil (seperti glukosa atau sukrosa) dapat menyebabkan:
              <br />
              <strong>(a)</strong> Penurunan tekanan uap jenuh (ΔP), dan
              <br />
              <strong>(b)</strong> Kenaikan titik didih larutan (ΔTb) dibandingkan pelarut murninya!
            </p>

            <form onSubmit={handleQ6Submit}>
              <textarea
                rows={5}
                placeholder="Tuliskan penjelasan ilmiahmu di sini (analogi partikel permukaan, laju penguapan, dan syarat mendidih Patm)..."
                value={answers.q6}
                onChange={(e) => setAnswers(prev => ({ ...prev, q6: e.target.value }))}
                disabled={isQ6Submitted}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: isQ6Submitted ? '1.5px solid #A78BFA' : '1.5px solid #CBD5E1',
                  background: isQ6Submitted ? '#FFFFFF' : '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  outline: 'none',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                  Karakter: {answers.q6.trim().length} (minimal 20 karakter)
                </span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {isQ6Submitted && (
                    <button
                      type="button"
                      onClick={() => setIsQ6Submitted(false)}
                      style={{
                        padding: '0.55rem 1rem',
                        fontSize: '0.85rem',
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#475569'
                      }}
                    >
                      ✏️ Edit Jawaban
                    </button>
                  )}
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isQ6Submitted || answers.q6.trim().length < 20}
                    style={{
                      padding: '0.55rem 1.25rem',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      background: isQ6Submitted ? '#10B981' : '#7C3AED',
                      cursor: isQ6Submitted ? 'default' : 'pointer'
                    }}
                  >
                    {isQ6Submitted ? '✓ Uraian Terkirim' : 'Kirim Jawaban Uraian'}
                  </Button>
                </div>
              </div>
            </form>

            {/* UMPAN BALIK LENGKAP & KUNCI JAWABAN GURU */}
            {isQ6Submitted && (
              <div
                className="fade-in"
                style={{
                  marginTop: '1.25rem',
                  background: '#FFFFFF',
                  border: '1.5px solid #DDD6FE',
                  borderRadius: '10px',
                  padding: '1.1rem 1.25rem',
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.6rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🎓</span>
                  <strong style={{ color: '#5B21B6', fontSize: '1rem' }}>
                    Pembahasan & Kunci Konsep Ilmiah Guru:
                  </strong>
                </div>

                <div style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.65 }}>
                  <p style={{ margin: '0 0 0.6rem 0' }}>
                    <strong>(a) Mengapa Tekanan Uap Turun (ΔP):</strong> Pada pelarut murni, 100% luas permukaan cairan terbuka untuk pelepasan molekul air ke fase uap. Saat zat terlarut nonvolatil (glukosa) ditambahkan, molekul glukosa tersebar dan menempati sebagian slot di permukaan. Akibatnya, frekuensi molekul air yang berhasil melepaskan diri menjadi uap berkurang, sehingga tekanan uap jenuh larutan selalu lebih rendah daripada air murni (Hukum Raoult).
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong>(b) Mengapa Titik Didih Naik (ΔTb):</strong> Syarat suatu cairan mendidih adalah tekanan uap jenuhnya harus sama dengan tekanan udara luar (1 atm = 760 mmHg). Karena penambahan glukosa menurunkan tekanan uapnya, maka pada suhu 100 °C larutan belum mampu mencapai 1 atm. Larutan membutuhkan kalor dan suhu pemanasan yang lebih tinggi (di atas 100 °C) agar molekul-molekul memiliki energi kinetik cukup untuk menghasilkan tekanan uap sebesar 1 atm. Kenaikan inilah yang disebut kenaikan titik didih (ΔTb).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

