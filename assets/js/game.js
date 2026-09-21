/**
 * Guardrail Arena — a tiny prompt-injection defense game for the hero.
 * Optional easter-egg: it never blocks the rest of the portfolio.
 */

const ARENA = {
  width: 420,
  height: 520,
  running: false,
  raf: 0,
  canvas: null,
  ctx: null,
  keys: {},
  pointerX: null,
  score: 0,
  combo: 0,
  lives: 3,
  time: 0,
  player: { x: 210, y: 460, w: 36, h: 18, speed: 280 },
  bullets: [],
  threats: [],
  particles: [],
  spawnAcc: 0,
  fireAcc: 0,
  autoFire: true,
  over: false,
  started: false,
  highScore: 0
};

const THREAT_TYPES = [
  { label: 'INJECT', color: '#f43f5e' },
  { label: 'JAILBREAK', color: '#fb7185' },
  { label: 'BYPASS', color: '#f97316' },
  { label: 'LEAK', color: '#eab308' },
  { label: 'TOOLCALL', color: '#a855f7' }
];

function arenaPrefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initGuardrailArena() {
  const canvas = document.getElementById('arena-canvas');
  if (!canvas) return;

  ARENA.canvas = canvas;
  ARENA.ctx = canvas.getContext('2d');
  ARENA.highScore = Number(localStorage.getItem('guardrail-arena-hs') || 0);

  resizeArenaCanvas();
  window.addEventListener('resize', resizeArenaCanvas);

  const startBtn = document.getElementById('arena-start');
  const overlay = document.getElementById('arena-overlay');
  const hudScore = document.getElementById('arena-score');
  const hudBest = document.getElementById('arena-best');

  if (hudBest) hudBest.textContent = String(ARENA.highScore);

  const begin = () => {
    if (arenaPrefersReducedMotion()) return;
    cancelAnimationFrame(ARENA.raf);
    resetArena();
    ARENA.started = true;
    ARENA.running = true;
    ARENA.over = false;
    loopArena.last = performance.now();
    if (overlay) overlay.hidden = true;
    canvas.focus({ preventScroll: true });
    ARENA.raf = requestAnimationFrame(loopArena);
  };

  if (startBtn) startBtn.addEventListener('click', begin);

  canvas.addEventListener('keydown', (e) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ', 'a', 'd', 'A', 'D'].includes(e.key)) {
      e.preventDefault();
    }
    ARENA.keys[e.key] = true;
    if ((e.key === 'Enter' || e.key === ' ') && (!ARENA.running || ARENA.over)) begin();
  });
  canvas.addEventListener('keyup', (e) => {
    ARENA.keys[e.key] = false;
  });

  const setPointer = (clientX) => {
    const rect = canvas.getBoundingClientRect();
    ARENA.pointerX = ((clientX - rect.left) / rect.width) * ARENA.width;
  };

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    setPointer(e.clientX);
    if (!ARENA.running || ARENA.over) begin();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (e.buttons || e.pointerType === 'touch') setPointer(e.clientX);
  });
  canvas.addEventListener('pointerup', () => {
    ARENA.pointerX = null;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) ARENA.running = false;
  });

  drawArenaIdle();
  if (hudScore) hudScore.textContent = '0';
}

function resizeArenaCanvas() {
  const canvas = ARENA.canvas;
  if (!canvas) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = ARENA.width * dpr;
  canvas.height = ARENA.height * dpr;
  ARENA.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function resetArena() {
  ARENA.score = 0;
  ARENA.combo = 0;
  ARENA.lives = 3;
  ARENA.time = 0;
  ARENA.bullets = [];
  ARENA.threats = [];
  ARENA.particles = [];
  ARENA.spawnAcc = 0;
  ARENA.fireAcc = 0;
  ARENA.player.x = ARENA.width / 2;
  updateArenaHud();
}

function updateArenaHud() {
  const hudScore = document.getElementById('arena-score');
  const hudLives = document.getElementById('arena-lives');
  const hudCombo = document.getElementById('arena-combo');
  const hudBest = document.getElementById('arena-best');
  if (hudScore) hudScore.textContent = String(ARENA.score);
  if (hudLives) hudLives.textContent = '♥'.repeat(ARENA.lives) || '—';
  if (hudCombo) hudCombo.textContent = ARENA.combo > 1 ? `x${ARENA.combo}` : '';
  if (hudBest) hudBest.textContent = String(ARENA.highScore);
}

function loopArena(ts) {
  if (!ARENA.running) return;
  if (!loopArena.last) loopArena.last = ts || performance.now();
  const now = ts || performance.now();
  let dt = (now - loopArena.last) / 1000;
  loopArena.last = now;
  dt = Math.min(dt, 0.033);

  stepArena(dt);
  drawArena();
  ARENA.raf = requestAnimationFrame(loopArena);
}

loopArena.last = 0;

function stepArena(dt) {
  ARENA.time += dt;
  const p = ARENA.player;
  let vx = 0;
  if (ARENA.keys['ArrowLeft'] || ARENA.keys['a'] || ARENA.keys['A']) vx -= 1;
  if (ARENA.keys['ArrowRight'] || ARENA.keys['d'] || ARENA.keys['D']) vx += 1;
  p.x += vx * p.speed * dt;
  if (ARENA.pointerX != null) {
    const target = ARENA.pointerX;
    p.x += (target - p.x) * Math.min(1, dt * 12);
  }
  p.x = Math.max(24, Math.min(ARENA.width - 24, p.x));

  ARENA.fireAcc += dt;
  const fireRate = ARENA.keys[' '] ? 0.12 : 0.22;
  if (ARENA.autoFire && ARENA.fireAcc >= fireRate) {
    ARENA.fireAcc = 0;
    ARENA.bullets.push({ x: p.x, y: p.y - 10, vy: -420 });
  }

  ARENA.spawnAcc += dt;
  const spawnEvery = Math.max(0.42, 1.05 - ARENA.time * 0.03);
  if (ARENA.spawnAcc >= spawnEvery) {
    ARENA.spawnAcc = 0;
    const kind = THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)];
    ARENA.threats.push({
      x: 40 + Math.random() * (ARENA.width - 80),
      y: -20,
      vy: 70 + Math.random() * 50 + ARENA.time * 4,
      w: 72,
      h: 22,
      kind
    });
  }

  ARENA.bullets.forEach((b) => { b.y += b.vy * dt; });
  ARENA.bullets = ARENA.bullets.filter((b) => b.y > -20);

  ARENA.threats.forEach((t) => { t.y += t.vy * dt; });

  for (let i = ARENA.threats.length - 1; i >= 0; i--) {
    const t = ARENA.threats[i];
    let hit = false;
    for (let j = ARENA.bullets.length - 1; j >= 0; j--) {
      const b = ARENA.bullets[j];
      if (Math.abs(b.x - t.x) < t.w / 2 && Math.abs(b.y - t.y) < t.h) {
        hit = true;
        ARENA.bullets.splice(j, 1);
        burst(t.x, t.y, t.kind.color);
        break;
      }
    }
    if (hit) {
      ARENA.threats.splice(i, 1);
      ARENA.combo += 1;
      ARENA.score += 10 * Math.min(ARENA.combo, 8);
      continue;
    }
    if (t.y > ARENA.height - 36) {
      ARENA.threats.splice(i, 1);
      ARENA.combo = 0;
      ARENA.lives -= 1;
      burst(t.x, ARENA.height - 40, '#f43f5e');
      if (ARENA.lives <= 0) endArena();
    }
  }

  ARENA.particles.forEach((pt) => {
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.life -= dt;
  });
  ARENA.particles = ARENA.particles.filter((pt) => pt.life > 0);
  updateArenaHud();
}

function burst(x, y, color) {
  for (let i = 0; i < 14; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 40 + Math.random() * 120;
    ARENA.particles.push({
      x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.35 + Math.random() * 0.25, color
    });
  }
}

function endArena() {
  ARENA.running = false;
  ARENA.over = true;
  if (ARENA.score > ARENA.highScore) {
    ARENA.highScore = ARENA.score;
    localStorage.setItem('guardrail-arena-hs', String(ARENA.highScore));
  }
  const overlay = document.getElementById('arena-overlay');
  const title = document.getElementById('arena-overlay-title');
  const copy = document.getElementById('arena-overlay-copy');
  const btn = document.getElementById('arena-start');
  if (overlay) overlay.hidden = false;
  if (title) title.textContent = 'GUARDRAIL BREACHED';
  if (copy) copy.textContent = `Score ${ARENA.score} · Best ${ARENA.highScore}. The red team got through — patch and retry.`;
  if (btn) btn.textContent = 'Play again';
  updateArenaHud();
  drawArena();
}

function drawArenaIdle() {
  const ctx = ARENA.ctx;
  if (!ctx) return;
  drawArenaBackdrop(ctx, 0);
  ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
  ctx.fillRect(0, 0, ARENA.width, ARENA.height);
}

function drawArenaBackdrop(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, ARENA.height);
  g.addColorStop(0, '#070b14');
  g.addColorStop(1, '#0b1a2e');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ARENA.width, ARENA.height);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;
  const offset = (t * 40) % 28;
  for (let y = -28; y < ARENA.height; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y + offset);
    ctx.lineTo(ARENA.width, y + offset);
    ctx.stroke();
  }
  for (let x = 0; x < ARENA.width; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ARENA.height);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.fillRect(0, ARENA.height - 28, ARENA.width, 28);
}

function drawArena() {
  const ctx = ARENA.ctx;
  if (!ctx) return;
  drawArenaBackdrop(ctx, ARENA.time);

  ARENA.particles.forEach((pt) => {
    ctx.globalAlpha = Math.max(0, pt.life * 3);
    ctx.fillStyle = pt.color;
    ctx.fillRect(pt.x - 1.5, pt.y - 1.5, 3, 3);
  });
  ctx.globalAlpha = 1;

  ARENA.threats.forEach((t) => {
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    roundRect(ctx, t.x - t.w / 2, t.y - t.h / 2, t.w, t.h, 4);
    ctx.fill();
    ctx.strokeStyle = t.kind.color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = t.kind.color;
    ctx.font = '700 9px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(t.kind.label, t.x, t.y);
  });

  ARENA.bullets.forEach((b) => {
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 8;
    ctx.fillRect(b.x - 1.5, b.y - 8, 3, 10);
    ctx.shadowBlur = 0;
  });

  const p = ARENA.player;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.fillStyle = '#22d3ee';
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.moveTo(0, -16);
  ctx.lineTo(16, 10);
  ctx.lineTo(0, 4);
  ctx.lineTo(-16, 10);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

document.addEventListener('DOMContentLoaded', initGuardrailArena);
