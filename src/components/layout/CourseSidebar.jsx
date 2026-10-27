import React from 'react';
import { COURSE_CHAPTERS } from '../../data/courseChapters';
import ProgressBar from '../common/ProgressBar';

export default function CourseSidebar({ activeChapterId, onSelectChapter, completedChapters = [] }) {
  const completedCount = completedChapters.length;
  const progressPercent = Math.round((completedCount / COURSE_CHAPTERS.length) * 100);

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
      <div>
        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          Progres Pembelajaran
        </h4>
        <ProgressBar value={completedCount} max={COURSE_CHAPTERS.length} label={`${completedCount}/${COURSE_CHAPTERS.length} Bab Selesai`} />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', margin: '0.5rem 0' }}>
          Daftar Modul Belajar
        </h4>
        {COURSE_CHAPTERS.map((ch) => {
          const isActive = ch.id === activeChapterId;
          const isCompleted = completedChapters.includes(ch.id);

          return (
            <button
              key={ch.id}
              onClick={() => onSelectChapter(ch.id)}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
                textAlign: 'left',
                padding: '0.75rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--primary-50)' : 'transparent',
                border: isActive ? '1px solid var(--primary-200)' : '1px solid transparent',
                color: isActive ? 'var(--primary-dark)' : 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all var(--transition-speed)'
              }}
            >
              <div style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: isCompleted ? 'var(--color-success)' : (isActive ? 'var(--primary-600)' : 'var(--bg-alt)'),
                color: isCompleted || isActive ? '#FFFFFF' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700,
                flexShrink: 0
              }}>
                {isCompleted ? '✓' : ch.number}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  {ch.shortTitle}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                  Bab {ch.number}
                </div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

