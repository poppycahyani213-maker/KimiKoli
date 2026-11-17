import React, { useState } from 'react';

/**
 * Komponen Particle3DChamber
 * 
 * Visualisasi partikulat skala submikroskopik interaktif 3D:
 * - Molekul pelarut air (bola kristal cyan/safir 3D dengan highlight mengilap)
 * - Partikel zat terlarut (bola ruby/amber 3D dengan aura neon bercahaya)
 * - Bejana kaca lab realistis dengan skala ukur (mL), permukaan fluida bergelombang,
 *   dan gelembung mikro
 * - Mode interaktif: Beralih antara "Air Murni" dan "Larutan (+ Zat Terlarut)"
 * - Kontrol energi termal / kecepatan gerak Brown (Normal vs Panas)
 */
export default function Particle3DChamber() {
  const [hasSolute, setHasSolute] = useState(true);
  const [speedMode, setSpeedMode] = useState('normal'); // 'normal' | 'fast'
  const [hoveredParticle, setHoveredParticle] = useState(null);

  // Posisi molekul pelarut air (H2O)
  const waterParticles = [
    { id: 'w1', x: 12, y: 35, delay: 0 },
    { id: 'w2', x: 28, y: 68, delay: 0.4 },
    { id: 'w3', x: 42, y: 32, delay: 0.8 },
    { id: 'w4', x: 58, y: 65, delay: 1.2 },
    { id: 'w5', x: 74, y: 36, delay: 0.3 },
    { id: 'w6', x: 88, y: 62, delay: 0.9 },
    { id: 'w7', x: 20, y: 48, delay: 0.6 },
    { id: 'w8', x: 50, y: 50, delay: 1.1 },
    { id: 'w9', x: 80, y: 48, delay: 0.2 },
    { id: 'w10', x: 35, y: 82, delay: 0.7 },
    { id: 'w11', x: 65, y: 80, delay: 0.5 },
    { id: 'w12', x: 92, y: 28, delay: 1.0 }
  ];

  // Posisi partikel zat terlarut (glukosa / garam)
  const soluteParticles = [
    { id: 's1', x: 26, y: 24, label: 'Penghalang Permukaan' },
    { id: 's2', x: 56, y: 22, label: 'Penghalang Permukaan' },
    { id: 's3', x: 70, y: 68, label: 'Partikel di Kedalaman' }
  ];

  const animDuration = speedMode === 'fast' ? '1.1s' : '2.4s';

  return (
    <div style={{ width: '100%', fontFamily: "'Times New Roman', Times, serif" }}>
      {/* 1. LEGENDA 3D MODERN & EYE-CATCHING */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        flexWrap: 'wrap',
        marginBottom: '0.85rem'
      }}>
        {/* Molekul Pelarut Air */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
          border: '1.5px solid #7DD3FC',
          borderRadius: '30px',
          padding: '0.35rem 0.85rem',
          boxShadow: '0 2px 8px rgba(2, 132, 199, 0.12)'
        }}>
          <span style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #E0F2FE 0%, #38BDF8 30%, #0284C7 70%, #0369A1 100%)',
            boxShadow: '0 3px 6px rgba(2, 132, 199, 0.45), inset -1px -1px 3px rgba(3, 105, 161, 0.8), inset 1px 1px 2px #FFFFFF',
            display: 'inline-block',
            position: 'relative'
          }}>
            {/* Specular Glint */}
            <span style={{
              position: 'absolute',
              top: '2px',
              left: '3px',
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: '#FFFFFF',
              opacity: 0.95
            }} />
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0369A1' }}>
            Molekul Pelarut Air (H₂O)
          </span>
        </div>

        {/* Partikel Zat Terlarut */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
          border: '1.5px solid #FDA4AF',
          borderRadius: '30px',
          padding: '0.35rem 0.85rem',
          boxShadow: '0 2px 8px rgba(225, 29, 72, 0.14)'
        }}>
          <span style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 32% 28%, #FFE4E6 0%, #FB7185 25%, #E11D48 65%, #9F1239 100%)',
            boxShadow: '0 0 10px rgba(244, 63, 94, 0.7), inset -1px -1px 3px rgba(136, 19, 55, 0.8), inset 1.5px 1.5px 2px #FFFFFF',
            display: 'inline-block',
            position: 'relative'
          }}>
            {/* Specular Glint */}
            <span style={{
              position: 'absolute',
              top: '2px',
              left: '3px',
              width: '4.5px',
              height: '4.5px',
              borderRadius: '50%',
              background: '#FFFFFF',
              opacity: 0.95
            }} />
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#BE123C' }}>
            Partikel Zat Terlarut
          </span>
        </div>
      </div>

      {/* 2. BEJANA KACA LAB 3D (CHAMBER CAIRAN) */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        height: '190px',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 25%, #BAE6FD 100%)',
        borderRadius: '16px',
        border: '2.5px solid #38BDF8',
        boxShadow: 'inset 0 2px 8px rgba(255,255,255,0.9), 0 8px 24px rgba(2, 132, 199, 0.16)',
        overflow: 'hidden',
        perspective: '600px'
      }}>
        {/* Pantulan Kaca Atas (Glass Rim Sheen) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.95) 50%, rgba(255,255,255,0.2) 100%)',
          zIndex: 5
        }} />

        {/* Skala Ukur Gelas Laboratorium (mL Ticks di samping kiri) */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          zIndex: 4,
          opacity: 0.65,
          userSelect: 'none'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '1.5px', background: '#0284C7' }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0369A1' }}>100 mL</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '1.5px', background: '#0284C7' }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0369A1' }}>75 mL</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '1.5px', background: '#0284C7' }} />
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#0369A1' }}>50 mL</span>
          </div>
        </div>

        {/* Permukaan Cairan (Meniscus Line) dengan Efek Gelombang Halus */}
        <div style={{
          position: 'absolute',
          top: '38px',
          left: 0,
          right: 0,
          height: '18px',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(56,189,248,0.4) 100%)',
          borderBottom: '1.5px dashed #0284C7',
          zIndex: 3
        }}>
          <span style={{
            position: 'absolute',
            right: '14px',
            top: '-16px',
            fontSize: '0.7rem',
            fontWeight: 800,
            color: '#0284C7',
            background: 'rgba(255,255,255,0.9)',
            padding: '1px 6px',
            borderRadius: '4px',
            border: '1px solid #BAE6FD'
          }}>
            Permukaan Cairan
          </span>
        </div>

        {/* Gelembung Mikro Naik di Cairan */}
        {[20, 45, 68, 85].map((xPos, idx) => (
          <span
            key={`bubble-${idx}`}
            style={{
              position: 'absolute',
              left: `${xPos}%`,
              bottom: '10px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #FFFFFF 0%, rgba(255,255,255,0.3) 70%, transparent 100%)',
              border: '0.5px solid rgba(255,255,255,0.8)',
              animation: `bubbleAscent ${2.5 + idx * 0.7}s ease-in infinite`,
              animationDelay: `${idx * 0.6}s`,
              pointerEvents: 'none'
            }}
          />
        ))}

        {/* LAYER MOLEKUL PELARUT AIR (H2O) */}
        {waterParticles.map((p) => (
          <div
            key={p.id}
            onMouseEnter={() => setHoveredParticle({ type: 'water', text: 'Molekul Air (Pelarut): Bebas bergerak dan menguap jika tidak terhalang' })}
            onMouseLeave={() => setHoveredParticle(null)}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #E0F2FE 0%, #38BDF8 30%, #0284C7 70%, #0369A1 100%)',
              boxShadow: '0 4px 10px rgba(2, 132, 199, 0.45), inset -1.5px -1.5px 3px rgba(3, 105, 161, 0.8), inset 1.5px 1.5px 3px #FFFFFF',
              cursor: 'pointer',
              zIndex: 2,
              animation: `float3d ${animDuration} ease-in-out infinite alternate`,
              animationDelay: `${p.delay}s`,
              transition: 'transform 0.2s ease'
            }}
          >
            {/* Specular Highlight Point */}
            <span style={{
              position: 'absolute',
              top: '2.5px',
              left: '3.5px',
              width: '4.5px',
              height: '4.5px',
              borderRadius: '50%',
              background: '#FFFFFF',
              opacity: 0.95
            }} />
          </div>
        ))}

        {/* LAYER PARTIKEL ZAT TERLARUT (JIKA MODE LARUTAN AKTIF) */}
        {hasSolute && soluteParticles.map((p) => (
          <div
            key={p.id}
            onMouseEnter={() => setHoveredParticle({ type: 'solute', text: `Partikel Terlarut: ${p.label}. Menghalangi molekul air melompat lepas ke udara!` })}
            onMouseLeave={() => setHoveredParticle(null)}
            className="fade-in"
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 32% 28%, #FFE4E6 0%, #FB7185 22%, #E11D48 65%, #9F1239 100%)',
              boxShadow: '0 0 16px rgba(244, 63, 94, 0.8), 0 4px 12px rgba(159, 18, 57, 0.4), inset -2px -2px 4px rgba(136, 19, 55, 0.9), inset 2px 2px 4px #FFFFFF',
              border: '2px solid #FFFFFF',
              cursor: 'pointer',
              zIndex: 3,
              animation: `float3dAlt ${animDuration} ease-in-out infinite alternate`,
              transition: 'transform 0.2s ease'
            }}
          >
            {/* Specular Highlight */}
            <span style={{
              position: 'absolute',
              top: '3px',
              left: '4px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#FFFFFF',
              opacity: 0.95
            }} />
            {/* Aura Barrier Ring */}
            <span style={{
              position: 'absolute',
              inset: '-4px',
              borderRadius: '50%',
              border: '1.5px dashed rgba(244, 63, 94, 0.6)',
              animation: 'spin 8s linear infinite',
              pointerEvents: 'none'
            }} />
          </div>
        ))}

        {/* Floating Tooltip Interaktif Saat Hover Partikel */}
        {hoveredParticle && (
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.9)',
            color: '#FFFFFF',
            padding: '0.35rem 0.85rem',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 600,
            zIndex: 10,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            border: hoveredParticle.type === 'solute' ? '1px solid #FB7185' : '1px solid #38BDF8'
          }}>
            {hoveredParticle.text}
          </div>
        )}
      </div>

      {/* 3. KONTROL INTERAKTIF ANAK SMA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginTop: '0.85rem',
        padding: '0.65rem 0.85rem',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '12px'
      }}>
        {/* Toggle Mode: Pelarut Murni vs Larutan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
            Mode Larutan:
          </span>
          <button
            type="button"
            onClick={() => setHasSolute(false)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '7px',
              border: !hasSolute ? '2px solid #0284C7' : '1px solid #CBD5E1',
              background: !hasSolute ? '#E0F2FE' : '#FFFFFF',
              color: !hasSolute ? '#0369A1' : '#64748B',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            💧 Air Murni
          </button>
          <button
            type="button"
            onClick={() => setHasSolute(true)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '7px',
              border: hasSolute ? '2px solid #E11D48' : '1px solid #CBD5E1',
              background: hasSolute ? '#FFE4E6' : '#FFFFFF',
              color: hasSolute ? '#BE123C' : '#64748B',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            🧪 Larutan (+ Zat Terlarut)
          </button>
        </div>

        {/* Toggle Kecepatan Gerak Brown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
            Energi Kinetik:
          </span>
          <button
            type="button"
            onClick={() => setSpeedMode(speedMode === 'normal' ? 'fast' : 'normal')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '7px',
              border: '1px solid #CBD5E1',
              background: speedMode === 'fast' ? '#FEF3C7' : '#FFFFFF',
              color: speedMode === 'fast' ? '#B45309' : '#475569',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            <span>{speedMode === 'fast' ? '🔥 Cepat (Hangat)' : '❄️ Santai (25°C)'}</span>
          </button>
        </div>
      </div>

      {/* 4. PENJELASAN KONSEP SINGKAT UNTUK SISWA */}
      <div style={{
        marginTop: '0.65rem',
        fontSize: '0.82rem',
        color: '#475569',
        textAlign: 'center',
        lineHeight: 1.5
      }}>
        💡 <strong>Konsep Kunci:</strong> {hasSolute
          ? "Molekul zat terlarut (merah membara) menempati posisi di permukaan, menghalangi molekul air (biru kristal) lepas ke fase gas. Akibatnya laju penguapan dan tekanan uap larutan menurun!"
          : "Pada air murni, seluruh permukaan cairan terbuka bebas tanpa penghalang, sehingga molekul air leluasa lepas menguap."}
      </div>
    </div>
  );
}

