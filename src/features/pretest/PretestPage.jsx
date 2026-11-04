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
 * - Siswa TIDAK BISA KELUAR atau pindah fitur lain sebelum 8 soal selesai dikerjakan.
 * - Setelah pretest tuntas, otomatis membuka step materi berikutnya di beranda!
 */
export default function PretestPage({ onBackToHome, onGoToChapter1, onFinishPretest }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Menyimpan riwayat pengerjaan siswa: { [questionId]: { chosenKey, isCorrect } }
  const [history, setHistory] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = PRETEST_QUESTIONS[currentIndex];
  const totalQuestions = PRETEST_QUESTIONS.length;

  // Proteksi: Mencegah siswa menutup tab/refresh peramban saat pretest sedang berjalan
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isFinished) {
        e.preventDefault();
        e.returnValue = 'Pretest sedang berlangsung. Progres Anda akan hilang jika keluar sekarang.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFinished]);

  // Pilih jawaban
  const handleSelectOption = (key) => {
    if (isSubmitted) return; // Jika sudah diperiksa, kunci pilihan sebelum lanjut
    setSelectedOption(key);
  };

  // Periksa jawaban
  const handleSubmitAnswer = () => {
    if (!selectedOption || isSubmitted) return;

    const isCorrect = selectedOption === currentQ.correctKey;
    setIsSubmitted(true);
    setHistory(prev => ({
      ...prev,
      [currentQ.id]: {
        chosenKey: selectedOption,
        isCorrect
      }
    }));
  };

  // Navigasi ke soal berikutnya atau selesaikan pretest
  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      
      // Jika soal berikutnya sudah pernah dijawab, muat state-nya
      const nextHistory = history[PRETEST_QUESTIONS[nextIndex].id];
      if (nextHistory) {
        setSelectedOption(nextHistory.chosenKey);
        setIsSubmitted(true);
      } else {
        setSelectedOption(null);
        setIsSubmitted(false);
      }
    } else {
      // Selesai soal 8: Tuntaskan pretest dan buka akses fitur lain
      setIsFinished(true);
      if (onFinishPretest) {
        const finalCorrect = Object.values(history).filter(h => h.isCorrect).length;
        onFinishPretest({ score: finalCorrect, total: totalQuestions });
      }
    }
  };

  // Navigasi lewat nomor soal di stepper atas
  const handleJumpToQuestion = (idx) => {
    setCurrentIndex(idx);
    const targetHistory = history[PRETEST_QUESTIONS[idx].id];
    if (targetHistory) {
      setSelectedOption(targetHistory.chosenKey);
      setIsSubmitted(true);
    } else {
      setSelectedOption(null);
      setIsSubmitted(false);
    }
  };

  // Hitung skor total
  const correctCount = Object.values(history).filter(h => h.isCorrect).length;

  // =========================================================
  // TAMPILAN 1: RINGKASAN AKHIR PRETEST (KUNCI TERBUKA)
  // =========================================================
  if (isFinished) {
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="quiz-container fade-in" style={{ padding: '1.5rem 0 3rem' }}>
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
          
          <p style={{ color: '#64748B', maxWidth: '540px', margin: '0 auto 1.75rem', lineHeight: 1.6, fontSize: '0.98rem' }}>
            Kamu telah menuntaskan seluruh 8 soal prasyarat. Status di beranda telah diperbarui, dan kamu kini siap mempelajari <strong>Materi Konsentrasi Larutan & Simulasi Lab Virtual</strong>.
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
            marginBottom: '2rem',
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

          {/* Tombol Aksi Lanjut */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onBackToHome}
              style={{ padding: '0.8rem 1.6rem', fontSize: '0.98rem' }}
            >
              ← Kembali ke Peta Misi (Beranda)
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onGoToChapter1}
              style={{ padding: '0.8rem 2rem', fontSize: '1rem', background: '#0284C7' }}
            >
              Lanjut ke Materi Konsentrasi & Lab Virtual →
            </button>
          </div>
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
    <div className="quiz-container fade-in" style={{ padding: '0.5rem 0 3rem' }}>
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
            <span>Ujian Terkunci • Selesaikan 8 Soal untuk Buka Materi</span>
          </div>

          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
            Pretest Bekal Prasyarat: <span style={{ color: '#0284C7' }}>Soal {currentIndex + 1} dari {totalQuestions}</span>
          </div>
        </div>

        {/* Nomor-nomor soal 1 s.d. 8 */}
        <div className="question-stepper">
          {PRETEST_QUESTIONS.map((q, idx) => {
            const h = history[q.id];
            let stateClass = '';
            if (idx === currentIndex) stateClass = 'active';
            else if (h) {
              stateClass = h.isCorrect ? 'answered-correct' : 'answered-wrong';
            }

            return (
              <button
                key={q.id}
                type="button"
                className={`step-num-btn ${stateClass}`}
                onClick={() => handleJumpToQuestion(idx)}
                title={`Soal ${idx + 1}: ${q.topic}`}
              >
                {idx + 1}
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
                // Kunci jawaban dimunculkan (berwarna hijau)
                optionClass = 'correct-reveal';
              } else if (isSelected && !isCorrect) {
                // Jawaban salah yang dipilih siswa berwarna merah
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
                  <span>❌</span>
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
              {currentIndex < totalQuestions - 1 ? 'Soal Berikutnya →' : 'Selesaikan Pretest & Lanjut ke Materi →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
