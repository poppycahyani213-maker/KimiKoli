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

// Data 6 Ronde Game "Sel dalam Bahaya!"
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

export default function GameSelOsmosis({ onGameComplete, isCompletedInitially = false }) {
  // State urutan ronde teracak
  const [rounds, setRounds] = useState(() => shuffleArray(ROUNDS_DATA));
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);

  // State ronde saat ini
  const [userChoice, setUserChoice] = useState(null); // 'mengerut' | 'tetap' | 'menggembung' | 'timeout'
  const [hasAnswered, setHasAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // Status penyelesaian game tersimpan
  const [hasCompletedOnce, setHasCompletedOnce] = useState(() => {
    if (isCompletedInitially) return true;
    const key = getCh4GameKey();
    const saved = getStoredData(key, null);
    return Boolean(saved?.completedOnce);
  });

  const timerRef = useRef(null);

  const currentRound = rounds[currentRoundIdx] || rounds[0];

  // Timer 15 detik per ronde
  useEffect(() => {
    if (hasAnswered || isGameOver) return;

    setTimeLeft(15);
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
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
  }, [currentRoundIdx, hasAnswered, isGameOver]);

  const handleTimeOut = () => {
    if (hasAnswered || isGameOver) return;
    setUserChoice('timeout');
    setHasAnswered(true);
  };

  const handleSelect = (choice) => {
    if (hasAnswered || isGameOver) return;
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
      setUserChoice(null);
      setHasAnswered(false);
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
    setUserChoice(null);
    setHasAnswered(false);
    setScore(0);
    setIsGameOver(false);
  };

  // Penentuan visual sel pada SVG saat dijawab
  let cellScale = 1.0;
  let cellColor = '#EF4444';
  let cellBorder = '#B91C1C';
  let arrowDir = 'seimbang'; // 'masuk' | 'keluar' | 'seimbang'

  if (hasAnswered) {
    if (currentRound.correctChoice === 'menggembung') {
      cellScale = 1.35;
      cellColor = '#F87171';
      cellBorder = '#DC2626';
      arrowDir = 'masuk';
    } else if (currentRound.correctChoice === 'mengerut') {
      cellScale = 0.72;
      cellColor = '#B91C1C';
      cellBorder = '#7F1D1D';
      arrowDir = 'keluar';
    } else {
      cellScale = 1.0;
      cellColor = '#EF4444';
      cellBorder = '#B91C1C';
      arrowDir = 'seimbang';
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
                background: timeLeft <= 5 ? '#FEF2F2' : '#F8FAFC',
                border: `1.5px solid ${timeLeft <= 5 ? '#FCA5A5' : '#E2E8F0'}`,
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                color: timeLeft <= 5 ? '#DC2626' : '#334155',
                fontWeight: 800,
                fontSize: '0.88rem'
              }}>
                <span>⏳</span>
                <span>Waktu: {timeLeft}s</span>
              </div>
            </div>

            {/* Konteks Ronde */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
              padding: '0.85rem 1.1rem',
              marginBottom: '1.25rem'
            }}>
              <h4 style={{ margin: '0 0 0.3rem', fontSize: '1.05rem', color: '#0F172A', fontWeight: 800 }}>
                {currentRound.title}
              </h4>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569', lineHeight: 1.45 }}>
                {currentRound.context}
              </p>
            </div>

            {/* Visualisasi Gelas & Sel (SVG) */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              background: '#F0F9FF',
              borderRadius: '14px',
              border: '1.5px solid #BAE6FD',
              padding: '1rem',
              marginBottom: '1.25rem',
              position: 'relative'
            }}>
              <svg viewBox="0 0 400 240" style={{ width: '100%', maxWidth: '380px', height: 'auto', display: 'block' }}>
                <defs>
                  {/* Gradien Gelas */}
                  <linearGradient id="beakerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Dinding Gelas Kimia */}
                <path
                  d="M 90,30 L 90,210 Q 90,225 105,225 L 295,225 Q 310,225 310,210 L 310,30"
                  fill="url(#beakerGrad)"
                  stroke="#475569"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Permukaan Cairan Luar */}
                <ellipse cx="200" cy="45" rx="105" ry="10" fill="#7DD3FC" opacity="0.6" stroke="#38BDF8" />

                {/* Partikel Zat Terlarut di Larutan Luar (Gelas) */}
                {Array.from({ length: Math.round(currentRound.concOutside * 28) }).map((_, idx) => {
                  const px = 110 + ((idx * 37) % 175);
                  const py = 65 + ((idx * 43) % 140);
                  // Jangan gambar partikel luar di atas sel
                  if (Math.abs(px - 200) < 40 && Math.abs(py - 135) < 40) return null;
                  return (
                    <circle key={`out-${idx}`} cx={px} cy={py} r="4" fill="#F97316" stroke="#C2410C" strokeWidth="1" />
                  );
                })}

                {/* Keterangan Konsentrasi Cairan Luar */}
                <text x="200" y="25" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0369A1">
                  Larutan Luar: {currentRound.outsideLabel}
                </text>

                {/* Sel di Bagian Tengah */}
                <g transform={`translate(200, 135) scale(${cellScale}) translate(-200, -135)`}>
                  {/* Dinding / Membran Sel */}
                  <ellipse
                    cx="200"
                    cy="135"
                    rx={currentRound.correctChoice === 'mengerut' && hasAnswered ? 30 : 38}
                    ry={currentRound.correctChoice === 'mengerut' && hasAnswered ? 25 : 35}
                    fill={cellColor}
                    stroke={cellBorder}
                    strokeWidth={currentRound.correctChoice === 'mengerut' && hasAnswered ? '3' : '2.5'}
                    strokeDasharray={currentRound.correctChoice === 'mengerut' && hasAnswered ? '4 2' : 'none'}
                    style={{ transition: 'all 0.5s ease' }}
                  />

                  {/* Partikel Terlarut Selalu Ada di Dalam Sel (0,30 M ~ 8 partikel) */}
                  {[
                    { x: 185, y: 125 }, { x: 215, y: 125 },
                    { x: 195, y: 140 }, { x: 210, y: 145 },
                    { x: 180, y: 138 }, { x: 200, y: 120 },
                    { x: 190, y: 150 }, { x: 220, y: 138 }
                  ].map((p, idx) => (
                    <circle key={`in-${idx}`} cx={p.x} cy={p.y} r="3.5" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
                  ))}

                  {/* Label Cairan Sel */}
                  <text x="200" y="138" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#FFFFFF">
                    Sel 0,30 M
                  </text>
                </g>

                {/* Panah Aliran Air saat Dijawab */}
                {hasAnswered && (
                  <g>
                    {arrowDir === 'masuk' && (
                      <>
                        <text x="145" y="140" fontSize="20" fill="#0284C7" fontWeight="bold">➔</text>
                        <text x="235" y="140" fontSize="20" fill="#0284C7" fontWeight="bold">⬅</text>
                        <text x="200" y="85" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#0284C7">
                          💧 Air MASUK ke dalam sel
                        </text>
                      </>
                    )}
                    {arrowDir === 'keluar' && (
                      <>
                        <text x="140" y="140" fontSize="20" fill="#DC2626" fontWeight="bold">⬅</text>
                        <text x="240" y="140" fontSize="20" fill="#DC2626" fontWeight="bold">➔</text>
                        <text x="200" y="85" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#DC2626">
                          💧 Air KELUAR dari sel
                        </text>
                      </>
                    )}
                    {arrowDir === 'seimbang' && (
                      <>
                        <text x="145" y="140" fontSize="18" fill="#059669" fontWeight="bold">⇄</text>
                        <text x="235" y="140" fontSize="18" fill="#059669" fontWeight="bold">⇄</text>
                        <text x="200" y="85" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#059669">
                          ⚖️ Air keluar-masuk SEIMBANG
                        </text>
                      </>
                    )}
                  </g>
                )}
              </svg>
            </div>

            {/* ── TOMBOL PILIHAN SISWA ──────────────────────────────────── */}
            {!hasAnswered ? (
              <div>
                <p style={{ textAlign: 'center', fontWeight: 700, color: '#334155', margin: '0 0 0.75rem', fontSize: '0.96rem' }}>
                  Menurutmu, apa yang akan terjadi pada sel?
                </p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '0.75rem'
                }}>
                  <Button
                    variant="outline"
                    onClick={() => handleSelect('mengerut')}
                    style={{
                      padding: '0.85rem 1rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      borderColor: '#CBD5E1',
                      color: '#0F172A',
                      fontFamily: "'Times New Roman', Times, serif"
                    }}
                  >
                    🔴 Sel mengerut
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSelect('tetap')}
                    style={{
                      padding: '0.85rem 1rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      borderColor: '#CBD5E1',
                      color: '#0F172A',
                      fontFamily: "'Times New Roman', Times, serif"
                    }}
                  >
                    🟢 Sel tetap normal
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSelect('menggembung')}
                    style={{
                      padding: '0.85rem 1rem',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      borderColor: '#CBD5E1',
                      color: '#0F172A',
                      fontFamily: "'Times New Roman', Times, serif"
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
