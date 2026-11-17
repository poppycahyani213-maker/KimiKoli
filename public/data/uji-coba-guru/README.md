# Dataset Uji Coba Guru (Ilustrasi LKPD Misi Titik Beku)

File CSV dalam folder ini merupakan **data ilustrasi** yang didigitasi dan diinterpolasi linear per detik dari kurva grafik pada LKPD Misi Titik Beku (praktikum sensor DS18B20 + Arduino).

Format kolom:
- `detik`: waktu pengamatan dalam detik (integer, 1 baris per detik)
- `suhu_C`: suhu terbaca sensor dalam derajat Celsius (°C)

File yang tersedia:
1. `air-murni.csv` (0–386 detik): kurva pendinginan air murni dengan fenomena supercooling hingga -2,06 °C.
2. `nacl-1m.csv` (0–230 detik): kurva pendinginan larutan NaCl 1 m dengan supercooling hingga -9,7 °C dan lonjakan tajam ke Tf ≈ -4,6 °C.
3. `gula-1m.csv` (0–500 detik): kurva pendinginan larutan gula 1 m dengan kurva melandai di Tf ≈ -1,4 °C.

> **CATATAN PENGEMBANGAN:**
> File ini saat ini berisi data ilustrasi hasil digitasi LKPD untuk keperluan simulasi & latihan membaca grafik. File ini akan diganti dengan file rekaman CSV riil dari percobaan Arduino asli oleh guru/pengembang.
