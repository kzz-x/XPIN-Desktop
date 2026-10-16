# macOS Cinematic Skin 风格卡与视觉基准 (V0.1)

> 依据用户于 2026-10-16 提供的 4 张官方视觉设计截图完成提取。  
> 归档截图位于：`references/macos/`

---

## 1. 参考截图归档映射

| 编号 | 截图文件 | 场景与部件 | 视觉核心特征 |
| :--- | :--- | :--- | :--- |
| **Ref-01** | `ref-01-browser-window.png` | 浏览器卡片窗口 | `来源: www.youtube.com`，明黄色返回键、极简导航图标、圆角内容展示视口、细腻网格点阵底纹 |
| **Ref-02** | `ref-02-arc-chapter-selector.png` | 章节与弧形导航 | 弧形圆盘排布 `Part 01` - `Part 04`（`Part 02` 高亮并带天蓝指示条）、红黄绿三色信号灯、第二章标题与小标题虚线框选器 |
| **Ref-03** | `ref-03-quote-bubble-3d-icons.png` | 金句气泡与 3D 图标 | 左上角 `金句案例` 瞄准准星标牌、大号亮天蓝色对话气泡（前后双引号装饰）、微浮雕 3D 拟真质感应用图标（Wi-Fi、iCloud、Messages） |
| **Ref-04** | `ref-04-macos-desktop-components.png` | **macOS 影视化桌面总成** | 顶部 macOS 菜单栏（`.PIN`、23:59 PM）、(01) 悬浮菜单、(02) 折线图卡片、(03) 3D Folder 图标、(04) 波形音频卡片、(05) 调色盘、(06) 底部搜索胶囊栏与引导线、居中核心窗体与字体设置器 |

---

## 2. 视觉 Tokens 体系

### 2.1 颜色系统 (Color Palette)

```css
:root {
  /* 基础环境 */
  --xpin-bg-canvas: #ECEEF1;            /* 桌面整体背景底色，高级浅暖冷中性灰 */
  --xpin-bg-grid-dot: rgba(0, 0, 0, 0.08); /* 点阵网格雷达微弧线微色 */
  
  /* 核心卡片与表面 */
  --xpin-surface-card: #FFFFFF;          /* 卡片与窗口白色实色表面 */
  --xpin-surface-subtle: #F7F8FA;        /* 次级背景、内嵌容器底色 */
  --xpin-surface-border: rgba(0, 0, 0, 0.06); /* 超轻细腻微描边 */
  
  /* 标志性色彩 (提取自 Ref-04 (05) 颜色卡片与系统组件) */
  --xpin-color-coral-red: #F96257;       /* 信号红 / 窗口关闭钮 / 波形高亮游标 / 调色盘色01 */
  --xpin-color-warm-amber: #FDBC2C;      /* 暖金琥珀 / 窗口最小化钮 / 调色盘色02 / 提示指示器 */
  --xpin-color-apple-green: #2BC83D;     /* 亮苹果绿 / 窗口最大化钮 / 调色盘色04 / 激活选中状态 */
  --xpin-color-sky-blue: #51A7F9;        /* 亮天青蓝 / 焦点选框 / 鼠标指针 / 气泡主体 / 调色盘色03 */
  
  /* 文字与层级 */
  --xpin-text-primary: #1D1D1F;          /* 标题、强黑主文案 */
  --xpin-text-secondary: #6E6E73;        /* 路径、说明文案、副标题 */
  --xpin-text-muted: #8E8E93;            /* 禁用态、辅助说明、刻度月份文字 */
  
  /* 强调与辅助 */
  --xpin-accent-guide: #F59E0B;          /* 参考线、辅助对齐框颜色 (橙黄色) */
  --xpin-accent-selection: #3B82F6;      /* 蓝手柄边框选中器 */
  --xpin-quote-bubble-bg: #4BA2F6;       /* 金句气泡主底色 */
}
```

### 2.2 字体排印规范 (Typography)

- **艺术大标题 / 粗重视觉字**：`标小智无界黑`, `Impact`, `'Arial Black'`, sans-serif（字重 800-900，紧凑字距）。
- **界面常规排印**：`苹方-简`, `PingFang SC`, `'SF Pro Display'`, -apple-system, sans-serif（清晰、中性、高辨识度）。
- **数据与时间刻度**：`SF Pro Text`, `JetBrains Mono`, `'Segoe UI'`, monospace。

### 2.3 投影与纵深规范 (Shadows & Elevation)

- **窗口与悬浮大卡片**：`box-shadow: 0 20px 48px -8px rgba(0, 0, 0, 0.08), 0 4px 16px -2px rgba(0, 0, 0, 0.04);`
- **悬浮小气泡 / 上下文菜单 (01)**：`box-shadow: 0 10px 28px -4px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);`
- **拟真 3D 图标浮雕微光**：柔和多重投射，背光轻微漫射，立体圆角厚度感。

### 2.4 圆角与间距规范 (Radii & Spacing)

- **大窗口外框**：`border-radius: 20px;`
- **功能卡片 (折线图、音频、颜色)**：`border-radius: 16px;`
- **底部搜索胶囊**：`border-radius: 9999px;` (Pill shape)
- **上下文菜单 / 小型标签**：`border-radius: 10px;`

---

## 3. 六大标志性组件视觉规格还原

### (01) 上下文菜单 (Context Menu)
- **外观**：纯白胶囊浮层，两项操作 `Copy | Share...`，中间带浅灰竖分割线。
- **指示器**：带下/上方微型居中小三角箭头，紧贴目标对象。

### (02) 折线图卡片 (Line Chart Card)
- **头部**：左侧 `折线图` 粗黑标题，右侧三条横杠汉堡菜单图标。
- **图表区**：平滑渐变面积折线图（粉红至珊瑚红渐变填充），峰值红圆点打点，上方浮动黑色数字气泡标签 `235条`。
- **底轴**：月份时间标记 `Jan  Feb  Mar  Apr  May  Jun`。

### (03) 3D 立体文件夹 (3D Folder Icon)
- **外观**：macOS 经典蓝色折叠文件夹，外夹层透出白色文档信纸头部，底部白色字样 `Folder`，柔和立体光影。

### (04) 音频播放卡片 (Audio Card)
- **头部**：左侧暂停双竖线图标 + `音频.mp3`，右侧时长 `28s`。
- **声波区**：多段竖线频率声波条，带垂直红色指针游标（顶部红色水滴/药丸定位标记）。

### (05) 调色盘面板 (Color Palette)
- **头部**：左侧 `颜色` 粗黑标题，右侧三条横杠汉堡图标。
- **色块列表**：
  1. `#F96257` (珊瑚红)
  2. `#FDBC2C` (暖琥珀)
  3. `#51A7F9` (天青蓝)
  4. `#2BC83D` (活力绿)
  每个色块均为扁平圆角矩形，右侧带完整十六进制色值字样。

### (06) 底部搜索胶囊与参考线 (Dock Search Bar & Guides)
- **胶囊主体**：纯白柔和阴影胶囊，左侧放大镜图标 + 占位文字 `差评硬件部新视觉`，右侧分界按钮与列表/汉堡切换键。
- **导演辅助视界**：外围环绕橙黄色裁切对齐辅助框（Crop guides）与黄色小太阳亮度标记。

### 居中核心工作窗 (Center Master Window)
- **标题栏**：红黄绿三色 Traffic Lights，标题徽章 `X.PIN 硬件部 IOS Core`。
- **交互选区**：天蓝色细虚线框选器，四角与四边共 8 个蓝色手柄圆点，伴随天蓝色立体箭头光标。
- **选项排印**：
  - `○ 艺术字体: [ 标小智无界黑 ]`
  - `✔ 常规字体: [ 苹方UI-简 ]`
