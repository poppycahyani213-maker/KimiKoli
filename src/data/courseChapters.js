/**
 * Data silabus dan status ketersediaan modul KimiKoli.
 * Sesuai PRD Fase F Kelas 11 SMA.
 * 
 * Modul 1 berstatus 'available' (Tersedia),
 * sedangkan modul 2–6 berstatus 'locked' (Belum Tersedia).
 */
export const KIMIKOLI_MODULES = [
  {
    id: "chapter1",
    number: 1,
    title: "Konsentrasi Larutan & Hakikat Sifat Koligatif",
    shortTitle: "Konsentrasi Larutan",
    status: "available", // Modul 1 aktif & siap dipelajari
    badgeLabel: "Tersedia",
    objective: "Menganalisis hubungan antara jumlah partikel zat terlarut dengan konsentrasi larutan (molalitas dan fraksi mol).",
    summary: "Memahami mengapa sifat koligatif larutan hanya bergantung pada konsentrasi partikel zat terlarut dan tidak dipengaruhi oleh jenis zat.",
    keyFormulas: [
      {
        label: "Molalitas (m)",
        formula: "m = (massa / Mr) × (1000 / p)",
        note: "p = massa pelarut dalam gram"
      },
      {
        label: "Fraksi Mol Terlarut (Xt)",
        formula: "Xt = nt / (nt + np)",
        note: "nt = mol terlarut, np = mol pelarut"
      }
    ],
    sections: [
      { id: "1.1", title: "1.1 Pengertian Sifat Koligatif & Jenis Larutan" },
      { id: "1.2", title: "1.2 Satuan Konsentrasi: Molalitas (m) & Fraksi Mol (X)" },
      { id: "1.3", title: "1.3 Lembar Laboratorium Virtual: Pembuat Larutan" },
      { id: "1.4", title: "1.4 Cek Pemahaman & Latihan Mandiri" }
    ]
  },
  {
    id: "chapter2",
    number: 2,
    title: "Penurunan Tekanan Uap & Kenaikan Titik Didih",
    shortTitle: "Tekanan Uap & Titik Didih",
    status: "locked",
    badgeLabel: "Belum Tersedia",
    objective: "Menghubungkan hambatan molekul terlarut pada permukaan cairan terhadap laju penguapan dan kenaikan suhu didih.",
    summary: "Hukum Raoult dan penentuan kenaikan titik didih larutan non-elektrolit dan elektrolit.",
    keyFormulas: [
      {
        label: "Hukum Raoult",
        formula: "ΔP = Xt × P°  |  P = Xp × P°",
        note: "P° = tekanan uap pelarut murni"
      },
      {
        label: "Kenaikan Titik Didih",
        formula: "ΔTb = Kb × m × i",
        note: "Kb = tetapan didih molal, i = faktor van't Hoff"
      }
    ],
    sections: [
      { id: "2.1", title: "2.1 Penurunan Tekanan Uap & Hukum Raoult" },
      { id: "2.2", title: "2.2 Kenaikan Titik Didih Larutan" },
      { id: "2.3", title: "2.3 Simulator Penguapan & Termometer Titik Didih" }
    ]
  },
  {
    id: "chapter3",
    number: 3,
    title: "Penurunan Titik Beku & Diagram Fase P–T",
    shortTitle: "Titik Beku & Diagram Fase",
    status: "locked",
    badgeLabel: "Belum Tersedia",
    objective: "Mengamati pembentukan kisi kristal es pelarut murni dibandingkan larutan melalui kurva pendinginan.",
    summary: "Konsep penurunan titik beku larutan serta pembacaan kurva kesetimbangan fasa padat-cair-gas.",
    keyFormulas: [
      {
        label: "Penurunan Titik Beku",
        formula: "ΔTf = Kf × m × i",
        note: "Tf = Tf° − ΔTf"
      }
    ],
    sections: [
      { id: "3.1", title: "3.1 Penurunan Titik Beku Larutan" },
      { id: "3.2", title: "3.2 Diagram Fase P–T Pelarut vs Larutan" },
      { id: "3.3", title: "3.3 Lab Virtual Kurva Pendinginan" }
    ]
  },
  {
    id: "chapter4",
    number: 4,
    title: "Tekanan Osmotik & Membran Semipermeabel",
    shortTitle: "Tekanan Osmotik",
    status: "locked",
    badgeLabel: "Belum Tersedia",
    objective: "Menganalisis difusi pelarut melalui membran semipermeabel dan penerapan larutan isotonik.",
    summary: "Konsep tekanan osmotik (van 't Hoff), fenomena krenasi/lisis sel darah, dan teknologi desalinasi air laut.",
    keyFormulas: [
      {
        label: "Persamaan Osmosis",
        formula: "π = M × R × T × i",
        note: "R = 0,082 L·atm/(mol·K), T = suhu mutlak (K)"
      }
    ],
    sections: [
      { id: "4.1", title: "4.1 Osmosis & Membran Semipermeabel" },
      { id: "4.2", title: "4.2 Perhitungan Tekanan Osmotik" },
      { id: "4.3", title: "4.3 Tabung U & Simulasi Sel Darah Merah" }
    ]
  },
  {
    id: "chapter5",
    number: 5,
    title: "Sifat Koligatif Larutan Elektrolit & van 't Hoff",
    shortTitle: "Larutan Elektrolit",
    status: "locked",
    badgeLabel: "Belum Tersedia",
    objective: "Menghitung faktor van 't Hoff (i) berdasarkan derajat ionisasi (α) dan jumlah ion zat terlarut.",
    summary: "Perbandingan matematis dan visual antara larutan non-elektrolit, elektrolit lemah, dan elektrolit kuat.",
    keyFormulas: [
      {
        label: "Faktor van 't Hoff",
        formula: "i = 1 + (n − 1)α",
        note: "n = jumlah ion, α = derajat ionisasi"
      }
    ],
    sections: [
      { id: "5.1", title: "5.1 Ionisasi Zat Elektrolit & Derajat Ionisasi" },
      { id: "5.2", title: "5.2 Perbandingan Koligatif Elektrolit vs Non-Elektrolit" },
      { id: "5.3", title: "5.3 Kalkulator Sifat Koligatif Universal" }
    ]
  },
  {
    id: "chapter6",
    number: 6,
    title: "Evaluasi Komprehensif & Analisis Capaian",
    shortTitle: "Evaluasi Akhir",
    status: "locked",
    badgeLabel: "Belum Tersedia",
    objective: "Mengukur ketuntasan belajar konsep sifat koligatif larutan tanpa penilaian diskriminatif.",
    summary: "Ujian komprehensif, umpan balik diagnostik kelemahan konsep, dan penerbitan bukti pencapaian belajar.",
    keyFormulas: [],
    sections: [
      { id: "6.1", title: "6.1 Ujian Mandiri Komprehensif" },
      { id: "6.2", title: "6.2 Pembahasan Detail Langkah Demi Langkah" }
    ]
  }
];

export const COURSE_CHAPTERS = KIMIKOLI_MODULES;
