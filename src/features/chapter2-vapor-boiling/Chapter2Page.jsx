import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import TripleRepresentation from '../../components/chemistry/TripleRepresentation';
import PrerequisiteRefresher from '../../components/chemistry/PrerequisiteRefresher';
import MisconceptionCard from '../../components/chemistry/MisconceptionCard';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { calculateBoilingPointElevation, calculateVaporPressureLowering } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';
import solventsData from '../../data/solvents.json';
import imgTitikDidih from '../../assets/fenomena-titik-didih.jpg';

export default function Chapter2Page({ onComplete, isCompleted }) {
  const water = solventsData[0]; // Air: Kb = 0.52, normal boiling = 100°C
  const [molality, setMolality] = useState(1); // 1 molal

  // Boiling point calculation
  const { deltaTb, boilingPoint } = calculateBoilingPointElevation(water.kb, molality, 1, water.normalBoilingPoint);

  // Vapor pressure calculation (assuming 25°C where P0 = 23.76 mmHg)
  const approximateXt = molality / (molality + 55.5);
  const { deltaP, pSolution } = calculateVaporPressureLowering(water.vaporPressure25C, approximateXt);

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="blue">Bab 2 • Tekanan Uap & Titik Didih</Badge>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '1.8rem', fontWeight: 800 }}>
          Penurunan Tekanan Uap & Kenaikan Titik Didih
        </h2>
        <p className="text-muted" style={{ fontSize: '1.05rem' }}>
          Bagaimana partikel zat terlarut menghalangi molekul pelarut untuk lepas menguap ke udara?
        </p>
      </div>

      {/* D.1: MODUL PENYEGAR PRASYARAT (MOLALITAS, MOLARITAS, FRAKSI MOL) DENGAN 3 SOAL LATIHAN */}
      <PrerequisiteRefresher isOpenDefault={false} />

      {/* D.4: KOTAK MISKONSEPSI UMUM BAB 2 */}
      <MisconceptionCard
        badge="Miskonsepsi Bab 2"
        myth="Menambahkan garam ke dalam air saat memasak membuat air mendidih lebih cepat."
        fact="SALAH! Penambahan garam justru MENAIKKAN titik didih air (di atas 100°C), sehingga air membutuhkan waktu pemanasan dan kalor lebih banyak untuk mulai mendidih."
        explanation="Mengapa sayuran/makanan lebih cepat matang? Karena saat mendidih, suhu air garam tersebut lebih panas daripada 100°C (misal 102°C - 105°C). Makanan matang lebih cepat berkat suhu rebusan yang lebih tinggi, bukan karena air mendidih lebih awal!"
      />

      {/* C. PEDAGOGIS: TIGA LEVEL REPRESENTASI KIMIA (BAB 2) */}
      <TripleRepresentation
        title="Tiga Level Representasi Kimia"
        conceptName="Tekanan Uap (ΔP) & Titik Didih (ΔTb)"
        macroscopic={{
          title: "Pengamatan Sehari-hari: Air Mendidih di Dapur",
          image: imgTitikDidih,
          description: "Saat memasak sayur atau sup, air yang sudah diberi garam dapur butuh waktu pemanasan lebih lama untuk mendidih dibandingkan air murni, dan suhunya terukur di atas 100°C.",
          observations: [
            "Gelembung uap air pada air garam terbentuk pada suhu lebih tinggi (> 100°C pada 1 atm)",
            "Pemanasan yang lebih panas membuat bahan makanan di dalam kuah matang lebih cepat dan empuk",
            "Saat tutup panci dibuka, uap air yang mengembun di tutup panci adalah air murni (garam tetap berada di dalam panci)"
          ]
          // TODO: Konten guru: Masukkan studi kasus titik didih air di dataran tinggi vs pantai
        }}
        submicroscopic={{
          title: "Skala Partikulat: Hambatan Permukaan Cairan",
          description: "Pada pelarut murni, seluruh permukaan cairan terbuka untuk penguapan molekul air. Namun pada larutan, sebagian luas permukaan ditempati oleh molekul zat terlarut nonvolatil.",
          mechanism: "Partikel zat terlarut yang sukar menguap menghalangi molekul air untuk meloncat lepas ke fase gas. Akibatnya, tekanan uap jenuh larutan menurun. Agar tekanan uap larutan dapat menyamai tekanan udara luar (syarat mendidih), energi kinetik rata-rata partikel harus dinaikkan dengan menaikkan suhu ke titik yang lebih tinggi (ΔTb naik)."
          // TODO: Konten guru: Tambahkan visual interaktif molekul uap yang lepas vs terpantul kembali
        }}
        symbolic={{
          title: "Persamaan Hukum Raoult & Kenaikan Titik Didih",
          formula: "ΔP = Xt × P°   |   P = Xp × P°",
          formulaAlt: "ΔTb = Kb × m × i   |   Tb = Tb° + ΔTb",
          variables: [
            { symbol: "ΔP", desc: "Penurunan tekanan uap jenuh", unit: "mmHg atau atm" },
            { symbol: "P°", desc: "Tekanan uap jenuh pelarut murni", unit: "mmHg atau atm" },
            { symbol: "P", desc: "Tekanan uap jenuh larutan (P < P°)", unit: "mmHg atau atm" },
            { symbol: "Xt", desc: "Fraksi mol zat terlarut", unit: "Tanpa satuan" },
            { symbol: "ΔTb", desc: "Kenaikan titik didih larutan", unit: "°C atau Kelvin" },
            { symbol: "Kb", desc: "Tetapan kenaikan titik didih molal pelarut (Air = 0,52)", unit: "°C·kg/mol (°C/m)" },
            { symbol: "m", desc: "Molalitas larutan", unit: "mol/kg (m)" },
            { symbol: "i", desc: "Faktor van 't Hoff (i = 1 untuk nonelektrolit)", unit: "Tanpa satuan" },
            { symbol: "Tb", desc: "Titik didih larutan (Tb° = 100°C untuk air)", unit: "°C" }
          ],
          note: "Hukum Raoult ΔP = Xt × P° berlaku ketat untuk zat terlarut nonvolatil (sukar menguap). Nilai Kb hanya bergantung pada jenis pelarut, bukan jenis zat terlarut."
          // TODO: Konten guru: Tambahkan contoh tabel tetapan Kb berbagai pelarut organik (benzena, kamfer)
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card title="Hukum Raoult & Kenaikan Titik Didih">
          <p style={{ lineHeight: 1.7, fontSize: '1rem' }}>
            Molekul terlarut memenuhi sebagian permukaan larutan, menurunkan laju penguapan molekul pelarut. Akibatnya, dibutuhkan suhu lebih tinggi agar tekanan uap larutan mencapai tekanan atmosfer (titik didih naik).
          </p>
          <FormulaRenderer
            formula={<span>ΔP = X<sub>t</sub> × P°</span>}
            description="Hukum Raoult (Penurunan Tekanan Uap)"
          />
          <FormulaRenderer
            formula={<span>ΔT<sub>b</sub> = K<sub>b</sub> × m</span>}
            description="Kenaikan Titik Didih (Nonelektrolit)"
          />
        </Card>

        <Card title="Laboratorium Termometer & Tekanan Uap" subtitle="Simulasi pada Pelarut Air (Kb = 0,52 °C/m, P° = 23,76 mmHg pada 25°C)">
          <div className="control-group">
            <div className="control-label" style={{ fontWeight: 700 }}>
              <span>Konsentrasi Zat Terlarut:</span>
              <strong>{molality} molal</strong>
            </div>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={molality}
              onChange={(e) => setMolality(Number(e.target.value))}
              className="slider-input"
            />
          </div>

          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginTop: '1.25rem',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Kenaikan Titik Didih (ΔTb)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-heat)' }}>
                +{formatIndonesianNumber(deltaTb, 2)} °C
              </div>
              <div style={{ fontSize: '0.825rem', marginTop: '0.35rem' }}>
                Titik Didih Larutan: <strong>{formatIndonesianNumber(boilingPoint, 2)} °C</strong>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Penurunan Tekanan Uap (ΔP)</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                -{formatIndonesianNumber(deltaP, 2)} mmHg
              </div>
              <div style={{ fontSize: '0.825rem', marginTop: '0.35rem' }}>
                Tekanan Uap Larutan: <strong>{formatIndonesianNumber(pSolution, 2)} mmHg</strong>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* D.3: PENJELASAN AWAL FAKTOR VAN 'T HOFF & PERBANDINGAN ELEKTROLIT DI BAB 2 */}
      <div style={{
        marginTop: '2rem',
        background: '#FFFFFF',
        border: '1.5px solid #E0E7FF',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>⚡</span>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Jembatan Konsep: Elektrolit vs Nonelektrolit
            </span>
            <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#1E1B4B' }}>
              Faktor van 't Hoff (i): Mengapa Garam Dapur Menaikkan Titik Didih Lebih Tinggi?
            </h4>
          </div>
        </div>

        <p style={{ fontSize: '0.94rem', color: '#475569', lineHeight: 1.6, marginBottom: '1rem' }}>
          Ingat bahwa sifat koligatif <strong>hanya memedulikan jumlah partikel bebas</strong>. Senyawa nonelektrolit (seperti glukosa) tidak terurai saat dilarutkan (1 molekul tetap 1 partikel). Namun senyawa ionik elektrolit (seperti NaCl dan CaCl₂) terurai menjadi kation dan anion bebas, sehingga jumlah partikel pelipatgandanya dinyatakan dengan <strong>Faktor van 't Hoff (i)</strong>:
        </p>

        {/* Tabel Perbandingan 0.1 m Glukosa, NaCl, dan CaCl2 */}
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#EEF2FF', borderBottom: '1px solid #C7D2FE' }}>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left', color: '#3730A3' }}>Zat Terlarut (0,1 m)</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'left', color: '#3730A3' }}>Jenis & Penguraian Ion</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'center', color: '#3730A3' }}>Faktor i</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right', color: '#3730A3' }}>Rumus ΔTb</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right', color: '#3730A3' }}>Kenaikan Titik Didih (ΔTb)</th>
                <th style={{ padding: '0.6rem 0.8rem', textAlign: 'right', color: '#3730A3' }}>Titik Didih Larutan (Tb)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '0.65rem 0.8rem', fontWeight: 800, color: '#0F172A' }}>Glukosa (C₆H₁₂O₆)</td>
                <td style={{ padding: '0.65rem 0.8rem', color: '#475569' }}>Nonelektrolit (tetap 1 molekul utuh)</td>
                <td style={{ padding: '0.65rem 0.8rem', textAlign: 'center', fontWeight: 800, color: '#0284C7' }}>1</td>
                <td style={{ padding: '0.65rem 0.8rem', textAlign: 'right', fontFamily: 'monospace' }}>0,1 × 0,52 × 1</td>
                <td style={{ padding: '0.65rem 0.8rem', textAlign: 'right', fontWeight: 700, color: '#B45309' }}>+0,052 °C</td>
                <td style={{ padding: '0.65rem 0.8rem', textAlign: 'right', fontWeight: 800, color: '#0F172A' }}>100,052 °C</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9', background: '#F8FAFC' }}>
                <td style={{ padding: '0.65rem 0.8rem', fontWeight: 800, color: '#0F172A' }}>Garam Dapur (NaCl)</td>
                <td style={{ padding: '0.65rem 0.8rem', color: '#475569' }}>Elektrolit biner → Na⁺ + Cl⁻ (2 ion)</td>
                <td style={{ padding: '0.65rem 0.8rem', textAlign: 'center', fontWeight: 800, color: '#0284C7' }}>2</td>
                <td style={{ padding: '0.65rem 0.8rem', textAlign: 'right', fontFamily: 'monospace' }}>0,1 × 0,52 × 2</td>
                <td style={{ padding: '0.65rem 0.8rem', textAlign: 'right', fontWeight: 700, color: '#B45309' }}>+0,104 °C (2× lipat!)</td>
                <td style={{ padding: '0.65rem 0.8rem', textAlign: 'right', fontWeight: 800, color: '#0F172A' }}>100,104 °C</td>
              </tr>
              <tr>
                <td style={{ padding: '0.65rem 0.8rem', fontWeight: 800, color: '#0F172A' }}>Kalsium Klorida (CaCl₂)</td>
                <td style={{ padding: '0.65rem 0.8rem', color: '#475569' }}>Elektrolit terner → Ca²⁺ + 2Cl⁻ (3 ion)</td>
                <td style={{ padding: '0.65rem 0.8rem', textAlign: 'center', fontWeight: 800, color: '#0284C7' }}>3</td>
                <td style={{ padding: '0.65rem 0.8rem', textAlign: 'right', fontFamily: 'monospace' }}>0,1 × 0,52 × 3</td>
                <td style={{ padding: '0.65rem 0.8rem', textAlign: 'right', fontWeight: 700, color: '#B45309' }}>+0,156 °C (3× lipat!)</td>
                <td style={{ padding: '0.65rem 0.8rem', textAlign: 'right', fontWeight: 800, color: '#0F172A' }}>100,156 °C</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ fontSize: '0.86rem', color: '#4338CA', background: '#EEF2FF', padding: '0.6rem 0.85rem', borderRadius: '8px' }}>
          💡 <strong>Kesimpulan Awal:</strong> Meski sama-sama berkonsentrasi 0,1 molal, larutan CaCl₂ menghasilkan kenaikan titik didih 3 kali lipat lebih besar daripada glukosa karena menghasilkan 3 partikel per molekul. Konsep ini akan kamu eksplorasi lebih dalam di Bab 5!
        </div>
      </div>

      {/* Tombol Lanjut ke Bab 3 */}
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
            {isCompleted ? '✓ Materi Bab 2 Selesai' : 'Siap Lanjut ke Tahap Selanjutnya?'}
          </span>
          <h4 style={{ margin: '0.2rem 0 0', color: '#0F172A', fontSize: '1.1rem' }}>
            Bab 3: Penurunan Titik Beku & Diagram Fase P–T
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
          Selesaikan Bab 2 & Buka Bab 3 →
        </Button>
      </div>
    </div>
  );
}
