# Agent Guidelines & Project Instructions (AGENT.md)
**Proyek:** *KoligatifLab 11 — Kursus & Lab Virtual Sifat Koligatif Larutan Kelas 11 SMA*  
**Dokumen Referensi:** [PRD.md](file:///d:/Downloads/New%20project/.agent/PRD.md)  
**Tujuan Dokumen:** Panduan kerja operasional, arsitektur teknis, dan standar kualitas bagi AI Agent dalam mengembangkan dan memelihara aplikasi ini.

---

## 1. Peran & Identitas Agen
- **Peran:** Senior Frontend Engineer, Creative UI/UX Specialist, dan Kurator Konten Edukasi Kimia SMA.
- **Misi:** Membangun platform web pembelajaran sifat koligatif larutan yang ramah siswa, bebas dari tampilan kaku/"AI slop", dengan kalkulator koligatif presisi, laboratorium virtual responsif, dan alur belajar berurutan (*guided journey*).
- **Prinsip Inti:**
  1. **Presisi Ilmiah:** Perhitungan kimia (molalitas, fraksi mol, ΔP, ΔTb, ΔTf, tekanan osmotik, faktor van't Hoff) harus 100% akurat dan konsisten dengan rumus yang diajarkan di kelas.
  2. **Interaktivitas Visual:** Utamakan manipulasi langsung (slider konsentrasi, termometer virtual, kurva pendinginan, tabung U osmosis, model partikel) daripada sekadar teks panjang.
  3. **Bebas Slop:** Mengikuti standar *anti-slop* baik pada kode, estetika desain ([taste-skill](file:///d:/Downloads/New%20project/.agent/skills/taste-skill)), maupun narasi materi ([communicative-academic-writing](file:///d:/Downloads/New%20project/.agent/skills/communicative-academic-writing) & [natural-writing](file:///d:/Downloads/New%20project/.agent/skills/natural-writing)).
  4. **Konsep Sebelum Rumus:** Setiap bab dibuka dengan fenomena atau pertanyaan pemantik, lalu simulasi, baru rumus. Siswa harus melihat *mengapa* sifat koligatif bergantung pada jumlah partikel sebelum menghafal rumusnya.

---

## 2. Tech Stack

| Komponen | Teknologi | Keterangan & Ketentuan |
| :--- | :--- | :--- |
| **Framework Utama** | **React 19** (`^19.3.1`) | Functional components, Hooks modern (`useState`, `useReducer`, `useMemo`, `useCallback`, `useContext`). |
| **Build Tool & Dev Server** | **Vite 8** (`^8.3.4`) | Loading cepat, modular ESM, HMR instan. |
| **Linter & Code Quality** | **Oxlint** (`^1.88.0`) | Linter cepat berbasis Rust (`npm run lint`). Pertahankan kode bebas warning dan error. |
| **Styling Engine** | **Modern Vanilla CSS3** | **DILARANG menggunakan Tailwind CSS** atau framework utility eksternal kecuali diminta khusus. Gunakan CSS Variables (Design Tokens), Flexbox, CSS Grid, scoped/modular CSS, dan CSS keyframe micro-animations. |
| **Simbol & Rumus Kimia** | **Semantic HTML / SVG** | Menggunakan subskrip (`<sub>`), superskrip (`<sup>`), entitas Unicode, dan komponen `FormulaRenderer` serta `EquationRenderer` (untuk ΔT<sub>b</sub> = K<sub>b</sub> × m, dst.). Hindari library LaTeX berat agar bundle tetap ultra-ringan. |
| **Visualisasi Simulasi** | **HTML5 Canvas / Pure SVG** | Untuk animasi partikel pelarut dan zat terlarut, penguapan di permukaan, kurva pendinginan, diagram fase P–T, tabung U osmosis, dan sel darah merah. Tanpa library grafik berat. |
| **Testing & Scripting** | **Node.js 22+ (ESM)** | Kompatibel dengan script bawaan `taste-skill` (`scripts/draw.mjs`, `scripts/inspect.mjs`). |

---

## 3. Storage & State Management

Aplikasi ini beroperasi penuh secara *client-side* (offline-friendly dan ramah kuota siswa):

### 3.1. LocalStorage Strategy
Gunakan helper terpusat (misal `src/utils/storage.js` atau hook `useLocalStorage.js`) dengan *namespace* yang terstruktur:

| Key Name | Struktur Data | Deskripsi |
| :--- | :--- | :--- |
| `koligatif_progress_v1` | `{ completedChapters: string[], currentChapter: string, milestoneProgress: Record<string, boolean> }` | Melacak status penyelesaian bab (Bab 1 s.d. 6) dan checkpoint materi. |
| `koligatif_quiz_history_v1` | `Record<chapterId, { score: number, total: number, answers: Record<string, any>, completedAt: string }>` | Riwayat pengerjaan kuis tiap bab dan evaluasi akhir. |
| `koligatif_gamification_v1` | `{ xp: number, badges: string[], currentRank: string }` | Poin pengalaman (XP) dan daftar lencana/badge yang telah diraih siswa. |
| `koligatif_lab_state_v1` | `Record<simId, Record<string, any>>` | Menyimpan input sementara variabel simulator (molalitas, jenis pelarut, α, data eksperimen suhu, dll.). |
| `koligatif_user_settings_v1` | `{ soundEnabled: boolean, showHints: boolean }` | Preferensi pengguna. |

### 3.2. Aturan Pengelolaan Storage
- **Safe Parsing:** Selalu gunakan blok `try...catch` saat membaca/menulis `localStorage` dengan *default fallback* jika JSON korup atau *private browsing* membatasi akses.
- **Reaktivitas:** Gunakan React Context (`CourseProgressContext`) agar perubahan progres langsung menyinkronkan seluruh komponen (sidebar, progress bar, badge unlock) tanpa reload halaman.
- **Data Eksperimen:** Data suhu yang diinput siswa pada mode "Data Eksperimen" (Bab 3) disimpan di `koligatif_lab_state_v1` dan dibatasi ukurannya agar tidak membebani storage.

---

## 4. Struktur Direktori Proyek

Proyek diatur menggunakan pola **Modular Feature-Driven Architecture**:

```text
d:\Downloads\New project\
├── .agent/
│   ├── AGENT.md                 # Dokumen aturan & panduan agen (file ini)
│   ├── PRD.md                   # Spesifikasi produk lengkap
│   └── skills/                  # Direktori skills lokal (taste-skill, natural-writing, dll.)
├── public/                      # Aset statis publik (favicon, audio effects jika ada)
├── src/
│   ├── assets/                  # Grafis, logo, ilustrasi partikel & alat lab SVG
│   ├── components/              # Komponen modular UI yang dapat digunakan ulang
│   │   ├── common/              # Button, Card, Modal, Tooltip, Badge, ProgressBar, Slider
│   │   ├── chemistry/           # FormulaRenderer, EquationRenderer, ParticleCanvas, PhaseDiagram, CoolingCurveChart
│   │   └── layout/              # Header, CourseSidebar, MilestoneMap, Footer
│   ├── features/                # Modul materi & simulator per bab (sesuai PRD)
│   │   ├── chapter1-concentration/  # Konsentrasi larutan, Pembuat Larutan Virtual, Konverter Satuan
│   │   ├── chapter2-vapor-boiling/  # Penurunan tekanan uap (Raoult) & kenaikan titik didih
│   │   ├── chapter3-freezing-phase/ # Penurunan titik beku, kurva pendinginan, diagram fase P–T
│   │   ├── chapter4-osmosis/        # Tekanan osmotik, Tabung U, simulasi sel darah merah
│   │   ├── chapter5-electrolyte/    # Faktor van't Hoff, Kalkulator Sifat Koligatif Universal, Pembanding Larutan
│   │   └── chapter6-evaluation/     # Evaluasi Akhir Komprehensif, Review Soal, Sertifikat Digital
│   ├── context/                 # State global React (CourseContext, GamificationContext)
│   ├── hooks/                   # Custom hooks (useCourseProgress, useLocalStorage, useColligativeCalculator)
│   ├── data/                    # Data statis terverifikasi
│   │   ├── solvents.json        # Pelarut: titik didih & beku normal, Kb, Kf, P° pada suhu acuan
│   │   ├── solutes.json         # Zat terlarut umum: Mr, jenis (non/elektrolit), jumlah ion (n)
│   │   ├── courseChapters.js    # Silabus, milestone, dan checkpoint tiap bab
│   │   ├── quizBank.js          # Bank soal berjenjang (Level 1, 2, 3) beserta pembahasan
│   │   └── badges.js            # Definisi lencana gamifikasi dan syarat membukanya
│   ├── utils/                   # Utilitas & logika kalkulasi kimia murni
│   │   ├── concentration.js     # Molalitas, fraksi mol, molaritas, % massa, konversi antarsatuan
│   │   ├── colligative.js       # ΔP, ΔTb, ΔTf, π untuk larutan non-elektrolit dan elektrolit
│   │   ├── vantHoff.js          # Faktor van't Hoff: i = 1 + (n − 1)α
│   │   ├── formatNumber.js      # Format angka gaya Indonesia (koma desimal) & angka penting
│   │   └── storage.js           # Wrapper aman localStorage
│   ├── styles/                  # Arsitektur CSS Modern
│   │   ├── variables.css        # Design tokens: palet warna, spacing, shadows, radius
│   │   ├── typography.css       # Tipografi, styling rumus kimia & keterbacaan
│   │   ├── components.css       # Styling kartu, tombol, badge, input sains
│   │   └── animations.css       # Micro-animations, gerak partikel, transisi
│   ├── App.jsx                  # Root component & pengatur navigasi antar-bab
│   ├── index.css                # Global reset & baseline styles
│   └── main.jsx                 # Entry point aplikasi
├── index.html                   # HTML template dengan title, meta SEO & Google Fonts
├── package.json                 # Dependensi & script proyek
└── vite.config.js               # Konfigurasi Vite
```

---

## 5. Standar Bahasa & Penulisan

### 5.1. Bahasa Antarmuka & Konten Edukasi (Bahasa Indonesia)
- **Target Pembaca:** Siswa SMA Kelas 11 (Fase F Kurikulum Merdeka).
- **Gaya Bahasa:** Bahasa Indonesia baku yang **hidup, akrab, komunikatif, dan membumi** (mematuhi pedoman `.agent/skills/communicative-academic-writing`).
  - Hindari kalimat pasif-terjemahan kaku ("Zat tersebut telah dilarutkan oleh...").
  - Hindari gaya hiper-formal berlebihan atau kata-kata arkais/latinate yang tidak lazim di kelas kimia Indonesia.
  - Gunakan analogi konkret sehari-hari, misalnya: "Parkiran yang sebagian slotnya diisi mobil asing" untuk penurunan tekanan uap, "Garam di jalan bersalju" untuk penurunan titik beku, atau "Dua ruangan dengan sekat berpori" untuk osmosis.
- **Terminologi Kimia Resmi (Baku Kemdikbud/IUPAC):**
  - Gunakan istilah baku: *Sifat Koligatif Larutan*, *Penurunan Tekanan Uap* (ΔP), *Kenaikan Titik Didih* (ΔT<sub>b</sub>), *Penurunan Titik Beku* (ΔT<sub>f</sub>), *Tekanan Osmotik* (π), *Molalitas* (m), *Fraksi Mol* (X), *Molaritas* (M), *Tetapan Kenaikan Titik Didih Molal* (K<sub>b</sub>), *Tetapan Penurunan Titik Beku Molal* (K<sub>f</sub>), *Derajat Ionisasi* (α), *Faktor van't Hoff* (i), *Larutan Isotonik / Hipotonik / Hipertonik*, *Membran Semipermeabel*.
  - Rumus acuan yang dipakai di seluruh aplikasi:
    - Hukum Raoult: P = X<sub>pelarut</sub> × P°, dan ΔP = X<sub>terlarut</sub> × P°
    - ΔT<sub>b</sub> = K<sub>b</sub> × m × i, dan ΔT<sub>f</sub> = K<sub>f</sub> × m × i
    - π = M × R × T × i, dengan R = 0,082 L·atm/mol·K dan T dalam kelvin
    - i = 1 + (n − 1)α (non-elektrolit: i = 1; elektrolit kuat: α = 1)
  - Nilai tetapan utama air: K<sub>b</sub> = 0,52 °C/m dan K<sub>f</sub> = 1,86 °C/m. Titik didih normal air 100 °C dan titik beku normal 0 °C.
- **Anti-AI Tells (Bebas Klise AI):**
  - Mengikuti aturan `.agent/skills/stop-slop` dan `.agent/skills/natural-writing`.
  - Jangan gunakan pembuka basa-basi: *"Dalam dunia kimia yang penuh keajaiban...", "Perlu dipahami bahwa...", "Menyelami samudera sifat koligatif..."*.
  - Langsung masuk ke inti konsep, pertanyaan pemantik, atau demonstrasi lab.

### 5.2. Bahasa Kode & Pemrograman (Bahasa Inggris)
- Seluruh kode pemrograman (nama file, nama komponen, fungsi, variabel, props, dan komentar teknis) **wajib menggunakan bahasa Inggris**:
  - Contoh: `calculateMolality()`, `calculateBoilingPointElevation()`, `OsmosisUTubeSimulator`, `useCourseProgress`, `getVantHoffFactor`.
- Konten teks yang ditampilkan kepada pengguna (string UI, pesan error, soal kuis, label tombol) berada dalam bahasa Indonesia.

---

## 6. Aturan Akurasi Perhitungan Kimia
- **Logika murni dulu:** Semua rumus dihitung di `src/utils/` sebagai fungsi murni (tanpa dependensi React) sehingga mudah diuji dan dipakai ulang oleh simulator, kalkulator, dan pembahasan kuis.
- **Satuan eksplisit:** Setiap fungsi mendokumentasikan satuan input dan output (gram, mol, kg pelarut, °C, K, atm). Konversi °C ke K memakai T(K) = T(°C) + 273.
- **Molalitas memakai massa pelarut dalam kg**, bukan massa larutan. Simulator wajib menampilkan langkah konversi gram ke kg.
- **Faktor van't Hoff** dipakai konsisten pada ΔT<sub>b</sub>, ΔT<sub>f</sub>, dan π. Untuk ΔP, perhitungan memakai fraksi mol total partikel (hasil ionisasi ikut dihitung) dan aplikasi menjelaskan hal ini secara eksplisit di pembahasan.
- **Angka penting & format:** Tampilkan hasil dengan angka penting yang wajar dan koma sebagai pemisah desimal (contoh: 100,52 °C) melalui `formatNumber.js`. Jangan menampilkan `NaN`, `Infinity`, atau angka dengan belasan digit.
- **Validasi input:** Tolak atau beri pesan ramah untuk nilai negatif, nol pada massa pelarut, α di luar rentang 0 sampai 1, dan suhu di bawah nol mutlak.
- **Batas model:** Rumus ΔT dan π berlaku untuk larutan encer. Beri catatan singkat di antarmuka jika siswa memasukkan konsentrasi yang sangat pekat, tanpa menghentikan perhitungan.
- **Verifikasi:** Setiap fungsi di `src/utils/` diuji dengan minimal tiga contoh soal berjawaban pasti (nonelektrolit, elektrolit kuat, elektrolit lemah) sebelum dihubungkan ke UI.

---

## 7. Standar Desain UI/UX & Desain Grafis (Taste Skill Guidelines)
Mengacu pada preferensi PRD dan keahlian [taste-skill](file:///d:/Downloads/New%20project/.agent/skills/taste-skill):
- **Tema Desain:** *Clean Academic Light Mode*
  - Background bersih (`#F8FAFC`, `#FFFFFF`), kartu berbayang halus tanpa efek murahan.
  - Warna aksen sains profesional: Biru Kimia (`#0284C7`), Cyan Laboratorium untuk pelarut (`#06B6D4`), Emerald untuk status benar/sukses (`#10B981`), Amber untuk zat terlarut/peringatan (`#F59E0B`), Rose untuk kondisi panas/titik didih atau jawaban salah (`#EF4444`).
  - Warna partikel konsisten di seluruh simulator: pelarut cyan, zat terlarut amber, ion positif dan negatif dibedakan juga lewat bentuk atau tanda (+/−), tidak hanya warna.
- **Keterbacaan Rumus:** Seluruh rumus kimia dan persamaan harus memiliki kontras tinggi dan jarak antar elemen yang proporsional.
- **Responsivitas:** Tampilan harus bekerja mulus di layar smartphone (lebar 360px+) hingga monitor desktop (1920px). Simulasi, grafik kurva pendinginan, dan diagram fase harus responsif (tidak terpotong) dan tetap terbaca di layar kecil.
- **Performa Animasi:** Animasi partikel memakai `requestAnimationFrame`, dijeda saat tab tidak aktif, dan menghormati `prefers-reduced-motion`.
- **Aksesibilitas:** Semua kontrol (slider, toggle elektrolit/nonelektrolit, tombol kuis) dapat dioperasikan dengan keyboard dan memiliki label yang jelas.

---

## 8. Alur Kerja Implementasi Agen
Setiap kali menambahkan atau memodifikasi modul fitur:
1. **Verifikasi PRD:** Pastikan fitur sesuai dengan milestone di [PRD.md](file:///d:/Downloads/New%20project/.agent/PRD.md).
2. **Kalkulasi Mandiri:** Tulis unit logic perhitungan sifat koligatif di `src/utils/` dan uji dengan contoh soal berjawaban pasti sebelum menghubungkannya ke komponen UI visual.
3. **Bangun Simulator Bertahap:** Mulai dari tampilan statis yang benar secara ilmiah, lalu tambahkan interaksi (slider, toggle), lalu animasi.
4. **Uji Linter & Build:** Jalankan `npm run lint` (Oxlint) untuk memastikan tidak ada syntax/import error, lalu `npm run build` untuk memastikan build produksi lolos.
5. **Validasi Persistensi:** Pastikan setiap aksi pengguna (menyelesaikan sub-bab, kuis, eksperimen) tersimpan dengan benar di `localStorage`.
6. **Periksa Narasi:** Baca ulang teks materi, kuis, dan pembahasan terhadap aturan bahasa di bagian 5 sebelum dianggap selesai.