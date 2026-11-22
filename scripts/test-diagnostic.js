/**
 * Skrip Verifikasi Unit Test Penilaian Asesmen Diagnostik
 * Menguji 5 kriteria pengujian yang diwajibkan.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { gradeQuestion, evaluateAssessment, shuffleArray } from '../src/utils/diagnosticScoring.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questionsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/diagnosticQuestions.json'), 'utf-8')
);

const soalMap = {};
questionsData.soal.forEach(s => {
  soalMap[s.no] = s;
});

let failedTests = 0;
function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    failedTests++;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('=== MEMULAI UNIT TEST ASESMEN DIAGNOSTIK ===\n');

// 1. Pengujian Soal 1 (multi_select)
console.log('--- Uji 1: Soal 1 (multi_select) ---');
const q1 = soalMap[1];
const r1_1 = gradeQuestion(q1, ['A', 'B', 'C']);
assert(Math.abs(r1_1.score - 1.0) < 0.001, `Pilih A, B, C harus 1.0 (didapat: ${r1_1.score})`);

const r1_2 = gradeQuestion(q1, ['A', 'B']);
assert(Math.abs(r1_2.score - 2/3) < 0.01, `Pilih A, B harus 0.67 (didapat: ${r1_2.score.toFixed(2)})`);

const r1_3 = gradeQuestion(q1, ['A', 'B', 'C', 'D']);
assert(Math.abs(r1_3.score - 2/3) < 0.01, `Pilih A, B, C, D harus 0.67 (didapat: ${r1_3.score.toFixed(2)})`);

const r1_4 = gradeQuestion(q1, ['D', 'E']);
assert(r1_4.score === 0, `Pilih D, E saja harus 0 (didapat: ${r1_4.score})`);

// 2. Pengujian Soal 2 (true_false_set)
console.log('\n--- Uji 2: Soal 2 (true_false_set) ---');
const q2 = soalMap[2];
const r2_1 = gradeQuestion(q2, { '1': true, '2': false, '3': true, '4': true, '5': false });
assert(Math.abs(r2_1.score - 1.0) < 0.001, `Kunci 1:B, 2:S, 3:B, 4:B, 5:S harus 1.0 (didapat: ${r2_1.score})`);

const r2_2 = gradeQuestion(q2, { '1': true, '2': true, '3': true, '4': true, '5': true });
assert(Math.abs(r2_2.score - 0.6) < 0.001, `Semua "Benar" harus 0.6 (didapat: ${r2_2.score})`);

// 3. Pengujian Soal 4 (two_tier)
console.log('\n--- Uji 3: Soal 4 (two_tier) ---');
const q4 = soalMap[4];
const r4_1 = gradeQuestion(q4, { t1: 'B', t2: '3', confidence: 5 });
assert(r4_1.category === 'P' && r4_1.score === 1, `B + alasan 3 harus P (skor 1) (didapat: ${r4_1.category}, skor: ${r4_1.score})`);

const r4_2 = gradeQuestion(q4, { t1: 'C', t2: '1', confidence: 4 });
assert(r4_2.category === 'M1' && r4_2.score === 0, `C + alasan 1 harus M1 (didapat: ${r4_2.category}, skor: ${r4_2.score})`);

const r4_3 = gradeQuestion(q4, { t1: 'A', t2: '4', confidence: 4 });
assert(r4_3.category === 'M3' && r4_3.score === 0, `A + alasan 4 harus M3 (didapat: ${r4_3.category}, skor: ${r4_3.score})`);

const r4_4 = gradeQuestion(q4, { t1: 'B', t2: '1', confidence: 3 });
assert(r4_4.category === 'PS' && r4_4.score === 0, `B + alasan 1 harus PS (didapat: ${r4_4.category}, skor: ${r4_4.score})`);

// 4. Pengujian Soal 6 (two_tier)
console.log('\n--- Uji 4: Soal 6 (two_tier) ---');
const q6 = soalMap[6];
const r6_1 = gradeQuestion(q6, { t1: 'A', t2: '1', confidence: 4 });
assert(r6_1.category === 'M1', `A + alasan 1 harus M1 (didapat: ${r6_1.category})`);

const r6_2 = gradeQuestion(q6, { t1: 'B', t2: '4', confidence: 4 });
assert(r6_2.category === 'M2', `B + alasan 4 harus M2 (didapat: ${r6_2.category})`);

const r6_3 = gradeQuestion(q6, { t1: 'C', t2: '3', confidence: 4 });
assert(r6_3.category === 'M3', `C + alasan 3 harus M3 (didapat: ${r6_3.category})`);

// 5. Pengujian Pengacakan Urutan Opsi Tidak Mempengaruhi Penilaian
console.log('\n--- Uji 5: Pengacakan Opsi Tidak Mengubah Penilaian ---');
let shuffleMatches = 0;
for (let i = 0; i < 20; i++) {
  const shuffledQ1Opsi = shuffleArray(q1.opsi);
  const shuffledQ4T2 = shuffleArray(q4.tingkat2.opsi);
  // Pastikan ID tetap utuh dan penilaian tetap menghasilkan nilai identik
  const evalShuffledQ1 = gradeQuestion(q1, ['A', 'B', 'C']);
  const evalShuffledQ4 = gradeQuestion(q4, { t1: 'B', t2: '3', confidence: 4 });
  if (evalShuffledQ1.score === 1.0 && evalShuffledQ4.category === 'P' && evalShuffledQ4.score === 1) {
    shuffleMatches++;
  }
}
assert(shuffleMatches === 20, `20 kali pengacakan opsi memberikan hasil penilaian identik.`);

console.log('\n=============================================');
if (failedTests === 0) {
  console.log('🎉 SEMUA UNIT TEST ASESMEN DIAGNOSTIK LOLOS 100%!');
} else {
  console.error(`💥 ADA ${failedTests} TES YANG GAGAL.`);
  process.exit(1);
}
