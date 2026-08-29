/* ============================================================
   STORY ENGINE

   Prinsipnya: jangan pernah nulis teks jadi untuk tiap kombinasi.
   Yang disimpan adalah BLOK kecil bersyarat. Penyusun cerita milih
   blok yang kondisinya kepenuhan, urutin berdasarkan prioritas,
   buang yang tabrakan, lalu rangkai jadi bab.

   Struktur blok:
   { id, bab, lens, bukti, prio, grup, kondisi(p), teks(p) }

   - bab    : bagian cerita tempat blok ini muncul
   - lens   : dari lensa mana isinya datang
   - bukti  : "kuat" | "reflektif" | "fun"  (dipakai buat label)
   - prio   : makin besar makin didahulukan
   - grup   : blok segrup saling menggantikan; cuma yang tertinggi kepakai
   ============================================================ */

const BAB = [
  ["buka",    ""],
  ["siapa",   "Siapa kamu waktu lagi jadi dirimu sendiri"],
  ["dalam",   "Yang jarang kelihatan dari luar"],
  ["orang",   "Bagaimana orang mengalami kamu"],
  ["kuat",    "Yang bikin kamu diandalkan"],
  ["bayangan","Sisi yang sama, waktu kebanyakan"],
  ["capek",   "Kamu waktu tenaganya habis"],
  ["dekat",   "Kamu di hubungan dekat"],
  ["tumbuh",  "Kalau mau nyoba sesuatu"]
];

/* ---------- persepsi: disusun dari huruf, bukan ditulis 16 kali ---------- */
const KESAN_AWAL = {
  EF: "hangat dan gampang diajak ngobrol",
  ET: "yakin dan langsung ke inti — kadang bikin orang siaga duluan",
  IF: "kalem dan sopan, tapi ada jarak yang belum kebuka",
  IT: "susah dibaca; orang sering ngira kamu lagi menilai mereka"
};
const KESAN_RITME = { J: "Kamu kelihatan siap dan terkontrol.", P: "Kamu kelihatan santai dan nggak ribet." };
const KESAN_LAMA = {
  IT: "ternyata jauh lebih setia dan lebih lucu daripada kesan awalnya",
  IF: "ternyata punya pendirian keras yang nggak kelihatan di awal",
  ET: "ternyata lebih peduli daripada yang kelihatan; caranya aja lewat tindakan, bukan kata",
  EF: "ternyata nggak seringan yang kelihatan; banyak yang kamu tanggung sendiri"
};
const KESAN_CINTA = {
  T: "Kamu nunjukin sayang lewat ngeberesin: masalahnya diurus, kebutuhannya disiapin. Yang sering kelewat, kadang orangnya cuma pengin ditemenin.",
  F: "Kamu nunjukin sayang lewat perhatian ke detail kecil dan kesediaan ngalah. Yang sering kelewat, kamu lupa nyebutin apa yang kamu butuhin sendiri."
};

function persepsi(p) {
  const ei = p.base[0], tf = p.base[2], jp = p.base[3];
  const k = ei + tf;
  const stres = p.gaya === "hindar" ? "kamu makin pendek jawabnya dan makin susah dicari"
    : p.gaya === "cemas" ? "kamu makin sering nyari kepastian, dan diamnya orang kebaca sebagai masalah"
    : p.ident === "T" ? "kamu jadi lebih rewel ke diri sendiri, dan itu nular ke sekitar"
    : "kamu jadi lebih diam dan lebih cuek daripada biasanya";
  return [
    ["Waktu pertama ketemu", "Kamu kebaca " + KESAN_AWAL[k] + ". " + KESAN_RITME[jp]],
    ["Setelah kenal lama", "Orang biasanya nyadar kamu " + KESAN_LAMA[k] + "."],
    ["Waktu kamu tertekan", "Yang paling kelihatan: " + stres + "."],
    ["Waktu kamu sayang sama seseorang", KESAN_CINTA[tf]]
  ];
}

/* ---------- eksperimen perilaku ---------- */
const EKSPERIMEN = [
  { id: "tutup", prio: 90, lens: "identitas", kondisi: p => p.ident === "T",
    judul: "Tutup lebih cepat dari yang kamu mau",
    cara: "Sebelum mulai, tentuin batas waktunya. Pas habis, kirim apa adanya.",
    kenapa: "Buat kamu, 'belum sempurna' hampir selalu berarti 'belum berani dilepas'." },
  { id: "masukan", prio: 88, lens: "identitas", kondisi: p => p.ident === "A",
    judul: "Minta satu masukan yang jujur",
    cara: "Tanya satu orang: 'ada yang kamu tahan nggak bilang ke aku?' Terus diam, jangan langsung ngebantah.",
    kenapa: "Orang jarang ngasih masukan ke yang kelihatan baik-baik aja." },
  { id: "cemas", prio: 86, lens: "kelekatan", kondisi: p => p.gaya === "cemas",
    judul: "Tunda 20 menit, terus tanya sekali",
    cara: "Waktu pengin dipastiin, tunggu 20 menit. Habis itu tanya langsung dan jelas — cukup sekali.",
    kenapa: "Yang nenangin itu jawabannya, bukan jumlah pertanyaannya." },
  { id: "hindar", prio: 86, lens: "kelekatan", kondisi: p => p.gaya === "hindar",
    judul: "Bilang mau mundur, jangan langsung mundur",
    cara: "Pas pengin menjauh, bilang dulu: 'aku butuh waktu, nanti jam sekian aku balik.' Terus beneran balik.",
    kenapa: "Yang bikin luka bukan jedanya, tapi hilangnya tanpa kabar." },
  { id: "campur", prio: 84, lens: "kelekatan", kondisi: p => p.gaya === "campur",
    judul: "Satu ritme kecil yang nggak boleh bolong",
    cara: "Pilih satu kebiasaan bareng yang tetap dijalanin walau lagi berantem — sekecil apa pun.",
    kenapa: "Pola maju-mundur berkurang bukan lewat penjelasan, tapi lewat hal yang bisa diprediksi." },
  { id: "dengar", prio: 80, lens: "sumbu", kondisi: p => p.base[2] === "T",
    judul: "Tanya dulu sebelum ngasih solusi",
    cara: "Tiap ada yang cerita masalah minggu ini, mulai dengan: 'kamu mau didengerin atau mau dibantu?'",
    kenapa: "Solusi yang datang kecepetan kebaca sebagai nggak peduli, walau isinya benar." },
  { id: "nolak", prio: 80, lens: "sumbu", kondisi: p => p.base[2] === "F",
    judul: "Nolak sekali tanpa alasan panjang",
    cara: "Sekali minggu ini, jawab 'maaf, nggak bisa' — titik. Tanpa penjelasan tambahan.",
    kenapa: "Alasan panjang itu cara halus minta izin. Kamu nggak butuh izin." },
  { id: "kosong", prio: 76, lens: "sumbu", kondisi: p => p.base[3] === "J",
    judul: "Sisain satu blok kosong",
    cara: "Blokir dua jam di jadwal minggu ini dan jangan diisi apa pun, walau kelihatan sayang.",
    kenapa: "Kamu perlu bukti kalau ruang yang nggak terpakai bukan berarti terbuang." },
  { id: "25menit", prio: 76, lens: "sumbu", kondisi: p => p.base[3] === "P",
    judul: "Dua puluh lima menit, satu hal",
    cara: "Pilih satu hal yang belum kelar. Kerjain 25 menit tiap hari, nggak boleh ganti.",
    kenapa: "Masalahmu bukan kurang ide, tapi kurang pengulangan." },
  { id: "kabar", prio: 70, lens: "sumbu", kondisi: p => p.base[0] === "I",
    judul: "Kirim satu kabar yang ketunda",
    cara: "Balas satu chat yang udah lama kamu tunda. Nggak perlu panjang — dua kalimat cukup.",
    kenapa: "Diammu jarang dibaca sebagai 'lagi capek'. Lebih sering dibaca sebagai 'nggak penting'." },
  { id: "sepi", prio: 70, lens: "sumbu", kondisi: p => p.base[0] === "E",
    judul: "Tiga puluh menit tanpa siapa-siapa",
    cara: "Tiap hari minggu ini, ambil 30 menit sendirian tanpa HP.",
    kenapa: "Kamu ngolah sambil ngomong. Sesekali perlu tahu apa yang muncul kalau nggak ada yang dengerin." },
  { id: "langkah", prio: 66, lens: "sumbu", kondisi: p => p.base[1] === "N",
    judul: "Satu ide, tiga langkah, ada tanggalnya",
    cara: "Ambil ide yang paling sering kamu omongin. Pecah jadi tiga langkah konkret dengan tanggal.",
    kenapa: "Ide yang nggak punya tanggal cuma jadi bahan obrolan." },
  { id: "coba", prio: 66, lens: "sumbu", kondisi: p => p.base[1] === "S",
    judul: "Coba satu hal yang belum ada contohnya",
    cara: "Sekali minggu ini, jalanin cara baru yang belum kebukti — dalam skala kecil.",
    kenapa: "Pengalamanmu kuat, tapi pengalaman juga bikin pilihanmu menyempit tanpa terasa." },
  { id: "tipis", prio: 64, lens: "sumbu", kondisi: p => p.tipis.length >= 2,
    judul: "Catat kapan kamu jadi sisi yang satunya",
    cara: "Selama seminggu, catat situasi waktu kamu jadi versi sebaliknya. Cukup satu baris tiap kali.",
    kenapa: "Sumbumu yang hampir imbang bukan kebingungan — itu tergantung situasi, dan situasinya bisa dikenali." },
  { id: "nilai", prio: 62, lens: "nilai", kondisi: p => p.vals && p.vals.length,
    judul: "Uji nilai teratasmu",
    cara: "Lihat kalendermu minggu lalu. Berapa jam yang beneran dipakai buat hal yang kamu bilang paling penting?",
    kenapa: "Nilai yang nggak kelihatan di jadwal biasanya cuma niat, belum jadi nilai." },
  { id: "komun-halus", prio: 78, lens: "komunikasi", kondisi: p => p.komunGaya && p.komunGaya[0] === "l",
    judul: "Sekali aja, bilang tanpa kode",
    cara: "Pilih satu keberatan kecil minggu ini. Sampaikan dalam satu kalimat lurus, tanpa pembukaan dan tanpa sindiran.",
    kenapa: "Kode yang nggak ketangkep sama aja kayak nggak pernah disampaikan." },
  { id: "komun-lugas", prio: 78, lens: "komunikasi", kondisi: p => p.komunGaya && p.komunGaya[0] === "L",
    judul: "Sebut niatnya dulu",
    cara: "Sebelum ngasih koreksi, buka dengan: 'aku mau ini jadi lebih baik, bukan mau nyalahin.'",
    kenapa: "Isi pesanmu jarang salah. Yang sering hilang itu konteksnya." },
  { id: "ennea", prio: 72, lens: "enneagram", kondisi: p => !!p.ennea,
    judul: "Kenali pemicunya",
    cara: "Catat tiga kali minggu ini waktu kamu bereaksi lebih keras dari yang situasinya butuh. Cari kesamaannya.",
    kenapa: ENNEA_DEF["1"] ? "Reaksi berlebih biasanya datang dari ketakutan inti, bukan dari kejadiannya." : "" }
];

/* ---------- blok narasi ---------- */
const BLOK = [
  /* ===== buka ===== */
  { id: "buka-tipis", bab: "buka", lens: "sumbu", bukti: "reflektif", prio: 95, grup: "buka",
    kondisi: p => p.tipis.length >= 3,
    teks: p => "Kamu termasuk orang yang susah dikotakin. Tiga dari lima sumbumu berhenti di tengah, dan itu bukan tanda kamu nggak konsisten — itu tanda kamu berubah ngikutin situasi. Hasil di bawah bakal terasa setengah benar, dan bagian setengahnya itu justru informasi paling berguna buat kamu." },
  { id: "buka-T", bab: "buka", lens: "identitas", bukti: "kuat", prio: 88, grup: "buka",
    kondisi: p => p.ident === "T" && p.jelas("AT") >= 55,
    teks: p => "Ada satu suara di kepalamu yang jarang bilang cukup. Itu yang bikin kerjaanmu rapi dan jarang lolos kesalahan — dan itu juga yang bikin kamu capek di jam-jam yang orang lain pakai buat istirahat." },
  { id: "buka-A", bab: "buka", lens: "identitas", bukti: "kuat", prio: 88, grup: "buka",
    kondisi: p => p.ident === "A" && p.jelas("AT") >= 55,
    teks: p => "Kamu jalan tanpa banyak nengok ke belakang. Kesalahan kamu anggap sudah lewat, penilaian orang nggak banyak ngubah caramu ngelihat diri sendiri. Itu kekuatan yang jarang disadari orang yang punya — dan sesekali bikin kamu kelewatan hal yang sebenarnya perlu didengar." },
  { id: "buka-IN", bab: "buka", lens: "sumbu", bukti: "reflektif", prio: 74, grup: "buka",
    kondisi: p => p.base[0] === "I" && p.base[1] === "N",
    teks: p => "Kepalamu jarang sepi. Sementara di luar kamu kelihatan kalem, di dalam ada tiga percakapan yang lagi jalan barengan — dan cuma sebagian kecil yang akhirnya keluar jadi kata." },
  { id: "buka-EP", bab: "buka", lens: "sumbu", bukti: "reflektif", prio: 72, grup: "buka",
    kondisi: p => p.base[0] === "E" && p.base[3] === "P",
    teks: p => "Kamu hidup di kemungkinan yang lagi kebuka sekarang. Energi kamu gampang nyala, dan tantangannya bukan mulai — tapi tetap ada di situ setelah bagian serunya lewat." },
  { id: "buka-SJ", bab: "buka", lens: "sumbu", bukti: "reflektif", prio: 72, grup: "buka",
    kondisi: p => p.base[1] === "S" && p.base[3] === "J",
    teks: p => "Kamu orang yang bikin hal-hal beneran jalan. Yang lain ngomongin rencananya; kamu yang inget siapa ngerjain apa dan kapan tenggatnya." },
  { id: "buka-IF", bab: "buka", lens: "sumbu", bukti: "reflektif", prio: 70, grup: "buka",
    kondisi: p => p.base[0] === "I" && p.base[2] === "F",
    teks: p => "Kamu ngerasain banyak, dan cuma sebagian kecil yang kamu tunjukin. Orang lihat kamu tenang; yang mereka nggak lihat, kamu lagi nimbang-nimbang gimana caranya bilang sesuatu tanpa nyakitin siapa pun." },
  { id: "buka-ET", bab: "buka", lens: "sumbu", bukti: "reflektif", prio: 70, grup: "buka",
    kondisi: p => p.base[0] === "E" && p.base[2] === "T",
    teks: p => "Kamu ngomong apa adanya dan gerak duluan. Buat sebagian orang itu melegakan — akhirnya ada yang mutusin. Buat sebagian lagi, itu kerasa kayak dikejar." },
  { id: "buka-SP", bab: "buka", lens: "sumbu", bukti: "reflektif", prio: 68, grup: "buka",
    kondisi: p => p.base[1] === "S" && p.base[3] === "P",
    teks: p => "Kamu paling hidup waktu ada yang harus dibereskan sekarang. Rencana lima tahun kerasa jauh; yang di depan mata jauh lebih nyata buat kamu." },
  { id: "buka-umum", bab: "buka", lens: "tipe", bukti: "reflektif", prio: 10, grup: "buka",
    kondisi: () => true, teks: p => p.ty.sum },

  /* ===== siapa ===== */
  { id: "siapa-tipe", bab: "siapa", lens: "tipe", bukti: "reflektif", prio: 90,
    kondisi: () => true,
    teks: p => "Hasilmu keluar di " + p.code + " — " + p.ty.nick + ", sisi " + p.idn.nama + ". " + p.ty.sum },
  { id: "siapa-temp", bab: "siapa", lens: "tipe", bukti: "reflektif", prio: 80,
    kondisi: () => true, teks: p => p.temp[1] },
  { id: "siapa-dom", bab: "siapa", lens: "tipe", bukti: "reflektif", prio: 70,
    kondisi: () => true,
    teks: p => "Mode andalanmu " + F[p.ty.fn[0]][0].toLowerCase() + ": " + F[p.ty.fn[0]][1] + ". Itu yang otomatis nyala duluan sebelum kamu sempat mikir." },
  { id: "siapa-jelas", bab: "siapa", lens: "sumbu", bukti: "kuat", prio: 60,
    kondisi: p => p.paling.jelas >= 40,
    teks: p => "Sumbu yang paling tegas di kamu: " + p.paling.d.n.toLowerCase() + ", di angka " + Math.max(p.paling.pl, 100 - p.paling.pl) + "%. Ini bagian dirimu yang paling kecil kemungkinannya berubah kalau kamu tes ulang." },
  { id: "siapa-goyah", bab: "siapa", lens: "sumbu", bukti: "kuat", prio: 58,
    kondisi: p => p.tipis.length >= 1 && p.tipis.length < 3,
    teks: p => "Tapi " + p.tipis.map(r => r.d.n.toLowerCase()).join(" dan ") + " kamu berhenti hampir di tengah. Huruf di situ gampang berubah, jadi jangan diambil sebagai identitas." },

  /* ===== dalam ===== */
  { id: "dalam-motiv", bab: "dalam", lens: "tipe", bukti: "reflektif", prio: 90,
    kondisi: () => true, teks: p => "Yang bikin kamu nyala: " + p.ty.motiv.charAt(0).toLowerCase() + p.ty.motiv.slice(1) },
  { id: "dalam-drain", bab: "dalam", lens: "tipe", bukti: "reflektif", prio: 85,
    kondisi: () => true, teks: p => "Yang nguras kamu diam-diam: " + p.ty.drain.charAt(0).toLowerCase() + p.ty.drain.slice(1) },
  { id: "dalam-nilai", bab: "dalam", lens: "nilai", bukti: "reflektif", prio: 80,
    kondisi: p => p.vals && p.vals.length >= 3,
    teks: p => "Kalau harus milih, tiga hal ini yang kamu dahulukan: " + p.vals.map(v => VAL_DEF[v][0].toLowerCase()).join(", ") + ". " + VAL_DEF[p.vals[0]][1] },
  { id: "dalam-mitos", bab: "dalam", lens: "tipe", bukti: "reflektif", prio: 70,
    kondisi: () => true, teks: p => p.ty.mitos },
  { id: "dalam-suara", bab: "dalam", lens: "tipe", bukti: "reflektif", prio: 60,
    kondisi: () => true, teks: p => "Kalimat yang mungkin sering lewat di kepalamu: \u201C" + p.ty.voice[0] + "\u201D" },

  /* ===== kuat ===== */
  { id: "kuat-inti", bab: "kuat", lens: "tipe", bukti: "reflektif", prio: 90,
    kondisi: () => true,
    teks: p => "Yang paling konsisten dari kamu: " + p.ty.kuat[0].toLowerCase() + ", dan " + p.ty.kuat[1].toLowerCase() + "." },
  { id: "kuat-id", bab: "kuat", lens: "identitas", bukti: "kuat", prio: 80,
    kondisi: () => true, teks: p => "Dari sisi " + p.idn.nama.toLowerCase() + ": " + p.idn.kuat[0].toLowerCase() + "." },
  { id: "kuat-aman", bab: "kuat", lens: "kelekatan", bukti: "kuat", prio: 75,
    kondisi: p => p.gaya === "aman",
    teks: p => "Dan satu hal yang jarang disadari: kamu bisa ngomongin masalah sebelum meledak. Buat orang di sekitarmu, itu bukan hal kecil." },
  { id: "kuat-kerja", bab: "kuat", lens: "tipe", bukti: "reflektif", prio: 60,
    kondisi: () => true, teks: p => "Di tim, kamu biasanya jadi orang yang " + p.ty.plus[0].toLowerCase() + "." },

  /* ===== bayangan ===== */
  { id: "bayang-buka", bab: "bayangan", lens: "tipe", bukti: "reflektif", prio: 90,
    kondisi: () => true,
    teks: p => "Bayangan bukan kebalikan dari kekuatanmu — biasanya kekuatan yang sama, cuma kebanyakan. Buat kamu bentuknya: " + p.ty.lemah[0].toLowerCase() + ", dan " + p.ty.lemah[1].toLowerCase() + "." },
  { id: "bayang-id", bab: "bayangan", lens: "identitas", bukti: "kuat", prio: 80,
    kondisi: () => true, teks: p => p.idn.hati[0] + ", dan " + p.idn.hati[1].toLowerCase() + "." },
  { id: "bayang-konflik", bab: "bayangan", lens: "tipe", bukti: "reflektif", prio: 70,
    kondisi: () => true, teks: p => "Waktu berselisih: " + p.ty.konflik.charAt(0).toLowerCase() + p.ty.konflik.slice(1) },
  { id: "bayang-lekat", bab: "bayangan", lens: "kelekatan", bukti: "kuat", prio: 65,
    kondisi: p => p.gaya && p.gaya !== "aman",
    teks: p => "Di hubungan, pola yang perlu kamu jagain: " + LEKAT[p.gaya].jaga[0].toLowerCase() + "." },

  /* ===== capek ===== */
  { id: "capek-inti", bab: "capek", lens: "tipe", bukti: "reflektif", prio: 90,
    kondisi: () => true, teks: p => p.ty.stres },
  { id: "capek-fn", bab: "capek", lens: "tipe", bukti: "reflektif", prio: 80,
    kondisi: () => true,
    teks: p => "Yang lagi terjadi: bagian dirimu yang paling lemah — " + F[p.ty.fn[3]][0].toLowerCase() + " — ngambil alih waktu yang utama kehabisan bensin. Ini bukan kamu yang asli, cuma tanda kamu perlu berhenti dulu." },
  { id: "capek-id", bab: "capek", lens: "identitas", bukti: "kuat", prio: 70,
    kondisi: () => true, teks: p => p.idn.stres },

  /* ===== dekat ===== */
  { id: "dekat-inti", bab: "dekat", lens: "tipe", bukti: "reflektif", prio: 90,
    kondisi: () => true, teks: p => p.ty.relasi },
  { id: "dekat-lekat", bab: "dekat", lens: "kelekatan", bukti: "kuat", prio: 85,
    kondisi: p => !!p.gaya,
    teks: p => LEKAT[p.gaya].sum + " Yang kamu butuhin: " + LEKAT[p.gaya].butuh.charAt(0).toLowerCase() + LEKAT[p.gaya].butuh.slice(1) },
  { id: "dekat-belum", bab: "dekat", lens: "kelekatan", bukti: "kuat", prio: 40,
    kondisi: p => !p.gaya,
    teks: p => "Bagian ini bakal jauh lebih tajam kalau kamu isi lensa Kelekatan — enam belas soal, dan hasilnya juga dipakai waktu kamu bandingin sama orang lain." },
  { id: "dekat-komun", bab: "dekat", lens: "tipe", bukti: "reflektif", prio: 60,
    kondisi: () => true, teks: p => "Cara kamu nyampein: " + p.ty.komun.charAt(0).toLowerCase() + p.ty.komun.slice(1) },

  /* ===== blok lensa tambahan ===== */
  { id: "orang-komun", bab: "orang", lens: "komunikasi", bukti: "reflektif", prio: 85,
    kondisi: p => !!p.komunGaya,
    teks: p => "Gaya ngobrolmu " + GAYA_KOMUN[p.komunGaya].nama + ". " + GAYA_KOMUN[p.komunGaya].sum },
  { id: "bayang-komun", bab: "bayangan", lens: "komunikasi", bukti: "reflektif", prio: 62,
    kondisi: p => !!p.komunGaya,
    teks: p => "Yang paling gampang bikin kamu bertahan diri: " + GAYA_KOMUN[p.komunGaya].defensif.toLowerCase() + " Dan yang perlu dijaga: " + GAYA_KOMUN[p.komunGaya].jaga[0].toLowerCase() + "." },
  { id: "dalam-ennea", bab: "dalam", lens: "enneagram", bukti: "reflektif", prio: 75,
    kondisi: p => !!p.ennea,
    teks: p => "Kalau dilihat dari motifnya, kamu paling dekat ke " + ENNEA_DEF[p.ennea][0] + ": " + ENNEA_DEF[p.ennea][1].toLowerCase() + ", dan " + ENNEA_DEF[p.ennea][2].toLowerCase() + "." },
  { id: "capek-ennea", bab: "capek", lens: "enneagram", bukti: "reflektif", prio: 60,
    kondisi: p => !!p.ennea,
    teks: p => ENNEA_DEF[p.ennea][3] + ". Sebaliknya, " + ENNEA_DEF[p.ennea][4].toLowerCase() + "." }
];

/* ---------- penyusun ---------- */
function susunCerita(profil) {
  const p = Object.assign({}, profil);
  p.jelas = k => { const r = p.R[DK.indexOf(k)]; return Math.abs(r.pl - 50) * 2; };
  p.tipis = p.R.filter(r => Math.abs(r.pl - 50) * 2 < 15);
  p.paling = p.R.slice().sort((a, b) => Math.abs(b.pl - 50) - Math.abs(a.pl - 50))[0];
  p.paling.jelas = Math.abs(p.paling.pl - 50) * 2;

  const dipakai = [];
  const grupTerpakai = new Set();
  BLOK.slice().sort((a, b) => b.prio - a.prio).forEach(b => {
    if (b.grup && grupTerpakai.has(b.grup)) return;
    let ok = false;
    try { ok = b.kondisi(p); } catch (e) { ok = false; }
    if (!ok) return;
    if (b.grup) grupTerpakai.add(b.grup);
    let t = "";
    try { t = b.teks(p); } catch (e) { return; }
    if (!t || String(t).includes("undefined")) return;
    dipakai.push(Object.assign({}, b, { teks: t }));
  });

  const bab = BAB.map(([id, judul]) => ({
    id, judul,
    isi: dipakai.filter(b => b.bab === id).sort((a, b) => b.prio - a.prio),
    lensa: [...new Set(dipakai.filter(b => b.bab === id).map(b => b.lens))]
  }));

  // bab "orang" diisi generator, bukan blok
  const babOrang = bab.find(b => b.id === "orang");
  babOrang.pasang = persepsi(p);

  // bab "tumbuh" diisi eksperimen, maksimal tiga dan tidak boleh dari lensa yang sama
  const eks = [], lensDipakai = new Set();
  EKSPERIMEN.slice().sort((a, b) => b.prio - a.prio).forEach(e => {
    if (eks.length >= 3) return;
    if (!e.kondisi(p)) return;
    if (lensDipakai.has(e.lens) && eks.length >= 2) return;
    lensDipakai.add(e.lens); eks.push(e);
  });
  bab.find(b => b.id === "tumbuh").eksperimen = eks;

  const kata = dipakai.reduce((n, b) => n + String(b.teks).split(/\s+/).length, 0) + 180;
  return { bab, blok: dipakai, eksperimen: eks, kata, menit: Math.max(1, Math.round(kata / 200)) };
}

/* ---------- cerita jadi teks polos ---------- */
function ceritaKeTeks(cerita, kode) {
  const out = ["CERITAKU — " + kode, ""];
  cerita.bab.forEach(b => {
    if (b.judul) out.push(b.judul.toUpperCase());
    b.isi.forEach(x => out.push(x.teks));
    if (b.pasang) b.pasang.forEach(([j, t]) => out.push(j + ": " + t));
    if (b.eksperimen) b.eksperimen.forEach(e => out.push("• " + e.judul + " — " + e.cara + " (" + e.kenapa + ")"));
    out.push("");
  });
  out.push("Bahan refleksi, bukan diagnosis atau alat seleksi.");
  return out.join("\n");
}
