import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import { 
  getCourseProgress, 
  saveCourseProgress, 
  getAuthUser, 
  setAuthUser, 
  clearAuthUser, 
  saveStudentRecord 
} from './utils/storage';

// Komponen Halaman
import LoginPage from './features/auth/LoginPage';
import HomePage from './features/home/HomePage';
import PretestPage from './features/pretest/PretestPage';
import Chapter1Page from './features/chapter1-concentration/Chapter1Page';
import Chapter2Page from './features/chapter2-vapor-boiling/Chapter2Page';
import Chapter3Page from './features/chapter3-freezing-phase/Chapter3Page';
import Chapter4Page from './features/chapter4-osmosis/Chapter4Page';
import Chapter5Page from './features/chapter5-electrolyte/Chapter5Page';
import Chapter6Page from './features/chapter6-evaluation/Chapter6Page';
import LabVirtualHub from './features/lab-virtual/LabVirtualHub';
import TeacherDashboard from './features/teacher/TeacherDashboard';

/**
 * Komponen Utama App
 * 
 * Mengatur alur:
 * - Login: Siswa (Nama & Kelas) | Guru (Password 'kimiaasik')
 * - 'home': Beranda interaktif KimiKoli (Hero, Peta Misi dinamis)
 * - 'pretest': Soal Pretest Prasyarat (Mode Ujian Terkunci)
 * - 'chapter1' - 'chapter6': Modul Materi & Lab Virtual Berurutan (Sequential Unlocking)
 * - 'teacher-dashboard': Panel Khusus Guru melihat rekap nilai & progres siswa
 */
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [completedChapters, setCompletedChapters] = useState([]);
  const [isPretestCompleted, setIsPretestCompleted] = useState(false);
  const [isPretestLocked, setIsPretestLocked] = useState(false);
  const [pretestAnswers, setPretestAnswers] = useState({});
  const [isLabVirtualCompleted, setIsLabVirtualCompleted] = useState(false);

  // Status penyelesaian seluruh materi teori (Bab 1 s.d. Bab 5)
  // Guru selalu memiliki akses penuh. Siswa berhak membuka jika telah menyelesaikan Bab 5 atau seluruh bab materi 1–5.
  const isAllMaterialCompleted = 
    currentUser?.role === 'teacher' ||
    completedChapters.includes('chapter5') ||
    ['chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5'].every(c => completedChapters.includes(c));

  // Ambil sesi login dan progres saat pertama kali dimuat
  useEffect(() => {
    const loggedUser = getAuthUser();
    if (loggedUser) {
      setCurrentUser(loggedUser);
      const saved = getCourseProgress(loggedUser);
      if (saved) {
        setCompletedChapters(saved.completedChapters || []);
        setIsPretestCompleted(Boolean(saved.pretestCompleted));
        setPretestAnswers(saved.pretestAnswers || {});
        setIsLabVirtualCompleted(Boolean(saved.labVirtualCompleted));
      }
    } else {
      setCurrentUser(null);
      setCompletedChapters([]);
      setIsPretestCompleted(false);
      setPretestAnswers({});
      setIsLabVirtualCompleted(false);
    }
  }, []);

  // Handler Berhasil Login
  const handleLoginSuccess = (userData) => {
    // 1. Kosongkan state di memori terlebih dahulu agar tidak terbawa dari sesi user sebelumnya
    setCompletedChapters([]);
    setIsPretestCompleted(false);
    setPretestAnswers({});
    setIsLabVirtualCompleted(false);
    setIsPretestLocked(false);

    // 2. Simpan sesi user aktif
    setAuthUser(userData);
    setCurrentUser(userData);

    // 3. Baca progres HANYA dari kunci "kimikoli:v1:<username dinormalisasi>"
    const saved = getCourseProgress(userData);
    const userCompletedChapters = saved?.completedChapters || [];
    const userPretestCompleted = Boolean(saved?.pretestCompleted);
    const userPretestAnswers = saved?.pretestAnswers || {};
    const userLabCompleted = Boolean(saved?.labVirtualCompleted);

    // 4. Set state memori sesuai data pengguna (kosong jika user baru)
    setCompletedChapters(userCompletedChapters);
    setIsPretestCompleted(userPretestCompleted);
    setPretestAnswers(userPretestAnswers);
    setIsLabVirtualCompleted(userLabCompleted);

    // Jangan menyimpan data saat login tanpa ada perubahan dari user
    setCurrentView('home');
  };

  // Handler Logout
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari akun ini?")) {
      clearAuthUser();
      setCurrentUser(null);
      // Bersihkan state agar tidak terbawa ke akun/username lain yang akan login berikutnya
      setCompletedChapters([]);
      setIsPretestCompleted(false);
      setIsPretestLocked(false);
      setPretestAnswers({});
      setIsLabVirtualCompleted(false);
      setCurrentView('home');
    }
  };

  const handleStartPretest = () => {
    setCurrentView('pretest');
    // Jika pretest belum selesai, kunci navigasi
    if (!isPretestCompleted) {
      setIsPretestLocked(true);
    }
  };

  // Callback simpan jawaban pretest per nomor soal secara instan
  const handleSavePretestAnswer = (updatedAnswers) => {
    setPretestAnswers(updatedAnswers);
    const saved = getCourseProgress(currentUser) || {};
    saveCourseProgress({
      ...saved,
      pretestAnswers: updatedAnswers
    }, currentUser);
  };

  // Callback saat pretest selesai dikerjakan (seluruh soal tuntas diperiksa)
  const handleFinishPretest = (result) => {
    setIsPretestLocked(false);
    setIsPretestCompleted(true);

    const score = result?.score ?? 0;
    const total = result?.total ?? 8;
    const finalAnswers = result?.answers || pretestAnswers;
    setPretestAnswers(finalAnswers);

    const saved = getCourseProgress(currentUser) || {};
    saveCourseProgress({
      ...saved,
      pretestCompleted: true,
      pretestScore: score,
      pretestTotal: total,
      pretestAnswers: finalAnswers,
      pretestFinished: true
    }, currentUser);

    if (currentUser && currentUser.role === 'student') {
      saveStudentRecord({
        name: currentUser.name,
        email: currentUser.email,
        className: currentUser.className,
        pretestCompleted: true,
        pretestScore: score,
        pretestTotal: total,
        progressMissions: '1/6 Misi',
        xp: 20
      });
    }
  };

  // Callback reset pretest jika ingin mengulang
  const handleResetPretest = () => {
    setIsPretestCompleted(false);
    setPretestAnswers({});
    const saved = getCourseProgress(currentUser) || {};
    saveCourseProgress({
      ...saved,
      pretestCompleted: false,
      pretestScore: 0,
      pretestAnswers: {},
      pretestFinished: false
    }, currentUser);
  };

  // Fungsi Transisi Menyelesaikan 1 Materi & Otomatis Membuka Materi Berikutnya
  const handleCompleteAndProceed = (completedChapterId, nextChapterId) => {
    let updated = [...completedChapters];
    if (!updated.includes(completedChapterId)) {
      updated.push(completedChapterId);
    }

    // Jika menyelesaikan Bab 5 (materi terakhir), tandai seluruh bab materi 1–5 selesai
    if (completedChapterId === 'chapter5') {
      ['chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5'].forEach(ch => {
        if (!updated.includes(ch)) updated.push(ch);
      });
    }

    setCompletedChapters(updated);

    const saved = getCourseProgress(currentUser) || {};
    saveCourseProgress({
      ...saved,
      completedChapters: updated,
      currentChapter: nextChapterId || completedChapterId
    }, currentUser);

    // Perbarui rekapitulasi nilai dan progres siswa untuk guru
    if (currentUser && currentUser.role === 'student') {
      const missionCount = Math.min(6, (isPretestCompleted ? 1 : 0) + updated.length);
      saveStudentRecord({
        name: currentUser.name,
        className: currentUser.className,
        progressMissions: `${missionCount}/6 Misi`,
        xp: (isPretestCompleted ? 20 : 0) + (updated.length * 30) + (isLabVirtualCompleted ? 40 : 0)
      });
    }

    // Pindah otomatis ke materi selanjutnya!
    if (nextChapterId) {
      setCurrentView(nextChapterId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // =========================================================
  // JIKA BELUM LOGIN: TAMPILKAN HALAMAN LOGIN
  // =========================================================
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // =========================================================
  // JIKA SUDAH LOGIN: TAMPILKAN APLIKASI WEB
  // =========================================================
  return (
    <div className="app-container" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* 1. Navbar KimiKoli dengan Profil & Panel Guru */}
      <Header
        currentView={currentView}
        onSelectTab={(tabId) => {
          if (!isPretestLocked) {
            setCurrentView(tabId);
          }
        }}
        isExamLocked={isPretestLocked}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenTeacherPanel={() => setCurrentView('teacher-dashboard')}
        isPretestCompleted={isPretestCompleted}
        onStartPretest={handleStartPretest}
        isAllMaterialCompleted={isAllMaterialCompleted}
        isLabVirtualCompleted={isLabVirtualCompleted}
      />

      {/* 2. Konten Utama */}
      <main className="content-area" style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
        
        {/* Panel Khusus Guru: Rekapitulasi Data Nilai Siswa */}
        {currentView === 'teacher-dashboard' && (
          <TeacherDashboard
            onBackToLearning={() => setCurrentView('home')}
          />
        )}

        {/* Tampilan 1: Beranda KimiKoli (Peta Misi Dinamis) */}
        {currentView === 'home' && (
          <HomePage
            isPretestDone={isPretestCompleted}
            completedChapters={completedChapters}
            isLabVirtualCompleted={isLabVirtualCompleted}
            onStartPretest={handleStartPretest}
            onGoToChapter={(chapterId) => setCurrentView(chapterId)}
            onGoToLabVirtual={() => setCurrentView('lab-virtual')}
          />
        )}

        {/* Tampilan 2: Soal Pretest Interaktif */}
        {currentView === 'pretest' && (
          <PretestPage
            currentUser={currentUser}
            savedAnswers={pretestAnswers}
            isPretestCompleted={isPretestCompleted}
            onBackToHome={() => {
              setIsPretestLocked(false);
              setCurrentView('home');
            }}
            onGoToChapter1={() => {
              setIsPretestLocked(false);
              setCurrentView('chapter1');
            }}
            onFinishPretest={handleFinishPretest}
            onSaveAnswer={handleSavePretestAnswer}
            onResetPretest={handleResetPretest}
          />
        )}

        {/* Tampilan 3: Bab 1 - Konsentrasi Larutan (Wajib Tuntas Pretest Terlebih Dahulu) */}
        {currentView === 'chapter1' && (
          <div>
            {!isPretestCompleted && currentUser?.role !== 'teacher' ? (
              <div style={{
                background: '#FFFBEB',
                border: '1.5px solid #FDE68A',
                borderRadius: '16px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                margin: '2rem auto',
                maxWidth: '680px'
              }}>
                <div style={{ fontSize: '3.2rem', marginBottom: '0.75rem' }}>🔒</div>
                <h3 style={{ color: '#92400E', fontSize: '1.4rem', margin: '0 0 0.6rem 0' }}>
                  Materi Bab 1 Masih Terkunci
                </h3>
                <p style={{ color: '#78350F', lineHeight: 1.6, margin: '0 auto 1.5rem' }}>
                  Sebagai siswa yang baru bergabung, kamu wajib mengerjakan <strong>Pretest Prasyarat</strong> terlebih dahulu untuk mengukur pemahaman awal sebelum membuka materi Bab 1 dan materi selanjutnya.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleStartPretest}
                    style={{ padding: '0.8rem 1.6rem', fontSize: '1rem', background: '#0284C7' }}
                  >
                    🚀 Mulai Kerjakan Pretest Sekarang →
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentView('home')}
                    style={{ padding: '0.8rem 1.4rem' }}
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentView('home')}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  >
                    ← Kembali ke Peta Misi
                  </button>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                    Bab 1 dari 6: Konsentrasi Larutan & Sifat Koligatif
                  </span>
                </div>

                <Chapter1Page
                  isCompleted={completedChapters.includes('chapter1')}
                  onComplete={() => handleCompleteAndProceed('chapter1', 'chapter2')}
                />
              </div>
            )}
          </div>
        )}

        {/* Tampilan 4: Bab 2 - Penurunan Tekanan Uap & Kenaikan Titik Didih */}
        {currentView === 'chapter2' && (
          <div>
            {!completedChapters.includes('chapter1') && currentUser?.role !== 'teacher' ? (
              <div style={{
                background: '#FFFBEB',
                border: '1.5px solid #FDE68A',
                borderRadius: '16px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                margin: '2rem auto',
                maxWidth: '680px'
              }}>
                <div style={{ fontSize: '3.2rem', marginBottom: '0.75rem' }}>🔒</div>
                <h3 style={{ color: '#92400E', fontSize: '1.4rem', margin: '0 0 0.6rem 0' }}>
                  Bab 2 Masih Terkunci
                </h3>
                <p style={{ color: '#78350F', lineHeight: 1.6, margin: '0 auto 1.5rem' }}>
                  Sesuai alur belajar bertahap, kamu wajib menyelesaikan materi di <strong>Bab 1 (Konsentrasi Larutan)</strong> terlebih dahulu sebelum membuka Bab 2.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentView('chapter1')}
                    style={{ padding: '0.8rem 1.6rem', fontSize: '1rem', background: '#0284C7' }}
                  >
                    📖 Buka Bab 1 Sekarang →
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentView('home')}
                    style={{ padding: '0.8rem 1.4rem' }}
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentView('home')}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  >
                    ← Kembali ke Peta Misi
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('chapter1')}
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  >
                    ← Bab Sebelumnya (Bab 1)
                  </button>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                    Bab 2 dari 6: Penurunan Tekanan Uap & Kenaikan Titik Didih
                  </span>
                </div>

                <Chapter2Page
                  isCompleted={completedChapters.includes('chapter2')}
                  onComplete={() => handleCompleteAndProceed('chapter2', 'chapter3')}
                />
              </div>
            )}
          </div>
        )}

        {/* Tampilan 5: Bab 3 - Penurunan Titik Beku & Diagram Fase P–T */}
        {currentView === 'chapter3' && (
          <div>
            {!completedChapters.includes('chapter2') && currentUser?.role !== 'teacher' ? (
              <div style={{
                background: '#FFFBEB',
                border: '1.5px solid #FDE68A',
                borderRadius: '16px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                margin: '2rem auto',
                maxWidth: '680px'
              }}>
                <div style={{ fontSize: '3.2rem', marginBottom: '0.75rem' }}>🔒</div>
                <h3 style={{ color: '#92400E', fontSize: '1.4rem', margin: '0 0 0.6rem 0' }}>
                  Bab 3 Masih Terkunci
                </h3>
                <p style={{ color: '#78350F', lineHeight: 1.6, margin: '0 auto 1.5rem' }}>
                  Kamu wajib menyelesaikan materi di <strong>Bab 2 (Penurunan Tekanan Uap & Kenaikan Titik Didih)</strong> terlebih dahulu sebelum membuka Bab 3.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentView('chapter2')}
                    style={{ padding: '0.8rem 1.6rem', fontSize: '1rem', background: '#0284C7' }}
                  >
                    📖 Buka Bab 2 Sekarang →
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentView('home')}
                    style={{ padding: '0.8rem 1.4rem' }}
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentView('home')}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  >
                    ← Kembali ke Peta Misi
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('chapter2')}
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  >
                    ← Bab Sebelumnya (Bab 2)
                  </button>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                    Bab 3 dari 6: Penurunan Titik Beku & Diagram Fase P–T
                  </span>
                </div>

                <Chapter3Page
                  isCompleted={completedChapters.includes('chapter3')}
                  onComplete={() => handleCompleteAndProceed('chapter3', 'chapter4')}
                />
              </div>
            )}
          </div>
        )}

        {/* Tampilan 6: Bab 4 - Tekanan Osmotik & Membran Semipermeabel */}
        {currentView === 'chapter4' && (
          <div>
            {!completedChapters.includes('chapter3') && currentUser?.role !== 'teacher' ? (
              <div style={{
                background: '#FFFBEB',
                border: '1.5px solid #FDE68A',
                borderRadius: '16px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                margin: '2rem auto',
                maxWidth: '680px'
              }}>
                <div style={{ fontSize: '3.2rem', marginBottom: '0.75rem' }}>🔒</div>
                <h3 style={{ color: '#92400E', fontSize: '1.4rem', margin: '0 0 0.6rem 0' }}>
                  Bab 4 Masih Terkunci
                </h3>
                <p style={{ color: '#78350F', lineHeight: 1.6, margin: '0 auto 1.5rem' }}>
                  Kamu wajib menyelesaikan materi di <strong>Bab 3 (Penurunan Titik Beku)</strong> terlebih dahulu sebelum membuka Bab 4.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentView('chapter3')}
                    style={{ padding: '0.8rem 1.6rem', fontSize: '1rem', background: '#0284C7' }}
                  >
                    📖 Buka Bab 3 Sekarang →
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentView('home')}
                    style={{ padding: '0.8rem 1.4rem' }}
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentView('home')}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  >
                    ← Kembali ke Peta Misi
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('chapter3')}
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  >
                    ← Bab Sebelumnya (Bab 3)
                  </button>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                    Bab 4 dari 6: Tekanan Osmotik & Membran Semipermeabel
                  </span>
                </div>

                <Chapter4Page
                  isCompleted={completedChapters.includes('chapter4')}
                  onComplete={() => handleCompleteAndProceed('chapter4', 'chapter5')}
                />
              </div>
            )}
          </div>
        )}

        {/* Tampilan 7: Bab 5 - Sifat Koligatif Larutan Elektrolit & van 't Hoff */}
        {currentView === 'chapter5' && (
          <div>
            {!completedChapters.includes('chapter4') && currentUser?.role !== 'teacher' ? (
              <div style={{
                background: '#FFFBEB',
                border: '1.5px solid #FDE68A',
                borderRadius: '16px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                margin: '2rem auto',
                maxWidth: '680px'
              }}>
                <div style={{ fontSize: '3.2rem', marginBottom: '0.75rem' }}>🔒</div>
                <h3 style={{ color: '#92400E', fontSize: '1.4rem', margin: '0 0 0.6rem 0' }}>
                  Bab 5 Masih Terkunci
                </h3>
                <p style={{ color: '#78350F', lineHeight: 1.6, margin: '0 auto 1.5rem' }}>
                  Kamu wajib menyelesaikan materi di <strong>Bab 4 (Tekanan Osmotik)</strong> terlebih dahulu sebelum membuka Bab 5.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentView('chapter4')}
                    style={{ padding: '0.8rem 1.6rem', fontSize: '1rem', background: '#0284C7' }}
                  >
                    📖 Buka Bab 4 Sekarang →
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentView('home')}
                    style={{ padding: '0.8rem 1.4rem' }}
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => setCurrentView('home')}
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  >
                    ← Kembali ke Peta Misi
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentView('chapter4')}
                    className="btn btn-outline"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
                  >
                    ← Bab Sebelumnya (Bab 4)
                  </button>
                  <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                    Bab 5 dari 6: Larutan Elektrolit & Faktor van 't Hoff
                  </span>
                </div>

                <Chapter5Page
                  isCompleted={completedChapters.includes('chapter5')}
                  onComplete={() => handleCompleteAndProceed('chapter5', 'lab-virtual')}
                />
              </div>
            )}
          </div>
        )}

        {/* Tampilan 8: Laboratorium Virtual (Gating: Wajib Selesai Seluruh Teori Bab 1-5) */}
        {currentView === 'lab-virtual' && (
          <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setCurrentView('home')}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              >
                ← Kembali ke Peta Misi
              </button>
              <button
                type="button"
                onClick={() => setCurrentView('chapter5')}
                className="btn btn-outline"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              >
                ← Bab Sebelumnya (Bab 5)
              </button>
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                Tahap 6: Laboratorium Virtual & Eksplorasi Mandiri
              </span>
            </div>

            {!isAllMaterialCompleted ? (
              <div style={{
                background: '#FFFBEB',
                border: '1.5px solid #FDE68A',
                borderRadius: '16px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                margin: '1.5rem 0'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔒</div>
                <h3 style={{ color: '#92400E', margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>
                  Laboratorium Virtual Terbuka Setelah Selesai Materi
                </h3>
                <p style={{ color: '#78350F', maxWidth: '620px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                  Sesuai alur pembelajaran KimiKoli, kamu perlu mempelajari materi teori (Bab 1 sampai Bab 5) terlebih dahulu sebelum melakukan eksperimen mandiri di Laboratorium Virtual.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentView('chapter1')}
                    style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}
                  >
                    📖 Mulai dari Bab 1
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentView('chapter5')}
                    style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem' }}
                  >
                    📖 Buka Bab 5 (Bab Terakhir)
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      // Buka akses langsung bagi siswa yang sudah membaca materi
                      const updated = ['chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5'];
                      setCompletedChapters(updated);
                      const saved = getCourseProgress(currentUser) || {};
                      saveCourseProgress({ ...saved, completedChapters: updated }, currentUser);
                    }}
                    style={{ padding: '0.65rem 1.25rem', fontSize: '0.95rem', background: '#FFFFFF', borderColor: '#10B981', color: '#047857' }}
                  >
                    ✓ Saya Sudah Membaca Materi, Buka Lab Sekarang 🔓
                  </button>
                </div>
              </div>
            ) : (
              <LabVirtualHub
                isCompleted={isLabVirtualCompleted}
                onCompleteLab={() => {
                  setIsLabVirtualCompleted(true);
                  const saved = getCourseProgress(currentUser) || {};
                  saveCourseProgress({
                    ...saved,
                    labVirtualCompleted: true
                  }, currentUser);
                  if (currentUser && currentUser.role === 'student') {
                    saveStudentRecord({
                      name: currentUser.name,
                      className: currentUser.className,
                      progressMissions: '6/6 Misi',
                      xp: (isPretestCompleted ? 20 : 0) + (completedChapters.length * 30) + 40
                    });
                  }
                  setCurrentView('chapter6');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBackToHome={() => setCurrentView('home')}
              />
            )}
          </div>
        )}

        {/* Tampilan 9: Bab 6 - Evaluasi Akhir & Penghargaan (Gating: Wajib Selesai Lab Virtual) */}
        {currentView === 'chapter6' && (
          <div>
            <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setCurrentView('home')}
                className="btn btn-secondary"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              >
                ← Kembali ke Peta Misi
              </button>
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                Tahap 7: Evaluasi Akhir & Capaian Belajar
              </span>
            </div>

            {!isLabVirtualCompleted ? (
              <div style={{
                background: '#FFFBEB',
                border: '1.5px solid #FDE68A',
                borderRadius: '16px',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                margin: '1.5rem 0'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔒</div>
                <h3 style={{ color: '#92400E', margin: '0 0 0.5rem 0', fontSize: '1.4rem' }}>
                  Kuis Evaluasi Akhir Masih Terkunci
                </h3>
                <p style={{ color: '#78350F', maxWidth: '620px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                  Untuk dapat mengakses Kuis Evaluasi Akhir, kamu wajib menuntaskan sesi praktikum di <strong>Laboratorium Virtual</strong> terlebih dahulu setelah menyelesaikan seluruh materi.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setCurrentView('lab-virtual')}
                  >
                    🔬 Buka Laboratorium Virtual →
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setCurrentView('home')}
                  >
                    Kembali ke Beranda
                  </button>
                </div>
              </div>
            ) : (
              <Chapter6Page
                completedChapters={completedChapters}
                onResetProgress={() => {
                  setCompletedChapters([]);
                  setIsPretestCompleted(false);
                  setIsLabVirtualCompleted(false);
                  saveCourseProgress({
                    completedChapters: [],
                    currentChapter: 'chapter1',
                    pretestCompleted: false,
                    pretestScore: 0,
                    pretestTotal: 8,
                    labVirtualCompleted: false
                  }, currentUser);
                  setCurrentView('home');
                }}
              />
            )}
          </div>
        )}

      </main>
    </div>
  );
}
