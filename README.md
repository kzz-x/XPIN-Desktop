# XPIN-Desktop｜差点桌面

> 用代码导演数字界面，而不是录制屏幕。  
> **Cinematic UI Motion Engine · Agent 原生的影视化界面动效引擎**

**状态：用户视觉参考截图已注入｜macOS 视觉风格卡已确立｜正式工程开发启动。**

## 它是什么？

给科技视频、产品宣传片和影视后期使用的界面动画制作系统。Agent 接收照片、文本、视频、参考画面与镜头需求，调用可复用的 UI 组件与操作行为，安排摄影机、切镜和节奏，最终交付**可编辑 HTML / 场景工程 + 按需输出视频素材**。

- **视觉定位**：原生系统辨识度 × 电影化质感 × Motion Design 动画语言。
- **首期重点**：**以用户提供的视觉模板截图先制作 macOS Cinematic Skin**，完成 Finder / Preview / 鼠标 / 镜头导演的一条成片链路；**Windows 及其他系统后续换 Skin**。
- **扩展方向**：iOS / Android、节点卡片、浏览器、数据界面、原创科技 UI。
- **交付方式**：浏览器可预览和修改；Agent 可复用、可编排；后续再探索 AE / PR 集成。

这**不是**完整操作系统模拟器，也不打算逐像素复制系统 UI。目标是让界面**一眼能认出、操作可信、画面适合短视频**。

## 一个镜头例子

“在 macOS 桌面打开手机主板照片，放大到芯片区域，弹出芯片型号，最后让照片变成节点卡片。”

引擎应组织：Finder 定位与双击 → Preview 打开 → 窗口聚焦 → 局部缩放 → 信息标注 → 卡片化转场。用户不需要重做这些基础动效。

## 文档入口

| 文档 | 作用 |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Codex / AI 开发主入口与工程约束 |
| [docs/PRODUCT.md](docs/PRODUCT.md) | 产品定位、目标用户、核心场景、范围 |
| [docs/MACOS-VISUAL-REFERENCE.md](docs/MACOS-VISUAL-REFERENCE.md) | 用户截图驱动的 macOS 视觉设计与 Skin 替换原则 |
| [docs/PRODUCTION-WORKFLOW.md](docs/PRODUCTION-WORKFLOW.md) | 最新参考研究、关键帧、动态 Previs、Agent 制作及验收规则 |
| [docs/VISUAL-AND-COMPONENTS.md](docs/VISUAL-AND-COMPONENTS.md) | 视觉语言、空间舞台、UI 组件 |
| [docs/DIRECTOR-AND-INTERACTION.md](docs/DIRECTOR-AND-INTERACTION.md) | 语义动作、指针、摄影机、时间线、分镜 |
| [docs/TECH-AND-EXPORT.md](docs/TECH-AND-EXPORT.md) | 技术原则、Agent 接口、渲染与后期集成边界 |
| [docs/ROADMAP.md](docs/ROADMAP.md) | 现有进度、开发阶段、验收与待定问题 |

## 当前进度

- 已明确产品方向及 Cinematic UI 默认模式；已确定**不用 AE 工程直接迁移，待收到截图后重建 macOS**。
- 已完成首轮组件、动作、导演系统、导出形式与阶段划分。
- 此前有过**仓库外**单 HTML 的 macOS / Windows UI 动效与视频输出可行性实验；**尚未作为正式代码导入本仓库**。
- 目前以规划和设计为准，不宣称任何功能已经在仓库实现。

## 原则

**Agent 负责组合，组件负责可靠，用户负责最终审美。**  
先通过轻量预演确定镜头、节奏与视觉，再做质量优化；源工程始终可修改。

> 现有 AE macOS 视觉模板以用户提供的**截图**作为参考来源。视觉参考已归档至 `references/macos/`，已建立设计 Token 与组件还原规范。
