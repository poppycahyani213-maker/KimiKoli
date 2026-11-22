import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import ParticleCanvas from '../components/ParticleCanvas';
import SketchCurveCanvas from '../components/SketchCurveCanvas';
import { TAMPILKAN_PEMBAHASAN } from '../labConfig';

/**
 * Tahap 6: Kesimpulan, Refleksi & Evaluasi Proyek (Fase 4 LKPD Misi Titik Beku)
 *
 * Komponen mencakup:
 * 1. Pertanyaan 1 (Bentuk Grafik & Model Partikel):
 *    - 1a. Tiga kanvas partikel (awal, tengah, akhir pembekuan) + isian "Penjelasanku"
 *    - 1b. Kanvas sketsa kurva prediksi CaCl2 1 m vs NaCl 1 m + isian alasan partikel
 * 2. Pertanyaan 2 (Menguji Model dengan Data: (a) Efek ion vs (b) Galat alat vs belum pasti)
 * 3. Penutup Refleksi:
 *    - (1) Komparasi prediksi awal Tahap 1.1 vs hasil Tahap 5
 *    - (2) Menjawab ulang pertanyaan pemantik (Makroskopik, Simbolik, Submikroskopik)
 * 4. Panduan Produk Akhir (Checklist poster/presentasi 5 menit)
 * 5. Penilaian Diri Kelompok (6 aspek + pelajaran terbesar)
 * 6. Kuis Singkat Penutup (5 soal pilihan ganda + pembahasan interaktif)
 * 7. Kotak Pembahasan Komprehensif (muncul setelah tersimpan, flag TAMPILKAN_PEMBAHASAN)
 */

// Bank Soal Kuis Singkat Tahap 6
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'Berdasarkan persamaan sifat koligatif ΔTf = Kf × m × i, faktor apa saja yang berbanding lurus dengan besar penurunan titik beku larutan?',
    options: [
      { key: 'A', text: 'Massa molar zat terlarut dan massa jenis pelarut' },
      { key: 'B', text: 'Konsentrasi molalitas (m) dan faktor van \'t Hoff (i)', isCorrect: true },
      { key: 'C', text: 'Volume larutan dan tekanan udara luar' },
      { key: 'D', text: 'Hanya tetapan Kf pelarut saja' }
    ],
    explanation: 'Sesuai hukum Raoult, ΔTf = Kf × m × i. Penurunan titik beku berbanding lurus dengan jumlah partikel zat terlarut, yang dinyatakan oleh molalitas (m) dan faktor van \'t Hoff (i).'
  },
  {
    id: 'q2',
    question: 'Mengapa keberadaan partikel zat terlarut menyebabkan air membeku pada suhu yang lebih rendah dari 0°C?',
    options: [
      { key: 'A', text: 'Zat terlarut menyerap hawa panas dari luar tabung' },
      { key: 'B', text: 'Partikel zat terlarut menghalangi molekul air untuk saling merapat membentuk kisi kristal es padat yang teratur', isCorrect: true },
      { key: 'C', text: 'Zat terlarut mengubah rumus molekul H₂O menjadi molekul lain' },
      { key: 'D', text: 'Zat terlarut menurunkan massa jenis air murni' }
    ],
    explanation: 'Partikel zat terlarut tersebar di antara molekul-molekul air, sehingga menghalangi molekul air untuk merapat dan menata diri ke dalam kisi kristal padat. Akibatnya, dibutuhkan suhu yang lebih rendah (energi kinetik lebih kecil) agar kristal es dapat terbentuk.'
  },
  {
    id: 'q3',
    question: 'Pada kurva pendinginan suhu terhadap waktu, bagian kurva yang mendatar (plateau) menunjukkan:',
    options: [
      { key: 'A', text: 'Waktu saat sensor suhu kehabisan baterai' },
      { key: 'B', text: 'Suhu saat terjadi kesetimbangan transisi fase cair menjadi padat (titik beku)', isCorrect: true },
      { key: 'C', text: 'Suhu es batu di penangas pendingin luar' },
      { key: 'D', text: 'Suhu ruangan laboratorium saat percobaan' }
    ],
    explanation: 'Bagian mendatar (plateau) terjadi karena selama proses pembekuan (perubahan wujud cair menjadi padat), kalor laten dilepaskan sehingga suhu sistem tetap konstan pada titik bekunya hingga seluruh cairan membeku.'
  },
  {
    id: 'q4',
    question: 'Jika suatu larutan hasil eksperimen Arduino mulai membeku dan membentuk plateau pada suhu -2,40°C, berapakah nilai penurunan titik beku (ΔTf) larutan tersebut?',
    options: [
      { key: 'A', text: '-2,40 °C' },
      { key: 'B', text: '+2,40 °C', isCorrect: true },
      { key: 'C', text: '0,00 °C' },
      { key: 'D', text: '1,86 °C' }
    ],
    explanation: 'ΔTf = Tf° (air murni) - Tf (larutan) = 0,00°C - (-2,40°C) = +2,40°C. Nilai penurunan titik beku (ΔTf) selalu bernilai positif.'
  },
  {
    id: 'q5',
    question: 'Mengapa larutan NaCl 1 m memiliki penurunan titik beku sekitar dua kali lebih besar daripada larutan gula (sukrosa) 1 m?',
    options: [
      { key: 'A', text: 'Karena massa molar NaCl lebih kecil dari sukrosa' },
      { key: 'B', text: 'Karena NaCl adalah elektrolit yang terdisosiasi menjadi 2 ion (Na⁺ dan Cl⁻), sehingga jumlah partikel efektifnya dua kali lipat (i ≈ 2)', isCorrect: true },
      { key: 'C', text: 'Karena NaCl lebih cepat larut di air dibanding sukrosa' },
      { key: 'D', text: 'Karena ion Na⁺ bereaksi eksoterm dengan air' }
    ],
    explanation: 'NaCl tergolong elektrolit kuat yang terdisosiasi sempurna menjadi 1 ion Na⁺ dan 1 ion Cl⁻ (n = 2, i ≈ 2). Karena sifat koligatif hanya bergantung pada jumlah partikel efektif, efek penurunan titik bekunya mendekati 2 kali lipat dari nonelektrolit sukrosa (i = 1).'
  }
];

export default function Stage6Conclusion({
  data = {},
  stage1Data = {},
  stage5Data = {},
  onSave,
  isCompleted = false,
  onCompleteStage,
  onFinalizeLab,
  onPrevStage
}) {
  // === 1. Pertanyaan 1 (Bentuk Grafik & Model Partikel) ===
  // 1a. Tiga kanvas partikel larutan saat membeku (awal, tengah, akhir)
  const [particlesStart, setParticlesStart] = useState(data.particlesStart || []);
  const [particlesMiddle, setParticlesMiddle] = useState(data.particlesMiddle || []);
  const [particlesEnd, setParticlesEnd] = useState(data.particlesEnd || []);
  const [explanation1a, setExplanation1a] = useState(
    data.explanation1a || 'Saat air mulai membeku, kristal es yang terbentuk adalah es murni. Akibatnya, zat terlarut tertinggal di dalam cairan sisa, menyebabkan konsentrasi larutan sisa semakin pekat sehingga titik bekunya terus bergeser turun dan grafik tidak mendatar sempurna.'
  );

  // 1b. Sketsa kurva prediksi CaCl2 1 m vs NaCl 1 m
  const [sketchStrokes, setSketchStrokes] = useState(data.sketchStrokes || []);
  const [explanation1b, setExplanation1b] = useState(
    data.explanation1b || 'CaCl₂ terurai menjadi 3 ion (1 Ca²⁺ + 2 Cl⁻, i ≈ 3), sehingga jumlah partikelnya lebih banyak daripada NaCl (i ≈ 2). Kurva CaCl₂ berada jauh lebih rendah di bawah kurva NaCl dengan ΔTf teoretis sekitar 5,58°C.'
  );

  // === 2. Pertanyaan 2 (Uji Model dengan Data) ===
  const [causeHypothesis, setCauseHypothesis] = useState(data.causeHypothesis || '(a)');
  const [graphEvidence, setGraphEvidence] = useState(data.graphEvidence || '');
  const [designChangeProposal, setDesignChangeProposal] = useState(data.designChangeProposal || '');

  // === 3. Penutup Refleksi ===
  // (1) Perbandingan prediksi vs data
  const [correctComparison, setCorrectComparison] = useState(data.correctComparison || '');
  const [changeReason, setChangeReason] = useState(data.changeReason || '');
  // (2) Triplet Kimia
  const [macroscopicAns, setMacroscopicAns] = useState(data.macroscopicAns || '');
  const [symbolicAns, setSymbolicAns] = useState(data.symbolicAns || '');
  const [submicroscopicAns, setSubmicroscopicAns] = useState(data.submicroscopicAns || '');

  // === 4. Produk Akhir Checklist ===
  const [productChecklist, setProductChecklist] = useState(data.productChecklist || {
    photoDevice: false,
    stackedGraph: false,
    deltaTfMolalityGraph: false,
    drivingQuestionAns: false
  });

  // === 5. Penilaian Diri Kelompok (6 Aspek) ===
  const [selfAssessment, setSelfAssessment] = useState(data.selfAssessment || {
    calibratedTool: 'Sudah baik',
    freezingPointMethod: 'Sudah baik',
    rangeErrorAnalysis: 'Sudah baik',
    completeGraphLabels: 'Sudah baik',
    particleConnection: 'Sudah baik',
    teamContribution: 'Sudah baik'
  });
  const [biggestLesson, setBiggestLesson] = useState(data.biggestLesson || '');

  // === 6. Kuis Singkat Penutup ===
  const [quizAnswers, setQuizAnswers] = useState(data.quizAnswers || {});
  const [quizChecked, setQuizChecked] = useState(data.quizChecked || {});

  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [hasSavedOnce, setHasSavedOnce] = useState(Boolean(data.hasSavedOnce || isCompleted));

  // Handler jawaban kuis
  const handleSelectQuizOption = (qId, optionKey) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optionKey }));
  };

  const handleCheckQuizAnswer = (qId) => {
    setQuizChecked((prev) => ({ ...prev, [qId]: true }));
  };

  // Prediksi awal dari Tahap 1
  const stage1Predictions = stage1Data.predictions || {};

  // Kompilasi data saat ini
  const getCurrentState = () => ({
    particlesStart,
    particlesMiddle,
    particlesEnd,
    explanation1a,
    sketchStrokes,
    explanation1b,
    causeHypothesis,
    graphEvidence,
    designChangeProposal,
    correctComparison,
    changeReason,
    macroscopicAns,
    symbolicAns,
    submicroscopicAns,
    productChecklist,
    selfAssessment,
    biggestLesson,
    quizAnswers,
    quizChecked,
    hasSavedOnce: true
  });

  // Simpan Draf
  const handleSaveProgress = () => {
    const currentState = getCurrentState();
    if (onSave) onSave(currentState);
    setHasSavedOnce(true);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  // Validasi sebelum menyelesaikan tahap 6
  const handleCompleteStage6 = () => {
    if (!explanation1a.trim()) {
      alert('⚠️ Mohon lengkapi penjelasan pada Pertanyaan 1a mengenai bentuk kurva pendinginan larutan.');
      return;
    }
    if (!explanation1b.trim()) {
      alert('⚠️ Mohon lengkapi penjelasan pada Pertanyaan 1b mengenai prediksi kurva CaCl₂.');
      return;
    }
    if (!graphEvidence.trim() || !designChangeProposal.trim()) {
      alert('⚠️ Mohon lengkapi bukti grafik dan usulan desain alat pada Pertanyaan 2.');
      return;
    }
    if (!correctComparison.trim() || !changeReason.trim()) {
      alert('⚠️ Mohon lengkapi refleksi perbandingan prediksi awal dengan hasil eksperimen pada Penutup (1).');
      return;
    }
    if (!macroscopicAns.trim() || !symbolicAns.trim() || !submicroscopicAns.trim()) {
      alert('⚠️ Mohon jawab pertanyaan pemantik pada ketiga level (Makroskopik, Simbolik, Submikroskopik) pada Penutup (2).');
      return;
    }
    if (!biggestLesson.trim()) {
      alert('⚠️ Mohon tuliskan hal yang paling kalian pelajari dari misi proyek ini pada bagian Penilaian Diri.');
      return;
    }

    // Cek apakah seluruh 5 soal kuis telah dijawab
    const allQuizAnswered = QUIZ_QUESTIONS.every((q) => Boolean(quizAnswers[q.id]));
    if (!allQuizAnswered) {
      alert('⚠️ Mohon jawab seluruh 5 soal pada Kuis Singkat Penutup.');
      return;
    }

    const finalData = {
      ...getCurrentState(),
      isFinished: true
    };

    setHasSavedOnce(true);
    if (onSave) onSave(finalData);
    if (onCompleteStage) onCompleteStage(6, finalData);
    if (onFinalizeLab) onFinalizeLab(finalData);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 3000);
  };

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Tahap 6: Kesimpulan, Refleksi & Evaluasi Proyek (Fase 4)"
        subtitle="Sintaks PjBL 4 • Menjelaskan Bentuk Kurva, Evaluasi Data, Triplet Kimia, & Kuis Evaluasi Akhir Lab"
      >
        {/* Banner Penutup */}
        <div style={{
          background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
          border: '1.5px solid #A7F3D0',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '2.4rem' }}>🎓</span>
          <div>
            <strong style={{ fontSize: '1.15rem', color: '#065F46', display: 'block', marginBottom: '0.25rem' }}>
              Fase Refleksi Akhir: Menghubungkan Teori, Data Nyata, dan Pemodelan Partikel
            </strong>
            <p style={{ margin: 0, color: '#064E3B', fontSize: '0.9rem', lineHeight: 1.55 }}>
              Pada tahap puncak ini, kalian akan menganalisis bentuk kurva secara mendalam, mengevaluasi galat pengukuran,
              membandingkan prediksi awal, dan menyimpulkan rahasia sifat koligatif larutan.
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 1. PERTANYAAN 1: Menjelaskan Bentuk Grafik                      */}
        {/* ============================================================== */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '1.3rem' }}>📈</span>
            <strong style={{ fontSize: '1.08rem', color: '#0F172A' }}>
              Pertanyaan 1: Menjelaskan Bentuk Grafik Pendinginan
            </strong>
          </div>

          <div style={{
            background: '#F8FAFC',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            borderLeft: '4px solid #0284C7',
            marginBottom: '1rem',
            fontSize: '0.94rem',
            color: '#1E293B',
            fontStyle: 'italic'
          }}>
            &ldquo;Pada kurva air murni terdapat bagian datar (plateau), tetapi pada kurva larutan suhu terus menurun landai dan tidak pernah benar-benar datar.&rdquo;
          </div>

          {/* 1a. Tiga Kanvas Partikel Pembekuan Larutan */}
          <div style={{ marginBottom: '1.25rem' }}>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0369A1', marginBottom: '0.4rem' }}>
              1a. Pemodelan Partikel Submikroskopik Selama Pembekuan Larutan:
            </strong>
            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.86rem', color: '#64748B' }}>
              Modelkan susunan molekul air (○) dan partikel zat terlarut (●) pada tiga waktu pembekuan: awal, tengah, dan akhir.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '0.85rem' }}>
              <ParticleCanvas
                title="Awal Pembekuan"
                subtitle="Kristal es pertama mulai terbentuk"
                particles={particlesStart}
                onChange={setParticlesStart}
                height={160}
              />
              <ParticleCanvas
                title="Tengah Pembekuan"
                subtitle="Sebagian air telah membeku jadi es"
                particles={particlesMiddle}
                onChange={setParticlesMiddle}
                height={160}
              />
              <ParticleCanvas
                title="Akhir Pembekuan"
                subtitle="Sebagian besar air membeku, larutan sisa sangat pekat"
                particles={particlesEnd}
                onChange={setParticlesEnd}
                height={160}
              />
            </div>

            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#1E293B', marginBottom: '0.3rem' }}>
              Penjelasanku (Mengapa titik beku larutan terus bergeser selama pembekuan):
            </label>
            <textarea
              rows={3}
              value={explanation1a}
              onChange={(e) => setExplanation1a(e.target.value)}
              placeholder="Jelaskan apa yang terjadi pada konsentrasi zat terlarut dalam cairan sisa ketika molekul air membeku menjadi es kristal murni..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.92rem',
                fontFamily: "'Times New Roman', Times, serif",
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* 1b. Sketsa Kurva Prediksi CaCl2 vs NaCl */}
          <div>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0369A1', marginBottom: '0.4rem' }}>
              1b. Prediksi Kurva CaCl₂ 1 m Dibandingkan NaCl 1 m:
            </strong>
            <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.86rem', color: '#64748B' }}>
              Gambarkan sketsa kurva pendinginan CaCl₂ 1 m (pena merah) dibandingkan kurva NaCl 1 m (pena biru) pada kanvas sumbu di bawah:
            </p>

            <SketchCurveCanvas
              strokes={sketchStrokes}
              onChange={setSketchStrokes}
              height={230}
            />

            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#1E293B', marginBottom: '0.3rem' }}>
              Alasan Partikelnya (Ion-ion dan faktor van &apos;t Hoff):
            </label>
            <textarea
              rows={2}
              value={explanation1b}
              onChange={(e) => setExplanation1b(e.target.value)}
              placeholder="Jelaskan perbandingan jumlah ion yang dihasilkan oleh disosiasi CaCl₂ vs NaCl, serta dampaknya terhadap penurunan titik beku teoretis..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.92rem',
                fontFamily: "'Times New Roman', Times, serif",
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. PERTANYAAN 2: Menguji Model dengan Data                     */}
        {/* ============================================================== */}
        <div style={{
          background: '#FFFBEB',
          border: '1.5px solid #FDE68A',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🔍</span>
            <strong style={{ fontSize: '1.08rem', color: '#92400E' }}>
              Pertanyaan 2: Menguji Model dengan Data Nyata (Efek Ion vs Galat Pengukuran)
            </strong>
          </div>

          <div style={{
            background: '#FFFFFF',
            padding: '0.85rem 1rem',
            borderRadius: '10px',
            borderLeft: '4px solid #D97706',
            marginBottom: '1rem',
            fontSize: '0.92rem',
            color: '#78350F',
            lineHeight: 1.55
          }}>
            &ldquo;Mungkin data kelompokmu menunjukkan bahwa ΔTf NaCl tidak persis 2 kali lipat dari gula. Gunakan datamu untuk memutuskan: apakah selisih itu lebih mungkin disebabkan oleh:
            <br />
            <strong>(a)</strong> Perilaku ion Na⁺ dan Cl⁻ dalam larutan (misalnya saling tarik-menarik sehingga partikel efektif lebih sedikit), atau
            <br />
            <strong>(b)</strong> Kesalahan pengukuran pada alat praktikummu?&rdquo;
          </div>

          {/* Radio Pilihan */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {[
              { val: '(a)', label: '(a) Perilaku ion Na⁺ & Cl⁻ (interaksi antar-ion / i < 2)' },
              { val: '(b)', label: '(b) Kesalahan pengukuran pada alat praktikum' },
              { val: '(c)', label: 'Belum bisa dipastikan (perlu data ulangan lebih banyak)' }
            ].map((opt) => (
              <label
                key={opt.val}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  background: '#FFFFFF',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '8px',
                  border: causeHypothesis === opt.val ? '2px solid #D97706' : '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  fontWeight: causeHypothesis === opt.val ? 700 : 500
                }}
              >
                <input
                  type="radio"
                  name="causeHypothesis"
                  checked={causeHypothesis === opt.val}
                  onChange={() => setCauseHypothesis(opt.val)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>

          {/* Bukti dari grafik ulangan */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#78350F', marginBottom: '0.3rem' }}>
              Bukti dari grafik ulangan (sebutkan angka rentang dan selisihnya):
            </label>
            <textarea
              rows={2}
              value={graphEvidence}
              onChange={(e) => setGraphEvidence(e.target.value)}
              placeholder="Contoh: Rentang ulangan pengukuran titik beku kelompok kami berkisar antara 0,15°C, sedangkan selisih ΔTf eksperimen dengan nilai teoretis adalah 0,22°C..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.92rem',
                fontFamily: "'Times New Roman', Times, serif",
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Satu perubahan desain alat */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#78350F', marginBottom: '0.3rem' }}>
              Satu usulan perubahan desain alat untuk membedakan kedua penyebab tersebut:
            </label>
            <textarea
              rows={2}
              value={designChangeProposal}
              onChange={(e) => setDesignChangeProposal(e.target.value)}
              placeholder="Contoh: Menggunakan wadah tabung berdinding vakum (dewar mini) untuk memperlambat pendinginan, serta menambah pengaduk magnetik konstan..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.92rem',
                fontFamily: "'Times New Roman', Times, serif",
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. PENUTUP REFLEKSI: Perbandingan Prediksi & Triplet Kimia     */}
        {/* ============================================================== */}
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🔄</span>
            <strong style={{ fontSize: '1.08rem', color: '#0369A1' }}>
              3. Penutup Refleksi & Integrasi Tiga Level Representasi Kimia
            </strong>
          </div>

          {/* (1) Bandingkan Prediksi Awal Tahap 1.1 vs Data Nyata */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #BAE6FD',
            padding: '1rem',
            marginBottom: '1.25rem'
          }}>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0284C7', marginBottom: '0.5rem' }}>
              (1) Perbandingan Prediksi Awal (Tahap 1.1) vs Hasil Eksperimen Nyata:
            </strong>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.75rem',
              marginBottom: '1rem',
              background: '#F8FAFC',
              padding: '0.75rem',
              borderRadius: '8px'
            }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#64748B', display: 'block' }}>Prediksi Siswa (Tahap 1.1):</span>
                <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>
                  💧 Air: Peringkat {stage1Predictions.pureWaterRank || '-'}<br />
                  🍬 Gula: Peringkat {stage1Predictions.sugarRank || '-'}<br />
                  🧂 NaCl: Peringkat {stage1Predictions.naclRank || '-'}
                </strong>
                {stage1Predictions.reason && (
                  <div style={{ fontSize: '0.8rem', color: '#64748B', fontStyle: 'italic', marginTop: '0.2rem' }}>
                    Alasan: &ldquo;{stage1Predictions.reason}&rdquo;
                  </div>
                )}
              </div>

              <div>
                <span style={{ fontSize: '0.82rem', color: '#64748B', display: 'block' }}>Fakta Teori & Eksperimen:</span>
                <strong style={{ fontSize: '0.92rem', color: '#15803D' }}>
                  1. NaCl 1 m (Paling Rendah, Tf ≈ -3,72°C)<br />
                  2. Gula 1 m (Tengah, Tf ≈ -1,86°C)<br />
                  3. Air Murni (Paling Tinggi, Tf = 0,00°C)
                </strong>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.25rem' }}>
                  Bagian yang sudah benar dari prediksimu:
                </label>
                <textarea
                  rows={2}
                  value={correctComparison}
                  onChange={(e) => setCorrectComparison(e.target.value)}
                  placeholder="Tuliskan bagian prediksi yang terbukti tepat setelah eksperimen..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem', color: '#334155', marginBottom: '0.25rem' }}>
                  Bagian yang berubah dan mengapa:
                </label>
                <textarea
                  rows={2}
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  placeholder="Tuliskan pemahaman baru yang kalian dapatkan..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* (2) Jawab Ulang Pertanyaan Pemantik dengan Triplet Kimia */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #BAE6FD',
            padding: '1rem'
          }}>
            <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0284C7', marginBottom: '0.5rem' }}>
              (2) Menjawab Ulang Pertanyaan Pemantik Melalui 3 Level Representasi Kimia (Triplet):
            </strong>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Makroskopik */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#0369A1', marginBottom: '0.25rem' }}>
                  👁️ Level Makroskopik (Apa yang teramati di dunia nyata):
                </label>
                <textarea
                  rows={2}
                  value={macroscopicAns}
                  onChange={(e) => setMacroscopicAns(e.target.value)}
                  placeholder="Contoh: Menambahkan garam pada es membuat es mencair sebagian namun suhu penangas turun jauh di bawah 0°C sehingga adonan es krim dapat membeku..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* Simbolik */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#D97706', marginBottom: '0.25rem' }}>
                  🔢 Level Simbolik (Apa yang ditunjukkan grafik kurva pendinginan & persamaan ΔTf = Kf × m × i):
                </label>
                <textarea
                  rows={2}
                  value={symbolicAns}
                  onChange={(e) => setSymbolicAns(e.target.value)}
                  placeholder="Contoh: Kurva pendinginan larutan memiliki plateau lebih rendah. Persamaan ΔTf = 1,86 × m × i menunjukkan semakin besar molalitas dan faktor i, semakin besar ΔTf..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>

              {/* Submikroskopik */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#15803D', marginBottom: '0.25rem' }}>
                  🔬 Level Submikroskopik (Apa yang terjadi pada partikel ion dan molekul air):
                </label>
                <textarea
                  rows={2}
                  value={submicroscopicAns}
                  onChange={(e) => setSubmicroscopicAns(e.target.value)}
                  placeholder="Contoh: Ion Na⁺ dan Cl⁻ terhidrasi oleh molekul air dan menghalangi molekul air saling mengikat membentuk kristal es, sehingga butuh energi kinetik lebih rendah..."
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 4. PRODUK AKHIR: Panduan & Checklist                           */}
        {/* ============================================================== */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '1.3rem' }}>📊</span>
            <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>
              4. Panduan Produk Akhir: Poster atau Presentasi 5 Menit
            </strong>
          </div>
          <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.88rem', color: '#64748B' }}>
            Siapkan produk akhir kelompokmu dalam bentuk poster ilmiah atau bahan presentasi singkat (maksimal 5 menit). Pastikan 4 komponen berikut telah lengkap:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.65rem' }}>
            {[
              { key: 'photoDevice', label: '(1) Foto alat Arduino kelompok dan catatan perubahan desain terbesar' },
              { key: 'stackedGraph', label: '(2) Grafik tumpuk kurva pendinginan (Air murni, Gula, NaCl)' },
              { key: 'deltaTfMolalityGraph', label: '(3) Grafik ΔTf terhadap molalitas beserta gradien garis tren' },
              { key: 'drivingQuestionAns', label: '(4) Jawaban pertanyaan pemantik pada 3 level representasi' }
            ].map((item) => (
              <label
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#FFFFFF',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(productChecklist[item.key])}
                  onChange={(e) => setProductChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 5. PENILAIAN DIRI KELOMPOK (6 ASPEK)                           */}
        {/* ============================================================== */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '1.3rem' }}>⭐</span>
            <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>
              5. Penilaian Diri Kolaboratif Kelompok (Self-Assessment)
            </strong>
          </div>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: '#64748B' }}>
            Evaluasi proses kerja dan hasil investigasi tim kalian secara jujur:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {[
              { id: 'calibratedTool', text: '(a) Alat terkalibrasi dan tiga ulangan air murni mirip' },
              { id: 'freezingPointMethod', text: '(b) Titik beku ditentukan dengan cara yang tepat (plateau/titik belok)' },
              { id: 'rangeErrorAnalysis', text: '(c) Rentang ulangan dan galat dihitung serta ditafsirkan' },
              { id: 'completeGraphLabels', text: '(d) Grafik memiliki judul, sumbu berlabel, satuan, dan garis tren' },
              { id: 'particleConnection', text: '(e) Penjelasan menghubungkan data dengan perilaku partikel' },
              { id: 'teamContribution', text: '(f) Semua anggota tim ikut berperan aktif' }
            ].map((item) => (
              <div key={item.id} style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <span style={{ display: 'block', fontSize: '0.85rem', color: '#1E293B', fontWeight: 600, marginBottom: '0.4rem' }}>
                  {item.text}
                </span>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.84rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`self_${item.id}`}
                      checked={selfAssessment[item.id] === 'Sudah baik'}
                      onChange={() => setSelfAssessment((prev) => ({ ...prev, [item.id]: 'Sudah baik' }))}
                    />
                    <span style={{ color: '#15803D', fontWeight: 700 }}>✓ Sudah baik</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name={`self_${item.id}`}
                      checked={selfAssessment[item.id] === 'Perlu diperbaiki'}
                      onChange={() => setSelfAssessment((prev) => ({ ...prev, [item.id]: 'Perlu diperbaiki' }))}
                    />
                    <span style={{ color: '#B45309', fontWeight: 700 }}>⚠️ Perlu diperbaiki</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#0F172A', marginBottom: '0.3rem' }}>
              Hal yang paling kami pelajari dari misi proyek ini:
            </label>
            <textarea
              rows={2}
              value={biggestLesson}
              onChange={(e) => setBiggestLesson(e.target.value)}
              placeholder="Refleksikan wawasan ilmiah atau keterampilan teknologi Arduino terpenting yang kalian peroleh..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.92rem',
                fontFamily: "'Times New Roman', Times, serif",
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* 6. KUIS SINGKAT PENUTUP (5 SOAL PILIHAN GANDA)                  */}
        {/* ============================================================== */}
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>📝</span>
              <strong style={{ fontSize: '1.08rem', color: '#0369A1' }}>
                6. Kuis Singkat Uji Pemahaman Lab (5 Soal)
              </strong>
            </div>
            <span style={{ fontSize: '0.82rem', background: '#DBEAFE', color: '#1E40AF', padding: '0.25rem 0.65rem', borderRadius: '9999px', fontWeight: 700 }}>
              Terjawab: {Object.keys(quizAnswers).length} / {QUIZ_QUESTIONS.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {QUIZ_QUESTIONS.map((q, idx) => {
              const selected = quizAnswers[q.id];
              const isChecked = Boolean(quizChecked[q.id]);
              const chosenOption = q.options.find((o) => o.key === selected);
              const isCorrect = chosenOption?.isCorrect;

              return (
                <div key={q.id} style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1rem', border: '1px solid #BAE6FD' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#0F172A', marginBottom: '0.65rem' }}>
                    {idx + 1}. {q.question}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '0.75rem' }}>
                    {q.options.map((opt) => (
                      <label
                        key={opt.key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '8px',
                          border: selected === opt.key ? '2px solid #0284C7' : '1px solid #E2E8F0',
                          background: selected === opt.key ? '#EFF6FF' : '#F8FAFC',
                          cursor: 'pointer',
                          fontSize: '0.88rem'
                        }}
                      >
                        <input
                          type="radio"
                          name={`quiz_${q.id}`}
                          checked={selected === opt.key}
                          onChange={() => handleSelectQuizOption(q.id, opt.key)}
                        />
                        <span><strong>{opt.key}.</strong> {opt.text}</span>
                      </label>
                    ))}
                  </div>

                  {selected && !isChecked && (
                    <button
                      type="button"
                      onClick={() => handleCheckQuizAnswer(q.id)}
                      style={{
                        padding: '0.4rem 0.85rem',
                        background: '#0284C7',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Periksa Jawaban Soal Ini
                    </button>
                  )}

                  {isChecked && (
                    <div style={{
                      marginTop: '0.65rem',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: isCorrect ? '#F0FDF4' : '#FEF2F2',
                      border: `1px solid ${isCorrect ? '#BBF7D0' : '#FECACA'}`,
                      fontSize: '0.86rem',
                      lineHeight: 1.5
                    }}>
                      <div style={{ fontWeight: 700, color: isCorrect ? '#166534' : '#991B1B', marginBottom: '0.2rem' }}>
                        {isCorrect ? '✅ Jawaban Tepat!' : '❌ Jawaban Kurang Tepat!'}
                      </div>
                      <div style={{ color: '#334155' }}>
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 7. KOTAK PEMBAHASAN KOMPREHENSIF                               */}
        {/*    (Muncul HANYA setelah disimpan & TAMPILKAN_PEMBAHASAN = true) */}
        {/* ============================================================== */}
        {TAMPILKAN_PEMBAHASAN && hasSavedOnce && (
          <div style={{
            background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
            border: '2px solid #86EFAC',
            borderRadius: '16px',
            padding: '1.4rem',
            marginBottom: '1.5rem',
            boxShadow: '0 6px 18px rgba(16, 185, 129, 0.15)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📘</span>
              <strong style={{ fontSize: '1.15rem', color: '#166534' }}>
                Pembahasan Ilmiah Resmi Misi Titik Beku (LKPD Fase 4)
              </strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem', color: '#1E293B', lineHeight: 1.6 }}>
              {/* Pembahasan Prediksi */}
              <div style={{ background: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <strong style={{ color: '#047857', display: 'block', marginBottom: '0.25rem' }}>
                  📌 Pembahasan Aktivitas 1.1 (Prediksi Titik Beku):
                </strong>
                <p style={{ margin: 0 }}>
                  Urutan titik beku yang benar adalah <strong>NaCl 1 m (paling rendah, -3,72°C)</strong> &lt; <strong>Gula 1 m (tengah, -1,86°C)</strong> &lt; <strong>Air murni (paling tinggi, 0,00°C)</strong>.
                  Hal ini terjadi karena NaCl terurai sempurna menjadi 2 ion (Na⁺ dan Cl⁻, faktor $i \approx 2$), sehingga jumlah partikel efektifnya dua kali lebih banyak daripada sukrosa (nonelektrolit, $i = 1$).
                </p>
              </div>

              {/* Pembahasan 1a */}
              <div style={{ background: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <strong style={{ color: '#047857', display: 'block', marginBottom: '0.25rem' }}>
                  📌 Pembahasan Pertanyaan 1a (Plateau vs Kurva Landai):
                </strong>
                <p style={{ margin: 0 }}>
                  Es kristal yang terbentuk pada pembekuan adalah es air murni ($H_2O$), sehingga zat terlarut (gula/garam) tertinggal di fasa cair yang belum membeku. Akibatnya, molalitas larutan sisa <strong>semakin meningkat seiring berjalannya pembekuan</strong>, menyebabkan titik beku cairan sisa terus bergeser turun lebih dalam. Inilah mengapa kurva pendinginan larutan terus menurun landai dan tidak pernah mendatar sempurna seperti air murni.
                </p>
              </div>

              {/* Pembahasan 1b */}
              <div style={{ background: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <strong style={{ color: '#047857', display: 'block', marginBottom: '0.25rem' }}>
                  📌 Pembahasan Pertanyaan 1b (Prediksi CaCl₂ 1 m):
                </strong>
                <p style={{ margin: 0 }}>
                  Kalsium klorida terdisosiasi menurut reaksi: CaCl₂ → Ca²⁺ + 2Cl⁻. Jumlah ion terdisosiasi adalah 3 (n = 3, i ≈ 3).
                  Maka ΔTf = 1,86 × 1 × 3 = 5,58°C, sehingga titik bekunya sekitar <strong>-5,58°C</strong>. Kurva pendinginan CaCl₂ 1 m akan berada jauh lebih rendah di bawah kurva NaCl 1 m.
                </p>
              </div>

              {/* Pembahasan 2 */}
              <div style={{ background: '#FFFFFF', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                <strong style={{ color: '#047857', display: 'block', marginBottom: '0.25rem' }}>
                  📌 Pembahasan Pertanyaan 2 (Uji Model & Galat Pengukuran):
                </strong>
                <p style={{ margin: 0 }}>
                  Dalam metode ilmiah, siswa menimbang rentang antar-ulangan (galat acak sistem) terhadap selisih nilai eksperimen dari teori. Pada konsentrasi 1 m, interaksi elektrostatik antar-ion Na⁺ dan Cl⁻ cukup kuat (pasangan ion), sehingga faktor van &apos;t Hoff nyata NaCl adalah sekitar <strong>1,81 - 1,87</strong> (bukan tepat 2,0). Namun jika rentang ulangan alat lebih besar daripada selisih tersebut, kesimpulan <em>&ldquo;belum bisa dipastikan&rdquo;</em> adalah jawaban ilmiah yang paling jujur dan tepat.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* Footer Navigasi & Selesaikan Praktikum                         */}
        {/* ============================================================== */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #E2E8F0'
        }}>
          {onPrevStage && (
            <Button
              variant="secondary"
              onClick={onPrevStage}
              style={{ padding: '0.65rem 1.15rem', fontSize: '0.92rem' }}
            >
              ← Kembali ke Tahap 5
            </Button>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isSavedFeedback && (
              <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}>
                ✓ Tahap 6 Tuntas (+20 XP, Seluruh Lab Virtual Selesai!)
              </span>
            )}
            {isCompleted && !isSavedFeedback && (
              <span style={{ color: '#059669', fontSize: '0.9rem', fontWeight: 600 }}>
                🏆 Lab Virtual Telah Selesai (+120 XP Total)
              </span>
            )}

            <Button
              variant="secondary"
              onClick={handleSaveProgress}
              style={{ padding: '0.65rem 1rem', fontSize: '0.92rem' }}
            >
              💾 Simpan Draf Refleksi
            </Button>

            <Button
              variant="primary"
              onClick={handleCompleteStage6}
              style={{
                padding: '0.85rem 1.6rem',
                fontSize: '1rem',
                fontWeight: 700,
                background: '#059669',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
              }}
            >
              {isCompleted ? '✓ Simpan Pembaruan Tahap 6' : '🏆 Selesaikan Seluruh Lab & Buka Kuis Akhir (+20 XP) →'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
