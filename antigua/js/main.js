// ====== CONFIGURACIÓN ======
const FECHA = new Date("2026-12-26T14:00:00-04:00");   // ceremonia religiosa (Bolivia, UTC-4)
const FOTOS = ["image1","image2","image3","image4","image5","image6","image7"].map(n => `fotos/${n}.jpeg`);
const $ = id => document.getElementById(id);

// ====== Sobre de bienvenida + música ======
const env = $("env"), music = $("music"), mBtn = $("musicBtn");
function abrir(){
  if (env.classList.contains("open")) return;
  env.classList.add("open");
  music.volume = .6;
  music.play().then(() => { mBtn.hidden = false; }).catch(() => { mBtn.hidden = false; mBtn.classList.add("off"); });
  setTimeout(() => {
    $("intro").classList.add("gone");
    document.body.classList.remove("lock");
    mBtn.hidden = false;
  }, 2000);
}
env.addEventListener("click", abrir);
env.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") abrir(); });
mBtn.addEventListener("click", () => {
  const on = music.paused;
  on ? music.play() : music.pause();
  mBtn.classList.toggle("off", !on);
  mBtn.setAttribute("aria-label", on ? "Pausar música" : "Reproducir música");
});

// ====== Cuenta regresiva ======
function tick(){
  const t = Math.max(0, FECHA - Date.now()) / 1000;
  $("d").textContent = Math.floor(t / 86400);
  $("h").textContent = Math.floor(t % 86400 / 3600);
  $("m").textContent = Math.floor(t % 3600 / 60);
  $("s").textContent = Math.floor(t % 60);
}
tick(); setInterval(tick, 1000);

// ====== Galería tipo carrusel 3D (cambia cada 2 s) ======
const gt = $("gtrack");
gt.innerHTML = FOTOS.map(f => `<div class="slide"><img src="${f}" alt="Karen y Omar" loading="lazy" draggable="false"></div>`).join("");
const slides = [...gt.children], N = slides.length;
let idx = 0;
function layout(){
  const paso = slides[0].offsetWidth * .62;           // separación entre fotos
  slides.forEach((el, i) => {
    let d = (i - idx) % N;
    if (d > N / 2) d -= N;
    if (d < -N / 2) d += N;
    const a = Math.abs(d), lado = Math.sign(d);
    const escala = a === 0 ? 1 : a === 1 ? .8 : .62;   // la central es la más grande
    el.style.transform = `translate(-50%,-50%) translateX(${d * paso}px) rotateY(${-lado * (a ? 24 : 0)}deg) scale(${escala})`;
    el.style.opacity = a === 0 ? 1 : a === 1 ? .9 : a === 2 ? .5 : 0;
    el.style.zIndex = 10 - a;
  });
}
layout();
setInterval(() => { idx = (idx + 1) % N; layout(); }, 2000);
addEventListener("resize", layout);

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
  const grupos = [
    ["section h2","up"], ["section .lead","up"], [".grid2 > .card","up"],
    [".count div","zoom"], [".gallery","zoom"], [".map","up"],
    [".tl-list li","left"], [".gift","zoom"], [".tap2","up"],
    ["section .btn","up"], [".foot","up"]
  ];
  const io = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      io.unobserve(el);
      el.classList.add("in");
      // al terminar, se quita la clase para devolver el hover/animaciones originales
      el.addEventListener("transitionend", e => {
        if (e.target === el && e.propertyName === "opacity") el.classList.remove("rv","in","up","zoom","left");
      });
    });
  }, {threshold: .15, rootMargin: "0px 0px -6% 0px"});
  grupos.forEach(([sel, tipo]) => {
    document.querySelectorAll(sel).forEach(el => {
      const hermanos = [...el.parentElement.children].filter(c => c.matches(sel));
      el.style.setProperty("--d", Math.min(hermanos.indexOf(el) * .12, .5) + "s");
      el.classList.add("rv", tipo);
      io.observe(el);
    });
  });
})();