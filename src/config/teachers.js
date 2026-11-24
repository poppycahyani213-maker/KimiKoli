// src/config/teachers.js
export const TEACHER_EMAILS = ['GANTI_DENGAN_EMAIL_GURU'];
export const isTeacherEmail = (email) =>
  !!email && TEACHER_EMAILS.includes(email.toLowerCase());
