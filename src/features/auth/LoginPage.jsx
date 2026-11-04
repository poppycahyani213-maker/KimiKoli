import React, { useState } from 'react';

/**
 * Komponen LoginPage
 * 
 * Memfasilitasi masuk sebagai:
 * 1. SISWA: Mengisi Nama dan Kelas
 * 2. GURU : Memasukkan Password khusus ("kimiaasik")
 */
export default function LoginPage({ onLoginSuccess }) {
  const [activeRole, setActiveRole] = useState('student'); // 'student' | 'teacher'

  // State Form Siswa
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('XI MIPA 1');

  // State Form Guru
  const [teacherName, setTeacherName] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Submit Siswa
  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMessage('Harap masukkan nama lengkap Anda.');
      return;
    }

    const userData = {
      role: 'student',
      name: studentName.trim(),
      className: studentClass,
      loginAt: new Date().toISOString()
    };

    onLoginSuccess(userData);
  };

  // Handle Submit Guru
  const handleTeacherSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (teacherPassword !== 'kimiaasik') {
      setErrorMessage('Password guru salah! Silakan coba lagi.');
      return;
    }

    const userData = {
      role: 'teacher',
      name: teacherName.trim() || 'Bapak/Ibu Guru',
      className: 'Guru Kimia',
      loginAt: new Date().toISOString()
    };

    onLoginSuccess(userData);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 2rem',
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08)',
        position: 'relative'
      }}>
        {/* Logo & Judul */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #0284C7, #06B6D4)',
            color: '#FFFFFF',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
          }}>
            🧪
          </div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800, margin: '0 0 0.25rem', color: '#0F172A' }}>
            Koligatif<span style={{ color: '#0284C7' }}>Lab 11</span>
          </h1>
          <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748B' }}>
            Portal Pembelajaran Sifat Koligatif Larutan • Kelas 11 SMA
          </p>
        </div>

        {/* Tab Pilihan Role (Siswa vs Guru) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          background: '#F1F5F9',
          padding: '0.35rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.75rem'
        }}>
          <button
            type="button"
            onClick={() => { setActiveRole('student'); setErrorMessage(''); }}
            style={{
              padding: '0.65rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: activeRole === 'student' ? '#FFFFFF' : 'transparent',
              color: activeRole === 'student' ? '#0284C7' : '#64748B',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: activeRole === 'student' ? '0 2px 6px rgba(15, 23, 42, 0.06)' : 'none',
              transition: 'all 0.2s',
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            🎓 Mode Siswa
          </button>
          <button
            type="button"
            onClick={() => { setActiveRole('teacher'); setErrorMessage(''); }}
            style={{
              padding: '0.65rem',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: activeRole === 'teacher' ? '#FFFFFF' : 'transparent',
              color: activeRole === 'teacher' ? '#0284C7' : '#64748B',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: activeRole === 'teacher' ? '0 2px 6px rgba(15, 23, 42, 0.06)' : 'none',
              transition: 'all 0.2s',
              fontFamily: "'Times New Roman', Times, serif"
            }}
          >
            🔬 Mode Guru
          </button>
        </div>

        {/* Pesan Peringatan Error */}
        {errorMessage && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#B91C1C',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* FORM 1: SISWA */}
        {activeRole === 'student' && (
          <form onSubmit={handleStudentSubmit}>
            <div style={{ marginBottom: '1.15rem' }}>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0F172A' }}>
                Nama Lengkap Siswa:
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Contoh: Jaehyun"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0F172A' }}>
                Pilih Kelas:
              </label>
              <select
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  background: '#FFFFFF',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                <option value="XI MIPA 1">XI MIPA 1</option>
                <option value="XI MIPA 2">XI MIPA 2</option>
                <option value="XI MIPA 3">XI MIPA 3</option>
                <option value="XI MIPA 4">XI MIPA 4</option>
                <option value="Fase F Kimia 1">Fase F Kimia 1</option>
                <option value="Fase F Kimia 2">Fase F Kimia 2</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1.05rem',
                borderRadius: 'var(--radius-md)',
                background: '#0284C7'
              }}
            >
              Masuk ke Pembelajaran 🚀
            </button>
          </form>
        )}

        {/* FORM 2: GURU */}
        {activeRole === 'teacher' && (
          <form onSubmit={handleTeacherSubmit}>
            <div style={{ marginBottom: '1.15rem' }}>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0F172A' }}>
                Nama Guru / Pendidik:
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Contoh: Guru Kimia"
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.92rem', fontWeight: 700, marginBottom: '0.4rem', color: '#0F172A' }}>
                Password Guru:
              </label>
              <input
                type="password"
                value={teacherPassword}
                onChange={(e) => setTeacherPassword(e.target.value)}
                placeholder="Masukkan password guru"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 0.95rem',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              />
              <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginTop: '0.35rem' }}>
                *Petunjuk: Password khusus guru adalah <code>kimiaasik</code>
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '1.05rem',
                borderRadius: 'var(--radius-md)',
                background: '#0F172A'
              }}
            >
              Masuk sebagai Guru 🔬
            </button>
          </form>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            Data sesi Anda tersimpan secara lokal dan aman di perangkat peramban.
          </span>
        </div>
      </div>
    </div>
  );
}

