import { CANVAS, CONFIG } from './config.js';
import { resumeAudio } from './audio.js';

// ── INPUT DESKTOP ──
const keys = {};

document.addEventListener('keydown', e => { keys[e.key] = true; });
document.addEventListener('keyup',   e => { keys[e.key] = false; });

export function getMoveDir() {
  return {
    left:  keys['ArrowLeft']  || keys['a'] || keys['A'],
    right: keys['ArrowRight'] || keys['d'] || keys['D'],
    up:    keys['ArrowUp']    || keys['w'] || keys['W'],
    down:  keys['ArrowDown']  || keys['s'] || keys['S'],
  };
}

export function isShooting() {
  return keys['Enter'] || touch !== null;
}

// ── INPUT MOBILE ──
let touch       = null;
let touchOrigin = { x: 0, y: 0 };
let touchMoved  = false;

function getTouchPos(t, canvas) {
  const rect   = canvas.getBoundingClientRect();
  const scaleX = CANVAS.W / rect.width;
  const scaleY = CANVAS.H / rect.height;
  return {
    x: (t.clientX - rect.left) * scaleX,
    y: (t.clientY - rect.top)  * scaleY,
  };
}

export function initInput(canvas, onStart) {
  // Desktop — space para iniciar
  document.addEventListener('keydown', e => {
    if (e.key === ' ') onStart();
  });

  // Mobile — touchstart sempre atualiza posição, mesmo sem tirar o dedo
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    resumeAudio();
    const pos   = getTouchPos(e.touches[0], canvas);
    touchOrigin = pos;
    touchMoved  = false;
    touch       = pos;
    onStart();
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const pos = getTouchPos(e.touches[0], canvas);
    const dx  = pos.x - touchOrigin.x;
    const dy  = pos.y - touchOrigin.y;
    if (Math.sqrt(dx * dx + dy * dy) > CONFIG.input.movePx) {
      touchMoved  = true;
      touchOrigin = pos; // atualiza origem para detectar quando parou
    } else {
      touchMoved = false; // dedo parou de mover
    }
    touch = pos;
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    touch      = null;
    touchMoved = false;
  }, { passive: false });
}

export function getTouch() { return touch; }