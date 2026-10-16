# XPIN-Desktop｜进度与分阶段计划

**更新：2026-10-16**  
**当前阶段：用户 4 张核心视觉截图已接收并归档；风格卡 (docs/MACOS-STYLE-CARD.md) 已确立；正式启动 V0.1 全链路工程开发。**

## 已确认（产品与工作流决策）

- [x] 项目名：**差点桌面 XPIN-Desktop**；定位：Agent 原生 **Cinematic UI Motion Engine**。
- [x] 默认视觉：**影视化 UI**，要有真实系统辨识度、可信操作、电影化构图与高级 Motion Design 运动。
- [x] **用户已提供现有视觉模板的 4 张截图**，建立设计 Token 与规范，以此重建代码版 macOS 风格。无需迁移或读取 AE 工程。
- [x] **先 macOS 后 Skin 扩展**：Windows、iOS、Android、Node Canvas / Custom UI 复用底层语义、状态、导演和时间线，按系统需要适配组件外形/布局/操作。
- [x] 核心能力分层：Assets / Scene / Skin / Components / Semantic Actions / Performance / Camera Director / Timeline / Renderer / Editor。
- [x] 先研究成熟作品与资产 → 截图对照 Styleframes → 完整动态 Previs → 逐步组件化与可编辑工程 → 正式视频渲染。
- [x] 镜头必须主动设计全/中/近/微距、机位、切镜、动静快慢、口播 Marker、注意力引导和动作衔接；不只是优化缓动曲线。
- [x] Agent 应有动效导演能力：Primary / Secondary / Ambient 分层、动作因果、必要的预备/反应/收尾、速度连续性与审片回修。
- [x] 默认提供本地可编辑 HTML / 场景数据，按需导出 MP4；后期研究 AE / PR 接入，V0.1 不做原生插件。
- [x] 收到截图后即刻启动工程落地，边构建组件边验证镜头链路。

- [x] G0 截图视觉提取：4 张参考截图归档入 `references/macos/`，建立 `docs/MACOS-STYLE-CARD.md` 风格卡。
- [x] 提取了精确的颜色体系（#F96257, #FDBC2C, #51A7F9, #2BC83D）、字体体系（标小智无界黑、苹方UI-简）、6 大标志性组件规约。
- [x] 准备了高质量的硬件演示拆解素材（`assets/demo/`）。
- [x] **V0.1 核心影视镜头跑通**：桌面 → 访达双击 → 预览打开 → 芯片微距特写 → 金句气泡与3D图标转换。
- [x] **V0.2 完整 macOS 系统窗口逻辑重构**：
  - 核心窗口管理器 (`src/core/windowManager.js`)：Z-Index 层级堆叠、标题栏平滑拖拽、窗口边缘/右下角自由缩放、交通灯三色按键（红关、黄最小化、绿最大化/还原）。
  - 动态顶部菜单栏：跟随激活窗口同步当前应用名称，带真实下拉菜单（文件、编辑、显示、窗口、帮助）。
  - 真实程序坞 (macOS Dock)：亚克力微光浮动胶囊、悬浮图标放大与回弹、运行指示灯 (Running dot)、点击唤醒与最小化收回。
  - 聚焦搜索 (Spotlight Search)：`⌘+Space` 唤起全功能搜索框，支持键盘导航与应用/图纸即时跳转。
  - 控制中心 (Control Center)：包含显示器亮度与系统音量真实滑杆、Wi-Fi/蓝牙磁贴、声学示波器母带卡片。
  - 深度扩展内容资产：访达完整侧边栏与文件网格、多图纸预览器（A18 Pro 主板、iPhone 16 Pro 爆炸分解图、全景架构）、Safari 评测卡片 (Ref-01)、备忘录规格笔记、终端编译控制台。
  - 双模式工作台：`🖥️ 交互操作系统模式` 与 `🎬 镜头导演模式` 一键无缝切换。
  - 本地零依赖构建：`scripts/build_standalone.js` 自动打包单文件 `index.html`。

## 当前进行中与未完成

- [ ] 导出高清无损 4K 60fps 动态视频（Playwright + FFmpeg 自动化渲染流水线调优）。
- [ ] 扩展 Windows / Fluent 设计语言 Skin 与组件适配。
- [ ] AE / PR 剪辑导入与 MOGRT 资产生成。

## 接下来：从 G0 到 V0.1

### G0｜截图风格卡（[x] 已完成）

- [x] 接收用户截图，记录用途与镜头。
- [x] 从实际画面提取可验证的字体、字号层级、配色、标题栏、按钮、窗口比例、投影、玻璃/不透明材质与排版。
- [x] 建立 macOS 风格卡 (`docs/MACOS-STYLE-CARD.md`)；确认哪些是样式、哪些是 UI 组件、哪些依赖素材。
- [x] 输出对应截图的对照基准。

### G1 & V0.1｜正式 macOS 端到端镜头链路（进行中）

- [ ] 研究成熟的系统 UI 动效、Motion Design 和可复用的开源实现，保留参考出处。
- [ ] 设计 8–12 秒的样例：桌面 → Finder 双击照片 → Preview 打开 → 图像放大到目标区域 → 摄影机近景 / 特写 → 可选图片脱框。
- [ ] 明确截图视觉锚点、操作时点、主/次动作、全景/特写与主动切镜、口播 Marker 与节奏。
- [ ] 用低成本**动态 Previs** 验收操作因果、点击反馈、相机/窗口衔接、镜头速度连续性。

**通过标准**：动态 Previs 经用户审核；仅出静帧或静态设计稿不算通过。

### V0.1｜正式 macOS 端到端镜头链路

- [ ] 构建可读的场景格式、素材模型、稳定组件 ID 与语义 Anchor。
- [ ] Desktop / Window / Finder / Preview / Cursor 的高频基础组件。
- [ ] macOS Skin 根据截图设计基准重建，避免写死在通用 UI 引擎内部。
- [ ] openPhoto / zoomToRegion / focusWindow 等语义行为可组合，鼠标动作与界面状态一致。
- [ ] Camera Director 控制景别和镜头切换；时间线可独立 seek、暂停、逐帧。
- [ ] 图片、文字、重点区域、镜头时间节点可编辑，中文参数面板优先。
- [ ] 可直接本地打开的独立 HTML、场景数据、MP4；附简单使用说明、动态预演/效果对照和失败项列表。

**通过标准**：输入素材和镜头需求 → macOS 影视化 UI 镜头 → 人工/Agent 局部修改 → 任意时间点可复现 → HTML 与视频分别可用。

### V0.2｜编辑器、Agent 对接与 Skin 机制

- [ ] 中央预览、素材/组件、中文属性、底部时间线；Director / Timeline 双模式共用一份 Scene。
- [ ] Agent 创建/修改/验证场景的可靠接口；错误事件、资源缺失检查、素材替换/镜头锁定。
- [ ] 把 macOS 的 Token、Component Variants、行为适配从共用核心抽离并验证替换接口。
- [ ] **在 macOS 功能/视觉验收后**制作基础 Windows Skin，验证同一语义场景可跨 Skin 运行并重新构图。

**通过标准**：一个开图/放大/特写镜头能在不重写核心动作和时间线的前提下换到 Windows，并适配窗口/指针习惯。

### V0.3｜扩展影视 UI 组件

- [ ] Browser、文字编辑、Media Player、Info Card、Node Canvas。
- [ ] 可编辑内容在“系统窗口 → 悬浮空间 → 卡片/节点”转换时保持身份和视觉连续性。
- [ ] 动作 / 镜头预设库、剪辑节奏和参考来源可复用。

### V0.4｜iOS / Android 与高级导出

- [ ] 移动 UI Skin + 触控交互适配。
- [ ] 竖屏、方形、4K 的独立构图和素材排布策略。
- [ ] 按需扩展 Alpha、图像序列、音效轨、性能与质量保证。

### V1.0｜AE / PR 集成（后期）

- [ ] 优先验证外部渲染器 + AE/PR 面板 + 自动更新素材。
- [ ] 独立评估宿主逐帧渲染原生插件的技术路径，不把 WebView 操作面板当成原生视频图层。

## 本轮仓库文档

- [macOS 截图视觉基准](MACOS-VISUAL-REFERENCE.md)
- [制作与验收规则](PRODUCTION-WORKFLOW.md)
- [视觉组件](VISUAL-AND-COMPONENTS.md)
- [镜头与互动](DIRECTOR-AND-INTERACTION.md)
- [技术与导出](TECH-AND-EXPORT.md)

## Codex 下一轮入口

当前优先任务是**收到截图后建立 macOS 风格卡和视觉对照关键帧**，然后做动态 Previs。读取 [AGENTS.md](../AGENTS.md) 和上述文档即可开始设计评估。不要跳过风格审核直接进行全量系统开发。

## 未决事项

- 用户截图及对应的风格审核标准尚待输入。
- 具体渲染框架（Remotion / Motion Canvas / 自研/混合）、UI 帧级求值方案、独立 HTML 打包策略等待技术 Spike。
- 现有仓库外实验是否作为参考迁入 experiments/，需按未来开发任务决定。
- AE/PR 原生帧桥接与高质量透明输出等待后期验证。

**原则**：只给真正完成并有预览/验证证据的事项打钩。计划不是实现，实验原型不是生产基线。
