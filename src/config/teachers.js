// src/config/teachers.js
// Daftar email yang diakui sebagai guru/admin.
// Tambahkan email asli guru di sini (huruf kecil semua).
export const TEACHER_EMAILS = [
  'guru@contoh.sch.id',  // ganti dengan email guru sebenarnya
];

/**
 * Memeriksa apakah user adalah guru berdasarkan email.
 * @param {object|null} user - objek user dari auth / storage
 * @returns {boolean}
 */
export const isTeacherByEmail = (user) =>
  !!user?.email && TEACHER_EMAILS.includes(user.email.toLowerCase());
