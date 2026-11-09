'use strict';

const timer = new RoundTimer();
const display = document.getElementById('countdown');
const status = document.getElementById('status');
const start = document.getElementById('start');
const pause = document.getElementById('pause');
const progress = document.getElementById('progress');
const messages = {
  ready: 'Ready for your round',
  running: 'Round in progress',
  paused: 'Paused — take your time',
  complete: 'Round complete'
};

function render() {
  const view = timer.snapshot();
  display.textContent = view.display;
  if (status.textContent !== messages[view.state]) status.textContent = messages[view.state];
  document.body.dataset.state = view.state;
  start.disabled = view.state === 'running' || view.state === 'complete';
  pause.disabled = view.state !== 'running';
  progress.value = 120000 - view.remaining;
  progress.setAttribute('aria-valuetext', `${view.display} remaining`);
}

start.addEventListener('click', () => { timer.start(); render(); });
pause.addEventListener('click', () => { timer.pause(); render(); });
document.getElementById('reset').addEventListener('click', () => { timer.reset(); render(); });
document.addEventListener('visibilitychange', render);
// One display updater; the timer uses elapsed time, not a count of these calls.
setInterval(render, 100);
render();
