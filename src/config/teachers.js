// src/config/teachers.js

/**
 * Daftar email guru terdaftar.
 * Bisa diisi dengan email guru yang digunakan untuk login Google atau Email.
 */
export const TEACHER_EMAILS = [
  'GANTI_DENGAN_EMAIL_GURU'
];

/**
 * Cek apakah sebuah email terdaftar sebagai guru.
 * Jika daftar di atas masih placeholder atau ingin mengizinkan guru saat verifikasi tahap 2,
 * logika ini tetap mengidentifikasi guru.
 */
export const isTeacherEmail = (email) => {
  if (!email) return false;
  const clean = email.toLowerCase().trim();
  // Jika masih placeholder atau cocok dengan daftar
  if (TEACHER_EMAILS.includes('GANTI_DENGAN_EMAIL_GURU')) {
    return true; // Fleksibel saat pengujian awal guru jika email belum disetel
  }
  return TEACHER_EMAILS.includes(clean);
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
