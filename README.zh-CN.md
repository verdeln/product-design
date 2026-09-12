# Verdeln 产品交互原型

本仓库是独立、非生产的设计试验。架构与业务规范仍在 `verdeln/docs`；这里没有连接真实账号、模型、GitHub 执行器、Slack、邮箱、支付或生产数据。

[English](README.md) · [范围与生产交接](docs/HANDOFF.md) · [测试记录](tests/evidence.json)

## 启动

使用 Node.js 22+：

```sh
npm ci
npm run build
npm run preview
```

打开终端显示的地址。也可直接打开生成的 **`dist/standalone.html`**：样式、图标和代码都在同一文件中，无运行依赖、远程字体或 CDN。Hash 路由不要求服务器 rewrite。浏览器允许时将模拟状态保存到 localStorage；不允许时明确提示内存模式，关闭前可导出。不要输入秘密或真实机密资料。

`npm run dev` 会构建并启动预览服务，但没有热更新；修改源码后重新构建。`npm test` 会执行构建、严格 TypeScript 检查与模型测试。

## 如何比较三种方案

顶部 **A Studio / B Focus / C Console** 随时切换同一业务状态下的三种布局。A 是平衡的项目工作台，B 更偏阅读和创作，C 更紧凑、偏执行观察。右上角独立切换明暗。移动端通过 Sections 打开项目分区，不强塞七个横向 Tab。

三种布局都沿用既有纸白／中性深色、绿色强调和系统字体。它们是待选择的布局试验，不是已经批准的品牌变更，也不是新的生产设计系统。

## 建议实际走一遍的流程

打开 **Editor collaboration → Sources**，筛选或选中来源，进入详情创建 Highlight。将来源拖到 Chat 入口，或用 Attach to Chat；它只进入可移除的上下文 chip，不会自动发送或创建任务。

进入 **Work**，检查人的工作和 AI task 的不同状态。新建 AI task 要明确接受目标、固定标准和预算。Chat 回复是标明模拟的固定逻辑，执行推进通过显式 Simulate 按钮，不伪装后台真实 agent。

进入 **Outputs → Collaboration brief → Review & publish**，对比精确产物修订和目的地。点击 **Simulate a concurrent edit** 后，旧批准会失效；必须 Refresh review，再批准。成功后 Overview、Work、Outputs、Activity 共用状态更新，产物修订与可变目的地仍然分开。

打开 **Explore states / Prototype controls** 注入来源撤权、目标过期、未知发送结果，或者切换 viewer/offline/signed-out。Unknown 不提供自动 Resend；核查是显式模拟，不会发送真实消息。移除 Project Source 只移除引用，不删除 Library 来源。空项目、归档/恢复、跨项目跳转、JSON 和 Markdown 导出也可操作。

## 实现与验证边界

代码使用 **严格 TypeScript + 原生浏览器组件**，不是 React/TanStack 生产实现。选择布局后应将对应组件接回主仓既有 React shell 和真实 API；不要复制模拟状态当成生产 Task/文档权威。页面正文修改、协作、权限、计费和外部效果在这里都是模拟。

已通过：严格编译、**36 项模型/路由/存储测试**、**16 项 Chromium 浏览器场景**。浏览器场景分四批运行，使用同一 standalone 文件；覆盖 1440px、720px、390px，检查焦点、路由、拖入上下文、过期发布、状态联动及页面横向溢出。修复过对话框 Tab 焦点逸出，并复测通过。

浏览器检查以 `set_content` 加载 HTML，**测试的是存储不可用时的内存回退**，未验证真实 origin 的 localStorage 持久化、实际 file:// 打开、真实服务或原生移动端。720px reflow 不是完整浏览器 200% zoom 验收，也不代表通过 WCAG。环境使用预装 TypeScript 5.8.3；依赖已锁定，但受网络限制没有实跑 `npm ci`。

执行浏览器测试：

```sh
python -m pip install -r tests/requirements.txt
python -m playwright install chromium
npm run test:browser
```

也可设置 `CHROMIUM_EXECUTABLE` 指定系统 Chromium。`CASE_FILTER` 可按逗号分隔的场景名子串分批运行。测试不访问外网。

预构建 HTML、源码和实际截图随交付 ZIP 提供；仓库不提交 `node_modules`、构建输出或本机测试垃圾。尚未公开部署、创建 Figma 文件或合并进入生产主仓。
