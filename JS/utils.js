export function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(Math.floor(seconds % 60)).padStart(2, '0');
  return m + ':' + s;
}

export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function collides(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
