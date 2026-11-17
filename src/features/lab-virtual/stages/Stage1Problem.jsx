import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

/**
 * Tahap 1: Pertanyaan Masalah & Hipotesis (Sintaks PjBL 1)
 * Siswa memilih skenario fenomena kontekstual, merumuskan pertanyaan investigasi,
 * dan menulis hipotesis ilmiah yang tersimpan per username.
 */
export default function Stage1Problem({
  data = {},
  onSave,
  isCompleted = false,
  onCompleteStage,
  onNextStage
}) {
  const [selectedScenario, setSelectedScenario] = useState(data.selectedScenario || 'es-puter');
  const [researchQuestion, setResearchQuestion] = useState(
    data.researchQuestion || 'Bagaimana pengaruh jenis zat terlarut (nonelektrolit vs elektrolit) dan konsentrasinya terhadap besar penurunan titik beku air serta bentuk kurva pendinginan?'
  );
  const [hypothesisIf, setHypothesisIf] = useState(data.hypothesisIf || '');
  const [hypothesisThen, setHypothesisThen] = useState(data.hypothesisThen || '');
  const [hypothesisBecause, setHypothesisBecause] = useState(data.hypothesisBecause || '');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Buat hipotesis terpadu jika siswa mengisi format atau teks bebas
  const combinedHypothesis = data.hypothesis || 
    (hypothesisIf || hypothesisThen || hypothesisBecause 
      ? `JIKA ${hypothesisIf}, MAKA ${hypothesisThen}, KARENA ${hypothesisBecause}.` 
      : '');

  const [hypothesis, setHypothesis] = useState(combinedHypothesis);

  const handleApplyTemplate = () => {
    const template = `JIKA ke dalam air ditambahkan zat terlarut nonelektrolit (gula) dan elektrolit (garam) dengan konsentrasi yang semakin tinggi, MAKA titik beku larutan akan semakin turun dan larutan garam memiliki penurunan titik beku lebih besar, KARENA garam terurai menjadi ion-ion bebas (faktor van 't Hoff i > 1) sehingga jumlah partikelnya lebih banyak daripada molekul gula.`;
    setHypothesis(template);
    setHypothesisIf('ke dalam air ditambahkan zat terlarut nonelektrolit (gula) dan elektrolit (garam) dengan konsentrasi meningkat');
    setHypothesisThen('titik beku larutan akan semakin turun di bawah 0°C, dan larutan garam akan turun lebih jauh dibanding larutan gula');
    setHypothesisBecause('garam terdisosiasi menjadi ion Na⁺ dan Cl⁻ (i ≈ 2) sehingga jumlah partikel efektifnya dua kali lebih banyak dibanding molekul gula (i = 1)');
  };

  const handleSaveAndComplete = () => {
    if (!hypothesis.trim()) {
      alert('⚠️ Mohon tuliskan rumusan hipotesismu terlebih dahulu sebelum menyelesaikan Tahap 1.');
      return;
    }

    const updated = {
      selectedScenario,
      researchQuestion,
      hypothesisIf,
      hypothesisThen,
      hypothesisBecause,
      hypothesis: hypothesis.trim()
    };

    if (onSave) onSave(updated);
    if (onCompleteStage) onCompleteStage(1, updated);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 3000);
  };

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Tahap 1: Orientasi Masalah & Perumusan Hipotesis Ilmiah"
        subtitle="Sintaks PjBL 1 • Menelaah Fenomena Kontekstual Sifat Koligatif Larutan"
      >
        {/* Banner Penjelasan */}
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🔍</span>
            <strong style={{ fontSize: '1.08rem', color: '#0369A1' }}>
              Penyelidikan Fenomena Dunia Nyata
            </strong>
          </div>
          <p style={{ margin: 0, color: '#1E293B', fontSize: '0.96rem', lineHeight: 1.6 }}>
            Dalam kehidupan sehari-hari, kita sering menjumpai fenomena di mana es batu dicampur dengan garam
            untuk membekukan adonan es krim atau mencairkan salju di jalan raya. Mengapa hal tersebut bisa terjadi?
            Pilihlah salah satu skenario berikut untuk menjadi fokus investigasimu bersama kelompok!
          </p>
        </div>

        {/* 1. Pemilihan Skenario Kasus */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#0F172A', fontSize: '1.05rem' }}>
            1. Pilih Skenario Masalah yang Ingin Kamu Investigasi:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1rem' }}>
            {/* Skenario A: Es Puter */}
            <div
              onClick={() => setSelectedScenario('es-puter')}
              style={{
                padding: '1.15rem',
                borderRadius: '14px',
                border: `2px solid ${selectedScenario === 'es-puter' ? '#0284C7' : '#E2E8F0'}`,
                background: selectedScenario === 'es-puter' ? '#F0F9FF' : '#FFFFFF',
                boxShadow: selectedScenario === 'es-puter' ? '0 4px 14px rgba(2, 132, 199, 0.15)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1.02rem', color: '#0F172A' }}>
                  🍦 Kasus A: Rahasia Pembuatan Es Puter Tradisional
                </strong>
                <input
                  type="radio"
                  name="scenario"
                  checked={selectedScenario === 'es-puter'}
                  onChange={() => setSelectedScenario('es-puter')}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569', lineHeight: 1.55 }}>
                Pedagang es puter memutar tabung logam berisi santan di tengah timbunan es batu yang ditaburi garam krosok kasar.
                Meskipun es batu mencair dengan cepat, cairan air es tersebut suhunya anjlok hingga <strong>-5°C sampai -10°C</strong>,
                sehingga adonan santan di dalam tabung dapat membeku menjadi es krim padat tanpa freezer listrik.
              </p>
            </div>

            {/* Skenario B: Garam di Jalan Salju */}
            <div
              onClick={() => setSelectedScenario('garam-salju')}
              style={{
                padding: '1.15rem',
                borderRadius: '14px',
                border: `2px solid ${selectedScenario === 'garam-salju' ? '#0284C7' : '#E2E8F0'}`,
                background: selectedScenario === 'garam-salju' ? '#F0F9FF' : '#FFFFFF',
                boxShadow: selectedScenario === 'garam-salju' ? '0 4px 14px rgba(2, 132, 199, 0.15)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '1.02rem', color: '#0F172A' }}>
                  ❄️ Kasus B: Penaburan Garam di Jalan Raya Bersalju
                </strong>
                <input
                  type="radio"
                  name="scenario"
                  checked={selectedScenario === 'garam-salju'}
                  onChange={() => setSelectedScenario('garam-salju')}
                  style={{ cursor: 'pointer' }}
                />
              </div>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#475569', lineHeight: 1.55 }}>
                Di negara beriklim dingin, truk perawatan jalan raya menaburkan garam batu (NaCl atau CaCl₂) ke permukaan jalan
                yang tertutup salju dan es tebal. Akibatnya, salju mencair meskipun suhu udara di sekitarnya masih berada di bawah 0°C,
                sehingga jalan raya tidak licin dan aman dilalui kendaraan.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Rumusan Masalah Penelitian */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '0.35rem' }}>
            2. Rumusan Pertanyaan Masalah:
          </label>
          <input
            type="text"
            value={researchQuestion}
            onChange={(e) => setResearchQuestion(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.95rem',
              fontFamily: "'Times New Roman', Times, serif",
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* 3. Perumusan Hipotesis Ilmiah */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <label style={{ fontWeight: 700, fontSize: '1rem', color: '#0F172A' }}>
              3. Rumuskan Hipotesis Penelitianmu:
            </label>
            <button
              type="button"
              onClick={handleApplyTemplate}
              style={{
                background: '#EFF6FF',
                border: '1px solid #BAE6FD',
                borderRadius: '8px',
                color: '#0284C7',
                fontSize: '0.82rem',
                fontWeight: 700,
                padding: '0.3rem 0.75rem',
                cursor: 'pointer'
              }}
            >
              💡 Beri Contoh Rumusan Hipotesis
            </button>
          </div>

          <p style={{ margin: '0 0 0.65rem 0', fontSize: '0.88rem', color: '#64748B' }}>
            Hipotesis yang baik menghubungkan variabel bebas (jenis zat terlarut & molalitas) dengan variabel terikat (penurunan titik beku $\Delta T_f$ & suhu plateau).
          </p>

          <textarea
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="Tuliskan hipotesismu di sini. Contoh: Jika konsentrasi larutan gula dan garam dinaikkan, maka titik beku larutan akan semakin turun di bawah 0°C, dan larutan garam (elektrolit) mengalami penurunan titik beku dua kali lebih besar daripada larutan gula karena garam terionisasi (faktor i ≈ 2)..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '12px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.96rem',
              fontFamily: "'Times New Roman', Times, serif",
              lineHeight: 1.55,
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Action Button & Status */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '1.15rem',
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
              {isCompleted ? '✓ Simpan Perubahan Hipotesis' : '✓ Simpan & Selesaikan Tahap 1 (+15 XP) →'}
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
