import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Komponen Kanvas Pemodelan Partikel Submikroskopik
 * Digunakan pada:
 * - Tahap 1.2: Air murni saat membeku vs Larutan saat membeku
 * - Tahap 6.1a: Tiga tahapan pembekuan larutan (awal, tengah, akhir)
 *
 * Menyimpan data berupa array [{ x, y, type }] (sangat ringan dalam JSON storage).
 */
export default function ParticleCanvas({
  title = 'Kanvas Partikel',
  subtitle = '',
  particles = [],
  onChange,
  disabled = false,
  height = 200,
  maxParticles = 60
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tool, setTool] = useState('solvent'); // 'solvent' (○) | 'solute' (●) | 'eraser'
  const [canvasWidth, setCanvasWidth] = useState(300);

  // Responsif terhadap lebar kontainer
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setCanvasWidth(containerRef.current.offsetWidth);
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Menggambar ulang kanvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvasWidth * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Background kotak pengamatan
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, canvasWidth, height);

    // Grid halus
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    const step = 20;
    for (let x = 0; x <= canvasWidth; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth, y);
      ctx.stroke();
    }

    // Border bingkai
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, canvasWidth, height);

    // Gambar partikel
    particles.forEach((p) => {
      // Skala posisi tersimpan relatif (0..1) ke ukuran nyata canvas
      const px = p.x * canvasWidth;
      const py = p.y * height;

      if (p.type === 'solvent') {
        // Molekul air: ○ Lingkaran biru berongga
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fillStyle = '#E0F2FE';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#0284C7';
        ctx.stroke();

        // Titik pusat molekul
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#0284C7';
        ctx.fill();
      } else {
        // Zat terlarut: ● Bulatan pejal merah/oranye
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#DC2626';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#991B1B';
        ctx.stroke();

        // Highlight kilau
        ctx.beginPath();
        ctx.arc(px - 2.5, py - 2.5, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fill();
      }
    });

    // Jika kosong, tampilkan instruksi samar
    if (particles.length === 0) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = "italic 13px 'Times New Roman', Times, serif";
      ctx.textAlign = 'center';
      ctx.fillText(
        'Klik di sini untuk menaruh partikel',
        canvasWidth / 2,
        height / 2
      );
    }
  }, [canvasWidth, height, particles]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Handler klik / sentuh pada kanvas
  const handlePointerDown = (e) => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const actualX = clientX - rect.left;
    const actualY = clientY - rect.top;

    // Normalisasi posisi (0 .. 1)
    const relX = Math.max(0.03, Math.min(0.97, actualX / canvasWidth));
    const relY = Math.max(0.05, Math.min(0.95, actualY / height));

    if (tool === 'eraser') {
      // Hapus partikel terdekat (radius 20px)
      const thresholdRelX = 18 / canvasWidth;
      const thresholdRelY = 18 / height;
      const next = particles.filter((p) => {
        const dx = Math.abs(p.x - relX);
        const dy = Math.abs(p.y - relY);
        return !(dx < thresholdRelX && dy < thresholdRelY);
      });
      if (onChange) onChange(next);
    } else {
      // Tambah partikel baru jika belum melebihi batas
      if (particles.length >= maxParticles) {
        alert(`Batas maksimal ${maxParticles} partikel telah tercapai.`);
        return;
      }
      const newParticle = { x: relX, y: relY, type: tool };
      if (onChange) onChange([...particles, newParticle]);
    }
  };

  const handleClear = () => {
    if (disabled) return;
    if (window.confirm('Bersihkan seluruh partikel di kanvas ini?')) {
      if (onChange) onChange([]);
    }
  };

  const solventCount = particles.filter((p) => p.type === 'solvent').length;
  const soluteCount = particles.filter((p) => p.type === 'solute').length;

  return (
    <div
      ref={containerRef}
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #CBD5E1',
        borderRadius: '12px',
        padding: '0.85rem',
        marginBottom: '1rem',
        fontFamily: "'Times New Roman', Times, serif"
      }}
    >
      {/* Header Kanvas */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem',
          flexWrap: 'wrap',
          gap: '0.4rem'
        }}
      >
        <div>
          <strong style={{ fontSize: '0.96rem', color: '#0F172A' }}>
            {title}
          </strong>
          {subtitle && (
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B' }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Counter partikel */}
        <div style={{ display: 'flex', gap: '0.6rem', fontSize: '0.8rem' }}>
          <span style={{ color: '#0284C7', fontWeight: 600 }}>
            ○ Air: {solventCount}
          </span>
          <span style={{ color: '#DC2626', fontWeight: 600 }}>
            ● Zat Terlarut: {soluteCount}
          </span>
        </div>
      </div>

      {/* Toolbar Alat */}
      {!disabled && (
        <div
          style={{
            display: 'flex',
            gap: '0.35rem',
            alignItems: 'center',
            marginBottom: '0.6rem',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, marginRight: '0.2rem' }}>
            Alat:
          </span>

          <button
            type="button"
            onClick={() => setTool('solvent')}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              border: tool === 'solvent' ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
              background: tool === 'solvent' ? '#E0F2FE' : '#FFFFFF',
              color: tool === 'solvent' ? '#0369A1' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <span>○</span>
            <span>Stempel Molekul Air</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('solute')}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              border: tool === 'solute' ? '1.5px solid #DC2626' : '1px solid #CBD5E1',
              background: tool === 'solute' ? '#FEE2E2' : '#FFFFFF',
              color: tool === 'solute' ? '#991B1B' : '#334155',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem'
            }}
          >
            <span>●</span>
            <span>Stempel Zat Terlarut</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('eraser')}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              border: tool === 'eraser' ? '1.5px solid #475569' : '1px solid #CBD5E1',
              background: tool === 'eraser' ? '#F1F5F9' : '#FFFFFF',
              color: tool === 'eraser' ? '#0F172A' : '#64748B',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🧹 Penghapus
          </button>

          <button
            type="button"
            onClick={handleClear}
            style={{
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#EF4444',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: 'auto'
            }}
          >
            🗑️ Bersihkan Semua
          </button>
        </div>
      )}

      {/* Kanvas Interaktif */}
      <canvas
        ref={canvasRef}
        onMouseDown={handlePointerDown}
        onTouchStart={handlePointerDown}
        style={{
          display: 'block',
          width: '100%',
          cursor: disabled
            ? 'default'
            : tool === 'eraser'
            ? 'pointer'
            : 'crosshair',
          borderRadius: '8px',
          touchAction: 'none'
        }}
      />
    </div>
  );
}
