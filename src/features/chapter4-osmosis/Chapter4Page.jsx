import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { calculateOsmoticPressure } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';

export default function Chapter4Page({ onComplete, isCompleted }) {
  const [molarity, setMolarity] = useState(0.2); // 0.2 M
  const [tempCelsius, setTempCelsius] = useState(25); // 25°C

  const { pi, tempKelvin } = calculateOsmoticPressure(molarity, tempCelsius, 1);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="blue">Bab 4</Badge>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>
          Tekanan Osmotik & Membran Semipermeabel
        </h2>
        <p className="text-muted">
          Pergerakan spontan molekul pelarut murni menuju larutan yang lebih pekat melalui membran semipermeabel.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card title="Prinsip Tekanan Osmotik">
          <p>
            <strong>Tekanan osmotik (π)</strong> adalah tekanan hidrostatik luar yang harus diberikan pada larutan untuk menghentikan aliran bersih pelarut menembus membran semipermeabel.
          </p>
          <FormulaRenderer
            formula={<span>π = M × R × T</span>}
            description="Persamaan van 't Hoff (Nonelektrolit)"
          />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Konstanta gas R = 0,082 L·atm/(mol·K), Suhu mutlak T (Kelvin) = T(°C) + 273.
          </p>
        </Card>

        <Card title="Kalkulator Tekanan Osmotik" subtitle="Eksplorasi pengaruh konsentrasi molar dan suhu">
          <div className="control-group">
            <div className="control-label">
              <span>Molaritas (M):</span>
              <strong>{molarity} M (mol/L)</strong>
            </div>
            <input
              type="range"
              min="0.05"
              max="2.0"
              step="0.05"
              value={molarity}
              onChange={(e) => setMolarity(Number(e.target.value))}
              className="slider-input"
            />
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Suhu Lingkungan:</span>
              <strong>{tempCelsius} °C ({tempKelvin} K)</strong>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={tempCelsius}
              onChange={(e) => setTempCelsius(Number(e.target.value))}
              className="slider-input"
            />
          </div>

          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginTop: '1.25rem'
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tekanan Osmotik Terhitung (π)</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--primary-600)' }}>
              {formatIndonesianNumber(pi, 2)} atm
            </div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant={isCompleted ? 'success' : 'primary'}
          onClick={onComplete}
        >
          {isCompleted ? '✓ Bab Ini Telah Selesai' : 'Tandai Selesai & Lanjut Bab 5 →'}
        </Button>
      </div>
    </div>
  );
}

