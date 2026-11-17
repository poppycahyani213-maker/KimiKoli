import React, { useState, useEffect } from 'react';
import Badge from '../../components/common/Badge';
import LabVirtualStepper, { STAGES_CONFIG } from './LabVirtualStepper';
import Stage1Problem from './stages/Stage1Problem';
import Stage2Design from './stages/Stage2Design';
import Stage3Simulation from './stages/Stage3Simulation';
import Stage4ArduinoPractice from './stages/Stage4ArduinoPractice';
import Stage5DataAnalysis from './stages/Stage5DataAnalysis';
import Stage6Conclusion from './stages/Stage6Conclusion';
import { getCourseProgress, saveCourseProgress } from '../../utils/storage';

/**
 * Komponen Induk Laboratorium Virtual KimiKoli
 * Mengadopsi Sintaks Project Based Learning (PjBL) 6 Tahap Terkunci Berurutan (Sequential Gating).
 * 
 * Tahapan:
 * 1. Pertanyaan Masalah & Hipotesis (+15 XP)
 * 2. Rancang Percobaan & Skema Rangkaian Arduino (+15 XP)
 * 3. Simulasi Kurva Pendinginan Virtual (+20 XP)
 * 4. Praktik Arduino & Perekaman Data (+25 XP)
 * 5. Analisis Data & Penentuan Titik Beku (+25 XP)
 * 6. Kesimpulan, Refleksi & Evaluasi Proyek (+20 XP)
 * 
 * Penyimpanan:
 * Disimpan aman per username pada kunci "kimikoli:v1:<username dinormalisasi>".
 */
export default function LabVirtualHub({
  currentUser = null,
  isCompleted = false,
  onCompleteLab,
  onBackToHome
}) {
  // 1. Inisialisasi state dari data tersimpan user
  const [labState, setLabState] = useState({
    completedStages: [],
    currentStage: 1,
    xpEarned: 0,
    stage1: {},
    stage2: {},
    stage3: {},
    stage4: {},
    stage5: {},
    stage6: {}
  });

  // Muat state lab milik username saat komponen dimuat
  useEffect(() => {
    const userProgress = getCourseProgress(currentUser);
    if (userProgress && userProgress.labState) {
      setLabState((prev) => ({
        ...prev,
        ...userProgress.labState,
        completedStages: Array.isArray(userProgress.labState.completedStages) 
          ? userProgress.labState.completedStages 
          : (isCompleted ? [1, 2, 3, 4, 5, 6] : []),
        currentStage: userProgress.labState.currentStage || 1,
        xpEarned: userProgress.labState.xpEarned || 0
      }));
    } else if (isCompleted) {
      // Jika profil utama sudah completed tapi labState belum rinci
      setLabState((prev) => ({
        ...prev,
        completedStages: [1, 2, 3, 4, 5, 6],
        currentStage: 6,
        xpEarned: 120
      }));
    }
  }, [currentUser, isCompleted]);

  // Handler menyimpan state parsial ke memori dan localStorage per username
  const persistLabState = (nextLabState) => {
    setLabState(nextLabState);

    const currentProgress = getCourseProgress(currentUser) || {};
    const updatedProgress = {
      ...currentProgress,
      labState: nextLabState,
      ...(nextLabState.completedStages?.length === 6 ? { labVirtualCompleted: true } : {})
    };

    saveCourseProgress(updatedProgress, currentUser);
  };

  // Navigasi memilih tahap (hanya bisa jika tahap sudah unlocked)
  const handleSelectStage = (stageId) => {
    const isUnlocked = stageId === 1 || labState.completedStages.includes(stageId - 1);
    if (isUnlocked) {
      const updated = {
        ...labState,
        currentStage: stageId
      };
      persistLabState(updated);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Callback simpan data tiap tahap
  const handleSaveStageData = (stageKey, data) => {
    const updated = {
      ...labState,
      [stageKey]: {
        ...(labState[stageKey] || {}),
        ...data
      }
    };
    persistLabState(updated);
  };

  // Callback saat suatu tahap diselesaikan (+XP & buka tahap berikutnya)
  const handleCompleteStage = (stageNumber, data) => {
    const stageKey = `stage${stageNumber}`;
    const nextCompleted = Array.from(new Set([...labState.completedStages, stageNumber]));
    
    // Hitung total XP lab berdasarkan tahap yang tuntas
    let calculatedXp = 0;
    STAGES_CONFIG.forEach((s) => {
      if (nextCompleted.includes(s.id)) {
        calculatedXp += s.xp;
      }
    });

    // Otomatis arahkan ke tahap berikutnya jika belum tahap terakhir
    const nextStage = stageNumber < 6 ? stageNumber + 1 : stageNumber;

    const updated = {
      ...labState,
      [stageKey]: {
        ...(labState[stageKey] || {}),
        ...data
      },
      completedStages: nextCompleted,
      currentStage: nextStage,
      xpEarned: calculatedXp
    };

    persistLabState(updated);

    if (stageNumber === 6 && onCompleteLab) {
      onCompleteLab();
    }
  };

  // Callback penyelesaian penuh di Tahap 6
  const handleFinalizeLab = (stage6Data) => {
    handleCompleteStage(6, stage6Data);
  };

  const currentStage = labState.currentStage || 1;
  const isAllCompleted = labState.completedStages.length === 6 || isCompleted;

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      {/* 1. Header Banner & Info Modul */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
          <Badge variant="blue">Laboratorium Virtual KimiKoli • PjBL</Badge>
          {isAllCompleted ? (
            <span style={{ fontSize: '0.8rem', background: '#DCFCE7', color: '#166534', padding: '0.2rem 0.65rem', borderRadius: '12px', fontWeight: 700 }}>
              ✓ Seluruh 6 Tahap Lab Tuntas (+120 XP)
            </span>
          ) : (
            <span style={{ fontSize: '0.8rem', background: '#EFF6FF', color: '#0284C7', padding: '0.2rem 0.65rem', borderRadius: '12px', fontWeight: 700 }}>
              🚀 Mode Investigasi Terbimbing Aktif
            </span>
          )}
        </div>

        <h2 style={{ margin: '0.2rem 0', fontSize: '1.85rem', fontWeight: 800, color: '#0F172A' }}>
          Laboratorium Virtual: Eksplorasi Kurva Pendinginan Titik Beku (Hybrid Arduino)
        </h2>
        <p className="text-muted" style={{ fontSize: '1.02rem', margin: 0 }}>
          Paduan simulasi virtual interaktif dan praktikum riil berbasis mikrokontroler Arduino (sensor suhu DS18B20 waterproof + LCD).
        </p>
      </div>

      {/* 2. Tombol Navigasi Kembali */}
      <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={onBackToHome}
          className="btn btn-secondary"
          style={{ padding: '0.45rem 1rem', fontSize: '0.88rem' }}
        >
          ← Kembali ke Beranda
        </button>

        {isAllCompleted && (
          <button
            type="button"
            onClick={onCompleteLab}
            className="btn btn-primary"
            style={{
              padding: '0.45rem 1.15rem',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: '#059669',
              borderColor: '#059669'
            }}
          >
            🏆 Buka Halaman Kuis Evaluasi Akhir →
          </button>
        )}
      </div>

      {/* 3. Stepper Jalur 6 Tahap Terkunci Berurutan */}
      <LabVirtualStepper
        currentStage={currentStage}
        completedStages={labState.completedStages}
        onSelectStage={handleSelectStage}
        totalXpEarned={labState.xpEarned}
      />

      {/* 4. Konten Sesuai Tahap Aktif */}
      <div style={{ marginTop: '1rem' }}>
        {currentStage === 1 && (
          <Stage1Problem
            data={labState.stage1}
            onSave={(data) => handleSaveStageData('stage1', data)}
            isCompleted={labState.completedStages.includes(1)}
            onCompleteStage={handleCompleteStage}
            onNextStage={() => handleSelectStage(2)}
          />
        )}

        {currentStage === 2 && (
          <Stage2Design
            data={labState.stage2}
            onSave={(data) => handleSaveStageData('stage2', data)}
            isCompleted={labState.completedStages.includes(2)}
            onCompleteStage={handleCompleteStage}
            onNextStage={() => handleSelectStage(3)}
            onPrevStage={() => handleSelectStage(1)}
          />
        )}

        {currentStage === 3 && (
          <Stage3Simulation
            data={labState.stage3}
            onSave={(data) => handleSaveStageData('stage3', data)}
            isCompleted={labState.completedStages.includes(3)}
            onCompleteStage={handleCompleteStage}
            onNextStage={() => handleSelectStage(4)}
            onPrevStage={() => handleSelectStage(2)}
          />
        )}

        {currentStage === 4 && (
          <Stage4ArduinoPractice
            data={labState.stage4}
            onSave={(data) => handleSaveStageData('stage4', data)}
            isCompleted={labState.completedStages.includes(4)}
            onCompleteStage={handleCompleteStage}
            onNextStage={() => handleSelectStage(5)}
            onPrevStage={() => handleSelectStage(3)}
          />
        )}

        {currentStage === 5 && (
          <Stage5DataAnalysis
            data={labState.stage5}
            stage4Data={labState.stage4}
            onSave={(data) => handleSaveStageData('stage5', data)}
            isCompleted={labState.completedStages.includes(5)}
            onCompleteStage={handleCompleteStage}
            onNextStage={() => handleSelectStage(6)}
            onPrevStage={() => handleSelectStage(4)}
          />
        )}

        {currentStage === 6 && (
          <Stage6Conclusion
            data={labState.stage6}
            stage1Data={labState.stage1}
            stage5Data={labState.stage5}
            onSave={(data) => handleSaveStageData('stage6', data)}
            isCompleted={labState.completedStages.includes(6)}
            onCompleteStage={handleCompleteStage}
            onFinalizeLab={handleFinalizeLab}
            onPrevStage={() => handleSelectStage(5)}
          />
        )}
      </div>
    </div>
  );
}
