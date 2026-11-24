// src/features/auth/TeacherLoginForm.jsx
import React, { useState } from 'react';
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

    // Tolak email yang tidak ada di TEACHER_EMAILS sebelum memanggil Firebase
    if (!isTeacherEmail(email.trim())) {
      setError('Email atau password salah.');
      return;
    }

    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      // Jika login sukses tapi email bukan guru, langsung signOut
      if (!isTeacherEmail(cred.user.email)) {
        await signOut(auth);
        setError('Email atau password salah.');
        return;
      }
      onSuccess?.(cred.user);
    } catch {
      // Pesan error umum: "Email atau password salah."
      setError('Email atau password salah.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '0.9rem' }}>
        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
          Email Guru:
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="guru@sekolah.sch.id"
          required
          style={{
            width: '100%',
            padding: '0.68rem 0.85rem',
            border: '1.5px solid #CBD5E1',
            borderRadius: '10px',
            fontSize: '0.95rem',
            boxSizing: 'border-box',
            fontFamily: "'Times New Roman', Times, serif"
          }}
        />
      </div>

      <div style={{ marginBottom: '0.9rem' }}>
        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem', color: '#0F172A' }}>
          Password:
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Masukkan kata sandi guru"
          required
          style={{
            width: '100%',
            padding: '0.68rem 0.85rem',
            border: '1.5px solid #CBD5E1',
            borderRadius: '10px',
            fontSize: '0.95rem',
            boxSizing: 'border-box',
            fontFamily: "'Times New Roman', Times, serif"
          }}
        />
      </div>

      {error && (
        <div
          role="alert"
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#B91C1C',
            padding: '0.65rem 0.9rem',
            borderRadius: '10px',
            fontSize: '0.86rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
        style={{
          width: '100%',
          padding: '0.78rem',
          fontSize: '1rem',
          borderRadius: '10px',
          background: '#0F172A',
          boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
          marginTop: '0.5rem',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Memeriksa...' : 'Masuk sebagai Guru 🔬'}
      </button>
    </form>
  );
}
