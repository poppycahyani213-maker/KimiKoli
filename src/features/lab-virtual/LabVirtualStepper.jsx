import React from 'react';

/**
 * Komponen Navigasi Jalur 6 Tahap PjBL Lab Virtual KimiKoli
 * Menampilkan tahapan yang terkunci secara berurutan, status pengerjaan, dan XP yang diraih.
 */
export const STAGES_CONFIG = [
  {
    id: 1,
    title: 'Pertanyaan Masalah',
    subtitle: 'Skenario & Hipotesis',
    icon: '❓',
    xp: 15,
    description: 'Mengidentifikasi fenomena nyata titik beku dan merumuskan hipotesis ilmiah.'
  },
  {
    id: 2,
    title: 'Rancang Percobaan',
    subtitle: 'Variabel & Skema Arduino',
    icon: '📐',
    xp: 15,
    description: 'Menentukan variabel penelitian dan mempelajari skema rangkaian sensor DS18B20.'
  },
  {
    id: 3,
    title: 'Simulasi Virtual',
    subtitle: 'Prediksi Kurva Pendinginan',
    icon: '💻',
    xp: 20,
    description: 'Bereksperimen dengan slider molalitas dan kurva pendinginan teoretis.'
  },
  {
    id: 4,
    title: 'Praktik Arduino',
    subtitle: 'Panduan & Pengambilan Data',
    icon: '🔌',
    xp: 25,
    description: 'Menjalankan eksperimen riil Arduino dan mencatat data suhu vs waktu.'
  },
  {
    id: 5,
    title: 'Analisis Data',
    subtitle: 'Plot Grafik & Titik Beku',
    icon: '📊',
    xp: 25,
    description: 'Memplot kurva data riil vs simulasi, menandai titik beku, dan menghitung ΔTf serta i.'
  },
  {
    id: 6,
    title: 'Kesimpulan & Refleksi',
    subtitle: 'Evaluasi & Kuis Singkat',
    icon: '💡',
    xp: 20,
    description: 'Menyimpulkan hasil investigasi, refleksi PjBL, dan uji pemahaman akhir lab.'
  }
];

export default function LabVirtualStepper({
  currentStage = 1,
  completedStages = [],
  onSelectStage,
  totalXpEarned = 0,
  isTeacher = false
}) {
  const totalStages = STAGES_CONFIG.length;
  const completedCount = completedStages.length;
  const progressPercent = Math.round((completedCount / totalStages) * 100);

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1.5px solid #BAE6FD',
      borderRadius: '20px',
      padding: '1.25rem 1.5rem',
      marginBottom: '1.75rem',
      boxShadow: '0 8px 24px rgba(2, 132, 199, 0.08)',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      {/* Baris Ringkasan Progres & XP */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.15rem' }}>🔬</span>
            <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>
              Alur Investigasi PjBL: Kurva Pendinginan Titik Beku (Hybrid Arduino)
            </strong>
          </div>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.86rem', color: '#64748B' }}>
            Selesaikan tiap tahapan secara berurutan untuk membuka gembok tahap berikutnya.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: '#F0F9FF',
            border: '1px solid #BAE6FD',
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#0284C7',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <span>⚡</span>
            <span>{totalXpEarned} XP Terkumpul</span>
          </div>

          <div style={{
            background: completedCount === totalStages ? '#ECFDF5' : '#F8FAFC',
            border: `1px solid ${completedCount === totalStages ? '#A7F3D0' : '#E2E8F0'}`,
            padding: '0.35rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: completedCount === totalStages ? '#047857' : '#334155'
          }}>
            {completedCount} / {totalStages} Tahap Tuntas ({progressPercent}%)
          </div>
        </div>
      </div>

      {/* Progress Bar Visual */}
      <div style={{
        width: '100%',
        height: '8px',
        background: '#E2E8F0',
        borderRadius: '9999px',
        overflow: 'hidden',
        marginBottom: '1.25rem'
      }}>
        <div style={{
          width: `${progressPercent}%`,
          height: '100%',
          background: completedCount === totalStages
            ? 'linear-gradient(90deg, #10B981, #059669)'
            : 'linear-gradient(90deg, #0284C7, #38BDF8)',
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* Grid Stepper 6 Tahap (Responsif) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '0.65rem'
      }}>
        {STAGES_CONFIG.map((stage) => {
          const isCompleted = completedStages.includes(stage.id);
          const isCurrent = currentStage === stage.id;
          // Tahap 1 selalu unlocked; Guru selalu bebas akses; Tahap k unlocked jika tahap k-1 selesai
          const isUnlocked = isTeacher || stage.id === 1 || completedStages.includes(stage.id - 1);

          let bg = '#F8FAFC';
          let border = '#E2E8F0';
          let textColor = '#64748B';
          let badgeBg = '#E2E8F0';
          let badgeColor = '#64748B';
          let badgeLabel = '🔒 Terkunci';

          if (isCompleted) {
            bg = '#F0FDF4';
            border = isCurrent ? '#059669' : '#86EFAC';
            textColor = '#065F46';
            badgeBg = '#DCFCE7';
            badgeColor = '#15803D';
            badgeLabel = `✓ +${stage.xp} XP`;
          } else if (isUnlocked) {
            if (isCurrent) {
              bg = '#F0F9FF';
              border = '#0284C7';
              textColor = '#0369A1';
              badgeBg = '#0284C7';
              badgeColor = '#FFFFFF';
              badgeLabel = 'Aktif 🚀';
            } else {
              bg = '#FFFFFF';
              border = '#BAE6FD';
              textColor = '#0F172A';
              badgeBg = '#EFF6FF';
              badgeColor = '#0284C7';
              badgeLabel = `Siap (+${stage.xp} XP)`;
            }
          }

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => {
                if (isUnlocked) {
                  onSelectStage(stage.id);
                } else {
                  alert(`🔒 Tahap ${stage.id} masih terkunci. Selesaikan Tahap ${stage.id - 1} terlebih dahulu.`);
                }
              }}
              style={{
                background: bg,
                border: `1.5px solid ${border}`,
                borderRadius: '14px',
                padding: '0.75rem 0.65rem',
                textAlign: 'left',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.65,
                transition: 'all 0.18s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isCurrent ? '0 4px 14px rgba(2, 132, 199, 0.22)' : 'none',
                fontFamily: "'Times New Roman', Times, serif"
              }}
              title={
                isUnlocked 
                  ? `Klik untuk membuka Tahap ${stage.id}: ${stage.title}`
                  : `Terkunci: Selesaikan Tahap ${stage.id - 1} terlebih dahulu.`
              }
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.25rem' }}>{stage.icon}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '6px',
                    background: badgeBg,
                    color: badgeColor
                  }}>
                    {badgeLabel}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                  Tahap {stage.id}
                </div>
                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: isCurrent ? '#0284C7' : (isCompleted ? '#065F46' : '#1E293B'),
                  lineHeight: 1.25,
                  margin: '0.15rem 0'
                }}>
                  {stage.title}
                </div>
              </div>

              <div style={{ fontSize: '0.74rem', color: textColor, marginTop: '0.35rem' }}>
                {stage.subtitle}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
