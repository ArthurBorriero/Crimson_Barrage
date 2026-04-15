import { CANVAS, CONFIG, COLORS, SPRITES, SPRITE_SCALE } from './config.js';
import { collides } from './utils.js';
import { resumeAudio, playExplode, playGameOver } from './audio.js';
import { initInput } from './input.js';
import { createPlayer, updatePlayer } from './player.js';
import { updateEnemies, damageEnemy } from './enemies.js';
import { spawnParticles, updateParticles, resetParticles } from './particles.js';
import { render } from './loop.js';
 
// ── CANVAS SETUP ──
const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');
const DPR    = window.devicePixelRatio || 1;
 
canvas.width        = CANVAS.W * DPR;
canvas.height       = CANVAS.H * DPR;
canvas.style.width  = CANVAS.W + 'px';
canvas.style.height = CANVAS.H + 'px';
ctx.scale(DPR, DPR);
 
// ── ESTADO DO JOGO ──
let state = 'start'; // 'start' | 'playing' | 'gameover'
 
let player;
let playerBullets;
let enemies;
let enemyBullets;
let score;
let elapsedTime;
let finalTime;
let spawnCooldown;
let enemySpeed;
let gameOverTriggered;
let playerAlive;
 
function resetGame() {
  player            = createPlayer();
  playerBullets     = [];
  enemies           = [];
  enemyBullets      = [];
  score             = 0;
  elapsedTime       = 0;
  finalTime         = null;
  spawnCooldown     = CONFIG.enemy.spawnInterval;
  enemySpeed        = CONFIG.enemy.baseSpeed;
  gameOverTriggered = false;
  playerAlive       = true;
  resetParticles();
}

function triggerGameOver() {
  if (gameOverTriggered) return;
  gameOverTriggered = true;
  state = 'gameover';
  finalTime = elapsedTime;
  playerAlive = false;
  playGameOver();
}

function handleStart() {
  resumeAudio();
  if (state === 'start' || state === 'gameover') {
    state = 'playing';
    resetGame();
  }
}

// ── COLISÕES ──
function updateCollisions() {
  const pw  = SPRITES_SIZE(CONFIG, 'player', 'w');
  const ph  = SPRITES_SIZE(CONFIG, 'player', 'h');
  const pbc = CONFIG.playerBullet;
  const ebc = CONFIG.enemyBullet;

  playerBullets.forEach(b => {
    enemies.forEach(e => {
      const pix = SPRITES[e.type] ?? SPRITES.enemy;
      const ew  = pix[0].length * SPRITE_SCALE;
      const eh  = pix.length * SPRITE_SCALE;

      if (collides(
        b.x - pbc.hitOffX,
        b.y - pbc.hitOffY,
        pbc.hitW,
        pbc.hitH,

        e.x - ew / 2,
        e.y - eh / 2,
        ew,
        eh
      )) {
        b.dead = true;

        if (damageEnemy(e)) {
          e.dead = true;
          spawnParticles(e.x, e.y);
          playExplode();
          score += e.scoreValue;
        }
      }
    });
  });

  enemies.forEach(e => {
    const pix = SPRITES[e.type] ?? SPRITES.enemy;
    const ew  = pix[0].length * SPRITE_SCALE;
    const eh  = pix.length * SPRITE_SCALE;

    if (collides(
      player.x - pw / 2,
      player.y - ph / 2,
      pw,
      ph,

      e.x - ew / 2,
      e.y - eh / 2,
      ew,
      eh
    )) {
      e.dead = true;
      triggerGameOver();
    }
  });

  enemyBullets.forEach(b => {
    if (collides(
      b.x - ebc.hitOffX,
      b.y - ebc.hitOffY,
      ebc.hitW,
      ebc.hitH,

      player.x - pw / 2,
      player.y - ph / 2,
      pw,
      ph
    )) {
      b.dead = true;
      triggerGameOver();
    }
  });

  playerBullets = playerBullets.filter(b => !b.dead);
  enemyBullets  = enemyBullets.filter(b  => !b.dead);
  enemies       = enemies.filter(e       => !e.dead);
}

// ── UPDATE BALAS ──
function updateBullets(dt) {
  const pbSpd = CONFIG.playerBullet.speed;
 
  playerBullets.forEach(b => b.y -= pbSpd * dt);
  enemyBullets.forEach(b  => b.y += b.speed * dt);
 
  playerBullets = playerBullets.filter(b => b.y > -10);
  enemyBullets  = enemyBullets.filter(b  => b.y < CANVAS.H + 10);
}
 
// ── UPDATE PRINCIPAL ──
function update(dt) {
  if (state !== 'playing') return;
  elapsedTime += dt;
 
  updatePlayer(player, playerBullets, dt);
 
  const result = updateEnemies(enemies, enemyBullets, enemySpeed, spawnCooldown, elapsedTime, dt);
  enemies       = result.enemies;
  enemySpeed    = result.enemySpeed;
  spawnCooldown = result.spawnCooldown;
 
  updateBullets(dt);
  updateCollisions();
  updateParticles(dt);
}
 
// ── LOOP PRINCIPAL ──
let lastTime = null;
 
function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = Math.min((timestamp - lastTime) / 1000, CONFIG.loop.maxDt);
  lastTime = timestamp;
 
  update(dt);
  render(ctx, state, { player, playerBullets, enemyBullets, enemies, score, elapsedTime, finalTime, playerAlive });
 
  requestAnimationFrame(loop);
}
 
// ── INICIALIZAÇÃO ──
initInput(canvas, handleStart);
 
function SPRITES_SIZE(_, name, dim) {
  const pix = SPRITES[name];
  return dim === 'w' ? pix[0].length * SPRITE_SCALE : pix.length * SPRITE_SCALE;
}
 
document.fonts.load(`10px ${COLORS.uiFont}`).then(() => {
  requestAnimationFrame(loop);
});