# KoligatifLab 11 — Pembelajaran Sifat Koligatif Larutan Interaktif

Platform pembelajaran interaktif kimia SMA Kelas 11 (Fase F Kurikulum Merdeka) berbasis **React 19** dan **Vite 6**.

## 🚀 Cara Menjalankan Proyek

1. **Pasang Dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```

3. **Buka di Browser**:
   Akses `http://localhost:3000` di browser.

4. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

## 📂 Struktur Direktori

```text
├── public/                 # Favicon dan aset statis
├── src/
│   ├── components/         # Komponen UI (Card, Button, Badge, FormulaRenderer, Layout)
│   ├── data/               # Data pelarut, zat terlarut, dan silabus bab
│   ├── features/           # Modul materi & simulator Bab 1 sampai Bab 6
│   ├── styles/             # Desain CSS Modern (Clean Academic Light Mode)
│   ├── utils/              # Logika kalkulasi sifat koligatif & helper localStorage
│   ├── App.jsx             # Root layout & navigasi kursus
│   ├── index.css           # Global stylesheet
│   └── main.jsx            # Entry point React
├── index.html              # HTML shell & font Plus Jakarta Sans
├── package.json            # Konfigurasi dependensi
└── vite.config.js          # Konfigurasi Vite
```

