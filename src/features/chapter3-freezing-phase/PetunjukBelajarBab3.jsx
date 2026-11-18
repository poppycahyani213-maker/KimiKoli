import React, { useState } from 'react';
import Card from '../../components/common/Card';

const PBL_STEPS = [
  {
    fase: 1,
    shortLabel: '1 Orientasi masalah',
    nama: 'Fase 1: Orientasi Siswa pada Masalah',
    icon: '🍨',
    aktivitas: 'Mengamati fenomena gerobak es puter Pak Darmo dan membedah pertanyaan pemantik mengapa adonan membeku tanpa freezer.',
    softBg: '#F0F9FF',
    circleBg: '#E0F2FE',
    border: '#0284C7',
    textColor: '#0369A1',
    targetId: 'fase-1',
  },
  {
    fase: 2,
    shortLabel: '2 Mengorganisasi belajar',
    nama: 'Fase 2: Mengorganisasi Siswa untuk Belajar',
    icon: '💡',
    aktivitas: 'Menentukan dugaan awal (pilihan A–D), menuliskan alasan logis, merumuskan masalah, dan menyusun hipotesis ilmiah.',
    softBg: '#FFFBEB',
    circleBg: '#FEF3C7',
    border: '#D97706',
    textColor: '#92400E',
    targetId: 'fase-2',
  },
  {
    fase: 3,
    shortLabel: '3 Penyelidikan',
    nama: 'Fase 3: Membimbing Penyelidikan',
    icon: '🧪',
    aktivitas: 'Mengeksplorasi simulasi termometer kontras didih vs beku, menganalisis 3 level representasi kimia, dan memahami prinsip ΔTf.',
    softBg: '#F0FDF4',
    circleBg: '#DCFCE7',
    border: '#16A34A',
    textColor: '#15803D',
    targetId: 'fase-3',
  },
  {
    fase: 4,
    shortLabel: '4 Menyajikan hasil',
    nama: 'Fase 4: Mengembangkan & Menyajikan Hasil',
    icon: '📊',
    aktivitas: 'Mencatat data pengamatan ke dalam tabel, mengamati grafik hubungan molalitas vs ΔTf, serta merumuskan kesimpulan akhir.',
    softBg: '#FAF5FF',
    circleBg: '#F3E8FF',
    border: '#9333EA',
    textColor: '#7E22CE',
    targetId: 'fase-4',
  },
  {
    fase: 5,
    shortLabel: '5 Analisis & evaluasi',
    nama: 'Fase 5: Menganalisis & Mengevaluasi Proses',
    icon: '✅',
    aktivitas: 'Merefleksikan dugaan awal, meluruskan 2 miskonsepsi es puter, dan menguji pemahaman lewat 8 soal KPS serta refleksi diri.',
    softBg: '#FFF1F2',
    circleBg: '#FFE4E6',
    border: '#E11D48',
    textColor: '#BE123C',
    targetId: 'fase-5',
  },
];

export default function PetunjukBelajarBab3({ onNavigatePhase }) {
  const [selectedFase, setSelectedFase] = useState(1);

  const activeStep = PBL_STEPS.find((s) => s.fase === selectedFase) || PBL_STEPS[0];

  const handleJump = (targetId, faseNumber) => {
    if (onNavigatePhase) {
      onNavigatePhase(faseNumber);
    } else {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <Card
      style={{
        marginBottom: '1.5rem',
        border: '1.5px solid #CBD5E1',
        background: '#FFFFFF',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        padding: '1.1rem 1.25rem',
        fontFamily: "'Times New Roman', Times, serif",
      }}
    >
      {/* ── Header Petunjuk Belajar ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🧭</span>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
            Petunjuk Belajar: Alur 5 Fase Penyelidikan PBL
          </h3>
        </div>
        <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
          Klik ikon fase untuk melihat aktivitas
        </span>
      </div>

      {/* ── 5 Ikon Bulat Berjejer dalam Satu Baris (Tetap 1 Baris di HP) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '0.2rem',
        marginBottom: '0.85rem',
        width: '100%',
      }}>
        {PBL_STEPS.map((step) => {
          const isSelected = selectedFase === step.fase;

          return (
            <button
              key={step.fase}
              onClick={() => setSelectedFase(step.fase)}
              type="button"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                cursor: 'pointer',
                textAlign: 'center',
                background: 'transparent',
                border: 'none',
                padding: '0.2rem 0',
                outline: 'none',
                fontFamily: 'inherit',
              }}
              title={step.nama}
            >
              {/* Ikon Bulat */}
              <div
                style={{
                  width: 'clamp(36px, 8vw, 46px)',
                  height: 'clamp(36px, 8vw, 46px)',
                  borderRadius: '50%',
                  background: step.circleBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'clamp(1.1rem, 2.4vw, 1.45rem)',
                  border: isSelected ? `2.5px solid ${step.border}` : '1.5px solid transparent',
                  boxShadow: isSelected
                    ? `0 0 0 3px ${step.circleBg}, 0 2px 6px rgba(15, 23, 42, 0.12)`
                    : 'none',
                  transition: 'all 0.15s ease',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                {step.icon}
              </div>

              {/* Label Pendek di Bawah Ikon */}
              <span
                style={{
                  marginTop: '0.35rem',
                  fontSize: 'clamp(0.62rem, 1.55vw, 0.78rem)',
                  fontWeight: isSelected ? 800 : 600,
                  color: isSelected ? step.textColor : '#475569',
                  lineHeight: 1.25,
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  transition: 'color 0.15s ease',
                }}
              >
                {step.shortLabel}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Kotak Deskripsi Fase yang Dipilih ───────────────────────────── */}
      <div
        className="fade-in"
        key={activeStep.fase}
        style={{
          background: activeStep.softBg,
          border: `1.5px solid ${activeStep.border}35`,
          borderLeft: `4px solid ${activeStep.border}`,
          borderRadius: '10px',
          padding: '0.75rem 1rem',
          boxShadow: '0 1px 4px rgba(15, 23, 42, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.3rem' }}>
          <strong style={{ fontSize: '0.95rem', color: activeStep.textColor }}>
            {activeStep.nama}
          </strong>
          <button
            onClick={() => handleJump(activeStep.targetId, activeStep.fase)}
            type="button"
            style={{
              background: 'transparent',
              border: 'none',
              color: activeStep.textColor,
              fontSize: '0.85rem',
              fontWeight: 800,
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.2rem',
              fontFamily: 'inherit',
            }}
          >
            Lompat ke Fase {activeStep.fase} →
          </button>
        </div>

        <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
          {activeStep.aktivitas}
        </p>
      </div>

      {/* ── Satu Baris Kecil: Perkiraan Waktu & Syarat Buka Bab 4 ───────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.4rem',
        fontSize: '0.78rem',
        color: '#64748B',
        marginTop: '0.65rem',
        paddingTop: '0.5rem',
        borderTop: '1px dashed #E2E8F0',
      }}>
        <span>⏱️ Estimasi waktu: <strong>2 × 45 menit</strong></span>
        <span>🔒 Syarat buka Bab 4: <strong>Dugaan Fase 2, Data Fase 4, &amp; Latihan KPS (≥ 6/8)</strong></span>
      </div>

      {/* ── Bagian Catatan untuk Guru (Lipat / Collapsible) ───────────────── */}
      <details
        style={{
          marginTop: '0.65rem',
          paddingTop: '0.4rem',
        }}
      >
        <summary
          style={{
            cursor: 'pointer',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: '#1D4ED8',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            userSelect: 'none',
          }}
        >
          <span>👨‍🏫</span>
          <span>Catatan untuk Guru (Panduan Fasilitasi PBL)</span>
          <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, marginLeft: '0.2rem' }}>
            [klik untuk membuka]
          </span>
        </summary>

        <div style={{
          marginTop: '0.65rem',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '0.85rem 1rem',
          fontSize: '0.86rem',
          color: '#334155',
          lineHeight: 1.55,
        }}>
          <div style={{ marginBottom: '0.6rem' }}>
            <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.15rem' }}>
              🎯 Tujuan Pembelajaran:
            </strong>
            Siswa dapat menganalisis fenomena penurunan titik beku (ΔTf) larutan nonelektrolit secara ilmiah, 
            menghubungkan konsentrasi molalitas dengan besarnya penurunan suhu beku, 
            serta membedakan arah perubahan titik didih vs titik beku larutan.
          </div>

          <div style={{ marginBottom: '0.6rem' }}>
            <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.15rem' }}>
              ⏱️ Rekomendasi Waktu:
            </strong>
            2 Jam Pelajaran (2 × 45 menit). Dapat difasilitasi dalam model blended learning di laboratorium komputer atau penugasan mandiri.
          </div>

          <div>
            <strong style={{ color: '#0F172A', display: 'block', marginBottom: '0.25rem' }}>
              💡 Panduan Peran Guru pada Setiap Fase:
            </strong>
            <ul style={{ margin: '0 0 0 1.15rem', padding: 0 }}>
              <li><strong>Fase 1:</strong> Bangkitkan rasa ingin tahu siswa mengenai kontradiksi es mencair tetapi adonan es puter malah membeku.</li>
              <li><strong>Fase 2:</strong> Beri motivasi agar siswa berani memilih dugaan awal; tekankan bahwa dugaan awal tidak dinilai benar/salah.</li>
              <li><strong>Fase 3:</strong> Dampingi siswa membandingkan termometer kenaikan titik didih vs penurunan titik beku dan memahami nilai Kf air (1,86 °C/m).</li>
              <li><strong>Fase 4:</strong> Fasilitasi pengamatan pola pada tabel dan grafik; bantu siswa menyimpulkan hubungan linier antara molalitas dan ΔTf.</li>
              <li><strong>Fase 5:</strong> Klarifikasi miskonsepsi umum (garam tidak menghangatkan es), dan pantau ketuntasan latihan KPS siswa (KKM ≥ 75%).</li>
            </ul>
          </div>
        </div>
      </details>
    </Card>
  );
}
