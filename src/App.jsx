import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import { getCourseProgress, saveCourseProgress } from './utils/storage';

// Komponen Halaman
import HomePage from './features/home/HomePage';
import PretestPage from './features/pretest/PretestPage';
import Chapter1Page from './features/chapter1-concentration/Chapter1Page';

/**
 * Komponen Utama App
 * 
 * Mengatur alur:
 * - 'home'     : Beranda interaktif KoligatifLab 11 (Hero, Peta Misi, Gamifikasi)
 * - 'pretest'  : Soal Pretest Prasyarat (Mode Ujian Terkunci)
 * - 'chapter1' : Misi 1 & 2 (Materi Konsentrasi Larutan & Simulator Lab Virtual)
 */
export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [completedChapters, setCompletedChapters] = useState([]);
  const [isPretestCompleted, setIsPretestCompleted] = useState(false);
  
  // State penguncian pretest: bernilai true saat pretest berlangsung
  const [isPretestLocked, setIsPretestLocked] = useState(false);

  // Ambil progres tersimpan di peramban
  useEffect(() => {
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

  const handleStartPretest = () => {
    setCurrentView('pretest');
    setIsPretestLocked(true); // Kunci navigasi keluar
  };

  // Callback saat pretest selesai dikerjakan (soal 8 tuntas)
  const handleFinishPretest = () => {
    setIsPretestLocked(false); // Buka kunci navigasi
    setIsPretestCompleted(true);

    // Simpan status ke localStorage agar tidak hilang saat refresh
    const saved = getCourseProgress() || {};
    saveCourseProgress({
      ...saved,
      pretestCompleted: true
    });
  };

  const handleCompleteMission1 = () => {
    if (!completedChapters.includes('chapter1')) {
      const updated = [...completedChapters, 'chapter1'];
      setCompletedChapters(updated);
      const saved = getCourseProgress() || {};
      saveCourseProgress({
        ...saved,
        completedChapters: updated,
        currentChapter: 'chapter1'
      });
    }
  };

  return (
    <div className="app-container">
      {/* 1. Navbar KoligatifLab 11 dengan Proteksi Mode Ujian */}
      <Header
        currentView={currentView}
        onSelectTab={(tabId) => {
          if (!isPretestLocked) {
            setCurrentView(tabId);
          }
        }}
        isExamLocked={isPretestLocked}
      />

      {/* 2. Konten Utama */}
      <main className="content-area" style={{ width: '100%', maxWidth: '1240px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
        {/* Tampilan 1: Beranda KoligatifLab 11 */}
        {currentView === 'home' && (
          <HomePage
            isPretestDone={isPretestCompleted}
            onStartPretest={handleStartPretest}
            onGoToChapter1={() => setCurrentView('chapter1')}
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

        {/* Tampilan 3: Misi Materi Konsentrasi & Lab Virtual */}
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
              <button
                type="button"
                onClick={handleStartPretest}
                className="btn btn-outline"
                style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}
              >
                📝 Buka Kembali Pretest
              </button>
              <span style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>
                Materi Konsentrasi Larutan & Sifat Koligatif
              </span>
            </div>

            <Chapter1Page
              isCompleted={completedChapters.includes('chapter1')}
              onComplete={handleCompleteMission1}
            />
          </div>
        )}
      </main>
    </div>
  );
}
