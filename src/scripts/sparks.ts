// Lagan 2D canvas sistem čestica: žar koji se diže iz roštilja + "eksplozija" iskri.
type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: string };

export interface SparksOptions {
  ambient?: number; // koliko žara stalno lebdi (0 = samo eksplozije)
  colors?: string[];
  mouse?: boolean; // reaguje na miš
}

export function createSparks(canvas: HTMLCanvasElement, opts: SparksOptions = {}) {
  const ctx = canvas.getContext('2d')!;
  const colors = opts.colors ?? ['#d08a55', '#d1b073', '#f0c27b', '#b06a3b'];
  const ps: P[] = [];
  let w = 0, h = 0, dpr = 1, raf = 0, running = false, visible = true;
  const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    w = r.width;
    h = r.height;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const pick = () => colors[(Math.random() * colors.length) | 0];

  const spawnEmber = (y = h + 10): P => ({
    x: rand(0, w), y, vx: rand(-0.15, 0.15), vy: rand(-0.9, -0.3),
    life: 0, max: rand(220, 520), r: rand(0.6, 2.1), c: pick(),
  });

  const burst = (x: number, y: number, n = 60, palette?: string[]) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = rand(1.5, 7);
      ps.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2,
        life: 0, max: rand(50, 110), r: rand(1, 3),
        c: palette ? palette[(Math.random() * palette.length) | 0] : pick(),
      });
    }
    start();
  };

  const tick = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    const ambient = opts.ambient ?? 0;
    let embers = 0;
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      p.life++;
      const isEmber = p.max > 200;
      if (isEmber) embers++;
      // blagi vetar + treperenje
      p.vx += Math.sin((p.y + p.life) * 0.02) * 0.01;
      if (!isEmber) p.vy += 0.12; // gravitacija za iskre
      // miš odguruje čestice
      if (opts.mouse) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 14000) {
          const f = (1 - d2 / 14000) * 0.6;
          p.vx += (dx / Math.sqrt(d2 + 1)) * f;
          p.vy += (dy / Math.sqrt(d2 + 1)) * f;
        }
      }
      p.vx *= 0.985;
      p.vy *= isEmber ? 0.995 : 0.975;
      p.x += p.vx;
      p.y += p.vy;
      const t = p.life / p.max;
      const alpha = t < 0.1 ? t * 10 : 1 - (t - 0.1) / 0.9;
      if (t >= 1 || p.y < -20) {
        ps.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = Math.max(0, alpha) * (isEmber ? 0.85 : 1);
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      if (p.r > 1.4) {
        ctx.globalAlpha *= 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    while (embers < ambient) {
      ps.push(spawnEmber(rand(h * 0.3, h + 10)));
      embers++;
    }
    ctx.globalAlpha = 1;
    if (ps.length && visible) raf = requestAnimationFrame(tick);
    else running = false;
  };

  const start = () => {
    if (running || !visible) return;
    running = true;
    raf = requestAnimationFrame(tick);
  };

  resize();
  window.addEventListener('resize', resize);
  if (opts.ambient) for (let i = 0; i < opts.ambient; i++) ps.push(spawnEmber(rand(0, h)));

  if (opts.mouse) {
    canvas.parentElement!.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    });
    canvas.parentElement!.addEventListener('pointerleave', () => {
      mouse.x = mouse.y = -9999;
    });
  }

  // ne troši procesor kad sekcija nije na ekranu
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
    else cancelAnimationFrame(raf), (running = false);
  }).observe(canvas);

  start();
  return { burst, resize };
}
