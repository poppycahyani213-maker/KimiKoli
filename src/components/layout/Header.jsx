import React from 'react';
import kimikoliIcon from '../../assets/kimikoli-icon.jpg';

/**
 * Komponen Navbar KoligatifLab 11
 * 
 * Menampilkan:
 * - Logo & Nama Platform
 * - Pill Tabs Navigasi
 * - Chip Pengguna (Siswa: Nama & Kelas; Guru: Tombol Panel Guru & Nama)
 * - Tombol Keluar (Logout)
 */
export default function Header({ 
  currentView = 'home', 
  onSelectTab, 
  isExamLocked = false,
  currentUser = null,
  onLogout,
  onOpenTeacherPanel,
  isAllMaterialCompleted = false,
  isLabVirtualCompleted = false
}) {
  const isTeacher = currentUser?.role === 'teacher';

  const handleNavClick = (tabId) => {
    if (isExamLocked) {
      alert("🔒 Mode Ujian Terfokus Aktif: Harap selesaikan seluruh soal pretest terlebih dahulu untuk membuka fitur lainnya.");
      return;
    }
    
    // Guru memiliki akses bebas ke seluruh fitur
    if (isTeacher) {
      if (tabId === 'quiz') tabId = 'chapter6';
      if (onSelectTab) onSelectTab(tabId);
      return;
    }

    if (tabId === 'quiz') {
      tabId = 'chapter6';
    }

    if (onSelectTab) {
      onSelectTab(tabId);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* 1. Logo Brand */}
        <div 
          className="brand-link" 
          onClick={() => handleNavClick('home')}
          style={{ cursor: isExamLocked ? 'not-allowed' : 'pointer' }}
          title={isExamLocked ? "Navigasi dikunci saat pretest berlangsung" : "Menuju Beranda KimiKoli"}
        >
          <div className="brand-icon" style={{ 
            background: '#FFFFFF', 
            border: '1.5px solid #BAE6FD',
            borderRadius: '10px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px',
            boxShadow: '0 2px 6px rgba(2, 132, 199, 0.14)'
          }}>
            <img 
              src={kimikoliIcon} 
              alt="Logo KimiKoli" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <span className="brand-text">
            Kimi<span>Koli</span>
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
            className={`nav-pill-btn ${(currentView.startsWith('chapter') && currentView !== 'chapter6') ? 'active' : ''}`}
            onClick={() => handleNavClick('chapter1')}
            style={{ cursor: isExamLocked ? 'not-allowed' : 'pointer' }}
          >
            Materi
          </button>
          <button
            type="button"
            className={`nav-pill-btn ${currentView === 'lab-virtual' ? 'active' : ''}`}
            onClick={() => handleNavClick('lab-virtual')}
            style={{ 
              cursor: isExamLocked ? 'not-allowed' : 'pointer',
              color: !isAllMaterialCompleted ? '#94A3B8' : undefined
            }}
            title={(isAllMaterialCompleted || isTeacher) ? "Laboratorium Virtual (Terbuka)" : "🔒 Selesaikan Bab 1-5 untuk membuka"}
          >
            {(!isAllMaterialCompleted && !isTeacher) ? '🔒 Lab Virtual' : '🔬 Lab Virtual'}
          </button>
          <button
            type="button"
            className={`nav-pill-btn ${currentView === 'chapter6' ? 'active' : ''}`}
            onClick={() => handleNavClick('quiz')}
            style={{ 
              cursor: isExamLocked ? 'not-allowed' : 'pointer',
              color: (!isLabVirtualCompleted && !isTeacher) ? '#94A3B8' : undefined
            }}
            title={(isLabVirtualCompleted || isTeacher) ? "Kuis Evaluasi Akhir (Terbuka)" : "🔒 Selesaikan Lab Virtual untuk membuka"}
          >
            {(!isLabVirtualCompleted && !isTeacher) ? '🔒 Kuis' : '🏆 Kuis'}
          </button>
        </nav>

        {/* 3. Status Chip / Pengguna & Tombol Keluar */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {/* Tombol Khusus Guru untuk Buka Panel Rekap */}
              {isTeacher && (
                <button
                  type="button"
                  onClick={onOpenTeacherPanel}
                  className="btn btn-secondary"
                  style={{
                    padding: '0.35rem 0.85rem',
                    fontSize: '0.825rem',
                    background: currentView === 'teacher-dashboard' ? '#0F172A' : '#EFF6FF',
                    color: currentView === 'teacher-dashboard' ? '#FFF' : '#0284C7',
                    borderColor: '#38BDF8'
                  }}
                  title="Lihat Rekapitulasi Nilai & Progres Siswa"
                >
                  📊 Panel Rekap Siswa
                </button>
              )}

              {/* Chip Avatar Pengguna */}
              <div className="user-chip" title={isTeacher ? "Akun Guru" : `Siswa: ${currentUser?.name} (${currentUser?.className})`}>
                <div 
                  className="user-avatar-circle"
                  style={{ background: isTeacher ? '#0F172A' : '#F59E0B' }}
                >
                  {isTeacher ? '🔬' : getInitials(currentUser?.name)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                  <span className="user-name-text" style={{ fontSize: '0.85rem' }}>
                    {currentUser?.name || '[Siswa Tamu]'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    {isTeacher ? 'Guru Kimia' : currentUser?.className || 'Kelas XI'}
                  </span>
                </div>
              </div>

              {/* Tombol Keluar / Ganti Akun */}
              <button
                type="button"
                onClick={onLogout}
                className="btn btn-outline"
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.8rem',
                  borderColor: '#E2E8F0',
                  color: '#64748B'
                }}
                title="Keluar / Ganti Akun"
              >
                Keluar 🚪
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
