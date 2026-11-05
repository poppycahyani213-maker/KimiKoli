import React, { useState } from 'react';
import imgTekananUap from '../../assets/fenomena-tekanan-uap.jpg';
import imgTitikDidih from '../../assets/fenomena-titik-didih.jpg';
import imgTitikBeku from '../../assets/fenomena-titik-beku.jpg';
import imgRadiator from '../../assets/fenomena-radiator.jpg';
import imgMentimun from '../../assets/fenomena-mentimun.jpg';
import imgDesalinasi from '../../assets/fenomena-desalinasi.jpg';
import imgElektrolit from '../../assets/fenomena-elektrolit.jpg';

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
            <div className="hero-tag">
              <span>🔬</span>
              <span>KimiKoli · Sifat Koligatif Larutan Kelas XI SMA</span>
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
          2. FENOMENA SIFAT KOLIGATIF DALAM KEHIDUPAN NYATA
             (Ilustrasi Cat Air Disematkan Langsung ke Tiap Narasi)
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
              🎨 Ilustrasi & Penerapan Kehidupan Nyata
            </span>
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0.25rem 0 0', color: '#0F172A', fontFamily: "'Times New Roman', Times, serif" }}>
              Fenomena Sifat Koligatif dalam Kehidupan Nyata
            </h2>
          </div>
          <span style={{ fontSize: '0.9rem', color: '#0369A1', background: '#F0F9FF', padding: '0.45rem 1rem', borderRadius: '20px', border: '1px solid #BAE6FD', fontWeight: 600 }}>
            💡 Klik kartu untuk langsung menuju laboratorium materinya
          </span>
        </div>

        {/* Grid 4 Kartu Fenomena (Tiap Kartu Berisi Ilustrasi Cat Air Langsung) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.25rem'
        }}>
          {/* Kartu 1: Penurunan Titik Beku (Es Krim Puter) */}
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
            title={isCh3Unlocked ? "Klik untuk mempelajari Bab 3: Penurunan Titik Beku" : "Selesaikan bab sebelumnya untuk membuka"}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '135px',
                height: '105px',
                borderRadius: '14px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1.5px solid #FECACA',
                background: '#FFF',
                boxShadow: '0 4px 10px rgba(239, 68, 68, 0.1)'
              }}>
                <img 
                  src={imgTitikBeku} 
                  alt="Ilustrasi Penurunan Titik Beku (Es Krim)" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
              Rahasia pembuatan es puter tradisional tanpa kulkas (menggunakan campuran es batu & garam kasar agar suhu mencapai di bawah 0°C) serta penaburan garam di jalanan bersalju agar es cepat mencair.
            </p>
          </div>

          {/* Kartu 2: Kenaikan Titik Didih (Panci Mendidih) */}
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
            title={isCh2Unlocked ? "Klik untuk mempelajari Bab 2: Tekanan Uap & Titik Didih" : "Selesaikan bab sebelumnya untuk membuka"}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '135px',
                height: '105px',
                borderRadius: '14px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1.5px solid #C7D2FE',
                background: '#FFF',
                boxShadow: '0 4px 10px rgba(99, 102, 241, 0.1)'
              }}>
                <img 
                  src={imgTitikDidih} 
                  alt="Ilustrasi Kenaikan Titik Didih (Panci Mendidih)" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
              Air murni mendidih pada suhu 100°C, namun saat ditambahkan zat terlarut seperti garam atau bumbu, titik didihnya naik di atas 100°C sehingga masakan matang lebih cepat dan empuk merata.
            </p>
          </div>

          {/* Kartu 3: Cairan Radiator Mobil (Etilen Glikol) */}
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
            title={isCh2Unlocked ? "Klik untuk mempelajari penerapan titik didih & beku" : "Selesaikan bab sebelumnya untuk membuka"}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '135px',
                height: '105px',
                borderRadius: '14px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1.5px solid #BBF7D0',
                background: '#FFF',
                boxShadow: '0 4px 10px rgba(34, 197, 94, 0.1)'
              }}>
                <img 
                  src={imgRadiator} 
                  alt="Ilustrasi Cairan Radiator Mobil" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                <span style={{ fontSize: '0.88rem', color: '#0284C7', fontWeight: 700, display: 'block', marginTop: '0.15rem' }}>
                  🚗 Pendingin Mesin (Etilen Glikol)
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.94rem', color: '#475569', lineHeight: 1.6 }}>
              Penerapan ganda sifat koligatif: menaikkan titik didih cairan radiator agar mesin tidak overheat saat cuaca terik, sekaligus menurunkan titik beku agar radiator tidak membeku saat musim dingin.
            </p>
          </div>

          {/* Kartu 4: Tekanan Osmotik (Mentimun & Desalinasi) */}
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
            title={isCh4Unlocked ? "Klik untuk mempelajari Bab 4: Tekanan Osmotik" : "Selesaikan bab sebelumnya untuk membuka"}
          >
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                width: '135px',
                height: '105px',
                borderRadius: '14px',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1.5px solid #BAE6FD',
                background: '#FFF',
                boxShadow: '0 4px 10px rgba(2, 132, 199, 0.1)'
              }}>
                <img 
                  src={imgMentimun} 
                  alt="Ilustrasi Tekanan Osmotik (Acar Mentimun)" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                  Tekanan Osmotik
                </h3>
                <span style={{ fontSize: '0.88rem', color: '#0284C7', fontWeight: 700, display: 'block', marginTop: '0.15rem' }}>
                  🥒 Acar Mentimun & Desalinasi Air
                </span>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.94rem', color: '#475569', lineHeight: 1.6 }}>
              Air dalam sel mentimun keluar saat direndam larutan garam pekat sehingga berkerut menjadi acar. Prinsip kebalikannya (reverse osmosis) digunakan menyaring air laut menjadi air tawar bersih layak minum.
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
