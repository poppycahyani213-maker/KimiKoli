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

  // Ambil sesi login dan progres saat pertama kali dimuat
  useEffect(() => {
    const loggedUser = getAuthUser();
    if (loggedUser) {
      setCurrentUser(loggedUser);
    }

    const saved = getCourseProgress();
    if (saved) {
      if (saved.completedChapters) {
        setCompletedChapters(saved.completedChapters);
      }
      if (saved.pretestCompleted) {
        setIsPretestCompleted(true);
      }
    }
  }, []);

  // Handler Berhasil Login
  const handleLoginSuccess = (userData) => {
    setAuthUser(userData);
    setCurrentUser(userData);

    if (userData.role === 'student') {
      saveStudentRecord({
        name: userData.name,
        className: userData.className,
        pretestCompleted: isPretestCompleted,
        pretestScore: 0,
        pretestTotal: 8,
        progressMissions: isPretestCompleted ? `${1 + completedChapters.length}/6 Misi` : '0/6 Misi'
      });
    }

    setCurrentView('home');
  };

  // Handler Logout
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari akun ini?")) {
      clearAuthUser();
      setCurrentUser(null);
      setCurrentView('home');
      setIsPretestLocked(false);
    }
  };

  const handleStartPretest = () => {
    setCurrentView('pretest');
    setIsPretestLocked(true);
  };

  // Callback saat pretest selesai dikerjakan (soal 8 tuntas)
  const handleFinishPretest = (result) => {
    setIsPretestLocked(false);
    setIsPretestCompleted(true);

    const score = result?.score || 0;
    const total = result?.total || 8;

    const saved = getCourseProgress() || {};
    saveCourseProgress({
      ...saved,
      pretestCompleted: true,
      pretestScore: score,
      pretestTotal: total
    });

    if (currentUser && currentUser.role === 'student') {
      saveStudentRecord({
        name: currentUser.name,
        className: currentUser.className,
        pretestCompleted: true,
        pretestScore: score,
        pretestTotal: total,
        progressMissions: '1/6 Misi',
        xp: 20
      });
    }
  };

  // Fungsi Transisi Menyelesaikan 1 Materi & Otomatis Membuka Materi Berikutnya
  const handleCompleteAndProceed = (completedChapterId, nextChapterId) => {
    let updated = [...completedChapters];
    if (!updated.includes(completedChapterId)) {
      updated.push(completedChapterId);
      setCompletedChapters(updated);
    }

    const saved = getCourseProgress() || {};
    saveCourseProgress({
      ...saved,
      completedChapters: updated,
      currentChapter: nextChapterId || completedChapterId
    });

    // Perbarui rekapitulasi nilai dan progres siswa untuk guru
    if (currentUser && currentUser.role === 'student') {
      const missionCount = Math.min(6, 1 + updated.length);
      saveStudentRecord({
        name: currentUser.name,
        className: currentUser.className,
        progressMissions: `${missionCount}/6 Misi`,
        xp: 20 + updated.length * 30
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
            onStartPretest={handleStartPretest}
            onGoToChapter={(chapterId) => setCurrentView(chapterId)}
          />
        )}

        {/* Tampilan 2: Soal Pretest Interaktif */}
        {currentView === 'pretest' && (
          <PretestPage
            onBackToHome={() => {
              setIsPretestLocked(false);
              setCurrentView('home');
            }}
            onGoToChapter1={() => {
              setIsPretestLocked(false);
              setCurrentView('chapter1');
            }}
            onFinishPretest={handleFinishPretest}
          />
        )}

        {/* Tampilan 3: Bab 1 - Konsentrasi Larutan & Lab Virtual */}
        {currentView === 'chapter1' && (
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

        {/* Tampilan 4: Bab 2 - Penurunan Tekanan Uap & Kenaikan Titik Didih */}
        {currentView === 'chapter2' && (
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

        {/* Tampilan 5: Bab 3 - Penurunan Titik Beku & Diagram Fase P–T */}
        {currentView === 'chapter3' && (
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

        {/* Tampilan 6: Bab 4 - Tekanan Osmotik & Membran Semipermeabel */}
        {currentView === 'chapter4' && (
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

        {/* Tampilan 7: Bab 5 - Sifat Koligatif Larutan Elektrolit & van 't Hoff */}
        {currentView === 'chapter5' && (
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
              onComplete={() => handleCompleteAndProceed('chapter5', 'chapter6')}
            />
          </div>
        )}

        {/* Tampilan 8: Bab 6 - Evaluasi Akhir & Penghargaan */}
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
                Bab 6 dari 6: Evaluasi Akhir & Capaian Belajar
              </span>
            </div>

            <Chapter6Page
              completedChapters={completedChapters}
              onResetProgress={() => {
                setCompletedChapters([]);
                setIsPretestCompleted(false);
                const saved = getCourseProgress() || {};
                saveCourseProgress({
                  ...saved,
                  completedChapters: [],
                  pretestCompleted: false
                });
                setCurrentView('home');
              }}
            />
          </div>
        )}

      </main>
    </div>
  );
}
