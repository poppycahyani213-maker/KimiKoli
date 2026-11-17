import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import ParticleCanvas from '../components/ParticleCanvas';
import gambarGaramSalju from '../../../assets/fenomena-garam-salju.jpg';
import gambarTitikBeku from '../../../assets/fenomena-titik-beku.jpg';

/**
 * Tahap 1: Pertanyaan Masalah (Fase 1 LKPD Misi Titik Beku)
 *
 * Komponen mencakup:
 * 1. Identitas tim & pembagian peran 4 fungsi
 * 2. Stimulus kontekstual (truk garam jalan salju & es krim tradisional) + link video
 * 3. Pertanyaan pemantik menonjol
 * 4. Aktivitas 1.1: Prediksi individu urutan titik beku (1-3 tanpa kembar, alasan, terkunci setelah simpan)
 * 5. Aktivitas 1.2: Pemodelan partikel submikroskopik (2 kanvas: air murni & larutan saat membeku)
 * 6. Aktivitas 1.3: Rumusan masalah & identifikasi variabel + Misi Proyek
 */
export default function Stage1Problem({
  data = {},
  onSave,
  isCompleted = false,
  onCompleteStage,
  onNextStage
}) {
  // === 1. Identitas Tim & Peran ===
  const [teamName, setTeamName] = useState(data.teamName || '');
  const [members, setMembers] = useState(data.members || {
    member1: '',
    member2: '',
    member3: '',
    member4: ''
  });
  const [roles, setRoles] = useState(data.roles || {
    sensorAssembler: '', // Perakit sensor
    tempController: '',  // Pengaduk dan penjaga suhu
    dataRecorder: '',    // Pencatat data
    graphAnalyst: ''     // Analis grafik
  });

  // === 4. Aktivitas 1.1: Prediksi Individu ===
  // Urutan 1 = paling rendah, 3 = paling tinggi
  const [predictions, setPredictions] = useState(data.predictions || {
    pureWaterRank: '',
    sugarRank: '',
    naclRank: '',
    reason: ''
  });
  // Status apakah prediksi sudah dikunci
  const [isPredictionLocked, setIsPredictionLocked] = useState(
    Boolean(data.isPredictionLocked || isCompleted)
  );

  // === 5. Aktivitas 1.2: Gambar Partikel ===
  const [pureWaterParticles, setPureWaterParticles] = useState(data.pureWaterParticles || []);
  const [solutionParticles, setSolutionParticles] = useState(data.solutionParticles || []);
  const [particleDescriptionBackup, setParticleDescriptionBackup] = useState(
    data.particleDescriptionBackup || ''
  );
  const [particleDifferenceAnalysis, setParticleDifferenceAnalysis] = useState(
    data.particleDifferenceAnalysis || ''
  );

  // === 6. Aktivitas 1.3: Variabel & Rumusan Masalah ===
  const [independentVar, setIndependentVar] = useState(
    data.independentVar || 'Jenis zat terlarut (nonelektrolit vs elektrolit) dan konsentrasi molalitas'
  );
  const [dependentVar, setDependentVar] = useState(
    data.dependentVar || 'Penurunan titik beku (ΔTf) dan bentuk kurva pendinginan'
  );
  const [controlVar, setControlVar] = useState(
    data.controlVar || 'Volume pelarut (air), jenis wadah, laju pendinginan, dan sensor suhu yang sama'
  );
  const [problemStatement, setProblemStatement] = useState(
    data.problemStatement || 'Seberapa besar penurunan titik beku air jika ditambahkan gula atau garam dengan molalitas tertentu, dan bagaimana perbedaan kurva pendinginannya?'
  );

  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Handler update peran
  const handleMemberChange = (key, value) => {
    setMembers((prev) => ({ ...prev, [key]: value }));
  };

  const handleRoleChange = (key, value) => {
    setRoles((prev) => ({ ...prev, [key]: value }));
  };

  // Handler ranking prediksi dengan validasi tidak ada nomor kembar
  const handleRankChange = (sampleKey, rankValue) => {
    if (isPredictionLocked) return;
    setPredictions((prev) => ({
      ...prev,
      [sampleKey]: rankValue
    }));
  };

  // Validasi urutan prediksi (harus 1, 2, 3 tanpa kembar)
  const validatePredictions = () => {
    const { pureWaterRank, sugarRank, naclRank, reason } = predictions;
    if (!pureWaterRank || !sugarRank || !naclRank) {
      alert('⚠️ Mohon tentukan urutan (1-3) untuk ketiga sampel pada Aktivitas 1.1.');
      return false;
    }
    const ranks = [pureWaterRank, sugarRank, naclRank];
    const uniqueRanks = new Set(ranks);
    if (uniqueRanks.size !== 3) {
      alert('⚠️ Nomor peringkat tidak boleh kembar! Gunakan nomor 1 (paling rendah), 2 (tengah), dan 3 (paling tinggi) masing-masing satu kali.');
      return false;
    }
    if (!reason.trim()) {
      alert('⚠️ Mohon tuliskan alasan prediksi titik beku dalam satu kalimat.');
      return false;
    }
    return true;
  };

  // Simpan parsial
  const handleSaveProgress = () => {
    const currentData = {
      teamName,
      members,
      roles,
      predictions,
      isPredictionLocked,
      pureWaterParticles,
      solutionParticles,
      particleDescriptionBackup,
      particleDifferenceAnalysis,
      independentVar,
      dependentVar,
      controlVar,
      problemStatement
    };
    if (onSave) onSave(currentData);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 2500);
  };

  // Kunci prediksi
  const handleLockPredictions = () => {
    if (!validatePredictions()) return;
    setIsPredictionLocked(true);
    const updated = {
      teamName,
      members,
      roles,
      predictions,
      isPredictionLocked: true,
      pureWaterParticles,
      solutionParticles,
      particleDescriptionBackup,
      particleDifferenceAnalysis,
      independentVar,
      dependentVar,
      controlVar,
      problemStatement
    };
    if (onSave) onSave(updated);
    alert('🔒 Prediksi berhasil dikunci! Data ini akan kamu bandingkan kembali di Tahap 6.');
  };

  // Selesaikan Tahap 1
  const handleCompleteStage1 = () => {
    if (!teamName.trim()) {
      alert('⚠️ Mohon lengkapi nama kelompok pada identitas tim.');
      return;
    }
    if (!validatePredictions()) return;
    if (!problemStatement.trim()) {
      alert('⚠️ Mohon lengkapi rumusan masalah penelitian pada Aktivitas 1.3.');
      return;
    }

    const finalData = {
      teamName,
      members,
      roles,
      predictions,
      isPredictionLocked: true,
      pureWaterParticles,
      solutionParticles,
      particleDescriptionBackup,
      particleDifferenceAnalysis,
      independentVar,
      dependentVar,
      controlVar,
      problemStatement
    };

    setIsPredictionLocked(true);
    if (onSave) onSave(finalData);
    if (onCompleteStage) onCompleteStage(1, finalData);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 3000);
  };

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Tahap 1: Pertanyaan Masalah & Orientasi Fenomena (Fase 1)"
        subtitle="Sintaks PjBL 1 • Menelaah Fenomena Nyata, Merumuskan Hipotesis, dan Menetapkan Misi Proyek"
      >
        {/* ============================================================== */}
        {/* BAGIAN 1: Identitas Tim & Pembagian Peran                      */}
        {/* ============================================================== */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>👥</span>
            <strong style={{ fontSize: '1.08rem', color: '#0F172A' }}>
              1. Identitas Kelompok & Pembagian Peran Investigasi
            </strong>
          </div>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: '#64748B' }}>
            Setiap anggota memiliki tanggung jawab utama dalam tim laboratorium ini (dapat bergantian tiap fase investigasi).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#1E293B', marginBottom: '0.3rem' }}>
                Nama Kelompok:
              </label>
              <input
                type="text"
                placeholder="Contoh: Tim Koligatif 1 / Alpha Cryo"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.92rem',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              />
            </div>
          </div>

          {/* Input 4 Anggota */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
            {[1, 2, 3, 4].map((num) => (
              <div key={num}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                  Anggota {num}:
                </label>
                <input
                  type="text"
                  placeholder={`Nama Anggota ${num}`}
                  value={members[`member${num}`] || ''}
                  onChange={(e) => handleMemberChange(`member${num}`, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    fontFamily: "'Times New Roman', Times, serif"
                  }}
                />
              </div>
            ))}
          </div>

          {/* Pembagian Peran */}
          <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <strong style={{ fontSize: '0.88rem', color: '#0369A1', display: 'block', marginBottom: '0.5rem' }}>
              Pembagian Tugas Peran Praktikum:
            </strong>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                  🔧 Perakit Sensor DS18B20:
                </label>
                <input
                  type="text"
                  placeholder="Nama penanggung jawab"
                  value={roles.sensorAssembler}
                  onChange={(e) => handleRoleChange('sensorAssembler', e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                  ❄️ Pengaduk & Penjaga Suhu:
                </label>
                <input
                  type="text"
                  placeholder="Nama penanggung jawab"
                  value={roles.tempController}
                  onChange={(e) => handleRoleChange('tempController', e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                  📝 Pencatat Data LCD / Serial:
                </label>
                <input
                  type="text"
                  placeholder="Nama penanggung jawab"
                  value={roles.dataRecorder}
                  onChange={(e) => handleRoleChange('dataRecorder', e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                  📊 Analis Grafik & Titik Beku:
                </label>
                <input
                  type="text"
                  placeholder="Nama penanggung jawab"
                  value={roles.graphAnalyst}
                  onChange={(e) => handleRoleChange('graphAnalyst', e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BAGIAN 2: Stimulus Kontekstual & Video                           */}
        {/* ============================================================== */}
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>❄️</span>
              <strong style={{ fontSize: '1.08rem', color: '#0369A1' }}>
                2. Stimulus Fenomena: Garam di Jalan Salju vs Pembuat Es Krim Tradisional
              </strong>
            </div>

            <a
              href="https://youtube.com/shorts/uzTApoOfSFo?feature=share"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: '#EF4444',
                color: '#FFFFFF',
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
              }}
            >
              <span>▶️ Tonton Video Fenomena</span>
              <span style={{ fontSize: '0.75rem' }}>↗</span>
            </a>
          </div>

          {/* Grid Dua Fenomena */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {/* Fenomena A */}
            <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1rem', border: '1px solid #BAE6FD' }}>
              <img
                src={gambarGaramSalju}
                alt="Penaburan Garam di Jalan Bersalju"
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.65rem' }}
              />
              <strong style={{ fontSize: '0.94rem', color: '#0F172A', display: 'block', marginBottom: '0.25rem' }}>
                🚛 Truk Menaburkan Garam di Jalan Bersalju
              </strong>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                Di negara bermusim dingin, petugas menaburkan garam batu ke permukaan jalan yang tertutup es. 
                Es mencair seketika meskipun suhu udara sekitar masih di bawah 0°C, mencegah jalanan menjadi licin.
              </p>
            </div>

            {/* Fenomena B */}
            <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '1rem', border: '1px solid #BAE6FD' }}>
              <img
                src={gambarTitikBeku}
                alt="Pembuatan Es Puter Tradisional"
                style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.65rem' }}
              />
              <strong style={{ fontSize: '0.94rem', color: '#0F172A', display: 'block', marginBottom: '0.25rem' }}>
                🍦 Pembuat Es Krim Tradisional (Es Batu + Garam Kasar)
              </strong>
              <p style={{ margin: 0, fontSize: '0.86rem', color: '#475569', lineHeight: 1.5 }}>
                Pedagang es puter menaburkan garam krosok ke timbunan es batu di sekeliling tabung santan.
                Es mencair sebagian, namun suhunya merosot drastis hingga <strong>-5°C sampai -10°C</strong>, membekukan santan di dalamnya.
              </p>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* BAGIAN 3: Pertanyaan Pemantik Menonjol                         */}
        {/* ============================================================== */}
        <div style={{
          background: 'linear-gradient(135deg, #1E293B, #0F172A)',
          color: '#F8FAFC',
          borderRadius: '16px',
          padding: '1.4rem 1.6rem',
          marginBottom: '1.5rem',
          border: '2px solid #38BDF8',
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.4rem' }}>💡</span>
            <span style={{
              background: '#38BDF8',
              color: '#0F172A',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: '6px',
              textTransform: 'uppercase'
            }}>
              Pertanyaan Pemantik Utama
            </span>
          </div>
          <blockquote style={{
            margin: '0.4rem 0',
            fontSize: '1.08rem',
            lineHeight: 1.65,
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#E0F2FE'
          }}>
            &ldquo;Garam tidak punya kemampuan menghangatkan, tetapi es di jalan justru mencair. Di sisi lain, pembuat es krim menaburkan garam ke es agar suhunya makin dingin. Bagaimana mungkin satu zat yang sama tampak &apos;mencairkan&apos; sekaligus &apos;mendinginkan&apos;? Dan bisakah kamu membuktikannya hanya dengan grafik suhu?&rdquo;
          </blockquote>
        </div>

        {/* ============================================================== */}
        {/* BAGIAN 4: Aktivitas 1.1 Prediksi Individu                      */}
        {/* ============================================================== */}
        <div style={{
          background: '#FFFBEB',
          border: '1.5px solid #FDE68A',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🎯</span>
              <strong style={{ fontSize: '1.05rem', color: '#92400E' }}>
                Aktivitas 1.1: Prediksi Individu (Urutan Titik Beku)
              </strong>
            </div>
            {isPredictionLocked && (
              <span style={{
                background: '#DCFCE7',
                color: '#166534',
                fontSize: '0.78rem',
                fontWeight: 700,
                padding: '0.25rem 0.65rem',
                borderRadius: '9999px',
                border: '1px solid #86EFAC'
              }}>
                🔒 Prediksi Terkunci (Akan Dibandingkan di Tahap 6)
              </span>
            )}
          </div>

          <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#78350F', lineHeight: 1.55 }}>
            Urutkan perkiraan titik beku ketiga sampel berikut dari <strong>paling rendah (1)</strong> hingga <strong>paling tinggi (3)</strong>.
            Gunakan angka 1, 2, dan 3 tanpa ada nomor kembar.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Air Murni */}
            <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid #FDE68A' }}>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#0369A1', marginBottom: '0.4rem' }}>
                💧 Air Murni (Pelarut)
              </strong>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#64748B', marginBottom: '0.3rem' }}>
                Peringkat Titik Beku:
              </label>
              <select
                disabled={isPredictionLocked}
                value={predictions.pureWaterRank}
                onChange={(e) => handleRankChange('pureWaterRank', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                <option value="">-- Pilih Peringkat --</option>
                <option value="1">1 (Paling Rendah)</option>
                <option value="2">2 (Tengah)</option>
                <option value="3">3 (Paling Tinggi)</option>
              </select>
            </div>

            {/* Larutan Gula 1 m */}
            <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid #FDE68A' }}>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#D97706', marginBottom: '0.4rem' }}>
                🍬 Larutan Gula 1 m
              </strong>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#64748B', marginBottom: '0.3rem' }}>
                Peringkat Titik Beku:
              </label>
              <select
                disabled={isPredictionLocked}
                value={predictions.sugarRank}
                onChange={(e) => handleRankChange('sugarRank', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                <option value="">-- Pilih Peringkat --</option>
                <option value="1">1 (Paling Rendah)</option>
                <option value="2">2 (Tengah)</option>
                <option value="3">3 (Paling Tinggi)</option>
              </select>
            </div>

            {/* Larutan NaCl 1 m */}
            <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid #FDE68A' }}>
              <strong style={{ display: 'block', fontSize: '0.95rem', color: '#DC2626', marginBottom: '0.4rem' }}>
                🧂 Larutan Garam (NaCl) 1 m
              </strong>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#64748B', marginBottom: '0.3rem' }}>
                Peringkat Titik Beku:
              </label>
              <select
                disabled={isPredictionLocked}
                value={predictions.naclRank}
                onChange={(e) => handleRankChange('naclRank', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '0.9rem',
                  fontFamily: "'Times New Roman', Times, serif"
                }}
              >
                <option value="">-- Pilih Peringkat --</option>
                <option value="1">1 (Paling Rendah)</option>
                <option value="2">2 (Tengah)</option>
                <option value="3">3 (Paling Tinggi)</option>
              </select>
            </div>
          </div>

          {/* Alasan Prediksi */}
          <div style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#78350F', marginBottom: '0.3rem' }}>
              Alasan Prediksimu (1 Kalimat):
            </label>
            <textarea
              disabled={isPredictionLocked}
              rows={2}
              value={predictions.reason}
              onChange={(e) => setPredictions((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="Tuliskan alasan singkat mengapa kamu memprediksi urutan tersebut..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.92rem',
                fontFamily: "'Times New Roman', Times, serif",
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {!isPredictionLocked && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={handleLockPredictions}
                style={{
                  background: '#D97706',
                  color: '#FFFFFF',
                  padding: '0.5rem 1.1rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                🔒 Kunci Prediksi Saya
              </button>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* BAGIAN 5: Aktivitas 1.2 Gambar Partikel Submikroskopik          */}
        {/* ============================================================== */}
        <div style={{
          background: '#F8FAFC',
          border: '1.5px solid #CBD5E1',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🔬</span>
            <strong style={{ fontSize: '1.05rem', color: '#0F172A' }}>
              Aktivitas 1.2: Pemodelan Partikel Submikroskopik Saat Membeku
            </strong>
          </div>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: '#64748B', lineHeight: 1.55 }}>
            Gunakan kanvas di bawah untuk memodelkan susunan partikel menggunakan stempel <strong>○ (Molekul Air)</strong> dan <strong>● (Zat Terlarut)</strong>.
            Bayangkan bagaimana partikel-partikel tersebut berinteraksi saat transisi menuju fase padat (es).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            {/* Kanvas 1: Air Murni */}
            <ParticleCanvas
              title="A. Air Murni Saat Membeku"
              subtitle="Molekul air membentuk kisi kristal heksagonal teratur"
              particles={pureWaterParticles}
              onChange={setPureWaterParticles}
              height={190}
            />

            {/* Kanvas 2: Larutan Saat Membeku */}
            <ParticleCanvas
              title="B. Larutan (Air + Zat Terlarut) Saat Membeku"
              subtitle="Partikel terlarut menghalangi penyusunan kisi kristal es"
              particles={solutionParticles}
              onChange={setSolutionParticles}
              height={190}
            />
          </div>

          {/* Deskripsi tertulis cadangan */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.86rem', color: '#334155', marginBottom: '0.3rem' }}>
              Deskripsi Tertulis Model Partikel (Cadangan):
            </label>
            <input
              type="text"
              placeholder="Contoh: Pada air murni molekul air bebas saling mengikat, sedangkan pada larutan partikel terlarut menyela di antara molekul air..."
              value={particleDescriptionBackup}
              onChange={(e) => setParticleDescriptionBackup(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.88rem',
                fontFamily: "'Times New Roman', Times, serif"
              }}
            />
          </div>

          {/* Pertanyaan analisis partikel */}
          <div>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', color: '#0F172A', marginBottom: '0.35rem' }}>
              Apa yang berbeda pada susunan partikel kedua sistem itu?
            </label>
            <textarea
              rows={3}
              value={particleDifferenceAnalysis}
              onChange={(e) => setParticleDifferenceAnalysis(e.target.value)}
              placeholder="Jelaskan pengaruh kehadiran partikel zat terlarut (●) terhadap kemampuan molekul air (○) untuk saling merapat membentuk kristal es padat..."
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.92rem',
                fontFamily: "'Times New Roman', Times, serif",
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* ============================================================== */}
        {/* BAGIAN 6: Aktivitas 1.3 Rumusan Masalah & Misi Proyek          */}
        {/* ============================================================== */}
        <div style={{
          background: '#EFF6FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>📋</span>
            <strong style={{ fontSize: '1.05rem', color: '#0369A1' }}>
              Aktivitas 1.3: Identifikasi Variabel Penelitian & Rumusan Masalah
            </strong>
          </div>

          {/* Input 3 Variabel */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem', marginBottom: '1rem' }}>
            <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.86rem', color: '#0369A1', marginBottom: '0.3rem' }}>
                Variabel Bebas (Manipulasi):
              </label>
              <input
                type="text"
                value={independentVar}
                onChange={(e) => setIndependentVar(e.target.value)}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.86rem', color: '#B45309', marginBottom: '0.3rem' }}>
                Variabel Terikat (Respon):
              </label>
              <input
                type="text"
                value={dependentVar}
                onChange={(e) => setDependentVar(e.target.value)}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ background: '#FFFFFF', padding: '0.85rem', borderRadius: '10px', border: '1px solid #BAE6FD' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.86rem', color: '#15803D', marginBottom: '0.3rem' }}>
                Variabel Kontrol (Dijaga Konstan):
              </label>
              <input
                type="text"
                value={controlVar}
                onChange={(e) => setControlVar(e.target.value)}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.88rem' }}
              />
            </div>
          </div>

          {/* Rumusan Masalah */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', color: '#0F172A', marginBottom: '0.3rem' }}>
              Rumusan Masalah Penelitian:
            </label>
            <textarea
              rows={3}
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              placeholder="Contoh: Seberapa besar penurunan titik beku air jika ditambahkan gula/garam dengan molalitas tertentu?"
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.92rem',
                fontFamily: "'Times New Roman', Times, serif",
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Banner Misi Proyek Menonjol */}
          <div style={{
            background: 'linear-gradient(90deg, #0284C7, #0369A1)',
            color: '#FFFFFF',
            padding: '1.1rem 1.3rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.25)'
          }}>
            <span style={{ fontSize: '2rem' }}>🚀</span>
            <div>
              <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9, fontWeight: 700 }}>
                Misi Utama Proyek PjBL
              </div>
              <strong style={{ fontSize: '1.05rem', lineHeight: 1.4 }}>
                &ldquo;Rancang dan bangun alat pencatat suhu yang cukup andal untuk mengukur titik beku larutan.&rdquo;
              </strong>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* Footer Navigasi & Simpan                                       */}
        {/* ============================================================== */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '1.15rem',
          borderTop: '1px solid #E2E8F0'
        }}>
          <div>
            {isSavedFeedback && (
              <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}>
                ✓ Seluruh isian Tahap 1 berhasil disimpan (+15 XP)
              </span>
            )}
            {isCompleted && !isSavedFeedback && (
              <span style={{ color: '#059669', fontSize: '0.9rem', fontWeight: 600 }}>
                ✓ Tahap 1 telah selesai (+15 XP diraih)
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Button
              variant="secondary"
              onClick={handleSaveProgress}
              style={{ padding: '0.65rem 1rem', fontSize: '0.92rem' }}
            >
              💾 Simpan Draf
            </Button>

            <Button
              variant="primary"
              onClick={handleCompleteStage1}
              style={{
                padding: '0.75rem 1.4rem',
                fontSize: '0.98rem',
                fontWeight: 700,
                background: '#0284C7'
              }}
            >
              {isCompleted ? '✓ Simpan Perubahan Tahap 1' : '✓ Selesaikan Tahap 1 (+15 XP) →'}
            </Button>

            {isCompleted && onNextStage && (
              <Button
                variant="secondary"
                onClick={onNextStage}
                style={{ padding: '0.75rem 1.25rem', fontSize: '0.98rem' }}
              >
                Lanjut ke Tahap 2 →
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
