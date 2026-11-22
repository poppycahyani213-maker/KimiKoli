import React, { useState } from 'react';
import { getStoredData, setStoredData, getAuthUser } from '../../utils/storage';

import imgCard1 from '../../assets/fenomena-card-1.jpg';
import imgCard2 from '../../assets/fenomena-card-2.jpg';
import imgCard3 from '../../assets/fenomena-card-3.jpg';
import imgCard4 from '../../assets/fenomena-card-4.jpg';
import imgCard5 from '../../assets/fenomena-card-5.jpg';
import imgCard6 from '../../assets/fenomena-card-6.jpg';
import imgCard7 from '../../assets/fenomena-card-7.jpg';
import imgCard8 from '../../assets/fenomena-card-8.jpg';

// Helper kunci penyimpanan progres kartu fenomena per siswa
export function getCh4CardKey() {
  const user = getAuthUser();
  if (user && user.name) {
    const cleanName = user.name.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    const cleanClass = (user.className || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
    return `koligatif_ch4_cards_v1_${cleanName}_${cleanClass}`;
  }
  return 'koligatif_ch4_cards_v1_guest';
}

// 8 Kartu Fenomena Osmosis dengan Ilustrasi Realistis
const FENOMENA_CARDS = [
  {
    id: 1,
    title: 'Acar Mentimun',
    image: imgCard1,
    penjelasan: 'Mentimun direndam larutan garam/cuka yang pekat. Air keluar dari sel mentimun ke larutan, sehingga sel mengerut dan mentimun menjadi keriput.',
    larutanLuar: 'hipertonik',
    arahAir: 'dari dalam sel ke luar sel',
  },
  {
    id: 2,
    title: 'Ikan Asin',
    image: imgCard2,
    penjelasan: 'Garam membuat cairan di permukaan ikan sangat pekat. Air keluar dari sel ikan dan dari sel bakteri, sehingga ikan kering dan bakteri sulit hidup. Itulah sebabnya ikan asin awet.',
    larutanLuar: 'hipertonik',
    arahAir: 'dari dalam sel ke luar sel',
  },
  {
    id: 3,
    title: 'Cairan Infus',
    image: imgCard3,
    penjelasan: 'Infus harus isotonik dengan darah (tekanan osmotiknya sama, sekitar 7,7 atm). Jika terlalu encer, air masuk ke sel darah merah sampai pecah. Jika terlalu pekat, sel darah merah mengerut.',
    larutanLuar: 'isotonik',
    arahAir: 'seimbang, masuk = keluar',
  },
  {
    id: 4,
    title: 'Desalinasi Air Laut',
    image: imgCard4,
    penjelasan: 'Air laut diberi tekanan yang lebih besar dari tekanan osmotiknya, sehingga molekul air dipaksa melewati membran ke sisi air tawar, sedangkan garam tertahan. Ini disebut osmosis balik.',
    larutanLuar: 'hipertonik + diberi tekanan',
    arahAir: 'dari larutan pekat ke encer (dibalik)',
  },
  {
    id: 5,
    title: 'Akar Menyerap Air',
    image: imgCard5,
    penjelasan: 'Cairan di dalam sel akar lebih pekat daripada air tanah, sehingga air tanah masuk ke sel akar.',
    larutanLuar: 'hipotonik',
    arahAir: 'dari tanah ke dalam akar',
  },
  {
    id: 6,
    title: 'Sayur Layu Jadi Segar',
    image: imgCard6,
    penjelasan: 'Sayur yang layu sudah kehilangan air. Saat direndam air, air masuk kembali ke sel sehingga sel menegang dan sayur segar lagi.',
    larutanLuar: 'hipotonik',
    arahAir: 'dari luar ke dalam sel',
  },
  {
    id: 7,
    title: 'Siput Ditaburi Garam',
    image: imgCard7,
    penjelasan: 'Garam larut di lendir siput dan membentuk larutan sangat pekat. Air keluar dari tubuh siput, sehingga tubuhnya mengerut.',
    larutanLuar: 'hipertonik',
    arahAir: 'dari tubuh ke luar',
  },
  {
    id: 8,
    title: 'Manisan Buah',
    image: imgCard8,
    penjelasan: 'Buah direndam larutan gula pekat. Air keluar dari sel buah dan sel mikroba, sehingga buah lebih awet.',
    larutanLuar: 'hipertonik',
    arahAir: 'dari dalam sel ke luar sel',
  },
];

export default function KartuFenomena({ onCompleteAll }) {
  // State kartu yang sedang terbalik (flipped)
  const [flippedMap, setFlippedMap] = useState({});

  // State ID kartu yang pernah dibuka (dibaca belakangnya)
  const [openedCards, setOpenedCards] = useState(() => {
    const key = getCh4CardKey();
    const saved = getStoredData(key, []);
    return Array.isArray(saved) ? saved : [];
  });

  const toggleFlip = (id) => {
    setFlippedMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    // Jika belum tercatat sebagai kartu dibuka, simpan
    if (!openedCards.includes(id)) {
      const updated = [...openedCards, id];
      setOpenedCards(updated);
      const key = getCh4CardKey();
      setStoredData(key, updated);

      if (updated.length === FENOMENA_CARDS.length && onCompleteAll) {
        onCompleteAll();
      }
    }
  };

  const openedCount = openedCards.length;

  return (
    <div style={{ fontFamily: "'Times New Roman', Times, serif" }}>

      {/* ── Header & Penghitung Kartu Dibuka ────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem',
        padding: '0.85rem 1.25rem',
        background: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
        flexWrap: 'wrap',
        gap: '0.65rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🃏</span>
          <div>
            <strong style={{ fontSize: '1.05rem', color: '#0F172A', display: 'block' }}>
              8 Kartu Fenomena Osmosis Sehari-hari
            </strong>
            <span style={{ fontSize: '0.84rem', color: '#64748B' }}>
              Klik kartu bergambar untuk membalik dan melihat rahasia arah perpindahan airnya
            </span>
          </div>
        </div>

        {/* Counter Badge */}
        <div style={{
          fontSize: '0.88rem',
          fontWeight: 700,
          color: openedCount === 8 ? '#059669' : '#0284C7',
          background: openedCount === 8 ? '#ECFDF5' : '#F0F9FF',
          border: `1.5px solid ${openedCount === 8 ? '#86EFAC' : '#BAE6FD'}`,
          padding: '0.35rem 0.85rem',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <span>{openedCount === 8 ? '🎉' : '🔍'}</span>
          <span>Kartu dibuka: <strong>{openedCount}/8</strong></span>
        </div>
      </div>

      {/* ── Grid 8 Kartu (4 Kolom di Laptop, 2 Kolom di HP) ─────────────── */}
      <div className="fenomena-grid">
        {FENOMENA_CARDS.map((item) => {
          const isFlipped = Boolean(flippedMap[item.id]);

          // Penentuan warna badge larutan luar
          const isHiper = item.larutanLuar.includes('hipertonik');
          const isHipo = item.larutanLuar.includes('hipotonik');
          const isIso = item.larutanLuar.includes('isotonik');

          let badgeBg = '#FEF2F2';
          let badgeBorder = '#FECACA';
          let badgeColor = '#B91C1C';

          if (isHipo) {
            badgeBg = '#EFF6FF';
            badgeBorder = '#BFDBFE';
            badgeColor = '#1D4ED8';
          } else if (isIso) {
            badgeBg = '#ECFDF5';
            badgeBorder = '#A7F3D0';
            badgeColor = '#047857';
          }

          return (
            <div
              key={item.id}
              className="flip-card-container"
              onClick={() => toggleFlip(item.id)}
              title="Klik untuk membalik kartu"
            >
              <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>

                {/* ── SISI DEPAN (FRONT) - ILUSTRASI AKURAT ──────────────── */}
                <div
                  className="flip-card-front"
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
                  }}
                >
                  {/* Area Gambar Persegi (aspect-ratio 1:1) - gambar utuh & tidak terpotong */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '1 / 1',
                    background: '#FFFDF9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    padding: '0.25rem',
                    boxSizing: 'border-box',
                  }}>
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block',
                      }}
                    />
                  </div>

                  {/* Keterangan Bawah Sisi Depan: Nomor Kecil & Instruksi Klik */}
                  <div style={{
                    padding: '0.65rem 0.85rem',
                    background: '#FFFFFF',
                    borderTop: '1px solid #F1F5F9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}>
                    <span style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#64748B',
                      background: '#F1F5F9',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '6px',
                      lineHeight: 1.2,
                    }}>
                      #{item.id}
                    </span>
                    <span style={{
                      fontSize: '0.78rem',
                      color: '#0284C7',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}>
                      ↻ Klik untuk melihat rahasia
                    </span>
                  </div>
                </div>

                {/* ── SISI BELAKANG (BACK) - PENJELASAN ILMIAH ───────────── */}
                <div
                  className="flip-card-back"
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #0284C7',
                    padding: '1.1rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 14px rgba(2, 132, 199, 0.12)',
                    textAlign: 'left',
                  }}
                >
                  <div>
                    {/* Header Sisi Belakang */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.94rem', color: '#0369A1' }}>
                        #{item.id} {item.title}
                      </strong>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>↺ kembali</span>
                    </div>

                    {/* Penjelasan Singkat */}
                    <p style={{
                      margin: '0 0 0.6rem',
                      fontSize: '0.84rem',
                      color: '#334155',
                      lineHeight: 1.5,
                    }}>
                      {item.penjelasan}
                    </p>
                  </div>

                  {/* Dua Label Kecil di Bagian Bawah */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', borderTop: '1px dashed #E2E8F0', paddingTop: '0.55rem' }}>
                    {/* Label 1: Larutan Luar */}
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: badgeBg,
                      border: `1px solid ${badgeBorder}`,
                      color: badgeColor,
                      padding: '0.22rem 0.5rem',
                      borderRadius: '6px',
                      lineHeight: 1.3,
                    }}>
                      Larutan luar: <strong>{item.larutanLuar}</strong>
                    </div>

                    {/* Label 2: Arah Air */}
                    <div style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      color: '#334155',
                      padding: '0.22rem 0.5rem',
                      borderRadius: '6px',
                      lineHeight: 1.3,
                    }}>
                      💧 Arah air: <strong>{item.arahAir}</strong>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
