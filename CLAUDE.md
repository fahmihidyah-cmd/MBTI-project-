# CLAUDE.md — YOUR STORY / Lima Sumbu

Dokumen konteks proyek. Dibaca dulu sebelum mengerjakan apa pun di repo ini.

---

## 1. Apa proyek ini

Platform personality & relationship berbasis multi-lens assessment + storytelling.

**Inti produk:** user tidak sekadar diberi label "ENTJ", tapi mendapat cerita tentang
siapa dirinya, bagaimana orang lain mengalaminya, dan kenapa sebuah hubungan terasa
mudah atau sulit.

**Positioning:** self-understanding dan relationship reflection.
Bukan alat diagnosis, bukan terapi, bukan prediksi keberhasilan hubungan, bukan alat seleksi kerja.

---

## 2. Status saat ini

Aplikasi web statis. Tanpa build step, tanpa dependensi, tanpa backend.

```
index.html            markup dan urutan layar
assets/style.css      seluruh gaya visual
src/data-items.js     bank soal: 5 sumbu (100), Big Five (20), Kelekatan (16), Nilai (12)
src/data-types.js     isi naratif 16 tipe, sisi A/T, temperamen, gaya kelekatan
src/relations.js      mesin hubungan + penyusun cerita berdua
src/story.js          story engine: blok narasi, persepsi, eksperimen
src/data-lens.js      lensa komunikasi, Enneagram, astrologi
src/share-card.js     render kartu berbagi ke canvas + unduh PNG
src/profile-code.js   encoder/decoder kode profil
src/app.js            alur tes, radar, tab hasil, penyimpanan
```

### Sudah jalan

| Fitur | Catatan |
|---|---|
| 5 sumbu | E/I, S/N, T/F, J/P, A/T |
| Bank soal | 100 item skenario, diacak tiap sesi |
| 3 mode tes | Kilat 10 · Standar (adaptif ±20) · Lengkap 40 |
| Adaptive testing | Nambah soal hanya pada sumbu yang CI-nya masih lebar |
| Confidence interval | `98 × sd/√n`, ditampilkan sebagai `62% ± 9` |
| Radar 5 sumbu | Canvas 2D, animasi masuk + pita ketidakpastian |
| Potret terkurasi | "Ini aku / Bukan aku" per kalimat |
| **Mode Berdua** | Kode profil, tempel kode teman, cerita 8 bagian + langkah |
| **Lensa Kelekatan** | 16 item, dua sumbu kontinu (cemas × hindar) |
| **Lensa Nilai Hidup** | 12 item, 6 kelompok, tiga teratas |
| Big Five mini | 20 item, cross-check dengan sumbu A/T |
| Cek Jujur | Uji efek Barnum dengan kalimat umum tersamar |
| Konteks | Versi kerja / rumah / apa adanya, bisa dibandingkan |
| Riwayat | Pengingat 28 hari, deteksi pergeseran |
| Mode tim | Roster, kutub yang belum terwakili, komposisi A/T |
| Label tingkat bukti | Badge per lensa: dukungan riset kuat / kerangka reflektif |
| **Story engine** | 9 bab mengalir, blok bersyarat, 10 varian pembuka |
| **Persepsi orang lain** | Pertama ketemu / setelah kenal / saat tertekan / saat sayang |
| **Eksperimen perilaku** | 3 dipilih dari 17, wajib beda lensa |
| **Gaya komunikasi** | 12 item, dua sumbu (lugas × fokus isi), masuk ke cerita berdua |
| **Enneagram** | 18 item penyaringan, tampilkan 2 kandidat, user yang memutuskan |
| **Kartu berbagi** | Canvas 1080×1350, 3 tema, user pilih kalimat, unduh PNG |
| **Bagian hiburan** | Astrologi, dipisah total dan tidak dipakai di analisis mana pun |

### Keputusan teknis

- **Tanpa dependensi eksternal.** Tidak ada CDN, tidak ada framework. Visual pakai Canvas 2D.
- **Script klasik, bukan ES module.** Supaya `file://` tetap jalan tanpa server. Urutan `<script>` di `index.html` penting.
- **Storage wrapper** `store.get/set` — coba `window.storage`, fallback ke memori sesi. Jangan pakai `localStorage`.
- **Hypercube 4D/5D sudah dibuang.** Terlalu kecil dan ramai di HP, rawan macet. Radar segilima lebih terbaca. Jangan dihidupkan lagi tanpa alasan kuat.
- **Bahasa "kamu"**, bukan "Anda". Kosakata sehari-hari.
- **Skor kontinu, bukan huruf saja.** Huruf hanya ringkasan tampilan.
- **Data orang lain tidak pernah dikirim ke mana pun.** Mode Berdua bekerja lewat kode yang ditempel manual.

---

## 3. Prinsip yang tidak boleh dilanggar

1. **Jangan tampilkan skor kecocokan tunggal.** Tidak ada "87% compatible". Pakai label
   dinamika + rincian per dimensi. Angka tunggal adalah bagian yang paling di-screenshot
   sekaligus paling tidak bisa dipertanggungjawabkan.
2. **Jangan mendiagnosis.** Tidak ada bahasa klinis. Sumbu A/T dan lensa Kelekatan paling
   rawan di sini — disclaimer yang ada sekarang wajib dipertahankan.
3. **Bahasa probabilistik.** "Kamu cenderung…", bukan "kamu pasti…".
4. **Pisahkan tingkat bukti.** Badge per lensa sudah ada. Lensa baru wajib punya badge.
5. **Selalu tampilkan rentang ketidakpastian.** Angka tunggal tanpa CI adalah kebohongan halus.
6. **User boleh tidak setuju.** Fitur "Bukan aku" bagian dari produk, bukan pelengkap.
7. **Jangan dipakai untuk seleksi kerja.** Kalau masuk B2B, larangan ditulis di dalam produk.
8. **Consent untuk data orang lain.** Sudah ada catatan izin di tab Berdua. Jangan dihapus.

---

## 4. Rekomendasi yang berbeda dari dokumen konsep

Dibanding `Your_Story_Platform_Concept.pdf`:

- **Compatibility score dibuang.** Dokumen sendiri melarangnya di Narrative Rules, tapi
  mockup menaruh 87% sebagai elemen terbesar. Sudah diganti label dinamika.
- **Urutan lensa diubah:**
  `Big Five → MBTI → Attachment → Values → Communication → Enneagram → Astrology`.
  Attachment dinaikkan (riset kuat, paling berdampak untuk fitur hubungan);
  Enneagram diturunkan (paling susah diukur andal lewat self-report singkat).
- **Narasi dibangkitkan dari aturan, bukan ditulis per kombinasi.**
  16 × 9 × 4 = 576 kombinasi diri; untuk relasi jadi ratusan ribu. Lihat `relations.js`:
  cerita disusun dari blok bersyarat, bukan teks jadi. 3072 kombinasi sudah diuji bersih.
- **Mode berdua tanpa backend.** Kode profil menggantikan akun + server.
  Backend baru perlu kalau mau riwayat lintas perangkat atau AI story engine.

---

## 5. Roadmap

### Fase 1 — Mode Berdua ✅
- [x] Encoder/decoder kode profil dengan validasi konsistensi
- [x] Layar salin kode + tempel kode teman
- [x] Cerita berdua: nyambung, ngobrol, kebutuhan, pemicu ribut, cara baikan, kekuatan, salah paham, nilai
- [x] Label dinamika (bukan skor)
- [x] Simpan beberapa relasi secara lokal
- [x] Salin cerita berdua sebagai teks

### Fase 2 — Lensa Kelekatan + Nilai ✅
- [x] Kelekatan 16 item, dua sumbu kontinu, empat label
- [x] Nilai 12 item, 6 kelompok, tiga teratas
- [x] Keduanya masuk ke kode profil dan ke cerita berdua
- [x] Badge tingkat bukti per lensa

### Fase 3 — Story Engine ✅
- [x] Tab "Ceritaku" jadi tampilan utama hasil: 9 bab mengalir
- [x] Sistem blok narasi terpusat di `story.js` (`{id, bab, lens, bukti, prio, grup, kondisi, teks}`)
- [x] Penyusun: filter kondisi → urut prioritas → buang yang segrup → rangkai per bab
- [x] "Bagaimana orang mengalami kamu" — 4 sudut, digenerate dari huruf
- [x] Eksperimen perilaku: 3 dipilih dari 15, wajib beda lensa
- [x] Salin ceritaku sebagai teks polos

**Catatan implementasi.** Indeks tab tidak sama dengan urutan tampil. Urutan diatur lewat
DOM, indeks lewat `data-t`. Yang sudah terpakai: 0–14 (tab awal), 15 Ceritaku,
16 Komunikasi, 17 Enneagram, 18 Kartu, 19 Hiburan. Tab baru mulai dari 20.

Menambah blok narasi: tambahkan objek ke `BLOK` di `story.js`. Wajib punya `kondisi` yang
bisa gagal (jangan `() => true` kecuali memang fallback), dan `grup` kalau blok itu saling
menggantikan dengan blok lain. Uji ulang dengan skrip variasi sebelum commit.

### Fase 4 — Share Card ✅
- [x] Kartu 1080×1350 render ke canvas, tiga tema
- [x] User memilih kalimat mana yang boleh nempel (9 pilihan, termasuk "tanpa kutipan")
- [x] Kode profil opsional, bisa dimatikan
- [x] Unduh PNG dengan fallback tekan-lama di HP

### Fase 5 — Lensa tambahan ✅
- [x] Gaya komunikasi: 12 item, dua sumbu, 4 gaya, terhubung ke mesin hubungan
- [x] Enneagram: 18 item penyaringan, 2 kandidat, ada tombol tukar
- [x] Astrologi: bagian hiburan terpisah, tidak masuk kode profil dan tidak dipakai di analisis

**Catatan Enneagram.** Sengaja ditampilkan sebagai dua kandidat, bukan satu jawaban.
Delapan belas item terlalu sedikit untuk memastikan tipe, dan menampilkan satu angka
tunggal akan melanggar prinsip nomor 5. Jangan diubah jadi jawaban tunggal.

**Catatan astrologi.** Tidak masuk kode profil, tidak masuk story engine, tidak masuk
cerita berdua. Tanggal lahir tidak disimpan di mana pun. Kalau nanti ada permintaan
"pakai zodiak buat kecocokan", itu melanggar pemisahan tingkat bukti — tolak.

### Fase 6 — Backend (baru kalau memang perlu)

- [ ] Akun, riwayat lintas perangkat
- [ ] AI story engine: structured profile → prompt terkendali → narasi + quality check
- [ ] Ekspor dan hapus data

**Aturan main:** jangan lompat ke Fase 6 karena AI terdengar seru. Story engine berbasis
aturan (Fase 3) harus jadi dulu — ia yang menentukan blok apa yang boleh dikatakan AI nanti.

---

## 6. Model data

```
User
 └─ Assessment Responses   (item id, skor 1–5, timestamp, konteks)
     └─ Lens Scores        (skor kontinu + n + CI per sumbu)
         └─ Profile        (huruf, arketipe, kejelasan, flag kualitas)
             └─ Story Blocks
             └─ Relationship   (profil A × profil B → insight)
                 └─ Share Artifact
```

Simpan **skor mentah**, bukan cuma hurufnya. Huruf bisa dihitung ulang; skor tidak bisa dipulihkan.

Kunci penyimpanan lokal: `riwayat`, `tim`, `relasi`.

Kode profil (v LS1) — segmen setelah yang wajib bersifat opsional dan boleh dilewati:
`A` kelekatan · `V` nilai · `C` komunikasi · `N` Enneagram.
Decoder mengabaikan segmen yang tidak dikenal, jadi kode lama tetap terbaca kalau
nanti ada segmen baru. Astrologi sengaja tidak pernah masuk kode.

---

## 7. Konvensi

**Kode**
- Tanpa dependensi eksternal. Script klasik, bukan modul.
- Data di `data-*.js`, aturan di `relations.js`, tampilan di `app.js`. Jangan campur.
- Hormati `prefers-reduced-motion`.
- Setiap canvas wajib punya alternatif teks untuk pembaca layar.
- Target layar HP dulu. Area sentuh minimal 44px.
- Uji cepat mesin hubungan: gabung file data + relations + profile-code, lalu jalankan semua
  kombinasi 32 × 32 dan pastikan tidak ada `undefined` di teks keluaran.

**Konten**
- "kamu", bukan "Anda". Kalimat pendek.
- Hindari: preferensi, kutub, menuntaskan, kondisi terjepit, dikotomi.
- Tiap insight penting sebaiknya berujung pada "jadi aku bisa apa?".
- Kalimat khas tipe harus spesifik sampai orang lain tidak bisa mengakuinya. Kalau sebuah
  kalimat cocok untuk semua orang, ia hanya boleh muncul di tab Cek Jujur.

---

## 8. Yang masih terbuka

- Nama final produk: Lima Sumbu / YOUR STORY / lainnya?
- Bahasa: Indonesia dulu, atau dwibahasa sejak awal?
- Angka frekuensi tipe (11.6% dst) masih dari survei populasi AS — dicari yang lebih relevan atau dihapus?
- Monetisasi: freemium seperti di dokumen. Belum diputuskan apa yang gratis dan apa yang berbayar.
- B2B: dikerjakan atau ditunda? Kalau dikerjakan, batas penggunaannya dirancang lebih dulu.
- Kode profil belum punya checksum. Untuk sekarang cukup, karena validasi konsistensi huruf
  vs angka sudah menangkap sebagian besar kesalahan salin.
