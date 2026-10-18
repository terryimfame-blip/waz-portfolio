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
// สถิติ: ใช้ที่ตั้งเองใน works.js ถ้าไม่มี คำนวณจากข้อมูลจริงในพอร์ต (จำนวนคลิป/ลูกค้า)
const statsList = PROFILE.stats?.length ? PROFILE.stats : [
  { value: WORKS.length, label: "คลิปในพอร์ต" },
  { value: new Set(WORKS.map((w) => w.client)).size, label: "ลูกค้า" },
];
$("stats").innerHTML = statsList.map((s) => `<div><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("");
$("brands").innerHTML = (PROFILE.brands || []).map((b) => `<span>${esc(b)}</span>`).join("");
$("services-list").innerHTML = PROFILE.services
  .map((s, i) => `<div class="service"><b>0${i + 1}</b><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></div>`)
  .join("");

$("processList").innerHTML = (PROFILE.process || []).map((p) => `<li>${p.icon ? `<img class="step-ico" src="${esc(p.icon)}" alt="" loading="lazy" decoding="async">` : ""}<h4>${esc(p.title)}</h4><p>${esc(p.desc)}</p></li>`).join("");
if (!PROFILE.process?.length) { $("processList").hidden = true; $("processTitle").hidden = true; }

// รูปโปรไฟล์ + ป้ายโปรแกรมลอยรอบรูป
if (PROFILE.photo) {
  $("portrait").classList.add("has-photo");
  $("portrait").insertAdjacentHTML("afterbegin", `<img class="cutout" src="${esc(PROFILE.photo)}" alt="${esc(PROFILE.name)}">`);
}
// ซ่อนส่วนที่ยังไม่มีข้อมูลจริง
if (!PROFILE.brands?.length) $("brandsSection").hidden = true;
// ตำแหน่งป้ายลอย (เลี่ยงใบหน้า: ซ้าย-กลางรูป) — ไว้มุมขวาบน ขอบขวา และบริเวณเสื้อด้านล่าง
// จอแคบ: ป้ายต้องอยู่ในกรอบรูป ไม่ยื่นออกนอกขอบจอ
const spots = matchMedia("(max-width: 760px)").matches
  ? [["56%", "3%"], ["54%", "58%"], ["2%", "86%"], ["50%", "92%"], ["56%", "20%"], ["2%", "6%"]]
  : [["70%", "3%"], ["80%", "56%"], ["-2%", "86%"], ["50%", "92%"], ["84%", "20%"], ["-12%", "6%"]];
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

const allClients = [...new Set([...(PROFILE.clientOrder || []), ...WORKS.map((w) => w.client)])].filter((c) => WORKS.some((w) => w.client === c));
let active = "ทั้งหมด";

function renderFilters() {
  const count = (k) => (k === "ทั้งหมด" ? WORKS.length : WORKS.filter((w) => w.client === k).length);
  $("filters").innerHTML = ["ทั้งหมด", ...allClients]
    .map((k) => `<button class="chip${k === active ? " on" : ""}" data-k="${esc(k)}" aria-pressed="${k === active}"><span>${esc(k)}</span><b>${count(k)}</b></button>`)
    .join("");
  // มือถือ: เลื่อนแถบให้ลูกค้าที่เลือกอยู่กลางแถบ
  const on = $("filters").querySelector(".on");
  if (on) $("filters").scrollTo({ left: on.offsetLeft - ($("filters").clientWidth - on.offsetWidth) / 2, behavior: "smooth" });
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

// 1234 → 1.2K · 21885 → 21.9K · 46618 → 46.6K · 1250000 → 1.3M
const fmtViews = (n) => {
  const f = (v, d) => v.toFixed(d).replace(/\.0$/, "");
  return n >= 1e6 ? f(n / 1e6, 1) + "M" : n >= 1e3 ? f(n / 1e3, n < 1e5 ? 1 : 0) + "K" : String(n);
};

function reelHtml(w, i) {
  return `
    <div class="reel-item${w.vertical ? "" : " wide"}">
      <article class="reel" data-i="${i}" tabindex="0" role="button" aria-label="เล่น ${esc(w.title)}" data-thumb="${esc(thumbUrl(w))}" data-g="${gradients[i % gradients.length]}" style="background-image:${gradients[i % gradients.length]}">
        <span class="play"></span>${w.dur ? `<span class="dur">${fmtDur(w.dur)}</span>` : ""}${w.tag ? `<span class="tag-ai">${esc(w.tag)}</span>` : ""}${w.bts?.length ? `<button class="bts-btn" type="button" aria-label="ดูเบื้องหลังการตัดต่อ">BTS</button>` : ""}${w.views != null ? `<span class="views" title="ยอดวิวบน YouTube ณ ${esc(VIEWS_AS_OF)}">${fmtViews(w.views)} views</span>` : ""}<h3>${esc(w.title)}</h3>
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
      <section class="client reveal${PROFILE.clientNotes?.[client] ? " spot" : ""}">
        <header class="client-head"><h3>${esc(client)}</h3>${PROFILE.clientNotes?.[client]?.badge ? `<span class="client-badge">${esc(PROFILE.clientNotes[client].badge)}</span>` : ""}<span>${items.length} คลิป</span></header>
        ${PROFILE.clientNotes?.[client]?.text ? `<p class="client-note">${esc(PROFILE.clientNotes[client].text)}</p>` : ""}
        ${programs.map((p) => `
          ${p ? `<p class="program">${esc(p)}</p>` : ""}
          <div class="reels">${items.filter(({ w }) => (w.program || "") === p).map(({ w, i }) => reelHtml(w, i)).join("")}</div>`).join("")}
      </section>`;
  }).join("");
  $("clients").querySelectorAll(".reel[data-thumb]").forEach((el) => lazyThumbs.observe(el));
  observeReveals($("clients"));
}

$("workSummary").textContent = `${WORKS.length} คลิป · ${allClients.length} ลูกค้า — เลือกดูตามลูกค้าด้านล่าง`;
$("filters").addEventListener("click", (e) => {
  const b = e.target.closest(".chip");
  if (!b) return;
  active = b.dataset.k;
  renderFilters();
  renderWorks();
  history.replaceState(null, "", active === "ทั้งหมด" ? location.pathname + location.search : "#client=" + encodeURIComponent(active));
});

// ---- เล่นในที่เดิม (ไม่มี popup) ----
function embed(w) {
  if (w.type === "youtube")
    return `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(w.src)}?autoplay=1&rel=0&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen title="${esc(w.title)}"></iframe>`;
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
// ตำแหน่งเลื่อนก่อนเล่นจากแกลเลอรี Highlights — กด X แล้วกลับไปตรงนั้น (เล่นจากรายการผลงานไม่ต้องกลับ)
let backTo = null;
function closeLive() { const b = backTo; stopLive(); if (b != null) scrollTo({ top: b, behavior: "smooth" }); }
function stopLive() {
  backTo = null;
  if (!live) return;
  live.host.classList.remove("live", "bts");
  live.host.innerHTML = live.html; // คืนภาพปก + หยุดวิดีโอ
  live.item?.classList.remove("playing", "bts-open");
  live.card?.classList.remove("playing");
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
  let top = r.top + scrollY + h / 2 - innerHeight / 2;       // ปกติ: ให้อยู่กลางจอ
  if (h > innerHeight - 110) top = r.top + scrollY - 90;      // สูงเกินจอ: ชิดใต้เมนู ไม่ให้ส่วนบนโดนตัด
  scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

// BTS: สลับการ์ดเป็นภาพเบื้องหลังการตัดต่อ (เช่น ไทม์ไลน์ Premiere) ในที่เดิม ดูหลายภาพได้ ปิดแล้วกลับเป็นการ์ดเดิม
function showBts(w, el) {
  stopLive();
  live = { host: el, html: el.innerHTML, item: el.closest(".reel-item") };
  el.classList.add("live", "bts");
  live.item?.classList.add("playing", "bts-open"); // BTS: ขยายเต็มแถว ให้ไทม์ไลน์อ่านง่าย
  const st = { k: 0 };
  const draw = () => {
    el.innerHTML = `<img class="bts-img" src="${esc(w.bts[st.k])}" alt="เบื้องหลังการตัดต่อ ${esc(w.title)}">
      <div class="bts-bar"><span>BEHIND THE EDIT · ${st.k + 1}/${w.bts.length}</span>${w.bts.length > 1 ? '<button class="bts-next" type="button">NEXT ›</button>' : ""}</div>
      <button class="stop" type="button" aria-label="ปิด">×</button>`;
  };
  st.next = () => { st.k = (st.k + 1) % w.bts.length; draw(); };
  live.bts = st;
  draw();
  centerOn(el);
}

function onActivate(e) {
  if (e.target.closest(".stop")) { closeLive(); return; }
  if (e.target.closest("a")) return;
  if (e.target.closest(".bts-next")) { live?.bts?.next(); return; }
  const el = e.target.closest("[data-i]");
  if (e.target.closest(".bts-btn") && el) { showBts(WORKS[+el.dataset.i], el); return; }
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
function playWork(i, fromGallery) {
  const y = scrollY;
  if (active !== "ทั้งหมด" && active !== WORKS[i].client) { active = "ทั้งหมด"; renderFilters(); renderWorks(); }
  const el = document.querySelector(`#clients [data-i="${i}"]`);
  if (el) { playInline(WORKS[i], el); if (fromGallery) backTo = y; }
}

// ปุ่ม Play reel กลางหน้าแรก: เล่นคลิปที่ตั้ง showreel: true ไม่งั้นคลิปแรกสุด
$("orb").addEventListener("click", () => {
  const i = WORKS.findIndex((w) => w.showreel);
  playWork(i < 0 ? 0 : i);
});

// ---- บล็อกเด่น (เช่น ตัดต่อเอง ผสมคลิปที่สร้างด้วย AI) — ภาพปกล่าสุดจาก Wistia กดแล้วเล่นในที่เดิม ----
(function initFeatured() {
  const f = PROFILE.featured;
  if (!f?.items?.length) return;
  $("featBadge").textContent = f.badge || "";
  $("featBadge").hidden = !f.badge;
  $("featTitle").textContent = f.title || "";
  $("featDesc").textContent = f.desc || "";
  $("featDesc").hidden = !f.desc;
  $("featLink").hidden = true;
  $("featFrames").innerHTML = f.items.map((it, k) => `
    <figure class="feat-card">
      <div class="feat-frame" data-fi="${k}" role="button" tabindex="0" aria-label="เล่น ${esc(it.label || "")}">
        <span class="feat-play"></span>
      </div>
      ${it.label ? `<figcaption>${esc(it.label)}</figcaption>` : ""}
    </figure>`).join("");
  f.items.forEach((it, k) => { // ภาพปก: ถามภาพล่าสุดจาก Wistia (คลิปอื่นใช้ภาพที่ตั้งไว้)
    const el = $("featFrames").querySelector(`[data-fi="${k}"]`);
    const set = (u) => { if (u && !el.classList.contains("live")) el.style.backgroundImage = `url('${u}')`; };
    liveThumb({ ...it, vertical: true }).then((u) => set(u && u.replace("360x640", "540x960") || it.thumb));
  });
  $("featured").hidden = false;
  $("featured").querySelectorAll(".featured-text > *, .feat-card").forEach((el) => el.classList.add("reveal"));
})();
function playFeatured(frame) {
  if (frame.classList.contains("live")) return;
  const it = PROFILE.featured.items[+frame.dataset.fi];
  stopLive();
  live = { host: frame, html: frame.innerHTML, item: null, card: frame.closest(".feat-card") };
  live.card?.classList.add("playing");
  frame.classList.add("live");
  frame.innerHTML = `${embed({ ...it, title: it.label || "", vertical: true })}<button class="stop" type="button" aria-label="ปิดวิดีโอ">×</button>`;
  startPlayback(frame);
  centerOn(frame);
}
$("featFrames").addEventListener("click", (e) => { const fr = e.target.closest(".feat-frame"); if (e.target.closest(".stop")) closeLive(); else if (fr) playFeatured(fr); });
$("featFrames").addEventListener("keydown", (e) => { if ((e.key === "Enter" || e.key === " ") && e.target.matches(".feat-frame")) { e.preventDefault(); playFeatured(e.target); } });

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
      <figcaption>${w.program === "beyond change" ? "" : `<span>${esc(w.client)}</span>`}${esc(w.title)}</figcaption>
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
  if (t) playWork(+t.dataset.i, true);
});
$("galleryGrid").addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.matches(".g-tile[tabindex]")) { e.preventDefault(); playWork(+e.target.dataset.i, true); }
});
buildGallery();

// ---- เลื่อนแล้วค่อย ๆ โผล่ ----
const revealIO = "IntersectionObserver" in window
  ? new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); revealIO.unobserve(e.target); } }), { threshold: 0.1, rootMargin: "0px 0px -6% 0px" })
  : null;
function observeReveals(root = document) {
  if (revealIO) root.querySelectorAll(".reveal:not(.in)").forEach((el) => revealIO.observe(el));
}
document.querySelectorAll(".section > .label, .work-summary, .filters, .about, .brands, .service, .process-title, .process li, .contact-sec > p, .contact").forEach((el) => el.classList.add("reveal"));

// ---- เมนูมือถือ ----
const navEl = document.querySelector(".nav"), menuBtn = $("menuBtn");
const setMenu = (open) => { navEl.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", String(open)); };
menuBtn.addEventListener("click", () => setMenu(!navEl.classList.contains("open")));
$("mainNav").addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("click", (e) => { if (!e.target.closest(".nav")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// ---- ปุ่ม LINE ลอย (โผล่หลังเลื่อนผ่านหน้าแรก) ----
if (PROFILE.contact?.line) {
  const fab = $("lineFab");
  fab.href = `https://line.me/ti/p/~${encodeURIComponent(PROFILE.contact.line)}`;
  fab.hidden = false;
  let raf = 0;
  addEventListener("scroll", () => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; fab.classList.toggle("show", scrollY > 500); });
  }, { passive: true });
}

// ---- element ลอย: ขยับสวนการเลื่อนเล็กน้อย (ลึก/ตื้นต่างกันตาม data-speed) ----
const floats = [...document.querySelectorAll(".float-el")];
if (floats.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let ticking = false;
  const updateFloats = () => {
    ticking = false;
    for (const el of floats) {
      // จุดยึดของ element เอง (ไม่ใช่ทั้ง section ที่อาจสูงหลายพันพิกเซล) — offsetTop ไม่ถูกกระทบจาก translate/animation
      const anchor = el.parentElement.getBoundingClientRect().top + el.offsetTop + el.offsetHeight / 2;
      if (anchor < -400 || anchor > innerHeight + 400) continue; // ไกลนอกจอ ไม่ต้องคำนวณ
      el.style.translate = `0 ${-(anchor - innerHeight / 2) * (+el.dataset.speed || 0.08)}px`;
    }
  };
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(updateFloats); } }, { passive: true });
  addEventListener("resize", updateFloats);
  updateFloats();
}

// ---- วิดีโอวนคั่นก่อน Highlights: ถ้าผู้ใช้ตั้งลดการเคลื่อนไหว ให้หยุดเล่น ----
if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const lp = document.querySelector("#loopBand wistia-player");
  customElements.whenDefined("wistia-player").then(() => setTimeout(() => { try { lp.pause?.(); } catch {} }, 1500));
}

// ---- ลิงก์ตรงไปยังลูกค้า: ...#client=Fayda ----
const clientFromHash = () => {
  const m = location.hash.match(/^#client=(.+)$/);
  if (!m) return null;
  try { const n = decodeURIComponent(m[1]); return allClients.includes(n) ? n : null; } catch { return null; }
};
active = clientFromHash() || "ทั้งหมด";
renderFilters();
renderWorks();
if (active !== "ทั้งหมด") $("works").scrollIntoView();
addEventListener("hashchange", () => {
  const n = clientFromHash();
  if (n && n !== active) { active = n; renderFilters(); renderWorks(); $("works").scrollIntoView(); }
});
observeReveals();
document.documentElement.classList.add("reveal-ready");
