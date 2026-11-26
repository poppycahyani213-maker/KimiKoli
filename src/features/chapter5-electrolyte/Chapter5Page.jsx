import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import TripleRepresentation from '../../components/chemistry/TripleRepresentation';
import MisconceptionCard from '../../components/chemistry/MisconceptionCard';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';
import imgElektrolit from '../../assets/fenomena-elektrolit.jpg';

// Subkomponen modular Bab 5 (Alur 5E)
import DiagnosticTest from './DiagnosticTest';
import SimulatorElektrolit from './SimulatorElektrolit';
import ContohSoalBab5 from './ContohSoalBab5';
import LatihanSoalBab5 from './LatihanSoalBab5';
import { MISCONCEPTIONS_BAB5, REAL_WORLD_CONTEXTS_BAB5 } from './chapter5Data';

// Helper membuat kunci penyimpanan progres Bab 5 per akun siswa (selaras dengan Bab 1)
function getCh5StorageKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch5_requirements_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch5_requirements_v1_guest';
}

export default function Chapter5Page({ onComplete, isCompleted }) {
  // Mode Tampilan: Stepper 5E Bertahap vs Tampilkan Seluruh Halaman
  const [activePhase, setActivePhase] = useState('engagement');
  const [isViewAll, setIsViewAll] = useState(false);

  // State Progres Per Fase Belajar 5E
  const [storageState, setStorageState] = useState(() => {
    const key = getCh5StorageKey();
    return getStoredData(key, {
      engagementDone: false,
      preDiagnosticAnswers: {},
      explorationDone: false,
      explanationDone: false,
      elaborationDone: false,
      exerciseDone: false,
      exerciseDetails: { score: 0, total: 8, percentage: 0 },
      postTestDone: false,
      postTestAnswers: {}
    });
  });

  // Sinkronisasi jika bab berstatus isCompleted
  useEffect(() => {
    if (isCompleted) {
      setStorageState(prev => ({
        ...prev,
        engagementDone: true,
        explorationDone: true,
        explanationDone: true,
        elaborationDone: true,
        exerciseDone: true,
        postTestDone: true
      }));
    }
  }, [isCompleted]);

  // Helper simpan perubahan ke localStorage
  const updateStorage = (updates) => {
    setStorageState(prev => {
      const next = { ...prev, ...updates };
      const key = getCh5StorageKey();
      setStoredData(key, next);
      return next;
    });
  };

  // ── Handler Fase 1: Engagement (Uji Diagnostik Awal) ──
  const handlePreDiagnosticComplete = (answers) => {
    updateStorage({
      engagementDone: true,
      preDiagnosticAnswers: answers
    });
    // Pindah ke eksplorasi secara halus
    handleSwitchPhase('exploration');
  };

  // ── Handler Fase 2: Exploration (Simulator Selesai) ──
  const handleExplorationComplete = () => {
    updateStorage({ explorationDone: true });
    handleSwitchPhase('explanation');
  };

  // ── Handler Fase 3: Explanation Selesai ──
  const handleExplanationComplete = () => {
    updateStorage({ explanationDone: true });
    handleSwitchPhase('elaboration');
  };

  // ── Handler Fase 4: Elaboration Selesai ──
  const handleElaborationComplete = () => {
    updateStorage({ elaborationDone: true });
    handleSwitchPhase('evaluation');
  };

  // ── Handler Fase 5: Latihan Soal Lulus (≥ 75%) ──
  const handleExercisePass = (evalDetails) => {
    updateStorage({
      exerciseDone: true,
      exerciseDetails: {
        score: evalDetails.score,
        total: evalDetails.total,
        percentage: evalDetails.percentage
      }
    });
  };

  // ── Handler Fase 5: Post-Test Selesai ──
  const handlePostTestComplete = (answers) => {
    updateStorage({
      postTestDone: true,
      postTestAnswers: answers
    });
  };

  // Pindah fase dengan auto-scroll halus ke area atas konten
  const handleSwitchPhase = (phaseId) => {
    setActivePhase(phaseId);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Syarat membuka tombol penyelesaian bab 5:
  // Latihan soal minimal 75% DAN eksplorasi + diagnostik telah diselesaikan
  const isReadyToComplete = (storageState.exerciseDone && storageState.postTestDone && storageState.explorationDone) || isCompleted;

  // Definisi 5 Fase Learning Cycle 5E
  const PHASES_5E = [
    {
      id: 'engagement',
      number: 1,
      label: '1. Engagement',
      sublabel: 'Fenomena & Diagnostik',
      icon: '💡',
      done: storageState.engagementDone
    },
    {
      id: 'exploration',
      number: 2,
      label: '2. Exploration',
      sublabel: 'Lab Simulasi van \'t Hoff',
      icon: '🔬',
      done: storageState.explorationDone
    },
    {
      id: 'explanation',
      number: 3,
      label: '3. Explanation',
      sublabel: 'Konsep, Rumus & Miskonsepsi',
      icon: '📖',
      done: storageState.explanationDone
    },
    {
      id: 'elaboration',
      number: 4,
      label: '4. Elaboration',
      sublabel: 'Contoh Soal & Konteks Nyata',
      icon: '⚡',
      done: storageState.elaborationDone
    },
    {
      id: 'evaluation',
      number: 5,
      label: '5. Evaluation',
      sublabel: 'Latihan Soal & Post-Test',
      icon: '📝',
      done: storageState.exerciseDone && storageState.postTestDone
    }
  ];

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* ══════════════════════════════════════════════════════
          1. HEADER MINIMALIS & STEPPER ALUR LEARNING CYCLE 5E
          ══════════════════════════════════════════════════════ */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '1.35rem 1.6rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
      }}>
        {/* Baris Atas: Badge & Toggle Mode */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant="blue">Bab 5 • Larutan Elektrolit & Faktor van 't Hoff</Badge>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
              (Alur Belajar Siklus 5E • Tahap 5 dari 6 Misi Belajar)
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsViewAll(!isViewAll)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: isViewAll ? '#0284C7' : '#F8FAFC',
              color: isViewAll ? '#FFFFFF' : '#475569',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s',
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            <span>{isViewAll ? '📑 Beralih ke Mode Bertahap 5E' : '📜 Tampilkan Seluruh Bab'}</span>
          </button>
        </div>

        {/* Judul & Deskripsi Utama */}
        <h2 style={{ marginTop: '0.65rem', marginBottom: '0.3rem', fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
          Sifat Koligatif Larutan Elektrolit & Faktor van 't Hoff
        </h2>
        <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.5 }}>
          Karena zat elektrolit terurai menjadi partikel ion bebas, jumlah partikel pelipatgandaan menaikkan titik didih dan menurunkan titik beku larutan secara berlipat!
        </p>

        {/* STEPPER NAVIGASI 5E */}
        {!isViewAll && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: '0.5rem',
            marginTop: '1.25rem',
            background: '#F8FAFC',
            padding: '0.4rem',
            borderRadius: '12px',
            border: '1px solid #E2E8F0'
          }}>
            {PHASES_5E.map((ph) => {
              const isActive = activePhase === ph.id;
              return (
                <button
                  key={ph.id}
                  type="button"
                  onClick={() => handleSwitchPhase(ph.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    border: 'none',
                    borderRadius: '9px',
                    background: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? '#0284C7' : '#64748B',
                    boxShadow: isActive ? '0 2px 8px rgba(15, 23, 42, 0.08)' : 'none',
                    borderLeft: isActive ? '3.5px solid #0284C7' : '3.5px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '1.05rem' }}>{ph.icon}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: isActive ? 800 : 700 }}>
                        {ph.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: isActive ? '#0369A1' : '#94A3B8', marginTop: '0.1rem', paddingLeft: '1.45rem' }}>
                      {ph.sublabel}
                    </div>
                  </div>
                  {ph.done && (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#059669',
                      background: '#ECFDF5',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '6px'
                    }}>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          FASE 1: ENGAGEMENT (KETERLIBATAN)
          ══════════════════════════════════════════════════════ */}
      {(isViewAll || activePhase === 'engagement') && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          {/* Fenomena Pemantik Sehari-hari */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '16px',
            padding: '1.4rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.3rem' }}>💡</span>
              <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>
                Fenomena Pemantik: Mengapa Garam, Bukan Gula?
              </strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.98rem', color: '#334155', lineHeight: 1.65 }}>
                  Di negara-negara bersalju, saat badai musim dingin membekukan jalan raya menjadi lapisan es licin berbahaya, truk-truk dinas kebersihan menyemprotkan ribuan ton <strong>garam dapur (NaCl)</strong> atau <strong>kalsium klorida (CaCl₂)</strong> ke permukaan jalan, bukan gula pasir atau zat lainnya.
                </p>
                <p style={{ margin: 0, fontSize: '0.98rem', color: '#334155', lineHeight: 1.65 }}>
                  Mengapa penambahan 1 mol garam dapur mampu mencairkan es jauh lebih cepat dan membuat air membeku pada suhu yang hampir <strong>dua kali lipat lebih dingin</strong> dibanding 1 mol gula pasir, padahal keduanya sama-sama dilarutkan ke dalam volume air yang sama? Apa rahasia di balik perilaku partikel senyawa elektrolit ini?
                </p>
              </div>

              {imgElektrolit && (
                <div style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #CBD5E1',
                  maxHeight: '220px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#F8FAFC'
                }}>
                  <img
                    src={imgElektrolit}
                    alt="Fenomena Larutan Elektrolit"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Uji Diagnostik Pra-Konsepsi Awal (4 Soal Bebas Nilai) */}
          <DiagnosticTest
            mode="pre"
            initialAnswers={storageState.preDiagnosticAnswers}
            onComplete={handlePreDiagnosticComplete}
          />

          {/* Tombol Lanjut ke Fase 2 */}
          {!isViewAll && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <Button
                variant="primary"
                onClick={() => handleSwitchPhase('exploration')}
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.98rem', fontWeight: 700 }}
              >
                Lanjut ke Fase 2: Laboratorium Eksplorasi (Exploration) →
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          FASE 2: EXPLORATION (EKSPLORASI INTERAKTIF)
          ══════════════════════════════════════════════════════ */}
      {(isViewAll || activePhase === 'exploration') && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          {/* Simulator Interaktif yang Disempurnakan (dengan slider molalitas, ΔTf, zat nyata, POPE) */}
          <SimulatorElektrolit onSelesaiEksplorasi={handleExplorationComplete} />

          {!isViewAll && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => handleSwitchPhase('engagement')}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'Times New Roman', Times, serif" }}
              >
                ← Kembali ke Fase 1 (Engagement)
              </button>
              <Button
                variant="primary"
                onClick={() => handleSwitchPhase('explanation')}
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.98rem', fontWeight: 700 }}
              >
                Lanjut ke Fase 3: Penjelasan Konsep (Explanation) →
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          FASE 3: EXPLANATION (PENJELASAN KONSEP & FORMULA)
          ══════════════════════════════════════════════════════ */}
      {(isViewAll || activePhase === 'explanation') && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          {/* C. PEDAGOGIS: TIGA LEVEL REPRESENTASI KIMIA (4 TODO TELAH DIISI PENUH) */}
          <TripleRepresentation
            title="Tiga Level Representasi Kimia"
            conceptName="Larutan Elektrolit & Faktor van 't Hoff"
            macroscopic={{
              title: "Pengamatan Sehari-hari: Garam Dapur vs Gula Pasir & Cairan Oralit",
              image: imgElektrolit,
              description: "Jika melarutkan 1 mol NaCl (garam dapur) dan 1 mol C₆H₁₂O₆ (gula) masing-masing ke dalam 1 kg air murni, larutan garam akan mendidih pada suhu yang jauh lebih tinggi dan membeku pada suhu yang hampir dua kali lipat lebih dingin daripada larutan gula.",
              observations: [
                "Penurunan titik beku larutan garam NaCl 1 m adalah sekitar −3,72 °C (ideal), sedangkan larutan gula 1 m hanya sekitar −1,86 °C",
                "Larutan elektrolit dapat menghantarkan arus listrik (lampu menyala pada uji daya hantar listrik)",
                "Kekuatan sifat koligatif elektrolit bergantung pada jumlah ion per molekul (n) dan derajat ionisasinya (α)",
                "Studi Kasus Cairan Rehidrasi Oral (Oralit): Larutan oralit memadukan garam elektrolit (NaCl, KCl, trisodium sitrat) dan glukosa dengan osmolaritas terukur (~245 mOsm/L). Adanya ion Na⁺ memicu kotranspor glukosa-natrium oleh protein SGLT1 di usus halus, menyerap cairan 25× lebih cepat dibanding meminum air murni atau air gula biasa!"
              ]
            }}
            submicroscopic={{
              title: "Skala Partikulat: Disosiasi Ion & Hidrasi Kisi Kristal oleh Dipol Air",
              description: "Molekul gula C₆H₁₂O₆ adalah nonelektrolit; saat larut, molekulnya tetap utuh sebagai 1 partikel. Sebaliknya, garam NaCl saat dimasukkan ke dalam air akan ditarik oleh molekul air dan terdisosiasi sempurna menjadi ion Na⁺ dan ion Cl⁻.",
              mechanism: "Mekanisme Hidrasi Kristal: Molekul air memiliki kutub dipol (atom oksigen bermuatan parsial negatif δ⁻ dan atom hidrogen bermuatan parsial positif δ⁺). Ujung δ⁻ molekul air mengelilingi ion Na⁺, sementara ujung δ⁺ mengelilingi ion Cl⁻. Gaya tarik ion-dipol yang kuat ini meruntuhkan kisi kristal padat dan membebaskan ion-ion menjadi partikel kinetik mandiri. Karena setiap 1 unit rumus NaCl menghasilkan 2 partikel ion bebas, jumlah partikel penghalang di permukaan cairan maupun perintang kristalisasi kisi es menjadi 2 kali lipat lebih banyak. Inilah alasan sifat koligatif larutan elektrolit dikalikan dengan faktor pengali van 't Hoff (i)."
            }}
            symbolic={{
              title: "Persamaan Faktor van 't Hoff & Sifat Koligatif Elektrolit",
              formula: "i = 1 + (n − 1)α",
              formulaAlt: "ΔP = Xt × P° × i   |   ΔTb = Kb × m × i   |   ΔTf = Kf × m × i   |   π = M × R × T × i",
              variables: [
                { symbol: "i", desc: "Faktor van 't Hoff (rasio pelipatgandaan jumlah partikel nyata terhadap mol awal)", unit: "Tanpa satuan (i ≥ 1)" },
                { symbol: "n", desc: "Jumlah ion yang dihasilkan dari disosiasi 1 unit rumus zat terlarut", unit: "Bilangan bulat (NaCl = 2, CaCl₂ = 3, FeCl₃ = 4)" },
                { symbol: "α", desc: "Derajat ionisasi / disosiasi zat terlarut (0 ≤ α ≤ 1)", unit: "Tanpa satuan (Elektrolit kuat α = 1, Nonelektrolit α = 0)" },
                { symbol: "m", desc: "Molalitas larutan", unit: "mol/kg (m)" },
                { symbol: "Kb / Kf", desc: "Tetapan didih molal (Air = 0,52) / tetapan beku molal (Air = 1,86)", unit: "°C·kg/mol" },
                { symbol: "π", desc: "Tekanan osmotik larutan elektrolit", unit: "atm (R = 0,082 L·atm/mol·K)" }
              ],
              note: "Tabel Perbandingan n dan i: (1) Nonelektrolit (Glukosa, Urea): n = 1, α = 0 → i = 1. (2) Elektrolit Kuat Biner (NaCl): n = 2, α = 1 → i = 2. (3) Elektrolit Kuat Terner (CaCl₂): n = 3, α = 1 → i = 3. (4) Elektrolit Lemah (Asam Cuka CH₃COOH): n = 2, α ≈ 0,05 → i = 1 + (2−1)(0,05) = 1,05."
            }}
          />

          {/* RUMUS UTAMA & KARTU PENJELAS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
            <Card title="Faktor van 't Hoff (i) & Derajat Ionisasi (α)">
              <p style={{ lineHeight: 1.65, fontSize: '0.96rem', color: '#334155' }}>
                Zat elektrolit mengalami penguraian ionik menjadi <strong>n ion</strong>. Derajat ionisasi dinyatakan dengan <strong>α</strong> (0 untuk nonelektrolit hingga 1 untuk elektrolit kuat).
              </p>
              <FormulaRenderer
                formula={<span>i = 1 + (n − 1)α</span>}
                description="Rumus Umum Faktor van 't Hoff"
              />
              <FormulaRenderer
                formula={<span>ΔT<sub>b</sub> = K<sub>b</sub> × m × i   &amp;   ΔT<sub>f</sub> = K<sub>f</sub> × m × i</span>}
                description="Kenaikan Titik Didih & Penurunan Titik Beku Elektrolit"
              />
            </Card>

            <Card title="Penurunan Tekanan Uap & Tekanan Osmotik Elektrolit">
              <p style={{ lineHeight: 1.65, fontSize: '0.96rem', color: '#334155' }}>
                Faktor van 't Hoff juga berlaku universal pada hukum Raoult dan hukum gas ideal osmotik:
              </p>
              <FormulaRenderer
                formula={<span>ΔP = X<sub>t</sub> × P° × i   (atau fraksi mol ion total)</span>}
                description="Penurunan Tekanan Uap Jenuh (Hukum Raoult Elektrolit)"
              />
              <FormulaRenderer
                formula={<span>π = M × R × T × i</span>}
                description="Persamaan Tekanan Osmotik van 't Hoff"
              />
            </Card>
          </div>

          {/* 5 MISKONSEPSI UMUM BAB 5 (DIKONFRONTASI DENGAN HASIL EKSPLORASI) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '1.3rem' }}>⚠️</span>
              <strong style={{ fontSize: '1.1rem', color: '#92400E' }}>
                Konfrontasi Miskonsepsi: Fakta Ilmiah vs Mitos yang Sering Salah Dipahami
              </strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {MISCONCEPTIONS_BAB5.map((misc, mIdx) => (
                <MisconceptionCard
                  key={mIdx}
                  badge={misc.badge}
                  myth={misc.myth}
                  fact={misc.fact}
                  explanation={misc.explanation}
                />
              ))}
            </div>
          </div>

          {!isViewAll && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => handleSwitchPhase('exploration')}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'Times New Roman', Times, serif" }}
              >
                ← Kembali ke Fase 2 (Exploration)
              </button>
              <Button
                variant="primary"
                onClick={handleExplanationComplete}
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.98rem', fontWeight: 700 }}
              >
                Lanjut ke Fase 4: Elaborasi & Konteks Nyata (Elaboration) →
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          FASE 4: ELABORATION (ELABORASI & PENERAPAN NYATA)
          ══════════════════════════════════════════════════════ */}
      {(isViewAll || activePhase === 'elaboration') && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          {/* 1. Contoh Soal Terbimbing Bertahap (2 Butir) */}
          <ContohSoalBab5 />

          {/* 2. Konteks Nyata Dunia Sains & Teknologi */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '16px',
            padding: '1.4rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🌍</span>
              <strong style={{ fontSize: '1.1rem', color: '#0F172A' }}>
                Konteks Nyata & Penerapan Teknologi Sifat Koligatif Elektrolit
              </strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {REAL_WORLD_CONTEXTS_BAB5.map((ctx) => (
                <div
                  key={ctx.id}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.5rem' }}>{ctx.icon}</span>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        background: '#EFF6FF',
                        color: '#0284C7',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '6px'
                      }}>
                        {ctx.badge}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: '#0F172A', fontWeight: 800 }}>
                      {ctx.title}
                    </h4>

                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#475569', fontStyle: 'italic', lineHeight: 1.5 }}>
                      "{ctx.summary}"
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
                      {ctx.explanation.map((par, pIdx) => (
                        <div key={pIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                          <span style={{ color: '#0284C7', fontWeight: 800 }}>•</span>
                          <span>{par}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!isViewAll && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => handleSwitchPhase('explanation')}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'Times New Roman', Times, serif" }}
              >
                ← Kembali ke Fase 3 (Explanation)
              </button>
              <Button
                variant="primary"
                onClick={handleElaborationComplete}
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.98rem', fontWeight: 700 }}
              >
                Lanjut ke Fase 5: Evaluasi & Ujian Akhir (Evaluation) →
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          FASE 5: EVALUATION (EVALUASI MANDIRI & POST-TEST)
          ══════════════════════════════════════════════════════ */}
      {(isViewAll || activePhase === 'evaluation') && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          {/* 1. Latihan Soal Pemahaman Mandiri Bab 5 (6 Numerik + 2 PG + 1 Refleksi, KKM 75%) */}
          <LatihanSoalBab5
            onLatihanLulus={handleExercisePass}
            savedState={{
              answers: storageState.savedAnswers,
              status: storageState.savedStatus,
              refleksi: storageState.savedRefleksi,
              refleksiSubmitted: Boolean(storageState.savedRefleksi),
              showSummary: storageState.exerciseDone,
              passed: storageState.exerciseDone
            }}
          />

          {/* 2. Post-Test Diagnostik & Analisis Perubahan Konsep Pre vs Post */}
          <DiagnosticTest
            mode="post"
            initialAnswers={storageState.postTestAnswers}
            preAnswers={storageState.preDiagnosticAnswers}
            onComplete={handlePostTestComplete}
          />

          {/* 3. KOTAK KELULUSAN BAB 5 & PEMBUKA LABORATORIUM VIRTUAL */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#FFFFFF',
            border: isReadyToComplete ? '2px solid #86EFAC' : '1px solid #E2E8F0',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
          }}>
            <div>
              <span style={{
                fontSize: '0.85rem',
                color: isCompleted ? '#10B981' : isReadyToComplete ? '#059669' : '#D97706',
                fontWeight: 700
              }}>
                {isCompleted
                  ? '✓ Materi Bab 5 Selesai'
                  : isReadyToComplete
                    ? '🎉 Target Lulus Siklus 5E Terpenuhi! Siap Klaim XP'
                    : 'Target Kelulusan Bab 5 (Klaim +XP & Rekap Guru):'}
              </span>
              <h4 style={{ margin: '0.2rem 0 0', color: '#0F172A', fontSize: '1.15rem', fontWeight: 800 }}>
                Bab 5: Sifat Koligatif Larutan Elektrolit &amp; Faktor van 't Hoff
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              {/* Checklist Indikator Real-time */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontSize: '0.85rem',
                background: isReadyToComplete ? '#ECFDF5' : '#F8FAFC',
                border: isReadyToComplete ? '1px solid #A7F3D0' : '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.4rem 0.85rem',
                flexWrap: 'wrap'
              }}>
                <span style={{
                  color: storageState.explorationDone ? '#16A34A' : '#64748B',
                  fontWeight: storageState.explorationDone ? 800 : 500
                }}>
                  {storageState.explorationDone ? '✓' : '○'} Lab Eksplorasi
                </span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{
                  color: storageState.exerciseDone ? '#16A34A' : '#64748B',
                  fontWeight: storageState.exerciseDone ? 800 : 500
                }}>
                  {storageState.exerciseDone ? '✓' : '○'} Latihan Mandiri ≥75% ({storageState.exerciseDetails?.percentage || 0}%)
                </span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{
                  color: storageState.postTestDone ? '#16A34A' : '#64748B',
                  fontWeight: storageState.postTestDone ? 800 : 500
                }}>
                  {storageState.postTestDone ? '✓' : '○'} Post-Test
                </span>
              </div>

              {/* Tombol Selesai Bersyarat */}
              <Button
                variant="primary"
                onClick={onComplete}
                disabled={!isReadyToComplete}
                style={{
                  padding: '0.85rem 1.8rem',
                  fontSize: '1.02rem',
                  fontWeight: 700,
                  background: isReadyToComplete ? '#0284C7' : '#94A3B8',
                  boxShadow: isReadyToComplete ? '0 4px 14px rgba(2, 132, 199, 0.25)' : 'none',
                  cursor: isReadyToComplete ? 'pointer' : 'not-allowed',
                  opacity: isReadyToComplete ? 1 : 0.65
                }}
                title={!isReadyToComplete ? "Lulus latihan soal minimal 75% dan selesaikan post-test untuk klaim kelulusan Bab 5" : "Tandai Selesai Bab 5"}
              >
                {isCompleted ? '✓ Bab 5 Selesai (Buka Lab Virtual →)' : (isReadyToComplete ? 'Selesaikan Bab 5 (+XP) & Buka Lab Virtual →' : 'Tuntaskan Latihan untuk Klaim XP')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
