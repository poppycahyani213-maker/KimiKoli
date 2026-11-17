import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import skemaArduino from '../../../assets/skema-rangkaian-arduino.png';

/**
 * Tahap 2: Rancang Percobaan (Fase 2, Bagian Rancangan LKPD)
 *
 * Komponen mencakup:
 * 1. Tantangan Tim Teknisi Laboratorium
 * 2. Aktivitas 2.1: Tabel Enam Bagian Sistem & Keputusan Kelompok
 * 3. Skema Rangkaian Arduino UNO + DS18B20 + Pull-up resistor (dengan modal/pop-up viewer)
 * 4. Kalkulator Persiapan Sampel Larutan (Mr, molalitas, massa pelarut, neraca 0.1g, & molalitas aktual)
 */

const SYSTEM_PARTS = [
  {
    id: 'sensor',
    part: 'Rangkaian Sensor',
    icon: '🔌',
    task: 'Rakit DS18B20 + resistor 4,7 kΩ ke Arduino, upload kode, kalibrasi di air es',
    testMethod: 'Sensor membaca sekitar 0 °C di air es; catat nilai koreksinya',
    defaultDecision: 'Menggunakan pin digital D2 Arduino, resistor 4,7 kΩ di antara pin Data dan 5V VCC, serta kalibrasi awal pada air es batu.',
    hasSchematicButton: true
  },
  {
    id: 'container',
    part: 'Wadah Sampel',
    icon: '🧪',
    task: 'Pilih ukuran tabung/gelas dan volume sampel',
    testMethod: 'Bandingkan kerapian kurva dua ukuran wadah',
    defaultDecision: 'Menggunakan tabung reaksi kaca tipis dengan volume 25 mL agar transfer panas pendinginan berlangsung merata.'
  },
  {
    id: 'probeHolder',
    part: 'Penahan Probe',
    icon: '📎',
    task: 'Buat penjepit agar probe tepat di tengah dan tidak menyentuh dinding/dasar',
    testMethod: 'Posisi probe sama setiap ulangan',
    defaultDecision: 'Memakai sumbat gabus berlubang di mulut tabung reaksi agar ujung logam sensor menggantung tepat di pusat cairan.'
  },
  {
    id: 'stirrer',
    part: 'Pengaduk',
    icon: '🥄',
    task: 'Rancang cara mengaduk yang konsisten (kecepatan dan pola)',
    testMethod: 'Kurva tidak bergerigi',
    defaultDecision: 'Pengadukan vertikal perlahan 1 ketukan tiap 2 detik menggunakan kawat pengaduk berujung melingkar tanpa menyenggol probe.'
  },
  {
    id: 'coolingBath',
    part: 'Penangas Pendingin',
    icon: '🧊',
    task: 'Tentukan perbandingan es : garam',
    testMethod: 'Suhu penangas stabil di bawah -8 °C',
    defaultDecision: 'Perbandingan massa es batu hancur : garam kasar sekitar 3 : 1 dalam gelas beker 500 mL yang dibalut isolator kain.'
  },
  {
    id: 'electronicShield',
    part: 'Pelindung Elektronik',
    icon: '🛡️',
    task: 'Lindungi Arduino dan sambungan dari percikan air garam',
    testMethod: 'Tidak ada kabel basah',
    defaultDecision: 'Papan Arduino dan breadboard diletakkan di dalam kotak plastik berjarak 30 cm dari wadah pendingin es-garam.'
  }
];

export default function Stage2Design({
  data = {},
  onSave,
  isCompleted = false,
  onCompleteStage,
  onNextStage,
  onPrevStage
}) {
  // === 2. Keputusan Kelompok untuk 6 Bagian Sistem ===
  const [decisions, setDecisions] = useState(() => {
    const initial = {};
    SYSTEM_PARTS.forEach((p) => {
      initial[p.id] = data.decisions?.[p.id] || p.defaultDecision;
    });
    return initial;
  });

  // Modal / expand skema rangkaian
  const [showSchematicModal, setShowSchematicModal] = useState(false);

  // === 4. Kalkulator Persiapan Sampel ===
  const [soluteType, setSoluteType] = useState(data.soluteType || 'sugar'); // 'sugar' | 'salt' | 'custom'
  const [customMr, setCustomMr] = useState(data.customMr || 60);
  const [targetMolality, setTargetMolality] = useState(data.targetMolality ?? 1.0);
  const [solventMassGram, setSolventMassGram] = useState(data.solventMassGram ?? 25.0);
  const [weighedMass, setWeighedMass] = useState(data.weighedMass ?? '');

  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Nilai Mr zat
  const mrValue = soluteType === 'sugar' ? 342 : (soluteType === 'salt' ? 58.5 : Number(customMr) || 1);
  const soluteNameLabel = soluteType === 'sugar' ? 'Gula (Sukrosa, C₁₂H₂₂O₁₁)' : (soluteType === 'salt' ? 'Garam Dapur (NaCl)' : 'Zat Kustom');

  // Perhitungan massa zat terlarut teoretis:
  // massa = m * (massa pelarut / 1000) * Mr
  const theoreticalSoluteMass = Number(targetMolality) * (Number(solventMassGram) / 1000) * mrValue;

  // Perhitungan molalitas aktual dari massa yang ditimbang:
  // m_aktual = (massa_timbang / Mr) * (1000 / massa_pelarut)
  const actualMolality = (weighedMass !== '' && !isNaN(Number(weighedMass)) && Number(solventMassGram) > 0)
    ? (Number(weighedMass) / mrValue) * (1000 / Number(solventMassGram))
    : null;

  // Handler update keputusan bagian sistem
  const handleDecisionChange = (id, value) => {
    setDecisions((prev) => ({ ...prev, [id]: value }));
  };

  // Simpan progres draf
  const handleSaveProgress = () => {
    const currentData = {
      decisions,
      soluteType,
      customMr: Number(customMr),
      targetMolality: Number(targetMolality),
      solventMassGram: Number(solventMassGram),
      weighedMass: weighedMass !== '' ? Number(weighedMass) : null,
      theoreticalSoluteMass,
      actualMolality
    };
    if (onSave) onSave(currentData);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  // Selesaikan Tahap 2
  const handleCompleteStage2 = () => {
    // Validasi bahwa 6 keputusan telah terisi
    const hasEmptyDecision = SYSTEM_PARTS.some((p) => !decisions[p.id] || !decisions[p.id].trim());
    if (hasEmptyDecision) {
      alert('⚠️ Mohon lengkapi keputusan kelompok untuk seluruh 6 bagian sistem rancangan percobaan.');
      return;
    }

    const finalData = {
      decisions,
      soluteType,
      customMr: Number(customMr),
      targetMolality: Number(targetMolality),
      solventMassGram: Number(solventMassGram),
      weighedMass: weighedMass !== '' ? Number(weighedMass) : null,
      theoreticalSoluteMass,
      actualMolality,
      designCompleted: true
    };

    if (onSave) onSave(finalData);
    if (onCompleteStage) onCompleteStage(2, finalData);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 3000);
  };

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Tahap 2: Rancang Percobaan & Persiapan Sistem Praktik (Fase 2)"
        subtitle="Sintaks PjBL 2 • Merancang Enam Bagian Sistem Laboratorium & Menghitung Massa Sampel"
      >
        {/* ============================================================== */}
        {/* 1. Tantangan Tim Teknisi Laboratorium                          */}
        {/* ============================================================== */}
        <div style={{
          background: 'linear-gradient(135deg, #0284C7, #0369A1)',
          color: '#FFFFFF',
          borderRadius: '14px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 6px 18px rgba(2, 132, 199, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <span style={{ fontSize: '2.4rem' }}>🛠️</span>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9, fontWeight: 700 }}>
              Tantangan Rekayasa Laboratorium
            </div>
            <strong style={{ fontSize: '1.15rem', display: 'block', margin: '0.2rem 0' }}>
              &ldquo;Kamu adalah tim teknisi laboratorium. Tugasmu: bangun sistem yang menghasilkan kurva pendinginan paling bersih dan paling bisa diulang.&rdquo;
            </strong>
            <p style={{ margin: 0, fontSize: '0.88rem', opacity: 0.95 }}>
              Ketelitian dalam merakit sensor, memilih wadah, dan mengaduk secara konsisten akan menentukan kejelasan plateau titik beku pada grafik.
            </p>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 2. Aktivitas 2.1: Tabel Enam Bagian Sistem                     */}
        {/* ============================================================== */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>📋</span>
              <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>
                Aktivitas 2.1: Keputusan Desain Enam Bagian Sistem Praktikum
              </strong>
            </div>
          </div>

          <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: '#64748B' }}>
            Diskusikan bersama kelompok dan tentukan keputusan desain untuk tiap bagian sistem agar data kurva pendinginan yang diperoleh minim gangguan (noise).
          </p>

          {/* Tabel Sistem (Responsive Scrollable) */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '680px', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#E0F2FE', color: '#0369A1' }}>
                  <th style={{ padding: '0.75rem 0.85rem', borderBottom: '2px solid #BAE6FD', width: '22%' }}>Bagian Sistem</th>
                  <th style={{ padding: '0.75rem 0.85rem', borderBottom: '2px solid #BAE6FD', width: '28%' }}>Tugas Desain</th>
                  <th style={{ padding: '0.75rem 0.85rem', borderBottom: '2px solid #BAE6FD', width: '22%' }}>Cara Menguji</th>
                  <th style={{ padding: '0.75rem 0.85rem', borderBottom: '2px solid #BAE6FD', width: '28%' }}>Keputusan Kelompok Kami</th>
                </tr>
              </thead>
              <tbody>
                {SYSTEM_PARTS.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#FAFCFF' : '#FFFFFF' }}>
                    <td style={{ padding: '0.75rem 0.85rem', verticalAlign: 'top' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0F172A' }}>
                        <span>{item.icon}</span>
                        <span>{item.part}</span>
                      </div>
                      {item.hasSchematicButton && (
                        <button
                          type="button"
                          onClick={() => setShowSchematicModal(!showSchematicModal)}
                          style={{
                            marginTop: '0.5rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            background: '#EFF6FF',
                            border: '1.5px solid #0284C7',
                            color: '#0284C7',
                            padding: '0.35rem 0.65rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          <span>🔍 Lihat Skema Rangkaian</span>
                        </button>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', verticalAlign: 'top', color: '#334155', lineHeight: 1.45 }}>
                      {item.task}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', verticalAlign: 'top', color: '#475569', fontStyle: 'italic', lineHeight: 1.45 }}>
                      {item.testMethod}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', verticalAlign: 'top' }}>
                      <textarea
                        rows={3}
                        value={decisions[item.id] || ''}
                        onChange={(e) => handleDecisionChange(item.id, e.target.value)}
                        placeholder={`Tuliskan keputusan kelompok mengenai ${item.part.toLowerCase()}...`}
                        style={{
                          width: '100%',
                          padding: '0.5rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid #CBD5E1',
                          fontSize: '0.85rem',
                          fontFamily: "'Times New Roman', Times, serif",
                          resize: 'vertical',
                          boxSizing: 'border-box'
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal / Panel Pratinjau Skema Arduino */}
          {showSchematicModal && (
            <div style={{
              marginTop: '1.25rem',
              background: '#F8FAFC',
              border: '2px solid #0284C7',
              borderRadius: '12px',
              padding: '1.25rem',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <strong style={{ fontSize: '1rem', color: '#0369A1' }}>
                  📐 Skema Rangkaian Sensor Suhu DS18B20 + Arduino UNO
                </strong>
                <button
                  type="button"
                  onClick={() => setShowSchematicModal(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    fontSize: '1.2rem',
                    color: '#64748B',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✕ Tutup
                </button>
              </div>

              <div style={{ textAlign: 'center', background: '#FFFFFF', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <img
                  src={skemaArduino}
                  alt="Skema Rangkaian Arduino UNO dan Sensor DS18B20"
                  style={{ maxWidth: '100%', maxHeight: '420px', height: 'auto', borderRadius: '6px' }}
                />
              </div>

              {/* Keterangan pin kabel */}
              <div style={{ marginTop: '0.85rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', fontSize: '0.84rem' }}>
                <div style={{ background: '#FEE2E2', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #FECACA', color: '#991B1B' }}>
                  <strong>Kabel Merah:</strong> VCC (5V Arduino)
                </div>
                <div style={{ background: '#F1F5F9', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #CBD5E1', color: '#0F172A' }}>
                  <strong>Kabel Hitam:</strong> GND (Ground Arduino)
                </div>
                <div style={{ background: '#FEF9C3', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #FDE047', color: '#854D0E' }}>
                  <strong>Kabel Kuning:</strong> Data pin (Digital Pin 2)
                </div>
                <div style={{ background: '#EDE9FE', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #DDD6FE', color: '#5B21B6' }}>
                  <strong>Resistor 4,7 kΩ:</strong> Pull-up (antara Data & 5V)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 4. Kalkulator Persiapan Sampel Larutan                         */}
        {/* ============================================================== */}
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>⚖️</span>
            <strong style={{ fontSize: '1.05rem', color: '#0369A1' }}>
              4. Kalkulator Persiapan Sampel Larutan (Neraca Teknis 0,1 g)
            </strong>
          </div>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
            Gunakan kalkulator ini untuk menghitung massa zat terlarut yang harus ditimbang sebelum dilarutkan ke dalam pelarut air.
            Rumus: <strong>massa zat = m × (massa pelarut / 1000) × Mr</strong>.
          </p>

          {/* Form Input Kalkulator */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            {/* Pilihan Zat */}
            <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.86rem', color: '#1E293B', marginBottom: '0.35rem' }}>
                Zat Terlarut:
              </label>
              <select
                value={soluteType}
                onChange={(e) => setSoluteType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.88rem',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                <option value="sugar">Gula Sukrosa (Mr = 342 g/mol)</option>
                <option value="salt">Garam NaCl (Mr = 58,5 g/mol)</option>
                <option value="custom">Zat Lain (Input Mr Manual)</option>
              </select>

              {soluteType === 'custom' && (
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748B' }}>Massa Molar (Mr, g/mol):</label>
                  <input
                    type="number"
                    value={customMr}
                    onChange={(e) => setCustomMr(e.target.value)}
                    style={{ width: '100%', padding: '0.35rem', borderRadius: '4px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>
              )}
            </div>

            {/* Target Molalitas (m) */}
            <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.86rem', color: '#1E293B', marginBottom: '0.35rem' }}>
                Molalitas Target (m, mol/kg):
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="5.0"
                value={targetMolality}
                onChange={(e) => setTargetMolality(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.88rem',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              />
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Standar LKPD: 1,0 m</span>
            </div>

            {/* Massa Pelarut Air (gram) */}
            <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.86rem', color: '#1E293B', marginBottom: '0.35rem' }}>
                Massa Pelarut Air (g):
              </label>
              <input
                type="number"
                step="0.5"
                min="5"
                max="500"
                value={solventMassGram}
                onChange={(e) => setSolventMassGram(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.88rem',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              />
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Bawaan: 25,0 gram</span>
            </div>
          </div>

          {/* Kotak Langkah Perhitungan & Output Massa Teoretis */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #BAE6FD',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <strong style={{ fontSize: '0.92rem', color: '#0369A1', display: 'block', marginBottom: '0.4rem' }}>
              Langkah Perhitungan Massa Zat Terlarut:
            </strong>
            <div style={{
              background: '#F8FAFC',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.88rem',
              color: '#0F172A',
              marginBottom: '0.75rem',
              lineHeight: 1.6
            }}>
              <div>massa zat = m × (massa pelarut / 1000) × Mr</div>
              <div>massa zat = {targetMolality} × ({solventMassGram} / 1000) × {mrValue}</div>
              <div style={{ fontWeight: 800, color: '#0284C7' }}>
                massa zat = {theoreticalSoluteMass.toFixed(2)} gram
                {soluteType === 'sugar' && targetMolality === 1 && solventMassGram === 25 && ' (≈ 8,6 g)'}
                {soluteType === 'salt' && targetMolality === 1 && solventMassGram === 25 && ' (≈ 1,46 g)'}
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#475569' }}>
              💡 <em>Catatan:</em> Untuk <strong>{soluteNameLabel}</strong> pada konsentrasi <strong>{targetMolality} m</strong> dan <strong>{solventMassGram} g air</strong>,
              timbanglah sebanyak <strong>{theoreticalSoluteMass.toFixed(2)} g</strong> pada neraca.
            </div>
          </div>

          {/* Kolom Massa yang Ditimbang di Neraca 0,1 g & Molalitas Sebenarnya */}
          <div style={{
            background: '#F0FDF4',
            border: '1.5px solid #BBF7D0',
            borderRadius: '10px',
            padding: '1rem'
          }}>
            <strong style={{ fontSize: '0.92rem', color: '#15803D', display: 'block', marginBottom: '0.4rem' }}>
              Pencatatan Penimbangan Nyata (Neraca 0,1 g):
            </strong>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', color: '#166534', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Massa yang Ditimbang (gram):
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder={theoreticalSoluteMass.toFixed(1)}
                  value={weighedMass}
                  onChange={(e) => setWeighedMass(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1.5px solid #86EFAC',
                    fontSize: '0.92rem',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
                <span style={{ fontSize: '0.78rem', color: '#4B5563' }}>Ketikkan massa riil hasil timbangan</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', color: '#166534', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Molalitas Sebenarnya (Aktual):
                </label>
                <div style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  background: '#FFFFFF',
                  border: '1.5px solid #86EFAC',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  color: '#15803D'
                }}>
                  {actualMolality !== null ? `${actualMolality.toFixed(3)} m` : '- m'}
                </div>
                <span style={{ fontSize: '0.78rem', color: '#4B5563' }}>m = (massa ditimbang / Mr) × (1000 / {solventMassGram})</span>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Footer Navigasi & Simpan                                       */}
        {/* ============================================================== */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '1.15rem',
          borderTop: '1px solid #E2E8F0'
        }}>
          {onPrevStage && (
            <Button
              variant="secondary"
              onClick={onPrevStage}
              style={{ padding: '0.65rem 1.15rem', fontSize: '0.92rem' }}
            >
              ← Kembali ke Tahap 1
            </Button>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isSavedFeedback && (
              <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}>
                ✓ Rancangan & kalkulasi berhasil disimpan (+15 XP)
              </span>
            )}
            {isCompleted && !isSavedFeedback && (
              <span style={{ color: '#059669', fontSize: '0.9rem', fontWeight: 600 }}>
                ✓ Tahap 2 telah selesai (+15 XP diraih)
              </span>
            )}

            <Button
              variant="secondary"
              onClick={handleSaveProgress}
              style={{ padding: '0.65rem 1rem', fontSize: '0.92rem' }}
            >
              💾 Simpan Draf
            </Button>

            <Button
              variant="primary"
              onClick={handleCompleteStage2}
              style={{
                padding: '0.75rem 1.4rem',
                fontSize: '0.98rem',
                fontWeight: 700,
                background: '#0284C7'
              }}
            >
              {isCompleted ? '✓ Simpan Perubahan Tahap 2' : '✓ Selesaikan Tahap 2 (+15 XP) →'}
            </Button>

            {isCompleted && onNextStage && (
              <Button
                variant="secondary"
                onClick={onNextStage}
                style={{ padding: '0.75rem 1.25rem', fontSize: '0.98rem' }}
              >
                Lanjut ke Tahap 3 →
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
