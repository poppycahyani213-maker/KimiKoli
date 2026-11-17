import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import TripleRepresentation from '../../components/chemistry/TripleRepresentation';
import PrerequisiteRefresher from '../../components/chemistry/PrerequisiteRefresher';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';
import ContohSoalBab2 from './ContohSoalBab2';
import SimulatorUapDidih from './SimulatorUapDidih';
import LatihanSoalBab2 from './LatihanSoalBab2';
import imgTitikDidih from '../../assets/fenomena-titik-didih.jpg';

// Helper membuat kunci penyimpanan progres Bab 2 per akun siswa
function getCh2StorageKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch2_requirements_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch2_requirements_v1_guest';
}

export default function Chapter2Page({ onComplete, isCompleted }) {
  // Mode Navigasi Bertahap (Minimalis) vs Tampilkan Semua
  const [activeTab, setActiveTab] = useState('concept'); // 'concept' | 'examples' | 'simulation' | 'exercises'
  const [isViewAll, setIsViewAll] = useState(false);

  // State 1: Status Simulasi Telah Dilakukan
  const [isSimDone, setIsSimDone] = useState(() => {
    if (isCompleted) return true;
    const key = getCh2StorageKey();
    const saved = getStoredData(key, { isSimDone: false, isExerciseDone: false, exerciseScore: 0, exercisePercentage: 0 });
    return Boolean(saved?.isSimDone);
  });

  // State 2: Status Latihan Soal Minimal 80% Benar
  const [isExerciseDone, setIsExerciseDone] = useState(() => {
    if (isCompleted) return true;
    const key = getCh2StorageKey();
    const saved = getStoredData(key, { isSimDone: false, isExerciseDone: false, exerciseScore: 0, exercisePercentage: 0 });
    return Boolean(saved?.isExerciseDone);
  });

  const [exerciseDetails, setExerciseDetails] = useState(() => {
    const key = getCh2StorageKey();
    return getStoredData(key, { exerciseScore: 0, exerciseTotal: 6, exercisePercentage: 0 });
  });

  // Sinkronisasi jika bab berstatus isCompleted
  useEffect(() => {
    if (isCompleted) {
      setIsSimDone(true);
      setIsExerciseDone(true);
    }
  }, [isCompleted]);

  // Handler saat Simulasi berhasil dilakukan siswa
  const handleSimDone = () => {
    setIsSimDone(true);
    const key = getCh2StorageKey();
    const saved = getStoredData(key, {});
    setStoredData(key, { ...saved, isSimDone: true });
  };

  // Handler saat Latihan Soal dievaluasi (minimal 80% benar)
  const handleExerciseEvaluation = ({ score, total, percentage, isPassed, answers }) => {
    setIsExerciseDone(isPassed);
    setExerciseDetails({
      exerciseScore: score,
      exerciseTotal: total,
      exercisePercentage: percentage
    });

    const key = getCh2StorageKey();
    const saved = getStoredData(key, {});
    setStoredData(key, {
      ...saved,
      isExerciseDone: isPassed,
      exerciseScore: score,
      exerciseTotal: total,
      exercisePercentage: percentage,
      savedAnswers: answers
    });
  };

  const isReadyToProceed = (isSimDone && isExerciseDone) || isCompleted;

  // Navigasi pindah tahap dengan scroll halus ke atas
  const handleSwitchTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Definisi 4 Tahap Belajar Minimalis
  const STAGES = [
    { id: 'concept', number: 1, label: 'Konsep & Fenomena', icon: '💡', done: true },
    { id: 'examples', number: 2, label: 'Contoh Terbimbing', icon: '📖', done: true },
    { id: 'simulation', number: 3, label: 'Lab Simulasi', icon: '🔬', done: isSimDone },
    { id: 'exercises', number: 4, label: 'Latihan Soal', icon: '📝', done: isExerciseDone }
  ];

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* ══════════════════════════════════════════════════════
          1. HEADER MINIMALIS & STEPPER NAVIGASI
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
            <Badge variant="blue">Bab 2 • Tekanan Uap & Titik Didih</Badge>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
              (Tahap 2 dari 6 Misi Belajar)
            </span>
          </div>

          {/* Toggle Mode: Bertahap vs Semua */}
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
            <span>{isViewAll ? '📑 Beralih ke Mode Bertahap (Minimalis)' : '📜 Tampilkan Seluruh Bab'}</span>
          </button>
        </div>

        {/* Judul & Deskripsi Ringkas */}
        <h2 style={{ marginTop: '0.65rem', marginBottom: '0.3rem', fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
          Penurunan Tekanan Uap & Kenaikan Titik Didih
        </h2>
        <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.5 }}>
          Pelajari bagaimana kehadiran partikel zat terlarut menghalangi penguapan pelarut dan meningkatkan titik didih larutan.
        </p>

        {/* STEPPER TABS (4 TAHAP ALUR BELAJAR MINIMALIS) */}
        {!isViewAll && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '0.5rem',
            marginTop: '1.25rem',
            background: '#F8FAFC',
            padding: '0.35rem',
            borderRadius: '12px',
            border: '1px solid #E2E8F0'
          }}>
            {STAGES.map((stg) => {
              const isActive = activeTab === stg.id;
              return (
                <button
                  key={stg.id}
                  type="button"
                  onClick={() => handleSwitchTab(stg.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.9rem',
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', textAlign: 'left' }}>
                    <span style={{ fontSize: '1.1rem' }}>{stg.icon}</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 800 : 600 }}>
                      {stg.label}
                    </span>
                  </div>
                  {stg.done && (
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
          TAHAP 1: KONSEP & FENOMENA
          ══════════════════════════════════════════════════════ */}
      {(isViewAll || activeTab === 'concept') && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          {/* Modul Penyegar Prasyarat (Collapsible Ramping) */}
          <div style={{ marginBottom: '1.25rem' }}>
            <PrerequisiteRefresher isOpenDefault={false} />
          </div>

          {/* Kartu Miskonsepsi Minimalis (Desain Bersih & Elegan) */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #FDE68A',
            borderLeft: '5px solid #F59E0B',
            borderRadius: '14px',
            padding: '1.15rem 1.35rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>💡</span>
              <strong style={{ fontSize: '0.98rem', color: '#92400E' }}>
                Fakta Ilmiah vs Mitos Sehari-hari:
              </strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
              <div style={{ background: '#FFF1F2', padding: '0.75rem', borderRadius: '8px', border: '1px solid #FECDD3' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#BE123C', textTransform: 'uppercase' }}>
                  ❌ Miskonsepsi yang Sering Dipercaya:
                </span>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.92rem', color: '#881337', fontWeight: 600 }}>
                  "Menaburkan garam ke dalam panci membuat air mendidih lebih cepat."
                </p>
              </div>

              <div style={{ background: '#ECFDF5', padding: '0.75rem', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>
                  ✓ Fakta Ilmiah yang Terbukti:
                </span>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.92rem', color: '#064E3B' }}>
                  Penambahan garam justru <strong>menaikkan titik didih air (di atas 100°C)</strong>. Makanan lebih cepat matang karena air mendidih pada suhu lebih tinggi (102°C–105°C), bukan karena air mendidih lebih awal.
                </p>
              </div>
            </div>
          </div>

          {/* C. TIGA LEVEL REPRESENTASI KIMIA (DENGAN VISUAL 3D PARTIKEL) */}
          <TripleRepresentation
            title="Tiga Level Representasi Kimia"
            conceptName="Tekanan Uap (ΔP) & Titik Didih (ΔTb)"
            macroscopic={{
              title: "Pengamatan Sehari-hari: Air Mendidih di Dapur",
              image: imgTitikDidih,
              description: "Saat memasak sayur atau sup, air yang sudah diberi garam dapur butuh waktu pemanasan lebih lama untuk mendidih dibandingkan air murni, dan suhunya terukur di atas 100°C.",
              observations: [
                "Gelembung uap air pada air garam terbentuk pada suhu lebih tinggi (> 100°C pada 1 atm)",
                "Pemanasan yang lebih panas membuat bahan makanan di dalam kuah matang lebih cepat dan empuk",
                "Saat tutup panci dibuka, uap air yang mengembun di tutup panci adalah air murni (garam tetap berada di dalam panci)"
              ]
            }}
            submicroscopic={{
              title: "Skala Partikulat: Hambatan Permukaan Cairan",
              description: "Pada pelarut murni, seluruh permukaan cairan terbuka untuk penguapan molekul air. Namun pada larutan, sebagian luas permukaan ditempati oleh molekul zat terlarut nonvolatil.",
              mechanism: "Partikel zat terlarut yang sukar menguap menghalangi molekul air untuk meloncat lepas ke fase gas. Akibatnya, tekanan uap jenuh larutan menurun. Agar tekanan uap larutan dapat menyamai tekanan udara luar (syarat mendidih), energi kinetik rata-rata partikel harus dinaikkan dengan menaikkan suhu ke titik yang lebih tinggi (ΔTb naik)."
            }}
            symbolic={{
              title: "Persamaan Hukum Raoult & Kenaikan Titik Didih",
              formula: "ΔP = Xt × P°   |   P = Xp × P°",
              formulaAlt: "ΔTb = Kb × m × i   |   Tb = Tb° + ΔTb",
              variables: [
                { symbol: "ΔP", desc: "Penurunan tekanan uap jenuh", unit: "mmHg atau atm" },
                { symbol: "P°", desc: "Tekanan uap jenuh pelarut murni", unit: "mmHg atau atm" },
                { symbol: "P", desc: "Tekanan uap jenuh larutan (P < P°)", unit: "mmHg atau atm" },
                { symbol: "Xt", desc: "Fraksi mol zat terlarut", unit: "Tanpa satuan" },
                { symbol: "ΔTb", desc: "Kenaikan titik didih larutan", unit: "°C atau Kelvin" },
                { symbol: "Kb", desc: "Tetapan kenaikan titik didih molal pelarut (Air = 0,52)", unit: "°C·kg/mol (°C/m)" },
                { symbol: "m", desc: "Molalitas larutan", unit: "mol/kg (m)" },
                { symbol: "i", desc: "Faktor van 't Hoff (i = 1 untuk nonelektrolit)", unit: "Tanpa satuan" },
                { symbol: "Tb", desc: "Titik didih larutan (Tb° = 100°C untuk air)", unit: "°C" }
              ],
              note: "Hukum Raoult ΔP = Xt × P° berlaku ketat untuk zat terlarut nonvolatil (sukar menguap). Nilai Kb hanya bergantung pada jenis pelarut, bukan jenis zat terlarut."
            }}
          />

          {/* Kartu Ringkas Rumus & Jembatan van 't Hoff */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '1.35rem',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <span style={{ fontSize: '1.25rem' }}>⚡</span>
              <div>
                <strong style={{ fontSize: '1.05rem', color: '#0F172A', display: 'block' }}>
                  Jembatan Konsep: Pengaruh Jumlah Partikel (Faktor van 't Hoff)
                </strong>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Sifat koligatif hanya memedulikan kuantitas partikel bebas di dalam pelarut.
                </span>
              </div>
            </div>

            {/* Tabel Minimalis Modern */}
            <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#334155' }}>Zat Terlarut (0,1 m)</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'left', color: '#334155' }}>Penguraian Ion</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'center', color: '#334155' }}>Faktor i</th>
                    <th style={{ padding: '0.65rem 0.85rem', textAlign: 'right', color: '#334155' }}>Kenaikan Titik Didih (ΔTb)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0F172A' }}>Glukosa (C₆H₁₂O₆)</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: '#64748B' }}>Nonelektrolit (1 partikel tetap)</td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 800, color: '#0284C7' }}>1</td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 700, color: '#0284C7' }}>+0,052 °C</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0F172A' }}>Garam Dapur (NaCl)</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: '#64748B' }}>Na⁺ + Cl⁻ (2 ion bebas)</td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 800, color: '#0284C7' }}>2</td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 700, color: '#D97706' }}>+0,104 °C (2× lipat)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 700, color: '#0F172A' }}>Kalsium Klorida (CaCl₂)</td>
                    <td style={{ padding: '0.65rem 0.85rem', color: '#64748B' }}>Ca²⁺ + 2Cl⁻ (3 ion bebas)</td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'center', fontWeight: 800, color: '#0284C7' }}>3</td>
                    <td style={{ padding: '0.65rem 0.85rem', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>+0,156 °C (3× lipat)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Tombol Lanjut ke Tahap 2 */}
          {!isViewAll && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <Button
                variant="primary"
                onClick={() => handleSwitchTab('examples')}
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.98rem', fontWeight: 700 }}
              >
                Lanjut ke Tahap 2: Contoh Terbimbing →
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAHAP 2: CONTOH SOAL TERBIMBING
          ══════════════════════════════════════════════════════ */}
      {(isViewAll || activeTab === 'examples') && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          <ContohSoalBab2 />

          {!isViewAll && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => handleSwitchTab('concept')}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: 600 }}
              >
                ← Kembali ke Konsep
              </button>
              <Button
                variant="primary"
                onClick={() => handleSwitchTab('simulation')}
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.98rem', fontWeight: 700 }}
              >
                Lanjut ke Tahap 3: Lab Simulasi →
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAHAP 3: LAB SIMULASI INTERAKTIF
          ══════════════════════════════════════════════════════ */}
      {(isViewAll || activeTab === 'simulation') && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          <SimulatorUapDidih onSimulasiSelesai={handleSimDone} />

          {!isViewAll && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={() => handleSwitchTab('examples')}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: 600 }}
              >
                ← Kembali ke Contoh Soal
              </button>
              <Button
                variant="primary"
                onClick={() => handleSwitchTab('exercises')}
                style={{ padding: '0.75rem 1.6rem', fontSize: '0.98rem', fontWeight: 700 }}
              >
                Lanjut ke Tahap 4: Latihan Soal →
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAHAP 4: LATIHAN SOAL & PEMBUKA BAB 3
          ══════════════════════════════════════════════════════ */}
      {(isViewAll || activeTab === 'exercises') && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          <LatihanSoalBab2 onEvaluasiLatihan={handleExerciseEvaluation} />

          {/* KOTAK SYARAT KELULUSAN & TOMBOL BUKA BAB 3 */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#FFFFFF',
            border: isReadyToProceed ? '1.5px solid #86EFAC' : '1px solid #E2E8F0',
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
                color: isCompleted ? '#10B981' : isReadyToProceed ? '#059669' : '#D97706',
                fontWeight: 700
              }}>
                {isCompleted
                  ? '✓ Materi Bab 2 Selesai'
                  : isReadyToProceed
                    ? '🎉 Seluruh Syarat Terpenuhi! Siap Lanjut'
                    : 'Syarat Kelulusan Membuka Bab 3:'}
              </span>
              <h4 style={{ margin: '0.2rem 0 0', color: '#0F172A', fontSize: '1.15rem', fontWeight: 800 }}>
                Bab 3: Penurunan Titik Beku & Diagram Fase P–T
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
              {/* Checklist Ringkas & Minimalis */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.85rem',
                background: isReadyToProceed ? '#ECFDF5' : '#F8FAFC',
                border: isReadyToProceed ? '1px solid #A7F3D0' : '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.4rem 0.85rem'
              }}>
                <span style={{
                  color: isSimDone ? '#16A34A' : '#64748B',
                  fontWeight: isSimDone ? 800 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <span>{isSimDone ? '✓' : '○'}</span> Simulasi Lab
                </span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{
                  color: isExerciseDone ? '#16A34A' : '#64748B',
                  fontWeight: isExerciseDone ? 800 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}>
                  <span>{isExerciseDone ? '✓' : '○'}</span> Latihan Soal ≥80% ({exerciseDetails?.exercisePercentage || 0}%)
                </span>
              </div>

              <Button
                variant="primary"
                onClick={onComplete}
                disabled={!isReadyToProceed}
                style={{
                  padding: '0.85rem 1.8rem',
                  fontSize: '1.02rem',
                  fontWeight: 700,
                  background: isReadyToProceed ? '#0284C7' : '#94A3B8',
                  boxShadow: isReadyToProceed ? '0 4px 14px rgba(2, 132, 199, 0.25)' : 'none',
                  cursor: isReadyToProceed ? 'pointer' : 'not-allowed',
                  opacity: isReadyToProceed ? 1 : 0.65
                }}
                title={!isReadyToProceed ? "Lakukan simulasi dan selesaikan minimal 80% latihan soal untuk membuka Bab 3" : "Buka Bab 3"}
              >
                {isReadyToProceed ? 'Selesaikan Bab 2 & Buka Bab 3 →' : '🔒 Selesaikan Bab 2 & Buka Bab 3'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
