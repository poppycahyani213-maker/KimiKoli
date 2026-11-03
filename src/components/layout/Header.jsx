import React from 'react';

/**
 * Komponen Navbar KoligatifLab 11
 * 
 * Sesuai desain acuan:
 * - Logo & Nama Platform
 * - Pill Tabs: Beranda, Materi, Lab Virtual, Kuis
 * - Avatar Inisial Siswa (tanpa meminta data pribadi)
 */
export default function Header({ currentView = 'home', onSelectTab }) {
  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* 1. Logo Brand */}
        <div 
          className="brand-link" 
          onClick={() => onSelectTab && onSelectTab('home')}
          title="Menuju Beranda KoligatifLab 11"
        >
          <div className="brand-icon">
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
        <nav className="nav-pills">
          <button
            type="button"
            className={`nav-pill-btn ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => onSelectTab && onSelectTab('home')}
          >
            Beranda
          </button>
          <button
            type="button"
            className={`nav-pill-btn ${currentView === 'chapter1' ? 'active' : ''}`}
            onClick={() => onSelectTab && onSelectTab('chapter1')}
          >
            Materi
          </button>
          <button
            type="button"
            className="nav-pill-btn"
            onClick={() => onSelectTab && onSelectTab('chapter1')}
            title="Laboratorium Virtual Larutan"
          >
            Lab Virtual
          </button>
          <button
            type="button"
            className="nav-pill-btn"
            onClick={() => alert("Kuis komprehensif akan terbuka otomatis setelah Anda menuntaskan misi lab.")}
          >
            Kuis
          </button>
        </nav>

        {/* 3. User Avatar Chip */}
        <div className="user-chip" title="Mode Siswa Mandiri">
          <div className="user-avatar-circle">
            NS
          </div>
          <span className="user-name-text">
            [Siswa Tamu]
          </span>
        </div>
      </div>
    </header>
  );
}
