/**
 * LocalStorage wrapper with safe JSON parsing and error handling.
 * Conforms to KoligatifLab 11 storage specification.
 */

const STORAGE_KEYS = {
  PROGRESS: 'koligatif_progress_v1',
  QUIZ_HISTORY: 'koligatif_quiz_history_v1',
  GAMIFICATION: 'koligatif_gamification_v1',
  LAB_STATE: 'koligatif_lab_state_v1',
  SETTINGS: 'koligatif_user_settings_v1'
};

export function getStoredData(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.warn(`[KoligatifStorage] Error reading key ${key}:`, err);
    return fallback;
  }
}

export function setStoredData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[KoligatifStorage] Error setting key ${key}:`, err);
    return false;
  }
}

export function getCourseProgress() {
  return getStoredData(STORAGE_KEYS.PROGRESS, {
    completedChapters: [],
    currentChapter: 'chapter1',
    milestones: {}
  });
}

export function saveCourseProgress(progress) {
  return setStoredData(STORAGE_KEYS.PROGRESS, progress);
}

export { STORAGE_KEYS };

