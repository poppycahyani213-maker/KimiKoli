import React, { useState } from 'react';
import imgTekananUap from '../../assets/icon-tekanan-uap.png';
import imgTitikDidih from '../../assets/icon-titik-didih.png';
import imgTitikBeku from '../../assets/icon-titik-beku.png';
import imgRadiator from '../../assets/icon-radiator.png';
import imgOsmosis from '../../assets/icon-osmosis.png';
import imgDesalinasi from '../../assets/fenomena-desalinasi.jpg';
import imgElektrolit from '../../assets/icon-elektrolit.png';
import kimikoliIcon from '../../assets/kimikoli-icon.jpg';

/**
 * Komponen HomePage (Beranda KimiKoli)
 * 
 * Dinamis mengikuti progres belajar berurutan (Sequential Learning Path):
 * - Siswa menyelesaikan satu materi -> materi selanjutnya OTOMATIS TERBUKA.
 * - Peta Misi 6 Tahap otomatis mengupdate status (Terkunci 🔒, Siap Dipelajari, ✓ Selesai).
 */
export default function HomePage({ 
  isPretestDone = false, 
  completedChapters = [],
  isLabVirtualCompleted = false,
  onStartPretest, 
  onGoToChapter,
  onGoToLabVirtual
}) {
  const isCh1Completed = completedChapters.includes('chapter1');
  const isCh2Completed = completedChapters.includes('chapter2');
  const isCh3Completed = completedChapters.includes('chapter3');
  const isCh4Completed = completedChapters.includes('chapter4');
  const isCh5Completed = completedChapters.includes('chapter5');

  // Logika Keterbukaan Misi (Unlocked Status)
  const isCh1Unlocked = isPretestDone;
  const isCh2Unlocked = isCh1Completed;
  const isCh3Unlocked = isCh2Completed;
  const isCh4Unlocked = isCh3Completed;
  const isCh5Unlocked = isCh4Completed;

  // Hitung total misi selesai (Pretest = 1, Bab 1-5 = 5)
  let totalMissionsDone = 0;
  if (isPretestDone) totalMissionsDone += 1;
  if (isCh1Completed) totalMissionsDone += 1;
  if (isCh2Completed) totalMissionsDone += 1;
  if (isCh3Completed) totalMissionsDone += 1;
  if (isCh4Completed) totalMissionsDone += 1;
  if (isCh5Completed) totalMissionsDone += 1;

  const currentXp = (isPretestDone ? 20 : 0) + (completedChapters.length * 30) + (isLabVirtualCompleted ? 40 : 0);

  const isAllMissionsDone = isPretestDone && isCh1Completed && isCh2Completed && isCh3Completed && isCh4Completed && isCh5Completed;

  // Menentukan materi tujuan untuk tombol Hero utama
  const getNextAvailableView = () => {
    if (!isPretestDone) return { label: 'Mulai Misi 1: Pretest Prasyarat →', action: onStartPretest, isAllDone: false };
    if (!isCh1Completed) return { label: 'Lanjut Misi: Bab 1 Konsentrasi Larutan →', action: () => onGoToChapter('chapter1'), isAllDone: false };
    if (!isCh2Completed) return { label: 'Lanjut Misi: Bab 2 Tekanan Uap & Titik Didih →', action: () => onGoToChapter('chapter2'), isAllDone: false };
    if (!isCh3Completed) return { label: 'Lanjut Misi: Bab 3 Penurunan Titik Beku →', action: () => onGoToChapter('chapter3'), isAllDone: false };
    if (!isCh4Completed) return { label: 'Lanjut Misi: Bab 4 Tekanan Osmotik →', action: () => onGoToChapter('chapter4'), isAllDone: false };
    if (!isCh5Completed) return { label: 'Lanjut Misi: Bab 5 Larutan Elektrolit →', action: () => onGoToChapter('chapter5'), isAllDone: false };
    
    // Jika Bab 1-5 selesai tapi Lab Virtual belum selesai
    if (!isLabVirtualCompleted) {
      return { 
        label: '🔬 Masuk ke Laboratorium Virtual →', 
        action: onGoToLabVirtual || (() => onGoToChapter('lab-virtual')), 
        isAllDone: false 
      };
    }

    return { label: '🏆 Masuk ke Kuis Evaluasi Akhir →', action: () => onGoToChapter('chapter6'), isAllDone: true };
  };

  const nextAction = getNextAvailableView();

  const scrollToMissions = () => {
    const el = document.getElementById('peta-misi-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto', paddingBottom: '2.5rem', fontFamily: "'Times New Roman', Times, serif" }}>
      {/* =========================================================
          1. HERO SECTION (2 KOLOM DENGAN NUANSA KIMIKOLI)
          ========================================================= */}
      <section className="hero-section" style={{
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(12px)',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        borderRadius: '24px',
        border: '1.5px solid rgba(255, 255, 255, 0.95)',
        boxShadow: '0 12px 35px rgba(2, 132, 199, 0.08)',
        marginBottom: '2.5rem'
      }}>
        <div className="hero-grid">
          {/* Kolom Kiri: Headline & CTA */}
          <div>
            <div className="hero-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.55rem' }}>
              <img 
                src={kimikoliIcon} 
                alt="KimiKoli" 
                style={{ width: '22px', height: '22px', borderRadius: '6px', objectFit: 'contain' }}
              />
              <span>
                {!isPretestDone ? '🎯 Misi 1 Wajib: Pretest Prasyarat Pembuka Materi' : 'KimiKoli · Sifat Koligatif Larutan Kelas XI SMA'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <div style={{
                width: 84,
                height: 84,
                borderRadius: '22px',
                background: '#FFFFFF',
                border: '2px solid #BAE6FD',
                boxShadow: '0 8px 24px rgba(2, 132, 199, 0.14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                flexShrink: 0
              }}>
                <img 
                  src={kimikoliIcon} 
                  alt="Ilustrasi Laboratorium KimiKoli" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>

              <h1 className="hero-title" style={{ fontFamily: "'Times New Roman', Times, serif", margin: 0, flex: 1, minWidth: '240px' }}>
                {isAllMissionsDone ? (
                  isLabVirtualCompleted ? (
                    <>🏆 Selamat! Seluruh Misi & Praktikum <span className="highlight-blue">Lab Tuntas</span>.</>
                  ) : (
                    <>🎉 Materi Bab 1–5 Tuntas! Lanjut ke <span className="highlight-blue">Lab Virtual</span>.</>
                  )
                ) : (
                  !isPretestDone ? (
                    <>Selesaikan Pretest Prasyarat untuk membuka gerbang <span className="highlight-blue">materi</span>.</>
                  ) : (
                    <>Selesaikan 6 misi lab, bongkar rahasia <span className="highlight-blue">larutan</span>.</>
                  )
                )}
              </h1>
            </div>

            <p className="hero-desc" style={{ fontSize: '1.05rem', lineHeight: 1.65 }}>
              {isAllMissionsDone ? (
                isLabVirtualCompleted
                  ? "Hebat! Kamu telah menuntaskan seluruh materi teori dan sesi eksperimen di Laboratorium Virtual. Sekarang kamu siap menguji pemahaman komprehensifmu di Kuis Evaluasi Akhir!"
                  : "Luar biasa! Seluruh materi teori sifat koligatif larutan (Bab 1 sampai Bab 5) telah tuntas. Sekarang, masuklah ke Laboratorium Virtual untuk mengeksplorasi fenomena larutan secara langsung sebelum membuka Kuis Evaluasi Akhir."
              ) : (
                !isPretestDone
                  ? "Selamat datang di KimiKoli! Sebelum mempelajari materi sifat koligatif larutan, kamu wajib menyelesaikan 8 soal Pretest Prasyarat (±10 menit). Begitu pretest tuntas, materi Bab 1 akan langsung terbuka otomatis!"
                  : (totalMissionsDone > 0 
                    ? `Progres luar biasa! Kamu telah menuntaskan ${totalMissionsDone} misi belajar. Terus lanjutkan untuk membuka fenomena koligatif berikutnya.`
                    : "Setiap misi membuka satu fenomena nyata: kenapa es puter butuh garam kasar, kenapa cairan radiator mobil tidak mendidih, hingga desalinasi air laut. Kumpulkan XP dan lencana di setiap langkah.")
              )}
            </p>

            <div className="hero-cta-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextAction.action}
                style={{
                  background: isAllMissionsDone ? '#10B981' : (totalMissionsDone > 0 ? '#0284C7' : '#0284C7'),
                  boxShadow: isAllMissionsDone ? '0 4px 14px rgba(16, 185, 129, 0.35)' : '0 4px 14px rgba(2, 132, 199, 0.3)',
                  padding: '0.85rem 1.8rem',
                  fontSize: '1.05rem'
                }}
              >
                {nextAction.label}
              </button>

              {isAllMissionsDone ? (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onStartPretest}
                  style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}
                  title="Uji kembali pemahaman awal kamu"
                >
                  🔄 Ulangi Pretest / Kuis
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={scrollToMissions}
                  style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}
                >
                  Lihat peta misi
                </button>
              )}
            </div>

            <span className="hero-subinfo">
              {isAllMissionsDone
                ? "✓ 6 dari 6 misi telah berhasil dituntaskan dengan sempurna"
                : (totalMissionsDone > 0 
                  ? `✓ ${totalMissionsDone} dari 6 misi telah berhasil dituntaskan`
                  : "Pretest ±10 menit · tidak memengaruhi nilai rapor")}
            </span>
          </div>

          {/* Kolom Kanan: Gamification Progress Card */}
          <div className="gamify-card">
            <div className="gamify-header">
              <div className="progress-circle" style={{ borderColor: isAllMissionsDone ? '#10B981' : (totalMissionsDone > 0 ? '#0284C7' : '#94A3B8') }}>
                <span className="count">{totalMissionsDone}/6</span>
                <span className="label">misi</span>
              </div>
              <div>
                <div className="gamify-info-sub">Progres kamu</div>
                <h3 className="gamify-rank-title" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                  {totalMissionsDone >= 5 ? 'Ahli Koligatif' : (totalMissionsDone >= 2 ? 'Peneliti Aktif' : 'Peneliti Pemula')}
                </h3>
                <div className="gamify-xp-text" style={{ color: isAllMissionsDone ? '#10B981' : '#0284C7' }}>
                  {currentXp} XP · {isAllMissionsDone ? 'Level Maksimal Tercapai' : `${Math.max(0, 170 - currentXp)} XP lagi ke level berikutnya`}
                </div>
              </div>
            </div>

            {/* B.2 & B.3: Lencana Penguasaan Konsep dengan Status Terbuka / Terkunci yang Jelas */}
            <div className="badges-unlock-container">
              <div className="badges-unlock-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Lencana Penguasaan Konsep</span>
                <span style={{ fontSize: '0.78rem', color: '#64748B' }}>5 Lencana Kompetensi</span>
              </div>
              <div className="badge-slots-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.4rem' }}>
                {/* Lencana 1: Tekanan Uap */}
                <div 
                  className="badge-slot-box" 
                  title={isCh1Completed ? "✓ Dikuasai: Paham Hukum Raoult & fraksi mol (Bab 1 & 2)" : "🔒 Terkunci: Tuntaskan Bab 1 & 2 untuk menguasai Hukum Raoult"}
                  style={{
                    background: isCh1Completed ? '#ECFDF5' : '#F8FAFC',
                    borderColor: isCh1Completed ? '#10B981' : '#CBD5E1',
                    borderStyle: isCh1Completed ? 'solid' : 'dashed',
                    boxShadow: isCh1Completed ? '0 2px 8px rgba(16, 185, 129, 0.18)' : 'none'
                  }}
                >
                  <span className="icon" style={{ color: isCh1Completed ? '#10B981' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isCh1Completed ? (
                      <img src={imgTekananUap} alt="Uap" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                    ) : '🔒'}
                  </span>
                  <span className="title" style={{ color: isCh1Completed ? '#065F46' : '#64748B' }}>Uap</span>
                </div>

                {/* Lencana 2: Titik Didih */}
                <div 
                  className="badge-slot-box" 
                  title={isCh2Completed ? "✓ Dikuasai: Paham Kenaikan Titik Didih ΔTb (Bab 2)" : "🔒 Terkunci: Tuntaskan perhitungan & lab virtual Bab 2"}
                  style={{
                    background: isCh2Completed ? '#ECFDF5' : '#F8FAFC',
                    borderColor: isCh2Completed ? '#10B981' : '#CBD5E1',
                    borderStyle: isCh2Completed ? 'solid' : 'dashed',
                    boxShadow: isCh2Completed ? '0 2px 8px rgba(16, 185, 129, 0.18)' : 'none'
                  }}
                >
                  <span className="icon" style={{ color: isCh2Completed ? '#10B981' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isCh2Completed ? (
                      <img src={imgTitikDidih} alt="Didih" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                    ) : '🔒'}
                  </span>
                  <span className="title" style={{ color: isCh2Completed ? '#065F46' : '#475569' }}>Didih</span>
                </div>

                {/* Lencana 3: Titik Beku */}
                <div 
                  className="badge-slot-box" 
                  title={isCh3Completed ? "✓ Dikuasai: Paham Penurunan Titik Beku ΔTf & Diagram Fase (Bab 3)" : "🔒 Terkunci: Tuntaskan kurva pendinginan Bab 3"}
                  style={{
                    background: isCh3Completed ? '#ECFDF5' : '#F8FAFC',
                    borderColor: isCh3Completed ? '#10B981' : '#CBD5E1',
                    borderStyle: isCh3Completed ? 'solid' : 'dashed',
                    boxShadow: isCh3Completed ? '0 2px 8px rgba(16, 185, 129, 0.18)' : 'none'
                  }}
                >
                  <span className="icon" style={{ color: isCh3Completed ? '#10B981' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isCh3Completed ? (
                      <img src={imgTitikBeku} alt="Beku" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                    ) : '🔒'}
                  </span>
                  <span className="title" style={{ color: isCh3Completed ? '#065F46' : '#475569' }}>Beku</span>
                </div>

                {/* Lencana 4: Tekanan Osmotik */}
                <div 
                  className="badge-slot-box" 
                  title={isCh4Completed ? "✓ Dikuasai: Paham Tekanan Osmotik Π & Sel Semipermeabel (Bab 4)" : "🔒 Terkunci: Tuntaskan simulasi osmosis Bab 4"}
                  style={{
                    background: isCh4Completed ? '#ECFDF5' : '#F8FAFC',
                    borderColor: isCh4Completed ? '#10B981' : '#CBD5E1',
                    borderStyle: isCh4Completed ? 'solid' : 'dashed',
                    boxShadow: isCh4Completed ? '0 2px 8px rgba(16, 185, 129, 0.18)' : 'none'
                  }}
                >
                  <span className="icon" style={{ color: isCh4Completed ? '#10B981' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isCh4Completed ? (
                      <img src={imgOsmosis} alt="Osmosis" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                    ) : '🔒'}
                  </span>
                  <span className="title" style={{ color: isCh4Completed ? '#065F46' : '#475569' }}>Osmosis</span>
                </div>

                {/* Lencana 5: Larutan Elektrolit */}
                <div 
                  className="badge-slot-box" 
                  title={isCh5Completed ? "✓ Dikuasai: Paham Faktor van 't Hoff i & Disosiasi Ion (Bab 5)" : "🔒 Terkunci: Tuntaskan perhitungan faktor van 't Hoff Bab 5"}
                  style={{
                    background: isCh5Completed ? '#ECFDF5' : '#F8FAFC',
                    borderColor: isCh5Completed ? '#10B981' : '#CBD5E1',
                    borderStyle: isCh5Completed ? 'solid' : 'dashed',
                    boxShadow: isCh5Completed ? '0 2px 8px rgba(16, 185, 129, 0.18)' : 'none'
                  }}
                >
                  <span className="icon" style={{ color: isCh5Completed ? '#10B981' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isCh5Completed ? (
                      <img src={imgElektrolit} alt="Elektrolit" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                    ) : '🔒'}
                  </span>
                  <span className="title" style={{ color: isCh5Completed ? '#065F46' : '#475569' }}>Elektrolit</span>
                </div>
              </div>
            </div>

            {/* B.4: Progres Penguasaan per 5 Konsep Utama Sifat Koligatif */}
            <div style={{ marginTop: '1.2rem', paddingTop: '0.9rem', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Indikator Penguasaan Konsep</span>
                <span style={{ color: '#0284C7', fontWeight: 800 }}>{completedChapters.length}/5 Tuntas</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {/* 1. Tekanan Uap */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.15rem' }}>
                    <span style={{ color: isCh1Completed ? '#065F46' : '#64748B', fontWeight: isCh1Completed ? 700 : 500 }}>
                      {isCh1Completed ? '✓' : '○'} Penurunan Tekanan Uap (ΔP)
                    </span>
                    <span style={{ fontWeight: 700, color: isCh1Completed ? '#10B981' : '#94A3B8' }}>{isCh1Completed ? '100%' : '0%'}</span>
                  </div>
                  <div style={{ height: 5, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: isCh1Completed ? '100%' : '0%', height: '100%', background: '#10B981', transition: 'width 0.4s' }}></div>
                  </div>
                </div>

                {/* 2. Titik Didih */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.15rem' }}>
                    <span style={{ color: isCh2Completed ? '#065F46' : '#64748B', fontWeight: isCh2Completed ? 700 : 500 }}>
                      {isCh2Completed ? '✓' : '○'} Kenaikan Titik Didih (ΔTb)
                    </span>
                    <span style={{ fontWeight: 700, color: isCh2Completed ? '#10B981' : '#94A3B8' }}>{isCh2Completed ? '100%' : '0%'}</span>
                  </div>
                  <div style={{ height: 5, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: isCh2Completed ? '100%' : '0%', height: '100%', background: '#10B981', transition: 'width 0.4s' }}></div>
                  </div>
                </div>

                {/* 3. Titik Beku */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.15rem' }}>
                    <span style={{ color: isCh3Completed ? '#065F46' : '#64748B', fontWeight: isCh3Completed ? 700 : 500 }}>
                      {isCh3Completed ? '✓' : '○'} Penurunan Titik Beku (ΔTf)
                    </span>
                    <span style={{ fontWeight: 700, color: isCh3Completed ? '#10B981' : '#94A3B8' }}>{isCh3Completed ? '100%' : '0%'}</span>
                  </div>
                  <div style={{ height: 5, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: isCh3Completed ? '100%' : '0%', height: '100%', background: '#10B981', transition: 'width 0.4s' }}></div>
                  </div>
                </div>

                {/* 4. Tekanan Osmotik */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.15rem' }}>
                    <span style={{ color: isCh4Completed ? '#065F46' : '#64748B', fontWeight: isCh4Completed ? 700 : 500 }}>
                      {isCh4Completed ? '✓' : '○'} Tekanan Osmotik (Π)
                    </span>
                    <span style={{ fontWeight: 700, color: isCh4Completed ? '#10B981' : '#94A3B8' }}>{isCh4Completed ? '100%' : '0%'}</span>
                  </div>
                  <div style={{ height: 5, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: isCh4Completed ? '100%' : '0%', height: '100%', background: '#10B981', transition: 'width 0.4s' }}></div>
                  </div>
                </div>

                {/* 5. Larutan Elektrolit */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.15rem' }}>
                    <span style={{ color: isCh5Completed ? '#065F46' : '#64748B', fontWeight: isCh5Completed ? 700 : 500 }}>
                      {isCh5Completed ? '✓' : '○'} Faktor van 't Hoff Larutan Elektrolit (i)
                    </span>
                    <span style={{ fontWeight: 700, color: isCh5Completed ? '#10B981' : '#94A3B8' }}>{isCh5Completed ? '100%' : '0%'}</span>
                  </div>
                  <div style={{ height: 5, background: '#F1F5F9', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: isCh5Completed ? '100%' : '0%', height: '100%', background: '#10B981', transition: 'width 0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          2. FENOMENA SIFAT KOLIGATIF DALAM KEHIDUPAN NYATA
             (Urutan Berurutan Bab 1 - 5, Seluruh Gambar Utuh Tidak Terpotong)
          ========================================================= */}
      <section style={{
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        padding: 'clamp(1.5rem, 3vw, 2.25rem)',
        borderRadius: '24px',
        border: '1.5px solid rgba(255, 255, 255, 0.95)',
        boxShadow: '0 12px 35px rgba(2, 132, 199, 0.08)',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🎨 Ilustrasi & Fenomena Kehidupan Nyata (Lengkap Bab 1 – 5)
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0.25rem 0 0', color: '#0F172A', fontFamily: "'Times New Roman', Times, serif" }}>
              Fenomena Sifat Koligatif dalam Kehidupan Nyata
            </h2>
          </div>
          <span style={{ fontSize: '0.9rem', color: '#0369A1', background: '#F0F9FF', padding: '0.45rem 1rem', borderRadius: '20px', border: '1px solid #BAE6FD', fontWeight: 600 }}>
            💡 Disusun berurutan sesuai bab pembelajaran
          </span>
        </div>

        {/* B.5: Grid 6 Kartu Fenomena (Sesuai Urutan Kurikulum Bab 1 s.d. Bab 5) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* KARTU 1 (Bab 1 & 2): Penurunan Tekanan Uap (ΔP) */}
          <div 
            onClick={isCh1Unlocked ? () => onGoToChapter('chapter1') : onStartPretest}
            style={{
              padding: '1.25rem',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.98)',
              border: isCh1Completed ? '2px solid #10B981' : (isCh1Unlocked ? '2px solid #0284C7' : '1.5px solid #E2E8F0'),
              boxShadow: isCh1Unlocked ? '0 6px 20px rgba(2, 132, 199, 0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
            title={isCh1Unlocked ? "Klik untuk menuju Bab 1: Konsentrasi & Hakikat Koligatif" : "🔒 Terkunci: Klik untuk mengerjakan Pretest terlebih dahulu"}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {/* Container gambar rapi dengan object-fit: contain agar utuh */}
              <div style={{
                width: '135px',
                height: '110px',
                borderRadius: '14px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1.5px solid #BAE6FD',
                background: '#F0F9FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px'
              }}>
                <img 
                  src={imgTekananUap} 
                  alt="Ilustrasi Penurunan Tekanan Uap Larutan" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '8px', background: '#F0F9FF', color: '#0369A1' }}>
                    BAB 1 & 2 · ΔP
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isCh1Completed ? '#10B981' : (isCh1Unlocked ? '#0284C7' : '#94A3B8') }}>
                    {isCh1Completed ? '✓ Selesai' : (isCh1Unlocked ? 'Siap Dipelajari →' : '🔒 Terkunci')}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A', fontFamily: "'Times New Roman', Times, serif" }}>
                  Penurunan Tekanan Uap
                </h3>
                <span style={{ fontSize: '0.88rem', color: '#0284C7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                  <span>💨</span>
                  <span>Hambatan Partikel Terlarut & Penguapan</span>
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.94rem', color: '#475569', lineHeight: 1.6 }}>
              Molekul zat terlarut nonvolatil (sukar menguap) memenuhi sebagian permukaan larutan, menghalangi molekul pelarut untuk lepas menguap. Akibatnya laju penguapan berkurang dan tekanan uap larutan selalu lebih rendah daripada pelarut murni.
            </p>
          </div>

          {/* KARTU 2 (Bab 2): Kenaikan Titik Didih (ΔTb) */}
          <div 
            onClick={isCh2Unlocked ? () => onGoToChapter('chapter2') : undefined}
            style={{
              padding: '1.25rem',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.98)',
              border: isCh2Completed ? '2px solid #10B981' : (isCh2Unlocked ? '2px solid #0284C7' : '1.5px solid #E2E8F0'),
              boxShadow: isCh2Unlocked ? '0 6px 20px rgba(2, 132, 199, 0.08)' : 'none',
              cursor: isCh2Unlocked ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
            title={isCh2Unlocked ? "Klik untuk menuju Bab 2: Tekanan Uap & Titik Didih" : "Selesaikan bab sebelumnya untuk membuka"}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {/* A.2: Gambar kartu Kenaikan Titik Didih utuh tanpa terpotong */}
              <div style={{
                width: '135px',
                height: '110px',
                borderRadius: '14px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1.5px solid #FCD34D',
                background: '#FFF5E8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}>
                <img 
                  src={imgTitikDidih} 
                  alt="Ilustrasi Kenaikan Titik Didih (Panci Mendidih)" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '8px', background: '#EEF2FF', color: '#3730A3' }}>
                    BAB 2 · ΔTb
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isCh2Completed ? '#10B981' : (isCh2Unlocked ? '#0284C7' : '#94A3B8') }}>
                    {isCh2Completed ? '✓ Selesai' : (isCh2Unlocked ? 'Siap Dipelajari →' : '🔒 Terkunci')}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A', fontFamily: "'Times New Roman', Times, serif" }}>
                  Kenaikan Titik Didih
                </h3>
                <span style={{ fontSize: '0.88rem', color: '#0284C7', fontWeight: 700, display: 'block', marginTop: '0.15rem' }}>
                  🫕 Air Mendidih & Memasak Dapur
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.94rem', color: '#475569', lineHeight: 1.6 }}>
              Zat cair mendidih ketika tekanan uapnya sama dengan tekanan udara luar. Karena tekanan uap turun akibat zat terlarut, diperlukan pemanasan pada suhu lebih tinggi (di atas 100°C) agar larutan dapat mendidih, membuat masakan lebih cepat matang.
            </p>
          </div>

          {/* KARTU 3 (Bab 3): Penurunan Titik Beku (ΔTf) */}
          <div 
            onClick={isCh3Unlocked ? () => onGoToChapter('chapter3') : undefined}
            style={{
              padding: '1.25rem',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.98)',
              border: isCh3Completed ? '2px solid #10B981' : (isCh3Unlocked ? '2px solid #0284C7' : '1.5px solid #E2E8F0'),
              boxShadow: isCh3Unlocked ? '0 6px 20px rgba(2, 132, 199, 0.08)' : 'none',
              cursor: isCh3Unlocked ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
            title={isCh3Unlocked ? "Klik untuk menuju Bab 3: Penurunan Titik Beku" : "Selesaikan bab sebelumnya untuk membuka"}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '135px',
                height: '110px',
                borderRadius: '14px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1.5px solid #BAE6FD',
                background: '#F0F9FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}>
                <img 
                  src={imgTitikBeku} 
                  alt="Ilustrasi Penurunan Titik Beku (Kristal Es)" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '8px', background: '#FEF2F2', color: '#991B1B' }}>
                    BAB 3 · ΔTf
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isCh3Completed ? '#10B981' : (isCh3Unlocked ? '#0284C7' : '#94A3B8') }}>
                    {isCh3Completed ? '✓ Selesai' : (isCh3Unlocked ? 'Siap Dipelajari →' : '🔒 Terkunci')}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A', fontFamily: "'Times New Roman', Times, serif" }}>
                  Penurunan Titik Beku
                </h3>
                <span style={{ fontSize: '0.88rem', color: '#0284C7', fontWeight: 700, display: 'block', marginTop: '0.15rem' }}>
                  🍦 Es Krim Puter & Garam Jalan Salju
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.94rem', color: '#475569', lineHeight: 1.6 }}>
              Zat terlarut merintangi molekul pelarut untuk membentuk kisi kristal padat, sehingga larutan baru membeku pada suhu di bawah 0°C. Prinsip ini digunakan pedagang es puter (campuran es batu dan garam kasar mencapai suhu -5°C) serta pencairan es di jalan salju.
            </p>
          </div>

          {/* KARTU 4 (Bab 2 & 3): Cairan Radiator Mobil (A.1: Label HTML Benar Kenaikan Titik Didih & Penurunan Titik Beku) */}
          <div 
            onClick={isCh2Unlocked ? () => onGoToChapter('chapter2') : undefined}
            style={{
              padding: '1.25rem',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.98)',
              border: (isCh2Completed && isCh3Completed) ? '2px solid #10B981' : (isCh2Unlocked ? '2px solid #0284C7' : '1.5px solid #E2E8F0'),
              boxShadow: isCh2Unlocked ? '0 6px 20px rgba(2, 132, 199, 0.08)' : 'none',
              cursor: isCh2Unlocked ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
            title={isCh2Unlocked ? "Klik untuk menuju Bab 2 & 3: Penerapan Didih & Beku" : "Selesaikan bab sebelumnya untuk membuka"}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '135px',
                height: '110px',
                borderRadius: '14px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1.5px solid #FBCFE8',
                background: '#FDF2F8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                position: 'relative'
              }}>
                <img 
                  src={imgRadiator} 
                  alt="Ilustrasi Cairan Radiator (Didih & Beku)" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '8px', background: '#F0FDF4', color: '#166534' }}>
                    BAB 2 & 3 · ΔTb & ΔTf
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: (isCh2Completed && isCh3Completed) ? '#10B981' : (isCh2Unlocked ? '#0284C7' : '#94A3B8') }}>
                    {(isCh2Completed && isCh3Completed) ? '✓ Selesai' : (isCh2Unlocked ? 'Siap Dipelajari →' : '🔒 Terkunci')}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A', fontFamily: "'Times New Roman', Times, serif" }}>
                  Cairan Radiator Mobil
                </h3>
                {/* A.1: Label HTML yang benar secara kimia */}
                <span style={{ fontSize: '0.88rem', color: '#0284C7', fontWeight: 700, display: 'block', marginTop: '0.15rem' }}>
                  🚗 Kenaikan Titik Didih & Penurunan Titik Beku
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.94rem', color: '#475569', lineHeight: 1.6 }}>
              Cairan radiator (campuran air dan etilen glikol) memanfaatkan dua sifat koligatif sekaligus: <strong>menaikkan titik didih</strong> agar air radiator tidak mendidih/overheat saat mesin bekerja panas, dan <strong>menurunkan titik beku</strong> agar tidak membeku saat musim salju.
            </p>
          </div>

          {/* KARTU 5 (Bab 4): Tekanan Osmotik & Osmosis Balik (A.3: Pisahkan & Jelaskan Perbedaan Osmosis vs Reverse Osmosis) */}
          <div 
            onClick={isCh4Unlocked ? () => onGoToChapter('chapter4') : undefined}
            style={{
              padding: '1.25rem',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.98)',
              border: isCh4Completed ? '2px solid #10B981' : (isCh4Unlocked ? '2px solid #0284C7' : '1.5px solid #E2E8F0'),
              boxShadow: isCh4Unlocked ? '0 6px 20px rgba(2, 132, 199, 0.08)' : 'none',
              cursor: isCh4Unlocked ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
            title={isCh4Unlocked ? "Klik untuk menuju Bab 4: Tekanan Osmotik" : "Selesaikan bab sebelumnya untuk membuka"}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '135px',
                height: '110px',
                borderRadius: '14px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1.5px solid #86EFAC',
                background: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}>
                <img 
                  src={imgOsmosis} 
                  alt="Ilustrasi Tekanan Osmotik (Irisan Mentimun)" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '8px', background: '#F0F9FF', color: '#075985' }}>
                    BAB 4 · Π
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isCh4Completed ? '#10B981' : (isCh4Unlocked ? '#0284C7' : '#94A3B8') }}>
                    {isCh4Completed ? '✓ Selesai' : (isCh4Unlocked ? 'Siap Dipelajari →' : '🔒 Terkunci')}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A', fontFamily: "'Times New Roman', Times, serif" }}>
                  Tekanan Osmotik & Osmosis Balik
                </h3>
                <span style={{ fontSize: '0.88rem', color: '#0284C7', fontWeight: 700, display: 'block', marginTop: '0.15rem' }}>
                  🥒 Acar Mentimun vs 🌊 Desalinasi Air Laut
                </span>
              </div>
            </div>
            {/* A.3: Keterangan jelas memisahkan osmosis alami dan osmosis balik */}
            <p style={{ margin: 0, fontSize: '0.94rem', color: '#475569', lineHeight: 1.6 }}>
              <strong>(1) Osmosis Alami:</strong> molekul air dalam sel mentimun berpindah spontan menembus membran ke larutan garam pekat sehingga berkerut menjadi acar. <br />
              <strong>(2) Osmosis Balik (Reverse Osmosis):</strong> diberikan tekanan luar melebihi tekanan osmotik (P<sub>luar</sub> &gt; Π) untuk membalik arah aliran, menyaring molekul air murni dari air laut.
            </p>
          </div>

          {/* KARTU 6 (Bab 5): Sifat Koligatif Larutan Elektrolit & van 't Hoff (i) */}
          <div 
            onClick={isCh5Unlocked ? () => onGoToChapter('chapter5') : undefined}
            style={{
              padding: '1.25rem',
              borderRadius: '18px',
              background: 'rgba(255, 255, 255, 0.98)',
              border: isCh5Completed ? '2px solid #10B981' : (isCh5Unlocked ? '2px solid #0284C7' : '1.5px solid #E2E8F0'),
              boxShadow: isCh5Unlocked ? '0 6px 20px rgba(2, 132, 199, 0.08)' : 'none',
              cursor: isCh5Unlocked ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
            title={isCh5Unlocked ? "Klik untuk menuju Bab 5: Larutan Elektrolit" : "Selesaikan bab sebelumnya untuk membuka"}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '135px',
                height: '110px',
                borderRadius: '14px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1.5px solid #C4B5FD',
                background: '#F5F3FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}>
                <img 
                  src={imgElektrolit} 
                  alt="Ilustrasi Ion Larutan Elektrolit" 
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '8px', background: '#F5F3FF', color: '#5B21B6' }}>
                    BAB 5 · i (van 't Hoff)
                  </span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: isCh5Completed ? '#10B981' : (isCh5Unlocked ? '#0284C7' : '#94A3B8') }}>
                    {isCh5Completed ? '✓ Selesai' : (isCh5Unlocked ? 'Siap Dipelajari →' : '🔒 Terkunci')}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0F172A', fontFamily: "'Times New Roman', Times, serif" }}>
                  Larutan Elektrolit
                </h3>
                <span style={{ fontSize: '0.88rem', color: '#0284C7', fontWeight: 700, display: 'block', marginTop: '0.15rem' }}>
                  ⚡ Multiplikasi Ion: Garam Dapur vs Gula
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.94rem', color: '#475569', lineHeight: 1.6 }}>
              Karena sifat koligatif hanya bergantung pada jumlah partikel, zat elektrolit seperti garam dapur (NaCl → Na⁺ + Cl⁻) menghasilkan partikel dua kali lipat lebih banyak daripada nonelektrolit (gula) pada konsentrasi molal yang sama, sehingga efek koligatifnya dilipatgandakan oleh faktor van 't Hoff (i).
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          3. PETA MISI (6 KARTU TAHAPAN BERURUTAN)
          ========================================================= */}
      <section id="peta-misi-section" className="mission-section">
        <div className="mission-header-row">
          <div className="mission-title-group">
            <h2 style={{ fontFamily: "'Times New Roman', Times, serif", display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <img 
                src={kimikoliIcon} 
                alt="Icon KimiKoli" 
                style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'contain', background: '#FFFFFF', border: '1px solid #BAE6FD', padding: '2px' }} 
              />
              Peta Misi Pembelajaran
            </h2>
            <p>Materi berikutnya otomatis terbuka setiap kali kamu menyelesaikan materi sebelumnya.</p>
          </div>
          <div className="mission-duration-tag">
            Total ±3 JP
          </div>
        </div>

        <div className="mission-card-grid">
          {/* Misi 1 (Pretest) */}
          <div 
            className="mission-card active-card"
            onClick={onStartPretest}
            style={{ borderColor: isPretestDone ? '#10B981' : '#0284C7' }}
            title="Klik untuk melihat atau mengulang Pretest"
          >
            <div>
              <div className="mission-top-bar">
                <div 
                  className="mission-number-circle active-badge"
                  style={{ background: isPretestDone ? '#10B981' : '#0284C7' }}
                >
                  {isPretestDone ? '✓' : '1'}
                </div>
                {isPretestDone ? (
                  <span className="tag-start-here" style={{ background: '#ECFDF5', color: '#065F46' }}>
                    ✓ Selesai
                  </span>
                ) : (
                  <span className="tag-start-here">Mulai di sini</span>
                )}
              </div>
              <h4 className="mission-card-title">Pretest Prasyarat</h4>
              <p className="mission-card-desc">
                Cek bekal awal: mol, Mr, konsentrasi, elektrolit.
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: isPretestDone ? '#10B981' : '#0284C7' }}>
                {isPretestDone ? '✓ +20 XP Diraih' : '+20 XP'}
              </span>
            </div>
          </div>

          {/* Misi 2 (Bab 1: Konsentrasi Larutan & Lab Virtual) */}
          <div 
            className={`mission-card ${isCh1Unlocked ? 'active-card' : 'locked-card'}`}
            onClick={isCh1Unlocked ? () => onGoToChapter('chapter1') : undefined}
            style={{ 
              borderColor: isCh1Completed ? '#10B981' : (isCh1Unlocked ? '#0284C7' : '#E2E8F0'),
              cursor: isCh1Unlocked ? 'pointer' : 'default',
              boxShadow: isCh1Unlocked ? '0 4px 16px rgba(2, 132, 199, 0.12)' : 'none'
            }}
            title={isCh1Unlocked ? "Buka Bab 1: Konsentrasi Larutan" : "Selesaikan Pretest untuk membuka"}
          >
            <div>
              <div className="mission-top-bar">
                <div 
                  className={`mission-number-circle ${isCh1Unlocked ? 'active-badge' : 'locked-badge'}`}
                  style={{ background: isCh1Completed ? '#10B981' : (isCh1Unlocked ? '#0284C7' : '#E2E8F0'), color: isCh1Unlocked ? '#FFF' : '#64748B' }}
                >
                  {isCh1Completed ? '✓' : '2'}
                </div>
                {isCh1Completed ? (
                  <span className="tag-start-here" style={{ background: '#ECFDF5', color: '#065F46' }}>✓ Selesai</span>
                ) : (isCh1Unlocked ? (
                  <span className="tag-start-here" style={{ background: '#EFF6FF', color: '#0284C7' }}>Siap Dipelajari</span>
                ) : (
                  <span className="icon-lock">🔒</span>
                ))}
              </div>
              <h4 className="mission-card-title">Bab 1: Konsentrasi</h4>
              <p className="mission-card-desc">
                Molalitas, fraksi mol, dan simulator pembuat larutan.
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: isCh1Completed ? '#10B981' : (isCh1Unlocked ? '#0284C7' : '#94A3B8') }}>
                {isCh1Completed ? '✓ +30 XP Diraih' : '+30 XP'}
              </span>
            </div>
          </div>

          {/* Misi 3 (Bab 2: Penurunan Tekanan Uap & Kenaikan Titik Didih) */}
          <div 
            className={`mission-card ${isCh2Unlocked ? 'active-card' : 'locked-card'}`}
            onClick={isCh2Unlocked ? () => onGoToChapter('chapter2') : undefined}
            style={{ 
              borderColor: isCh2Completed ? '#10B981' : (isCh2Unlocked ? '#0284C7' : '#E2E8F0'),
              cursor: isCh2Unlocked ? 'pointer' : 'default',
              boxShadow: isCh2Unlocked ? '0 4px 16px rgba(2, 132, 199, 0.12)' : 'none'
            }}
            title={isCh2Unlocked ? "Buka Bab 2: Tekanan Uap & Titik Didih" : "Selesaikan Bab 1 untuk membuka"}
          >
            <div>
              <div className="mission-top-bar">
                <div 
                  className={`mission-number-circle ${isCh2Unlocked ? 'active-badge' : 'locked-badge'}`}
                  style={{ background: isCh2Completed ? '#10B981' : (isCh2Unlocked ? '#0284C7' : '#E2E8F0'), color: isCh2Unlocked ? '#FFF' : '#64748B' }}
                >
                  {isCh2Completed ? '✓' : '3'}
                </div>
                {isCh2Completed ? (
                  <span className="tag-start-here" style={{ background: '#ECFDF5', color: '#065F46' }}>✓ Selesai</span>
                ) : (isCh2Unlocked ? (
                  <span className="tag-start-here" style={{ background: '#EFF6FF', color: '#0284C7' }}>Siap Dipelajari</span>
                ) : (
                  <span className="icon-lock">🔒</span>
                ))}
              </div>
              <h4 className="mission-card-title">Bab 2: Titik Didih & Uap</h4>
              <p className="mission-card-desc">
                Hukum Raoult (ΔP) & kenaikan titik didih (ΔTb).
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: isCh2Completed ? '#10B981' : (isCh2Unlocked ? '#0284C7' : '#94A3B8') }}>
                {isCh2Completed ? '✓ +30 XP Diraih' : '+30 XP'}
              </span>
            </div>
          </div>

          {/* Misi 4 (Bab 3: Penurunan Titik Beku & Diagram Fase) */}
          <div 
            className={`mission-card ${isCh3Unlocked ? 'active-card' : 'locked-card'}`}
            onClick={isCh3Unlocked ? () => onGoToChapter('chapter3') : undefined}
            style={{ 
              borderColor: isCh3Completed ? '#10B981' : (isCh3Unlocked ? '#0284C7' : '#E2E8F0'),
              cursor: isCh3Unlocked ? 'pointer' : 'default',
              boxShadow: isCh3Unlocked ? '0 4px 16px rgba(2, 132, 199, 0.12)' : 'none'
            }}
            title={isCh3Unlocked ? "Buka Bab 3: Penurunan Titik Beku" : "Selesaikan Bab 2 untuk membuka"}
          >
            <div>
              <div className="mission-top-bar">
                <div 
                  className={`mission-number-circle ${isCh3Unlocked ? 'active-badge' : 'locked-badge'}`}
                  style={{ background: isCh3Completed ? '#10B981' : (isCh3Unlocked ? '#0284C7' : '#E2E8F0'), color: isCh3Unlocked ? '#FFF' : '#64748B' }}
                >
                  {isCh3Completed ? '✓' : '4'}
                </div>
                {isCh3Completed ? (
                  <span className="tag-start-here" style={{ background: '#ECFDF5', color: '#065F46' }}>✓ Selesai</span>
                ) : (isCh3Unlocked ? (
                  <span className="tag-start-here" style={{ background: '#EFF6FF', color: '#0284C7' }}>Siap Dipelajari</span>
                ) : (
                  <span className="icon-lock">🔒</span>
                ))}
              </div>
              <h4 className="mission-card-title">Bab 3: Titik Beku & Fase</h4>
              <p className="mission-card-desc">
                Rahasia garam di es puter & diagram fase P–T.
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: isCh3Completed ? '#10B981' : (isCh3Unlocked ? '#0284C7' : '#94A3B8') }}>
                {isCh3Completed ? '✓ +30 XP Diraih' : '+30 XP'}
              </span>
            </div>
          </div>

          {/* Misi 5 (Bab 4: Tekanan Osmotik) */}
          <div 
            className={`mission-card ${isCh4Unlocked ? 'active-card' : 'locked-card'}`}
            onClick={isCh4Unlocked ? () => onGoToChapter('chapter4') : undefined}
            style={{ 
              borderColor: isCh4Completed ? '#10B981' : (isCh4Unlocked ? '#0284C7' : '#E2E8F0'),
              cursor: isCh4Unlocked ? 'pointer' : 'default',
              boxShadow: isCh4Unlocked ? '0 4px 16px rgba(2, 132, 199, 0.12)' : 'none'
            }}
            title={isCh4Unlocked ? "Buka Bab 4: Tekanan Osmotik" : "Selesaikan Bab 3 untuk membuka"}
          >
            <div>
              <div className="mission-top-bar">
                <div 
                  className={`mission-number-circle ${isCh4Unlocked ? 'active-badge' : 'locked-badge'}`}
                  style={{ background: isCh4Completed ? '#10B981' : (isCh4Unlocked ? '#0284C7' : '#E2E8F0'), color: isCh4Unlocked ? '#FFF' : '#64748B' }}
                >
                  {isCh4Completed ? '✓' : '5'}
                </div>
                {isCh4Completed ? (
                  <span className="tag-start-here" style={{ background: '#ECFDF5', color: '#065F46' }}>✓ Selesai</span>
                ) : (isCh4Unlocked ? (
                  <span className="tag-start-here" style={{ background: '#EFF6FF', color: '#0284C7' }}>Siap Dipelajari</span>
                ) : (
                  <span className="icon-lock">🔒</span>
                ))}
              </div>
              <h4 className="mission-card-title">Bab 4: Tekanan Osmotik</h4>
              <p className="mission-card-desc">
                Membran semipermeabel & cairan infus isotonik.
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: isCh4Completed ? '#10B981' : (isCh4Unlocked ? '#0284C7' : '#94A3B8') }}>
                {isCh4Completed ? '✓ +30 XP Diraih' : '+30 XP'}
              </span>
            </div>
          </div>

          {/* Misi 6 (Bab 5: Elektrolit & Evaluasi) */}
          <div 
            className={`mission-card ${isCh5Unlocked ? 'active-card' : 'locked-card'}`}
            onClick={isCh5Unlocked ? () => onGoToChapter('chapter5') : undefined}
            style={{ 
              borderColor: isCh5Completed ? '#10B981' : (isCh5Unlocked ? '#0284C7' : '#E2E8F0'),
              cursor: isCh5Unlocked ? 'pointer' : 'default',
              boxShadow: isCh5Unlocked ? '0 4px 16px rgba(2, 132, 199, 0.12)' : 'none'
            }}
            title={isCh5Unlocked ? "Buka Bab 5: Larutan Elektrolit" : "Selesaikan Bab 4 untuk membuka"}
          >
            <div>
              <div className="mission-top-bar">
                <div 
                  className={`mission-number-circle ${isCh5Unlocked ? 'active-badge' : 'locked-badge'}`}
                  style={{ background: isCh5Completed ? '#10B981' : (isCh5Unlocked ? '#0284C7' : '#E2E8F0'), color: isCh5Unlocked ? '#FFF' : '#64748B' }}
                >
                  {isCh5Completed ? '✓' : '6'}
                </div>
                {isCh5Completed ? (
                  <span className="tag-start-here" style={{ background: '#ECFDF5', color: '#065F46' }}>✓ Selesai</span>
                ) : (isCh5Unlocked ? (
                  <span className="tag-start-here" style={{ background: '#EFF6FF', color: '#0284C7' }}>Siap Dipelajari</span>
                ) : (
                  <span className="icon-lock">🔒</span>
                ))}
              </div>
              <h4 className="mission-card-title">Bab 5: Larutan Elektrolit</h4>
              <p className="mission-card-desc">
                Faktor van 't Hoff (i) & perbandingan ionisasi.
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: isCh5Completed ? '#10B981' : (isCh5Unlocked ? '#0284C7' : '#94A3B8') }}>
                {isCh5Completed ? '✓ +50 XP Diraih' : '+50 XP'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
