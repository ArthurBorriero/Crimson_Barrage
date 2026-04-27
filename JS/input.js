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
let touch        = null; // posição atual do dedo (para referência)
let touchOrigin  = null; // ponto onde o dedo tocou
let touchDelta   = { x: 0, y: 0 }; // direção normalizada do movimento

function getTouchPos(t, canvas) {
  const rect   = canvas.getBoundingClientRect();
  const scaleX = CANVAS.W / rect.width;
  const scaleY = CANVAS.H / rect.height;
  return {
    x: (t.clientX - rect.left) * scaleX,
    y: (t.clientY - rect.top)  * scaleY,
  };
}

function normalize(dx, dy) {
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < CONFIG.input.movePx) return { x: 0, y: 0 }; // dentro da deadzone
  return { x: dx / len, y: dy / len };
}

export function initInput(canvas, onStart) {
  // Desktop — space para iniciar
  document.addEventListener('keydown', e => {
    if (e.key === ' ') onStart();
  });

  // Mobile
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    resumeAudio();
    const pos  = getTouchPos(e.touches[0], canvas);
    touchOrigin = pos;
    touch       = pos;
    touchDelta  = { x: 0, y: 0 };
    onStart();
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const pos = getTouchPos(e.touches[0], canvas);
    touch     = pos;
    const dx  = pos.x - touchOrigin.x;
    const dy  = pos.y - touchOrigin.y;
    touchDelta = normalize(dx, dy);
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    touch      = null;
    touchOrigin = null;
    touchDelta  = { x: 0, y: 0 };
  }, { passive: false });
}

export function getTouchDelta() { return touchDelta; }
export function getTouch()      { return touch; }