/**
 * XPIN-Desktop · Standalone Single-File Packager (Node.js)
 * Bundles all modular CSS, JS, and demo assets into a self-contained index.html
 * that runs instantly when double-clicked locally via file:/// with ZERO CORS errors.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function buildStandalone() {
  console.log('📦 Starting XPIN-Desktop Standalone Bundling...');

  // 1. Read CSS
  const cssPath = path.join(repoRoot, 'src', 'skin', 'macos.css');
  const macosCss = fs.readFileSync(cssPath, 'utf-8');

  // 2. Base64 encode demo images
  const encodeB64 = (relPath, mimeType) => {
    const fullPath = path.join(repoRoot, relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn(`Warning: asset not found: ${fullPath}`);
      return '';
    }
    const buf = fs.readFileSync(fullPath);
    return `data:${mimeType};base64,${buf.toString('base64')}`;
  };

  const imgSocB64 = encodeB64('assets/demo/logic_board_soc.jpg', 'image/jpeg');
  const imgExplodedB64 = encodeB64('assets/demo/exploded_view.png', 'image/png');
  const imgLayoutB64 = encodeB64('assets/demo/full_layout.jpg', 'image/jpeg');

  // 3. Read JS files in strict dependency order
  const jsFiles = [
    'src/core/interpolator.js',
    'src/core/timeline.js',
    'src/core/camera.js',
    'src/core/windowManager.js',
    'src/core/scene.js',
    'src/components/ComponentsRenderer.js',
    'src/main.js'
  ];

  const bundleParts = [];
  for (const relPath of jsFiles) {
    const fullPath = path.join(repoRoot, relPath);
    let code = fs.readFileSync(fullPath, 'utf-8');

    // Strip import and export statements
    code = code.replace(/import\s+.*?from\s+['"].*?['"];?/g, '');
    code = code.replace(/export\s+(const|class|function|let|var)\s+/g, '$1 ');
    code = code.replace(/export\s*\{[^}]*\};?/g, '');
    code = code.replace(/export\s+default\s+.*?;?/g, '');

    // Replace relative image URLs with base64 URIs
    code = code.replaceAll('./assets/demo/logic_board_soc.jpg', imgSocB64);
    code = code.replaceAll('./assets/demo/exploded_view.png', imgExplodedB64);
    code = code.replaceAll('./assets/demo/full_layout.jpg', imgLayoutB64);

    bundleParts.push(`// --- ${relPath} ---\n${code}`);
  }

  const bundledJs = `(function() {\n${bundleParts.join('\n\n')}\n})();`;

  // 4. Construct complete self-contained HTML template
  const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>XPIN-Desktop · 差点桌面 Cinematic UI Motion Engine (macOS Sequoia UI Standard)</title>
  <style>
/* --- inlined macos.css --- */
${macosCss}
  </style>
  <style>
    /* Studio IDE Dark Shell */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #0F1115;
      color: #E2E8F0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Top Studio Header */
    .studio-header {
      height: 44px;
      background: #181B22;
      border-bottom: 1px solid #282E3B;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      font-size: 13px;
      font-weight: 500;
      z-index: 50;
    }

    .studio-brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .studio-badge {
      background: #2563EB;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.5px;
    }

    .studio-title {
      font-weight: 700;
      color: #F8FAFC;
    }

    .studio-header-center {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;
      color: #94A3B8;
    }

    .mode-switcher-group {
      display: flex;
      background: #101217;
      border: 1px solid #282E3B;
      border-radius: 6px;
      padding: 2px;
    }

    .btn-mode-tab {
      background: transparent;
      border: none;
      color: #94A3B8;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s;
    }

    .btn-mode-tab:hover {
      color: #FFFFFF;
    }

    .btn-mode-tab.active {
      background: #2563EB;
      color: #FFFFFF;
      box-shadow: 0 2px 6px rgba(37, 99, 235, 0.4);
    }

    .layout-select {
      background: #1C2029;
      color: #E2E8F0;
      border: 1px solid #282E3B;
      border-radius: 6px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 600;
      outline: none;
      cursor: pointer;
    }

    .status-pill {
      background: rgba(34, 197, 94, 0.15);
      color: #4ADE80;
      border: 1px solid rgba(34, 197, 94, 0.3);
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
    }

    .studio-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-header {
      background: #282E3B;
      color: #E2E8F0;
      border: 1px solid #3B4252;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background 0.15s, border-color 0.15s;
    }

    .btn-header:hover {
      background: #3B4252;
      border-color: #4B5563;
    }

    .btn-header.primary {
      background: #2563EB;
      border-color: #3B82F6;
      color: #FFFFFF;
    }

    .btn-header.primary:hover {
      background: #1D4ED8;
    }

    /* Main Workspace Layout: 3 Columns */
    .studio-workspace {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    /* Left Sidebar: Assets & Shot Director */
    .sidebar-left {
      width: 290px;
      background: #14171E;
      border-right: 1px solid #232936;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .sidebar-section {
      padding: 14px 16px;
      border-bottom: 1px solid #232936;
    }

    .sidebar-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #64748B;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .shot-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .shot-list-item {
      padding: 8px 10px;
      background: #1C2029;
      border: 1px solid #282E3B;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.15s;
    }

    .shot-list-item:hover {
      background: #232834;
      border-color: #3B82F6;
    }

    .shot-list-item.active {
      background: #1E293B;
      border-color: #3B82F6;
      color: #60A5FA;
      font-weight: 700;
    }

    .shot-time-badge {
      font-size: 10px;
      background: #0F172A;
      padding: 2px 5px;
      border-radius: 4px;
      color: #94A3B8;
      font-family: monospace;
    }

    .guide-tip-box {
      background: rgba(37, 99, 235, 0.1);
      border: 1px solid rgba(37, 99, 235, 0.3);
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 11px;
      line-height: 1.6;
      color: #93C5FD;
    }

    /* Center Stage Viewport */
    .stage-outer-wrapper {
      flex: 1;
      background: #0B0D11;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }

    #xpin-stage-container {
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
      border-radius: 4px;
    }

    /* Right Sidebar: Inspector */
    .sidebar-right {
      width: 320px;
      background: #14171E;
      border-left: 1px solid #232936;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .form-group {
      margin-bottom: 12px;
    }

    .form-group label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: #94A3B8;
      margin-bottom: 5px;
    }

    .form-input, .form-textarea {
      width: 100%;
      background: #1C2029;
      border: 1px solid #2B3242;
      border-radius: 6px;
      padding: 7px 10px;
      color: #F8FAFC;
      font-size: 13px;
      outline: none;
      transition: border-color 0.15s;
    }

    .form-input:focus, .form-textarea:focus {
      border-color: #3B82F6;
    }

    .form-textarea {
      resize: vertical;
      min-height: 60px;
      font-family: inherit;
    }

    /* Bottom Studio Timeline Transport */
    .studio-timeline-footer {
      height: 56px;
      background: #181B22;
      border-top: 1px solid #282E3B;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      gap: 16px;
      z-index: 50;
    }

    .transport-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-transport {
      background: #282E3B;
      color: #F1F5F9;
      border: 1px solid #3B4252;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .btn-transport:hover {
      background: #3B4252;
    }

    .timecode-display {
      font-family: monospace;
      font-size: 14px;
      font-weight: 700;
      color: #38BDF8;
      background: #0F172A;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #1E293B;
      letter-spacing: 0.5px;
    }

    .timeline-scrubber-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .timeline-slider {
      flex: 1;
      -webkit-appearance: none;
      appearance: none;
      height: 6px;
      border-radius: 3px;
      background: #2D3748;
      outline: none;
      cursor: pointer;
    }

    .timeline-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #38BDF8;
      cursor: pointer;
      box-shadow: 0 0 6px rgba(56, 189, 248, 0.6);
    }

    .current-shot-indicator {
      font-size: 12px;
      font-weight: 600;
      color: #94A3B8;
      background: #1C2029;
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid #282E3B;
      white-space: nowrap;
    }

    /* Headless mode hiding studio chrome */
    body.mode-headless .studio-header,
    body.mode-headless .sidebar-left,
    body.mode-headless .sidebar-right,
    body.mode-headless .studio-timeline-footer {
      display: none !important;
    }

    body.mode-headless .stage-outer-wrapper {
      background: transparent;
      padding: 0;
    }
  </style>
</head>
<body>

  <!-- Studio Top Navigation Bar -->
  <header class="studio-header">
    <div class="studio-brand">
      <span class="studio-badge">XPIN-DESKTOP</span>
      <span class="studio-title">差点桌面 · Cinematic UI Studio</span>
    </div>

    <div class="studio-header-center">
      <!-- Mode Switcher -->
      <div class="mode-switcher-group">
        <button class="btn-mode-tab active" id="btn-mode-desktop" title="全功能交互：窗口拖拽、文件双击、Dock激活">
          🖥️ 交互桌面模式
        </button>
        <button class="btn-mode-tab" id="btn-mode-cinematic" title="影视镜头模式：时间线运镜与自动动作">
          🎬 镜头导演模式
        </button>
      </div>

      <!-- Layout Selector -->
      <div style="display: flex; align-items: center; gap: 6px;">
        <span style="font-size: 11px; color: #64748B;">布局预设:</span>
        <select class="layout-select" id="select-layout-preset">
          <option value="default">标准双窗平铺 (Finder + 预览)</option>
          <option value="teardown">芯片拆解特写 (预览大窗 + 备忘录 + 终端)</option>
          <option value="browser">视频评测布局 (Safari + 备忘录)</option>
          <option value="cinematic">影视总成卡片 (Ref-04 核心窗 + 图表)</option>
          <option value="finder">访达文件管理器聚焦</option>
        </select>
      </div>

      <span class="status-pill">macOS Sequoia UI Standard</span>
    </div>

    <div class="studio-actions">
      <button class="btn-header" id="btn-export-json" title="保存场景配置为 JSON 文件">💾 导出工程 JSON</button>
      <button class="btn-header" id="btn-export-png" title="截取当前时间码超清关键帧">📸 关键帧截屏</button>
      <button class="btn-header primary" id="btn-export-html" title="打包独立零依赖 HTML">⚡ 打包单文件</button>
    </div>
  </header>

  <!-- Studio Main Workspace: 3 Columns -->
  <main class="studio-workspace">
    <!-- Left Sidebar -->
    <aside class="sidebar-left">
      <div class="sidebar-section">
        <div class="sidebar-title">
          <span>💡 交互指南</span>
        </div>
        <div class="guide-tip-box">
          • <strong>窗口拖拽</strong>：按住窗口标题栏可自由平移<br>
          • <strong>交通灯按键</strong>：红(关闭) / 黄(最小化至Dock) / 绿(最大化)<br>
          • <strong>文件联动</strong>：双击访达文件直接在预览或备忘录中打开<br>
          • <strong>聚焦搜索</strong>：按 <code>⌘+Space</code> 或点击菜单栏放大镜<br>
          • <strong>程序坞</strong>：点击底部程序坞可切换/唤醒应用
        </div>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">
          <span>🎬 影视分镜列表 (Shots)</span>
          <span style="font-size: 10px; color: #38BDF8;">5 个机位</span>
        </div>
        <div class="shot-list">
          <div class="shot-list-item active" data-start="0.0" data-shot-id="shot-1">
            <span>01. 桌面全景 Establishing</span>
            <span class="shot-time-badge">00.0s</span>
          </div>
          <div class="shot-list-item" data-start="2.5" data-shot-id="shot-2">
            <span>02. 中景 访达文件双击</span>
            <span class="shot-time-badge">02.5s</span>
          </div>
          <div class="shot-list-item" data-start="4.8" data-shot-id="shot-3">
            <span>03. 特写 A18 Pro 晶圆微距</span>
            <span class="shot-time-badge">04.8s</span>
          </div>
          <div class="shot-list-item" data-start="8.5" data-shot-id="shot-4">
            <span>04. 匹配转场 金句气泡与3D</span>
            <span class="shot-time-badge">08.5s</span>
          </div>
          <div class="shot-list-item" data-start="10.8" data-shot-id="shot-5">
            <span>05. 收束 影视桌面总成</span>
            <span class="shot-time-badge">10.8s</span>
          </div>
        </div>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">
          <span>📁 硬件素材库 (Assets)</span>
        </div>
        <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
          <div style="background: #1C2029; padding: 6px 8px; border-radius: 4px; display: flex; justify-content: space-between;">
            <span>A18_Pro_SoC.jpg</span>
            <span style="color: #64748B;">2.4 MB</span>
          </div>
          <div style="background: #1C2029; padding: 6px 8px; border-radius: 4px; display: flex; justify-content: space-between;">
            <span>iPhone16_Exploded.png</span>
            <span style="color: #64748B;">4.8 MB</span>
          </div>
          <div style="background: #1C2029; padding: 6px 8px; border-radius: 4px; display: flex; justify-content: space-between;">
            <span>Full_Layout.jpg</span>
            <span style="color: #64748B;">3.1 MB</span>
          </div>
          <div style="background: #1C2029; padding: 6px 8px; border-radius: 4px; display: flex; justify-content: space-between;">
            <span>Audio_Voiceover.wav</span>
            <span style="color: #64748B;">8.4 MB</span>
          </div>
        </div>
      </div>
    </aside>

    <!-- Center Stage Outer Wrapper -->
    <section class="stage-outer-wrapper" id="stage-outer-wrapper">
      <div id="xpin-stage-container">
        <!-- Rendered dynamically by StageRenderer -->
      </div>
    </section>

    <!-- Right Sidebar: Inspector -->
    <aside class="sidebar-right">
      <div class="sidebar-section">
        <div class="sidebar-title">
          <span>🎨 视觉与核心排印</span>
        </div>
        <div class="form-group">
          <label>中心大标题 (Ref-04 核心词)</label>
          <input type="text" class="form-input" id="prop-master-title" value="硬件部" />
        </div>
        <div class="form-group">
          <label>副标题徽章</label>
          <input type="text" class="form-input" id="prop-master-subtitle" value="X.PIN · IOS Core" />
        </div>
        <div class="form-group">
          <label>艺术字体名称</label>
          <input type="text" class="form-input" id="prop-art-font" value="标小智无界黑" />
        </div>
        <div class="form-group">
          <label>常规字体名称</label>
          <input type="text" class="form-input" id="prop-body-font" value="苹方UI-简" />
        </div>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">
          <span>🔬 芯片拆解标注 (Annotation)</span>
        </div>
        <div class="form-group">
          <label>芯片型号 / 标注名称</label>
          <input type="text" class="form-input" id="prop-chip-name" value="Apple A18 Pro" />
        </div>
        <div class="form-group">
          <label>核心工艺与技术规格</label>
          <textarea class="form-textarea" id="prop-chip-spec">台积电 3nm N3P · 6核 CPU / 6核 GPU · 16核神经网络引擎 · 200亿晶体管</textarea>
        </div>
      </div>

      <div class="sidebar-section">
        <div class="sidebar-title">
          <span>💬 金句与搜索文案</span>
        </div>
        <div class="form-group">
          <label>底部搜索框占位文案 (Ref-04 (06))</label>
          <input type="text" class="form-input" id="prop-search-placeholder" value="差评硬件部新视觉" />
        </div>
        <div class="form-group">
          <label>金句卡片大标题 (Ref-03)</label>
          <input type="text" class="form-input" id="prop-quote-title" value="金句案例" />
        </div>
        <div class="form-group">
          <label>金句引言内容</label>
          <textarea class="form-textarea" id="prop-quote-body">对话框样式，就是对话框样式，也是一种对话框的样式。</textarea>
        </div>
      </div>
    </aside>
  </main>

  <!-- Bottom Timeline Transport Bar -->
  <footer class="studio-timeline-footer">
    <div class="transport-controls">
      <button class="btn-transport" id="btn-step-back">❚◀ 上一帧</button>
      <button class="btn-transport" id="btn-play-pause">▶ 播放</button>
      <button class="btn-transport" id="btn-step-fwd">▶❚ 下一帧</button>
    </div>

    <div class="timecode-display" id="timeline-timecode">00:00:00:00 / 00:00:12:00</div>

    <div class="timeline-scrubber-wrap">
      <input type="range" class="timeline-slider" id="timeline-scrubber" min="0" max="12" step="0.04" value="0" />
    </div>

    <div class="current-shot-indicator" id="current-shot-badge">01. 全景 Establishing</div>
  </footer>

  <!-- Bundled Script -->
  <script>
${bundledJs}
  </script>
</body>
</html>
`;

  // Write to index.html directly
  const targetIndex = path.join(repoRoot, 'index.html');
  fs.writeFileSync(targetIndex, htmlContent, 'utf-8');

  // Also write to dist/standalone.html
  const distDir = path.join(repoRoot, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  const targetDist = path.join(distDir, 'standalone.html');
  fs.writeFileSync(targetDist, htmlContent, 'utf-8');

  const sizeKb = Buffer.byteLength(htmlContent, 'utf-8') / 1024;
  console.log(`✅ Successfully built standalone zero-dependency HTML: ${sizeKb.toFixed(1)} KB`);
  console.log(`   Updated: ${targetIndex}`);
  console.log(`   Created: ${targetDist}`);
}

buildStandalone();
