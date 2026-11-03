import React from 'react';
import { KIMIKOLI_MODULES } from '../../data/courseChapters';
import ProgressBar from '../common/ProgressBar';

/**
 * Komponen Sidebar Navigasi Kursus KimiKoli
 * 
 * @param {string} currentView - Status view aktif ('home' atau 'chapter1', dst.)
 * @param {Function} onSelectView - Callback saat tombol menu dipilih
 * @param {Array} completedChapters - Daftar id modul yang telah selesai
 */
export default function CourseSidebar({ currentView, onSelectView, completedChapters = [] }) {
  const completedCount = completedChapters.length;

  return (
    <aside style={{
      width: 'var(--sidebar-width)',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-light)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem 1rem',
      gap: '1.25rem'
    }}>
      {/* Tombol Beranda */}
      <button
        onClick={() => onSelectView('home')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textAlign: 'left',
          padding: '0.75rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          background: currentView === 'home' ? 'var(--primary-50)' : 'transparent',
          border: currentView === 'home' ? '1px solid var(--primary-200)' : '1px solid var(--border-light)',
          color: currentView === 'home' ? 'var(--primary-dark)' : 'var(--text-main)',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.9rem',
          transition: 'all var(--transition-speed)'
        }}
      >
        <span style={{ fontSize: '1.1rem' }}>🏠</span>
        <span>Beranda KimiKoli</span>
      </button>

      {/* Progress Belajar */}
      <div>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Progres Belajar Mandiri
        </h4>
        <ProgressBar
          value={completedCount}
          max={KIMIKOLI_MODULES.length}
          label={`${completedCount}/${KIMIKOLI_MODULES.length} Bab Selesai`}
        />
      </div>

      {/* Daftar Modul */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
          Daftar Modul Lembar Belajar
        </h4>

        {KIMIKOLI_MODULES.map((ch) => {
          const isActive = ch.id === currentView;
          const isCompleted = completedChapters.includes(ch.id);
          const isLocked = ch.status === 'locked';

          return (
            <button
              key={ch.id}
              onClick={() => {
                if (!isLocked) {
                  onSelectView(ch.id);
                }
              }}
              disabled={isLocked}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                textAlign: 'left',
                padding: '0.75rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--primary-50)' : 'transparent',
                border: isActive ? '1px solid var(--primary-200)' : '1px solid transparent',
                color: isLocked ? '#94A3B8' : (isActive ? 'var(--primary-dark)' : 'var(--text-main)'),
                cursor: isLocked ? 'not-allowed' : 'pointer',
                opacity: isLocked ? 0.75 : 1,
                transition: 'all var(--transition-speed)'
              }}
              title={isLocked ? 'Modul ini belum tersedia' : ch.title}
            >
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: isCompleted ? 'var(--color-success)' : (isActive ? 'var(--primary-600)' : (isLocked ? '#E2E8F0' : 'var(--bg-alt)')),
                color: isCompleted || isActive ? '#FFFFFF' : (isLocked ? '#94A3B8' : 'var(--text-muted)'),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                flexShrink: 0
              }}>
                {isCompleted ? '✓' : (isLocked ? '🔒' : ch.number)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3 }}>
                  {ch.shortTitle}
                </div>
                <div style={{ fontSize: '0.72rem', color: isLocked ? '#94A3B8' : 'var(--text-muted)', marginTop: '0.15rem' }}>
                  {isLocked ? 'Belum Tersedia' : `Bab ${ch.number}`}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
