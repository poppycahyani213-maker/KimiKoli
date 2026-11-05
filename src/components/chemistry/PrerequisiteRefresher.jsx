import React, { useState } from 'react';

/**
 * Komponen PrerequisiteRefresher
 * 
 * Modul Penyegar Singkat Prasyarat:
 * - Molalitas (m), Molaritas (M), dan Fraksi Mol (X)
 * - Disertai 3 soal latihan interaktif dengan umpan balik langsung
 */
export default function PrerequisiteRefresher({ isOpenDefault = false }) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState({});

  const questions = [
    {
      id: 1,
      q: "Sebanyak 18 gram glukosa (Mr = 180) dilarutkan dalam 500 gram air. Berapakah molalitas (m) larutan tersebut?",
      options: [
        { key: "A", text: "0,1 m" },
        { key: "B", text: "0,2 m" },
        { key: "C", text: "0,4 m" },
        { key: "D", text: "0,5 m" }
      ],
      correct: "B",
      explanation: "mol glukosa = 18 / 180 = 0,1 mol. Massa pelarut p = 500 g = 0,5 kg. Molalitas m = 0,1 mol / 0,5 kg = 0,2 m (atau m = (18/180) × (1000/500) = 0,1 × 2 = 0,2 m)."
    },
    {
      id: 2,
      q: "Jika 1 mol zat terlarut dicampurkan dengan 4 mol air pelarut, berapakah fraksi mol zat terlarut (Xt) dan fraksi mol pelarut (Xp)?",
      options: [
        { key: "A", text: "Xt = 0,20 dan Xp = 0,80" },
        { key: "B", text: "Xt = 0,25 dan Xp = 0,75" },
        { key: "C", text: "Xt = 0,50 dan Xp = 0,50" },
        { key: "D", text: "Xt = 0,80 dan Xp = 0,20" }
      ],
      correct: "A",
      explanation: "Total mol = 1 + 4 = 5 mol. Xt = nt / ntotal = 1 / 5 = 0,20. Xp = np / ntotal = 4 / 5 = 0,80. Ingat bahwa Xt + Xp selalu bernilai 1."
    },
    {
      id: 3,
      q: "Mengapa perhitungan kenaikan titik didih dan penurunan titik beku menggunakan satuan Molalitas (m), bukan Molaritas (M)?",
      options: [
        { key: "A", text: "Molaritas terlalu sulit dihitung rumusnya" },
        { key: "B", text: "Volume larutan pada Molaritas memuai/berubah saat dipanaskan atau didinginkan, sedangkan massa pelarut pada Molalitas tetap konstan" },
        { key: "C", text: "Molalitas hanya berlaku khusus untuk air dan tidak bisa untuk pelarut lain" },
        { key: "D", text: "Molaritas hanya digunakan untuk gas dan bukan zat cair" }
      ],
      correct: "B",
      explanation: "Tepat sekali! Molaritas (M = mol/Liter) bergantung pada volume larutan yang dapat memuai pada suhu tinggi atau menyusut pada suhu rendah. Sebaliknya, Molalitas (m = mol/kg pelarut) berbasis massa yang nilainya tidak terpengaruh oleh suhu."
    }
  ];

  const handleSelect = (qId, key) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: key }));
    setShowFeedback(prev => ({ ...prev, [qId]: true }));
  };

  return (
    <div style={{
      background: '#F0F9FF',
      border: '1.5px solid #7DD3FC',
      borderRadius: '16px',
      padding: '1.25rem',
      marginBottom: '1.75rem',
      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.08)',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🧠</span>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Modul Penyegar Prasyarat
            </span>
            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              Molaritas, Molalitas, & Fraksi Mol
            </h4>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            padding: '0.45rem 1rem',
            border: '1.5px solid #0284C7',
            background: isOpen ? '#0284C7' : '#FFFFFF',
            color: isOpen ? '#FFFFFF' : '#0284C7',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: "'Times New Roman', Times, serif"
          }}
        >
          {isOpen ? '▲ Sembunyikan Penyegar' : '▼ Buka Ringkasan & 3 Latihan Soal'}
        </button>
      </div>

      {isOpen && (
        <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid #BAE6FD' }}>
          {/* Ringkasan 3 Konsep Konsentrasi */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#FFFFFF', padding: '0.9rem', borderRadius: '12px', border: '1px solid #E0F2FE' }}>
              <div style={{ fontWeight: 800, color: '#0284C7', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                1. Molaritas (M)
              </div>
              <div style={{ fontSize: '0.88rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.25rem' }}>
                M = n / V (Liter)
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B', lineHeight: 1.45 }}>
                Jumlah mol zat terlarut per 1 Liter volume larutan total. Digunakan pada rumus Tekanan Osmotik (Π = M·R·T·i).
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '0.9rem', borderRadius: '12px', border: '1px solid #E0F2FE' }}>
              <div style={{ fontWeight: 800, color: '#0284C7', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                2. Molalitas (m)
              </div>
              <div style={{ fontSize: '0.88rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.25rem' }}>
                m = (massa/Mr) × (1000/p)
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B', lineHeight: 1.45 }}>
                Jumlah mol terlarut per 1000 gram (1 kg) massa pelarut. Digunakan pada Titik Didih (ΔTb) dan Titik Beku (ΔTf).
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '0.9rem', borderRadius: '12px', border: '1px solid #E0F2FE' }}>
              <div style={{ fontWeight: 800, color: '#0284C7', fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                3. Fraksi Mol (X)
              </div>
              <div style={{ fontSize: '0.88rem', color: '#0F172A', fontWeight: 700, marginBottom: '0.25rem' }}>
                Xt = nt / (nt + np)
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748B', lineHeight: 1.45 }}>
                Perbandingan jumlah mol zat terhadap mol total dalam larutan. Digunakan pada Hukum Raoult Tekanan Uap (ΔP = Xt·P°).
              </p>
            </div>
          </div>

          {/* 3 Soal Latihan Interaktif */}
          <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '14px', border: '1px solid #BAE6FD' }}>
            <h5 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
              📝 3 Soal Cek Pemahaman Prasyarat
            </h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {questions.map((q, index) => {
                const userAns = selectedAnswers[q.id];
                const isAnswered = showFeedback[q.id];
                const isCorrect = userAns === q.correct;

                return (
                  <div key={q.id} style={{ borderBottom: index < questions.length - 1 ? '1px solid #F1F5F9' : 'none', paddingBottom: '1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1E293B', marginBottom: '0.65rem' }}>
                      {q.id}. {q.q}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {q.options.map(opt => {
                        const isChosen = userAns === opt.key;
                        let btnBg = '#F8FAFC';
                        let btnBorder = '#E2E8F0';
                        let btnColor = '#334155';

                        if (isAnswered) {
                          if (opt.key === q.correct) {
                            btnBg = '#DCFCE7';
                            btnBorder = '#10B981';
                            btnColor = '#065F46';
                          } else if (isChosen) {
                            btnBg = '#FEE2E2';
                            btnBorder = '#EF4444';
                            btnColor = '#991B1B';
                          }
                        }

                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() => handleSelect(q.id, opt.key)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              borderRadius: '8px',
                              border: `1.5px solid ${btnBorder}`,
                              background: btnBg,
                              color: btnColor,
                              textAlign: 'left',
                              fontSize: '0.85rem',
                              fontWeight: isChosen ? 700 : 500,
                              cursor: 'pointer',
                              fontFamily: "'Times New Roman', Times, serif"
                            }}
                          >
                            <strong>{opt.key}.</strong> {opt.text}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: '8px',
                        background: isCorrect ? '#ECFDF5' : '#FFFBEB',
                        border: `1px solid ${isCorrect ? '#A7F3D0' : '#FCD34D'}`,
                        fontSize: '0.85rem',
                        color: isCorrect ? '#065F46' : '#92400E',
                        marginTop: '0.5rem'
                      }}>
                        <strong>{isCorrect ? '✓ Benar! ' : '💡 Pembahasan: '}</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
