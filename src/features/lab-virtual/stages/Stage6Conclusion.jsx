import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

export default function Stage6Conclusion({
  data = {},
  stage1Data = {},
  onSave,
  isCompleted = false,
  onCompleteStage,
  onFinalizeLab,
  onPrevStage
}) {
  const [conclusion, setConclusion] = useState(data.conclusion || '');
  const [reflection, setReflection] = useState(data.reflection || '');
  const [quizAnswers, setQuizAnswers] = useState(data.quizAnswers || {});
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  const handleAnswerChange = (qKey, optionKey) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [qKey]: optionKey
    }));
  };

  const handleSaveAndComplete = () => {
    if (!conclusion.trim()) {
      alert('⚠️ Mohon tuliskan kesimpulan investigasimu terlebih dahulu.');
      return;
    }

    const updated = {
      conclusion,
      reflection,
      quizAnswers,
      isFinished: true
    };

    if (onSave) onSave(updated);
    if (onCompleteStage) onCompleteStage(6, updated);
    if (onFinalizeLab) onFinalizeLab(updated);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Tahap 6: Kesimpulan, Refleksi & Evaluasi Proyek"
        subtitle="Sintaks PjBL 6 • Menguji Hipotesis, Menarik Kesimpulan Ilmiah & Menyelesaikan Praktikum Lab"
      >
        <div style={{
          background: '#ECFDF5',
          border: '1.5px solid #A7F3D0',
          borderRadius: '14px',
          padding: '1.15rem',
          marginBottom: '1.5rem'
        }}>
          <strong style={{ fontSize: '1.05rem', color: '#065F46' }}>
            💡 Tahap Akhir Investigasi Sifat Koligatif
          </strong>
          <p style={{ margin: '0.35rem 0 0 0', color: '#064E3B', fontSize: '0.94rem', lineHeight: 1.55 }}>
            Bandingkan hasil eksperimenmu dengan hipotesis awal di Tahap 1. Buatlah kesimpulan ilmiah mengenai
            pengaruh penambahan zat nonelektrolit vs elektrolit terhadap penurunan titik beku air.
          </p>
        </div>

        {/* Kotak Pengingat Hipotesis Awal */}
        {stage1Data?.hypothesis && (
          <div style={{
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369A1', marginBottom: '0.25rem' }}>
              📌 Hipotesis Awal yang Kamu Rumuskan di Tahap 1:
            </div>
            <p style={{ margin: 0, fontStyle: 'italic', color: '#1E293B', fontSize: '0.94rem' }}>
              &ldquo;{stage1Data.hypothesis}&rdquo;
            </p>
          </div>
        )}

        {/* 1. Kesimpulan Siswa */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.98rem', color: '#0F172A', marginBottom: '0.35rem' }}>
            1. Tuliskan Kesimpulan Ilmiahmu:
          </label>
          <textarea
            value={conclusion}
            onChange={(e) => setConclusion(e.target.value)}
            placeholder="Tuliskan kesimpulan mengenai hubungan antara jumlah partikel zat terlarut, faktor van 't Hoff, dan besar penurunan titik beku (ΔTf)..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '10px',
              border: '1.5px solid #CBD5E1',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: '0.95rem',
              lineHeight: 1.55,
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* 2. Refleksi Pembelajaran PjBL */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '0.98rem', color: '#0F172A', marginBottom: '0.35rem' }}>
            2. Refleksi Kolaboratif & Pengalaman Praktik Arduino:
          </label>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="Apa tantangan terbesar saat merangkai Arduino atau membaca kurva pendinginan? Bagaimana simulasi digital membantumu memahami data riil?"
            rows={3}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '10px',
              border: '1.5px solid #CBD5E1',
              fontFamily: "'Times New Roman', Times, serif",
              fontSize: '0.95rem',
              lineHeight: 1.55,
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* 3. Kuis Evaluasi Singkat */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.65rem 0', color: '#0F172A', fontSize: '1.02rem' }}>
            3. Kuis Singkat Uji Konsep Lab:
          </h4>
          <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <p style={{ margin: '0 0 0.65rem 0', fontWeight: 700, fontSize: '0.92rem', color: '#1E293B' }}>
              Mengapa pada konsentrasi molal yang sama, larutan garam (NaCl) memiliki penurunan titik beku (ΔTf) hampir dua kali lipat dibanding larutan gula (sukrosa)?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="quizQ1"
                  checked={quizAnswers.q1 === 'A'}
                  onChange={() => handleAnswerChange('q1', 'A')}
                />
                <span>A. Karena garam menyerap lebih banyak panas dari lingkungan saat dilarutkan.</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="quizQ1"
                  checked={quizAnswers.q1 === 'B'}
                  onChange={() => handleAnswerChange('q1', 'B')}
                />
                <span>B. Karena NaCl terdisosiasi menjadi 2 ion (Na⁺ dan Cl⁻), sehingga jumlah partikel efektif menjadi 2 kali lipat (i ≈ 2).</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                <input
                  type="radio"
                  name="quizQ1"
                  checked={quizAnswers.q1 === 'C'}
                  onChange={() => handleAnswerChange('q1', 'C')}
                />
                <span>C. Karena massa molar garam lebih kecil daripada sukrosa.</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer Navigasi & Penyelesaian Praktikum */}
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
              ← Kembali ke Tahap 5
            </Button>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isSavedFeedback && (
              <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}>
                ✓ Seluruh 6 Tahap Lab Tuntas (+20 XP diraih, Gembok Kuis Terbuka!)
              </span>
            )}
            <Button
              variant="primary"
              onClick={handleSaveAndComplete}
              style={{
                padding: '0.85rem 1.6rem',
                fontWeight: 700,
                fontSize: '1rem',
                background: '#059669',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
              }}
            >
              {isCompleted ? '✓ Simpan Pembaruan Kesimpulan' : '🏆 Selesaikan Seluruh Lab & Buka Kuis Akhir (+20 XP) →'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
