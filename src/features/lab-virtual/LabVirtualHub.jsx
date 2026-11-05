import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

/**
 * Komponen LabVirtualHub
 * 
 * Pusat Gerbang Laboratorium Virtual:
 * - Hanya dapat diakses setelah siswa menyelesaikan seluruh materi (Bab 1 s.d. Bab 5).
 * - Memberikan pratinjau praktikum virtual yang akan dibangun.
 * - Tombol untuk menyelesaikan aktivitas lab dan membuka gerbang Kuis Evaluasi Akhir.
 */
export default function LabVirtualHub({ 
  isCompleted = false, 
  onCompleteLab, 
  onBackToHome 
}) {
  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Badge variant="blue">Laboratorium Virtual KimiKoli</Badge>
          {isCompleted && (
            <span style={{ fontSize: '0.8rem', background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
              ✓ Sesi Lab Telah Dituntaskan
            </span>
          )}
        </div>
        <h2 style={{ margin: '0.25rem 0', fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>
          Laboratorium Virtual: Eksplorasi Fenomena Sifat Koligatif
        </h2>
        <p className="text-muted" style={{ fontSize: '1.05rem', margin: 0 }}>
          Selamat! Kamu telah menguasai seluruh materi teori Bab 1 sampai Bab 5. Praktikkan pemahamanmu melalui simulasi laboratorium virtual sebelum menempuh Kuis Akhir.
        </p>
      </div>

      {/* Navigasi Cepat Kembali */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onBackToHome}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 1rem', fontSize: '0.88rem' }}
        >
          ← Kembali ke Beranda
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Kartu Status Akses & Syarat Kuis */}
        <Card title="Status Laboratorium Virtual" subtitle="Gerbang prasyarat Kuis Evaluasi Akhir">
          <div style={{
            background: isCompleted ? '#ECFDF5' : '#F0F9FF',
            border: `1.5px solid ${isCompleted ? '#10B981' : '#0284C7'}`,
            borderRadius: '14px',
            padding: '1.25rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.6rem' }}>{isCompleted ? '🎉' : '🔬'}</span>
              <div>
                <strong style={{ fontSize: '1.05rem', color: isCompleted ? '#065F46' : '#0369A1' }}>
                  {isCompleted ? 'Praktikum Lab Selesai!' : 'Akses Terbuka: Tahap Eksplorasi Lab'}
                </strong>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  {isCompleted
                    ? 'Akses Kuis Akhir telah terbuka sepenuhnya.'
                    : 'Tuntaskan tahapan di lab ini untuk membuka akses Kuis Evaluasi Akhir.'}
                </div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: 1.55 }}>
              Di laboratorium ini, kamu akan membandingkan titik didih, kurva pendinginan titik beku, dan tekanan osmotik dari berbagai larutan dengan konsentrasi dan faktor van 't Hoff yang berbeda secara *hands-on*.
            </p>
          </div>

          {/* Action Button: Selesaikan Lab & Buka Kuis Akhir */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Button
              variant="primary"
              onClick={onCompleteLab}
              style={{
                padding: '0.9rem 1.5rem',
                fontSize: '1.02rem',
                fontWeight: 700,
                background: isCompleted ? '#059669' : '#0284C7',
                boxShadow: isCompleted ? '0 4px 12px rgba(5, 150, 105, 0.3)' : '0 4px 12px rgba(2, 132, 199, 0.3)'
              }}
            >
              {isCompleted ? '✓ Lab Selesai — Lanjut ke Kuis Akhir →' : '✓ Selesaikan Sesi Lab & Buka Kuis Akhir →'}
            </Button>
            <span style={{ fontSize: '0.82rem', color: '#64748B', textAlign: 'center' }}>
              *Klik tombol ini untuk menandai praktikum selesai dan membuka gembok Kuis Akhir
            </span>
          </div>
        </Card>

        {/* Pratinjau Ruang Kerja Lab (Staging Placeholder) */}
        <Card title="Pratinjau Modul Praktikum Lab Virtual" subtitle="Eksplorasi eksperimen mandiri">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.3rem' }}>🧪</span>
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>1. Simulator Pembuat Larutan & Molalitas</strong>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Menakar gram zat terlarut vs pelarut air untuk menghitung molalitas nyata.</div>
              </div>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.3rem' }}>🌡️</span>
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>2. Pengukur Kenaikan Titik Didih (ΔTb)</strong>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Membandingkan air murni (100°C) dengan larutan glukosa, NaCl, dan CaCl₂.</div>
              </div>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.3rem' }}>❄️</span>
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>3. Kurva Pendinginan Titik Beku (ΔTf)</strong>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Mengamati plateau titik beku larutan air garam di bawah 0°C.</div>
              </div>
            </div>

            <div style={{ padding: '0.75rem', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{ fontSize: '1.3rem' }}>🥒</span>
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>4. Tabung U Tekanan Osmotik & Membran</strong>
                <div style={{ fontSize: '0.82rem', color: '#64748B' }}>Simulasi kenaikan kolom cairan pelarut dan penerapan reverse osmosis.</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

