import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import skemaArduino from '../../../assets/skema-rangkaian-arduino.png';

/**
 * Tahap 2: Rancang Percobaan & Panduan Praktik Arduino (Sintaks PjBL 2)
 * Menampilkan:
 * 1. Penentuan variabel penelitian (bebas, terikat, kontrol).
 * 2. Skema rangkaian Arduino UNO + sensor DS18B20 + resistor pull-up 4.7kΩ (dari gambar user).
 * 3. Kode Arduino (sketch) dengan tombol "Salin" dan format output `waktu_detik,suhu_c`.
 * 4. Checklist langkah kerja & keselamatan kerja.
 * 5. Troubleshooting singkat sensor DS18B20.
 * 6. Tombol unduh panduan PDF & lembar pengamatan cetak.
 */
export default function Stage2Design({
  data = {},
  onSave,
  isCompleted = false,
  onCompleteStage,
  onNextStage,
  onPrevStage
}) {
  const [soluteType, setSoluteType] = useState(data.soluteType || 'nonelektrolit');
  const [soluteName, setSoluteName] = useState(data.soluteName || 'sukrosa');
  const [molality, setMolality] = useState(data.molality || 1.0);
  const [checklist, setChecklist] = useState(data.checklist || {
    alatBahan: false,
    skemaRangkaian: false,
    resistorPullUp: false,
    safetyRules: false,
    serialMonitor: false
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);

  // Kode Sketch Arduino Template
  const arduinoSketchCode = `/*
 * ========================================================
 * PRAKTIKUM KIMIA SIFAT KOLIGATIF: KURVA PENDINGINAN TITIK BEKU
 * Sensor Suhu Digital Dallas DS18B20 Waterproof + Arduino Uno
 * ========================================================
 * Rangkaian:
 * - VCC (Merah)   -> 5V Arduino
 * - GND (Hitam)   -> GND Arduino
 * - DATA (Kuning) -> Pin Digital 2 (D2)
 * - Resistor 4.7kΩ dipasang antara VCC (5V) dan DATA (D2) sebagai Pull-up
 *
 * Format Output Serial Monitor: waktu_detik,suhu_c (contoh: 0,25.40)
 */

#include <OneWire.h>
#include <DallasTemperature.h>

// Pin data DS18B20 terhubung ke pin Digital 2 Arduino
#define ONE_WIRE_BUS 2

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

unsigned long startTime = 0;
const unsigned long intervalWaktu = 10000; // Pembacaan tiap 10 detik (dapat diubah ke 30000 untuk 30 detik)

void setup() {
  Serial.begin(9600);
  sensors.begin();
  
  // Header CSV untuk kemudahan perekaman data ke website
  Serial.println("waktu_detik,suhu_c");
  
  startTime = millis();
}

void loop() {
  unsigned long currentMillis = millis();
  
  // Ambil data setiap interval
  sensors.requestTemperatures();
  float suhuC = sensors.getTempCByIndex(0);
  
  // Hitung waktu berjalan dalam satuan detik
  unsigned long waktuDetik = (currentMillis - startTime) / 1000;
  
  // Cek apakah sensor membaca dengan benar
  if (suhuC != DEVICE_DISCONNECTED_C) {
    Serial.print(waktuDetik);
    Serial.print(",");
    Serial.println(suhuC, 2);
  } else {
    Serial.println("ERR,-127.00");
  }
  
  delay(10000); // Tunda pembacaan selama 10 detik
}
`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(arduinoSketchCode);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const toggleCheck = (key) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveAndComplete = () => {
    const updated = {
      soluteType,
      soluteName,
      molality: Number(molality),
      checklist
    };

    if (onSave) onSave(updated);
    if (onCompleteStage) onCompleteStage(2, updated);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 3000);
  };

  return (
    <div className="fade-in" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <Card
        title="Tahap 2: Merancang Eksperimen & Skema Rangkaian Arduino"
        subtitle="Sintaks PjBL 2 • Menentukan Variabel Penelitian, Skema Sensor DS18B20 & Kode Sketch"
      >
        {/* Banner Penjelasan */}
        <div style={{
          background: '#F0F9FF',
          border: '1.5px solid #BAE6FD',
          borderRadius: '14px',
          padding: '1.15rem',
          marginBottom: '1.5rem'
        }}>
          <strong style={{ fontSize: '1.05rem', color: '#0369A1' }}>
            🎯 Tujuan Perancangan Eksperimen
          </strong>
          <p style={{ margin: '0.35rem 0 0 0', color: '#334155', fontSize: '0.95rem', lineHeight: 1.55 }}>
            Rancanglah parameter larutan yang akan diuji dan pelajari susunan rangkaian sensor suhu digital
            Dallas DS18B20 pada breadboard agar pembacaan suhu titik beku akurat tanpa gangguan kelistrikan.
          </p>
        </div>

        {/* 1. Variabel Penelitian */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#0F172A', fontSize: '1.08rem' }}>
            1. Penentuan Variabel Penelitian:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {/* Variabel Bebas: Jenis Zat */}
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', color: '#1E293B', marginBottom: '0.4rem' }}>
                Variabel Bebas (Jenis Zat Terlarut):
              </label>
              <select
                value={soluteType}
                onChange={(e) => {
                  const val = e.target.value;
                  setSoluteType(val);
                  setSoluteName(val === 'elektrolit' ? 'garam' : 'sukrosa');
                }}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontFamily: "'Times New Roman', Times, serif",
                  fontSize: '0.95rem'
                }}
              >
                <option value="nonelektrolit">Nonelektrolit (Sukrosa / Gula Pasir, i = 1)</option>
                <option value="elektrolit">Elektrolit Biner Kuat (Garam Dapur / NaCl, i ≈ 2)</option>
              </select>
            </div>

            {/* Variabel Bebas: Molalitas */}
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <label style={{ display: 'block', fontWeight: 700, fontSize: '0.92rem', color: '#1E293B', marginBottom: '0.4rem' }}>
                Variabel Bebas (Molalitas Larutan, m):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="range"
                  min="0.5"
                  max="3.0"
                  step="0.5"
                  value={molality}
                  onChange={(e) => setMolality(e.target.value)}
                  style={{ flex: 1 }}
                />
                <span style={{ fontWeight: 700, color: '#0284C7', minWidth: '55px', fontSize: '1rem' }}>
                  {molality} m
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                *Pilihan konsentrasi: 0.5 m, 1.0 m, 1.5 m, 2.0 m
              </span>
            </div>

            {/* Variabel Terikat & Kontrol */}
            <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <strong style={{ fontSize: '0.92rem', color: '#1E293B' }}>Variabel Terikat:</strong>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                  Suhu penurunan titik beku (ΔTf) dan kurva plateau pendinginan.
                </div>
              </div>
              <div>
                <strong style={{ fontSize: '0.92rem', color: '#1E293B' }}>Variabel Kontrol:</strong>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                  Massa pelarut air (50 g), wadah pendingin es + garam kasar, sensor suhu yang sama.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Skema Rangkaian Arduino (Sesuai Gambar User) */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ margin: '0 0 0.75rem 0', color: '#0F172A', fontSize: '1.08rem' }}>
            2. Skema Rangkaian Arduino UNO + Sensor DS18B20 + Resistor Pull-up 4,7 kΩ:
          </h4>
          <div style={{
            background: '#F8FAFC',
            border: '1.5px solid #CBD5E1',
            borderRadius: '16px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            {/* Gambar Skema Nyata */}
            <div style={{
              maxWidth: '680px',
              margin: '0 auto',
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)'
            }}>
              <img
                src={skemaArduino}
                alt="Skema Rangkaian Arduino UNO dengan Sensor DS18B20 dan Resistor Pull-Up 4.7k ohm"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain'
                }}
              />
            </div>

            {/* Keterangan Jalur Kabel & Komponen */}
            <div style={{
              marginTop: '1rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '0.65rem',
              textAlign: 'left'
            }}>
              <div style={{ background: '#FFFFFF', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#EF4444', fontWeight: 700 }}>🔴 Kabel Merah (VCC 5V):</span>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>Dari Pin 5V Arduino ke Pin Kanan DS18B20 & kaki Resistor 4,7kΩ.</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#0F172A', fontWeight: 700 }}>⚫ Kabel Hitam (GND):</span>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>Dari Pin GND Arduino ke Pin Kiri DS18B20.</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#EAB308', fontWeight: 700 }}>🟡 Kabel Kuning (DATA):</span>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>Dari Pin Digital 2 (D2) ke Pin Tengah DS18B20 & kaki Resistor.</div>
              </div>
              <div style={{ background: '#FFFFFF', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ color: '#8B5CF6', fontWeight: 700 }}>🟣 Resistor Pull-up 4,7 kΩ:</span>
                <div style={{ fontSize: '0.85rem', color: '#475569' }}>Menghubungkan jalur DATA (Kuning) ke jalur VCC (Merah).</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Kode Sketch Arduino dengan Tombol Salin */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h4 style={{ margin: 0, color: '#0F172A', fontSize: '1.08rem' }}>
              3. Kode Program Arduino (Sketch Template):
            </h4>
            <button
              type="button"
              onClick={handleCopyCode}
              style={{
                background: copySuccess ? '#059669' : '#0284C7',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 1rem',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              {copySuccess ? '✓ Kode Tersalin!' : '📋 Salin Kode Sketch'}
            </button>
          </div>

          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: '#64748B' }}>
            Sketch ini otomatis mencetak data ke Serial Monitor dengan format <code>waktu_detik,suhu_c</code> yang kompatibel dengan fitur input data KimiKoli.
          </p>

          <pre style={{
            background: '#0F172A',
            color: '#F8FAFC',
            padding: '1rem 1.25rem',
            borderRadius: '12px',
            fontSize: '0.88rem',
            lineHeight: 1.5,
            overflowX: 'auto',
            maxHeight: '260px',
            fontFamily: 'Consolas, Monaco, "Courier New", monospace'
          }}>
            {arduinoSketchCode}
          </pre>
        </div>

        {/* 4. Checklist Langkah Kerja Praktikum (Tersimpan per Username) */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ margin: '0 0 0.65rem 0', color: '#0F172A', fontSize: '1.08rem' }}>
            4. Checklist Prosedur & Kesiapan Praktikum:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={Boolean(checklist.alatBahan)}
                onChange={() => toggleCheck('alatBahan')}
              />
              <span style={{ fontSize: '0.94rem', color: '#1E293B' }}>
                <strong>Alat & Bahan Siap:</strong> Arduino UNO, breadboard, sensor DS18B20 waterproof, resistor 4,7kΩ, kabel jumper, es batu, garam krosok, tabung reaksi, gelas kimia, dan akuades.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={Boolean(checklist.skemaRangkaian)}
                onChange={() => toggleCheck('skemaRangkaian')}
              />
              <span style={{ fontSize: '0.94rem', color: '#1E293B' }}>
                <strong>Perakitan Sirkuit:</strong> Kabel merah terhubung ke 5V, kabel hitam ke GND, dan kabel kuning terhubung ke Pin D2 Arduino.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={Boolean(checklist.resistorPullUp)}
                onChange={() => toggleCheck('resistorPullUp')}
              />
              <span style={{ fontSize: '0.94rem', color: '#1E293B' }}>
                <strong>Resistor Pull-up Terpasang:</strong> Resistor 4,7 kΩ telah menghubungkan jalur Pin D2 ke jalur 5V pada breadboard untuk stabilitas protokol OneWire.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={Boolean(checklist.safetyRules)}
                onChange={() => toggleCheck('safetyRules')}
              />
              <span style={{ fontSize: '0.94rem', color: '#1E293B' }}>
                <strong>Protokol Keselamatan:</strong> Campuran es-garam sangat dingin (hingga -10°C), jangan menyentuh langsung dengan tangan kosong, dan pastikan papan Arduino jauh dari tumpahan air.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', background: '#F8FAFC', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={Boolean(checklist.serialMonitor)}
                onChange={() => toggleCheck('serialMonitor')}
              />
              <span style={{ fontSize: '0.94rem', color: '#1E293B' }}>
                <strong>Uji Serial Monitor:</strong> Serial Monitor Arduino IDE disetel pada baudrate <code>9600 baud</code> dan nilai suhu kamar (±24°C s.d. 28°C) terbaca normal.
              </span>
            </label>
          </div>
        </div>

        {/* 5. Kotak Troubleshooting Singkat */}
        <div style={{
          background: '#FFFBEB',
          border: '1.5px solid #FDE68A',
          borderRadius: '14px',
          padding: '1.15rem',
          marginBottom: '1.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🛠️</span>
            <strong style={{ fontSize: '1rem', color: '#92400E' }}>
              Panduan Troubleshooting Cepat Sensor DS18B20:
            </strong>
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.4rem', fontSize: '0.9rem', color: '#78350F', lineHeight: 1.6 }}>
            <li><strong>Suhu terbaca -127.00°C:</strong> Menandakan pin Data tidak terhubung, kabel longgar, atau resistor pull-up 4,7 kΩ belum terpasang dengan baik.</li>
            <li><strong>Suhu terbaca 85.00°C:</strong> Sensor belum selesai melakukan konversi suhu atau kekurangan daya listrik saat pertama kali dinyalakan.</li>
            <li><strong>LCD I2C menyala tapi tidak ada tulisan:</strong> Putar potensiometer kontras di bagian belakang modul I2C LCD menggunakan obeng kecil, atau periksa alamat I2C (biasanya <code>0x27</code> atau <code>0x3F</code>).</li>
          </ul>
        </div>

        {/* 6. Tombol Unduh Dokumen */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <strong style={{ fontSize: '0.95rem', color: '#0F172A' }}>📄 Berkas Praktikum Fisik:</strong>
            <div style={{ fontSize: '0.84rem', color: '#64748B' }}>
              Unduh modul panduan langkah demi langkah dan lembar pencatatan data cetak untuk diisi saat eksperimen di laboratorium sekolah.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <a
              href="/docs/Panduan_Praktikum_Titik_Beku_Arduino.pdf"
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: 'none',
                background: '#FFFFFF',
                border: '1.5px solid #0284C7',
                color: '#0284C7',
                padding: '0.5rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              📥 Panduan Praktik (PDF)
            </a>
            <a
              href="/docs/Lembar_Pengamatan_Cetak.pdf"
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: 'none',
                background: '#FFFFFF',
                border: '1.5px solid #059669',
                color: '#059669',
                padding: '0.5rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.88rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              🖨️ Lembar Pengamatan (Cetak)
            </a>
          </div>
        </div>

        {/* Footer Navigasi & Simpan */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingTop: '1.15rem',
          borderTop: '1px solid #E2E8F0'
        }}>
          {onPrevStage && (
            <Button variant="secondary" onClick={onPrevStage} style={{ padding: '0.65rem 1.15rem' }}>
              ← Kembali ke Tahap 1
            </Button>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {isSavedFeedback && (
              <span style={{ color: '#059669', fontWeight: 700, fontSize: '0.92rem' }}>
                ✓ Rancangan & checklist berhasil disimpan (+15 XP)
              </span>
            )}
            <Button
              variant="primary"
              onClick={handleSaveAndComplete}
              style={{ padding: '0.75rem 1.4rem', fontWeight: 700, background: '#0284C7' }}
            >
              {isCompleted ? '✓ Simpan Perubahan Rancangan' : '✓ Simpan & Selesaikan Tahap 2 (+15 XP) →'}
            </Button>
            {isCompleted && onNextStage && (
              <Button variant="secondary" onClick={onNextStage} style={{ padding: '0.75rem 1.25rem' }}>
                Lanjut ke Tahap 3 →
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
