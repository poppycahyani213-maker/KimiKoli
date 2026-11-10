import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut,
  updateProfile
} from 'firebase/auth';

/**
 * Konfigurasi Firebase Project KimiKoli
 * 
 * Pengguna dapat memasukkan kredensial project Firebase melalui file .env:
 * VITE_FIREBASE_API_KEY=...
 * VITE_FIREBASE_AUTH_DOMAIN=...
 * VITE_FIREBASE_PROJECT_ID=...
 * VITE_FIREBASE_STORAGE_BUCKET=...
 * VITE_FIREBASE_MESSAGING_SENDER_ID=...
 * VITE_FIREBASE_APP_ID=...
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDOpKXaV6J3aF2W-A9ncZmWVkGGx33HNdg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "kimikoli-36924.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kimikoli-36924",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "kimikoli-36924.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "225279441430",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:225279441430:web:d5c64a4d9422a69c9d9337",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-ZEKSKMWG2Y"
};

// Cek apakah kredensial Firebase asli sudah dimasukkan
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_FIREBASE_API_KEY" &&
  firebaseConfig.apiKey.length > 10
);

// Inisialisasi Firebase App
let app;
let auth;
let googleProvider;

try {
  if (isFirebaseConfigured) {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  }
} catch (error) {
  console.warn('[Firebase] Inisialisasi Firebase Auth gagal, beralih ke mode simulasi lokal:', error);
}

/**
 * Masuk langsung dengan Google (Google Sign-In)
 */
export async function loginWithGoogle() {
  if (!isFirebaseConfigured || !auth) {
    // Mode demo/simulasi lokal jika API Key belum dipasang di .env
    const simulatedName = prompt("Simulasi Firebase: Masukkan Nama Akun Google Anda", "Pelajar Kimia Google");
    if (!simulatedName) throw new Error("Login Google dibatalkan");
    const email = `${simulatedName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
    return {
      uid: 'google-simulated-' + Date.now(),
      name: simulatedName,
      email: email,
      photoURL: null,
      provider: 'google.com'
    };
  }

  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      uid: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Pengguna Google',
      email: user.email,
      photoURL: user.photoURL,
      provider: 'google.com'
    };
  } catch (error) {
    console.error('[Firebase Google Login Error]', error);
    throw translateFirebaseError(error);
  }
}

/**
 * Masuk dengan Email dan Password
 */
export async function loginWithEmail(email, password) {
  if (!isFirebaseConfigured || !auth) {
    // Mode demo/simulasi jika API key belum dipasang
    if (!email || !password) throw new Error("Email dan password harus diisi");
    if (password.length < 6) throw new Error("Password minimal 6 karakter");
    const name = email.split('@')[0];
    return {
      uid: 'email-simulated-' + Date.now(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email,
      provider: 'password'
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return {
      uid: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Pengguna',
      email: user.email,
      provider: 'password'
    };
  } catch (error) {
    console.error('[Firebase Email Login Error]', error);
    throw translateFirebaseError(error);
  }
}

/**
 * Mendaftar Akun Baru dengan Email dan Password
 */
export async function registerWithEmail(email, password, displayName = '') {
  if (!isFirebaseConfigured || !auth) {
    if (!email || !password) throw new Error("Email dan password harus diisi");
    if (password.length < 6) throw new Error("Password minimal 6 karakter");
    return {
      uid: 'email-simulated-' + Date.now(),
      name: displayName || email.split('@')[0],
      email: email,
      provider: 'password'
    };
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    return {
      uid: user.uid,
      name: displayName || user.displayName || user.email?.split('@')[0] || 'Pengguna',
      email: user.email,
      provider: 'password'
    };
  } catch (error) {
    console.error('[Firebase Register Error]', error);
    throw translateFirebaseError(error);
  }
}

/**
 * Kirim Email Lupa Password (Forgot Password)
 */
export async function resetPassword(email) {
  if (!email || !email.includes('@')) {
    throw new Error("Masukkan alamat email yang valid untuk reset password.");
  }

  if (!isFirebaseConfigured || !auth) {
    // Mode simulasi/demo berhasil kirim
    return { success: true, message: `Tautan reset password (simulasi) telah dikirimkan ke ${email}` };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: `Tautan reset password telah dikirim ke ${email}. Silakan cek kotak masuk atau folder spam Anda.` };
  } catch (error) {
    console.error('[Firebase Reset Password Error]', error);
    throw translateFirebaseError(error);
  }
}

/**
 * Keluar (Sign Out) dari Firebase
 */
export async function logoutFirebase() {
  if (auth && isFirebaseConfigured) {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('[Firebase Logout Warning]', err);
    }
  }
}

/**
 * Menerjemahkan kode error Firebase ke Bahasa Indonesia yang ramah pengguna
 */
function translateFirebaseError(error) {
  const code = error?.code || '';
  switch (code) {
    case 'auth/operation-not-allowed':
      return new Error("Metode login ini belum diaktifkan di Firebase Console. Harap buka Firebase Console > Authentication > tab 'Sign-in method', lalu aktifkan (Enable) Email/Password atau Google.");
    case 'auth/unauthorized-domain':
      return new Error("Domain ini belum diizinkan di Firebase. Harap pastikan 'localhost' terdaftar di Firebase Console > Authentication > Settings > Authorized domains.");
    case 'auth/configuration-not-found':
      return new Error("Layanan Authentication belum diaktifkan. Harap buka menu Authentication di Firebase Console lalu klik tombol 'Get started'.");
    case 'auth/invalid-email':
      return new Error("Format alamat email tidak valid.");
    case 'auth/user-disabled':
      return new Error("Akun ini telah dinonaktifkan oleh administrator.");
    case 'auth/user-not-found':
      return new Error("Akun dengan email ini belum terdaftar. Silakan gunakan menu 'Daftar Akun Baru'.");
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return new Error("Email atau password yang Anda masukkan salah.");
    case 'auth/email-already-in-use':
      return new Error("Email ini sudah terdaftar. Silakan gunakan menu Masuk.");
    case 'auth/weak-password':
      return new Error("Password terlalu lemah. Harap gunakan minimal 6 karakter.");
    case 'auth/popup-closed-by-user':
      return new Error("Jendela login Google ditutup sebelum proses selesai.");
    case 'auth/popup-blocked':
      return new Error("Pop-up browser diblokir. Harap izinkan pop-up peramban Anda untuk login Google.");
    case 'auth/network-request-failed':
      return new Error("Koneksi internet bermasalah. Periksa jaringan Anda dan coba lagi.");
    default:
      return new Error(error.message || "Terjadi kendala saat autentikasi. Silakan coba kembali.");
  }
}

export { auth };
