import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import solutesData from '../../data/solutes.json';
import { calculateMolality, calculateMoleFractions, calculateBoilingPointElevation } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';

// Pelarut air
const KB_WATER = 0.52;
const NORMAL_TB_WATER = 100.0;
const P0_WATER_25C = 23.76; // mmHg pada 25°C

export default function SimulatorUapDidih({ onSimulasiSelesai }) {
  // Pilihan Zat Terlarut
  const [selectedSoluteId, setSelectedSoluteId] = useState('glucose');
  const [massSolute, setMassSolute] = useState(18); // gram
  const [massWater, setMassWater] = useState(250); // gram
  const [temperature, setTemperature] = useState(25); // °C
  const [isHeating, setIsHeating] = useState(false);
  const [simCompleted, setSimCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState('experiment'); // 'experiment' | 'comparison'

  const selectedSolute = solutesData.find(s => s.id === selectedSoluteId) || solutesData[0];
  const vantHoff = selectedSolute.type === 'strong-electrolyte' ? selectedSolute.ions : 1;

  // Kalkulasi Kimia
  const molesSolute = massSolute / selectedSolute.mr;
  const molality = calculateMolality(massSolute, selectedSolute.mr, massWater);
  const { deltaTb, boilingPoint } = calculateBoilingPointElevation(KB_WATER, molality, vantHoff, NORMAL_TB_WATER);
  const fractions = calculateMoleFractions(massSolute, selectedSolute.mr, massWater, 18, vantHoff);

  // Perkiraan Tekanan Uap sebagai fungsi suhu Clausius-Clapeyron sederhana
  // P0(T) pada air: di 25°C = 23.76, di 100°C = 760 mmHg
  const p0AtTemp = Math.min(850, Math.max(10, P0_WATER_25C * Math.exp(0.045 * (temperature - 25))));
  const deltaP = fractions.xSolute * p0AtTemp;
  const pSolution = Math.max(0, p0AtTemp - deltaP);

  // Status mendidih: jika suhu larutan >= titik didihnya
  const isBoiling = temperature >= boilingPoint;

  // Timer pemanas otomatis
  const heatingIntervalRef = useRef(null);
  useEffect(() => {
    if (isHeating) {
      heatingIntervalRef.current = setInterval(() => {
        setTemperature(prev => {
          if (prev >= 106) {
            setIsHeating(false);
            return 106;
          }
          return Math.round((prev + 0.5) * 10) / 10;
        });
      }, 100);
    } else {
      if (heatingIntervalRef.current) clearInterval(heatingIntervalRef.current);
    }
    return () => {
      if (heatingIntervalRef.current) clearInterval(heatingIntervalRef.current);
    };
  }, [isHeating]);

  // Efek visual partikel uap dan gelembung
  const surfaceBlockersCount = Math.min(18, Math.max(2, Math.round(fractions.xSolute * 150) + 2));
  const vaporMoleculesCount = Math.min(24, Math.max(2, Math.round((pSolution / 760) * 22) + 3));

  const handleFinishSimulation = () => {
    setSimCompleted(true);
    if (typeof onSimulasiSelesai === 'function') {
      onSimulasiSelesai();
    }
  };

  return (
    <div style={{ marginBottom: '2.5rem', fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Laboratorium Simulasi: Penguapan & Kenaikan Titik Didih"
        subtitle="Eksplorasi interaktif bagaimana partikel zat terlarut menghalangi molekul pelarut dan menggeser titik didih larutan"
      >
        {/* BANNER STATUS SELESAI SIMULASI */}
        {simCompleted && (
          <div
            className="fade-in"
            style={{
              background: '#ECFDF5',
              border: '2px solid #10B981',
              borderRadius: '12px',
              padding: '0.9rem 1.25rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🎉</span>
              <div>
                <strong style={{ color: '#065F46', fontSize: '1.02rem', display: 'block' }}>
                  Simulasi Berhasil Diselesaikan!
                </strong>
                <span style={{ color: '#047857', fontSize: '0.88rem' }}>
                  Kamu telah mengamati fenomena penurunan tekanan uap dan pergeseran titik didih larutan.
                </span>
              </div>
            </div>
            <span style={{
              background: '#10B981',
              color: '#FFFFFF',
              padding: '0.25rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.82rem',
              fontWeight: 800
            }}>
              ✓ Syarat Simulasi Terpenuhi
            </span>
          </div>
        )}

        {/* TAMPILAN 2 KOLOM: PANEL KONTROL & VISUALISASI BEJANA */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          alignItems: 'start'
        }}>
          {/* KOLOM 1: KONTROL REAGAN & PEMANAS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* 1. Pilih Zat Terlarut */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>
                1. Pilih Jenis Zat Terlarut:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                {solutesData.slice(0, 4).map(solute => {
                  const isSelected = selectedSoluteId === solute.id;
                  return (
                    <button
                      key={solute.id}
                      type="button"
                      onClick={() => setSelectedSoluteId(solute.id)}
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderRadius: '8px',
                        border: isSelected ? '2px solid #0284C7' : '1px solid #CBD5E1',
                        background: isSelected ? '#F0F9FF' : '#FFFFFF',
                        color: isSelected ? '#0369A1' : '#475569',
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        fontFamily: "'Times New Roman', Times, serif"
                      }}
                    >
                      <div>{solute.name.split('(')[0].trim()}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '0.15rem' }}>
                        {solute.type === 'strong-electrolyte' ? `Elektrolit (i = ${solute.ions})` : 'Nonelektrolit (i = 1)'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Slider Massa Zat Terlarut */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>
                  2. Massa Zat Terlarut ({selectedSolute.name.split('(')[0].trim()}):
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#D97706' }}>
                  {massSolute} gram
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="2"
                value={massSolute}
                onChange={(e) => setMassSolute(Number(e.target.value))}
                className="slider-input"
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                <span>0 g (Air murni)</span>
                <span>30 g</span>
                <span>60 g</span>
              </div>
            </div>

            {/* 3. Slider Massa Pelarut Air */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>
                  3. Massa Pelarut Air (p):
                </span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0284C7' }}>
                  {massWater} gram ({massWater / 1000} kg)
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="500"
                step="25"
                value={massWater}
                onChange={(e) => setMassWater(Number(e.target.value))}
                className="slider-input"
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '0.2rem' }}>
                <span>100 g</span>
                <span>250 g</span>
                <span>500 g</span>
              </div>
            </div>

            {/* 4. Kontrol Pemanasan Suhu Cairan */}
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', padding: '1rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#991B1B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>🔥</span> Suhu Bejana Larutan:
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: temperature >= 100 ? '#DC2626' : '#B91C1C' }}>
                  {temperature.toFixed(1)} °C
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="106"
                step="0.5"
                value={temperature}
                onChange={(e) => {
                  setTemperature(Number(e.target.value));
                  if (isHeating) setIsHeating(false);
                }}
                className="slider-input"
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsHeating(!isHeating)}
                  style={{
                    flex: 1,
                    padding: '0.55rem 0.85rem',
                    background: isHeating ? '#EF4444' : '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)'
                  }}
                >
                  <span>{isHeating ? '⏸ Jeda Pemanas' : '🔥 Nyalakan Pemanas'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsHeating(false);
                    setTemperature(25);
                  }}
                  style={{
                    padding: '0.55rem 0.85rem',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#475569',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Dinginkan (25°C)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsHeating(false);
                    setTemperature(Math.round(boilingPoint * 10) / 10);
                  }}
                  style={{
                    padding: '0.55rem 0.85rem',
                    background: '#FEE2E2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  Set ke Titik Didih
                </button>
              </div>
            </div>
          </div>

          {/* KOLOM 2: ILUSTRASI VISUAL SVG DAN DATA FISIK */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* KARTU VISUALISASI BEJANA SVG */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '16px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#334155' }}>
                  🔭 Tampilan Mikroskopik & Makroskopik Bejana
                </span>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '6px',
                  background: isBoiling ? '#FEE2E2' : '#EFF6FF',
                  color: isBoiling ? '#DC2626' : '#1D4ED8'
                }}>
                  {isBoiling ? '💨 SEDANG MENDIDIH!' : '💧 Fase Cair (Belum Mendidih)'}
                </span>
              </div>

              {/* BEJANA SVG */}
              <div style={{ width: '100%', height: '260px', display: 'flex', justifyContent: 'center' }}>
                <svg viewBox="0 0 340 260" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Latar Ruang Gas Uap */}
                  <rect x="70" y="30" width="200" height="180" rx="14" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2.5" />

                  {/* Cairan Larutan */}
                  <rect
                    x="72"
                    y="110"
                    width="196"
                    height="98"
                    rx="10"
                    fill="url(#liquidGradient)"
                    opacity="0.85"
                  />

                  {/* Gradients & Filters 3D */}
                  <defs>
                    <linearGradient id="liquidGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.75" />
                      <stop offset="40%" stopColor="#0EA5E9" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#0284C7" stopOpacity="0.95" />
                    </linearGradient>
                    <radialGradient id="waterOrb3d" cx="35%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#E0F2FE" />
                      <stop offset="30%" stopColor="#38BDF8" />
                      <stop offset="75%" stopColor="#0284C7" />
                      <stop offset="100%" stopColor="#075985" />
                    </radialGradient>
                    <radialGradient id="soluteOrb3d" cx="32%" cy="28%" r="68%">
                      <stop offset="0%" stopColor="#FFE4E6" />
                      <stop offset="25%" stopColor="#FB7185" />
                      <stop offset="70%" stopColor="#E11D48" />
                      <stop offset="100%" stopColor="#881337" />
                    </radialGradient>
                    <radialGradient id="bubble3d" cx="35%" cy="35%" r="65%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                      <stop offset="45%" stopColor="#BAE6FD" stopOpacity="0.5" />
                      <stop offset="90%" stopColor="#38BDF8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
                    </radialGradient>
                    <linearGradient id="fireGradient" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="40%" stopColor="#F59E0B" />
                      <stop offset="80%" stopColor="#FEF08A" />
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.8" />
                    </linearGradient>
                    <filter id="neonSoluteGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Garis Permukaan Cairan */}
                  <line x1="72" y1="110" x2="268" y2="110" stroke="#0369A1" strokeWidth="2.5" strokeDasharray="4,3" />

                  {/* Partikel Uap di Udara (Penurunan Tekanan Uap) - 3D Sphere */}
                  {Array.from({ length: vaporMoleculesCount }).map((_, idx) => {
                    const posX = 90 + ((idx * 37) % 160);
                    const posY = 45 + ((idx * 23) % 55);
                    return (
                      <g key={`vapor-${idx}`} className="fade-in">
                        <circle cx={posX} cy={posY} r="5.5" fill="url(#waterOrb3d)" filter="drop-shadow(0 2px 4px rgba(2,132,199,0.4))" />
                        <circle cx={posX - 1.5} cy={posY - 1.5} r="1.8" fill="#FFFFFF" opacity="0.9" />
                      </g>
                    );
                  })}

                  {/* Partikel Terlarut Penghalang di Permukaan (Barrier Sifat Koligatif) - 3D Spheres Glowing */}
                  {Array.from({ length: surfaceBlockersCount }).map((_, idx) => {
                    const blockerX = 82 + idx * (180 / Math.max(1, surfaceBlockersCount));
                    return (
                      <g key={`blocker-${idx}`} filter="url(#neonSoluteGlow)">
                        <circle cx={blockerX} cy="110" r="7.5" fill="url(#soluteOrb3d)" stroke="#FFFFFF" strokeWidth="1.5" />
                        <circle cx={blockerX - 2.5} cy="107.5" r="2.2" fill="#FFFFFF" opacity="0.95" />
                        <text x={blockerX} y="112.5" fontSize="6.5" fontWeight="900" textAnchor="middle" fill="#FFFFFF">×</text>
                      </g>
                    );
                  })}

                  {/* Partikel Terlarut di Kedalaman Cairan - 3D Spheres */}
                  {Array.from({ length: Math.min(16, surfaceBlockersCount) }).map((_, idx) => {
                    const px = 95 + ((idx * 43) % 150);
                    const py = 125 + ((idx * 27) % 70);
                    return (
                      <g key={`deep-${idx}`}>
                        <circle cx={px} cy={py} r="6.5" fill="url(#soluteOrb3d)" stroke="#FFFFFF" strokeWidth="1" filter="drop-shadow(0 2px 6px rgba(225,29,72,0.4))" />
                        <circle cx={px - 2} cy={py - 2} r="2" fill="#FFFFFF" opacity="0.9" />
                      </g>
                    );
                  })}

                  {/* Gelembung Mendidih 3D (Boiling Bubbles) jika isBoiling */}
                  {isBoiling && (
                    <g>
                      <circle cx="110" cy="180" r="9" fill="url(#bubble3d)" stroke="#FFFFFF" strokeWidth="1" />
                      <circle cx="115" cy="140" r="12" fill="url(#bubble3d)" stroke="#FFFFFF" strokeWidth="1.5" />
                      <circle cx="170" cy="190" r="8" fill="url(#bubble3d)" stroke="#FFFFFF" strokeWidth="1" />
                      <circle cx="165" cy="150" r="14" fill="url(#bubble3d)" stroke="#FFFFFF" strokeWidth="1.5" />
                      <circle cx="172" cy="120" r="11" fill="url(#bubble3d)" stroke="#FFFFFF" strokeWidth="1.5" />
                      <circle cx="225" cy="175" r="10" fill="url(#bubble3d)" stroke="#FFFFFF" strokeWidth="1" />
                      <circle cx="230" cy="135" r="15" fill="url(#bubble3d)" stroke="#FFFFFF" strokeWidth="1.5" />
                      <rect x="75" y="65" width="190" height="26" rx="6" fill="rgba(254, 242, 242, 0.95)" stroke="#F87171" strokeWidth="1.5" />
                      <text x="170" y="82" fontSize="10.5" fontWeight="900" textAnchor="middle" fill="#DC2626">
                        🔥 Tekanan Uap = 1 atm (MENDIDIH)
                      </text>
                    </g>
                  )}

                  {/* Nyala Api Bunsen jika isHeating */}
                  {isHeating && (
                    <g>
                      <path d="M 140 240 Q 170 205 200 240 Z" fill="url(#fireGradient)" />
                      <path d="M 152 240 Q 170 215 188 240 Z" fill="#38BDF8" opacity="0.8" />
                    </g>
                  )}
                  {/* Dudukan Tungku Kasa */}
                  <rect x="120" y="240" width="100" height="6" fill="#475569" rx="2" />
                  <line x1="130" y1="246" x2="120" y2="258" stroke="#475569" strokeWidth="3" />
                  <line x1="210" y1="246" x2="220" y2="258" stroke="#475569" strokeWidth="3" />
                </svg>
              </div>

              {/* Legenda Visual 3D */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1.25rem',
                flexWrap: 'wrap',
                marginTop: '0.65rem',
                fontSize: '0.82rem',
                color: '#334155',
                borderTop: '1px solid #E2E8F0',
                paddingTop: '0.65rem'
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 30%, #E0F2FE 0%, #38BDF8 30%, #0284C7 70%, #0369A1 100%)',
                    boxShadow: '0 2px 5px rgba(2, 132, 199, 0.4), inset 1px 1px 2px #FFFFFF',
                    display: 'inline-block'
                  }} />
                  <strong style={{ color: '#0369A1' }}>Molekul Uap Air</strong>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 32% 28%, #FFE4E6 0%, #FB7185 25%, #E11D48 65%, #9F1239 100%)',
                    boxShadow: '0 0 8px rgba(244, 63, 94, 0.7), inset 1px 1px 2px #FFFFFF',
                    display: 'inline-block'
                  }} />
                  <strong style={{ color: '#BE123C' }}>Zat Terlarut Penghalang</strong>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #FFFFFF 0%, #BAE6FD 50%, #38BDF8 100%)',
                    border: '1.5px solid #0284C7',
                    display: 'inline-block'
                  }} />
                  <strong style={{ color: '#0F766E' }}>Gelembung Mendidih</strong>
                </span>
              </div>
            </div>

            {/* KARTU INDIKATOR 4 NILAI FISIK HASIL EKSPERIMEN */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem'
            }}>
              {/* Box 1: Molalitas & Fraksi Mol */}
              <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.76rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
                  Konsentrasi Larutan
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.2rem' }}>
                  {formatIndonesianNumber(molality, 2)} m
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.15rem' }}>
                  Fraksi Mol Xt: <strong>{formatIndonesianNumber(fractions.xSolute, 4)}</strong>
                </div>
              </div>

              {/* Box 2: Titik Didih Larutan */}
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.76rem', color: '#991B1B', textTransform: 'uppercase', fontWeight: 700 }}>
                  Titik Didih (Tb)
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#DC2626', marginTop: '0.2rem' }}>
                  {formatIndonesianNumber(boilingPoint, 2)} °C
                </div>
                <div style={{ fontSize: '0.78rem', color: '#7F1D1D', marginTop: '0.15rem' }}>
                  ΔTb: <strong>+{formatIndonesianNumber(deltaTb, 2)} °C</strong>
                </div>
              </div>

              {/* Box 3: Tekanan Uap Larutan pada Suhu Terukur */}
              <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '10px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.76rem', color: '#0369A1', textTransform: 'uppercase', fontWeight: 700 }}>
                  Tekanan Uap (P)
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284C7', marginTop: '0.2rem' }}>
                  {formatIndonesianNumber(pSolution, 1)} mmHg
                </div>
                <div style={{ fontSize: '0.78rem', color: '#075985', marginTop: '0.15rem' }}>
                  ΔP: <strong>−{formatIndonesianNumber(deltaP, 2)} mmHg</strong>
                </div>
              </div>

              {/* Box 4: Kondisi Mendidih (Patm = 760 mmHg) */}
              <div style={{
                background: isBoiling ? '#DCFCE7' : '#F1F5F9',
                border: isBoiling ? '1px solid #86EFAC' : '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '0.75rem'
              }}>
                <div style={{ fontSize: '0.76rem', color: isBoiling ? '#166534' : '#475569', textTransform: 'uppercase', fontWeight: 700 }}>
                  Status Tekanan Luar
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: isBoiling ? '#15803D' : '#334155', marginTop: '0.2rem' }}>
                  {isBoiling ? '✓ P_uap ≥ 1 atm' : 'P_uap < 1 atm'}
                </div>
                <div style={{ fontSize: '0.78rem', color: isBoiling ? '#166534' : '#64748B', marginTop: '0.15rem' }}>
                  {isBoiling ? 'Mendidih terbentuk' : `Butuh +${formatIndonesianNumber(Math.max(0, boilingPoint - temperature), 1)} °C`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TOMBOL TINDAKAN: SELESAIKAN SIMULASI */}
        <div style={{
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.88rem', color: '#475569' }}>
            💡 <em>Lakukan eksplorasi dengan mengatur slider atau menyalakan pemanas, lalu klik tombol di sebelah kanan untuk menyelesaikan misi simulasi.</em>
          </div>

          <Button
            variant="primary"
            onClick={handleFinishSimulation}
            style={{
              padding: '0.7rem 1.4rem',
              fontSize: '0.95rem',
              fontWeight: 700,
              background: simCompleted ? '#10B981' : '#0284C7',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
            }}
          >
            {simCompleted ? '✓ Simulasi Telah Diselesaikan' : '✓ Selesaikan Misi Simulasi Ini'}
          </Button>
        </div>
      </Card>
    </div>
  );
}

