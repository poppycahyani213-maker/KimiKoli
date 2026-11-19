import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';

export const PREDIKSI_OPTIONS = [
  {
    id: 'A',
    text: 'Garam membunuh semua kuman, dan air menambah vitamin sayur.'
  },
  {
    id: 'B',
    text: 'Air berpindah dari larutan encer ke larutan pekat melalui dinding sel.'
  },
  {
    id: 'C',
    text: 'Garam dan air sama-sama masuk ke dalam sel.'
  },
  {
    id: 'D',
    text: 'Ikan asin dan sayur tidak berhubungan dengan perpindahan air.'
  }
];

// Helper kunci penyimpanan prediksi per siswa berbasis nama dan kelas
export function getCh4PredictionKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch4_prediction_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch4_prediction_v1_guest';
}

export default function PrediksiOsmosis({ onDataSaved }) {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [reason, setReason] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Muat data prediksi yang pernah disimpan sebelumnya
  useEffect(() => {
    const key = getCh4PredictionKey();
    const existing = getStoredData(key, null);
    if (existing) {
      if (existing.choice) setSelectedChoice(existing.choice);
      if (existing.reason) setReason(existing.reason);
      setIsSaved(true);
      setSaveMessage('Prediksimu telah tersimpan. Mari kita telusuri konsepnya di tab berikutnya!');
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedChoice) {
      alert('Pilih salah satu jawaban prediksi terlebih dahulu!');
      return;
    }

    const payload = {
      choice: selectedChoice,
      reason: reason.trim(),
      savedAt: new Date().toISOString()
    };

    const key = getCh4PredictionKey();
    const success = setStoredData(key, payload);

    if (success) {
      setIsSaved(true);
      setSaveMessage('Prediksimu berhasil disimpan! Mari kita telusuri konsepnya di tab berikutnya.');
      if (onDataSaved) {
        onDataSaved(payload);
      }
    }
  };

  return (
    <Card
      title="Prediksi Awal: Tekanan Osmotik dalam Kehidupan Sehari-hari"
      subtitle="Uji intuisimu sebelum mempelajari konsep ilmiah tekanan osmotik"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>

        {/* ── Kotak Pertanyaan Pemantik ───────────────────────────────────── */}
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #93C5FD',
          borderRadius: '12px',
          padding: '1.1rem 1.35rem',
        }}>
          <span style={{ fontSize: '0.8rem', color: '#1E40AF', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Pertanyaan Pemantik:
          </span>
          <h4 style={{ margin: '0.35rem 0 0', fontSize: '1.15rem', color: '#0F172A', lineHeight: 1.5 }}>
            “Kenapa ikan asin awet, tetapi sayur layu bisa segar lagi kalau direndam air?”
          </h4>
        </div>

        {/* ── Pilihan Jawaban Prediksi ─────────────────────────────────────── */}
        <div>
          <label style={{ display: 'block', fontWeight: 800, fontSize: '1rem', marginBottom: '0.65rem', color: '#0F172A' }}>
            Menurut dugaan atau pemahaman awalmu, manakah penjelasan yang paling masuk akal?
          </label>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {PREDIKSI_OPTIONS.map((opt) => {
              const isSelected = selectedChoice === opt.id;
              return (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '0.9rem 1.1rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #0284C7' : '1px solid #E2E8F0',
                    background: isSelected ? '#F0F9FF' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    boxShadow: isSelected ? '0 2px 6px rgba(2, 132, 199, 0.12)' : 'none'
                  }}
                >
                  <input
                    type="radio"
                    name="prediksi-osmosis"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => setSelectedChoice(opt.id)}
                    style={{ marginTop: '0.2rem', cursor: 'pointer', accentColor: '#0284C7' }}
                  />
                  <div style={{ fontSize: '0.95rem', color: '#1E293B', lineHeight: 1.5 }}>
                    <strong style={{ color: isSelected ? '#0369A1' : '#334155' }}>
                      {opt.id}.{' '}
                    </strong>
                    {opt.text}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── Kolom Alasan ────────────────────────────────────────────────── */}
        <div>
          <label
            htmlFor="alasan-prediksi"
            style={{ display: 'block', fontWeight: 800, fontSize: '0.95rem', marginBottom: '0.4rem', color: '#0F172A' }}
          >
            Alasanmu memilih jawaban itu:
          </label>
          <textarea
            id="alasan-prediksi"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tuliskan alasan atau penjelasan logis di balik pilihanmu..."
            style={{
              width: '100%',
              padding: '0.75rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.92rem',
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: 1.5,
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* ── Tombol Simpan & Notifikasi ──────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Button
            type="submit"
            variant="primary"
            style={{ padding: '0.75rem 1.6rem', fontSize: '0.98rem', fontWeight: 700 }}
          >
            {isSaved ? 'Perbarui Prediksi' : 'Simpan Prediksi'}
          </Button>

          {isSaved && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#059669',
              background: '#ECFDF5',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              border: '1px solid #A7F3D0'
            }}>
              <span>✓</span>
              <span>{saveMessage}</span>
            </div>
          )}
        </div>

      </form>
    </Card>
  );
}
