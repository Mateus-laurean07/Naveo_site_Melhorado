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
// LOADER
// ============================================================
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  if (loader) setTimeout(() => loader.classList.add("done"), 400);
  ScrollTrigger.refresh();
});
