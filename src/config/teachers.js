// src/config/teachers.js
export const TEACHER_EMAILS = ['guru@contoh.sch.id']; // ganti dengan email guru yang kamu buat di Firebase
export const isTeacherEmail = (email) =>
  !!email && TEACHER_EMAILS.includes(email.toLowerCase());
