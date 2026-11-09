'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { RoundTimer } = require('./timer.js');

function fixture() {
  let time = 0;
  return { timer: new RoundTimer(() => time), advance(ms) { time += ms; } };
}

test('initial state, first second, and minute boundaries', () => {
  const { timer, advance } = fixture();
  assert.deepEqual(timer.snapshot(), { state: 'ready', remaining: 120000, display: '02:00' });
  timer.start(); advance(1000);
  assert.equal(timer.snapshot().display, '01:59');
  advance(59000); assert.equal(timer.snapshot().display, '01:00');
  advance(1000); assert.equal(timer.snapshot().display, '00:59');
});

test('repeated Start does not restart or speed up a round', () => {
  const { timer, advance } = fixture();
  timer.start(); advance(400); timer.start(); timer.start(); advance(600);
  assert.equal(timer.snapshot().remaining, 119000);
});

test('pause preserves partial seconds and resume excludes paused time', () => {
  const { timer, advance } = fixture();
  timer.pause(); assert.equal(timer.snapshot().state, 'ready');
  timer.start(); advance(1250); timer.pause();
  advance(20000); timer.pause();
  assert.equal(timer.snapshot().remaining, 118750);
  timer.start(); advance(750);
  assert.equal(timer.snapshot().remaining, 118000);
  assert.equal(timer.snapshot().display, '01:58');
});

for (const state of ['ready', 'running', 'paused', 'complete']) {
  test(`Reset from ${state} returns to a stopped 02:00`, () => {
    const { timer, advance } = fixture();
    if (state !== 'ready') timer.start();
    if (state === 'paused') { advance(3500); timer.pause(); }
    if (state === 'complete') { advance(120000); timer.snapshot(); }
    timer.reset(); advance(5000);
    assert.deepEqual(timer.snapshot(), { state: 'ready', remaining: 120000, display: '02:00' });
    timer.start(); advance(1000); assert.equal(timer.snapshot().display, '01:59');
  });
}

test('delayed updates finish at zero without restart or negative time', () => {
  const { timer, advance } = fixture();
  timer.start(); advance(67500);
  assert.equal(timer.snapshot().remaining, 52500);
  advance(52500);
  assert.deepEqual(timer.snapshot(), { state: 'complete', remaining: 0, display: '00:00' });
  advance(200000); timer.start(); timer.pause();
  assert.equal(timer.snapshot().state, 'complete');
  assert.equal(timer.snapshot().display, '00:00');
});

test('button wiring, status, progress, and background refresh', () => {
  const vm = require('node:vm');
  const fs = require('node:fs');
  let time = 0;
  let update;
  let intervalCount = 0;
  const elements = new Map();
  const document = {
    body: { dataset: {} }, listeners: {},
    addEventListener(type, fn) { this.listeners[type] = fn; },
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, {
        textContent: '', listeners: {}, attributes: {},
        addEventListener(type, fn) { this.listeners[type] = fn; },
        setAttribute(key, value) { this.attributes[key] = value; }
      });
      return elements.get(id);
    }
  };
  const context = vm.createContext({ document, performance: { now: () => time },
    setInterval(fn) { intervalCount++; update = fn; } });
  vm.runInContext(fs.readFileSync('timer.js', 'utf8'), context);
  vm.runInContext(fs.readFileSync('app.js', 'utf8'), context);
  const el = id => elements.get(id);
  const click = id => el(id).listeners.click();
  assert.equal(el('countdown').textContent, '02:00');
  assert.equal(el('pause').disabled, true);
  click('start'); time += 1000; update();
  assert.equal(el('countdown').textContent, '01:59');
  assert.equal(el('start').disabled, true);
  assert.equal(el('progress').value, 1000);
  click('pause'); time += 3000; update();
  assert.equal(el('countdown').textContent, '01:59');
  assert.match(el('status').textContent, /Paused/);
  click('start'); time += 119000;
  document.listeners.visibilitychange();
  assert.equal(el('countdown').textContent, '00:00');
  assert.equal(el('status').textContent, 'Round complete');
  assert.equal(el('start').disabled, true);
  assert.equal(el('pause').disabled, true);
  click('reset');
  assert.equal(el('countdown').textContent, '02:00');
  assert.equal(el('start').disabled, false);
  assert.equal(el('progress').value, 0);
  assert.equal(intervalCount, 1);
});
