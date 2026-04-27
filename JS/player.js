import { CANVAS, CONFIG, COLORS, SPRITES, SPRITE_SCALE } from './config.js';
import { clamp } from './utils.js';
import { getMoveDir, getTouchDelta, isShooting } from './input.js';
import { playShoot } from './audio.js';

export function createPlayer() {
  return {
    x:             CANVAS.W / 2,
    y:             CANVAS.H - CONFIG.player.spawnOffsetY,
    speed:         CONFIG.player.speed,
    shootCooldown: 0,
  };
}

export function updatePlayer(player, playerBullets, dt) {
  const dir   = getMoveDir();
  const delta = getTouchDelta();
  const spd   = player.speed;

  // ── Movimento desktop ──
  if (dir.left)  player.x -= spd;
  if (dir.right) player.x += spd;
  if (dir.up)    player.y -= spd;
  if (dir.down)  player.y += spd;

  // ── Movimento mobile (delta direcional normalizado) ──
  if (delta.x !== 0 || delta.y !== 0) {
    player.x += delta.x * spd;
    player.y += delta.y * spd;
  }

  // ── Clamp dentro da tela ──
  const hw = (SPRITES.player[0].length * SPRITE_SCALE) / 2;
  const hh = (SPRITES.player.length    * SPRITE_SCALE) / 2;
  player.x = clamp(player.x, hw, CANVAS.W - hw);
  player.y = clamp(player.y, hh, CANVAS.H - hh);

  // ── Disparo ──
  player.shootCooldown -= dt;
  if (isShooting() && player.shootCooldown <= 0) {
    playerBullets.push({ x: player.x, y: player.y - CONFIG.player.bulletOffsetY });
    playShoot();
    player.shootCooldown = CONFIG.player.shootCooldown;
  }
}

export function renderPlayer(ctx, player) {
  const pix   = SPRITES.player;
  const scale = SPRITE_SCALE;
  const rows  = pix.length;
  const cols  = pix[0].length;
  const offX  = player.x - (cols * scale) / 2;
  const offY  = player.y - (rows * scale) / 2;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (pix[y][x]) {
        ctx.fillStyle = pix[y][x] === 2 ? COLORS.playerGlow : COLORS.player;
        ctx.fillRect(offX + x * scale, offY + y * scale, scale, scale);
      }
    }
  }
}