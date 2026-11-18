/**
 * Logika Penilaian dan Evaluasi Diagnostik Miskonsepsi
 * Asesmen Diagnostik Sifat Koligatif Larutan
 */

/**
 * Mengacak urutan elemen array (Fisher-Yates) tanpa memodifikasi array asli.
 */
export function shuffleArray(arr) {
  if (!Array.isArray(arr)) return [];
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Menilai satu nomor soal berdasarkan aturan spesifik:
 * - multi_select (Soal 1): max(0, (benar_dipilih - salah_dipilih) / 3)
 * - true_false_set (Soal 2): jumlah_benar / 5
 * - single (Soal 3, 7, 8, 9, 10): 1 jika benar, 0 jika salah
 * - two_tier (Soal 4, 5, 6): 1 jika kategori === 'P', selain itu 0
 */
export function gradeQuestion(soal, response) {
  if (!response || !soal) return { score: 0 };

  switch (soal.tipe) {
    case 'multi_select': {
      // response: string[] (misal: ["A", "B", "C"])
      const selected = Array.isArray(response) ? response : [];
      const correctKeys = Array.isArray(soal.kunci) ? soal.kunci : [];
      const correctSelected = selected.filter(id => correctKeys.includes(id)).length;
      const incorrectSelected = selected.filter(id => !correctKeys.includes(id)).length;
      const rawScore = (correctSelected - incorrectSelected) / 3;
      const score = Math.max(0, rawScore);
      return {
        score,
        correctSelected,
        incorrectSelected,
        isFullyCorrect: score === 1
      };
    }

    case 'true_false_set': {
      // response: { [id: string]: boolean }
      const answers = typeof response === 'object' && !Array.isArray(response) ? response : {};
      const pernyataanList = Array.isArray(soal.pernyataan) ? soal.pernyataan : [];
      let correctCount = 0;
      pernyataanList.forEach(p => {
        if (answers[p.id] === p.kunci) {
          correctCount++;
        }
      });
      const score = correctCount / (pernyataanList.length || 5);
      return {
        score,
        correctCount,
        totalItems: pernyataanList.length,
        isFullyCorrect: score === 1
      };
    }

    case 'single': {
      // response: string id (misal: "A")
      const isCorrect = String(response).trim().toUpperCase() === String(soal.kunci).trim().toUpperCase();
      return {
        score: isCorrect ? 1 : 0,
        isFullyCorrect: isCorrect
      };
    }

    case 'two_tier': {
      // response: { t1: string, t2: string, confidence: number }
      const t1 = response.t1 ? String(response.t1).trim().toUpperCase() : null;
      const t2 = response.t2 ? String(response.t2).trim() : null;
      const confidence = Number(response.confidence) || 1;

      let category = 'TP';
      if (t1 && t2 && soal.matriks && soal.matriks[t1] && soal.matriks[t1][t2]) {
        category = soal.matriks[t1][t2];
      }

      const score = category === 'P' ? 1 : 0;
      const isFullyCorrect = score === 1;
      const confidenceInterpretation = interpretConfidence(category, confidence);
      const misconceptionName = (category.startsWith('M') && soal.miskonsepsi)
        ? (soal.miskonsepsi[category] || 'Miskonsepsi')
        : null;

      return {
        score,
        isFullyCorrect,
        category,
        misconceptionName,
        confidence,
        confidenceInterpretation,
        saran: soal.saran || null,
        topik: soal.topik || null
      };
    }

    default:
      return { score: 0 };
  }
}

/**
 * Menafsirkan kombinasi kategori dan skala keyakinan (1-5):
 * - Kategori M dengan keyakinan 4-5 -> "Miskonsepsi kuat"
 * - Kategori M dengan keyakinan 3 -> "Miskonsepsi"
 * - Kategori M dengan keyakinan 1-2 -> "Kemungkinan menebak"
 * - Kategori P dengan keyakinan 1-2 -> "Paham, tetapi ragu"
 * - Kategori P dengan keyakinan 3-5 -> "Paham kukuh"
 */
export function interpretConfidence(category, confidence) {
  const conf = Number(confidence) || 1;
  const isM = category && category.startsWith('M');

  if (isM) {
    if (conf >= 4) return 'Miskonsepsi kuat';
    if (conf === 3) return 'Miskonsepsi';
    return 'Kemungkinan menebak';
  }

  if (category === 'P') {
    if (conf <= 2) return 'Paham, tetapi ragu';
    return 'Paham kukuh';
  }

  if (category === 'PS') {
    if (conf <= 2) return 'Kemungkinan menebak';
    return 'Paham sebagian';
  }

  // TP (Tidak Paham) atau lainnya
  if (conf <= 2) return 'Kemungkinan menebak';
  return 'Tidak paham';
}

/**
 * Menghitung skor total dari seluruh daftar soal dan respon peserta didik
 * Mengembalikan total skor (0-10) dengan pembulatan 1 desimal, rincian per soal, dan XP
 */
export function evaluateAssessment(questions, responses) {
  let totalRawScore = 0;
  const details = {};

  questions.forEach(q => {
    const resp = responses[q.no];
    const result = gradeQuestion(q, resp);
    details[q.no] = {
      no: q.no,
      tipe: q.tipe,
      response: resp,
      ...result
    };
    totalRawScore += result.score;
  });

  // Batasi total 0 s.d. 10 dan 1 desimal
  const roundedTotal = Math.min(10, Math.max(0, Math.round(totalRawScore * 10) / 10));
  // XP = skor total * 10 (maksimum 100 XP)
  const xpEarned = Math.round(roundedTotal * 10);

  return {
    totalScore: roundedTotal,
    totalRawScore,
    xpEarned,
    details
  };
}
