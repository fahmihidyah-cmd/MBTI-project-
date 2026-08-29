/* ============================================================
   LENSA TAMBAHAN
   05 Gaya Komunikasi  — reflektif, dipakai di mesin hubungan
   03 Enneagram        — reflektif, penyaringan singkat saja
   08 Astrologi        — hiburan, sengaja dipisah dan tidak
                         dipakai di analisis mana pun
   ============================================================ */

/* ---------- 05 GAYA KOMUNIKASI ----------
   Dua sumbu: L = lugas vs halus, G = fokus isi vs fokus orang */
const KOMUN = [
["L","Kalau ada yang salah, aku bilang langsung di tempat."],
["L","Aku lebih milih ngomong apa adanya daripada muter-muter."],
["L","Aku nggak masalah nyampein kabar buruk tanpa pembukaan panjang."],
["l","Aku nyiapin kalimatnya dulu biar nggak nyakitin."],
["l","Keberatanku sering kusampein lewat sindiran halus atau pertanyaan."],
["l","Aku nunggu momen yang pas, kadang sampai nggak jadi ngomong."],
["G","Buat aku, obrolan kerja ya soal isinya, bukan soal suasananya."],
["G","Aku pengin obrolan cepat sampai ke kesimpulan."],
["G","Basa-basi sebelum masuk topik kerasa buang waktu."],
["g","Aku nanya kabar dulu sebelum masuk ke urusan."],
["g","Gimana rasanya ngobrol sama pentingnya kayak hasil obrolannya."],
["g","Aku merhatiin nada dan ekspresi lebih dari kata-katanya."]
];

const GAYA_KOMUN = {
LG:{nama:"Penembak Lurus",
 sum:"Kamu ngomong apa adanya dan langsung ke isinya. Cepat, jelas, hemat waktu — dan buat sebagian orang, kerasa dingin padahal kamu cuma efisien.",
 kuat:["Nggak ada yang perlu ditebak dari kamu","Masalah ketahuan lebih awal","Rapat sama kamu jarang molor"],
 jaga:["Orang bisa berhenti nyampein hal kecil karena takut ditembak","Nada datar kebaca sebagai nggak peduli","Kamu ngira semua orang senyaman kamu dikoreksi"],
 caranya:"Langsung aja ke intinya. Kalau ada kritik, sampaikan terus terang — kamu lebih terganggu sama basa-basi daripada sama kritiknya.",
 defensif:"Waktu orang muter-muter dan kamu harus nebak maunya apa."},
Lg:{nama:"Terus Terang Hangat",
 sum:"Kamu jujur tapi jaga nadanya. Orang tahu posisi kamu di mana tanpa harus merasa dijatuhkan.",
 kuat:["Bisa nyampein hal sulit tanpa ninggalin luka","Dipercaya buat jadi penengah","Kritikmu biasanya kepakai, bukan cuma didengar"],
 jaga:["Kadang kamu ngerasa capek jadi orang yang selalu nyampein","Pelunakannya bisa bikin urgensinya hilang","Kamu nanggung beban emosi obrolan orang lain"],
 caranya:"Sampaikan apa adanya, tapi sebut juga niatnya. Kamu nggak masalah sama isi keras, asal jelas bukan serangan pribadi.",
 defensif:"Waktu maksud baikmu dibaca sebagai manipulasi."},
lG:{nama:"Perapi Diam",
 sum:"Kamu nggak banyak ngomong, tapi yang kamu kerjain ngomong sendiri. Pendapat kamu biasanya keluar lewat tulisan atau hasil, bukan di forum.",
 kuat:["Nggak nambah kebisingan di ruangan","Tulisanmu lebih rapi daripada omonganmu","Kamu mikirin dulu sebelum ngeluarin"],
 jaga:["Diammu kebaca sebagai setuju, padahal enggak","Kontribusimu gampang diklaim orang lain","Hal penting bisa nggak pernah terucap"],
 caranya:"Kasih pertanyaan tertulis atau waktu buat mikir. Jangan minta pendapat mendadak di depan orang banyak.",
 defensif:"Waktu dipaksa jawab di tempat sebelum kamu siap."},
lg:{nama:"Penjaga Suasana",
 sum:"Kamu ngutamain hubungannya dulu, isinya belakangan. Keberatan kamu sampaikan lewat kode, dan sering nggak ketangkep.",
 kuat:["Orang nyaman terbuka sama kamu","Kamu nangkep yang nggak terucap","Konflik jarang meledak di dekatmu"],
 jaga:["Pesan pentingmu hilang di balik pelunakannya","Kamu nyimpen kesal sampai numpuk","Orang ngira kamu setuju padahal enggak"],
 caranya:"Tanya langsung, jangan nunggu dia nawarin. Dan kasih tahu kalau ketidaksetujuan nggak bakal ngerusak hubungan kalian.",
 defensif:"Waktu kamu dikritik di depan orang lain."}
};

/* ---------- 03 ENNEAGRAM (penyaringan singkat) ---------- */
const ENNEA = [
["1","Aku gampang lihat apa yang seharusnya diperbaiki di sekitarku."],
["1","Ada suara di kepalaku yang sering bilang seharusnya bisa lebih benar."],
["2","Aku tahu apa yang orang butuhin sebelum mereka minta."],
["2","Aku ngerasa paling berharga waktu ada yang butuh aku."],
["3","Aku nyesuaiin caraku biar keliatan berhasil di mata orang."],
["3","Gagal di depan umum itu yang paling nggak bisa kuterima."],
["4","Aku ngerasa ada yang beda dari aku dibanding orang kebanyakan."],
["4","Aku gampang kebawa perasaan dan nggak mau nutupinnya."],
["5","Aku ngumpulin pengetahuan dulu sebelum berani terlibat."],
["5","Aku ngirit tenaga dan waktu buat diriku sendiri."],
["6","Aku otomatis mikirin apa yang bisa salah."],
["6","Aku butuh tahu siapa yang bisa dipercaya sebelum melangkah."],
["7","Aku selalu punya rencana seru berikutnya."],
["7","Aku ngindarin hal yang bikin terjebak atau kerasa sempit."],
["8","Aku nggak suka dikendalikan, dan aku bakal ngelawan kalau ditekan."],
["8","Aku maju duluan ngelindungi orang yang kuanggap milikku."],
["9","Aku gampang ngikutin arus biar nggak ada yang ribut."],
["9","Aku sering nunda hal yang bikin konflik."]
];
const ENNEA_DEF = {
"1":["Sang Pembenah","Pengin melakukan hal dengan benar","Takut dianggap cacat atau salah",
  "Waktu tertekan: jadi murung dan menarik diri","Waktu tumbuh: lebih santai dan spontan",
  "Di kerja: penjaga standar yang paling teliti, tapi susah nurunin patokan"],
"2":["Sang Penolong","Pengin dibutuhkan dan disayang","Takut nggak diinginkan",
  "Waktu tertekan: jadi menuntut dan gampang tersinggung","Waktu tumbuh: mulai ngurus kebutuhannya sendiri",
  "Di kerja: perekat tim, tapi gampang kecapekan mikul kerjaan orang"],
"3":["Sang Pengejar","Pengin dihargai lewat pencapaian","Takut dianggap nggak berharga tanpa prestasi",
  "Waktu tertekan: menarik diri dan kehilangan tenaga","Waktu tumbuh: mulai jujur soal yang lagi nggak baik",
  "Di kerja: pendorong hasil, tapi gampang ngorbanin diri demi kelihatan berhasil"],
"4":["Sang Pencari Makna","Pengin jadi diri sendiri yang utuh","Takut nggak punya identitas atau makna",
  "Waktu tertekan: jadi nempel dan nyari kepastian","Waktu tumbuh: lebih disiplin dan berkarya nyata",
  "Di kerja: sumber kedalaman dan orisinalitas, tapi mood berpengaruh besar"],
"5":["Sang Pengamat","Pengin ngerti dan mandiri","Takut kehabisan tenaga atau dikuras orang",
  "Waktu tertekan: jadi tersebar dan impulsif","Waktu tumbuh: berani terlibat sebelum merasa siap",
  "Di kerja: analis dalam, tapi sering telat ngasih tahu apa yang lagi dia kerjain"],
"6":["Sang Waspada","Pengin aman dan punya pegangan","Takut nggak ada penopang waktu genting",
  "Waktu tertekan: jadi ngotot dan menuntut","Waktu tumbuh: lebih tenang dan percaya pada dirinya",
  "Di kerja: pendeteksi risiko terbaik, tapi bisa ngerem tim kelamaan"],
"7":["Sang Penjelajah","Pengin puas dan bebas","Takut kejebak di rasa nggak enak",
  "Waktu tertekan: jadi kaku dan gampang nyalahin","Waktu tumbuh: berani tinggal di satu hal sampai selesai",
  "Di kerja: sumber energi dan ide, tapi eksekusi akhirnya sering dilempar"],
"8":["Sang Pelindung","Pengin pegang kendali atas hidupnya","Takut dikendalikan atau dilemahkan",
  "Waktu tertekan: menarik diri dan nutup rapat","Waktu tumbuh: berani nunjukin sisi lembutnya",
  "Di kerja: berani ambil keputusan berat, tapi nekan orang tanpa sadar"],
"9":["Sang Pendamai","Pengin damai dan nggak ada yang terpecah","Takut kehilangan hubungan karena konflik",
  "Waktu tertekan: jadi cemas dan overthinking","Waktu tumbuh: berani nyebut maunya sendiri",
  "Di kerja: penengah alami, tapi keputusannya gampang tertunda"]
};

/* ---------- 08 ASTROLOGI (hiburan) ---------- */
const ZODIAK = [
[1,20,"Aquarius","Udara","Kamu suka jadi yang nggak sama kayak yang lain."],
[2,19,"Pisces","Air","Kamu gampang kebawa suasana orang di sekitarmu."],
[3,21,"Aries","Api","Kamu duluan yang maju, mikirnya belakangan."],
[4,20,"Taurus","Tanah","Kamu susah digeser kalau udah nyaman."],
[5,21,"Gemini","Udara","Kepalamu ada di dua tempat sekaligus."],
[6,21,"Cancer","Air","Kamu ngurus orang lain lebih rapi daripada ngurus diri."],
[7,23,"Leo","Api","Kamu paling hidup kalau ada yang memperhatikan."],
[8,23,"Virgo","Tanah","Kamu lihat satu yang miring di antara sembilan yang lurus."],
[9,23,"Libra","Udara","Kamu bisa lama banget cuma buat milih."],
[10,23,"Scorpio","Air","Kamu jarang lupa, dan itu bukan ancaman — cuma fakta."],
[11,22,"Sagittarius","Api","Kamu nggak betah lama di satu tempat."],
[12,22,"Capricorn","Tanah","Kamu main panjang, dan sabar nunggu gilirannya."],
[12,32,"Capricorn","Tanah","Kamu main panjang, dan sabar nunggu gilirannya."]
];
function zodiakDari(bulan, tgl) {
  let hasil = ZODIAK[ZODIAK.length - 2];
  for (let i = 0; i < ZODIAK.length; i++) {
    const [b, d] = ZODIAK[i];
    if (bulan === b && tgl >= d) hasil = ZODIAK[i];
    else if (bulan === b && tgl < d) hasil = ZODIAK[(i + ZODIAK.length - 1) % ZODIAK.length];
  }
  return { nama: hasil[2], elemen: hasil[3], teks: hasil[4] };
}
const ELEMEN_TEKS = {
  Api: "Elemen api biasanya diceritakan sebagai yang paling cepat panas dan paling cepat bergerak.",
  Tanah: "Elemen tanah biasanya diceritakan sebagai yang paling sabar dan paling betah.",
  Udara: "Elemen udara biasanya diceritakan sebagai yang paling banyak mikir dan paling gampang bosan.",
  Air: "Elemen air biasanya diceritakan sebagai yang paling dalam rasanya dan paling susah dibaca."
};

/* ---------- pasangan gaya komunikasi (dipakai relations.js) ---------- */
function gayaKomun(lugas, isi) {
  return (lugas >= 50 ? "L" : "l") + (isi >= 50 ? "G" : "g");
}
const KOMUN_PAIR = {
  bedaLugas: ["Satu nembak langsung, satu ngasih kode. Yang lugas ngerasa lawan bicaranya muter; yang halus ngerasa dihantam.",
    "Sepakati satu kalimat pembuka buat hal sensitif, misalnya 'aku mau ngomongin sesuatu, bukan buat nyalahin'. Itu ngurangin salah baca lebih banyak daripada yang kamu kira."],
  bedaIsi: ["Satu pengin langsung ke isi, satu perlu pemanasan dulu. Yang satu ngerasa dingin, yang satu ngerasa buang waktu.",
    "Lima menit basa-basi di depan biasanya lebih murah daripada satu jam benerin salah paham di belakang."],
  samaLugas: { L: "Dua-duanya blak-blakan. Efisien, tapi hati-hati: kalau lagi capek, jujur gampang berubah jadi tajam.",
    l: "Dua-duanya halus. Adem, tapi hal penting bisa nggak pernah keluar karena sama-sama nunggu momen yang pas." },
  samaIsi: { G: "Dua-duanya fokus ke isi. Cepat kelar, tapi sisi perasaannya gampang nggak keurus.",
    g: "Dua-duanya jaga suasana. Hangat, tapi keputusan bisa lama karena nggak ada yang mau ngerusak mood." }
};
