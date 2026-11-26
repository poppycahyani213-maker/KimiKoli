import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import TripleRepresentation from '../../components/chemistry/TripleRepresentation';
import MisconceptionCard from '../../components/chemistry/MisconceptionCard';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { calculateFreezingPointDepression } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';
import solventsData from '../../data/solvents.json';
import imgTitikBeku from '../../assets/fenomena-titik-beku.jpg';
import KontrasDidihBeku from './KontrasDidihBeku';
import OrientasiMasalah from './OrientasiMasalah';
import DugaanHipotesis, { DUGAAN_OPTIONS, getCh3HypothesisKey } from './DugaanHipotesis';
import SajikanHasil, { getCh3ResultsKey, checkIsPhase4Complete } from './SajikanHasil';
import LatihanKPSBab3, { getCh3KpsKey } from './LatihanKPSBab3';
import SubmikroskopikTitikBeku from './SubmikroskopikTitikBeku';

// ── Helper Penyimpanan Progres Navigasi Bab 3 per Akun Siswa ─────────────────
export function getCh3NavKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch3_nav_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch3_nav_v1_guest';
}

// ── Metadata 5 Fase PBL Bab 3 ────────────────────────────────────────────────
const PBL_TABS = [
  {
    id: 1,
    title: 'Orientasi masalah',
    label: 'Fase 1: Orientasi masalah',
    shortLabel: 'Fase 1',
    icon: '🍨',
    desc: 'Mengamati fenomena gerobak es puter Pak Darmo dan membedah pertanyaan pemantik mengapa adonan membeku tanpa freezer.',
    softBg: '#F0F9FF',
    borderColor: '#BAE6FD',
    textColor: '#0369A1',
  },
  {
    id: 2,
    title: 'Mengorganisasi belajar',
    label: 'Fase 2: Mengorganisasi belajar',
    shortLabel: 'Fase 2',
    icon: '💡',
    desc: 'Menentukan dugaan awal (pilihan A–D), menuliskan alasan logis, merumuskan masalah, dan menyusun hipotesis ilmiah.',
    softBg: '#FFFBEB',
    borderColor: '#FDE68A',
    textColor: '#92400E',
  },
  {
    id: 3,
    title: 'Penyelidikan',
    label: 'Fase 3: Penyelidikan',
    shortLabel: 'Fase 3',
    icon: '🧪',
    desc: 'Mengeksplorasi simulasi termometer kontras didih vs beku, menganalisis 3 level representasi kimia, dan memahami prinsip ΔTf.',
    softBg: '#F0FDF4',
    borderColor: '#BBF7D0',
    textColor: '#15803D',
  },
  {
    id: 4,
    title: 'Menyajikan hasil',
    label: 'Fase 4: Menyajikan hasil',
    shortLabel: 'Fase 4',
    icon: '📊',
    desc: 'Mencatat data pengamatan ke dalam tabel, mengamati grafik hubungan molalitas vs ΔTf, serta merumuskan kesimpulan akhir.',
    softBg: '#FAF5FF',
    borderColor: '#E9D5FF',
    textColor: '#7E22CE',
  },
  {
    id: 5,
    title: 'Analisis & evaluasi',
    label: 'Fase 5: Analisis & evaluasi',
    shortLabel: 'Fase 5',
    icon: '✅',
    desc: 'Merefleksikan dugaan awal, meluruskan 2 miskonsepsi es puter, dan menguji pemahaman lewat 8 soal KPS serta refleksi diri.',
    softBg: '#FFF1F2',
    borderColor: '#FECDD3',
    textColor: '#BE123C',
  },
];

// ── Header Seksi Tiap Fase ───────────────────────────────────────────────────
function PhaseHeader({ number, title }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <span style={{
        display: 'inline-block',
        background: '#EFF6FF',
        color: '#1D4ED8',
        border: '1px solid #BFDBFE',
        borderRadius: '999px',
        padding: '0.2rem 0.9rem',
        fontSize: '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.03em',
        marginBottom: '0.4rem',
      }}>
        FASE {number}
      </span>
      <h3 style={{
        margin: 0,
        fontSize: '1.3rem',
        fontWeight: 800,
        color: '#1E293B',
      }}>
        {title}
      </h3>
    </div>
  );
}

// ── Tombol Navigasi Bawah Fase ───────────────────────────────────────────────
function PhaseBottomNav({ currentPhase, prevPhase, prevLabel, nextPhase, nextLabel, isNextLocked, lockedMsg, onSwitch }) {
  return (
    <div style={{
      marginTop: '2.5rem',
      paddingTop: '1.25rem',
      borderTop: '1px solid #E2E8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: prevPhase ? 'space-between' : 'flex-end',
      flexWrap: 'wrap',
      gap: '0.75rem',
    }}>
      {prevPhase && (
        <Button
          variant="secondary"
          onClick={() => onSwitch(prevPhase)}
          style={{
            padding: '0.75rem 1.35rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            fontFamily: "'Times New Roman', Times, serif",
          }}
        >
          ← Kembali ke {prevLabel || `Fase ${prevPhase}`}
        </Button>
      )}

      {nextPhase && (
        <Button
          variant="primary"
          onClick={() => !isNextLocked && onSwitch(nextPhase)}
          disabled={isNextLocked}
          style={{
            padding: '0.8rem 1.6rem',
            fontSize: '1rem',
            fontWeight: 700,
            background: isNextLocked ? '#94A3B8' : '#0284C7',
            cursor: isNextLocked ? 'not-allowed' : 'pointer',
            opacity: isNextLocked ? 0.65 : 1,
            boxShadow: isNextLocked ? 'none' : '0 4px 14px rgba(2, 132, 199, 0.25)',
            fontFamily: "'Times New Roman', Times, serif",
          }}
          title={isNextLocked ? lockedMsg : undefined}
        >
          {isNextLocked ? `🔒 ${lockedMsg || `Lanjut ke Fase ${nextPhase}`}` : `Lanjut ke ${nextLabel || `Fase ${nextPhase}`} →`}
        </Button>
      )}
    </div>
  );
}

export default function Chapter3Page({ onComplete, isCompleted }) {
  const water = solventsData[0]; // Air: Kf = 1.86, normal freezing = 0.0°C
  const [molality, setMolality] = useState(1);

  // ── 1. Status Dugaan Fase 2 ────────────────────────────────────────────────
  const [hypothesisData, setHypothesisData] = useState(() => {
    return getStoredData(getCh3HypothesisKey(), null);
  });

  const [isHypothesisSaved, setIsHypothesisSaved] = useState(() => {
    if (isCompleted) return true;
    const hyp = getStoredData(getCh3HypothesisKey(), null);
    return Boolean(hyp && hyp.choice);
  });

  // ── 2. Status Fase 1 (Telah Dibuka) ────────────────────────────────────────
  const [isFase1Done, setIsFase1Done] = useState(() => {
    if (isCompleted) return true;
    const nav = getStoredData(getCh3NavKey(), null);
    return Boolean(nav?.isFase1Opened);
  });

  // ── 3. Status Fase 3 (Slider Termometer Pernah Digeser) ─────────────────────
  const [isFase3Done, setIsFase3Done] = useState(() => {
    if (isCompleted) return true;
    const nav = getStoredData(getCh3NavKey(), null);
    return Boolean(nav?.isFase3Done);
  });

  // ── 4. Status Fase 4 Selesai ──────────────────────────────────────────────
  const [isPhase4Completed, setIsPhase4Completed] = useState(() => {
    if (isCompleted) return true;
    const res = getStoredData(getCh3ResultsKey(), null);
    return checkIsPhase4Complete(res);
  });

  // ── 5. Status Fase 5 Lulus KPS ─────────────────────────────────────────────
  const [isKpsPassed, setIsKpsPassed] = useState(() => {
    if (isCompleted) return true;
    const kps = getStoredData(getCh3KpsKey(), null);
    return Boolean(kps && kps.isPassed);
  });

  // ── Tab Terakhir yang Dibuka Siswa ─────────────────────────────────────────
  const [activeTab, setActiveTab] = useState(() => {
    const nav = getStoredData(getCh3NavKey(), null);
    const hyp = getStoredData(getCh3HypothesisKey(), null);
    const hypSaved = Boolean(hyp && hyp.choice) || isCompleted;

    if (nav && nav.lastActiveTab && nav.lastActiveTab >= 1 && nav.lastActiveTab <= 5) {
      if (nav.lastActiveTab === 5 && !hypSaved) {
        return 1;
      }
      return nav.lastActiveTab;
    }
    return 1;
  });

  // Sinkronisasi jika bab berstatus isCompleted
  useEffect(() => {
    if (isCompleted) {
      setIsFase1Done(true);
      setIsHypothesisSaved(true);
      setIsFase3Done(true);
      setIsPhase4Completed(true);
      setIsKpsPassed(true);
    }
  }, [isCompleted]);

  // Muat ulang data saat mount / jika ada perubahan storage
  useEffect(() => {
    if (isCompleted) return;

    const nav = getStoredData(getCh3NavKey(), null);
    if (nav?.isFase1Opened) setIsFase1Done(true);
    if (nav?.isFase3Done) setIsFase3Done(true);

    const hyp = getStoredData(getCh3HypothesisKey(), null);
    if (hyp && hyp.choice) {
      setHypothesisData(hyp);
      setIsHypothesisSaved(true);
    }

    const res = getStoredData(getCh3ResultsKey(), null);
    if (checkIsPhase4Complete(res)) {
      setIsPhase4Completed(true);
    }

    const kps = getStoredData(getCh3KpsKey(), null);
    if (kps && kps.isPassed) {
      setIsKpsPassed(true);
    }
  }, [isCompleted]);

  // Tandai Fase 1 selesai begitu siswa mengakses halaman
  useEffect(() => {
    if (!isFase1Done) {
      setIsFase1Done(true);
      const navKey = getCh3NavKey();
      const saved = getStoredData(navKey, {});
      setStoredData(navKey, { ...saved, isFase1Opened: true });
    }
  }, [isFase1Done]);

  // Deteksi interaksi slider termometer di Fase 3
  useEffect(() => {
    if (activeTab === 3 && !isFase3Done) {
      const handleRangeInput = (e) => {
        if (e.target && e.target.type === 'range') {
          setIsFase3Done(true);
          const navKey = getCh3NavKey();
          const saved = getStoredData(navKey, {});
          setStoredData(navKey, { ...saved, isFase3Done: true });
        }
      };
      window.addEventListener('input', handleRangeInput);
      return () => window.removeEventListener('input', handleRangeInput);
    }
  }, [activeTab, isFase3Done]);

  const handleSliderChange = (newVal) => {
    setMolality(newVal);
    if (!isFase3Done) {
      setIsFase3Done(true);
      const navKey = getCh3NavKey();
      const saved = getStoredData(navKey, {});
      setStoredData(navKey, { ...saved, isFase3Done: true });
    }
  };

  const isReadyToProceed = (isHypothesisSaved && isPhase4Completed && isKpsPassed) || isCompleted;

  const { deltaTf, freezingPoint } = calculateFreezingPointDepression(
    water.kf, molality, 1, water.normalFreezingPoint
  );

  // Berpindah tab dan menggulir ke atas
  const handleSwitchTab = (tabId) => {
    if (tabId === 5 && !isHypothesisSaved) return;
    setActiveTab(tabId);
    window.scrollTo({ top: 100, behavior: 'smooth' });

    const navKey = getCh3NavKey();
    const saved = getStoredData(navKey, {});
    setStoredData(navKey, {
      ...saved,
      lastActiveTab: tabId,
      isFase1Opened: true,
    });
  };

  // Status penyelesaian per fase
  const phaseStatus = {
    1: isFase1Done,
    2: isHypothesisSaved,
    3: isFase3Done,
    4: isPhase4Completed,
    5: isKpsPassed,
  };

  const activeTabMeta = PBL_TABS.find((t) => t.id === activeTab) || PBL_TABS[0];
  const selectedDugaanObj = hypothesisData?.choice
    ? DUGAAN_OPTIONS.find((o) => o.id === hypothesisData.choice)
    : null;

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>

      {/* ══════════════════════════════════════════════════════
          1. HEADER & STEPPER TABS (Gaya Seragam Bab 2)
          ══════════════════════════════════════════════════════ */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '1.35rem 1.6rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
      }}>
        {/* Badge & Misi Belajar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Badge variant="blue">Bab 3 • Titik Beku &amp; Diagram Fase</Badge>
          <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>
            (Tahap 3 dari 6 Misi Belajar)
          </span>
        </div>

        {/* Judul & Deskripsi Bab */}
        <h2 style={{ marginTop: '0.4rem', marginBottom: '0.25rem', fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>
          Penurunan Titik Beku &amp; Diagram Fase
        </h2>
        <p style={{ margin: 0, fontSize: '1rem', color: '#475569', lineHeight: 1.5 }}>
          Pelajari bagaimana kehadiran zat terlarut merusak keteraturan kisi kristal es, menurunkan titik beku larutan, dan membekukan adonan es puter tanpa mesin pendingin.
        </p>

        {/* 5 STEPPER TABS (Alur 5 Fase PBL) */}
        <div
          className="pbl-tabs-container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '0.5rem',
            marginTop: '1.25rem',
            background: '#F8FAFC',
            padding: '0.35rem',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            overflowX: 'auto',
          }}
        >
          {PBL_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const isLocked = tab.id === 5 && !isHypothesisSaved;
            const isDone = phaseStatus[tab.id];

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => !isLocked && handleSwitchTab(tab.id)}
                disabled={isLocked}
                title={isLocked ? 'Simpan dugaanmu di Fase 2 dulu' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  border: 'none',
                  borderRadius: '9px',
                  background: isActive ? '#FFFFFF' : 'transparent',
                  color: isLocked ? '#94A3B8' : isActive ? '#0284C7' : '#64748B',
                  boxShadow: isActive ? '0 2px 8px rgba(15, 23, 42, 0.08)' : 'none',
                  borderLeft: isActive ? '3.5px solid #0284C7' : '3.5px solid transparent',
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  opacity: isLocked ? 0.7 : 1,
                  transition: 'all 0.2s',
                  fontFamily: "'Times New Roman', Times, serif",
                  minWidth: '150px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', textAlign: 'left' }}>
                  <span style={{ fontSize: '1.15rem' }}>
                    {isLocked ? '🔒' : tab.icon}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: isActive ? 800 : 700 }}>
                        Fase {tab.id}
                      </span>
                    </div>
                    <span
                      className="pbl-tab-full"
                      style={{
                        fontSize: '0.74rem',
                        color: isLocked ? '#94A3B8' : isActive ? '#0369A1' : '#64748B',
                      }}
                    >
                      {tab.title}
                    </span>
                    {isLocked && (
                      <span style={{ fontSize: '0.66rem', color: '#D97706', fontWeight: 600 }}>
                        Simpan dugaan di F2 dulu
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ marginLeft: '0.35rem', flexShrink: 0 }}>
                  {isLocked ? (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#94A3B8',
                        background: '#F1F5F9',
                        padding: '0.15rem 0.35rem',
                        borderRadius: '6px',
                      }}
                    >
                      🔒
                    </span>
                  ) : isDone ? (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        color: '#059669',
                        background: '#ECFDF5',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px',
                      }}
                    >
                      ✓
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Deskripsi Singkat Fase Aktif (1 Baris Ringkas) ─────────────── */}
        <div
          style={{
            marginTop: '0.85rem',
            padding: '0.65rem 1rem',
            background: activeTabMeta.softBg,
            borderRadius: '8px',
            border: `1px solid ${activeTabMeta.borderColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.88rem',
            color: activeTabMeta.textColor,
            lineHeight: 1.45,
          }}
        >
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{activeTabMeta.icon}</span>
          <div style={{ flex: 1 }}>
            <strong>{activeTabMeta.label}:</strong> {activeTabMeta.desc}
          </div>
        </div>

        {/* ── Catatan untuk Guru (Bagian Lipat / Collapsible) ───────────────── */}
        <details style={{ marginTop: '0.85rem' }}>
          <summary
            style={{
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.84rem',
              color: '#1D4ED8',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              userSelect: 'none',
            }}
          >
            <span>👨‍🏫</span>
            <span>Catatan untuk Guru (Panduan Fasilitasi PBL)</span>
            <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, marginLeft: '0.2rem' }}>
              [klik untuk membuka]
            </span>
          </summary>

          <div
            style={{
              marginTop: '0.65rem',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '0.85rem 1rem',
              fontSize: '0.86rem',
              color: '#334155',
              lineHeight: 1.55,
            }}
          >
            <div style={{ marginBottom: '0.6rem' }}>
              <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.15rem' }}>
                🎯 Tujuan Pembelajaran:
              </strong>
              Siswa dapat menganalisis fenomena penurunan titik beku (ΔTf) larutan nonelektrolit secara ilmiah,
              menghubungkan konsentrasi molalitas dengan besarnya penurunan suhu beku,
              serta membedakan arah perubahan titik didih vs titik beku larutan.
            </div>

            <div style={{ marginBottom: '0.6rem' }}>
              <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.15rem' }}>
                ⏱️ Rekomendasi Waktu:
              </strong>
              2 Jam Pelajaran (2 × 45 menit). Dapat difasilitasi dalam model blended learning di laboratorium komputer atau penugasan mandiri.
            </div>

            <div>
              <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.25rem' }}>
                💡 Panduan Peran Guru pada Setiap Fase:
              </strong>
              <ul style={{ margin: '0 0 0 1.15rem', padding: 0 }}>
                <li><strong>Fase 1:</strong> Bangkitkan rasa ingin tahu siswa mengenai kontradiksi es mencair tetapi adonan es puter malah membeku.</li>
                <li><strong>Fase 2:</strong> Beri motivasi agar siswa berani memilih dugaan awal; tekankan bahwa dugaan awal tidak dinilai benar/salah.</li>
                <li><strong>Fase 3:</strong> Dampingi siswa membandingkan termometer kenaikan titik didih vs penurunan titik beku dan memahami nilai Kf air (1,86 °C/m).</li>
                <li><strong>Fase 4:</strong> Fasilitasi pengamatan pola pada tabel dan grafik; bantu siswa menyimpulkan hubungan linier antara molalitas dan ΔTf.</li>
                <li><strong>Fase 5:</strong> Klarifikasi miskonsepsi umum (garam tidak menghangatkan es), dan pantau ketuntasan latihan KPS siswa (KKM ≥ 75%).</li>
              </ul>
            </div>
          </div>
        </details>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          FASE 1: Orientasi Siswa pada Masalah
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 1 && (
        <section id="fase-1" className="fade-in" style={{ marginBottom: '2.5rem' }}>
          <PhaseHeader number={1} title="Orientasi Siswa pada Masalah" />
          <OrientasiMasalah />
          <PhaseBottomNav
            currentPhase={1}
            nextPhase={2}
            nextLabel="Fase 2: Mengorganisasi Belajar"
            onSwitch={handleSwitchTab}
          />
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          FASE 2: Mengorganisasi Siswa untuk Belajar
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 2 && (
        <section id="fase-2" className="fade-in" style={{ marginBottom: '2.5rem' }}>
          <PhaseHeader number={2} title="Mengorganisasi Siswa untuk Belajar" />
          <DugaanHipotesis
            onDataSaved={(data) => {
              setHypothesisData(data);
              setIsHypothesisSaved(true);
            }}
          />
          <PhaseBottomNav
            currentPhase={2}
            prevPhase={1}
            prevLabel="Fase 1: Orientasi Masalah"
            nextPhase={3}
            nextLabel="Fase 3: Penyelidikan"
            onSwitch={handleSwitchTab}
          />
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          FASE 3: Membimbing Penyelidikan
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 3 && (
        <section id="fase-3" className="fade-in" style={{ marginBottom: '2.5rem' }}>
          <PhaseHeader number={3} title="Membimbing Penyelidikan" />

          {/* KontrasDidihBeku: termometer + tabel kontras + satu zat dua manfaat */}
          <KontrasDidihBeku />

          {/* Tiga Level Representasi Kimia */}
          <TripleRepresentation
            title="Tiga Level Representasi Kimia"
            conceptName="Penurunan Titik Beku (ΔTf)"
            macroscopic={{
              title: 'Pengamatan Sehari-hari: Gerobak Es Puter & Salju',
              image: imgTitikBeku,
              description: 'Penjual es puter memutar adonan santan dalam tabung baja yang dikelilingi campuran es batu dan garam krosok. Campuran tersebut meleleh namun suhunya anjlok hingga mencapai -5°C sampai -10°C.',
              observations: [
                'Es batu yang ditaburi garam kasar mencair dengan cepat, tetapi cairan yang terbentuk terasa jauh lebih dingin',
                'Adonan es di dalam tabung logam membeku sempurna tanpa bantuan mesin pendingin listrik / freezer',
                'Di negara 4 musim, garam NaCl/CaCl2 ditaburkan ke jalan raya bersalju agar es meleleh pada suhu di bawah 0°C dan jalan tidak licin',
              ],
            }}
            submicroscopic={{
              title: 'Skala Partikulat: Kesetimbangan Dinamis Kristal Es & Larutan',
              description: 'Di tingkat molekuler, pembekuan adalah proses kesetimbangan dinamis antara molekul air yang bergabung ke kisi kristal es dan yang lepas kembali ke fase cair.',
              customVisual: <SubmikroskopikTitikBeku />,
              mechanism: 'Di permukaan es, molekul air terus-menerus bergabung ke kristal dan lepas dari kristal. Titik beku adalah suhu saat keduanya seimbang. Partikel zat terlarut menempati sebagian permukaan sehingga lebih sedikit molekul air yang bisa bergabung, sedangkan yang lepas tetap sama. Akibatnya es mencair pada 0 °C. Agar seimbang lagi, suhu harus diturunkan supaya molekul es bergerak lebih lambat dan lebih sedikit yang lepas. Itulah sebabnya titik beku larutan lebih rendah dari 0 °C.',
            }}
            symbolic={{
              title: 'Persamaan Penurunan Titik Beku & Suhu Beku',
              formula: 'ΔTf = Kf × m × i',
              formulaAlt: 'Tf = Tf° − ΔTf   (untuk air: Tf = 0°C − ΔTf)',
              variables: [
                { symbol: 'ΔTf', desc: 'Penurunan titik beku larutan (selalu positif)', unit: '°C atau Kelvin' },
                { symbol: 'Kf',  desc: 'Tetapan penurunan titik beku molal pelarut (Air = 1,86)', unit: '°C·kg/mol (°C/m)' },
                { symbol: 'm',   desc: 'Molalitas larutan', unit: 'mol/kg (m)' },
                { symbol: 'i',   desc: "Faktor van 't Hoff (i = 1 untuk nonelektrolit)", unit: 'Tanpa satuan' },
                { symbol: 'Tf°', desc: 'Titik beku pelarut murni (Air = 0,00°C)', unit: '°C' },
                { symbol: 'Tf',  desc: 'Titik beku larutan yang terukur (selalu lebih rendah dari Tf°)', unit: '°C' },
              ],
              note: 'Nilai Kf air (1,86 °C/m) jauh lebih besar daripada Kb air (0,52 °C/m), sehingga efek penurunan titik beku selalu tampak lebih signifikan dibandingkan kenaikan titik didih pada konsentrasi yang sama.',
            }}
          />

          {/* Prinsip + Simulasi Titik Beku */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
            <Card title="Prinsip Penurunan Titik Beku">
              <p style={{ lineHeight: 1.7, fontSize: '1rem' }}>
                Molekul zat terlarut merusak susunan kristal rapi pelarut padat (es). Agar dapat membeku menjadi kisi padat, energi kinetik molekul harus diturunkan lebih jauh ke suhu yang lebih dingin.
              </p>
              <FormulaRenderer
                formula={<span>ΔT<sub>f</sub> = K<sub>f</sub> × m</span>}
                description="Penurunan Titik Beku (Nonelektrolit)"
              />
              <FormulaRenderer
                formula={<span>T<sub>f</sub> = T<sub>f</sub>° − ΔT<sub>f</sub></span>}
                description="Titik Beku Larutan"
              />
            </Card>

            <Card title="Simulasi Titik Beku Larutan Air" subtitle="Tetapan Kf Air = 1,86 °C/m, Titik Beku Normal = 0,00 °C">
              <div className="control-group">
                <div className="control-label" style={{ fontWeight: 700 }}>
                  <span>Konsentrasi Molalitas (m):</span>
                  <strong>{molality} molal</strong>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="4"
                  step="0.1"
                  value={molality}
                  onChange={(e) => handleSliderChange(Number(e.target.value))}
                  className="slider-input"
                />
              </div>

              <div style={{
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                marginTop: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}>
                <div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Penurunan Titik Beku (ΔTf)</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                    {formatIndonesianNumber(deltaTf, 2)} °C
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Titik Beku Larutan (Tf)</div>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-cold)' }}>
                    {formatIndonesianNumber(freezingPoint, 2)} °C
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <PhaseBottomNav
            currentPhase={3}
            prevPhase={2}
            prevLabel="Fase 2: Mengorganisasi Belajar"
            nextPhase={4}
            nextLabel="Fase 4: Menyajikan Hasil"
            onSwitch={handleSwitchTab}
          />
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          FASE 4: Mengembangkan dan Menyajikan Hasil
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 4 && (
        <section id="fase-4" className="fade-in" style={{ marginBottom: '2.5rem' }}>
          <PhaseHeader number={4} title="Mengembangkan dan Menyajikan Hasil" />
          <SajikanHasil onCompletePhase4={(done) => setIsPhase4Completed(done)} />
          <PhaseBottomNav
            currentPhase={4}
            prevPhase={3}
            prevLabel="Fase 3: Penyelidikan"
            nextPhase={5}
            nextLabel="Fase 5: Analisis & Evaluasi"
            isNextLocked={!isHypothesisSaved}
            lockedMsg="Simpan dugaanmu di Fase 2 dulu"
            onSwitch={handleSwitchTab}
          />
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          FASE 5: Menganalisis dan Mengevaluasi Proses
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 5 && (
        <section id="fase-5" className="fade-in" style={{ marginBottom: '2.5rem' }}>
          <PhaseHeader number={5} title="Menganalisis dan Mengevaluasi Proses" />

          {/* ── Evaluasi Dugaan Awal dari Fase 2 ────────────────────────────── */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '12px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.75rem',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🔍</span>
              <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                Refleksi Dugaan Awalmu
              </h4>
            </div>

            {hypothesisData && hypothesisData.choice ? (
              <div style={{
                background: '#F8FAFC',
                padding: '1rem 1.25rem',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                marginBottom: '1rem',
              }}>
                <div style={{ marginBottom: hypothesisData.reason ? '0.6rem' : 0 }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Dugaan awalmu:
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E293B', marginTop: '0.2rem' }}>
                    Pilihan {hypothesisData.choice}: {selectedDugaanObj ? selectedDugaanObj.text : ''}
                  </div>
                </div>

                {hypothesisData.reason && (
                  <div style={{ paddingTop: '0.6rem', borderTop: '1px dashed #E2E8F0' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Alasanmu:
                    </span>
                    <p style={{ margin: '0.25rem 0 0', color: '#334155', fontStyle: 'italic', fontSize: '0.975rem', lineHeight: 1.5 }}>
                      “{hypothesisData.reason}”
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                background: '#FFFBEB',
                padding: '0.85rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid #FCD34D',
                color: '#92400E',
                fontSize: '0.95rem',
                marginBottom: '1rem',
              }}>
                ℹ️ Kamu belum memilih dugaan awal di <strong>Fase 2</strong>. Silakan kembali ke Fase 2 untuk memilih dan menyimpannya.
              </div>
            )}

            {/* Penjelasan bahwa jawaban yang tepat adalah B */}
            <div style={{
              background: hypothesisData?.choice === 'B' ? '#F0FDF4' : '#EFF6FF',
              border: hypothesisData?.choice === 'B' ? '1.5px solid #86EFAC' : '1.5px solid #93C5FD',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              color: hypothesisData?.choice === 'B' ? '#166534' : '#1E40AF',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.3rem' }}>
                  {hypothesisData?.choice === 'B' ? '🎉' : '💡'}
                </span>
                <strong style={{ fontSize: '1.05rem' }}>
                  Jawaban yang Tepat: B
                </strong>
              </div>
              <p style={{ margin: 0, fontSize: '0.975rem', lineHeight: 1.6 }}>
                <strong>Garam menurunkan titik beku</strong>, sehingga campuran es dan garam menjadi lebih dingin dari 0 °C (dapat mencapai −5 °C hingga −10 °C) dan menyerap panas dari adonan es puter di dalam tabung logam sampai adonan membeku.
              </p>
              {hypothesisData?.choice && hypothesisData.choice !== 'B' && (
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', fontStyle: 'italic', color: '#475569' }}>
                  Pilihan {hypothesisData.choice} adalah anggapan yang sering muncul sebelum mempelajari konsep ini. Simak kotak miskonsepsi di bawah untuk meluruskan pemahamanmu!
                </p>
              )}
            </div>
          </div>

          <p style={{
            fontSize: '1rem',
            color: '#475569',
            marginBottom: '1rem',
            fontStyle: 'italic',
          }}>
            Bandingkan dengan dugaan awalmu:
          </p>

          {/* Kedua kotak miskonsepsi berdampingan */}
          <div className="misconception-grid-dual">
            <MisconceptionCard
              badge="Miskonsepsi 1: Garam menghangatkan es"
              myth="Garam membuat es batu cepat mencair karena garam menghasilkan sifat panas atau menghangatkan es."
              fact="SALAH! Garam justru MENURUNKAN titik beku air. Campuran es dan garam melebur pada suhu di bawah 0°C sambil menyerap kalor dari sekitarnya, sehingga suhu larutan anjlok drastis mencapai -5°C hingga -10°C!"
              explanation="Suhu super dingin di bawah titik beku normal inilah yang menyerap panas dari adonan es puter di dalam tabung logam, memungkinkan adonan membeku padat menjadi es krim lezat tanpa bantuan freezer listrik."
              style={{ height: '100%', marginBottom: 0 }}
            />

            <MisconceptionCard
              badge="Miskonsepsi 2: Didih naik, beku ikut naik?"
              myth="Zat terlarut menaikkan titik didih, jadi titik beku juga ikut naik."
              fact="Titik beku justru TURUN. Zat terlarut membuat larutan 'betah' di fase cair: lebih sulit mendidih sekaligus lebih sulit membeku, sehingga rentang suhu fase cair melebar ke dua arah."
              explanation="Partikel terlarut menghalangi pelarut lepas ke udara (tekanan uap turun, butuh suhu >100°C untuk mendidih), sekaligus mengganggu keteraturan molekul pelarut menyusun kisi kristal es (butuh pendinginan ekstra <0°C untuk membeku)."
              style={{ height: '100%', marginBottom: 0 }}
            />
          </div>

          {/* Latihan Keterampilan Proses Sains (KPS) Bab 3 */}
          <LatihanKPSBab3 onCompleteKps={(passed) => setIsKpsPassed(passed)} />

          {/* Navigasi Balik ke Fase 4 */}
          <div style={{ marginTop: '1.5rem', marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="secondary"
              onClick={() => handleSwitchTab(4)}
              style={{
                padding: '0.75rem 1.35rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                fontFamily: "'Times New Roman', Times, serif",
              }}
            >
              ← Kembali ke Fase 4: Menyajikan Hasil
            </Button>
          </div>

          {/* ── Tombol Selesaikan Bab 3 & Buka Bab 4 ───────────────────────── */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            background: '#FFFFFF',
            border: isReadyToProceed ? '1.5px solid #86EFAC' : '1px solid #E2E8F0',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
          }}>
            <div>
              <span style={{
                fontSize: '0.85rem',
                color: isCompleted ? '#10B981' : isReadyToProceed ? '#059669' : '#D97706',
                fontWeight: 700,
              }}>
                {isCompleted
                  ? '✓ Materi Bab 3 Selesai'
                  : isReadyToProceed
                  ? '🎉 Target Lulus Terpenuhi! Siap Klaim XP'
                  : 'Target Kelulusan Bab 3 (Klaim +XP & Rekap Guru):'}
              </span>
              <h4 style={{ margin: '0.2rem 0 0', color: '#0F172A', fontSize: '1.15rem', fontWeight: 800 }}>
                Bab 3: Penurunan Titik Beku & Diagram Fase P–T
              </h4>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem' }}>
              {/* Daftar Centang 3 Syarat Pembuka Bab 4 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.65rem',
                fontSize: '0.85rem',
                background: isReadyToProceed ? '#ECFDF5' : '#F8FAFC',
                border: isReadyToProceed ? '1px solid #A7F3D0' : '1px solid #CBD5E1',
                borderRadius: '8px',
                padding: '0.4rem 0.85rem',
              }}>
                <span style={{
                  color: isHypothesisSaved ? '#16A34A' : '#64748B',
                  fontWeight: isHypothesisSaved ? 800 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}>
                  <span>{isHypothesisSaved ? '✓' : '○'}</span> Dugaan Fase 2
                </span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{
                  color: isPhase4Completed ? '#16A34A' : '#64748B',
                  fontWeight: isPhase4Completed ? 800 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}>
                  <span>{isPhase4Completed ? '✓' : '○'}</span> Data Fase 4
                </span>
                <span style={{ color: '#CBD5E1' }}>•</span>
                <span style={{
                  color: isKpsPassed ? '#16A34A' : '#64748B',
                  fontWeight: isKpsPassed ? 800 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}>
                  <span>{isKpsPassed ? '✓' : '○'}</span> Latihan KPS (≥ 6/8)
                </span>
              </div>

              <Button
                variant="primary"
                onClick={onComplete}
                disabled={!isReadyToProceed}
                style={{
                  padding: '0.85rem 1.8rem',
                  fontSize: '1.05rem',
                  fontWeight: 700,
                  background: isReadyToProceed ? '#0284C7' : '#94A3B8',
                  boxShadow: isReadyToProceed ? '0 4px 14px rgba(2, 132, 199, 0.25)' : 'none',
                  cursor: isReadyToProceed ? 'pointer' : 'not-allowed',
                  opacity: isReadyToProceed ? 1 : 0.65,
                }}
                title={!isReadyToProceed ? 'Lengkapi dugaan Fase 2, data Fase 4, dan lulus KPS untuk klaim kelulusan Bab 3' : 'Tandai Selesai Bab 3'}
              >
                {isCompleted
                  ? '✓ Bab 3 Selesai (Lanjut Bab 4 →)'
                  : (isReadyToProceed ? 'Selesaikan Bab 3 (+XP) & Lanjut Bab 4 →' : 'Tuntaskan Latihan untuk Klaim XP')}
              </Button>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
