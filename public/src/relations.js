/* Mesin hubungan.
   Prinsip: TIDAK ADA skor kecocokan tunggal. Yang keluar adalah label dinamika
   plus penjelasan per dimensi. Semua teks disusun dari aturan, bukan ditulis
   satu per satu untuk tiap kombinasi. */

const SAMA = {
EI:{E:"sama-sama mikir sambil ngomong, obrolan ngalir tanpa dipancing",
    I:"sama-sama butuh sepi; diam berdua nggak kerasa canggung"},
SN:{S:"sama-sama pegang hal nyata, jarang salah paham soal fakta",
    N:"sama-sama betah ngobrolin kemungkinan sampai larut"},
TF:{T:"sama-sama bisa debat tanpa dibawa ke hati",
    F:"sama-sama ngutamain orang, suasana jarang dingin"},
JP:{J:"sama-sama suka kepastian; janjian berdua hampir selalu jadi",
    P:"sama-sama santai soal rencana, nggak ada yang nuntut jadwal"},
AT:{A:"sama-sama nggak gampang tersinggung, hemat drama",
    T:"sama-sama peka dan nuntut; standar kalian tinggi"}};

const TARIK = {
EI:"Yang satu bawa keluar, yang satu bawa masuk. Kamu dapat teman ngobrol sekaligus tempat teduh.",
SN:"Yang satu pegang detail, yang satu lihat arah. Berdua, rencana kalian jarang bolong.",
TF:"Yang satu jaga logikanya, yang satu jaga orangnya. Keputusan kalian jadi lebih utuh.",
JP:"Yang satu bikin jadwal, yang satu bikin ruang. Kalian saling nyelametin dari kaku dan dari berantakan.",
AT:"Yang satu nenangin, yang satu ngingetin. Kombinasi ini yang biasanya bikin nggak ada bahaya kelewat."};

const BEDA = {
EI:["Satu terisi sama orang, satu terkuras. Debat klasiknya: acaranya perlu berapa lama.",
    "Sepakati jam pulang sebelum berangkat, dan jangan baca kebutuhan sendirian sebagai penolakan."],
SN:["Satu ngomongin detail nyata, satu ngomongin kemungkinan. Dua-duanya ngerasa yang lain kelewatan intinya.",
    "Mulai dari gambaran besar, terus turun ke satu contoh nyata. Urutan itu nyelametin banyak obrolan."],
TF:["Satu ngasih solusi, satu pengin dimengerti dulu. Ini sumber salah paham paling sering di hubungan mana pun.",
    "Tanya di depan: mau didengerin, atau mau dibantu?"],
JP:["Satu pengin ditutup, satu pengin dibiarin terbuka. Rasanya kayak dikejar versus digantung.",
    "Sepakati tenggatnya bareng, terus bebasin caranya."],
AT:["Satu santai, satu waspada. Yang santai bisa kebaca ngeremehin, yang waspada bisa kebaca lebay.",
    "Sebutin kebutuhan masing-masing, jangan nunggu ditebak."]};

/* Salah paham: bagaimana sifat A kebaca oleh B */
const SALAH = {
EI:{E:"Antusiasmemu bisa kebaca sebagai maksa buat dia.",I:"Diammu bisa kebaca sebagai nggak tertarik."},
SN:{S:"Pertanyaan detailmu bisa kebaca sebagai ngeremehin idenya.",N:"Lompatan idemu bisa kebaca sebagai nggak realistis."},
TF:{T:"Nada lugasmu bisa kebaca sebagai dingin.",F:"Kehati-hatianmu bisa kebaca sebagai nggak tegas."},
JP:{J:"Jadwalmu bisa kebaca sebagai ngontrol.",P:"Kelenturanmu bisa kebaca sebagai nggak serius."},
AT:{A:"Ketenanganmu bisa kebaca sebagai nggak peduli.",T:"Kehati-hatianmu bisa kebaca sebagai bikin semua orang tegang."}};

const LEVEL = {
5:["Kembaran","Saling ngerti nyaris tanpa usaha. Kelemahannya: titik butanya sama persis, jadi nggak ada yang saling ngingetin."],
4:["Sekutu dekat","Gampang nyambung, dengan satu perbedaan yang malah nyegerin."],
3:["Seiring jalan","Lebih banyak miripnya. Bedanya kecil tapi bisa jadi bahan gesekan yang berulang."],
2:["Saling melengkapi","Setengah mirip, setengah berlawanan. Bisa jadi pasangan kuat kalau bedanya diomongin."],
1:["Menantang","Banyak yang perlu diterjemahin. Capek di awal, ngeluasin di akhir."],
0:["Berseberangan","Hampir nggak ada yang otomatis. Tapi kalau berhasil, kalian nutupin hampir semua kekurangan masing-masing."]};

/* label dinamika: bukan skor, tapi nama pola */
function labelDinamika(sama, beda, lekatA, lekatB){
  if (beda.includes("TF") && beda.includes("JP")) return ["Partner Pertumbuhan","Kalian nantang cara mikir masing-masing. Melelahkan, tapi ini pola yang paling sering bikin dua orang berubah jadi lebih baik."];
  if (lekatA === "cemas" && lekatB === "hindar" || lekatA === "hindar" && lekatB === "cemas")
    return ["Kejar-Mundur","Pola paling umum sekaligus paling melelahkan: satu mendekat waktu cemas, satu menjauh waktu tertekan. Bisa dijinakkan, asal dua-duanya tahu polanya."];
  if (sama.length >= 4) return ["Cermin","Kalian jalan di rel yang sama. Nyaman, tapi hati-hati: nggak ada yang jadi rem."];
  if (beda.length >= 4) return ["Dua Kutub","Hampir semuanya beda. Butuh usaha sadar, tapi kalian saling nutupin celah."];
  if (beda.includes("EI") && sama.includes("TF")) return ["Panggung dan Ruang Belakang","Satu ngurus dunia luar, satu ngurus isinya. Pembagian ini biasanya jalan lama."];
  return ["Pelengkap","Cukup mirip buat nyaman, cukup beda buat saling nambahin."];
}

function pasangan(kodeA, kodeB){
  const a = kodeA.replace("-",""), b = kodeB.replace("-","");
  const sama = [], beda = [];
  for (let i = 0; i < 5; i++) (a[i] === b[i] ? sama : beda).push(DK[i]);
  return { sama, beda };
}

/* kelekatan */
function gayaLekat(anx, avo){
  if (anx < 50 && avo < 50) return "aman";
  if (anx >= 50 && avo < 50) return "cemas";
  if (anx < 50 && avo >= 50) return "hindar";
  return "campur";
}
const LEKAT_PAIR = {
  aman_aman:"Dua-duanya bisa ngomong langsung waktu ada yang ganjil. Ini basis paling stabil — jaga jangan sampai kebiasaan itu luntur waktu sibuk.",
  aman_cemas:"Yang satu jadi jangkar. Buat pasangan yang cemas, konsistensi kecil (kabar, waktu yang ditepati) jauh lebih menenangkan daripada janji besar.",
  aman_hindar:"Yang satu tahan nggak ngejar waktu yang lain butuh ruang. Itu justru yang bikin pasangan menghindar akhirnya balik lebih cepat.",
  aman_campur:"Butuh sabar dan ritme yang bisa diprediksi. Kehadiran yang stabil ngajarin lebih banyak daripada pembicaraan panjang.",
  cemas_cemas:"Dua-duanya butuh dipastiin, jadi kalau lagi sama-sama goyah nggak ada yang megang. Sepakati satu ritual kecil yang selalu dijalanin walau lagi berantem.",
  cemas_hindar:"Klasik: satu mendekat, satu mundur, dan gerakan itu saling mempercepat. Jalan keluarnya bukan siapa yang salah, tapi bikin kesepakatan: berapa lama jeda, dan siapa yang balik duluan.",
  cemas_campur:"Intens dan naik-turun. Butuh aturan main yang jelas soal jeda dan kapan diobrolin lagi.",
  hindar_hindar:"Tenang dan hormat ruang masing-masing, tapi hal penting gampang nggak pernah dibahas. Jadwalkan obrolan, jangan tunggu munculnya sendiri.",
  hindar_campur:"Dua-duanya cenderung mundur waktu sulit. Perlu satu orang yang sepakat jadi pembuka pembicaraan, digilir.",
  campur_campur:"Sama-sama pengin dekat dan sama-sama takut. Kalau lagi baik bisa sangat dalam; kalau lagi buruk bisa sangat jauh. Konsistensi lebih penting daripada intensitas."
};
function pasanganLekat(gA, gB){
  const k = [gA, gB].sort().join("_");
  return LEKAT_PAIR[k] || LEKAT_PAIR[gB + "_" + gA] || null;
}

/* nilai */
const NILAI_BENTUR = {
  "B_K":"Satu butuh ruang gerak, satu butuh kepastian. Ini bentrok yang paling sering muncul di keputusan besar: pindah kerja, pindah kota, ambil risiko.",
  "P_D":"Satu diukur dari pencapaian, satu dari waktu bareng. Gesekannya muncul di jam kerja dan akhir pekan.",
  "T_K":"Satu pengin terus berubah, satu pengin mapan. Bukan soal siapa benar, tapi soal kecepatan yang disepakati.",
  "P_M":"Satu ngejar hasil, satu ngejar manfaat. Biasanya kelihatan waktu milih proyek atau pekerjaan."
};
function pasanganNilai(vA, vB){
  if (!vA || !vB) return null;
  const sama = vA.filter(v => vB.includes(v));
  const out = { sama, bentur: [] };
  Object.keys(NILAI_BENTUR).forEach(k => {
    const [x, y] = k.split("_");
    if ((vA.includes(x) && vB.includes(y)) || (vA.includes(y) && vB.includes(x)))
      out.bentur.push(NILAI_BENTUR[k]);
  });
  return out;
}

/* penyusun cerita berdua */
function ceritaBerdua(me, other){
  const p = pasangan(me.code, other.code);
  const lv = LEVEL[p.sama.length];
  const gA = me.att ? gayaLekat(me.att[0], me.att[1]) : null;
  const gB = other.att ? gayaLekat(other.att[0], other.att[1]) : null;
  const dyn = labelDinamika(p.sama, p.beda, gA, gB);
  const nilai = pasanganNilai(me.vals, other.vals);
  const S = [];

  S.push({ judul: "Kenapa bisa nyambung", isi: [
    ...p.sama.map(k => "Kalian " + SAMA[k][me.code.replace("-","")[DK.indexOf(k)]] + "."),
    ...p.beda.slice(0, 2).map(k => TARIK[k])
  ]});

  const meL = me.code[0], otL = other.code[0];
  S.push({ judul: "Cara ngobrol kalian", isi: [
    meL === otL
      ? (meL === "E" ? "Dua-duanya ngomong dulu baru mikir. Cepat nyambung, tapi hal penting gampang kelewat karena nggak ada yang ngerem."
                     : "Dua-duanya mikir dulu baru ngomong. Nyaman, tapi hal penting bisa nggak pernah keluar karena nunggu waktu yang pas.")
      : "Satu butuh diomongin biar jelas, satu butuh dipikir dulu baru jelas. Kasih jeda, terus balik lagi ke topiknya — jangan dipaksa selesai di satu duduk.",
    me.code[2] === other.code[2]
      ? (me.code[2] === "T" ? "Kalian sama-sama bisa dikoreksi langsung tanpa tersinggung." : "Kalian sama-sama merhatiin perasaan waktu ngomong, jadi kabar buruk sering kelamaan disampaikan.")
      : BEDA.TF[1]
  ]});

  S.push({ judul: "Yang dibutuhin masing-masing", isi: (gA && gB) ? [
    "Kamu: " + LEKAT[gA].butuh,
    "Dia: " + LEKAT[gB].butuh,
    pasanganLekat(gA, gB)
  ].filter(Boolean) : [
    me.code[2] === "T" ? "Kamu butuh alasan yang jelas dan nggak suka digantung." : "Kamu butuh dimengerti dulu sebelum dikasih solusi.",
    other.code[2] === "T" ? "Dia butuh alasan yang jelas dan nggak suka digantung." : "Dia butuh dimengerti dulu sebelum dikasih solusi.",
    "Isi bagian Kelekatan di dua sisi kalau mau bagian ini jauh lebih tajam."
  ]});

  S.push({ judul: "Pemicu ribut", isi: p.beda.length
    ? p.beda.map(k => BEDA[k][0])
    : ["Nggak ada beda sumbu — yang perlu diwaspadai justru kesamaannya: kalian buta di hal yang sama, dan nggak ada yang ngingetin."] });

  S.push({ judul: "Cara baikan", isi: [
    ...(gA && gB && (gA === "hindar" || gB === "hindar")
      ? ["Yang cenderung mundur bukan lagi nggak peduli — dia lagi ngatur napas. Sepakati durasinya, misal dua jam, terus balik."] : []),
    ...(gA === "cemas" || gB === "cemas"
      ? ["Yang cemas butuh tahu kapan diobrolin lagi. Kalimat 'nanti jam 8 kita bahas' lebih menenangkan daripada 'nanti aja'."] : []),
    me.code[3] === other.code[3]
      ? (me.code[3] === "J" ? "Kalian sama-sama pengin cepat selesai. Hati-hati nutup masalah sebelum bener-bener kelar." : "Kalian sama-sama gampang nunda. Tentuin batas waktu buat balik ngomongin.")
      : "Satu pengin diselesaikan sekarang, satu butuh waktu. Bukan soal siapa benar — sepakati kapan dibahas ulang."
  ]});

  S.push({ judul: "Kekuatan kalian berdua", isi: p.beda.length
    ? p.beda.map(k => TARIK[k])
    : ["Kalian bergerak cepat karena nggak perlu banyak menerjemahkan. Cocok buat urusan yang butuh keputusan cepat."] });

  S.push({ judul: "Gampang salah paham", isi: p.beda.map(k => {
    const i = DK.indexOf(k), mine = me.code.replace("-","")[i], theirs = other.code.replace("-","")[i];
    return SALAH[k][mine] + " Sebaliknya, " + SALAH[k][theirs].charAt(0).toLowerCase() + SALAH[k][theirs].slice(1);
  })});

  if (nilai && (nilai.sama.length || nilai.bentur.length)) {
    S.push({ judul: "Soal nilai hidup", isi: [
      ...(nilai.sama.length ? ["Kalian sama-sama naruh " + nilai.sama.map(v => VAL_DEF[v][0].toLowerCase()).join(" dan ") + " di urutan atas. Ini fondasi yang jarang goyah."] : ["Tiga nilai teratas kalian nggak ada yang beririsan. Bukan masalah, tapi keputusan besar perlu dibicarakan lebih lama."]),
      ...nilai.bentur
    ]});
  }

  if (me.komun && other.komun) {
    const kA = gayaKomun(me.komun[0], me.komun[1]), kB = gayaKomun(other.komun[0], other.komun[1]);
    const isi = ["Gaya kamu " + GAYA_KOMUN[kA].nama + ", gaya dia " + GAYA_KOMUN[kB].nama + "."];
    if (kA[0] !== kB[0]) { isi.push(KOMUN_PAIR.bedaLugas[0]); isi.push("Jembatannya: " + KOMUN_PAIR.bedaLugas[1]); }
    else isi.push(KOMUN_PAIR.samaLugas[kA[0]]);
    if (kA[1] !== kB[1]) { isi.push(KOMUN_PAIR.bedaIsi[0]); isi.push("Jembatannya: " + KOMUN_PAIR.bedaIsi[1]); }
    else isi.push(KOMUN_PAIR.samaIsi[kA[1]]);
    isi.push("Buat ngomong sama kamu: " + GAYA_KOMUN[kA].caranya);
    isi.push("Buat ngomong sama dia: " + GAYA_KOMUN[kB].caranya);
    S.push({ judul: "Gaya komunikasi", isi });
  }

  const langkah = [];
  if (p.beda.includes("TF")) langkah.push("Sebelum ngasih saran, tanya dulu: mau didengerin atau mau dibantu?");
  if (p.beda.includes("JP")) langkah.push("Sepakati satu tenggat bersama minggu ini, lalu bebasin caranya.");
  if (p.beda.includes("EI")) langkah.push("Sepakati jam pulang sebelum berangkat ke acara.");
  if (p.beda.includes("AT")) langkah.push("Yang santai: tanyain kekhawatirannya sekali sehari. Yang waspada: sebutin kekhawatirannya sekali, jangan diulang.");
  if (gA === "cemas" || gB === "cemas") langkah.push("Bikin satu kabar rutin yang nggak boleh bolong — sekecil apa pun.");
  if (gA === "hindar" || gB === "hindar") langkah.push("Sepakati kalimat aman buat minta jeda, biar nggak dibaca sebagai kabur.");
  if (!langkah.length) langkah.push("Karena kalian mirip, cari satu orang di luar yang berani ngasih pandangan beda.");

  return { label: dyn[0], ket: dyn[1], level: lv, sections: S, langkah: langkah.slice(0, 4) };
}
