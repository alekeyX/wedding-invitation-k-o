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

// ====== Galería automática (cambia cada 1 s, loop infinito) ======
const gt = $("gtrack"), GAP = 16, CLONES = 3;
const mk = f => `<div class="slide"><img src="${f}" alt="Karen y Omar" loading="lazy" draggable="false"></div>`;
gt.innerHTML = FOTOS.concat(FOTOS.slice(0, CLONES)).map(mk).join("");
let idx = 0;
const stepPx = () => gt.querySelector(".slide").offsetWidth + GAP;
function go(){
  idx++;
  gt.style.transition = "transform .8s ease-in-out";
  gt.style.transform = `translateX(${-idx * stepPx()}px)`;
}
gt.addEventListener("transitionend", () => {
  if (idx >= FOTOS.length){
    gt.style.transition = "none"; idx = 0; gt.style.transform = "translateX(0)";
  }
});
setInterval(go, 1500);
addEventListener("resize", () => { gt.style.transition = "none"; gt.style.transform = `translateX(${-idx * stepPx()}px)`; });

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