import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import TripleRepresentation from '../../components/chemistry/TripleRepresentation';
import MisconceptionCard from '../../components/chemistry/MisconceptionCard';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { getStoredData, setStoredData, getAuthUser, normalizeUsername } from '../../utils/storage';
import SugarGlassesIllustration from './SugarGlassesIllustration';
import PerbandinganKonsentrasi from './PerbandinganKonsentrasi';
import ContohSoal from './ContohSoal';
import SimulatorLarutan from './SimulatorLarutan';
import LatihanSoal from './LatihanSoal';

// Helper membuat kunci penyimpanan persyaratan Bab 1 per username
function getCh1StorageKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch1_requirements_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch1_requirements_v1_guest';
}

function getCh1SavedData() {
  const legacyKey = getCh1StorageKey();
  const user = getAuthUser();
  const norm = normalizeUsername(user);
  const modernKey = `kimikoli:v1:${norm}:ch1`;

  const savedModern = getStoredData(modernKey, null);
  const savedLegacy = getStoredData(legacyKey, null);

  return {
    isMissionDone: Boolean(savedModern?.isMissionDone || savedLegacy?.isMissionDone),
    isExerciseDone: Boolean(savedModern?.isExerciseDone || savedLegacy?.isExerciseDone),
    lastActiveTab: savedModern?.lastActiveTab || savedLegacy?.lastActiveTab || 'concept',
  };
}

export default function Chapter1Page({ onComplete, isCompleted }) {
  // Mode Navigasi Bertahap (Minimalis) vs Tampilkan Semua (seperti Bab 2)
  const [activeTab, setActiveTab] = useState(() => {
    const saved = getCh1SavedData();
    return saved?.lastActiveTab || 'concept';
  });
  const [isViewAll, setIsViewAll] = useState(false);

  const [isMissionDone, setIsMissionDone] = useState(() => {
    if (isCompleted) return true;
    const saved = getCh1SavedData();
    return Boolean(saved?.isMissionDone);
  });

  const [isExerciseDone, setIsExerciseDone] = useState(() => {
    if (isCompleted) return true;
    const saved = getCh1SavedData();
    return Boolean(saved?.isExerciseDone);
  });

  // Sinkronisasi jika bab berstatus isCompleted
  useEffect(() => {
    if (isCompleted) {
      setIsMissionDone(true);
      setIsExerciseDone(true);
    }
  }, [isCompleted]);

  const handleMissionDone = () => {
    setIsMissionDone(true);
    const legacyKey = getCh1StorageKey();
    const user = getAuthUser();
    const norm = normalizeUsername(user);
    const modernKey = `kimikoli:v1:${norm}:ch1`;

    const savedLegacy = getStoredData(legacyKey, { isMissionDone: false, isExerciseDone: false });
    setStoredData(legacyKey, { ...savedLegacy, isMissionDone: true });
    const savedModern = getStoredData(modernKey, { isMissionDone: false, isExerciseDone: false });
    setStoredData(modernKey, { ...savedModern, isMissionDone: true });
  };

  const handleExerciseDone = () => {
    setIsExerciseDone(true);
    const legacyKey = getCh1StorageKey();
    const user = getAuthUser();
    const norm = normalizeUsername(user);
    const modernKey = `kimikoli:v1:${norm}:ch1`;

    const savedLegacy = getStoredData(legacyKey, { isMissionDone: false, isExerciseDone: false });
    setStoredData(legacyKey, { ...savedLegacy, isExerciseDone: true });
    const savedModern = getStoredData(modernKey, { isMissionDone: false, isExerciseDone: false });
    setStoredData(modernKey, { ...savedModern, isExerciseDone: true });
  };

  // Berpindah tab dengan scroll halus ke atas
  const handleSwitchTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 120, behavior: 'smooth' });

    const legacyKey = getCh1StorageKey();
    const user = getAuthUser();
    const norm = normalizeUsername(user);
    const modernKey = `kimikoli:v1:${norm}:ch1`;

    const savedLegacy = getStoredData(legacyKey, {});
    setStoredData(legacyKey, { ...savedLegacy, lastActiveTab: tabId });
    const savedModern = getStoredData(modernKey, {});
    setStoredData(modernKey, { ...savedModern, lastActiveTab: tabId });
  };

  const activeUser = getAuthUser();
  const isTeacher = activeUser?.role === 'teacher';
  const isReadyToProceed = isTeacher || (isMissionDone && isExerciseDone) || isCompleted;

  // Definisi 4 Tahap Belajar Minimalis Seragam Bab 2
  const STAGES = [
    { id: 'concept', number: 1, label: 'Konsep & Fenomena', icon: '💡', done: true },
    { id: 'examples', number: 2, label: 'Contoh Terbimbing', icon: '📖', done: true },
    { id: 'simulation', number: 3, label: 'Lab Simulasi', icon: '🔬', done: isMissionDone },
    { id: 'exercises', number: 4, label: 'Latihan Soal', icon: '📝', done: isExerciseDone },
  ];

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>

      {/* ══════════════════════════════════════════════════════
          1. HEADER MINIMALIS & STEPPER NAVIGASI (Gaya Bab 2)
          ══════════════════════════════════════════════════════ */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '1.35rem 1.6rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
      }}>
        {/* Baris Atas: Badge & Toggle Mode */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Badge variant="blue">Bab 1 • Konsentrasi Larutan</Badge>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
              (Tahap 1 dari 6 Misi Belajar)
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
              fontFamily: "'Times New Roman', Times, serif",
            }}
          >
            <span>{isViewAll ? '📑 Beralih ke Mode Bertahap (Minimalis)' : '📜 Tampilkan Seluruh Bab'}</span>
          </button>
        </div>

        {/* Judul & Deskripsi Ringkas */}
        <h2 style={{ marginTop: '0.65rem', marginBottom: '0.3rem', fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
          Konsentrasi Larutan &amp; Hakikat Sifat Koligatif
        </h2>
        <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.5 }}>
          Pelajari bagaimana rasio jumlah partikel zat terlarut terhadap pelarut menentukan sifat larutan dan menjadi fondasi utama sifat koligatif.
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
            border: '1px solid #E2E8F0',
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
                    fontFamily: "'Times New Roman', Times, serif",
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
                      borderRadius: '6px',
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

          {/* Cek Diagnostik Prasyarat Kimia */}
          <div style={{
            background: '#F8FAFC',
            border: '1.5px solid #CBD5E1',
            borderRadius: '16px',
            padding: '1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.3rem' }}>📋</span>
                <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>
                  Hasil Cek Diagnostik Prasyarat Kimia
                </strong>
              </div>
              <span style={{ fontSize: '0.8rem', background: '#ECFDF5', color: '#065F46', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
                ✓ Terverifikasi Pretest
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
              Sebelum mempelajari sifat koligatif, pastikan 4 bekal konsep prasyaratmu sudah aman:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <div style={{ background: '#FFFFFF', padding: '0.7rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>1. Konsep Mol &amp; Mr</div>
                <div style={{ color: '#10B981', fontWeight: 600 }}>✓ Dikuasai (n = m/Mr)</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>Pondasi menghitung jumlah partikel zat.</div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '0.7rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>2. Pelarut vs Terlarut</div>
                <div style={{ color: '#10B981', fontWeight: 600 }}>✓ Dikuasai (Air = pelarut)</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>Zat terlarut bersifat nonvolatil.</div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '0.7rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>3. Satuan Konsentrasi</div>
                <div style={{ color: '#0284C7', fontWeight: 600 }}>🔍 Pelajari di Bab 1 Ini</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>Fokus pada Molalitas (m) &amp; Fraksi Mol (X).</div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '0.7rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 700, color: '#0F172A' }}>4. Ionisasi Elektrolit</div>
                <div style={{ color: '#64748B', fontWeight: 600 }}>⏳ Lanjutan di Bab 2 &amp; 5</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>Pengaruh jumlah partikel ion terurai.</div>
              </div>
            </div>
          </div>

          {/* Kotak Miskonsepsi Umum Bab 1 */}
          <MisconceptionCard
            badge="Miskonsepsi Bab 1"
            myth="Sifat koligatif larutan bergantung pada apakah zat terlarut itu molekul besar atau kecil, manis, asin, atau beracun."
            fact="Sifat koligatif HANYA bergantung pada KUANTITAS (jumlah partikel) zat terlarut di dalam pelarut, dan SAMA SEKALI TIDAK dipengaruhi oleh rasa, warna, ukuran massa molekul, ataupun jenis zat terlarut tersebut."
            explanation="100 butir molekul glukosa (gula manis) dan 100 butir molekul urea (zat pupuk) dalam 1 liter air murni akan menghasilkan penurunan tekanan uap dan penurunan titik beku yang PERSIS SAMA karena jumlah partikel penghalangnya identik."
          />

          {/* Tiga Level Representasi Kimia (Johnstone) */}
          <TripleRepresentation
            title="Tiga Level Representasi Kimia"
            conceptName="Konsentrasi & Partikel Koligatif"
            macroscopic={{
              title: 'Pengamatan Sehari-hari: Rasa & Kepekatan',
              customVisual: <SugarGlassesIllustration />,
              description: 'Ketika melarutkan 1 sendok dan 5 sendok gula ke dalam dua gelas air yang sama banyak, kedua larutan tetap tampak jernih. Namun, larutan dengan 5 sendok gula terasa jauh lebih manis dan sedikit lebih kental. Semakin banyak zat terlarut dalam jumlah pelarut yang sama, semakin pekat larutannya.',
              observations: [
                'Wujud fisik berubah homogen (gula padat larut sempurna dalam air cair)',
                'Larutan yang lebih pekat memiliki kekentalan dan massa jenis yang lebih tinggi',
                'Massa total larutan bertambah, tetapi volume akhir tidak selalu merupakan penjumlahan langsung (akibat celah antarmolekul)',
              ],
            }}
            submicroscopic={{
              title: 'Skala Partikulat: Sebaran Molekul Terlarut',
              description: 'Molekul zat terlarut (glukosa/urea) terlepas dari kristalnya dan dikelilingi oleh molekul-molekul pelarut air (proses hidrasi/solvasi).',
              mechanism: 'Hakikat sifat koligatif: 100 partikel glukosa memberikan dampak koligatif yang PERSIS SAMA dengan 100 partikel urea. Yang dihitung adalah kuantitas partikel bebas per satuan massa pelarut, bukan ukuran atau massa molekulnya.',
            }}
            symbolic={{
              title: 'Persamaan Konsentrasi: Molalitas & Fraksi Mol',
              formula: 'm = (massa / Mr) × (1000 / p)',
              formulaAlt: 'Xt = nt / (nt + np)  |  Xp = np / (nt + np)',
              variables: [
                { symbol: 'm', desc: 'Molalitas larutan', unit: 'mol/kg (m)' },
                { symbol: 'massa', desc: 'Massa zat terlarut yang ditimbang', unit: 'gram (g)' },
                { symbol: 'Mr', desc: 'Massa molar zat terlarut', unit: 'g/mol' },
                { symbol: 'p', desc: 'Massa pelarut murni', unit: 'gram (g)' },
                { symbol: 'Xt', desc: 'Fraksi mol zat terlarut', unit: 'Tanpa satuan (0 ≤ Xt ≤ 1)' },
                { symbol: 'Xp', desc: 'Fraksi mol pelarut (Xt + Xp = 1)', unit: 'Tanpa satuan' },
              ],
              note: 'Molalitas (m) dipilih dalam perhitungan sifat koligatif karena nilainya TIDAK bergantung pada perubahan suhu (berbasis massa pelarut, bukan volume larutan).',
            }}
          />

          {/* Tabel Perbandingan Satuan Konsentrasi & Animasi Pemuaian */}
          <PerbandinganKonsentrasi />

          {/* Kartu Prinsip Dasar */}
          <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <Card title="Prinsip Dasar Sifat Koligatif">
              <p style={{ lineHeight: 1.7, fontSize: '1rem', margin: '0 0 1rem 0' }}>
                <strong>Sifat koligatif</strong> adalah sifat larutan yang hanya bergantung pada <em>jumlah partikel</em> zat terlarut, dan <strong>bukan pada jenis</strong> zat terlarut tersebut.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <FormulaRenderer
                  formula={<span>m = (massa / M<sub>r</sub>) × (1000 / p)</span>}
                  description="Rumus Molalitas (m)"
                />
                <FormulaRenderer
                  formula={<span>X<sub>t</sub> = n<sub>t</sub> / (n<sub>t</sub> + n<sub>p</sub>)</span>}
                  description="Fraksi Mol Terlarut"
                />
              </div>
            </Card>
          </div>

          {/* Tombol Lanjut ke Tahap 2 */}
          {!isViewAll && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
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
          <ContohSoal />

          {!isViewAll && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => handleSwitchTab('concept')}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'Times New Roman', Times, serif" }}
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
          <SimulatorLarutan onMisiSelesai={handleMissionDone} />

          {!isViewAll && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                onClick={() => handleSwitchTab('examples')}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'Times New Roman', Times, serif" }}
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
          TAHAP 4: LATIHAN SOAL & PEMBUKA BAB 2
          ══════════════════════════════════════════════════════ */}
      {(isViewAll || activeTab === 'exercises') && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          <LatihanSoal onSemuaSelesai={handleExerciseDone} />

          {!isViewAll && (
            <div style={{ marginTop: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
              <button
                type="button"
                onClick={() => handleSwitchTab('simulation')}
                className="btn btn-outline"
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: 600, fontFamily: "'Times New Roman', Times, serif" }}
              >
                ← Kembali ke Lab Simulasi
              </button>
            </div>
          )}

          {/* KOTAK SYARAT KELULUSAN & TOMBOL BUKA BAB 2 (Gaya Bab 2) */}
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
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
          }}>
            <div>
              <span style={{
                fontSize: '0.85rem',
                color: isCompleted ? '#10B981' : isReadyToProceed ? '#059669' : '#D97706',
                fontWeight: 700,
              }}>
                {isCompleted
                  ? '✓ Materi Bab 1 Selesai'
                  : isReadyToProceed
                    ? '🎉 Seluruh Syarat Terpenuhi! Siap Lanjut'
                    : 'Syarat Kelulusan Membuka Bab 2:'}
              </span>
              <h4 style={{ margin: '0.2rem 0 0', color: '#0F172A', fontSize: '1.15rem', fontWeight: 800 }}>
                Bab 2: Penurunan Tekanan Uap &amp; Kenaikan Titik Didih
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
                padding: '0.4rem 0.85rem',
              }}>
                <span style={{
                  color: isMissionDone ? '#16A34A' : '#64748B',
                  fontWeight: isMissionDone ? 800 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}>
                  <span>{isMissionDone ? '✓' : '○'}</span> Misi Simulator
                </span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{
                  color: isExerciseDone ? '#16A34A' : '#64748B',
                  fontWeight: isExerciseDone ? 800 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}>
                  <span>{isExerciseDone ? '✓' : '○'}</span> Latihan Soal
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
                  opacity: isReadyToProceed ? 1 : 0.65,
                }}
                title={!isReadyToProceed ? 'Selesaikan minimal 1 misi simulator dan latihan soal untuk membuka Bab 2' : 'Buka Bab 2'}
              >
                {isReadyToProceed ? 'Selesaikan Bab 1 & Buka Bab 2 →' : '🔒 Selesaikan Bab 1 & Buka Bab 2'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
