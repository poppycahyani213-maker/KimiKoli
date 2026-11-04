import React, { useState } from 'react';

/**
 * Komponen HomePage (Beranda KoligatifLab 11)
 * 
 * Dinamis mengikuti progres belajar berurutan (Sequential Learning Path):
 * - Siswa menyelesaikan satu materi -> materi selanjutnya OTOMATIS TERBUKA.
 * - Peta Misi 6 Tahap otomatis mengupdate status (Terkunci 🔒, Siap Dipelajari, ✓ Selesai).
 */
export default function HomePage({ 
  isPretestDone = false, 
  completedChapters = [],
  onStartPretest, 
  onGoToChapter 
}) {
  const [selectedGuess, setSelectedGuess] = useState(null);

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

  const currentXp = (isPretestDone ? 20 : 0) + (completedChapters.length * 30);

  // Menentukan materi tujuan untuk tombol Hero utama
  const getNextAvailableView = () => {
    if (!isPretestDone) return { label: 'Mulai Misi 1: Pretest Prasyarat →', action: onStartPretest };
    if (!isCh1Completed) return { label: 'Lanjut Misi: Bab 1 Konsentrasi Larutan →', action: () => onGoToChapter('chapter1') };
    if (!isCh2Completed) return { label: 'Lanjut Misi: Bab 2 Tekanan Uap & Titik Didih →', action: () => onGoToChapter('chapter2') };
    if (!isCh3Completed) return { label: 'Lanjut Misi: Bab 3 Penurunan Titik Beku →', action: () => onGoToChapter('chapter3') };
    if (!isCh4Completed) return { label: 'Lanjut Misi: Bab 4 Tekanan Osmotik →', action: () => onGoToChapter('chapter4') };
    return { label: 'Lanjut Misi: Bab 5 Larutan Elektrolit →', action: () => onGoToChapter('chapter5') };
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
          1. HERO SECTION (2 KOLOM)
          ========================================================= */}
      <section className="hero-section">
        <div className="hero-grid">
          {/* Kolom Kiri: Headline & CTA */}
          <div>
            <div className="hero-tag">
              <span>🔬</span>
              <span>Kelas XI · Sifat Koligatif Larutan</span>
            </div>

            <h1 className="hero-title" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
              Selesaikan 6 misi lab, bongkar rahasia <span className="highlight-blue">larutan</span>.
            </h1>

            <p className="hero-desc" style={{ fontSize: '1.05rem', lineHeight: 1.65 }}>
              {totalMissionsDone > 0 
                ? `Progres luar biasa! Kamu telah menuntaskan ${totalMissionsDone} misi belajar. Terus lanjutkan untuk membuka fenomena koligatif berikutnya.`
                : "Setiap misi membuka satu fenomena: kenapa es puter butuh garam, kenapa infus harus pas kadarnya. Kumpulkan XP dan lencana di setiap langkah."}
            </p>

            <div className="hero-cta-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={nextAction.action}
                style={{
                  background: totalMissionsDone > 0 ? '#10B981' : '#0284C7',
                  boxShadow: totalMissionsDone > 0 ? '0 4px 14px rgba(16, 185, 129, 0.3)' : '0 4px 14px rgba(2, 132, 199, 0.3)',
                  padding: '0.85rem 1.8rem',
                  fontSize: '1.05rem'
                }}
              >
                {nextAction.label}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={scrollToMissions}
                style={{ padding: '0.85rem 1.5rem', fontSize: '1rem' }}
              >
                Lihat peta misi
              </button>
            </div>

            <span className="hero-subinfo">
              {totalMissionsDone > 0 
                ? `✓ ${totalMissionsDone} dari 6 misi telah berhasil dituntaskan`
                : "Pretest ±10 menit · tidak memengaruhi nilai rapor"}
            </span>
          </div>

          {/* Kolom Kanan: Gamification Progress Card */}
          <div className="gamify-card">
            <div className="gamify-header">
              <div className="progress-circle" style={{ borderColor: totalMissionsDone > 0 ? '#10B981' : '#0284C7' }}>
                <span className="count">{totalMissionsDone}/6</span>
                <span className="label">misi</span>
              </div>
              <div>
                <div className="gamify-info-sub">Progres kamu</div>
                <h3 className="gamify-rank-title" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                  {totalMissionsDone >= 4 ? 'Ahli Koligatif' : (totalMissionsDone >= 1 ? 'Peneliti Aktif' : 'Peneliti Pemula')}
                </h3>
                <div className="gamify-xp-text" style={{ color: totalMissionsDone > 0 ? '#10B981' : '#0284C7' }}>
                  {currentXp} XP · {Math.max(0, 100 - currentXp)} XP lagi ke level berikutnya
                </div>
              </div>
            </div>

            <div className="badges-unlock-container">
              <div className="badges-unlock-label">Lencana yang bisa kamu buka</div>
              <div className="badge-slots-row">
                <div 
                  className="badge-slot-box" 
                  title="Lencana Penurunan Tekanan Uap"
                  style={{ background: isCh1Completed ? '#ECFDF5' : '#F8FAFC', borderColor: isCh1Completed ? '#10B981' : '#CBD5E1' }}
                >
                  <span className="icon" style={{ color: isCh1Completed ? '#10B981' : '#64748B' }}>↓</span>
                  <span className="title" style={{ color: isCh1Completed ? '#065F46' : '#475569' }}>Uap</span>
                </div>
                <div 
                  className="badge-slot-box" 
                  title="Lencana Kenaikan Titik Didih"
                  style={{ background: isCh2Completed ? '#ECFDF5' : '#F8FAFC', borderColor: isCh2Completed ? '#10B981' : '#CBD5E1' }}
                >
                  <span className="icon" style={{ color: isCh2Completed ? '#10B981' : '#64748B' }}>💧</span>
                  <span className="title" style={{ color: isCh2Completed ? '#065F46' : '#475569' }}>Didih</span>
                </div>
                <div 
                  className="badge-slot-box" 
                  title="Lencana Penurunan Titik Beku"
                  style={{ background: isCh3Completed ? '#ECFDF5' : '#F8FAFC', borderColor: isCh3Completed ? '#10B981' : '#CBD5E1' }}
                >
                  <span className="icon" style={{ color: isCh3Completed ? '#10B981' : '#64748B' }}>❄️</span>
                  <span className="title" style={{ color: isCh3Completed ? '#065F46' : '#475569' }}>Beku</span>
                </div>
                <div 
                  className="badge-slot-box" 
                  title="Lencana Tekanan Osmotik"
                  style={{ background: isCh4Completed ? '#ECFDF5' : '#F8FAFC', borderColor: isCh4Completed ? '#10B981' : '#CBD5E1' }}
                >
                  <span className="icon" style={{ color: isCh4Completed ? '#10B981' : '#64748B' }}>➕</span>
                  <span className="title" style={{ color: isCh4Completed ? '#065F46' : '#475569' }}>Osmosis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. PETA MISI (6 KARTU TAHAPAN BERURUTAN)
          ========================================================= */}
      <section id="peta-misi-section" className="mission-section">
        <div className="mission-header-row">
          <div className="mission-title-group">
            <h2 style={{ fontFamily: "'Times New Roman', Times, serif" }}>Peta Misi Pembelajaran</h2>
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

      {/* =========================================================
          3. TEKA-TEKI PEMBUKA (INTERACTIVE CURIOSITY BANNER)
          ========================================================= */}
      <section className="teaser-banner">
        <div>
          <div className="teaser-pill">Teka–teki pembuka</div>
          <h3 className="teaser-question" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
            Garam atau gula: mana yang lebih cepat membuat es di gerobak es puter makin dingin?
          </h3>
          <p className="teaser-subtext" style={{ fontSize: '0.95rem' }}>
            Simpan tebakanmu. Jawabannya terbuka secara ilmiah di Bab 3 dan Bab 5.
            {selectedGuess && (
              <span style={{ display: 'block', marginTop: '0.4rem', color: '#38BDF8', fontWeight: 600 }}>
                💡 Kamu memilih {selectedGuess}! Pelajari faktor van 't Hoff & jumlah partikel ion di materi nanti.
              </span>
            )}
          </p>
        </div>

        <div className="teaser-interactive-actions">
          <button
            type="button"
            className={`choice-btn ${selectedGuess === 'Garam' ? 'selected-correct' : ''}`}
            onClick={() => setSelectedGuess('Garam')}
          >
            Garam
          </button>
          <button
            type="button"
            className={`choice-btn ${selectedGuess === 'Gula' ? 'selected-wrong' : ''}`}
            onClick={() => setSelectedGuess('Gula')}
          >
            Gula
          </button>
        </div>
      </section>
    </div>
  );
}
