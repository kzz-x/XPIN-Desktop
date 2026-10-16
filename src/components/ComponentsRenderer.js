/**
 * XPIN-Desktop · Stage & Components Renderer
 * Renders high-fidelity cinematic UI elements conforming to references/macos/ (Ref 01 - 04)
 * Fully implements macOS Sonoma / Sequoia Window Architecture, Finder, Preview, Safari, Notes, Terminal, Dock, Spotlight, and Control Center.
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

      <!-- Toast Feedback Banner -->
      <div class="xpin-toast" id="xpin-toast">提示信息</div>

      <!-- Top macOS Menu Bar -->
      <div class="xpin-menubar" id="xpin-menubar">
        <div class="xpin-menubar-left">
          <!-- Apple Logo & Dropdown -->
          <div class="xpin-menubar-item" id="menu-apple">
            <svg width="15" height="15" viewBox="0 0 170 170" fill="currentColor">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.86-12-14.46-6.19-9.46-10.96-20.1-14.33-31.92-3.37-11.81-5.06-23.1-5.06-33.87 0-14.59 3.73-26.68 11.2-36.26 7.46-9.58 17.03-14.53 28.7-14.85 4.89 0 10.23 1.25 16.03 3.76 5.8 2.5 9.77 3.82 11.91 3.93 1.85-.11 5.94-1.46 12.27-4.04 6.33-2.58 11.83-3.76 16.51-3.54 11.33.87 20.65 5.38 27.95 13.53-10.02 6.09-14.92 14.57-14.7 25.43.22 8.7 3.69 16.09 10.42 22.18 6.74 6.09 14.57 9.4 23.51 9.95-2.29 6.85-5.11 13.8-8.47 20.84zM119.22 31.43c0-7.39 2.66-14.35 7.99-20.87 5.33-6.52 11.85-10.43 19.57-11.74.87 7.07-1.47 13.91-7.02 20.54-5.54 6.63-12.39 10.65-20.54 12.07z"/>
            </svg>
            <div class="xpin-menubar-dropdown" id="dropdown-apple">
              <div class="xpin-dropdown-item" data-action="about">关于本机...</div>
              <div class="xpin-dropdown-divider"></div>
              <div class="xpin-dropdown-item" data-action="open-settings">系统设置...<span class="xpin-menu-shortcut">⌘,</span></div>
              <div class="xpin-dropdown-item" data-action="app-store">App Store...</div>
              <div class="xpin-dropdown-divider"></div>
              <div class="xpin-dropdown-item" data-action="reset-windows">重置所有窗口布局</div>
              <div class="xpin-dropdown-divider"></div>
              <div class="xpin-dropdown-item" data-action="sleep">睡眠</div>
              <div class="xpin-dropdown-item" data-action="restart">重新启动...</div>
            </div>
          </div>

          <!-- Dynamic Active App Name -->
          <div class="xpin-menubar-item app-name" id="menu-active-app">
            <span id="active-app-name-text">访达</span>
            <div class="xpin-menubar-dropdown" id="dropdown-active-app">
              <div class="xpin-dropdown-item">关于 <span id="dropdown-about-app-name">访达</span></div>
              <div class="xpin-dropdown-divider"></div>
              <div class="xpin-dropdown-item">偏好设置...<span class="xpin-menu-shortcut">⌘,</span></div>
              <div class="xpin-dropdown-divider"></div>
              <div class="xpin-dropdown-item">隐藏<span class="xpin-menu-shortcut">⌘H</span></div>
              <div class="xpin-dropdown-item">隐藏其他<span class="xpin-menu-shortcut">⌥⌘H</span></div>
              <div class="xpin-dropdown-item">全部显示</div>
              <div class="xpin-dropdown-divider"></div>
              <div class="xpin-dropdown-item" data-action="close-active">退出 <span id="dropdown-quit-app-name">访达</span><span class="xpin-menu-shortcut">⌘Q</span></div>
            </div>
          </div>

          <!-- Menus -->
          <div class="xpin-menubar-item" id="menu-file">
            <span>文件</span>
            <div class="xpin-menubar-dropdown">
              <div class="xpin-dropdown-item" data-action="open-finder">新建访达窗口<span class="xpin-menu-shortcut">⌘N</span></div>
              <div class="xpin-dropdown-item" data-action="open-preview">用预览打开图片<span class="xpin-menu-shortcut">⌘O</span></div>
              <div class="xpin-dropdown-item" data-action="open-terminal">打开终端<span class="xpin-menu-shortcut">⌘T</span></div>
              <div class="xpin-dropdown-divider"></div>
              <div class="xpin-dropdown-item" data-action="close-active">关闭当前窗口<span class="xpin-menu-shortcut">⌘W</span></div>
            </div>
          </div>

          <div class="xpin-menubar-item" id="menu-edit">
            <span>编辑</span>
            <div class="xpin-menubar-dropdown">
              <div class="xpin-dropdown-item">撤销<span class="xpin-menu-shortcut">⌘Z</span></div>
              <div class="xpin-dropdown-item">重做<span class="xpin-menu-shortcut">⇧⌘Z</span></div>
              <div class="xpin-dropdown-divider"></div>
              <div class="xpin-dropdown-item">剪切<span class="xpin-menu-shortcut">⌘X</span></div>
              <div class="xpin-dropdown-item">拷贝<span class="xpin-menu-shortcut">⌘C</span></div>
              <div class="xpin-dropdown-item">粘贴<span class="xpin-menu-shortcut">⌘V</span></div>
              <div class="xpin-dropdown-item">全选<span class="xpin-menu-shortcut">⌘A</span></div>
            </div>
          </div>

          <div class="xpin-menubar-item" id="menu-view">
            <span>显示</span>
            <div class="xpin-menubar-dropdown">
              <div class="xpin-dropdown-item" data-action="layout-default">标准默认平铺</div>
              <div class="xpin-dropdown-item" data-action="layout-teardown">芯片拆解特写布局</div>
              <div class="xpin-dropdown-item" data-action="layout-browser">评测视频卡片布局</div>
              <div class="xpin-dropdown-item" data-action="layout-cinematic">XPIN 影视总成布局</div>
            </div>
          </div>

          <div class="xpin-menubar-item" id="menu-window">
            <span>窗口</span>
            <div class="xpin-menubar-dropdown">
              <div class="xpin-dropdown-item" data-action="minimize-active">最小化<span class="xpin-menu-shortcut">⌘M</span></div>
              <div class="xpin-dropdown-item" data-action="maximize-active">缩放 / 最大化</div>
              <div class="xpin-dropdown-divider"></div>
              <div class="xpin-dropdown-item" data-action="open-finder">访达 (Finder)</div>
              <div class="xpin-dropdown-item" data-action="open-preview">预览 (Preview)</div>
              <div class="xpin-dropdown-item" data-action="open-safari">Safari 浏览器</div>
              <div class="xpin-dropdown-item" data-action="open-notes">备忘录 (Notes)</div>
              <div class="xpin-dropdown-item" data-action="open-terminal">终端 (Terminal)</div>
            </div>
          </div>

          <div class="xpin-menubar-item" id="menu-help">
            <span>帮助</span>
            <div class="xpin-menubar-dropdown">
              <div class="xpin-dropdown-item" data-action="help-guide">XPIN 快捷键指南</div>
              <div class="xpin-dropdown-item" data-action="help-about">关于 macOS 影视化引擎</div>
            </div>
          </div>
        </div>

        <div class="xpin-menubar-right">
          <!-- Battery -->
          <div class="xpin-menubar-status-icon" title="电池：100% 已充满">
            <span>􀛨 100%</span>
          </div>
          <!-- Wi-Fi -->
          <div class="xpin-menubar-status-icon" title="Wi-Fi：XPIN-Lab-5G">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 18c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-4.9-4.9c2.7-2.7 7.1-2.7 9.8 0l1.4-1.4c-3.5-3.5-9.1-3.5-12.6 0l1.4 1.4zm-2.8-2.8c4.3-4.3 11.1-4.3 15.4 0l1.4-1.4c-5-5-13.2-5-18.2 0l1.4 1.4z"/>
            </svg>
          </div>
          <!-- Spotlight -->
          <div class="xpin-menubar-status-icon" id="btn-menubar-spotlight" title="聚焦搜索 (⌘Space)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <!-- Control Center -->
          <div class="xpin-menubar-status-icon" id="btn-menubar-cc" title="控制中心">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
            </svg>
          </div>
          <!-- Clock -->
          <div class="xpin-menubar-status-icon" id="menubar-clock" style="font-weight: 600;">
            周五 10月16日 23:59
          </div>
        </div>
      </div>

      <!-- Control Center Dropdown Panel -->
      <div class="xpin-control-center-panel" id="xpin-control-center">
        <div style="display: flex; gap: 8px;">
          <div class="xpin-cc-tile" style="flex: 1; display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; background: #007AFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
              􀙇
            </div>
            <div>
              <div style="font-size: 13px; font-weight: 700;">Wi-Fi</div>
              <div style="font-size: 11px; color: #8E8E93;">XPIN-Lab-5G</div>
            </div>
          </div>
          <div class="xpin-cc-tile" style="flex: 1; display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; background: #007AFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">
              􀤆
            </div>
            <div>
              <div style="font-size: 13px; font-weight: 700;">蓝牙</div>
              <div style="font-size: 11px; color: #8E8E93;">AirPods Max</div>
            </div>
          </div>
        </div>

        <div class="xpin-cc-tile xpin-cc-slider-row">
          <div class="xpin-cc-slider-label">显示器亮度</div>
          <input type="range" class="xpin-cc-range" id="slider-brightness" min="60" max="120" value="100">
        </div>

        <div class="xpin-cc-tile xpin-cc-slider-row">
          <div class="xpin-cc-slider-label">系统音量</div>
          <input type="range" class="xpin-cc-range" id="slider-volume" min="0" max="100" value="78">
        </div>

        <div class="xpin-cc-tile" style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; background: #F96257; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 20px;">
            ♪
          </div>
          <div style="flex: 1;">
            <div style="font-size: 13px; font-weight: 700;">音频示波器母带.mp3</div>
            <div style="font-size: 11px; color: #8E8E93;">差评硬件部 · 28s</div>
          </div>
          <button style="border: none; background: #007AFF; color: white; border-radius: 50%; width: 32px; height: 32px; font-size: 14px; cursor: pointer;">❚❚</button>
        </div>
      </div>

      <!-- Desktop Icons Layer -->
      <div class="xpin-desktop-icons" id="xpin-desktop-icons">
        <div class="xpin-desktop-icon-item" data-target="finder">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="6" y="10" width="36" height="28" rx="5" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
            <rect x="10" y="14" width="28" height="20" rx="3" fill="#64748B"/>
            <circle cx="24" cy="24" r="5" fill="#38BDF8"/>
          </svg>
          <div class="xpin-desktop-icon-label">Macintosh HD</div>
        </div>

        <div class="xpin-desktop-icon-item" data-target="preview" data-asset="soc">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="6" width="32" height="36" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
            <rect x="12" y="10" width="24" height="20" rx="2" fill="#51A7F9"/>
            <path d="M14 26l6-6 6 6 8-8" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <div class="xpin-desktop-icon-label">A18_Pro_SoC.jpg</div>
        </div>

        <div class="xpin-desktop-icon-item" data-target="preview" data-asset="exploded">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="6" width="32" height="36" rx="4" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
            <rect x="12" y="10" width="24" height="20" rx="2" fill="#10B981"/>
            <circle cx="24" cy="20" r="4" fill="#FFFFFF"/>
          </svg>
          <div class="xpin-desktop-icon-label">爆炸分解图.png</div>
        </div>

        <div class="xpin-desktop-icon-item" data-target="notes">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="6" width="32" height="36" rx="4" fill="#FEF08A" stroke="#EAB308" stroke-width="2"/>
            <line x1="14" y1="14" x2="34" y2="14" stroke="#854D0E" stroke-width="2" stroke-linecap="round"/>
            <line x1="14" y1="20" x2="30" y2="20" stroke="#854D0E" stroke-width="2" stroke-linecap="round"/>
            <line x1="14" y1="26" x2="26" y2="26" stroke="#854D0E" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <div class="xpin-desktop-icon-label">芯片架构速记.md</div>
        </div>

        <div class="xpin-desktop-icon-item" data-target="audioCard">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="8" width="32" height="32" rx="8" fill="#F87171"/>
            <path d="M18 16v16M24 12v24M30 18v12" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>
          </svg>
          <div class="xpin-desktop-icon-label">示波器音频.wav</div>
        </div>
      </div>

      <!-- Spotlight Search Floating Modal -->
      <div class="xpin-spotlight-overlay" id="xpin-spotlight">
        <div class="xpin-spotlight-header">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" stroke-width="2.5">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input class="xpin-spotlight-input" id="spotlight-input" placeholder="聚焦搜索文件、芯片图纸或应用..." />
          <span style="font-size: 11px; color: #8E8E93; border: 1px solid #D1D5DB; border-radius: 4px; padding: 2px 6px;">esc 退出</span>
        </div>
        <div class="xpin-spotlight-results" id="spotlight-results">
          <div class="xpin-spotlight-item selected" data-action="open-preview" data-asset="soc">
            <span style="font-size: 20px;">🖼️</span>
            <div>
              <div class="xpin-spotlight-title">Apple A18 Pro 晶圆微距主板图</div>
              <div class="xpin-spotlight-sub">图片 · assets/demo/logic_board_soc.jpg</div>
            </div>
          </div>
          <div class="xpin-spotlight-item" data-action="open-preview" data-asset="exploded">
            <span style="font-size: 20px;">🔬</span>
            <div>
              <div class="xpin-spotlight-title">iPhone 16 Pro 爆炸分解工程图</div>
              <div class="xpin-spotlight-sub">图纸 · assets/demo/exploded_view.png</div>
            </div>
          </div>
          <div class="xpin-spotlight-item" data-action="open-finder">
            <span style="font-size: 20px;">📁</span>
            <div>
              <div class="xpin-spotlight-title">硬件工程 (Hardware Projects)</div>
              <div class="xpin-spotlight-sub">文件夹 · 访达中打开</div>
            </div>
          </div>
          <div class="xpin-spotlight-item" data-action="open-safari">
            <span style="font-size: 20px;">🌐</span>
            <div>
              <div class="xpin-spotlight-title">Safari 硬件测评视频 card</div>
              <div class="xpin-spotlight-sub">网页 · 来源: www.youtube.com</div>
            </div>
          </div>
          <div class="xpin-spotlight-item" data-action="open-notes">
            <span style="font-size: 20px;">📝</span>
            <div>
              <div class="xpin-spotlight-title">A18 Pro 硬件规格速记与晶体管测试</div>
              <div class="xpin-spotlight-sub">备忘录 · 规格速记.md</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cinematic Camera World Stage -->
      <div class="xpin-camera-world" id="xpin-camera-world">

        <!-- (01) Context Menu Popup (Ref-04 (01)) -->
        <div class="xpin-context-menu" id="xpin-context-menu" style="left: 880px; top: 220px;">
          <span style="cursor: pointer;" id="ctx-copy">拷贝</span>
          <div class="xpin-context-menu-divider"></div>
          <span style="cursor: pointer;" id="ctx-share">共享...</span>
          <div class="xpin-context-menu-divider"></div>
          <span style="cursor: pointer;" id="ctx-quicklook">快速查看</span>
          <div class="xpin-context-menu-arrow"></div>
        </div>

        <!-- =================================================================
             1. FINDER WINDOW (访达)
             ================================================================= -->
        <div class="xpin-window xpin-finder-window" id="win-finder">
          <div class="xpin-window-titlebar">
            <div class="xpin-traffic-lights">
              <div class="xpin-traffic-dot red"></div>
              <div class="xpin-traffic-dot yellow"></div>
              <div class="xpin-traffic-dot green"></div>
            </div>
            <div class="xpin-window-title-center">
              <span>访达 — 硬件工程</span>
            </div>
            <div class="xpin-finder-search-box">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <span>搜索</span>
            </div>
          </div>

          <div class="xpin-finder-toolbar">
            <div class="xpin-finder-nav-group">
              <div class="xpin-finder-nav-btn">‹</div>
              <div class="xpin-finder-nav-btn">›</div>
              <span style="font-weight: 700; margin-left: 6px;">硬件工程</span>
            </div>
            <div class="xpin-finder-view-segmented">
              <div class="xpin-finder-view-seg active">图标</div>
              <div class="xpin-finder-view-seg">列表</div>
              <div class="xpin-finder-view-seg">分栏</div>
            </div>
          </div>

          <div class="xpin-finder-body">
            <!-- Sidebar -->
            <div class="xpin-finder-sidebar">
              <div class="xpin-sidebar-group-title">个人收藏</div>
              <div class="xpin-sidebar-item"><span style="color:#007AFF;">🏠</span> 访达主页</div>
              <div class="xpin-sidebar-item"><span style="color:#64748B;">🕒</span> 最近使用</div>
              <div class="xpin-sidebar-item"><span style="color:#3B82F6;">🚀</span> 应用程序</div>
              <div class="xpin-sidebar-item"><span style="color:#10B981;">🖥️</span> 桌面</div>
              <div class="xpin-sidebar-item active"><span style="color:#F59E0B;">📁</span> 硬件工程</div>
              <div class="xpin-sidebar-item"><span style="color:#8B5CF6;">⬇️</span> 下载</div>

              <div class="xpin-sidebar-group-title" style="margin-top: 10px;">iCloud</div>
              <div class="xpin-sidebar-item"><span style="color:#38BDF8;">☁️</span> iCloud 云盘</div>

              <div class="xpin-sidebar-group-title" style="margin-top: 10px;">标签</div>
              <div class="xpin-sidebar-item"><span style="color:#EF4444;">●</span> 重点关注</div>
              <div class="xpin-sidebar-item"><span style="color:#F59E0B;">●</span> 待审核</div>
              <div class="xpin-sidebar-item"><span style="color:#3B82F6;">●</span> 影视参考</div>
            </div>

            <!-- Content Grid -->
            <div class="xpin-finder-content">
              <div class="xpin-file-grid" id="finder-file-grid">
                <div class="xpin-file-card selected" data-asset="soc" title="双击用预览打开">
                  <div class="xpin-file-thumbnail-wrap" style="background: #1E293B;">
                    <img class="xpin-file-thumbnail-img" src="./assets/demo/logic_board_soc.jpg" alt="SoC">
                  </div>
                  <div class="xpin-file-name">A18_Pro_SoC.jpg</div>
                  <div class="xpin-file-size">2.4 MB</div>
                </div>

                <div class="xpin-file-card" data-asset="exploded" title="双击用预览打开">
                  <div class="xpin-file-thumbnail-wrap" style="background: #0F172A;">
                    <img class="xpin-file-thumbnail-img" src="./assets/demo/exploded_view.png" alt="Exploded">
                  </div>
                  <div class="xpin-file-name">爆炸分解图.png</div>
                  <div class="xpin-file-size">4.8 MB</div>
                </div>

                <div class="xpin-file-card" data-asset="layout" title="双击用预览打开">
                  <div class="xpin-file-thumbnail-wrap" style="background: #111827;">
                    <img class="xpin-file-thumbnail-img" src="./assets/demo/full_layout.jpg" alt="Layout">
                  </div>
                  <div class="xpin-file-name">全景架构.jpg</div>
                  <div class="xpin-file-size">3.1 MB</div>
                </div>

                <div class="xpin-file-card" data-action="open-notes" title="双击用备忘录打开">
                  <div class="xpin-file-thumbnail-wrap" style="background: #FEF08A;">
                    <span style="font-size: 32px;">📝</span>
                  </div>
                  <div class="xpin-file-name">硬件规格速记.md</div>
                  <div class="xpin-file-size">64 KB</div>
                </div>

                <div class="xpin-file-card" data-action="open-audio" title="双击激活音频示波器">
                  <div class="xpin-file-thumbnail-wrap" style="background: #FEE2E2;">
                    <span style="font-size: 32px;">🎧</span>
                  </div>
                  <div class="xpin-file-name">示波器音频.wav</div>
                  <div class="xpin-file-size">8.4 MB</div>
                </div>

                <div class="xpin-file-card" data-action="open-safari" title="双击打开测评视频">
                  <div class="xpin-file-thumbnail-wrap" style="background: #DBEAFE;">
                    <span style="font-size: 32px;">🌐</span>
                  </div>
                  <div class="xpin-file-name">评测视频.url</div>
                  <div class="xpin-file-size">1 KB</div>
                </div>
              </div>

              <div class="xpin-finder-statusbar">
                <span>6 个项目</span>
                <span>248.5 GB 可用空间</span>
              </div>
            </div>
          </div>
        </div>

        <!-- =================================================================
             2. PREVIEW WINDOW (预览 - Hardware Inspector)
             ================================================================= -->
        <div class="xpin-window xpin-preview-window" id="win-preview">
          <div class="xpin-window-titlebar">
            <div class="xpin-traffic-lights">
              <div class="xpin-traffic-dot red"></div>
              <div class="xpin-traffic-dot yellow"></div>
              <div class="xpin-traffic-dot green"></div>
            </div>
            <div class="xpin-window-title-center">
              <span id="preview-filename-badge">logic_board_soc.jpg — 预览</span>
            </div>
            <div class="xpin-preview-tools">
              <select class="xpin-preview-select" id="preview-asset-selector">
                <option value="soc">A18 Pro 主板晶圆剖析</option>
                <option value="exploded">iPhone 16 Pro 爆炸分解</option>
                <option value="layout">全景硬件架构走线</option>
              </select>
            </div>
          </div>

          <div class="xpin-preview-toolbar">
            <div class="xpin-preview-tools">
              <button class="xpin-preview-btn" id="btn-zoom-in">＋ 放大</button>
              <button class="xpin-preview-btn" id="btn-zoom-out">－ 缩小</button>
              <button class="xpin-preview-btn" id="btn-zoom-reset">1:1</button>
              <button class="xpin-preview-btn" id="btn-zoom-fit">适应窗口</button>
            </div>
            <span style="font-size: 11px; color: #8E8E93;" id="preview-zoom-indicator">缩放: 100%</span>
          </div>

          <div class="xpin-photo-viewport" id="photo-viewport">
            <img class="xpin-photo-img" id="photo-img-element" src="./assets/demo/logic_board_soc.jpg" alt="Hardware Inspector" />

            <!-- Highlight Target Box -->
            <div class="xpin-chip-target-box" id="chip-target-box" style="left: 310px; top: 160px; width: 140px; height: 140px;"></div>

            <!-- Callout Tag -->
            <div class="xpin-chip-callout-tag" id="chip-callout-tag" style="left: 470px; top: 200px;">
              <div style="font-size: 15px; font-weight: 800; color: #51A7F9;" id="chip-tag-name">Apple A18 Pro</div>
              <div style="font-size: 12px; color: #E5E7EB; margin-top: 3px;" id="chip-tag-spec">3nm N3P · 6核 GPU · 16核 NPU</div>
            </div>
          </div>
        </div>

        <!-- =================================================================
             3. SAFARI / BROWSER WINDOW (Ref-01 来源: www.youtube.com)
             ================================================================= -->
        <div class="xpin-window xpin-browser-window" id="win-safari" style="display: none;">
          <div class="xpin-window-titlebar">
            <div class="xpin-traffic-lights">
              <div class="xpin-traffic-dot red"></div>
              <div class="xpin-traffic-dot yellow"></div>
              <div class="xpin-traffic-dot green"></div>
            </div>
            <div class="xpin-browser-url-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">https://youtube.com/watch?v=A18_PRO_TEARDOWN</span>
            </div>
            <div class="xpin-browser-source-tag">来源: www.youtube.com</div>
          </div>

          <div class="xpin-browser-toolbar">
            <div class="xpin-browser-left-group">
              <span class="xpin-browser-back-btn" title="后退">◀</span>
              <span style="color: #94A3B8; font-size: 18px;">▶</span>
              <span style="margin-left: 8px;">差评硬件部 · 芯片微架构首发评测</span>
            </div>
            <span style="color: #8E8E93;">14:28 / 4K 60fps HDR</span>
          </div>

          <div class="xpin-browser-canvas-body">
            <div class="xpin-browser-video-preview">
              <img src="./assets/demo/logic_board_soc.jpg" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.65;" />
              <div class="xpin-browser-play-btn" id="btn-browser-video-play">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#007AFF">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
              </div>
            </div>
            <div class="xpin-browser-article">
              <div class="xpin-browser-h1">A18 Pro 性能释放与能效比深度拆解：第二代 3nm 工艺提升到底有多大？</div>
              <div class="xpin-browser-p">
                在本次硬件拆解实测中，我们对 A18 Pro 进行了显微级晶圆剥离。台积电 N3P 制程使得晶体管密度较上一代提升约 18%，在保持峰值单核 Geekbench 6 跑分超过 3400 分的同时，高负载整机功耗稳稳控制在 4.2W 以内...
              </div>
            </div>
          </div>
        </div>

        <!-- =================================================================
             4. NOTES WINDOW (备忘录)
             ================================================================= -->
        <div class="xpin-window xpin-notes-window" id="win-notes" style="display: none;">
          <div class="xpin-window-titlebar">
            <div class="xpin-traffic-lights">
              <div class="xpin-traffic-dot red"></div>
              <div class="xpin-traffic-dot yellow"></div>
              <div class="xpin-traffic-dot green"></div>
            </div>
            <div class="xpin-window-title-center">
              <span>备忘录 — A18 Pro 硬件速记</span>
            </div>
            <div style="font-size: 12px; color: #6E6E73;">已同步到 iCloud</div>
          </div>

          <div class="xpin-notes-body">
            <div class="xpin-notes-sidebar">
              <div class="xpin-notes-item active">
                <div class="xpin-notes-item-title">A18 Pro 硬件速记</div>
                <div class="xpin-notes-item-date">23:59 PM · 硬件部</div>
              </div>
              <div class="xpin-notes-item">
                <div class="xpin-notes-item-title">散热石墨烯铜箔方案</div>
                <div class="xpin-notes-item-date">昨天 · 机构分析</div>
              </div>
              <div class="xpin-notes-item">
                <div class="xpin-notes-item-title">视频口播时间轴 Marker</div>
                <div class="xpin-notes-item-date">10月14日 · 分镜</div>
              </div>
            </div>

            <div class="xpin-notes-editor">
              <h2>Apple A18 Pro 芯片规格核心参数</h2>
              <p>针对视频第 2 章节的宏观晶圆微距，以下为重点标定参数：</p>
              <table class="xpin-specs-table">
                <tr><th>模块分类</th><th>技术规格</th><th>对比上一代提升</th></tr>
                <tr><td>制造工艺</td><td>台积电 3nm N3P 第二代</td><td>能效比提升 20%</td></tr>
                <tr><td>CPU 架构</td><td>2×性能核 4.04GHz + 4×能效核</td><td>单核 +18%</td></tr>
                <tr><td>GPU 单元</td><td>6-Core 桌面级着色单元</td><td>光线追踪速度 ×2</td></tr>
                <tr><td>神经引擎</td><td>16-Core NPU (35 TOPS)</td><td>内存带宽 8533Mbps</td></tr>
              </table>
              <div style="margin-top: 14px; font-weight: 700; color: #007AFF;">
                ☑ 显微图确认无误 &nbsp;&nbsp;&nbsp; ☑ 示波器采样已校准 &nbsp;&nbsp;&nbsp; ☐ 终审成片导出
              </div>
            </div>
          </div>
        </div>

        <!-- =================================================================
             5. TERMINAL WINDOW (终端 / ZSH Compiler)
             ================================================================= -->
        <div class="xpin-window xpin-terminal-window" id="win-terminal" style="display: none;">
          <div class="xpin-window-titlebar">
            <div class="xpin-traffic-lights">
              <div class="xpin-traffic-dot red"></div>
              <div class="xpin-traffic-dot yellow"></div>
              <div class="xpin-traffic-dot green"></div>
            </div>
            <div class="xpin-window-title-center">
              <span>kevin@macbook-pro: ~/xpin-desktop (zsh) — 80x24</span>
            </div>
            <div style="font-size: 11px; color: #64748B;">4K 60fps</div>
          </div>

          <div class="xpin-terminal-body">
            <div><span class="terminal-prompt">kevin@macbook-pro</span>:<span class="terminal-accent">~/xpin-desktop</span>$ xpin build --target cinematic-macos --soc a18pro</div>
            <div class="terminal-success">✔ Initializing macOS Sonoma Window Environment [OK]</div>
            <div class="terminal-success">✔ Mounting File Browser virtual filesystem: 6 assets loaded [OK]</div>
            <div class="terminal-success">✔ Loaded hardware schematics: logic_board_soc.jpg (2400x1600) [OK]</div>
            <div>[INFO] Calibrating 28s audio spectrum waveform bars... 36 frequency bins ready.</div>
            <div>[INFO] Camera director initialized: 5 cinematic shots calibrated.</div>
            <div class="terminal-success">⚡ macOS Cinematic Stage is live and ready for production!</div>
            <div style="margin-top: 8px;"><span class="terminal-prompt">kevin@macbook-pro</span>:<span class="terminal-accent">~/xpin-desktop</span>$ <span class="terminal-cursor"></span></div>
          </div>
        </div>

        <!-- =================================================================
             6. CENTER MASTER WINDOW (Ref-04 Typography & Selection)
             ================================================================= -->
        <div class="xpin-window xpin-master-window" id="win-master">
          <div class="xpin-window-titlebar">
            <div class="xpin-traffic-lights">
              <div class="xpin-traffic-dot red"></div>
              <div class="xpin-traffic-dot yellow"></div>
              <div class="xpin-traffic-dot green"></div>
            </div>
            <span class="xpin-window-title-badge" id="win-subtitle-badge">X.PIN · IOS Core</span>
            <div style="font-size: 11px; color: #8E8E93;">影视总成</div>
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

        <!-- (04) Audio Player Card -->
        <div class="xpin-card xpin-audio-card" id="xpin-audio-card" style="left: 1120px; top: 150px;">
          <div class="xpin-audio-header">
            <div class="xpin-audio-title-group">
              <span style="font-size: 14px; cursor: pointer;" id="btn-audio-toggle">❚❚</span>
              <span>音频.mp3</span>
            </div>
            <span style="color: #8E8E93;" id="audio-duration-label">28s</span>
          </div>
          <div class="xpin-audio-waveform-wrap" id="audio-waveform-wrap" title="点击跳转时间位置">
            <div class="xpin-audio-waveform-bars" id="waveform-bars">
              <!-- Dynamically populated -->
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
            <!-- Swatches dynamically loaded -->
          </div>
        </div>

        <!-- (06) Dock Search Bar & Guide Frame (Ref-04 (06)) -->
        <div class="xpin-dock-search-wrap" id="xpin-dock-search-wrap" style="left: 830px; top: 740px;">
          <div class="xpin-dock-guide-box">
            <div class="xpin-dock-guide-marker" style="top: -8px; left: 50%; transform: translateX(-50%);"></div>
            <div class="xpin-dock-guide-marker" style="bottom: -8px; left: 50%; transform: translateX(-50%);"></div>
          </div>
          <div class="xpin-dock-search-pill" id="dock-search-pill" title="点击打开聚焦搜索 (⌘Space)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E6E73" stroke-width="2.5">
              <circle cx="11" cy="11" r="7"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input class="xpin-dock-search-input" id="dock-search-input" readonly value="差评硬件部新视觉" />
            <div style="display: flex; gap: 8px; color: #8E8E93; font-weight: 700;">
              <span>⌘Space</span>
              <span>☰</span>
            </div>
          </div>
          <!-- Sun icon for brightness/lighting reference -->
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FDBC2C" stroke-width="2.5">
            <circle cx="12" cy="12" r="5" fill="#FDBC2C" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
        </div>

        <!-- Ref-02: Arc Chapter Selector -->
        <div class="xpin-arc-chapter-wrap" id="xpin-arc-chapter-wrap" style="left: 600px; top: 280px; display: none;">
          <div class="xpin-arc-parts-row">
            <div class="xpin-arc-part-item" data-chapter="1">
              <div class="xpin-arc-part-label">PART</div>
              <div class="xpin-arc-part-number">01</div>
            </div>
            <div class="xpin-arc-part-item active" data-chapter="2">
              <div class="xpin-arc-part-indicator"></div>
              <div class="xpin-arc-part-label">PART</div>
              <div class="xpin-arc-part-number">02</div>
            </div>
            <div class="xpin-arc-part-item" data-chapter="3">
              <div class="xpin-arc-part-label">PART</div>
              <div class="xpin-arc-part-number">03</div>
            </div>
            <div class="xpin-arc-part-item" data-chapter="4">
              <div class="xpin-arc-part-label">PART</div>
              <div class="xpin-arc-part-number">04</div>
            </div>
          </div>

          <div style="margin-top: 80px; text-align: center;">
            <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 12px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #FF5F56;"></span>
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #FFBD2E;"></span>
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #27C93F;"></span>
            </div>
            <div style="font-family: var(--xpin-font-display); font-size: 36px; font-weight: 900; letter-spacing: 2px;" id="arc-chapter-title">第二章：芯片微架构与能效比</div>
            <div style="font-size: 15px; color: #6E6E73; margin-top: 6px;" id="arc-chapter-subtitle">台积电第二代 3nm N3P 制程 · 晶体管微距剖析</div>
          </div>
        </div>

        <!-- Ref-03: Quote Bubble & 3D Icons -->
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
            <div class="xpin-quote-bubble-title" id="quote-card-title">金句案例</div>
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

      <!-- =================================================================
           AUTHENTIC MACOS DOCK
           ================================================================= -->
      <div class="xpin-dock-wrapper" id="xpin-dock">
        <div class="xpin-dock-pill">
          <!-- Finder -->
          <div class="xpin-dock-item app-running app-active" data-dock-app="finder" title="访达 (Finder)">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="10" fill="#E2E8F0"/>
              <path d="M4 22c0-8 6-14 14-14h12c8 0 14 6 14 14v4c0 8-6 14-14 14H18c-8 0-14-6-14-14v-4z" fill="#3B82F6"/>
              <path d="M16 18c0 4 2 8 8 8s8-4 8-8" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
              <circle cx="16" cy="18" r="2.5" fill="#FFFFFF"/>
              <circle cx="32" cy="18" r="2.5" fill="#FFFFFF"/>
              <path d="M20 30c2 3 6 3 8 0" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>

          <!-- Safari -->
          <div class="xpin-dock-item" data-dock-app="safari" title="Safari 浏览器">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="20" fill="#38BDF8"/>
              <circle cx="24" cy="24" r="16" fill="#0284C7"/>
              <polygon points="24 10 27 21 38 24 27 27 24 38 21 27 10 24 21 21" fill="#EF4444"/>
              <polygon points="24 10 21 21 10 24 21 27 24 38 23 27 12 24 23 21" fill="#FFFFFF"/>
            </svg>
          </div>

          <!-- Preview -->
          <div class="xpin-dock-item app-running" data-dock-app="preview" title="预览 (Preview / 芯片剖析)">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="6" y="6" width="36" height="36" rx="9" fill="#10B981"/>
              <circle cx="18" cy="18" r="5" fill="#FFFFFF"/>
              <path d="M10 36l10-12 8 10 6-6 8 8" fill="#FFFFFF" opacity="0.9"/>
            </svg>
          </div>

          <!-- Notes -->
          <div class="xpin-dock-item" data-dock-app="notes" title="备忘录 (Notes)">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="6" y="6" width="36" height="36" rx="9" fill="#FEF08A"/>
              <rect x="6" y="6" width="36" height="10" rx="4" fill="#EAB308"/>
              <line x1="12" y1="22" x2="36" y2="22" stroke="#854D0E" stroke-width="2"/>
              <line x1="12" y1="28" x2="30" y2="28" stroke="#854D0E" stroke-width="2"/>
            </svg>
          </div>

          <!-- Terminal -->
          <div class="xpin-dock-item" data-dock-app="terminal" title="终端 (Terminal)">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="6" y="6" width="36" height="36" rx="9" fill="#1E293B"/>
              <path d="M14 18l6 6-6 6" stroke="#4ADE80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <line x1="22" y1="30" x2="32" y2="30" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>

          <!-- Master Workspace -->
          <div class="xpin-dock-item app-running" data-dock-app="masterWindow" title="XPIN 核心工作台">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="6" y="6" width="36" height="36" rx="9" fill="#6366F1"/>
              <rect x="14" y="14" width="20" height="20" rx="3" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="2 3"/>
              <circle cx="24" cy="24" r="4" fill="#FFFFFF"/>
            </svg>
          </div>

          <div class="xpin-dock-divider"></div>

          <!-- Line Chart -->
          <div class="xpin-dock-item" data-dock-app="chartCard" title="折线图数据卡">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="6" y="6" width="36" height="36" rx="9" fill="#F43F5E"/>
              <path d="M12 32l8-10 6 6 10-12" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <!-- Audio Waveform -->
          <div class="xpin-dock-item" data-dock-app="audioCard" title="示波器音频">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="6" y="6" width="36" height="36" rx="9" fill="#F59E0B"/>
              <path d="M14 24v-6m5 12V14m5 16V10m5 18V16m5 10v-4" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>

          <!-- Color Palette -->
          <div class="xpin-dock-item" data-dock-app="colorPalette" title="调色盘面板">
            <svg viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="18" fill="#EC4899"/>
              <circle cx="18" cy="18" r="3" fill="#FFFFFF"/>
              <circle cx="28" cy="16" r="3" fill="#FDE047"/>
              <circle cx="30" cy="26" r="3" fill="#67E8F9"/>
            </svg>
          </div>

          <div class="xpin-dock-divider"></div>

          <!-- Trash -->
          <div class="xpin-dock-item" id="dock-trash" title="废纸篓">
            <svg viewBox="0 0 48 48" fill="none">
              <rect x="12" y="14" width="24" height="24" rx="4" fill="#94A3B8"/>
              <path d="M8 14h32M18 14V10h12v4" stroke="#64748B" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
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
    
    // Windows
    this.dom.winFinder = document.getElementById('win-finder');
    this.dom.winPreview = document.getElementById('win-preview');
    this.dom.winSafari = document.getElementById('win-safari');
    this.dom.winNotes = document.getElementById('win-notes');
    this.dom.winTerminal = document.getElementById('win-terminal');
    this.dom.winMaster = document.getElementById('win-master');
    
    // Cards
    this.dom.chartCard = document.getElementById('xpin-chart-card');
    this.dom.audioCard = document.getElementById('xpin-audio-card');
    this.dom.colorCard = document.getElementById('xpin-color-card');
    this.dom.quoteWrap = document.getElementById('xpin-quote-wrap');
    this.dom.arcChapterWrap = document.getElementById('xpin-arc-chapter-wrap');

    // Controls & Overlays
    this.dom.spotlight = document.getElementById('xpin-spotlight');
    this.dom.spotlightInput = document.getElementById('spotlight-input');
    this.dom.controlCenter = document.getElementById('xpin-control-center');
    this.dom.toast = document.getElementById('xpin-toast');
    this.dom.menubarClock = document.getElementById('menubar-clock');
    this.dom.activeAppNameText = document.getElementById('active-app-name-text');

    // Dynamic Preview & SoC bindings
    this.dom.photoImg = document.getElementById('photo-img-element');
    this.dom.previewFilename = document.getElementById('preview-filename-badge');
    this.dom.previewAssetSelector = document.getElementById('preview-asset-selector');
    this.dom.chipCallout = document.getElementById('chip-callout-tag');
    this.dom.chipName = document.getElementById('chip-tag-name');
    this.dom.chipSpec = document.getElementById('chip-tag-spec');

    // Master bindings
    this.dom.winHeadline = document.getElementById('win-main-headline');
    this.dom.winSubtitle = document.getElementById('win-subtitle-badge');
    this.dom.labelArtFont = document.getElementById('label-art-font');
    this.dom.labelBodyFont = document.getElementById('label-body-font');
    this.dom.dockInput = document.getElementById('dock-search-input');
    this.dom.quoteTitle = document.getElementById('quote-card-title');
    this.dom.quoteBody = document.getElementById('quote-card-body');
    this.dom.chartBadge = document.getElementById('chart-badge-val');
    this.dom.audioDuration = document.getElementById('audio-duration-label');
  }

  showToast(message, durationMs = 2000) {
    if (!this.dom.toast) return;
    this.dom.toast.textContent = message;
    this.dom.toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      this.dom.toast.classList.remove('show');
    }, durationMs);
  }

  initWaveform() {
    if (!this.dom.waveformContainer) return;
    this.dom.waveformContainer.innerHTML = '';
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
      <div class="xpin-color-row" data-hex="${c.hex}" title="点击复制色值">
        <div class="xpin-color-chip" style="background: ${c.hex};"></div>
        <span class="xpin-color-code">${c.hex}</span>
      </div>
    `).join('');

    // Attach click to copy
    this.dom.colorList.querySelectorAll('.xpin-color-row').forEach(row => {
      row.addEventListener('click', () => {
        const hex = row.getAttribute('data-hex');
        navigator.clipboard?.writeText(hex);
        this.showToast(`已复制颜色代码 ${hex}`);
      });
    });
  }

  setAsset(assetKey, assetsData) {
    const asset = assetsData[assetKey];
    if (!asset || !this.dom.photoImg) return;
    this.dom.photoImg.src = asset.file;
    if (this.dom.previewFilename) this.dom.previewFilename.textContent = `${asset.name} — 预览`;
    if (this.dom.chipName) this.dom.chipName.textContent = asset.callout.title;
    if (this.dom.chipSpec) this.dom.chipSpec.textContent = asset.callout.spec;
    if (this.dom.previewAssetSelector) this.dom.previewAssetSelector.value = assetKey;
  }

  /**
   * Applies evaluated state deterministically to stage DOM (used by Cinematic Director)
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

    // 4. Preview Window (Hardware Demo: Apple SoC Zoom & Macro Annotation)
    const pw = sceneState.previewWindowState;
    if (pw.visible && sceneState.visibility.preview) {
      if (this.dom.winPreview) {
        this.dom.winPreview.style.opacity = String(pw.opacity);
        // Image zoom & pan inside viewport
        this.dom.photoImg.style.transform = `scale(${pw.imageZoom}) translate(${pw.imagePanX}px, ${pw.imagePanY}px)`;
        // Chip Annotation
        this.dom.chipCallout.style.opacity = String(pw.annotationOpacity);
        this.dom.chipCallout.style.transform = `translateY(${(1 - pw.annotationOpacity) * 10}px)`;
      }
    }

    // 5. Quote Bubble Stage (Ref-03)
    const qs = sceneState.quoteState;
    if (qs.visible && sceneState.visibility.quoteBubble) {
      this.dom.quoteWrap.style.display = 'flex';
      this.dom.quoteWrap.style.opacity = String(qs.opacity);
      this.dom.quoteWrap.style.transform = `scale(${qs.scale})`;
      if (this.dom.winMaster) {
        this.dom.winMaster.style.opacity = String(1 - qs.opacity * 0.85);
      }
    } else {
      this.dom.quoteWrap.style.display = 'none';
      if (this.dom.winMaster) {
        this.dom.winMaster.style.opacity = '1';
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
    if (this.dom.chipName && !sceneState.data.currentAsset) this.dom.chipName.textContent = sceneState.data.chipName;
    if (this.dom.chipSpec && !sceneState.data.currentAsset) this.dom.chipSpec.textContent = sceneState.data.chipSpec;
    if (this.dom.chartBadge) this.dom.chartBadge.textContent = sceneState.data.chartDataValue;
    if (this.dom.audioDuration) this.dom.audioDuration.textContent = sceneState.data.audioDuration;
  }
}
