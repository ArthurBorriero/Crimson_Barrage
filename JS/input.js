import { CANVAS, CONFIG } from './config.js';
import { resumeAudio } from './audio.js';

const keys      = {};
let touch       = null;
let touchHeld   = false; // dedo na tela sem arrastar = atirar
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
    touchHeld   = true;
    touch       = pos;
    onStart();
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    const pos = getTouchPos(e.touches[0], canvas);
    const dx  = pos.x - touchOrigin.x;
    const dy  = pos.y - touchOrigin.y;
    if (Math.sqrt(dx * dx + dy * dy) > CONFIG.input.movePx) {
      touchMoved = true;
      touchHeld  = false; // arrastar cancela o disparo
    }
    touch = pos;
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    e.preventDefault();
    touch      = null;
    touchHeld  = false;
    touchMoved = false;
  }, { passive: false });
}

// Retorna true se o disparo está ativo (tecla segurada ou toque estático)
export function isShooting() {
  return keys['Enter'] || touch !== null;
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
