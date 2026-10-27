import React from 'react';
import Badge from '../common/Badge';

export default function Header({ currentChapterNumber, totalChapters = 6 }) {
  return (
    <header style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-light)',
      height: 'var(--header-height)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 38,
          height: 38,
          borderRadius: 8,
          background: 'linear-gradient(135deg, var(--primary-600), var(--color-solvent))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFF',
          fontWeight: 'bold',
          fontSize: '1.2rem'
        }}>
          🧪
        </div>
        <div>
          <h1 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Koligatif<span style={{ color: 'var(--primary-600)' }}>Lab 11</span>
          </h1>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Fase F Kimia SMA Kelas 11 • Kurikulum Merdeka
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Badge variant="blue">
          Bab {currentChapterNumber} dari {totalChapters}
        </Badge>
      </div>
    </header>
  );
}

