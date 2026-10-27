import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { calculateMolality, calculateBoilingPointElevation, calculateVaporPressureLowering } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';
import solventsData from '../../data/solvents.json';

export default function Chapter2Page({ onComplete, isCompleted }) {
  const water = solventsData[0]; // Air: Kb = 0.52, normal boiling = 100°C
  const [molality, setMolality] = useState(1); // 1 molal

  // Boiling point calculation
  const { deltaTb, boilingPoint } = calculateBoilingPointElevation(water.kb, molality, 1, water.normalBoilingPoint);

  // Vapor pressure calculation (assuming 25°C where P0 = 23.76 mmHg)
  // For 1 molal aqueous solution: approx Xt = 1 / (1 + 55.5) = 0.0177
  const approximateXt = molality / (molality + 55.5);
  const { deltaP, pSolution } = calculateVaporPressureLowering(water.vaporPressure25C, approximateXt);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="blue">Bab 2</Badge>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>
          Penurunan Tekanan Uap & Kenaikan Titik Didih
        </h2>
        <p className="text-muted">
          Bagaimana partikel zat terlarut menghalangi molekul pelarut untuk lepas menguap ke udara?
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card title="Hukum Raoult & Kenaikan Titik Didih">
          <p>
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
            <div className="control-label">
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
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kenaikan Titik Didih (ΔTb)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-heat)' }}>
                +{formatIndonesianNumber(deltaTb, 2)} °C
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
                Titik Didih Larutan: <strong>{formatIndonesianNumber(boilingPoint, 2)} °C</strong>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Penurunan Tekanan Uap (ΔP)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                -{formatIndonesianNumber(deltaP, 2)} mmHg
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.35rem' }}>
                Tekanan Uap Larutan: <strong>{formatIndonesianNumber(pSolution, 2)} mmHg</strong>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant={isCompleted ? 'success' : 'primary'}
          onClick={onComplete}
        >
          {isCompleted ? '✓ Bab Ini Telah Selesai' : 'Tandai Selesai & Lanjut Bab 3 →'}
        </Button>
      </div>
    </div>
  );
}

