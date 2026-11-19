import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';

// Helper kunci penyimpanan status game per akun siswa
export function getCh4GameKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch4_game_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch4_game_v1_guest';
}

// Data 6 Ronde Game "Sel dalam Bahaya!" (Isi tidak diubah)
const ROUNDS_DATA = [
  {
    id: 1,
    title: 'Sel Darah Merah dalam Air Suling (Akuades)',
    context: 'Sel darah merah dimasukkan ke dalam gelas berisi air suling murni (konsentrasi 0 M).',
    concOutside: 0.0,
    outsideLabel: '0,00 M (Air suling murni)',
    cellType: 'darah',
    correctChoice: 'menggembung',
    tonicity: 'hipotonik',
    tonicityBadge: 'Larutan Hipotonik (Lebih Encer)',
    explanation: 'Air masuk ke sel karena di dalam sel lebih pekat (0,30 M), sehingga sel menggembung dan bisa pecah (lisis).'
  },
  {
    id: 2,
    title: 'Sel Darah Merah dalam Infus Glukosa 5%',
    context: 'Sel darah merah dimasukkan ke dalam cairan infus glukosa medis standar konsentrasi 5% (0,30 M).',
    concOutside: 0.30,
    outsideLabel: '0,30 M (Infus glukosa 5%)',
    cellType: 'darah',
    correctChoice: 'tetap',
    tonicity: 'isotonik',
    tonicityBadge: 'Larutan Isotonik (Sama Pekat)',
    explanation: 'Konsentrasi sama (0,30 M), air masuk dan keluar sel berlangsung seimbang sehingga ukuran sel tetap normal.'
  },
  {
    id: 3,
    title: 'Sel Darah Merah dalam Air Laut Pekat',
    context: 'Sel darah merah dimasukkan ke dalam air laut dengan kadar garam tinggi (sekitar 1,0 M).',
    concOutside: 1.0,
    outsideLabel: '±1,00 M (Air laut pekat)',
    cellType: 'darah',
    correctChoice: 'mengerut',
    tonicity: 'hipertonik',
    tonicityBadge: 'Larutan Hipertonik (Lebih Pekat)',
    explanation: 'Air keluar dari sel ke larutan luar yang lebih pekat, menyebabkan sel mengerut (krenasi).'
  },
  {
    id: 4,
    title: 'Sel Sayur Layu dalam Air Keran Tawar',
    context: 'Daun selada yang layu direndam ke dalam mangkuk berisi air keran tawar (konsentrasi ~0 M).',
    concOutside: 0.02,
    outsideLabel: '±0,00 M (Air keran tawar)',
    cellType: 'sayur',
    correctChoice: 'menggembung',
    tonicity: 'hipotonik',
    tonicityBadge: 'Larutan Hipotonik (Lebih Encer)',
    explanation: 'Air masuk kembali ke dalam sel sayur sehingga sel menegang (turgid) dan sayur segar kembali.'
  },
  {
    id: 5,
    title: 'Sel Akar dalam Tanah dengan Pupuk Berlebih',
    context: 'Tanaman diberi pupuk kimia terlalu banyak sehingga larutan air tanah menjadi sangat pekat (0,60 M).',
    concOutside: 0.60,
    outsideLabel: '0,60 M (Air tanah tinggi pupuk)',
    cellType: 'akar',
    correctChoice: 'mengerut',
    tonicity: 'hipertonik',
    tonicityBadge: 'Larutan Hipertonik (Lebih Pekat)',
    explanation: 'Larutan tanah terlalu pekat sehingga air keluar dari sel akar dan tanaman menjadi layu (plasmolisis).'
  },
  {
    id: 6,
    title: 'Sel Mentimun dalam Larutan Garam Acar',
    context: 'Potongan mentimun segar direndam dalam larutan garam dan cuka pekat untuk pembuatan acar (0,80 M).',
    concOutside: 0.80,
    outsideLabel: '0,80 M (Larutan garam acar)',
    cellType: 'mentimun',
    correctChoice: 'mengerut',
    tonicity: 'hipertonik',
    tonicityBadge: 'Larutan Hipertonik (Lebih Pekat)',
    explanation: 'Larutan garam pekat menarik air keluar dari sel mentimun sehingga sel mengerut dan mentimun menjadi keriput kenyal.'
  }
];

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 9 Partikel zat terlarut (oranye, r = 7) di dalam sel (cx=210, cy=135, R=52)
// Ditempatkan di bagian atas dan tengah agar tidak menimpa teks "Sel 0,30 M" di y = 163
const INSIDE_SOLUTE = [
  { x: 190, y: 114 },
  { x: 210, y: 108 },
  { x: 230, y: 114 },
  { x: 180, y: 128 },
  { x: 210, y: 125 },
  { x: 240, y: 128 },
  { x: 195, y: 142 },
  { x: 225, y: 142 },
  { x: 210, y: 146 }
];

// Kumpulan 30 posisi partikel zat terlarut (oranye, r = 7) di luar sel dalam gelas
// Semua titik memiliki jarak > 75 px dari pusat sel (210, 135), sehingga tidak menembus membran
const OUTSIDE_SOLUTE_POOL = [
  { x: 105, y: 65 }, { x: 140, y: 60 }, { x: 280, y: 60 }, { x: 315, y: 65 },
  { x: 95, y: 100 }, { x: 125, y: 95 }, { x: 295, y: 95 }, { x: 325, y: 100 },
  { x: 90, y: 135 }, { x: 120, y: 135 }, { x: 300, y: 135 }, { x: 330, y: 135 },
  { x: 95, y: 170 }, { x: 125, y: 175 }, { x: 295, y: 175 }, { x: 325, y: 170 },
  { x: 110, y: 205 }, { x: 145, y: 215 }, { x: 275, y: 215 }, { x: 310, y: 205 },
  { x: 178, y: 56 }, { x: 210, y: 55 }, { x: 242, y: 56 },
  { x: 178, y: 216 }, { x: 210, y: 220 }, { x: 242, y: 216 },
  { x: 135, y: 135 }, { x: 285, y: 135 }, { x: 155, y: 75 }, { x: 265, y: 75 }
];

// Posisi molekul air statis sebelum siswa menjawab
const STATIC_WATER = [
  // 6 di dalam sel
  { x: 196, y: 122 }, { x: 224, y: 122 }, { x: 204, y: 136 },
  { x: 216, y: 136 }, { x: 200, y: 148 }, { x: 220, y: 148 },
  // 6 di luar sel
  { x: 145, y: 105 }, { x: 275, y: 105 }, { x: 135, y: 165 },
  { x: 285, y: 165 }, { x: 210, y: 74 }, { x: 210, y: 202 }
];

export default function GameSelOsmosis({ onGameComplete, isCompletedInitially = false }) {
  // State urutan ronde teracak
  const [rounds, setRounds] = useState(() => shuffleArray(ROUNDS_DATA));
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);

  // State ronde saat ini
  const [isRoundStarted, setIsRoundStarted] = useState(false); // Timer tidak langsung berjalan
  const [userChoice, setUserChoice] = useState(null); // 'mengerut' | 'tetap' | 'menggembung' | 'timeout'
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Animasi berkelanjutan via requestAnimationFrame untuk molekul air setelah menjawab
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let animId;
    let start = Date.now();
    const frame = () => {
      if (!document.hidden) {
        setTick(Date.now() - start);
      }
      animId = requestAnimationFrame(frame);
    };
    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Status penyelesaian game tersimpan
  const [hasCompletedOnce, setHasCompletedOnce] = useState(() => {
    if (isCompletedInitially) return true;
    const key = getCh4GameKey();
    const saved = getStoredData(key, null);
    return Boolean(saved?.completedOnce);
  });

  const timerRef = useRef(null);
  const currentRound = rounds[currentRoundIdx] || rounds[0];

  // Timer 15 detik: hanya berjalan jika isRoundStarted === true dan belum menjawab
  // Timer otomatis berhenti jika tab/halaman tidak aktif (document.hidden)
  useEffect(() => {
    if (!isRoundStarted || hasAnswered || isGameOver) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      // Hentikan penambahan waktu jika siswa pindah tab / halaman tidak terlihat
      if (document.hidden) {
        return;
      }

      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRoundStarted, currentRoundIdx, hasAnswered, isGameOver]);

  const handleTimeOut = () => {
    if (hasAnswered || isGameOver) return;
    setUserChoice('timeout');
    setHasAnswered(true);
  };

  const handleStartRound = () => {
    setIsRoundStarted(true);
    setTimeLeft(15);
  };

  const handleSelect = (choice) => {
    if (!isRoundStarted || hasAnswered || isGameOver) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setUserChoice(choice);
    setHasAnswered(true);

    const isCorrect = choice === currentRound.correctChoice;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNextRound = () => {
    if (currentRoundIdx + 1 < rounds.length) {
      setCurrentRoundIdx((idx) => idx + 1);
      setIsRoundStarted(false); // Perlu klik Mulai Ronde untuk ronde berikutnya
      setUserChoice(null);
      setHasAnswered(false);
      setTimeLeft(15);
    } else {
      // Game selesai
      setIsGameOver(true);
      const finalScore = score + (userChoice === currentRound.correctChoice ? 0 : 0);
      setHasCompletedOnce(true);

      const key = getCh4GameKey();
      setStoredData(key, {
        completedOnce: true,
        lastScore: finalScore,
        completedAt: new Date().toISOString()
      });

      if (onGameComplete) {
        onGameComplete(finalScore);
      }
    }
  };

  const handleRestart = () => {
    setRounds(shuffleArray(ROUNDS_DATA));
    setCurrentRoundIdx(0);
    setIsRoundStarted(false);
    setUserChoice(null);
    setHasAnswered(false);
    setScore(0);
    setIsGameOver(false);
    setTimeLeft(15);
  };

  // ── Penentuan Skala & Panah Sel ─────────────────────────────────────
  // Ukuran sel berubah perlahan dengan animasi halus:
  // Menggembung: scale 1.25 (+25%)
  // Mengerut: scale 0.75 (-25%)
  // Tetap normal: scale 1.00
  let cellScale = 1.0;
  let arrowType = 'seimbang'; // 'masuk' | 'keluar' | 'seimbang'

  if (hasAnswered) {
    if (currentRound.correctChoice === 'menggembung') {
      cellScale = 1.25;
      arrowType = 'masuk';
    } else if (currentRound.correctChoice === 'mengerut') {
      cellScale = 0.75;
      arrowType = 'keluar';
    } else {
      cellScale = 1.0;
      arrowType = 'seimbang';
    }
  }

  // Jumlah partikel zat terlarut luar sesuai konsentrasi larutan
  const numOutsideSolute = currentRound.concOutside === 0
    ? 0
    : currentRound.concOutside <= 0.05
    ? 1
    : Math.round(currentRound.concOutside * 30);
  const outsideSoluteList = OUTSIDE_SOLUTE_POOL.slice(0, numOutsideSolute);

  // ── Molekul Air Bergerak Menembus Membran (12 Molekul) ──────────────
  // Hanya bergerak jika hasAnswered === true; sebelum dijawab, molekul air diam.
  const tSec = tick / 1000;
  const WATER_COUNT = 12;
  const streamingWaterList = [];

  if (hasAnswered) {
    for (let i = 0; i < WATER_COUNT; i++) {
      const angle = (i * (2 * Math.PI)) / WATER_COUNT;
      const phase = (tSec * 0.35 + (i / WATER_COUNT)) % 1;

      let rDist = 52;
      if (arrowType === 'masuk') {
        // Hipotonik: air bergerak dari luar (r=95) menembus membran masuk ke dalam sel (r=20)
        rDist = 95 - (phase * 75);
      } else if (arrowType === 'keluar') {
        // Hipertonik: air bergerak dari dalam sel (r=20) menembus membran keluar ke larutan (r=95)
        rDist = 20 + (phase * 75);
      } else {
        // Isotonik: masuk dan keluar seimbang (separuh masuk, separuh keluar)
        if (i % 2 === 0) {
          rDist = 95 - (phase * 75); // Masuk
        } else {
          rDist = 20 + (phase * 75); // Keluar
        }
      }

      const wx = 210 + rDist * Math.cos(angle);
      const wy = 135 + rDist * Math.sin(angle);
      streamingWaterList.push({ wx, wy });
    }
  }

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif", marginBottom: '2.5rem' }}>
      <div style={{
        background: '#FFFFFF',
        border: '1.5px solid #CBD5E1',
        borderRadius: '16px',
        padding: '1.4rem',
        boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
      }}>

        {/* ── HEADER GAME ────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '0.9rem',
          marginBottom: '1.25rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem' }}>🎮</span>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                Game 1: "Sel dalam Bahaya!"
              </h3>
            </div>
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.88rem', color: '#64748B' }}>
              Cairan di dalam sel selalu <strong>0,30 M</strong>. Prediksikan nasib sel dalam waktu 15 detik!
            </p>
          </div>

          {/* Status Selesai / Target */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 700,
            background: hasCompletedOnce ? '#ECFDF5' : '#FFFBEB',
            border: `1.5px solid ${hasCompletedOnce ? '#86EFAC' : '#FDE68A'}`,
            color: hasCompletedOnce ? '#059669' : '#B45309'
          }}>
            <span>{hasCompletedOnce ? '✓' : '🎯'}</span>
            <span>{hasCompletedOnce ? 'Misi Game Selesai' : 'Target: Mainkan hingga Selesai'}</span>
          </div>
        </div>

        {/* ── KONDISI GAME SELESAI (GAME OVER SCREEN) ─────────────────── */}
        {isGameOver ? (
          <div className="fade-in" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
            <span style={{ fontSize: '3rem', display: 'block', marginBottom: '0.5rem' }}>
              {score >= 5 ? '🏆' : score >= 3 ? '👏' : '💡'}
            </span>
            <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.5rem' }}>
              Permainan Selesai! Skor Kamu: {score}/6
            </h4>
            <p style={{ fontSize: '0.96rem', color: '#475569', marginBottom: '1.5rem' }}>
              {score === 6
                ? 'Luar biasa! Pemahamanmu tentang larutan hipotonik, isotonik, dan hipertonik sudah sempurna!'
                : score >= 4
                ? 'Bagus sekali! Kamu sudah memahami prinsip pergerakan air menembus membran sel.'
                : 'Terus berlatih! Ingat selalu arah perpindahan air menuju larutan yang lebih pekat.'}
            </p>

            {/* Kartu Ringkasan Konsep Osmosis Wajib */}
            <div style={{
              background: '#F0F9FF',
              border: '1.5px solid #BAE6FD',
              borderRadius: '14px',
              padding: '1.15rem 1.4rem',
              textAlign: 'left',
              maxWidth: '680px',
              margin: '0 auto 1.5rem',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📌</span>
                <strong style={{ fontSize: '1rem', color: '#0369A1' }}>
                  Aturan Emas Osmosis:
                </strong>
              </div>
              <p style={{ margin: '0 0 0.6rem', fontSize: '0.92rem', color: '#0C4A6E', lineHeight: 1.55 }}>
                Air selalu berpindah dari <strong>larutan yang lebih encer</strong> ke <strong>larutan yang lebih pekat</strong> melalui membran semipermeabel.
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.6rem',
                fontSize: '0.86rem'
              }}>
                <div style={{ background: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #BAE6FD' }}>
                  🔵 <strong>Hipotonik</strong> (luar lebih encer) → air masuk → <strong>sel menggembung</strong>.
                </div>
                <div style={{ background: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #BAE6FD' }}>
                  🟢 <strong>Isotonik</strong> (konsentrasi sama) → air seimbang → <strong>sel tetap</strong>.
                </div>
                <div style={{ background: '#FFFFFF', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #BAE6FD' }}>
                  🔴 <strong>Hipertonik</strong> (luar lebih pekat) → air keluar → <strong>sel mengerut</strong>.
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              onClick={handleRestart}
              style={{
                padding: '0.75rem 1.8rem',
                fontSize: '1rem',
                fontWeight: 700,
                background: '#0284C7',
                fontFamily: "'Times New Roman', Times, serif"
              }}
            >
              🔄 Main Lagi
            </Button>
          </div>
        ) : (
          /* ── TAMPILAN RONDE AKTIF ───────────────────────────────────── */
          <div>
            {/* Baris Status Ronde & Timer */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              flexWrap: 'wrap',
              gap: '0.6rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  background: '#F1F5F9',
                  color: '#475569',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1'
                }}>
                  Ronde {currentRoundIdx + 1} dari 6
                </span>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Skor: <strong>{score}</strong>
                </span>
              </div>

              {/* Timer Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: !isRoundStarted ? '#F1F5F9' : timeLeft <= 5 ? '#FEF2F2' : '#F8FAFC',
                border: `1.5px solid ${!isRoundStarted ? '#CBD5E1' : timeLeft <= 5 ? '#FCA5A5' : '#E2E8F0'}`,
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                color: !isRoundStarted ? '#64748B' : timeLeft <= 5 ? '#DC2626' : '#334155',
                fontWeight: 800,
                fontSize: '0.88rem'
              }}>
                <span>⏳</span>
                <span>
                  {!isRoundStarted ? 'Waktu: 15s (Belum Mulai)' : `Waktu: ${timeLeft}s`}
                </span>
              </div>
            </div>

            {/* Konteks Ronde */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '0.85rem 1.1rem',
              marginBottom: '1rem'
            }}>
              <h4 style={{ margin: '0 0 0.3rem', fontSize: '1.05rem', color: '#0F172A', fontWeight: 800 }}>
                {currentRound.title}
              </h4>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569', lineHeight: 1.45 }}>
                {currentRound.context}
              </p>
            </div>

            {/* ── ILUSTRASI GELAS & SEL (SVG) ─────────────────────────── */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: '#F0F9FF',
              borderRadius: '14px',
              border: '1.5px solid #BAE6FD',
              padding: '1.1rem 1rem',
              marginBottom: '1.25rem',
              position: 'relative'
            }}>
              <svg viewBox="0 0 420 270" style={{ width: '100%', maxWidth: '420px', height: 'auto', display: 'block' }}>
                <defs>
                  {/* Gradien Permukaan Cairan Luar Gelas */}
                  <linearGradient id="glassLiquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                {/* 1. GELAS LARUTAN BERLATAR BIRU MUDA */}
                <path
                  d="M 75,30 L 75,220 Q 75,242 95,242 L 325,242 Q 345,242 345,220 L 345,30"
                  fill="url(#glassLiquidGrad)"
                  stroke="#475569"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Permukaan Cairan Gelas */}
                <ellipse cx="210" cy="42" rx="135" ry="11" fill="#7DD3FC" opacity="0.65" stroke="#38BDF8" strokeWidth="1.5" />

                {/* Keterangan Konsentrasi Cairan Luar Gelas */}
                <text x="210" y="24" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369A1">
                  Larutan Luar: {currentRound.outsideLabel}
                </text>

                {/* 2. PARTIKEL ZAT TERLARUT LUAR (ORANYE LEBIH BESAR, r = 7) */}
                {/* Zat terlarut tidak pernah menembus membran */}
                {outsideSoluteList.map((p, idx) => (
                  <g key={`out-solute-${idx}`}>
                    <circle cx={p.x} cy={p.y} r="7" fill="#F97316" stroke="#C2410C" strokeWidth="1.4" />
                    <circle cx={p.x - 2} cy={p.y - 2} r="2" fill="#FED7AA" />
                  </g>
                ))}

                {/* 3. SEL: LINGKARAN BESAR DENGAN MEMBRAN PUTUS-PUTUS TEBAL (MERAH TUA) & ISI MERAH MUDA */}
                <g
                  transform={`translate(210, 135) scale(${cellScale}) translate(-210, -135)`}
                  style={{ transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                >
                  {/* Lingkaran Sel */}
                  <circle
                    cx="210"
                    cy="135"
                    r="52"
                    fill="#FFE4E6"
                    stroke="#991B1B"
                    strokeWidth="4"
                    strokeDasharray="6 4"
                  />

                  {/* 9 Partikel Zat Terlarut Tetap di Dalam Sel (Oranye, r = 7) */}
                  {/* Diletakkan di area atas & tengah agar tidak tertimpa label di bawah */}
                  {INSIDE_SOLUTE.map((p, idx) => (
                    <g key={`in-solute-${idx}`}>
                      <circle cx={p.x} cy={p.y} r="6.5" fill="#F97316" stroke="#C2410C" strokeWidth="1.3" />
                      <circle cx={p.x - 1.8} cy={p.y - 1.8} r="1.8" fill="#FED7AA" />
                    </g>
                  ))}

                  {/* Label "Sel 0,30 M" di dalam sel bagian bawah (bebas dari partikel) */}
                  <text
                    x="210"
                    y="164"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#881337"
                  >
                    Sel 0,30 M
                  </text>
                </g>

                {/* 4. MOLEKUL AIR (LINGKARAN BIRU LEBIH KECIL, r = 5) */}
                {/* Sebelum dijawab: statis. Setelah dijawab: bergerak menembus membran secara terus-menerus */}
                {!hasAnswered ? (
                  STATIC_WATER.map((p, idx) => (
                    <circle
                      key={`water-static-${idx}`}
                      cx={p.x}
                      cy={p.y}
                      r="4.8"
                      fill="#0284C7"
                      stroke="#0369A1"
                      strokeWidth="1"
                    />
                  ))
                ) : (
                  streamingWaterList.map((p, idx) => (
                    <circle
                      key={`water-stream-${idx}`}
                      cx={p.wx}
                      cy={p.wy}
                      r="4.8"
                      fill="#0284C7"
                      stroke="#0369A1"
                      strokeWidth="1"
                    />
                  ))
                )}

                {/* 5. PANAH BESAR (TEBAL ±5PX DENGAN KEPALA SEGITIGA) DI 8 TITIK MENGELILINGI SEL */}
                {/* Hanya ditampilkan setelah siswa menjawab */}
                {hasAnswered && (
                  <g>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
                      const deg = k * 45;
                      return (
                        <g key={`arrow-${k}`} transform={`rotate(${deg}, 210, 135)`}>
                          {arrowType === 'masuk' && (
                            /* Hipotonik: Biru mengarah ke dalam (menuju pusat) */
                            <>
                              <line
                                x1="298"
                                y1="135"
                                x2="276"
                                y2="135"
                                stroke="#0284C7"
                                strokeWidth="5"
                                strokeLinecap="round"
                              />
                              <polygon points="266,135 278,129 278,141" fill="#0284C7" />
                            </>
                          )}

                          {arrowType === 'keluar' && (
                            /* Hipertonik: Merah mengarah ke luar (menjauhi pusat) */
                            <>
                              <line
                                x1="274"
                                y1="135"
                                x2="296"
                                y2="135"
                                stroke="#DC2626"
                                strokeWidth="5"
                                strokeLinecap="round"
                              />
                              <polygon points="306,135 294,129 294,141" fill="#DC2626" />
                            </>
                          )}

                          {arrowType === 'seimbang' && (
                            /* Isotonik: Hijau dua arah (dua kepala segitiga di kedua ujung) */
                            <>
                              <line
                                x1="278"
                                y1="135"
                                x2="294"
                                y2="135"
                                stroke="#16A34A"
                                strokeWidth="5"
                                strokeLinecap="round"
                              />
                              <polygon points="268,135 280,129 280,141" fill="#16A34A" />
                              <polygon points="304,135 292,129 292,141" fill="#16A34A" />
                            </>
                          )}
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>

              {/* ── LABEL KETERANGAN DI LUAR GELAS (DI BAWAH ILUSTRASI) ── */}
              {hasAnswered && (
                <div style={{
                  textAlign: 'center',
                  padding: '0.5rem 1.1rem',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  marginTop: '0.5rem',
                  background: arrowType === 'masuk' ? '#EFF6FF' : arrowType === 'keluar' ? '#FEF2F2' : '#ECFDF5',
                  color: arrowType === 'masuk' ? '#1D4ED8' : arrowType === 'keluar' ? '#DC2626' : '#059669',
                  border: `1.5px solid ${arrowType === 'masuk' ? '#BFDBFE' : arrowType === 'keluar' ? '#FECACA' : '#A7F3D0'}`,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
                }}>
                  {arrowType === 'masuk' && <span>💧 Air MASUK ke dalam sel (sel menggembung)</span>}
                  {arrowType === 'keluar' && <span>💧 Air KELUAR dari sel (sel mengerut)</span>}
                  {arrowType === 'seimbang' && <span>⚖️ Air keluar-masuk SEIMBANG (ukuran sel tetap normal)</span>}
                </div>
              )}

              {/* ── LEGENDA KECIL DI BAWAH ILUSTRASI ──────────────────── */}
              <div style={{
                fontSize: '0.84rem',
                color: '#475569',
                textAlign: 'center',
                marginTop: '0.65rem',
                fontWeight: 600
              }}>
                <span style={{ color: '#0284C7', fontWeight: 800 }}>●</span> biru = molekul air (bisa menembus membran) · <span style={{ color: '#F97316', fontWeight: 800 }}>●</span> oranye = zat terlarut (tertahan)
              </div>
            </div>

            {/* ── TOMBOL MULAI RONDE / TOMBOL PILIHAN SISWA ─────────────── */}
            {!hasAnswered ? (
              <div>
                {!isRoundStarted ? (
                  /* Tombol Mulai Ronde (Timer baru berjalan setelah ini diklik) */
                  <div style={{ textAlign: 'center', margin: '0.5rem 0 1rem' }}>
                    <Button
                      variant="primary"
                      onClick={handleStartRound}
                      style={{
                        padding: '0.85rem 2rem',
                        fontSize: '1.02rem',
                        fontWeight: 800,
                        background: '#0284C7',
                        boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
                        fontFamily: "'Times New Roman', Times, serif"
                      }}
                    >
                      ▶ Mulai Ronde (Waktu 15 Detik)
                    </Button>
                    <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '0.45rem' }}>
                      Pahami konteks di atas, lalu klik "Mulai Ronde" untuk mengaktifkan pilihan jawaban.
                    </div>
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', fontWeight: 700, color: '#334155', margin: '0 0 0.75rem', fontSize: '0.96rem' }}>
                    Menurutmu, apa yang akan terjadi pada sel?
                  </p>
                )}

                {/* 3 Tombol Opsi: hanya aktif setelah tombol Mulai Ronde diklik */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem'
                }}>
                  <Button
                    variant="outline"
                    onClick={() => handleSelect('mengerut')}
                    disabled={!isRoundStarted}
                    style={{
                      padding: '0.85rem 1rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      borderColor: '#CBD5E1',
                      color: '#0F172A',
                      fontFamily: "'Times New Roman', Times, serif",
                      opacity: !isRoundStarted ? 0.5 : 1,
                      cursor: !isRoundStarted ? 'not-allowed' : 'pointer'
                    }}
                  >
                    🔴 Sel mengerut
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSelect('tetap')}
                    disabled={!isRoundStarted}
                    style={{
                      padding: '0.85rem 1rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      borderColor: '#CBD5E1',
                      color: '#0F172A',
                      fontFamily: "'Times New Roman', Times, serif",
                      opacity: !isRoundStarted ? 0.5 : 1,
                      cursor: !isRoundStarted ? 'not-allowed' : 'pointer'
                    }}
                  >
                    🟢 Sel tetap normal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSelect('menggembung')}
                    disabled={!isRoundStarted}
                    style={{
                      padding: '0.85rem 1rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      borderColor: '#CBD5E1',
                      color: '#0F172A',
                      fontFamily: "'Times New Roman', Times, serif",
                      opacity: !isRoundStarted ? 0.5 : 1,
                      cursor: !isRoundStarted ? 'not-allowed' : 'pointer'
                    }}
                  >
                    🔵 Sel menggembung
                  </Button>
                </div>
              </div>
            ) : (
              /* ── FEEDBACK SETELAH MENJAWAB ─────────────────────────────── */
              <div className="fade-in" style={{
                background: userChoice === currentRound.correctChoice ? '#ECFDF5' : '#FEF2F2',
                border: `1.5px solid ${userChoice === currentRound.correctChoice ? '#86EFAC' : '#FCA5A5'}`,
                borderRadius: '12px',
                padding: '1.1rem 1.3rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>
                      {userChoice === currentRound.correctChoice ? '✅' : '❌'}
                    </span>
                    <strong style={{
                      fontSize: '1.02rem',
                      color: userChoice === currentRound.correctChoice ? '#065F46' : '#991B1B'
                    }}>
                      {userChoice === currentRound.correctChoice
                        ? 'Jawaban Tepat!'
                        : userChoice === 'timeout'
                        ? 'Waktu Habis!'
                        : 'Kurang Tepat!'}
                    </strong>
                  </div>

                  {/* Badge Istilah Tonisitas */}
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    color: '#0F172A'
                  }}>
                    {currentRound.tonicityBadge}
                  </span>
                </div>

                <p style={{ margin: '0 0 1rem', fontSize: '0.92rem', color: '#334155', lineHeight: 1.5 }}>
                  {currentRound.explanation}
                </p>

                <div style={{ textAlign: 'right' }}>
                  <Button
                    variant="primary"
                    onClick={handleNextRound}
                    style={{
                      padding: '0.65rem 1.4rem',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      background: '#0284C7',
                      fontFamily: "'Times New Roman', Times, serif"
                    }}
                  >
                    {currentRoundIdx + 1 === rounds.length ? 'Lihat Hasil Akhir 🏁' : 'Ronde berikutnya →'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
