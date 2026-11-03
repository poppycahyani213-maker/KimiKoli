import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { calculateMolality, calculateMoleFractions } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';
import solutesData from '../../data/solutes.json';
import solventsData from '../../data/solvents.json';

export default function Chapter1Page({ onComplete, isCompleted }) {
  const [selectedSoluteId, setSelectedSoluteId] = useState(solutesData[0].id);
  const [selectedSolventId, setSelectedSolventId] = useState(solventsData[0].id);
  const [massSolute, setMassSolute] = useState(18); // 18 gram glukosa
  const [massSolvent, setMassSolvent] = useState(500); // 500 gram air

  const selectedSolute = solutesData.find(s => s.id === selectedSoluteId) || solutesData[0];
  const selectedSolvent = solventsData.find(s => s.id === selectedSolventId) || solventsData[0];

  const molality = calculateMolality(massSolute, selectedSolute.mr, massSolvent);
  const fractions = calculateMoleFractions(massSolute, selectedSolute.mr, massSolvent, 18);

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="blue">Bab 1</Badge>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>
          Konsentrasi Larutan & Hakikat Sifat Koligatif
        </h2>
        <p className="text-muted">
          Pelajari bagaimana rasio jumlah partikel zat terlarut terhadap pelarut menentukan sifat larutan.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Concept Card */}
        <Card title="Prinsip Dasar">
          <p>
            <strong>Sifat koligatif</strong> adalah sifat larutan yang hanya bergantung pada <em>jumlah partikel</em> zat terlarut, dan <strong>bukan pada jenis</strong> zat terlarut tersebut.
          </p>
          <FormulaRenderer
            formula={<span>m = (massa / M<sub>r</sub>) × (1000 / p)</span>}
            description="Rumus Molalitas (m)"
          />
          <FormulaRenderer
            formula={<span>X<sub>t</sub> = n<sub>t</sub> / (n<sub>t</sub> + n<sub>p</sub>)</span>}
            description="Fraksi Mol Terlarut"
          />
        </Card>

        {/* Interactive Solution Maker Simulator */}
        <Card title="Simulator Pembuat Larutan Virtual" subtitle="Atur komposisi zat untuk melihat konsentrasi yang terbentuk">
          <div className="control-group">
            <label className="control-label">Pilih Zat Terlarut</label>
            <select
              className="control-input"
              value={selectedSoluteId}
              onChange={(e) => setSelectedSoluteId(e.target.value)}
            >
              {solutesData.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.formula}) - Mr = {s.mr}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Massa Zat Terlarut:</span>
              <strong>{massSolute} gram</strong>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={massSolute}
              onChange={(e) => setMassSolute(Number(e.target.value))}
              className="slider-input"
            />
          </div>

          <div className="control-group">
            <div className="control-label">
              <span>Massa Pelarut Air (p):</span>
              <strong>{massSolvent} gram</strong>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={massSolvent}
              onChange={(e) => setMassSolvent(Number(e.target.value))}
              className="slider-input"
            />
          </div>

          {/* Results Output */}
          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginTop: '1.25rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Molalitas (m)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                {formatIndonesianNumber(molality, 3)} m
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fraksi Mol (Xt)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--color-solute)' }}>
                {formatIndonesianNumber(fractions.xSolute, 4)}
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
          {isCompleted ? '✓ Modul 1 Telah Selesai Dipelajari' : 'Tandai Modul 1 Selesai'}
        </Button>
      </div>
    </div>
  );
}

