# Verdeln 产品交互原型 — v0.2

独立、非生产的交互试验。全部为样本数据，没有连接真实账号、模型、邮件、Slack、计费或生产权限。

[English](README.md) · [覆盖与生产交接](docs/HANDOFF.md) · [测试记录](tests/evidence.json)

## 本次变化

Workspace 左侧稳定保留 **Pinned、Favorites、Private、Shared、Teamspaces**。进入 Project、Library 或 AI 不会换掉页面树。Project 七个分区移到内容区顶部；手机保留 Workspace 抽屉和 Project sections 入口。A Studio／B Focus／C Console 与明暗模式都保留。

Favorites 支持 Page 和 Project 的带类型快捷引用、取消和个人排序，不复制正文、不移动、不共享。原页面显示实际归属、当前受众、关联项目；从 Project Source 打开原页面有返回入口，但不自动指定 AI 上下文。多个入口仍读取同一个样本正文。

Private 中区分未分享与本人明确分享的页面；Shared 是别人只读分享给我的页面。Teamspace 总览展示同一批 Projects 和真实 Pages。非成员看不到 Private Teamspace；Closed Teamspace 只显示受限外壳。

创建 Page 明确 Save to，并独立选择是否关联 Project。私人来源不能直接泄露到共享项目。移动 Page 先预览完整样本子树和受众变化；内容或目的地版本变化使预览失效。改变 Project 团队归属不移动引用页面。Page 编辑器是明确标注的纯文本模拟，不是生产协同块编辑器。

原有 Sources、Highlights、Chat、Work、Outputs、Activity 流程仍可操作，保留固定 Task 标准、上下文附件不自动发送、过期发布审阅、Unknown 核查而不重发等边界。模拟按钮不会注册真实计划或连接供应商。

## 建议操作流程

打开 Private → My working notes，点击星标。页面出现在 Favorites，但仍归属 Private。打开 Link to project，共享项目因受众不匹配被阻断，个人项目可添加引用。

打开 Move to…，选择 Teamspace，点击 Preview move。预览会列出父页面和子页面及前后受众。点击 Simulate intervening edit 后，旧确认不可用；重新预览后才可移动。移动后收藏和页面身份不变。

从 Project Sources 打开原页面，检查真实位置和返回项目入口；从 Teamspace 打开 Project，与全局 Projects 是同一对象。

## 运行

Node.js 22+：

```sh
npm ci
npm run build
npm run preview
```

打开终端输出的本地地址。构建也生成包含所有代码、样式、图标的 dist/standalone.html，不使用 CDN、远程字体或运行依赖。直接文件打开受浏览器策略影响，本次环境阻止了 file:// 测试，因此推荐本地服务预览。npm run dev 构建并启动，但不提供热更新。

不要输入真实秘密或机密资料。浏览器允许时保存样本状态；存储不可用则提示内存回退。未保存 Page 草稿可在本次会话路由切换后保留，但不承诺刷新、退出账号或真实账号隔离后的持久化。

## 验证

最终构建已通过严格 TypeScript 检查和 **56 项模型测试**，以及 **16 项原有＋11 项新增浏览器场景**。另一个实际文件打开／刷新持久化测试被环境的 ERR_BLOCKED_BY_ADMINISTRATOR 阻止，标为 BLOCKED，不计为通过，也未绕过限制。

浏览器测试以 Chromium set_content 加载最终 HTML，验证样本交互与存储不可用的内存回退。真实 origin 持久化、原生多端、完整无障碍、200% 浏览器缩放、真实 editor/IME、多人同步、ACL 和外部效果未验证。环境使用预装 TypeScript 5.8.3／Node 22.16.0；已锁依赖，但未实跑 npm ci。

```sh
npm test
python -m pip install -r tests/requirements.txt
python -m playwright install chromium
npm run test:browser
npm run test:workspace-browser
```

测试支持 CHROMIUM_EXECUTABLE 和 CASE_FILTER。详细场景、最终 HTML hash 见 evidence.json。ZIP 包含源码、预构建文件、当前截图和安全测试日志；仓库不提交 node_modules、dist 或本机测试垃圾。

## 与设计及生产的关系

[文档 PR #111](https://github.com/verdeln/docs/pull/111) 更新 PW-UI-1.1；[原型 PR #1](https://github.com/verdeln/product-design/pull/1) 在原分支继续更新并面向 main。未修改生产应用，也未选定最终视觉方向。

本原型使用严格 TypeScript＋原生 DOM，不是 React/TanStack 生产接入。最终应复用主仓 Shell、组件、真实内容与 Task/权限 port；不可把模拟器复制为第二套权威。生产 PW/WNI 验收仍保持 NOT_RUN。
