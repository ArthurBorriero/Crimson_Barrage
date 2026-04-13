import { CANVAS, CONFIG } from './config.js';
import { resumeAudio } from './audio.js';

const keys   = {};
let _shoot   = false;
let touch    = null;
let touchStart  = 0;
let touchMoved  = false;
let touchOrigin = { x: 0, y: 0 };

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
  document.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (e.key === 'Enter') _shoot = true;
    if (e.key === ' ') onStart();
  });
  document.addEventListener('keyup', e => { keys[e.key] = false; });

  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    resumeAudio();
    const pos   = getTouchPos(e.touches[0], canvas);
    touchOrigin = pos;
    touchStart  = Date.now();
    touchMoved  = false;
    touch       = pos;
    onStart();
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const pos = getTouchPos(e.touches[0], canvas);
    const dx  = pos.x - touchOrigin.x;
    const dy  = pos.y - touchOrigin.y;
    if (Math.sqrt(dx * dx + dy * dy) > CONFIG.input.movePx) touchMoved = true;
    touch = pos;
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    if (!touchMoved && Date.now() - touchStart < CONFIG.input.tapMs) _shoot = true;
    touch      = null;
    touchMoved = false;
  }, { passive: false });
}

export function consumeShoot() {
  const s = _shoot;
  _shoot  = false;
  return s;
}

export function getMoveDir() {
  return {
    left:  keys['ArrowLeft']  || keys['a'] || keys['A'],
    right: keys['ArrowRight'] || keys['d'] || keys['D'],
    up:    keys['ArrowUp']    || keys['w'] || keys['W'],
    down:  keys['ArrowDown']  || keys['s'] || keys['S'],
  };
}

export function getTouch() { return touch; }
