/* Bank soal. Semua item pakai skala 1-5.
   Format sumbu utama: [kutub, teks] */

const D = {
  EI: { n: "Energi",          l: "E", r: "I", ln: "Ekstrovert", rn: "Introvert",  c: "#FFA36B" },
  SN: { n: "Cara menyerap",   l: "S", r: "N", ln: "Konkret",    rn: "Konseptual", c: "#79D8B4" },
  TF: { n: "Cara memutuskan", l: "T", r: "F", ln: "Logika",     rn: "Perasaan",   c: "#C4A2FF" },
  JP: { n: "Ritme",           l: "J", r: "P", ln: "Terjadwal",  rn: "Spontan",    c: "#FFD07A" },
  AT: { n: "Ketenangan",      l: "A", r: "T", ln: "Santai",     rn: "Waspada",    c: "#8FB8FF" }
};
const DK = ["EI", "SN", "TF", "JP", "AT"];
const AXC = DK.map(k => D[k].c);

const BANK = {
EI: [
["E","Kalau ada ajakan kumpul mendadak, biasanya kamu ikut."],
["I","Habis acara rame, kamu butuh waktu sendiri dulu."],
["E","Kamu mikirnya lebih lancar sambil ngobrol sama orang."],
["I","Di rapat, kamu nunggu jelas dulu baru ikut bicara."],
["E","Ngobrol sama orang yang baru kenal buat kamu gampang."],
["I","Hari kerja paling enak buat kamu itu hari tanpa rapat."],
["E","Kerja di tempat rame malah bikin kamu lebih semangat."],
["I","Grup chat yang rame terus bikin kamu pengin matiin HP."],
["E","Kalau nggak ada yang mau mimpin, biasanya kamu yang maju."],
["I","Kamu suka nyiapin alasan biar bisa pulang duluan dari acara."],
["E","Akhir pekan yang seru buat kamu ya ketemu banyak orang."],
["I","Chat panjang sering kamu balas beberapa hari kemudian."],
["E","Kamu gampang cerita soal diri sendiri ke orang baru."],
["I","Kamu lebih milih makan siang sendirian daripada rame-rame."],
["E","Suasana sepi kelamaan bikin kamu gelisah."],
["I","Kamu lebih suka dichat daripada ditelepon."],
["E","Kamu sering jadi orang yang mencairkan suasana."],
["I","Habis seharian ketemu banyak orang, kamu kerasa kosong."],
["E","Kamu seneng kalau ada tamu datang mendadak."],
["I","Kamu butuh waktu sendiri tiap hari, walau cuma sebentar."]],
SN: [
["S","Denger ide baru, pertanyaan pertamamu: udah pernah berhasil di mana?"],
["N","Orang baru mulai cerita masalah, kepalamu udah lari ke macam-macam kemungkinan."],
["S","Kamu lebih tenang kalau ada contoh nyata yang bisa dilihat."],
["N","Kamu sering nyambungin dua hal yang kelihatannya nggak nyambung."],
["S","Kamu inget detail: tanggalnya, angkanya, siapa yang bilang."],
["N","Penjelasan langkah demi langkah cepat bikin kamu bosan."],
["S","Petunjuk yang jelas lebih kamu suka daripada disuruh nafsirin sendiri."],
["N","Kamu sering mikirin hidupmu lima tahun lagi bakal kayak apa."],
["S","Kamu percaya yang kelihatan dulu, baru kesimpulan besarnya."],
["N","Kamu seneng ngobrolin ide walau belum tentu kepakai."],
["S","Kamu sadar ada yang berubah di ruangan sebelum orang lain sadar."],
["N","Kalau njelasin sesuatu, kamu otomatis pakai perumpamaan."],
["S","Kamu lebih suka ngerjain yang jelas hasilnya daripada yang masih konsep."],
["N","Kamu gampang bosan kalau kerjaannya itu-itu terus."],
["S","Kamu lebih percaya pengalaman daripada teori."],
["N","Kamu sering kepikiran 'gimana kalau...' padahal belum kejadian."],
["S","Kalau mau beli sesuatu, kamu cek spesifikasinya satu-satu."],
["N","Kamu lebih tertarik ke kenapanya daripada apanya."],
["S","Kamu lebih nyaman pakai cara yang sudah biasa dipakai."],
["N","Ide baru bikin kamu semangat walau caranya belum jelas."]],
TF: [
["T","Ada yang nangis pas dikasih masukan, kamu tetap sampaikan poinnya."],
["F","Sebelum ngritik, kamu mikirin dulu perasaan orangnya."],
["T","Aturan sebaiknya sama buat semua, walau ada alasan pribadi."],
["F","Kamu bisa tahu mood orang cuma dari cara dia ngetik."],
["T","Kamu santai aja debat keras, nggak dibawa ke hati."],
["F","Suasana tegang bikin kamu susah fokus kerja."],
["T","Ide dinilai dari isinya, bukan dari siapa yang ngomong."],
["F","Ucapan terima kasih yang tulus lebih ngena daripada bonus."],
["T","Kalau memutuskan, kamu bikin daftar untung-ruginya dulu."],
["F","Kamu susah ambil keputusan yang kamu tahu bakal nyakitin orang."],
["T","Kamu lebih percaya data daripada cerita satu orang."],
["F","Orang sering curhat ke kamu, bahkan yang nggak deket."],
["T","Kamu nggak masalah dibilang terlalu blak-blakan."],
["F","Kamu sering ngalah biar nggak ada yang tersinggung."],
["T","Kamu bisa misahin urusan pribadi dari urusan kerja."],
["F","Kalau ada yang sedih di deketmu, kamu ikut kebawa."],
["T","Kamu lebih suka dikoreksi langsung daripada dibungkus halus."],
["F","Kamu inget betul siapa yang pernah baik sama kamu."],
["T","Kamu tega nolak permintaan kalau memang nggak masuk akal."],
["F","Kamu sering minta maaf duluan walau belum tentu salah."]],
JP: [
["J","Sebelum liburan, jadwalnya udah kamu susun."],
["P","Kamu baru gerak serius kalau tenggatnya udah deket."],
["J","Rencana yang berubah mendadak bikin mood kamu rusak."],
["P","Kamu suka nunda keputusan, siapa tahu ada info baru."],
["J","Kamu lega kalau sesuatu akhirnya diputuskan dan selesai."],
["P","Meja kamu berantakan, tapi kamu tahu semuanya di mana."],
["J","Kerjaan kamu biasanya kelar jauh sebelum tenggat."],
["P","Kamu lebih menikmati proses nyoba-nyoba daripada beresinnya."],
["J","Kamu bikin daftar dulu sebelum mulai."],
["P","Rencana yang terlalu rapi bikin kamu ngerasa terkekang."],
["J","Kamu nggak nyaman ninggalin kerjaan setengah jadi semalaman."],
["P","Kamu sering belok di menit terakhir karena ada yang lebih menarik."],
["J","Kamu lebih milih datang kepagian daripada telat."],
["P","Kamu sering mulai banyak hal tapi belum semuanya kelar."],
["J","Kamu pengin tahu acaranya bakal kayak apa sebelum berangkat."],
["P","Kamu nyaman jalanin hari tanpa rencana sama sekali."],
["J","Kalau belanja, kamu bawa daftar."],
["P","Kamu gampang nyesuaiin diri kalau rencana batal."],
["J","Barang di rumahmu punya tempat tetap."],
["P","Kamu kerja paling bagus kalau lagi dikejar waktu."]],
AT: [
["A","Habis presentasi, kamu jarang mikirin bagian yang kurang lancar."],
["T","Kalimat canggung yang kamu ucapkan masih kepikiran berhari-hari."],
["A","Kritik kamu terima sebagai masukan, bukan serangan ke diri kamu."],
["T","Chat 'bisa bicara sebentar?' dari atasan langsung bikin kamu mikir yang nggak-nggak."],
["A","Kamu puas sama hasil kerjamu tanpa harus dipuji."],
["T","Sebagus apa pun hasilnya, kamu masih lihat bagian yang kurang."],
["A","Kalau rencana meleset, kamu cepat pindah ke langkah berikutnya."],
["T","Kesalahan kecil bisa bikin mood kamu rusak seharian."],
["A","Kamu jarang bandingin pencapaianmu sama orang lain."],
["T","Lihat pencapaian teman seumuran bikin kamu nilai ulang diri sendiri."],
["A","Kamu memutuskan tanpa banyak mikirin nanti orang ngomong apa."],
["T","Kamu ngecek ulang kerjaan berkali-kali takut ada yang kelewat."],
["A","Kamu bisa tidur nyenyak walau besok ada hal besar."],
["T","Kamu sering muter ulang kejadian lama di kepala."],
["A","Kamu jarang ngerasa perlu njelasin diri ke orang lain."],
["T","Kamu gampang ngerasa bersalah walau bukan kamu penyebabnya."],
["A","Kegagalan kamu anggap bagian dari proses, bukan tanda kamu kurang."],
["T","Kamu sering ngerasa belum cukup, walau orang bilang udah bagus."],
["A","Kamu nggak terlalu terganggu kalau ada yang nggak suka sama kamu."],
["T","Kamu merhatiin perubahan kecil sikap orang ke kamu."]]
};

/* Big Five ringkas: [dimensi, arah, teks] */
const B5 = [
["O",1,"Aku suka mikirin hal-hal yang abstrak."],
["O",1,"Aku gampang tertarik sama hal yang belum kupahami."],
["O",1,"Aku menikmati karya yang nggak biasa: seni, musik, atau cerita."],
["O",-1,"Aku lebih milih yang udah familiar daripada yang baru."],
["C",1,"Aku nyelesaiin apa yang udah kumulai."],
["C",1,"Barang dan berkasku ada di tempatnya."],
["C",-1,"Aku sering nunda kerjaan sampai menit terakhir."],
["C",-1,"Aku kadang lupa balikin barang ke tempatnya."],
["E",1,"Aku gampang mulai percakapan."],
["E",1,"Aku ngerasa hidup kalau lagi di antara banyak orang."],
["E",-1,"Aku lebih milih di belakang layar."],
["E",-1,"Aku butuh waktu lama buat nyaman di kelompok baru."],
["A",1,"Aku berusaha bikin orang di sekitarku nyaman."],
["A",1,"Aku maafin lebih cepat daripada kebanyakan orang."],
["A",-1,"Aku nuntut orang lain memenuhi standarku."],
["A",-1,"Kalau lagi debat, aku jarang mikirin perasaan lawan bicara."],
["N",1,"Hal kecil gampang bikin aku khawatir."],
["N",1,"Mood-ku berubah cukup cepat."],
["N",1,"Aku lama mikirin kesalahan yang udah lewat."],
["N",-1,"Aku tetap tenang waktu keadaan lagi menekan."]
];
const B5N = {
O: ["Keterbukaan", "Seberapa gampang kamu tertarik sama hal dan cara pandang baru."],
C: ["Kerapian", "Seberapa teratur dan konsisten kamu nyelesaiin sesuatu."],
E: ["Ekstraversi", "Dari mana energi sosialmu datang."],
A: ["Keramahan", "Seberapa besar kamu ngutamain kerukunan sama orang."],
S: ["Ketenangan", "Seberapa stabil mood kamu waktu ditekan — saudara dekat dari huruf kelima."]
};

/* Kelekatan: dua dimensi kontinu, bukan empat kotak.
   x = kecemasan (takut ditinggal), v = penghindaran (takut terlalu dekat) */
const ATTACH = [
["x","Aku sering khawatir orang yang dekat sama aku bakal berubah sikap."],
["x","Kalau chatku lama dibalas, aku mulai mikir yang macam-macam."],
["x","Aku butuh dipastiin kalau hubungan kami lagi baik-baik aja."],
["x","Aku takut jadi terlalu ngerepotin buat orang terdekatku."],
["x","Aku sering muter ulang obrolan buat nyari tanda ada yang salah."],
["x","Kalau ada jarak sedikit, aku langsung pengin mendekat dan beresin."],
["x","Aku gampang ngerasa dikesampingkan."],
["x","Kayaknya aku lebih butuh kedekatan daripada orangnya."],
["v","Aku lebih nyaman nyelesaiin masalahku sendiri daripada cerita."],
["v","Kalau lagi berat, aku cenderung narik diri dulu."],
["v","Aku risih kalau orang kepengin deket terlalu cepat."],
["v","Aku susah minta tolong walau lagi butuh."],
["v","Aku butuh ruang sendiri yang nggak diganggu, bahkan sama orang terdekat."],
["v","Ngomongin perasaan bikin aku nggak nyaman."],
["v","Aku lebih milih hubungan yang nggak nuntut banyak."],
["v","Kalau lagi ada masalah, aku diam dan nunggu redanya sendiri."]
];

/* Nilai hidup: 6 kelompok, 2 item masing-masing */
const VALUES = [
["P","Aku pengin dikenal karena hasil kerjaku."],
["P","Target dan pencapaian bikin aku hidup."],
["K","Hidup yang stabil dan bisa diprediksi bikin aku tenang."],
["K","Aku nyiapin cadangan buat hal yang belum tentu kejadian."],
["B","Aku butuh bebas nentuin caraku sendiri."],
["B","Aturan yang kebanyakan bikin aku sesak."],
["D","Waktu bareng orang terdekat lebih berharga dari apa pun."],
["D","Aku rela ngelewatin peluang demi orang yang kusayang."],
["T","Aku pengin tiap tahun jadi lebih baik dari sebelumnya."],
["T","Belajar hal baru bikin aku bersemangat."],
["M","Aku pengin kerjaanku ngasih manfaat buat orang banyak."],
["M","Aku puas kalau bisa bantu orang berkembang."]
];
const VAL_DEF = {
P: ["Prestasi", "Kamu diukur — oleh dirimu sendiri — dari apa yang berhasil kamu selesaikan."],
K: ["Keamanan", "Kamu tenang kalau besok bisa diperkirakan dan cadangannya ada."],
B: ["Kebebasan", "Kamu butuh ruang buat nentuin caramu sendiri."],
D: ["Kedekatan", "Orang-orang terdekat yang jadi ukuran hidup yang baik buat kamu."],
T: ["Pertumbuhan", "Kamu ngerasa hidup kalau lagi berkembang, bukan lagi mapan."],
M: ["Manfaat", "Kerjaanmu terasa benar kalau ada orang yang kebantu."]
};
