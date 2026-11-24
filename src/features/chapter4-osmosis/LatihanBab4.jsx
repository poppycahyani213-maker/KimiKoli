import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';

// Helper kunci penyimpanan status latihan Bab 4 per siswa
export function getCh4LatihanKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch4_latihan_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch4_latihan_v1_guest';
}

// Data 4 Soal Pilihan Ganda Tunggal
const MC_QUESTIONS = [
  {
    id: 'q1',
    number: 1,
    type: 'mc',
    category: 'Menghitung',
    question: 'Tekanan osmotik larutan urea 0,2 M pada suhu 27 °C (tetapan R = 0,082 L·atm/mol·K) adalah …',
    options: [
      { key: 'A', text: '0,44 atm' },
      { key: 'B', text: '2,46 atm' },
      { key: 'C', text: '4,92 atm' },
      { key: 'D', text: '9,84 atm' },
      { key: 'E', text: '49,2 atm' },
    ],
    correctKey: 'C',
    solution: 'Konversi suhu mutlak: T = 27 + 273 = 300 K. Karena urea adalah senyawa nonelektrolit (i = 1), maka: Π = M × R × T = 0,2 mol/L × 0,082 L·atm/(mol·K) × 300 K = 4,92 atm. (Catatan: Opsi A adalah jebakan umum jika lupa mengubah suhu ke Kelvin: 0,2 × 0,082 × 27 = 0,44 atm).'
  },
  {
    id: 'q2',
    number: 2,
    type: 'mc',
    category: 'Menentukan Mr',
    question: 'Sebanyak 3 gram suatu zat X (nonelektrolit) dilarutkan ke dalam air hingga volume larutan menjadi 500 mL. Pada suhu 27 °C, tekanan osmotik larutan yang terukur adalah 2,46 atm. Massa molekul relatif (Mr) dari zat X tersebut adalah …',
    options: [
      { key: 'A', text: '6' },
      { key: 'B', text: '15' },
      { key: 'C', text: '30' },
      { key: 'D', text: '60' },
      { key: 'E', text: '120' },
    ],
    correctKey: 'D',
    solution: 'Langkah 1: Hitung molaritas larutan: M = Π / (R × T) = 2,46 / (0,082 × 300) = 2,46 / 24,6 = 0,1 M. Langkah 2: Hitung jumlah mol: n = M × V = 0,1 mol/L × 0,5 L = 0,05 mol. Langkah 3: Hitung Mr: Mr = massa / n = 3 g / 0,05 mol = 60 g/mol.'
  },
  {
    id: 'q3',
    number: 3,
    type: 'mc',
    category: 'Menerapkan Konsep',
    question: 'Seorang pasien di rumah sakit secara tidak sengaja diberi cairan infus glukosa dengan konsentrasi 0,10 M, padahal konsentrasi cairan di dalam sel darah merah pasien tersebut sekitar 0,30 M. Peristiwa yang akan terjadi pada sel darah merah pasien adalah …',
    options: [
      { key: 'A', text: 'Sel mengerut karena molekul air keluar dari dalam sel' },
      { key: 'B', text: 'Sel menggembung karena molekul air masuk ke dalam sel' },
      { key: 'C', text: 'Sel tetap normal karena larutan infus bersifat isotonik' },
      { key: 'D', text: 'Sel mengerut karena molekul glukosa masuk ke dalam sel' },
      { key: 'E', text: 'Molekul glukosa keluar menembus sel darah merah' },
    ],
    correctKey: 'B',
    solution: 'Cairan infus (0,10 M) lebih encer (hipotonik) dibanding cairan di dalam sel darah merah (0,30 M). Akibatnya, molekul air secara spontan berosmosis masuk ke dalam sel darah merah, menyebabkan sel menggembung dan berisiko pecah (hemolisis).'
  },
  {
    id: 'q4',
    number: 4,
    type: 'mc',
    category: 'Memprediksi',
    question: 'Seorang petani memberikan pupuk kimia dalam jumlah yang terlalu banyak ke kebunnya, sehingga konsentrasi zat terlarut di dalam air tanah menjadi sangat pekat. Peristiwa yang paling mungkin terjadi pada tanaman tersebut adalah …',
    options: [
      { key: 'A', text: 'Tanaman tumbuh lebih cepat karena air lebih banyak masuk ke akar' },
      { key: 'B', text: 'Tanaman tetap normal karena larutan tanah selalu bersifat isotonik' },
      { key: 'C', text: 'Akar tanaman menyerap pupuk dan molekul air dalam jumlah yang sama' },
      { key: 'D', text: 'Tidak ada pengaruh sama sekali karena akar tumbuhan tidak memiliki membran' },
      { key: 'E', text: 'Tanaman layu karena molekul air ditarik keluar dari sel-sel akar' },
    ],
    correctKey: 'E',
    solution: 'Larutan tanah yang terlalu pekat akibat pupuk berlebih bersifat hipertonik terhadap cairan di dalam sel akar tanaman. Hal ini menyebabkan air di dalam sel akar ditarik keluar ke tanah (plasmolisis), sehingga sel kehilangan tekanan turgor dan tanaman menjadi layu.'
  }
];

// Soal 5: Gaya TKA (Pilihan Ganda Kompleks Kategori Benar / Salah)
const TKA_QUESTION = {
  id: 'q5',
  number: 5,
  badge: 'Gaya TKA',
  category: 'Pilihan Ganda Kompleks Kategori',
  stimulus: 'Sekelompok siswa memotong kentang menjadi beberapa potongan yang ukurannya sama, menimbang massanya, lalu merendam masing-masing potongan dalam larutan sukrosa dengan konsentrasi berbeda selama 1 jam. Setelah itu, potongan kentang ditimbang kembali.',
  tableData: [
    { conc: '0', change: '+8' },
    { conc: '0,2', change: '+3' },
    { conc: '0,4', change: '−2' },
    { conc: '0,6', change: '−6' },
    { conc: '0,8', change: '−10' }
  ],
  instruction: 'Tentukan apakah setiap pernyataan berikut Benar atau Salah berdasarkan data percobaan di atas!',
  statements: [
    {
      id: 's1',
      text: 'Pada larutan 0 M, massa kentang bertambah karena air masuk ke dalam sel kentang.',
      correct: 'Benar',
      reason: 'Benar: larutan 0 M lebih encer daripada cairan sel (hipotonik), sehingga air masuk ke sel kentang dan massa kentang bertambah (+8%).'
    },
    {
      id: 's2',
      text: 'Konsentrasi cairan sel kentang diperkirakan berada di antara 0,2 M dan 0,4 M.',
      correct: 'Benar',
      reason: 'Benar: perubahan massa berganti dari positif (+3%) ke negatif (−2%) di antara 0,2 dan 0,4 M; di rentang tersebut terdapat titik isotonik saat massa tidak berubah.'
    },
    {
      id: 's3',
      text: 'Pada larutan 0,8 M, massa kentang berkurang karena sukrosa masuk ke dalam sel kentang.',
      correct: 'Salah',
      reason: 'Salah: massa berkurang karena molekul AIR keluar dari sel kentang ke larutan luar yang lebih pekat (hipertonik); molekul sukrosa berukuran besar sehingga tidak menembus membran semipermeabel sel.'
    }
  ],
  tkaNote: 'Di TKA (Tes Kemampuan Akademik), soal pilihan ganda kompleks kategori dianggap benar hanya jika SEMUA pernyataan dijawab tepat.'
};

export default function LatihanBab4({ onLatihanPassed, isPassedInitially = false }) {
  // State Jawaban MC Soal 1-4
  const [mcAnswers, setMcAnswers] = useState({});
  const [mcStatus, setMcStatus] = useState({}); // { q1: 'correct'|'incorrect' }

  // State Jawaban TKA Soal 5
  const [tkaAnswers, setTkaAnswers] = useState({ s1: '', s2: '', s3: '' });
  const [tkaStatus, setTkaStatus] = useState(null); // 'correct' | 'incorrect' | null

  // State Refleksi Wajib
  const [reflection, setReflection] = useState('');
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);

  // State Kelulusan & Ringkasan
  const [isPassed, setIsPassed] = useState(isPassedInitially);
  const [showSummary, setShowSummary] = useState(isPassedInitially);
  const [score, setScore] = useState(0);

  // Muat data dari localStorage saat awal
  useEffect(() => {
    const key = getCh4LatihanKey();
    const saved = getStoredData(key, null);
    if (saved) {
      if (saved.mcAnswers) setMcAnswers(saved.mcAnswers);
      if (saved.mcStatus) setMcStatus(saved.mcStatus);
      if (saved.tkaAnswers) setTkaAnswers(saved.tkaAnswers);
      if (saved.tkaStatus) setTkaStatus(saved.tkaStatus);
      if (saved.reflection) {
        setReflection(saved.reflection);
        setReflectionSubmitted(true);
      }
      if (saved.score !== undefined) setScore(saved.score);
      if (saved.isPassed) {
        setIsPassed(true);
        setShowSummary(true);
      }
    }
  }, []);

  // Hitung jumlah soal yang sudah dijawab
  const mcAnsweredCount = Object.keys(mcStatus).length;
  const isTkaAnswered = tkaStatus !== null;
  const all5Answered = mcAnsweredCount === 4 && isTkaAnswered;

  // Hitung total skor
  useEffect(() => {
    const mcCorrect = Object.values(mcStatus).filter((s) => s === 'correct').length;
    const tkaCorrect = tkaStatus === 'correct' ? 1 : 0;
    const totalScore = mcCorrect + tkaCorrect;
    setScore(totalScore);

    if (all5Answered && reflectionSubmitted && !showSummary) {
      const passed = totalScore >= 4;
      setIsPassed(passed);
      setShowSummary(true);

      const key = getCh4LatihanKey();
      setStoredData(key, {
        mcAnswers,
        mcStatus,
        tkaAnswers,
        tkaStatus,
        score: totalScore,
        isPassed: passed,
        reflection,
        updatedAt: new Date().toISOString()
      });

      if (passed && onLatihanPassed) {
        onLatihanPassed(totalScore);
      }
    }
  }, [mcStatus, tkaStatus, all5Answered, reflectionSubmitted]);

  // Handler memilih opsi soal 1-4 (hanya jawaban pertama yang dinilai)
  const handleSelectMC = (qId, optionKey) => {
    if (mcStatus[qId]) return; // Terkunci setelah dijawab

    const question = MC_QUESTIONS.find((q) => q.id === qId);
    const isCorrect = optionKey === question.correctKey;

    const newAnswers = { ...mcAnswers, [qId]: optionKey };
    const newStatus = { ...mcStatus, [qId]: isCorrect ? 'correct' : 'incorrect' };

    setMcAnswers(newAnswers);
    setMcStatus(newStatus);

    const key = getCh4LatihanKey();
    const existing = getStoredData(key, {}) || {};
    setStoredData(key, {
      ...existing,
      mcAnswers: newAnswers,
      mcStatus: newStatus
    });
  };

  // Handler submit Soal 5 (TKA)
  const handleCheckTKA = () => {
    if (tkaStatus !== null) return; // Terkunci
    if (!tkaAnswers.s1 || !tkaAnswers.s2 || !tkaAnswers.s3) return;

    const isAllCorrect =
      tkaAnswers.s1 === TKA_QUESTION.statements[0].correct &&
      tkaAnswers.s2 === TKA_QUESTION.statements[1].correct &&
      tkaAnswers.s3 === TKA_QUESTION.statements[2].correct;

    const newTkaStatus = isAllCorrect ? 'correct' : 'incorrect';
    setTkaStatus(newTkaStatus);

    const key = getCh4LatihanKey();
    const existing = getStoredData(key, {}) || {};
    setStoredData(key, {
      ...existing,
      tkaAnswers,
      tkaStatus: newTkaStatus
    });
  };

  // Handler submit refleksi wajib
  const handleReflectionSubmit = (e) => {
    e.preventDefault();
    if (!reflection.trim()) {
      alert('Mohon isi refleksi terlebih dahulu sebelum menyelesaikan latihan!');
      return;
    }
    setReflectionSubmitted(true);
    const key = getCh4LatihanKey();
    const existing = getStoredData(key, {}) || {};
    setStoredData(key, {
      ...existing,
      reflection: reflection.trim()
    });
  };

  // Handler reset latihan jika belum lulus
  const handleReset = () => {
    setMcAnswers({});
    setMcStatus({});
    setTkaAnswers({ s1: '', s2: '', s3: '' });
    setTkaStatus(null);
    setShowSummary(false);
    setIsPassed(false);
    setScore(0);

    const key = getCh4LatihanKey();
    setStoredData(key, {
      mcAnswers: {},
      mcStatus: {},
      tkaAnswers: { s1: '', s2: '', s3: '' },
      tkaStatus: null,
      score: 0,
      isPassed: false,
      reflection
    });

    if (onLatihanPassed) {
      onLatihanPassed(0, false);
    }
  };

  // Nomor soal yang salah
  const wrongQuestions = [];
  MC_QUESTIONS.forEach((q) => {
    if (mcStatus[q.id] === 'incorrect') wrongQuestions.push(q.number);
  });
  if (tkaStatus === 'incorrect') {
    wrongQuestions.push(5);
  }

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>

      {/* ── PANEL KELULUSAN / SKOR ───────────────────────────────────── */}
      {showSummary && (
        <div className="fade-in" style={{
          background: isPassed ? '#ECFDF5' : '#FEF2F2',
          border: `2px solid ${isPassed ? '#86EFAC' : '#FCA5A5'}`,
          borderRadius: '16px',
          padding: '1.4rem 1.6rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ fontSize: '2.4rem' }}>{isPassed ? '🎉' : '⚠️'}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: isPassed ? '#065F46' : '#991B1B' }}>
                  {isPassed ? 'Selamat, Kamu Lulus Latihan Bab 4!' : 'Belum Memenuhi KKM (Minimal 4/5 Benar)'}
                </h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.94rem', color: isPassed ? '#047857' : '#7F1D1D' }}>
                  Skor kamu: <strong>{score} dari 5 soal</strong> ({Math.round((score / 5) * 100)}%).
                </p>
              </div>
            </div>

            {!isPassed && (
              <Button
                variant="primary"
                onClick={handleReset}
                style={{
                  padding: '0.7rem 1.4rem',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  background: '#DC2626',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                🔄 Ulangi Latihan
              </Button>
            )}
          </div>

          {!isPassed && wrongQuestions.length > 0 && (
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              background: '#FFFFFF',
              borderRadius: '10px',
              border: '1px solid #FECACA',
              fontSize: '0.88rem',
              color: '#991B1B'
            }}>
              Nomor soal yang masih kurang tepat: <strong>{wrongQuestions.join(', ')}</strong>. Kunci jawaban tidak ditampilkan sampai kamu lulus. Silakan pelajari kembali konsep di Tab 3 dan ulangi latihan!
            </div>
          )}

          {isPassed && (
            <div style={{
              marginTop: '0.85rem',
              fontSize: '0.88rem',
              color: '#065F46',
              borderTop: '1px solid #A7F3D0',
              paddingTop: '0.75rem'
            }}>
              ✓ Pembahasan lengkap setiap soal kini terbuka di bawah. Pelajari untuk memperdalam pemahamanmu!
            </div>
          )}
        </div>
      )}

      {/* ── KOTAK SOAL 1 SAMPAI 4 (MCQ) ─────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.6rem' }}>
        {MC_QUESTIONS.map((q) => {
          const userAns = mcAnswers[q.id];
          const st = mcStatus[q.id];

          return (
            <div
              key={q.id}
              style={{
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                borderRadius: '14px',
                padding: '1.3rem 1.5rem',
                boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
              }}
            >
              {/* Header Nomor & Kategori Soal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{
                    background: '#0284C7',
                    color: '#FFFFFF',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.84rem',
                    fontWeight: 800
                  }}>
                    {q.number}
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>
                    [{q.category}]
                  </span>
                </div>

                {/* Status Jawaban Pertama */}
                {st && (
                  <span style={{
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    background: st === 'correct' ? '#ECFDF5' : '#FEF2F2',
                    border: `1px solid ${st === 'correct' ? '#86EFAC' : '#FCA5A5'}`,
                    color: st === 'correct' ? '#059669' : '#DC2626'
                  }}>
                    {st === 'correct' ? '✓ Benar' : '✗ Salah'}
                  </span>
                )}
              </div>

              {/* Teks Soal */}
              <p style={{ margin: '0 0 1rem', fontSize: '0.98rem', color: '#0F172A', lineHeight: 1.55 }}>
                {q.question}
              </p>

              {/* Pilihan Jawaban A-E */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {q.options.map((opt) => {
                  const isSelected = userAns === opt.key;
                  let optBorder = '#E2E8F0';
                  let optBg = '#FFFFFF';
                  let optColor = '#334155';

                  if (isSelected) {
                    optBorder = '#0284C7';
                    optBg = '#F0F9FF';
                    optColor = '#0369A1';
                  }

                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectMC(q.id, opt.key)}
                      disabled={Boolean(st)} // Terkunci setelah dijawab
                      style={{
                        padding: '0.7rem 0.95rem',
                        borderRadius: '10px',
                        border: `1.5px solid ${optBorder}`,
                        background: optBg,
                        color: optColor,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.65rem',
                        textAlign: 'left',
                        cursor: st ? 'default' : 'pointer',
                        fontFamily: "'Times New Roman', Times, serif",
                        fontSize: '0.92rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <strong style={{
                        minWidth: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: isSelected ? '#0284C7' : '#F1F5F9',
                        color: isSelected ? '#FFFFFF' : '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 800
                      }}>
                        {opt.key}
                      </strong>
                      <span style={{ lineHeight: 1.45 }}>{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Pembahasan Lengkap (HANYA TAMPIL SETELAH LULUS) */}
              {isPassed && (
                <div className="fade-in" style={{
                  marginTop: '1.1rem',
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: '10px',
                  padding: '0.85rem 1.1rem',
                  fontSize: '0.88rem',
                  color: '#334155',
                  lineHeight: 1.5
                }}>
                  <strong style={{ color: '#0369A1', display: 'block', marginBottom: '0.25rem' }}>
                    💡 Pembahasan Soal {q.number} (Kunci: {q.correctKey}):
                  </strong>
                  {q.solution}
                </div>
              )}
            </div>
          );
        })}

        {/* ── SOAL 5: GAYA TKA (KATEGORI BENAR / SALAH) ──────────────── */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '14px',
          padding: '1.3rem 1.5rem',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
        }}>
          {/* Header Soal 5 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                background: '#0284C7',
                color: '#FFFFFF',
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.84rem',
                fontWeight: 800
              }}>
                5
              </span>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                background: '#EFF6FF',
                color: '#1D4ED8',
                border: '1px solid #BFDBFE',
                padding: '0.15rem 0.55rem',
                borderRadius: '6px'
              }}>
                Gaya TKA
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>
                [{TKA_QUESTION.category}]
              </span>
            </div>

            {/* Status Keseluruhan Soal 5 */}
            {tkaStatus && (
              <span style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                padding: '0.2rem 0.65rem',
                borderRadius: '999px',
                background: tkaStatus === 'correct' ? '#ECFDF5' : '#FEF2F2',
                border: `1px solid ${tkaStatus === 'correct' ? '#86EFAC' : '#FCA5A5'}`,
                color: tkaStatus === 'correct' ? '#059669' : '#DC2626'
              }}>
                {tkaStatus === 'correct' ? '✓ Benar' : '✗ Salah'}
              </span>
            )}
          </div>

          {/* Stimulus & Narasi Percobaan */}
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.98rem', color: '#0F172A', lineHeight: 1.55 }}>
            {TKA_QUESTION.stimulus}
          </p>

          {/* Tabel Data Percobaan Kentang */}
          <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
            <table style={{
              width: '100%',
              maxWidth: '520px',
              borderCollapse: 'collapse',
              fontSize: '0.88rem',
              textAlign: 'center',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <thead>
                <tr style={{ background: '#F1F5F9', color: '#334155' }}>
                  <th style={{ padding: '0.6rem 0.8rem', border: '1px solid #CBD5E1', textAlign: 'left' }}>Konsentrasi sukrosa (M)</th>
                  {TKA_QUESTION.tableData.map((d, i) => (
                    <th key={i} style={{ padding: '0.6rem 0.7rem', border: '1px solid #CBD5E1' }}>{d.conc}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: '#FFFFFF', color: '#0F172A' }}>
                  <td style={{ padding: '0.6rem 0.8rem', border: '1px solid #CBD5E1', textAlign: 'left', fontWeight: 600 }}>Perubahan massa kentang (%)</td>
                  {TKA_QUESTION.tableData.map((d, i) => (
                    <td key={i} style={{
                      padding: '0.6rem 0.7rem',
                      border: '1px solid #CBD5E1',
                      fontWeight: 700,
                      color: d.change.startsWith('+') ? '#0284C7' : '#DC2626'
                    }}>
                      {d.change}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Perintah Soal */}
          <p style={{ margin: '0 0 0.85rem', fontSize: '0.94rem', fontWeight: 700, color: '#334155' }}>
            {TKA_QUESTION.instruction}
          </p>

          {/* Tabel 3 Pernyataan dengan Radio Button Benar / Salah */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
            {TKA_QUESTION.statements.map((st, sIdx) => {
              const currentVal = tkaAnswers[st.id];

              return (
                <div
                  key={st.id}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '0.75rem'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '240px', fontSize: '0.92rem', color: '#1E293B', lineHeight: 1.45 }}>
                    <strong>{sIdx + 1}. </strong>{st.text}
                  </div>

                  {/* Radio Group Benar / Salah */}
                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: currentVal === 'Benar' ? '#059669' : '#475569',
                      background: currentVal === 'Benar' ? '#ECFDF5' : '#FFFFFF',
                      border: `1.5px solid ${currentVal === 'Benar' ? '#86EFAC' : '#CBD5E1'}`,
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      cursor: tkaStatus ? 'default' : 'pointer'
                    }}>
                      <input
                        type="radio"
                        name={st.id}
                        value="Benar"
                        checked={currentVal === 'Benar'}
                        disabled={Boolean(tkaStatus)}
                        onChange={() => setTkaAnswers((prev) => ({ ...prev, [st.id]: 'Benar' }))}
                      />
                      Benar
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: currentVal === 'Salah' ? '#DC2626' : '#475569',
                      background: currentVal === 'Salah' ? '#FEF2F2' : '#FFFFFF',
                      border: `1.5px solid ${currentVal === 'Salah' ? '#FCA5A5' : '#CBD5E1'}`,
                      padding: '0.35rem 0.75rem',
                      borderRadius: '8px',
                      cursor: tkaStatus ? 'default' : 'pointer'
                    }}>
                      <input
                        type="radio"
                        name={st.id}
                        value="Salah"
                        checked={currentVal === 'Salah'}
                        disabled={Boolean(tkaStatus)}
                        onChange={() => setTkaAnswers((prev) => ({ ...prev, [st.id]: 'Salah' }))}
                      />
                      Salah
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tombol Periksa Soal 5 */}
          {!tkaStatus && (
            <div style={{ textAlign: 'right' }}>
              <Button
                variant="primary"
                onClick={handleCheckTKA}
                disabled={!tkaAnswers.s1 || !tkaAnswers.s2 || !tkaAnswers.s3}
                style={{
                  padding: '0.65rem 1.4rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  background: (!tkaAnswers.s1 || !tkaAnswers.s2 || !tkaAnswers.s3) ? '#94A3B8' : '#0284C7',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                Periksa Jawaban Soal 5
              </Button>
            </div>
          )}

          {/* Pembahasan Soal 5 (HANYA TAMPIL SETELAH LULUS) */}
          {isPassed && (
            <div className="fade-in" style={{
              marginTop: '1.1rem',
              background: '#F8FAFC',
              border: '1px solid #CBD5E1',
              borderRadius: '10px',
              padding: '0.85rem 1.1rem',
              fontSize: '0.88rem',
              color: '#334155',
              lineHeight: 1.5
            }}>
              <strong style={{ color: '#0369A1', display: 'block', marginBottom: '0.35rem' }}>
                💡 Pembahasan Soal 5 (Gaya TKA):
              </strong>
              <ul style={{ margin: '0 0 0.5rem', paddingLeft: '1.2rem' }}>
                {TKA_QUESTION.statements.map((st, i) => (
                  <li key={i} style={{ marginBottom: '0.25rem' }}>
                    <strong>Pernyataan {i + 1} ({st.correct}):</strong> {st.reason}
                  </li>
                ))}
              </ul>
              <div style={{ fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic', borderTop: '1px dashed #CBD5E1', paddingTop: '0.4rem' }}>
                {TKA_QUESTION.tkaNote}
              </div>
            </div>
          )}
        </div>

        {/* ── REFLEKSI WAJIB BAB 4 (TIDAK DINILAI) ───────────────────── */}
        <div style={{
          background: '#F0F9FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.3rem 1.5rem',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.3rem' }}>✍️</span>
            <strong style={{ fontSize: '1.05rem', color: '#0369A1' }}>
              Refleksi Belajar Mandiri (Wajib Diisi)
            </strong>
          </div>
          <p style={{ margin: '0 0 0.85rem', fontSize: '0.94rem', color: '#0C4A6E', lineHeight: 1.5 }}>
            Fenomena osmosis apa yang pernah kamu lihat di sekitarmu? Jelaskan ke mana molekul air berpindah!
          </p>

          <form onSubmit={handleReflectionSubmit}>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
              placeholder="Contoh: Saat membuat manisan mangga, mangga ditaburi gula pasir pekat sehingga air dari dalam potongan mangga keluar..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.92rem',
                fontFamily: "'Times New Roman', Times, serif",
                resize: 'vertical',
                boxSizing: 'border-box',
                marginBottom: '0.75rem'
              }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: reflectionSubmitted ? '#059669' : '#64748B', fontWeight: 600 }}>
                {reflectionSubmitted ? '✓ Refleksi berhasil disimpan' : '*Refleksi wajib diisi untuk menuntaskan latihan'}
              </span>

              <Button
                type="submit"
                variant="primary"
                style={{
                  padding: '0.55rem 1.25rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  background: '#0284C7',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                {reflectionSubmitted ? 'Simpan Ulang' : 'Kirim Refleksi'}
              </Button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
}
