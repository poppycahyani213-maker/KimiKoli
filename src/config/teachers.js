// src/config/teachers.js

/**
 * Daftar email resmi guru yang diizinkan mengakses Mode Guru.
 * Masukkan email guru di sini (huruf kecil).
 */
export const TEACHER_EMAILS = [
  'poppycahyani213@gmail.com',
  'guru@kimikoli.sch.id'
];

/**
 * Cek apakah sebuah email terdaftar sebagai guru.
 * HANYA mengembalikan true jika email secara eksplisit terdaftar di TEACHER_EMAILS.
 * Siswa atau email lain SELALU mengembalikan false.
 */
export const isTeacherEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const clean = email.toLowerCase().trim();
  return TEACHER_EMAILS.some(t => t.toLowerCase().trim() === clean);
};

/**
 * Hash SHA-256 rahasia sandi langkah ke-2 guru (kimiaasik).
 * Tidak menyimpan teks asli password secara terang-terangan di kode atau publikasi.
 */
const TEACHER_AUTH_HASH = '0f00d11c8c7c0651f29907060a37684fd47a8ee87cb221480fb1fea5d634badc';

/**
 * Verifikasi keamanan langkah kedua (2-step verification) khusus guru.
 */
export async function verifyTeacherStepTwo(inputKey) {
  if (!inputKey) return false;
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(inputKey.trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex === TEACHER_AUTH_HASH;
  } catch {
    return false;
  }
}
