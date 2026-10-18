const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---- profile ----
document.title = `${PROFILE.name} — ${PROFILE.role}`;
$("navName").textContent = PROFILE.name;
$("footName").textContent = PROFILE.name;
$("year").textContent = new Date().getFullYear();
$("heroWord").textContent = PROFILE.heroWord || "Portfolio";

// parallax ตามเมาส์ (ฉากหลังกับตัวหนังสือขยับสวนกัน)
const hero = document.querySelector(".hero");
hero.addEventListener("mousemove", (e) => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty("--px", `${((e.clientX - r.left) / r.width - 0.5) * -18}px`);
  hero.style.setProperty("--py", `${((e.clientY - r.top) / r.height - 0.5) * -12}px`);
});
$("heroName").textContent = `${PROFILE.name} — ${PROFILE.role}`;
$("heroTagline").textContent = PROFILE.tagline;
$("aboutText").textContent = PROFILE.about;
$("nameTh").textContent = PROFILE.fullNameTh || "";
$("nameEn").textContent = PROFILE.fullNameEn || "";
$("stats").innerHTML = PROFILE.stats.map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("");
$("brands").innerHTML = (PROFILE.brands || []).map((b) => `<span>${esc(b)}</span>`).join("");
$("services-list").innerHTML = PROFILE.services
  .map((s, i) => `<div class="service"><b>0${i + 1}</b><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></div>`)
  .join("");

// รูปโปรไฟล์ + ป้ายโปรแกรมลอยรอบรูป
if (PROFILE.photo) {
  $("portrait").classList.add("has-photo");
  $("portrait").insertAdjacentHTML("afterbegin", `<img class="cutout" src="${esc(PROFILE.photo)}" alt="${esc(PROFILE.name)}">`);
}
// ซ่อนส่วนที่ยังไม่มีข้อมูลจริง
if (!PROFILE.stats?.length) $("stats").hidden = true;
if (!PROFILE.brands?.length) $("brandsSection").hidden = true;
// ตำแหน่งป้ายลอย (เลี่ยงใบหน้า: ซ้าย-กลางรูป) — ไว้มุมขวาบน ขอบขวา และบริเวณเสื้อด้านล่าง
const spots = [["70%", "3%"], ["80%", "56%"], ["-2%", "86%"], ["50%", "92%"], ["84%", "20%"], ["-12%", "6%"]];
$("orbit").innerHTML = PROFILE.tools
  .slice(0, spots.length)
  .map((t, i) => `<span style="left:${spots[i][0]};top:${spots[i][1]};animation-delay:${-i * 0.8}s">${esc(t)}</span>`)
  .join("");

const c = PROFILE.contact;
$("contactList").innerHTML = [
  c.email && `<a href="mailto:${esc(c.email)}"><small>Email</small>${esc(c.email)}</a>`,
  c.line && `<a href="https://line.me/ti/p/~${encodeURIComponent(c.line)}" target="_blank" rel="noopener"><small>LINE</small>${esc(c.line)}</a>`,
  c.instagram && `<a href="${esc(c.instagram)}" target="_blank" rel="noopener"><small>Instagram</small>เปิดโปรไฟล์</a>`,
  c.youtube && `<a href="${esc(c.youtube)}" target="_blank" rel="noopener"><small>YouTube</small>เปิดช่อง</a>`,
].filter(Boolean).join("");

// ---- works ----
const gradients = [
  "linear-gradient(160deg,#050403,#e0743a)",
  "linear-gradient(160deg,#120a06,#a8481f)",
  "linear-gradient(160deg,#000,#f09a5c)",
  "linear-gradient(160deg,#1a0c06,#c8581f)",
  "linear-gradient(160deg,#050403,#8a3d1c)",
  "linear-gradient(160deg,#0d0806,#e8864a)",
];

// รูปปก: ใส่ลงพื้นหลังตอนการ์ดเลื่อนเข้าใกล้จอเท่านั้น (47 ใบไม่โหลดพร้อมกัน)
function thumbUrl(w) {
  if (w.thumb) return w.thumb;
  if (w.type === "youtube") return `https://img.youtube.com/vi/${w.src}/hqdefault.jpg`;
  return "";
}
// Wistia: ถามภาพปก "ล่าสุด" จาก Wistia ทุกครั้งที่เปิดหน้า (เปลี่ยน poster บน Wistia แล้วเว็บตามเอง)
// ถ้าถามไม่สำเร็จ (ออฟไลน์/ถูกบล็อก) ใช้ลิงก์ thumb ที่เก็บไว้ใน works.js แทน
const liveThumbs = {};
function liveThumb(w) {
  if (w.type !== "wistia") return Promise.resolve(null);
  return (liveThumbs[w.src] ??= fetch(`https://fast.wistia.com/oembed?url=${encodeURIComponent("https://home.wistia.com/medias/" + w.src)}`)
    .then((r) => r.json())
    .then((d) => d.thumbnail_url.replace(/image_crop_resized=\d+x\d+/, `image_crop_resized=${w.vertical ? "360x640" : "480x270"}`))
    .catch(() => null));
}
const lazyThumbs = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    const el = e.target;
    lazyThumbs.unobserve(el);
    const setBg = (u) => { if (u && !el.classList.contains("live")) el.style.backgroundImage = `url('${u}'),${el.dataset.g}`; };
    const saved = el.dataset.thumb;
    setBg(saved); // โชว์ภาพที่เก็บไว้ทันที แล้วสลับเฉพาะเมื่อ Wistia มีภาพใหม่กว่า (ภาพเดิมจะไม่กะพริบ)
    liveThumb(WORKS[+el.dataset.i]).then((live) => { if (live && live !== saved) setBg(live); });
  }
}, { rootMargin: "600px 400px" });

const allClients = [...new Set(WORKS.map((w) => w.client))];
let active = "ทั้งหมด";

function renderFilters() {
  $("filters").innerHTML = ["ทั้งหมด", ...allClients]
    .map((k) => `<button class="${k === active ? "on" : ""}" data-k="${esc(k)}">${esc(k)}</button>`)
    .join("");
}

function postLink(w) {
  const host = w.post ? new URL(w.post, location.href).hostname : "";
  if (!/(^|\.)(instagram|facebook|tiktok|youtube)\.com$|(^|\.)fb\.watch$/.test(host)) return "";
  const site = /instagram/.test(host) ? "Instagram" : /tiktok/.test(host) ? "TikTok" : /youtube/.test(host) ? "YouTube" : "Facebook";
  return `<a class="post-link" href="${esc(w.post)}" target="_blank" rel="noopener">ดูโพสต์จริงบน ${site}${w.stats ? " · " + esc(w.stats) : ""} ↗</a>`;
}

const fmtDur = (s) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = Math.round(s % 60);
  return (h ? `${h}:${String(m).padStart(2, "0")}` : `${m}`) + `:${String(r).padStart(2, "0")}`;
};

function reelHtml(w, i) {
  return `
    <div class="reel-item${w.vertical ? "" : " wide"}">
      <article class="reel" data-i="${i}" tabindex="0" role="button" aria-label="เล่น ${esc(w.title)}" data-thumb="${esc(thumbUrl(w))}" data-g="${gradients[i % gradients.length]}" style="background-image:${gradients[i % gradients.length]}">
        <span class="play"></span>${w.dur ? `<span class="dur">${fmtDur(w.dur)}</span>` : ""}<h3>${esc(w.title)}</h3>
      </article>
      ${postLink(w)}
    </div>`;
}

// ลูกค้า → รายการ → คลิป (เรียงตามลำดับใน works.js)
function renderWorks() {
  stopLive();
  const shown = allClients.filter((c) => active === "ทั้งหมด" || c === active);
  $("clients").innerHTML = shown.map((client) => {
    const items = WORKS.map((w, i) => ({ w, i })).filter(({ w }) => w.client === client);
    const programs = [...new Set(items.map(({ w }) => w.program || ""))];
    return `
      <section class="client">
        <header class="client-head"><h3>${esc(client)}</h3><span>${items.length} คลิป</span></header>
        ${programs.map((p) => `
          ${p ? `<p class="program">${esc(p)}</p>` : ""}
          <div class="reels">${items.filter(({ w }) => (w.program || "") === p).map(({ w, i }) => reelHtml(w, i)).join("")}</div>`).join("")}
      </section>`;
  }).join("");
  $("clients").querySelectorAll(".reel[data-thumb]").forEach((el) => lazyThumbs.observe(el));
}

$("workSummary").textContent = `${WORKS.length} คลิป · ${allClients.length} ลูกค้า`;
$("filters").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  active = b.dataset.k;
  renderFilters();
  renderWorks();
});

// ---- เล่นในที่เดิม (ไม่มี popup) ----
function embed(w) {
  if (w.type === "youtube")
    return `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(w.src)}?autoplay=1&rel=0&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="${esc(w.title)}"></iframe>`;
  if (w.type === "vimeo")
    return `<iframe src="https://player.vimeo.com/video/${encodeURIComponent(w.src)}?${w.hash ? `h=${encodeURIComponent(w.hash)}&` : ""}autoplay=1&playsinline=1&dnt=1&title=0&byline=0&portrait=0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${esc(w.title)}"></iframe>`;
  if (w.type === "drive") // src = ID ไฟล์ใน Drive (ต้องตั้งแชร์เป็น "ทุกคนที่มีลิงก์")
    return `<iframe src="https://drive.google.com/file/d/${encodeURIComponent(w.src)}/preview" allow="autoplay" allowfullscreen title="${esc(w.title)}"></iframe>`;
  if (w.type === "wistia") // src = media-id (เช่น 6ix7bych3k)
    return `<wistia-player media-id="${esc(w.src)}" aspect="${w.vertical ? 0.5625 : 1.7778}" autoplay="true"></wistia-player>`;
  return `<video src="${esc(w.src)}" controls autoplay playsinline></video>`;
}

// Wistia: สคริปต์ที่แทรกผ่าน innerHTML ไม่ทำงาน จึงโหลดด้วย DOM เองครั้งเดียวต่อสคริปต์
const loadedScripts = {};
const loadScript = (src, module) =>
  (loadedScripts[src] ??= new Promise((ok, fail) => {
    const s = document.createElement("script");
    s.src = src; s.async = true;
    if (module) s.type = "module";
    s.onload = ok; s.onerror = fail;
    document.head.appendChild(s);
  }));

let vimeoApi;
const loadVimeoApi = () =>
  (vimeoApi ??= new Promise((ok, fail) => {
    if (window.Vimeo) return ok();
    const s = document.createElement("script");
    s.src = "https://player.vimeo.com/api/player.js";
    s.onload = ok; s.onerror = fail;
    document.head.appendChild(s);
  }));

// สั่งเล่นทันที: ถ้าเบราว์เซอร์ไม่ให้เล่นพร้อมเสียง ให้เล่นแบบปิดเสียง (กดเปิดเสียงเองได้) แทนที่จะค้างหยุดอยู่
function startPlayback(host) {
  const media = host.querySelector("iframe, video, wistia-player");
  if (!media) return;
  if (media.tagName === "WISTIA-PLAYER") {
    const id = media.getAttribute("media-id");
    Promise.all([loadScript("https://fast.wistia.com/player.js"), loadScript(`https://fast.wistia.com/embed/${encodeURIComponent(id)}.js`, true)])
      .then(() => customElements.whenDefined("wistia-player"))
      .then(() => setTimeout(() => {
        // ถ้า autoplay พร้อมเสียงถูกบล็อก ให้ลองเล่นแบบปิดเสียง
        try { Promise.resolve(media.play?.()).catch(() => { media.muted = true; media.play?.(); }); } catch {}
      }, 400))
      .catch(() => {});
  } else if (media.tagName === "VIDEO") {
    media.play().catch(() => { media.muted = true; media.play().catch(() => {}); });
  } else if (/player\.vimeo\.com/.test(media.src)) {
    loadVimeoApi().then(() => {
      const p = new Vimeo.Player(media);
      p.play().catch(() => p.setMuted(true).then(() => p.play()).catch(() => {}));
    }).catch(() => {});
  }
}

let live = null;
function stopLive() {
  if (!live) return;
  live.host.classList.remove("live");
  live.host.innerHTML = live.html; // คืนภาพปก + หยุดวิดีโอ
  live.item?.classList.remove("playing");
  live = null;
}

function playInline(w, el) {
  stopLive();
  const host = el;
  live = { host, html: host.innerHTML, item: el.closest(".reel-item") };
  host.classList.add("live");
  live.item?.classList.add("playing");
  host.innerHTML = `${embed(w)}<button class="stop" type="button" aria-label="ปิดวิดีโอ">×</button>`;
  startPlayback(host);
  centerOn(el);
}

// เลื่อนให้คลิปอยู่กลางจอ — การ์ดขยายทันที (ไม่มีแอนิเมชันขนาด) จึงอ่านตำแหน่งจริงหลังจัดแถวใหม่ได้เลย
function centerOn(el) {
  const target = live?.item || el;
  const r = target.getBoundingClientRect();
  const media = target.querySelector(".reel") || target;
  const h = media.getBoundingClientRect().height; // ไม่รวมลิงก์โพสต์ใต้การ์ด
  scrollTo({ top: Math.max(0, r.top + scrollY + h / 2 - innerHeight / 2), behavior: "smooth" });
}

function onActivate(e) {
  if (e.target.closest(".stop")) { stopLive(); return; }
  if (e.target.closest("a")) return;
  const el = e.target.closest("[data-i]");
  if (!el || (live && (live.host === el || el.contains(live.host)))) return;
  playInline(WORKS[+el.dataset.i], el);
}
for (const id of ["clients"]) {
  $(id).addEventListener("click", onActivate);
  $(id).addEventListener("keydown", (e) => {
    if (e.key === "Escape") return stopLive();
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-i]")) { e.preventDefault(); onActivate(e); }
  });
}
document.addEventListener("keydown", (e) => { if (e.key === "Escape") stopLive(); });

// เล่นคลิปตามลำดับใน WORKS: เปิดตัวกรองให้เห็นคลิปนั้น แล้วเล่นที่การ์ด (เลื่อนไปกลางจอให้เองใน playInline)
function playWork(i) {
  if (active !== "ทั้งหมด" && active !== WORKS[i].client) { active = "ทั้งหมด"; renderFilters(); renderWorks(); }
  const el = document.querySelector(`#clients [data-i="${i}"]`);
  if (el) playInline(WORKS[i], el);
}

// ปุ่ม Play reel กลางหน้าแรก (คลิปที่ตั้ง showreel: true ไม่งั้นคลิปแรกสุด)
$("orb").addEventListener("click", () => {
  const i = WORKS.findIndex((w) => w.showreel);
  playWork(i < 0 ? 0 : i);
});

// ---- Highlights: แกลเลอรีสุ่มเลื่อนวน (ซ้ายขึ้น · กลางลง · ขวาขึ้น …) ----
function buildGallery() {
  const COLS = 5, PER = 6; // จอแคบแสดง 3 คอลัมน์แรก (ซ่อนที่เหลือด้วย CSS)
  const pool = WORKS.map((w, i) => ({ w, i })).filter(({ w }) => w.vertical && thumbUrl(w));
  if (!pool.length) { $("highlights").hidden = true; return; }
  for (let k = pool.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [pool[k], pool[j]] = [pool[j], pool[k]]; }
  const picks = pool.slice(0, COLS * PER);
  while (picks.length < COLS * PER) picks.push(pool[picks.length % pool.length]);
  const ratios = ["3 / 4", "1 / 1", "4 / 5", "9 / 16", "3 / 4", "4 / 5"];
  const durs = [46, 58, 52, 62, 50];
  const tile = ({ w, i }, k, c, copy) => `
    <figure class="g-tile" data-i="${i}" ${copy ? 'aria-hidden="true"' : `tabindex="0" role="button" aria-label="เล่น ${esc(w.title)}"`} style="aspect-ratio:${ratios[(k + c * 2) % ratios.length]}">
      <img src="${esc(thumbUrl(w))}" alt="" loading="lazy" decoding="async">
      <figcaption><span>${esc(w.client)}</span>${esc(w.title)}</figcaption>
    </figure>`;
  $("galleryGrid").innerHTML = Array.from({ length: COLS }, (_, c) => {
    const col = picks.filter((_, k) => k % COLS === c);
    const set = (copy) => col.map((p, k) => tile(p, k, c, copy)).join("");
    return `<div class="g-col"><div class="g-track ${c % 2 ? "down" : "up"}" style="--dur:${durs[c]}s">${set(false)}${set(true)}</div></div>`;
  }).join("");
  // ภาพปกล่าสุดจาก Wistia: ถ้าตั้งภาพปกใหม่บน Wistia ไว้ ให้สลับเป็นภาพนั้น (ภาพเดิมไม่กะพริบถ้ายังไม่เปลี่ยน)
  for (const { w, i } of new Map(picks.map((p) => [p.i, p])).values()) {
    liveThumb(w).then((live) => {
      if (live && live !== thumbUrl(w)) $("galleryGrid").querySelectorAll(`.g-tile[data-i="${i}"] img`).forEach((img) => { img.src = live; });
    });
  }
}
$("galleryGrid").addEventListener("click", (e) => {
  const t = e.target.closest(".g-tile");
  if (t) playWork(+t.dataset.i);
});
$("galleryGrid").addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches(".g-tile[tabindex]")) { e.preventDefault(); playWork(+e.target.dataset.i); }
});
buildGallery();

renderFilters();
renderWorks();
