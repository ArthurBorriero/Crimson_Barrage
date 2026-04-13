import { CONFIG, COLORS } from './config.js';
import { randomBetween } from './utils.js';

let pool = [];

export function spawnParticles(x, y) {
  const cfg = CONFIG.particles;
  for (let i = 0; i < cfg.count; i++) {
    const angle   = Math.random() * Math.PI * 2;
    const speed   = randomBetween(cfg.speedMin, cfg.speedMax);
    const maxLife = randomBetween(cfg.lifeMin, cfg.lifeMax);
    pool.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: maxLife,
      maxLife,
      size: randomBetween(cfg.sizeMin, cfg.sizeMax),
    });
  }
}

export function updateParticles(dt) {
  pool.forEach(p => {
    p.x    += p.vx * dt;
    p.y    += p.vy * dt;
    p.life -= dt;
  });
  pool = pool.filter(p => p.life > 0);
}

export function renderParticles(ctx) {
  pool.forEach(p => {
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle   = COLORS.particle;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  });
  ctx.globalAlpha = 1;
}

export function resetParticles() { pool = []; }
