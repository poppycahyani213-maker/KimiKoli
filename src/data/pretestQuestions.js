/**
 * Bank Soal Pretest Prasyarat Sifat Koligatif Larutan
 * Total: 8 Soal Pilihan Ganda (C2 - C3)
 */
export const PRETEST_QUESTIONS = [
  {
    id: 1,
    topic: "Larutan dan Komponennya",
    bloomLevel: "C2",
    question: "Seorang siswa melarutkan 2 sendok gula ke dalam segelas air. Pernyataan yang tepat tentang larutan tersebut adalah …",
    options: [
      { key: "A", text: "Gula adalah pelarut karena jumlahnya lebih sedikit" },
      { key: "B", text: "Air adalah zat terlarut karena berwujud cair" },
      { key: "C", text: "Gula adalah zat terlarut dan termasuk zat yang tidak mudah menguap (nonvolatil)" },
      { key: "D", text: "Air adalah zat terlarut dan termasuk zat yang tidak mudah menguap" },
      { key: "E", text: "Gula dan air sama-sama berperan sebagai pelarut" }
    ],
    correctKey: "C",
    explanation: "Zat terlarut (solute) adalah komponen yang jumlahnya lebih sedikit (dalam hal ini gula), sedangkan pelarutnya (solvent) adalah air. Gula berwujud padat dan bersifat nonvolatil (sukar/tidak mudah menguap), sifat inilah yang nantinya menjadi kunci utama fenomena penurunan tekanan uap pada sifat koligatif."
  },
  {
    id: 2,
    topic: "Konsep Mol dan Massa Molar (Mr)",
    bloomLevel: "C3",
    question: "Jumlah mol dalam 6 gram urea, CO(NH₂)₂ (Ar C = 12, O = 16, N = 14, H = 1), adalah …",
    options: [
      { key: "A", text: "0,01 mol" },
      { key: "B", text: "0,1 mol" },
      { key: "C", text: "0,6 mol" },
      { key: "D", text: "1 mol" },
      { key: "E", text: "10 mol" }
    ],
    correctKey: "B",
    explanation: "Massa molar (Mr) urea CO(NH₂)₂ = 12 + 16 + 2×(14 + 2) = 60 gram/mol. Jumlah mol dihitung dengan rumus n = massa / Mr = 6 gram / 60 gram/mol = 0,1 mol."
  },
  {
    id: 3,
    topic: "Satuan Konsentrasi: Molalitas",
    bloomLevel: "C3",
    question: "Sebanyak 6 gram urea (Mr = 60) dilarutkan dalam 200 gram air. Molalitas larutan tersebut adalah …",
    options: [
      { key: "A", text: "0,03 m" },
      { key: "B", text: "0,05 m" },
      { key: "C", text: "0,3 m" },
      { key: "D", text: "0,5 m" },
      { key: "E", text: "1,2 m" }
    ],
    correctKey: "D",
    explanation: "Mol urea (n) = 6 / 60 = 0,1 mol. Massa pelarut air (p) = 200 gram = 0,2 kg. Rumus molalitas m = n / kg pelarut = 0,1 mol / 0,2 kg = 0,5 m (atau menggunakan m = (6/60) × (1000/200) = 0,1 × 5 = 0,5 m)."
  },
  {
    id: 4,
    topic: "Elektrolit dan Nonelektrolit",
    bloomLevel: "C2",
    question: "Masing-masing zat berikut dilarutkan dalam air dengan jumlah mol yang sama. Larutan yang menghasilkan jumlah partikel terbanyak adalah …",
    options: [
      { key: "A", text: "Glukosa (C₆H₁₂O₆)" },
      { key: "B", text: "Urea (CO(NH₂)₂)" },
      { key: "C", text: "NaCl" },
      { key: "D", text: "CaCl₂" },
      { key: "E", text: "CH₃COOH" }
    ],
    correctKey: "D",
    explanation: "Sifat koligatif bergantung pada jumlah partikel total. CaCl₂ adalah elektrolit kuat yang terurai sempurna menghasilkan 3 ion (1 Ca²⁺ dan 2 Cl⁻). NaCl hanya menghasilkan 2 ion (Na⁺ dan Cl⁻), CH₃COOH terionisasi sebagian (elektrolit lemah), sedangkan glukosa dan urea adalah nonelektrolit (tidak terurai, tetap 1 molekul)."
  },
  {
    id: 5,
    topic: "Wujud Zat dan Perubahan Wujud",
    bloomLevel: "C2",
    question: "Air murni didinginkan dan suhunya dicatat setiap menit. Saat air mulai membeku hingga seluruhnya menjadi es, suhu yang terbaca akan …",
    options: [
      { key: "A", text: "terus turun dengan cepat" },
      { key: "B", text: "naik sedikit demi sedikit" },
      { key: "C", text: "relatif tetap (konstan)" },
      { key: "D", text: "turun lalu naik kembali di atas 0 °C" },
      { key: "E", text: "berubah tidak beraturan" }
    ],
    correctKey: "C",
    explanation: "Selama proses perubahan wujud zat berlangsung (dalam hal ini membeku dari cair ke padat), kalor yang dilepas digunakan untuk membentuk kisi ikatan kristal es, sehingga suhu zat akan tertahan konstan pada titik bekunya (0 °C untuk air murni pada 1 atm). Titik datar inilah dasar membaca titik beku pada kurva pendinginan laboratorium."
  },
  {
    id: 6,
    topic: "Tekanan Uap dan Titik Didih",
    bloomLevel: "C2",
    question: "Suatu zat cair akan mendidih ketika …",
    options: [
      { key: "A", text: "suhunya mencapai 100 °C" },
      { key: "B", text: "tekanan uapnya sama dengan tekanan udara luar" },
      { key: "C", text: "tekanan uapnya lebih kecil daripada tekanan udara luar" },
      { key: "D", text: "seluruh partikelnya sudah menguap" },
      { key: "E", text: "gelembung udara muncul di dasar wadah" }
    ],
    correctKey: "B",
    explanation: "Secara ilmiah fisika-kimia, zat cair mendidih saat tekanan uap jenuh di permukaan cairan sama persis dengan tekanan udara di sekitarnya. Angka 100 °C hanyalah titik didih normal air pada tekanan 1 atm (760 mmHg). Di puncak gunung dengan tekanan udara rendah, air bisa mendidih di bawah 100 °C."
  },
  {
    id: 7,
    topic: "Difusi dan Membran Semipermeabel",
    bloomLevel: "C2",
    question: "Kismis yang direndam dalam air selama beberapa jam akan tampak mengembang. Peristiwa ini terjadi karena …",
    options: [
      { key: "A", text: "gula dalam kismis keluar ke air" },
      { key: "B", text: "air berpindah dari larutan encer ke larutan pekat melalui membran semipermeabel" },
      { key: "C", text: "air berpindah dari larutan pekat ke larutan encer" },
      { key: "D", text: "kismis menyerap udara dari dalam air" },
      { key: "E", text: "suhu air menyebabkan kismis memuai" }
    ],
    correctKey: "B",
    explanation: "Ini merupakan peristiwa osmosis nyata dalam kehidupan sehari-hari: molekul pelarut air (yang lebih encer/hipotonik) bergerak menembus kulit kismis yang berperan sebagai membran semipermeabel menuju cairan sel di dalam kismis yang berkonsentrasi gula tinggi (lebih pekat/hipertonik), sehingga kismis mengembang."
  },
  {
    id: 8,
    topic: "Keterampilan Matematis: Perbandingan",
    bloomLevel: "C3",
    question: "Penurunan titik beku (ΔTf) sebanding dengan molalitas larutan. Jika larutan nonelektrolit 0,2 m memiliki ΔTf = 0,372 °C, maka ΔTf larutan nonelektrolit 0,5 m dalam pelarut yang sama adalah …",
    options: [
      { key: "A", text: "0,149 °C" },
      { key: "B", text: "0,186 °C" },
      { key: "C", text: "0,744 °C" },
      { key: "D", text: "0,930 °C" },
      { key: "E", text: "1,860 °C" }
    ],
    correctKey: "D",
    explanation: "Karena ΔTf = Kf × m, maka perbandingannya berbanding lurus: ΔTf₂ / ΔTf₁ = m₂ / m₁. Maka ΔTf₂ = (0,5 m / 0,2 m) × 0,372 °C = 2,5 × 0,372 °C = 0,930 °C."
  }
];

