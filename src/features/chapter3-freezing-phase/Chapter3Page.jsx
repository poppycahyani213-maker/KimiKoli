import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import TripleRepresentation from '../../components/chemistry/TripleRepresentation';
import MisconceptionCard from '../../components/chemistry/MisconceptionCard';
import { FormulaRenderer } from '../../components/chemistry/FormulaRenderer';
import { calculateFreezingPointDepression } from '../../utils/colligative';
import { formatIndonesianNumber } from '../../utils/formatNumber';
import { getStoredData } from '../../utils/storage';
import solventsData from '../../data/solvents.json';
import imgTitikBeku from '../../assets/fenomena-titik-beku.jpg';
import KontrasDidihBeku from './KontrasDidihBeku';
import OrientasiMasalah from './OrientasiMasalah';
import DugaanHipotesis, { DUGAAN_OPTIONS, getCh3HypothesisKey } from './DugaanHipotesis';
import SajikanHasil, { getCh3ResultsKey, checkIsPhase4Complete } from './SajikanHasil';
import LatihanKPSBab3, { getCh3KpsKey } from './LatihanKPSBab3';

// ── PBL Phase metadata ────────────────────────────────────────────────────────
const PBL_PHASES = [
  { id: 1, label: 'Orientasi masalah',      short: '1' },
  { id: 2, label: 'Mengorganisasi belajar', short: '2' },
  { id: 3, label: 'Penyelidikan',           short: '3' },
  { id: 4, label: 'Menyajikan hasil',       short: '4' },
  { id: 5, label: 'Analisis & evaluasi',    short: '5' },
];

// ── Reusable placeholder box for coming-soon phases ──────────────────────────
function PlaceholderBox({ text }) {
  return (
    <div style={{
      border: '2px dashed #CBD5E1',
      borderRadius: '12px',
      padding: '2rem 1.5rem',
      background: '#F8FAFC',
      color: '#64748B',
      textAlign: 'center',
      fontSize: '1rem',
      lineHeight: 1.6,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
    }}>
      <span style={{ fontSize: '1.4rem' }}>🚧</span>
      <span><strong>Segera:</strong> {text}</span>
    </div>
  );
}

// ── Phase section header ─────────────────────────────────────────────────────
function PhaseHeader({ number, title }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <span style={{
        display: 'inline-block',
        background: '#EFF6FF',
        color: '#1D4ED8',
        border: '1px solid #BFDBFE',
        borderRadius: '999px',
        padding: '0.2rem 0.9rem',
        fontSize: '0.78rem',
        fontWeight: 700,
        letterSpacing: '0.03em',
        marginBottom: '0.4rem',
      }}>
        FASE {number}
      </span>
      <h3 style={{
        margin: 0,
        fontSize: '1.3rem',
        fontWeight: 800,
        color: '#1E293B',
      }}>
        {title}
      </h3>
    </div>
  );
}

export default function Chapter3Page({ onComplete, isCompleted }) {
  const water = solventsData[0]; // Air: Kf = 1.86, normal freezing = 0.0°C
  const [molality, setMolality] = useState(1);
  const [activePhase, setActivePhase] = useState(1);
  const [hypothesisData, setHypothesisData] = useState(() => {
    return getStoredData(getCh3HypothesisKey(), null);
  });

  // ── 3 Syarat Kelulusan Bab 3 ──────────────────────────────────────────────
  const [isHypothesisSaved, setIsHypothesisSaved] = useState(() => {
    if (isCompleted) return true;
    const hyp = getStoredData(getCh3HypothesisKey(), null);
    return Boolean(hyp && hyp.choice);
  });

  const [isPhase4Completed, setIsPhase4Completed] = useState(() => {
    if (isCompleted) return true;
    const res = getStoredData(getCh3ResultsKey(), null);
    return checkIsPhase4Complete(res);
  });

  const [isKpsPassed, setIsKpsPassed] = useState(() => {
    if (isCompleted) return true;
    const kps = getStoredData(getCh3KpsKey(), null);
    return Boolean(kps && kps.isPassed);
  });

  // Sinkronisasi jika bab berstatus isCompleted
  useEffect(() => {
    if (isCompleted) {
      setIsHypothesisSaved(true);
      setIsPhase4Completed(true);
      setIsKpsPassed(true);
    }
  }, [isCompleted]);

  const isReadyToProceed = (isHypothesisSaved && isPhase4Completed && isKpsPassed) || isCompleted;

  const { deltaTf, freezingPoint } = calculateFreezingPointDepression(
    water.kf, molality, 1, water.normalFreezingPoint
  );

  // ── Muat ulang hypothesisData bila akun/localStorage berganti ──────────────
  useEffect(() => {
    const data = getStoredData(getCh3HypothesisKey(), null);
    if (data) setHypothesisData(data);
  }, []);

  // ── IntersectionObserver: highlight active phase in nav ───────────────────
  useEffect(() => {
    const observers = [];
    PBL_PHASES.forEach(p => {
      const el = document.getElementById(`fase-${p.id}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActivePhase(p.id); },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollToPhase = (n) => {
    document.getElementById(`fase-${n}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectedDugaanObj = hypothesisData?.choice
    ? DUGAAN_OPTIONS.find(o => o.id === hypothesisData.choice)
    : null;

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>

      {/* ── Judul Bab ──────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Badge variant="blue">Bab 3 • Titik Beku &amp; Diagram Fase</Badge>
        <h2 style={{ marginTop: '0.5rem', marginBottom: '0.25rem', fontSize: '1.8rem', fontWeight: 800 }}>
          Penurunan Titik Beku &amp; Diagram Fase
        </h2>
        <p className="text-muted" style={{ fontSize: '1.05rem' }}>
          Mengapa penambahan garam dapat mencairkan salju atau membuat es krim membeku pada suhu di bawah 0°C?
        </p>
      </div>

      {/* ── Sticky Phase Nav Bar ───────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 90,
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
        marginBottom: '2rem',
        marginLeft: '-1rem',
        marginRight: '-1rem',
        padding: '0 1rem',
      }}>
        <ol style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: '0.45rem 0',
          gap: '0.25rem',
          overflowX: 'auto',
        }}>
          {PBL_PHASES.map((p, i) => {
            const isActive = activePhase === p.id;
            return (
              <React.Fragment key={p.id}>
                <li>
                  <button
                    onClick={() => scrollToPhase(p.id)}
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '999px',
                      padding: '0.3rem 0.85rem',
                      fontSize: '0.8rem',
                      fontWeight: isActive ? 700 : 500,
                      fontFamily: "'Times New Roman', Times, serif",
                      background: isActive ? '#1D4ED8' : '#F1F5F9',
                      color: isActive ? '#FFFFFF' : '#475569',
                      transition: 'background 0.2s, color 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {/* Desktop: number + label; Mobile (via CSS): number only */}
                    <span className="pbl-nav-full">{p.id} {p.label}</span>
                    <span className="pbl-nav-short">{p.id}</span>
                  </button>
                </li>
                {i < PBL_PHASES.length - 1 && (
                  <li aria-hidden="true" style={{
                    display: 'flex', alignItems: 'center',
                    color: '#CBD5E1', fontSize: '0.75rem', userSelect: 'none',
                  }}>·</li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          FASE 1: Orientasi Siswa pada Masalah
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="fase-1" style={{ marginBottom: '3rem', scrollMarginTop: '64px' }}>
        <PhaseHeader number={1} title="Orientasi Siswa pada Masalah" />
        <OrientasiMasalah />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FASE 2: Mengorganisasi Siswa untuk Belajar
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="fase-2" style={{ marginBottom: '3rem', scrollMarginTop: '64px' }}>
        <PhaseHeader number={2} title="Mengorganisasi Siswa untuk Belajar" />
        <DugaanHipotesis onDataSaved={(data) => {
          setHypothesisData(data);
          setIsHypothesisSaved(true);
        }} />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FASE 3: Membimbing Penyelidikan
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="fase-3" style={{ marginBottom: '3rem', scrollMarginTop: '64px' }}>
        <PhaseHeader number={3} title="Membimbing Penyelidikan" />

        {/* KontrasDidihBeku: termometer + tabel kontras + satu zat dua manfaat */}
        <KontrasDidihBeku />

        {/* Tiga Level Representasi Kimia */}
        <TripleRepresentation
          title="Tiga Level Representasi Kimia"
          conceptName="Penurunan Titik Beku (ΔTf)"
          macroscopic={{
            title: "Pengamatan Sehari-hari: Gerobak Es Puter & Salju",
            image: imgTitikBeku,
            description: "Penjual es puter memutar adonan santan dalam tabung baja yang dikelilingi campuran es batu dan garam krosok. Campuran tersebut meleleh namun suhunya anjlok hingga mencapai -5°C sampai -10°C.",
            observations: [
              "Es batu yang ditaburi garam kasar mencair dengan cepat, tetapi cairan yang terbentuk terasa jauh lebih dingin",
              "Adonan es di dalam tabung logam membeku sempurna tanpa bantuan mesin pendingin listrik / freezer",
              "Di negara 4 musim, garam NaCl/CaCl2 ditaburkan ke jalan raya bersalju agar es meleleh pada suhu di bawah 0°C dan jalan tidak licin"
            ]
          }}
          submicroscopic={{
            title: "Skala Partikulat: Runtuhnya Kisi Kristal Es",
            description: "Air murni membeku menjadi es ketika molekul-molekul H2O menata diri menjadi kisi kristal heksagonal yang sangat teratur melalui ikatan hidrogen.",
            mechanism: "Kehadiran partikel zat terlarut (seperti ion Na⁺, Cl⁻, atau molekul gula) bertindak sebagai pengotor mekanis yang menyusup di antara molekul air. Partikel ini merusak kestabilan kisi kristal es. Agar molekul air tetap dapat mengatasi gangguan ini dan membentuk ikatan padat, energi kinetik molekul harus diperlambat lebih jauh lagi melalui pendinginan ke suhu yang lebih rendah (Tf < 0°C)."
          }}
          symbolic={{
            title: "Persamaan Penurunan Titik Beku & Suhu Beku",
            formula: "ΔTf = Kf × m × i",
            formulaAlt: "Tf = Tf° − ΔTf   (untuk air: Tf = 0°C − ΔTf)",
            variables: [
              { symbol: "ΔTf", desc: "Penurunan titik beku larutan (selalu positif)", unit: "°C atau Kelvin" },
              { symbol: "Kf",  desc: "Tetapan penurunan titik beku molal pelarut (Air = 1,86)", unit: "°C·kg/mol (°C/m)" },
              { symbol: "m",   desc: "Molalitas larutan", unit: "mol/kg (m)" },
              { symbol: "i",   desc: "Faktor van 't Hoff (i = 1 untuk nonelektrolit)", unit: "Tanpa satuan" },
              { symbol: "Tf°", desc: "Titik beku pelarut murni (Air = 0,00°C)", unit: "°C" },
              { symbol: "Tf",  desc: "Titik beku larutan yang terukur (selalu lebih rendah dari Tf°)", unit: "°C" }
            ],
            note: "Nilai Kf air (1,86 °C/m) jauh lebih besar daripada Kb air (0,52 °C/m), sehingga efek penurunan titik beku selalu tampak lebih signifikan dibandingkan kenaikan titik didih pada konsentrasi yang sama."
          }}
        />

        {/* Prinsip + Simulasi Titik Beku */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <Card title="Prinsip Penurunan Titik Beku">
            <p style={{ lineHeight: 1.7, fontSize: '1rem' }}>
              Molekul zat terlarut merusak susunan kristal rapi pelarut padat (es). Agar dapat membeku menjadi kisi padat, energi kinetik molekul harus diturunkan lebih jauh ke suhu yang lebih dingin.
            </p>
            <FormulaRenderer
              formula={<span>ΔT<sub>f</sub> = K<sub>f</sub> × m</span>}
              description="Penurunan Titik Beku (Nonelektrolit)"
            />
            <FormulaRenderer
              formula={<span>T<sub>f</sub> = T<sub>f</sub>° − ΔT<sub>f</sub></span>}
              description="Titik Beku Larutan"
            />
          </Card>

          <Card title="Simulasi Titik Beku Larutan Air" subtitle="Tetapan Kf Air = 1,86 °C/m, Titik Beku Normal = 0,00 °C">
            <div className="control-group">
              <div className="control-label" style={{ fontWeight: 700 }}>
                <span>Konsentrasi Molalitas (m):</span>
                <strong>{molality} molal</strong>
              </div>
              <input
                type="range"
                min="0.1"
                max="4"
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
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Penurunan Titik Beku (ΔTf)</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-600)' }}>
                  {formatIndonesianNumber(deltaTf, 2)} °C
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Titik Beku Larutan (Tf)</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-cold)' }}>
                  {formatIndonesianNumber(freezingPoint, 2)} °C
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FASE 4: Mengembangkan dan Menyajikan Hasil
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="fase-4" style={{ marginBottom: '3rem', scrollMarginTop: '64px' }}>
        <PhaseHeader number={4} title="Mengembangkan dan Menyajikan Hasil" />
        <SajikanHasil />
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FASE 5: Menganalisis dan Mengevaluasi Proses
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="fase-5" style={{ marginBottom: '3rem', scrollMarginTop: '64px' }}>
        <PhaseHeader number={5} title="Menganalisis dan Mengevaluasi Proses" />

        {/* ── Evaluasi Dugaan Awal dari Fase 2 ────────────────────────────── */}
        <div style={{
          background: '#FFFFFF',
          border: '1.5px solid #CBD5E1',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🔍</span>
            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              Refleksi Dugaan Awalmu
            </h4>
          </div>

          {hypothesisData && hypothesisData.choice ? (
            <div style={{
              background: '#F8FAFC',
              padding: '1rem 1.25rem',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              marginBottom: '1rem'
            }}>
              <div style={{ marginBottom: hypothesisData.reason ? '0.6rem' : 0 }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Dugaan awalmu:
                </span>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1E293B', marginTop: '0.2rem' }}>
                  Pilihan {hypothesisData.choice}: {selectedDugaanObj ? selectedDugaanObj.text : ''}
                </div>
              </div>

              {hypothesisData.reason && (
                <div style={{ paddingTop: '0.6rem', borderTop: '1px dashed #E2E8F0' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Alasanmu:
                  </span>
                  <p style={{ margin: '0.25rem 0 0', color: '#334155', fontStyle: 'italic', fontSize: '0.975rem', lineHeight: 1.5 }}>
                    “{hypothesisData.reason}”
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              background: '#FFFBEB',
              padding: '0.85rem 1.25rem',
              borderRadius: '8px',
              border: '1px solid #FCD34D',
              color: '#92400E',
              fontSize: '0.95rem',
              marginBottom: '1rem'
            }}>
              ℹ️ Kamu belum memilih dugaan awal di <strong>Fase 2</strong>. Kamu dapat kembali ke bagian atas untuk memilih dan menyimpannya.
            </div>
          )}

          {/* Penjelasan bahwa jawaban yang tepat adalah B */}
          <div style={{
            background: hypothesisData?.choice === 'B' ? '#F0FDF4' : '#EFF6FF',
            border: hypothesisData?.choice === 'B' ? '1.5px solid #86EFAC' : '1.5px solid #93C5FD',
            borderRadius: '10px',
            padding: '1rem 1.25rem',
            color: hypothesisData?.choice === 'B' ? '#166534' : '#1E40AF'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '1.3rem' }}>
                {hypothesisData?.choice === 'B' ? '🎉' : '💡'}
              </span>
              <strong style={{ fontSize: '1.05rem' }}>
                Jawaban yang Tepat: B
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.975rem', lineHeight: 1.6 }}>
              <strong>Garam menurunkan titik beku</strong>, sehingga campuran es dan garam menjadi lebih dingin dari 0 °C (dapat mencapai −5 °C hingga −10 °C) dan menyerap panas dari adonan es puter di dalam tabung logam sampai adonan membeku.
            </p>
            {hypothesisData?.choice && hypothesisData.choice !== 'B' && (
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', fontStyle: 'italic', color: '#475569' }}>
                Pilihan {hypothesisData.choice} adalah anggapan yang sering muncul sebelum mempelajari konsep ini. Simak kotak miskonsepsi di bawah untuk meluruskan pemahamanmu!
              </p>
            )}
          </div>
        </div>

        <p style={{
          fontSize: '1rem',
          color: '#475569',
          marginBottom: '1rem',
          fontStyle: 'italic',
        }}>
          Bandingkan dengan dugaan awalmu:
        </p>

        {/* Kedua kotak miskonsepsi berdampingan */}
        <div className="misconception-grid-dual">
          <MisconceptionCard
            badge="Miskonsepsi 1: Garam menghangatkan es"
            myth="Garam membuat es batu cepat mencair karena garam menghasilkan sifat panas atau menghangatkan es."
            fact="SALAH! Garam justru MENURUNKAN titik beku air. Campuran es dan garam melebur pada suhu di bawah 0°C sambil menyerap kalor dari sekitarnya, sehingga suhu larutan anjlok drastis mencapai -5°C hingga -10°C!"
            explanation="Suhu super dingin di bawah titik beku normal inilah yang menyerap panas dari adonan es puter di dalam tabung logam, memungkinkan adonan membeku padat menjadi es krim lezat tanpa bantuan freezer listrik."
            style={{ height: '100%', marginBottom: 0 }}
          />

          <MisconceptionCard
            badge="Miskonsepsi 2: Didih naik, beku ikut naik?"
            myth="Zat terlarut menaikkan titik didih, jadi titik beku juga ikut naik."
            fact="Titik beku justru TURUN. Zat terlarut membuat larutan 'betah' di fase cair: lebih sulit mendidih sekaligus lebih sulit membeku, sehingga rentang suhu fase cair melebar ke dua arah."
            explanation="Partikel terlarut menghalangi pelarut lepas ke udara (tekanan uap turun, butuh suhu >100°C untuk mendidih), sekaligus mengganggu keteraturan molekul pelarut menyusun kisi kristal es (butuh pendinginan ekstra <0°C untuk membeku)."
            style={{ height: '100%', marginBottom: 0 }}
          />
        </div>
      </section>

      {/* ── Tombol Lanjut ke Bab 4 ─────────────────────────────────────────── */}
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
            {isCompleted ? '✓ Materi Bab 3 Selesai' : 'Siap Lanjut ke Tahap Selanjutnya?'}
          </span>
          <h4 style={{ margin: '0.2rem 0 0', color: '#0F172A', fontSize: '1.1rem' }}>
            Bab 4: Tekanan Osmotik &amp; Membran Semipermeabel
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
          Selesaikan Bab 3 &amp; Buka Bab 4 →
        </Button>
      </div>

    </div>
  );
}
