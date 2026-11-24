const FECHA = new Date("2026-12-26T14:00:00-04:00");   // ceremonia religiosa (Bolivia, UTC-4)
const $ = id => document.getElementById(id);

// ====== Bordes rasgados en las secciones con foto ======
document.querySelectorAll(".foto").forEach(el => {
  const n = 34, r = () => Math.round(Math.random() * 12), p = [];
  for (let i = 0; i <= n; i++) p.push(`${(i / n * 100).toFixed(2)}% ${r()}px`);
  for (let i = n; i >= 0; i--) p.push(`${(i / n * 100).toFixed(2)}% calc(100% - ${r()}px)`);
  el.style.clipPath = `polygon(${p.join(",")})`;
});

// ====== Reproductor de música ======
const music = $("music"), play = $("play"), prog = $("prog"), bar = $("bar");
const icoPlay = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
const icoPause = '<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';
play.onclick = () => music.paused ? music.play().catch(() => {}) : music.pause();
music.addEventListener("play", () => play.innerHTML = icoPause);
music.addEventListener("pause", () => play.innerHTML = icoPlay);
music.addEventListener("timeupdate", () => prog.style.width = (music.duration ? music.currentTime / music.duration * 100 : 0) + "%");
bar.onclick = e => { if (!music.duration) return; const r = bar.getBoundingClientRect(); music.currentTime = (e.clientX - r.left) / r.width * music.duration; };
$("rew").onclick = () => music.currentTime = 0;
$("fwd").onclick = () => music.currentTime = Math.min(music.duration || 0, music.currentTime + 15);
$("loop").onclick = e => { music.loop = !music.loop; e.currentTarget.classList.toggle("on", music.loop); };

// ====== Cuenta regresiva ======
const pad = v => String(v).padStart(2, "0");
function tick(){
  const t = Math.max(0, FECHA - Date.now()) / 1000;
  $("d").textContent = pad(Math.floor(t / 86400));
  $("h").textContent = pad(Math.floor(t % 86400 / 3600));
  $("m").textContent = pad(Math.floor(t % 3600 / 60));
  $("s").textContent = pad(Math.floor(t % 60));
}
tick(); setInterval(tick, 1000);

// ====== Regalo y modal QR ======
const modal = $("modal"), gift = $("gift");
gift.addEventListener("click", () => {
  gift.classList.add("open");
  setTimeout(() => { modal.classList.add("show"); modal.setAttribute("aria-hidden", "false"); }, 550);
});
function cerrar(){ modal.classList.remove("show"); modal.setAttribute("aria-hidden", "true"); gift.classList.remove("open"); }
$("closeModal").addEventListener("click", cerrar);
modal.addEventListener("click", e => { if (e.target === modal) cerrar(); });
addEventListener("keydown", e => { if (e.key === "Escape") cerrar(); });

// ====== Animaciones al hacer scroll ======
(function(){
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
  const grupos = [["section h2","up"],["section .lead","up"],[".card","up"],[".glassbox","zoom"],[".count","zoom"],[".tl-list li","up"],[".firma","up"],[".quote","up"]];
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target; io.unobserve(el); el.classList.add("in");
    el.addEventListener("transitionend", e => { if (e.target === el && e.propertyName === "opacity") el.classList.remove("rv","in","up","zoom"); });
  }), {threshold: .15, rootMargin: "0px 0px -6% 0px"});
  grupos.forEach(([sel, tipo]) => document.querySelectorAll(sel).forEach(el => {
    if (el.closest(".hero") || el.classList.contains("rv")) return;
    const h = [...el.parentElement.children].filter(c => c.matches(sel));
    el.style.setProperty("--d", Math.min(h.indexOf(el) * .12, .5) + "s");
    el.classList.add("rv", tipo); io.observe(el);
  }));
})();
