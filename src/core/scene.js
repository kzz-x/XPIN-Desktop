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
      theme: initialData.theme || 'light',
      masterTitle: initialData.masterTitle || '硬件部',
      masterSubtitle: initialData.masterSubtitle || 'X.PIN · IOS Core',
      artFontName: initialData.artFontName || '标小智无界黑',
      bodyFontName: initialData.bodyFontName || '苹方UI-简',
      searchPlaceholder: initialData.searchPlaceholder || '差评硬件部新视觉',
      quoteTitle: initialData.quoteTitle || '金句案例',
      quoteBody: initialData.quoteBody || '对话框样式，就是对话框样式，也是一种对话框的样式。',
      chapterTitle: initialData.chapterTitle || '第二章：芯片微架构与能效比',
      chapterSubtitle: initialData.chapterSubtitle || '台积电第二代 3nm N3P 制程 · 晶体管微距剖析',
      chipName: initialData.chipName || 'Apple A18 Pro',
      chipSpec: initialData.chipSpec || '台积电 3nm N3P · 6核 CPU / 6核 GPU · 16核神经网络引擎 · 200亿晶体管',
      chartDataValue: initialData.chartDataValue || '235条',
      audioDuration: initialData.audioDuration || '28s',
      colors: initialData.colors || [
        { hex: '#FF5F56', label: '珊瑚红' },
        { hex: '#FFBD2E', label: '暖金琥珀' },
        { hex: '#51A7F9', label: '天青蓝' },
        { hex: '#27C93F', label: '苹果绿' }
      ],
      // Multi-asset library
      currentAsset: 'soc', // 'soc' | 'exploded' | 'layout'
      assets: {
        soc: {
          id: 'soc',
          name: 'Apple A18 Pro 主板剖析',
          file: './assets/demo/logic_board_soc.jpg',
          callout: {
            title: 'Apple A18 Pro SoC',
            spec: '3nm N3P · 2×性能核 4.04GHz + 4×能效核 2.42GHz'
          }
        },
        exploded: {
          id: 'exploded',
          name: 'iPhone 16 Pro 爆炸分解图',
          file: './assets/demo/exploded_view.png',
          callout: {
            title: '钛金属中框与导热石墨烯',
            spec: '再生铝合金副中框 + 超高导热石墨烯片结构'
          }
        },
        layout: {
          id: 'layout',
          name: '硬件架构全景布局',
          file: './assets/demo/full_layout.jpg',
          callout: {
            title: '主板电路核心走线',
            spec: '双层高密度叠层 PCB · 高频屏蔽罩'
          }
        }
      }
    };

    // Component visibility toggles
    this.visibility = {
      menuBar: true,
      dock: true,
      desktopIcons: true,
      finder: true,
      preview: true,
      safari: false,
      notes: false,
      terminal: false,
      masterWindow: true,
      chartCard: true,
      audioCard: true,
      colorPalette: true,
      arcChapter: false,
      quoteBubble: false,
      cursor: true
    };

    // Semantic Actions Timeline cues for Cinematic Director Mode
    this.actionTracks = [
      {
        id: 'mouse-move-to-finder',
        type: 'cursor',
        startTime: 0.5,
        endTime: 2.2,
        from: { x: 960, y: 700 },
        to:   { x: 380, y: 320 },
        easing: Easing.easeInOutCubic
      },
      {
        id: 'mouse-double-click-file',
        type: 'click',
        time: 2.3,
        target: 'finderFile'
      },
      {
        id: 'open-preview-window',
        type: 'window-open',
        startTime: 2.5,
        endTime: 3.4,
        windowId: 'preview'
      },
      {
        id: 'cursor-move-to-soc',
        type: 'cursor',
        startTime: 3.5,
        endTime: 5.0,
        from: { x: 380, y: 320 },
        to:   { x: 1140, y: 410 },
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
        startTime: 6.0,
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
   * Evaluates scene element states deterministically at time t (used by Cinematic Director)
   */
  evalAt(time) {
    // 1. Mouse Cursor position & click state
    let cursor = { x: 960, y: 700, clicking: false, clickProgress: 0 };
    if (time < 2.2) {
      const p = getTimelineProgress(time, 0.5, 2.2, Easing.easeInOutCubic);
      cursor.x = lerp(960, 380, p);
      cursor.y = lerp(700, 320, p);
    } else if (time >= 2.2 && time < 3.5) {
      cursor.x = 380;
      cursor.y = 320;
      if (time >= 2.25 && time <= 2.65) {
        cursor.clicking = true;
        cursor.clickProgress = getTimelineProgress(time, 2.25, 2.65, Easing.smoothStep);
      }
    } else if (time >= 3.5 && time < 5.2) {
      const p = getTimelineProgress(time, 3.5, 5.2, Easing.easeInOutCubic);
      cursor.x = lerp(380, 1140, p);
      cursor.y = lerp(320, 410, p);
    } else if (time >= 5.2 && time < 8.5) {
      cursor.x = 1140;
      cursor.y = 410;
      if (time >= 5.3 && time <= 5.6) {
        cursor.clicking = true;
        cursor.clickProgress = getTimelineProgress(time, 5.3, 5.6, Easing.smoothStep);
      }
    } else {
      const p = getTimelineProgress(time, 8.5, 10.0, Easing.easeInOutCubic);
      cursor.x = lerp(1140, 1500, p);
      cursor.y = lerp(410, 850, p);
    }

    // 2. Preview Window state during timeline
    let previewWindowState = {
      visible: true,
      opacity: 1,
      scale: 1,
      imageZoom: 1.0,
      imagePanX: 0,
      imagePanY: 0,
      annotationOpacity: 0
    };

    if (time < 2.5) {
      previewWindowState.visible = true;
      previewWindowState.opacity = 0.85;
      previewWindowState.scale = 0.98;
    } else if (time >= 2.5 && time < 8.8) {
      previewWindowState.visible = true;
      const openP = getTimelineProgress(time, 2.5, 3.2, Easing.cinematicSettle);
      previewWindowState.opacity = lerp(0.85, 1.0, openP);
      previewWindowState.scale = lerp(0.98, 1.0, openP);

      // Zoom into chip
      if (time >= 4.6) {
        const zoomP = getTimelineProgress(time, 4.6, 6.8, Easing.cinematicSettle);
        previewWindowState.imageZoom = lerp(1.0, 2.3, zoomP);
        previewWindowState.imagePanX = lerp(0, -180, zoomP);
        previewWindowState.imagePanY = lerp(0, -110, zoomP);
      }

      // Chip annotation callout
      if (time >= 5.8) {
        previewWindowState.annotationOpacity = getTimelineProgress(time, 5.8, 6.6, Easing.easeOutQuart);
      }
    } else if (time >= 8.8) {
      const fadeP = getTimelineProgress(time, 8.8, 9.4, Easing.easeInOutCubic);
      previewWindowState.opacity = 1 - fadeP * 0.7;
    }

    // 3. Quote Bubble state (Ref-03)
    let quoteState = {
      visible: false,
      opacity: 0,
      scale: 0.88
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
    const audioProgress = ((time * 0.35) % 1.0);

    return {
      time,
      cursor,
      previewWindowState,
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
