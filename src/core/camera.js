/**
 * XPIN-Desktop · Camera Director
 * Handles cinematic framing, camera dollies, zooms, tracking, and intentional shot cuts.
 */

import { lerp, getTimelineProgress, Easing } from './interpolator.js';

export class CameraDirector {
  constructor(options = {}) {
    this.viewportWidth = options.viewportWidth || 1920;
    this.viewportHeight = options.viewportHeight || 1080;
    
    // Default shots array for the cinematic demo
    this.shots = options.shots || [
      {
        id: 'shot-1',
        name: '全景 Establishing',
        startTime: 0.0,
        endTime: 2.5,
        type: 'smooth', // 'smooth' or 'cut'
        from: { x: 0, y: 0, zoom: 1.0, rotation: 0 },
        to:   { x: -20, y: 10, zoom: 1.05, rotation: 0 },
        easing: Easing.easeInOutCubic
      },
      {
        id: 'shot-2',
        name: '中景 Finder双击',
        startTime: 2.5,
        endTime: 4.8,
        type: 'cut',
        from: { x: 80, y: 0, zoom: 1.15, rotation: 0 },
        to:   { x: 0, y: 10, zoom: 1.28, rotation: 0 },
        easing: Easing.easeInOutCubic
      },
      {
        id: 'shot-3',
        name: '特写 芯片微距',
        startTime: 4.8,
        endTime: 8.5,
        type: 'smooth',
        from: { x: 0, y: 10, zoom: 1.28, rotation: 0 },
        to:   { x: 0, y: 15, zoom: 1.55, rotation: 0 },
        easing: Easing.cinematicSettle
      },
      {
        id: 'shot-4',
        name: '匹配转场 金句气泡',
        startTime: 8.5,
        endTime: 10.8,
        type: 'cut',
        from: { x: 0, y: 20, zoom: 1.18, rotation: 0 },
        to:   { x: 0, y: 0, zoom: 1.10, rotation: 0 },
        easing: Easing.easeInOutCubic
      },
      {
        id: 'shot-5',
        name: '收束 桌面全景',
        startTime: 10.8,
        endTime: 12.0,
        type: 'smooth',
        from: { x: 0, y: 0, zoom: 1.10, rotation: 0 },
        to:   { x: 0, y: 0, zoom: 1.0, rotation: 0 },
        easing: Easing.easeOutQuart
      }
    ];
  }

  /**
   * Deterministically calculates camera position and zoom at time t
   */
  evalAt(time) {
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
    const rotation = lerp(activeShot.from.rotation || 0, activeShot.to.rotation || 0, progress);

    return {
      x,
      y,
      zoom,
      rotation,
      activeShot,
      progress
    };
  }

  /**
   * Computes CSS transform matrix for camera world wrapper
   * Pivot is center of stage (960, 540)
   */
  getCameraTransformCSS(camState) {
    const cx = this.viewportWidth / 2;
    const cy = this.viewportHeight / 2;
    
    // translate to center, apply scale & pan, translate back
    return `translate(${cx}px, ${cy}px) scale(${camState.zoom}) translate(${-cx + camState.x}px, ${-cy + camState.y}px) rotate(${camState.rotation}deg)`;
  }
}
