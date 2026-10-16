/**
 * XPIN-Desktop · Interpolator & Easing Utilities
 * Deterministic mathematical interpolation functions for cinematic motion.
 */

export const Easing = {
  linear: t => t,
  
  // Quad
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  // Cubic
  easeInCubic: t => t * t * t,
  easeOutCubic: t => (--t) * t * t + 1,
  easeInOutCubic: t => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1),

  // Quartic
  easeOutQuart: t => 1 - (--t) * t * t * t,
  easeInOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t),

  // Apple & Motion Design Standard Easing: Smooth Step & Anticipation
  smoothStep: t => t * t * (3 - 2 * t),
  anticipate: (t, s = 1.70158) => t * t * ((s + 1) * t - s),
  overshoot: (t, s = 1.70158) => (--t) * t * ((s + 1) * t + s) + 1,
  
  // Cinematic Camera Easing (Custom cubic bezier approximation: fast out, slow settle)
  cinematicSettle: t => {
    // Similar to cubic-bezier(0.16, 1, 0.3, 1)
    return 1 - Math.pow(1 - t, 4);
  }
};

export function clamp(val, min = 0, max = 1) {
  return Math.max(min, Math.min(max, val));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function lerp2D(p0, p1, t) {
  return {
    x: lerp(p0.x, p1.x, t),
    y: lerp(p0.y, p1.y, t)
  };
}

/**
 * Deterministic timeline progress helper
 * Returns 0 before startTime, 1 after endTime, and eased [0..1] in between.
 */
export function getTimelineProgress(currentTime, startTime, endTime, easingFn = Easing.easeInOutCubic) {
  if (currentTime <= startTime) return 0;
  if (currentTime >= endTime) return 1;
  const rawProgress = (currentTime - startTime) / (endTime - startTime);
  const clamped = clamp(rawProgress, 0, 1);
  return easingFn ? easingFn(clamped) : clamped;
}
