import React, { useState, useEffect, useMemo } from 'react';
import diagnosticData from '../../data/diagnosticQuestions.json';
import { 
  gradeQuestion, 
  evaluateAssessment, 
  shuffleArray, 
  interpretConfidence 
} from '../../utils/diagnosticScoring';
import DiagnosticGraph from './DiagnosticGraph';

/**
 * Halaman Asesmen Diagnostik Sifat Koligatif Larutan
 * 
 * Fitur:
 * - 10 Soal diagnostik disajikan satu per satu (Progress Bar "Soal x dari 10")
 * - Panel Konstanta (Kf = 1,86 °C/m, Kb = 0,52 °C/m) selalu terlihat
 * - Pengacakan opsi jawaban & alasan Tingkat 2 per sesi asesmen
 * - Tipe: multi_select (Soal 1), true_false_set (Soal 2), single (Soal 3, 7-10), two_tier (Soal 4-6)
 * - Grafik garis & tabel suhu vs waktu interaktif responsif pada Soal 2 dan 6
 * - Validasi lengkap: Two-tier mewajibkan Tingkat 1, Tingkat 2, dan skala keyakinan 1-5
 * - Layar ringkasan sebelum kirim dengan status per soal
 * - Penilaian otomatis, rincian skor, pembahasan per soal, dan Laporan Diagnostik Miskonsepsi
 * - Riwayat percobaan tersimpan per username
 */
/**
 * Helper informasi visual kategori pemahaman (P, PS, M, TP)
 * Menjamin konsistensi warna, ikon, dan label di tabel desktop & kartu mobile
 */
const getCategoryMeta = (cat) => {
  if (cat === 'P') {
    return {
      label: 'P - Paham Konsep',
      icon: '✅',
      badgeBg: '#D1FAE5',
      badgeColor: '#065F46',
      cardBg: '#F0FDF4',
      border: '#10B981',
      statusText: '✓ Paham Konsep'
    };
  }
  if (cat === 'PS') {
    return {
      label: 'PS - Paham Sebagian',
      icon: '⚠️',
      badgeBg: '#FEF3C7',
      badgeColor: '#92400E',
      cardBg: '#FFFBEB',
      border: '#F59E0B',
      statusText: 'Paham Sebagian'
    };
  }
  if (cat && cat.startsWith('M')) {
    return {
      label: `${cat} - Miskonsepsi`,
      icon: '❌',
      badgeBg: '#FEE2E2',
      badgeColor: '#991B1B',
      cardBg: '#FEF2F2',
      border: '#EF4444',
      statusText: `⚠️ Terdeteksi ${cat}`
    };
  }
  // TP (Tidak Paham) / default
  return {
    label: 'TP - Tidak Paham',
    icon: '❓',
    badgeBg: '#F1F5F9',
    badgeColor: '#475569',
    cardBg: '#F8FAFC',
    border: '#94A3B8',
    statusText: 'Tidak Paham'
  };
};

export default function DiagnosticAssessmentPage({
  currentUser = null,
  onBackToHome,
  savedProgress = null,
  onSaveResult
}) {
  const { konstanta, soal: rawQuestions } = diagnosticData;

  // Status riwayat asesmen yang sudah tersimpan untuk user ini
  const initialHistory = savedProgress?.attempts || [];
  const [attempts, setAttempts] = useState(initialHistory);

  // Mode tampilan: 'intro' | 'exam' | 'summary' | 'result'
  const [mode, setMode] = useState(() => {
    return initialHistory.length > 0 ? 'result' : 'exam';
  });

  // Kunci draft per user agar jawaban tidak hilang jika browser ditutup/refresh
  const draftKey = `kimikoli:${currentUser?.uid ?? currentUser?.username ?? 'guest'}:diagnostic-draft`;

  // Muat draft & index soal terakhir saat mount (jika ada)
  const initialDraftData = useMemo(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return { responses: {}, index: 0 };
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        if (parsed.responses && typeof parsed.responses === 'object') {
          return {
            responses: parsed.responses,
            index: typeof parsed.currentIndex === 'number' && parsed.currentIndex >= 0 && parsed.currentIndex < 10
              ? parsed.currentIndex
              : 0
          };
        }
        // Kompatibilitas format draft lama (hanya object userResponses langsung)
        return { responses: parsed, index: 0 };
      }
    } catch {
      return { responses: {}, index: 0 };
    }
    return { responses: {}, index: 0 };
  }, [draftKey]);

  // Nomor index soal aktif (0 sampai 9), melanjutkan dari draft jika ada
  const [currentIndex, setCurrentIndex] = useState(() => initialDraftData.index);

  // State jawaban peserta didik: { [soalNo]: any }
  // Soal 1: string[]
  // Soal 2: { [stmtId]: boolean }
  // Soal 3, 7-10: string id
  // Soal 4-6: { t1: string, t2: string, confidence: number }
  const [userResponses, setUserResponses] = useState(() => initialDraftData.responses);

  // Simpan draft setiap jawaban atau nomor soal berubah (hanya saat belum submit/bukan mode result)
  useEffect(() => {
    if (mode === 'result') return;
    try {
      localStorage.setItem(draftKey, JSON.stringify({
        responses: userResponses,
        currentIndex: currentIndex
      }));
    } catch {
      /* abaikan, jangan matikan halaman */
    }
  }, [userResponses, currentIndex, draftKey, mode]);

  // Hapus draft setelah submit berhasil (bukan riwayat)
  const clearDraft = () => {
    try { localStorage.removeItem(draftKey); } catch {}
  };

  // Simpan hasil evaluasi terakhir
  const [latestEvaluation, setLatestEvaluation] = useState(() => {
    if (initialHistory.length > 0) {
      return initialHistory[initialHistory.length - 1];
    }
    return null;
  });

  // Inisialisasi pengacakan opsi per percobaan ujian
  // Acak urutan opsi (Soal 1, 3, 7, 8, 9, 10) dan alasan Tingkat 2 (Soal 4-6)
  const [shuffledQuestions, setShuffledQuestions] = useState(() => {
    return rawQuestions.map(q => {
      const qCopy = { ...q };
      if (['multi_select', 'single'].includes(q.tipe) && Array.isArray(q.opsi)) {
        qCopy.displayOpsi = shuffleArray(q.opsi);
      } else if (q.tipe === 'two_tier') {
        qCopy.tingkat1 = { ...q.tingkat1, opsi: [...(q.tingkat1?.opsi || [])] };
        qCopy.tingkat2 = { ...q.tingkat2, displayOpsi: shuffleArray(q.tingkat2?.opsi || []) };
      }
      return qCopy;
    });
  });

  // Fungsi untuk memulai ulang ujian (acak opsi baru)
  const handleStartFreshAssessment = () => {
    const newShuffled = rawQuestions.map(q => {
      const qCopy = { ...q };
      if (['multi_select', 'single'].includes(q.tipe) && Array.isArray(q.opsi)) {
        qCopy.displayOpsi = shuffleArray(q.opsi);
      } else if (q.tipe === 'two_tier') {
        qCopy.tingkat1 = { ...q.tingkat1, opsi: [...(q.tingkat1?.opsi || [])] };
        qCopy.tingkat2 = { ...q.tingkat2, displayOpsi: shuffleArray(q.tingkat2?.opsi || []) };
      }
      return qCopy;
    });

    setShuffledQuestions(newShuffled);
    setUserResponses({});
    setCurrentIndex(0);
    setMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      localStorage.setItem(draftKey, JSON.stringify({
        responses: {},
        currentIndex: 0
      }));
    } catch {}
  };

  const currentQ = shuffledQuestions[currentIndex];

  // Helper cek apakah soal sudah terisi dengan lengkap
  const isQuestionAnswered = (q, resp) => {
    if (!resp) return false;
    if (q.tipe === 'multi_select') {
      return Array.isArray(resp) && resp.length > 0;
    }
    if (q.tipe === 'true_false_set') {
      if (!resp || typeof resp !== 'object') return false;
      return q.pernyataan.every(p => resp[p.id] !== undefined && resp[p.id] !== null);
    }
    if (q.tipe === 'single') {
      return typeof resp === 'string' && resp.trim().length > 0;
    }
    if (q.tipe === 'two_tier') {
      return Boolean(resp.t1 && resp.t2 && resp.confidence);
    }
    return false;
  };

  const isCurrentQValid = isQuestionAnswered(currentQ, userResponses[currentQ.no]);

  // Handler perubahan jawaban
  const handleMultiSelectToggle = (optionId) => {
    const currentList = Array.isArray(userResponses[currentQ.no]) ? userResponses[currentQ.no] : [];
    const updated = currentList.includes(optionId)
      ? currentList.filter(id => id !== optionId)
      : [...currentList, optionId];
    setUserResponses(prev => ({ ...prev, [currentQ.no]: updated }));
  };

  const handleTrueFalseSelect = (stmtId, boolVal) => {
    const currentObj = (typeof userResponses[currentQ.no] === 'object' && !Array.isArray(userResponses[currentQ.no]))
      ? userResponses[currentQ.no]
      : {};
    setUserResponses(prev => ({
      ...prev,
      [currentQ.no]: { ...currentObj, [stmtId]: boolVal }
    }));
  };

  const handleSingleSelect = (optionId) => {
    setUserResponses(prev => ({ ...prev, [currentQ.no]: optionId }));
  };

  const handleTwoTierChange = (field, value) => {
    const currentTier = userResponses[currentQ.no] || { t1: null, t2: null, confidence: null };
    setUserResponses(prev => ({
      ...prev,
      [currentQ.no]: { ...currentTier, [field]: value }
    }));
  };

  // Hitung jumlah soal yang sudah terjawab
  const answeredCount = rawQuestions.filter(q => isQuestionAnswered(q, userResponses[q.no])).length;

  // Handler Submit / Kirim Jawaban
  const handleFinalSubmit = () => {
    const unanswered = rawQuestions.filter(q => !isQuestionAnswered(q, userResponses[q.no]));
    if (unanswered.length > 0) {
      const confirmSubmit = window.confirm(
        `Perhatian: Terdapat ${unanswered.length} soal yang belum Anda jawab (${unanswered.map(u => 'Soal ' + u.no).join(', ')}).\n\nApakah Anda yakin ingin mengirim jawaban sekarang?`
      );
      if (!confirmSubmit) return;
    }

    // Evaluasi seluruh jawaban
    const evalResult = evaluateAssessment(rawQuestions, userResponses);
    const newAttemptRecord = {
      timestamp: new Date().toISOString(),
      score: evalResult.totalScore,
      xpEarned: evalResult.xpEarned,
      responses: userResponses,
      evaluation: evalResult
    };

    const updatedAttempts = [...attempts, newAttemptRecord];
    setAttempts(updatedAttempts);
    setLatestEvaluation(newAttemptRecord);
    setMode('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    clearDraft();

    // Panggil callback simpan ke App / storage
    if (onSaveResult) {
      onSaveResult({
        attempts: updatedAttempts,
        latestScore: evalResult.totalScore,
        highestScore: Math.max(...updatedAttempts.map(a => a.score)),
        xpEarned: evalResult.xpEarned
      });
    }
  };

  // Navigasi ke soal tertentu
  const goToQuestion = (idx) => {
    setCurrentIndex(idx);
    setMode('exam');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', padding: '1rem', color: '#1E293B', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Aksesibilitas Keyboard & Penyesuaian Responsif */}
      <style>{`
        /* Fokus keyboard yang jelas */
        :focus-visible {
          outline: 2.5px solid #0284C7 !important;
          outline-offset: 2px !important;
        }

        input[type="radio"]:focus-visible,
        input[type="checkbox"]:focus-visible {
          outline: 2.5px solid #0284C7 !important;
          outline-offset: 2px !important;
          border-radius: 4px;
        }

        .summary-question-btn {
          background: none;
          border: none;
          font: inherit;
          cursor: pointer;
          width: 100%;
          text-align: center;
          transition: transform 0.1s ease, box-shadow 0.15s ease;
        }
        .summary-question-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }
        .summary-question-btn:focus-visible {
          outline: 3px solid #0284C7 !important;
          outline-offset: 2px !important;
        }

        .confidence-btn:focus-visible {
          outline: 3px solid #D97706 !important;
          outline-offset: 2px !important;
        }

        label:has(input[type="radio"]:focus-visible),
        label:has(input[type="checkbox"]:focus-visible) {
          outline: 2.5px solid #0284C7 !important;
          outline-offset: 2px !important;
        }

        .show-on-mobile { display: none; }
        .hide-on-mobile { display: inline; }

        /* Responsivitas Layar HP (< 640px) */
        @media (max-width: 639px) {
          .show-on-mobile { display: inline; }
          .hide-on-mobile { display: none; }

          .assessment-header {
            padding: 0.5rem 0.75rem !important;
            margin-bottom: 0.75rem !important;
            top: 4px !important;
            border-radius: 12px !important;
          }
          .assessment-title {
            font-size: 0.98rem !important;
          }
          .assessment-subtitle {
            display: none !important;
          }
          .const-panel {
            font-size: 0.74rem !important;
            padding: 0.2rem 0.5rem !important;
            gap: 0.4rem !important;
          }

          .bottom-nav-container {
            display: flex !important;
            flex-direction: row !important;
            gap: 0.35rem !important;
            width: 100% !important;
          }
          .nav-btn-right {
            display: flex !important;
            flex: 1 !important;
            gap: 0.35rem !important;
          }
          .nav-btn {
            padding: 0.55rem 0.65rem !important;
            font-size: 0.8rem !important;
          }
          .summary-btn {
            flex: 1 !important;
            text-align: center !important;
          }
          .next-btn, .finish-btn {
            flex: 1 !important;
            text-align: center !important;
          }

          .diag-table-desktop {
            display: none !important;
          }
          .diag-cards-mobile {
            display: flex !important;
            flex-direction: column;
            gap: 0.85rem;
          }
        }

        @media (min-width: 640px) {
          .diag-table-desktop {
            display: block !important;
          }
          .diag-cards-mobile {
            display: none !important;
          }
        }
      `}</style>
      
      {/* 1. Header & Panel Konstanta (Selalu Terlihat) */}
      <div className="assessment-header" style={{
        background: '#FFFFFF',
        border: '1.5px solid #BAE6FD',
        borderRadius: '16px',
        padding: '0.85rem 1.15rem',
        marginBottom: '1rem',
        boxShadow: '0 4px 12px rgba(2, 132, 199, 0.08)',
        position: 'sticky',
        top: '10px',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🏆</span>
              <h2 className="assessment-title" style={{ margin: 0, fontSize: '1.15rem', color: '#0369A1', fontWeight: 800 }}>
                Evaluasi Akhir Sifat Koligatif
              </h2>
            </div>
            <div className="assessment-subtitle" style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '0.15rem' }}>
              Evaluasi Pemahaman Konseptual, Penalaran Ilmiah & Capaian Belajar
            </div>
          </div>

          {/* Panel Konstanta Ramping */}
          <div className="const-panel" style={{
            background: '#F0F9FF',
            border: '1px solid #7DD3FC',
            borderRadius: '8px',
            padding: '0.35rem 0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#0369A1'
          }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0284C7', background: '#E0F2FE', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
              Konstanta
            </span>
            <span>Kf = 1,86</span>
            <span style={{ color: '#BAE6FD' }}>|</span>
            <span>Kb = 0,52 °C/m</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAMPILAN MODE SOAL (EXAM) */}
      {/* ======================================================== */}
      {mode === 'exam' && (
        <div>
          {/* Progress Bar & Header Soal */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{
                  background: '#0284C7',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  padding: '0.25rem 0.7rem',
                  borderRadius: '20px'
                }}>
                  Soal {currentIndex + 1} dari 10
                </span>
                <span style={{
                  background: '#F1F5F9',
                  color: '#475569',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '6px'
                }}>
                  Tingkat Kognitif {currentQ.level}
                </span>
                {currentQ.topik && (
                  <span style={{
                    background: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px'
                  }}>
                    Topik: {currentQ.topik}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: isCurrentQValid ? '#059669' : '#D97706', fontWeight: 600 }}>
                  {isCurrentQValid ? '✓ Sudah Terisi' : '⚠️ Belum Lengkap'}
                </span>
                <button
                  type="button"
                  onClick={() => setMode('summary')}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.3rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  📋 Ringkasan ({answeredCount}/10)
                </button>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${((currentIndex + 1) / 10) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #0284C7, #38BDF8)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Kartu Soal Utama */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.25rem',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)'
          }}>
            {/* Stimulus */}
            {currentQ.stimulus && (
              <div style={{
                background: '#F8FAFC',
                borderLeft: '4px solid #0284C7',
                padding: '0.9rem 1.1rem',
                borderRadius: '0 10px 10px 0',
                marginBottom: '1.25rem',
                fontSize: '0.95rem',
                lineHeight: 1.65,
                color: '#334155'
              }}>
                {currentQ.stimulus}
              </div>
            )}

            {/* Tabel Stimulus (Soal 1) */}
            {currentQ.tabel && (
              <div style={{ margin: '1rem 0 1.25rem', overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  <thead>
                    <tr style={{ background: '#E0F2FE', color: '#0369A1' }}>
                      {currentQ.tabel.kolom.map((col, idx) => (
                        <th key={`col-${idx}`} style={{ padding: '0.6rem 0.8rem', textAlign: 'left', fontWeight: 700, borderBottom: '1px solid #BAE6FD' }}>
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentQ.tabel.baris.map((row, rIdx) => (
                      <tr key={`row-${rIdx}`} style={{ background: rIdx % 2 === 0 ? '#FFFFFF' : '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        {row.map((val, cIdx) => (
                          <td key={`cell-${rIdx}-${cIdx}`} style={{ padding: '0.55rem 0.8rem', fontWeight: cIdx === 0 ? 600 : 400 }}>
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Grafik Stimulus (Soal 2 dan Soal 6) */}
            {currentQ.data_grafik && (
              <DiagnosticGraph
                dataGrafik={currentQ.data_grafik}
                title={`Kurva Pendinginan (Soal ${currentQ.no})`}
              />
            )}

            {/* Pertanyaan Utama */}
            {currentQ.pertanyaan && (
              <div style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '1.2rem', lineHeight: 1.5 }}>
                {currentQ.pertanyaan}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TIPE 1: MULTI_SELECT (Soal 1) */}
            {/* ---------------------------------------------------- */}
            {currentQ.tipe === 'multi_select' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ fontSize: '0.82rem', color: '#0369A1', fontStyle: 'italic', marginBottom: '0.2rem' }}>
                  💡 Petunjuk: Kamu dapat memilih lebih dari satu pernyataan yang benar.
                </div>
                {(currentQ.displayOpsi || currentQ.opsi).map(op => {
                  const selectedList = Array.isArray(userResponses[currentQ.no]) ? userResponses[currentQ.no] : [];
                  const isChecked = selectedList.includes(op.id);
                  return (
                    <label
                      key={`multi-${op.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: isChecked ? '2px solid #0284C7' : '1.5px solid #CBD5E1',
                        background: isChecked ? '#F0F9FF' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleMultiSelectToggle(op.id)}
                        style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#0284C7', cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1, fontSize: '0.92rem', lineHeight: 1.5 }}>
                        <strong style={{ color: isChecked ? '#0369A1' : '#334155', marginRight: '0.4rem' }}>
                          [{op.id}]
                        </strong>
                        {op.teks}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TIPE 2: TRUE_FALSE_SET (Soal 2) */}
            {/* ---------------------------------------------------- */}
            {currentQ.tipe === 'true_false_set' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                <div style={{ fontSize: '0.82rem', color: '#0369A1', fontStyle: 'italic', marginBottom: '0.2rem' }}>
                  💡 Tentukan pilihan "Benar" atau "Salah" untuk setiap butir pernyataan berikut:
                </div>
                {currentQ.pernyataan.map((stmt, idx) => {
                  const currentAns = userResponses[currentQ.no]?.[stmt.id];
                  return (
                    <div
                      key={`stmt-${stmt.id}`}
                      style={{
                        padding: '0.9rem 1rem',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: '12px',
                        background: currentAns !== undefined ? '#F8FAFC' : '#FFFFFF'
                      }}
                    >
                      <div style={{ fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '0.7rem' }}>
                        <span style={{ fontWeight: 700, color: '#0284C7', marginRight: '0.4rem' }}>
                          {idx + 1}.
                        </span>
                        {stmt.teks}
                      </div>
                      <div style={{ display: 'flex', gap: '0.6rem' }}>
                        <button
                          type="button"
                          onClick={() => handleTrueFalseSelect(stmt.id, true)}
                          style={{
                            flex: 1,
                            padding: '0.5rem 0.8rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            border: currentAns === true ? '2px solid #10B981' : '1px solid #CBD5E1',
                            background: currentAns === true ? '#D1FAE5' : '#FFFFFF',
                            color: currentAns === true ? '#065F46' : '#475569',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          ✓ Benar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTrueFalseSelect(stmt.id, false)}
                          style={{
                            flex: 1,
                            padding: '0.5rem 0.8rem',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            border: currentAns === false ? '2px solid #EF4444' : '1px solid #CBD5E1',
                            background: currentAns === false ? '#FEE2E2' : '#FFFFFF',
                            color: currentAns === false ? '#991B1B' : '#475569',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          ✕ Salah
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TIPE 3: SINGLE SELECT (Soal 3, 7, 8, 9, 10) */}
            {/* ---------------------------------------------------- */}
            {currentQ.tipe === 'single' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {(currentQ.displayOpsi || currentQ.opsi).map(op => {
                  const isSelected = userResponses[currentQ.no] === op.id;
                  return (
                    <label
                      key={`single-${op.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #0284C7' : '1.5px solid #CBD5E1',
                        background: isSelected ? '#F0F9FF' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <input
                        type="radio"
                        name={`q-${currentQ.no}`}
                        checked={isSelected}
                        onChange={() => handleSingleSelect(op.id)}
                        style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#0284C7', cursor: 'pointer' }}
                      />
                      <div style={{ flex: 1, fontSize: '0.92rem', lineHeight: 1.5 }}>
                        <strong style={{ color: isSelected ? '#0369A1' : '#334155', marginRight: '0.4rem' }}>
                          [{op.id}]
                        </strong>
                        {op.teks}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {/* ---------------------------------------------------- */}
            {/* TIPE 4: TWO-TIER (Soal 4, 5, 6) */}
            {/* ---------------------------------------------------- */}
            {currentQ.tipe === 'two_tier' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                
                {/* Tingkat 1: Pilihan Jawaban */}
                <div style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.1rem'
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0369A1', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ background: '#0284C7', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem' }}>
                      TINGKAT 1
                    </span>
                    {currentQ.tingkat1?.pertanyaan}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {(currentQ.tingkat1?.opsi || []).map(op => {
                      const isSelected = userResponses[currentQ.no]?.t1 === op.id;
                      return (
                        <label
                          key={`t1-${op.id}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.7rem 0.9rem',
                            borderRadius: '8px',
                            border: isSelected ? '2px solid #0284C7' : '1px solid #CBD5E1',
                            background: isSelected ? '#E0F2FE' : '#FFFFFF',
                            cursor: 'pointer',
                            fontSize: '0.9rem'
                          }}
                        >
                          <input
                            type="radio"
                            name={`t1-${currentQ.no}`}
                            checked={isSelected}
                            onChange={() => handleTwoTierChange('t1', op.id)}
                            style={{ accentColor: '#0284C7', cursor: 'pointer' }}
                          />
                          <span style={{ fontWeight: 700, color: isSelected ? '#0369A1' : '#475569' }}>[{op.id}]</span>
                          <span>{op.teks}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Tingkat 2: Pilihan Alasan (Diacak urutannya) */}
                <div style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.1rem'
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0369A1', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ background: '#0284C7', color: '#FFFFFF', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem' }}>
                      TINGKAT 2
                    </span>
                    {currentQ.tingkat2?.pertanyaan}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {(currentQ.tingkat2?.displayOpsi || currentQ.tingkat2?.opsi || []).map(op => {
                      const isSelected = userResponses[currentQ.no]?.t2 === op.id;
                      return (
                        <label
                          key={`t2-${op.id}`}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            padding: '0.7rem 0.9rem',
                            borderRadius: '8px',
                            border: isSelected ? '2px solid #0284C7' : '1px solid #CBD5E1',
                            background: isSelected ? '#E0F2FE' : '#FFFFFF',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            lineHeight: 1.45
                          }}
                        >
                          <input
                            type="radio"
                            name={`t2-${currentQ.no}`}
                            checked={isSelected}
                            onChange={() => handleTwoTierChange('t2', op.id)}
                            style={{ marginTop: '3px', accentColor: '#0284C7', cursor: 'pointer' }}
                          />
                          <span style={{ fontWeight: 700, color: isSelected ? '#0369A1' : '#475569' }}>({op.id})</span>
                          <span>{op.teks}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Tingkat 3: Skala Keyakinan (1 - 5) */}
                <div style={{
                  background: '#FFFBEB',
                  border: '1.5px solid #FDE68A',
                  borderRadius: '12px',
                  padding: '1rem'
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#92400E', marginBottom: '0.35rem' }}>
                    ⚖️ Tingkat Keyakinan atas Jawaban & Alasan Anda:
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: '#78350F',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    padding: '0 0.2rem'
                  }}>
                    <span>1 = Menebak</span>
                    <span>5 = Sangat yakin</span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '0.45rem'
                  }}>
                    {[1, 2, 3, 4, 5].map(val => {
                      const isChosen = userResponses[currentQ.no]?.confidence === val;
                      return (
                        <button
                          key={`conf-${val}`}
                          type="button"
                          className="confidence-btn"
                          aria-pressed={isChosen}
                          onClick={() => handleTwoTierChange('confidence', val)}
                          style={{
                            padding: '0.65rem 0.2rem',
                            borderRadius: '8px',
                            fontWeight: 800,
                            fontSize: '1.05rem',
                            cursor: 'pointer',
                            border: isChosen ? '2.5px solid #D97706' : '1.5px solid #FCD34D',
                            background: isChosen ? '#F59E0B' : '#FFFFFF',
                            color: isChosen ? '#FFFFFF' : '#92400E',
                            transition: 'all 0.15s ease',
                            textAlign: 'center'
                          }}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Indikator Validasi Two-Tier */}
                {!isCurrentQValid && (
                  <div style={{
                    fontSize: '0.82rem',
                    color: '#B45309',
                    background: '#FEF3C7',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>⚠️</span>
                    <span>
                      Harap lengkapi ketiga bagian di atas: <strong>Tingkat 1 (Jawaban)</strong>, <strong>Tingkat 2 (Alasan)</strong>, dan <strong>Skala Keyakinan (1–5)</strong> untuk dapat melanjutkan.
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Tombol Navigasi Bawah */}
          <div className="bottom-nav-container" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <button
              type="button"
              className="nav-btn prev-btn"
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex(prev => Math.max(0, prev - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                padding: '0.65rem 1.1rem',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                background: currentIndex === 0 ? '#F1F5F9' : '#FFFFFF',
                color: currentIndex === 0 ? '#94A3B8' : '#334155',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              ← <span className="hide-on-mobile">Sebelumnya</span><span className="show-on-mobile">Balik</span>
            </button>

            <div className="nav-btn-right" style={{ display: 'flex', gap: '0.45rem' }}>
              <button
                type="button"
                className="nav-btn summary-btn"
                onClick={() => setMode('summary')}
                style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1.5px solid #0284C7',
                  background: '#F0F9FF',
                  color: '#0369A1',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                📋 Ringkasan<span className="hide-on-mobile"> Jawaban</span>
              </button>

              {currentIndex < 9 ? (
                <button
                  type="button"
                  className="nav-btn next-btn"
                  disabled={!isCurrentQValid}
                  onClick={() => {
                    setCurrentIndex(prev => prev + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: isCurrentQValid ? '#0284C7' : '#CBD5E1',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: isCurrentQValid ? 'pointer' : 'not-allowed',
                    boxShadow: isCurrentQValid ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none'
                  }}
                  title={!isCurrentQValid ? 'Lengkapi jawaban sebelum lanjut' : 'Menuju soal berikutnya'}
                >
                  Berikutnya →
                </button>
              ) : (
                <button
                  type="button"
                  className="nav-btn finish-btn"
                  disabled={!isCurrentQValid}
                  onClick={() => setMode('summary')}
                  style={{
                    padding: '0.65rem 1.25rem',
                    borderRadius: '10px',
                    border: 'none',
                    background: isCurrentQValid ? '#10B981' : '#CBD5E1',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: isCurrentQValid ? 'pointer' : 'not-allowed'
                  }}
                >
                  <span className="hide-on-mobile">Selesai & Tinjau</span>
                  <span className="show-on-mobile">Selesai</span> ✓
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAMPILAN MODE RINGKASAN SEBELUM KIRIM */}
      {/* ======================================================== */}
      {mode === 'summary' && (
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #E2E8F0',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: '0 0 0.4rem 0', color: '#0F172A', fontSize: '1.3rem', fontWeight: 800 }}>
              📋 Ringkasan Pengerjaan Evaluasi Akhir
            </h3>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B' }}>
              Pastikan seluruh soal telah terjawab dengan seksama sebelum mengirimkan hasil akhir. Klik nomor soal untuk meninjau atau mengubah jawaban.
            </p>
          </div>

          {/* Grid Status Nomor Soal */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            {rawQuestions.map((q, idx) => {
              const answered = isQuestionAnswered(q, userResponses[q.no]);
              return (
                <button
                  type="button"
                  key={`sum-${q.no}`}
                  onClick={() => goToQuestion(idx)}
                  className="summary-question-btn"
                  aria-label={`Soal ${q.no}, ${answered ? 'Sudah terjawab' : 'Belum terjawab'}`}
                  style={{
                    padding: '0.8rem',
                    borderRadius: '10px',
                    border: answered ? '1.5px solid #10B981' : '1.5px solid #F59E0B',
                    background: answered ? '#ECFDF5' : '#FFFBEB',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: answered ? '#065F46' : '#92400E', marginBottom: '0.2rem' }}>
                    Soal {q.no}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: answered ? '#059669' : '#D97706' }}>
                    {answered ? '✓ Terjawab' : '⚠️ Belum Terjawab'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '0.25rem' }}>
                    {q.tipe === 'two_tier' ? 'Two-Tier' : q.tipe}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Rekapitulasi Progres */}
          <div style={{
            background: answeredCount === 10 ? '#ECFDF5' : '#FEF3C7',
            border: `1px solid ${answeredCount === 10 ? '#A7F3D0' : '#FDE68A'}`,
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.4rem' }}>{answeredCount === 10 ? '🎉' : '⚠️'}</span>
              <div>
                <div style={{ fontWeight: 700, color: answeredCount === 10 ? '#065F46' : '#92400E', fontSize: '0.95rem' }}>
                  {answeredCount === 10 ? 'Seluruh Soal (10/10) Telah Terjawab!' : `Baru ${answeredCount} dari 10 Soal Terjawab`}
                </div>
                <div style={{ fontSize: '0.82rem', color: answeredCount === 10 ? '#047857' : '#B45309' }}>
                  {answeredCount === 10
                    ? 'Anda siap untuk mengirimkan asesmen dan melihat laporan diagnostik lengkap.'
                    : `Ada ${10 - answeredCount} soal yang belum selesai. Anda disarankan melengkapinya terlebih dahulu.`}
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Aksi Ringkasan */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => {
                setMode('exam');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{
                padding: '0.75rem 1.4rem',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#334155',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer'
              }}
            >
              ← Kembali ke Lembar Soal
            </button>

            <button
              type="button"
              onClick={handleFinalSubmit}
              style={{
                padding: '0.75rem 1.8rem',
                borderRadius: '10px',
                border: 'none',
                background: answeredCount === 10 ? '#0284C7' : '#D97706',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
              }}
            >
              🚀 Kirim Seluruh Jawaban Sekarang
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAMPILAN MODE HASIL & LAPORAN DIAGNOSTIK MISKONSEPSI */}
      {/* ======================================================== */}
      {mode === 'result' && latestEvaluation && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Kartu Skor Utama & XP */}
          <div style={{
            background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.75rem',
            boxShadow: '0 8px 24px rgba(2, 132, 199, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.9 }}>
                Hasil Evaluasi Akhir
              </div>
              <h2 style={{ margin: '0.3rem 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 800 }}>
                Skor Total: {latestEvaluation.score.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} / 10
              </h2>
              <div style={{ fontSize: '0.92rem', opacity: 0.95, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span>🎯 Nilai Evaluasi: {Math.round(latestEvaluation.score * 10)}%</span>
                <span>•</span>
                <span style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  fontWeight: 700
                }}>
                  +{latestEvaluation.xpEarned} XP Didapatkan
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleStartFreshAssessment}
                style={{
                  background: '#FFFFFF',
                  color: '#0284C7',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem 1.4rem',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                🔄 Ulangi Evaluasi Akhir
              </button>

              <button
                type="button"
                onClick={onBackToHome}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#FFFFFF',
                  border: '1.5px solid rgba(255, 255, 255, 0.6)',
                  borderRadius: '10px',
                  padding: '0.75rem 1.4rem',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer'
                }}
              >
                🏠 Kembali ke Beranda
              </button>
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* LAPORAN DIAGNOSTIK MISKONSEPSI (SOAL 4 - 6) */}
          {/* ---------------------------------------------------- */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🔬</span>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0F172A', fontWeight: 800 }}>
                Laporan Evaluasi & Deteksi Miskonsepsi (Soal 4–6)
              </h3>
            </div>
            <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
              Laporan dua tingkat (Two-Tier) ini menganalisis konsistensi konsep antara pilihan jawaban, penalaran ilmiah, dan skala keyakinan peserta didik untuk mendeteksi pemahaman dan potensi miskonsepsi secara akurat.
            </p>

            {/* Legenda Singkat Hasil Diagnostik Two-Tier (Requirement 3) */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '12px',
              padding: '0.9rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.84rem',
              lineHeight: 1.55
            }}>
              <div style={{ fontWeight: 800, color: '#0369A1', marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📌</span> Panduan Membaca Hasil Diagnostik:
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
                <div style={{ background: '#FFFFFF', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '0.2rem' }}>🔍 Komponen Jawaban</div>
                  <div style={{ color: '#475569', fontSize: '0.8rem' }}>
                    • <strong>T1 (Tingkat 1):</strong> Pilihan jawaban konsep kimia.<br />
                    • <strong>T2 (Tingkat 2):</strong> Alasan ilmiah yang mendasari jawaban.<br />
                    • <strong>Keyakinan:</strong> Skala 1 (menebak) s.d. 5 (sangat yakin).
                  </div>
                </div>
                <div style={{ background: '#FFFFFF', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '0.2rem' }}>🏷️ Kategori Pemahaman</div>
                  <div style={{ color: '#475569', fontSize: '0.8rem' }}>
                    • <strong style={{ color: '#059669' }}>✅ P (Paham):</strong> Jawaban & alasan keduanya benar.<br />
                    • <strong style={{ color: '#D97706' }}>⚠️ PS (Paham Sebagian):</strong> Benar sebagian / alasan kurang pas.<br />
                    • <strong style={{ color: '#DC2626' }}>❌ M (Miskonsepsi):</strong> Konsep keliru secara sistematis.<br />
                    • <strong style={{ color: '#64748B' }}>❓ TP (Tidak Paham):</strong> Jawaban & alasan salah / menebak.
                  </div>
                </div>
              </div>
            </div>

            {/* Tampilan Tabel untuk Layar Lebar (>= 640px) */}
            <div className="diag-table-desktop" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', maxWidth: '100%' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.86rem',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                minWidth: '760px'
              }}>
                <thead>
                  <tr style={{ background: '#F1F5F9', color: '#1E293B', borderBottom: '2px solid #CBD5E1' }}>
                    <th style={{ padding: '0.75rem 0.8rem', textAlign: 'left', fontWeight: 700, width: '15%' }}>Soal & Topik</th>
                    <th style={{ padding: '0.75rem 0.8rem', textAlign: 'left', fontWeight: 700, width: '28%', minWidth: '220px' }}>Jawaban & Alasan</th>
                    <th style={{ padding: '0.75rem 0.8rem', textAlign: 'center', fontWeight: 700, width: '10%' }}>Kategori</th>
                    <th style={{ padding: '0.75rem 0.8rem', textAlign: 'left', fontWeight: 700, width: '18%' }}>Status Diagnostik</th>
                    <th style={{ padding: '0.75rem 0.8rem', textAlign: 'center', fontWeight: 700, width: '13%' }}>Keyakinan</th>
                    <th style={{ padding: '0.75rem 0.8rem', textAlign: 'left', fontWeight: 700, width: '16%' }}>Saran Belajar</th>
                  </tr>
                </thead>
                <tbody>
                  {[4, 5, 6].map(qNum => {
                    const qData = rawQuestions.find(q => q.no === qNum);
                    const qDetail = latestEvaluation.evaluation?.details?.[qNum] || {};
                    const cat = qDetail.category || 'TP';
                    const meta = getCategoryMeta(cat);

                    const t1Val = qDetail.response?.t1 || '-';
                    const t2Val = qDetail.response?.t2 || '-';
                    const t1Option = qData?.tingkat1?.opsi?.find(o => o.id === t1Val);
                    const t2Option = qData?.tingkat2?.opsi?.find(o => o.id === t2Val);
                    const t1Text = t1Option?.teks || '';
                    const t2Text = t2Option?.teks || '';

                    return (
                      <tr key={`diag-${qNum}`} style={{ borderBottom: '1px solid #E2E8F0', background: meta.cardBg }}>
                        {/* Soal & Topik */}
                        <td style={{ padding: '0.75rem 0.8rem', fontWeight: 700, color: '#1E293B', verticalAlign: 'top' }}>
                          <div>Soal {qNum}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500, marginTop: '0.15rem' }}>
                            {qData?.topik}
                          </div>
                        </td>

                        {/* Jawaban & Alasan (Dua baris rapi: Label kiri, Badge kanan, cuplikan teks) */}
                        <td style={{ padding: '0.65rem 0.8rem', verticalAlign: 'top', minWidth: '210px' }}>
                          {/* Baris 1: Jawaban (T1) */}
                          <div style={{ marginBottom: '0.45rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>Jawaban (T1):</span>
                              <span style={{ fontWeight: 800, color: '#0369A1', background: '#E0F2FE', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                                {t1Val}
                              </span>
                            </div>
                            {t1Text && (
                              <div
                                title={t1Text}
                                style={{
                                  fontSize: '0.75rem',
                                  color: '#334155',
                                  fontStyle: 'italic',
                                  marginTop: '0.15rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '220px'
                                }}
                              >
                                "{t1Text}"
                              </div>
                            )}
                          </div>

                          {/* Baris 2: Alasan (T2) */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                              <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600 }}>Alasan (T2):</span>
                              <span style={{ fontWeight: 800, color: '#0369A1', background: '#E0F2FE', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                                {t2Val}
                              </span>
                            </div>
                            {t2Text && (
                              <div
                                title={t2Text}
                                style={{
                                  fontSize: '0.75rem',
                                  color: '#334155',
                                  fontStyle: 'italic',
                                  marginTop: '0.15rem',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '220px'
                                }}
                              >
                                "{t2Text}"
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Kategori */}
                        <td style={{ padding: '0.75rem 0.8rem', textAlign: 'center', verticalAlign: 'top' }}>
                          <span style={{
                            fontWeight: 800,
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            background: meta.badgeBg,
                            color: meta.badgeColor,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            whiteSpace: 'nowrap'
                          }}>
                            {meta.icon} {cat}
                          </span>
                        </td>

                        {/* Status Diagnostik */}
                        <td style={{ padding: '0.75rem 0.8rem', verticalAlign: 'top' }}>
                          {cat === 'P' ? (
                            <div style={{ color: '#065F46', fontWeight: 700 }}>
                              ✓ Paham Konsep
                            </div>
                          ) : cat.startsWith('M') ? (
                            <div>
                              <div style={{ color: '#DC2626', fontWeight: 700, fontSize: '0.85rem' }}>
                                ⚠️ Terdeteksi {cat}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: '#7F1D1D', marginTop: '0.15rem' }}>
                                {qDetail.misconceptionName || 'Miskonsepsi Spesifik'}
                              </div>
                            </div>
                          ) : (
                            <div style={{ color: '#475569', fontWeight: 600 }}>
                              {cat === 'PS' ? 'Paham Sebagian' : 'Tidak Paham'}
                            </div>
                          )}
                        </td>

                        {/* Keyakinan & Tafsir */}
                        <td style={{ padding: '0.75rem 0.8rem', textAlign: 'center', verticalAlign: 'top' }}>
                          <div style={{ fontWeight: 700, color: '#1E293B', whiteSpace: 'nowrap' }}>
                            Skala {qDetail.confidence || 1}/5
                          </div>
                          <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: qDetail.confidence >= 4 && cat.startsWith('M') ? '#DC2626' : '#64748B',
                            marginTop: '0.15rem'
                          }}>
                            {qDetail.confidenceInterpretation || '-'}
                          </div>
                        </td>

                        {/* Saran Belajar */}
                        <td style={{ padding: '0.75rem 0.8rem', fontSize: '0.82rem', color: '#334155', lineHeight: 1.45, verticalAlign: 'top' }}>
                          {cat === 'P' ? (
                            <span style={{ color: '#059669', fontWeight: 600 }}>
                              Pertahankan pemahaman kuat ini!
                            </span>
                          ) : (
                            qData?.saran || 'Ulangi konsep terkait di buku materi.'
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Tampilan Kartu Vertikal Responsif untuk Layar HP (< 640px) */}
            <div className="diag-cards-mobile">
              {[4, 5, 6].map(qNum => {
                const qData = rawQuestions.find(q => q.no === qNum);
                const qDetail = latestEvaluation.evaluation?.details?.[qNum] || {};
                const cat = qDetail.category || 'TP';
                const meta = getCategoryMeta(cat);

                const t1Val = qDetail.response?.t1 || '-';
                const t2Val = qDetail.response?.t2 || '-';
                const t1Option = qData?.tingkat1?.opsi?.find(o => o.id === t1Val);
                const t2Option = qData?.tingkat2?.opsi?.find(o => o.id === t2Val);
                const t1Text = t1Option?.teks || '';
                const t2Text = t2Option?.teks || '';

                return (
                  <div
                    key={`card-diag-${qNum}`}
                    style={{
                      border: `1.5px solid ${meta.border}`,
                      borderRadius: '12px',
                      background: meta.cardBg,
                      padding: '1rem',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)'
                    }}
                  >
                    {/* Header Kartu */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#1E293B' }}>
                          Soal {qNum}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
                          Topik: {qData?.topik}
                        </div>
                      </div>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.25rem 0.55rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        background: meta.badgeBg,
                        color: meta.badgeColor,
                        whiteSpace: 'nowrap'
                      }}>
                        {meta.icon} {cat}
                      </span>
                    </div>

                    {/* Info Jawaban & Alasan (Dua baris rapi: Label kiri, Badge kanan, cuplikan teks) */}
                    <div style={{
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      padding: '0.65rem 0.75rem',
                      border: '1px solid #E2E8F0',
                      marginBottom: '0.65rem',
                      fontSize: '0.82rem'
                    }}>
                      {/* Baris 1: Jawaban (T1) */}
                      <div style={{ marginBottom: '0.45rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>Jawaban (T1):</span>
                          <span style={{ fontWeight: 800, color: '#0369A1', background: '#E0F2FE', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.82rem' }}>
                            {t1Val}
                          </span>
                        </div>
                        {t1Text && (
                          <div
                            style={{
                              fontSize: '0.76rem',
                              color: '#334155',
                              fontStyle: 'italic',
                              marginTop: '0.15rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            "{t1Text}"
                          </div>
                        )}
                      </div>

                      {/* Baris 2: Alasan (T2) */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>Alasan (T2):</span>
                          <span style={{ fontWeight: 800, color: '#0369A1', background: '#E0F2FE', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.82rem' }}>
                            {t2Val}
                          </span>
                        </div>
                        {t2Text && (
                          <div
                            style={{
                              fontSize: '0.76rem',
                              color: '#334155',
                              fontStyle: 'italic',
                              marginTop: '0.15rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            "{t2Text}"
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Diagnosis & Keyakinan */}
                    <div style={{ marginBottom: '0.6rem', fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 700, color: meta.badgeColor, marginBottom: '0.15rem' }}>
                        {meta.icon} {meta.label}
                      </div>
                      {cat.startsWith('M') && qDetail.misconceptionName && (
                        <div style={{ fontSize: '0.8rem', color: '#7F1D1D', marginTop: '0.1rem' }}>
                          ⚠️ {qDetail.misconceptionName}
                        </div>
                      )}
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>
                        Tafsir Keyakinan: <strong>Skala {qDetail.confidence || 1}/5 • {qDetail.confidenceInterpretation || '-'}</strong>
                      </div>
                    </div>

                    {/* Saran Belajar */}
                    <div style={{
                      background: '#FFFFFF',
                      borderLeft: `3px solid ${meta.border}`,
                      padding: '0.5rem 0.7rem',
                      borderRadius: '0 6px 6px 0',
                      fontSize: '0.82rem',
                      color: '#334155',
                      lineHeight: 1.45
                    }}>
                      <strong style={{ color: '#1E293B', display: 'block', marginBottom: '0.15rem' }}>💡 Saran Belajar:</strong>
                      {cat === 'P' ? 'Pertahankan pemahaman kuat ini!' : (qData?.saran || 'Ulangi konsep terkait di buku materi.')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------------------------------------------------- */}
          {/* PEMBAHASAN DETAIL TIAP SOAL (SOAL 1 - 10) */}
          {/* ---------------------------------------------------- */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)'
          }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.25rem', color: '#0F172A', fontWeight: 800 }}>
              📖 Rincian Nilai & Pembahasan Lengkap (Soal 1 s.d. 10)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {rawQuestions.map((q) => {
                const qEval = latestEvaluation.evaluation?.details?.[q.no] || {};
                const score = qEval.score !== undefined ? qEval.score : 0;
                const isFull = score === 1;

                return (
                  <div
                    key={`rev-${q.no}`}
                    style={{
                      border: '1.5px solid #E2E8F0',
                      borderRadius: '14px',
                      padding: '1.25rem',
                      background: '#F8FAFC'
                    }}
                  >
                    {/* Header Nomor & Skor */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{
                          background: isFull ? '#10B981' : (score > 0 ? '#F59E0B' : '#EF4444'),
                          color: '#FFFFFF',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '6px'
                        }}>
                          Soal {q.no}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>
                          Tipe: {q.tipe} ({q.level})
                        </span>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: isFull ? '#059669' : (score > 0 ? '#D97706' : '#DC2626') }}>
                        Skor: {score.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} / 1.0
                      </div>
                    </div>

                    {/* Soal / Stimulus Ringkas */}
                    <div style={{ fontSize: '0.9rem', color: '#1E293B', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                      <strong>Pertanyaan:</strong> {q.pertanyaan || q.stimulus}
                    </div>

                    {/* Perbandingan Jawaban Peserta Didik vs Kunci */}
                    <div style={{
                      background: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '10px',
                      padding: '0.85rem 1rem',
                      marginBottom: '0.85rem',
                      fontSize: '0.86rem'
                    }}>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
                        <div>
                          <span style={{ color: '#64748B', fontWeight: 600 }}>Jawaban Peserta Didik: </span>
                          <strong style={{ color: '#0369A1' }}>
                            {q.tipe === 'multi_select'
                              ? (Array.isArray(qEval.response) && qEval.response.length > 0 ? qEval.response.join(', ') : '(Kosong)')
                              : q.tipe === 'true_false_set'
                              ? Object.entries(qEval.response || {}).map(([k, v]) => `${k}:${v ? 'B' : 'S'}`).join(', ')
                              : q.tipe === 'two_tier'
                              ? `T1: ${qEval.response?.t1 || '-'}, T2: ${qEval.response?.t2 || '-'}, Yakin: ${qEval.response?.confidence || '-'}`
                              : (qEval.response || '(Kosong)')
                            }
                          </strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748B', fontWeight: 600 }}>Kunci Jawaban: </span>
                          <strong style={{ color: '#059669' }}>
                            {q.tipe === 'multi_select'
                              ? (q.kunci || []).join(', ')
                              : q.tipe === 'true_false_set'
                              ? q.pernyataan.map(p => `${p.id}:${p.kunci ? 'B' : 'S'}`).join(', ')
                              : q.tipe === 'two_tier'
                              ? `T1: ${q.kunci.t1}, T2: ${q.kunci.t2}`
                              : q.kunci
                            }
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Pembahasan Ilmiah */}
                    <div style={{
                      background: '#F0F9FF',
                      borderLeft: '4px solid #0284C7',
                      padding: '0.75rem 0.95rem',
                      borderRadius: '0 8px 8px 0',
                      fontSize: '0.86rem',
                      lineHeight: 1.55,
                      color: '#0C4A6E'
                    }}>
                      <strong style={{ color: '#0369A1', display: 'block', marginBottom: '0.2rem' }}>
                        💡 Pembahasan:
                      </strong>
                      {q.pembahasan}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Riwayat Percobaan */}
          {attempts.length > 1 && (
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '16px',
              padding: '1.25rem'
            }}>
              <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem', color: '#1E293B', fontWeight: 700 }}>
                📜 Riwayat Percobaan Evaluasi Akhir ({attempts.length} kali):
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {attempts.map((att, idx) => (
                  <div
                    key={`hist-${idx}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.6rem 0.9rem',
                      borderRadius: '8px',
                      background: '#F8FAFC',
                      fontSize: '0.85rem'
                    }}
                  >
                    <div>
                      <strong>Percobaan ke-{idx + 1}</strong> • {new Date(att.timestamp).toLocaleString('id-ID')}
                    </div>
                    <div style={{ fontWeight: 700, color: '#0284C7' }}>
                      Skor: {att.score.toFixed(1)} / 10 (+{att.xpEarned} XP)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tombol Aksi Bawah */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleStartFreshAssessment}
              style={{
                padding: '0.8rem 1.8rem',
                borderRadius: '10px',
                border: 'none',
                background: '#0284C7',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
              }}
            >
              🔄 Ulangi Evaluasi Akhir
            </button>
            <button
              type="button"
              onClick={onBackToHome}
              style={{
                padding: '0.8rem 1.8rem',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#334155',
                fontWeight: 700,
                fontSize: '0.95rem',
                cursor: 'pointer'
              }}
            >
              🏠 Kembali ke Beranda
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
