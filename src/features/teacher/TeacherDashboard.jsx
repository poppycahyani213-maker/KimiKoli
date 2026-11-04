import React, { useState, useEffect } from 'react';
import { getAllStudentRecords, saveStudentRecord, setStoredData, STORAGE_KEYS } from '../../utils/storage';

/**
 * Komponen TeacherDashboard
 * 
 * Khusus untuk akun Guru:
 * - Melihat rekapitulasi nilai pretest siswa
 * - Memantau progres misi belajar siswa
 * - Tombol kembali ke mode pembelajaran web untuk demonstrasi
 */
export default function TeacherDashboard({ onBackToLearning }) {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('ALL');

  const loadData = () => {
    const list = getAllStudentRecords();
    setStudents(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter siswa berdasarkan pencarian dan kelas
  const filteredStudents = students.filter(s => {
    const matchName = s.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = selectedClassFilter === 'ALL' || s.className === selectedClassFilter;
    return matchName && matchClass;
  });

  // Statistik Ringkas
  const totalStudents = students.length;
  const completedPretestCount = students.filter(s => s.pretestCompleted).length;
  const averageScore = totalStudents > 0 
    ? Math.round(students.reduce((acc, curr) => acc + (curr.pretestScore ? (curr.pretestScore / (curr.pretestTotal || 8)) * 100 : 0), 0) / totalStudents)
    : 0;

  // Fungsi tambah data dummy contoh untuk pengujian guru
  const handleAddSampleData = () => {
    const samples = [
      { name: "Ahmad Fauzan", className: "XI MIPA 1", pretestScore: 7, pretestTotal: 8, pretestCompleted: true, progressMissions: "1/6 Misi", xp: 20 },
      { name: "Siti Rahmawati", className: "XI MIPA 1", pretestScore: 8, pretestTotal: 8, pretestCompleted: true, progressMissions: "2/6 Misi", xp: 50 },
      { name: "Budi Pratama", className: "XI MIPA 2", pretestScore: 5, pretestTotal: 8, pretestCompleted: true, progressMissions: "1/6 Misi", xp: 20 },
      { name: "Dewi Lestari", className: "XI MIPA 2", pretestScore: 6, pretestTotal: 8, pretestCompleted: true, progressMissions: "1/6 Misi", xp: 20 }
    ];

    samples.forEach(s => saveStudentRecord(s));
    loadData();
  };

  // Reset Data Uji Coba
  const handleResetData = () => {
    if (window.confirm("Apakah Bapak/Ibu yakin ingin membersihkan seluruh data rekap siswa?")) {
      setStoredData(STORAGE_KEYS.STUDENTS_DATABASE, []);
      setStudents([]);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '3rem', fontFamily: "'Times New Roman', Times, serif" }}>
      {/* Header Dashboard Guru */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#FEF3C7', color: '#B45309', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.4rem' }}>
            <span>🔬</span>
            <span>Panel Khusus Guru Kimia</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0 0.4rem', color: '#0F172A' }}>
            Rekapitulasi Nilai & Progres Siswa
          </h2>
          <p style={{ margin: 0, color: '#64748B', fontSize: '0.95rem' }}>
            Pantau capaian bekal awal pretest dan ketuntasan misi lab siswa secara langsung.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={onBackToLearning}
          style={{ background: '#0284C7', padding: '0.65rem 1.4rem' }}
        >
          ← Masuk ke Mode Pembelajaran Siswa
        </button>
      </div>

      {/* Kartu Ringkasan Statistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '0.825rem', color: '#64748B', fontWeight: 600 }}>Total Siswa Terdata</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0F172A', marginTop: '0.25rem' }}>
            {totalStudents} <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 500 }}>Siswa</span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '0.825rem', color: '#64748B', fontWeight: 600 }}>Selesai Pretest</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>
            {completedPretestCount} <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 500 }}>Siswa</span>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-lg)', padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '0.825rem', color: '#64748B', fontWeight: 600 }}>Rata-rata Nilai Pretest</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#0284C7', marginTop: '0.25rem' }}>
            {averageScore}%
          </div>
        </div>
      </div>

      {/* Tabel Data Rekap Siswa */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 'var(--radius-xl)', padding: '1.75rem', boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)' }}>
        {/* Filter & Aksi Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: 1 }}>
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '0.6rem 0.85rem',
                border: '1.5px solid #CBD5E1',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                minWidth: '220px',
                fontFamily: "'Times New Roman', Times, serif"
              }}
            />

            <select
              value={selectedClassFilter}
              onChange={(e) => setSelectedClassFilter(e.target.value)}
              style={{
                padding: '0.6rem 0.85rem',
                border: '1.5px solid #CBD5E1',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem',
                background: '#FFFFFF',
                fontFamily: "'Times New Roman', Times, serif"
              }}
            >
              <option value="ALL">Semua Kelas</option>
              <option value="XI MIPA 1">XI MIPA 1</option>
              <option value="XI MIPA 2">XI MIPA 2</option>
              <option value="XI MIPA 3">XI MIPA 3</option>
              <option value="XI MIPA 4">XI MIPA 4</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {totalStudents === 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleAddSampleData}
                style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem' }}
              >
                + Masukkan Contoh Data Uji Coba
              </button>
            )}
            {totalStudents > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleResetData}
                style={{ fontSize: '0.85rem', padding: '0.5rem 0.9rem', color: '#DC2626', borderColor: '#FECACA' }}
              >
                Reset Data Siswa
              </button>
            )}
          </div>
        </div>

        {/* Tabel */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', color: '#475569' }}>
                <th style={{ padding: '0.85rem 1rem' }}>No</th>
                <th style={{ padding: '0.85rem 1rem' }}>Nama Siswa</th>
                <th style={{ padding: '0.85rem 1rem' }}>Kelas</th>
                <th style={{ padding: '0.85rem 1rem' }}>Skor Pretest</th>
                <th style={{ padding: '0.85rem 1rem' }}>Nilai (%)</th>
                <th style={{ padding: '0.85rem 1rem' }}>Status Misi</th>
                <th style={{ padding: '0.85rem 1rem' }}>Waktu Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s, idx) => {
                  const percent = s.pretestTotal ? Math.round((s.pretestScore / s.pretestTotal) * 100) : 0;
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '0.85rem 1rem', color: '#64748B' }}>{idx + 1}</td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0F172A' }}>{s.name}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#475569' }}>{s.className}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ fontWeight: 700, color: s.pretestCompleted ? '#0284C7' : '#94A3B8' }}>
                          {s.pretestCompleted ? `${s.pretestScore} / ${s.pretestTotal || 8} Soal` : 'Belum selesai'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {s.pretestCompleted ? (
                          <span style={{
                            padding: '0.2rem 0.55rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            background: percent >= 75 ? '#ECFDF5' : (percent >= 50 ? '#EFF6FF' : '#FFF7ED'),
                            color: percent >= 75 ? '#065F46' : (percent >= 50 ? '#0284C7' : '#C2410C')
                          }}>
                            {percent}%
                          </span>
                        ) : '-'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{ color: '#059669', fontWeight: 600 }}>
                          {s.progressMissions || (s.pretestCompleted ? '1/6 Misi' : '0/6 Misi')}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#94A3B8', fontSize: '0.85rem' }}>
                        {s.lastActive || 'Baru saja'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#94A3B8' }}>
                    Belum ada data siswa yang terekam. Masuk sebagai siswa dan selesaikan pretest, atau klik tombol <em>"+ Masukkan Contoh Data Uji Coba"</em> di atas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

