const actx = new (window.AudioContext || window.webkitAudioContext)();

export function resumeAudio() {
  actx.resume();
}

export function playShoot() {
  const osc  = actx.createOscillator();
  const gain = actx.createGain();
  osc.connect(gain); gain.connect(actx.destination);
  osc.type = 'square';
  osc.frequency.setValueAtTime(880, actx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, actx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.3, actx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.1);
  osc.start(); osc.stop(actx.currentTime + 0.1);
}

export function playExplode() {
  const bufSize = actx.sampleRate * 0.6;
  const buffer  = actx.createBuffer(1, bufSize, actx.sampleRate);
  const data    = buffer.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

  const source = actx.createBufferSource();
  source.buffer = buffer;
  const filter = actx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(600, actx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(40, actx.currentTime + 0.6);
  const gain = actx.createGain();
  gain.gain.setValueAtTime(1.2, actx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.6);

  const osc     = actx.createOscillator();
  const oscGain = actx.createGain();
  osc.connect(oscGain); oscGain.connect(actx.destination);
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(180, actx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(30, actx.currentTime + 0.4);
  oscGain.gain.setValueAtTime(0.8, actx.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.4);

  source.connect(filter); filter.connect(gain); gain.connect(actx.destination);
  source.start(); osc.start(); osc.stop(actx.currentTime + 0.4);
}

export function playGameOver() {
  const notes = [
    { freq: 311, time: 0.0 }, { freq: 277, time: 0.3 },
    { freq: 233, time: 0.6 }, { freq: 196, time: 0.9 },
    { freq: 155, time: 1.3 },
  ];

  notes.forEach(({ freq, time }) => {
    const osc1  = actx.createOscillator();
    const gain1 = actx.createGain();
    osc1.connect(gain1); gain1.connect(actx.destination);
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, actx.currentTime + time);
    gain1.gain.setValueAtTime(0.35, actx.currentTime + time);
    gain1.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + time + 0.35);
    osc1.start(actx.currentTime + time);
    osc1.stop(actx.currentTime + time + 0.35);

    const osc2  = actx.createOscillator();
    const gain2 = actx.createGain();
    osc2.connect(gain2); gain2.connect(actx.destination);
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(freq / 2, actx.currentTime + time + 0.07);
    gain2.gain.setValueAtTime(0.15, actx.currentTime + time + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + time + 0.4);
    osc2.start(actx.currentTime + time + 0.07);
    osc2.stop(actx.currentTime + time + 0.4);
  });

  const final     = actx.createOscillator();
  const finalGain = actx.createGain();
  final.connect(finalGain); finalGain.connect(actx.destination);
  final.type = 'sawtooth';
  final.frequency.setValueAtTime(110, actx.currentTime + 1.7);
  final.frequency.exponentialRampToValueAtTime(55, actx.currentTime + 2.4);
  finalGain.gain.setValueAtTime(0.4, actx.currentTime + 1.7);
  finalGain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 2.4);
  final.start(actx.currentTime + 1.7);
  final.stop(actx.currentTime + 2.4);
}
