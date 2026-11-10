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
// MANAJEMEN PROFIL AKUN PENGGUNA (PERMANEN ANTAR SESI)
// ========================================================

export function getAllUserProfiles() {
  return getStoredData(STORAGE_KEYS.USER_PROFILES, {});
}

export function getUserProfile(identifier) {
  if (!identifier) return null;
  const profiles = getAllUserProfiles();
  const cleanId = String(identifier).trim().toLowerCase();

  // Cari berdasarkan email, uid, atau nama
  if (profiles[cleanId]) return profiles[cleanId];

  // Cari dalam nilai objek jika identifier adalah email atau uid atau name
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
  const cleanEmail = user.email ? user.email.trim().toLowerCase() : null;
  const cleanUid = user.uid ? String(user.uid).trim() : null;
  const profileKey = cleanEmail || cleanUid || (user.name ? `${user.name}_${user.className || 'default'}`.toLowerCase() : 'guest');

  const existing = profiles[profileKey] || getUserProfile(cleanEmail) || getUserProfile(cleanUid) || {};

  const updated = {
    ...existing,
    ...user,
    // Pertahankan nama lengkap & kelas jika yang baru null/default
    name: user.name && user.name !== user.email?.split('@')[0] ? user.name : (existing.name || user.name),
    className: user.className && user.className !== 'XI MIPA 1' ? user.className : (existing.className || user.className || 'XI MIPA 1'),
    role: user.role || existing.role || 'student',
    updatedAt: new Date().toISOString()
  };

  profiles[profileKey] = updated;
  if (cleanEmail && cleanEmail !== profileKey) profiles[cleanEmail] = updated;
  if (cleanUid && cleanUid !== profileKey) profiles[cleanUid] = updated;

  setStoredData(STORAGE_KEYS.USER_PROFILES, profiles);
  return updated;
}

// ========================================================
// IDENTIFIER AKUN UNIK & STABIL
// ========================================================

export function getUserAccountKey(user) {
  if (!user) return 'guest';

  // 1. Prioritaskan Email (paling stabil & unik antar perangkat / login ulang)
  if (user.email && user.email.trim()) {
    const cleanEmail = user.email.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '_');
    return `account_${cleanEmail}`;
  }

  // 2. Jika login via UID
  if (user.uid && String(user.uid).trim()) {
    const cleanUid = String(user.uid).trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    return `uid_${cleanUid}`;
  }

  // 3. Fallback: Nama & Kelas (Mode Cepat / Demonstrasi)
  if (user.name && user.name.trim()) {
    const safeName = encodeURIComponent(user.name.trim().toLowerCase());
    const safeClass = user.className ? encodeURIComponent(user.className.trim().toLowerCase()) : 'default';
    const role = user.role || 'student';
    return `${role}_${safeName}_${safeClass}`;
  }

  return 'guest';
}

// Helper untuk kompatibilitas key lama
export function getUserProgressKey(user) {
  if (!user || !user.name) return STORAGE_KEYS.PROGRESS;
  const safeName = encodeURIComponent(user.name.trim().toLowerCase());
  const safeClass = user.className ? encodeURIComponent(user.className.trim().toLowerCase()) : 'default';
  const role = user.role || 'student';
  return `koligatif_progress_${role}_${safeName}_${safeClass}`;
}

// ========================================================
// PROGRES KURSUS & JAWABAN PRETEST
// ========================================================

const DEFAULT_PROGRESS = {
  completedChapters: [],
  currentChapter: 'chapter1',
  pretestCompleted: false,
  pretestScore: 0,
  pretestTotal: 8,
  pretestAnswers: {}, // { [questionId]: { chosenKey, isCorrect } }
  pretestFinished: false,
  labVirtualCompleted: false
};

export function getCourseProgress(user = null) {
  const activeUser = user || getAuthUser();
  if (!activeUser) return { ...DEFAULT_PROGRESS };

  const accountKey = getUserAccountKey(activeUser);
  const primaryKey = `koligatif_progress_v2_${accountKey}`;

  // 1. Cek penyimpanan utama v2
  const primaryData = getStoredData(primaryKey, null);
  if (primaryData) {
    return {
      ...DEFAULT_PROGRESS,
      ...primaryData,
      pretestAnswers: primaryData.pretestAnswers || {}
    };
  }

  // 2. Fallback pencarian data lama untuk migrasi transparan
  const legacyKeys = [
    getUserProgressKey(activeUser),
    activeUser.email ? `koligatif_progress_account_${activeUser.email.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '_')}` : null,
    activeUser.uid ? `koligatif_progress_uid_${String(activeUser.uid).replace(/[^a-zA-Z0-9_-]/g, '_')}` : null,
    STORAGE_KEYS.PROGRESS
  ].filter(Boolean);

  for (const legKey of legacyKeys) {
    const legData = getStoredData(legKey, null);
    if (legData && (legData.completedChapters?.length > 0 || legData.pretestCompleted || legData.pretestAnswers)) {
      const merged = {
        ...DEFAULT_PROGRESS,
        ...legData,
        pretestAnswers: legData.pretestAnswers || {}
      };
      // Simpan langsung ke primary key
      setStoredData(primaryKey, merged);
      return merged;
    }
  }

  return { ...DEFAULT_PROGRESS };
}

export function saveCourseProgress(progress, user = null) {
  const activeUser = user || getAuthUser();
  if (!activeUser) return false;

  const accountKey = getUserAccountKey(activeUser);
  const primaryKey = `koligatif_progress_v2_${accountKey}`;
  const legacyKey = getUserProgressKey(activeUser);

  const merged = {
    ...DEFAULT_PROGRESS,
    ...progress
  };

  // Simpan ke kunci utama v2 dan sinkronkan ke kunci lama
  const ok1 = setStoredData(primaryKey, merged);
  setStoredData(legacyKey, merged);
  return ok1;
}

// ========================================================
// PENYIMPANAN JAWABAN LATIHAN & REFLEKSI SETIAP BAB
// ========================================================

export function getUserExerciseState(user, exerciseKey, fallback = null) {
  const activeUser = user || getAuthUser();
  if (!activeUser) return fallback;
  const accountKey = getUserAccountKey(activeUser);
  const key = `koligatif_exercise_${accountKey}_${exerciseKey}`;
  return getStoredData(key, fallback);
}

export function saveUserExerciseState(user, exerciseKey, state) {
  const activeUser = user || getAuthUser();
  if (!activeUser) return false;
  const accountKey = getUserAccountKey(activeUser);
  const key = `koligatif_exercise_${accountKey}_${exerciseKey}`;
  return setStoredData(key, state);
}

// ========================================================
// DATA AUTENTIKASI PENGGUNA (SESI AKTIF)
// ========================================================

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
// DATABASE REKAP SISWA UNTUK PANEL GURU
// ========================================================

export function getAllStudentRecords() {
  return getStoredData(STORAGE_KEYS.STUDENTS_DATABASE, []);
}

export function saveStudentRecord(studentData) {
  const currentList = getAllStudentRecords();
  const existingIndex = currentList.findIndex(
    s => (s.email && studentData.email && s.email.toLowerCase() === studentData.email.toLowerCase()) ||
         (s.name?.toLowerCase() === studentData.name?.toLowerCase() && s.className === studentData.className)
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
