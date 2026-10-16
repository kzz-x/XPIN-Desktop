/**
 * XPIN-Desktop · Scene Graph & State Manager
 * Holds full declarative scene data, components configuration, and deterministic evaluation.
 */

import { lerp, getTimelineProgress, Easing } from './interpolator.js';

export class Scene {
  constructor(initialData = {}) {
    this.title = initialData.title || 'X.PIN 硬件部 IOS Core 影视镜头';
    this.aspectRatio = initialData.aspectRatio || '16:9';
    this.width = 1920;
    this.height = 1080;

    // Editable text & content properties
    this.data = {
      masterTitle: initialData.masterTitle || '硬件部',
      masterSubtitle: initialData.masterSubtitle || 'X.PIN · IOS Core',
      artFontName: initialData.artFontName || '标小智无界黑',
      bodyFontName: initialData.bodyFontName || '苹方UI-简',
      searchPlaceholder: initialData.searchPlaceholder || '差评硬件部新视觉',
      quoteTitle: initialData.quoteTitle || '金句',
      quoteBody: initialData.quoteBody || '对话框样式，就是对话框样式，也是一种对话框的样式。',
      chapterTitle: initialData.chapterTitle || '第二章标题',
      chapterSubtitle: initialData.chapterSubtitle || '小标题文案',
      chipName: initialData.chipName || 'Apple A18 Pro',
      chipSpec: initialData.chipSpec || '台积电 3nm N3P · 6核 CPU / 6核 GPU · 16核神经网络引擎',
      chartDataValue: initialData.chartDataValue || '235条',
      audioDuration: initialData.audioDuration || '28s',
      colors: initialData.colors || [
        { hex: '#F96257', label: '珊瑚红' },
        { hex: '#FDBC2C', label: '暖金琥珀' },
        { hex: '#51A7F9', label: '天青蓝' },
        { hex: '#2BC83D', label: '苹果绿' }
      ]
    };

    // Component visibility toggles
    this.visibility = {
      menuBar: true,
      contextMenu: true,
      chartCard: true,
      folder3D: true,
      audioCard: true,
      colorPalette: true,
      dockSearch: true,
      masterWindow: true,
      photoViewer: true,
      arcChapter: true,
      quoteBubble: true,
      cursor: true
    };

    // Semantic Actions Timeline cues:
    // Defines key action intervals and positions
    this.actionTracks = [
      {
        id: 'mouse-move-to-folder',
        type: 'cursor',
        startTime: 0.5,
        endTime: 2.3,
        from: { x: 960, y: 700 },
        to:   { x: 390, y: 750 },
        easing: Easing.easeInOutCubic
      },
      {
        id: 'mouse-double-click-folder',
        type: 'click',
        time: 2.5,
        target: 'folder3D'
      },
      {
        id: 'open-photo-viewer',
        type: 'window-open',
        startTime: 2.6,
        endTime: 3.4,
        windowId: 'photoViewer'
      },
      {
        id: 'cursor-move-to-soc',
        type: 'cursor',
        startTime: 3.6,
        endTime: 5.2,
        from: { x: 390, y: 750 },
        to:   { x: 1120, y: 440 },
        easing: Easing.easeInOutCubic
      },
      {
        id: 'chip-zoom-region',
        type: 'image-zoom',
        startTime: 4.8,
        endTime: 7.2,
        zoomLevel: 2.4,
        pan: { x: -280, y: -160 }
      },
      {
        id: 'reveal-chip-annotation',
        type: 'annotation',
        startTime: 6.2,
        endTime: 8.5
      },
      {
        id: 'transition-to-quote-bubble',
        type: 'morph-stage',
        startTime: 8.5,
        endTime: 10.8
      }
    ];
  }

  /**
   * Evaluates scene element states deterministically at time t
   */
  evalAt(time) {
    // 1. Mouse Cursor position & click state
    let cursor = { x: 960, y: 700, clicking: false, clickProgress: 0 };
    if (time < 2.3) {
      const p = getTimelineProgress(time, 0.5, 2.3, Easing.easeInOutCubic);
      cursor.x = lerp(960, 390, p);
      cursor.y = lerp(700, 750, p);
    } else if (time >= 2.3 && time < 3.6) {
      cursor.x = 390;
      cursor.y = 750;
      if (time >= 2.45 && time <= 2.85) {
        cursor.clicking = true;
        cursor.clickProgress = getTimelineProgress(time, 2.45, 2.85, Easing.smoothStep);
      }
    } else if (time >= 3.6 && time < 5.4) {
      const p = getTimelineProgress(time, 3.6, 5.4, Easing.easeInOutCubic);
      cursor.x = lerp(390, 1120, p);
      cursor.y = lerp(750, 440, p);
    } else if (time >= 5.4 && time < 8.5) {
      cursor.x = 1120;
      cursor.y = 440;
      if (time >= 5.5 && time <= 5.8) {
        cursor.clicking = true;
        cursor.clickProgress = getTimelineProgress(time, 5.5, 5.8, Easing.smoothStep);
      }
    } else {
      // Resting position during quote transition
      const p = getTimelineProgress(time, 8.5, 10.0, Easing.easeInOutCubic);
      cursor.x = lerp(1120, 1500, p);
      cursor.y = lerp(440, 850, p);
    }

    // 2. Photo Viewer Window state (opens after double click)
    let photoWindowState = {
      visible: false,
      opacity: 0,
      scale: 0.85,
      yOffset: 40,
      imageZoom: 1.0,
      imagePanX: 0,
      imagePanY: 0,
      annotationOpacity: 0
    };

    if (time >= 2.6 && time < 8.8) {
      photoWindowState.visible = true;
      const openP = getTimelineProgress(time, 2.6, 3.4, Easing.cinematicSettle);
      photoWindowState.opacity = openP;
      photoWindowState.scale = lerp(0.85, 1.0, openP);
      photoWindowState.yOffset = lerp(40, 0, openP);

      // Zoom into chip
      if (time >= 4.8) {
        const zoomP = getTimelineProgress(time, 4.8, 7.0, Easing.cinematicSettle);
        photoWindowState.imageZoom = lerp(1.0, 2.2, zoomP);
        photoWindowState.imagePanX = lerp(0, -180, zoomP);
        photoWindowState.imagePanY = lerp(0, -110, zoomP);
      }

      // Chip annotation callout
      if (time >= 6.0) {
        photoWindowState.annotationOpacity = getTimelineProgress(time, 6.0, 6.8, Easing.easeOutQuart);
      }
    } else if (time >= 8.8) {
      // Fade out smoothly during morph to quote
      const fadeP = getTimelineProgress(time, 8.8, 9.4, Easing.easeInOutCubic);
      photoWindowState.visible = true;
      photoWindowState.opacity = 1 - fadeP;
      photoWindowState.scale = lerp(1.0, 0.9, fadeP);
    }

    // 3. Quote Bubble & Arc Chapter state (Ref-02 & Ref-03)
    let quoteState = {
      visible: false,
      opacity: 0,
      scale: 0.88,
      activeChapter: 2 // Part 02 active
    };

    if (time >= 8.3 && time <= 11.5) {
      quoteState.visible = true;
      const inP = getTimelineProgress(time, 8.3, 9.2, Easing.cinematicSettle);
      quoteState.opacity = inP;
      quoteState.scale = lerp(0.88, 1.0, inP);
    } else if (time > 11.5) {
      const outP = getTimelineProgress(time, 11.5, 12.0, Easing.easeOutQuart);
      quoteState.visible = true;
      quoteState.opacity = 1 - outP;
      quoteState.scale = lerp(1.0, 0.95, outP);
    }

    // 4. Waveform Audio scrubber progress (Ref-04 (04))
    // Red playhead sweeps across waveform
    const audioProgress = ((time * 0.4) % 1.0);

    return {
      time,
      cursor,
      photoWindowState,
      quoteState,
      audioProgress,
      visibility: this.visibility,
      data: this.data
    };
  }

  toJSON() {
    return {
      title: this.title,
      aspectRatio: this.aspectRatio,
      data: this.data,
      visibility: this.visibility,
      actionTracks: this.actionTracks
    };
  }

  loadJSON(json) {
    if (json.title) this.title = json.title;
    if (json.aspectRatio) this.aspectRatio = json.aspectRatio;
    if (json.data) Object.assign(this.data, json.data);
    if (json.visibility) Object.assign(this.visibility, json.visibility);
    if (json.actionTracks) this.actionTracks = json.actionTracks;
  }
}
