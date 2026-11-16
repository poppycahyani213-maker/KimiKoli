import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';

// ── Kunci penyimpanan per siswa berbasis nama dan kelas (pola identik Fase 2 & Bab 1) ──
export function getCh3ResultsKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch3_results_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch3_results_v1_guest';
}

// ── Helper parsing angka Indonesia & toleransi ±0,05 ─────────────────────────
function parseIndoNumber(str) {
  if (typeof str !== 'string') return NaN;
  const cleaned = str.trim().replace(',', '.');
  if (cleaned === '' || isNaN(Number(cleaned))) return NaN;
  return Number(cleaned);
}

function checkTol(userInput, target, tol = 0.05) {
  if (userInput === undefined || userInput === null || userInput.trim() === '') {
    return null; // belum diisi
  }
  const val = parseIndoNumber(userInput);
  if (isNaN(val)) return false;
  return Math.abs(val - target) <= tol;
}

// Data baris pengamatan (kunci hanya untuk evaluasi internal, tidak pernah ditampilkan)
const DATA_ROWS = [
  { m: 0,   targetTf: 0,     targetDeltaTf: 0,    isExample: true },
  { m: 0.5, targetTf: -0.93, targetDeltaTf: 0.93, isExample: false },
  { m: 1.0, targetTf: -1.86, targetDeltaTf: 1.86, isExample: false },
  { m: 2.0, targetTf: -3.72, targetDeltaTf: 3.72, isExample: false },
];

const ANALYSIS_OPTIONS = [
  { id: 'A', text: 'Berbanding lurus' },
  { id: 'B', text: 'Berbanding terbalik' },
  { id: 'C', text: 'Tidak berhubungan' },
  { id: 'D', text: 'Naik lalu turun' },
];

export default function SajikanHasil() {
  // State tabel: baris 0 m terisi contoh (0 dan 0), baris lain dimulai kosong
  const [tableInputs, setTableInputs] = useState({
    row_0:   { tf: '0', deltaTf: '0' },
    row_0_5: { tf: '', deltaTf: '' },
    row_1_0: { tf: '', deltaTf: '' },
    row_2_0: { tf: '', deltaTf: '' },
  });

  // State analisis (pilihan ganda)
  const [selectedAnalysis, setSelectedAnalysis] = useState('');
  const [analysisSubmitted, setAnalysisSubmitted] = useState(false);

  // State kesimpulan
  const [conclusion, setConclusion] = useState('');
  const [conclusionSubmitted, setConclusionSubmitted] = useState(false);

  // Status tersimpan
  const [isSaved, setIsSaved] = useState(false);

  // Muat data yang pernah disimpan sebelumnya
  useEffect(() => {
    const key = getCh3ResultsKey();
    const existing = getStoredData(key, null);
    if (existing) {
      if (existing.tableInputs) {
        setTableInputs({
          row_0: { tf: '0', deltaTf: '0' },
          row_0_5: {
            tf: existing.tableInputs.row_0_5?.tf || '',
            deltaTf: existing.tableInputs.row_0_5?.deltaTf || '',
          },
          row_1_0: {
            tf: existing.tableInputs.row_1_0?.tf || '',
            deltaTf: existing.tableInputs.row_1_0?.deltaTf || '',
          },
          row_2_0: {
            tf: existing.tableInputs.row_2_0?.tf || '',
            deltaTf: existing.tableInputs.row_2_0?.deltaTf || '',
          },
        });
      }
      if (existing.selectedAnalysis) {
        setSelectedAnalysis(existing.selectedAnalysis);
        setAnalysisSubmitted(true);
      }
      if (existing.conclusion) {
        setConclusion(existing.conclusion);
        setConclusionSubmitted(true);
      }
      setIsSaved(true);
    }
  }, []);

  // Update input tabel per sel
  const handleCellChange = (rowKey, field, value) => {
    setTableInputs((prev) => ({
      ...prev,
      [rowKey]: {
        ...prev[rowKey],
        [field]: value,
      },
    }));
    setIsSaved(false);
  };

  // Simpan data ke localStorage
  const saveAllData = () => {
    const payload = {
      tableInputs,
      selectedAnalysis,
      conclusion,
      savedAt: new Date().toISOString(),
    };
    const key = getCh3ResultsKey();
    setStoredData(key, payload);
    setIsSaved(true);
  };

  // Validasi sel tabel
  const isCorrect = (userInput, target) => {
    return checkTol(userInput, target, 0.05);
  };

  const getRowKey = (m) => {
    if (m === 0) return 'row_0';
    if (m === 0.5) return 'row_0_5';
    if (m === 1.0) return 'row_1_0';
    return 'row_2_0';
  };

  // Cek kelengkapan untuk menandai Fase 4 selesai
  const allTableFilledCorrectly = DATA_ROWS.every((r) => {
    const key = getRowKey(r.m);
    const row = tableInputs[key];
    return isCorrect(row.tf, r.targetTf) === true && isCorrect(row.deltaTf, r.targetDeltaTf) === true;
  });

  const isAnalysisCorrect = selectedAnalysis === 'A';
  const isConclusionDone = conclusion.trim().length >= 10 && conclusionSubmitted;
  const isPhase4Complete = allTableFilledCorrectly && isAnalysisCorrect && isConclusionDone;

  // Simpan kesimpulan
  const handleConclusionSubmit = (e) => {
    e.preventDefault();
    if (conclusion.trim().length < 5) {
      alert('Tuliskan kesimpulanmu terlebih dahulu!');
      return;
    }
    setConclusionSubmitted(true);
    const payload = {
      tableInputs,
      selectedAnalysis,
      conclusion,
      savedAt: new Date().toISOString(),
    };
    setStoredData(getCh3ResultsKey(), payload);
    setIsSaved(true);
  };

  // Koordinat SVG Grafik ΔTf terhadap molalitas
  const scaleX = (m) => 55 + (m / 2.5) * 345;
  const scaleY = (dTf) => 195 - (dTf / 4.5) * 170;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: "'Times New Roman', Times, serif" }}>

      {/* ── 1. Tabel Data Pengamatan ────────────────────────────────────────── */}
      <Card
        title="1. Tabel Data Pengamatan"
        subtitle="Gunakan simulasi termometer di Fase 3, lalu catat hasilnya ke dalam tabel berikut"
      >
        <div style={{ overflowX: 'auto', marginTop: '0.5rem' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'center',
            fontSize: '0.95rem',
          }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                <th style={{ padding: '0.75rem 0.5rem', border: '1px solid #CBD5E1', width: '50px' }}>No</th>
                <th style={{ padding: '0.75rem 0.5rem', border: '1px solid #CBD5E1', width: '160px' }}>Molalitas Urea (m)</th>
                <th style={{ padding: '0.75rem 0.5rem', border: '1px solid #CBD5E1' }}>Titik Beku Larutan (Tf) [°C]</th>
                <th style={{ padding: '0.75rem 0.5rem', border: '1px solid #CBD5E1' }}>ΔTf = 0 − Tf [°C]</th>
              </tr>
            </thead>
            <tbody>
              {DATA_ROWS.map((row, idx) => {
                const rKey = getRowKey(row.m);
                const current = tableInputs[rKey];
                const tfStatus = isCorrect(current.tf, row.targetTf);
                const deltaStatus = isCorrect(current.deltaTf, row.targetDeltaTf);

                // Baris contoh: 0 m (air murni) terisi tetap dengan Tf = 0 dan ΔTf = 0
                if (row.isExample) {
                  return (
                    <tr key={row.m} style={{ background: '#F8FAFC' }}>
                      <td style={{ padding: '0.65rem 0.5rem', border: '1px solid #E2E8F0', fontWeight: 700 }}>
                        {idx + 1}
                      </td>
                      <td style={{ padding: '0.65rem 0.5rem', border: '1px solid #E2E8F0' }}>
                        <div style={{ fontWeight: 700, color: '#1E293B' }}>0 m</div>
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                          (contoh)
                        </span>
                      </td>

                      {/* Kolom Tf Contoh */}
                      <td style={{ padding: '0.65rem 0.5rem', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <input
                            type="text"
                            value="0"
                            readOnly
                            style={{
                              width: '135px',
                              textAlign: 'center',
                              padding: '0.4rem 0.5rem',
                              borderRadius: '6px',
                              border: '1.5px solid #10B981',
                              background: '#F0FDF4',
                              fontSize: '0.925rem',
                              fontFamily: 'inherit',
                              color: '#065F46',
                              fontWeight: 700,
                            }}
                          />
                          <span style={{ color: '#10B981', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>
                        </div>
                      </td>

                      {/* Kolom ΔTf Contoh */}
                      <td style={{ padding: '0.65rem 0.5rem', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                          <input
                            type="text"
                            value="0"
                            readOnly
                            style={{
                              width: '135px',
                              textAlign: 'center',
                              padding: '0.4rem 0.5rem',
                              borderRadius: '6px',
                              border: '1.5px solid #10B981',
                              background: '#F0FDF4',
                              fontSize: '0.925rem',
                              fontFamily: 'inherit',
                              color: '#065F46',
                              fontWeight: 700,
                            }}
                          />
                          <span style={{ color: '#10B981', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>
                        </div>
                      </td>
                    </tr>
                  );
                }

                // Baris isian siswa (0,5 m; 1,0 m; 2,0 m)
                return (
                  <tr key={row.m} style={{ background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAFC' }}>
                    <td style={{ padding: '0.65rem 0.5rem', border: '1px solid #E2E8F0', fontWeight: 700 }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', border: '1px solid #E2E8F0', fontWeight: 700 }}>
                      {row.m.toString().replace('.', ',')} m
                    </td>

                    {/* Kolom Tf */}
                    <td style={{ padding: '0.65rem 0.5rem', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="text"
                          value={current.tf}
                          onChange={(e) => handleCellChange(rKey, 'tf', e.target.value)}
                          onBlur={saveAllData}
                          placeholder="isi dari simulasi"
                          style={{
                            width: '135px',
                            textAlign: 'center',
                            padding: '0.4rem 0.5rem',
                            borderRadius: '6px',
                            border: tfStatus === true ? '1.5px solid #10B981' : tfStatus === false ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                            background: tfStatus === true ? '#F0FDF4' : tfStatus === false ? '#FEF2F2' : '#FFFFFF',
                            fontSize: '0.925rem',
                            fontFamily: 'inherit',
                          }}
                        />
                        {tfStatus === true && <span style={{ color: '#10B981', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>}
                        {tfStatus === false && <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem' }}>✗</span>}
                      </div>
                    </td>

                    {/* Kolom ΔTf */}
                    <td style={{ padding: '0.65rem 0.5rem', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="text"
                          value={current.deltaTf}
                          onChange={(e) => handleCellChange(rKey, 'deltaTf', e.target.value)}
                          onBlur={saveAllData}
                          placeholder="isi dari simulasi"
                          style={{
                            width: '135px',
                            textAlign: 'center',
                            padding: '0.4rem 0.5rem',
                            borderRadius: '6px',
                            border: deltaStatus === true ? '1.5px solid #10B981' : deltaStatus === false ? '1.5px solid #EF4444' : '1px solid #CBD5E1',
                            background: deltaStatus === true ? '#F0FDF4' : deltaStatus === false ? '#FEF2F2' : '#FFFFFF',
                            fontSize: '0.925rem',
                            fontFamily: 'inherit',
                          }}
                        />
                        {deltaStatus === true && <span style={{ color: '#10B981', fontWeight: 800, fontSize: '1.1rem' }}>✓</span>}
                        {deltaStatus === false && <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '1.1rem' }}>✗</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{
          marginTop: '0.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.825rem',
          color: '#64748B',
        }}>
          <span>Desimal boleh memakai tanda koma (,) atau titik (.). Toleransi nilai ±0,05 °C.</span>
          {allTableFilledCorrectly ? (
            <span style={{ color: '#166534', fontWeight: 700 }}>✓ Semua isian tabel tepat!</span>
          ) : (
            <span>Isi baris 0,5 m; 1,0 m; dan 2,0 m dengan mengamati simulasi di Fase 3.</span>
          )}
        </div>
      </Card>

      {/* ── 2. Grafik ΔTf terhadap Molalitas ─────────────────────────────────── */}
      <Card
        title="2. Grafik Hubungan ΔTf terhadap Molalitas"
        subtitle="Grafik otomatis memplot titik pengamatan dari isian tabelmu di atas"
      >
        <div style={{ width: '100%', maxWidth: '520px', margin: '0 auto' }}>
          <svg
            viewBox="0 0 460 250"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            role="img"
            aria-label="Grafik hubungan penurunan titik beku delta Tf terhadap molalitas"
          >
            {/* Background grid box */}
            <rect x="55" y="25" width="345" height="170" fill="#F8FAFC" stroke="#E2E8F0" />

            {/* Horizontal Grid Lines (ΔTf = 1, 2, 3, 4 °C) */}
            {[1, 2, 3, 4].map((val) => (
              <g key={`hgrid-${val}`}>
                <line x1="55" y1={scaleY(val)} x2="400" y2={scaleY(val)} stroke="#E2E8F0" strokeDasharray="3 3" />
                <text x="48" y={scaleY(val) + 4} fontSize="10" fill="#64748B" textAnchor="end">
                  {val}
                </text>
              </g>
            ))}

            {/* Vertical Grid Lines (m = 0.5, 1.0, 1.5, 2.0, 2.5 m) */}
            {[0.5, 1.0, 1.5, 2.0, 2.5].map((mVal) => (
              <g key={`vgrid-${mVal}`}>
                <line x1={scaleX(mVal)} y1="25" x2={scaleX(mVal)} y2="195" stroke="#E2E8F0" strokeDasharray="3 3" />
                <text x={scaleX(mVal)} y="210" fontSize="10" fill="#64748B" textAnchor="middle">
                  {mVal.toString().replace('.', ',')}
                </text>
              </g>
            ))}

            {/* Sumbu X & Sumbu Y Utama */}
            <line x1="55" y1="195" x2="405" y2="195" stroke="#334155" strokeWidth="1.8" />
            <line x1="55" y1="200" x2="55" y2="20" stroke="#334155" strokeWidth="1.8" />
            <text x="48" y="198" fontSize="10" fill="#64748B" textAnchor="end">0</text>

            {/* Label Sumbu */}
            <text x="227" y="235" fontSize="11" fontWeight="700" fill="#0F172A" textAnchor="middle">
              Molalitas Larutan, m (mol/kg)
            </text>
            <text
              x="-110"
              y="20"
              fontSize="11"
              fontWeight="700"
              fill="#0F172A"
              textAnchor="middle"
              transform="rotate(-90)"
            >
              ΔTf (°C)
            </text>

            {/* Garis Lurus Teoritis Melalui Titik Nol (ΔTf = Kf × m = 1,86 × m) */}
            <line
              x1={scaleX(0)}
              y1={scaleY(0)}
              x2={scaleX(2.4)}
              y2={scaleY(2.4 * 1.86)}
              stroke="#0284C7"
              strokeWidth="2"
              strokeDasharray="4 3"
            />

            {/* Plot Titik-Titik dari Isian Siswa */}
            {DATA_ROWS.map((row) => {
              const rKey = getRowKey(row.m);
              const rawInput = row.isExample ? '0' : tableInputs[rKey]?.deltaTf;
              const val = parseIndoNumber(rawInput);
              if (isNaN(val) || val < 0 || val > 5) return null;

              const px = scaleX(row.m);
              const py = scaleY(val);
              const correct = isCorrect(rawInput, row.targetDeltaTf);

              return (
                <g key={`point-${row.m}`}>
                  {/* Outer circle halo */}
                  <circle cx={px} cy={py} r="7" fill={correct ? '#10B981' : '#EF4444'} opacity="0.25" />
                  {/* Core dot */}
                  <circle cx={px} cy={py} r="4.5" fill={correct ? '#059669' : '#DC2626'} stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* Point Coordinate Tag */}
                  <text
                    x={px + (row.m === 2.0 ? -10 : 8)}
                    y={py - 8}
                    fontSize="9.5"
                    fontWeight="700"
                    fill={correct ? '#065F46' : '#991B1B'}
                    textAnchor={row.m === 2.0 ? 'end' : 'start'}
                  >
                    ({row.m.toString().replace('.', ',')}; {val.toString().replace('.', ',')})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{
          marginTop: '0.75rem',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#475569',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginRight: '1rem' }}>
            <span style={{ width: '16px', height: '2px', background: '#0284C7', borderTop: '2px dashed #0284C7' }} />
            Garis lurus hubungan teoritis (melalui titik nol)
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
            Titik data pengamatan
          </span>
        </div>
      </Card>

      {/* ── 3. Pertanyaan Analisis (Pilihan Ganda) ─────────────────────────── */}
      <Card
        title="3. Pertanyaan Analisis"
        subtitle="Amati pola tabel dan grafik di atas untuk menjawab hubungan antar variabel"
      >
        <p style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0F172A', marginBottom: '0.85rem' }}>
          Bagaimana hubungan molalitas dengan ΔTf?
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {ANALYSIS_OPTIONS.map((opt) => {
            const isSelected = selectedAnalysis === opt.id;
            return (
              <label
                key={opt.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: isSelected ? '2px solid #0284C7' : '1px solid #CBD5E1',
                  background: isSelected ? '#F0F9FF' : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <input
                  type="radio"
                  name="analysis_option"
                  value={opt.id}
                  checked={isSelected}
                  onChange={(e) => {
                    setSelectedAnalysis(e.target.value);
                    setAnalysisSubmitted(true);
                    setIsSaved(false);
                    // Langsung simpan
                    const payload = {
                      tableInputs,
                      selectedAnalysis: e.target.value,
                      conclusion,
                      savedAt: new Date().toISOString(),
                    };
                    setStoredData(getCh3ResultsKey(), payload);
                  }}
                  style={{ accentColor: '#0284C7', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.975rem', color: '#1E293B' }}>
                  <strong>{opt.id}.</strong> {opt.text}
                </span>
              </label>
            );
          })}
        </div>

        {/* Umpan Balik Singkat */}
        {analysisSubmitted && selectedAnalysis && (
          <div style={{
            marginTop: '1rem',
            padding: '0.85rem 1.15rem',
            borderRadius: '8px',
            fontSize: '0.95rem',
            lineHeight: 1.5,
            background: selectedAnalysis === 'A' ? '#F0FDF4' : '#FEF2F2',
            border: selectedAnalysis === 'A' ? '1px solid #86EFAC' : '1px solid #FCA5A5',
            color: selectedAnalysis === 'A' ? '#166534' : '#991B1B',
          }}>
            {selectedAnalysis === 'A' ? (
              <div>
                <strong>✓ Benar!</strong> Penurunan titik beku (ΔTf) berbanding lurus dengan molalitas larutan. Semakin besar molalitas (konsentrasi partikel terlarut), semakin besar nilai ΔTf, sehingga suhu beku larutan (Tf) semakin turun ke bawah nol.
              </div>
            ) : (
              <div>
                <strong>✗ Belum Tepat.</strong> Perhatikan grafik dan tabel: saat nilai molalitas (m) bertambah besar, nilai ΔTf juga ikut bertambah besar secara linier. Hubungan ini dinamakan <em>berbanding lurus</em>.
              </div>
            )}
          </div>
        )}
      </Card>

      {/* ── 4. Kesimpulan (Isian Bebas) ─────────────────────────────────────── */}
      <Card
        title="4. Kesimpulan Akhir Penyelidikan"
        subtitle="Simpulkan mengapa adonan es puter dapat membeku berdasarkan temuan penyelidikanmu"
      >
        <form onSubmit={handleConclusionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '1rem', color: '#0F172A', marginBottom: '0.5rem' }}>
              Jadi, adonan es puter Pak Darmo bisa membeku karena …
            </label>
            <textarea
              rows={4}
              value={conclusion}
              onChange={(e) => {
                setConclusion(e.target.value);
                setIsSaved(false);
              }}
              placeholder="Tuliskan kesimpulan ilmiahmu di sini mengenai peran garam, titik beku es, dan pembekuan adonan es puter..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                lineHeight: 1.6,
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <Button
              type="submit"
              variant="primary"
              style={{
                padding: '0.65rem 1.4rem',
                fontSize: '0.95rem',
                background: '#0284C7',
              }}
            >
              💾 Simpan Kesimpulan
            </Button>
            {isSaved && (
              <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 700 }}>
                ✓ Isianmu tersimpan otomatis di perangkatmu
              </span>
            )}
          </div>
        </form>

        {/* Contoh Kesimpulan setelah diisi/disimpan */}
        {conclusionSubmitted && conclusion.trim().length > 0 && (
          <div style={{
            marginTop: '1.25rem',
            background: '#F0FDF4',
            border: '1.5px solid #86EFAC',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            color: '#166534',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span style={{ fontSize: '1.1rem' }}>💡</span>
              <strong style={{ fontSize: '0.95rem' }}>Contoh Rumusan Kesimpulan Lengkap:</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic' }}>
              “Garam yang larut dalam lelehan es menurunkan titik beku air, sehingga campuran es-garam bisa mencapai sekitar −8 °C. Campuran sedingin ini menyerap kalor dari adonan di dalam tabung logam, sehingga suhu adonan turun di bawah titik bekunya dan adonan membeku.”
            </p>
          </div>
        )}
      </Card>

      {/* ── 5. Status Penyelesaian Fase 4 ─────────────────────────────────── */}
      {isPhase4Complete ? (
        <div style={{
          background: '#F0FDF4',
          border: '2px solid #86EFAC',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.12)',
        }}>
          <span style={{ fontSize: '2rem' }}>🎉</span>
          <div>
            <h4 style={{ margin: 0, color: '#166534', fontSize: '1.15rem', fontWeight: 800 }}>
              Fase 4 Selesai: Data &amp; Kesimpulan Berhasil Disusun!
            </h4>
            <p style={{ margin: '0.25rem 0 0', color: '#15803D', fontSize: '0.95rem' }}>
              Kamu telah membuktikan hubungan molalitas terhadap penurunan titik beku secara kuantitatif. Lanjutkan ke <strong>Fase 5</strong> di bawah untuk mengevaluasi dugaan awalmu!
            </p>
          </div>
        </div>
      ) : (
        <div style={{
          background: '#F8FAFC',
          border: '1px dashed #CBD5E1',
          borderRadius: '10px',
          padding: '0.85rem 1.25rem',
          fontSize: '0.9rem',
          color: '#64748B',
          textAlign: 'center',
        }}>
          Lengkapi tabel pengamatan dengan benar, jawab pertanyaan analisis, dan simpan kesimpulanmu untuk menuntaskan Fase 4.
        </div>
      )}

    </div>
  );
}
