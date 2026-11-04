import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { calculateVantHoffFactor } from '../../utils/vantHoff';
import { calculateBoilingPointElevation } from '../../utils/colligative';
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
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="blue">Bab 5 • Larutan Elektrolit</Badge>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '1.8rem', fontWeight: 800 }}>
          Sifat Koligatif Larutan Elektrolit & Faktor van 't Hoff
        </h2>
        <p className="text-muted" style={{ fontSize: '1.05rem' }}>
          Karena zat elektrolit terurai menjadi beberapa ion, jumlah partikel bebas menjadi berlipat ganda!
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card title="Faktor van 't Hoff (i)">
          <p style={{ lineHeight: 1.7, fontSize: '1rem' }}>
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
            <div className="control-label" style={{ fontWeight: 700 }}>
              <span>Jumlah Ion yang Dihasilkan (n):</span>
              <strong>{ionsN} ion</strong>
            </div>
            <select
              className="control-input"
              value={ionsN}
              onChange={(e) => setIonsN(Number(e.target.value))}
              style={{ fontFamily: "'Times New Roman', Times, serif" }}
            >
              <option value="2">n = 2 (contoh: NaCl → Na⁺ + Cl⁻)</option>
              <option value="3">n = 3 (contoh: CaCl₂ → Ca²⁺ + 2Cl⁻)</option>
              <option value="4">n = 4 (contoh: FeCl₃ → Fe³⁺ + 3Cl⁻)</option>
            </select>
          </div>

          <div className="control-group">
            <div className="control-label" style={{ fontWeight: 700 }}>
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
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Faktor van 't Hoff (i)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                {formatIndonesianNumber(vantHoff_i, 2)}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>ΔTb Elektrolit vs Non</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-heat)' }}>
                {formatIndonesianNumber(boilingElectrolyte.deltaTb, 2)} °C
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', fontWeight: 500 }}>
                  (Non-elektrolit: {formatIndonesianNumber(boilingNonElectrolyte.deltaTb, 2)} °C)
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tombol Lanjut ke Evaluasi Akhir (Bab 6) */}
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
            {isCompleted ? '✓ Materi Bab 5 Selesai' : 'Siap Lanjut ke Tahap Terakhir?'}
          </span>
          <h4 style={{ margin: '0.2rem 0 0', color: '#0F172A', fontSize: '1.1rem' }}>
            Bab 6: Evaluasi Akhir & Penghargaan
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
          Selesaikan Bab 5 & Buka Evaluasi Akhir →
        </Button>
      </div>
    </div>
  );
}
