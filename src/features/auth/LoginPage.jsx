import React, { useState } from 'react';
import bgImg from '../../assets/kimikoli-bg.jpg';
import kimikoliIcon from '../../assets/kimikoli-icon.jpg';
import { 
  loginWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  resetPassword,
  isFirebaseConfigured 
} from '../../services/firebase';
import { getUserProfile, saveUserProfile } from '../../utils/storage';

/**
 * Komponen LoginPage (KimiKoli)
 * 
 * Terintegrasi dengan Firebase Authentication:
 * - Masuk langsung dengan Google (Google Sign-In)
 * - Masuk dengan Email & Password
 * - Pendaftaran Akun Baru (Register)
 * - Fitur Lupa Password (Forgot Password)
 * - Mode Masuk Cepat / Demonstrasi (Siswa & Guru)
 */
export default function LoginPage({ onLoginSuccess }) {
  // Mode Halaman: 'login' | 'register' | 'forgot-password' | 'quick-guest'
  const [authMode, setAuthMode] = useState('login');
  // Role Aktif: 'student' | 'teacher'
  const [activeRole, setActiveRole] = useState('student');

  // State Form Input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [studentClass, setStudentClass] = useState('XI MIPA 1');

  // State Notifikasi & Loading
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Login dengan Google
  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const googleUser = await loginWithGoogle();
      const existingProfile = getUserProfile(googleUser.email) || getUserProfile(googleUser.uid);
      const userData = {
        role: existingProfile?.role || activeRole,
        name: existingProfile?.name || googleUser.name || 'Siswa KimiKoli',
        email: googleUser.email,
        className: existingProfile?.className || (activeRole === 'student' ? studentClass : 'Guru Kimia'),
        uid: googleUser.uid,
        provider: 'google.com',
        loginAt: new Date().toISOString()
      };
      saveUserProfile(userData);
      onLoginSuccess(userData);
    } catch (error) {
      setErrorMessage(error.message || 'Gagal masuk dengan Google. Silakan coba kembali.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Submit Form Email & Password (Login)
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Harap isi email dan password Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await loginWithEmail(email.trim(), password);
      const existingProfile = getUserProfile(user.email) || getUserProfile(user.uid);
      const resolvedName = existingProfile?.name || (user.name && user.name !== email.split('@')[0] ? user.name : null) || email.split('@')[0];
      const resolvedClass = existingProfile?.className || (activeRole === 'student' ? studentClass : 'Guru Kimia');

      const userData = {
        role: existingProfile?.role || activeRole,
        name: resolvedName,
        email: user.email,
        className: resolvedClass,
        uid: user.uid,
        provider: 'password',
        loginAt: new Date().toISOString()
      };
      saveUserProfile(userData);
      onLoginSuccess(userData);
    } catch (error) {
      setErrorMessage(error.message || 'Gagal masuk. Periksa kembali email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Submit Form Pendaftaran Akun Baru (Register)
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Harap masukkan nama lengkap.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Harap masukkan alamat email.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password minimal harus 6 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi password tidak cocok.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await registerWithEmail(email.trim(), password, fullName.trim());
      const userData = {
        role: activeRole,
        name: fullName.trim() || user.name,
        email: user.email,
        className: activeRole === 'student' ? studentClass : 'Guru Kimia',
        uid: user.uid,
        provider: 'password',
        loginAt: new Date().toISOString()
      };
      saveUserProfile(userData);
      onLoginSuccess(userData);
    } catch (error) {
      setErrorMessage(error.message || 'Gagal mendaftar. Silakan coba email lain.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Lupa Password (Forgot Password)
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Harap masukkan alamat email Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(email.trim());
      setSuccessMessage(result.message || `Tautan reset password berhasil dikirim ke ${email}.`);
    } catch (error) {
      setErrorMessage(error.message || 'Gagal mengirim email reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Masuk Cepat Langsung (Fallback Demo / Praktikum di Lab Sekolah)
  const handleQuickGuestLogin = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMessage('Harap masukkan nama Anda.');
      return;
    }

    const userData = {
      role: activeRole,
      name: fullName.trim(),
      className: activeRole === 'student' ? studentClass : 'Guru Kimia',
      provider: 'guest',
      loginAt: new Date().toISOString()
    };
    saveUserProfile(userData);
    onLoginSuccess(userData);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(1rem, 3vw, 2.5rem)',
      backgroundImage: `linear-gradient(135deg, rgba(240, 249, 255, 0.35), rgba(255, 255, 255, 0.45)), url(${bgImg})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      {/* Kartu Form Login Berbingkai Elegan */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        border: '1.5px solid rgba(255, 255, 255, 0.95)',
        borderRadius: '24px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 20px 45px rgba(2, 132, 199, 0.14), 0 4px 16px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: 'clamp(1.5rem, 3.2vw, 2.25rem)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Logo & Identitas Brand KimiKoli */}
          <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{
              width: 68,
              height: 68,
              borderRadius: 18,
              background: '#FFFFFF',
              border: '2px solid #BAE6FD',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.5rem',
              boxShadow: '0 6px 18px rgba(2, 132, 199, 0.15)',
              overflow: 'hidden',
              padding: '5px'
            }}>
              <img 
                src={kimikoliIcon} 
                alt="Logo KimiKoli" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '0 0 0.15rem', color: '#0F172A', letterSpacing: '-0.02em' }}>
              Kimi<span style={{ color: '#0284C7' }}>Koli</span>
            </h1>
            <span style={{ display: 'block', fontSize: '0.82rem', color: '#0369A1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
              Sifat Koligatif Larutan • Kelas 11 SMA
            </span>
            <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B' }}>
              {authMode === 'forgot-password'
                ? 'Atur ulang kata sandi akun KimiKoli Anda'
                : (authMode === 'register'
                  ? 'Daftar akun baru untuk mulai pembelajaran & lab virtual'
                  : 'Masuk untuk memulai pembelajaran & laboratorium virtual')}
            </p>

            {/* Status Keterhubungan Firebase */}
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{
                fontSize: '0.74rem',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                background: isFirebaseConfigured ? '#ECFDF5' : '#F0F9FF',
                color: isFirebaseConfigured ? '#047857' : '#0369A1',
                border: `1px solid ${isFirebaseConfigured ? '#A7F3D0' : '#BAE6FD'}`,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: isFirebaseConfigured ? '#10B981' : '#0284C7' }}></span>
                {isFirebaseConfigured ? 'Firebase Authentication Aktif' : 'Firebase Auth Siap Terhubung'}
              </span>
            </div>
          </div>

          {/* Tab Pilihan Role (Siswa vs Guru) */}
          {authMode !== 'forgot-password' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.4rem',
              background: '#F1F5F9',
              padding: '0.3rem',
              borderRadius: '12px',
              marginBottom: '1.25rem'
            }}>
              <button
                type="button"
                onClick={() => { setActiveRole('student'); setErrorMessage(''); }}
                style={{
                  padding: '0.55rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeRole === 'student' ? '#FFFFFF' : 'transparent',
                  color: activeRole === 'student' ? '#0284C7' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.92rem',
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
                  padding: '0.55rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: activeRole === 'teacher' ? '#FFFFFF' : 'transparent',
                  color: activeRole === 'teacher' ? '#0284C7' : '#64748B',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: activeRole === 'teacher' ? '0 2px 6px rgba(15, 23, 42, 0.06)' : 'none',
                  transition: 'all 0.2s',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                🔬 Mode Guru
              </button>
            </div>
          )}

          {/* Notifikasi Pesan Error */}
          {errorMessage && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              padding: '0.65rem 0.9rem',
              borderRadius: '10px',
              fontSize: '0.86rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>⚠️</span>
              <span style={{ lineHeight: 1.4 }}>{errorMessage}</span>
            </div>
          )}

          {/* Notifikasi Pesan Sukses */}
          {successMessage && (
            <div style={{
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              padding: '0.65rem 0.9rem',
              borderRadius: '10px',
              fontSize: '0.86rem',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span>✓</span>
              <span style={{ lineHeight: 1.4 }}>{successMessage}</span>
            </div>
          )}

          {/* =========================================================
              BAGIAN 1: TOMBOL MASUK DENGAN GOOGLE
              ========================================================= */}
          {authMode !== 'forgot-password' && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#0284C7'; e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.background = '#FFFFFF'; }}
              >
                {/* Logo Resmi Google SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isLoading ? 'Menghubungkan...' : 'Masuk dengan Google'}</span>
              </button>

              {/* Garis Pembatas (Divider) */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                margin: '1.25rem 0',
                color: '#94A3B8'
              }}>
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
                <span style={{ padding: '0 0.75rem', fontSize: '0.82rem', fontWeight: 600 }}>atau gunakan email</span>
                <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }}></div>
              </div>
            </>
          )}

          {/* =========================================================
              BAGIAN 2: FORM MASUK DENGAN EMAIL (LOGIN)
              ========================================================= */}
          {authMode === 'login' && (
            <form onSubmit={handleEmailLogin}>
              {/* Kelas Siswa (agar data profil otomatis sinkron) */}
              {activeRole === 'student' && (
                <div style={{ marginBottom: '0.9rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
                    Kelas Anda:
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
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
              )}

              <div style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
                  Alamat Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@gmail.com / siswa@sekolah.sch.id"
                  required
                  style={{
                    width: '100%',
                    padding: '0.68rem 0.85rem',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
              </div>

              <div style={{ marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                    Password:
                  </label>
                  {/* Link Lupa Password */}
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot-password'); setErrorMessage(''); setSuccessMessage(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284C7',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                      textDecoration: 'underline',
                      fontFamily: "'Times New Roman', Times, serif"
                    }}
                  >
                    Lupa Password?
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi akun"
                  required
                  style={{
                    width: '100%',
                    padding: '0.68rem 0.85rem',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.78rem',
                  fontSize: '1rem',
                  borderRadius: '10px',
                  background: activeRole === 'teacher' ? '#0F172A' : '#0284C7',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
                  marginTop: '0.85rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Memproses...' : (activeRole === 'teacher' ? 'Masuk sebagai Guru 🔬' : 'Masuk ke Pembelajaran 🚀')}
              </button>

              {/* Beralih ke Registrasi */}
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.86rem', color: '#64748B' }}>Belum punya akun? </span>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0284C7',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                >
                  Daftar Akun Baru
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              BAGIAN 3: FORM PENDAFTARAN AKUN BARU (REGISTER)
              ========================================================= */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Siti Rahmawati"
                  required
                  style={{
                    width: '100%',
                    padding: '0.68rem 0.85rem',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
              </div>

              {activeRole === 'student' && (
                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
                    Pilih Kelas:
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
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
              )}

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
                  Alamat Email:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@gmail.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.68rem 0.85rem',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
                  Buat Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  required
                  style={{
                    width: '100%',
                    padding: '0.68rem 0.85rem',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.15rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
                  Konfirmasi Password:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password di atas"
                  required
                  style={{
                    width: '100%',
                    padding: '0.68rem 0.85rem',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    boxSizing: 'border-box',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.78rem',
                  fontSize: '1rem',
                  borderRadius: '10px',
                  background: '#10B981',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.25)',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Mendaftarkan...' : 'Buat Akun & Masuk Sekarang ✨'}
              </button>

              {/* Kembali ke Login */}
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '0.86rem', color: '#64748B' }}>Sudah memiliki akun? </span>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0284C7',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                >
                  Masuk di sini
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              BAGIAN 4: FORM LUPA PASSWORD (FORGOT PASSWORD)
              ========================================================= */}
          {authMode === 'forgot-password' && (
            <form onSubmit={handleForgotPassword}>
              <div style={{
                background: '#F0F9FF',
                border: '1px solid #BAE6FD',
                borderRadius: '10px',
                padding: '0.85rem',
                marginBottom: '1rem',
                fontSize: '0.88rem',
                color: '#0369A1',
                lineHeight: 1.5
              }}>
                🔑 Masukkan alamat email yang terdaftar di akun KimiKoli Anda. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
                  Alamat Email Akun:
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@gmail.com"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '0.98rem',
                    boxSizing: 'border-box',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.78rem',
                  fontSize: '1rem',
                  borderRadius: '10px',
                  background: '#0284C7',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Mengirim...' : 'Kirim Tautan Reset Password 📨'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                >
                  ← Kembali ke Halaman Masuk
                </button>
              </div>
            </form>
          )}

          {/* =========================================================
              BAGIAN 5: OPSIONAL - MODE MASUK CEPAT (GUEST/DEMO)
              ========================================================= */}
          {authMode === 'quick-guest' && (
            <form onSubmit={handleQuickGuestLogin}>
              <div style={{
                background: '#FEF3C7',
                border: '1px solid #FCD34D',
                borderRadius: '10px',
                padding: '0.75rem',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                color: '#92400E'
              }}>
                ⚡ Mode Masuk Cepat: Anda dapat langsung bereksplorasi tanpa perlu mendaftarkan email (cocok untuk uji coba kelas atau praktikum singkat).
              </div>

              <div style={{ marginBottom: '0.9rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
                  Nama Lengkap Siswa / Guru:
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Jaehyun / Siti"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '0.98rem',
                    boxSizing: 'border-box',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
              </div>

              {activeRole === 'student' && (
                <div style={{ marginBottom: '1.15rem' }}>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
                    Pilih Kelas:
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
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
              )}

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '0.78rem',
                  fontSize: '1rem',
                  borderRadius: '10px',
                  background: '#0284C7',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
                }}
              >
                Mulai Eksplorasi Sekarang 🚀
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                >
                  ← Kembali ke Menu Login Email
                </button>
              </div>
            </form>
          )}

          {/* Footer Card: Link Akses Cepat */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '0.9rem' }}>
            {authMode !== 'quick-guest' && authMode !== 'forgot-password' && (
              <button
                type="button"
                onClick={() => { setAuthMode('quick-guest'); setErrorMessage(''); setSuccessMessage(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                💡 Ingin uji coba cepat tanpa akun? <span style={{ color: '#0284C7', textDecoration: 'underline' }}>Masuk Cepat di sini</span>
              </button>
            )}
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.4rem' }}>
              Platform KimiKoli · Hak Cipta Terlindungi
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
