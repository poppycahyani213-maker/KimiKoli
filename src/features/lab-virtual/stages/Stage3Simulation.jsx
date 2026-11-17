import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import { calculateFreezingPointDepression } from '../../../utils/colligative';

export default function Stage3Simulation({
  data = {},
  onSave,
  isCompleted = false,
  onCompleteStage,
  onNextStage,
  onPrevStage
}) {
  const [solute, setSolute] = useState(data.solute || 'water'); // 'water' | 'sugar' | 'salt'
  const [molality, setMolality] = useState(data.molality || 1.0);
  const [includeSupercooling, setIncludeSupercooling] = useState(Boolean(data.includeSupercooling));
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Kf air = 1.86 °C/m, normal freezing point = 0°C
  const kfAir = 1.86;
  const vantHoff = solute === 'water' ? 1 : (solute === 'sugar' ? 1 : 2); // Garam NaCl i ≈ 2
  const effectiveMolality = solute === 'water' ? 0 : Number(molality);

  const { deltaTf, freezingPoint } = calculateFreezingPointDepression(
    kfAir,
    effectiveMolality,
    vantHoff,
    0
  );

  const handleSaveAndComplete = () => {
    const updated = {
      solute,
      molality: Number(molality),
      includeSupercooling,
      hasRunSimulation: true
    };

    if (onSave) onSave(updated);
    if (onCompleteStage) onCompleteStage(3, updated);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Tahap 3: Simulasi Kurva Pendinginan Virtual (Prediksi Teoretis)"
        subtitle="Sintaks PjBL 3 • Menyimulasikan Titik Beku & Mengamati Plateau Pendinginan"
      >
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.15rem',
          marginBottom: '1.5rem'
        }}>
          <strong style={{ fontSize: '1.05rem', color: '#0369A1' }}>
            💻 Eksplorasi Teoretis Sebelum Praktik Nyata
          </strong>
          <p style={{ margin: '0.35rem 0 0 0', color: '#334155', fontSize: '0.94rem', lineHeight: 1.55 }}>
            Gunakan simulasi ini untuk memprediksi kurva pendinginan sampel. Pelarut air murni akan membentuk plateau mendatar di 0°C,
            sedangkan larutan gula dan garam akan membentuk plateau pada suhu lebih rendah (0 − ΔTf).
          </p>
        </div>

        {/* Panel Kontrol Simulasi */}
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
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', fontSize: '0.84rem', color: '#475569', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={includeSupercooling}
                onChange={(e) => setIncludeSupercooling(e.target.checked)}
              />
              <span>Tampilkan efek supercooling (kondisi nyata)</span>
            </label>
          </div>
        </div>

        {/* Ringkasan Perhitungan Teoretis */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '0.85rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 700 }}>Tetapan Kf Air</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534' }}>1,86 °C/m</div>
          </div>
          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '0.85rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.82rem', color: '#0369A1', fontWeight: 700 }}>Faktor van &apos;t Hoff (i)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284C7' }}>{vantHoff}</div>
          </div>
          <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', padding: '0.85rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.82rem', color: '#B45309', fontWeight: 700 }}>Penurunan Titik Beku (ΔTf)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#D97706' }}>
              {deltaTf.toFixed(2)} °C
            </div>
          </div>
          <div style={{ background: '#EDE9FE', border: '1px solid #DDD6FE', padding: '0.85rem', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.82rem', color: '#6D28D9', fontWeight: 700 }}>Titik Beku Larutan (Tf)</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7C3AED' }}>
              {freezingPoint.toFixed(2)} °C
            </div>
          </div>
        </div>

        {/* Placeholder Pratinjau Visual Kurva */}
        <div style={{
          background: '#0F172A',
          color: '#E2E8F0',
          borderRadius: '14px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.95rem', color: '#38BDF8', fontWeight: 700, marginBottom: '0.5rem' }}>
            📈 Pratinjau Model Kurva Pendinginan Teoretis
          </div>
          <p style={{ margin: '0 auto 1rem', maxWidth: '520px', fontSize: '0.88rem', color: '#94A3B8' }}>
            Kurva akan mendatar (plateau) pada suhu {freezingPoint.toFixed(2)}°C saat transisi fase cair menjadi padat berlangsung.
          </p>
          <div style={{
            height: '140px',
            borderLeft: '2px solid #64748B',
            borderBottom: '2px solid #64748B',
            position: 'relative',
            margin: '0 auto',
            maxWidth: '460px'
          }}>
            <div style={{
              position: 'absolute',
              top: '55%',
              left: '0',
              right: '0',
              borderTop: '2px dashed #38BDF8'
            }} />
            <span style={{
              position: 'absolute',
              top: '48%',
              right: '10px',
              fontSize: '0.8rem',
              color: '#38BDF8',
              fontWeight: 700
            }}>
              Plateau: {freezingPoint.toFixed(2)} °C
            </span>
          </div>
        </div>

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

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isSavedFeedback && (
              <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}>
                ✓ Simulasi berhasil disimpan (+20 XP)
              </span>
            )}
            <Button
              variant="primary"
              onClick={handleSaveAndComplete}
              style={{ padding: '0.75rem 1.4rem', fontWeight: 700, background: '#0284C7' }}
            >
              {isCompleted ? '✓ Simpan Perubahan Simulasi' : '✓ Simpan & Selesaikan Tahap 3 (+20 XP) →'}
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
