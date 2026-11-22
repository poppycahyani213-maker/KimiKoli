/**
 * chapter5Data.js
 * Data materi, soal diagnostik, contoh soal terbimbing, miskonsepsi,
 * dan latihan mandiri untuk Bab 5: Sifat Koligatif Larutan Elektrolit & Faktor van 't Hoff.
 */

// ─── 1. SOAL DIAGNOSTIK 4 BUTIR (Pre-test di Engagement, Post-test di Evaluation) ───
export const DIAGNOSTIC_QUESTIONS = [
  {
    id: 'd1',
    number: 1,
    question: 'Jika 1 mol glukosa (C₆H₁₂O₆, nonelektrolit) dan 1 mol garam dapur (NaCl, elektrolit kuat) masing-masing dilarutkan ke dalam 1 kg air murni, bagaimanakah jumlah partikel terlarut bebas yang berada di dalam larutan?',
    options: [
      { key: 'A', text: 'Jumlah partikel keduanya sama banyak karena sama-sama berasal dari 1 mol zat terlarut.' },
      { key: 'B', text: 'Partikel larutan NaCl berjumlah dua kali lipat lebih banyak daripada glukosa karena terurai menjadi ion Na⁺ dan Cl⁻.' },
      { key: 'C', text: 'Partikel glukosa lebih banyak karena ukuran molekul glukosa jauh lebih besar daripada ion garam.' },
      { key: 'D', text: 'Jumlah partikel tidak dapat dipastikan sebelum larutan dipanaskan hingga mendidih.' }
    ],
    correctKey: 'B',
    explanation: 'Glukosa adalah nonelektrolit yang tidak terionisasi (1 mol glukosa tetap 1 mol partikel molekul). Sebaliknya, NaCl adalah elektrolit kuat yang terdisosiasi sempurna menjadi 1 mol Na⁺ dan 1 mol Cl⁻, sehingga menghasilkan total 2 mol partikel ion bebas (dua kali lipat).'
  },
  {
    id: 'd2',
    number: 2,
    question: 'Air murni membeku pada 0°C, dan larutan glukosa 1 molal membeku pada -1,86°C. Berdasarkan prediksimu, pada suhu berapakah larutan garam NaCl 1 molal akan membeku?',
    options: [
      { key: 'A', text: 'Tepat pada -1,86°C juga, karena konsentrasi molalitas kedua larutan sama-sama 1 m.' },
      { key: 'B', text: 'Sekitar -0,93°C (lebih hangat), karena garam memiliki sifat menahan dingin.' },
      { key: 'C', text: 'Sekitar -3,72°C secara teoritis (hampir 2 kali lipat lebih dingin), karena menghasilkan 2 ion per satuan rumus.' },
      { key: 'D', text: 'Tetap pada 0°C karena titik beku pelarut air tidak dapat diubah oleh garam.' }
    ],
    correctKey: 'C',
    explanation: 'Sifat koligatif sebanding dengan jumlah partikel terlarut. Karena 1 molal NaCl menghasilkan 2 molal ion bebas (i = 2), maka penurunan titik bekunya adalah 2 × 1,86°C = 3,72°C, sehingga larutan membeku pada suhu ideal -3,72°C (dua kali lebih rendah daripada glukosa).'
  },
  {
    id: 'd3',
    number: 3,
    question: 'Apakah semua larutan elektrolit (seperti NaCl, CaCl₂, dan asam cuka CH₃COOH) memiliki nilai faktor van \'t Hoff yang sama, yaitu i = 2?',
    options: [
      { key: 'A', text: 'Ya, semua zat yang berlabel elektrolit selalu memiliki i = 2.' },
      { key: 'B', text: 'Tidak, nilai i bergantung pada jumlah ion per molekul (n) dan derajat ionisasi (α); CaCl₂ memiliki n = 3 (i ≈ 3), sedangkan CH₃COOH hanya terionisasi sebagian (i ≈ 1,05).' },
      { key: 'C', text: 'Tidak, hanya larutan asam yang memiliki i = 2, sedangkan larutan garam selalu memiliki i = 1.' },
      { key: 'D', text: 'Ya, asalkan konsentrasi larutannya dibuat sama-sama encer pada 0,1 molal.' }
    ],
    correctKey: 'B',
    explanation: 'Nilai faktor van \'t Hoff dirumuskan dengan i = 1 + (n - 1)α. CaCl₂ terurai menjadi 3 ion (Ca²⁺ + 2Cl⁻) dengan α ≈ 1 sehingga i ≈ 3. Sementara asam cuka CH₃COOH adalah elektrolit lemah dengan α sangat kecil (misal α = 0,05), sehingga i = 1 + (2 - 1)(0,05) = 1,05 (mendekati 1).'
  },
  {
    id: 'd4',
    number: 4,
    question: 'Mengapa larutan asam cuka (CH₃COOH) 0,1 molal menghasilkan kenaikan titik didih yang jauh lebih kecil dibandingkan larutan asam klorida (HCl) 0,1 molal, padahal keduanya sama-sama senyawa asam biner?',
    options: [
      { key: 'A', text: 'Karena massa molekul (Mr) asam cuka lebih berat sehingga sulit mendidih.' },
      { key: 'B', text: 'Karena HCl adalah elektrolit kuat yang terionisasi 100% (α = 1, i = 2), sedangkan CH₃COOH adalah elektrolit lemah yang hanya terionisasi sebagian kecil (α << 1, i ≈ 1,02–1,05).' },
      { key: 'C', text: 'Karena asam cuka mudah menguap bersama pelarut air saat dipanaskan.' },
      { key: 'D', text: 'Karena HCl bereaksi langsung dengan molekul air membentuk ikatan kovalen baru.' }
    ],
    correctKey: 'B',
    explanation: 'Kekuatan sifat koligatif elektrolit ditentukan oleh derajat ionisasinya (α). HCl terionisasi total menjadi H⁺ dan Cl⁻ sehingga jumlah partikelnya berlipat dua (i ≈ 2). Sebaliknya, CH₃COOH sebagian besar tetap berada dalam bentuk molekul utuh dan hanya sekitar 1–5% yang terurai menjadi ion, sehingga faktor pengali i hanya sedikit di atas 1.'
  }
];

// ─── 2. MISKONSEPSI UMUM BAB 5 (5 BUTIR) ───
export const MISCONCEPTIONS_BAB5 = [
  {
    badge: "Miskonsepsi 1 • Nilai Faktor van 't Hoff",
    myth: "Semua larutan elektrolit selalu memiliki nilai faktor van 't Hoff i = 2.",
    fact: "Nilai i bergantung pada jumlah ion terurai (n) dan derajat ionisasi (α): i = 1 + (n − 1)α.",
    explanation: "Untuk garam terner seperti CaCl₂ (Ca²⁺ + 2Cl⁻), nilai n = 3 sehingga i ≈ 3. Untuk garam kuaterner seperti FeCl₃, n = 4 sehingga i ≈ 4. Sedangkan untuk elektrolit lemah seperti asam cuka CH₃COOH (α ≈ 0,05), nilai i adalah pecahan yaitu 1,05, bukan 2!"
  },
  {
    badge: "Miskonsepsi 2 • Konsentrasi Molal vs Jumlah Partikel",
    myth: "Larutan NaCl 1 molal dan Glukosa 1 molal membeku pada suhu yang sama karena konsentrasi awalnya sama-sama 1 m.",
    fact: "Sifat koligatif hanya bergantung pada JUMLAH TOTAL PARTIKEL BEBAS di dalam pelarut, bukan mol zat sebelum dilarutkan.",
    explanation: "Meskipun sama-sama dibuat dari 1 mol zat, 1 mol NaCl di dalam air terurai menghasilkan 2 mol ion bebas (Na⁺ dan Cl⁻). Akibatnya, penurunan titik beku NaCl dua kali lipat lebih besar (-3,72°C secara ideal) dibandingkan glukosa (-1,86°C)."
  },
  {
    badge: "Miskonsepsi 3 • Nilai Ideal vs Realita Laboratorium",
    myth: "Larutan NaCl 1 m di laboratorium selalu terukur tepat membeku pada -3,72°C dan mendidih tepat pada 101,04°C.",
    fact: "Nilai -3,72°C adalah perhitungan MODEL IDEAL. Di dunia nyata laboratorium, titik beku terukur sekitar -3,4°C hingga -3,5°C.",
    explanation: "Pada konsentrasi nyata, ion-ion Na⁺ dan Cl⁻ yang bermuatan listrik saling tarik-menarik membentuk 'pasangan ion sesaat' (interaksi elektrostatik Debye-Hückel). Tarikan ini sedikit mengurangi kebebasan gerak ion, sehingga nilai i terukur di lab adalah sekitar 1,85–1,90 (bukan tepat 2,00)."
  },
  {
    badge: "Miskonsepsi 4 • Elektrolit Lemah vs Elektrolit Kuat",
    myth: "Asam cuka (CH₃COOH) memiliki efek sifat koligatif yang sama kuatnya dengan asam klorida (HCl) karena keduanya sama-sama senyawa asam.",
    fact: "HCl adalah elektrolit kuat (α ≈ 1, i ≈ 2), sedangkan asam cuka adalah elektrolit lemah (α ≈ 0,01–0,05, i ≈ 1,01–1,05).",
    explanation: "Sebagian besar molekul asam cuka tetap utuh dan tidak terionisasi. Pada konsentrasi yang sama, efek kenaikan titik didih atau penurunan titik beku asam cuka hampir sama dengan zat nonelektrolit seperti glukosa, dan jauh lebih rendah dibanding HCl."
  },
  {
    badge: "Miskonsepsi 5 • Faktor van 't Hoff Kurang dari 1",
    myth: "Faktor van 't Hoff (i) bisa bernilai kurang dari 1 jika larutan sangat encer.",
    fact: "Dalam pelarut air, faktor van 't Hoff selalu bernilai i ≥ 1. Nilai terendah adalah i = 1 untuk nonelektrolit (α = 0).",
    explanation: "Karena ionisasi memecah 1 molekul menjadi lebih dari 1 partikel (n ≥ 2), maka i = 1 + (n − 1)α pasti menghasilkan nilai ≥ 1. Nilai i < 1 hanya dapat terjadi jika molekul zat terlarut bergabung (berasosiasi/membentuk dimer), misalnya asam benzoat dalam pelarut benzena murni."
  }
];

// ─── 3. CONTOH SOAL TERBIMBING BERTAHAP (2 BUTIR) ───
export const GUIDED_EXAMPLES_BAB5 = [
  {
    id: 1,
    badge: "Contoh 1 • Elektrolit Kuat Terner (CaCl₂)",
    title: "Penurunan Titik Beku & Kenaikan Titik Didih Larutan CaCl₂",
    problem: "Sebanyak 11,1 gram kalsium klorida (CaCl₂, Mr = 111 g/mol) dilarutkan ke dalam 500 gram air murni (Kb = 0,52 °C/m; Kf = 1,86 °C/m). Anggap CaCl₂ terionisasi sempurna di dalam air. Tentukan: (a) molalitas larutan, (b) faktor van 't Hoff (i), (c) kenaikan titik didih (ΔTb) dan titik didih larutan (Tb), serta (d) penurunan titik beku (ΔTf) dan titik beku larutan (Tf).",
    given: [
      { label: "Massa terlarut (CaCl₂)", value: "11,1 gram" },
      { label: "Mr CaCl₂", value: "111 g/mol" },
      { label: "Massa pelarut air (p)", value: "500 gram = 0,5 kg" },
      { label: "Tetapan air", value: "Kb = 0,52 °C/m ; Kf = 1,86 °C/m" },
      { label: "Derajat ionisasi (α)", value: "α = 1 (terionisasi sempurna)" }
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Menghitung Jumlah Mol dan Molalitas Larutan",
        formula: "n = massa / Mr   dan   m = n / p(kg)",
        calculation: "n = 11,1 g / 111 g/mol = 0,1 mol  |  m = 0,1 mol / 0,5 kg = 0,2 m",
        result: "n = 0,1 mol ; m = 0,2 molal",
        explanation: "Molalitas dihitung dari perbandingan mol terlarut terhadap massa pelarut murni dalam satuan kilogram."
      },
      {
        stepNumber: 2,
        title: "Menentukan Jumlah Ion (n) dan Faktor van 't Hoff (i)",
        formula: "CaCl₂ (aq) → Ca²⁺ (aq) + 2Cl⁻ (aq)   dan   i = 1 + (n − 1)α",
        calculation: "n = 1 ion Ca²⁺ + 2 ion Cl⁻ = 3 ion.  Karena α = 1, maka i = 1 + (3 − 1)(1) = 3.",
        result: "n = 3  ;  i = 3",
        explanation: "Satu satuan rumus CaCl₂ terdisosiasi menjadi 3 partikel ion bebas yang bergerak independen di dalam air."
      },
      {
        stepNumber: 3,
        title: "Menghitung Kenaikan Titik Didih (ΔTb) dan Titik Didih (Tb)",
        formula: "ΔTb = Kb × m × i   dan   Tb = Tb° + ΔTb",
        calculation: "ΔTb = 0,52 °C/m × 0,2 m × 3 = 0,312 °C  |  Tb = 100 °C + 0,312 °C = 100,312 °C",
        result: "ΔTb = 0,312 °C  ;  Tb = 100,312 °C",
        explanation: "Adanya 3 partikel ion pelipatgandaan menaikkan titik didih larutan menjadi 100,312 °C (3× lipat lebih besar dibanding glukosa 0,2 m)."
      },
      {
        stepNumber: 4,
        title: "Menghitung Penurunan Titik Beku (ΔTf) dan Titik Beku (Tf)",
        formula: "ΔTf = Kf × m × i   dan   Tf = Tf° − ΔTf",
        calculation: "ΔTf = 1,86 °C/m × 0,2 m × 3 = 1,116 °C  |  Tf = 0 °C − 1,116 °C = −1,116 °C",
        result: "ΔTf = 1,116 °C  ;  Tf = −1,116 °C (ideal)",
        explanation: "Larutan membeku pada suhu −1,116 °C. Catatan: ini adalah nilai ideal teoritis, di mana pada pengukuran lab riil nilainya sekitar −1,05 °C akibat tarikan elektrostatik antar-ion."
      }
    ]
  },
  {
    id: 2,
    badge: "Contoh 2 • Penentuan Derajat Ionisasi Elektrolit Lemah",
    title: "Menentukan Derajat Ionisasi (α) Asam Lemah dari Data Titik Beku",
    problem: "Sebanyak 6 gram suatu asam lemah biner HA (Mr = 60 g/mol) dilarutkan ke dalam 1000 gram air murni (Kf = 1,86 °C/m). Larutan tersebut terukur membeku pada suhu −0,2046 °C. Hitunglah: (a) molalitas larutan, (b) faktor van 't Hoff (i), dan (c) derajat ionisasi (α) asam lemah tersebut dalam persen (%).",
    given: [
      { label: "Massa zat terlarut (HA)", value: "6 gram" },
      { label: "Mr asam HA", value: "60 g/mol" },
      { label: "Massa pelarut air (p)", value: "1000 gram = 1,0 kg" },
      { label: "Titik beku larutan (Tf)", value: "−0,2046 °C (maka ΔTf = 0,2046 °C)" },
      { label: "Jumlah ion biner HA", value: "HA ⇌ H⁺ + A⁻ → n = 2" }
    ],
    steps: [
      {
        stepNumber: 1,
        title: "Menghitung Molalitas Larutan HA",
        formula: "m = (massa / Mr) × (1 / p_kg)",
        calculation: "n = 6 g / 60 g/mol = 0,1 mol  |  p = 1 kg  →  m = 0,1 mol / 1 kg = 0,1 m",
        result: "m = 0,1 molal",
        explanation: "Jika asam ini tidak terionisasi sama sekali (nonelektrolit murni), penurunan titik bekunya seharusnya hanya: 1,86 × 0,1 = 0,186 °C."
      },
      {
        stepNumber: 2,
        title: "Menghitung Faktor van 't Hoff Nyata (i)",
        formula: "ΔTf = Kf × m × i   →   i = ΔTf / (Kf × m)",
        calculation: "i = 0,2046 °C / (1,86 °C/m × 0,1 m) = 0,2046 / 0,186 = 1,10",
        result: "i = 1,10",
        explanation: "Karena i = 1,10 (berada di antara 1 dan 2), terbukti bahwa asam HA merupakan elektrolit lemah yang hanya terurai sebagian kecil."
      },
      {
        stepNumber: 3,
        title: "Menghitung Derajat Ionisasi (α) dan Persentasenya",
        formula: "i = 1 + (n − 1)α   →   α = (i − 1) / (n − 1)",
        calculation: "Karena n = 2:  α = (1,10 − 1) / (2 − 1) = 0,10 / 1 = 0,10  (atau 10%)",
        result: "α = 0,10  (10%)",
        explanation: "Artinya, dari setiap 100 molekul HA yang dilarutkan ke dalam air, hanya 10 molekul yang terurai menjadi ion H⁺ dan A⁻, sedangkan 90 molekul lainnya tetap utuh sebagai HA."
      }
    ]
  }
];

// ─── 4. LATIHAN PEMAHAMAN MANDIRI BAB 5 (6 NUMERIK + 2 PILIHAN GANDA + 1 REFLEKSI) ───
export const NUMERIC_QUESTIONS_BAB5 = [
  {
    id: 'q1',
    number: 1,
    question: "Sebanyak 5,85 gram NaCl (Mr = 58,5) dilarutkan ke dalam 500 gram air murni. Jika Kf air = 1,86 °C/m dan NaCl terionisasi sempurna (i = 2), berapakah penurunan titik beku (ΔTf) larutan tersebut dalam °C secara ideal?",
    target: 0.744,
    unit: "°C",
    hint: [
      "Langkah 1: Hitung jumlah mol NaCl: n = massa / Mr.",
      "Langkah 2: Ubah massa air 500 gram menjadi kg (0,5 kg), lalu hitung molalitas m = n / p(kg).",
      "Langkah 3: Gunakan rumus penurunan titik beku elektrolit: ΔTf = Kf × m × i (dengan i = 2)."
    ],
    solution: "n = 5,85 / 58,5 = 0,1 mol. p = 0,5 kg → m = 0,1 / 0,5 = 0,2 m. ΔTf = 1,86 × 0,2 × 2 = 0,744 °C. (Titik beku larutan Tf = −0,744 °C)."
  },
  {
    id: 'q2',
    number: 2,
    question: "Larutan CaCl₂ (Mr = 111) dibuat dengan melarutkan sejumlah garam ke dalam 250 gram air sehingga membeku pada suhu −1,116 °C. Jika Kf air = 1,86 °C/m dan CaCl₂ terurai sempurna (n = 3, α = 1), berapakah gram massa CaCl₂ yang dilarutkan?",
    target: 5.55,
    unit: "gram",
    hint: [
      "Langkah 1: Dari Tf = −1,116 °C, peroleh nilai ΔTf = 1,116 °C.",
      "Langkah 2: Tentukan faktor van 't Hoff untuk CaCl₂ terionisasi sempurna: i = 3.",
      "Langkah 3: Hitung molalitas m dari rumus: m = ΔTf / (Kf × i).",
      "Langkah 4: Hitung mol zat: n = m × p(kg) dengan p = 0,25 kg, lalu konversi ke gram: massa = n × Mr."
    ],
    solution: "ΔTf = 1,116 °C. i = 3. m = 1,116 / (1,86 × 3) = 1,116 / 5,58 = 0,2 m. Mol CaCl₂ = 0,2 × 0,25 kg = 0,05 mol. Massa = 0,05 mol × 111 g/mol = 5,55 gram."
  },
  {
    id: 'q3',
    number: 3,
    question: "Suatu larutan elektrolit biner AB (n = 2, Mr = 50) dengan konsentrasi 0,5 molal membeku pada suhu −1,488 °C. Jika Kf air = 1,86 °C/m, berapakah nilai derajat ionisasi (α) elektrolit tersebut?",
    target: 0.6,
    unit: "(tanpa satuan)",
    hint: [
      "Langkah 1: Dari Tf = −1,488 °C, peroleh nilai ΔTf = 1,488 °C.",
      "Langkah 2: Hitung nilai faktor van 't Hoff: i = ΔTf / (Kf × m).",
      "Langkah 3: Gunakan hubungan i = 1 + (n − 1)α dengan n = 2 untuk mencari nilai α."
    ],
    solution: "ΔTf = 1,488 °C. i = 1,488 / (1,86 × 0,5) = 1,488 / 0,93 = 1,60. Karena n = 2: 1,60 = 1 + (2 − 1)α → α = 0,60 (atau 60%)."
  },
  {
    id: 'q4',
    number: 4,
    question: "Sebanyak 16,25 gram FeCl₃ (Mr = 162,5) dilarutkan ke dalam 500 gram air murni. Jika Kb air = 0,52 °C/m dan FeCl₃ terurai sempurna menjadi ion Fe³⁺ dan 3Cl⁻ (n = 4, α = 1), berapakah kenaikan titik didih (ΔTb) larutan dalam °C?",
    target: 0.416,
    unit: "°C",
    hint: [
      "Langkah 1: Hitung jumlah mol FeCl₃: n = 16,25 / 162,5.",
      "Langkah 2: Hitung molalitas dengan massa pelarut 0,5 kg: m = n / 0,5 kg.",
      "Langkah 3: Tentukan nilai i untuk FeCl₃ (n = 4, α = 1 → i = 4).",
      "Langkah 4: Hitung ΔTb = Kb × m × i."
    ],
    solution: "n = 16,25 / 162,5 = 0,1 mol. m = 0,1 / 0,5 = 0,2 m. i = 4. ΔTb = 0,52 × 0,2 × 4 = 0,416 °C. (Titik didih larutan Tb = 100,416 °C)."
  },
  {
    id: 'q5',
    number: 5,
    question: "Berapakah tekanan osmotik (π) dalam atm dari larutan K₂SO₄ (Mr = 174) dengan konsentrasi 0,1 M pada suhu 27 °C jika terionisasi sempurna (n = 3, α = 1)? (Gunakan R = 0,082 L·atm/mol·K, T = 27 + 273 = 300 K).",
    target: 7.38,
    unit: "atm",
    hint: [
      "Langkah 1: K₂SO₄ terurai menjadi 2K⁺ + SO₄²⁻ sehingga n = 3 dan i = 3.",
      "Langkah 2: Konversi suhu ke Kelvin: T = 27 + 273 = 300 K.",
      "Langkah 3: Gunakan rumus tekanan osmotik elektrolit: π = M × R × T × i."
    ],
    solution: "i = 3. T = 300 K. π = 0,1 mol/L × 0,082 L·atm/mol·K × 300 K × 3 = 7,38 atm."
  },
  {
    id: 'q6',
    number: 6,
    question: "Sebanyak 6 gram asam asetat (CH₃COOH, Mr = 60) dilarutkan dalam 200 gram air (Kb = 0,52 °C/m). Jika larutan mengalami kenaikan titik didih sebesar 0,2704 °C, berapakah nilai faktor van 't Hoff (i) larutan asam cuka tersebut?",
    target: 1.04,
    unit: "(tanpa satuan)",
    hint: [
      "Langkah 1: Hitung mol asam cuka: n = 6 / 60 = 0,1 mol.",
      "Langkah 2: Hitung molalitas m dengan massa pelarut 0,2 kg: m = n / 0,2 kg.",
      "Langkah 3: Hitung nilai faktor van 't Hoff: i = ΔTb / (Kb × m)."
    ],
    solution: "n = 6 / 60 = 0,1 mol. m = 0,1 / 0,2 kg = 0,5 m. ΔTb = 0,2704 °C. i = 0,2704 / (0,52 × 0,5) = 0,2704 / 0,26 = 1,04."
  }
];

export const MC_QUESTIONS_BAB5 = [
  {
    id: 'q7',
    number: 7,
    question: "Terdapat empat larutan berikut yang masing-masing berkonsentrasi 0,1 molal dalam air:\n(1) Glukosa (C₆H₁₂O₆)\n(2) Natrium Klorida (NaCl)\n(3) Kalsium Klorida (CaCl₂)\n(4) Besi(III) Klorida (FeCl₃)\nUrutan larutan dari yang memiliki titik beku PALING RENDAH (paling dingin) ke yang paling tinggi adalah...",
    options: [
      { key: 'A', text: '(1) - (2) - (3) - (4)' },
      { key: 'B', text: '(4) - (3) - (2) - (1)' },
      { key: 'C', text: '(1) - (3) - (2) - (4)' },
      { key: 'D', text: '(4) - (2) - (3) - (1)' },
      { key: 'E', text: 'Semua memiliki titik beku yang sama karena konsentrasinya sama 0,1 m' }
    ],
    correctKey: 'B',
    hint: "Ingat: semakin banyak jumlah partikel ion (faktor i semakin besar), maka penurunan titik beku (ΔTf) semakin besar, sehingga titik beku akhir (Tf) justru semakin rendah / semakin minus di bawah nol!",
    solution: "Nilai i masing-masing: Glukosa (i=1), NaCl (i=2), CaCl₂ (i=3), FeCl₃ (i=4). Penurunan titik beku terbesar dialami oleh FeCl₃ (ΔTf = 4 × 0,186 = 0,744 °C → Tf = −0,744 °C). Maka urutan titik beku paling rendah ke paling tinggi adalah: FeCl₃ (−0,744 °C) < CaCl₂ (−0,558 °C) < NaCl (−0,372 °C) < Glukosa (−0,186 °C). Pilihan B benar."
  },
  {
    id: 'q8',
    number: 8,
    question: "Mengapa larutan infus fisiologis saline medis di rumah sakit menggunakan larutan NaCl dengan konsentrasi sekitar 0,9% massa/volume (± 0,154 M), dan BUKAN larutan glukosa dengan konsentrasi molaritas yang sama (0,154 M)?",
    options: [
      { key: 'A', text: 'Karena glukosa beracun bagi pembuluh darah manusia dalam jumlah kecil.' },
      { key: 'B', text: 'Karena sel darah merah membutuhkan tekanan osmotik sekitar 7,7 atm (~300 mOsm/L). NaCl terurai menjadi 2 ion (i = 2) sehingga menghasilkan osmolaritas 0,154 × 2 ≈ 0,308 Osm/L (isotonik), sedangkan glukosa 0,154 M hanya memiliki i = 1 sehingga hipotonik dan dapat menyebabkan sel darah pecah (lisis).' },
      { key: 'C', text: 'Karena garam NaCl lebih cepat membeku di dalam sel darah daripada gula.' },
      { key: 'D', text: 'Karena ion Na⁺ menaikkan titik didih darah secara drastis saat pasien mengalami demam tinggi.' },
      { key: 'E', text: 'Tidak ada alasan khusus, keduanya dapat saling menggantikan dalam volume dan molaritas yang sama persis.' }
    ],
    correctKey: 'B',
    hint: "Hubungkan dengan tekanan osmotik π = M × R × T × i. Cairan infus harus bersifat isotonik (memiliki osmolaritas efektif partikel yang sama dengan cairan intrasel darah merah).",
    solution: "Cairan intraseluler eritrosit memiliki osmolaritas sekitar 290–310 mOsm/L. NaCl terurai menjadi 2 ion sehingga larutan 0,154 M NaCl menghasilkan konsentrasi partikel 0,154 × 2 = 0,308 Osm/L (308 mOsm/L, tepat isotonik). Jika diberikan glukosa 0,154 M tanpa penyesuaian, osmolaritasnya hanya 154 mOsm/L (sangat hipotonik), menyebabkan air masuk ke dalam sel darah merah hingga membengkak dan pecah (lisis). Pilihan B benar."
  }
];

// ─── 5. KONTEKS DUNIA NYATA / APLIKASI SAINS BAB 5 ───
export const REAL_WORLD_CONTEXTS_BAB5 = [
  {
    id: 'coolant',
    title: "Cairan Antibeku Radiator Mobil: Mengapa Bukan Garam?",
    icon: "🚗",
    badge: "Otomotif & Termodinamika",
    summary: "Mengapa produsen mobil menggunakan senyawa nonelektrolit etilen glikol (C₂H₆O₂) sebagai coolant radiator, dan bukan garam dapur (NaCl) yang sebenarnya memiliki faktor van 't Hoff i = 2 dan lebih murah?",
    explanation: [
      "Secara termodinamika koligatif, garam dapur (NaCl) memang mampu menurunkan titik beku dua kali lipat lebih efektif per mol dibandingkan etilen glikol berkat faktor van 't Hoff i = 2.",
      "Namun dalam praktiknya, ion klorida (Cl⁻) dari garam adalah pemicu korosi agresif (pitting corrosion) yang akan melubangi radiator berbahan aluminium dan merusak water pump mesin hanya dalam hitungan minggu.",
      "Oleh karena itu, industri otomotif memilih etilen glikol yang bersifat nonelektrolit (tidak korosif), memiliki titik didih murni tinggi (197 °C), dan saat dicampur 50:50 dengan air mampu menurunkan titik beku hingga −37 °C sekaligus menaikkan titik didih hingga 106 °C."
    ]
  },
  {
    id: 'infus',
    title: "Cairan Infus Saline Normal NaCl 0,9%: Menjaga Eritrosit Tetap Utuh",
    icon: "💉",
    badge: "Medis & Farmakologi",
    summary: "Bagaimana dokter dan perawat memanfaatkan faktor van 't Hoff untuk memastikan cairan infus tidak merusak sel darah pasien?",
    explanation: [
      "Dinding sel darah merah (eritrosit) adalah membran semipermeabel alami. Agar sel tidak mengkerut (krenasi) atau pecah (hemolisis), cairan infus yang masuk ke pembuluh vena harus memiliki tekanan osmotik yang setara (isotonik, ~7,7 atm pada suhu tubuh 37 °C).",
      "Perhitungan osmolaritas memperhitungkan faktor van 't Hoff: Osmolaritas = Molaritas × i.",
      "Untuk NaCl 0,9% (0,154 M), karena i = 2, maka osmolaritasnya adalah 0,154 × 2 = 0,308 Osm/L (308 mOsm/L). Nilai ini sangat pas dengan osmolaritas plasma darah manusia (~290–300 mOsm/L).",
      "Sebaliknya, jika menggunakan larutan glukosa nonelektrolit (i = 1), diperlukan konsentrasi 5% (0,278 M) agar nilai osmolaritasnya mencapai target isotonik yang sama."
    ]
  }
];
