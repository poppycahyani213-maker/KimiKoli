import React, { useState } from 'react';

/**
 * Komponen TripleRepresentation
 * 
 * Menerapkan "Johnstone's Triangle of Chemical Representations":
 * 1. Makroskopik: Pengamatan fenomena sehari-hari yang kasat mata
 * 2. Submikroskopik: Dinamika partikel / molekul zat terlarut vs pelarut
 * 3. Simbolik: Rumus matematis, variabel, satuan, dan penjelasannya
 * 
 * Pengguna dapat beralih menggunakan Mode Tab atau Mode Berdampingan (Side-by-side Grid).
 */
export default function TripleRepresentation({
  title = "Tiga Level Representasi Kimia",
  conceptName = "Sifat Koligatif",
  macroscopic = {},
  submicroscopic = {},
  symbolic = {},
  initialMode = "tab" // 'tab' | 'grid'
}) {
  const [activeTab, setActiveTab] = useState('macro'); // 'macro' | 'submicro' | 'symbolic'
  const [viewMode, setViewMode] = useState(initialMode); // 'tab' | 'grid'

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.94)',
      backdropFilter: 'blur(10px)',
      border: '1.5px solid #BAE6FD',
      borderRadius: '20px',
      padding: 'clamp(1.25rem, 2.5vw, 1.75rem)',
      boxShadow: '0 8px 24px rgba(2, 132, 199, 0.08)',
      marginBottom: '2rem',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      {/* Header & Mode Switcher */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1.25rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            🔬 Segitiga Representasi Kimia (Johnstone)
          </span>
          <h3 style={{ margin: '0.2rem 0 0', fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
            {title} · <span style={{ color: '#0284C7' }}>{conceptName}</span>
          </h3>
        </div>

        {/* Toggle Mode: Tab vs Berdampingan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#F1F5F9', padding: '0.25rem', borderRadius: '10px' }}>
          <button
            type="button"
            onClick={() => setViewMode('tab')}
            style={{
              padding: '0.35rem 0.75rem',
              border: 'none',
              borderRadius: '7px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: viewMode === 'tab' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'tab' ? '#0284C7' : '#64748B',
              boxShadow: viewMode === 'tab' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            📑 Mode Tab
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            style={{
              padding: '0.35rem 0.75rem',
              border: 'none',
              borderRadius: '7px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: viewMode === 'grid' ? '#FFFFFF' : 'transparent',
              color: viewMode === 'grid' ? '#0284C7' : '#64748B',
              boxShadow: viewMode === 'grid' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            📊 Berdampingan
          </button>
        </div>
      </div>

      {/* JIKA MODE TAB: TAMPILKAN TAB NAVIGATION */}
      {viewMode === 'tab' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          background: '#F8FAFC',
          padding: '0.35rem',
          borderRadius: '12px',
          marginBottom: '1.25rem',
          border: '1px solid #E2E8F0'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('macro')}
            style={{
              padding: '0.65rem 0.5rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              background: activeTab === 'macro' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'macro' ? '#B91C1C' : '#64748B',
              boxShadow: activeTab === 'macro' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
              fontFamily: "'Times New Roman', Times, serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <span>👁️</span> 1. Makroskopik
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('submicro')}
            style={{
              padding: '0.65rem 0.5rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              background: activeTab === 'submicro' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'submicro' ? '#0284C7' : '#64748B',
              boxShadow: activeTab === 'submicro' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
              fontFamily: "'Times New Roman', Times, serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <span>⚛️</span> 2. Submikroskopik
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('symbolic')}
            style={{
              padding: '0.65rem 0.5rem',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              background: activeTab === 'symbolic' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'symbolic' ? '#047857' : '#64748B',
              boxShadow: activeTab === 'symbolic' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.2s',
              fontFamily: "'Times New Roman', Times, serif",
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem'
            }}
          >
            <span>📐</span> 3. Simbolik
          </button>
        </div>
      )}

      {/* KONTEN REPRESENTASI (Berdampingan atau Tab Terpilih) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(290px, 1fr))' : '1fr',
        gap: '1.25rem'
      }}>
        {/* =========================================================
            PANEL 1: MAKROSKOPIK (Fenomena Kasat Mata Sehari-hari)
            ========================================================= */}
        {(viewMode === 'grid' || activeTab === 'macro') && (
          <div style={{
            background: '#FFF5F5',
            border: '1.5px solid #FECACA',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #FCA5A5', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem' }}>👁️</span>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#B91C1C', textTransform: 'uppercase' }}>
                  Level 1: Kasat Mata
                </span>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#991B1B' }}>
                  {macroscopic.title || "Pengamatan Makroskopik"}
                </h4>
              </div>
            </div>

            {/* Media Gambar / Contoh Sehari-hari */}
            {macroscopic.image && (
              <div style={{
                borderRadius: '12px',
                overflow: 'hidden',
                background: '#FFFFFF',
                border: '1px solid #FECACA',
                height: '140px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px'
              }}>
                <img
                  src={macroscopic.image}
                  alt={macroscopic.title}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>
            )}

            <p style={{ margin: 0, fontSize: '0.94rem', color: '#475569', lineHeight: 1.6 }}>
              {macroscopic.description}
            </p>

            {/* Poin Pengamatan Indera */}
            {macroscopic.observations && macroscopic.observations.length > 0 && (
              <div style={{ background: '#FFFFFF', padding: '0.75rem', borderRadius: '10px', border: '1px solid #FEE2E2' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#991B1B', display: 'block', marginBottom: '0.25rem' }}>
                  Apa yang Teramati Panca Indera?
                </span>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                  {macroscopic.observations.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* TODO: Guru dapat menambahkan studi kasus makroskopik kontekstual tambahan di sini */}
          </div>
        )}

        {/* =========================================================
            PANEL 2: SUBMIKROSKOPIK (Dinamika Molekul & Partikel)
            ========================================================= */}
        {(viewMode === 'grid' || activeTab === 'submicro') && (
          <div style={{
            background: '#F0F9FF',
            border: '1.5px solid #BAE6FD',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #7DD3FC', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem' }}>⚛️</span>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369A1', textTransform: 'uppercase' }}>
                  Level 2: Skala Partikulat
                </span>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#075985' }}>
                  {submicroscopic.title || "Dinamika Partikel & Molekul"}
                </h4>
              </div>
            </div>

            {/* Animasi / Ilustrasi Partikel Interaktif */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #BAE6FD',
              borderRadius: '12px',
              padding: '0.85rem',
              minHeight: '140px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {submicroscopic.customVisual ? (
                submicroscopic.customVisual
              ) : (
                <div style={{ width: '100%', textAlign: 'center' }}>
                  {/* Legenda Partikel */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', fontSize: '0.78rem', marginBottom: '0.65rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0284C7' }}></span> Molekul Pelarut Air
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: '#EF4444' }}></span> Partikel Zat Terlarut
                    </span>
                  </div>

                  {/* Visual Simulasi Partikel Mini */}
                  <div style={{
                    height: '80px',
                    width: '100%',
                    background: 'linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%)',
                    borderRadius: '8px',
                    position: 'relative',
                    border: '1px solid #7DD3FC',
                    overflow: 'hidden'
                  }}>
                    {/* Partikel Air (Pelarut) */}
                    {[15, 30, 48, 65, 82, 22, 55, 75, 40].map((leftVal, i) => (
                      <span
                        key={`w-${i}`}
                        style={{
                          position: 'absolute',
                          left: `${leftVal}%`,
                          top: `${20 + (i % 3) * 22}px`,
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          background: '#0284C7',
                          boxShadow: '0 1px 3px rgba(2,132,199,0.4)',
                          animation: `floatParticle ${2 + (i % 2)}s ease-in-out infinite alternate`
                        }}
                      />
                    ))}

                    {/* Partikel Terlarut yang Merintangi */}
                    {[28, 58, 70].map((leftVal, i) => (
                      <span
                        key={`s-${i}`}
                        style={{
                          position: 'absolute',
                          left: `${leftVal}%`,
                          top: `${14 + i * 20}px`,
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          background: '#EF4444',
                          border: '2px solid #FFFFFF',
                          boxShadow: '0 2px 4px rgba(239,68,68,0.4)'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p style={{ margin: 0, fontSize: '0.94rem', color: '#475569', lineHeight: 1.6 }}>
              {submicroscopic.description}
            </p>

            {/* Mekanisme Molekuler */}
            {submicroscopic.mechanism && (
              <div style={{ background: '#FFFFFF', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E0F2FE' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0369A1', display: 'block', marginBottom: '0.25rem' }}>
                  Mekanisme Partikulat:
                </span>
                <span style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, display: 'block' }}>
                  {submicroscopic.mechanism}
                </span>
              </div>
            )}
            {/* TODO: Guru dapat menyisipkan animasi video/canvas partikel khusus di sini */}
          </div>
        )}

        {/* =========================================================
            PANEL 3: SIMBOLIK (Rumus Matematis, Variabel & Satuan)
            ========================================================= */}
        {(viewMode === 'grid' || activeTab === 'symbolic') && (
          <div style={{
            background: '#F0FDF4',
            border: '1.5px solid #BBF7D0',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid #86EFAC', paddingBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem' }}>📐</span>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase' }}>
                  Level 3: Matematis & Simbol
                </span>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#166534' }}>
                  {symbolic.title || "Persamaan & Rumus Kimia"}
                </h4>
              </div>
            </div>

            {/* Kotak Rumus Utama */}
            <div style={{
              background: '#FFFFFF',
              border: '2px solid #86EFAC',
              borderRadius: '12px',
              padding: '1rem',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)'
            }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#065F46', letterSpacing: '0.02em' }}>
                {symbolic.formula}
              </div>
              {symbolic.formulaAlt && (
                <div style={{ fontSize: '0.92rem', color: '#047857', marginTop: '0.35rem', fontWeight: 600 }}>
                  {symbolic.formulaAlt}
                </div>
              )}
            </div>

            {/* Tabel Penjelasan Tiap Variabel & Satuannya */}
            {symbolic.variables && symbolic.variables.length > 0 && (
              <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #DCFCE7', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ background: '#F0FDF4', borderBottom: '1px solid #DCFCE7' }}>
                      <th style={{ padding: '0.45rem 0.6rem', textAlign: 'left', color: '#166534', fontWeight: 700, width: '25%' }}>Variabel</th>
                      <th style={{ padding: '0.45rem 0.6rem', textAlign: 'left', color: '#166534', fontWeight: 700 }}>Keterangan</th>
                      <th style={{ padding: '0.45rem 0.6rem', textAlign: 'left', color: '#166534', fontWeight: 700, width: '30%' }}>Satuan Standar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {symbolic.variables.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < symbolic.variables.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                        <td style={{ padding: '0.45rem 0.6rem', fontWeight: 800, color: '#0F172A' }}>{item.symbol}</td>
                        <td style={{ padding: '0.45rem 0.6rem', color: '#475569' }}>{item.desc}</td>
                        <td style={{ padding: '0.45rem 0.6rem', color: '#0284C7', fontWeight: 600 }}>{item.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {symbolic.note && (
              <div style={{ fontSize: '0.85rem', color: '#15803D', fontStyle: 'italic', background: '#F0FDF4', padding: '0.5rem', borderRadius: '8px' }}>
                💡 Catatan: {symbolic.note}
              </div>
            )}
            {/* TODO: Guru dapat menyisipkan soal tantangan hitungan simbolik di sini */}
          </div>
        )}
      </div>
    </div>
  );
}

