/* ===== util ===== */
const $ = id => document.getElementById(id);
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const esc = s => String(s).replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));

const mem = {};
const store = {
  async get(k) { try { if (window.storage) { const r = await window.storage.get(k); if (r) return JSON.parse(r.value); } } catch (e) {} return mem[k] ?? null; },
  async set(k, v) { mem[k] = v; try { if (window.storage) await window.storage.set(k, JSON.stringify(v)); } catch (e) {} }
};

/* ===== state ===== */
let ctxMode = "kerja", tesMode = "standar";
let pool = {}, asked = [], ans = [], cur = 0, t0 = null;
let b5ans = {}, b5done = false;
let attAns = {}, attDone = false, attSkor = null;
let valAns = {}, valDone = false, valTop = null;
let komAns = {}, komDone = false, komSkor = null;
let ennAns = {}, ennDone = false, ennTop = null, ennKedua = null;
let hist = [], team = [], relasiTersimpan = [], curated = {};
let stopRadar = null, hasilTerakhir = null;

/* ===== beranda ===== */
const daftar16 = Object.keys(T).sort();
$("homeGrid").innerHTML = daftar16.map(c => `<button class="gt" data-c="${c}">${c}<small>${T[c].nick.split(" ")[0]}</small></button>`).join("");
$("homePeek").innerHTML = `<p class="dimtxt" style="margin:0">Ketuk salah satu buat baca ringkasannya.</p>`;
$("homeGrid").onclick = e => {
  const b = e.target.closest(".gt"); if (!b) return;
  const c = b.dataset.c;
  $("homeGrid").querySelectorAll(".gt").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  $("homePeek").innerHTML = `<h3>${c} — ${T[c].nick}</h3><p class="dimtxt" style="margin:0">${T[c].sum}</p>`;
};
$("mode").onclick = e => { const b = e.target.closest("button"); if (!b) return; tesMode = b.dataset.m;
  [...$("mode").children].forEach(x => x.setAttribute("aria-pressed", String(x === b))); };
$("ctx").onclick = e => { const b = e.target.closest("button"); if (!b) return; ctxMode = b.dataset.c;
  [...$("ctx").children].forEach(x => x.setAttribute("aria-pressed", String(x === b))); };

(async () => {
  hist = (await store.get("riwayat")) || [];
  team = (await store.get("tim")) || [];
  relasiTersimpan = (await store.get("relasi")) || [];
  if (hist.length) {
    const l = hist[hist.length - 1], d = Math.round((Date.now() - l.ts) / 864e5);
    $("banner").innerHTML = d >= 28
      ? `<div class="note"><b>Udah ${d} hari dari tes terakhir</b>Coba lagi dan lihat apakah hasilnya bergeser. Bergeser itu normal — justru itu yang menarik.</div>`
      : `<div class="note" style="border-color:var(--sn);background:rgba(121,216,180,.07)"><b style="color:var(--sn)">Hasil terakhir: ${l.code}</b>Diisi ${d === 0 ? "hari ini" : d + " hari lalu"} sebagai versi "${l.ctx}".</div>`;
  }
})();

/* ===== tes ===== */
$("go").onclick = () => {
  pool = {};
  DK.forEach(k => {
    const semua = BANK[k].map(([p, t]) => ({ d: k, p, t }));
    const kiri = shuffle(semua.filter(x => x.p === D[k].l));
    const kanan = shuffle(semua.filter(x => x.p === D[k].r));
    const mix = [];
    for (let i = 0; i < Math.max(kiri.length, kanan.length); i++) { if (kiri[i]) mix.push(kiri[i]); if (kanan[i]) mix.push(kanan[i]); }
    pool[k] = mix;
  });
  asked = []; ans = []; cur = 0; t0 = Date.now();
  const awal = tesMode === "kilat" ? 2 : tesMode === "lengkap" ? 8 : 3;
  for (let i = 0; i < awal; i++) DK.forEach(k => asked.push(pool[k].shift()));
  $("home").classList.add("hidden"); $("quiz").classList.remove("hidden");
  $("prog").innerHTML = DK.map(k => `<i><b id="p_${k}" style="background:${D[k].c}"></b></i>`).join("");
  render(); scrollTo(0, 0);
};
$("back").onclick = () => { if (cur > 0) { cur--; render(); } };

function stat(k) {
  const xs = [];
  asked.forEach((it, i) => { if (it.d !== k) return; const v = ans[i]; if (v == null) return;
    xs.push((it.p === D[k].r ? 1 : -1) * (v - 3) / 2); });
  if (!xs.length) return { n: 0, pct: 50, ci: 50 };
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.max(.35, Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, xs.length - 1)));
  return { n: xs.length, pct: Math.round((m + 1) / 2 * 100), ci: Math.min(50, Math.round(98 * sd / Math.sqrt(xs.length))) };
}
function perlu() {
  if (tesMode !== "standar" || asked.length >= 30) return null;
  let w = null, wc = 8;
  DK.forEach(k => { const s = stat(k); if (s.n >= 8 || !pool[k].length) return; if (s.ci > wc) { wc = s.ci; w = k; } });
  return w;
}
function render() {
  const it = asked[cur];
  $("qtext").textContent = it.t;
  $("back").style.visibility = cur ? "visible" : "hidden";
  $("qcount").textContent = (cur + 1) + " / " + asked.length;
  $("qmeta").textContent = D[it.d].n.toUpperCase();
  DK.forEach(k => {
    const tot = asked.filter(i => i.d === k).length || 1;
    const done = asked.filter((i, n) => i.d === k && ans[n] != null).length;
    const el = $("p_" + k); if (el) el.style.width = (done / tot * 100) + "%";
  });
  const s = $("scale"); s.innerHTML = "";
  [1, 2, 3, 4, 5].forEach(v => {
    const b = document.createElement("button");
    b.className = "dot"; b.dataset.s = v;
    b.setAttribute("aria-label", ["Nggak banget", "Kurang", "Kadang", "Lumayan", "Aku banget"][v - 1]);
    if (ans[cur] === v) { b.style.background = D[it.d].c; b.style.borderColor = D[it.d].c; }
    b.onclick = () => pilih(v);
    s.appendChild(b);
  });
}
function pilih(v) {
  const it = asked[cur]; ans[cur] = v;
  [...$("scale").children].forEach(b => { const on = +b.dataset.s === v;
    b.style.background = on ? D[it.d].c : "transparent"; b.style.borderColor = on ? D[it.d].c : ""; });
  setTimeout(() => {
    if (cur < asked.length - 1) { cur++; render(); return; }
    const k = perlu();
    if (k && pool[k].length) { asked.push(pool[k].shift()); cur++; render(); } else selesai();
  }, 150);
}
addEventListener("keydown", e => {
  if ($("quiz").classList.contains("hidden")) return;
  if (e.key >= "1" && e.key <= "5") pilih(+e.key);
  if (e.key === "Backspace" && cur > 0) { cur--; render(); }
});
function hasil() {
  return DK.map(k => { const s = stat(k), pl = 100 - s.pct;
    return { k, d: D[k], pl, pr: s.pct, ci: s.ci, n: s.n, letter: pl >= 50 ? D[k].l : D[k].r, jelas: Math.abs(pl - 50) * 2 }; });
}

/* ===== radar ===== */
function radar(cv, rows) {
  const g = cv.getContext("2d"); let t0 = performance.now(), raf;
  const rs = () => { const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2.5);
    cv.width = Math.max(1, r.width) * d; cv.height = Math.max(1, r.height) * d; g.setTransform(d, 0, 0, d, 0, 0);
    cv._w = Math.max(1, r.width); cv._h = Math.max(1, r.height); };
  rs(); addEventListener("resize", rs);
  const RMo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pt = (cx, cy, R, i, v) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v]; };
  function draw(now) {
    const w = cv._w, h = cv._h, cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 46;
    const el = Math.min(1, (now - t0) / 900), ease = 1 - Math.pow(1 - el, 3);
    const br = RMo ? 1 : 1 + Math.sin(now / 1400) * .012;
    g.clearRect(0, 0, w, h);
    for (let ring = 1; ring <= 4; ring++) {
      g.beginPath();
      for (let i = 0; i < 5; i++) { const [x, y] = pt(cx, cy, R, i, ring / 4); i ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.closePath(); g.strokeStyle = "rgba(255,255,255," + (ring === 4 ? .16 : .07) + ")"; g.lineWidth = 1; g.stroke();
    }
    for (let i = 0; i < 5; i++) { const [x, y] = pt(cx, cy, R, i, 1);
      g.beginPath(); g.moveTo(cx, cy); g.lineTo(x, y); g.strokeStyle = "rgba(255,255,255,.07)"; g.stroke(); }
    const val = r => .14 + .86 * (Math.abs(r.pl - 50) / 50);
    g.beginPath();
    rows.forEach((r, i) => { const hi = Math.min(1, val(r) + r.ci / 100); const [x, y] = pt(cx, cy, R, i, hi * ease * br); i ? g.lineTo(x, y) : g.moveTo(x, y); });
    g.closePath(); g.fillStyle = "rgba(196,162,255,.10)"; g.fill();
    g.beginPath();
    rows.forEach((r, i) => { const [x, y] = pt(cx, cy, R, i, val(r) * ease * br); i ? g.lineTo(x, y) : g.moveTo(x, y); });
    g.closePath();
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, R);
    gr.addColorStop(0, "rgba(255,178,122,.38)"); gr.addColorStop(1, "rgba(196,162,255,.16)");
    g.fillStyle = gr; g.fill(); g.strokeStyle = "rgba(255,255,255,.55)"; g.lineWidth = 1.6; g.stroke();
    rows.forEach((r, i) => { const [x, y] = pt(cx, cy, R, i, val(r) * ease * br);
      g.beginPath(); g.arc(x, y, 4.5, 0, 7); g.fillStyle = r.d.c; g.shadowBlur = 12; g.shadowColor = r.d.c; g.fill(); g.shadowBlur = 0; });
    rows.forEach((r, i) => { const [x, y] = pt(cx, cy, R + 30, i, 1);
      g.textAlign = Math.abs(x - cx) < 6 ? "center" : x > cx ? "left" : "right"; g.textBaseline = "middle";
      g.font = "600 17px Georgia,serif"; g.fillStyle = r.d.c; g.fillText(r.letter, x, y - 8);
      g.font = "11px system-ui"; g.fillStyle = "rgba(243,234,226,.55)"; g.fillText(Math.max(r.pl, 100 - r.pl) + "%", x, y + 8); });
    raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(raf);
}

/* ===== hasil ===== */
async function selesai() {
  const R = hasil();
  const base = R.slice(0, 4).map(r => r.letter).join(""), ident = R[4].letter, code = base + "-" + ident;
  const ty = T[base], idn = ID[ident], menit = Math.round((Date.now() - t0) / 60000);
  hasilTerakhir = { R, base, ident, code };
  hist.push({ ts: Date.now(), code, ctx: ctxMode, pct: R.map(r => r.pl), ci: R.map(r => r.ci) });
  await store.set("riwayat", hist);

  const axes = R.map(r => {
    const lo = Math.max(0, r.pl - r.ci), hi = Math.min(100, r.pl + r.ci);
    return `<div class="axis"><div class="axis-h"><span style="color:${r.d.c}">${r.d.ln}</span>
      <span class="dimtxt">${r.d.n}</span><span style="color:${r.d.c}">${r.d.rn}</span></div>
      <div class="track"><div class="zone"></div><div class="ci" style="left:${lo}%;width:${hi - lo}%;background:${r.d.c}"></div>
      <div class="mk" style="left:${r.pl}%"></div></div>
      <div class="axis-f"><span class="num">${r.pl}% ± ${r.ci}</span>
      <span class="chip">${r.ci > 12 ? "belum pasti" : r.jelas >= 40 ? "jelas" : r.jelas >= 15 ? "lumayan jelas" : "hampir imbang"}</span>
      <span class="num">${r.n} soal</span></div></div>`;
  }).join("");

  $("out").innerHTML = `
  <div class="code">${base.split("").map((c, i) => `<span style="animation-delay:${i * 80}ms;color:${AXC[i]}">${c}</span>`).join("")}<span class="sfx" style="animation-delay:360ms">-${ident}</span></div>
  <div class="nick">${ty.nick} · ${idn.nama}</div>
  <p class="lede">${ty.sum}</p>
  <p class="lede" style="color:var(--at)">${ATT[base][ident === "A" ? 0 : 1]}</p>
  <p class="dimtxt">${asked.length} soal · ${menit < 1 ? "di bawah semenit" : menit + " menit"} · versi "${ctxMode === "kerja" ? "di tempat kerja" : ctxMode === "rumah" ? "di rumah" : "apa adanya"}"</p>

  <div class="card"><h2>Bentuk profilmu</h2>
    <div class="radarbox"><canvas id="rad"></canvas></div>
    <p class="dimtxt" style="text-align:center;margin:6px 0 0">Makin jauh ujungnya dari tengah, makin kuat kecenderunganmu di sumbu itu. Bayangan ungu di sekelilingnya adalah rentang meleset.</p></div>

  <div class="card"><h2>Angkanya</h2>${axes}
    <p class="dimtxt" style="margin:0">Kotak abu di tengah itu zona imbang. Kalau penanda putihnya berhenti di situ, hurufnya gampang berubah kalau kamu tes ulang.</p></div>

  <div class="card">
    <div class="tabwrap"><div class="fade l off" id="fl"></div><div class="fade r" id="fr"></div>
      <div class="tabs" id="tabs">
        <button class="tab" data-t="15" aria-selected="true">Ceritaku</button>
        <button class="tab" data-t="0" aria-selected="false">Potret</button>
        <button class="tab" data-t="1" aria-selected="false">Berdua</button>
        <button class="tab" data-t="2" aria-selected="false">Kelekatan</button>
        <button class="tab" data-t="3" aria-selected="false">Nilai hidup</button>
        <button class="tab" data-t="16" aria-selected="false">Komunikasi</button>
        <button class="tab" data-t="17" aria-selected="false">Enneagram</button>
        <button class="tab" data-t="4" aria-selected="false">Ketenangan</button>
        <button class="tab" data-t="5" aria-selected="false">Kekuatan</button>
        <button class="tab" data-t="6" aria-selected="false">Titik buta</button>
        <button class="tab" data-t="7" aria-selected="false">Saat capek</button>
        <button class="tab" data-t="8" aria-selected="false">Motivasi</button>
        <button class="tab" data-t="9" aria-selected="false">Kerja</button>
        <button class="tab" data-t="10" aria-selected="false">Cara mikir</button>
        <button class="tab" data-t="11" aria-selected="false">Big Five</button>
        <button class="tab" data-t="18" aria-selected="false">Kartu</button>
        <button class="tab" data-t="12" aria-selected="false">Cek jujur</button>
        <button class="tab" data-t="13" aria-selected="false">Riwayat</button>
        <button class="tab" data-t="19" aria-selected="false">Hiburan</button>
        <button class="tab" data-t="14" aria-selected="false">Catatan</button>
      </div></div><div id="tb"></div></div>
  <div class="row"><button class="btn soft mini" id="ulang">Tes lagi</button><button class="btn soft mini" id="salin">Salin ringkasan</button></div>
  <div id="fb"></div>`;

  $("quiz").classList.add("hidden"); $("out").classList.remove("hidden"); scrollTo(0, 0);
  if (stopRadar) stopRadar();
  stopRadar = radar($("rad"), R);
  setupTabs(); isiTab(R, base, ident, ty, idn, code);
  $("ulang").onclick = () => { if (stopRadar) { stopRadar(); stopRadar = null; }
    $("out").classList.add("hidden"); $("out").innerHTML = ""; $("home").classList.remove("hidden"); scrollTo(0, 0); };
  $("salin").onclick = () => salinRingkasan(code, base, ident, ty, idn, R);
}

function setupTabs() {
  const t = $("tabs"), fl = $("fl"), fr = $("fr");
  const upd = () => { fl.classList.toggle("off", t.scrollLeft < 8);
    fr.classList.toggle("off", t.scrollLeft + t.clientWidth > t.scrollWidth - 8); };
  t.addEventListener("scroll", upd); upd();
}

function profilAktif() {
  if (!hasilTerakhir) return null;
  const p = { code: hasilTerakhir.code, base: hasilTerakhir.base, ident: hasilTerakhir.ident,
    pct: hasilTerakhir.R.map(r => r.pl), ci: hasilTerakhir.R.map(r => r.ci) };
  if (attSkor) p.att = attSkor;
  if (valTop) p.vals = valTop;
  if (komSkor) p.komun = komSkor;
  if (ennTop) p.ennea = ennTop;
  return p;
}

const BADGE = {
  kuat: '<span class="badge kuat">Dukungan riset kuat</span>',
  reflektif: '<span class="badge reflektif">Kerangka reflektif</span>'
};

function isiTab(R, base, ident, ty, idn, code) {
  const tier = j => j >= 40 ? 3 : j >= 15 ? 2 : 1;
  const temp = TEMP[base[1] === "S" ? (base[3] === "J" ? "SJ" : "SP") : (base[2] === "F" ? "NF" : "NT")];
  const key = i => i === 4 ? (ident === "A" ? "A" : "Tb") : R[i].letter;
  const kal = [...R.map((r, i) => ({ id: "a" + i, t: AX[key(i)][tier(r.jelas)], c: AXC[i] })),
    { id: "at", t: ATT[base][ident === "A" ? 0 : 1], c: AXC[4] }, { id: "tm", t: temp[1] },
    { id: "st", t: ty.stres }, { id: "mi", t: ty.mitos }, { id: "re", t: ty.relasi }];
  curated = {};

  const B = [];
  B[0] = `${BADGE.reflektif}<p>${ty.sum}</p>
    <div class="sub">Tandai yang beneran kerasa kamu</div>
    <p class="dimtxt">Yang kamu coret nggak masuk ke ringkasan akhir.</p><div id="jud"></div>
    <div class="sub">Kalimat yang mungkin sering lewat di kepalamu</div>${ty.voice.map(v => `<p class="quote">${v}</p>`).join("")}
    <div class="sub">Ringkasan versi kamu</div><div id="ring" class="dimtxt">Tandai dulu kalimat di atas.</div>
    <p class="dimtxt" style="margin-top:18px">Kira-kira ${ty.freq}% orang diperkirakan bertipe ${base}. Angka kasar dari survei, bukan patokan pasti.</p>`;
  B[1] = `<div id="berdua"></div>`;
  B[2] = `<div id="lekat"></div>`;
  B[3] = `<div id="nilai"></div>`;
  B[4] = `<p>${idn.sum}</p><p style="color:var(--at)">${ATT[base][ident === "A" ? 0 : 1]}</p>
    <div class="sub">Sumbu ini sebenernya ngukur apa</div>
    <p class="dimtxt">Empat huruf pertama njelasin <b>caramu</b> kerja. Huruf kelima njelasin <b>seberapa tenang</b> kamu ngejalaninnya. Dua orang ${base} bisa kelihatan beda banget cuma gara-gara huruf ini.</p>
    <div class="sub">Yang jadi kekuatan</div><ul>${idn.kuat.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Yang perlu dijaga</div><ul class="warn">${idn.hati.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Yang biasanya ngebantu</div><ul>${idn.tumbuh.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Kembaranmu di sisi lain</div><p>${base}-${ident === "A" ? "T" : "A"}: ${ATT[base][ident === "A" ? 1 : 0]}</p>
    <p class="dimtxt">Kekuatan dan kelemahan dasarnya sama. Yang beda itu ongkos batinnya.</p>
    <div class="note" style="margin-top:16px"><b>Batasnya</b>Sumbu ini soal kecenderungan, bukan kondisi kesehatan mental. Kalau rasa cemas atau tertekannya udah ganggu tidur, kerjaan, atau hubungan, itu urusan tenaga profesional — bukan tes kayak gini.</div>`;
  B[5] = `<ul>${ty.kuat.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Tambahan dari sisi ${idn.nama}</div><ul>${idn.kuat.slice(0, 2).map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Tiga hal yang biasanya ngebantu</div><ul>${ty.tumbuh.map(x => `<li>${x}</li>`).join("")}</ul>`;
  B[6] = `<ul class="warn">${ty.lemah.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Yang diperberat sisi ${idn.nama}</div><ul class="warn">${idn.hati.slice(0, 2).map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Kalau lagi berselisih</div><p>${ty.konflik}</p>
    <div class="sub">Cara kamu nyampein</div><p>${ty.komun}</p>`;
  B[7] = `<div class="sub">Versimu waktu tenaganya habis</div><p>${ty.stres}</p>
    <p class="dimtxt">Ini yang disebut mode capek: bagian dirimu yang paling lemah (${ty.fn[3]}) ngambil alih waktu yang utama kehabisan bensin. Ini bukan kamu yang asli, cuma tanda kamu perlu istirahat.</p>
    <div class="sub">Bedanya karena kamu ${idn.nama}</div><p>${idn.stres}</p>
    <div class="sub">Yang paling nguras</div><p>${ty.drain}</p>`;
  B[8] = `<div class="sub">Yang bikin kamu nyala</div><p>${ty.motiv}</p>
    <div class="sub">Cara kamu paling cepat belajar</div><p>${base[1] === "S" ? "Lewat contoh nyata dan langkah berurutan. Teori tanpa praktik cepat nguap dari kepalamu." : "Lewat konsep dan gambaran besar dulu. Detail baru nempel setelah kamu tahu buat apa."}</p>
    <div class="sub">Cara kamu ambil keputusan besar</div><p>${base[2] === "T" ? "Kamu petain untung-ruginya, terus perlu sengaja ngecek dampaknya ke orang." : "Kamu nimbang dampaknya ke orang dan nilaimu, terus perlu sengaja lihat angkanya."} ${ident === "T" ? "Karena kamu tipe waspada, tahap nimbangnya cenderung lebih lama dari yang sebenernya perlu." : "Karena kamu tipe santai, kamu nutup keputusan lebih cepat — pastiin cepatnya bukan cara ngindarin ragu yang berguna."}</p>
    <div class="sub">Di hubungan dekat</div><p>${ty.relasi}</p>`;
  B[9] = `<div class="sub">Yang kamu bawa ke tim</div><ul>${ty.plus.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Yang biasanya jadi gesekan</div><ul class="warn">${ty.minus.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Pengaruh sisi ${idn.nama} di tempat kerja</div><p>${idn.kerja}</p>
    <div class="kv"><b>Peran</b><span>${ty.peran}</span></div><div class="kv"><b>Kerja bareng kamu</b><span>${ty.kolab}</span></div>
    <div class="note" style="margin-top:16px"><b>Jangan dipakai buat ini</b>Daftar peran di atas cuma kecenderungan, bukan pagar. Jangan dipakai buat nutup pilihan siapa pun — apalagi huruf kelimanya, yang paling gampang disalahpakai buat nilai ketahanan orang.</div>
    <div class="sub">Tim kamu</div><p class="dimtxt">Simpan hasilmu, terus minta rekan ngisi di perangkat yang sama buat lihat sebarannya.</p>
    <input type="text" id="nm" placeholder="Nama atau inisial"><div class="row" style="margin-top:9px"><button class="btn soft mini" id="addTim">Tambahin ke tim</button></div>
    <div id="timOut" style="margin-top:14px"></div>`;
  B[10] = `${BADGE.reflektif}<p class="dimtxt">Di balik empat huruf pertama ada urutan cara kamu ngolah dunia. Huruf kelima nggak masuk sini — dia bukan cara mikir, tapi warna yang nglapisin keempatnya.</p>
    ${ty.fn.map((f, i) => `<div class="kv"><b style="color:${AXC[i]}">${f}</b><span><b style="color:var(--txt);font-size:14.5px">${F[f][0]}</b> — ${F[f][1]}<br><span class="dimtxt">${ROLE[i]}</span></span></div>`).join("")}
    <p class="dimtxt">Teori ini populer, tapi dukungan datanya lebih lemah daripada sumbu-sumbunya.</p>`;
  B[11] = `<div id="b5"></div>`;
  B[12] = `<p>Deskripsi kepribadian gampang kerasa benar padahal cocok buat hampir semua orang. Coba buktiin: tandai yang kerasa persis kamu. Sebagian sengaja dibikin berlaku umum.</p>
    <div id="barList"></div><button class="btn soft mini" id="barBtn" style="margin-top:6px">Lihat hasilnya</button><div id="barOut" style="margin-top:14px"></div>`;
  B[13] = `<div id="riw"></div>`;
  B[14] = `<p>Tiga hal yang sebaiknya kamu tahu:</p>
    <ul class="warn"><li><b>Hurufnya nggak stabil.</b> Kebanyakan orang dapat minimal satu huruf beda kalau ngulang beberapa minggu kemudian. Makanya tes ini nampilin rentang, bukan satu angka.</li>
    <li><b>Manusia nggak kebelah dua.</b> Skor orang numpuk di tengah. Selisih 51:49 dan 85:15 sama-sama ngasih satu huruf, padahal artinya jauh beda.</li>
    <li><b>Nggak bisa nebak kinerja.</b> Tipe nggak kebukti bisa mrediksi hasil kerja, jadi nggak layak dipakai buat rekrut, nempatin, atau promosi.</li></ul>
    <div class="sub">Kenapa nggak ada angka kecocokan</div>
    <p class="dimtxt">Skor kecocokan tunggal — "kalian 87% cocok" — kelihatan meyakinkan tapi nggak ada dasarnya. Yang bisa dipertanggungjawabkan cuma pola: di mana kalian nyambung, di mana gesekannya, dan apa yang bisa dilakuin. Itu yang ditampilin di tab Berdua.</p>`;

  B[15] = `<div id="cerita"></div>`;
  B[16] = `<div id="komun"></div>`;
  B[17] = `<div id="ennea"></div>`;
  B[18] = `<div id="kartu"></div>`;
  B[19] = `<div id="fun"></div>`;

  const show = n => {
    $("tb").innerHTML = B[n];
    const bs = [...$("tabs").children];
    bs.forEach(b => b.setAttribute("aria-selected", String(+b.dataset.t === n)));
    const aktif = bs.find(b => +b.dataset.t === n);
    if (aktif) aktif.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    if (n === 15) tabCerita(R, base, ident, ty, idn, code);
    if (n === 0) kurasi(kal);
    if (n === 1) tabBerdua();
    if (n === 2) tabLekat();
    if (n === 3) tabNilai();
    if (n === 9) tim(code);
    if (n === 11) b5init(R[4]);
    if (n === 12) cekJujur(ty, idn);
    if (n === 13) riwayat();
    if (n === 16) tabKomun();
    if (n === 17) tabEnnea();
    if (n === 18) tabKartu(R, base, ident, ty, idn, code);
    if (n === 19) tabFun();
  };
  $("tabs").onclick = e => { const b = e.target.closest(".tab"); if (b) show(+b.dataset.t); };
  show(15);
}

/* ===== tab cerita ===== */
function tabCerita(R, base, ident, ty, idn, code) {
  const p = {
    R, base, ident, code, ty, idn,
    temp: TEMP[base[1] === "S" ? (base[3] === "J" ? "SJ" : "SP") : (base[2] === "F" ? "NF" : "NT")],
    gaya: attSkor ? gayaLekat(attSkor[0], attSkor[1]) : null,
    vals: valTop,
    komunGaya: komSkor ? gayaKomun(komSkor[0], komSkor[1]) : null,
    ennea: ennTop
  };
  const c = susunCerita(p);
  const lensa = [...new Set(c.blok.map(b => b.lens))];

  $("cerita").innerHTML = `
    <p class="dimtxt">Sekitar ${c.menit} menit baca · disusun dari ${c.blok.length} bagian yang cocok sama hasilmu, dari lensa: ${lensa.join(", ")}.</p>
    <div class="cerita">
      ${c.bab.map(b => {
        if (b.id === "orang") return `<h3 class="bab">${b.judul}</h3>` +
          b.pasang.map(([j, t]) => `<p class="pandang"><b>${j}</b><br>${t}</p>`).join("");
        if (b.id === "tumbuh") return `<h3 class="bab">${b.judul}</h3>` +
          `<p class="dimtxt">Tiga eksperimen, bukan nasihat. Coba seminggu, terus lihat apa yang berubah.</p>` +
          b.eksperimen.map((e, i) => `<div class="eks"><b>${i + 1}. ${e.judul}</b>
            <p>${e.cara}</p><p class="dimtxt">Kenapa: ${e.kenapa}</p></div>`).join("");
        if (!b.isi.length) return "";
        return (b.judul ? `<h3 class="bab">${b.judul}</h3>` : "") + b.isi.map(x => `<p>${x.teks}</p>`).join("");
      }).join("")}
    </div>
    <div class="row" style="margin-top:18px">
      <button class="btn soft mini" id="salinCerita">Salin ceritaku</button>
      <button class="btn soft mini" id="keBerdua">Bandingin sama orang</button>
    </div>
    <p class="dimtxt" style="margin-top:14px">Cerita ini disusun dari skormu, bukan diambil dari teks jadi. Kalau ada bagian yang kerasa bukan kamu, buka tab Potret dan coret — di situ letak informasinya.</p>`;

  $("salinCerita").onclick = () => {
    const t = ceritaKeTeks(c, code);
    navigator.clipboard?.writeText(t).then(() => {
      $("salinCerita").textContent = "Tersalin";
      setTimeout(() => $("salinCerita").textContent = "Salin ceritaku", 1600);
    }).catch(() => {
      $("cerita").insertAdjacentHTML("beforeend", '<textarea readonly style="margin-top:12px"></textarea>');
      const a = $("cerita").querySelector("textarea"); a.value = t; a.focus(); a.select();
    });
  };
  $("keBerdua").onclick = () => {
    const b = [...$("tabs").children].find(x => x.dataset.t === "1");
    if (b) b.click();
  };
}

/* ===== potret terkurasi ===== */
function kurasi(kal) {
  $("jud").innerHTML = kal.map(k => `<div class="judge" id="j_${k.id}"${k.c ? ` style="border-left:3px solid ${k.c}"` : ""}>
    <p>${k.t}</p><div class="row"><button class="yesb" data-i="${k.id}" data-v="1">Ini aku</button><button class="nob" data-i="${k.id}" data-v="0">Bukan aku</button></div></div>`).join("");
  $("jud").querySelectorAll("button").forEach(b => b.onclick = () => {
    const id = b.dataset.i, v = b.dataset.v === "1"; curated[id] = v;
    const bx = $("j_" + id); bx.classList.toggle("yes", v); bx.classList.toggle("no", !v);
    bx.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    const ya = kal.filter(k => curated[k.id] === true), tk = kal.filter(k => curated[k.id] === false);
    $("ring").innerHTML = ya.length
      ? `<p style="color:var(--soft)">${ya.map(k => k.t).join(" ")}</p>${tk.length ? `<p class="dimtxt">${tk.length} kalimat kamu tolak. Itu info berguna: di situ label lima huruf gagal nangkep kamu.</p>` : ""}`
      : "Tandai dulu kalimat di atas.";
  });
}

/* ===== tab berdua ===== */
function tabBerdua() {
  const me = profilAktif();
  const kode = encodeProfil(me);
  const kelengkapan = [];
  if (!me.att) kelengkapan.push("Kelekatan");
  if (!me.vals) kelengkapan.push("Nilai hidup");

  $("berdua").innerHTML = `
    <p>Nggak perlu akun dan nggak perlu server. Salin kodemu, kirim ke orangnya lewat chat, minta dia balas kodenya, lalu tempel di bawah.</p>
    <div class="sub">Kode kamu</div>
    <div class="kodebox" id="kodeku">${kode}</div>
    <div class="row"><button class="btn soft mini" id="copyKode">Salin kodeku</button></div>
    ${kelengkapan.length ? `<p class="dimtxt" style="margin-top:10px">Isi tab ${kelengkapan.join(" dan ")} kalau mau ceritanya jauh lebih tajam — hasilnya otomatis ikut masuk ke kode.</p>` : ""}
    <div class="sub">Kode temanmu</div>
    <textarea class="kode" id="kodeDia" placeholder="Tempel kode yang dia kirim di sini"></textarea>
    <div class="row" style="margin-top:9px">
      <input type="text" id="namaDia" placeholder="Panggilan dia (opsional)" style="flex:1;min-width:160px">
      <button class="btn soft mini" id="lihatBerdua">Lihat cerita berdua</button>
    </div>
    <div id="hasilBerdua" style="margin-top:16px"></div>
    <div class="sub">Tersimpan</div><div id="daftarRelasi"></div>
    <div class="note" style="margin-top:16px"><b>Soal izin</b>Kode temanmu hanya tersimpan di perangkat ini dan nggak pernah dikirim ke mana pun. Tetap saja: minta izin dulu sebelum menyimpan hasil orang lain.</div>`;

  $("copyKode").onclick = () => {
    navigator.clipboard?.writeText(kode).then(() => {
      $("copyKode").textContent = "Tersalin"; setTimeout(() => $("copyKode").textContent = "Salin kodeku", 1600);
    }).catch(() => { const r = document.createRange(); r.selectNode($("kodeku"));
      getSelection().removeAllRanges(); getSelection().addRange(r); });
  };
  $("lihatBerdua").onclick = async () => {
    const d = decodeProfil($("kodeDia").value);
    if (d.error) { $("hasilBerdua").innerHTML = `<div class="note"><b>Kodenya belum kebaca</b>${d.error}</div>`; return; }
    const nama = ($("namaDia").value || "Dia").trim();
    tampilBerdua(me, d, nama);
    relasiTersimpan = relasiTersimpan.filter(r => r.nama !== nama);
    relasiTersimpan.push({ nama, code: d.code, kode: encodeProfil(d), ts: Date.now() });
    await store.set("relasi", relasiTersimpan);
    daftarRelasi();
  };
  daftarRelasi();

  function daftarRelasi() {
    const el = $("daftarRelasi"); if (!el) return;
    if (!relasiTersimpan.length) { el.innerHTML = `<p class="dimtxt">Belum ada.</p>`; return; }
    el.innerHTML = relasiTersimpan.map((r, i) =>
      `<div class="relcard"><h3>${esc(r.nama)} — ${r.code}</h3>
        <div class="row" style="margin-top:8px">
        <button class="btn soft mini" data-buka="${i}">Buka lagi</button>
        <button class="btn soft mini" data-hapus="${i}">Hapus</button></div></div>`).join("");
    el.querySelectorAll("[data-buka]").forEach(b => b.onclick = () => {
      const r = relasiTersimpan[+b.dataset.buka], d = decodeProfil(r.kode);
      if (!d.error) tampilBerdua(me, d, r.nama);
    });
    el.querySelectorAll("[data-hapus]").forEach(b => b.onclick = async () => {
      relasiTersimpan.splice(+b.dataset.hapus, 1); await store.set("relasi", relasiTersimpan); daftarRelasi();
    });
  }
}

function tampilBerdua(me, dia, nama) {
  const c = ceritaBerdua(me, dia);
  const cocokAtt = me.att && dia.att;
  $("hasilBerdua").innerHTML = `
    <div class="card" style="margin:0">
      <h2 style="margin-bottom:2px">${me.code} × ${dia.code}</h2>
      <p class="dimtxt" style="margin-bottom:10px">${esc(nama)} — ${T[dia.base].nick}</p>
      <h3 style="color:var(--sn)">${c.label}</h3><p class="dimtxt">${c.ket}</p>
      <p class="dimtxt"><b style="color:var(--txt)">${c.level[0]}.</b> ${c.level[1]}</p>
      ${c.sections.map(s => `<div class="sub">${s.judul}</div><ul>${s.isi.map(x => `<li>${x}</li>`).join("")}</ul>`).join("")}
      <div class="sub">Coba minggu ini</div><ul>${c.langkah.map(x => `<li>${x}</li>`).join("")}</ul>
      ${cocokAtt ? "" : `<p class="dimtxt">Bagian kebutuhan dan cara baikan bakal jauh lebih spesifik kalau kalian berdua ngisi lensa Kelekatan.</p>`}
      <div class="note" style="margin-top:14px"><b>Nggak ada angka kecocokan di sini</b>Dan itu disengaja. Angka tunggal kelihatan meyakinkan tapi nggak bisa dipertanggungjawabkan. Yang di atas adalah pola, bukan vonis.</div>
      <div class="row"><button class="btn soft mini" id="salinBerdua">Salin cerita ini</button></div>
    </div>`;
  $("salinBerdua").onclick = () => {
    const t = [`CERITA BERDUA — ${me.code} × ${dia.code} (${nama})`, c.label + ": " + c.ket, "",
      ...c.sections.flatMap(s => [s.judul.toUpperCase(), ...s.isi.map(x => "- " + x), ""]),
      "COBA MINGGU INI", ...c.langkah.map(x => "- " + x), "",
      "Ini pola, bukan vonis. Bukan alat prediksi keberhasilan hubungan."].join("\n");
    navigator.clipboard?.writeText(t);
    $("salinBerdua").textContent = "Tersalin"; setTimeout(() => $("salinBerdua").textContent = "Salin cerita ini", 1600);
  };
  $("hasilBerdua").scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ===== lensa kelekatan ===== */
function tabLekat() {
  if (attDone) return lekatHasil();
  $("lekat").innerHTML = `${BADGE.kuat}
    <p>Enam belas pernyataan tentang caramu dekat sama orang. Ini lensa dengan dukungan riset paling kuat buat urusan hubungan — dan hasilnya langsung dipakai di tab Berdua.</p>
    <div id="lekatList">${ATTACH.map((it, i) => `<div class="b5row"><span>${it[1]}</span><div class="m5" data-i="${i}">
      ${[1, 2, 3, 4, 5].map(v => `<button data-v="${v}" aria-label="${v}"></button>`).join("")}</div></div>`).join("")}</div>
    <div class="ends" style="margin-top:8px"><span>kiri: nggak setuju</span><span>kanan: setuju</span></div>
    <button class="btn" id="lekatGo" style="margin-top:16px">Lihat hasilnya</button>`;
  $("lekatList").querySelectorAll(".m5").forEach(g => g.querySelectorAll("button").forEach(b => b.onclick = () => {
    attAns[g.dataset.i] = +b.dataset.v;
    g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  }));
  $("lekatGo").onclick = () => {
    if (Object.keys(attAns).length < ATTACH.length) { alert("Masih ada yang belum diisi."); return; }
    let sx = 0, nx = 0, sv = 0, nv = 0;
    ATTACH.forEach((it, i) => { const v = attAns[i] || 3;
      if (it[0] === "x") { sx += v; nx++; } else { sv += v; nv++; } });
    attSkor = [Math.round(((sx / nx) - 1) / 4 * 100), Math.round(((sv / nv) - 1) / 4 * 100)];
    attDone = true; lekatHasil();
  };
}
function lekatHasil() {
  const [anx, avo] = attSkor, g = gayaLekat(anx, avo), L = LEKAT[g];
  $("lekat").innerHTML = `${BADGE.kuat}
    <h2 style="margin-bottom:2px">${L.nama}</h2><p>${L.sum}</p>
    <div class="stat"><span class="lab">Kecemasan</span><span class="b"><i style="width:${anx}%;background:#FFA36B"></i></span><span class="v">${anx}</span></div>
    <p class="dimtxt" style="margin:-4px 0 12px">Seberapa besar kamu khawatir hubunganmu goyah.</p>
    <div class="stat"><span class="lab">Penghindaran</span><span class="b"><i style="width:${avo}%;background:#8FB8FF"></i></span><span class="v">${avo}</span></div>
    <p class="dimtxt" style="margin:-4px 0 12px">Seberapa besar kamu jaga jarak waktu keadaan berat.</p>
    <div class="sub">Yang jadi kekuatan</div><ul>${L.kuat.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Yang perlu dijaga</div><ul class="warn">${L.jaga.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Yang kamu butuhin dari pasangan</div><p>${L.butuh}</p>
    <p class="dimtxt">Ini dua sumbu kontinu, bukan empat kotak. Posisi 48 dan 52 hampir sama artinya, cuma beda nama.</p>
    <div class="note"><b>Kabar baik</b>Gaya kelekatan bukan takdir. Ia terbentuk dari pengalaman dan bisa bergeser — biasanya lewat hubungan yang aman dan konsisten, bukan lewat usaha sendirian.</div>
    <p class="dimtxt">Hasil ini otomatis masuk ke kode profilmu di tab Berdua.</p>
    <button class="btn soft mini" id="lekatUlang">Isi ulang</button>`;
  $("lekatUlang").onclick = () => { attAns = {}; attDone = false; tabLekat(); };
}

/* ===== lensa nilai ===== */
function tabNilai() {
  if (valDone) return nilaiHasil();
  $("nilai").innerHTML = `${BADGE.reflektif}
    <p>Dua belas pernyataan buat lihat apa yang paling kamu jadikan ukuran. Nilai yang bentrok adalah sumber gesekan yang paling sering nggak disadari di hubungan.</p>
    <div id="nilaiList">${VALUES.map((it, i) => `<div class="b5row"><span>${it[1]}</span><div class="m5" data-i="${i}">
      ${[1, 2, 3, 4, 5].map(v => `<button data-v="${v}" aria-label="${v}"></button>`).join("")}</div></div>`).join("")}</div>
    <div class="ends" style="margin-top:8px"><span>kiri: nggak setuju</span><span>kanan: setuju</span></div>
    <button class="btn" id="nilaiGo" style="margin-top:16px">Lihat hasilnya</button>`;
  $("nilaiList").querySelectorAll(".m5").forEach(g => g.querySelectorAll("button").forEach(b => b.onclick = () => {
    valAns[g.dataset.i] = +b.dataset.v;
    g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  }));
  $("nilaiGo").onclick = () => {
    if (Object.keys(valAns).length < VALUES.length) { alert("Masih ada yang belum diisi."); return; }
    const s = {}, n = {};
    VALUES.forEach((it, i) => { const v = valAns[i] || 3; s[it[0]] = (s[it[0]] || 0) + v; n[it[0]] = (n[it[0]] || 0) + 1; });
    const urut = Object.keys(s).map(k => [k, Math.round(((s[k] / n[k]) - 1) / 4 * 100)]).sort((a, b) => b[1] - a[1]);
    valTop = urut.slice(0, 3).map(x => x[0]);
    valDone = true; nilaiHasil(urut);
  };
}
function nilaiHasil(urut) {
  if (!urut) {
    const s = {}, n = {};
    VALUES.forEach((it, i) => { const v = valAns[i] || 3; s[it[0]] = (s[it[0]] || 0) + v; n[it[0]] = (n[it[0]] || 0) + 1; });
    urut = Object.keys(s).map(k => [k, Math.round(((s[k] / n[k]) - 1) / 4 * 100)]).sort((a, b) => b[1] - a[1]);
  }
  const col = { P: "#FFA36B", K: "#79D8B4", B: "#FFD07A", D: "#C4A2FF", T: "#8FB8FF", M: "#F0A6C8" };
  $("nilai").innerHTML = `${BADGE.reflektif}
    <h2 style="margin-bottom:10px">Tiga teratas: ${valTop.map(v => VAL_DEF[v][0]).join(", ")}</h2>
    ${urut.map(([k, v]) => `<div style="margin-bottom:14px">
      <div class="stat"><span class="lab">${VAL_DEF[k][0]}</span><span class="b"><i style="width:${v}%;background:${col[k]}"></i></span><span class="v">${v}</span></div>
      <p class="dimtxt" style="margin:0">${VAL_DEF[k][1]}</p></div>`).join("")}
    <div class="sub">Kenapa ini penting</div>
    <p>Beda cara kerja bisa dinegosiasi. Beda nilai biasanya nggak — yang bisa dilakuin cuma tahu di mana bedanya dan sepakat soal itu sejak awal. Bagian ini otomatis masuk ke cerita berdua.</p>
    <p class="dimtxt">Yang di bawah bukan berarti nggak penting buat kamu, cuma kalah prioritas waktu harus milih.</p>
    <button class="btn soft mini" id="nilaiUlang">Isi ulang</button>`;
  $("nilaiUlang").onclick = () => { valAns = {}; valDone = false; tabNilai(); };
}

/* ===== tim ===== */
function tim(code) {
  const draw = () => {
    if (!team.length) { $("timOut").innerHTML = `<p class="dimtxt">Belum ada yang tersimpan.</p>`; return; }
    const ada = h => team.some(t => t.code.replace("-", "").includes(h));
    const hilang = ["E", "I", "S", "N", "F", "J", "P"].filter(h => !ada(h));
    const tc = team.filter(t => t.code.endsWith("-T")).length;
    let jauh = null, jd = -1;
    for (let i = 0; i < team.length; i++) for (let j = i + 1; j < team.length; j++) {
      let d = 0; for (let k = 0; k < 4; k++) if (team[i].code[k] !== team[j].code[k]) d++;
      if (d > jd) { jd = d; jauh = [team[i], team[j]]; }
    }
    $("timOut").innerHTML = `<div class="kv"><b>Anggota</b><span>${team.map(t => esc(t.nama) + " (" + t.code + ")").join(", ")}</span></div>
      ${hilang.length ? `<div class="kv"><b>Belum ada</b><span>${hilang.join(", ")} — nggak ada yang bawa cara pandang ini ke diskusi.</span></div>` : `<div class="kv"><b>Sebaran</b><span>Semua sisi utama udah kewakili.</span></div>`}
      <div class="kv"><b>Ketenangan</b><span>${tc} dari ${team.length} tipe waspada. ${tc === 0 ? "Tim ini tenang, tapi berisiko kelewatan tanda bahaya kecil." : tc === team.length ? "Semua peka dan nuntut — mutunya tinggi, tapi tekanan gampang nular." : "Campuran gini biasanya sehat."}</span></div>
      ${jauh && jd >= 3 ? `<div class="kv"><b>Paling berjarak</b><span>${esc(jauh[0].nama)} dan ${esc(jauh[1].nama)} beda di ${jd} sumbu. Di situ salah paham paling gampang muncul — sekaligus paling saling melengkapi.</span></div>` : ""}
      <div class="row" style="margin-top:10px"><button class="btn soft mini" id="hapusTim">Kosongin daftar</button></div>`;
    $("hapusTim").onclick = async () => { team = []; await store.set("tim", team); draw(); };
  };
  $("addTim").onclick = async () => {
    const n = ($("nm").value || "Aku").trim();
    team = team.filter(t => t.nama !== n); team.push({ nama: n, code });
    await store.set("tim", team); $("nm").value = ""; draw();
  };
  draw();
}

/* ===== big five ===== */
function b5init(at) {
  if (b5done) return b5render(at);
  $("b5").innerHTML = `${BADGE.kuat}
    <p>Dua puluh pernyataan buat lima dimensi yang dukungan penelitiannya jauh lebih kuat. Yang terakhir saudara dekat huruf kelimamu.</p>
    <div id="b5list">${B5.map((it, i) => `<div class="b5row"><span>${it[2]}</span><div class="m5" data-i="${i}">
      ${[1, 2, 3, 4, 5].map(v => `<button data-v="${v}" aria-label="${v}"></button>`).join("")}</div></div>`).join("")}</div>
    <div class="ends" style="margin-top:8px"><span>kiri: nggak setuju</span><span>kanan: setuju</span></div>
    <button class="btn" id="b5go" style="margin-top:16px">Lihat hasilnya</button>`;
  $("b5list").querySelectorAll(".m5").forEach(g => g.querySelectorAll("button").forEach(b => b.onclick = () => {
    b5ans[g.dataset.i] = +b.dataset.v;
    g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  }));
  $("b5go").onclick = () => {
    if (Object.keys(b5ans).length < B5.length) { alert("Masih ada yang belum diisi."); return; }
    b5done = true; b5render(at);
  };
}
function b5render(at) {
  const s = {}, c = {};
  B5.forEach((it, i) => { const v = b5ans[i] || 3, x = it[1] > 0 ? v : 6 - v; s[it[0]] = (s[it[0]] || 0) + x; c[it[0]] = (c[it[0]] || 0) + 1; });
  const pc = k => Math.round(((s[k] / c[k]) - 1) / 4 * 100), tenang = 100 - pc("N"), santai = 100 - at.pr;
  const rows = [["O", pc("O")], ["C", pc("C")], ["E", pc("E")], ["A", pc("A")], ["S", tenang]];
  const col = { O: "#79D8B4", C: "#FFD07A", E: "#FFA36B", A: "#C4A2FF", S: "#8FB8FF" };
  $("b5").innerHTML = BADGE.kuat + rows.map(([k, v]) => `<div style="margin-bottom:16px">
    <div class="stat"><span class="lab">${B5N[k][0]}</span><span class="b"><i style="width:${v}%;background:${col[k]}"></i></span><span class="v">${v}</span></div>
    <p class="dimtxt" style="margin:0">${B5N[k][1]}</p></div>`).join("")
    + `<div class="sub">Saling cek</div><p>Sumbu kelima naruh kamu di <b>${santai}</b> ke arah santai; Ketenangan Big Five di <b>${tenang}</b>. ${Math.abs(santai - tenang) <= 15 ? "Dua-duanya sejalan — ini naikin keyakinan kalau bagian itu emang gambaran kamu." : "Dua-duanya lumayan beda. Biasanya itu berarti kamu tenang di sebagian hal dan peka banget di hal lain."}</p>
    <p class="dimtxt">Angka ini posisi relatif di skala jawabanmu sendiri, bukan peringkat sama orang lain, dan bukan alat diagnosis.</p>
    <button class="btn soft mini" id="b5ulang">Isi ulang</button>`;
  $("b5ulang").onclick = () => { b5ans = {}; b5done = false; b5init(at); };
}

/* ===== cek jujur ===== */
const UMUM = ["Ada sisi dirimu yang jarang kamu tunjukin ke orang lain.",
  "Kamu pengin disukai, tapi juga pengin dihargai karena kemampuanmu.",
  "Kadang kamu ragu apa keputusanmu udah benar."];
function cekJujur(ty, idn) {
  const khas = [ty.kuat[0], ty.kuat[2], ty.lemah[0], ty.motiv, ty.drain, ty.komun, ty.relasi, ty.voice[0], idn.kuat[0]];
  const list = shuffle([...khas.map(t => ({ t, u: 0 })), ...UMUM.map(t => ({ t, u: 1 }))]);
  const mk = new Set();
  $("barList").innerHTML = list.map((o, i) => `<div class="judge" id="b_${i}"><p>${o.t}</p><div class="row"><button data-i="${i}">Ini aku</button></div></div>`).join("");
  $("barList").querySelectorAll("button").forEach(b => b.onclick = () => {
    const i = +b.dataset.i, on = !mk.has(i);
    on ? mk.add(i) : mk.delete(i);
    $("b_" + i).classList.toggle("yes", on); b.setAttribute("aria-pressed", String(on));
  });
  $("barBtn").onclick = () => {
    const kh = [...mk].filter(i => !list[i].u).length, um = [...mk].filter(i => list[i].u).length;
    list.forEach((o, i) => { if (o.u && !$("b_" + i).querySelector(".tag"))
      $("b_" + i).insertAdjacentHTML("beforeend", '<span class="tag">kalimat yang cocok buat hampir semua orang</span>'); });
    $("barOut").innerHTML = `<div class="note"><b>Hasilnya</b>Kalimat khas kamu ditandai ${kh} dari 9. Kalimat umum ditandai ${um} dari 3.<br><br>${
      um >= 2 ? "Wajar — kalimat kayak gitu emang cocok buat hampir siapa pun. Artinya rasa \"kok pas banget\" bukan bukti kalau deskripsinya akurat."
      : um === 1 ? "Lumayan selektif. Tapi tetap inget, deskripsi kepribadian emang dirancang biar gampang disetujui."
      : "Kamu baca dengan kritis. Sekarang lihat lagi " + kh + " kalimat khas yang kamu tandai — itu bagian yang paling layak dipercaya."}</div>`;
  };
}

/* ===== riwayat ===== */
function riwayat() {
  if (hist.length < 2) {
    $("riw").innerHTML = `<p>Baru satu hasil yang tersimpan.</p>
      <p class="dimtxt">Isi lagi sekitar empat minggu lagi, atau isi versi konteks yang beda. Perbandingannya bakal muncul di sini.</p>`;
    return;
  }
  const rows = hist.slice().reverse().map(h => { const d = new Date(h.ts);
    return `<div class="kv"><b>${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}</b><span>${h.code} · versi ${h.ctx}</span></div>`; }).join("");
  const a = hist[hist.length - 2], b = hist[hist.length - 1];
  const geser = DK.map((k, i) => { const d = (b.pct[i] || 50) - (a.pct[i] || 50);
    return Math.abs(d) < 5 ? null : `${D[k].n}: ${d > 0 ? "lebih ke " + D[k].ln : "lebih ke " + D[k].rn} (${Math.abs(d)} poin)`; }).filter(Boolean);
  const kj = hist.filter(h => h.ctx === "kerja").pop(), rm = hist.filter(h => h.ctx === "rumah").pop();
  $("riw").innerHTML = rows + `<div class="sub">Dibanding hasil sebelumnya</div>
    ${geser.length ? `<ul>${geser.map(g => `<li>${g}</li>`).join("")}</ul><p class="dimtxt">Pergeseran kayak gini normal, dan justru nunjukin kenapa satu huruf nggak boleh dianggap identitas permanen.</p>` : `<p>Hampir nggak bergeser. Profilmu cukup stabil.</p>`}
    ${kj && rm ? `<div class="sub">Kantor vs rumah</div>
      <div class="kv"><b>Di kerja</b><span>${kj.code}</span></div><div class="kv"><b>Di rumah</b><span>${rm.code}</span></div>
      <p>${kj.code === rm.code ? "Kamu bawa diri yang sama ke dua tempat. Biasanya itu artinya kerjaanmu nggak nuntut kamu pura-pura."
        : kj.code.slice(0, 4) === rm.code.slice(0, 4) ? "Empat huruf pertamamu sama di dua tempat, tapi huruf ketenangannya beda. Caramu kerja nggak berubah, yang berubah seberapa tenang kamu ngejalaninnya — dan itu artinya lingkungannya, bukan kamu, yang nentuin."
        : "Ada selisih antara versi kerja dan versi rumahmu. Itu bukan kepalsuan — tapi kalau jaraknya besar dan lama, biasanya itu yang diam-diam bikin capek."}</p>` : ""}`;
}

/* ===== salin ringkasan ===== */
function salinRingkasan(code, base, ident, ty, idn, R) {
  const ya = Object.keys(curated).filter(k => curated[k]).length;
  const me = profilAktif();
  const t = ["POTRET — " + code + " (" + ty.nick + " · " + idn.nama + ")", ty.sum, ATT[base][ident === "A" ? 0 : 1], "",
    "KODE PROFIL: " + encodeProfil(me), "", "SUMBU",
    ...R.map(r => `${r.d.ln} ${r.pl}% / ${r.pr}% ${r.d.rn} → ${r.letter} (± ${r.ci}, ${r.n} soal)`),
    ...(attSkor ? ["", "KELEKATAN: " + LEKAT[gayaLekat(attSkor[0], attSkor[1])].nama + ` (cemas ${attSkor[0]}, hindar ${attSkor[1]})`] : []),
    ...(valTop ? ["NILAI TERATAS: " + valTop.map(v => VAL_DEF[v][0]).join(", ")] : []),
    "", "CARA MIKIR: " + ty.fn.join(" › "), "", "KEKUATAN", ...ty.kuat.map(x => "- " + x),
    "", "TITIK BUTA", ...ty.lemah.map(x => "- " + x),
    "", "SAAT CAPEK", "- " + ty.stres, "- " + idn.stres,
    "", "LANGKAH TUMBUH", ...ty.tumbuh.map(x => "- " + x), ...idn.tumbuh.map(x => "- " + x),
    "", "KERJA", ...ty.plus.map(x => "+ " + x), ...ty.minus.map(x => "- " + x),
    "Peran: " + ty.peran, "Kerja bareng kamu: " + ty.kolab,
    ya ? "\nKamu ngakuin " + ya + " kalimat potret sebagai beneran kamu." : "",
    "", "Bahan refleksi, bukan diagnosis atau alat seleksi."].join("\n");
  navigator.clipboard?.writeText(t).then(() => {
    $("salin").textContent = "Tersalin"; setTimeout(() => $("salin").textContent = "Salin ringkasan", 1800);
  }).catch(() => {
    $("fb").innerHTML = '<textarea readonly style="margin-top:12px"></textarea>';
    const a = $("fb").querySelector("textarea"); a.value = t; a.focus(); a.select();
  });
}

/* ===== lensa komunikasi ===== */
function tabKomun() {
  if (komDone) return komunHasil();
  $("komun").innerHTML = `${BADGE.reflektif}
    <p>Dua belas pernyataan soal caramu nyampein dan nerima. Hasilnya langsung dipakai di tab Berdua — gaya komunikasi biasanya sumber gesekan yang lebih sering kerasa sehari-hari daripada beda tipe.</p>
    <div id="komList">${KOMUN.map((it, i) => `<div class="b5row"><span>${it[1]}</span><div class="m5" data-i="${i}">
      ${[1, 2, 3, 4, 5].map(v => `<button data-v="${v}" aria-label="${v}"></button>`).join("")}</div></div>`).join("")}</div>
    <div class="ends" style="margin-top:8px"><span>kiri: nggak setuju</span><span>kanan: setuju</span></div>
    <button class="btn" id="komGo" style="margin-top:16px">Lihat hasilnya</button>`;
  $("komList").querySelectorAll(".m5").forEach(g => g.querySelectorAll("button").forEach(b => b.onclick = () => {
    komAns[g.dataset.i] = +b.dataset.v;
    g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  }));
  $("komGo").onclick = () => {
    if (Object.keys(komAns).length < KOMUN.length) { alert("Masih ada yang belum diisi."); return; }
    let sl = 0, nl = 0, sg = 0, ng = 0;
    KOMUN.forEach((it, i) => {
      const v = komAns[i] || 3;
      if (it[0] === "L") { sl += v; nl++; } else if (it[0] === "l") { sl += 6 - v; nl++; }
      else if (it[0] === "G") { sg += v; ng++; } else { sg += 6 - v; ng++; }
    });
    komSkor = [Math.round(((sl / nl) - 1) / 4 * 100), Math.round(((sg / ng) - 1) / 4 * 100)];
    komDone = true; komunHasil();
  };
}
function komunHasil() {
  const [lu, isi] = komSkor, g = gayaKomun(lu, isi), K = GAYA_KOMUN[g];
  $("komun").innerHTML = `${BADGE.reflektif}
    <h2 style="margin-bottom:2px">${K.nama}</h2><p>${K.sum}</p>
    <div class="stat"><span class="lab">Lugas</span><span class="b"><i style="width:${lu}%;background:#FFA36B"></i></span><span class="v">${lu}</span></div>
    <p class="dimtxt" style="margin:-4px 0 12px">Makin ke kanan, makin blak-blakan. Makin ke kiri, makin lewat kode.</p>
    <div class="stat"><span class="lab">Fokus ke isi</span><span class="b"><i style="width:${isi}%;background:#79D8B4"></i></span><span class="v">${isi}</span></div>
    <p class="dimtxt" style="margin:-4px 0 12px">Makin ke kanan, makin cepat ke pokok. Makin ke kiri, makin jaga suasana dulu.</p>
    <div class="sub">Yang jadi kekuatan</div><ul>${K.kuat.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Yang perlu dijaga</div><ul class="warn">${K.jaga.map(x => `<li>${x}</li>`).join("")}</ul>
    <div class="sub">Cara paling enak ngobrol sama kamu</div><p>${K.caranya}</p>
    <div class="sub">Yang bikin kamu langsung bertahan diri</div><p>${K.defensif}</p>
    <p class="dimtxt">Hasil ini otomatis masuk ke kode profilmu.</p>
    <button class="btn soft mini" id="komUlang">Isi ulang</button>`;
  $("komUlang").onclick = () => { komAns = {}; komDone = false; tabKomun(); };
}

/* ===== lensa enneagram ===== */
function tabEnnea() {
  if (ennDone) return ennHasil();
  $("ennea").innerHTML = `${BADGE.reflektif}
    <p>Delapan belas pernyataan buat ngelihat motif di balik kelakuanmu — bukan apa yang kamu lakuin, tapi kenapa.</p>
    <div class="note"><b>Ini penyaringan, bukan penentuan</b>Delapan belas soal terlalu sedikit buat mastiin tipe Enneagram. Yang keluar dua kandidat teratas, dan kamu sendiri yang mutusin mana yang kerasa benar. Kalau dua-duanya kerasa pas, itu wajar.</div>
    <div id="ennList">${ENNEA.map((it, i) => `<div class="b5row"><span>${it[1]}</span><div class="m5" data-i="${i}">
      ${[1, 2, 3, 4, 5].map(v => `<button data-v="${v}" aria-label="${v}"></button>`).join("")}</div></div>`).join("")}</div>
    <div class="ends" style="margin-top:8px"><span>kiri: nggak setuju</span><span>kanan: setuju</span></div>
    <button class="btn" id="ennGo" style="margin-top:16px">Lihat hasilnya</button>`;
  $("ennList").querySelectorAll(".m5").forEach(g => g.querySelectorAll("button").forEach(b => b.onclick = () => {
    ennAns[g.dataset.i] = +b.dataset.v;
    g.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  }));
  $("ennGo").onclick = () => {
    if (Object.keys(ennAns).length < ENNEA.length) { alert("Masih ada yang belum diisi."); return; }
    const s = {};
    ENNEA.forEach((it, i) => { s[it[0]] = (s[it[0]] || 0) + (ennAns[i] || 3); });
    const urut = Object.keys(s).map(k => [k, s[k]]).sort((a, b) => b[1] - a[1]);
    ennTop = urut[0][0]; ennKedua = urut[1][0];
    ennDone = true; ennHasil(urut);
  };
}
function ennHasil(urut) {
  const pilih = (k) => { ennTop = k; ennHasil(urut); };
  const A = ENNEA_DEF[ennTop], B = ENNEA_DEF[ennKedua];
  $("ennea").innerHTML = `${BADGE.reflektif}
    <h2 style="margin-bottom:2px">Tipe ${ennTop} — ${A[0]}</h2>
    <div class="kv"><b>Yang dikejar</b><span>${A[1]}</span></div>
    <div class="kv"><b>Yang ditakutin</b><span>${A[2]}</span></div>
    <div class="kv"><b>Saat tertekan</b><span>${A[3]}</span></div>
    <div class="kv"><b>Saat bertumbuh</b><span>${A[4]}</span></div>
    <div class="kv"><b>Di tempat kerja</b><span>${A[5]}</span></div>
    <div class="sub">Kandidat kedua: Tipe ${ennKedua} — ${B[0]}</div>
    <p>${B[1]}, dan ${B[2].toLowerCase()}. ${B[5]}</p>
    <div class="row"><button class="btn soft mini" id="tukar">Yang kedua lebih kerasa aku</button>
    <button class="btn soft mini" id="ennUlang">Isi ulang</button></div>
    <p class="dimtxt" style="margin-top:14px">Enneagram punya dukungan penelitian yang lebih lemah daripada Big Five atau kelekatan. Pakai buat bahan refleksi soal motif, bukan buat mastiin siapa dirimu.</p>`;
  $("tukar").onclick = () => { const t = ennTop; ennTop = ennKedua; ennKedua = t; ennHasil(urut); };
  $("ennUlang").onclick = () => { ennAns = {}; ennDone = false; ennTop = null; tabEnnea(); };
}

/* ===== kartu berbagi ===== */
function tabKartu(R, base, ident, ty, idn, code) {
  const p = { R, base, ident, code, ty, idn,
    gaya: attSkor ? gayaLekat(attSkor[0], attSkor[1]) : null,
    komunGaya: komSkor ? gayaKomun(komSkor[0], komSkor[1]) : null };
  const pilihan = kalimatKartu(p);
  const opsi = { tema: "senja", kalimat: pilihan[0], sertakanKode: true, kode: encodeProfil(profilAktif()) };

  $("kartu").innerHTML = `
    <p>Kartu buat dibagikan. Kamu yang milih kalimat mana yang boleh nempel — sisanya tetap tinggal di perangkatmu.</p>
    <div style="border:1px solid var(--line);border-radius:16px;overflow:hidden;margin-bottom:14px">
      <canvas id="cv" style="width:100%;display:block"></canvas></div>
    <div class="sub">Tema</div><div class="seg" id="temaSeg">
      ${Object.keys(TEMA).map((k, i) => `<button data-k="${k}" aria-pressed="${i === 0}">${TEMA[k].nama}</button>`).join("")}</div>
    <div class="sub">Kalimat yang ikut</div>
    <div class="pick" id="kalPick">${pilihan.map((k, i) => `<button data-i="${i}" aria-pressed="${i === 0}">
      <span><strong>${k.label}</strong><span>${k.teks ? k.teks.slice(0, 70) + (k.teks.length > 70 ? "…" : "") : "Kartu tanpa kutipan"}</span></span></button>`).join("")}</div>
    <div class="seg" id="kodeSeg">
      <button data-v="1" aria-pressed="true">Sertakan kode profil</button>
      <button data-v="0" aria-pressed="false">Tanpa kode</button></div>
    <p class="dimtxt">Kode profil bikin temanmu bisa langsung lihat cerita kalian berdua. Kode itu cuma berisi skor lima sumbu dan lensa yang udah kamu isi — nggak ada nama, tanggal, atau jawaban mentahmu.</p>
    <div class="row"><button class="btn soft mini" id="unduh">Unduh PNG</button></div>
    <p class="dimtxt" id="unduhInfo" style="margin-top:10px">Di HP, bisa juga tekan lama gambarnya buat simpan.</p>`;

  const cv = $("cv");
  const gambar = () => gambarKartu(cv, p, opsi);
  gambar();
  $("temaSeg").onclick = e => { const b = e.target.closest("button"); if (!b) return;
    opsi.tema = b.dataset.k;
    [...$("temaSeg").children].forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    gambar(); };
  $("kalPick").onclick = e => { const b = e.target.closest("button"); if (!b) return;
    opsi.kalimat = pilihan[+b.dataset.i];
    [...$("kalPick").children].forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    gambar(); };
  $("kodeSeg").onclick = e => { const b = e.target.closest("button"); if (!b) return;
    opsi.sertakanKode = b.dataset.v === "1";
    [...$("kodeSeg").children].forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    gambar(); };
  $("unduh").onclick = async () => {
    const ok = await unduhKartu(cv, "lima-sumbu-" + code);
    $("unduhInfo").textContent = ok ? "Kartu kesimpan. Cek folder unduhan." : "Unduhan diblokir browser. Tekan lama gambarnya buat simpan.";
  };
}

/* ===== bagian hiburan ===== */
function tabFun() {
  $("fun").innerHTML = `<span class="badge fun">Hiburan</span>
    <div class="note" style="border-color:var(--jp);background:rgba(255,208,122,.08)">
      <b style="color:var(--jp)">Bagian ini sengaja dipisah</b>Astrologi nggak punya dukungan bukti sebagai alat ukur kepribadian, jadi hasilnya nggak dipakai di mana pun: nggak di ceritamu, nggak di analisis berdua, dan nggak masuk kode profil. Anggap ini bumbu, bukan bahan.</div>
    <p>Kalau tetap penasaran, isi tanggal lahirmu. Tahunnya nggak perlu.</p>
    <div class="row" style="margin-bottom:12px">
      <input type="text" id="tglLahir" placeholder="Tanggal (1-31)" style="flex:1;min-width:120px">
      <input type="text" id="blnLahir" placeholder="Bulan (1-12)" style="flex:1;min-width:120px">
      <button class="btn soft mini" id="zodGo">Lihat</button></div>
    <div id="zodOut"></div>`;
  $("zodGo").onclick = () => {
    const d = parseInt($("tglLahir").value, 10), m = parseInt($("blnLahir").value, 10);
    if (!(d >= 1 && d <= 31 && m >= 1 && m <= 12)) {
      $("zodOut").innerHTML = `<p class="dimtxt">Tanggalnya belum kebaca. Isi angka aja, misalnya 17 dan 8.</p>`; return;
    }
    const z = zodiakDari(m, d);
    $("zodOut").innerHTML = `<h2 style="margin-bottom:2px">${z.nama}</h2>
      <p class="dimtxt">Elemen ${z.elemen}</p><p>${z.teks}</p><p class="dimtxt">${ELEMEN_TEKS[z.elemen]}</p>
      <p class="dimtxt">Kalau kalimat di atas kerasa pas, coba baca juga kalimat zodiak lain — biasanya sama pasnya. Itu efek yang sama persis kayak yang diuji di tab Cek Jujur.</p>`;
  };
}
