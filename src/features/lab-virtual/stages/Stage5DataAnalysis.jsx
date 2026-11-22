import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

export default function Stage5DataAnalysis({
  data = {},
  stage4Data = {},
  onSave,
  isCompleted = false,
  onCompleteStage,
  onNextStage,
  onPrevStage
}) {
  const [markedFreezingPoint, setMarkedFreezingPoint] = useState(data.markedFreezingPoint ?? -1.9);
  const [deltaTfAnswer, setDeltaTfAnswer] = useState(data.deltaTfAnswer || '1.9');
  const [kfAnswer, setKfAnswer] = useState(data.kfAnswer || '1.86');
  const [iAnswer, setIAnswer] = useState(data.iAnswer || '1');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const handleSaveAndComplete = () => {
    if (markedFreezingPoint === null || isNaN(Number(markedFreezingPoint))) {
      alert('⚠️ Mohon tentukan titik beku hasil pengamatan terlebih dahulu.');
      return;
    }

    const updated = {
      markedFreezingPoint: Number(markedFreezingPoint),
      deltaTfAnswer,
      kfAnswer,
      iAnswer,
      calculationsVerified: true
    };

    if (onSave) onSave(updated);
    if (onCompleteStage) onCompleteStage(5, updated);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Tahap 5: Analisis Data Grafik, Penandaan Titik Beku & Perhitungan"
        subtitle="Sintaks PjBL 5 • Menentukan Titik Beku (Plateau), Menghitung ΔTf, Kf, dan Faktor van 't Hoff"
      >
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.15rem',
          marginBottom: '1.5rem'
        }}>
          <strong style={{ fontSize: '1.05rem', color: '#0369A1' }}>
            📊 Analisis Kurva Pendinginan
          </strong>
          <p style={{ margin: '0.35rem 0 0 0', color: '#334155', fontSize: '0.94rem', lineHeight: 1.55 }}>
            Data hasil percobaan Arduino dari Tahap 4 diplot ke dalam grafik dan dibandingkan dengan kurva teoretis.
            Tandai titik beku larutan (bagian kurva yang mulai mendatar/plateau), lalu lakukan verifikasi perhitungan nilai ΔTf, Kf, dan faktor van &apos;t Hoff (i).
          </p>
        </div>

        {/* Placeholder Visual Tumpukan Grafik */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <strong style={{ fontSize: '1rem', color: '#0F172A' }}>
              Kurva Pendinginan: Data Percobaan Siswa vs Prediksi Teoretis
            </strong>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0284C7' }} />
                <span>Data Riil Arduino</span>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '12px', height: '3px', background: '#EF4444' }} />
                <span>Simulasi Teoretis</span>
              </span>
            </div>
          </div>

          <div style={{
            height: '180px',
            background: '#F8FAFC',
            borderRadius: '10px',
            border: '1px dashed #94A3B8',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📈</span>
            <strong style={{ color: '#0F172A', fontSize: '0.98rem' }}>
              Grafik Interaktif Data Siswa & Kurva Simulasi
            </strong>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.84rem', color: '#64748B', maxWidth: '480px' }}>
              Titik beku terbaca pada plateau: <strong>{markedFreezingPoint}°C</strong>.
              (Visualisasi grafik lengkap dengan fitur klik penandaan titik beku aktif penuh di Tahap 5).
            </p>
          </div>
        </div>

        {/* Input & Verifikasi Perhitungan */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#0F172A', fontSize: '1.05rem' }}>
            Penetapan Titik Beku & Verifikasi Perhitungan Sifat Koligatif:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#1E293B', marginBottom: '0.35rem' }}>
                Titik Beku Pengamatan (Tf, °C):
              </label>
              <input
                type="number"
                step="0.05"
                value={markedFreezingPoint}
                onChange={(e) => setMarkedFreezingPoint(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.95rem'
                }}
              />
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>*Suhu saat kurva mendatar</span>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#1E293B', marginBottom: '0.35rem' }}>
                Nilai ΔTf = (0°C − Tf):
              </label>
              <input
                type="number"
                step="0.05"
                value={deltaTfAnswer}
                onChange={(e) => setDeltaTfAnswer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.95rem'
                }}
              />
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>ΔTf selalu bernilai positif (°C)</span>
            </div>

            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#1E293B', marginBottom: '0.35rem' }}>
                Perkiraan Nilai i atau Kf:
              </label>
              <input
                type="number"
                step="0.05"
                value={iAnswer}
                onChange={(e) => setIAnswer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.95rem'
                }}
              />
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>i = ΔTf / (Kf × m)</span>
            </div>
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
              ← Kembali ke Tahap 4
            </Button>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isSavedFeedback && (
              <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}>
                ✓ Analisis data berhasil disimpan (+25 XP)
              </span>
            )}
            <Button
              variant="primary"
              onClick={handleSaveAndComplete}
              style={{ padding: '0.75rem 1.4rem', fontWeight: 700, background: '#0284C7' }}
            >
              {isCompleted ? '✓ Simpan Perubahan Analisis' : '✓ Simpan & Selesaikan Tahap 5 (+25 XP) →'}
            </Button>
            {isCompleted && onNextStage && (
              <Button variant="secondary" onClick={onNextStage} style={{ padding: '0.75rem 1.25rem' }}>
                Lanjut ke Tahap 6 →
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
