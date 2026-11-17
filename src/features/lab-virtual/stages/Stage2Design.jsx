import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

export default function Stage2Design({
  data = {},
  onSave,
  isCompleted = false,
  onCompleteStage,
  onNextStage,
  onPrevStage
}) {
  const [soluteType, setSoluteType] = useState(data.soluteType || 'nonelektrolit');
  const [soluteName, setSoluteName] = useState(data.soluteName || 'gula');
  const [molality, setMolality] = useState(data.molality || 1);
  const [checklist, setChecklist] = useState(data.checklist || {
    alatBahan: false,
    skemaRangkaian: false,
    safetyRules: false
  });
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const toggleCheck = (key) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveAndComplete = () => {
    const updated = {
      soluteType,
      soluteName,
      molality: Number(molality),
      checklist
    };

    if (onSave) onSave(updated);
    if (onCompleteStage) onCompleteStage(2, updated);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Tahap 2: Merancang Eksperimen & Skema Rangkaian Arduino"
        subtitle="Sintaks PjBL 2 • Menentukan Variabel Penelitian & Persiapan Perangkat Keras"
      >
        <div style={{
          background: '#F0F9FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.15rem',
          marginBottom: '1.5rem'
        }}>
          <strong style={{ fontSize: '1.05rem', color: '#0369A1' }}>
            🎯 Tujuan Perancangan
          </strong>
          <p style={{ margin: '0.35rem 0 0 0', color: '#334155', fontSize: '0.94rem', lineHeight: 1.55 }}>
            Tentukan variabel bebas dan variabel terikat yang akan diuji melalui percobaan kurva pendinginan titik beku,
            serta periksa kesiapan rangkaian sensor digital DS18B20 berbasis Arduino.
          </p>
        </div>

        {/* 1. Pemilihan Variabel Penelitian */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#0F172A', fontSize: '1.05rem' }}>
            1. Penentuan Variabel Penelitian
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {/* Jenis Zat Terlarut */}
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', color: '#1E293B', marginBottom: '0.4rem' }}>
                Jenis Zat Terlarut (Sifat Larutan):
              </label>
              <select
                value={soluteType}
                onChange={(e) => {
                  const val = e.target.value;
                  setSoluteType(val);
                  setSoluteName(val === 'elektrolit' ? 'garam' : 'gula');
                }}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: '0.95rem'
                }}
              >
                <option value="nonelektrolit">Nonelektrolit (Sukrosa / Gula Pasir, i = 1)</option>
                <option value="elektrolit">Elektrolit Biner Kuat (Garam Dapur / NaCl, i ≈ 2)</option>
              </select>
            </div>

            {/* Molalitas Larutan */}
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', color: '#1E293B', marginBottom: '0.4rem' }}>
                Molalitas Larutan (m):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.5"
                  value={molality}
                  onChange={(e) => setMolality(e.target.value)}
                  style={{ flex: 1 }}
                />
                <span style={{ fontWeight: 700, color: '#0284C7', minWidth: '55px', fontSize: '1rem' }}>
                  {molality} m
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                *Rentang uji: 0.5 m hingga 3.0 m
              </span>
            </div>
          </div>
        </div>

        {/* 2. Diagram Skema Rangkaian Arduino DS18B20 + LCD */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#0F172A', fontSize: '1.05rem' }}>
            2. Skema Rangkaian Arduino + Sensor DS18B20 + LCD 16x2 I2C
          </h4>
          <div style={{
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            borderRadius: '14px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            {/* Ilustrasi SVG Skematik Rangkaian */}
            <div style={{ maxWidth: '520px', margin: '0 auto', background: '#FFFFFF', padding: '1rem', borderRadius: '12px', border: '1px solid #CBD5E1' }}>
              <svg viewBox="0 0 500 220" style={{ width: '100%', height: 'auto', display: 'block' }}>
                {/* Arduino Box */}
                <rect x="20" y="40" width="140" height="140" rx="8" fill="#0284C7" />
                <text x="90" y="100" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">Arduino Uno</text>
                <text x="90" y="125" fill="#BAE6FD" fontSize="11" textAnchor="middle">Microcontroller</text>

                {/* Sensor DS18B20 Box */}
                <rect x="340" y="20" width="130" height="70" rx="8" fill="#10B981" />
                <text x="405" y="55" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">Sensor DS18B20</text>
                <text x="405" y="75" fill="#ECFDF5" fontSize="10" textAnchor="middle">Waterproof Temp</text>

                {/* LCD 16x2 I2C Box */}
                <rect x="340" y="120" width="130" height="70" rx="8" fill="#6366F1" />
                <text x="405" y="155" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">LCD 16x2 I2C</text>
                <text x="405" y="175" fill="#EEF2FF" fontSize="10" textAnchor="middle">Display Suhu °C</text>

                {/* Kabel Sambungan */}
                {/* Arduino to DS18B20 */}
                <path d="M 160 70 L 340 50" stroke="#EF4444" strokeWidth="2.5" fill="none" />
                <text x="250" y="52" fill="#EF4444" fontSize="10" fontWeight="bold">Pin D2 + 4.7kΩ pull-up</text>

                {/* Arduino to LCD I2C */}
                <path d="M 160 150 L 340 155" stroke="#F59E0B" strokeWidth="2.5" fill="none" />
                <text x="250" y="168" fill="#D97706" fontSize="10" fontWeight="bold">I2C (SDA = A4, SCL = A5)</text>
              </svg>
            </div>
            <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              💡 Kabel merah: VCC (5V), hitam: GND, kuning: Pin Digital 2 (dilengkapi resistor pull-up 4,7 kΩ ke 5V).
            </p>
          </div>
        </div>

        {/* 3. Checklist Kesiapan Praktikum */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.65rem 0', color: '#0F172A', fontSize: '1.05rem' }}>
            3. Checklist Kesiapan Praktikum (Centang yang sudah dipahami)
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={Boolean(checklist.alatBahan)}
                onChange={() => toggleCheck('alatBahan')}
              />
              <span style={{ fontSize: '0.94rem', color: '#1E293B' }}>
                Saya telah menyiapkan alat & bahan: Arduino, sensor DS18B20 waterproof, LCD I2C, gelas kimia, es batu, garam krosok, dan sampel larutan.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={Boolean(checklist.skemaRangkaian)}
                onChange={() => toggleCheck('skemaRangkaian')}
              />
              <span style={{ fontSize: '0.94rem', color: '#1E293B' }}>
                Saya telah memahami alur rangkaian kabel: pin data DS18B20 terhubung ke pin D2 Arduino dengan resistor pull-up 4,7 kΩ.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={Boolean(checklist.safetyRules)}
                onChange={() => toggleCheck('safetyRules')}
              />
              <span style={{ fontSize: '0.94rem', color: '#1E293B' }}>
                Paham aturan keselamatan: Campuran es-garam sangat dingin, hindari kontak langsung dengan kulit dan jauhkan sambungan sirkuit listrik dari tumpahan air.
              </span>
            </label>
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
              ← Kembali ke Tahap 1
            </Button>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isSavedFeedback && (
              <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}>
                ✓ Rancangan berhasil disimpan (+15 XP)
              </span>
            )}
            <Button
              variant="primary"
              onClick={handleSaveAndComplete}
              style={{ padding: '0.75rem 1.4rem', fontWeight: 700, background: '#0284C7' }}
            >
              {isCompleted ? '✓ Simpan Perubahan Rancangan' : '✓ Simpan & Selesaikan Tahap 2 (+15 XP) →'}
            </Button>
            {isCompleted && onNextStage && (
              <Button variant="secondary" onClick={onNextStage} style={{ padding: '0.75rem 1.25rem' }}>
                Lanjut ke Tahap 3 →
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
