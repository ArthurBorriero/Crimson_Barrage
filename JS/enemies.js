import { CANVAS, CONFIG, COLORS, SPRITES, SPRITE_SCALE } from './config.js';
import { randomBetween } from './utils.js';

export function updateEnemies(enemies, enemyBullets, enemySpeed, spawnCooldown, elapsedTime, dt) {
  const cfg = CONFIG.enemy;

  enemySpeed    = cfg.baseSpeed + elapsedTime * cfg.accel;
  spawnCooldown -= dt;

  if (spawnCooldown <= 0 && enemies.length < cfg.maxOnScreen) {
    enemies.push({
      x: randomBetween(cfg.spawnMarginX, CANVAS.W - cfg.spawnMarginX),
      y: -cfg.spawnOffsetY,
      shootCooldown: randomBetween(cfg.shootCooldownMin, cfg.shootCooldownMax),
    });
    spawnCooldown = Math.max(
      cfg.spawnMin,
      cfg.spawnInterval - elapsedTime * cfg.spawnDecel
    );
  }

  enemies.forEach(e => {
    e.y += enemySpeed;
    e.shootCooldown -= dt;
    if (e.shootCooldown <= 0) {
      enemyBullets.push({ x: e.x, y: e.y + cfg.bulletOffsetY });
      e.shootCooldown = randomBetween(cfg.shootCooldownMin, cfg.shootCooldownMax);
    }
  });

  const alive = enemies.filter(e => e.y < CANVAS.H + cfg.despawnOffsetY);

  return { enemies: alive, enemySpeed, spawnCooldown };
}

export function renderEnemies(ctx, enemies) {
  const pix   = SPRITES.enemy;
  const scale = SPRITE_SCALE;
  const rows  = pix.length;
  const cols  = pix[0].length;

  enemies.forEach(e => {
    const offX = e.x - (cols * scale) / 2;
    const offY = e.y - (rows * scale) / 2;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (pix[y][x]) {
          ctx.fillStyle = pix[y][x] === 2 ? COLORS.enemyGlow : COLORS.enemy;
          ctx.fillRect(offX + x * scale, offY + y * scale, scale, scale);
        }
      }
    }
  })}