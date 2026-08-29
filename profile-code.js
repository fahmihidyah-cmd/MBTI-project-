/* Kode profil: satu string pendek yang aman dikirim lewat chat.
   Contoh: LS1.ENTJ-A.72-61-55-80-38.09-07-12-06-08.A45-62.VPBT

   Segmen:
   0  LS1              versi format
   1  ENTJ-A           kode tipe (turunan dari skor, disimpan biar gampang dibaca manusia)
   2  pct x5           persen ke arah kutub kiri tiap sumbu
   3  ci  x5           lebar rentang ketidakpastian
   4  A<anx>-<avo>     kelekatan (opsional)
   5  V<xyz>           tiga nilai teratas (opsional)

   Tanpa server, tanpa akun. Data orang lain tidak pernah disimpan di mana pun
   selain perangkat yang menempel kodenya. */

const KODE_VERSI = "LS1";

function encodeProfil(p) {
  const bagian = [
    KODE_VERSI,
    p.code,
    p.pct.map(n => String(Math.round(n)).padStart(2, "0")).join("-"),
    p.ci.map(n => String(Math.round(n)).padStart(2, "0")).join("-")
  ];
  if (p.att) bagian.push("A" + Math.round(p.att[0]) + "-" + Math.round(p.att[1]));
  if (p.vals && p.vals.length) bagian.push("V" + p.vals.join(""));
  if (p.komun) bagian.push("C" + Math.round(p.komun[0]) + "-" + Math.round(p.komun[1]));
  if (p.ennea) bagian.push("N" + p.ennea);
  return bagian.join(".");
}

function decodeProfil(str) {
  if (!str) return { error: "Kodenya kosong." };
  const s = str.trim().toUpperCase().replace(/\s+/g, "");
  const b = s.split(".");
  if (b[0] !== KODE_VERSI) return { error: "Ini kayaknya bukan kode Lima Sumbu. Kode selalu diawali " + KODE_VERSI + "." };
  if (b.length < 4) return { error: "Kodenya kepotong. Pastikan kesalin semua sampai akhir." };

  const code = b[1];
  if (!/^[EI][SN][TF][JP]-[AT]$/.test(code)) return { error: "Bagian tipenya nggak kebaca: " + code };

  const pct = b[2].split("-").map(Number);
  const ci = b[3].split("-").map(Number);
  if (pct.length !== 5 || pct.some(isNaN) || pct.some(n => n < 0 || n > 100))
    return { error: "Angka skornya nggak valid." };
  if (ci.length !== 5 || ci.some(isNaN)) return { error: "Angka rentangnya nggak valid." };

  const out = { code, base: code.slice(0, 4), ident: code.slice(5), pct, ci };

  b.slice(4).forEach(seg => {
    if (seg[0] === "A") {
      const n = seg.slice(1).split("-").map(Number);
      if (n.length === 2 && !n.some(isNaN)) out.att = n;
    }
    if (seg[0] === "V") {
      const v = seg.slice(1).split("").filter(c => VAL_DEF[c]);
      if (v.length) out.vals = v;
    }
    if (seg[0] === "C") {
      const n = seg.slice(1).split("-").map(Number);
      if (n.length === 2 && !n.some(isNaN)) out.komun = n;
    }
    if (seg[0] === "N") {
      const n = seg.slice(1);
      if (ENNEA_DEF[n]) out.ennea = n;
    }
  });

  // konsistensi: huruf harus cocok dengan skornya
  const huruf = DK.map((k, i) => out.pct[i] >= 50 ? D[k].l : D[k].r).join("");
  if (huruf !== out.base + out.ident)
    return { error: "Kode ini nggak konsisten antara huruf dan angkanya. Mungkin ada yang keubah waktu disalin." };

  return out;
}
