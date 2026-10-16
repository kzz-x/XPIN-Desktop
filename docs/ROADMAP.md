# XPIN-Desktop｜进度与分阶段计划

**更新：2026-10-16**  
**当前阶段：方案与制作规则已落库；等待用户提供 macOS 风格截图；正式代码尚未开发。**

## 已确认（产品与工作流决策）

- [x] 项目名：**差点桌面 XPIN-Desktop**；定位：Agent 原生 **Cinematic UI Motion Engine**。
- [x] 默认视觉：**影视化 UI**，要有真实系统辨识度、可信操作、电影化构图与高级 Motion Design 运动。
- [x] **用户只提供现有视觉模板的截图**，以此重建代码版 macOS 风格。无需迁移或读取 AE 工程。
- [x] **先 macOS 后 Skin 扩展**：Windows、iOS、Android、Node Canvas / Custom UI 复用底层语义、状态、导演和时间线，按系统需要适配组件外形/布局/操作。
- [x] 核心能力分层：Assets / Scene / Skin / Components / Semantic Actions / Performance / Camera Director / Timeline / Renderer / Editor。
- [x] 先研究成熟作品与资产 → 截图对照 Styleframes → 完整动态 Previs → 逐步组件化与可编辑工程 → 正式视频渲染。
- [x] 镜头必须主动设计全/中/近/微距、机位、切镜、动静快慢、口播 Marker、注意力引导和动作衔接；不只是优化缓动曲线。
- [x] Agent 应有动效导演能力：Primary / Secondary / Ambient 分层、动作因果、必要的预备/反应/收尾、速度连续性与审片回修。
- [x] 默认提供本地可编辑 HTML / 场景数据，按需导出 MP4；后期研究 AE / PR 接入，V0.1 不做原生插件。
- [x] 当前只更新文档与规划；正式开发交给 Codex 后续执行。

## 已有验证成果（**仓库外实验**，不要当成正式实现）

先前制作过 **XPIN Desktop Motion Engine** 实验原型，具备 macOS / Windows 桌面风格、窗口/照片预览、指针轨迹、图片缩放、可跳转时间线及 JSON 场景编辑等示例能力；曾输出独立 HTML 与约 **12.5 秒、1920×1080、24fps** 的演示 MP4，同时有 Agent JSON 和 Python 渲染脚本。

这些是**早期可行性探索**，本仓库尚未纳入原型代码，也未对照用户视觉截图完成设计验收。跨机器/浏览器、资产字体、离线环境、任意帧复现、视频颜色/FPS 与完整生产可靠性仍需独立实测。自动视频渲染可依赖 Chromium、Playwright、FFmpeg，不能与单 HTML 本地打开混为“零依赖”。

## 当前未完成

- [ ] 收到并分析**用户 macOS 视觉截图**，提取真实视觉 Token、部件与布局，建立样式对照基准。
- [ ] 首批 macOS 关键帧 Styleframes 对照审核。
- [ ] 同一镜头的**真实动态** Previs 与镜头节奏审核。
- [ ] Codex 实现正式模块化 Scene / Components / Actions / Camera / Timeline / Render 链路。
- [ ] 可编辑 HTML / 自动视频导出在干净环境下通过验收。
- [ ] Windows / 移动端 Skin、Node Canvas、AE/PR 集成。

## 接下来：从 G0 到 V0.1

### G0｜截图风格卡（下一项，**依赖用户截图**）

- [ ] 接收用户截图（可以少量逐步补充），记录用途与镜头。
- [ ] 从实际画面提取可验证的字体、字号层级、配色、标题栏、按钮、窗口比例、投影、玻璃/不透明材质与排版。
- [ ] 建立 macOS 风格卡；确认哪些是样式、哪些是 UI 组件、哪些必须依赖素材。
- [ ] 输出首批对应截图的对照 Styleframes。未提供的细节单独列为设计假设。

**通过标准**：用户认可“这就是要的 macOS 视觉风格”，而不是只有通用 macOS 模拟器外观。

### G1｜动态镜头设计（macOS）

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
