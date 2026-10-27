import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { calculateVantHoffFactor } from '../../utils/vantHoff';
import { calculateBoilingPointElevation, calculateFreezingPointDepression } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';
import solventsData from '../../data/solvents.json';

export default function Chapter5Page({ onComplete, isCompleted }) {
  const water = solventsData[0];
  const [ionsN, setIonsN] = useState(2); // NaCl (n=2), CaCl2 (n=3)
  const [alpha, setAlpha] = useState(1); // 1.0 = elektrolit kuat
  const [molality, setMolality] = useState(1);

  const vantHoff_i = calculateVantHoffFactor(ionsN, alpha);
  const boilingElectrolyte = calculateBoilingPointElevation(water.kb, molality, vantHoff_i, water.normalBoilingPoint);
  const boilingNonElectrolyte = calculateBoilingPointElevation(water.kb, molality, 1, water.normalBoilingPoint);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="blue">Bab 5</Badge>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>
          Sifat Koligatif Larutan Elektrolit & Faktor van 't Hoff
        </h2>
        <p className="text-muted">
          Karena zat elektrolit terurai menjadi beberapa ion, jumlah partikel bebas menjadi berlipat ganda!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card title="Faktor van 't Hoff (i)">
          <p>
            Zat elektrolit mengalami disosiasi menjadi <strong>n ion</strong>. Derajat ionisasi dinyatakan dengan <strong>α</strong> (0 untuk nonelektrolit hingga 1 untuk elektrolit kuat).
          </p>
          <FormulaRenderer
            formula={<span>i = 1 + (n − 1)α</span>}
            description="Faktor van 't Hoff"
          />
          <FormulaRenderer
            formula={<span>ΔT<sub>b</sub> = K<sub>b</sub> × m × i</span>}
            description="Kenaikan Titik Didih Elektrolit"
          />
        </Card>

        <Card title="Kalkulator Interaktif van 't Hoff" subtitle="Bandingkan pengaruh ionisasi terhadap kenaikan titik didih">
          <div className="control-group">
            <div className="control-label">
              <span>Jumlah Ion yang Dihasilkan (n):</span>
              <strong>{ionsN} ion</strong>
            </div>
            <select
              className="control-input"
              value={ionsN}
              onChange={(e) => setIonsN(Number(e.target.value))}
            >
              <option value="2">n = 2 (contoh: NaCl → Na⁺ + Cl⁻)</option>
              <option value="3">n = 3 (contoh: CaCl₂ → Ca²⁺ + 2Cl⁻)</option>
              <option value="4">n = 4 (contoh: FeCl₃ → Fe³⁺ + 3Cl⁻)</option>
            </select>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Derajat Ionisasi (α):</span>
              <strong>{formatIndonesianNumber(alpha, 2)}</strong>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={alpha}
              onChange={(e) => setAlpha(Number(e.target.value))}
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
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Faktor van 't Hoff (i)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                {formatIndonesianNumber(vantHoff_i, 2)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ΔTb Elektrolit vs Non</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-heat)' }}>
                {formatIndonesianNumber(boilingElectrolyte.deltaTb, 2)} °C
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                  (Non-elektrolit: {formatIndonesianNumber(boilingNonElectrolyte.deltaTb, 2)} °C)
                </span>
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
          {isCompleted ? '✓ Bab Ini Telah Selesai' : 'Tandai Selesai & Lanjut Bab 6 (Evaluasi) →'}
        </Button>
      </div>
    </div>
  );
}

