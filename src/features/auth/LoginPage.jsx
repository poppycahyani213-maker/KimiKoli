import React, { useState } from 'react';
import bgImg from '../../assets/kimikoli-bg.jpg';
import kimikoliIcon from '../../assets/kimikoli-icon.jpg';

/**
 * Komponen LoginPage
 * 
 * Menggunakan background nuansa cat air sifat koligatif larutan KimiKoli.
 * Fitur:
 * - Tab Masuk: Siswa (Nama & Kelas) | Guru (Password rahasia)
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
      padding: 'clamp(1rem, 3vw, 2.5rem)',
      backgroundImage: `linear-gradient(135deg, rgba(240, 249, 255, 0.25), rgba(255, 255, 255, 0.35)), url(${bgImg})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      {/* Form Login Card dengan Efek Halus & Bayangan Lembut */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(10px)',
        border: '1.5px solid rgba(255, 255, 255, 0.8)',
        borderRadius: '24px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 45px rgba(2, 132, 199, 0.12), 0 4px 16px rgba(15, 23, 42, 0.06)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Logo & Judul Brand KimiKoli */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: '#FFFFFF',
              border: '2px solid #BAE6FD',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.65rem',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.16)',
              overflow: 'hidden',
              padding: '6px'
            }}>
              <img 
                src={kimikoliIcon} 
                alt="Logo KimiKoli" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.2rem', color: '#0F172A', letterSpacing: '-0.02em' }}>
              Kimi<span style={{ color: '#0284C7' }}>Koli</span>
            </h1>
            <span style={{ display: 'block', fontSize: '0.85rem', color: '#0369A1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              Sifat Koligatif Larutan • Kelas 11 SMA
            </span>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#64748B' }}>
              Masuk untuk memulai pembelajaran & laboratorium virtual
            </p>
          </div>

          {/* Tab Pilihan Role (Siswa vs Guru) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            background: '#F1F5F9',
            padding: '0.35rem',
            borderRadius: '12px',
            marginBottom: '1.5rem'
          }}>
            <button
              type="button"
              onClick={() => { setActiveRole('student'); setErrorMessage(''); }}
              style={{
                padding: '0.65rem',
                border: 'none',
                borderRadius: '8px',
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
                borderRadius: '8px',
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
              borderRadius: '10px',
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
                    borderRadius: '10px',
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
                    borderRadius: '10px',
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
                  borderRadius: '10px',
                  background: '#0284C7',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
                }}
              >
                Yuk, Mulai Eksplorasi! 🚀
              </button>
            </form>
          )}

          {/* FORM 2: GURU (Password dirahasiakan tanpa petunjuk) */}
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
                    borderRadius: '10px',
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
                    borderRadius: '10px',
                    fontSize: '1rem',
                    boxSizing: 'border-box',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  fontSize: '1.05rem',
                  borderRadius: '10px',
                  background: '#0F172A'
                }}
              >
                Masuk sebagai Guru 🔬
              </button>
            </form>
          )}

          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Data sesi pembelajaran tersimpan aman di peramban lokal.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
