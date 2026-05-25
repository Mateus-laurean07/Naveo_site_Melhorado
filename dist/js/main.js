// =============================================================
// Naveo · main.js
// Lenis · cursor · magnetic · reveals · tilt · spotlight · counters
// =============================================================

import { gsap } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/+esm";
import { ScrollTrigger } from "https://cdn.jsdelivr.net/npm/gsap@3.12.5/ScrollTrigger.js/+esm";
import Lenis from "https://cdn.jsdelivr.net/npm/lenis@1.1.13/+esm";

gsap.registerPlugin(ScrollTrigger);

// ============================================================
// SMOOTH SCROLL
// ============================================================
const lenis = new Lenis({
  duration: 1.15,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  smoothTouch: false,
});
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80, duration: 1.4 });
      }
    }
  });
});

// ============================================================
// CURSOR
// ============================================================
const cursor = document.querySelector(".cursor");
const ring = document.querySelector(".cursor-ring");
if (cursor && ring && window.matchMedia("(hover: hover)").matches) {
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  const sx = { x: mx, y: my };
  window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });
  gsap.ticker.add(() => {
    sx.x += (mx - sx.x);
    sx.y += (my - sx.y);
    cursor.style.transform = `translate(${sx.x}px, ${sx.y}px) translate(-50%, -50%)`;
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
  });
  document.querySelectorAll('a, button, .hover-target, [data-hover]').forEach((el) => {
    el.addEventListener("mouseenter", () => { cursor.classList.add("hover"); ring.classList.add("hover"); });
    el.addEventListener("mouseleave", () => { cursor.classList.remove("hover"); ring.classList.remove("hover"); });
  });
}

// ============================================================
// MAGNETIC BUTTONS
// ============================================================
document.querySelectorAll(".magnetic").forEach((el) => {
  const inner = el.querySelector(".magnetic__inner") || el;
  const strength = parseFloat(el.dataset.magnetic || "0.4");
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * strength, y: y * strength, duration: 0.5, ease: "power3.out" });
    gsap.to(inner, { x: x * strength * 0.4, y: y * strength * 0.4, duration: 0.5, ease: "power3.out" });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    gsap.to(inner, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  });
});

// ============================================================
// SPOTLIGHT (capabilities + similar elements with --mx/--my vars)
// ============================================================
document.querySelectorAll(".capability, .stat, .testimonial").forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", mx + "%");
    el.style.setProperty("--my", my + "%");
  });
});

// ============================================================
// TILT 3D (capability + portfolio-hero)
// ============================================================
document.querySelectorAll(".capability, .portfolio-hero, .testimonial").forEach((el) => {
  let rect = null;
  el.addEventListener("mouseenter", () => { rect = el.getBoundingClientRect(); });
  el.addEventListener("mousemove", (e) => {
    if (!rect) rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const max = 6;
    gsap.to(el, {
      rotationY: dx * max,
      rotationX: -dy * max,
      transformPerspective: 1000,
      duration: 0.6,
      ease: "power2.out",
    });
  });
  el.addEventListener("mouseleave", () => {
    rect = null;
    gsap.to(el, { rotationY: 0, rotationX: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  });
});

// ============================================================
// HEADER SCROLL STATE + SCROLL PROGRESS
// ============================================================
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
ScrollTrigger.create({
  start: "top -20",
  end: "max",
  onUpdate: (self) => {
    if (header) header.classList.toggle("scrolled", self.scroll() > 20);
    if (progress) progress.style.width = (self.progress * 100) + "%";
  },
});

// ============================================================
// HERO HEADLINE REVEAL
// ============================================================
window.addEventListener("DOMContentLoaded", () => {
  const headline = document.querySelector(".hero__headline");
  if (headline) {
    const spans = headline.querySelectorAll(".word > span");
    gsap.to(spans, { y: 0, duration: 1.3, stagger: 0.07, ease: "expo.out", delay: 0.4 });
  }
  const heroExtras = document.querySelectorAll(".hero__eyebrow, .hero__sub, .hero__ctas, .hero__scroll");
  gsap.from(heroExtras, { opacity: 0, y: 20, duration: 1, stagger: 0.1, ease: "power3.out", delay: 0.9 });
});

// ============================================================
// REVEALS
// ============================================================
document.querySelectorAll(".reveal").forEach((el) => {
  ScrollTrigger.create({
    trigger: el,
    start: "top 88%",
    onEnter: () => el.classList.add("is-visible"),
  });
});

// ============================================================
// METHOD — drag-to-scroll horizontal (sem scroll-jacking)
// ============================================================
const methodWrap = document.querySelector(".method__horizontal-wrap");
if (methodWrap) {
  let isDown = false, startX = 0, scrollLeft = 0, moved = false;

  methodWrap.addEventListener("mousedown", (e) => {
    isDown = true;
    moved = false;
    methodWrap.classList.add("grabbing");
    startX = e.pageX - methodWrap.offsetLeft;
    scrollLeft = methodWrap.scrollLeft;
  });
  ["mouseleave", "mouseup"].forEach((ev) => methodWrap.addEventListener(ev, () => {
    isDown = false;
    setTimeout(() => methodWrap.classList.remove("grabbing"), 50);
  }));
  methodWrap.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - methodWrap.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) moved = true;
    methodWrap.scrollLeft = scrollLeft - walk;
  });

  // Prevent click-through after drag
  methodWrap.addEventListener("click", (e) => {
    if (moved) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  // Keyboard nav (←/→) when focused
  methodWrap.addEventListener("keydown", (e) => {
    const card = methodWrap.querySelector(".method-card");
    const step = card ? card.offsetWidth + 24 : 440;
    if (e.key === "ArrowRight") { methodWrap.scrollBy({ left: step, behavior: "smooth" }); e.preventDefault(); }
    if (e.key === "ArrowLeft")  { methodWrap.scrollBy({ left: -step, behavior: "smooth" }); e.preventDefault(); }
  });
}

// ============================================================
// PARALLAX images
// ============================================================
document.querySelectorAll(".case__media__inner").forEach((media) => {
  gsap.fromTo(media,
    { yPercent: -10, scale: 1.12 },
    { yPercent: 10, ease: "none",
      scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: true },
    });
});

// ============================================================
// COUNTERS
// ============================================================
document.querySelectorAll("[data-counter]").forEach((el) => {
  const target = parseFloat(el.dataset.counter);
  const suffix = el.dataset.suffix || "";
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  ScrollTrigger.create({
    trigger: el,
    start: "top 88%",
    once: true,
    onEnter: () => {
      gsap.fromTo({ v: 0 }, { v: 0 },
        { v: target, duration: 2, ease: "power3.out",
          onUpdate: function () { el.textContent = this.targets()[0].v.toFixed(decimals) + suffix; },
        });
    },
  });
});

// ============================================================
// CONTATO FORM — envia pro WhatsApp pré-preenchido
// ============================================================
const contatoForm = document.getElementById("contato-form");
if (contatoForm) {
  contatoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(contatoForm);
    const nome = (data.get("nome") || "").toString().trim();
    const empresa = (data.get("empresa") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const telefone = (data.get("telefone") || "").toString().trim();
    const mensagem = (data.get("mensagem") || "").toString().trim();

    const lines = [
      `Olá, Naveo! Sou ${nome}.`,
      empresa ? `Empresa: ${empresa}` : null,
      `E-mail: ${email}`,
      telefone ? `WhatsApp: ${telefone}` : null,
      "",
      "Minha dor / contexto:",
      mensagem,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join("\n"));
    const wa = `https://wa.me/5565996865004?text=${text}`;
    window.open(wa, "_blank", "noopener");
  });
}

// ============================================================
// HERO LAPTOP — parallax tilt following cursor
// ============================================================
const heroLaptopWrap = document.querySelector(".hero__laptop");
const heroLaptopEl = heroLaptopWrap && heroLaptopWrap.querySelector(".laptop");
if (heroLaptopWrap && heroLaptopEl && window.matchMedia("(hover: hover)").matches) {
  const BASE_RX = 4;
  const BASE_RY = -8;
  const MAX_DX = 14;   // extra rotateY range
  const MAX_DY = 10;   // extra rotateX range
  let pending = null;

  const apply = (rx, ry) => {
    heroLaptopEl.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };

  heroLaptopWrap.addEventListener("mouseenter", () => {
    heroLaptopEl.style.transition = "transform .25s var(--ease)";
  });
  heroLaptopWrap.addEventListener("mousemove", (e) => {
    const rect = heroLaptopWrap.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;  // -1..1
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    const rx = BASE_RX - ny * MAX_DY;
    const ry = BASE_RY + nx * MAX_DX;
    if (pending) cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => apply(rx, ry));
  });
  heroLaptopWrap.addEventListener("mouseleave", () => {
    heroLaptopEl.style.transition = "transform .9s var(--ease)";
    heroLaptopEl.style.transform = "";
  });
}

// ============================================================
// BRASIL MAP — load real SVG + construction animation
// ============================================================
const brasilMap = document.querySelector(".brasil-map");
if (brasilMap) {
  const wrap = brasilMap.querySelector(".brasil-map__svg");
  const src = wrap && wrap.dataset.src;

  // Build-order: NW → NE → SW → SE-ish, by region
  const REGION_ORDER = ["RegiaoNorte", "RegiaoNordeste", "RegiaoCentroOeste", "RegiaoSudeste", "RegiaoSul"];

  const buildMap = (svg) => {
    if (!svg) return;
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    // Stagger initial transition-delay per state, by region order
    const states = [...svg.querySelectorAll(".bm-state")];
    states.sort((a, b) => {
      const ra = REGION_ORDER.findIndex((r) => a.classList.contains(r));
      const rb = REGION_ORDER.findIndex((r) => b.classList.contains(r));
      return (ra < 0 ? 99 : ra) - (rb < 0 ? 99 : rb);
    });
    states.forEach((p, i) => {
      p.style.transitionDelay = (i * 35) + "ms";
    });

    // Compute Lucas do Rio Verde position inside Mato Grosso bbox
    const mt = svg.querySelector("#Mato_Grosso") || svg.querySelector(".BR-MT");
    if (!mt) return;

    // Move MT to end so it renders on top
    mt.parentNode.appendChild(mt);

    const bbox = mt.getBBox();
    // Lucas do Rio Verde sits ~49% across, ~53% down inside MT's bbox
    const px = bbox.x + bbox.width * 0.49;
    const py = bbox.y + bbox.height * 0.53;

    const vb = svg.viewBox.baseVal;
    const span = Math.min(vb.width, vb.height);
    const dotR = span * 0.022;     // pin scale
    const labelDx = span * 0.42;   // leader line X
    const labelDy = -span * 0.30;  // leader line Y (up)
    const labelGap = span * 0.012;

    const SVGNS = "http://www.w3.org/2000/svg";

    // Pin group
    const pin = document.createElementNS(SVGNS, "g");
    pin.setAttribute("class", "brasil-map__pin");
    pin.setAttribute("transform", `translate(${px} ${py})`);

    const pulse1 = document.createElementNS(SVGNS, "circle");
    pulse1.setAttribute("class", "brasil-map__pulse");
    pulse1.setAttribute("r", dotR);
    pulse1.setAttribute("fill", "none");
    pulse1.setAttribute("stroke", "#ffffff");
    pulse1.setAttribute("stroke-width", dotR * 0.32);
    pin.appendChild(pulse1);

    const pulse2 = pulse1.cloneNode();
    pulse2.setAttribute("class", "brasil-map__pulse brasil-map__pulse--2");
    pin.appendChild(pulse2);

    const ring = document.createElementNS(SVGNS, "circle");
    ring.setAttribute("r", dotR * 1.4);
    ring.setAttribute("fill", "#050810");
    pin.appendChild(ring);

    const dot = document.createElementNS(SVGNS, "circle");
    dot.setAttribute("r", dotR);
    dot.setAttribute("fill", "var(--accent)");
    pin.appendChild(dot);

    const core = document.createElementNS(SVGNS, "circle");
    core.setAttribute("r", dotR * 0.32);
    core.setAttribute("fill", "#050810");
    pin.appendChild(core);

    svg.appendChild(pin);

    // Callout — leader from pin out + labels off the side
    const callout = document.createElementNS(SVGNS, "g");
    callout.setAttribute("class", "brasil-map__callout");
    callout.setAttribute("transform", `translate(${px} ${py})`);

    const line = document.createElementNS(SVGNS, "line");
    line.setAttribute("x1", "0");
    line.setAttribute("y1", "0");
    line.setAttribute("x2", labelDx);
    line.setAttribute("y2", labelDy);
    line.setAttribute("class", "brasil-map__callout-line");
    line.setAttribute("stroke-width", dotR * 0.20);
    callout.appendChild(line);

    const endDot = document.createElementNS(SVGNS, "circle");
    endDot.setAttribute("cx", labelDx);
    endDot.setAttribute("cy", labelDy);
    endDot.setAttribute("r", dotR * 0.32);
    endDot.setAttribute("fill", "var(--accent)");
    callout.appendChild(endDot);

    const tg = document.createElementNS(SVGNS, "g");
    tg.setAttribute("transform", `translate(${labelDx + labelGap} ${labelDy})`);

    const t1 = document.createElementNS(SVGNS, "text");
    t1.setAttribute("class", "brasil-map__city-label");
    t1.setAttribute("x", "0");
    t1.setAttribute("y", "0");
    t1.setAttribute("dominant-baseline", "central");
    t1.textContent = "Lucas do Rio Verde";
    tg.appendChild(t1);

    const t2 = document.createElementNS(SVGNS, "text");
    t2.setAttribute("class", "brasil-map__coord-label");
    t2.setAttribute("x", "0");
    t2.setAttribute("y", span * 0.048);
    t2.setAttribute("dominant-baseline", "central");
    t2.textContent = "13°02′S · 55°54′W";
    tg.appendChild(t2);

    callout.appendChild(tg);
    svg.appendChild(callout);
  };

  const triggerBuild = () => {
    ScrollTrigger.create({
      trigger: brasilMap,
      start: "top 75%",
      once: true,
      onEnter: () => brasilMap.classList.add("is-built"),
    });
    ScrollTrigger.refresh();
  };

  if (src) {
    fetch(src)
      .then((r) => r.text())
      .then((txt) => {
        wrap.innerHTML = txt;
        const svg = wrap.querySelector("svg");
        buildMap(svg);
        triggerBuild();
      })
      .catch(() => {});
  }
}

// ============================================================
// MOBILE NAV TOGGLE
// ============================================================
const navToggle = document.querySelector(".site-nav__toggle");
const siteNav = document.getElementById("site-nav");
if (navToggle && siteNav) {
  const closeNav = () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  const openNav = () => {
    siteNav.classList.add("open");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };
  navToggle.addEventListener("click", () => {
    if (siteNav.classList.contains("open")) closeNav();
    else openNav();
  });
  siteNav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => closeNav());
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && siteNav.classList.contains("open")) closeNav();
  });
}

// ============================================================
// LOADER
// ============================================================
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  if (loader) setTimeout(() => loader.classList.add("done"), 400);
  ScrollTrigger.refresh();
});
