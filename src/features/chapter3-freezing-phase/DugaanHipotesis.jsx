import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';

export const DUGAAN_OPTIONS = [
  {
    id: 'A',
    text: 'Garam menghangatkan es, sehingga es mencair dan panasnya berpindah ke adonan.'
  },
  {
    id: 'B',
    text: 'Garam menurunkan titik beku, sehingga campuran es dan garam menjadi lebih dingin dari 0 °C dan menyerap panas dari adonan.'
  },
  {
    id: 'C',
    text: 'Es mencair karena udara sekitar panas, dan adonan membeku karena tabung logamnya dingin.'
  },
  {
    id: 'D',
    text: 'Garam bereaksi kimia dengan es dan reaksi itu menghasilkan dingin.'
  }
];

// Helper kunci penyimpanan per siswa berbasis nama dan kelas (identik dengan syarat Bab 1)
export function getCh3HypothesisKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch3_hypothesis_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch3_hypothesis_v1_guest';
}

export default function DugaanHipotesis({ onDataSaved }) {
  const [selectedChoice, setSelectedChoice] = useState('');
  const [reason, setReason] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [hypothesis, setHypothesis] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Muat data yang pernah disimpan sebelumnya per siswa
  useEffect(() => {
    const key = getCh3HypothesisKey();
    const existing = getStoredData(key, null);
    if (existing) {
      if (existing.choice) setSelectedChoice(existing.choice);
      if (existing.reason) setReason(existing.reason);
      if (existing.problemStatement) setProblemStatement(existing.problemStatement);
      if (existing.hypothesis) setHypothesis(existing.hypothesis);
      setIsSaved(true);
      setSaveMessage('Dugaanmu tersimpan. Mari kita selidiki di Fase 3!');
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedChoice) {
      alert('Pilih salah satu dugaan terlebih dahulu!');
      return;
    }

    const payload = {
      choice: selectedChoice,
      reason: reason.trim(),
      problemStatement: problemStatement.trim(),
      hypothesis: hypothesis.trim(),
      savedAt: new Date().toISOString()
    };

    const key = getCh3HypothesisKey();
    const success = setStoredData(key, payload);

    if (success) {
      setIsSaved(true);
      setSaveMessage('Dugaanmu tersimpan. Mari kita selidiki di Fase 3!');
      if (onDataSaved) {
        onDataSaved(payload);
      }
    }
  };

  return (
    <Card
      title="Rancang Penyelidikan: Dugaan, Rumusan Masalah & Hipotesis"
      subtitle="Bangun dugaan ilmiahmu berdasarkan fenomena gerobak es puter Pak Darmo"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* ── 1. Dugaan Awal (Pilihan Tunggal) ────────────────────────── */}
        <div>
          <label style={{ display: 'block', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.6rem', color: '#0F172A' }}>
            1. Dugaan Awalmu
          </label>
          <p style={{ margin: '0 0 0.85rem', color: '#64748B', fontSize: '0.95rem' }}>
            Menurutmu, apa yang sebenarnya terjadi pada campuran es batu, garam, dan adonan es puter?
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {DUGAAN_OPTIONS.map((opt) => {
              const isSelected = selectedChoice === opt.id;
              return (
                <label
                  key={opt.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.85rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #0284C7' : '1px solid #E2E8F0',
                    background: isSelected ? '#F0F9FF' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <input
                    type="radio"
                    name="dugaan_awal"
                    value={opt.id}
                    checked={isSelected}
                    onChange={(e) => {
                      setSelectedChoice(e.target.value);
                      setIsSaved(false); // beri tanda bila ada perubahan sebelum klik simpan
                    }}
                    style={{ marginTop: '0.2rem', accentColor: '#0284C7', cursor: 'pointer' }}
                  />
                  <div style={{ fontSize: '0.975rem', lineHeight: 1.5, color: '#1E293B' }}>
                    <strong style={{ color: isSelected ? '#0369A1' : '#334155', marginRight: '0.35rem' }}>
                      {opt.id}.
                    </strong>
                    {opt.text}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* ── 2. Alasan Memilih Jawaban ─────────────────────────────── */}
        <div>
          <label style={{ display: 'block', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.4rem', color: '#0F172A' }}>
            2. Alasanmu Memilih Jawaban Itu
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Tuliskan alasan atau logika ilmiah di balik pilihan dugaanmu..."
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              lineHeight: 1.5,
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* ── 3. Kolom Rumusan Masalah ───────────────────────────────── */}
        <div>
          <label style={{ display: 'block', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.4rem', color: '#0F172A' }}>
            3. Rumusan Masalah
          </label>
          <input
            type="text"
            value={problemStatement}
            onChange={(e) => {
              setProblemStatement(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Contoh: Bagaimana pengaruh garam terhadap titik beku air?"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* ── 4. Kolom Hipotesis ─────────────────────────────────────── */}
        <div>
          <label style={{ display: 'block', fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.4rem', color: '#0F172A' }}>
            4. Hipotesis
          </label>
          <input
            type="text"
            value={hypothesis}
            onChange={(e) => {
              setHypothesis(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Contoh: Jika garam ditambahkan ke es, maka …"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* ── Tombol Simpan & Pesan Konfirmasi ───────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '0.5rem',
          borderTop: '1px solid #F1F5F9'
        }}>
          <Button
            type="submit"
            variant="primary"
            style={{
              padding: '0.75rem 1.6rem',
              fontSize: '1rem',
              background: '#0284C7',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
            }}
          >
            💾 Simpan dugaanku
          </Button>

          <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Pilihan tetap bisa kamu ubah dan perbarui sampai Fase 5.
          </span>
        </div>

        {/* Notifikasi Penyimpanan */}
        {isSaved && saveMessage && (
          <div style={{
            background: '#F0FDF4',
            border: '1.5px solid #86EFAC',
            borderRadius: '10px',
            padding: '0.85rem 1.25rem',
            color: '#166534',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.95rem',
            fontWeight: 700
          }}>
            <span style={{ fontSize: '1.2rem' }}>✓</span>
            <span>{saveMessage}</span>
          </div>
        )}

      </form>
    </Card>
  );
}

