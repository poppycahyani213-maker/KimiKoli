import React, { useState } from 'react';

/**
 * Komponen HomePage (Beranda KoligatifLab 11)
 * 
 * Direkonstruksi secara presisi sesuai referensi visual:
 * - Hero interaktif dengan CTA "Mulai Misi 1"
 * - Widget Gamifikasi (Level Peneliti Pemula, XP, dan 4 Slot Lencana)
 * - Peta Misi 6 Tahapan (Misi 1 aktif, Misi 2-6 status terkunci)
 * - Banner Teka-Teki Pembuka interaktif ("Garam vs Gula")
 */
export default function HomePage({ onStartMission1 }) {
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
              Setiap misi membuka satu fenomena: kenapa es puter butuh garam, kenapa infus harus pas kadarnya. Kumpulkan XP dan lencana di setiap langkah.
            </p>

            <div className="hero-cta-group">
              <button
                type="button"
                className="btn btn-primary"
                onClick={onStartMission1}
              >
                Mulai Misi 1: Pretest & Konsentrasi →
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={scrollToMissions}
              >
                Lihat peta misi
              </button>
            </div>

            <span className="hero-subinfo">
              Pretest ±10 menit · tidak memengaruhi nilai rapor
            </span>
          </div>

          {/* Kolom Kanan: Gamification Progress Card */}
          <div className="gamify-card">
            <div className="gamify-header">
              <div className="progress-circle">
                <span className="count">0/6</span>
                <span className="label">misi</span>
              </div>
              <div>
                <div className="gamify-info-sub">Progres kamu</div>
                <h3 className="gamify-rank-title">Peneliti Pemula</h3>
                <div className="gamify-xp-text">0 XP · 100 XP lagi ke level berikutnya</div>
              </div>
            </div>

            <div className="badges-unlock-container">
              <div className="badges-unlock-label">Lencana yang bisa kamu buka</div>
              <div className="badge-slots-row">
                <div className="badge-slot-box" title="Lencana Penurunan Tekanan Uap">
                  <span className="icon">↓</span>
                  <span className="title">Uap</span>
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
            <p>Ikuti urutannya. Misi berikutnya terbuka setelah misi sebelumnya selesai.</p>
          </div>
          <div className="mission-duration-tag">
            Total ±3 JP
          </div>
        </div>

        <div className="mission-card-grid">
          {/* Misi 1 (Aktif & Bisa Diklik) */}
          <div 
            className="mission-card active-card"
            onClick={onStartMission1}
            title="Klik untuk memulai Misi 1"
          >
            <div>
              <div className="mission-top-bar">
                <div className="mission-number-circle active-badge">1</div>
                <span className="tag-start-here">Mulai di sini</span>
              </div>
              <h4 className="mission-card-title">Pretest & Konsentrasi</h4>
              <p className="mission-card-desc">
                Cek bekal awalmu: mol, molalitas, fraksi mol, elektrolit.
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge">+20 XP</span>
            </div>
          </div>

          {/* Misi 2 (Terkunci) */}
          <div className="mission-card locked-card">
            <div>
              <div className="mission-top-bar">
                <div className="mission-number-circle locked-badge">2</div>
                <span className="icon-lock">🔒</span>
              </div>
              <h4 className="mission-card-title">Penurunan Tekanan Uap</h4>
              <p className="mission-card-desc">
                Kenapa air laut lebih lambat kering?
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: '#94A3B8' }}>+30 XP</span>
            </div>
          </div>

          {/* Misi 3 (Terkunci) */}
          <div className="mission-card locked-card">
            <div>
              <div className="mission-top-bar">
                <div className="mission-number-circle locked-badge">3</div>
                <span className="icon-lock">🔒</span>
              </div>
              <h4 className="mission-card-title">Kenaikan Titik Didih</h4>
              <p className="mission-card-desc">
                Air bergaram mendidih lebih lama?
              </p>
            </div>
            <div className="mission-card-footer">
              <span className="xp-badge" style={{ color: '#94A3B8' }}>+30 XP</span>
            </div>
          </div>

          {/* Misi 4 (Terkunci) */}
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

          {/* Misi 5 (Terkunci) */}
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

          {/* Misi 6 (Terkunci) */}
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
