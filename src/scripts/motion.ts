// Globalni "cinematic" sloj: glatko skrolovanje, otkrivanje naslova, paralaksa,
// magnetna dugmad i kursor. Sve se gasi uz prefers-reduced-motion.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Glatko skrolovanje ---------- */
if (!reduce) {
  const lenis = new Lenis({ duration: 1.15, anchors: { offset: -72 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // dok traje uvod, skrol je zaključan
  const html = document.documentElement;
  if (html.classList.contains('intro-active')) {
    lenis.stop();
    document.addEventListener('intro:done', () => lenis.start(), { once: true });
  }
  (window as any).__lenis = lenis;
}

/* ---------- Naslovi: reči izranjaju iz maske ---------- */
function splitWords(el: HTMLElement) {
  if (el.dataset.splitDone) return;
  el.dataset.splitDone = '1';
  const label = document.createElement('span');
  label.className = 'sr-only';
  label.textContent = el.textContent?.trim() ?? '';
  const walk = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent!.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) return frag.append(part);
          const mask = document.createElement('span');
          mask.className = 'split-mask';
          mask.setAttribute('aria-hidden', 'true');
          const word = document.createElement('span');
          word.className = 'split-word';
          word.textContent = part;
          mask.append(word);
          frag.append(mask);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        (child as HTMLElement).setAttribute('aria-hidden', 'true');
        walk(child);
      }
    }
  };
  walk(el);
  el.prepend(label);
}

if (!reduce) {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    splitWords(el);
    const words = el.querySelectorAll('.split-word');
    gsap.set(words, { yPercent: 110, rotate: 4 });
    const play = () =>
      gsap.to(words, { yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.06 });

    if (el.dataset.split === 'hero') {
      const html = document.documentElement;
      if (html.dataset.intro || !html.classList.contains('intro-active')) play();
      else document.addEventListener('intro:done', play, { once: true });
    } else {
      ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: play });
    }
  });

  /* ---------- Slike: otkrivanje kroz masku + paralaksa ---------- */
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax) || 10;
    gsap.fromTo(el, { yPercent: -amount / 2 }, {
      yPercent: amount / 2,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  /* ---------- Traka (marquee) koja ubrzava sa skrolom ---------- */
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((track) => {
    const loop = gsap.to(track, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: (self) => (self.isActive ? loop.resume() : loop.pause()),
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-6, 6, self.getVelocity() / 300);
        gsap.to(loop, { timeScale: v < 0 ? -1 + v : 1 + v, duration: 0.3, overwrite: true });
        gsap.to(loop, { timeScale: v < 0 ? -1 : 1, duration: 1.2, delay: 0.3 });
      },
    });
  });
}

/* ---------- Magnetna dugmad ---------- */
if (finePointer && !reduce) {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.3);
      yTo((e.clientY - r.top - r.height / 2) * 0.4);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* ---------- Kursor: tačka + prsten sa natpisom ---------- */
if (finePointer && !reduce) {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  ring.innerHTML = '<span></span>';
  document.body.append(ring, dot);
  gsap.set([dot, ring], { opacity: 0 });
  window.addEventListener('pointermove', () => gsap.to([dot, ring], { opacity: 1, duration: 0.3 }), { once: true });
  document.documentElement.classList.add('has-cursor');

  const dx = gsap.quickTo(dot, 'x', { duration: 0.1 });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.1 });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  const label = ring.querySelector('span')!;

  window.addEventListener('pointermove', (e) => {
    dx(e.clientX);
    dy(e.clientY);
    rx(e.clientX);
    ry(e.clientY);
  });

  document.addEventListener('pointerover', (e) => {
    const target = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor]');
    ring.classList.toggle('is-hover', !!target);
    const text = target?.dataset.cursor ?? '';
    label.textContent = text;
    ring.classList.toggle('has-label', !!text);
  });
  document.addEventListener('pointerdown', () => ring.classList.add('is-down'));
  document.addEventListener('pointerup', () => ring.classList.remove('is-down'));
  document.documentElement.addEventListener('pointerleave', () => gsap.to([dot, ring], { opacity: 0 }));
  document.documentElement.addEventListener('pointerenter', () => gsap.to([dot, ring], { opacity: 1 }));
}
