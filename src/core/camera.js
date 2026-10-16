/**
 * XPIN-Desktop · 2.5D Spatial Perspective Camera Director
 * Handles cinematic framing, camera dollies, zooms, 3D pitch/yaw tilts, tracking, and intentional shot cuts.
 */

import { lerp, getTimelineProgress, Easing } from './interpolator.js';

export class CameraDirector {
  constructor(options = {}) {
    this.viewportWidth = options.viewportWidth || 1920;
    this.viewportHeight = options.viewportHeight || 1080;
    this.perspective = options.perspective || 1400;

    // Manual camera override (for interactive desktop manipulation)
    this.manualOverride = false;
    this.manualState = {
      x: 0,
      y: 0,
      zoom: 1.0,
      pitch: 0,  // rotateX (-30 deg to +30 deg)
      yaw: 0,    // rotateY (-30 deg to +30 deg)
      roll: 0,   // rotateZ (-15 deg to +15 deg)
      blurDepth: 0
    };
    
    // Default 3D spatial shots array for the cinematic demo
    this.shots = options.shots || [
      {
        id: 'shot-1',
        name: '01. 全景俯仰 Establishing',
        startTime: 0.0,
        endTime: 2.5,
        type: 'smooth',
        from: { x: -30, y: 15, zoom: 1.02, pitch: 9.0, yaw: -8.0, roll: 0, blurDepth: 0 },
        to:   { x: -10, y: 5,  zoom: 1.06, pitch: 6.0, yaw: -4.0, roll: 0, blurDepth: 0 },
        easing: Easing.easeInOutCubic
      },
      {
        id: 'shot-2',
        name: '02. 中景 访达文件双击',
        startTime: 2.5,
        endTime: 4.8,
        type: 'cut',
        from: { x: 60, y: 10, zoom: 1.18, pitch: 4.0, yaw: -3.0, roll: 0, blurDepth: 2 },
        to:   { x: 10, y: 15, zoom: 1.28, pitch: 2.0, yaw: 0.0,  roll: 0, blurDepth: 3 },
        easing: Easing.easeInOutCubic
      },
      {
        id: 'shot-3',
        name: '03. 特写 A18 Pro 空间微距',
        startTime: 4.8,
        endTime: 7.5,
        type: 'smooth',
        from: { x: -100, y: -25, zoom: 1.42, pitch: 10.0, yaw: 8.0, roll: -0.8, blurDepth: 4 },
        to:   { x: -140, y: -45, zoom: 1.68, pitch: 13.5, yaw: 12.0, roll: -1.5, blurDepth: 6 },
        easing: Easing.cinematicSettle
      },
      {
        id: 'shot-4',
        name: '04. 脱框演变 3D 拓扑节点网络',
        startTime: 7.5,
        endTime: 10.8,
        type: 'smooth',
        from: { x: -80, y: -30, zoom: 1.42, pitch: 13.0, yaw: 10.0, roll: -1.0, blurDepth: 4 },
        to:   { x: 30,  y: -10, zoom: 1.14, pitch: 14.5, yaw: -12.5, roll: 1.2, blurDepth: 1 },
        easing: Easing.cinematicSettle
      },
      {
        id: 'shot-5',
        name: '05. 收束 空间桌面全景',
        startTime: 10.8,
        endTime: 12.0,
        type: 'smooth',
        from: { x: 20, y: -5, zoom: 1.10, pitch: 8.0, yaw: -5.0, roll: 0.5, blurDepth: 1 },
        to:   { x: 0,  y: 0,  zoom: 1.0,  pitch: 0.0, yaw: 0.0,  roll: 0, blurDepth: 0 },
        easing: Easing.easeOutQuart
      }
    ];
  }

  /**
   * Deterministically calculates camera position, 3D angles and zoom at time t
   */
  evalAt(time) {
    if (this.manualOverride) {
      return {
        ...this.manualState,
        activeShot: { name: '手动 3D 机位 (Manual 3D)' },
        progress: 1.0
      };
    }

    // Find active shot
    let activeShot = this.shots.find(s => time >= s.startTime && time < s.endTime);
    if (!activeShot) {
      if (time >= (this.shots[this.shots.length - 1]?.endTime || 12)) {
        activeShot = this.shots[this.shots.length - 1];
        return {
          ...activeShot.to,
          activeShot
        };
      }
      activeShot = this.shots[0];
    }

    const progress = getTimelineProgress(
      time,
      activeShot.startTime,
      activeShot.endTime,
      activeShot.easing || Easing.easeInOutCubic
    );

    const x = lerp(activeShot.from.x, activeShot.to.x, progress);
    const y = lerp(activeShot.from.y, activeShot.to.y, progress);
    const zoom = lerp(activeShot.from.zoom, activeShot.to.zoom, progress);
    const pitch = lerp(activeShot.from.pitch || 0, activeShot.to.pitch || 0, progress);
    const yaw = lerp(activeShot.from.yaw || 0, activeShot.to.yaw || 0, progress);
    const roll = lerp(activeShot.from.roll || 0, activeShot.to.roll || 0, progress);
    const blurDepth = lerp(activeShot.from.blurDepth || 0, activeShot.to.blurDepth || 0, progress);

    return {
      x,
      y,
      zoom,
      pitch,
      yaw,
      roll,
      blurDepth,
      activeShot,
      progress
    };
  }

  /**
   * Computes CSS transform matrix for camera world wrapper with 3D perspective
   * Pivot is center of stage (960, 540)
   */
  getCameraTransformCSS(camState) {
    const cx = this.viewportWidth / 2;
    const cy = this.viewportHeight / 2;
    const pitch = (camState.pitch || 0).toFixed(2);
    const yaw = (camState.yaw || 0).toFixed(2);
    const roll = (camState.roll || 0).toFixed(2);
    const zoom = (camState.zoom || 1.0).toFixed(3);
    const x = (camState.x || 0).toFixed(1);
    const y = (camState.y || 0).toFixed(1);
    const perspective = this.perspective;

    return `perspective(${perspective}px) translate3d(${cx}px, ${cy}px, 0px) scale(${zoom}) rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${roll}deg) translate3d(${-cx + Number(x)}px, ${-cy + Number(y)}px, 0px)`;
  }
}
