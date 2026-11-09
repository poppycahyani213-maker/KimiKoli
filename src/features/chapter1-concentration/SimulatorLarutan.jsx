import React, { useState, useId } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import solutesData from '../../data/solutes.json';
import { calculateMolality, calculateMoleFractions } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';

// Hanya tampilkan zat nonelektrolit di Bab 1 (Urea, Glukosa, Sukrosa)
const NON_ELECTROLYTE_SOLUTES = solutesData.filter(s => s.type === 'non-electrolyte');

// Pola koordinat sebaran partikel terlarut di dalam cairan bejana (0 - 100%)
const PARTICLE_SEEDS = [
  { x: 30, y: 78 }, { x: 50, y: 32 }, { x: 72, y: 64 }, { x: 26, y: 46 },
  { x: 62, y: 84 }, { x: 42, y: 22 }, { x: 80, y: 42 }, { x: 36, y: 62 },
  { x: 76, y: 76 }, { x: 22, y: 72 }, { x: 66, y: 26 }, { x: 46, y: 52 },
  { x: 84, y: 62 }, { x: 32, y: 36 }, { x: 56, y: 72 }, { x: 70, y: 88 },
  { x: 18, y: 56 }, { x: 52, y: 92 }, { x: 78, y: 22 }, { x: 40, y: 74 },
  { x: 60, y: 42 }, { x: 26, y: 88 }, { x: 74, y: 52 }, { x: 34, y: 24 },
  { x: 86, y: 82 }, { x: 44, y: 86 }, { x: 64, y: 62 }, { x: 22, y: 34 },
  { x: 54, y: 16 }, { x: 68, y: 36 }, { x: 32, y: 52 }, { x: 82, y: 72 },
  { x: 52, y: 62 }, { x: 38, y: 42 }, { x: 64, y: 78 }, { x: 26, y: 64 },
  { x: 74, y: 32 }, { x: 36, y: 82 }, { x: 58, y: 94 }, { x: 46, y: 32 }
];

// Daftar Misi Tantangan Pembuatan Larutan
const MISSION_LIST = [
  { id: 1, soluteId: 'glucose', soluteName: 'Glukosa', targetMolality: 0.20, hint: 'Contoh: 18 g glukosa dalam 500 g air' },
  { id: 2, soluteId: 'urea', soluteName: 'Urea', targetMolality: 0.50, hint: 'Contoh: 6 g urea dalam 200 g air' },
  { id: 3, soluteId: 'sucrose', soluteName: 'Sukrosa (Gula Pasir)', targetMolality: 0.10, hint: 'Contoh: 17,1 g sukrosa dalam 500 g air' },
  { id: 4, soluteId: 'urea', soluteName: 'Urea', targetMolality: 1.00, hint: 'Contoh: 30 g urea dalam 500 g air' },
  { id: 5, soluteId: 'glucose', soluteName: 'Glukosa', targetMolality: 0.40, hint: 'Contoh: 36 g glukosa dalam 500 g air' }
];

/**
 * Komponen SimulatorLarutan
 * 
 * Simulator interaktif pembuatan larutan virtual untuk Bab 1:
 * - Menampilkan HANYA zat nonelektrolit (Glukosa, Urea, Sukrosa)
 * - Slider dan kontrol yang lebih besar, lega, dan elegan
 * - Ilustrasi SVG Gelas Kimia dinamis:
 *   - Tinggi permukaan cairan mengikuti massa air (pelarut)
 *   - Kerapatan dan jumlah titik partikel mengikuti jumlah mol zat terlarut
 * - Menampilkan 4 metrik utama: mol terlarut, molalitas, fraksi mol terlarut, fraksi mol pelarut
 * - Baris perhitungan eksplisit: m = (massa/Mr) / (p/1000)
 * - Misi tantangan interaktif dengan tombol "Cek larutanku" (toleransi ±0,02) & "Misi baru"
 */
export default function SimulatorLarutan({ onMisiSelesai }) {
  const soluteSelectId = useId();
  const soluteMassId = useId();
  const solventMassId = useId();

  // State Kontrol Komposisi
  const [selectedSoluteId, setSelectedSoluteId] = useState(NON_ELECTROLYTE_SOLUTES[0].id);
  const [massSolute, setMassSolute] = useState(18); // Default 18 g glukosa
  const [massSolvent, setMassSolvent] = useState(500); // Default 500 g air

  // State Misi Tantangan
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [missionFeedback, setMissionFeedback] = useState(null); // { type: 'success' | 'too-high' | 'too-low' | 'wrong-solute', text: string }

  const currentMission = MISSION_LIST[currentMissionIndex];
  const selectedSolute = NON_ELECTROLYTE_SOLUTES.find(s => s.id === selectedSoluteId) || NON_ELECTROLYTE_SOLUTES[0];

  // Perhitungan Kimiawi
  const molesSolute = massSolute / selectedSolute.mr;
  const molality = calculateMolality(massSolute, selectedSolute.mr, massSolvent);
  const fractions = calculateMoleFractions(massSolute, selectedSolute.mr, massSolvent, 18);
  const molesSolvent = massSolvent / 18;

  // Dinamika Visual Gelas Kimia (SVG)
  // Massa air 100 g - 1000 g dikonversi ke tinggi cairan 45px - 155px
  const liquidHeight = 45 + ((massSolvent - 100) / 900) * 110;
  const liquidY = 220 - liquidHeight;

  // Jumlah partikel terlarut yang digambar (3 s.d. 40 butir sesuai mol)
  const particleCount = Math.min(40, Math.max(3, Math.round(molesSolute * 60)));

  // Handler Cek Misi
  const handleCheckMission = () => {
    // 1. Cek jenis zat
    if (selectedSoluteId !== currentMission.soluteId) {
      setMissionFeedback({
        type: 'wrong-solute',
        text: `⚠️ Zat belum sesuai! Misi meminta ${currentMission.soluteName}, saat ini kamu memilih ${selectedSolute.name}. Silakan ganti jenis zat pada pilihan di atas.`
      });
      return;
    }

    // 2. Cek nilai molalitas (toleransi ±0,02)
    const diff = molality - currentMission.targetMolality;
    if (Math.abs(diff) <= 0.02) {
      setMissionFeedback({
        type: 'success',
        text: `🎉 Tepat sekali! Larutanmu memiliki konsentrasi ${formatIndonesianNumber(molality, 3)} m (target: ${formatIndonesianNumber(currentMission.targetMolality, 2)} ± 0,02 m). Kerja bagus!`
      });
      // Panggil callback misi selesai jika disediakan (tanpa menambah XP)
      if (typeof onMisiSelesai === 'function') {
        onMisiSelesai();
      }
    } else if (diff > 0.02) {
      setMissionFeedback({
        type: 'too-high',
        text: `⚠️ Terlalu pekat: kurangi zat atau tambah air (saat ini ${formatIndonesianNumber(molality, 3)} m, target ${formatIndonesianNumber(currentMission.targetMolality, 2)} m).`
      });
    } else {
      setMissionFeedback({
        type: 'too-low',
        text: `⚠️ Terlalu encer: tambah zat atau kurangi air (saat ini ${formatIndonesianNumber(molality, 3)} m, target ${formatIndonesianNumber(currentMission.targetMolality, 2)} m).`
      });
    }
  };

  // Handler Ganti Misi Baru
  const handleNewMission = () => {
    let nextIdx = (currentMissionIndex + 1) % MISSION_LIST.length;
    setCurrentMissionIndex(nextIdx);
    setMissionFeedback(null);
  };

  return (
    <div style={{ marginBottom: '2.5rem', fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Simulator Pembuat Larutan Virtual"
        subtitle="Laboratorium interaktif: racik komposisi zat nonelektrolit dan amati perubahan konsentrasi secara langsung"
      >
        {/* =========================================================
            BAGIAN ATAS: MISI TANTANGAN INTERAKTIF
            ========================================================= */}
        <div style={{
          background: '#F0F9FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.05)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '0.65rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🎯</span>
              <strong style={{ fontSize: '1.05rem', color: '#0369A1' }}>
                Misi Tantangan Laboratorium
              </strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Button
                variant="primary"
                onClick={handleCheckMission}
                style={{
                  padding: '0.5rem 1.15rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  background: '#0284C7',
                  boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
                }}
              >
                Cek Larutanku ✓
              </Button>
              <button
                type="button"
                onClick={handleNewMission}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: '#475569',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer'
                }}
              >
                Misi Baru ↻
              </button>
            </div>
          </div>

          <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: '#0F172A', fontWeight: 700 }}>
            Tugasmu: <span style={{ color: '#0284C7', textDecoration: 'underline' }}>
              Buat larutan {currentMission.soluteName} {formatIndonesianNumber(currentMission.targetMolality, 2)} molal
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500, marginLeft: '0.5rem' }}>
              (Toleransi ±0,02 m)
            </span>
          </p>

          {/* Kotak Umpan Balik Misi */}
          {missionFeedback && (
            <div
              className="fade-in"
              style={{
                marginTop: '0.85rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                fontSize: '0.92rem',
                fontWeight: 600,
                lineHeight: 1.5,
                background: missionFeedback.type === 'success'
                  ? '#ECFDF5'
                  : missionFeedback.type === 'too-high'
                    ? '#FFFBEB'
                    : '#FEF2F2',
                color: missionFeedback.type === 'success'
                  ? '#065F46'
                  : missionFeedback.type === 'too-high'
                    ? '#92400E'
                    : '#991B1B',
                border: `1.5px solid ${
                  missionFeedback.type === 'success'
                    ? '#A7F3D0'
                    : missionFeedback.type === 'too-high'
                      ? '#FDE68A'
                      : '#FECACA'
                }`
              }}
            >
              {missionFeedback.text}
            </div>
          )}
        </div>

        {/* =========================================================
            BAGIAN UTAMA: PANEL KONTROL & VISUAL GELAS KIMIA
            ========================================================= */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* KOLOM KIRI: KONTROL INPUT SLIDER & DROPDOWN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {/* 1. Pilih Zat Terlarut Nonelektrolit */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1.15rem'
            }}>
              <label htmlFor={soluteSelectId} style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
                1. Pilih Zat Terlarut (Nonelektrolit)
              </label>
              <select
                id={soluteSelectId}
                value={selectedSoluteId}
                onChange={(e) => {
                  setSelectedSoluteId(e.target.value);
                  setMissionFeedback(null);
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1.02rem',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  cursor: 'pointer',
                  fontFamily: "'Times New Roman', Times, serif",
                  outline: 'none',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)'
                }}
              >
                {NON_ELECTROLYTE_SOLUTES.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.formula}) — Mr = {s.mr} g/mol
                  </option>
                ))}
              </select>
              <div style={{ marginTop: '0.4rem', fontSize: '0.82rem', color: '#64748B' }}>
                ℹ️ {selectedSolute.description}
              </div>
            </div>

            {/* 2. Slider Massa Zat Terlarut */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1.15rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label htmlFor={soluteMassId} style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  2. Massa Zat Terlarut ({selectedSolute.formula})
                </label>
                <span style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#D97706',
                  background: '#FEF3C7',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '8px'
                }}>
                  {massSolute} gram
                </span>
              </div>
              <input
                id={soluteMassId}
                type="range"
                min="2"
                max="100"
                step="1"
                value={massSolute}
                onChange={(e) => {
                  setMassSolute(Number(e.target.value));
                  setMissionFeedback(null);
                }}
                style={{
                  width: '100%',
                  height: '8px',
                  accentColor: '#D97706',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                <span>2 gram</span>
                <span>50 gram</span>
                <span>100 gram</span>
              </div>
            </div>

            {/* 3. Slider Massa Pelarut Air */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '1.15rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label htmlFor={solventMassId} style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  3. Massa Pelarut Air (p)
                </label>
                <span style={{
                  fontSize: '1.15rem',
                  fontWeight: 900,
                  color: '#0284C7',
                  background: '#E0F2FE',
                  padding: '0.2rem 0.75rem',
                  borderRadius: '8px'
                }}>
                  {massSolvent} gram ({formatIndonesianNumber(massSolvent / 1000, 2)} kg)
                </span>
              </div>
              <input
                id={solventMassId}
                type="range"
                min="100"
                max="1000"
                step="25"
                value={massSolvent}
                onChange={(e) => {
                  setMassSolvent(Number(e.target.value));
                  setMissionFeedback(null);
                }}
                style={{
                  width: '100%',
                  height: '8px',
                  accentColor: '#0284C7',
                  cursor: 'pointer'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                <span>100 g (0,1 kg)</span>
                <span>500 g (0,5 kg)</span>
                <span>1000 g (1,0 kg)</span>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: ILUSTRASI GELAS KIMIA DINAMIS (SVG) */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
            position: 'relative'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '0.75rem',
              fontSize: '0.85rem'
            }}>
              <span style={{ fontWeight: 700, color: '#475569' }}>
                🧪 Representasi Gelas Kimia 1000 mL
              </span>
              <span style={{ color: '#0284C7', fontWeight: 800 }}>
                {massSolvent} mL Air • {particleCount} Titik Partikel
              </span>
            </div>

            {/* SVG Gelas Kimia Interaktif */}
            <svg
              viewBox="0 0 220 260"
              style={{
                width: '100%',
                maxWidth: '240px',
                height: 'auto',
                display: 'block',
                overflow: 'visible'
              }}
              aria-label="Visualisasi gelas kimia interaktif larutan"
            >
              <defs>
                {/* Gradien Cairan Larutan Bening Kebiruan */}
                <linearGradient id="beakerLiquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
                </linearGradient>

                {/* Gradien Dinding Kaca Beaker */}
                <linearGradient id="beakerGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#94A3B8" />
                  <stop offset="25%" stopColor="#E2E8F0" />
                  <stop offset="75%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
              </defs>

              {/* Dinding Kaca Belakang Gelas Kimia */}
              <path
                d="M 35 45 L 35 220 Q 35 235 50 235 L 170 235 Q 185 235 185 220 L 185 45"
                fill="#F8FAFC"
                stroke="#E2E8F0"
                strokeWidth="2"
              />

              {/* Garis Skala Ukur di Dinding Gelas Kimia (100 - 1000 mL) */}
              {[
                { val: 1000, y: 70 },
                { val: 800, y: 103 },
                { val: 600, y: 136 },
                { val: 400, y: 169 },
                { val: 200, y: 202 }
              ].map(tick => (
                <g key={tick.val}>
                  <line x1="37" y1={tick.y} x2="58" y2={tick.y} stroke="#CBD5E1" strokeWidth="1.8" />
                  <text x="62" y={tick.y + 4} fontSize="9" fill="#94A3B8" fontWeight="600" fontFamily="'Times New Roman', Times, serif">
                    {tick.val} mL
                  </text>
                </g>
              ))}

              {/* Cairan Larutan (Ketinggian naik-turun halus sesuai massa air) */}
              <rect
                x="38"
                y={liquidY}
                width="144"
                height={liquidHeight}
                rx="6"
                fill="url(#beakerLiquidGrad)"
                style={{
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />

              {/* Meniscus / Permukaan Cekung Cairan */}
              <ellipse
                cx="110"
                cy={liquidY}
                rx="72"
                ry="5"
                fill="#7DD3FC"
                stroke="#38BDF8"
                strokeWidth="1"
                style={{
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />

              {/* Titik Partikel Zat Terlarut (Jumlah titik mengikuti mol zat terlarut) */}
              <g fill="#FDE047" stroke="#B45309" strokeWidth="0.8">
                {PARTICLE_SEEDS.slice(0, particleCount).map((p, idx) => {
                  const cx = 45 + (p.x / 100) * 130;
                  const cy = liquidY + 12 + (p.y / 100) * (liquidHeight - 22);

                  return (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r="3.2"
                      style={{
                        transition: 'cy 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    />
                  );
                })}
              </g>

              {/* Pantulan Refleksi Kaca Depan */}
              <path d="M 44 55 L 44 215" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

              {/* Dinding Kaca Depan & Spout (Bibir Tuang) */}
              <path
                d="M 26 45 L 35 45 L 35 220 Q 35 235 50 235 L 170 235 Q 185 235 185 220 L 185 45 L 194 45"
                fill="none"
                stroke="url(#beakerGlassGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Label Status Konsentrasi di Bawah Cairan */}
              <text x="110" y="250" textAnchor="middle" fontSize="10" fontWeight="700" fill="#475569" fontFamily="'Times New Roman', Times, serif">
                {molality > 0.8 ? '🔥 Larutan Pekat' : molality < 0.25 ? '💧 Larutan Encer' : '⚖️ Larutan Sedang'}
              </text>
            </svg>

            <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#64748B', textAlign: 'center' }}>
              Titik kuning mewakili partikel molekul <strong>{selectedSolute.name}</strong> terlarut homogen di dalam pelarut air.
            </div>
          </div>
        </div>

        {/* =========================================================
            BAGIAN BAWAH: 4 ANGKA HASIL & BARIS PERHITUNGAN
            ========================================================= */}
        {/* 1. Baris Perhitungan Rumus Eksplisit */}
        <div style={{
          marginTop: '2rem',
          background: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          borderLeft: '5px solid #0284C7',
          borderRadius: '10px',
          padding: '1rem 1.25rem',
          fontSize: '0.98rem'
        }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369A1', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            📐 Baris Perhitungan Molalitas:
          </div>
          <div style={{ color: '#0F172A', fontWeight: 800, fontSize: '1.05rem', wordBreak: 'break-word' }}>
            m = ({massSolute} / {selectedSolute.mr}) / ({massSolvent} / 1000) = {formatIndonesianNumber(molesSolute, 3)} mol / {formatIndonesianNumber(massSolvent / 1000, 3)} kg = <span style={{ color: '#0284C7', fontSize: '1.2rem' }}>{formatIndonesianNumber(molality, 3)} m</span>
          </div>
        </div>

        {/* 2. Grid 4 Metrik Angka Hasil */}
        <div style={{
          marginTop: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {/* Metrik 1: Mol Zat Terlarut */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>
              1. Mol Terlarut (nt)
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#D97706', marginTop: '0.2rem' }}>
              {formatIndonesianNumber(molesSolute, 3)} mol
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.2rem' }}>
              nt = {massSolute} g / {selectedSolute.mr}
            </div>
          </div>

          {/* Metrik 2: Molalitas */}
          <div style={{
            background: '#F0F9FF',
            border: '2px solid #0284C7',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.1)'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#0369A1', fontWeight: 800 }}>
              2. Molalitas (m) ★
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0284C7', marginTop: '0.2rem' }}>
              {formatIndonesianNumber(molality, 3)} m
            </div>
            <div style={{ fontSize: '0.78rem', color: '#0369A1', marginTop: '0.2rem' }}>
              m = nt / p (kg air)
            </div>
          </div>

          {/* Metrik 3: Fraksi Mol Terlarut */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>
              3. Fraksi Mol Terlarut (Xt)
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#7C3AED', marginTop: '0.2rem' }}>
              {formatIndonesianNumber(fractions.xSolute, 4)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.2rem' }}>
              Xt = nt / (nt + np)
            </div>
          </div>

          {/* Metrik 4: Fraksi Mol Pelarut */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '1rem',
            boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>
              4. Fraksi Mol Pelarut (Xp)
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669', marginTop: '0.2rem' }}>
              {formatIndonesianNumber(fractions.xSolvent, 4)}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '0.2rem' }}>
              Xp = 1 − Xt ({formatIndonesianNumber(molesSolvent, 2)} mol air)
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
