'use strict';

class RoundTimer {
  constructor(now = () => performance.now()) {
    this.now = now;
    this.reset();
  }

  reset() {
    this.remaining = 120000;
    this.deadline = null;
    this.state = 'ready';
    return this.snapshot();
  }

  snapshot() {
    if (this.state === 'running') {
      this.remaining = Math.max(0, this.deadline - this.now());
      if (this.remaining === 0) {
        this.deadline = null;
        this.state = 'complete';
      }
    }
    const seconds = Math.ceil(this.remaining / 1000);
    return {
      state: this.state,
      remaining: this.remaining,
      display: `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
    };
  }

  start() {
    this.snapshot();
    if (this.state === 'ready' || this.state === 'paused') {
      this.deadline = this.now() + this.remaining;
      this.state = 'running';
    }
    return this.snapshot();
  }

  pause() {
    this.snapshot();
    if (this.state === 'running') {
      this.deadline = null;
      this.state = 'paused';
    }
    return this.snapshot();
  }
}

if (typeof module !== 'undefined') module.exports = { RoundTimer };
