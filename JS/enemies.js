import { CANVAS, CONFIG, COLORS, SPRITES, SPRITE_SCALE } from './config.js';
import { randomBetween } from './utils.js';

const ENEMY_TYPES = [
  {
    key:        'enemy',
    hp:         1,
    speedMult:  1.0,
    scoreValue: 10,
    spawnAfter: 0,
  },
  {
    key:        'enemyMedium',
    hp:         () => CONFIG.enemyMedium.hp,
    speedMult:  () => CONFIG.enemyMedium.speedMult,
    scoreValue: () => CONFIG.enemyMedium.scoreValue,
    spawnAfter: () => CONFIG.enemyMedium.spawnAfter,
  },
  {
    key:        'enemyLarge',
    hp:         () => CONFIG.enemyLarge.hp,
    speedMult:  () => CONFIG.enemyLarge.speedMult,
    scoreValue: () => CONFIG.enemyLarge.scoreValue,
    spawnAfter: () => CONFIG.enemyLarge.spawnAfter,
  },
];

function resolveVal(v) {
  return typeof v === 'function' ? v() : v;
}

function getTypeCfg(key) {
  return CONFIG[key] ?? CONFIG.enemy;
}

function getShootCooldown(key) {
  return getTypeCfg(key).shootCooldown;
}

function getBulletOffsetY(key) {
  return getTypeCfg(key).bulletOffsetY ?? CONFIG.enemy.bulletOffsetY;
}

function availableTypes(elapsedTime) {
  return ENEMY_TYPES.filter(t => elapsedTime >= resolveVal(t.spawnAfter));
}

function makeEnemy(typeObj, elapsedTime) {
  const cfg = CONFIG.enemy;
  return {
    x:             randomBetween(cfg.spawnMarginX, CANVAS.W - cfg.spawnMarginX),
    y:             -cfg.spawnOffsetY,
    type:          typeObj.key,
    hp:            resolveVal(typeObj.hp),
    maxHp:         resolveVal(typeObj.hp),
    speedMult:     resolveVal(typeObj.speedMult),
    scoreValue:    resolveVal(typeObj.scoreValue),
    shootCooldown: getShootCooldown(typeObj.key),
    bulletOffsetY: getBulletOffsetY(typeObj.key),
  };
}

export function updateEnemies(enemies, enemyBullets, enemySpeed, spawnCooldown, elapsedTime, dt) {
  const cfg = CONFIG.enemy;

  // Velocidade cresce com o tempo
  enemySpeed    = cfg.baseSpeed + elapsedTime * cfg.accel;
  spawnCooldown -= dt;

  if (spawnCooldown <= 0 && enemies.length < cfg.maxOnScreen) {
    const types    = availableTypes(elapsedTime);
    const baseType = types[0]; // sempre tipo 1 disponível

    const useGroup = elapsedTime >= cfg.groupSpawnAfter && Math.random() < cfg.groupSpawnChance;

    if (useGroup) {
      const count    = Math.random() < 0.5 ? 2 : 3;
      const hasType2 = count === 3 && types.length > 1;

      for (let i = 0; i < count; i++) {
        // Se count=3 e ultimo, spawna tipo 2
        const typeObj = (hasType2 && i === count - 1) ? types[1] : baseType;
        if (enemies.length < cfg.maxOnScreen) {
          enemies.push(makeEnemy(typeObj, elapsedTime));
        }
      }
    } else {
      const typeObj = types[Math.floor(Math.random() * types.length)];
      enemies.push(makeEnemy(typeObj, elapsedTime));
    }

    spawnCooldown = Math.max(
      cfg.spawnMin,
      cfg.spawnInterval - elapsedTime * cfg.spawnDecel
    );
  }

  // Velocidade das bullets proporcional à velocidade das naves
  // ratio = enemySpeed / baseSpeed → bullets crescem na mesma proporção
  const bulletSpeedRatio = enemySpeed / cfg.baseSpeed;
  const currentBulletSpeed = cfg.bulletBaseSpeed * bulletSpeedRatio;

  enemies.forEach(e => {
    e.y += enemySpeed * e.speedMult;
    e.shootCooldown -= dt;
    if (e.shootCooldown <= 0) {
      enemyBullets.push({
        x:     e.x,
        y:     e.y + e.bulletOffsetY,
        speed: currentBulletSpeed * e.speedMult,
      });
      e.shootCooldown = getShootCooldown(e.type);
    }
  });

  const alive = enemies.filter(e => e.y < CANVAS.H + cfg.despawnOffsetY);

  return { enemies: alive, enemySpeed, spawnCooldown };
}

export function damageEnemy(e) {
  e.hp--;
  return e.hp <= 0;
}

export function renderEnemies(ctx, enemies) {
  enemies.forEach(e => {
    const pix   = SPRITES[e.type] ?? SPRITES.enemy;
    const scale = SPRITE_SCALE;
    const rows  = pix.length;
    const cols  = pix[0].length;
    const offX  = e.x - (cols * scale) / 2;
    const offY  = e.y - (rows * scale) / 2;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (pix[y][x]) {
          ctx.fillStyle = pix[y][x] === 2 ? COLORS.enemyGlow : COLORS.enemy;
          ctx.fillRect(offX + x * scale, offY + y * scale, scale, scale);
        }
      }
    }
  });
}
