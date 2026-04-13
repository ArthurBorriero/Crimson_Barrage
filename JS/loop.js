import { CANVAS, CONFIG, COLORS, FONTS, STRINGS, SPRITES, SPRITE_SCALE } from './config.js';
import { formatTime } from './utils.js';
import { renderParticles } from './particles.js';
import { renderPlayer } from './player.js';
import { renderEnemies } from './enemies.js';

function renderBackground(ctx) {
  const cfg = CONFIG.stars;
  ctx.fillStyle = COLORS.background;
  ctx.fillRect(0, 0, CANVAS.W, CANVAS.H);
  ctx.fillStyle = COLORS.star;
  for (let i = 0; i < cfg.count; i++) {
    const sx = (i * cfg.seedA + cfg.seedB) % CANVAS.W;
    const sy = (i * cfg.seedC + cfg.seedD) % CANVAS.H;
    const ss = i % cfg.largeMod === 0 ? cfg.largeSize : cfg.smallSize;
    ctx.fillRect(sx, sy, ss, ss);
  }
}

function renderUI(ctx, texts) {
  texts.forEach(({ text, x, y, font, color, align }) => {
    ctx.font      = font  ?? FONTS.normal;
    ctx.fillStyle = color ?? COLORS.hudText;
    ctx.textAlign = align ?? 'left';
    ctx.fillText(text, x, y);
  });
}

export function renderStart(ctx) {
  const cx = CANVAS.W / 2;
  const cy = CANVAS.H / 2;
  const ui = CONFIG.ui;
  renderUI(ctx, [
    { text: STRINGS.title,     x: cx, y: cy + ui.startTitleY,  font: FONTS.title,  align: 'center' },
    { text: STRINGS.moveHint,  x: cx, y: cy + ui.startHintY,   align: 'center', color: COLORS.dimText },
    { text: STRINGS.startHint, x: cx, y: cy + ui.startPromptY, align: 'center' },
  ]);
}

export function renderGameOver(ctx, score, finalTime, elapsedTime) {
  const cx = CANVAS.W / 2;
  const cy = CANVAS.H / 2;
  const ui = CONFIG.ui;
  renderParticles(ctx);
  renderUI(ctx, [
    { text: STRINGS.gameOver,                                           x: cx, y: cy + ui.gameoverTitleY,  font: FONTS.title, align: 'center' },
    { text: STRINGS.scoreLabel + score,                                 x: cx, y: cy + ui.gameoverScoreY,  align: 'center', color: COLORS.gameoverText },
    { text: STRINGS.timeLabel + formatTime(finalTime ?? elapsedTime),   x: cx, y: cy + ui.gameoverTimeY,   align: 'center', color: COLORS.gameoverText },
    { text: STRINGS.tryAgain,                                           x: cx, y: cy + ui.gameoverPromptY, align: 'center' },
  ]);
}

export function renderPlaying(ctx, { player, playerBullets, enemyBullets, enemies, score, elapsedTime, playerAlive }) {
  const ui  = CONFIG.ui;
  const pbc = CONFIG.playerBullet;
  const ebc = CONFIG.enemyBullet;

  // Mundo
  playerBullets.forEach(b => {
    ctx.fillStyle = COLORS.playerBullet;
    ctx.fillRect(b.x - pbc.hitOffX, b.y - pbc.hitOffY, pbc.hitW, pbc.hitH);
  });
  enemyBullets.forEach(b => {
    ctx.fillStyle = COLORS.enemyBullet;
    ctx.fillRect(b.x - ebc.hitOffX, b.y - ebc.hitOffY, ebc.hitW, ebc.hitH);
  });
  renderEnemies(ctx, enemies);
  if (playerAlive) renderPlayer(ctx, player);
  renderParticles(ctx);

  // HUD por último
  renderUI(ctx, [
    { text: STRINGS.scoreLabel + score,                x: ui.hudX, y: ui.hudScoreY },
    { text: STRINGS.timeLabel + formatTime(elapsedTime), x: ui.hudX, y: ui.hudTimeY },
  ]);
}

export function render(ctx, state, gameState) {
  renderBackground(ctx);
  if (state === 'start')    return renderStart(ctx);
  if (state === 'gameover') return renderGameOver(ctx, gameState.score, gameState.finalTime, gameState.elapsedTime);
  if (state === 'playing')  return renderPlaying(ctx, gameState);
}