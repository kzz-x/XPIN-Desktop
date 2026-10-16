/**
 * XPIN-Desktop · Main Application & Studio Controller
 * Coordinates Timeline, Camera Director, Scene State, macOS Window Manager, and Dual-Mode Studio.
 */

import { Timeline } from './core/timeline.js';
import { CameraDirector } from './core/camera.js';
import { Scene } from './core/scene.js';
import { WindowManager } from './core/windowManager.js';
import { StageRenderer } from './components/ComponentsRenderer.js';

export class StudioApp {
  constructor() {
    this.timeline = new Timeline({ duration: 12.0, fps: 24, loop: true });
    this.camera = new CameraDirector();
    this.scene = new Scene();
    this.stageRenderer = null;
    this.windowManager = null;

    this.currentMode = 'desktop'; // 'desktop' (Interactive) or 'cinematic' (Director)
    this.currentPreviewZoom = 1.0;

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

    // Initialize macOS Window Manager
    this.initWindowManager(stageContainer);

    // Detect headless mode from query params
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('mode') === 'headless' || urlParams.get('mode') === 'export') {
      document.body.classList.add('mode-headless');
      this.currentMode = 'cinematic';
    }

    // Initial scale calculation for 16:9 stage
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    // Bind Timeline to Stage
    this.timeline.onUpdate((time) => {
      const state = this.scene.evalAt(time);
      if (this.currentMode === 'cinematic') {
        this.stageRenderer.renderState(state, this.camera);
      } else {
        // In desktop mode, if manual 3D is enabled, apply manual 3D camera
        if (this.camera.manualOverride) {
          const camCSS = this.camera.getCameraTransformCSS(this.camera.manualState);
          this.stageRenderer.dom.cameraWorld.style.transform = camCSS;
        } else {
          // Standard static 1.0 framing with subtle spatial depth
          const staticCam = { x: 0, y: 0, zoom: 1.0, pitch: 0, yaw: 0, roll: 0, blurDepth: 0 };
          const camCSS = this.camera.getCameraTransformCSS(staticCam);
          this.stageRenderer.dom.cameraWorld.style.transform = camCSS;
        }

        // Apply Theme (Light vs Dark)
        if (state.data.theme === 'dark') {
          this.stageRenderer.container.classList.add('theme-dark');
          const icon = document.getElementById('menubar-theme-icon');
          if (icon) icon.textContent = '🌙';
          const ccStatus = document.getElementById('cc-darkmode-status');
          if (ccStatus) ccStatus.textContent = '已启用';
        } else {
          this.stageRenderer.container.classList.remove('theme-dark');
          const icon = document.getElementById('menubar-theme-icon');
          if (icon) icon.textContent = '☀️';
          const ccStatus = document.getElementById('cc-darkmode-status');
          if (ccStatus) ccStatus.textContent = '未启用';
        }

        // Audio progress continues
        const scrubberPercent = (state.audioProgress * 100).toFixed(1);
        this.stageRenderer.dom.audioPlayhead.style.left = `${scrubberPercent}%`;
      }
      this.updateTimelineUI(time);
    });

    this.bindEditorControls();
    this.bindKeyboardShortcuts();
    this.bindMacOSDesktopInteractions();

    // Initial render
    const initialState = this.scene.evalAt(0);
    this.stageRenderer.renderState(initialState, this.camera);
    this.updateTimelineUI(0);
    this.startClock();
  }

  initWindowManager(stageContainer) {
    this.windowManager = new WindowManager(stageContainer, {
      stageWidth: 1920,
      stageHeight: 1080,
      menubarHeight: 32,
      dockHeight: 70,
      onActiveChange: (winData) => {
        const activeNameText = document.getElementById('active-app-name-text');
        const aboutNameText = document.getElementById('dropdown-about-app-name');
        const quitNameText = document.getElementById('dropdown-quit-app-name');
        if (activeNameText && winData) {
          activeNameText.textContent = winData.appName || winData.title || '访达';
        }
        if (aboutNameText && winData) aboutNameText.textContent = winData.appName || '访达';
        if (quitNameText && winData) quitNameText.textContent = winData.appName || '访达';
      }
    });

    // Register all macOS Windows
    this.windowManager.registerWindow('finder', this.stageRenderer.dom.winFinder, {
      title: '访达 — 硬件工程',
      appName: '访达',
      defaultX: 180,
      defaultY: 90,
      defaultWidth: 780,
      defaultHeight: 520,
      minWidth: 580,
      minHeight: 360,
      isOpen: true
    });

    this.windowManager.registerWindow('preview', this.stageRenderer.dom.winPreview, {
      title: '预览 — 芯片架构图',
      appName: '预览',
      defaultX: 860,
      defaultY: 110,
      defaultWidth: 880,
      defaultHeight: 580,
      minWidth: 540,
      minHeight: 380,
      isOpen: true
    });

    this.windowManager.registerWindow('safari', this.stageRenderer.dom.winSafari, {
      title: 'Safari 浏览器',
      appName: 'Safari',
      defaultX: 340,
      defaultY: 150,
      defaultWidth: 860,
      defaultHeight: 560,
      minWidth: 580,
      minHeight: 400,
      isOpen: false
    });

    this.windowManager.registerWindow('notes', this.stageRenderer.dom.winNotes, {
      title: '备忘录',
      appName: '备忘录',
      defaultX: 1120,
      defaultY: 260,
      defaultWidth: 680,
      defaultHeight: 480,
      minWidth: 480,
      minHeight: 340,
      isOpen: false
    });

    this.windowManager.registerWindow('terminal', this.stageRenderer.dom.winTerminal, {
      title: '终端',
      appName: '终端',
      defaultX: 520,
      defaultY: 480,
      defaultWidth: 720,
      defaultHeight: 380,
      minWidth: 460,
      minHeight: 280,
      isOpen: false
    });

    this.windowManager.registerWindow('masterWindow', this.stageRenderer.dom.winMaster, {
      title: 'XPIN 核心工作台',
      appName: 'XPIN Studio',
      defaultX: 680,
      defaultY: 240,
      defaultWidth: 560,
      defaultHeight: 460,
      minWidth: 400,
      minHeight: 320,
      isOpen: false
    });

    // Bring Preview to active focus initially
    this.windowManager.focusWindow('preview');
  }

  handleResize() {
    const stageWrapper = document.getElementById('stage-outer-wrapper');
    const stageContainer = document.getElementById('xpin-stage-container');
    if (!stageWrapper || !stageContainer) return;

    if (document.body.classList.contains('mode-headless')) {
      stageContainer.style.width = '1920px';
      stageContainer.style.height = '1080px';
      stageContainer.style.transform = 'none';
      stageContainer.style.transformOrigin = '0 0';
      return;
    }

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

  startClock() {
    const updateTime = () => {
      const now = new Date();
      const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      const dayStr = days[now.getDay()];
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const hours = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const clockEl = document.getElementById('menubar-clock');
      if (clockEl) {
        clockEl.textContent = `${dayStr} ${month}月${date}日 ${hours}:${mins}`;
      }
    };
    updateTime();
    setInterval(updateTime, 30000);
  }

  bindMacOSDesktopInteractions() {
    // 1. Dock icon clicks
    const dockItems = document.querySelectorAll('.xpin-dock-item[data-dock-app]');
    dockItems.forEach(item => {
      item.addEventListener('click', () => {
        const appId = item.getAttribute('data-dock-app');
        if (this.windowManager.windows.has(appId)) {
          this.windowManager.toggleWindow(appId);
        } else if (appId === 'chartCard') {
          this.toggleFloatingCard(this.stageRenderer.dom.chartCard);
        } else if (appId === 'audioCard') {
          this.toggleFloatingCard(this.stageRenderer.dom.audioCard);
        } else if (appId === 'colorPalette') {
          this.toggleFloatingCard(this.stageRenderer.dom.colorCard);
        }
      });
    });

    // 2. Desktop Icon clicks & double clicks
    const desktopIcons = document.querySelectorAll('.xpin-desktop-icon-item');
    desktopIcons.forEach(icon => {
      icon.addEventListener('click', (e) => {
        desktopIcons.forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
        e.stopPropagation();
      });

      icon.addEventListener('dblclick', () => {
        const target = icon.getAttribute('data-target');
        const asset = icon.getAttribute('data-asset');
        if (target === 'preview') {
          if (asset) this.switchPreviewAsset(asset);
          this.windowManager.openWindow('preview');
        } else if (target === 'finder') {
          this.windowManager.openWindow('finder');
        } else if (target === 'notes') {
          this.windowManager.openWindow('notes');
        } else if (target === 'audioCard') {
          this.stageRenderer.dom.audioCard.style.display = 'block';
        }
      });
    });

    // 3. Finder File Grid double click
    const fileCards = document.querySelectorAll('.xpin-file-card');
    fileCards.forEach(card => {
      card.addEventListener('click', () => {
        fileCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });

      card.addEventListener('dblclick', () => {
        const assetKey = card.getAttribute('data-asset');
        const action = card.getAttribute('data-action');
        if (assetKey) {
          this.switchPreviewAsset(assetKey);
          this.windowManager.openWindow('preview');
          this.stageRenderer.showToast(`已在预览中打开：${this.scene.data.assets[assetKey].name}`);
        } else if (action === 'open-notes') {
          this.windowManager.openWindow('notes');
        } else if (action === 'open-safari') {
          this.windowManager.openWindow('safari');
        } else if (action === 'open-audio') {
          this.stageRenderer.dom.audioCard.style.display = 'block';
        }
      });
    });

    // 4. Preview Window Toolbar Controls
    const assetSelector = document.getElementById('preview-asset-selector');
    if (assetSelector) {
      assetSelector.addEventListener('change', (e) => {
        this.switchPreviewAsset(e.target.value);
      });
    }

    const btnZoomIn = document.getElementById('btn-zoom-in');
    const btnZoomOut = document.getElementById('btn-zoom-out');
    const btnZoomReset = document.getElementById('btn-zoom-reset');
    const btnZoomFit = document.getElementById('btn-zoom-fit');

    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => this.adjustPreviewZoom(0.3));
    }
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => this.adjustPreviewZoom(-0.3));
    }
    if (btnZoomReset) {
      btnZoomReset.addEventListener('click', () => this.setPreviewZoom(1.0));
    }
    if (btnZoomFit) {
      btnZoomFit.addEventListener('click', () => this.setPreviewZoom(1.0));
    }

    // 5. Spotlight Search Toggle
    const btnSpotlight = document.getElementById('btn-menubar-spotlight');
    const dockSearchPill = document.getElementById('dock-search-pill');
    if (btnSpotlight) {
      btnSpotlight.addEventListener('click', () => this.toggleSpotlight());
    }
    if (dockSearchPill) {
      dockSearchPill.addEventListener('click', () => this.toggleSpotlight());
    }

    const spotlightOverlay = document.getElementById('xpin-spotlight');
    const spotlightInput = document.getElementById('spotlight-input');
    if (spotlightInput) {
      spotlightInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.toggleSpotlight(false);
        } else if (e.key === 'Enter') {
          const selected = spotlightOverlay.querySelector('.xpin-spotlight-item.selected');
          if (selected) selected.click();
        }
      });
    }

    const spotlightItems = document.querySelectorAll('.xpin-spotlight-item');
    spotlightItems.forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        const asset = item.getAttribute('data-asset');
        if (action === 'open-preview') {
          if (asset) this.switchPreviewAsset(asset);
          this.windowManager.openWindow('preview');
        } else if (action === 'open-finder') {
          this.windowManager.openWindow('finder');
        } else if (action === 'open-safari') {
          this.windowManager.openWindow('safari');
        } else if (action === 'open-notes') {
          this.windowManager.openWindow('notes');
        }
        this.toggleSpotlight(false);
      });
    });

    // 6. Control Center Toggle
    const btnCC = document.getElementById('btn-menubar-cc');
    const ccPanel = document.getElementById('xpin-control-center');
    if (btnCC && ccPanel) {
      btnCC.addEventListener('click', (e) => {
        e.stopPropagation();
        ccPanel.classList.toggle('open');
      });
    }

    // 7. Menubar Dropdowns
    const menuItems = document.querySelectorAll('.xpin-menubar-item');
    menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = item.querySelector('.xpin-menubar-dropdown');
        if (!dropdown) return;
        const isOpen = dropdown.classList.contains('open');
        // Close all dropdowns
        document.querySelectorAll('.xpin-menubar-dropdown').forEach(d => d.classList.remove('open'));
        if (!isOpen) dropdown.classList.add('open');
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.xpin-menubar-dropdown').forEach(d => d.classList.remove('open'));
      if (ccPanel) ccPanel.classList.remove('open');
    });

    // Menubar Dropdown Actions
    document.querySelectorAll('[data-action]').forEach(actionEl => {
      actionEl.addEventListener('click', () => {
        const act = actionEl.getAttribute('data-action');
        this.executeMenubarAction(act);
      });
    });

    // 8. Audio play/pause button
    const btnAudioToggle = document.getElementById('btn-audio-toggle');
    if (btnAudioToggle) {
      btnAudioToggle.addEventListener('click', () => {
        this.timeline.togglePlay();
        btnAudioToggle.textContent = this.timeline.isPlaying ? '❚❚' : '▶';
      });
    }

    // Waveform click seeking
    const waveformWrap = document.getElementById('audio-waveform-wrap');
    if (waveformWrap) {
      waveformWrap.addEventListener('click', (e) => {
        const rect = waveformWrap.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        this.timeline.seek(ratio * this.timeline.duration);
        this.stageRenderer.showToast(`跳转音频位置: ${(ratio * 28).toFixed(1)}s`);
      });
    }

    // 9. Arc Chapter Item clicks (Ref-02)
    const arcItems = document.querySelectorAll('.xpin-arc-part-item');
    arcItems.forEach(item => {
      item.addEventListener('click', () => {
        arcItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const chapter = item.getAttribute('data-chapter');
        this.stageRenderer.showToast(`切换至 PART 0${chapter}`);
      });
    });

    // 10. Display Brightness Slider in Control Center
    const sliderBrightness = document.getElementById('slider-brightness');
    if (sliderBrightness) {
      sliderBrightness.addEventListener('input', (e) => {
        const val = e.target.value;
        const stageViewport = document.querySelector('.xpin-stage-viewport');
        if (stageViewport) {
          stageViewport.style.filter = `brightness(${val}%)`;
        }
      });
    }

    // 11. Theme Toggles (Menubar, Control Center, Studio Header)
    const toggleTheme = () => {
      this.scene.data.theme = (this.scene.data.theme === 'dark' ? 'light' : 'dark');
      const state = this.scene.evalAt(this.timeline.currentTime);
      this.stageRenderer.renderState(state, this.camera);
      const isDark = this.scene.data.theme === 'dark';
      this.stageRenderer.showToast(`已切换为：macOS ${isDark ? '深色外观 (Dark Mode)' : '浅色外观 (Light Mode)'}`);
      const studioThemeBtn = document.getElementById('btn-studio-theme-toggle');
      if (studioThemeBtn) {
        studioThemeBtn.innerHTML = isDark ? '🌙 深色外观' : '☀️ 浅色外观';
      }
    };

    const btnTheme = document.getElementById('btn-menubar-theme');
    const btnCCDark = document.getElementById('btn-cc-darkmode');
    const btnStudioTheme = document.getElementById('btn-studio-theme-toggle');
    if (btnTheme) btnTheme.addEventListener('click', toggleTheme);
    if (btnCCDark) btnCCDark.addEventListener('click', toggleTheme);
    if (btnStudioTheme) btnStudioTheme.addEventListener('click', toggleTheme);
  }

  toggleSpotlight(forceOpen) {
    const spotlight = this.stageRenderer.dom.spotlight;
    const input = this.stageRenderer.dom.spotlightInput;
    if (!spotlight) return;

    if (forceOpen === undefined) {
      spotlight.classList.toggle('open');
    } else if (forceOpen) {
      spotlight.classList.add('open');
    } else {
      spotlight.classList.remove('open');
    }

    if (spotlight.classList.contains('open') && input) {
      input.value = '';
      input.focus();
    }
  }

  switchPreviewAsset(assetKey) {
    this.scene.data.currentAsset = assetKey;
    this.stageRenderer.setAsset(assetKey, this.scene.data.assets);
  }

  adjustPreviewZoom(delta) {
    this.setPreviewZoom(this.currentPreviewZoom + delta);
  }

  setPreviewZoom(zoom) {
    this.currentPreviewZoom = Math.max(0.5, Math.min(3.5, zoom));
    if (this.stageRenderer.dom.photoImg) {
      this.stageRenderer.dom.photoImg.style.transform = `scale(${this.currentPreviewZoom})`;
    }
    const indicator = document.getElementById('preview-zoom-indicator');
    if (indicator) {
      indicator.textContent = `缩放: ${Math.round(this.currentPreviewZoom * 100)}%`;
    }
  }

  toggleFloatingCard(cardEl) {
    if (!cardEl) return;
    cardEl.style.display = cardEl.style.display === 'none' ? 'block' : 'none';
  }

  executeMenubarAction(action) {
    switch (action) {
      case 'open-finder':
        this.windowManager.openWindow('finder');
        break;
      case 'open-preview':
        this.windowManager.openWindow('preview');
        break;
      case 'open-safari':
        this.windowManager.openWindow('safari');
        break;
      case 'open-notes':
        this.windowManager.openWindow('notes');
        break;
      case 'open-terminal':
        this.windowManager.openWindow('terminal');
        break;
      case 'close-active':
        if (this.windowManager.activeWindowId) {
          this.windowManager.closeWindow(this.windowManager.activeWindowId);
        }
        break;
      case 'minimize-active':
        if (this.windowManager.activeWindowId) {
          this.windowManager.minimizeWindow(this.windowManager.activeWindowId);
        }
        break;
      case 'maximize-active':
        if (this.windowManager.activeWindowId) {
          this.windowManager.toggleMaximize(this.windowManager.activeWindowId);
        }
        break;
      case 'layout-default':
        this.windowManager.applyLayout('default');
        this.stageRenderer.showToast('已切换至：标准工作台布局');
        break;
      case 'layout-teardown':
        this.windowManager.applyLayout('teardown');
        this.stageRenderer.showToast('已切换至：芯片拆解特写布局');
        break;
      case 'layout-browser':
        this.windowManager.applyLayout('browser');
        this.stageRenderer.showToast('已切换至：视频评测布局');
        break;
      case 'layout-cinematic':
        this.windowManager.applyLayout('cinematic');
        this.stageRenderer.showToast('已切换至：影视总成布局');
        break;
      case 'reset-windows':
        this.windowManager.applyLayout('default');
        this.stageRenderer.showToast('已恢复默认窗口位置');
        break;
      case 'help-guide':
        alert('XPIN-Desktop 快捷键指南:\n\n• 空格键: 播放/暂停时间线\n• ⌘+Space / Ctrl+Space: 唤起聚焦搜索\n• 左右方向键: 逐帧微调\n• 双击窗口标题栏: 缩放/最大化\n• 双击桌面图标/访达文件: 直接用预览/备忘录打开');
        break;
      case 'help-about':
        alert('XPIN-Desktop · 差点桌面 Cinematic UI Motion Engine\n版本: 0.2.0 (macOS Sequoia UI Standard)\n面向科技视频、产品宣传片和影视后期使用的界面动效引擎。');
        break;
    }
  }

  bindEditorControls() {
    // 1. Mode Switcher (Interactive Desktop vs Cinematic Director)
    const btnModeDesktop = document.getElementById('btn-mode-desktop');
    const btnModeCinematic = document.getElementById('btn-mode-cinematic');

    if (btnModeDesktop && btnModeCinematic) {
      btnModeDesktop.addEventListener('click', () => {
        this.currentMode = 'desktop';
        btnModeDesktop.classList.add('active');
        btnModeCinematic.classList.remove('active');
        this.stageRenderer.showToast('🖥️ 已切换为：交互操作系统模式 (自由拖拽窗口/点击文件)');
      });

      btnModeCinematic.addEventListener('click', () => {
        this.currentMode = 'cinematic';
        btnModeCinematic.classList.add('active');
        btnModeDesktop.classList.remove('active');
        this.timeline.play();
        this.stageRenderer.showToast('🎬 已切换为：镜头导演模式 (自动时间线与运镜)');
      });
    }

    // 2. Play / Pause & Step Buttons
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

    // 3. Preset Layout Selector
    const selectLayout = document.getElementById('select-layout-preset');
    if (selectLayout) {
      selectLayout.addEventListener('change', (e) => {
        this.windowManager.applyLayout(e.target.value);
      });
    }

    // 4. Shot Selection in Shot List
    const shotItems = document.querySelectorAll('.shot-list-item');
    shotItems.forEach(item => {
      item.addEventListener('click', () => {
        const startTime = parseFloat(item.getAttribute('data-start'));
        this.currentMode = 'cinematic';
        if (btnModeCinematic) btnModeCinematic.classList.add('active');
        if (btnModeDesktop) btnModeDesktop.classList.remove('active');
        this.timeline.pause();
        this.timeline.seek(startTime);
        if (btnPlay) btnPlay.innerHTML = '▶ 播放';
      });
    });

    // 5. Right Inspector Inputs
    this.bindInput('prop-master-title', val => { this.scene.data.masterTitle = val; });
    this.bindInput('prop-master-subtitle', val => { this.scene.data.masterSubtitle = val; });
    this.bindInput('prop-art-font', val => { this.scene.data.artFontName = val; });
    this.bindInput('prop-body-font', val => { this.scene.data.bodyFontName = val; });
    this.bindInput('prop-search-placeholder', val => { this.scene.data.searchPlaceholder = val; });
    this.bindInput('prop-chip-name', val => { this.scene.data.chipName = val; });
    this.bindInput('prop-chip-spec', val => { this.scene.data.chipSpec = val; });
    this.bindInput('prop-quote-title', val => { this.scene.data.quoteTitle = val; });
    this.bindInput('prop-quote-body', val => { this.scene.data.quoteBody = val; });

    // 5.1 Breakout Button Toggles (Preview Toolbar & Inspector)
    const btnBreakout = document.getElementById('btn-breakout-toggle');
    const btnBreakoutInspector = document.getElementById('btn-trigger-breakout');
    const toggleBreakout = () => {
      if (!this.scene.data.nodeNetwork) return;
      const nn = this.scene.data.nodeNetwork;
      nn.active = !nn.active;
      if (btnBreakout) {
        btnBreakout.innerHTML = nn.active ? '🔄 恢复窗口' : '⚡ 脱框演变';
      }
      if (btnBreakoutInspector) {
        btnBreakoutInspector.innerHTML = nn.active ? '🔄 恢复预览窗口' : '⚡ 触发芯片脱框演变';
      }
      const state = this.scene.evalAt(this.timeline.currentTime);
      this.stageRenderer.renderState(state, this.camera);
      this.stageRenderer.showToast(nn.active 
        ? '✨ 已触发：芯片脱离窗口，演变为 3D 拓扑架构节点卡片！'
        : '已恢复：芯片收纳回 macOS 预览窗口');
    };
    if (btnBreakout) btnBreakout.addEventListener('click', toggleBreakout);
    if (btnBreakoutInspector) btnBreakoutInspector.addEventListener('click', toggleBreakout);

    // 5.2 3D Topology Node Network Inspector Inputs
    this.bindInput('prop-node-chip-title', val => { if (this.scene.data.nodeNetwork) this.scene.data.nodeNetwork.chipCard.title = val; });
    this.bindInput('prop-node-chip-process', val => { if (this.scene.data.nodeNetwork) this.scene.data.nodeNetwork.chipCard.process = val; });
    this.bindInput('prop-node-chip-codename', val => { if (this.scene.data.nodeNetwork) this.scene.data.nodeNetwork.chipCard.codeName = val; });
    this.bindInput('prop-node-chip-clock', val => { if (this.scene.data.nodeNetwork) this.scene.data.nodeNetwork.chipCard.clockSpeed = val; });
    this.bindInput('prop-node-cpu-title', val => { if (this.scene.data.nodeNetwork?.nodes[0]) this.scene.data.nodeNetwork.nodes[0].title = val; });
    this.bindInput('prop-node-cpu-val', val => { if (this.scene.data.nodeNetwork?.nodes[0]) this.scene.data.nodeNetwork.nodes[0].specVal = val; });
    this.bindInput('prop-node-gpu-title', val => { if (this.scene.data.nodeNetwork?.nodes[1]) this.scene.data.nodeNetwork.nodes[1].title = val; });
    this.bindInput('prop-node-gpu-val', val => { if (this.scene.data.nodeNetwork?.nodes[1]) this.scene.data.nodeNetwork.nodes[1].specVal = val; });
    this.bindInput('prop-node-npu-title', val => { if (this.scene.data.nodeNetwork?.nodes[2]) this.scene.data.nodeNetwork.nodes[2].title = val; });
    this.bindInput('prop-node-npu-val', val => { if (this.scene.data.nodeNetwork?.nodes[2]) this.scene.data.nodeNetwork.nodes[2].specVal = val; });

    // 6. 2.5D Spatial Camera 3D Sliders
    const sliderPitch = document.getElementById('cam-pitch');
    const sliderYaw = document.getElementById('cam-yaw');
    const sliderZoom = document.getElementById('cam-zoom');
    const chkManualCam = document.getElementById('cam-manual-override');
    const btnResetCam = document.getElementById('btn-reset-cam');

    const updateManualCam = () => {
      if (!this.camera.manualOverride) return;
      if (sliderPitch) this.camera.manualState.pitch = parseFloat(sliderPitch.value);
      if (sliderYaw) this.camera.manualState.yaw = parseFloat(sliderYaw.value);
      if (sliderZoom) this.camera.manualState.zoom = parseFloat(sliderZoom.value);

      const lblPitch = document.getElementById('lbl-cam-pitch');
      const lblYaw = document.getElementById('lbl-cam-yaw');
      const lblZoom = document.getElementById('lbl-cam-zoom');
      const lblZoomVal = document.getElementById('lbl-cam-zoom-val');
      if (lblPitch) lblPitch.textContent = `${this.camera.manualState.pitch}°`;
      if (lblYaw) lblYaw.textContent = `${this.camera.manualState.yaw}°`;
      if (lblZoom) lblZoom.textContent = `${this.camera.manualState.zoom.toFixed(2)}x`;
      if (lblZoomVal) lblZoomVal.textContent = `${this.camera.manualState.zoom.toFixed(2)}x`;

      const camCSS = this.camera.getCameraTransformCSS(this.camera.manualState);
      this.stageRenderer.dom.cameraWorld.style.transform = camCSS;
    };

    if (chkManualCam) {
      chkManualCam.addEventListener('change', (e) => {
        this.camera.manualOverride = e.target.checked;
        if (this.camera.manualOverride) {
          updateManualCam();
          this.stageRenderer.showToast('🎥 已开启手动 3D 摄像机机位覆盖');
        } else {
          const state = this.scene.evalAt(this.timeline.currentTime);
          this.stageRenderer.renderState(state, this.camera);
          this.stageRenderer.showToast('已切回自动分镜机位');
        }
      });
    }

    if (sliderPitch) sliderPitch.addEventListener('input', updateManualCam);
    if (sliderYaw) sliderYaw.addEventListener('input', updateManualCam);
    if (sliderZoom) sliderZoom.addEventListener('input', updateManualCam);

    if (btnResetCam) {
      btnResetCam.addEventListener('click', () => {
        if (sliderPitch) sliderPitch.value = 0;
        if (sliderYaw) sliderYaw.value = 0;
        if (sliderZoom) sliderZoom.value = 1.0;
        if (chkManualCam) chkManualCam.checked = true;
        this.camera.manualOverride = true;
        updateManualCam();
        this.stageRenderer.showToast('已重置为正面正视图 (0°, 0°)');
      });
    }

    // 7. Export Buttons
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

      // Cmd+Space or Ctrl+Space for Spotlight
      if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
        e.preventDefault();
        this.toggleSpotlight();
        return;
      }

      // Spacebar for play/pause
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
    alert('当前工程支持双击直接在任何主流浏览器中运行！可使用 scripts/build_standalone.js 随时打包最新单文件。');
  }

  exportFramePNG() {
    alert(`已在时间点 ${this.timeline.getTimecode()} 捕获高保真关键帧。可使用配套脚本逐帧渲染 1080p 视频！`);
  }
}

// Auto bootstrap on DOM loaded
window.addEventListener('DOMContentLoaded', () => {
  window.xpinStudio = new StudioApp();
});
