# Product Requirements Document (PRD)
## Web Pembelajaran Kimia: Sifat Koligatif Larutan Interaktif Kelas 11 SMA
**Proyek:** *KoligatifLab 11 — Kursus & Lab Virtual Sifat Koligatif Larutan*  
**Versi Dokumen:** 1.0 (Final Approved Plan)  
**Status:** Siap Implementasi  

---

### 1. Ringkasan Eksekutif & Tujuan Produk
*KoligatifLab 11* adalah platform pembelajaran kimia digital berbasis web yang dirancang khusus untuk siswa SMA Kelas 11 (Fase F Kurikulum Merdeka). Aplikasi ini mengemas materi Sifat Koligatif Larutan, yang sering dianggap abstrak karena menyangkut perilaku partikel tak kasatmata dan banyak rumus, menjadi **alur kursus interaktif berurutan (guided learning journey)** yang dilengkapi **laboratorium virtual**, **simulator partikel**, **kalkulator koligatif cerdas**, serta **sistem evaluasi adaptif dengan gamifikasi**.

#### Tujuan Utama:
1. Membantu siswa memahami bahwa sifat koligatif hanya bergantung pada **jumlah partikel zat terlarut**, bukan jenisnya, dengan menghubungkan fenomena makroskopis (titik didih, titik beku, tekanan osmotik) dengan tingkat submikroskopis (partikel terlarut dan pelarut).
2. Menyediakan visualisasi interaktif pada konsep abstrak seperti penurunan tekanan uap, diagram fase P–T, osmosis melalui membran semipermeabel, dan pengaruh ionisasi (faktor van't Hoff).
3. Memberikan pengalaman belajar mandiri terstruktur dengan umpan balik instan (*instant feedback*) dan pembahasan langkah demi langkah.
4. Mengaitkan konsep dengan konteks kehidupan nyata (antifreeze, garam pencair salju, cairan infus, desalinasi, pembuatan es krim).

---

### 2. Sasaran Pengguna & Kebutuhan (User Persona)
- **Siswa Kelas 11 SMA:** Membutuhkan media belajar yang visual, tidak membosankan, mudah dipahami langkah demi langkah, dan bisa diakses lancar di smartphone maupun laptop.
- **Guru Kimia SMA:** Membutuhkan media peraga digital di kelas untuk mendemonstrasikan sifat koligatif tanpa harus menyiapkan alat dan bahan praktikum, serta sebagai pendamping praktikum nyata (misalnya percobaan kurva pendinginan titik beku).

---

### 3. Konsep Desain & Identitas Visual (UI/UX)
Platform mengusung tema **Clean Academic Light Mode**:
- **Palet Warna:**
  - *Primary Background:* Putih bersih dan abu-abu kebiruan sangat lembut (`#F8FAFC`, `#FFFFFF`).
  - *Primary Accent:* Biru Kimia Sains Profesional (`#0284C7` / `#2563EB`) yang memberikan kesan akademis, fokus, dan kredibel.
  - *Secondary / Accent Highlights:* Cyan laboratorium (`#06B6D4`) untuk pelarut, Emerald untuk status sukses/benar (`#10B981`), Amber untuk peringatan/zat terlarut (`#F59E0B`), dan Rose untuk titik didih/kondisi panas atau jawaban salah (`#EF4444`).
  - *Typography:* Tipografi modern nan jernih (Inter / Plus Jakarta Sans) dengan hirarki keterbacaan tinggi. Format rumus kimia dan persamaan rapi dengan penulisan subskrip/superskrip presisi (misal: $\Delta T_b = K_b \times m$, $\text{CaCl}_2$, $\text{Ca}^{2+}$).
- **Komponen Visual:**
  - Kartu pembelajaran berbayang lembut (*soft layered cards*), borders tipis bersih, dan ikon sains modern.
  - Tata letak responsif (mobile-friendly dan desktop-optimized).

---

### 4. Struktur Arsitektur & Alur Navigasi (Sequential Course Journey)
Aplikasi menggunakan pola **Alur Berurutan ala Kursus Interaktif (Guided Course Progression)**. Siswa dipandu melalui peta perjalanan belajar (Milestone Path) yang berurutan, dengan penanda progres (*checkbox/progress bar*) yang otomatis tersimpan di peramban (`localStorage`).

```
[ Beranda / Peta Belajar Kursus ]
          │
          ▼
[ Bab 1: Konsentrasi Larutan & Konsep Sifat Koligatif ]
  ├── 1.1 Pengertian Sifat Koligatif & Jenis Larutan (Elektrolit vs Nonelektrolit)
  ├── 1.2 Satuan Konsentrasi: Molalitas (m), Fraksi Mol (X), Molaritas (M), % Massa
  ├── 1.3 Konversi Antarsatuan Konsentrasi
  ├── Simulator Interaktif: Pembuat Larutan Virtual (Gelas Kimia & Partikel)
  └── Kuis Cek Pemahaman Bab 1
          │
          ▼
[ Bab 2: Penurunan Tekanan Uap & Kenaikan Titik Didih ]
  ├── 2.1 Penurunan Tekanan Uap & Hukum Raoult (ΔP = X_terlarut × P°)
  ├── 2.2 Kenaikan Titik Didih (ΔTb = Kb × m)
  ├── 2.3 Contoh Kasus: Larutan Gula dan Garam dalam Air
  ├── Simulator Interaktif: Penguapan Partikel & Termometer Titik Didih
  └── Kuis Cek Pemahaman Bab 2
          │
          ▼
[ Bab 3: Penurunan Titik Beku & Diagram Fase ]
  ├── 3.1 Penurunan Titik Beku (ΔTf = Kf × m)
  ├── 3.2 Diagram Fase P–T Pelarut Murni vs Larutan
  ├── 3.3 Kurva Pendinginan Pelarut dan Larutan
  ├── Simulator Interaktif: Lab Titik Beku & Kurva Pendinginan Virtual
  └── Kuis Cek Pemahaman Bab 3
          │
          ▼
[ Bab 4: Tekanan Osmotik ]
  ├── 4.1 Osmosis & Membran Semipermeabel
  ├── 4.2 Rumus Tekanan Osmotik (π = M × R × T)
  ├── 4.3 Larutan Isotonik, Hipotonik, & Hipertonik
  ├── Simulator Interaktif: Tabung U Osmosis & Sel Darah Merah
  └── Kuis Cek Pemahaman Bab 4
          │
          ▼
[ Bab 5: Sifat Koligatif Larutan Elektrolit ]
  ├── 5.1 Ionisasi Elektrolit Kuat & Lemah (Derajat Ionisasi α)
  ├── 5.2 Faktor van't Hoff: i = 1 + (n − 1)α
  ├── 5.3 Perbandingan Sifat Koligatif Larutan Elektrolit & Nonelektrolit
  ├── Alat Cerdas: Kalkulator Sifat Koligatif Universal
  ├── 5.4 Penerapan dalam Kehidupan Sehari-hari
  └── Kuis Cek Pemahaman Bab 5
          │
          ▼
[ Bab 6: Evaluasi Akhir & Penghargaan Prestasi ]
  ├── Ujian Komprehensif Sifat Koligatif Larutan Kelas 11
  ├── Hasil Evaluasi, Analisis Kelemahan, & Pembahasan Lengkap
  └── Sertifikat Kelulusan Digital & Badge Koleksi
```

---

### 5. Detail Spesifikasi Fitur Utama

#### 5.1. Pembuat Larutan Virtual & Konsentrasi (Bab 1)
- **Simulator Pembuat Larutan:**
  - Siswa memilih zat terlarut (glukosa, urea, NaCl, $\text{CaCl}_2$, dll.) dan memasukkan massa zat terlarut serta massa/volume pelarut.
  - Sistem menampilkan gelas kimia dengan partikel terlarut yang tersebar di antara molekul pelarut.
  - Sistem menghitung otomatis molalitas, fraksi mol, molaritas, dan persen massa, lengkap dengan langkah perhitungan.
- **Konverter Satuan Konsentrasi:**
  - Mengubah antarsatuan konsentrasi (misalnya % massa → molalitas) dengan menampilkan tahapan yang transparan.

#### 5.2. Simulator Tekanan Uap & Titik Didih (Bab 2)
- **Visualisasi Penguapan Partikel:**
  - Dua wadah berdampingan (pelarut murni vs larutan) yang menampilkan molekul pelarut yang lepas ke fase uap.
  - Siswa menambah jumlah zat terlarut dengan slider, lalu terlihat bahwa jumlah molekul pelarut di permukaan berkurang sehingga tekanan uap turun.
  - Pengukur tekanan uap menampilkan nilai $P$ dan $\Delta P$ secara real-time berdasarkan Hukum Raoult.
- **Termometer Titik Didih Virtual:**
  - Menampilkan titik didih larutan terhadap konsentrasi (molalitas) dan nilai $K_b$ pelarut yang dipilih (air, etanol, benzena, dll.).

#### 5.3. Lab Titik Beku & Diagram Fase Interaktif (Bab 3)
- **Simulasi Kurva Pendinginan:**
  - Siswa mendinginkan pelarut murni dan larutan, lalu grafik suhu terhadap waktu terbentuk secara animasi.
  - Titik beku pelarut murni dan larutan ditandai pada grafik, sehingga $\Delta T_f$ dapat dibaca langsung. Siswa juga dapat mengamati fenomena *supercooling* ringan pada kurva.
  - Mode "Data Eksperimen": siswa dapat memasukkan data suhu hasil praktikum nyata (misalnya dari sensor suhu) untuk dibuat grafik dan dianalisis.
- **Diagram Fase P–T Dinamis:**
  - Garis beku, garis didih, dan garis sublimasi untuk pelarut murni dan larutan.
  - Slider konsentrasi menggeser garis larutan secara real-time sehingga terlihat kenaikan titik didih dan penurunan titik beku.

#### 5.4. Simulator Osmosis & Tekanan Osmotik (Bab 4)
- **Tabung U dengan Membran Semipermeabel:**
  - Siswa mengatur konsentrasi larutan di kedua sisi membran, lalu animasi molekul pelarut yang berpindah ditampilkan hingga tinggi permukaan berubah.
  - Sistem menghitung tekanan osmotik ($\pi = MRT$) dan menunjukkan tekanan yang diperlukan untuk menghentikan osmosis.
- **Simulasi Sel Darah Merah:**
  - Sel ditempatkan pada larutan hipotonik, isotonik, atau hipertonik dengan visual sel membengkak, normal, atau mengerut.
  - Terkait langsung dengan konteks cairan infus dan konsentrasi NaCl 0,9%.

#### 5.5. Alat Bantu Kimia Cerdas (Smart Colligative Calculator - Bab 5)
- **Kalkulator Sifat Koligatif Universal:**
  - Pengguna memilih zat terlarut dan pelarut (dengan basis data bawaan $K_b$, $K_f$, titik didih dan titik beku normal, serta $M_r$), lalu memasukkan massa dan data lain yang diketahui.
  - Sistem menghitung $\Delta P$, $\Delta T_b$, $\Delta T_f$, dan $\pi$, serta menampilkan titik didih dan titik beku larutan.
  - Toggle **Nonelektrolit / Elektrolit** menyesuaikan faktor van't Hoff ($i$) secara otomatis berdasarkan jumlah ion dan derajat ionisasi ($\alpha$), dilengkapi penjelasan langkah demi langkah.
- **Pembanding Larutan:**
  - Pengguna membandingkan beberapa larutan (misalnya glukosa 0,1 m, NaCl 0,1 m, $\text{CaCl}_2$ 0,1 m) dan sistem mengurutkan titik didih, titik beku, serta tekanan osmotiknya dengan penjelasan alasan perbedaannya.
- **Visualisasi Partikel Elektrolit:**
  - Menampilkan jumlah partikel sebelum dan sesudah ionisasi untuk menjelaskan mengapa larutan elektrolit memberi efek koligatif lebih besar.

#### 5.6. Arena Kuis Adaptif & Gamifikasi (Bab 6 & Tiap Modul)
- **Sistem Soal Bertingkat:**
  - Soal Konseptual (Level 1), Soal Hitungan Dasar (Level 2), dan Soal Analisis & Penerapan seperti perbandingan larutan, elektrolit, dan grafik/diagram fase (Level 3).
- **Pembahasan Langkah demi Langkah:**
  - Tombol "Lihat Pembahasan Detail" dan "Petunjuk Rumus" jika siswa membutuhkan bimbingan.
- **Sistem Poin (XP) & Lencana Keberhasilan:**
  - Badge prestasi: *"Penakar Konsentrasi"*, *"Penakluk Titik Didih"*, *"Pemburu Titik Beku"*, *"Penjelajah Osmosis"*, hingga *"Master Sifat Koligatif Kelas 11"*.
  - Riwayat skor dan status kelulusan tersimpan di `localStorage`.

---

### 6. Spesifikasi Teknis & Stack Implementasi
- **Framework:** React 19 + Vite (Modern, modular, ringan, dan loading ultra-cepat).
- **Styling:** CSS3 Modern Vanilla (Custom Design System: CSS Variables, Flexbox/Grid, Glassmorphism, Micro-animations).
- **Visualisasi:** Canvas/SVG native untuk animasi partikel, grafik kurva pendinginan, dan diagram fase, tanpa library grafik berat.
- **Penyimpanan Status:** `localStorage` (Progres bab, riwayat kuis, konfigurasi preferensi pengguna).
- **Data Konstanta:** Basis data lokal (JSON) berisi nilai $K_b$, $K_f$, $P^\circ$ pada suhu tertentu, $A_r$/$M_r$ zat umum, dan konstanta $R$ (0,082 L·atm/mol·K).
- **Formula & Simbol Kimia:** Komponen typography ramah subskrip dan rendering simbol kimia presisi tanpa ketergantungan library berat eksternal.
- **Performa:** 0 external bundle bloat, waktu render instan, ramah koneksi internet sekolah/kuota terbatas.

---

### 7. Rencana Roadmap Pelaksanaan (Implementation Milestones)
1. **Milestone 1:** Pembangunan Core Design System (Clean Academic Light Theme, tokens, layout header, navigasi kursus, dan sidebar progres).
2. **Milestone 2:** Implementasi Bab 1 (Teori Konsentrasi Larutan + Simulator Pembuat Larutan Virtual & Konverter Satuan).
3. **Milestone 3:** Implementasi Bab 2 (Penurunan Tekanan Uap & Kenaikan Titik Didih + Simulator Penguapan Partikel).
4. **Milestone 4:** Implementasi Bab 3 (Penurunan Titik Beku + Lab Kurva Pendinginan & Diagram Fase P–T Dinamis).
5. **Milestone 5:** Implementasi Bab 4 (Tekanan Osmotik + Simulator Tabung U & Sel Darah Merah).
6. **Milestone 6:** Implementasi Bab 5 (Larutan Elektrolit, Faktor van't Hoff, dan Kalkulator Sifat Koligatif Universal).
7. **Milestone 7:** Implementasi Bab 6 (Evaluasi Akhir, Gamifikasi, Sistem Badge, dan Sertifikat Kelulusan).
8. **Milestone 8:** Pengujian menyeluruh, validasi akurasi perhitungan, uji responsivitas mobile/desktop, dan penyempurnaan UI/UX.
