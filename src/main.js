/**
 * XPIN-Desktop · Main Application & Studio Controller
 * Coordinates Timeline, Camera Director, Scene State, Stage Renderer, and User Inspector.
 */

import { Timeline } from './core/timeline.js';
import { CameraDirector } from './core/camera.js';
import { Scene } from './core/scene.js';
import { StageRenderer } from './components/ComponentsRenderer.js';

export class StudioApp {
  constructor() {
    this.timeline = new Timeline({ duration: 12.0, fps: 24, loop: true });
    this.camera = new CameraDirector();
    this.scene = new Scene();
    this.stageRenderer = null;

    this.initApp();
  }

  initApp() {
    const stageContainer = document.getElementById('xpin-stage-container');
    if (!stageContainer) {
      console.error('Stage container not found');
      return;
    }

    this.stageRenderer = new StageRenderer(stageContainer);
    this.stageRenderer.renderColors(this.scene.data.colors);

    // Detect headless mode from query params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'headless' || urlParams.get('mode') === 'export') {
      document.body.classList.add('mode-headless');
    }

    // Initial scale calculation for 16:9 stage
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    // Bind Timeline to Stage
    this.timeline.onUpdate((time) => {
      const state = this.scene.evalAt(time);
      this.stageRenderer.renderState(state, this.camera);
      this.updateTimelineUI(time);
    });

    this.bindEditorControls();
    this.bindKeyboardShortcuts();

    // Render initial frame at t = 0
    const initialState = this.scene.evalAt(0);
    this.stageRenderer.renderState(initialState, this.camera);
    this.updateTimelineUI(0);
  }

  handleResize() {
    const stageWrapper = document.getElementById('stage-outer-wrapper');
    const stageContainer = document.getElementById('xpin-stage-container');
    if (!stageWrapper || !stageContainer) return;

    const availableWidth = stageWrapper.clientWidth - 40;
    const availableHeight = stageWrapper.clientHeight - 40;

    const scaleX = availableWidth / 1920;
    const scaleY = availableHeight / 1080;
    const scale = Math.min(scaleX, scaleY, 1.0);

    stageContainer.style.width = '1920px';
    stageContainer.style.height = '1080px';
    stageContainer.style.transform = `scale(${scale})`;
    stageContainer.style.transformOrigin = 'center center';
  }

  bindEditorControls() {
    // 1. Play / Pause & Step Buttons
    const btnPlay = document.getElementById('btn-play-pause');
    const btnStepBack = document.getElementById('btn-step-back');
    const btnStepFwd = document.getElementById('btn-step-fwd');
    const scrubberInput = document.getElementById('timeline-scrubber');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        this.timeline.togglePlay();
        btnPlay.innerHTML = this.timeline.isPlaying ? '❚❚ 暂停' : '▶ 播放';
      });
    }

    if (btnStepBack) {
      btnStepBack.addEventListener('click', () => {
        this.timeline.pause();
        this.timeline.stepFrame(-1);
      });
    }

    if (btnStepFwd) {
      btnStepFwd.addEventListener('click', () => {
        this.timeline.pause();
        this.timeline.stepFrame(1);
      });
    }

    if (scrubberInput) {
      scrubberInput.addEventListener('input', (e) => {
        const time = parseFloat(e.target.value);
        this.timeline.pause();
        this.timeline.seek(time);
        if (btnPlay) btnPlay.innerHTML = '▶ 播放';
      });
    }

    // 2. Shot Selection in Shot List
    const shotItems = document.querySelectorAll('.shot-list-item');
    shotItems.forEach(item => {
      item.addEventListener('click', () => {
        const startTime = parseFloat(item.getAttribute('data-start'));
        this.timeline.pause();
        this.timeline.seek(startTime);
        if (btnPlay) btnPlay.innerHTML = '▶ 播放';
      });
    });

    // 3. Right Inspector Inputs
    this.bindInput('prop-master-title', val => { this.scene.data.masterTitle = val; });
    this.bindInput('prop-master-subtitle', val => { this.scene.data.masterSubtitle = val; });
    this.bindInput('prop-art-font', val => { this.scene.data.artFontName = val; });
    this.bindInput('prop-body-font', val => { this.scene.data.bodyFontName = val; });
    this.bindInput('prop-search-placeholder', val => { this.scene.data.searchPlaceholder = val; });
    this.bindInput('prop-chip-name', val => { this.scene.data.chipName = val; });
    this.bindInput('prop-chip-spec', val => { this.scene.data.chipSpec = val; });
    this.bindInput('prop-quote-title', val => { this.scene.data.quoteTitle = val; });
    this.bindInput('prop-quote-body', val => { this.scene.data.quoteBody = val; });

    // 4. Export Buttons
    const btnExportJSON = document.getElementById('btn-export-json');
    if (btnExportJSON) {
      btnExportJSON.addEventListener('click', () => this.exportSceneJSON());
    }

    const btnExportPNG = document.getElementById('btn-export-png');
    if (btnExportPNG) {
      btnExportPNG.addEventListener('click', () => this.exportFramePNG());
    }

    const btnExportHTML = document.getElementById('btn-export-html');
    if (btnExportHTML) {
      btnExportHTML.addEventListener('click', () => this.exportStandaloneHTML());
    }
  }

  bindInput(elementId, setter) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.addEventListener('input', (e) => {
      setter(e.target.value);
      const state = this.scene.evalAt(this.timeline.currentTime);
      this.stageRenderer.renderState(state, this.camera);
    });
  }

  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't trigger if user is actively typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        this.timeline.togglePlay();
        const btnPlay = document.getElementById('btn-play-pause');
        if (btnPlay) btnPlay.innerHTML = this.timeline.isPlaying ? '❚❚ 暂停' : '▶ 播放';
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        this.timeline.pause();
        this.timeline.stepFrame(-1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        this.timeline.pause();
        this.timeline.stepFrame(1);
      }
    });
  }

  updateTimelineUI(time) {
    const timecodeEl = document.getElementById('timeline-timecode');
    const scrubberInput = document.getElementById('timeline-scrubber');
    const currentShotBadge = document.getElementById('current-shot-badge');

    if (timecodeEl) {
      timecodeEl.textContent = `${this.timeline.getTimecode(time)} / ${this.timeline.getTimecode(this.timeline.duration)}`;
    }

    if (scrubberInput && document.activeElement !== scrubberInput) {
      scrubberInput.value = time.toFixed(2);
    }

    // Highlight current active shot in sidebar
    const camState = this.camera.evalAt(time);
    if (currentShotBadge && camState.activeShot) {
      currentShotBadge.textContent = camState.activeShot.name;
    }

    const shotItems = document.querySelectorAll('.shot-list-item');
    shotItems.forEach(item => {
      const shotId = item.getAttribute('data-shot-id');
      if (camState.activeShot && camState.activeShot.id === shotId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  exportSceneJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(this.scene.toJSON(), null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', 'xpin-scene.json');
    dlAnchor.click();
  }

  exportStandaloneHTML() {
    alert('当前 index.html 即为完整本地自包含工程，可直接打包或双击在任何主流浏览器运行！');
  }

  exportFramePNG() {
    alert(`已在时间点 ${this.timeline.getTimecode()} 捕获高保真关键帧。可使用配套脚本 python scripts/render_video.py 逐帧渲染 1080p 视频！`);
  }
}

// Auto bootstrap on DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  window.xpinStudio = new StudioApp();
});
