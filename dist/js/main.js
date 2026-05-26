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

// Auto-format telefone: (XX) XXXXX-XXXX
const telefoneInput = document.getElementById("contato-telefone");
if (telefoneInput) {
  telefoneInput.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11); // só dígitos, max 11
    if (v.length === 0) { e.target.value = ""; return; }
    let out = "(" + v.slice(0, 2);
    if (v.length >= 2) out += ") ";
    if (v.length >= 7) {
      out += v.slice(2, 7) + "-" + v.slice(7);
    } else if (v.length > 2) {
      out += v.slice(2);
    }
    e.target.value = out;
  });
}

const contatoForm = document.getElementById("contato-form");
if (contatoForm) {
  contatoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(contatoForm);
    const nome = (data.get("nome") || "").toString().trim();
    const empresa = (data.get("empresa") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const telefone = (data.get("telefone") || "").toString().trim();
    const interesse = (data.get("interesse") || "").toString().trim();
    const mensagem = (data.get("mensagem") || "").toString().trim();

    const lines = [
      `Olá, Naveo! Sou ${nome}.`,
      empresa ? `Empresa: ${empresa}` : null,
      `E-mail: ${email}`,
      telefone ? `WhatsApp: ${telefone}` : null,
      interesse ? `Interesse: ${interesse}` : null,
      "",
      "Contexto:",
      mensagem,
    ].filter(Boolean);

    // Persiste a mensagem no localStorage pra aparecer no admin
    try {
      const raw = localStorage.getItem("naveo_messages");
      const list = raw ? JSON.parse(raw) : [];
      list.unshift({
        id: "m" + Date.now(),
        nome, email, telefone, empresa, interesse, mensagem,
        date: new Date().toISOString(),
        read: false,
      });
      localStorage.setItem("naveo_messages", JSON.stringify(list));
    } catch (err) {
      // silencioso — não bloqueia o fluxo de WhatsApp
    }

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
// PORTAL TRANSITION — clica no nav vendo o laptop = entra pela tela
// Intercepta clicks em Cases / Blog / Quem somos / Contato.
// Se o laptop tá visível: animação de "zoom in" pela tela do laptop.
// Senão: navegação normal.
// ============================================================
(function () {
  const portalLaptop = document.querySelector(".hero__laptop");
  if (!portalLaptop) return; // só ativa na home (onde existe o laptop)

  // Respeita prefers-reduced-motion
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  // Observa se o laptop tá visível
  let laptopVisible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (entries) => {
        laptopVisible = entries[0].isIntersecting;
      },
      { threshold: 0.25 }
    ).observe(portalLaptop);
  }

  // Pega só os links internos do menu (não Início nem Portfólio)
  const portalHrefs = ["/cases", "/blog", "/quem-somos", "/contato"];
  const allNavLinks = document.querySelectorAll('.site-nav__links a, .site-nav a');
  const portalLinks = Array.from(allNavLinks).filter((a) => {
    const href = a.getAttribute("href") || "";
    // suporta /cases, /en/cases, /es/cases etc.
    return portalHrefs.some((p) => href === p || href.endsWith(p));
  });

  function runPortal(href, label) {
    // Marca pra próxima página fazer a entrada
    try {
      sessionStorage.setItem("naveo_portal_enter", "1");
    } catch (_) {}

    // 1. Insere overlay "conectando" dentro da tela do laptop ANTES do zoom
    const screen = portalLaptop.querySelector(".laptop__screen");
    if (screen) {
      const portal = document.createElement("div");
      portal.className = "laptop__portal";
      portal.innerHTML =
        '<div class="laptop__portal__loader">' +
          '<div class="laptop__portal__label">conectando</div>' +
          '<div class="laptop__portal__dest"><span class="arrow">→</span>' + label + '</div>' +
          '<div class="laptop__portal__bar"><div class="laptop__portal__bar-fill"></div></div>' +
        '</div>';
      screen.appendChild(portal);
      requestAnimationFrame(() => portal.classList.add("show"));
    }

    // 2. Calcula transform-final do laptop (centro da viewport, escala pra cobrir)
    const rect = portalLaptop.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tx = vw / 2 - cx;
    const ty = vh / 2 - cy;
    const scale = Math.max(vw / rect.width, vh / rect.height) * 1.35;

    portalLaptop.style.setProperty("--portal-tx", tx + "px");
    portalLaptop.style.setProperty("--portal-ty", ty + "px");
    portalLaptop.style.setProperty("--portal-scale", scale);

    // 3. Cria o bridge overlay (cor da tela do laptop) — invisível ainda
    const bridge = document.createElement("div");
    bridge.className = "portal-bridge";
    document.body.appendChild(bridge);

    // 4. Depois de 300ms (user viu "conectando"), começa o zoom do laptop
    setTimeout(() => {
      document.body.classList.add("portal-leaving");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          portalLaptop.classList.add("hero__laptop--portal");
        });
      });
    }, 300);

    // 5. Aos 680ms (laptop quase no fim do zoom) — bridge overlay aparece
    //    pra esconder o flash branco entre páginas
    setTimeout(() => {
      bridge.classList.add("show");
    }, 680);

    // 6. Aos 900ms — navega. Overlay já 100% opaco em #0d1117.
    setTimeout(() => {
      window.location.href = href;
    }, 900);
  }

  portalLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // Ignora se: laptop não visível, modificadores pressionados, target=_blank
      if (!laptopVisible) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (link.target === "_blank") return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      e.preventDefault();
      const label = (link.textContent || "").trim();
      runPortal(href, label);
    });
  });
})();

// ============================================================
// PORTAL ENTRY — se viemos via portal, faz fade-in na chegada
// ============================================================
try {
  if (sessionStorage.getItem("naveo_portal_enter") === "1") {
    sessionStorage.removeItem("naveo_portal_enter");
    document.documentElement.classList.add("portal-entering");
    window.addEventListener("DOMContentLoaded", () => {
      setTimeout(() => {
        document.documentElement.classList.remove("portal-entering");
      }, 800);
    });
  }
} catch (_) {}

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
