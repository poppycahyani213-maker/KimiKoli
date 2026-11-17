import React, { useState, useRef, useEffect, useCallback } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { calculateFreezingPointDepression } from '../../../utils/colligative';

/**
 * =====================================================================
 * Tahap 3: Simulasi Kurva Pendinginan Virtual & Latihan Baca Grafik
 * =====================================================================
 * Sintaks PjBL 3 — Fase 3 bagian awal (analisis grafik uji coba guru + simulasi virtual)
 *
 * Fitur:
 * 1. Simulasi interaktif: pilih sampel (air murni / gula / garam), atur molalitas,
 *    toggle supercooling → kurva pendinginan teoretis digambar otomatis pada HTML5 Canvas.
 * 2. Latihan baca grafik: siswa menandai titik beku pada grafik contoh data guru
 *    dengan mengklik posisi plateau, website memberi umpan balik.
 * 3. Semua data tersimpan per username.
 *
 * Konstanta konsisten:
 *   Kf air = 1,86 °C/m; i gula = 1; i NaCl = 2
 *   ΔTf = Kf × m × i
 */

// ——— Fungsi pembantu pembangkit kurva pendinginan ———

/**
 * Membangkitkan array titik {x: waktu(s), y: suhu(°C)} untuk kurva pendinginan
 * @param {number} freezingPoint — titik beku target (°C)
 * @param {boolean} supercooling — tampilkan efek supercooling
 * @param {number} startTemp — suhu awal (°C)
 * @param {number} totalTime — total durasi (detik)
 * @returns {Array<{x: number, y: number}>}
 */
function generateCoolingCurve(freezingPoint, supercooling = false, startTemp = 25, totalTime = 480) {
  const points = [];
  const dt = 5; // interval 5 detik
  const totalSteps = Math.floor(totalTime / dt);

  // Parameter waktu fase-fase
  const coolingEnd = Math.floor(totalSteps * 0.35);    // akhir pendinginan cair
  const plateauStart = Math.floor(totalSteps * 0.38);  // mulai plateau
  const plateauEnd = Math.floor(totalSteps * 0.65);    // akhir plateau
  const scDip = supercooling ? 1.2 : 0;                // kedalaman supercooling (°C)

  for (let i = 0; i <= totalSteps; i++) {
    const t = i * dt;
    let temp;

    if (i <= coolingEnd) {
      // Fase 1: Pendinginan cair — turun eksponensial dari startTemp ke ~freezingPoint
      const progress = i / coolingEnd;
      temp = startTemp - (startTemp - freezingPoint - scDip) * (1 - Math.exp(-3 * progress));
    } else if (i <= plateauStart) {
      // Fase transisi: supercooling dip lalu naik ke plateau
      if (supercooling) {
        const transProgress = (i - coolingEnd) / (plateauStart - coolingEnd);
        temp = (freezingPoint - scDip) + scDip * transProgress;
      } else {
        temp = freezingPoint;
      }
    } else if (i <= plateauEnd) {
      // Fase 2: Plateau (transisi fase) — suhu mendatar di titik beku
      // Sedikit variasi agar tidak terlalu mulus
      const noise = supercooling ? (Math.sin(i * 0.5) * 0.08) : 0;
      temp = freezingPoint + noise;
    } else {
      // Fase 3: Pendinginan padat — turun lagi perlahan di bawah titik beku
      const progress = (i - plateauEnd) / (totalSteps - plateauEnd);
      temp = freezingPoint - 3 * progress;
      if (supercooling) temp += Math.sin(i * 0.3) * 0.05;
    }

    points.push({ x: t, y: temp });
  }

  return points;
}

/**
 * Data contoh kurva guru untuk latihan baca grafik
 * (3 larutan berbeda — siswa harus menemukan plateau masing-masing)
 */
const TEACHER_GRAPH_DATA = [
  {
    id: 'guru-air-murni',
    label: '💧 Air Murni (Data Guru)',
    color: '#0284C7',
    freezingPoint: 0,
    description: 'Pelarut standar. Plateau seharusnya di sekitar 0°C.',
    toleranceMin: -0.8,
    toleranceMax: 0.8,
    correctAnswer: 0,
  },
  {
    id: 'guru-gula-1m',
    label: '🍬 Larutan Gula 1 m (Data Guru)',
    color: '#D97706',
    freezingPoint: -1.86,
    description: 'Nonelektrolit i = 1, m = 1. ΔTf = 1,86 × 1 × 1 = 1,86°C. Plateau di sekitar −1,86°C.',
    toleranceMin: -2.6,
    toleranceMax: -1.2,
    correctAnswer: -1.86,
  },
  {
    id: 'guru-garam-1m',
    label: '🧂 Larutan NaCl 1 m (Data Guru)',
    color: '#DC2626',
    freezingPoint: -3.72,
    description: 'Elektrolit i ≈ 2, m = 1. ΔTf = 1,86 × 1 × 2 = 3,72°C. Plateau di sekitar −3,72°C.',
    toleranceMin: -4.6,
    toleranceMax: -2.9,
    correctAnswer: -3.72,
  }
];

// ——— Komponen Canvas Grafik ———

function CoolingCurveCanvas({
  curves, // Array of { label, color, points: [{x,y}] }
  width,
  height,
  onClickGraph, // callback({x, y, curveIndex}) saat user klik grafik
  markerY,      // posisi Y marker titik beku yang ditandai siswa
  markerLabel,
  showGrid = true,
  xLabel = 'Waktu (detik)',
  yLabel = 'Suhu (°C)',
  title = ''
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [canvasSize, setCanvasSize] = useState({ w: width || 600, h: height || 340 });

  // Responsif: sesuaikan ukuran canvas dengan lebar kontainer
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const w = Math.min(containerWidth - 4, 800);
        const h = Math.max(240, Math.min(w * 0.55, 400));
        setCanvasSize({ w, h });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Hitung batas sumbu dari data
  const getAxisBounds = useCallback(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    curves.forEach(c => {
      c.points.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      });
    });
    // Beri margin
    minY = Math.floor(minY - 2);
    maxY = Math.ceil(maxY + 2);
    minX = 0;
    maxX = Math.ceil(maxX / 60) * 60;
    return { minX, maxX, minY, maxY };
  }, [curves]);

  // Gambar grafik
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !curves.length) return;
    const ctx = canvas.getContext('2d');
    const { w, h } = canvasSize;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    // Padding area grafik
    const pad = { top: 36, right: 24, bottom: 50, left: 60 };
    const plotW = w - pad.left - pad.right;
    const plotH = h - pad.top - pad.bottom;

    const { minX, maxX, minY, maxY } = getAxisBounds();
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    const toCanvasX = (val) => pad.left + ((val - minX) / rangeX) * plotW;
    const toCanvasY = (val) => pad.top + ((maxY - val) / rangeY) * plotH;

    // Clear
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#FAFCFF';
    ctx.fillRect(0, 0, w, h);

    // Grid
    if (showGrid) {
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 0.5;
      // Horizontal grid
      const yStep = rangeY > 20 ? 5 : (rangeY > 10 ? 2 : 1);
      for (let yVal = Math.ceil(minY / yStep) * yStep; yVal <= maxY; yVal += yStep) {
        const cy = toCanvasY(yVal);
        ctx.beginPath();
        ctx.moveTo(pad.left, cy);
        ctx.lineTo(w - pad.right, cy);
        ctx.stroke();
      }
      // Vertical grid
      const xStep = rangeX > 300 ? 60 : 30;
      for (let xVal = 0; xVal <= maxX; xVal += xStep) {
        const cx = toCanvasX(xVal);
        ctx.beginPath();
        ctx.moveTo(cx, pad.top);
        ctx.lineTo(cx, h - pad.bottom);
        ctx.stroke();
      }
    }

    // Garis 0°C (referensi)
    if (minY <= 0 && maxY >= 0) {
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      const zeroY = toCanvasY(0);
      ctx.beginPath();
      ctx.moveTo(pad.left, zeroY);
      ctx.lineTo(w - pad.right, zeroY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#64748B';
      ctx.font = '11px sans-serif';
      ctx.fillText('0°C', w - pad.right + 4, zeroY + 4);
    }

    // Sumbu
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, h - pad.bottom);
    ctx.lineTo(w - pad.right, h - pad.bottom);
    ctx.stroke();

    // Label sumbu X
    ctx.fillStyle = '#334155';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    const xTickStep = rangeX > 300 ? 60 : 30;
    for (let xVal = 0; xVal <= maxX; xVal += xTickStep) {
      const cx = toCanvasX(xVal);
      ctx.beginPath();
      ctx.moveTo(cx, h - pad.bottom);
      ctx.lineTo(cx, h - pad.bottom + 5);
      ctx.stroke();
      ctx.fillText(String(xVal), cx, h - pad.bottom + 18);
    }
    ctx.fillText(xLabel, pad.left + plotW / 2, h - 6);

    // Label sumbu Y
    ctx.textAlign = 'right';
    const yTickStep = rangeY > 20 ? 5 : (rangeY > 10 ? 2 : 1);
    for (let yVal = Math.ceil(minY / yTickStep) * yTickStep; yVal <= maxY; yVal += yTickStep) {
      const cy = toCanvasY(yVal);
      ctx.beginPath();
      ctx.moveTo(pad.left - 5, cy);
      ctx.lineTo(pad.left, cy);
      ctx.stroke();
      ctx.fillText(yVal.toFixed(0), pad.left - 8, cy + 4);
    }
    ctx.save();
    ctx.translate(14, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillText(yLabel, 0, 0);
    ctx.restore();

    // Judul grafik
    if (title) {
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, pad.left + plotW / 2, pad.top - 12);
    }

    // Gambar kurva-kurva
    curves.forEach((curve) => {
      ctx.strokeStyle = curve.color || '#0284C7';
      ctx.lineWidth = 2.2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      curve.points.forEach((p, i) => {
        const cx = toCanvasX(p.x);
        const cy = toCanvasY(p.y);
        if (i === 0) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
      });
      ctx.stroke();
    });

    // Legenda
    const legendX = pad.left + 10;
    let legendY = pad.top + 8;
    curves.forEach((curve) => {
      ctx.fillStyle = curve.color || '#0284C7';
      ctx.fillRect(legendX, legendY - 5, 14, 3);
      ctx.fillStyle = '#1E293B';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(curve.label, legendX + 20, legendY);
      legendY += 16;
    });

    // Marker titik beku yang ditandai siswa
    if (markerY !== null && markerY !== undefined) {
      const markerCanvasY = toCanvasY(markerY);
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(pad.left, markerCanvasY);
      ctx.lineTo(w - pad.right, markerCanvasY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Label marker
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(
        markerLabel || `Titik beku: ${markerY.toFixed(2)}°C`,
        pad.left + plotW * 0.55,
        markerCanvasY - 6
      );

      // Segitiga marker di sumbu Y
      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.moveTo(pad.left - 8, markerCanvasY);
      ctx.lineTo(pad.left, markerCanvasY - 5);
      ctx.lineTo(pad.left, markerCanvasY + 5);
      ctx.closePath();
      ctx.fill();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curves, canvasSize, markerY, markerLabel, showGrid, title, getAxisBounds]);

  // Handler klik pada grafik → konversi ke koordinat data
  const handleCanvasClick = (e) => {
    if (!onClickGraph || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvasSize.w / rect.width;
    const scaleY = canvasSize.h / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const pad = { top: 36, right: 24, bottom: 50, left: 60 };
    const plotW = canvasSize.w - pad.left - pad.right;
    const plotH = canvasSize.h - pad.top - pad.bottom;

    // Hanya terima klik dalam area plot
    if (clickX < pad.left || clickX > canvasSize.w - pad.right ||
        clickY < pad.top || clickY > canvasSize.h - pad.bottom) return;

    const { minX, maxX, minY, maxY } = getAxisBounds();
    const rangeX = maxX - minX || 1;
    const rangeY = maxY - minY || 1;

    const dataX = minX + ((clickX - pad.left) / plotW) * rangeX;
    const dataY = maxY - ((clickY - pad.top) / plotH) * rangeY;

    onClickGraph({ x: dataX, y: dataY });
  };

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: `${canvasSize.w}px`,
          borderRadius: '10px',
          border: '1.5px solid #CBD5E1',
          cursor: onClickGraph ? 'crosshair' : 'default',
          background: '#FAFCFF'
        }}
      />
    </div>
  );
}

// ——— Komponen Utama Stage 3 ———

export default function Stage3Simulation({
  data = {},
  onSave,
  isCompleted = false,
  onCompleteStage,
  onNextStage,
  onPrevStage
}) {
  // === State Bagian A: Simulasi Interaktif ===
  const [solute, setSolute] = useState(data.solute || 'water');
  const [molality, setMolality] = useState(data.molality || 1.0);
  const [includeSupercooling, setIncludeSupercooling] = useState(Boolean(data.includeSupercooling));
  const [showComparison, setShowComparison] = useState(Boolean(data.showComparison));

  // === State Bagian B: Latihan Baca Grafik Guru ===
  const [activeTeacherGraph, setActiveTeacherGraph] = useState(data.activeTeacherGraph || 0);
  const [teacherMarks, setTeacherMarks] = useState(data.teacherMarks || {});
  const [teacherFeedback, setTeacherFeedback] = useState({});

  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [activeTab, setActiveTab] = useState('simulasi'); // 'simulasi' | 'latihan'

  // Konstanta
  const kfAir = 1.86;
  const vantHoff = solute === 'water' ? 1 : (solute === 'sugar' ? 1 : 2);
  const effectiveMolality = solute === 'water' ? 0 : Number(molality);
  const soluteLabel = solute === 'water' ? 'Air Murni' : (solute === 'sugar' ? 'Gula (Sukrosa)' : 'Garam (NaCl)');

  const { deltaTf, freezingPoint } = calculateFreezingPointDepression(
    kfAir, effectiveMolality, vantHoff, 0
  );

  // === Kurva Simulasi ===
  const simulationCurves = React.useMemo(() => {
    const mainCurve = {
      label: `${soluteLabel} ${solute !== 'water' ? `(${molality} m)` : ''}`,
      color: solute === 'water' ? '#0284C7' : (solute === 'sugar' ? '#D97706' : '#DC2626'),
      points: generateCoolingCurve(freezingPoint, includeSupercooling)
    };

    if (!showComparison) return [mainCurve];

    // Tambah kurva perbandingan: air murni + gula 1m + garam 1m
    const comparisons = [];
    if (solute !== 'water') {
      comparisons.push({
        label: 'Air Murni (Ref)',
        color: '#0284C7',
        points: generateCoolingCurve(0, includeSupercooling)
      });
    }
    if (solute !== 'sugar') {
      const { freezingPoint: fpSugar } = calculateFreezingPointDepression(kfAir, 1, 1, 0);
      comparisons.push({
        label: 'Gula 1 m (Ref)',
        color: '#D97706',
        points: generateCoolingCurve(fpSugar, includeSupercooling)
      });
    }
    if (solute !== 'salt') {
      const { freezingPoint: fpSalt } = calculateFreezingPointDepression(kfAir, 1, 2, 0);
      comparisons.push({
        label: 'NaCl 1 m (Ref)',
        color: '#DC2626',
        points: generateCoolingCurve(fpSalt, includeSupercooling)
      });
    }

    return [mainCurve, ...comparisons];
  }, [solute, molality, freezingPoint, includeSupercooling, showComparison, soluteLabel, kfAir]);

  // === Kurva Data Guru untuk Latihan ===
  const teacherCurves = React.useMemo(() => {
    const graphData = TEACHER_GRAPH_DATA[activeTeacherGraph];
    return [{
      label: graphData.label,
      color: graphData.color,
      points: generateCoolingCurve(graphData.freezingPoint, true)
    }];
  }, [activeTeacherGraph]);

  // === Handler klik pada grafik latihan ===
  const handleTeacherGraphClick = (pos) => {
    const graphData = TEACHER_GRAPH_DATA[activeTeacherGraph];
    const markedTemp = Math.round(pos.y * 100) / 100;

    setTeacherMarks(prev => ({
      ...prev,
      [graphData.id]: markedTemp
    }));

    // Cek jawaban siswa
    const isCorrect = markedTemp >= graphData.toleranceMin && markedTemp <= graphData.toleranceMax;
    const diff = Math.abs(markedTemp - graphData.correctAnswer);

    let feedback;
    if (isCorrect && diff < 0.5) {
      feedback = { type: 'excellent', message: `🎯 Tepat sekali! Titik beku ${graphData.label.split('(')[0].trim()} berada di sekitar ${graphData.correctAnswer.toFixed(2)}°C. Jawabanmu: ${markedTemp.toFixed(2)}°C.` };
    } else if (isCorrect) {
      feedback = { type: 'good', message: `👍 Sudah mendekati! Plateau berada di sekitar ${graphData.correctAnswer.toFixed(2)}°C. Kamu menandai di ${markedTemp.toFixed(2)}°C. Coba perhatikan bagian kurva yang paling mendatar.` };
    } else {
      feedback = { type: 'retry', message: `🔄 Belum tepat (${markedTemp.toFixed(2)}°C). Perhatikan bagian kurva yang mendatar (plateau) — itu adalah suhu saat transisi fase berlangsung. Coba klik lagi pada daerah plateau.` };
    }

    setTeacherFeedback(prev => ({
      ...prev,
      [graphData.id]: feedback
    }));
  };

  // === Cek apakah latihan baca grafik sudah selesai semua ===
  const allTeacherGraphsDone = TEACHER_GRAPH_DATA.every(g => {
    const mark = teacherMarks[g.id];
    return mark !== undefined && mark >= g.toleranceMin && mark <= g.toleranceMax;
  });

  // === Handler simpan & selesaikan ===
  const handleSave = () => {
    const updated = {
      solute,
      molality: Number(molality),
      includeSupercooling,
      showComparison,
      activeTeacherGraph,
      teacherMarks,
      hasRunSimulation: true
    };
    if (onSave) onSave(updated);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  const handleSaveAndComplete = () => {
    if (!allTeacherGraphsDone) {
      alert('⚠️ Selesaikan latihan baca grafik terlebih dahulu!\nTandai titik beku pada ketiga grafik data guru di tab "Latihan Baca Grafik".');
      setActiveTab('latihan');
      return;
    }

    const updated = {
      solute,
      molality: Number(molality),
      includeSupercooling,
      showComparison,
      activeTeacherGraph,
      teacherMarks,
      hasRunSimulation: true,
      graphPracticeCompleted: true
    };

    if (onSave) onSave(updated);
    if (onCompleteStage) onCompleteStage(3, updated);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  // ——— Styling helper ———
  const tabStyle = (isActive) => ({
    padding: '0.6rem 1.2rem',
    borderRadius: '10px 10px 0 0',
    border: isActive ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
    borderBottom: isActive ? '2px solid #FFFFFF' : '1px solid #CBD5E1',
    background: isActive ? '#FFFFFF' : '#F1F5F9',
    color: isActive ? '#0284C7' : '#64748B',
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.92rem',
    fontFamily: "'Times New Roman', Times, serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: '-1px'
  });

  const infoCardStyle = {
    background: '#EFF6FF',
    border: '1.5px solid #BAE6FD',
    borderRadius: '14px',
    padding: '1.15rem',
    marginBottom: '1.5rem'
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Tahap 3: Simulasi Kurva Pendinginan Virtual & Latihan Baca Grafik"
        subtitle="Sintaks PjBL 3 • Memprediksi Kurva Teoretis & Melatih Pembacaan Plateau Titik Beku"
      >
        {/* Banner info */}
        <div style={infoCardStyle}>
          <strong style={{ fontSize: '1.05rem', color: '#0369A1' }}>
            💻 Eksplorasi Teoretis Sebelum Praktik Nyata
          </strong>
          <p style={{ margin: '0.35rem 0 0 0', color: '#334155', fontSize: '0.94rem', lineHeight: 1.55 }}>
            Gunakan simulasi untuk memprediksi kurva pendinginan tiap sampel, lalu latih kemampuan membaca grafik
            dengan menandai titik beku pada data percobaan guru. Pelarut air murni akan membentuk plateau mendatar 
            di <strong>0°C</strong>, sedangkan larutan gula dan garam membentuk plateau pada suhu lebih rendah 
            (<strong>0 − ΔTf</strong>).
          </p>
        </div>

        {/* Tab Navigasi */}
        <div style={{
          display: 'flex',
          gap: '0.25rem',
          borderBottom: '1.5px solid #CBD5E1',
          marginBottom: '1.5rem'
        }}>
          <button type="button" onClick={() => setActiveTab('simulasi')} style={tabStyle(activeTab === 'simulasi')}>
            📈 Simulasi Interaktif
          </button>
          <button type="button" onClick={() => setActiveTab('latihan')} style={tabStyle(activeTab === 'latihan')}>
            🎯 Latihan Baca Grafik {allTeacherGraphsDone ? '✓' : `(${Object.keys(teacherMarks).filter(k => {
              const g = TEACHER_GRAPH_DATA.find(gd => gd.id === k);
              return g && teacherMarks[k] >= g.toleranceMin && teacherMarks[k] <= g.toleranceMax;
            }).length}/3)`}
          </button>
        </div>

        {/* ========== TAB A: Simulasi Interaktif ========== */}
        {activeTab === 'simulasi' && (
          <div>
            {/* Panel Kontrol */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Pilihan Sampel */}
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', color: '#1E293B', marginBottom: '0.4rem' }}>
                  Sampel Uji:
                </label>
                <select
                  value={solute}
                  onChange={(e) => setSolute(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontFamily: "'Times New Roman', Times, serif",
                    fontSize: '0.95rem'
                  }}
                >
                  <option value="water">💧 Air Murni (Pelarut Standar)</option>
                  <option value="sugar">🍬 Larutan Gula / Sukrosa (Nonelektrolit, i = 1)</option>
                  <option value="salt">🧂 Larutan Garam / NaCl (Elektrolit Biner, i ≈ 2)</option>
                </select>
              </div>

              {/* Slider Molalitas */}
              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', color: '#1E293B', marginBottom: '0.4rem' }}>
                  Konsentrasi Molalitas (m):
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="range"
                    min="0.5"
                    max="3.0"
                    step="0.5"
                    disabled={solute === 'water'}
                    value={molality}
                    onChange={(e) => setMolality(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <span style={{ fontWeight: 700, color: solute === 'water' ? '#94A3B8' : '#0284C7', minWidth: '55px', fontSize: '1rem' }}>
                    {solute === 'water' ? '0.0 m' : `${molality} m`}
                  </span>
                </div>

                {/* Toggle Supercooling & Perbandingan */}
                <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: '#475569', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={includeSupercooling}
                      onChange={(e) => setIncludeSupercooling(e.target.checked)}
                    />
                    <span>Tampilkan efek supercooling (kondisi nyata)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.84rem', color: '#475569', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={showComparison}
                      onChange={(e) => setShowComparison(e.target.checked)}
                    />
                    <span>Bandingkan dengan kurva sampel lain</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Ringkasan Perhitungan Teoretis */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.85rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: 700 }}>Rumus</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#166534' }}>ΔTf = Kf × m × i</div>
              </div>
              <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '0.85rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.78rem', color: '#0369A1', fontWeight: 700 }}>Kf Air</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0284C7' }}>1,86 °C/m</div>
              </div>
              <div style={{ background: '#EDE9FE', border: '1px solid #DDD6FE', padding: '0.85rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.78rem', color: '#6D28D9', fontWeight: 700 }}>Faktor i</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#7C3AED' }}>{vantHoff}</div>
              </div>
              <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '0.85rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.78rem', color: '#B45309', fontWeight: 700 }}>ΔTf</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#D97706' }}>{deltaTf.toFixed(2)} °C</div>
              </div>
              <div style={{ background: '#FCE7F3', border: '1px solid #FBCFE8', padding: '0.85rem', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.78rem', color: '#BE185D', fontWeight: 700 }}>Tf Larutan</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#DB2777' }}>{freezingPoint.toFixed(2)} °C</div>
              </div>
            </div>

            {/* Grafik Simulasi */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '1rem', color: '#0F172A' }}>
                  📈 Kurva Pendinginan Teoretis — {soluteLabel} {solute !== 'water' ? `(${molality} m)` : ''}
                </strong>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.84rem', color: '#64748B' }}>
                  {solute === 'water' 
                    ? 'Air murni: plateau mendatar di 0°C.' 
                    : `Plateau mendatar di ${freezingPoint.toFixed(2)}°C (ΔTf = ${deltaTf.toFixed(2)}°C dari titik beku air murni).`
                  }
                  {includeSupercooling && ' Efek supercooling ditampilkan (dip sementara sebelum plateau).'}
                </p>
              </div>

              <CoolingCurveCanvas
                curves={simulationCurves}
                markerY={freezingPoint}
                markerLabel={`Tf = ${freezingPoint.toFixed(2)}°C (plateau)`}
                title={`Simulasi: ${soluteLabel}${solute !== 'water' ? ` ${molality} m` : ''}`}
              />

              {/* Penjelasan kurva */}
              <div style={{
                marginTop: '1rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '0.75rem',
                fontSize: '0.84rem'
              }}>
                <div style={{ background: '#F0F9FF', padding: '0.75rem', borderRadius: '8px', border: '1px solid #BAE6FD' }}>
                  <strong style={{ color: '#0369A1' }}>Fase 1: Pendinginan Cair</strong>
                  <p style={{ margin: '0.2rem 0 0', color: '#334155' }}>
                    Suhu turun secara eksponensial dari suhu awal (~25°C) hingga mendekati titik beku.
                  </p>
                </div>
                <div style={{ background: '#FEF3C7', padding: '0.75rem', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                  <strong style={{ color: '#B45309' }}>Fase 2: Plateau (Transisi Fase)</strong>
                  <p style={{ margin: '0.2rem 0 0', color: '#334155' }}>
                    Suhu mendatar selama perubahan wujud cair → padat. Energi panas digunakan untuk memutus gaya antarmolekul.
                  </p>
                </div>
                <div style={{ background: '#EDE9FE', padding: '0.75rem', borderRadius: '8px', border: '1px solid #DDD6FE' }}>
                  <strong style={{ color: '#6D28D9' }}>Fase 3: Pendinginan Padat</strong>
                  <p style={{ margin: '0.2rem 0 0', color: '#334155' }}>
                    Setelah seluruh cairan membeku, suhu padatan kembali turun.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== TAB B: Latihan Baca Grafik Guru ========== */}
        {activeTab === 'latihan' && (
          <div>
            <div style={{
              background: '#FEF3C7',
              border: '1.5px solid #FDE68A',
              borderRadius: '14px',
              padding: '1.15rem',
              marginBottom: '1.5rem'
            }}>
              <strong style={{ fontSize: '1.02rem', color: '#B45309' }}>
                🎯 Latihan Membaca Kurva Pendinginan
              </strong>
              <p style={{ margin: '0.35rem 0 0 0', color: '#78350F', fontSize: '0.92rem', lineHeight: 1.55 }}>
                Berikut adalah data kurva pendinginan dari percobaan guru menggunakan Arduino. 
                <strong> Klik pada bagian kurva yang mendatar (plateau) </strong> untuk menandai titik beku masing-masing sampel.
                Selesaikan ketiga grafik untuk dapat melanjutkan ke tahap berikutnya.
              </p>
            </div>

            {/* Pilihan grafik guru */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {TEACHER_GRAPH_DATA.map((g, idx) => {
                const mark = teacherMarks[g.id];
                const isDone = mark !== undefined && mark >= g.toleranceMin && mark <= g.toleranceMax;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setActiveTeacherGraph(idx)}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      border: activeTeacherGraph === idx ? `2px solid ${g.color}` : '1px solid #CBD5E1',
                      background: activeTeacherGraph === idx ? '#FFFFFF' : '#F8FAFC',
                      color: activeTeacherGraph === idx ? g.color : '#334155',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      fontFamily: "'Times New Roman', Times, serif",
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                  >
                    {isDone && <span style={{ marginRight: '0.3rem' }}>✅</span>}
                    {g.label.split('(')[0].trim()}
                  </button>
                );
              })}
            </div>

            {/* Info sampel aktif */}
            <div style={{
              background: '#F8FAFC',
              padding: '0.85rem',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              marginBottom: '1rem',
              fontSize: '0.9rem',
              color: '#334155'
            }}>
              <strong style={{ color: TEACHER_GRAPH_DATA[activeTeacherGraph].color }}>
                {TEACHER_GRAPH_DATA[activeTeacherGraph].label}:
              </strong>{' '}
              {TEACHER_GRAPH_DATA[activeTeacherGraph].description}
            </div>

            {/* Grafik guru */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1rem'
            }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.88rem', color: '#64748B' }}>
                👆 <strong>Klik pada daerah plateau</strong> (bagian kurva yang mendatar) untuk menandai titik beku.
              </p>
              <CoolingCurveCanvas
                curves={teacherCurves}
                onClickGraph={handleTeacherGraphClick}
                markerY={teacherMarks[TEACHER_GRAPH_DATA[activeTeacherGraph].id] ?? null}
                markerLabel={
                  teacherMarks[TEACHER_GRAPH_DATA[activeTeacherGraph].id] !== undefined
                    ? `Tandaimu: ${teacherMarks[TEACHER_GRAPH_DATA[activeTeacherGraph].id].toFixed(2)}°C`
                    : undefined
                }
                title={TEACHER_GRAPH_DATA[activeTeacherGraph].label}
              />
            </div>

            {/* Umpan balik */}
            {teacherFeedback[TEACHER_GRAPH_DATA[activeTeacherGraph].id] && (
              <div style={{
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1rem',
                border: '1.5px solid',
                borderColor: teacherFeedback[TEACHER_GRAPH_DATA[activeTeacherGraph].id].type === 'excellent' ? '#BBF7D0'
                  : teacherFeedback[TEACHER_GRAPH_DATA[activeTeacherGraph].id].type === 'good' ? '#FDE68A'
                  : '#FECACA',
                background: teacherFeedback[TEACHER_GRAPH_DATA[activeTeacherGraph].id].type === 'excellent' ? '#F0FDF4'
                  : teacherFeedback[TEACHER_GRAPH_DATA[activeTeacherGraph].id].type === 'good' ? '#FFFBEB'
                  : '#FEF2F2',
                fontSize: '0.92rem',
                lineHeight: 1.55
              }}>
                {teacherFeedback[TEACHER_GRAPH_DATA[activeTeacherGraph].id].message}
              </div>
            )}

            {/* Ringkasan progres latihan */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '1rem',
              marginBottom: '1rem'
            }}>
              <strong style={{ fontSize: '0.92rem', color: '#0F172A', display: 'block', marginBottom: '0.5rem' }}>
                Progres Latihan Baca Grafik:
              </strong>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {TEACHER_GRAPH_DATA.map((g) => {
                  const mark = teacherMarks[g.id];
                  const isDone = mark !== undefined && mark >= g.toleranceMin && mark <= g.toleranceMax;
                  return (
                    <div key={g.id} style={{
                      padding: '0.6rem',
                      borderRadius: '8px',
                      border: `1px solid ${isDone ? '#BBF7D0' : '#E2E8F0'}`,
                      background: isDone ? '#F0FDF4' : '#FFFFFF',
                      fontSize: '0.84rem'
                    }}>
                      <span>{isDone ? '✅' : '⬜'}</span>{' '}
                      <strong>{g.label.split('(')[0].trim()}</strong>
                      {mark !== undefined && (
                        <span style={{ color: '#64748B', marginLeft: '0.3rem' }}>
                          ({mark.toFixed(2)}°C)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigasi */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid #E2E8F0'
        }}>
          {onPrevStage && (
            <Button variant="secondary" onClick={onPrevStage} style={{ padding: '0.65rem 1.15rem' }}>
              ← Kembali ke Tahap 2
            </Button>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {isSavedFeedback && (
              <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}>
                ✓ Tahap 3 berhasil disimpan (+20 XP)
              </span>
            )}

            <Button
              variant="secondary"
              onClick={handleSave}
              style={{ padding: '0.65rem 1rem' }}
            >
              💾 Simpan Progres
            </Button>

            <Button
              variant="primary"
              onClick={handleSaveAndComplete}
              style={{ padding: '0.75rem 1.4rem', fontWeight: 700, background: '#0284C7' }}
            >
              {isCompleted ? '✓ Simpan Perubahan' : '✓ Selesaikan Tahap 3 (+20 XP) →'}
            </Button>

            {isCompleted && onNextStage && (
              <Button variant="secondary" onClick={onNextStage} style={{ padding: '0.75rem 1.25rem' }}>
                Lanjut ke Tahap 4 →
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
