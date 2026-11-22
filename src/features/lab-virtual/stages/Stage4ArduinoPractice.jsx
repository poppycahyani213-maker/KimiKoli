import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

export default function Stage4ArduinoPractice({
  data = {},
  onSave,
  isCompleted = false,
  onCompleteStage,
  onNextStage,
  onPrevStage
}) {
  const [inputMode, setInputMode] = useState(data.inputMode || 'manual');
  const [dataRows, setDataRows] = useState(data.dataRows?.length ? data.dataRows : [
    { time: 0, temp: 24.5 },
    { time: 30, temp: 18.0 },
    { time: 60, temp: 10.5 },
    { time: 90, temp: 3.2 },
    { time: 120, temp: -0.2 },
    { time: 150, temp: -1.9 },
    { time: 180, temp: -1.9 },
    { time: 210, temp: -1.9 },
    { time: 240, temp: -2.3 }
  ]);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const addRow = () => {
    const lastTime = dataRows.length ? dataRows[dataRows.length - 1].time : 0;
    setDataRows([...dataRows, { time: lastTime + 30, temp: '' }]);
  };

  const removeRow = (index) => {
    setDataRows(dataRows.filter((_, i) => i !== index));
  };

  const updateRow = (index, field, value) => {
    const updated = [...dataRows];
    updated[index][field] = value;
    setDataRows(updated);
  };

  const handleSaveAndComplete = () => {
    // Validasi data
    const validRows = dataRows
      .filter((r) => r.time !== '' && r.temp !== '' && !isNaN(Number(r.temp)))
      .map((r) => ({ time: Number(r.time), temp: Number(r.temp) }));

    if (validRows.length < 3) {
      alert('⚠️ Mohon masukkan minimal 3 baris data waktu dan suhu yang valid.');
      return;
    }

    const updated = {
      inputMode,
      dataRows: validRows
    };

    if (onSave) onSave(updated);
    if (onCompleteStage) onCompleteStage(4, updated);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Tahap 4: Praktik Nyata Berbasis Arduino & Perekaman Data"
        subtitle="Sintaks PjBL 4 • Pengambilan Data Kurva Pendinginan Suhu (°C) vs Waktu (detik)"
      >
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.15rem',
          marginBottom: '1.5rem'
        }}>
          <strong style={{ fontSize: '1.05rem', color: '#0369A1' }}>
            🔌 Perekaman Data Eksperimen Riil
          </strong>
          <p style={{ margin: '0.35rem 0 0 0', color: '#334155', fontSize: '0.94rem', lineHeight: 1.55 }}>
            Celupkan sensor DS18B20 ke dalam tabung larutan uji yang ditaruh di dalam wadah pendingin es + garam kasar.
            Catat suhu setiap interval 30 detik dari layar LCD atau Serial Monitor.
          </p>
        </div>

        {/* Tab Pemilihan Metode Input */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setInputMode('manual')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: inputMode === 'manual' ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
              background: inputMode === 'manual' ? '#0284C7' : '#FFFFFF',
              color: inputMode === 'manual' ? '#FFFFFF' : '#334155',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            📝 Tabel Input Manual
          </button>
          <button
            type="button"
            onClick={() => setInputMode('csv')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: inputMode === 'csv' ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
              background: inputMode === 'csv' ? '#0284C7' : '#FFFFFF',
              color: inputMode === 'csv' ? '#FFFFFF' : '#334155',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            📁 Unggah File CSV
          </button>
          <button
            type="button"
            onClick={() => setInputMode('serial')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: inputMode === 'serial' ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
              background: inputMode === 'serial' ? '#0284C7' : '#FFFFFF',
              color: inputMode === 'serial' ? '#FFFFFF' : '#334155',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            ⚡ Web Serial API (Real-time)
          </button>
        </div>

        {/* Tabel Data Manual */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          border: '1.5px solid #E2E8F0',
          padding: '1rem',
          marginBottom: '1.5rem',
          overflowX: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <strong style={{ fontSize: '0.96rem', color: '#0F172A' }}>
              Tabel Pengamatan Suhu Pendinginan:
            </strong>
            <Button variant="secondary" onClick={addRow} style={{ padding: '0.4rem 0.85rem', fontSize: '0.86rem' }}>
              + Tambah Baris Pengamatan
            </Button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '340px' }}>
            <thead>
              <tr style={{ background: '#E0F2FE', color: '#0369A1', fontSize: '0.88rem' }}>
                <th style={{ padding: '0.6rem 0.85rem', borderBottom: '1px solid #BAE6FD' }}>No.</th>
                <th style={{ padding: '0.6rem 0.85rem', borderBottom: '1px solid #BAE6FD' }}>Waktu (detik)</th>
                <th style={{ padding: '0.6rem 0.85rem', borderBottom: '1px solid #BAE6FD' }}>Suhu (°C)</th>
                <th style={{ padding: '0.6rem 0.85rem', borderBottom: '1px solid #BAE6FD', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '0.5rem 0.85rem', fontSize: '0.88rem', color: '#64748B' }}>{idx + 1}</td>
                  <td style={{ padding: '0.5rem 0.85rem' }}>
                    <input
                      type="number"
                      value={row.time}
                      onChange={(e) => updateRow(idx, 'time', e.target.value)}
                      style={{
                        width: '90px',
                        padding: '0.35rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem 0.85rem' }}>
                    <input
                      type="number"
                      step="0.1"
                      value={row.temp}
                      onChange={(e) => updateRow(idx, 'temp', e.target.value)}
                      placeholder="0.0"
                      style={{
                        width: '90px',
                        padding: '0.35rem 0.5rem',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem'
                      }}
                    />
                  </td>
                  <td style={{ padding: '0.5rem 0.85rem', textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#EF4444',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                      title="Hapus baris ini"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              ← Kembali ke Tahap 3
            </Button>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isSavedFeedback && (
              <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}>
                ✓ Data berhasil disimpan (+25 XP)
              </span>
            )}
            <Button
              variant="primary"
              onClick={handleSaveAndComplete}
              style={{ padding: '0.75rem 1.4rem', fontWeight: 700, background: '#0284C7' }}
            >
              {isCompleted ? '✓ Simpan Pembaruan Data' : '✓ Simpan & Selesaikan Tahap 4 (+25 XP) →'}
            </Button>
            {isCompleted && onNextStage && (
              <Button variant="secondary" onClick={onNextStage} style={{ padding: '0.75rem 1.25rem' }}>
                Lanjut ke Tahap 5 →
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
