import React from 'react';

/**
 * Komponen Navbar KoligatifLab 11
 * 
 * Mendukung Mode Ujian Terfokus (isExamLocked):
 * - Jika aktif, seluruh tombol navigasi dinonaktifkan agar siswa fokus
 *   menyelesaikan pretest hingga tuntas.
 */
export default function Header({ currentView = 'home', onSelectTab, isExamLocked = false }) {
  const handleNavClick = (tabId) => {
    if (isExamLocked) {
      alert("🔒 Mode Ujian Terfokus Aktif: Harap selesaikan seluruh soal pretest terlebih dahulu untuk membuka fitur lainnya.");
      return;
    }
    if (onSelectTab) {
      onSelectTab(tabId);
    }
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* 1. Logo Brand */}
        <div 
          className="brand-link" 
          onClick={() => handleNavClick('home')}
          style={{ cursor: isExamLocked ? 'not-allowed' : 'pointer' }}
          title={isExamLocked ? "Navigasi dikunci saat pretest berlangsung" : "Menuju Beranda KoligatifLab 11"}
        >
          <div className="brand-icon" style={{ background: isExamLocked ? '#475569' : '#0284C7' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v5.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 7.5V2"/>
              <path d="M8.5 2h7"/>
              <path d="M7 15h10"/>
            </svg>
          </div>
          <span className="brand-text">
            Koligatif<span>Lab 11</span>
          </span>
        </div>

        {/* 2. Nav Pills (Beranda, Materi, Lab Virtual, Kuis) */}
        <nav className="nav-pills" style={{ opacity: isExamLocked ? 0.6 : 1 }}>
          <button
            type="button"
            className={`nav-pill-btn ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => handleNavClick('home')}
            style={{ cursor: isExamLocked ? 'not-allowed' : 'pointer' }}
          >
            Beranda
          </button>
          <button
            type="button"
            className={`nav-pill-btn ${currentView === 'chapter1' ? 'active' : ''}`}
            onClick={() => handleNavClick('chapter1')}
            style={{ cursor: isExamLocked ? 'not-allowed' : 'pointer' }}
          >
            Materi
          </button>
          <button
            type="button"
            className="nav-pill-btn"
            onClick={() => handleNavClick('chapter1')}
            style={{ cursor: isExamLocked ? 'not-allowed' : 'pointer' }}
            title="Laboratorium Virtual Larutan"
          >
            Lab Virtual
          </button>
          <button
            type="button"
            className="nav-pill-btn"
            onClick={() => {
              if (isExamLocked) {
                handleNavClick('quiz');
              } else {
                alert("Kuis komprehensif akan terbuka otomatis setelah Anda menuntaskan misi lab.");
              }
            }}
            style={{ cursor: isExamLocked ? 'not-allowed' : 'pointer' }}
          >
            Kuis
          </button>
        </nav>

        {/* 3. Status Chip / Mode Ujian Indikator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isExamLocked ? (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#FEF3C7',
              color: '#B45309',
              border: '1px solid #FDE68A',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontWeight: 700
            }}>
              <span>🔒</span>
              <span>Mode Pretest Terkunci</span>
            </div>
          ) : (
            <div className="user-chip" title="Mode Siswa Mandiri">
              <div className="user-avatar-circle">
                NS
              </div>
              <span className="user-name-text">
                [Siswa Tamu]
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
