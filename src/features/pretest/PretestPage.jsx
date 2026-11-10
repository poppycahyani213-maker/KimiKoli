import React, { useState, useEffect } from 'react';
import { PRETEST_QUESTIONS } from '../../data/pretestQuestions';

/**
 * Komponen PretestPage
 * 
 * Aturan Pengerjaan & Mode Ujian Terkunci:
 * - Kunci jawaban TIDAK dimunculkan di awal.
 * - Siswa memilih opsi A, B, C, D, atau E lalu menekan "Periksa Jawaban".
 * - Jika SALAH: Munculkan tanda salah, kunci jawaban yang benar, dan pembahasannya.
 * - Jika BENAR: Munculkan tanda benar, apresiasi, dan alasan ilmiah mengapa jawaban tersebut tepat.
 * - Jawaban tersimpan otomatis per soal ke akun siswa (aman dari reload / relogin).
 * - Setelah pretest tuntas, siswa dapat meninjau seluruh pembahasan atau lanjut belajar.
 */
export default function PretestPage({ 
  onBackToHome, 
  onGoToChapter1, 
  onFinishPretest,
  savedAnswers = {},
  isPretestCompleted = false,
  onSaveAnswer,
  onResetPretest
}) {
  const totalQuestions = PRETEST_QUESTIONS.length;

  // Inisialisasi riwayat pengerjaan dari data akun yang tersimpan
  const [history, setHistory] = useState(() => savedAnswers || {});

  // Cek apakah pretest sudah selesai sebelumnya
  const hasFinishedAll = 
    Boolean(isPretestCompleted) || 
    (savedAnswers && Object.keys(savedAnswers).length >= totalQuestions);

  const [isFinished, setIsFinished] = useState(hasFinishedAll);
  const [showReview, setShowReview] = useState(false);

  // Cari index soal pertama yang belum terjawab
  const initialIndex = () => {
    if (hasFinishedAll) return 0;
    if (!savedAnswers) return 0;
    const firstUnanswered = PRETEST_QUESTIONS.findIndex(q => !savedAnswers[q.id]);
    return firstUnanswered >= 0 ? firstUnanswered : 0;
  };

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentQ = PRETEST_QUESTIONS[currentIndex] || PRETEST_QUESTIONS[0];

  const currentHistory = history[currentQ?.id];
  const [selectedOption, setSelectedOption] = useState(() => currentHistory?.chosenKey || null);
  const [isSubmitted, setIsSubmitted] = useState(() => Boolean(currentHistory));

  // Sinkronisasi saat berganti akun / update savedAnswers dari parent
  useEffect(() => {
    if (savedAnswers && Object.keys(savedAnswers).length > 0) {
      setHistory(savedAnswers);
      if (Object.keys(savedAnswers).length >= totalQuestions || isPretestCompleted) {
        setIsFinished(true);
      }
    }
  }, [savedAnswers, isPretestCompleted, totalQuestions]);

  // Sinkronisasi saat pindah index soal
  useEffect(() => {
    const qHist = history[currentQ?.id];
    if (qHist) {
      setSelectedOption(qHist.chosenKey);
      setIsSubmitted(true);
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  }, [currentIndex, currentQ?.id, history]);

  // Proteksi: Peringatan jika siswa ingin keluar saat sedang di tengah ujian
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isFinished && Object.keys(history).length > 0 && Object.keys(history).length < totalQuestions) {
        e.preventDefault();
        e.returnValue = 'Pretest sedang berlangsung. Jawaban Anda yang sudah diperiksa telah tersimpan otomatis.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFinished, history, totalQuestions]);

  // Pilih opsi jawaban
  const handleSelectOption = (key) => {
    if (isSubmitted) return;
    setSelectedOption(key);
  };

  // Periksa jawaban dan simpan progres secara instan ke profil akun
  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;

    const isCorrect = selectedOption === currentQ.correctKey;
    setIsSubmitted(true);

    const updatedHistory = {
      ...history,
      [currentQ.id]: {
        chosenKey: selectedOption,
        isCorrect
      }
    };

    setHistory(updatedHistory);

    // Simpan ke storage melalui callback parent
    if (onSaveAnswer) {
      onSaveAnswer(updatedHistory);
    }
  };

  // Navigasi ke soal berikutnya atau selesaikan pretest
  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
    } else {
      // Selesai soal terakhir: Tuntaskan pretest
      setIsFinished(true);
      const finalCorrect = Object.values(history).filter(h => h.isCorrect).length;
      if (onFinishPretest) {
        onFinishPretest({ score: finalCorrect, total: totalQuestions, answers: history });
      }
    }
  };

  // Navigasi nomor soal di stepper
  const handleJumpToQuestion = (idx) => {
    setCurrentIndex(idx);
  };

  // Hitung jumlah jawaban benar
  const correctCount = Object.values(history).filter(h => h.isCorrect).length;

  // =========================================================
  // TAMPILAN 1: RINGKASAN AKHIR PRETEST (SUDAH DIKERJAKAN)
  // =========================================================
  if (isFinished) {
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="quiz-container fade-in" style={{ padding: '1.5rem 0 3rem', fontFamily: "'Times New Roman', Times, serif" }}>
        <div className="quiz-summary-card">
          <div style={{ fontSize: '3.2rem', marginBottom: '0.5rem' }}>🎉</div>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#ECFDF5',
            color: '#065F46',
            border: '1px solid #A7F3D0',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            fontWeight: 700,
            marginBottom: '0.85rem'
          }}>
            <span>🔓</span>
            <span>Pretest Tuntas • Materi & Misi Selanjutnya Terbuka!</span>
          </div>

          <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.5rem', color: '#0F172A' }}>
            Selamat! Bekal Prasyarat Selesai Diuji
          </h2>
          
          <p style={{ color: '#64748B', maxWidth: '560px', margin: '0 auto 1.75rem', lineHeight: 1.6, fontSize: '0.98rem' }}>
            Seluruh jawabanmu telah tersimpan rapi pada akun ini. Kamu dapat meninjau pembahasan lengkap di bawah atau langsung melanjutkan belajar ke <strong>Materi Bab 1: Konsentrasi Larutan</strong>.
          </p>

          {/* Kotak Hasil Skor */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2rem',
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 2.25rem',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.825rem', color: '#64748B', fontWeight: 600 }}>Jawaban Benar</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981' }}>
                {correctCount} <span style={{ fontSize: '1rem', color: '#94A3B8' }}>/ {totalQuestions}</span>
              </div>
            </div>
            <div style={{ width: 1, height: 40, background: '#CBD5E1' }}></div>
            <div>
              <div style={{ fontSize: '0.825rem', color: '#64748B', fontWeight: 600 }}>Skor Penguasaan</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284C7' }}>
                {scorePercentage}%
              </div>
            </div>
            <div style={{ width: 1, height: 40, background: '#CBD5E1' }}></div>
            <div>
              <div style={{ fontSize: '0.825rem', color: '#64748B', fontWeight: 600 }}>Reward Misi 1</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#F59E0B', marginTop: '0.15rem' }}>
                +20 XP ⭐
              </div>
            </div>
          </div>

          {/* Tombol Aksi Navigasi Utama */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onBackToHome}
              style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
            >
              ← Kembali ke Beranda
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onGoToChapter1}
              style={{ padding: '0.75rem 1.8rem', fontSize: '1rem', background: '#0284C7' }}
            >
              Lanjut Belajar Bab 1: Konsentrasi Larutan →
            </button>
            <button
              type="button"
              onClick={() => setShowReview(!showReview)}
              style={{
                padding: '0.75rem 1.4rem',
                fontSize: '0.95rem',
                border: '1.5px solid #0284C7',
                background: showReview ? '#E0F2FE' : '#FFFFFF',
                color: '#0284C7',
                borderRadius: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: "'Times New Roman', Times, serif"
              }}
            >
              {showReview ? '▲ Sembunyikan Pembahasan' : '📋 Tinjau Jawaban & Pembahasan Lengkap'}
            </button>
          </div>

          {/* Opsi Ulangi Pretest jika diinginkan */}
          {onResetPretest && (
            <div style={{ marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Apakah kamu ingin mengulang pengerjaan Pretest dari awal? Riwayat jawaban sebelumnya akan diperbarui.")) {
                    onResetPretest();
                    setHistory({});
                    setIsFinished(false);
                    setCurrentIndex(0);
                    setSelectedOption(null);
                    setIsSubmitted(false);
                  }
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  fontSize: '0.82rem',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                🔄 Ulangi Pretest dari Awal
              </button>
            </div>
          )}

          {/* =========================================================
              PANEL TINJAU JAWABAN & PEMBAHASAN SEMUA SOAL
              ========================================================= */}
          {showReview && (
            <div className="fade-in" style={{
              marginTop: '2rem',
              textAlign: 'left',
              borderTop: '2px solid #E2E8F0',
              paddingTop: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.25rem' }}>
                📋 Rekap Pembahasan 8 Soal Pretest Prasyarat
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {PRETEST_QUESTIONS.map((q, idx) => {
                  const studentAns = history[q.id];
                  const chosenOpt = q.options.find(o => o.key === studentAns?.chosenKey);
                  const correctOpt = q.options.find(o => o.key === q.correctKey);
                  const isAnsCorrect = studentAns?.isCorrect;

                  return (
                    <div 
                      key={q.id}
                      style={{
                        background: '#FFFFFF',
                        border: `1.5px solid ${isAnsCorrect ? '#A7F3D0' : '#FECACA'}`,
                        borderRadius: '14px',
                        padding: '1.25rem',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>
                          Soal #{idx + 1} • {q.topic}
                        </span>
                        <span style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          padding: '0.2rem 0.65rem',
                          borderRadius: '8px',
                          background: isAnsCorrect ? '#DCFCE7' : '#FEE2E2',
                          color: isAnsCorrect ? '#166534' : '#991B1B'
                        }}>
                          {isAnsCorrect ? '✓ Jawaban Anda Benar' : '✕ Jawaban Anda Kurang Tepat'}
                        </span>
                      </div>

                      <p style={{ margin: '0 0 0.85rem', fontSize: '0.96rem', color: '#334155', lineHeight: 1.55 }}>
                        {q.question}
                      </p>

                      <div style={{ fontSize: '0.9rem', marginBottom: '0.75rem', background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                        <div>
                          <strong>Jawaban yang Anda pilih: </strong> 
                          <span style={{ color: isAnsCorrect ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
                            {studentAns?.chosenKey ? `(${studentAns.chosenKey}) ${chosenOpt?.text}` : '(Belum dijawab)'}
                          </span>
                        </div>
                        {!isAnsCorrect && (
                          <div style={{ marginTop: '0.25rem', color: '#166534' }}>
                            <strong>Kunci Jawaban yang Benar: </strong> ({q.correctKey}) {correctOpt?.text}
                          </div>
                        )}
                      </div>

                      <div style={{
                        background: '#F0F9FF',
                        borderLeft: '4px solid #0284C7',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '6px',
                        fontSize: '0.88rem',
                        color: '#0C4A6E'
                      }}>
                        <strong>💡 Penjelasan Ilmiah: </strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // =========================================================
  // TAMPILAN 2: LEMBAR SOAL PRETEST BERJALAN (TERKUNCI)
  // =========================================================
  const isCorrect = isSubmitted && selectedOption === currentQ.correctKey;
  const correctOptionObj = currentQ.options.find(o => o.key === currentQ.correctKey);

  return (
    <div className="quiz-container fade-in" style={{ padding: '0.5rem 0 3rem', fontFamily: "'Times New Roman', Times, serif" }}>
      {/* 1. Header & Stepper Soal */}
      <div className="quiz-header-card">
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#FEF3C7',
            color: '#B45309',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.78rem',
            fontWeight: 700,
            marginBottom: '0.5rem'
          }}>
            <span>🔒</span>
            <span>Ujian Prasyarat Terkunci</span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#0F172A' }}>
            Pretest Sifat Koligatif Larutan
          </h3>
          <p style={{ margin: '0.25rem 0 0', color: '#64748B', fontSize: '0.9rem' }}>
            Pilih satu jawaban terbaik dan periksa jawaban untuk melihat kunci dan pembahasannya.
          </p>
        </div>

        {/* Stepper Indikator 8 Soal */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {PRETEST_QUESTIONS.map((q, idx) => {
            const hist = history[q.id];
            const isCurrent = idx === currentIndex;
            
            let bg = '#F1F5F9';
            let color = '#64748B';
            let border = '1px solid #CBD5E1';

            if (hist) {
              bg = hist.isCorrect ? '#DCFCE7' : '#FEE2E2';
              color = hist.isCorrect ? '#166534' : '#991B1B';
              border = `1.5px solid ${hist.isCorrect ? '#10B981' : '#EF4444'}`;
            }

            if (isCurrent) {
              border = '2px solid #0284C7';
              color = '#0284C7';
              bg = hist ? bg : '#E0F2FE';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => handleJumpToQuestion(idx)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: bg,
                  color: color,
                  border: border,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
                title={`Soal ${idx + 1}${hist ? (hist.isCorrect ? ' (Benar)' : ' (Kurang Tepat)') : ' (Belum Dijawab)'}`}
              >
                {hist ? (hist.isCorrect ? '✓' : '✕') : (idx + 1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Kartu Soal */}
      <div className="question-card">
        {/* Meta Baris Topik & Tingkat Kognitif */}
        <div className="question-meta-row">
          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0284C7', background: '#EFF6FF', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)' }}>
            Materi: {currentQ.topic}
          </span>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B', background: '#F1F5F9', padding: '0.25rem 0.6rem', border: '1px solid #E2E8F0', borderRadius: '4px' }}>
            Level {currentQ.bloomLevel}
          </span>
        </div>

        {/* Teks Soal */}
        <div className="question-text">
          {currentQ.question}
        </div>

        {/* 3. Daftar Pilihan Jawaban A, B, C, D, E */}
        <div className="options-list">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.key;
            
            // Logika styling setelah tombol periksa ditekan
            let optionClass = '';
            if (isSelected) optionClass = 'selected';
            
            if (isSubmitted) {
              if (opt.key === currentQ.correctKey) {
                optionClass = 'correct-reveal';
              } else if (isSelected && !isCorrect) {
                optionClass = 'wrong-selected';
              } else {
                optionClass = 'disabled';
              }
            }

            return (
              <div
                key={opt.key}
                className={`option-item ${optionClass}`}
                onClick={() => handleSelectOption(opt.key)}
              >
                <div className="option-key-badge">
                  {opt.key}
                </div>
                <div style={{ flex: 1, lineHeight: 1.5 }}>
                  {opt.text}
                </div>
                {/* Ikon status jika sudah diperiksa */}
                {isSubmitted && opt.key === currentQ.correctKey && (
                  <span style={{ fontSize: '1.2rem', color: '#10B981', fontWeight: 800 }}>✓</span>
                )}
                {isSubmitted && isSelected && !isCorrect && (
                  <span style={{ fontSize: '1.2rem', color: '#EF4444', fontWeight: 800 }}>✕</span>
                )}
              </div>
            );
          })}
        </div>

        {/* 4. Kotak Umpan Balik (HANYA MUNCUL SETELAH DIPERIKSA) */}
        {isSubmitted && (
          <div className={`feedback-box ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? (
              <>
                <div className="feedback-title">
                  <span>🎉</span>
                  <span>Jawabanmu Tepat Sekali!</span>
                </div>
                <div className="feedback-explanation">
                  <strong>Mengapa jawaban ini benar?</strong>
                  <p style={{ margin: '0.4rem 0 0' }}>{currentQ.explanation}</p>
                </div>
              </>
            ) : (
              <>
                <div className="feedback-title">
                  <span>✕</span>
                  <span>Jawabanmu Belum Tepat</span>
                </div>
                <div>
                  <div className="feedback-key-highlight">
                    Kunci Jawaban yang Benar: ({currentQ.correctKey}) {correctOptionObj?.text}
                  </div>
                  <div className="feedback-explanation">
                    <strong>Penjelasan Ilmiah:</strong>
                    <p style={{ margin: '0.4rem 0 0' }}>{currentQ.explanation}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* 5. Tombol Aksi Bawah */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #F1F5F9' }}>
          {!isSubmitted ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmitAnswer}
              disabled={!selectedOption}
              style={{ padding: '0.75rem 1.8rem' }}
            >
              Periksa Jawaban
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNextQuestion}
              style={{ padding: '0.75rem 1.8rem', background: '#0F172A' }}
            >
              {currentIndex < totalQuestions - 1 ? 'Soal Berikutnya →' : 'Selesaikan Pretest & Lihat Hasil →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
