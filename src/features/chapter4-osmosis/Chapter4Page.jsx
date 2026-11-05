import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import TripleRepresentation from '../../components/chemistry/TripleRepresentation';
import MisconceptionCard from '../../components/chemistry/MisconceptionCard';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { calculateOsmoticPressure } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';
import imgMentimun from '../../assets/fenomena-mentimun.jpg';

export default function Chapter4Page({ onComplete, isCompleted }) {
  const [molarity, setMolarity] = useState(0.2); // 0.2 M
  const [tempCelsius, setTempCelsius] = useState(25); // 25°C

  const { pi, tempKelvin } = calculateOsmoticPressure(molarity, tempCelsius, 1);

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="blue">Bab 4 • Tekanan Osmotik</Badge>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '1.8rem', fontWeight: 800 }}>
          Tekanan Osmotik & Membran Semipermeabel
        </h2>
        <p className="text-muted" style={{ fontSize: '1.05rem' }}>
          Pergerakan spontan molekul pelarut murni menuju larutan yang lebih pekat melalui membran semipermeabel.
        </p>
      </div>

      {/* D.4: KOTAK MISKONSEPSI UMUM BAB 4 */}
      <MisconceptionCard
        badge="Miskonsepsi Bab 4"
        myth="Pada peristiwa osmosis, partikel zat terlarut (garam atau gula) yang berpindah menembus dinding sel."
        fact="SALAH! Itu adalah definisi DIFUSI zat terlarut. Pada OSMOSIS, yang berpindah menembus membran semipermeabel adalah molekul PELARUT (air murni), mengalir dari larutan encer (hipotonik) menuju larutan yang lebih pekat (hipertonik)."
        explanation="Membran semipermeabel bersifat sangat selektif: pori-porinya hanya cukup untuk dilalui molekul air kecil, sementara ion atau molekul zat terlarut yang lebih besar tertahan tidak dapat lewat."
      />

      {/* C. PEDAGOGIS: TIGA LEVEL REPRESENTASI KIMIA (BAB 4) */}
      <TripleRepresentation
        title="Tiga Level Representasi Kimia"
        conceptName="Tekanan Osmotik (Π) & Osmosis Balik"
        macroscopic={{
          title: "Pengamatan Sehari-hari: Acar Mentimun & Infus Medis",
          image: imgMentimun,
          description: "Potongan mentimun segar yang direndam dalam larutan garam pekat akan berkerut dan kehilangan air, menghasilkan acar yang kenyal renyah. Dalam medis, cairan infus ke pembuluh darah harus bersifat isotonik (setara 0,9% NaCl) agar sel darah merah tidak pecah ataupun mengerut.",
          observations: [
            "Sel mentimun kehilangan turgor/air dan berkerut (krenasi jaringan)",
            "Cairan infus isotonik menjaga volume dan bentuk sel eritrosit darah tetap normal",
            "Pada teknologi desalinasi air laut, air laut dialirkan ke tabung bertekanan tinggi untuk menghasilkan air tawar minum bersih"
          ]
          // TODO: Konten guru: Tambahkan studi kasus lisis eritrosit pada larutan hipotonik vs hipertonik
        }}
        submicroscopic={{
          title: "Skala Partikulat: Seleksi Pori-Pori Membran Semipermeabel",
          description: "Membran semipermeabel memiliki ukuran pori-pori mikroskopis selektif yang hanya cukup dilewati oleh molekul kecil pelarut (H2O), tetapi menahan molekul atau ion terlarut yang lebih besar atau terhidrasi.",
          mechanism: "Secara alami, laju molekul air yang masuk dari sisi encer ke sisi pekat lebih besar daripada sebaliknya (osmosis alami). Namun, jika diberikan tekanan luar hidrostatik yang lebih besar daripada tekanan osmotik (Pluar > Π), molekul air murni dipaksa mengalir melawan gradien konsentrasi menuju sisi air murni (inilah prinsip Osmosis Balik / Reverse Osmosis)."
          // TODO: Konten guru: Tambahkan simulasi partikel menembus pori membran semipermeabel
        }}
        symbolic={{
          title: "Persamaan van 't Hoff untuk Tekanan Osmotik",
          formula: "Π = M × R × T × i",
          formulaAlt: "Π = (n / V) × R × T × i   (atau M = mol terlarut / Liter larutan)",
          variables: [
            { symbol: "Π", desc: "Tekanan osmotik larutan", unit: "atmosfer (atm)" },
            { symbol: "M", desc: "Molaritas larutan (konsentrasi)", unit: "mol/L (M)" },
            { symbol: "R", desc: "Konstanta gas universal (0,08206)", unit: "L·atm/(mol·K)" },
            { symbol: "T", desc: "Suhu mutlak larutan (Kelvin = °C + 273)", unit: "Kelvin (K)" },
            { symbol: "i", desc: "Faktor van 't Hoff (i = 1 untuk nonelektrolit)", unit: "Tanpa satuan" }
          ],
          note: "Tekanan osmotik merupakan sifat koligatif yang paling sensitif untuk mengukur massa molar (Mr) makromolekul biologis berbobot besar (seperti protein dan polimer)."
          // TODO: Konten guru: Tambahkan kalkulator penentuan Mr protein dari nilai tekanan osmotik
        }}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <Card title="Prinsip Tekanan Osmotik">
          <p style={{ lineHeight: 1.7, fontSize: '1rem' }}>
            <strong>Tekanan osmotik (π)</strong> adalah tekanan hidrostatik luar yang harus diberikan pada larutan untuk menghentikan aliran bersih pelarut menembus membran semipermeabel.
          </p>
          <FormulaRenderer
            formula={<span>π = M × R × T</span>}
            description="Persamaan van 't Hoff (Nonelektrolit)"
          />
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Konstanta gas R = 0,082 L·atm/(mol·K), Suhu mutlak T (Kelvin) = T(°C) + 273.
          </p>
        </Card>

        <Card title="Kalkulator Tekanan Osmotik" subtitle="Eksplorasi pengaruh konsentrasi molar dan suhu">
          <div className="control-group">
            <div className="control-label" style={{ fontWeight: 700 }}>
              <span>Molaritas (M):</span>
              <strong>{molarity} M (mol/L)</strong>
            </div>
            <input
              type="range"
              min="0.05"
              max="2.0"
              step="0.05"
              value={molarity}
              onChange={(e) => setMolarity(Number(e.target.value))}
              className="slider-input"
            />
          </div>

          <div className="control-group">
            <div className="control-label" style={{ fontWeight: 700 }}>
              <span>Suhu Lingkungan:</span>
              <strong>{tempCelsius} °C ({tempKelvin} K)</strong>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={tempCelsius}
              onChange={(e) => setTempCelsius(Number(e.target.value))}
              className="slider-input"
            />
          </div>

          <div style={{
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '1.25rem',
            marginTop: '1.25rem'
          }}>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Tekanan Osmotik Terhitung (π)</div>
            <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--primary-600)' }}>
              {formatIndonesianNumber(pi, 2)} atm
            </div>
          </div>
        </Card>
      </div>

      {/* Tombol Lanjut ke Bab 5 */}
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
            {isCompleted ? '✓ Materi Bab 4 Selesai' : 'Siap Lanjut ke Tahap Selanjutnya?'}
          </span>
          <h4 style={{ margin: '0.2rem 0 0', color: '#0F172A', fontSize: '1.1rem' }}>
            Bab 5: Sifat Koligatif Larutan Elektrolit & van 't Hoff
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
          Selesaikan Bab 4 & Buka Bab 5 →
        </Button>
      </div>
    </div>
  );
}
