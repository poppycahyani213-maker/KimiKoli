import React, { useState, useEffect } from 'react';
import kimikoliIcon from '../../assets/kimikoli-icon.jpg';

/**
 * Modal Popup Informasi Website & Manual Penggunaan KimiKoli
 * Memiliki 2 tab: "Tentang Website" dan "Manual Penggunaan"
 * Ditutup dengan tombol ✕, tombol Esc, klik backdrop di luar modal, atau tombol "Tutup".
 */
export default function KimiKoliModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('about'); // 'about' | 'manual'

  // Listener tombol keyboard Esc untuk menutup modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Kunci scroll body saat modal aktif
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        // Tutup jika klik di luar modal (backdrop)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(2, 132, 199, 0.25), 0 0 0 1px rgba(186, 230, 253, 0.8)',
          overflow: 'hidden',
          fontFamily: "'Times New Roman', Times, serif",
          animation: 'scaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================
            HEADER MODAL
            ========================================================= */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            borderBottom: '1.5px solid #BAE6FD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <img
              src={kimikoliIcon}
              alt="Logo KimiKoli"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                border: '2px solid #BAE6FD',
                background: '#FFFFFF',
                objectFit: 'contain',
                padding: '3px',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.15)'
              }}
            />
            <div>
              <h2
                id="modal-title"
                style={{
                  margin: 0,
                  fontSize: '1.35rem',
                  fontWeight: 'bold',
                  color: '#0F172A',
                  letterSpacing: '0.01em'
                }}
              >
                KimiKoli
              </h2>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#0369A1' }}>
                Media Pembelajaran Kimia Sifat Koligatif Larutan · Kelas XI SMA
              </p>
            </div>
          </div>

          {/* Tombol Tutup X */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup jendela informasi"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #CBD5E1',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
              fontSize: '1.15rem',
              fontWeight: 'bold',
              lineHeight: 1,
              transition: 'all 0.18s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FEE2E2';
              e.currentTarget.style.borderColor = '#EF4444';
              e.currentTarget.style.color = '#B91C1C';
              e.currentTarget.style.transform = 'scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#FFFFFF';
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
        </div>

        {/* =========================================================
            NAVIGASI DUA TAB
            ========================================================= */}
        <div
          style={{
            display: 'flex',
            padding: '0.65rem 1.5rem',
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            gap: '0.65rem'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('about')}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              border: activeTab === 'about' ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
              background: activeTab === 'about' ? '#0284C7' : '#FFFFFF',
              color: activeTab === 'about' ? '#FFFFFF' : '#334155',
              fontWeight: activeTab === 'about' ? 'bold' : 'normal',
              fontSize: '0.98rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              transition: 'all 0.18s ease',
              boxShadow: activeTab === 'about' ? '0 4px 12px rgba(2, 132, 199, 0.28)' : 'none'
            }}
          >
            <span>ℹ️</span> Tentang Website
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              borderRadius: '12px',
              border: activeTab === 'manual' ? '1.5px solid #0284C7' : '1px solid #CBD5E1',
              background: activeTab === 'manual' ? '#0284C7' : '#FFFFFF',
              color: activeTab === 'manual' ? '#FFFFFF' : '#334155',
              fontWeight: activeTab === 'manual' ? 'bold' : 'normal',
              fontSize: '0.98rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              transition: 'all 0.18s ease',
              boxShadow: activeTab === 'manual' ? '0 4px 12px rgba(2, 132, 199, 0.28)' : 'none'
            }}
          >
            <span>📖</span> Manual Penggunaan
          </button>
        </div>

        {/* =========================================================
            KONTEN TAB (BISA DI-SCROLL)
            ========================================================= */}
        <div
          style={{
            padding: '1.4rem 1.5rem',
            overflowY: 'auto',
            flex: 1,
            color: '#1E293B',
            lineHeight: 1.65,
            fontSize: '0.98rem'
          }}
        >
          {activeTab === 'about' ? (
            <div>
              {/* 1. Nama Website & Deskripsi Singkat */}
              <div
                style={{
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '14px',
                  padding: '1rem 1.15rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🧪</span>
                  <strong style={{ fontSize: '1.05rem', color: '#0369A1' }}>
                    KimiKoli (Kimia Koligatif)
                  </strong>
                </div>
                <p style={{ margin: 0, color: '#1E293B', fontSize: '0.95rem' }}>
                  KimiKoli adalah media pembelajaran kimia digital interaktif yang dirancang khusus untuk memandu siswa
                  kelas XI SMA memahami konsep <strong>Sifat Koligatif Larutan</strong> secara kontekstual, bertahap,
                  dan menyenangkan melalui visualisasi fenomena sehari-hari serta simulasi laboratorium.
                </p>
              </div>

              {/* 2. Cakupan Materi Sifat Koligatif */}
              <div style={{ marginBottom: '1.35rem' }}>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    color: '#0F172A',
                    margin: '0 0 0.6rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <span>📚</span> Cakupan Materi Sifat Koligatif Larutan
                </h3>
                <p style={{ margin: '0 0 0.65rem 0', color: '#475569', fontSize: '0.92rem' }}>
                  Materi mencakup seluruh konsep esensial sifat koligatif larutan yang bergantung pada jumlah partikel zat terlarut, meliputi:
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '0.6rem'
                  }}
                >
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
                    <strong style={{ color: '#0284C7' }}>1. Penurunan Tekanan Uap (ΔP):</strong>
                    <div style={{ fontSize: '0.88rem', color: '#475569' }}>Hukum Raoult dan fraksi mol zat terlarut.</div>
                  </div>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
                    <strong style={{ color: '#0284C7' }}>2. Kenaikan Titik Didih (ΔTb):</strong>
                    <div style={{ fontSize: '0.88rem', color: '#475569' }}>Pengaruh konsentrasi molal dan tetapan Kb pelarut.</div>
                  </div>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
                    <strong style={{ color: '#0284C7' }}>3. Penurunan Titik Beku (ΔTf):</strong>
                    <div style={{ fontSize: '0.88rem', color: '#475569' }}>Prinsip pembuatan es puter dan tetapan Kf pelarut.</div>
                  </div>
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.65rem 0.85rem' }}>
                    <strong style={{ color: '#0284C7' }}>4. Tekanan Osmotik (Π):</strong>
                    <div style={{ fontSize: '0.88rem', color: '#475569' }}>Hukum van &apos;t Hoff, membran semipermeabel, dan desalinasi.</div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: '0.6rem',
                    background: '#FDF4FF',
                    border: '1px solid #F0ABFC',
                    borderRadius: '10px',
                    padding: '0.6rem 0.85rem',
                    fontSize: '0.88rem',
                    color: '#86198F'
                  }}
                >
                  ⚡ <strong>Faktor van &apos;t Hoff (i):</strong> Perbedaan perhitungan sifat koligatif larutan nonelektrolit dengan larutan elektrolit akibat derajat ionisasi (α).
                </div>
              </div>

              {/* 3. Daftar Fitur Website (Masing-masing satu kalimat) */}
              <div>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    color: '#0F172A',
                    margin: '0 0 0.65rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                >
                  <span>✨</span> Daftar Fitur Pembelajaran
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '1.15rem' }}>🏠</span>
                    <div style={{ fontSize: '0.92rem' }}>
                      <strong style={{ color: '#0F172A' }}>Beranda:</strong> Menampilkan ringkasan capaian belajar, peta misi bertahap, perolehan poin XP, dan koleksi lencana penguasaan konsep siswa.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '1.15rem' }}>📖</span>
                    <div style={{ fontSize: '0.92rem' }}>
                      <strong style={{ color: '#0F172A' }}>Materi:</strong> Menyajikan modul digital interaktif 5 bab yang dilengkapi fenomena nyata, animasi partikel submikroskopis, dan latihan mandiri berumpan balik instan.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '1.15rem' }}>🔬</span>
                    <div style={{ fontSize: '0.92rem' }}>
                      <strong style={{ color: '#0F172A' }}>Lab Virtual:</strong> Laboratorium simulasi digital interaktif untuk bereksperimen menguji pengaruh jenis dan konsentrasi zat terlarut terhadap titik didih maupun titik beku secara aman.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start', background: '#F8FAFC', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '1.15rem' }}>📝</span>
                    <div style={{ fontSize: '0.92rem' }}>
                      <strong style={{ color: '#0F172A' }}>Kuis:</strong> Evaluasi akhir terstruktur untuk mengukur ketuntasan kompetensi serta pemahaman komprehensif siswa pada seluruh materi sifat koligatif larutan.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* TAB MANUAL PENGGUNAAN */}
              <div
                style={{
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '14px',
                  padding: '1rem 1.15rem',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>🧭</span>
                  <strong style={{ fontSize: '1.05rem', color: '#065F46' }}>
                    Alur Belajar Berurutan (Sequential Learning)
                  </strong>
                </div>
                <p style={{ margin: 0, color: '#064E3B', fontSize: '0.93rem' }}>
                  Website KimiKoli dirancang menggunakan sistem gerbang misi bertahap agar pemahamanmu terbangun kokoh dari dasar hingga aplikasi tingkat lanjut.
                </p>
              </div>

              {/* Langkah-langkah berurutan */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {/* Langkah 1 */}
                <div
                  style={{
                    display: 'flex',
                    gap: '0.85rem',
                    background: '#FFFFFF',
                    border: '1.5px solid #BAE6FD',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.06)'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#0284C7',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}
                  >
                    1
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#0F172A', fontSize: '1rem' }}>
                      Kerjakan Pretest Prasyarat
                    </h4>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.91rem' }}>
                      Mulai perjalananmu dengan menyelesaikan 8 butir soal Pretest Prasyarat untuk mengukur pemahaman awal konsep mol dan konsentrasi larutan sekaligus membuka materi Bab 1.
                    </p>
                  </div>
                </div>

                {/* Langkah 2 */}
                <div
                  style={{
                    display: 'flex',
                    gap: '0.85rem',
                    background: '#FFFFFF',
                    border: '1.5px solid #BAE6FD',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.06)'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#0284C7',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}
                  >
                    2
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#0F172A', fontSize: '1rem' }}>
                      Pelajari Materi Bab 1 hingga Bab 5 Secara Bertahap
                    </h4>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.91rem' }}>
                      Baca penjelasan konsep, amati simulasi molekuler, dan selesaikan latihan mandiri di akhir setiap bab. Begitu satu bab tuntas, bab berikutnya akan terbuka secara otomatis.
                    </p>
                  </div>
                </div>

                {/* Langkah 3 */}
                <div
                  style={{
                    display: 'flex',
                    gap: '0.85rem',
                    background: '#FFFFFF',
                    border: '1.5px solid #BAE6FD',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.06)'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#0284C7',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}
                  >
                    3
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#0F172A', fontSize: '1rem' }}>
                      Coba Eksperimen di Lab Virtual
                    </h4>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.91rem' }}>
                      Uji hipotesismu di Laboratorium Virtual dengan melarutkan glukosa atau garam (NaCl) ke dalam air untuk membuktikan secara visual perubahan titik didih dan titik beku larutan.
                    </p>
                  </div>
                </div>

                {/* Langkah 4 */}
                <div
                  style={{
                    display: 'flex',
                    gap: '0.85rem',
                    background: '#FFFFFF',
                    border: '1.5px solid #BAE6FD',
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    boxShadow: '0 2px 6px rgba(2, 132, 199, 0.06)'
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#0284C7',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}
                  >
                    4
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#0F172A', fontSize: '1rem' }}>
                      Kerjakan Kuis Evaluasi Akhir
                    </h4>
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.91rem' }}>
                      Tuntaskan kuis evaluasi komprehensif untuk menguji seluruh materi yang telah kamu pelajari, raih gelar &quot;Ahli Koligatif&quot;, dan lengkapi perolehan seluruh lencana prestasimu!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================
            FOOTER MODAL
            ========================================================= */}
        <div
          style={{
            padding: '0.9rem 1.5rem',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
            💡 Tekan tombol <kbd style={{ background: '#E2E8F0', padding: '2px 6px', borderRadius: '4px' }}>Esc</kbd> atau klik di luar untuk menutup.
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '0.55rem 1.4rem',
              borderRadius: '10px',
              border: 'none',
              background: '#0284C7',
              color: '#FFFFFF',
              fontWeight: 'bold',
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
              transition: 'all 0.18s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0369A1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0284C7';
            }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
