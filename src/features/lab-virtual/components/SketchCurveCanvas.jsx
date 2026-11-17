import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Komponen Kanvas Sketsa Kurva Prediksi (Tahap 6.1b)
 * Sumbu waktu (x) dan suhu (y) kosong.
 * Pilihan dua warna pena:
 * - NaCl: Biru (#0284C7)
 * - CaCl₂: Merah (#EF4444)
 */
export default function SketchCurveCanvas({
  strokes = [], // [{ color: '#0284C7'|'#EF4444', points: [{x, y}] }]
  onChange,
  disabled = false,
  height = 240
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [activePen, setActivePen] = useState('#0284C7'); // default NaCl biru
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(400);

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

  // Gambar ulang kanvas
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

    // Background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasWidth, height);

    // Padding sumbu
    const pad = { top: 25, right: 30, bottom: 40, left: 55 };
    const plotW = canvasWidth - pad.left - pad.right;
    const plotH = height - pad.top - pad.bottom;

    // Grid halus
    ctx.strokeStyle = '#F1F5F9';
    ctx.lineWidth = 1;
    for (let x = pad.left; x <= canvasWidth - pad.right; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, height - pad.bottom);
      ctx.stroke();
    }
    for (let y = pad.top; y <= height - pad.bottom; y += 30) {
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(canvasWidth - pad.right, y);
      ctx.stroke();
    }

    // Garis 0°C referensi (sekitar 35% dari atas)
    const zeroY = pad.top + plotH * 0.35;
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pad.left, zeroY);
    ctx.lineTo(canvasWidth - pad.right, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#64748B';
    ctx.font = "italic 11px 'Times New Roman', Times, serif";
    ctx.textAlign = 'right';
    ctx.fillText('0 °C (Air Murni)', pad.left - 6, zeroY + 4);

    // Sumbu X & Y
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Y axis
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, height - pad.bottom);
    // X axis
    ctx.lineTo(canvasWidth - pad.right, height - pad.bottom);
    ctx.stroke();

    // Panah sumbu Y
    ctx.beginPath();
    ctx.moveTo(pad.left - 4, pad.top + 8);
    ctx.lineTo(pad.left, pad.top);
    ctx.lineTo(pad.left + 4, pad.top + 8);
    ctx.fillStyle = '#334155';
    ctx.fill();

    // Panah sumbu X
    ctx.beginPath();
    ctx.moveTo(canvasWidth - pad.right - 8, height - pad.bottom - 4);
    ctx.lineTo(canvasWidth - pad.right, height - pad.bottom);
    ctx.lineTo(canvasWidth - pad.right - 8, height - pad.bottom + 4);
    ctx.fill();

    // Label sumbu
    ctx.font = "bold 12px 'Times New Roman', Times, serif";
    ctx.fillStyle = '#1E293B';
    ctx.textAlign = 'center';
    ctx.fillText('Waktu (t)', pad.left + plotW / 2, height - 8);

    ctx.save();
    ctx.translate(16, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Suhu (T, °C)', 0, 0);
    ctx.restore();

    // Gambar stroke yang sudah ada
    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;
    allStrokes.forEach((st) => {
      if (!st.points || st.points.length === 0) return;
      ctx.strokeStyle = st.color;
      ctx.lineWidth = 2.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      st.points.forEach((pt, i) => {
        const x = pt.x * canvasWidth;
        const y = pt.y * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    });

    // Petunjuk jika masih kosong
    if (allStrokes.length === 0) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = "italic 12px 'Times New Roman', Times, serif";
      ctx.textAlign = 'center';
      ctx.fillText(
        'Gunakan pena biru (NaCl) dan merah (CaCl₂) untuk menggambar sketsa kurva',
        pad.left + plotW / 2,
        pad.top + plotH * 0.7
      );
    }
  }, [canvasWidth, height, strokes, currentStroke]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Pointer event helpers
  const getRelativePos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / canvasWidth)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / height))
    };
  };

  const handlePointerDown = (e) => {
    if (disabled) return;
    setIsDrawing(true);
    const pos = getRelativePos(e);
    setCurrentStroke({ color: activePen, points: [pos] });
  };

  const handlePointerMove = (e) => {
    if (!isDrawing || !currentStroke || disabled) return;
    const pos = getRelativePos(e);
    setCurrentStroke((prev) => ({
      ...prev,
      points: [...prev.points, pos]
    }));
  };

  const handlePointerUp = () => {
    if (!isDrawing || !currentStroke) return;
    setIsDrawing(false);
    if (currentStroke.points.length > 1) {
      const next = [...strokes, currentStroke];
      if (onChange) onChange(next);
    }
    setCurrentStroke(null);
  };

  const handleClear = () => {
    if (disabled) return;
    if (window.confirm('Bersihkan seluruh sketsa kurva?')) {
      if (onChange) onChange([]);
    }
  };

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
      {/* Toolbar Pena */}
      {!disabled && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            marginBottom: '0.6rem',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700 }}>
            Pilih Pena:
          </span>

          <button
            type="button"
            onClick={() => setActivePen('#0284C7')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: activePen === '#0284C7' ? '2px solid #0284C7' : '1px solid #CBD5E1',
              background: activePen === '#0284C7' ? '#E0F2FE' : '#FFFFFF',
              color: '#0284C7',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0284C7' }} />
            <span>Pena NaCl 1 m (Biru)</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePen('#EF4444')}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: activePen === '#EF4444' ? '2px solid #EF4444' : '1px solid #CBD5E1',
              background: activePen === '#EF4444' ? '#FEE2E2' : '#FFFFFF',
              color: '#DC2626',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }} />
            <span>Pena CaCl₂ 1 m (Merah)</span>
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
            🗑️ Bersihkan Sketsa
          </button>
        </div>
      )}

      {/* Kanvas Sketsa */}
      <canvas
        ref={canvasRef}
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
        style={{
          display: 'block',
          width: '100%',
          cursor: disabled ? 'default' : 'crosshair',
          borderRadius: '8px',
          border: '1px solid #E2E8F0',
          touchAction: 'none'
        }}
      />
    </div>
  );
}
