/**
 * XPIN-Desktop · Stage & Components Renderer
 * Renders high-fidelity cinematic UI elements conforming to references/macos/ screenshots.
 */

export class StageRenderer {
  constructor(containerEl) {
    this.container = containerEl;
    this.dom = {};
    this.initDOM();
  }

  initDOM() {
    this.container.className = 'xpin-stage-viewport';
    this.container.innerHTML = `
      <!-- Background Texture & Radar Arc Grid -->
      <div class="xpin-bg-layer"></div>
      <svg class="xpin-bg-radar-arc" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="500" cy="500" r="480" stroke="#000" stroke-width="1.5" stroke-dasharray="4 8" />
        <circle cx="500" cy="500" r="380" stroke="#000" stroke-width="1" stroke-dasharray="3 6" />
        <circle cx="500" cy="500" r="280" stroke="#000" stroke-width="1.5" stroke-dasharray="2 4" />
        <circle cx="500" cy="500" r="180" stroke="#000" stroke-width="1" />
        <path d="M 500 0 L 500 1000 M 0 500 L 1000 500" stroke="#000" stroke-width="1" stroke-dasharray="2 6" />
      </svg>

      <!-- Top macOS Menu Bar -->
      <div class="xpin-menubar" id="xpin-menubar">
        <div class="xpin-menubar-left">
          <div class="xpin-menubar-logo">
            <svg width="15" height="15" viewBox="0 0 170 170" fill="currentColor">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.86-12-14.46-6.19-9.46-10.96-20.1-14.33-31.92-3.37-11.81-5.06-23.1-5.06-33.87 0-14.59 3.73-26.68 11.2-36.26 7.46-9.58 17.03-14.53 28.7-14.85 4.89 0 10.23 1.25 16.03 3.76 5.8 2.5 9.77 3.82 11.91 3.93 1.85-.11 5.94-1.46 12.27-4.04 6.33-2.58 11.83-3.76 16.51-3.54 11.33.87 20.65 5.38 27.95 13.53-10.02 6.09-14.92 14.57-14.7 25.43.22 8.7 3.69 16.09 10.42 22.18 6.74 6.09 14.57 9.4 23.51 9.95-2.29 6.85-5.11 13.8-8.47 20.84zM119.22 31.43c0-7.39 2.66-14.35 7.99-20.87 5.33-6.52 11.85-10.43 19.57-11.74.87 7.07-1.47 13.91-7.02 20.54-5.54 6.63-12.39 10.65-20.54 12.07z"/>
            </svg>
            <span>.PIN</span>
          </div>
          <div class="xpin-menubar-items">
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Go</span>
            <span>Window</span>
            <span>Help</span>
          </div>
        </div>
        <div class="xpin-menubar-right">
          <span>􀙇 100%</span>
          <span>􀤆</span>
          <span>􀊫</span>
          <span>23:59 PM</span>
        </div>
      </div>

      <!-- Cinematic Camera World Stage -->
      <div class="xpin-camera-world" id="xpin-camera-world">

        <!-- (01) Context Menu Popup -->
        <div class="xpin-context-menu" id="xpin-context-menu" style="left: 880px; top: 220px;">
          <span>Copy</span>
          <div class="xpin-context-menu-divider"></div>
          <span>Share...</span>
          <div class="xpin-context-menu-arrow"></div>
        </div>

        <!-- (02) Line Chart Card -->
        <div class="xpin-card xpin-chart-card" id="xpin-chart-card" style="left: 290px; top: 140px;">
          <div class="xpin-chart-header">
            <span class="xpin-chart-title">折线图</span>
            <div class="xpin-menu-bars-icon"><span></span><span></span><span></span></div>
          </div>
          <div class="xpin-chart-body">
            <svg viewBox="0 0 230 90" width="100%" height="100%" fill="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#F96257" stop-opacity="0.45"/>
                  <stop offset="100%" stop-color="#F96257" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <path d="M 10 75 Q 50 65, 80 40 T 150 35 T 220 50 L 220 85 L 10 85 Z" fill="url(#chartGrad)"/>
              <path d="M 10 75 Q 50 65, 80 40 T 150 35 T 220 50" stroke="#F96257" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="105" cy="38" r="4" fill="#F96257" stroke="#FFF" stroke-width="1.5"/>
            </svg>
            <div class="xpin-chart-badge" id="chart-badge-val">235条</div>
          </div>
          <div class="xpin-chart-xaxis">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>

        <!-- (03) 3D Folder Icon -->
        <div class="xpin-3d-folder-container" id="xpin-folder-3d" style="left: 240px; top: 620px;">
          <svg class="xpin-3d-folder-svg" width="130" height="110" viewBox="0 0 130 110" fill="none">
            <!-- Back flap -->
            <rect x="5" y="10" width="45" height="20" rx="6" fill="#1D72E8" />
            <rect x="5" y="20" width="120" height="85" rx="14" fill="#2563EB" />
            <!-- Paper inside -->
            <rect x="18" y="14" width="94" height="40" rx="4" fill="#FFFFFF" opacity="0.9" />
            <line x1="28" y1="24" x2="102" y2="24" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" />
            <line x1="28" y1="32" x2="80" y2="32" stroke="#E2E8F0" stroke-width="2" stroke-linecap="round" />
            <!-- Front flap with glossy gradient -->
            <defs>
              <linearGradient id="folderFront" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#60A5FA" />
                <stop offset="100%" stop-color="#1D4ED8" />
              </linearGradient>
            </defs>
            <rect x="5" y="32" width="120" height="73" rx="14" fill="url(#folderFront)" />
            <text x="65" y="78" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle" font-family="sans-serif">Folder</text>
          </svg>
        </div>

        <!-- (04) Audio Player Card -->
        <div class="xpin-card xpin-audio-card" id="xpin-audio-card" style="left: 1120px; top: 150px;">
          <div class="xpin-audio-header">
            <div class="xpin-audio-title-group">
              <span style="font-size: 14px;">❚❚</span>
              <span>音频.mp3</span>
            </div>
            <span style="color: #8E8E93;" id="audio-duration-label">28s</span>
          </div>
          <div class="xpin-audio-waveform-wrap">
            <div class="xpin-audio-waveform-bars" id="waveform-bars">
              <!-- Dynamically generated bars -->
            </div>
            <div class="xpin-audio-playhead" id="audio-playhead" style="left: 55%;">
              <div class="xpin-audio-playhead-pin"></div>
            </div>
          </div>
        </div>

        <!-- (05) Color Palette Card -->
        <div class="xpin-card xpin-color-card" id="xpin-color-card" style="left: 1380px; top: 320px;">
          <div class="xpin-color-header">
            <span class="xpin-color-title">颜色</span>
            <div class="xpin-menu-bars-icon"><span></span><span></span><span></span></div>
          </div>
          <div id="xpin-color-list">
            <!-- Swatches dynamically loaded from scene -->
          </div>
        </div>

        <!-- Center Master Window -->
        <div class="xpin-master-window" id="xpin-master-window" style="left: 670px; top: 250px;">
          <div class="xpin-window-titlebar">
            <div class="xpin-traffic-lights">
              <div class="xpin-traffic-dot red"></div>
              <div class="xpin-traffic-dot yellow"></div>
              <div class="xpin-traffic-dot green"></div>
            </div>
            <span class="xpin-window-title-badge" id="win-subtitle-badge">X.PIN · IOS Core</span>
          </div>
          <div class="xpin-master-window-body">
            <div class="xpin-brand-title">X.PIN</div>
            <h1 class="xpin-master-headline" id="win-main-headline">硬件部</h1>
            <div class="xpin-sub-badge">IOS Core</div>

            <!-- Selection Box with 8 Resize Handles -->
            <div class="xpin-selection-box" id="win-selection-box">
              <div class="xpin-selection-handle tl"></div>
              <div class="xpin-selection-handle tc"></div>
              <div class="xpin-selection-handle tr"></div>
              <div class="xpin-selection-handle ml"></div>
              <div class="xpin-selection-handle mr"></div>
              <div class="xpin-selection-handle bl"></div>
              <div class="xpin-selection-handle bc"></div>
              <div class="xpin-selection-handle br"></div>
              <span style="font-size: 13px; font-weight: 700; color: #1D1D1F;">标小智无界黑 · 硬件视效</span>
            </div>

            <!-- Font Option List -->
            <div class="xpin-font-options">
              <div class="xpin-font-row">
                <div class="xpin-radio-icon"></div>
                <span id="label-art-font">艺术字体: [ 标小智无界黑 ]</span>
              </div>
              <div class="xpin-font-row">
                <div class="xpin-check-icon">✓</div>
                <span id="label-body-font">常规字体: [ 苹方UI-简 ]</span>
              </div>
            </div>
          </div>
        </div>

        <!-- (06) Dock Search Bar & Guide Frame -->
        <div class="xpin-dock-search-wrap" id="xpin-dock-search-wrap" style="left: 830px; top: 740px;">
          <div class="xpin-dock-guide-box">
            <div class="xpin-dock-guide-marker" style="top: -8px; left: 50%; transform: translateX(-50%);"></div>
            <div class="xpin-dock-guide-marker" style="bottom: -8px; left: 50%; transform: translateX(-50%);"></div>
          </div>
          <div class="xpin-dock-search-pill">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" stroke-width="2.5">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input class="xpin-dock-search-input" id="dock-search-input" readonly value="差评硬件部新视觉" />
            <div style="display: flex; gap: 8px; color: #8E8E93; font-weight: 700;">
              <span>␣</span>
              <span>☰</span>
            </div>
          </div>
          <!-- Sun icon for brightness/lighting reference -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FDBC2C" stroke-width="2.5">
            <circle cx="12" cy="12" r="5" fill="#FDBC2C" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        </div>

        <!-- Photo Viewer Window (Hardware Demo: Apple SoC Zoom & Macro Annotation) -->
        <div class="xpin-photo-window" id="xpin-photo-window" style="left: 580px; top: 260px; display: none;">
          <div class="xpin-window-titlebar" style="background: #FFFFFF;">
            <div class="xpin-traffic-lights">
              <div class="xpin-traffic-dot red"></div>
              <div class="xpin-traffic-dot yellow"></div>
              <div class="xpin-traffic-dot green"></div>
            </div>
            <span class="xpin-window-title-badge">logic_board_soc.jpg — 预览</span>
          </div>
          <div class="xpin-photo-viewport" id="photo-viewport">
            <img class="xpin-photo-img" id="photo-img-element" src="./assets/demo/logic_board_soc.jpg" alt="SoC Logic Board" />
            
            <!-- Highlight Box over SoC Chip -->
            <div class="xpin-chip-target-box" id="chip-target-box" style="left: 310px; top: 160px; width: 140px; height: 140px;"></div>
            
            <!-- Callout Annotation Pill -->
            <div class="xpin-chip-callout-tag" id="chip-callout-tag" style="left: 470px; top: 200px;">
              <div style="font-size: 15px; font-weight: 800; color: #51A7F9;" id="chip-tag-name">Apple A18 Pro</div>
              <div style="font-size: 12px; color: #E5E7EB;" id="chip-tag-spec">3nm N3P · 6核 GPU · 16核 NPU</div>
            </div>
          </div>
        </div>

        <!-- Ref-03: Quote Bubble & 3D Icons Floating Stage -->
        <div class="xpin-quote-wrap" id="xpin-quote-wrap" style="left: 570px; top: 290px; display: none;">
          <div class="xpin-quote-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9"/>
              <line x1="12" y1="3" x2="12" y2="21"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
            </svg>
            <span>金句案例</span>
          </div>

          <div class="xpin-quote-bubble">
            <span class="xpin-quote-mark left">“</span>
            <div class="xpin-quote-bubble-title" id="quote-card-title">金句</div>
            <div class="xpin-quote-bubble-text" id="quote-card-body">对话框样式，就是对话框样式，也是一种对话框的样式。</div>
            <span class="xpin-quote-mark right">”</span>
          </div>

          <!-- 3D Floating App Icons: Wi-Fi, iCloud, Messages -->
          <div class="xpin-3d-floating-icon" style="top: 20px; left: 140px; transform: rotate(-8deg);">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="#3B82F6">
              <path d="M12 18c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-4.9-4.9c2.7-2.7 7.1-2.7 9.8 0l1.4-1.4c-3.5-3.5-9.1-3.5-12.6 0l1.4 1.4zm-2.8-2.8c4.3-4.3 11.1-4.3 15.4 0l1.4-1.4c-5-5-13.2-5-18.2 0l1.4 1.4z"/>
            </svg>
          </div>
          <div class="xpin-3d-floating-icon" style="top: 30px; right: 130px; transform: rotate(10deg);">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="#60A5FA">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
            </svg>
          </div>
          <div class="xpin-3d-floating-icon" style="bottom: 40px; right: 200px; transform: rotate(-5deg);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#22C55E">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
        </div>

        <!-- Cursor & Pointer Performance -->
        <div class="xpin-click-ripple" id="xpin-click-ripple"></div>
        <div class="xpin-cursor" id="xpin-cursor">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 2L19 12L11.5 13.5L8.5 21L3 2Z" fill="#51A7F9" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>
          </svg>
        </div>

      </div>
    `;

    this.cacheElements();
    this.initWaveform();
  }

  cacheElements() {
    this.dom.cameraWorld = document.getElementById('xpin-camera-world');
    this.dom.cursor = document.getElementById('xpin-cursor');
    this.dom.ripple = document.getElementById('xpin-click-ripple');
    this.dom.audioPlayhead = document.getElementById('audio-playhead');
    this.dom.waveformContainer = document.getElementById('waveform-bars');
    this.dom.colorList = document.getElementById('xpin-color-list');
    this.dom.photoWindow = document.getElementById('xpin-photo-window');
    this.dom.photoImg = document.getElementById('photo-img-element');
    this.dom.chipCallout = document.getElementById('chip-callout-tag');
    this.dom.quoteWrap = document.getElementById('xpin-quote-wrap');
    this.dom.masterWindow = document.getElementById('xpin-master-window');
    
    // Dynamic text binders
    this.dom.winHeadline = document.getElementById('win-main-headline');
    this.dom.winSubtitle = document.getElementById('win-subtitle-badge');
    this.dom.labelArtFont = document.getElementById('label-art-font');
    this.dom.labelBodyFont = document.getElementById('label-body-font');
    this.dom.dockInput = document.getElementById('dock-search-input');
    this.dom.quoteTitle = document.getElementById('quote-card-title');
    this.dom.quoteBody = document.getElementById('quote-card-body');
    this.dom.chipName = document.getElementById('chip-tag-name');
    this.dom.chipSpec = document.getElementById('chip-tag-spec');
    this.dom.chartBadge = document.getElementById('chart-badge-val');
    this.dom.audioDuration = document.getElementById('audio-duration-label');
  }

  initWaveform() {
    if (!this.dom.waveformContainer) return;
    this.dom.waveformContainer.innerHTML = '';
    // Generate 36 audio frequency bars mimicking Ref-04 (04)
    const heights = [
      8, 14, 22, 18, 30, 24, 16, 28, 38, 32, 20, 26, 
      34, 40, 28, 18, 24, 36, 42, 38, 26, 18, 30, 22, 
      16, 28, 34, 20, 14, 26, 32, 22, 16, 12, 18, 8
    ];
    for (let i = 0; i < heights.length; i++) {
      const bar = document.createElement('div');
      bar.className = 'xpin-audio-bar';
      bar.style.height = `${heights[i]}px`;
      this.dom.waveformContainer.appendChild(bar);
    }
  }

  renderColors(colors) {
    if (!this.dom.colorList) return;
    this.dom.colorList.innerHTML = colors.map(c => `
      <div class="xpin-color-row">
        <div class="xpin-color-chip" style="background: ${c.hex};"></div>
        <span class="xpin-color-code">${c.hex}</span>
      </div>
    `).join('');
  }

  /**
   * Applies evaluated state deterministically to stage DOM
   */
  renderState(sceneState, cameraDirector) {
    // 1. Camera transform
    const camState = cameraDirector.evalAt(sceneState.time);
    const camCSS = cameraDirector.getCameraTransformCSS(camState);
    this.dom.cameraWorld.style.transform = camCSS;

    // 2. Cursor position & click animation
    this.dom.cursor.style.transform = `translate(${sceneState.cursor.x}px, ${sceneState.cursor.y}px)`;
    if (sceneState.cursor.clicking) {
      this.dom.ripple.style.transform = `translate(${sceneState.cursor.x}px, ${sceneState.cursor.y}px) scale(${sceneState.cursor.clickProgress * 2.2})`;
      this.dom.ripple.style.opacity = String(1 - sceneState.cursor.clickProgress);
    } else {
      this.dom.ripple.style.opacity = '0';
    }

    // 3. Audio Scrubber playhead
    const scrubberPercent = (sceneState.audioProgress * 100).toFixed(1);
    this.dom.audioPlayhead.style.left = `${scrubberPercent}%`;

    // 4. Photo Viewer Window
    const pw = sceneState.photoWindowState;
    if (pw.visible && sceneState.visibility.photoViewer) {
      this.dom.photoWindow.style.display = 'flex';
      this.dom.photoWindow.style.opacity = String(pw.opacity);
      this.dom.photoWindow.style.transform = `scale(${pw.scale}) translateY(${pw.yOffset}px)`;
      
      // Image zoom & pan inside viewport
      this.dom.photoImg.style.transform = `scale(${pw.imageZoom}) translate(${pw.imagePanX}px, ${pw.imagePanY}px)`;
      
      // Chip Annotation
      this.dom.chipCallout.style.opacity = String(pw.annotationOpacity);
      this.dom.chipCallout.style.transform = `translateY(${(1 - pw.annotationOpacity) * 10}px)`;
    } else {
      this.dom.photoWindow.style.display = 'none';
    }

    // 5. Quote Bubble Stage (Ref-03)
    const qs = sceneState.quoteState;
    if (qs.visible && sceneState.visibility.quoteBubble) {
      this.dom.quoteWrap.style.display = 'flex';
      this.dom.quoteWrap.style.opacity = String(qs.opacity);
      this.dom.quoteWrap.style.transform = `scale(${qs.scale})`;
      // Dim master window to emphasize quote bubble (Focus falloff)
      if (this.dom.masterWindow) {
        this.dom.masterWindow.style.opacity = String(1 - qs.opacity * 0.85);
      }
    } else {
      this.dom.quoteWrap.style.display = 'none';
      if (this.dom.masterWindow) {
        this.dom.masterWindow.style.opacity = '1';
      }
    }

    // 6. Update text bindings from scene data
    if (this.dom.winHeadline) this.dom.winHeadline.textContent = sceneState.data.masterTitle;
    if (this.dom.winSubtitle) this.dom.winSubtitle.textContent = sceneState.data.masterSubtitle;
    if (this.dom.labelArtFont) this.dom.labelArtFont.textContent = `艺术字体: [ ${sceneState.data.artFontName} ]`;
    if (this.dom.labelBodyFont) this.dom.labelBodyFont.textContent = `常规字体: [ ${sceneState.data.bodyFontName} ]`;
    if (this.dom.dockInput) this.dom.dockInput.value = sceneState.data.searchPlaceholder;
    if (this.dom.quoteTitle) this.dom.quoteTitle.textContent = sceneState.data.quoteTitle;
    if (this.dom.quoteBody) this.dom.quoteBody.textContent = sceneState.data.quoteBody;
    if (this.dom.chipName) this.dom.chipName.textContent = sceneState.data.chipName;
    if (this.dom.chipSpec) this.dom.chipSpec.textContent = sceneState.data.chipSpec;
    if (this.dom.chartBadge) this.dom.chartBadge.textContent = sceneState.data.chartDataValue;
    if (this.dom.audioDuration) this.dom.audioDuration.textContent = sceneState.data.audioDuration;
  }
}
