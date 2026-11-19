import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import TripleRepresentation from '../../components/chemistry/TripleRepresentation';
import MisconceptionCard from '../../components/chemistry/MisconceptionCard';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { calculateOsmoticPressure } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';
import imgMentimun from '../../assets/fenomena-mentimun.jpg';
import PrediksiOsmosis, { getCh4PredictionKey, PREDIKSI_OPTIONS } from './PrediksiOsmosis';
import KartuFenomena, { getCh4CardKey } from './KartuFenomena';
import SimulasiPipaU, { getCh4PipaUKey } from './SimulasiPipaU';
import GameSelOsmosis, { getCh4GameKey } from './GameSelOsmosis';
import ContohSoalOsmotik, { getCh4ContohKey } from './ContohSoalOsmotik';
import LatihanBab4, { getCh4LatihanKey } from './LatihanBab4';
import SubmikroskopikMembranOsmosis from './SubmikroskopikMembranOsmosis';

// Helper membuat kunci penyimpanan navigasi Bab 4 per akun siswa
export function getCh4NavKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch4_nav_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch4_nav_v1_guest';
}

// 5 Tab Belajar Bab 4
const TABS_CONFIG = [
  { id: 1, label: '1 Prediksi', icon: '💭' },
  { id: 2, label: '2 Observasi', icon: '👁️' },
  { id: 3, label: '3 Jelaskan', icon: '📖' },
  { id: 4, label: '4 Main & hitung', icon: '🧮' },
  { id: 5, label: '5 Latihan', icon: '📝' },
];

// Komponen Kotak "Segera hadir" yang rapi
function PlaceholderBox({ icon = '🚧', title, text }) {
  return (
    <div style={{
      border: '2px dashed #CBD5E1',
      borderRadius: '16px',
      padding: '3rem 1.5rem',
      background: '#F8FAFC',
      color: '#64748B',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      margin: '1rem 0'
    }}>
      <span style={{ fontSize: '2.5rem' }}>{icon}</span>
      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#334155' }}>
        {title}
      </h3>
      <p style={{ margin: 0, maxWidth: '480px', fontSize: '0.95rem', lineHeight: 1.6 }}>
        {text}
      </p>
    </div>
  );
}

// Komponen Navigasi Bawah Tab
function TabBottomNav({ prevTab, prevLabel, nextTab, nextLabel, onSwitch }) {
  return (
    <div style={{
      marginTop: '2.5rem',
      paddingTop: '1.25rem',
      borderTop: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: prevTab ? 'space-between' : 'flex-end',
      flexWrap: 'wrap',
      gap: '0.75rem'
    }}>
      {prevTab && (
        <button
          type="button"
          onClick={() => onSwitch(prevTab)}
          className="btn btn-outline"
          style={{
            padding: '0.75rem 1.35rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            fontFamily: "'Times New Roman', Times, serif"
          }}
        >
          ← Kembali ke {prevLabel}
        </button>
      )}

      {nextTab && (
        <Button
          variant="primary"
          onClick={() => onSwitch(nextTab)}
          style={{
            padding: '0.8rem 1.6rem',
            fontSize: '1rem',
            fontWeight: 700,
            background: '#0284C7',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
            fontFamily: "'Times New Roman', Times, serif"
          }}
        >
          Lanjut ke {nextLabel} →
        </Button>
      )}
    </div>
  );
}

export default function Chapter4Page({ onComplete, isCompleted }) {
  // State Tab Aktif (diingat per siswa dari localStorage)
  const [activeTab, setActiveTab] = useState(() => {
    const navKey = getCh4NavKey();
    const saved = getStoredData(navKey, null);
    if (saved && saved.lastActiveTab && saved.lastActiveTab >= 1 && saved.lastActiveTab <= 5) {
      return saved.lastActiveTab;
    }
    return 1;
  });

  // State Status Tab Selesai
  const [doneTabs, setDoneTabs] = useState(() => {
    if (isCompleted) return { 1: true, 2: true, 3: true, 4: true, 5: true };
    const navKey = getCh4NavKey();
    const saved = getStoredData(navKey, null);
    const predKey = getCh4PredictionKey();
    const pred = getStoredData(predKey, null);
    const cardKey = getCh4CardKey();
    const openedCards = getStoredData(cardKey, []);
    const pipaUKey = getCh4PipaUKey();
    const pipaUData = getStoredData(pipaUKey, null);
    const gameKey = getCh4GameKey();
    const gameData = getStoredData(gameKey, null);
    const contohKey = getCh4ContohKey();
    const contohData = getStoredData(contohKey, null);
    const latihanKey = getCh4LatihanKey();
    const latihanData = getStoredData(latihanKey, null);

    const isCardsDone = Array.isArray(openedCards) && openedCards.length >= 8;
    const isPipaUDone = Boolean(pipaUData?.reverseOsmosisTested);
    const tab2Complete = Boolean(saved?.doneTabs?.[2] || (isCardsDone && isPipaUDone));
    const isGameDone = Boolean(gameData?.completedOnce);
    const isContohDone = Boolean(contohData?.bothCompleted);
    const tab4Complete = isGameDone && isContohDone;
    const isLatihanPassed = Boolean(latihanData?.isPassed);

    return {
      1: Boolean(pred?.choice),
      2: tab2Complete,
      3: Boolean(saved?.doneTabs?.[3]),
      4: tab4Complete,
      5: isLatihanPassed,
    };
  });

  // State pelacakan kelengkapan 2 bagian di Tab 2
  const [isTab2CardsDone, setIsTab2CardsDone] = useState(() => {
    const cardKey = getCh4CardKey();
    const openedCards = getStoredData(cardKey, []);
    return Array.isArray(openedCards) && openedCards.length >= 8;
  });

  const [isTab2PipaUDone, setIsTab2PipaUDone] = useState(() => {
    const pipaUKey = getCh4PipaUKey();
    const pipaUData = getStoredData(pipaUKey, null);
    return Boolean(pipaUData?.reverseOsmosisTested);
  });

  // State pelacakan kelengkapan Tab 4 (game + contoh)
  const [isGameDone, setIsGameDone] = useState(() => {
    const gameKey = getCh4GameKey();
    const gameData = getStoredData(gameKey, null);
    return Boolean(gameData?.completedOnce);
  });

  const [isContohDone, setIsContohDone] = useState(() => {
    const contohKey = getCh4ContohKey();
    const contohData = getStoredData(contohKey, null);
    return Boolean(contohData?.bothCompleted);
  });

  // State pelacakan kelulusan Tab 5 (latihan)
  const [isLatihanPassed, setIsLatihanPassed] = useState(() => {
    const latihanKey = getCh4LatihanKey();
    const latihanData = getStoredData(latihanKey, null);
    return Boolean(latihanData?.isPassed);
  });

  // State kalkulator di Tab 3
  const [molarity, setMolarity] = useState(0.2); // 0.2 M
  const [tempCelsius, setTempCelsius] = useState(25); // 25°C

  const { pi, tempKelvin } = calculateOsmoticPressure(molarity, tempCelsius, 1);

  // Sinkronisasi jika bab berstatus isCompleted
  useEffect(() => {
    if (isCompleted) {
      setDoneTabs({ 1: true, 2: true, 3: true, 4: true, 5: true });
    }
  }, [isCompleted]);

  // Handler saat prediksi di Tab 1 disimpan
  const handlePredictionSaved = () => {
    setDoneTabs((prev) => {
      const updated = { ...prev, 1: true };
      const navKey = getCh4NavKey();
      const saved = getStoredData(navKey, {});
      setStoredData(navKey, { ...saved, doneTabs: updated });
      return updated;
    });
  };

  // Handler saat 8 kartu fenomena telah dibuka (Tab 2 Bagian A)
  const handleCardsComplete = () => {
    setIsTab2CardsDone(true);
    const pipaUKey = getCh4PipaUKey();
    const pipaUData = getStoredData(pipaUKey, null);
    const isPipaUDoneNow = Boolean(pipaUData?.reverseOsmosisTested);

    if (isPipaUDoneNow) {
      setDoneTabs((prev) => {
        const updated = { ...prev, 2: true };
        const navKey = getCh4NavKey();
        const saved = getStoredData(navKey, {});
        setStoredData(navKey, { ...saved, doneTabs: updated });
        return updated;
      });
    }
  };

  // Handler saat simulasi Pipa U dicoba sampai osmosis balik (Tab 2 Bagian B)
  const handleReverseOsmosisAchieved = () => {
    setIsTab2PipaUDone(true);
    const cardKey = getCh4CardKey();
    const openedCards = getStoredData(cardKey, []);
    const isCardsDoneNow = Array.isArray(openedCards) && openedCards.length >= 8;

    if (isCardsDoneNow) {
      setDoneTabs((prev) => {
        const updated = { ...prev, 2: true };
        const navKey = getCh4NavKey();
        const saved = getStoredData(navKey, {});
        setStoredData(navKey, { ...saved, doneTabs: updated });
        return updated;
      });
    }
  };

  // Handler saat game "Sel dalam Bahaya!" dimainkan sampai akhir (Tab 4)
  const handleGameComplete = () => {
    setIsGameDone(true);
    // Cek apakah contoh juga sudah selesai
    const contohKey = getCh4ContohKey();
    const contohData = getStoredData(contohKey, null);
    const isContohDoneNow = Boolean(contohData?.bothCompleted);

    if (isContohDoneNow) {
      setDoneTabs((prev) => {
        const updated = { ...prev, 4: true };
        const navKey = getCh4NavKey();
        const saved = getStoredData(navKey, {});
        setStoredData(navKey, { ...saved, doneTabs: updated });
        return updated;
      });
    }
  };

  // Handler saat kedua contoh soal dibuka sampai langkah terakhir (Tab 4)
  const handleContohComplete = () => {
    setIsContohDone(true);
    // Cek apakah game juga sudah selesai
    const gameKey = getCh4GameKey();
    const gameData = getStoredData(gameKey, null);
    const isGameDoneNow = Boolean(gameData?.completedOnce);

    if (isGameDoneNow) {
      setDoneTabs((prev) => {
        const updated = { ...prev, 4: true };
        const navKey = getCh4NavKey();
        const saved = getStoredData(navKey, {});
        setStoredData(navKey, { ...saved, doneTabs: updated });
        return updated;
      });
    }
  };

  // Handler saat latihan Bab 4 lulus (Tab 5)
  const handleLatihanPassed = (totalScore, passed) => {
    // passed bisa undefined (dari onLatihanPassed(score)) → cek score >= 4
    const isPassedNow = passed !== false && totalScore >= 4;
    setIsLatihanPassed(isPassedNow);
    if (isPassedNow) {
      setDoneTabs((prev) => {
        const updated = { ...prev, 5: true };
        const navKey = getCh4NavKey();
        const saved = getStoredData(navKey, {});
        setStoredData(navKey, { ...saved, doneTabs: updated });
        return updated;
      });
    } else {
      setDoneTabs((prev) => {
        const updated = { ...prev, 5: false };
        return updated;
      });
    }
  };

  // Berpindah tab dengan scroll halus ke atas dan menyimpan tab terakhir
  const handleSwitchTab = (tabId) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 120, behavior: 'smooth' });

    setDoneTabs((prev) => {
      // Recalculate tab 2 status
      const cardKey = getCh4CardKey();
      const openedCards = getStoredData(cardKey, []);
      const pipaUKey = getCh4PipaUKey();
      const pipaUData = getStoredData(pipaUKey, null);
      const isCardsDoneNow = Array.isArray(openedCards) && openedCards.length >= 8;
      const isPipaUDoneNow = Boolean(pipaUData?.reverseOsmosisTested);
      const tab2Complete = isCardsDoneNow && isPipaUDoneNow;

      // Recalculate tab 4 status (game + contoh)
      const gameKey = getCh4GameKey();
      const gameData = getStoredData(gameKey, null);
      const contohKey = getCh4ContohKey();
      const contohData = getStoredData(contohKey, null);
      const tab4Complete = Boolean(gameData?.completedOnce) && Boolean(contohData?.bothCompleted);

      // Recalculate tab 5 status (latihan lulus)
      const latihanKey = getCh4LatihanKey();
      const latihanData = getStoredData(latihanKey, null);
      const tab5Complete = Boolean(latihanData?.isPassed);

      const updated = {
        ...prev,
        2: tab2Complete,
        4: tab4Complete,
        5: tab5Complete,
      };

      // Tab 3 is marked done when visited
      if (tabId === 3) updated[3] = true;

      const navKey = getCh4NavKey();
      const saved = getStoredData(navKey, {});
      setStoredData(navKey, {
        ...saved,
        lastActiveTab: tabId,
        doneTabs: updated
      });
      return updated;
    });
  };

  // ── Syarat tombol "Selesaikan Bab 4 & Buka Bab 5" ──────────────────────
  const req1_prediksi = doneTabs[1];
  const req2_tab2 = doneTabs[2];
  const req3_game = isGameDone;
  const req4_latihan = isLatihanPassed;
  const allRequirementsMet = req1_prediksi && req2_tab2 && req3_game && req4_latihan;

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>

      {/* ══════════════════════════════════════════════════════
          1. HEADER & STEPPER NAVIGASI (Gaya Seragam Bab 2 & 3)
          ══════════════════════════════════════════════════════ */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '1.35rem 1.6rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)'
      }}>
        {/* Baris Atas: Badge & Tahap Misi */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Badge variant="blue">Bab 4 • Tekanan Osmotik</Badge>
          <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
            (Tahap 4 dari 6 Misi Belajar)
          </span>
        </div>

        {/* Judul & Deskripsi Bab */}
        <h2 style={{ marginTop: '0.4rem', marginBottom: '0.25rem', fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
          Tekanan Osmotik &amp; Membran Semipermeabel
        </h2>
        <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.5 }}>
          Pelajari pergerakan spontan molekul pelarut murni menuju larutan melalui membran semipermeabel serta penerapannya dari cairan infus hingga teknologi desalinasi air laut.
        </p>

        {/* 5 STEPPER TABS (1 Prediksi · 2 Observasi · 3 Jelaskan · 4 Main & hitung · 5 Latihan) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '0.5rem',
          marginTop: '1.25rem',
          background: '#F8FAFC',
          padding: '0.35rem',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          overflowX: 'auto'
        }}>
          {TABS_CONFIG.map((t) => {
            const isActive = activeTab === t.id;
            const isDone = doneTabs[t.id] || isCompleted;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => handleSwitchTab(t.id)}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', textAlign: 'left' }}>
                  <span style={{ fontSize: '1.1rem' }}>{t.icon}</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: isActive ? 800 : 600 }}>
                    {t.label}
                  </span>
                </div>
                {isDone && (
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
      </div>

      {/* ══════════════════════════════════════════════════════
          TAB 1: PREDIKSI (Komponen Baru PrediksiOsmosis)
          ══════════════════════════════════════════════════════ */}
      {activeTab === 1 && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>
          <PrediksiOsmosis onDataSaved={handlePredictionSaved} />
          <TabBottomNav
            nextTab={2}
            nextLabel="2 Observasi"
            onSwitch={handleSwitchTab}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 2: OBSERVASI (Bagian A: Kartu Fenomena & Bagian B: Simulasi Pipa U)
          ══════════════════════════════════════════════════════ */}
      {activeTab === 2 && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>

          {/* Kotak Panduan & Indikator Kelengkapan Misi Tab 2 */}
          <div style={{
            background: doneTabs[2] ? '#ECFDF5' : '#F8FAFC',
            border: `1.5px solid ${doneTabs[2] ? '#86EFAC' : '#E2E8F0'}`,
            borderRadius: '14px',
            padding: '0.85rem 1.25rem',
            marginBottom: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
          }}>
            <div>
              <strong style={{ fontSize: '0.98rem', color: doneTabs[2] ? '#065F46' : '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>{doneTabs[2] ? '🎉' : '🎯'}</span>
                <span>Misi Observasi Bab 4 (Dua Bagian Eksplorasi)</span>
              </strong>
              <span style={{ fontSize: '0.84rem', color: doneTabs[2] ? '#047857' : '#64748B' }}>
                Buka seluruh 8 kartu fenomena (Bagian A) dan uji slider tekanan hingga terjadi Osmosis Balik pada Pipa U (Bagian B).
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                background: isTab2CardsDone ? '#ECFDF5' : '#F1F5F9',
                color: isTab2CardsDone ? '#059669' : '#64748B',
                border: `1px solid ${isTab2CardsDone ? '#A7F3D0' : '#CBD5E1'}`,
              }}>
                {isTab2CardsDone ? '✓ 8 Kartu Dibuka' : 'Bagian A: 8 Kartu'}
              </span>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                background: isTab2PipaUDone ? '#ECFDF5' : '#F1F5F9',
                color: isTab2PipaUDone ? '#059669' : '#64748B',
                border: `1px solid ${isTab2PipaUDone ? '#A7F3D0' : '#CBD5E1'}`,
              }}>
                {isTab2PipaUDone ? '✓ Osmosis Balik Teruji' : 'Bagian B: Osmosis Balik'}
              </span>
            </div>
          </div>

          {/* Bagian A: 8 Kartu Fenomena Osmosis */}
          <KartuFenomena onCompleteAll={handleCardsComplete} />

          {/* Bagian B: Simulasi Pipa U & Membran Semipermeabel */}
          <SimulasiPipaU
            onReverseOsmosisAchieved={handleReverseOsmosisAchieved}
            isReverseOsmosisDone={isTab2PipaUDone}
          />

          <TabBottomNav
            prevTab={1}
            prevLabel="1 Prediksi"
            nextTab={3}
            nextLabel="3 Jelaskan"
            onSwitch={handleSwitchTab}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 3: JELASKAN (Prediksi Siswa, Miskonsepsi, 3 Level, Prinsip, Kalkulator, & Kotak Molaritas)
          ══════════════════════════════════════════════════════ */}
      {activeTab === 3 && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>

          {/* ── Kotak "Prediksimu di Tab 1" ────────────────────────────── */}
          {(() => {
            const predKey = getCh4PredictionKey();
            const pred = getStoredData(predKey, null);
            if (!pred || !pred.choice) return null;

            const chosenOption = PREDIKSI_OPTIONS.find((o) => o.id === pred.choice);
            const chosenText = chosenOption ? chosenOption.text : pred.choice;

            return (
              <div style={{
                background: '#FFF7ED',
                border: '1.5px solid #FED7AA',
                borderRadius: '14px',
                padding: '1.15rem 1.4rem',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 8px rgba(234, 88, 12, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>💭</span>
                  <strong style={{ fontSize: '1.02rem', color: '#9A3412' }}>
                    Prediksimu di Tab 1:
                  </strong>
                </div>
                <div style={{
                  background: '#FFFFFF',
                  border: '1px solid #FDBA74',
                  borderRadius: '10px',
                  padding: '0.75rem 1rem',
                  marginBottom: '0.6rem',
                  fontSize: '0.94rem',
                  color: '#1E293B',
                  lineHeight: 1.5
                }}>
                  <strong style={{ color: '#EA580C' }}>Pilihanmu: {pred.choice}.</strong> {chosenText}
                  {pred.reason && (
                    <div style={{ marginTop: '0.4rem', color: '#475569', fontStyle: 'italic' }}>
                      Alasanmu: "{pred.reason}"
                    </div>
                  )}
                </div>
                <div style={{
                  background: '#ECFDF5',
                  border: '1px solid #86EFAC',
                  borderRadius: '8px',
                  padding: '0.65rem 0.9rem',
                  fontSize: '0.9rem',
                  color: '#065F46',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.45rem'
                }}>
                  <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>✅</span>
                  <div>
                    <strong>Jawaban yang tepat adalah B:</strong> "Air berpindah dari larutan encer ke larutan pekat melalui dinding sel." — Inilah prinsip osmosis yang akan kita pelajari lebih dalam di bawah ini.
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Kotak Miskonsepsi Umum Bab 4 */}
          <MisconceptionCard
            badge="Miskonsepsi Bab 4"
            myth="Pada peristiwa osmosis, partikel zat terlarut (garam atau gula) yang berpindah menembus dinding sel."
            fact="SALAH! Itu adalah definisi DIFUSI zat terlarut. Pada OSMOSIS, yang berpindah menembus membran semipermeabel adalah molekul PELARUT (air murni), mengalir dari larutan encer (hipotonik) menuju larutan yang lebih pekat (hipertonik)."
            explanation="Membran semipermeabel bersifat sangat selektif: pori-porinya hanya cukup untuk dilalui molekul air kecil, sementara ion atau molekul zat terlarut yang lebih besar tertahan tidak dapat lewat."
          />

          {/* Tiga Level Representasi Kimia (Johnstone) */}
          <TripleRepresentation
            title="Tiga Level Representasi Kimia"
            conceptName="Tekanan Osmotik (Π) & Osmosis Balik"
            macroscopic={{
              title: 'Pengamatan Sehari-hari: Acar Mentimun & Infus Medis',
              image: imgMentimun,
              description: 'Potongan mentimun segar yang direndam dalam larutan garam pekat akan berkerut dan kehilangan air, menghasilkan acar yang kenyal renyah. Dalam medis, cairan infus ke pembuluh darah harus bersifat isotonik (setara 0,9% NaCl) agar sel darah merah tidak pecah ataupun mengerut.',
              observations: [
                'Sel mentimun kehilangan turgor/air dan berkerut (krenasi jaringan)',
                'Cairan infus isotonik menjaga volume dan bentuk sel eritrosit darah tetap normal',
                'Pada teknologi desalinasi air laut, air laut dialirkan ke tabung bertekanan tinggi untuk menghasilkan air tawar minum bersih'
              ],
            }}
            submicroscopic={{
              title: 'Skala Partikulat: Seleksi Pori-Pori Membran Semipermeabel',
              customVisual: <SubmikroskopikMembranOsmosis />,
              description: 'Membran semipermeabel memiliki ukuran pori-pori mikroskopis selektif yang hanya cukup dilewati oleh molekul kecil pelarut (H2O), tetapi menahan molekul atau ion terlarut yang lebih besar atau terhidrasi.',
              mechanism: 'Secara alami, laju molekul air yang masuk dari sisi encer ke sisi pekat lebih besar daripada sebaliknya (osmosis alami). Namun, jika diberikan tekanan luar hidrostatik yang lebih besar daripada tekanan osmotik (Pluar > Π), molekul air murni dipaksa mengalir melawan gradien konsentrasi menuju sisi air murni (inilah prinsip Osmosis Balik / Reverse Osmosis).',
            }}
            symbolic={{
              title: "Persamaan van 't Hoff untuk Tekanan Osmotik",
              formula: 'Π = M × R × T × i',
              formulaAlt: 'Π = (n / V) × R × T × i   (atau M = mol terlarut / Liter larutan)',
              variables: [
                { symbol: 'Π', desc: 'Tekanan osmotik larutan', unit: 'atmosfer (atm)' },
                { symbol: 'M', desc: 'Molaritas larutan (konsentrasi)', unit: 'mol/L (M)' },
                { symbol: 'R', desc: 'Konstanta gas universal (0,082)', unit: 'L·atm/(mol·K)' },
                { symbol: 'T', desc: 'Suhu mutlak larutan (Kelvin = °C + 273)', unit: 'Kelvin (K)' },
                { symbol: 'i', desc: "Faktor van 't Hoff (i = 1 untuk nonelektrolit)", unit: 'Tanpa satuan' }
              ],
              note: 'Tekanan osmotik merupakan sifat koligatif yang paling sensitif untuk mengukur massa molar (Mr) makromolekul biologis berbobot besar (seperti protein dan polimer).'
            }}
          />

          {/* ── Kotak Konsep Penting: Mengapa Memakai Molaritas (M)? ──────── */}
          <div style={{
            background: '#F0FDF4',
            border: '1.5px solid #86EFAC',
            borderRadius: '12px',
            padding: '1.1rem 1.35rem',
            marginTop: '1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.06)'
          }}>
            <span style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: '0.1rem' }}>💡</span>
            <div>
              <strong style={{ fontSize: '1.02rem', color: '#166534', display: 'block', marginBottom: '0.35rem' }}>
                Mengapa memakai Molaritas (M)?
              </strong>
              <p style={{ margin: 0, fontSize: '0.94rem', color: '#14532D', lineHeight: 1.6 }}>
                Tekanan osmotik dihitung dengan rumus van ‘t Hoff yang mirip persamaan gas ideal: <em>PV = nRT</em>, sehingga <strong>Π = (n/V)·R·T = M·R·T</strong>. Karena memakai volume larutan, satuan konsentrasinya <strong>Molaritas</strong>, bukan molalitas seperti pada titik didih dan titik beku. Ingat: <em>T</em> dalam Kelvin dan <em>R</em> = 0,082 L·atm/(mol·K).
              </p>
            </div>
          </div>

          {/* Prinsip & Kalkulator Tekanan Osmotik (Konsisten memakai simbol Π) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <Card title="Prinsip Tekanan Osmotik">
              <p style={{ lineHeight: 1.7, fontSize: '1rem' }}>
                <strong>Tekanan osmotik (Π)</strong> adalah tekanan hidrostatik luar yang harus diberikan pada larutan untuk menghentikan aliran bersih pelarut menembus membran semipermeabel.
              </p>
              <FormulaRenderer
                formula={<span>Π = M × R × T</span>}
                description="Persamaan van 't Hoff (Nonelektrolit)"
              />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Konstanta gas R = 0,082 L·atm/(mol·K), Suhu mutlak T (Kelvin) = T(°C) + 273.
              </p>
            </Card>

            <Card title="Kalkulator Tekanan Osmotik" subtitle="Eksplorasi pengaruh konsentrasi molar dan suhu">
              <div className="control-group">
                <div className="control-label" style={{ fontWeight: 700 }}>
                  <span>Molaritas (M):</span>
                  <strong>{molarity} M (mol/L)</strong>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="2.0"
                  step="0.05"
                  value={molarity}
                  onChange={(e) => setMolarity(Number(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div className="control-group">
                <div className="control-label" style={{ fontWeight: 700 }}>
                  <span>Suhu Lingkungan:</span>
                  <strong>{tempCelsius} °C ({tempKelvin} K)</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={tempCelsius}
                  onChange={(e) => setTempCelsius(Number(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div style={{
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginTop: '1.25rem'
              }}>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Tekanan Osmotik Terhitung (Π)</div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                  {formatIndonesianNumber(pi, 2)} atm
                </div>
              </div>
            </Card>
          </div>

          <TabBottomNav
            prevTab={2}
            prevLabel="2 Observasi"
            nextTab={4}
            nextLabel="4 Main & hitung"
            onSwitch={handleSwitchTab}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 4: MAIN & HITUNG (Game Sel + Contoh Soal Terbimbing)
          ══════════════════════════════════════════════════════ */}
      {activeTab === 4 && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>

          {/* Game "Sel dalam Bahaya!" */}
          <GameSelOsmosis
            onGameComplete={handleGameComplete}
            isCompletedInitially={isGameDone}
          />

          {/* Contoh Soal Terbimbing Tekanan Osmotik */}
          <ContohSoalOsmotik
            onContohComplete={handleContohComplete}
            isCompletedInitially={isContohDone}
          />

          <TabBottomNav
            prevTab={3}
            prevLabel="3 Jelaskan"
            nextTab={5}
            nextLabel="5 Latihan"
            onSwitch={handleSwitchTab}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          TAB 5: LATIHAN (5 Soal + Refleksi + Tombol Selesai Bab 4)
          ══════════════════════════════════════════════════════ */}
      {activeTab === 5 && (
        <div className="fade-in" style={{ marginBottom: '2.5rem' }}>

          {/* Latihan 5 Soal Bab 4 */}
          <LatihanBab4
            onLatihanPassed={handleLatihanPassed}
            isPassedInitially={isLatihanPassed}
          />

          <div style={{ marginTop: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
            <button
              type="button"
              onClick={() => handleSwitchTab(4)}
              className="btn btn-outline"
              style={{
                padding: '0.65rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                fontFamily: "'Times New Roman', Times, serif"
              }}
            >
              ← Kembali ke 4 Main &amp; Hitung
            </button>
          </div>

          {/* ── Daftar Centang Syarat Penyelesaian Bab 4 ──────────────── */}
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)'
          }}>

            {/* Header */}
            <div style={{ marginBottom: '1.25rem' }}>
              <span style={{
                fontSize: '0.85rem',
                color: allRequirementsMet ? '#10B981' : '#0284C7',
                fontWeight: 700
              }}>
                {isCompleted
                  ? '✓ Materi Bab 4 Selesai'
                  : allRequirementsMet
                  ? '🎉 Semua Syarat Terpenuhi — Siap Lanjut!'
                  : '📋 Syarat Penyelesaian Bab 4'}
              </span>
              <h4 style={{
                margin: '0.2rem 0 0',
                color: '#0F172A',
                fontSize: '1.15rem',
                fontWeight: 800
              }}>
                Bab 5: Sifat Koligatif Larutan Elektrolit &amp; van 't Hoff
              </h4>
            </div>

            {/* Daftar Centang ✓/○ */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
              marginBottom: '1.5rem',
              padding: '1rem',
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0'
            }}>
              {[
                { done: req1_prediksi, label: 'Prediksi di Tab 1 sudah tersimpan' },
                { done: req2_tab2, label: 'Tab 2 selesai (8 kartu fenomena dibuka + osmosis balik dicoba)' },
                { done: req3_game, label: 'Game "Sel dalam Bahaya!" dimainkan sampai akhir' },
                { done: req4_latihan, label: 'Latihan lulus (skor ≥ 4/5)' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    background: item.done ? '#ECFDF5' : '#FFFFFF',
                    border: `1px solid ${item.done ? '#A7F3D0' : '#E2E8F0'}`,
                    fontSize: '0.92rem',
                    color: item.done ? '#065F46' : '#475569',
                    fontWeight: item.done ? 700 : 500
                  }}
                >
                  <span style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: item.done ? '#059669' : '#E2E8F0',
                    color: item.done ? '#FFFFFF' : '#94A3B8',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    flexShrink: 0
                  }}>
                    {item.done ? '✓' : '○'}
                  </span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            {/* Tombol Selesai Bab 4 */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="primary"
                onClick={onComplete}
                disabled={!allRequirementsMet && !isCompleted}
                style={{
                  padding: '0.85rem 1.8rem',
                  fontSize: '1.02rem',
                  fontWeight: 700,
                  background: (allRequirementsMet || isCompleted) ? '#0284C7' : '#94A3B8',
                  boxShadow: (allRequirementsMet || isCompleted) ? '0 4px 14px rgba(2, 132, 199, 0.25)' : 'none',
                  fontFamily: "'Times New Roman', Times, serif",
                  cursor: (allRequirementsMet || isCompleted) ? 'pointer' : 'not-allowed',
                  opacity: (allRequirementsMet || isCompleted) ? 1 : 0.7,
                }}
              >
                {isCompleted ? '✓ Bab 4 Selesai' : 'Selesaikan Bab 4 & Buka Bab 5 →'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
