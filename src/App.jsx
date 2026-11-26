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
import { isTeacherEmail } from './config/teachers';
import { signOut } from 'firebase/auth';
import { auth } from './services/firebase';

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
import KimiKoliModal from './features/home/KimiKoliModal';
import DiagnosticAssessmentPage from './features/diagnostic/DiagnosticAssessmentPage';

// Komponen Peringatan Fitur Terkunci karena Belum Pretest
function LockedPretestNotice({ featureTitle, onStartPretest, onBackHome }) {
  return (
    <div style={{
      background: '#FFFBEB',
      border: '1.5px solid #FDE68A',
      borderRadius: '16px',
      padding: '2.5rem 1.5rem',
      textAlign: 'center',
      margin: '2rem auto',
      maxWidth: '680px',
      boxSizing: 'border-box'
    }}>
      <div style={{ fontSize: '3.2rem', marginBottom: '0.75rem' }}>🔒</div>
      <h3 style={{ color: '#92400E', fontSize: '1.4rem', margin: '0 0 0.6rem 0' }}>
        {featureTitle} Masih Terkunci
      </h3>
      <p style={{ color: '#78350F', lineHeight: 1.6, margin: '0 auto 1.5rem', maxWidth: '520px', fontSize: '1rem' }}>
        Kerjakan pretest terlebih dahulu untuk membuka <strong>{featureTitle}</strong> dan seluruh fitur pembelajaran di KimiKoli.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onStartPretest}
          style={{ padding: '0.75rem 1.6rem', fontSize: '0.95rem', background: '#0284C7' }}
        >
          🚀 Kerjakan Pretest Terlebih Dahulu →
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onBackHome}
          style={{ padding: '0.75rem 1.4rem', fontSize: '0.95rem' }}
        >
          Kembali ke Beranda
        </button>
      </div>
    </div>
  );
}

// Komponen Navigasi Pilihan Bab & Fitur Non-Sekuensial yang Responsif
function ChapterNavBar({ currentView, completedChapters = [], onSelectView }) {
  const chapters = [
    { id: 'chapter1', num: 1, label: 'Bab 1' },
    { id: 'chapter2', num: 2, label: 'Bab 2' },
    { id: 'chapter3', num: 3, label: 'Bab 3' },
    { id: 'chapter4', num: 4, label: 'Bab 4' },
    { id: 'chapter5', num: 5, label: 'Bab 5' },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginBottom: '1.25rem',
      background: '#FFFFFF',
      padding: '0.6rem 0.85rem',
      borderRadius: '14px',
      border: '1px solid #E2E8F0',
      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
      boxSizing: 'border-box',
      width: '100%'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => onSelectView('home')}
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.82rem' }}
        >
          ← Peta Misi
        </button>
        <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700, marginLeft: '0.2rem' }}>
          Pilih Bab:
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
          {chapters.map((ch) => {
            const isCurrent = currentView === ch.id;
            const isDone = completedChapters.includes(ch.id);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  onSelectView(ch.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: isCurrent ? '1.5px solid #0284C7' : (isDone ? '1px solid #A7F3D0' : '1px solid #CBD5E1'),
                  background: isCurrent ? '#0284C7' : (isDone ? '#ECFDF5' : '#F8FAFC'),
                  color: isCurrent ? '#FFFFFF' : (isDone ? '#065F46' : '#334155'),
                  transition: 'all 0.15s ease',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
                title={`Buka ${ch.label}${isDone ? ' (Sudah Selesai)' : ' (Bebas Dipelajari)'}`}
              >
                {isDone ? `✓ ${ch.label}` : ch.label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => {
            onSelectView('lab-virtual');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            padding: '0.35rem 0.65rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: currentView === 'lab-virtual' ? '1.5px solid #0284C7' : '1px solid #BAE6FD',
            background: currentView === 'lab-virtual' ? '#0284C7' : '#F0F9FF',
            color: currentView === 'lab-virtual' ? '#FFFFFF' : '#0369A1',
            fontFamily: "'Times New Roman', Times, serif"
          }}
          title="Buka Laboratorium Virtual"
        >
          🔬 Lab Virtual
        </button>
        <button
          type="button"
          onClick={() => {
            onSelectView('diagnostik');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            padding: '0.35rem 0.65rem',
            borderRadius: '8px',
            fontSize: '0.8rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: (currentView === 'diagnostik' || currentView === 'chapter6') ? '1.5px solid #0284C7' : '1px solid #FEF3C7',
            background: (currentView === 'diagnostik' || currentView === 'chapter6') ? '#0284C7' : '#FFFBEB',
            color: (currentView === 'diagnostik' || currentView === 'chapter6') ? '#FFFFFF' : '#B45309',
            fontFamily: "'Times New Roman', Times, serif"
          }}
          title="Buka Evaluasi Akhir"
        >
          🏆 Evaluasi Akhir
        </button>
      </div>
    </div>
  );
}

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
  const [diagnosticAssessment, setDiagnosticAssessment] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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
      // Pastikan peran guru selalu divalidasi ulang dari email (sumber tunggal kebenaran)
      const validRole = isTeacherEmail(loggedUser.email) ? 'teacher' : 'student';
      const safeUser = { ...loggedUser, role: validRole };
      setCurrentUser(safeUser);
      const saved = getCourseProgress(safeUser);
      if (saved) {
        setCompletedChapters(saved.completedChapters || []);
        setIsPretestCompleted(Boolean(saved.pretestCompleted));
        setPretestAnswers(saved.pretestAnswers || {});
        setIsLabVirtualCompleted(Boolean(saved.labVirtualCompleted));
        setDiagnosticAssessment(saved.diagnosticAssessment || null);
      }
    } else {
      setCurrentUser(null);
      setCompletedChapters([]);
      setIsPretestCompleted(false);
      setPretestAnswers({});
      setIsLabVirtualCompleted(false);
      setDiagnosticAssessment(null);
    }
  }, []);

  // Handler Berhasil Login
  const handleLoginSuccess = (userData) => {
    // Validasi peran: hanya menjadi 'teacher' jika login dengan data role guru DAN email terdaftar sebagai guru
    const isTeacher = userData?.role === 'teacher' && isTeacherEmail(userData?.email);
    const resolvedRole = isTeacher ? 'teacher' : 'student';
    const enrichedUser = { ...userData, role: resolvedRole };

    // 1. Kosongkan state di memori terlebih dahulu agar tidak terbawa dari sesi user sebelumnya
    setCompletedChapters([]);
    setIsPretestCompleted(false);
    setPretestAnswers({});
    setIsLabVirtualCompleted(false);
    setDiagnosticAssessment(null);
    setIsPretestLocked(false);

    // 2. Simpan sesi user aktif
    setAuthUser(enrichedUser);
    setCurrentUser(enrichedUser);

    // 3. Baca progres HANYA dari kunci "kimikoli:v1:<username dinormalisasi>"
    const saved = getCourseProgress(enrichedUser);
    const userCompletedChapters = saved?.completedChapters || [];
    const userPretestCompleted = Boolean(saved?.pretestCompleted);
    const userPretestAnswers = saved?.pretestAnswers || {};
    const userLabCompleted = Boolean(saved?.labVirtualCompleted);
    const userDiagnostic = saved?.diagnosticAssessment || null;

    // 4. Set state memori sesuai data pengguna (kosong jika user baru)
    setCompletedChapters(userCompletedChapters);
    setIsPretestCompleted(userPretestCompleted);
    setPretestAnswers(userPretestAnswers);
    setIsLabVirtualCompleted(userLabCompleted);
    setDiagnosticAssessment(userDiagnostic);

    // Arahkan ke Dashboard sesuai role masing-masing:
    // Guru -> Dashboard Guru ('teacher-dashboard')
    // Siswa -> Dashboard Siswa / Beranda ('home')
    if (resolvedRole === 'teacher') {
      setCurrentView('teacher-dashboard');
    } else {
      setCurrentView('home');
    }
  };

  // Handler Logout
  const handleLogout = async () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari akun ini?")) {
      if (auth) {
        try { await signOut(auth); } catch {}
      }
      clearAuthUser();
      setCurrentUser(null);
      // Bersihkan state agar tidak terbawa ke akun/username lain yang akan login berikutnya
      setCompletedChapters([]);
      setIsPretestCompleted(false);
      setIsPretestLocked(false);
      setPretestAnswers({});
      setIsLabVirtualCompleted(false);
      setDiagnosticAssessment(null);
      setCurrentView('home');
    }
  };

  // Handler Simpan Hasil Asesmen Diagnostik
  const handleSaveDiagnosticResult = (diagResult) => {
    setDiagnosticAssessment(diagResult);
    const saved = getCourseProgress(currentUser) || {};
    saveCourseProgress({
      ...saved,
      diagnosticAssessment: diagResult
    }, currentUser);

    if (currentUser && currentUser.role === 'student') {
      saveStudentRecord({
        name: currentUser.name,
        email: currentUser.email,
        className: currentUser.className,
        diagnosticScore: diagResult?.latestScore ?? 0,
        diagnosticXp: diagResult?.xpEarned ?? 0
      });
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
    const isAllAnswered = Object.keys(updatedAnswers || {}).length >= 8;
    if (isAllAnswered) {
      setIsPretestCompleted(true);
      setIsPretestLocked(false);
    }
    const saved = getCourseProgress(currentUser) || {};
    saveCourseProgress({
      ...saved,
      pretestAnswers: updatedAnswers,
      ...(isAllAnswered ? { pretestCompleted: true, pretestFinished: true } : {})
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
          if (!isPretestLocked || currentUser?.role === 'teacher') {
            if (tabId === 'chapter1' && currentUser?.role !== 'teacher') {
              if (currentView.startsWith('chapter') && currentView !== 'chapter6') {
                // Tetap di bab yang sedang dibuka jika siswa klik tab 'Materi' saat membaca bab
              } else {
                setCurrentView('chapter1');
              }
            } else {
              setCurrentView(tabId);
            }
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
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      {/* 2. Konten Utama */}
      <main className="content-area" style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
        
        {/* Panel Khusus Guru: Rekapitulasi Data Nilai Siswa (Hanya untuk Guru Terverifikasi) */}
        {currentView === 'teacher-dashboard' && (
          currentUser?.role === 'teacher' ? (
            <TeacherDashboard
              onBackToLearning={() => setCurrentView('home')}
            />
          ) : (
            <div style={{
              background: '#FEF2F2',
              border: '1.5px solid #FECACA',
              borderRadius: '16px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              margin: '2rem auto',
              maxWidth: '680px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>⛔</div>
              <h3 style={{ color: '#991B1B', fontSize: '1.4rem', margin: '0 0 0.6rem 0' }}>
                Akses Ditolak
              </h3>
              <p style={{ color: '#7F1D1D', lineHeight: 1.6, margin: '0 auto 1.5rem' }}>
                Anda tidak memiliki izin untuk mengakses <strong>Panel Rekap Nilai Siswa</strong>. Halaman ini hanya diperuntukkan bagi Guru Kimia yang telah terverifikasi secara sah.
              </p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setCurrentView('home')}
                style={{ padding: '0.75rem 1.6rem', background: '#0284C7' }}
              >
                Kembali ke Beranda Siswa
              </button>
            </div>
          )
        )}

        {/* Tampilan 1: Beranda KimiKoli (Peta Misi Dinamis) */}
        {currentView === 'home' && (
          <HomePage
            currentUser={currentUser}
            isPretestDone={isPretestCompleted}
            completedChapters={completedChapters}
            isLabVirtualCompleted={isLabVirtualCompleted}
            diagnosticAssessment={diagnosticAssessment}
            onStartPretest={handleStartPretest}
            onGoToChapter={(chapterId) => setCurrentView(chapterId)}
            onGoToLabVirtual={() => setCurrentView('lab-virtual')}
            onGoToDiagnostic={() => setCurrentView('diagnostik')}
            onOpenInfoModal={() => setIsInfoModalOpen(true)}
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
              const saved = getCourseProgress(currentUser) || {};
              if (saved.pretestCompleted || saved.pretestFinished || Object.keys(pretestAnswers || {}).length >= 8) {
                setIsPretestCompleted(true);
              }
              setCurrentView('home');
            }}
            onGoToChapter1={() => {
              setIsPretestLocked(false);
              setIsPretestCompleted(true);
              const saved = getCourseProgress(currentUser) || {};
              saveCourseProgress({
                ...saved,
                pretestCompleted: true,
                pretestFinished: true
              }, currentUser);
              setCurrentView('chapter1');
            }}
            onFinishPretest={handleFinishPretest}
            onSaveAnswer={handleSavePretestAnswer}
            onResetPretest={handleResetPretest}
          />
        )}

        {/* Tampilan 3: Bab 1 - Konsentrasi Larutan */}
        {currentView === 'chapter1' && (
          <div>
            {!isPretestCompleted && currentUser?.role !== 'teacher' ? (
              <LockedPretestNotice
                featureTitle="Materi Bab 1 (Konsentrasi Larutan)"
                onStartPretest={handleStartPretest}
                onBackHome={() => setCurrentView('home')}
              />
            ) : (
              <div>
                <ChapterNavBar
                  currentView="chapter1"
                  completedChapters={completedChapters}
                  onSelectView={(v) => setCurrentView(v)}
                />
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
            {!isPretestCompleted && currentUser?.role !== 'teacher' ? (
              <LockedPretestNotice
                featureTitle="Materi Bab 2 (Tekanan Uap & Titik Didih)"
                onStartPretest={handleStartPretest}
                onBackHome={() => setCurrentView('home')}
              />
            ) : (
              <div>
                <ChapterNavBar
                  currentView="chapter2"
                  completedChapters={completedChapters}
                  onSelectView={(v) => setCurrentView(v)}
                />
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
            {!isPretestCompleted && currentUser?.role !== 'teacher' ? (
              <LockedPretestNotice
                featureTitle="Materi Bab 3 (Penurunan Titik Beku)"
                onStartPretest={handleStartPretest}
                onBackHome={() => setCurrentView('home')}
              />
            ) : (
              <div>
                <ChapterNavBar
                  currentView="chapter3"
                  completedChapters={completedChapters}
                  onSelectView={(v) => setCurrentView(v)}
                />
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
            {!isPretestCompleted && currentUser?.role !== 'teacher' ? (
              <LockedPretestNotice
                featureTitle="Materi Bab 4 (Tekanan Osmotik)"
                onStartPretest={handleStartPretest}
                onBackHome={() => setCurrentView('home')}
              />
            ) : (
              <div>
                <ChapterNavBar
                  currentView="chapter4"
                  completedChapters={completedChapters}
                  onSelectView={(v) => setCurrentView(v)}
                />
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
            {!isPretestCompleted && currentUser?.role !== 'teacher' ? (
              <LockedPretestNotice
                featureTitle="Materi Bab 5 (Larutan Elektrolit)"
                onStartPretest={handleStartPretest}
                onBackHome={() => setCurrentView('home')}
              />
            ) : (
              <div>
                <ChapterNavBar
                  currentView="chapter5"
                  completedChapters={completedChapters}
                  onSelectView={(v) => setCurrentView(v)}
                />
                <Chapter5Page
                  isCompleted={completedChapters.includes('chapter5')}
                  onComplete={() => handleCompleteAndProceed('chapter5', 'lab-virtual')}
                />
              </div>
            )}
          </div>
        )}

        {/* Tampilan 8: Laboratorium Virtual */}
        {currentView === 'lab-virtual' && (
          <div>
            {!isPretestCompleted && currentUser?.role !== 'teacher' ? (
              <LockedPretestNotice
                featureTitle="Laboratorium Virtual"
                onStartPretest={handleStartPretest}
                onBackHome={() => setCurrentView('home')}
              />
            ) : (
              <div>
                <ChapterNavBar
                  currentView="lab-virtual"
                  completedChapters={completedChapters}
                  onSelectView={(v) => setCurrentView(v)}
                />
                <LabVirtualHub
                  currentUser={currentUser}
                  isCompleted={isLabVirtualCompleted || currentUser?.role === 'teacher'}
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
              </div>
            )}
          </div>
        )}

        {/* Tampilan 9: Evaluasi Akhir Sifat Koligatif */}
        {(currentView === 'chapter6' || currentView === 'diagnostik') && (
          <div>
            {!isPretestCompleted && currentUser?.role !== 'teacher' ? (
              <LockedPretestNotice
                featureTitle="Evaluasi Akhir Sifat Koligatif"
                onStartPretest={handleStartPretest}
                onBackHome={() => setCurrentView('home')}
              />
            ) : (
              <div>
                <ChapterNavBar
                  currentView="diagnostik"
                  completedChapters={completedChapters}
                  onSelectView={(v) => setCurrentView(v)}
                />
                <DiagnosticAssessmentPage
                  currentUser={currentUser}
                  savedProgress={diagnosticAssessment}
                  onSaveResult={handleSaveDiagnosticResult}
                  onBackToHome={() => setCurrentView('home')}
                />
              </div>
            )}
          </div>
        )}

      </main>

      {/* Modal Popup Informasi Website & Manual Penggunaan KimiKoli */}
      <KimiKoliModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
