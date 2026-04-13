// ── RESOLUÇÃO INTERNA ──
export const CANVAS = {
  W: 480,
  H: 640,
};

// ── CONFIG ──
export const CONFIG = {
  player: {
    speed:          4,
    shootCooldown:  0.25,
    spawnOffsetY:   80,
    bulletOffsetY:  20,
    touchDeadzone:  4,
    touchSpeedMult: 2,
  },
  playerBullet: {
    speed:   300,
    hitW:    4,
    hitH:    8,
    hitOffX: 2,
    hitOffY: 2,
  },
  enemy: {
    baseSpeed:        1.5,
    accel:            0.02,
    spawnInterval:    2.0,
    spawnMin:         1.0,
    spawnDecel:       0.008,
    maxOnScreen:      8,
    shootCooldownMin: 0.6,
    shootCooldownMax: 1.4,
    bulletSpeed:      190,
    bulletSpeedMult:  60,
    spawnMarginX:     30,
    spawnOffsetY:     20,
    bulletOffsetY:    16,
    despawnOffsetY:   40,
  },
  enemyBullet: {
    hitW:    4,
    hitH:    8,
    hitOffX: 2,
    hitOffY: 2,
  },
  particles: {
    count:    12,
    speedMin: 30,
    speedMax: 120,
    lifeMin:  0.6,
    lifeMax:  1.2,
    sizeMin:  1,
    sizeMax:  4,
  },
  stars: {
    count:     60,
    seedA: 137, seedB: 11,
    seedC:  97, seedD: 53,
    largeMod:  3,
    largeSize: 2,
    smallSize: 1,
  },
  loop: {
    maxDt: 0.05,
  },
  ui: {
    hudX:            16,
    hudScoreY:       28,
    hudTimeY:        48,
    startTitleY:    -60,
    startHintY:       0,
    startPromptY:    64,
    gameoverTitleY: -80,
    gameoverScoreY: -40,
    gameoverTimeY:  -12,
    gameoverPromptY: 40,
    scorePerKill:    10,
    gameoverDelay:   0.6,
  },
  input: {
    tapMs:  150,
    movePx: 10,
  },
};

// ── CORES ──
export const COLORS = {
  background:   '#000000',
  star:         '#ffffff22',
  player:       '#ffffff',
  playerGlow:   '#0044ff',
  enemy:        '#ffffff',
  enemyGlow:    '#ff4444',
  playerBullet: '#ffffff',
  enemyBullet:  '#ff4444',
  particle:     '#ffffff',
  hudText:      '#ffffff',
  dimText:      '#555555',
  gameoverText: '#aaaaaa',
  uiFont:       '"Press Start 2P"',
};

// ── FONTES ──
export const FONTS = {
  title:  `16px ${COLORS.uiFont}`,
  normal: `10px ${COLORS.uiFont}`,
};

// ── STRINGS ──
export const STRINGS = {
  title:       'CRIMSON BARRAGE',
  moveHint:    'WASD OR ARROW KEYS TO MOVE',
  startHint:   '[ SPACE ] TO START',
  gameOver:    'GAME OVER',
  tryAgain:    '[ SPACE ] TO TRY AGAIN',
  scoreLabel:  'SCORE: ',
  timeLabel:   'TIME: ',
};

// ── SPRITES ──
export const SPRITE_SCALE = 4;

export const SPRITES = {
  player: [
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,0,1,0,0,0,0],
    [0,0,0,1,2,1,0,0,0],
    [0,0,0,1,2,1,0,0,0],
    [0,0,1,1,2,1,1,0,0],
    [0,0,1,1,2,1,1,0,0],
    [0,1,1,1,1,1,1,1,0],
    [0,1,0,0,1,0,0,1,0],
    [0,1,0,0,1,0,0,1,0],
  ],
  enemy: [
    [0,0,0,2,0,0,0],
    [1,0,0,2,0,0,1],
    [1,0,1,1,1,0,1],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
    [0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0],
  ],
};
