import React from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import TripleRepresentation from '../../components/chemistry/TripleRepresentation';
import MisconceptionCard from '../../components/chemistry/MisconceptionCard';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import SugarGlassesIllustration from './SugarGlassesIllustration';
import PerbandinganKonsentrasi from './PerbandinganKonsentrasi';
import ContohSoal from './ContohSoal';
import SimulatorLarutan from './SimulatorLarutan';

export default function Chapter1Page({ onComplete, isCompleted }) {

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="blue">Bab 1 • Konsentrasi Larutan</Badge>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '1.8rem', fontWeight: 800 }}>
          Konsentrasi Larutan & Hakikat Sifat Koligatif
        </h2>
        <p className="text-muted" style={{ fontSize: '1.05rem' }}>
          Pelajari bagaimana rasio jumlah partikel zat terlarut terhadap pelarut menentukan sifat larutan.
        </p>
      </div>

      {/* D.2: TES DIAGNOSTIK SINGKAT PRASYARAT SEBELUM BAB 1 */}
      <div style={{
        background: '#F8FAFC',
        border: '1.5px solid #CBD5E1',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.75rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem' }}>📋</span>
            <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>
              Hasil Cek Diagnostik Prasyarat Kimia
            </strong>
          </div>
          <span style={{ fontSize: '0.8rem', background: '#ECFDF5', color: '#065F46', padding: '0.2rem 0.6rem', borderRadius: '12px', fontWeight: 700 }}>
            ✓ Terverifikasi Pretest
          </span>
        </div>

        <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
          Sebelum mempelajari sifat koligatif, pastikan 4 bekal konsep prasyaratmu sudah aman:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
          <div style={{ background: '#FFFFFF', padding: '0.7rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>1. Konsep Mol & Mr</div>
            <div style={{ color: '#10B981', fontWeight: 600 }}>✓ Dikuasai (n = m/Mr)</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>Pondasi menghitung jumlah partikel zat.</div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '0.7rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>2. Pelarut vs Terlarut</div>
            <div style={{ color: '#10B981', fontWeight: 600 }}>✓ Dikuasai (Air = pelarut)</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>Zat terlarut bersifat nonvolatil.</div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '0.7rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>3. Satuan Konsentrasi</div>
            <div style={{ color: '#0284C7', fontWeight: 600 }}>🔍 Pelajari di Bab 1 Ini</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>Fokus pada Molalitas (m) & Fraksi Mol (X).</div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '0.7rem', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
            <div style={{ fontWeight: 700, color: '#0F172A' }}>4. Ionisasi Elektrolit</div>
            <div style={{ color: '#64748B', fontWeight: 600 }}>⏳ Lanjutan di Bab 2 & 5</div>
            <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.2rem' }}>Pengaruh jumlah partikel ion terurai.</div>
          </div>
        </div>
      </div>

      {/* D.4: KOTAK MISKONSEPSI UMUM BAB 1 */}
      <MisconceptionCard
        badge="Miskonsepsi Bab 1"
        myth="Sifat koligatif larutan bergantung pada apakah zat terlarut itu molekul besar atau kecil, manis, asin, atau beracun."
        fact="Sifat koligatif HANYA bergantung pada KUANTITAS (jumlah partikel) zat terlarut di dalam pelarut, dan SAMA SEKALI TIDAK dipengaruhi oleh rasa, warna, ukuran massa molekul, ataupun jenis zat terlarut tersebut."
        explanation="100 butir molekul glukosa (gula manis) dan 100 butir molekul urea (zat pupuk) dalam 1 liter air murni akan menghasilkan penurunan tekanan uap dan penurunan titik beku yang PERSIS SAMA karena jumlah partikel penghalangnya identik."
      />

      {/* C. PEDAGOGIS: TIGA LEVEL REPRESENTASI KIMIA (BAB 1) */}
      <TripleRepresentation
        title="Tiga Level Representasi Kimia"
        conceptName="Konsentrasi & Partikel Koligatif"
        macroscopic={{
          title: "Pengamatan Sehari-hari: Rasa & Kepekatan",
          customVisual: <SugarGlassesIllustration />,
          description: "Ketika melarutkan 1 sendok dan 5 sendok gula ke dalam dua gelas air yang sama banyak, kedua larutan tetap tampak jernih. Namun, larutan dengan 5 sendok gula terasa jauh lebih manis dan sedikit lebih kental. Semakin banyak zat terlarut dalam jumlah pelarut yang sama, semakin pekat larutannya.",
          observations: [
            "Wujud fisik berubah homogen (gula padat larut sempurna dalam air cair)",
            "Larutan yang lebih pekat memiliki kekentalan dan massa jenis yang lebih tinggi",
            "Massa total larutan bertambah, tetapi volume akhir tidak selalu merupakan penjumlahan langsung (akibat celah antarmolekul)"
          ]
          // TODO: Konten guru: Tambahkan studi kasus makroskopik minuman isotonik atau sirup lokal di sini
        }}
        submicroscopic={{
          title: "Skala Partikulat: Sebaran Molekul Terlarut",
          description: "Molekul zat terlarut (glukosa/urea) terlepas dari kristalnya dan dikelilingi oleh molekul-molekul pelarut air (proses hidrasi/solvasi).",
          mechanism: "Hakikat sifat koligatif: 100 partikel glukosa memberikan dampak koligatif yang PERSIS SAMA dengan 100 partikel urea. Yang dihitung adalah kuantitas partikel bebas per satuan massa pelarut, bukan ukuran atau massa molekulnya."
          // TODO: Konten guru: Tambahkan visual interaktif solvasi molekul air (ikatan hidrogen)
        }}
        symbolic={{
          title: "Persamaan Konsentrasi: Molalitas & Fraksi Mol",
          formula: "m = (massa / Mr) × (1000 / p)",
          formulaAlt: "Xt = nt / (nt + np)  |  Xp = np / (nt + np)",
          variables: [
            { symbol: "m", desc: "Molalitas larutan", unit: "mol/kg (m)" },
            { symbol: "massa", desc: "Massa zat terlarut yang ditimbang", unit: "gram (g)" },
            { symbol: "Mr", desc: "Massa molar zat terlarut", unit: "g/mol" },
            { symbol: "p", desc: "Massa pelarut murni", unit: "gram (g)" },
            { symbol: "Xt", desc: "Fraksi mol zat terlarut", unit: "Tanpa satuan (0 ≤ Xt ≤ 1)" },
            { symbol: "Xp", desc: "Fraksi mol pelarut (Xt + Xp = 1)", unit: "Tanpa satuan" }
          ],
          note: "Molalitas (m) dipilih dalam perhitungan sifat koligatif karena nilainya TIDAK bergantung pada perubahan suhu (berbasis massa pelarut, bukan volume larutan)."
          // TODO: Konten guru: Tambahkan latihan konversi Molaritas (M) ke Molalitas (m)
        }}
      />

      {/* D.5: TABEL PERBANDINGAN SATUAN KONSENTRASI & ANIMASI PEMUAIAN */}
      <PerbandinganKonsentrasi />

      {/* D.6: CONTOH SOAL & PEMBAHASAN TERBIMBING BERTAHAP */}
      <ContohSoal />

      {/* Prinsip Dasar */}
      <div style={{ marginBottom: '2rem' }}>
        <Card title="Prinsip Dasar">
          <p style={{ lineHeight: 1.7, fontSize: '1rem', margin: '0 0 1rem 0' }}>
            <strong>Sifat koligatif</strong> adalah sifat larutan yang hanya bergantung pada <em>jumlah partikel</em> zat terlarut, dan <strong>bukan pada jenis</strong> zat terlarut tersebut.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <FormulaRenderer
              formula={<span>m = (massa / M<sub>r</sub>) × (1000 / p)</span>}
              description="Rumus Molalitas (m)"
            />
            <FormulaRenderer
              formula={<span>X<sub>t</sub> = n<sub>t</sub> / (n<sub>t</sub> + n<sub>p</sub>)</span>}
              description="Fraksi Mol Terlarut"
            />
          </div>
        </Card>
      </div>

      {/* Simulator Pembuat Larutan Virtual */}
      <SimulatorLarutan />

      {/* Tombol Lanjut ke Materi Selanjutnya */}
      <div style={{
        marginTop: '2.5rem',
        padding: '1.5rem',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: 'var(--radius-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
      }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 700 }}>
            {isCompleted ? '✓ Materi Bab 1 Selesai' : 'Siap Lanjut ke Tahap Selanjutnya?'}
          </span>
          <h4 style={{ margin: '0.2rem 0 0', color: '#0F172A', fontSize: '1.1rem' }}>
            Bab 2: Penurunan Tekanan Uap & Kenaikan Titik Didih
          </h4>
        </div>

        <Button
          variant="primary"
          onClick={onComplete}
          style={{
            padding: '0.85rem 1.8rem',
            fontSize: '1.05rem',
            background: '#0284C7',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
          }}
        >
          Selesaikan Bab 1 & Buka Bab 2 →
        </Button>
      </div>
    </div>
  );
}
