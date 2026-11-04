import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { calculateBoilingPointElevation, calculateVaporPressureLowering } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';
import solventsData from '../../data/solvents.json';

export default function Chapter2Page({ onComplete, isCompleted }) {
  const water = solventsData[0]; // Air: Kb = 0.52, normal boiling = 100°C
  const [molality, setMolality] = useState(1); // 1 molal

  // Boiling point calculation
  const { deltaTb, boilingPoint } = calculateBoilingPointElevation(water.kb, molality, 1, water.normalBoilingPoint);

  // Vapor pressure calculation (assuming 25°C where P0 = 23.76 mmHg)
  const approximateXt = molality / (molality + 55.5);
  const { deltaP, pSolution } = calculateVaporPressureLowering(water.vaporPressure25C, approximateXt);

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="blue">Bab 2 • Tekanan Uap & Titik Didih</Badge>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '1.8rem', fontWeight: 800 }}>
          Penurunan Tekanan Uap & Kenaikan Titik Didih
        </h2>
        <p className="text-muted" style={{ fontSize: '1.05rem' }}>
          Bagaimana partikel zat terlarut menghalangi molekul pelarut untuk lepas menguap ke udara?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card title="Hukum Raoult & Kenaikan Titik Didih">
          <p style={{ lineHeight: 1.7, fontSize: '1rem' }}>
            Molekul terlarut memenuhi sebagian permukaan larutan, menurunkan laju penguapan molekul pelarut. Akibatnya, dibutuhkan suhu lebih tinggi agar tekanan uap larutan mencapai tekanan atmosfer (titik didih naik).
          </p>
          <FormulaRenderer
            formula={<span>ΔP = X<sub>t</sub> × P°</span>}
            description="Hukum Raoult (Penurunan Tekanan Uap)"
          />
          <FormulaRenderer
            formula={<span>ΔT<sub>b</sub> = K<sub>b</sub> × m</span>}
            description="Kenaikan Titik Didih (Nonelektrolit)"
          />
        </Card>

        <Card title="Laboratorium Termometer & Tekanan Uap" subtitle="Simulasi pada Pelarut Air (Kb = 0,52 °C/m, P° = 23,76 mmHg pada 25°C)">
          <div className="control-group">
            <div className="control-label" style={{ fontWeight: 700 }}>
              <span>Konsentrasi Zat Terlarut:</span>
              <strong>{molality} molal</strong>
            </div>
            <input
              type="range"
              min="0.1"
              max="5"
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
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Kenaikan Titik Didih (ΔTb)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-heat)' }}>
                +{formatIndonesianNumber(deltaTb, 2)} °C
              </div>
              <div style={{ fontSize: '0.825rem', marginTop: '0.35rem' }}>
                Titik Didih Larutan: <strong>{formatIndonesianNumber(boilingPoint, 2)} °C</strong>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Penurunan Tekanan Uap (ΔP)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                -{formatIndonesianNumber(deltaP, 2)} mmHg
              </div>
              <div style={{ fontSize: '0.825rem', marginTop: '0.35rem' }}>
                Tekanan Uap Larutan: <strong>{formatIndonesianNumber(pSolution, 2)} mmHg</strong>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tombol Lanjut ke Bab 3 */}
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
            {isCompleted ? '✓ Materi Bab 2 Selesai' : 'Siap Lanjut ke Tahap Selanjutnya?'}
          </span>
          <h4 style={{ margin: '0.2rem 0 0', color: '#0F172A', fontSize: '1.1rem' }}>
            Bab 3: Penurunan Titik Beku & Diagram Fase P–T
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
          Selesaikan Bab 2 & Buka Bab 3 →
        </Button>
      </div>
    </div>
  );
}
