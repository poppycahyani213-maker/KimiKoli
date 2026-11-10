/**
 * LocalStorage wrapper with safe JSON parsing and error handling.
 * Conforms to KimiKoli storage specification.
 * 
 * Aturan Penyimpanan:
 * 1. Kunci penyimpanan PER USERNAME: "kimikoli:v1:<username dinormalisasi>"
 *    (huruf kecil, spasi pinggir dihapus). TIDAK ADA kunci global untuk progres.
 * 2. Data awal untuk user baru SELALU KOSONG:
 *    misi selesai [], XP 0, level 1, lencana [], kuis {}, lab {}.
 * 3. Saat login: memuat data milik username bersangkutan atau kosong jika baru.
 * 4. Saat logout: state memori dikosongkan tanpa menghapus data tersimpan user.
 * 5. Simpan HANYA setelah ada perubahan nyata (selesai bab, jawab kuis/pretest, dll).
 * 6. Kunci lama/global dibersihkan otomatis.
 */

const STORAGE_KEYS = {
  AUTH: 'koligatif_auth_user_v1',
  STUDENTS_DATABASE: 'koligatif_students_database_v1',
  USER_PROFILES: 'koligatif_user_profiles_v1'
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

// ========================================================
// 1. NORMALISASI USERNAME & FORMAT KUNCI SPESIFIKASI USER
// ========================================================

/**
 * Menghasilkan username yang dinormalisasi:
 * - Huruf kecil (lowercase)
 * - Spasi di pinggir dihapus (trim)
 */
export function normalizeUsername(userOrName) {
  if (!userOrName) return 'tamu';
  if (typeof userOrName === 'string') {
    return userOrName.trim().toLowerCase();
  }
  const raw = userOrName.username || userOrName.name || (userOrName.email ? userOrName.email.split('@')[0] : '') || 'tamu';
  return String(raw).trim().toLowerCase();
}

/**
 * Kunci penyimpanan progres per user:
 * FORMAT: "kimikoli:v1:<username dinormalisasi>"
 */
export function getUserProgressKey(userOrName) {
  const norm = normalizeUsername(userOrName);
  return `kimikoli:v1:${norm}`;
}

// ========================================================
// 2. DATA AWAL (USER BARU SELALU KOSONG)
// ========================================================

export const getEmptyProgress = () => ({
  completedChapters: [],   // misi selesai []
  xp: 0,                   // XP 0
  level: 1,                // level 1
  badges: [],              // lencana []
  quizHistory: {},         // kuis {}
  labState: {},            // lab {}
  pretestCompleted: false,
  pretestScore: 0,
  pretestTotal: 8,
  pretestAnswers: {},
  pretestFinished: false,
  labVirtualCompleted: false,
  currentChapter: 'chapter1'
});

// ========================================================
// 3. PEMBACAAN & PENYIMPANAN PROGRES BELAJAR
// ========================================================

/**
 * Membaca progres belajar milik username tertentu.
 * Jika belum pernah menyimpan, mengembalikan data awal kosong (DI MEMORI SAJA, TANPA MENULIS KE STORAGE).
 */
export function getCourseProgress(user = null) {
  const activeUser = user || getAuthUser();
  if (!activeUser) return getEmptyProgress();

  const key = getUserProgressKey(activeUser);
  const data = getStoredData(key, null);

  if (data) {
    return {
      ...getEmptyProgress(),
      ...data,
      completedChapters: Array.isArray(data.completedChapters) ? data.completedChapters : [],
      pretestAnswers: data.pretestAnswers || {},
      badges: Array.isArray(data.badges) ? data.badges : [],
      quizHistory: data.quizHistory || {},
      labState: data.labState || {}
    };
  }

  // User baru: kembalikan objek kosong TANPA memanggil setStoredData
  return getEmptyProgress();
}

/**
 * Menyimpan progres belajar HANYA setelah ada perubahan nyata dari user.
 */
export function saveCourseProgress(progress, user = null) {
  const activeUser = user || getAuthUser();
  if (!activeUser) return false;

  const key = getUserProgressKey(activeUser);
  const dataToSave = {
    ...getEmptyProgress(),
    ...progress,
    updatedAt: new Date().toISOString()
  };

  return setStoredData(key, dataToSave);
}

// ========================================================
// 4. PENYIMPANAN JAWABAN LATIHAN BAB (PER USERNAME)
// ========================================================

export function getUserExerciseState(user, exerciseKey, fallback = null) {
  const activeUser = user || getAuthUser();
  if (!activeUser) return fallback;
  const norm = normalizeUsername(activeUser);
  const key = `kimikoli:v1:${norm}:${exerciseKey}`;
  return getStoredData(key, fallback);
}

export function saveUserExerciseState(user, exerciseKey, state) {
  const activeUser = user || getAuthUser();
  if (!activeUser) return false;
  const norm = normalizeUsername(activeUser);
  const key = `kimikoli:v1:${norm}:${exerciseKey}`;
  return setStoredData(key, state);
}

// ========================================================
// 5. PEMBERSIHAN KUNCI LAMA & KUNCI GLOBAL
// ========================================================

export function cleanupLegacyGlobalStorage() {
  try {
    const legacyGlobalKeys = [
      'koligatif_progress_v1',
      'koligatif_quiz_history_v1',
      'koligatif_gamification_v1',
      'koligatif_lab_state_v1',
      'koligatif_ch1_requirements_v1_guest',
      'koligatif_ch1_requirements_v2_guest',
      'koligatif_progress_guest',
      'koligatif_progress_default'
    ];

    legacyGlobalKeys.forEach(k => {
      localStorage.removeItem(k);
    });
  } catch (err) {
    console.warn('[Storage Cleanup] Error clearing legacy keys:', err);
  }
}

// Eksekusi pembersihan kunci global sekali saat inisialisasi aplikasi
if (typeof window !== 'undefined' && window.localStorage) {
  cleanupLegacyGlobalStorage();
}

// ========================================================
// 6. PROFIL PENGGUNA & SESI AKTIF (AUTH)
// ========================================================

export function getAllUserProfiles() {
  return getStoredData(STORAGE_KEYS.USER_PROFILES, {});
}

export function getUserProfile(identifier) {
  if (!identifier) return null;
  const profiles = getAllUserProfiles();
  const cleanId = String(identifier).trim().toLowerCase();

  if (profiles[cleanId]) return profiles[cleanId];

  for (const key of Object.keys(profiles)) {
    const p = profiles[key];
    if (
      (p.email && p.email.toLowerCase() === cleanId) ||
      (p.uid && p.uid === identifier) ||
      (p.name && p.name.toLowerCase() === cleanId)
    ) {
      return p;
    }
  }
  return null;
}

export function saveUserProfile(user) {
  if (!user) return null;
  const profiles = getAllUserProfiles();
  const norm = normalizeUsername(user);
  const existing = profiles[norm] || {};

  const updated = {
    ...existing,
    ...user,
    name: user.name || existing.name || norm,
    username: norm,
    className: user.className || existing.className || 'XI MIPA 1',
    role: user.role || existing.role || 'student',
    updatedAt: new Date().toISOString()
  };

  profiles[norm] = updated;
  if (user.email) profiles[user.email.trim().toLowerCase()] = updated;

  setStoredData(STORAGE_KEYS.USER_PROFILES, profiles);
  return updated;
}

export function getAuthUser() {
  return getStoredData(STORAGE_KEYS.AUTH, null);
}

export function setAuthUser(user) {
  if (user) {
    saveUserProfile(user);
  }
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

// ========================================================
// 7. DATABASE REKAP SISWA (PANEL GURU)
// ========================================================

export function getAllStudentRecords() {
  return getStoredData(STORAGE_KEYS.STUDENTS_DATABASE, []);
}

export function saveStudentRecord(studentData) {
  const currentList = getAllStudentRecords();
  const normName = normalizeUsername(studentData.name);
  const existingIndex = currentList.findIndex(
    s => (s.email && studentData.email && s.email.toLowerCase() === studentData.email.toLowerCase()) ||
         normalizeUsername(s.name) === normName
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
