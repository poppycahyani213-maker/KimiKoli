import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';

// ── Kunci penyimpanan status KPS Bab 3 per siswa ──────────────────────────────
export function getCh3KpsKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch3_kps_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch3_kps_v1_guest';
}

// ── Data 8 Soal KPS Bab 3 ─────────────────────────────────────────────────────
const KPS_QUESTIONS = [
  {
    id: 'kps_q1',
    number: 1,
    kpsIndicator: 'Mengidentifikasi variabel',
    question: 'Siswa melarutkan 0 g, 6 g, 12 g, dan 18 g urea, masing-masing ke dalam 100 g air, lalu mengukur titik bekunya dengan termometer yang sama. Variabel bebas pada percobaan ini adalah …',
    options: [
      { key: 'A', text: 'Massa air yang digunakan' },
      { key: 'B', text: 'Titik beku tiap larutan' },
      { key: 'C', text: 'Massa urea yang dilarutkan' },
      { key: 'D', text: 'Jenis termometer yang dipakai' },
      { key: 'E', text: 'Suhu ruangan saat percobaan' },
    ],
    correctKey: 'C',
    solution: 'Variabel bebas adalah variabel yang sengaja dimanipulasi atau diubah-ubah nilainya oleh peneliti untuk melihat pengaruhnya. Pada percobaan ini, jumlah massa urea diubah-ubah (0 g, 6 g, 12 g, dan 18 g), sedangkan massa air dan jenis termometer dibuat tetap (variabel kontrol). Jadi, massa urea adalah variabel bebas.'
  },
  {
    id: 'kps_q2',
    number: 2,
    kpsIndicator: 'Merumuskan hipotesis',
    question: 'Rumusan masalah: “Bagaimana pengaruh molalitas urea terhadap titik beku larutan?” Hipotesis yang tepat adalah …',
    options: [
      { key: 'A', text: 'Makin besar molalitas urea, makin rendah titik beku larutan' },
      { key: 'B', text: 'Makin besar molalitas urea, makin tinggi titik beku larutan' },
      { key: 'C', text: 'Makin kecil molalitas urea, makin rendah titik beku larutan' },
      { key: 'D', text: 'Molalitas urea sama sekali tidak memengaruhi titik beku larutan' },
      { key: 'E', text: 'Titik beku larutan urea selalu sama dengan titik beku air' },
    ],
    correctKey: 'A',
    solution: 'Hipotesis adalah dugaan ilmiah sementara yang logis. Berdasarkan konsep penurunan titik beku (ΔTf = Kf × m), keberadaan partikel zat terlarut merusak kerapian kisi kristal es pelarut, sehingga semakin besar molalitas larutan, titik beku larutan (Tf = 0 − ΔTf) akan semakin rendah (turun jauh di bawah 0 °C).'
  },
  {
    id: 'kps_q3',
    number: 3,
    kpsIndicator: 'Menginterpretasi data',
    hasTable: true,
    tableData: {
      headers: ['Menit', '0', '2', '4', '6', '8', '10'],
      row: ['Suhu (°C)', '4,00', '1,50', '−0,50', '−0,93', '−0,93', '−0,93']
    },
    question: 'Data pendinginan larutan glukosa disajikan pada tabel di atas. Titik beku larutan tersebut adalah …',
    options: [
      { key: 'A', text: '−1,86 °C' },
      { key: 'B', text: '−0,93 °C' },
      { key: 'C', text: '−0,50 °C' },
      { key: 'D', text: '0,00 °C' },
      { key: 'E', text: '1,50 °C' },
    ],
    correctKey: 'B',
    solution: 'Titik beku suatu zat atau larutan ditunjukkan oleh fase mendatar (suhu konstan / platô) pada kurva pendinginan saat proses perubahan wujud dari cair ke padat berlangsung. Pada data tabel, suhu berhenti turun dan mendatar stabil pada angka −0,93 °C dari menit ke-6 hingga menit ke-10. Jadi, titik beku larutan adalah −0,93 °C.'
  },
  {
    id: 'kps_q4',
    number: 4,
    kpsIndicator: 'Menginterpretasi grafik',
    hasGraph: true,
    question: 'Perhatikan grafik kurva pendinginan air murni dan larutan X di atas. Pernyataan yang sesuai dengan grafik adalah …',
    options: [
      { key: 'A', text: 'Larutan X membeku pada suhu yang sama dengan air' },
      { key: 'B', text: 'Larutan X membeku pada suhu lebih tinggi dari air' },
      { key: 'C', text: 'Air murni membeku 1,86 °C lebih rendah dari larutan X' },
      { key: 'D', text: 'Kedua cairan tidak menunjukkan titik beku yang jelas' },
      { key: 'E', text: 'Larutan X membeku 1,86 °C lebih rendah dari air murni' },
    ],
    correctKey: 'E',
    solution: 'Grafik menunjukkan bahwa kurva pendinginan air murni mendatar pada suhu 0 °C (titik beku air normal), sedangkan kurva pendinginan larutan X mendatar pada suhu −1,86 °C. Selisih penurunannya adalah ΔTf = 0 − (−1,86) = 1,86 °C. Artinya, larutan X membeku 1,86 °C lebih rendah dari air murni.'
  },
  {
    id: 'kps_q5',
    number: 5,
    kpsIndicator: 'Menerapkan konsep (menghitung)',
    question: 'Sebanyak 9 g glukosa (Mr = 180) dilarutkan dalam 250 g air (Kf air = 1,86 °C/m). Titik beku larutan adalah …',
    options: [
      { key: 'A', text: '−1,49 °C' },
      { key: 'B', text: '−0,74 °C' },
      { key: 'C', text: '−0,37 °C' },
      { key: 'D', text: '−0,19 °C' },
      { key: 'E', text: '−0,10 °C' },
    ],
    correctKey: 'C',
    solution: 'Langkah perhitungan:\n1. Mol glukosa: n = 9 g / 180 g/mol = 0,05 mol.\n2. Massa pelarut air: 250 g = 0,25 kg.\n3. Molalitas larutan: m = 0,05 mol / 0,25 kg = 0,2 m.\n4. Penurunan titik beku: ΔTf = Kf × m = 1,86 × 0,2 = 0,372 °C ≈ 0,37 °C.\n5. Titik beku larutan: Tf = 0 − 0,372 = −0,372 °C ≈ −0,37 °C.'
  },
  {
    id: 'kps_q6',
    number: 6,
    kpsIndicator: 'Menerapkan konsep (menentukan Mr)',
    question: 'Sebanyak 2,4 g zat X (nonelektrolit) dilarutkan dalam 100 g air. Larutan membeku pada −0,744 °C (Kf = 1,86 °C/m). Mr zat X adalah …',
    options: [
      { key: 'A', text: '6' },
      { key: 'B', text: '17' },
      { key: 'C', text: '30' },
      { key: 'D', text: '60' },
      { key: 'E', text: '120' },
    ],
    correctKey: 'D',
    solution: 'Langkah perhitungan:\n1. Penurunan titik beku: ΔTf = 0 − (−0,744) = 0,744 °C.\n2. Molalitas larutan: m = ΔTf / Kf = 0,744 / 1,86 = 0,4 m.\n3. Mol zat X: n = m × massa air (kg) = 0,4 × 0,1 kg = 0,04 mol.\n4. Massa molekul relatif: Mr = massa / n = 2,4 g / 0,04 mol = 60.'
  },
  {
    id: 'kps_q7',
    number: 7,
    kpsIndicator: 'Menyimpulkan',
    hasTable: true,
    tableData: {
      headers: ['Larutan', 'Urea 0,5 m', 'Glukosa 0,5 m', 'Sukrosa 0,5 m', 'Urea 1,0 m'],
      row: ['Tf (°C)', '−0,93', '−0,93', '−0,93', '−1,86']
    },
    question: 'Perhatikan data titik beku beberapa larutan pada tabel di atas. Kesimpulan yang tepat adalah …',
    options: [
      { key: 'A', text: 'Titik beku bergantung pada jenis zat terlarutnya' },
      { key: 'B', text: 'Titik beku bergantung pada jumlah partikel terlarut' },
      { key: 'C', text: 'Zat dengan Mr lebih besar menurunkan titik beku lebih jauh' },
      { key: 'D', text: 'Titik beku tidak dipengaruhi oleh konsentrasi larutan' },
      { key: 'E', text: 'Titik beku hanya turun bila zat terlarutnya adalah urea' },
    ],
    correctKey: 'B',
    solution: 'Pada molalitas yang sama (0,5 m), urea, glukosa, dan sukrosa menghasilkan penurunan titik beku yang sama persis (−0,93 °C) terlepas dari perbedaan jenis atau Mr zat terlarut. Ketika konsentrasi urea dinaikkan menjadi 1,0 m, titik beku turun dua kali lebih banyak (−1,86 °C). Hal ini membuktikan bahwa titik beku adalah sifat koligatif yang hanya bergantung pada jumlah (konsentrasi) partikel zat terlarut, bukan jenisnya.'
  },
  {
    id: 'kps_q8',
    number: 8,
    kpsIndicator: 'Memprediksi',
    question: 'Larutan glukosa 0,5 m membeku pada −0,93 °C. Jika ditambahkan glukosa hingga molalitasnya menjadi 1,5 m, titik bekunya diperkirakan …',
    options: [
      { key: 'A', text: '−2,79 °C' },
      { key: 'B', text: '−1,86 °C' },
      { key: 'C', text: '−0,93 °C' },
      { key: 'D', text: '−0,31 °C' },
      { key: 'E', text: '+2,79 °C' },
    ],
    correctKey: 'A',
    solution: 'Hubungan molalitas dan penurunan titik beku berbanding lurus (ΔTf ∝ m). Molalitas 1,5 m adalah 3 kali lipat dari 0,5 m (1,5 / 0,5 = 3). Maka penurunan titik bekunya adalah 3 × 0,93 °C = 2,79 °C. Sehingga titik beku larutan menjadi Tf = 0 − 2,79 = −2,79 °C.'
  },
];

export default function LatihanKPSBab3({ onCompleteKps }) {
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState({});
  const [reflection, setReflection] = useState('');
  const [reflectionSubmitted, setReflectionSubmitted] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  // Muat status yang tersimpan sebelumnya
  useEffect(() => {
    const key = getCh3KpsKey();
    const existing = getStoredData(key, null);
    if (existing) {
      if (existing.answers) setAnswers(existing.answers);
      if (existing.status) setStatus(existing.status);
      if (existing.reflection) {
        setReflection(existing.reflection);
        setReflectionSubmitted(true);
      }
      const ansCount = existing.answers ? Object.keys(existing.answers).length : 0;
      if (existing.showSummary || (ansCount === KPS_QUESTIONS.length && existing.reflection)) {
        setShowSummary(true);
      }
      if (existing.isPassed !== undefined) {
        setIsPassed(existing.isPassed);
        if (onCompleteKps) {
          onCompleteKps(existing.isPassed, existing.score || 0);
        }
      }
    }
  }, []);

  // Hitung jumlah jawaban benar saat ini
  const correctCount = Object.values(status).filter((s) => s === 'correct').length;
  const answeredCount = Object.keys(status).length;
  const allAnswered = answeredCount === KPS_QUESTIONS.length;

  // Cek apakah seluruh 8 soal dijawab dan refleksi sudah diisi
  useEffect(() => {
    if (allAnswered && reflectionSubmitted && !showSummary) {
      const passed = correctCount >= 6;
      setShowSummary(true);
      setIsPassed(passed);

      // Simpan ke localStorage
      const payload = {
        answers,
        status,
        score: correctCount,
        isPassed: passed,
        showSummary: true,
        reflection,
        savedAt: new Date().toISOString(),
      };
      setStoredData(getCh3KpsKey(), payload);

      if (onCompleteKps) {
        onCompleteKps(passed, correctCount);
      }
    }
  }, [allAnswered, reflectionSubmitted, correctCount, showSummary]);

  // Handler memilih opsi (dinilai hanya dari jawaban pertama)
  const handleSelectOption = (qId, optionKey) => {
    if (status[qId]) return; // sudah dinilai / terkunci

    const question = KPS_QUESTIONS.find((q) => q.id === qId);
    const isRight = optionKey === question.correctKey;

    const newAnswers = { ...answers, [qId]: optionKey };
    const newStatus = { ...status, [qId]: isRight ? 'correct' : 'incorrect' };

    setAnswers(newAnswers);
    setStatus(newStatus);

    // Simpan progres sementara
    const payload = {
      answers: newAnswers,
      status: newStatus,
      score: Object.values(newStatus).filter((s) => s === 'correct').length,
      isPassed: false,
      showSummary: false,
      reflection,
      savedAt: new Date().toISOString(),
    };
    setStoredData(getCh3KpsKey(), payload);
  };

  // Handler simpan refleksi
  const handleReflectionSubmit = (e) => {
    e.preventDefault();
    if (!reflection.trim()) {
      alert('Isi refleksi terlebih dahulu!');
      return;
    }
    setReflectionSubmitted(true);
    const existing = getStoredData(getCh3KpsKey(), null) || {};
    const payload = {
      ...existing,
      reflection: reflection.trim(),
      savedAt: new Date().toISOString(),
    };
    setStoredData(getCh3KpsKey(), payload);
  };

  // Handler ulangi latihan (jika skor < 6)
  const handleReset = () => {
    setAnswers({});
    setStatus({});
    setShowSummary(false);
    setIsPassed(false);

    const payload = {
      answers: {},
      status: {},
      score: 0,
      isPassed: false,
      showSummary: false,
      reflection,
      savedAt: new Date().toISOString(),
    };
    setStoredData(getCh3KpsKey(), payload);

    if (onCompleteKps) {
      onCompleteKps(false, 0);
    }
  };

  // Nomor soal yang salah
  const wrongQuestionNumbers = KPS_QUESTIONS
    .filter((q) => status[q.id] === 'incorrect')
    .map((q) => q.number);

  return (
    <div style={{ marginTop: '2.5rem', fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Latihan Keterampilan Proses Sains (KPS) Bab 3"
        subtitle="8 soal pilihan ganda dinilai dari jawaban pertama + 1 refleksi wajib. KKM kelulusan: 6/8 (75%)."
      >

        {/* ══════════════════════════════════════════════════════════════════════
            PANEL SKOR & HASIL KELULUSAN
        ══════════════════════════════════════════════════════════════════════ */}
        {showSummary && (
          <div
            className="fade-in"
            style={{
              marginBottom: '2rem',
              borderRadius: '12px',
              padding: '1.4rem 1.5rem',
              border: correctCount >= 6 ? '2px solid #10B981' : '2px solid #F59E0B',
              background: correctCount >= 6 ? '#ECFDF5' : '#FFFBEB',
            }}
          >
            {correctCount >= 6 ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2rem' }}>🎉</span>
                  <div>
                    <h4 style={{ margin: 0, color: '#065F46', fontSize: '1.2rem', fontWeight: 800 }}>
                      Selamat! Kamu Lulus KPS Bab 3 (Skor: {correctCount}/8)
                    </h4>
                    <span style={{ color: '#047857', fontSize: '0.925rem' }}>
                      Kamu telah melampaui KKM (≥ 6/8). Pembahasan lengkap untuk setiap soal kini terbuka di bawah.
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>⚠️</span>
                  <div>
                    <h4 style={{ margin: 0, color: '#92400E', fontSize: '1.15rem', fontWeight: 800 }}>
                      Skor Kamu: {correctCount}/8 (Belum Memenuhi KKM 6/8)
                    </h4>
                    <span style={{ color: '#B45309', fontSize: '0.925rem' }}>
                      Kunci jawaban tidak ditampilkan. Pelajari kembali materi Bab 3 dan coba ulangi latihan ini.
                    </span>
                  </div>
                </div>

                {wrongQuestionNumbers.length > 0 && (
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #FCD34D',
                    borderRadius: '8px',
                    padding: '0.65rem 1rem',
                    marginBottom: '1rem',
                    fontSize: '0.925rem',
                    color: '#B45309',
                  }}>
                    <strong>Nomor soal yang perlu diperbaiki:</strong> Soal {wrongQuestionNumbers.join(', ')}
                  </div>
                )}

                <Button
                  variant="primary"
                  onClick={handleReset}
                  style={{
                    padding: '0.65rem 1.4rem',
                    fontSize: '0.95rem',
                    background: '#D97706',
                    boxShadow: '0 3px 10px rgba(217, 119, 6, 0.25)',
                  }}
                >
                  🔄 Ulangi Latihan
                </Button>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            DAFTAR 8 SOAL PILIHAN GANDA KPS
        ══════════════════════════════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
          {KPS_QUESTIONS.map((q) => {
            const st = status[q.id];
            const locked = st !== undefined && st !== null;
            const isCorrect = st === 'correct';
            const isIncorrect = st === 'incorrect';
            const showSolution = showSummary && correctCount >= 6;

            return (
              <div
                key={q.id}
                style={{
                  background: isCorrect ? '#F0FDF4' : isIncorrect ? '#FFF5F5' : '#FFFFFF',
                  border: isCorrect
                    ? '1.5px solid #86EFAC'
                    : isIncorrect
                    ? '1.5px solid #FCA5A5'
                    : '1.5px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 1px 4px rgba(15, 23, 42, 0.03)',
                }}
              >
                {/* Header Soal & Indikator KPS */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginBottom: '0.85rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                    }}>
                      Soal {q.number}
                    </span>
                    <span style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      background: '#F1F5F9',
                      color: '#475569',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                    }}>
                      KPS: {q.kpsIndicator}
                    </span>
                  </div>

                  {locked && (
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '6px',
                      background: isCorrect ? '#DCFCE7' : '#FEE2E2',
                      color: isCorrect ? '#16A34A' : '#DC2626',
                    }}>
                      {isCorrect ? '✓ Benar' : '✗ Salah'}
                    </span>
                  )}
                </div>

                {/* Tabel Data Khusus (Soal 3 & Soal 7) */}
                {q.hasTable && q.tableData && (
                  <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
                    <table style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      fontSize: '0.9rem',
                      textAlign: 'center',
                      background: '#F8FAFC',
                      border: '1px solid #CBD5E1',
                    }}>
                      <thead>
                        <tr style={{ background: '#E2E8F0' }}>
                          {q.tableData.headers.map((h, i) => (
                            <th key={i} style={{ padding: '0.45rem 0.6rem', border: '1px solid #CBD5E1' }}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {q.tableData.row.map((cell, i) => (
                            <td key={i} style={{ padding: '0.45rem 0.6rem', border: '1px solid #CBD5E1', fontWeight: i === 0 ? 700 : 500 }}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Grafik SVG Khusus (Soal 4: Dua Kurva Pendinginan) */}
                {q.hasGraph && (
                  <div style={{
                    background: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    marginBottom: '1rem',
                  }}>
                    <div style={{ textAlign: 'center', fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.25rem' }}>
                      Kurva Pendinginan: Air Murni vs Larutan X
                    </div>
                    <svg
                      viewBox="0 0 500 230"
                      style={{ width: '100%', maxWidth: '480px', height: 'auto', margin: '0 auto', display: 'block' }}
                      role="img"
                      aria-label="Grafik kurva pendinginan air murni dan larutan X"
                    >
                      <rect x="50" y="15" width="420" height="175" fill="#F8FAFC" stroke="#E2E8F0" />

                      {/* Grid Y */}
                      <line x1="50" y1="25" x2="470" y2="25" stroke="#E2E8F0" strokeDasharray="3 3" />
                      <text x="42" y="29" fontSize="10" fill="#64748B" textAnchor="end">4</text>

                      <line x1="50" y1="68" x2="470" y2="68" stroke="#E2E8F0" strokeDasharray="3 3" />
                      <text x="42" y="72" fontSize="10" fill="#64748B" textAnchor="end">2</text>

                      {/* 0 °C Garis Patokan Beku Air */}
                      <line x1="50" y1="112" x2="470" y2="112" stroke="#0284C7" strokeWidth="1.2" strokeDasharray="4 3" />
                      <text x="42" y="116" fontSize="11" fontWeight="800" fill="#0284C7" textAnchor="end">0</text>

                      {/* −1,86 °C Garis Titik Beku Larutan X */}
                      <line x1="50" y1="152" x2="470" y2="152" stroke="#DC2626" strokeWidth="1.2" strokeDasharray="4 3" />
                      <text x="42" y="156" fontSize="10" fontWeight="800" fill="#DC2626" textAnchor="end">−1,86</text>

                      {/* Sumbu X & Y */}
                      <line x1="50" y1="190" x2="470" y2="190" stroke="#334155" strokeWidth="1.8" />
                      <line x1="50" y1="195" x2="50" y2="12" stroke="#334155" strokeWidth="1.8" />

                      {/* X Ticks (Menit 0, 2, 4, 6, 8, 10, 12) */}
                      {[0, 2, 4, 6, 8, 10, 12].map((min) => {
                        const px = 50 + (min / 12) * 400;
                        return (
                          <g key={min}>
                            <line x1={px} y1="190" x2={px} y2="195" stroke="#334155" />
                            <text x={px} y="208" fontSize="10" fill="#64748B" textAnchor="middle">{min}</text>
                          </g>
                        );
                      })}

                      {/* Label Sumbu */}
                      <text x="250" y="224" fontSize="10.5" fontWeight="700" fill="#0F172A" textAnchor="middle">
                        Waktu Pendinginan (menit)
                      </text>
                      <text
                        x="-105"
                        y="18"
                        fontSize="10.5"
                        fontWeight="700"
                        fill="#0F172A"
                        textAnchor="middle"
                        transform="rotate(-90)"
                      >
                        Suhu (°C)
                      </text>

                      {/* Kurva Air Murni: Turun lalu mendatar di 0 °C (y=112) */}
                      <path
                        d="M 50 25 Q 110 75 183 112 L 450 112"
                        fill="none"
                        stroke="#0284C7"
                        strokeWidth="2.5"
                      />
                      <circle cx="183" cy="112" r="3.5" fill="#0284C7" />
                      <text x="320" y="105" fontSize="9.5" fontWeight="700" fill="#0369A1">
                        0 °C (fase membeku air)
                      </text>

                      {/* Kurva Larutan X: Turun melewati 0 °C lalu mendatar di -1,86 °C (y=152) */}
                      <path
                        d="M 50 25 Q 140 100 250 152 L 450 152"
                        fill="none"
                        stroke="#DC2626"
                        strokeWidth="2.5"
                      />
                      <circle cx="250" cy="152" r="3.5" fill="#DC2626" />
                      <text x="320" y="145" fontSize="9.5" fontWeight="700" fill="#B91C1C">
                        −1,86 °C (fase membeku larutan X)
                      </text>

                      {/* Legenda Grafik */}
                      <g transform="translate(300, 22)">
                        <rect width="160" height="42" rx="4" fill="#FFFFFF" stroke="#CBD5E1" opacity="0.95" />
                        <line x1="10" y1="15" x2="35" y2="15" stroke="#0284C7" strokeWidth="2.5" />
                        <text x="42" y="18" fontSize="10" fontWeight="700" fill="#0369A1">Air Murni (Tf = 0 °C)</text>
                        <line x1="10" y1="30" x2="35" y2="30" stroke="#DC2626" strokeWidth="2.5" />
                        <text x="42" y="33" fontSize="10" fontWeight="700" fill="#B91C1C">Larutan X (Tf = −1,86 °C)</text>
                      </g>
                    </svg>
                  </div>
                )}

                {/* Teks Pertanyaan */}
                <p style={{ margin: '0 0 1rem 0', fontSize: '1.025rem', color: '#0F172A', lineHeight: 1.6 }}>
                  <strong>{q.number}.</strong> {q.question}
                </p>

                {/* Pilihan Ganda (A - E) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  {q.options.map((opt) => {
                    const isSelected = answers[q.id] === opt.key;

                    let optBg = '#F8FAFC';
                    let optBorder = '1.5px solid #E2E8F0';
                    let optColor = '#334155';

                    if (locked) {
                      if (isSelected && isCorrect) {
                        optBg = '#DCFCE7';
                        optBorder = '2px solid #22C55E';
                        optColor = '#14532D';
                      } else if (isSelected && isIncorrect) {
                        optBg = '#FEE2E2';
                        optBorder = '2px solid #EF4444';
                        optColor = '#7F1D1D';
                      } else {
                        optBg = '#F8FAFC';
                        optBorder = '1px solid #E2E8F0';
                        optColor = '#94A3B8';
                      }
                    } else if (isSelected) {
                      optBg = '#EFF6FF';
                      optBorder = '2px solid #0284C7';
                      optColor = '#1E3A5F';
                    }

                    return (
                      <div
                        key={opt.key}
                        onClick={() => handleSelectOption(q.id, opt.key)}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          padding: '0.65rem 0.95rem',
                          borderRadius: '8px',
                          background: optBg,
                          border: optBorder,
                          color: optColor,
                          cursor: locked ? 'default' : 'pointer',
                          transition: 'all 0.15s ease',
                          lineHeight: 1.5,
                          fontSize: '0.95rem',
                        }}
                      >
                        <span style={{
                          fontWeight: 800,
                          minWidth: '22px',
                          color: locked && isSelected && isCorrect
                            ? '#16A34A'
                            : locked && isSelected && isIncorrect
                            ? '#DC2626'
                            : 'inherit',
                        }}>
                          {opt.key}.
                        </span>
                        <span style={{ flex: 1 }}>{opt.text}</span>
                        {locked && isSelected && isCorrect && (
                          <span style={{ color: '#16A34A', fontWeight: 800 }}>✓ Benar</span>
                        )}
                        {locked && isSelected && isIncorrect && (
                          <span style={{ color: '#DC2626', fontWeight: 800 }}>✗ Salah</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pembahasan Lengkap (HANYA MUNCUL JIKA SKOR ≥ 6 / KKM 75%) */}
                {showSolution && (
                  <div
                    className="fade-in"
                    style={{
                      marginTop: '0.85rem',
                      background: '#F0FDF4',
                      borderLeft: '4px solid #10B981',
                      borderRadius: '6px',
                      padding: '0.75rem 1rem',
                      fontSize: '0.9rem',
                      color: '#065F46',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    <strong>📖 Pembahasan Soal {q.number}:</strong>
                    <div style={{ marginTop: '0.25rem' }}>{q.solution}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            REFLEKSI (WAJIB DIISI, TIDAK DINILAI)
        ══════════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem' }}>💭</span>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
              Refleksi Akhir Bab 3 (Wajib Diisi)
            </h4>
          </div>

          <p style={{ margin: '0 0 0.85rem 0', fontSize: '1rem', color: '#334155', lineHeight: 1.5 }}>
            “Kembali ke dugaan awalmu di Fase 2. Apakah dugaanmu terbukti? Jelaskan apa yang berubah dari pemahamanmu.”
          </p>

          <form onSubmit={handleReflectionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => {
                setReflection(e.target.value);
                setReflectionSubmitted(false);
              }}
              placeholder="Tuliskan refleksimu mengenai dugaan awal, pembuktian percobaan, dan perubahan pemahamanmu..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                lineHeight: 1.5,
                boxSizing: 'border-box',
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <Button
                type="submit"
                variant="primary"
                disabled={!reflection.trim() || reflectionSubmitted}
                style={{
                  padding: '0.65rem 1.4rem',
                  fontSize: '0.95rem',
                  background: reflectionSubmitted ? '#10B981' : '#0284C7',
                }}
              >
                {reflectionSubmitted ? '✓ Refleksi Tersimpan' : '💾 Simpan Refleksi'}
              </Button>

              {!allAnswered && (
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Jawab seluruh 8 soal di atas dan simpan refleksi untuk menampilkan skor akhir.
                </span>
              )}
            </div>
          </form>
        </div>

      </Card>
    </div>
  );
}

