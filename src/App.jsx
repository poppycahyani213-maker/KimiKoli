import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import CourseSidebar from './components/layout/CourseSidebar';
import { COURSE_CHAPTERS } from './data/courseChapters';
import { getCourseProgress, saveCourseProgress } from './utils/storage';

// Chapter pages
import Chapter1Page from './features/chapter1-concentration/Chapter1Page';
import Chapter2Page from './features/chapter2-vapor-boiling/Chapter2Page';
import Chapter3Page from './features/chapter3-freezing-phase/Chapter3Page';
import Chapter4Page from './features/chapter4-osmosis/Chapter4Page';
import Chapter5Page from './features/chapter5-electrolyte/Chapter5Page';
import Chapter6Page from './features/chapter6-evaluation/Chapter6Page';

export default function App() {
  const [activeChapterId, setActiveChapterId] = useState('chapter1');
  const [completedChapters, setCompletedChapters] = useState([]);

  // Load progress from localStorage on initial render
  useEffect(() => {
    const saved = getCourseProgress();
    if (saved) {
      if (saved.completedChapters) setCompletedChapters(saved.completedChapters);
      if (saved.currentChapter) setActiveChapterId(saved.currentChapter);
    }
  }, []);

  // Save progress whenever changed
  const updateProgress = (newCompleted, nextChapterId) => {
    setCompletedChapters(newCompleted);
    if (nextChapterId) setActiveChapterId(nextChapterId);
    saveCourseProgress({
      completedChapters: newCompleted,
      currentChapter: nextChapterId || activeChapterId
    });
  };

  const handleMarkComplete = (chapterId, nextChapterId) => {
    if (!completedChapters.includes(chapterId)) {
      const updated = [...completedChapters, chapterId];
      updateProgress(updated, nextChapterId);
    } else if (nextChapterId) {
      setActiveChapterId(nextChapterId);
    }
  };

  const handleResetProgress = () => {
    updateProgress([], 'chapter1');
  };

  const currentChapter = COURSE_CHAPTERS.find(c => c.id === activeChapterId) || COURSE_CHAPTERS[0];

  return (
    <div className="app-container">
      <Header currentChapterNumber={currentChapter.number} totalChapters={COURSE_CHAPTERS.length} />
      <div className="main-layout">
        <CourseSidebar
          activeChapterId={activeChapterId}
          onSelectChapter={(id) => {
            setActiveChapterId(id);
            saveCourseProgress({ completedChapters, currentChapter: id });
          }}
          completedChapters={completedChapters}
        />
        <main className="content-area">
          {activeChapterId === 'chapter1' && (
            <Chapter1Page
              isCompleted={completedChapters.includes('chapter1')}
              onComplete={() => handleMarkComplete('chapter1', 'chapter2')}
            />
          )}
          {activeChapterId === 'chapter2' && (
            <Chapter2Page
              isCompleted={completedChapters.includes('chapter2')}
              onComplete={() => handleMarkComplete('chapter2', 'chapter3')}
            />
          )}
          {activeChapterId === 'chapter3' && (
            <Chapter3Page
              isCompleted={completedChapters.includes('chapter3')}
              onComplete={() => handleMarkComplete('chapter3', 'chapter4')}
            />
          )}
          {activeChapterId === 'chapter4' && (
            <Chapter4Page
              isCompleted={completedChapters.includes('chapter4')}
              onComplete={() => handleMarkComplete('chapter4', 'chapter5')}
            />
          )}
          {activeChapterId === 'chapter5' && (
            <Chapter5Page
              isCompleted={completedChapters.includes('chapter5')}
              onComplete={() => handleMarkComplete('chapter5', 'chapter6')}
            />
          )}
          {activeChapterId === 'chapter6' && (
            <Chapter6Page
              completedChapters={completedChapters}
              onResetProgress={handleResetProgress}
            />
          )}
        </main>
      </div>
    </div>
  );
}

