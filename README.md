# Lima Sumbu

Tes kepribadian lima sumbu yang jujur soal ketidakpastiannya, plus cerita hubungan berdua.
Jalan penuh di browser — tanpa server, tanpa akun, tanpa data yang keluar dari perangkat.

Bagian dari konsep platform **YOUR STORY — Beyond Personality**.

## Yang membedakannya

- **Lima sumbu**, bukan empat: E/I, S/N, T/F, J/P, plus A/T (Santai–Waspada)
- **Rentang ketidakpastian** di tiap sumbu (`62% ± 9`), bukan angka tunggal yang seolah pasti
- **Tes adaptif** — berhenti bertanya begitu hasilnya sudah cukup yakin
- **Bank 100 soal** berbentuk skenario, diacak tiap sesi
- **Ceritaku** — hasil disusun jadi cerita mengalir sembilan bab, bukan tumpukan tab
- **Bagaimana orang mengalami kamu** — saat pertama ketemu, setelah kenal, saat tertekan, saat sayang
- **Tiga eksperimen perilaku** — bukan nasihat umum, tapi hal yang bisa dicoba seminggu
- **Potret bisa dicoret** — tiap kalimat bisa ditandai "Ini aku / Bukan aku"
- **Mode Berdua tanpa server** — tukar kode profil lewat chat, langsung dapat cerita hubungan
- **Lima lensa tambahan** — Kelekatan, Nilai Hidup, Gaya Komunikasi, Big Five, Enneagram
- **Kartu berbagi** — unduh PNG, dan kamu yang milih kalimat mana yang boleh nempel
- **Bagian hiburan dipisah** — astrologi ada, tapi tidak pernah dipakai di analisis mana pun
- **Tanpa angka kecocokan.** Yang keluar adalah pola dan langkah, bukan vonis "87% cocok"
- **Cek Jujur** — menguji efek Barnum dengan kalimat umum yang disamarkan

## Menjalankan

Tidak ada build step dan tidak ada dependensi.

```bash
git clone https://github.com/<username>/lima-sumbu.git
cd lima-sumbu
python3 -m http.server 8000     # atau: npx serve
```

Buka `http://localhost:8000`.

Membuka `index.html` langsung lewat file:// juga jalan, tapi disarankan pakai server lokal.

## Publikasi lewat GitHub Pages

1. Buat repo baru di GitHub (kosong, tanpa README).
2. Unggah isi folder ini, atau:
   ```bash
   git init && git add . && git commit -m "Lima Sumbu"
   git branch -M main
   git remote add origin https://github.com/<username>/lima-sumbu.git
   git push -u origin main
   ```
3. Settings → Pages → Source: `main`, folder `/ (root)` → Save.
4. Beberapa menit kemudian aplikasinya hidup di `https://<username>.github.io/lima-sumbu/`.

## Struktur

```
index.html            markup dan urutan layar
assets/style.css      seluruh gaya visual
src/data-items.js     bank soal: 5 sumbu, Big Five, Kelekatan, Nilai
src/data-types.js     isi naratif 16 tipe, sisi A/T, gaya kelekatan
src/relations.js      mesin hubungan dan penyusun cerita berdua
src/story.js          story engine: blok narasi, persepsi, eksperimen
src/data-lens.js      lensa komunikasi, Enneagram, astrologi
src/share-card.js     render kartu berbagi ke canvas
src/profile-code.js   encoder/decoder kode profil
src/app.js            alur tes, radar, tab hasil, penyimpanan
CLAUDE.md             konteks proyek, prinsip, roadmap
```

## Kode profil

Format yang dipakai untuk Mode Berdua:

```
LS1.ENTJ-A.72-39-65-80-62.09-07-12-06-08.A30-25.VPTM.C80-75.N3
 │   │      │              │              │      │    │      └ Enneagram (opsional)
 │   │      │              │              │      │    └ komunikasi: lugas-fokus (opsional)
 │   │      │              │              │      └ tiga nilai teratas (opsional)
 │   │      │              │              └ kelekatan: cemas-hindar (opsional)
 │   │      │              └ lebar rentang tiap sumbu
 │   │      └ persen ke arah kutub kiri tiap sumbu
 │   └ kode tipe
 └ versi format

Segmen opsional boleh tidak ada, dan segmen yang tidak dikenal diabaikan — jadi kode
lama tetap terbaca. Tanggal lahir tidak pernah masuk ke sini.
```

Decoder menolak kode yang hurufnya tidak konsisten dengan angkanya, jadi kode yang
terpotong atau diedit tidak akan lolos diam-diam.

## Batasan

Ini bukan instrumen resmi mana pun dan **bukan alat diagnosis**. Jangan dipakai untuk
rekrutmen, penempatan, atau promosi — tipe kepribadian tidak terbukti bisa memprediksi
kinerja kerja. Baca `CLAUDE.md` bagian "Prinsip yang tidak boleh dilanggar" sebelum
menambahkan fitur.

## Lisensi

MIT.
