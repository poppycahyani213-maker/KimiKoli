import React from 'react';

/**
 * Komponen MisconceptionCard
 * 
 * Menyoroti miskonsepsi umum yang sering dialami siswa SMA pada materi Sifat Koligatif Larutan,
 * membedakan antara "Miskonsepsi Umum (SALAH)" dengan "Fakta Ilmiah yang Benar".
 */
export default function MisconceptionCard({
  myth = "Miskonsepsi yang sering dipercaya",
  fact = "Penjelasan konsep kimia yang benar dan terbukti secara ilmiah",
  explanation = "",
  badge = "Miskonsepsi Umum"
}) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
      border: '1.5px solid #FCD34D',
      borderRadius: '16px',
      padding: '1.25rem',
      marginBottom: '1.5rem',
      boxShadow: '0 4px 14px rgba(245, 158, 11, 0.08)',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
        <span style={{ fontSize: '1.3rem' }}>⚠️</span>
        <span style={{
          fontSize: '0.78rem',
          fontWeight: 800,
          background: '#B45309',
          color: '#FFFFFF',
          padding: '0.2rem 0.6rem',
          borderRadius: '6px',
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {badge}
        </span>
      </div>

      {/* Miskonsepsi Salah */}
      <div style={{
        background: 'rgba(254, 242, 242, 0.9)',
        borderLeft: '4px solid #EF4444',
        padding: '0.65rem 0.85rem',
        borderRadius: '0 8px 8px 0',
        marginBottom: '0.65rem'
      }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#B91C1C', textTransform: 'uppercase' }}>
          ❌ Miskonsepsi yang Sering Terjadi:
        </div>
        <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#991B1B', marginTop: '0.15rem' }}>
          "{myth}"
        </div>
      </div>

      {/* Fakta Ilmiah Benar */}
      <div style={{
        background: 'rgba(240, 253, 244, 0.9)',
        borderLeft: '4px solid #10B981',
        padding: '0.65rem 0.85rem',
        borderRadius: '0 8px 8px 0'
      }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>
          ✓ Fakta Ilmiah yang Benar:
        </div>
        <div style={{ fontSize: '0.95rem', color: '#064E3B', marginTop: '0.15rem', lineHeight: 1.55 }}>
          {fact}
        </div>
        {explanation && (
          <div style={{ fontSize: '0.88rem', color: '#334155', marginTop: '0.35rem', lineHeight: 1.5 }}>
            {explanation}
          </div>
        )}
      </div>
    </div>
  );
}

