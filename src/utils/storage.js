/**
 * LocalStorage wrapper with safe JSON parsing and error handling.
 * Conforms to KimiKoli storage specification.
 */

const STORAGE_KEYS = {
  PROGRESS: 'koligatif_progress_v1',
  QUIZ_HISTORY: 'koligatif_quiz_history_v1',
  GAMIFICATION: 'koligatif_gamification_v1',
  LAB_STATE: 'koligatif_lab_state_v1',
  SETTINGS: 'koligatif_user_settings_v1',
  AUTH: 'koligatif_auth_user_v1',
  STUDENTS_DATABASE: 'koligatif_students_database_v1'
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

// Helper untuk mendapatkan key penyimpanan progres berbasis akun pengguna
export function getUserProgressKey(user) {
  if (!user || !user.name) return STORAGE_KEYS.PROGRESS;
  const safeName = encodeURIComponent(user.name.trim().toLowerCase());
  const safeClass = user.className ? encodeURIComponent(user.className.trim().toLowerCase()) : 'default';
  const role = user.role || 'student';
  return `koligatif_progress_${role}_${safeName}_${safeClass}`;
}

// Progres Belajar Sesi Pengguna Tertentu
export function getCourseProgress(user = null) {
  const activeUser = user || getAuthUser();
  const key = getUserProgressKey(activeUser);
  return getStoredData(key, {
    completedChapters: [],
    currentChapter: 'chapter1',
    pretestCompleted: false,
    pretestScore: 0,
    pretestTotal: 8,
    labVirtualCompleted: false
  });
}

export function saveCourseProgress(progress, user = null) {
  const activeUser = user || getAuthUser();
  const key = getUserProgressKey(activeUser);
  return setStoredData(key, progress);
}

// Data Autentikasi Pengguna (Siswa / Guru)
export function getAuthUser() {
  return getStoredData(STORAGE_KEYS.AUTH, null);
}

export function setAuthUser(user) {
  return setStoredData(STORAGE_KEYS.AUTH, user);
}

export function clearAuthUser() {
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    return true;
  } catch (err) {
    return false;
  }
}

// Database Rekap Siswa untuk Panel Guru
export function getAllStudentRecords() {
  return getStoredData(STORAGE_KEYS.STUDENTS_DATABASE, []);
}

export function saveStudentRecord(studentData) {
  const currentList = getAllStudentRecords();
  // Cari apakah siswa dengan nama dan kelas yang sama sudah ada
  const existingIndex = currentList.findIndex(
    s => s.name?.toLowerCase() === studentData.name?.toLowerCase() && s.className === studentData.className
  );

  const updatedRecord = {
    ...studentData,
    lastActive: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
  };

  let newList = [];
  if (existingIndex >= 0) {
    newList = [...currentList];
    newList[existingIndex] = { ...newList[existingIndex], ...updatedRecord };
  } else {
    newList = [updatedRecord, ...currentList];
  }

  setStoredData(STORAGE_KEYS.STUDENTS_DATABASE, newList);
  return newList;
}

export { STORAGE_KEYS };
