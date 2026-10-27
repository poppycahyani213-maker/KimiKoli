import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function Chapter6Page({ completedChapters = [], onResetProgress }) {
  const isAllCompleted = completedChapters.length >= 5;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="green">Bab 6 • Evaluasi</Badge>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem' }}>
          Evaluasi Akhir & Ringkasan Capaian Belajar
        </h2>
        <p className="text-muted">
          Selamat! Periksa pemahaman akhir Anda mengenai seluruh konsep 4 sifat koligatif larutan.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card title="Status Perjalanan Belajar" subtitle="Rekap progres kursus Anda">
          <div style={{ marginBottom: '1rem' }}>
            <p>
              Anda telah menyelesaikan <strong>{completedChapters.length}</strong> dari 6 tahapan materi sifat koligatif.
            </p>
            {isAllCompleted ? (
              <div style={{
                background: 'var(--color-success-light)',
                border: '1px solid #A7F3D0',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                color: '#065F46',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🎓</span>
                <div>
                  <strong>Luar Biasa!</strong>
                  <div style={{ fontSize: '0.85rem' }}>
                    Anda telah menguasai konsep penurunan tekanan uap, kenaikan titik didih, penurunan titik beku, tekanan osmotik, dan faktor van 't Hoff.
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                color: 'var(--text-muted)'
              }}>
                Selesaikan seluruh modul bab 1 sampai 5 untuk membuka evaluasi akhir dan sertifikat kelulusan digital.
              </div>
            )}
          </div>
        </Card>

        <Card title="Pengaturan & Reset">
          <p className="text-muted" style={{ fontSize: '0.9rem' }}>
            Jika Anda ingin mengulang kursus dari awal untuk keperluan demonstrasi atau pengujian:
          </p>
          <Button variant="outline" onClick={onResetProgress}>
            🔄 Reset Riwayat Progres Belajar
          </Button>
        </Card>
      </div>
    </div>
  );
}

