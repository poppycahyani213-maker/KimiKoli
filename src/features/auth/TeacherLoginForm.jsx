// src/features/auth/TeacherLoginForm.jsx
import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { isTeacherEmail } from '../../config/teachers';

export default function TeacherLoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // cek email dulu supaya non-guru ditolak sebelum menyentuh Firebase
    if (!isTeacherEmail(email.trim())) {
      setError('Email ini tidak terdaftar sebagai guru.');
      return;
    }

    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      // cek ulang setelah login, untuk berjaga-jaga
      if (!isTeacherEmail(cred.user.email)) {
        await signOut(auth);
        setError('Akun ini bukan akun guru.');
        return;
      }
      onSuccess?.(cred.user);
    } catch {
      // pesan sengaja umum agar tidak membocorkan email mana yang ada
      setError('Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email Guru
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <label>
        Password
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Memeriksa...' : 'Masuk sebagai Guru'}
      </button>
    </form>
  );
}
