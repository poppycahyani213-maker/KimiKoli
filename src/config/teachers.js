// src/config/teachers.js
export const TEACHER_EMAILS = ['email-guru-yang-kamu-buat@contoh.com']; // samakan persis dengan di Firebase
export const isTeacherEmail = (email) =>
  !!email && TEACHER_EMAILS.includes(email.toLowerCase());
