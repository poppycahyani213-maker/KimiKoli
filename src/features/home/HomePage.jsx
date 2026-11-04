import React, { useState } from 'react';

/**
 * Komponen HomePage (Beranda KoligatifLab 11)
 * 
 * Dinamis mengikuti progres belajar:
 * - Jika pretest belum selesai: Menampilkan CTA Mulai Pretest.
 * - Jika pretest SUDAH selesai:
 *   - Misi 1 bertanda "✓ Selesai" (+20 XP).
 *   - Step materi selanjutnya otomatis TERBUKA (Unlocked) dan bisa diklik!
 *   - Hero CTA berubah menjadi "Lanjut ke Materi Konsentrasi & Lab Virtual".
 *   - Widget gamifikasi otomatis bertambah (1/6 misi, 20 XP).
 */
export default function HomePage({ 
  isPretestDone = false, 
  onStartPretest, 
  onGoToChapter1 
}) {
  // State interaktif untuk teka-teki pembuka
  const [selectedGuess, setSelectedGuess] = useState(null);

  const scrollToMissions = () => {
    const el = document.getElementById('peta-misi-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGuess = (choice) => {
    setSelectedGuess(choice);
  };

  return (
    <div className="fade-in" style={{ maxWidth: 'var(--max-content-width)', margin: '0 auto', paddingBottom: '2.5rem' }}>
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

            <h1 className="hero-title">
              Selesaikan 6 misi lab, bongkar rahasia <span className="highlight-blue">larutan</span>.
            </h1>

            <p className="hero-desc">
              {isPretestDone 
                ? "Hebat! Kamu telah menuntaskan pretest. Sekarang lanjutkan eksplorasi ke materi konsentrasi larutan, hitung molalitas, dan amati partikel di lab virtual."
                : "Setiap misi membuka satu fenomena: kenapa es puter butuh garam, kenapa infus harus pas kadarnya. Kumpulkan XP dan lencana di setiap langkah."}
            </p>

            <div className="hero-cta-group">
              {!isPretestDone ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onStartPretest}
                >
                  Mulai Misi 1: Pretest & Konsentrasi →
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onGoToChapter1}
                  style={{ background: '#10B981', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)' }}
                >
                  Lanjut ke Materi Konsentrasi & Lab Virtual →
                </button>
              )}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={scrollToMissions}
              >
                Lihat peta misi
              </button>
            </div>

            <span className="hero-subinfo">
              {!isPretestDone 
                ? "Pretest ±10 menit · tidak memengaruhi nilai rapor"
                : "✓ Pretest telah selesai · Misi selanjutnya telah terbuka"}
            </span>
          </div>

          {/* Kolom Kanan: Gamification Progress Card */}
          <div className="gamify-card">
            <div className="gamify-header">
              <div className="progress-circle" style={{ borderColor: isPretestDone ? '#10B981' : '#0284C7' }}>
                <span className="count">{isPretestDone ? '1/6' : '0/6'}</span>
                <span className="label">misi</span>
              </div>
              <div>
                <div className="gamify-info-sub">Progres kamu</div>
                <h3 className="gamify-rank-title">
                  {isPretestDone ? 'Peneliti Aktif' : 'Peneliti Pemula'}
                </h3>
                <div className="gamify-xp-text" style={{ color: isPretestDone ? '#10B981' : '#0284C7' }}>
                  {isPretestDone ? '20 XP · 80 XP lagi ke level berikutnya' : '0 XP · 100 XP lagi ke level berikutnya'}
                </div>
              </div>
            </div>

            <div className="badges-unlock-container">
              <div className="badges-unlock-label">Lencana yang bisa kamu buka</div>
              <div className="badge-slots-row">
                <div 
                  className="badge-slot-box" 
                  title="Lencana Penurunan Tekanan Uap"
                  style={{ background: isPretestDone ? '#ECFDF5' : '#F8FAFC', borderColor: isPretestDone ? '#10B981' : '#CBD5E1' }}
                >
                  <span className="icon" style={{ color: isPretestDone ? '#10B981' : '#64748B' }}>↓</span>
                  <span className="title" style={{ color: isPretestDone ? '#065F46' : '#475569' }}>Uap</span>
                </div>
                <div className="badge-slot-box" title="Lencana Kenaikan Titik Didih">
                  <span className="icon">💧</span>
                  <span className="title">Didih</span>
                </div>
                <div className="badge-slot-box" title="Lencana Penurunan Titik Beku">
                  <span className="icon">❄️</span>
                  <span className="title">Beku</span>
                </div>
                <div className="badge-slot-box" title="Lencana Tekanan Osmotik">
                  <span className="icon">➕</span>
                  <span className="title">Osmosis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. PETA MISI (6 KARTU TAHAPAN)
          ========================================================= */}
      <section id="peta-misi-section" className="mission-section">
        <div className="mission-header-row">
          <div className="mission-title-group">
            <h2>Peta Misi</h2>
            <p>
              {isPretestDone 
                ? "Pretest selesai! Langkah berikutnya kini siap dipelajari."
                : "Ikuti urutannya. Misi berikutnya terbuka setelah misi sebelumnya selesai."}
            </p>
          </div>
          <div className="mission-duration-tag">
            Total ±3 JP
          </div>
        </div>

        <div className="mission-card-grid">
          {/* Misi 1 (Pretest) */}
          <div 
            className={`mission-card ${isPretestDone ? 'active-card' : 'active-card'}`}
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
                Bekal awal: mol, molalitas, fraksi mol, elektrolit.
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: isPretestDone ? '#10B981' : '#0284C7' }}>
                {isPretestDone ? '✓ +20 XP Diraih' : '+20 XP'}
              </span>
            </div>
          </div>

          {/* Misi 2 (Materi Konsentrasi & Lab Virtual) - TERBUKA OTOMATIS JIKA PRETEST SELESAI */}
          <div 
            className={`mission-card ${isPretestDone ? 'active-card' : 'locked-card'}`}
            onClick={isPretestDone ? onGoToChapter1 : undefined}
            style={{ 
              borderColor: isPretestDone ? '#0284C7' : '#E2E8F0',
              cursor: isPretestDone ? 'pointer' : 'default',
              boxShadow: isPretestDone ? '0 4px 16px rgba(2, 132, 199, 0.15)' : 'none'
            }}
            title={isPretestDone ? "Klik untuk mempelajari Materi Konsentrasi & Lab Virtual" : "Selesaikan Pretest terlebih dahulu"}
          >
            <div>
              <div className="mission-top-bar">
                <div 
                  className={`mission-number-circle ${isPretestDone ? 'active-badge' : 'locked-badge'}`}
                  style={{ background: isPretestDone ? '#0284C7' : '#E2E8F0', color: isPretestDone ? '#FFF' : '#64748B' }}
                >
                  2
                </div>
                {isPretestDone ? (
                  <span className="tag-start-here" style={{ background: '#EFF6FF', color: '#0284C7' }}>
                    Siap Dipelajari
                  </span>
                ) : (
                  <span className="icon-lock">🔒</span>
                )}
              </div>
              <h4 className="mission-card-title">Materi & Lab Konsentrasi</h4>
              <p className="mission-card-desc">
                Hitung molalitas, fraksi mol, dan racik larutan virtual.
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: isPretestDone ? '#0284C7' : '#94A3B8' }}>
                +30 XP
              </span>
            </div>
          </div>

          {/* Misi 3 (Penurunan Tekanan Uap & Titik Didih) */}
          <div className="mission-card locked-card">
            <div>
              <div className="mission-top-bar">
                <div className="mission-number-circle locked-badge">3</div>
                <span className="icon-lock">🔒</span>
              </div>
              <h4 className="mission-card-title">Kenaikan Titik Didih</h4>
              <p className="mission-card-desc">
                Air bergaram mendidih lebih tinggi?
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: '#94A3B8' }}>+30 XP</span>
            </div>
          </div>

          {/* Misi 4 (Penurunan Titik Beku) */}
          <div className="mission-card locked-card">
            <div>
              <div className="mission-top-bar">
                <div className="mission-number-circle locked-badge">4</div>
                <span className="icon-lock">🔒</span>
              </div>
              <h4 className="mission-card-title">Penurunan Titik Beku</h4>
              <p className="mission-card-desc">
                Rahasia garam di gerobak es puter.
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: '#94A3B8' }}>+30 XP</span>
            </div>
          </div>

          {/* Misi 5 (Tekanan Osmotik) */}
          <div className="mission-card locked-card">
            <div>
              <div className="mission-top-bar">
                <div className="mission-number-circle locked-badge">5</div>
                <span className="icon-lock">🔒</span>
              </div>
              <h4 className="mission-card-title">Tekanan Osmotik</h4>
              <p className="mission-card-desc">
                Kenapa cairan infus harus isotonik?
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: '#94A3B8' }}>+30 XP</span>
            </div>
          </div>

          {/* Misi 6 (Posttest & Sertifikat) */}
          <div className="mission-card locked-card">
            <div>
              <div className="mission-top-bar">
                <div className="mission-number-circle locked-badge">6</div>
                <span className="icon-lock">🔒</span>
              </div>
              <h4 className="mission-card-title">Posttest & Sertifikat</h4>
              <p className="mission-card-desc">
                Buktikan kamu sudah jadi ahli larutan.
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: '#94A3B8' }}>+50 XP</span>
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
          <h3 className="teaser-question">
            Garam atau gula: mana yang lebih cepat membuat es di gerobak es puter makin dingin?
          </h3>
          <p className="teaser-subtext">
            Simpan tebakanmu. Jawabannya terbuka secara ilmiah di Misi 4.
            {selectedGuess && (
              <span style={{ display: 'block', marginTop: '0.4rem', color: '#38BDF8', fontWeight: 600 }}>
                💡 Kamu memilih {selectedGuess}! Pelajari faktor van 't Hoff & jumlah partikel ion di lab nanti.
              </span>
            )}
          </p>
        </div>

        <div className="teaser-interactive-actions">
          <button
            type="button"
            className={`choice-btn ${selectedGuess === 'Garam' ? 'selected-correct' : ''}`}
            onClick={() => handleGuess('Garam')}
          >
            Garam
          </button>
          <button
            type="button"
            className={`choice-btn ${selectedGuess === 'Gula' ? 'selected-wrong' : ''}`}
            onClick={() => handleGuess('Gula')}
          >
            Gula
          </button>
        </div>
      </section>
    </div>
  );
}
