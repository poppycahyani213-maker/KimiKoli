import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

export default function Stage1Problem({
  data = {},
  onSave,
  isCompleted = false,
  onCompleteStage,
  onNextStage
}) {
  const [selectedScenario, setSelectedScenario] = useState(data.selectedScenario || 'es-puter');
  const [hypothesis, setHypothesis] = useState(data.hypothesis || '');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const handleSaveAndComplete = () => {
    if (!hypothesis.trim()) {
      alert('⚠️ Mohon tuliskan rumusan hipotesismu terlebih dahulu sebelum menyelesaikan Tahap 1.');
      return;
    }

    const updated = {
      selectedScenario,
      hypothesis
    };

    if (onSave) onSave(updated);
    if (onCompleteStage) onCompleteStage(1, updated);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Tahap 1: Orientasi Masalah & Perumusan Hipotesis"
        subtitle="Sintaks PjBL 1 • Investigasi Fenomena Nyata Penurunan Titik Beku"
      >
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.4rem' }}>❓</span>
            <strong style={{ fontSize: '1.1rem', color: '#0369A1' }}>
              Skenario Kontekstual Dunia Nyata
            </strong>
          </div>
          <p style={{ margin: 0, color: '#1E293B', fontSize: '0.98rem', lineHeight: 1.6 }}>
            Pilihlah salah satu fenomena nyata di bawah ini untuk kamu investigasi bersama kelompokmu menggunakan
            alat ukur digital Arduino dan pemodelan kurva pendinginan:
          </p>
        </div>

        {/* Pilihan Skenario */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div
            onClick={() => setSelectedScenario('es-puter')}
            style={{
              padding: '1.15rem',
              borderRadius: '14px',
              border: `2px solid ${selectedScenario === 'es-puter' ? '#0284C7' : '#E2E8F0'}`,
              background: selectedScenario === 'es-puter' ? '#F0F9FF' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>🍦 Kasus 1: Gerobak Es Puter Tradisional</strong>
              <input
                type="radio"
                name="scenario"
                checked={selectedScenario === 'es-puter'}
                onChange={() => setSelectedScenario('es-puter')}
              />
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569', lineHeight: 1.55 }}>
              Pembuat es puter mencampurkan garam krosok dalam jumlah banyak ke bongkahan es batu di sekeliling tabung adonan.
              Es tersebut mencair dengan cepat, tetapi anehnya suhunya anjlok hingga mencapai -5°C sampai -10°C sehingga adonan santan membeku menjadi es krim padat.
            </p>
          </div>

          <div
            onClick={() => setSelectedScenario('garam-salju')}
            style={{
              padding: '1.15rem',
              borderRadius: '14px',
              border: `2px solid ${selectedScenario === 'garam-salju' ? '#0284C7' : '#E2E8F0'}`,
              background: selectedScenario === 'garam-salju' ? '#F0F9FF' : '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>❄️ Kasus 2: Penaburan Garam di Jalan Bersalju</strong>
              <input
                type="radio"
                name="scenario"
                checked={selectedScenario === 'garam-salju'}
                onChange={() => setSelectedScenario('garam-salju')}
              />
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569', lineHeight: 1.55 }}>
              Di negara beriklim dingin, truk dinas menaburkan garam batu (NaCl atau CaCl₂) ke atas permukaan jalan raya yang tertutup es dan salju tebal saat musim dingin.
              Meskipun suhu udara lingkungan berada di bawah 0°C, salju tetap meleleh dan jalan tidak menjadi licin.
            </p>
          </div>
        </div>

        {/* Input Rumusan Hipotesis */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '0.45rem' }}>
            ✍️ Rumuskan Hipotesis Penyelidikanmu:
          </label>
          <p style={{ margin: '0 0 0.6rem 0', fontSize: '0.88rem', color: '#64748B' }}>
            Hubungkan pengaruh penambahan zat terlarut (gula/garam) dan konsentrasinya (molalitas) terhadap suhu pembekuan larutan dan bentuk kurva pendinginan yang akan diamati.
          </p>
          <textarea
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="Contoh: Jika ke dalam air ditambahkan zat terlarut berupa garam (elektrolit), maka titik beku larutan akan turun lebih rendah dibandingkan larutan gula pada molalitas yang sama, karena garam terurai menjadi ion-ion..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.95rem',
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: 1.55,
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Action Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid #E2E8F0'
        }}>
          <div>
            {isSavedFeedback && (
              <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}>
                ✓ Hipotesis berhasil disimpan (+15 XP)
              </span>
            )}
            {isCompleted && !isSavedFeedback && (
              <span style={{ color: '#059669', fontSize: '0.9rem', fontWeight: 600 }}>
                ✓ Tahap 1 telah selesai (+15 XP diraih)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button
              variant="primary"
              onClick={handleSaveAndComplete}
              style={{
                padding: '0.75rem 1.4rem',
                fontSize: '0.98rem',
                fontWeight: 700,
                background: '#0284C7'
              }}
            >
              {isCompleted ? '✓ Simpan Ulang Hipotesis' : '✓ Simpan & Selesaikan Tahap 1 (+15 XP) →'}
            </Button>
            {isCompleted && onNextStage && (
              <Button
                variant="secondary"
                onClick={onNextStage}
                style={{ padding: '0.75rem 1.25rem', fontSize: '0.98rem' }}
              >
                Lanjut ke Tahap 2 →
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
