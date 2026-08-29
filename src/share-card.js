/* ============================================================
   KARTU BERBAGI

   Prinsip "share without oversharing": user milih sendiri kalimat
   mana yang boleh nempel di kartu, dan bisa matiin kode profil.
   Nggak ada yang otomatis ikut selain tipe dan julukan.
   ============================================================ */

const TEMA = {
  senja: { nama: "Senja", bg1: "#1B1220", bg2: "#2A1826", aksen: "#FFB27A", aksen2: "#E88FB0", teks: "#F6EEE7", redup: "#C6B3A8" },
  laut:  { nama: "Laut",  bg1: "#0E1720", bg2: "#122A2C", aksen: "#79D8B4", aksen2: "#8FB8FF", teks: "#EAF3F0", redup: "#9FB4B2" },
  malam: { nama: "Malam", bg1: "#14121C", bg2: "#1E1A2E", aksen: "#C4A2FF", aksen2: "#8FB8FF", teks: "#F0ECF7", redup: "#ABA2BC" }
};

const SIFAT = { E: "Terbuka", I: "Reflektif", S: "Membumi", N: "Penjelajah",
  T: "Lugas", F: "Peka", J: "Terstruktur", P: "Lentur" };
const SIFAT_ID = { A: "Tenang", T: "Teliti" };

function sifatDari(R, base, ident) {
  const urut = R.slice(0, 4).map((r, i) => ({ h: base[i], j: Math.abs(r.pl - 50) }))
    .sort((a, b) => b.j - a.j);
  const out = urut.slice(0, 2).map(x => SIFAT[x.h]);
  out.push(SIFAT_ID[ident]);
  return out;
}

function kalimatKartu(p) {
  const out = [];
  p.ty.voice.forEach((v, i) => out.push({ id: "v" + i, label: "Suara di kepalaku", teks: v }));
  out.push({ id: "mitos", label: "Yang sering salah dibaca orang", teks: p.ty.mitos });
  out.push({ id: "kuat", label: "Yang bisa diandalin dari aku", teks: p.ty.kuat[0] + "." });
  out.push({ id: "lemah", label: "Kelemahanku di hubungan", teks: p.ty.lemah[0] + "." });
  if (p.gaya) out.push({ id: "lekat", label: "Yang aku butuhin", teks: LEKAT[p.gaya].butuh });
  if (p.komunGaya) out.push({ id: "komun", label: "Cara ngobrol sama aku", teks: GAYA_KOMUN[p.komunGaya].caranya });
  out.push({ id: "kosong", label: "Tanpa kalimat", teks: "" });
  return out;
}

/* pembungkus teks */
function bungkus(g, teks, maxLebar) {
  const kata = String(teks).split(" "), baris = [];
  let now = "";
  kata.forEach(k => {
    const coba = now ? now + " " + k : k;
    if (g.measureText(coba).width > maxLebar && now) { baris.push(now); now = k; }
    else now = coba;
  });
  if (now) baris.push(now);
  return baris;
}

function gambarKartu(cv, p, opsi) {
  const t = TEMA[opsi.tema] || TEMA.senja;
  const W = 1080, H = 1350;
  cv.width = W; cv.height = H;
  const g = cv.getContext("2d");

  const bg = g.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, t.bg1); bg.addColorStop(1, t.bg2);
  g.fillStyle = bg; g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W * .2, -100, 0, W * .2, -100, 900);
  glow.addColorStop(0, t.aksen + "33"); glow.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = glow; g.fillRect(0, 0, W, H);
  const glow2 = g.createRadialGradient(W * .95, H, 0, W * .95, H, 800);
  glow2.addColorStop(0, t.aksen2 + "2A"); glow2.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = glow2; g.fillRect(0, 0, W, H);

  g.strokeStyle = t.redup + "44"; g.lineWidth = 2;
  g.strokeRect(44, 44, W - 88, H - 88);

  g.textAlign = "left";
  g.font = "600 26px system-ui, sans-serif"; g.fillStyle = t.redup;
  g.fillText("LIMA SUMBU", 96, 132);

  g.font = "400 168px Georgia, serif"; g.fillStyle = t.teks;
  g.fillText(p.base, 92, 300);
  const lebarBase = g.measureText(p.base).width;
  g.font = "400 84px Georgia, serif"; g.fillStyle = t.aksen;
  g.fillText("-" + p.ident, 96 + lebarBase, 300);

  g.font = "italic 46px Georgia, serif"; g.fillStyle = t.redup;
  g.fillText(p.ty.nick, 96, 370);

  // chip sifat
  let x = 96;
  g.font = "500 28px system-ui, sans-serif";
  sifatDari(p.R, p.base, p.ident).forEach(s => {
    const w = g.measureText(s).width + 46;
    g.strokeStyle = t.aksen + "88"; g.lineWidth = 2;
    g.beginPath(); g.roundRect(x, 410, w, 62, 31); g.stroke();
    g.fillStyle = t.aksen; g.fillText(s, x + 23, 450);
    x += w + 14;
  });

  // radar mini
  const cx = W / 2, cy = 760, R = 190;
  const pt = (rr, i, v) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; return [cx + Math.cos(a) * rr * v, cy + Math.sin(a) * rr * v]; };
  for (let ring = 2; ring <= 4; ring += 2) {
    g.beginPath();
    for (let i = 0; i < 5; i++) { const [a, b] = pt(R, i, ring / 4); i ? g.lineTo(a, b) : g.moveTo(a, b); }
    g.closePath(); g.strokeStyle = t.redup + "33"; g.lineWidth = 1.5; g.stroke();
  }
  const val = r => .16 + .84 * (Math.abs(r.pl - 50) / 50);
  g.beginPath();
  p.R.forEach((r, i) => { const [a, b] = pt(R, i, val(r)); i ? g.lineTo(a, b) : g.moveTo(a, b); });
  g.closePath();
  const fill = g.createRadialGradient(cx, cy, 0, cx, cy, R);
  fill.addColorStop(0, t.aksen + "66"); fill.addColorStop(1, t.aksen2 + "22");
  g.fillStyle = fill; g.fill();
  g.strokeStyle = t.teks + "AA"; g.lineWidth = 3; g.stroke();
  g.font = "600 30px Georgia, serif"; g.textAlign = "center";
  p.R.forEach((r, i) => { const [a, b] = pt(R + 46, i, 1);
    g.fillStyle = t.aksen; g.fillText(r.letter, a, b + 10); });

  // kalimat pilihan
  g.textAlign = "left";
  if (opsi.kalimat && opsi.kalimat.teks) {
    g.font = "600 24px system-ui, sans-serif"; g.fillStyle = t.aksen2;
    g.fillText(opsi.kalimat.label.toUpperCase(), 96, 1046);
    g.font = "italic 42px Georgia, serif"; g.fillStyle = t.teks;
    const baris = bungkus(g, "\u201C" + opsi.kalimat.teks + "\u201D", W - 200).slice(0, 4);
    baris.forEach((b, i) => g.fillText(b, 96, 1108 + i * 54));
  }

  // kaki
  g.strokeStyle = t.redup + "33"; g.lineWidth = 2;
  g.beginPath(); g.moveTo(96, H - 150); g.lineTo(W - 96, H - 150); g.stroke();
  if (opsi.sertakanKode) {
    g.font = "26px ui-monospace, Menlo, monospace"; g.fillStyle = t.aksen;
    g.fillText(opsi.kode, 96, H - 104);
    g.font = "22px system-ui, sans-serif"; g.fillStyle = t.redup;
    g.fillText("Tempel kodeku buat lihat cerita kita berdua", 96, H - 70);
  } else {
    g.font = "24px system-ui, sans-serif"; g.fillStyle = t.redup;
    g.fillText("Bahan refleksi, bukan diagnosis.", 96, H - 100);
  }
}

function unduhKartu(cv, nama) {
  return new Promise(res => {
    cv.toBlob(blob => {
      if (!blob) return res(false);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = nama + ".png";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      res(true);
    }, "image/png");
  });
}
