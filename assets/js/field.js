/**
 * Mouse-reactive field: constellation, cursor aura, drifting chips, card tilt.
 */

const FIELD = {
  canvas: null,
  ctx: null,
  nodes: [],
  sparks: [],
  mouse: { x: 0, y: 0, tx: 0, ty: 0, active: false },
  dpr: 1,
  raf: 0,
  w: 0,
  h: 0,
  reduced: false
};

function initReactiveField() {
  FIELD.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  FIELD.canvas = document.getElementById('fx-canvas');
  if (!FIELD.canvas) return;

  FIELD.ctx = FIELD.canvas.getContext('2d');
  FIELD.mouse.x = window.innerWidth * 0.62;
  FIELD.mouse.y = window.innerHeight * 0.42;
  FIELD.mouse.tx = FIELD.mouse.x;
  FIELD.mouse.ty = FIELD.mouse.y;

  sizeField();
  spawnNodes();

  window.addEventListener('resize', () => {
    sizeField();
    spawnNodes();
  });

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerdown', (e) => {
    burstSparks(e.clientX, e.clientY, 18);
    FIELD.mouse.active = true;
  }, { passive: true });
  window.addEventListener('pointerleave', () => {
    FIELD.mouse.active = false;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(FIELD.raf);
    else loopField();
  });

  document.querySelectorAll('.skill-card, .info-card, .timeline-content').forEach((el) => {
    el.classList.add('react-tilt');
  });
  bindDriftChips();
  bindReactiveTilts();
  observeDynamicTilts();

  if (!FIELD.reduced) loopField();
}

function onPointerMove(e) {
  FIELD.mouse.tx = e.clientX;
  FIELD.mouse.ty = e.clientY;
  FIELD.mouse.active = true;

  const nx = e.clientX / window.innerWidth;
  const ny = e.clientY / window.innerHeight;
  document.documentElement.style.setProperty('--mx', nx.toFixed(4));
  document.documentElement.style.setProperty('--my', ny.toFixed(4));

  const aura = document.getElementById('cursor-aura');
  if (aura) {
    aura.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    aura.classList.add('on');
  }

  if (!FIELD.reduced && Math.random() < 0.35) {
    FIELD.sparks.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 40,
      vy: (Math.random() - 0.5) * 40,
      life: 0.45
    });
  }
}

function sizeField() {
  const canvas = FIELD.canvas;
  FIELD.dpr = Math.min(window.devicePixelRatio || 1, 2);
  FIELD.w = window.innerWidth;
  FIELD.h = window.innerHeight;
  canvas.width = FIELD.w * FIELD.dpr;
  canvas.height = FIELD.h * FIELD.dpr;
  canvas.style.width = FIELD.w + 'px';
  canvas.style.height = FIELD.h + 'px';
  FIELD.ctx.setTransform(FIELD.dpr, 0, 0, FIELD.dpr, 0, 0);
}

function spawnNodes() {
  const count = FIELD.reduced ? 0 : Math.min(92, Math.floor((FIELD.w * FIELD.h) / 18000));
  FIELD.nodes = Array.from({ length: count }, () => ({
    x: Math.random() * FIELD.w,
    y: Math.random() * FIELD.h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: 1.2 + Math.random() * 2.2,
    pulse: Math.random() * Math.PI * 2
  }));
}

function themeColors() {
  const light = document.documentElement.getAttribute('data-theme') === 'light';
  return light
    ? {
      line: '56, 189, 248',
      node: '14, 165, 233',
      hot: '124, 58, 237',
      fade: '248, 250, 252'
    }
    : {
      line: '34, 211, 238',
      node: '125, 211, 252',
      hot: '167, 139, 250',
      fade: '7, 11, 20'
    };
}

function loopField() {
  FIELD.raf = requestAnimationFrame(loopField);
  const ctx = FIELD.ctx;
  if (!ctx) return;

  FIELD.mouse.x += (FIELD.mouse.tx - FIELD.mouse.x) * 0.12;
  FIELD.mouse.y += (FIELD.mouse.ty - FIELD.mouse.y) * 0.12;

  const colors = themeColors();
  ctx.clearRect(0, 0, FIELD.w, FIELD.h);
  drawGrid(ctx, colors);

  const mx = FIELD.mouse.x;
  const my = FIELD.mouse.y;
  const nodes = FIELD.nodes;

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    const dx = n.x - mx;
    const dy = n.y - my;
    const dist = Math.hypot(dx, dy) || 1;

    if (FIELD.mouse.active && dist < 240) {
      const force = (240 - dist) / 240;
      n.vx += (dx / dist) * force * 0.55;
      n.vy += (dy / dist) * force * 0.55;
      n.vx += -dy / dist * force * 0.18;
      n.vy += dx / dist * force * 0.18;
    }

    n.x += n.vx;
    n.y += n.vy;
    n.vx *= 0.96;
    n.vy *= 0.96;
    n.vx += (Math.random() - 0.5) * 0.04;
    n.vy += (Math.random() - 0.5) * 0.04;
    n.pulse += 0.03;

    if (n.x < -20) n.x = FIELD.w + 20;
    if (n.x > FIELD.w + 20) n.x = -20;
    if (n.y < -20) n.y = FIELD.h + 20;
    if (n.y > FIELD.h + 20) n.y = -20;

    for (let j = i + 1; j < nodes.length; j++) {
      const o = nodes[j];
      const ddx = n.x - o.x;
      const ddy = n.y - o.y;
      const d2 = ddx * ddx + ddy * ddy;
      if (d2 < 140 * 140) {
        const midDist = Math.hypot((n.x + o.x) / 2 - mx, (n.y + o.y) / 2 - my);
        const heat = Math.max(0, 1 - midDist / 280);
        const alpha = (1 - Math.sqrt(d2) / 140) * (0.12 + heat * 0.55);
        ctx.strokeStyle = `rgba(${heat > 0.35 ? colors.hot : colors.line}, ${alpha})`;
        ctx.lineWidth = heat > 0.4 ? 1.4 : 0.7;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(o.x, o.y);
        ctx.stroke();
      }
    }

    const near = Math.max(0, 1 - dist / 220);
    const glow = 0.35 + near * 0.65 + Math.sin(n.pulse) * 0.1;
    ctx.fillStyle = `rgba(${near > 0.45 ? colors.hot : colors.node}, ${glow})`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r + near * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (FIELD.mouse.active) {
    const g = ctx.createRadialGradient(mx, my, 0, mx, my, 180);
    g.addColorStop(0, `rgba(${colors.hot}, 0.16)`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(mx, my, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(${colors.line}, 0.35)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(mx, my, 46 + Math.sin(performance.now() / 280) * 6, 0, Math.PI * 2);
    ctx.stroke();
  }

  FIELD.sparks.forEach((s) => {
    s.x += s.vx * 0.016;
    s.y += s.vy * 0.016;
    s.life -= 0.02;
    ctx.globalAlpha = Math.max(0, s.life);
    ctx.fillStyle = `rgb(${colors.line})`;
    ctx.fillRect(s.x, s.y, 2, 2);
  });
  ctx.globalAlpha = 1;
  FIELD.sparks = FIELD.sparks.filter((s) => s.life > 0);

  updateDriftChips();
}

function drawGrid(ctx, colors) {
  const mx = FIELD.w ? (FIELD.mouse.x / FIELD.w) - 0.5 : 0;
  const my = FIELD.h ? (FIELD.mouse.y / FIELD.h) - 0.5 : 0;
  const offsetX = mx * 28;
  const offsetY = my * 28;
  ctx.strokeStyle = `rgba(${colors.line}, 0.045)`;
  ctx.lineWidth = 1;
  const step = 56;
  for (let x = -step; x < FIELD.w + step; x += step) {
    ctx.beginPath();
    ctx.moveTo(x + offsetX, 0);
    ctx.lineTo(x + offsetX + my * 12, FIELD.h);
    ctx.stroke();
  }
  for (let y = -step; y < FIELD.h + step; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y + offsetY);
    ctx.lineTo(FIELD.w, y + offsetY + mx * 12);
    ctx.stroke();
  }
}

function burstSparks(x, y, n) {
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 40 + Math.random() * 160;
    FIELD.sparks.push({
      x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.6 + Math.random() * 0.3
    });
  }
}

function bindDriftChips() {
  document.querySelectorAll('.drift-chip').forEach((chip, i) => {
    chip.dataset.baseX = chip.style.left || chip.dataset.x || `${12 + (i * 13) % 70}`;
    chip.dataset.baseY = chip.style.top || chip.dataset.y || `${18 + (i * 17) % 60}`;
  });
}

function updateDriftChips() {
  const mx = FIELD.mouse.x;
  const my = FIELD.mouse.y;
  document.querySelectorAll('.drift-chip').forEach((chip) => {
    const depth = Number(chip.dataset.depth || 16);
    const rect = chip.parentElement.getBoundingClientRect();
    const cx = rect.left + (parseFloat(chip.dataset.x) / 100) * rect.width;
    const cy = rect.top + (parseFloat(chip.dataset.y) / 100) * rect.height;
    const dx = (mx - window.innerWidth / 2) / window.innerWidth;
    const dy = (my - window.innerHeight / 2) / window.innerHeight;
    const awayX = (cx - mx) / 30;
    const awayY = (cy - my) / 30;
    const dist = Math.hypot(cx - mx, cy - my);
    const push = dist < 160 ? (160 - dist) / 8 : 0;
    const x = dx * depth + (awayX * push);
    const y = dy * depth + (awayY * push);
    chip.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}

function bindReactiveTilts(root = document) {
  if (FIELD.reduced) return;
  root.querySelectorAll('.react-tilt').forEach((el) => {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = '1';
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 11).toFixed(2)}deg) translateZ(10px)`;
      el.style.setProperty('--shine-x', `${(px + 0.5) * 100}%`);
      el.style.setProperty('--shine-y', `${(py + 0.5) * 100}%`);
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

function observeDynamicTilts() {
  const grid = document.getElementById('mission-grid') || document.getElementById('blog-grid');
  if (!grid) return;
  const obs = new MutationObserver(() => bindReactiveTilts(document));
  obs.observe(document.getElementById('mission-grid') || grid, { childList: true });
  const blog = document.getElementById('blog-grid');
  if (blog) obs.observe(blog, { childList: true });
}

document.addEventListener('DOMContentLoaded', initReactiveField);
