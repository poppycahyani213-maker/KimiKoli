/**
 * src/utils/exportExcel.js
 * Utilitas ekspor rekap nilai siswa ke file .xlsx dan .csv
 * 
 * Digunakan oleh TeacherDashboard untuk mengunduh data rekap siswa.
 */

// Cegah formula injection: nilai string yang diawali = + - @ dibaca Excel sebagai rumus
const safe = (v) => {
  if (typeof v !== 'string') return v;
  return /^[=+\-@]/.test(v) ? `'${v}` : v;
};

/**
 * Ekspor rekap siswa ke file Excel (.xlsx)
 * Membutuhkan package 'xlsx' (npm install xlsx)
 * 
 * @param {Array} rows - array objek rekap siswa dari TeacherDashboard
 * @param {string} namaFile - nama file tanpa ekstensi (default: 'rekap-nilai-kimikoli')
 */
export async function exportRekapToExcel(rows, namaFile = 'rekap-nilai-kimikoli') {
  if (!rows || rows.length === 0) {
    alert('Tidak ada data siswa untuk diekspor.');
    return;
  }

  const XLSX = await import('xlsx');

  const data = rows.map((r, i) => ({
    No: i + 1,
    Nama: safe(r.name ?? r.nama ?? ''),
    Kelas: safe(r.kelas ?? r.className ?? ''),
    'Pretest (dari 8)': r.pretestScore ?? '',
    'Bab Selesai': r.chaptersCompleted ?? r.progressMissions ?? '',
    'Skor Evaluasi Akhir (dari 10)': r.diagnosticScore != null ? Number(r.diagnosticScore).toFixed(1) : '',
    'XP Total': r.xp ?? '',
    'Terakhir Aktif': r.lastActive ?? '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  // Lebar kolom otomatis
  ws['!cols'] = [
    { wch: 5 },   // No
    { wch: 28 },  // Nama
    { wch: 14 },  // Kelas
    { wch: 16 },  // Pretest
    { wch: 14 },  // Bab Selesai
    { wch: 26 },  // Skor Evaluasi Akhir
    { wch: 10 },  // XP
    { wch: 20 },  // Terakhir Aktif
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Rekap Siswa');

  const tgl = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `${namaFile}-${tgl}.xlsx`);
}

/**
 * Ekspor rekap siswa ke file CSV (fallback tanpa library eksternal)
 * BOM (\ufeff) ditambahkan agar Excel membaca UTF-8 dengan benar.
 * 
 * @param {Array} rows - array objek rekap siswa
 * @param {string} namaFile - nama file tanpa ekstensi
 */
export function exportRekapToCSV(rows, namaFile = 'rekap-nilai-kimikoli') {
  if (!rows?.length) return;

  const esc = (v) => {
    let s = String(v ?? '');
    if (/^[=+\-@]/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.map(esc).join(','),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(',')),
  ];

  // BOM agar Excel membaca UTF-8 dengan benar
  const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${namaFile}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
