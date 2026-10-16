/**
 * XPIN-Desktop · Deterministic Timeline Evaluator
 * Guarantees that evaluating at time T produces identical state, enabling frame-accurate seeking and export.
 */

export class Timeline {
  constructor(options = {}) {
    this.duration = options.duration || 12.0; // Total duration in seconds
    this.fps = options.fps || 24;            // Cinematic framerate (24 / 30 / 60)
    this.currentTime = 0;
    this.isPlaying = false;
    this.isLooping = options.loop !== undefined ? options.loop : true;
    this.markers = options.markers || [];     // Markers for voiceover sync: [{ time: 3.5, label: '芯片聚焦' }]
    this.onUpdateCallbacks = new Set();
    this.rafId = null;
    this.lastTimestamp = null;
  }

  get totalFrames() {
    return Math.floor(this.duration * this.fps);
  }

  get currentFrame() {
    return Math.floor(this.currentTime * this.fps);
  }

  /**
   * Returns SMPTE style Timecode: HH:MM:SS:FF
   */
  getTimecode(timeInSeconds = this.currentTime) {
    const totalFrames = Math.floor(timeInSeconds * this.fps);
    const frames = totalFrames % this.fps;
    const totalSeconds = Math.floor(timeInSeconds);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const hours = Math.floor(totalSeconds / 3600);

    const pad = n => String(n).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
  }

  onUpdate(callback) {
    this.onUpdateCallbacks.add(callback);
    return () => this.onUpdateCallbacks.delete(callback);
  }

  seek(timeInSeconds) {
    this.currentTime = Math.max(0, Math.min(this.duration, timeInSeconds));
    this.notifyUpdate();
  }

  seekFrame(frameIndex) {
    const time = frameIndex / this.fps;
    this.seek(time);
  }

  stepFrame(delta = 1) {
    const targetFrame = this.currentFrame + delta;
    this.seekFrame(targetFrame);
  }

  play() {
    if (this.isPlaying) return;
    if (this.currentTime >= this.duration) {
      this.currentTime = 0;
    }
    this.isPlaying = true;
    this.lastTimestamp = performance.now();
    this.tick = this.tick.bind(this);
    this.rafId = requestAnimationFrame(this.tick);
    this.notifyUpdate();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.lastTimestamp = null;
    this.notifyUpdate();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  tick(timestamp) {
    if (!this.isPlaying) return;

    if (this.lastTimestamp !== null) {
      const deltaSeconds = (timestamp - this.lastTimestamp) / 1000;
      this.currentTime += deltaSeconds;

      if (this.currentTime >= this.duration) {
        if (this.isLooping) {
          this.currentTime = 0;
        } else {
          this.currentTime = this.duration;
          this.pause();
          return;
        }
      }
      this.notifyUpdate();
    }

    this.lastTimestamp = timestamp;
    if (this.isPlaying) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  }

  notifyUpdate() {
    for (const cb of this.onUpdateCallbacks) {
      try {
        cb(this.currentTime, this.currentFrame, this);
      } catch (err) {
        console.error('Timeline update callback error:', err);
      }
    }
  }
}
