/**
 * XPIN-Desktop · macOS Window Manager
 * Implements genuine macOS window mechanics:
 * - Active focus & Z-Index stacking
 * - Smooth titlebar dragging with stage boundary snapping
 * - Resizing via corner and border resizers
 * - Traffic light controls: Red (close), Yellow (minimize to Dock), Green (maximize/restore)
 * - Dock synchronization & bounce indicators
 * - Active app menu bar synchronization
 */

export class WindowManager {
  constructor(stageElement, options = {}) {
    this.stage = stageElement;
    this.stageWidth = options.stageWidth || 1920;
    this.stageHeight = options.stageHeight || 1080;
    this.menubarHeight = options.menubarHeight || 32;
    this.dockHeight = options.dockHeight || 70;

    this.windows = new Map();
    this.activeWindowId = null;
    this.baseZIndex = 20;
    this.currentMaxZ = 20;

    // Callbacks
    this.onActiveChange = options.onActiveChange || null;
    this.onWindowStateChange = options.onWindowStateChange || null;

    this.initGlobalEvents();
  }

  initGlobalEvents() {
    // Stage background click deselects or focuses desktop
    this.stage.addEventListener('mousedown', (e) => {
      if (e.target === this.stage || e.target.classList.contains('xpin-bg-layer') || e.target.classList.contains('xpin-camera-world')) {
        this.deselectAllWindows();
      }
    });
  }

  /**
   * Registers a window element into the manager
   */
  registerWindow(id, element, config = {}) {
    if (!element) return;

    const winData = {
      id,
      el: element,
      title: config.title || '窗口',
      appName: config.appName || '访达',
      appIcon: config.appIcon || null,
      x: config.defaultX !== undefined ? config.defaultX : 200,
      y: config.defaultY !== undefined ? config.defaultY : 120,
      width: config.defaultWidth || 600,
      height: config.defaultHeight || 420,
      minWidth: config.minWidth || 320,
      minHeight: config.minHeight || 200,
      isOpen: config.isOpen !== undefined ? config.isOpen : true,
      isMinimized: false,
      isMaximized: false,
      previousBounds: null,
      dockTargetSelector: config.dockTargetSelector || null,
      onFocus: config.onFocus || null,
      onClose: config.onClose || null
    };

    // Apply initial position & size
    this.applyWindowGeometry(winData);
    if (!winData.isOpen) {
      element.style.display = 'none';
    }

    // Attach interaction handles
    this.bindWindowInteractions(winData);

    this.windows.set(id, winData);

    if (winData.isOpen && !this.activeWindowId) {
      this.focusWindow(id);
    }

    return winData;
  }

  bindWindowInteractions(winData) {
    const el = winData.el;

    // 1. Focus on mousedown anywhere on window
    el.addEventListener('mousedown', (e) => {
      // Don't swallow traffic lights or buttons
      this.focusWindow(winData.id);
    });

    // 2. Dragging via titlebar
    const titlebar = el.querySelector('.xpin-window-titlebar') || el.querySelector('.xpin-card-header') || el;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let initialWinX = 0;
    let initialWinY = 0;

    const onMouseDown = (e) => {
      // Ignore traffic lights or interactive controls inside titlebar
      if (e.target.closest('.xpin-traffic-dot') || e.target.closest('button') || e.target.closest('input') || e.target.closest('.xpin-window-resizer')) {
        return;
      }
      if (winData.isMaximized) return; // Can't drag maximized window

      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      initialWinX = winData.x;
      initialWinY = winData.y;
      this.focusWindow(winData.id);

      el.classList.add('is-dragging');
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      // Get current stage scale ratio if stage is scaled inside studio viewport
      const stageRect = this.stage.getBoundingClientRect();
      const scale = stageRect.width / this.stageWidth || 1.0;

      const deltaX = (e.clientX - dragStartX) / scale;
      const deltaY = (e.clientY - dragStartY) / scale;

      let newX = initialWinX + deltaX;
      let newY = initialWinY + deltaY;

      // Constrain within stage bounds
      const minX = -winData.width + 100;
      const maxX = this.stageWidth - 100;
      const minY = this.menubarHeight;
      const maxY = this.stageHeight - 40;

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      winData.x = newX;
      winData.y = newY;
      this.applyWindowGeometry(winData);
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      el.classList.remove('is-dragging');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    titlebar.addEventListener('mousedown', onMouseDown);

    // Double click titlebar to toggle maximize
    titlebar.addEventListener('dblclick', (e) => {
      if (e.target.closest('.xpin-traffic-dot') || e.target.closest('button')) return;
      this.toggleMaximize(winData.id);
    });

    // 3. Traffic Lights bindings
    const redDot = el.querySelector('.xpin-traffic-dot.red');
    const yellowDot = el.querySelector('.xpin-traffic-dot.yellow');
    const greenDot = el.querySelector('.xpin-traffic-dot.green');

    if (redDot) {
      redDot.title = '关闭 (⌘W)';
      redDot.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeWindow(winData.id);
      });
    }

    if (yellowDot) {
      yellowDot.title = '最小化 (⌘M)';
      yellowDot.addEventListener('click', (e) => {
        e.stopPropagation();
        this.minimizeWindow(winData.id);
      });
    }

    if (greenDot) {
      greenDot.title = '最大化 / 还原';
      greenDot.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMaximize(winData.id);
      });
    }

    // 4. Window Resizer Handle (bottom-right corner)
    let resizer = el.querySelector('.xpin-window-resizer');
    if (!resizer) {
      resizer = document.createElement('div');
      resizer.className = 'xpin-window-resizer';
      el.appendChild(resizer);
    }

    let isResizing = false;
    let resizeStartX = 0;
    let resizeStartY = 0;
    let initialW = 0;
    let initialH = 0;

    const onResizeDown = (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (winData.isMaximized) return;

      isResizing = true;
      resizeStartX = e.clientX;
      resizeStartY = e.clientY;
      initialW = winData.width;
      initialH = winData.height;
      this.focusWindow(winData.id);

      el.classList.add('is-resizing');
      document.addEventListener('mousemove', onResizeMove);
      document.addEventListener('mouseup', onResizeUp);
    };

    const onResizeMove = (e) => {
      if (!isResizing) return;
      const stageRect = this.stage.getBoundingClientRect();
      const scale = stageRect.width / this.stageWidth || 1.0;

      const deltaW = (e.clientX - resizeStartX) / scale;
      const deltaH = (e.clientY - resizeStartY) / scale;

      const newW = Math.max(winData.minWidth, initialW + deltaW);
      const newH = Math.max(winData.minHeight, initialH + deltaH);

      winData.width = newW;
      winData.height = newH;
      this.applyWindowGeometry(winData);
    };

    const onResizeUp = () => {
      if (!isResizing) return;
      isResizing = false;
      el.classList.remove('is-resizing');
      document.removeEventListener('mousemove', onResizeMove);
      document.removeEventListener('mouseup', onResizeUp);
    };

    resizer.addEventListener('mousedown', onResizeDown);
  }

  applyWindowGeometry(winData) {
    const el = winData.el;
    el.style.left = `${Math.round(winData.x)}px`;
    el.style.top = `${Math.round(winData.y)}px`;
    el.style.width = `${Math.round(winData.width)}px`;
    el.style.height = `${Math.round(winData.height)}px`;
  }

  focusWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    if (winData.isMinimized) {
      this.restoreWindow(id);
      return;
    }

    this.currentMaxZ += 2;
    winData.el.style.zIndex = this.currentMaxZ;

    // Remove active state from others
    for (const [wId, w] of this.windows) {
      if (wId === id) {
        w.el.classList.add('active-window');
        w.el.classList.remove('inactive-window');
      } else {
        w.el.classList.remove('active-window');
        w.el.classList.add('inactive-window');
      }
    }

    this.activeWindowId = id;

    // Update Dock indicator
    this.updateDockIndicators();

    // Fire callback for top menu bar
    if (this.onActiveChange) {
      this.onActiveChange(winData);
    }
  }

  deselectAllWindows() {
    this.activeWindowId = null;
    for (const [, w] of this.windows) {
      w.el.classList.remove('active-window');
      w.el.classList.add('inactive-window');
    }
    if (this.onActiveChange) {
      this.onActiveChange({ appName: '访达', id: 'finder' });
    }
  }

  openWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    winData.isOpen = true;
    winData.isMinimized = false;
    winData.el.style.display = '';
    winData.el.classList.remove('is-minimized', 'is-closed');
    
    // Smooth popup entrance
    winData.el.style.opacity = '0';
    winData.el.style.transform = 'scale(0.92) translateY(12px)';
    winData.el.style.transition = 'opacity 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
    
    requestAnimationFrame(() => {
      winData.el.style.opacity = '1';
      winData.el.style.transform = 'scale(1) translateY(0)';
      setTimeout(() => {
        winData.el.style.transition = '';
      }, 250);
    });

    this.focusWindow(id);
    this.updateDockIndicators();
    if (this.onWindowStateChange) this.onWindowStateChange(winData);
  }

  closeWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    winData.el.style.transition = 'opacity 0.18s ease-in, transform 0.18s ease-in';
    winData.el.style.opacity = '0';
    winData.el.style.transform = 'scale(0.92) translateY(10px)';

    setTimeout(() => {
      winData.isOpen = false;
      winData.el.style.display = 'none';
      winData.el.style.transition = '';
      winData.el.style.opacity = '1';
      winData.el.style.transform = '';
      this.updateDockIndicators();

      if (winData.onClose) winData.onClose();
      if (this.onWindowStateChange) this.onWindowStateChange(winData);

      // Focus another open window if available
      if (this.activeWindowId === id) {
        const nextWin = Array.from(this.windows.values()).find(w => w.isOpen && !w.isMinimized);
        if (nextWin) {
          this.focusWindow(nextWin.id);
        } else {
          this.deselectAllWindows();
        }
      }
    }, 180);
  }

  minimizeWindow(id) {
    const winData = this.windows.get(id);
    if (!winData || winData.isMinimized) return;

    winData.isMinimized = true;
    winData.el.classList.add('is-minimized');

    // Smooth macOS Genie/Scale to dock animation
    winData.el.style.transition = 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)';
    winData.el.style.opacity = '0';
    winData.el.style.transform = 'scale(0.2) translateY(300px)';
    winData.el.style.pointerEvents = 'none';

    setTimeout(() => {
      winData.el.style.display = 'none';
      winData.el.style.pointerEvents = '';
      this.updateDockIndicators();
      if (this.onWindowStateChange) this.onWindowStateChange(winData);

      // Focus next open window
      if (this.activeWindowId === id) {
        const nextWin = Array.from(this.windows.values()).find(w => w.isOpen && !w.isMinimized);
        if (nextWin) {
          this.focusWindow(nextWin.id);
        } else {
          this.deselectAllWindows();
        }
      }
    }, 280);
  }

  restoreWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    winData.isMinimized = false;
    winData.isOpen = true;
    winData.el.style.display = '';
    winData.el.classList.remove('is-minimized');

    // Pop back from dock
    winData.el.style.transition = 'all 0.28s cubic-bezier(0.16, 1, 0.3, 1)';
    winData.el.style.opacity = '1';
    winData.el.style.transform = 'scale(1) translateY(0)';

    setTimeout(() => {
      winData.el.style.transition = '';
    }, 280);

    this.focusWindow(id);
    this.updateDockIndicators();
    if (this.onWindowStateChange) this.onWindowStateChange(winData);
  }

  toggleMaximize(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    if (winData.isMaximized) {
      // Restore previous bounds
      winData.isMaximized = false;
      winData.el.classList.remove('is-maximized');
      if (winData.previousBounds) {
        winData.x = winData.previousBounds.x;
        winData.y = winData.previousBounds.y;
        winData.width = winData.previousBounds.width;
        winData.height = winData.previousBounds.height;
      }
    } else {
      // Save current bounds and expand
      winData.previousBounds = {
        x: winData.x,
        y: winData.y,
        width: winData.width,
        height: winData.height
      };
      winData.isMaximized = true;
      winData.el.classList.add('is-maximized');

      // Maximized geometry with nice margins
      winData.x = 24;
      winData.y = this.menubarHeight + 12;
      winData.width = this.stageWidth - 48;
      winData.height = this.stageHeight - this.menubarHeight - this.dockHeight - 32;
    }

    winData.el.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    this.applyWindowGeometry(winData);
    setTimeout(() => {
      winData.el.style.transition = '';
    }, 260);

    this.focusWindow(id);
  }

  toggleWindow(id) {
    const winData = this.windows.get(id);
    if (!winData) return;

    if (!winData.isOpen) {
      this.openWindow(id);
    } else if (winData.isMinimized) {
      this.restoreWindow(id);
    } else if (this.activeWindowId === id) {
      this.minimizeWindow(id);
    } else {
      this.focusWindow(id);
    }
  }

  updateDockIndicators() {
    for (const [id, winData] of this.windows) {
      const dockItem = document.querySelector(`[data-dock-app="${id}"]`);
      if (dockItem) {
        if (winData.isOpen) {
          dockItem.classList.add('app-running');
          if (this.activeWindowId === id && !winData.isMinimized) {
            dockItem.classList.add('app-active');
          } else {
            dockItem.classList.remove('app-active');
          }
        } else {
          dockItem.classList.remove('app-running', 'app-active');
        }
      }
    }
  }

  /**
   * Applies preset window layouts for quick workflows
   */
  applyLayout(presetName) {
    switch (presetName) {
      case 'default':
        // Standard balanced layout: Finder on left, Preview on right, cards around
        this.setWindowBounds('finder', 180, 80, 780, 520);
        this.setWindowBounds('preview', 860, 110, 880, 580);
        this.setWindowBounds('safari', 320, 160, 860, 560, false);
        this.setWindowBounds('notes', 1140, 260, 680, 480, false);
        this.setWindowBounds('terminal', 520, 460, 720, 400, false);
        this.setWindowBounds('masterWindow', 680, 240, 560, 460, true);
        this.openWindow('finder');
        this.openWindow('preview');
        this.focusWindow('preview');
        break;

      case 'teardown':
        // Hardware Teardown focus: Large Preview, Notes on side, Terminal underneath
        this.setWindowBounds('preview', 80, 60, 1100, 720);
        this.setWindowBounds('notes', 1210, 60, 650, 500);
        this.setWindowBounds('terminal', 1210, 580, 650, 360);
        this.openWindow('preview');
        this.openWindow('notes');
        this.openWindow('terminal');
        this.focusWindow('preview');
        break;

      case 'finder':
        // File Manager emphasis: Center Finder + Quick Look Preview
        this.setWindowBounds('finder', 240, 100, 960, 620);
        this.setWindowBounds('preview', 1040, 160, 780, 540);
        this.openWindow('finder');
        this.openWindow('preview');
        this.focusWindow('finder');
        break;

      case 'browser':
        // Tech review & web video breakdown: Safari front & center
        this.setWindowBounds('safari', 160, 60, 1160, 740);
        this.setWindowBounds('notes', 1340, 120, 520, 620);
        this.openWindow('safari');
        this.openWindow('notes');
        this.focusWindow('safari');
        break;

      case 'cinematic':
        // Ref-04 Master layout: Master Window + Chart + Audio + Palette + Folder
        this.setWindowBounds('masterWindow', 670, 240, 560, 460);
        this.openWindow('masterWindow');
        this.focusWindow('masterWindow');
        break;
    }
  }

  setWindowBounds(id, x, y, width, height, open = true) {
    const winData = this.windows.get(id);
    if (!winData) return;
    winData.x = x;
    winData.y = y;
    winData.width = width;
    winData.height = height;
    winData.isMaximized = false;
    winData.el.classList.remove('is-maximized');
    this.applyWindowGeometry(winData);
    if (open) {
      this.openWindow(id);
    }
  }
}
