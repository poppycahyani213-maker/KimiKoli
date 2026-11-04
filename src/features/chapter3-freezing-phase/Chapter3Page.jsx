import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { calculateFreezingPointDepression } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';
import solventsData from '../../data/solvents.json';

export default function Chapter3Page({ onComplete, isCompleted }) {
  const water = solventsData[0]; // Air: Kf = 1.86, normal freezing = 0.0°C
  const [molality, setMolality] = useState(1);

  const { deltaTf, freezingPoint } = calculateFreezingPointDepression(water.kf, molality, 1, water.normalFreezingPoint);

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="blue">Bab 3 • Titik Beku & Diagram Fase</Badge>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '1.8rem', fontWeight: 800 }}>
          Penurunan Titik Beku & Diagram Fase
        </h2>
        <p className="text-muted" style={{ fontSize: '1.05rem' }}>
          Mengapa penambahan garam dapat mencairkan salju atau membuat es krim membeku lebih padat?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card title="Prinsip Penurunan Titik Beku">
          <p style={{ lineHeight: 1.7, fontSize: '1rem' }}>
            Molekul zat terlarut merusak susunan kristal rapi pelarut padat (es). Agar dapat membeku menjadi kisi padat, energi kinetik molekul harus diturunkan lebih jauh ke suhu yang lebih dingin.
          </p>
          <FormulaRenderer
            formula={<span>ΔT<sub>f</sub> = K<sub>f</sub> × m</span>}
            description="Penurunan Titik Beku (Nonelektrolit)"
          />
          <FormulaRenderer
            formula={<span>T<sub>f</sub> = T<sub>f</sub>° − ΔT<sub>f</sub></span>}
            description="Titik Beku Larutan"
          />
        </Card>

        <Card title="Simulasi Titik Beku Larutan Air" subtitle="Tetapan Kf Air = 1,86 °C/m, Titik Beku Normal = 0,00 °C">
          <div className="control-group">
            <div className="control-label" style={{ fontWeight: 700 }}>
              <span>Konsentrasi Molalitas (m):</span>
              <strong>{molality} molal</strong>
            </div>
            <input
              type="range"
              min="0.1"
              max="4"
              step="0.1"
              value={molality}
              onChange={(e) => setMolality(Number(e.target.value))}
              className="slider-input"
            />
          </div>

          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginTop: '1.25rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Penurunan Titik Beku (ΔTf)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                {formatIndonesianNumber(deltaTf, 2)} °C
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Titik Beku Larutan (Tf)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-cold)' }}>
                {formatIndonesianNumber(freezingPoint, 2)} °C
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tombol Lanjut ke Bab 4 */}
      <div style={{
        marginTop: '2.5rem',
        padding: '1.5rem',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
      }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 700 }}>
            {isCompleted ? '✓ Materi Bab 3 Selesai' : 'Siap Lanjut ke Tahap Selanjutnya?'}
          </span>
          <h4 style={{ margin: '0.2rem 0 0', color: '#0F172A', fontSize: '1.1rem' }}>
            Bab 4: Tekanan Osmotik & Membran Semipermeabel
          </h4>
        </div>

        <Button
          variant="primary"
          onClick={onComplete}
          style={{
            padding: '0.85rem 1.8rem',
            fontSize: '1.05rem',
            background: '#0284C7',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
          }}
        >
          Selesaikan Bab 3 & Buka Bab 4 →
        </Button>
      </div>
    </div>
  );
}
