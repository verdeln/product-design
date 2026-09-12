# Verdeln 产品交互原型 — v0.3

独立、私人、非生产的界面试验。真实产品架构仍在 `verdeln/docs`。这里没有真实模型、MCP、GitHub 执行器、邮件、Slack、定时服务或费用；不要输入机密资料。

[English](README.md) · [实现范围与交接](docs/HANDOFF.md) · [实际测试记录](tests/evidence.json)

## 启动

使用 Node.js 22+：

```sh
npm ci
npm run build
npm run preview
```

打开终端打印的本地地址。构建还会生成自包含 `dist/standalone.html`，不依赖 CDN、远程字体或运行库。直接打开文件受浏览器策略约束，推荐本地服务器。`dev` 构建后启动服务，不提供热更新。浏览器拒绝存储时明确回退到内存；导出样本后再关闭。

## 本次连接了什么

左侧保留 Favorites、Private、Shared、Teamspaces。AI 内容区新增九个关联入口：**Conversations、Assistants、Tasks、Automations、Coordination、Skills、Capability packages、Connections & MCP、Workspace context**。

**Workspace 内容不是只能靠手动附件。** 上下文检查器可发现获准的样本 Page、Collection schema/row、来源，以及明确开启的会话/活动历史；记录精确读取版本、遗漏、来源范围和处理路线。Project Sources 是优先资料，不是 AI 理论可读范围的全部。个人可读不等于可在团队项目共享，设备会话也不自动提供给 Cloud 路线。

**Library → AI 有可见交接。** 在来源详情选择 Use this source in AI，明确来源以 priority chip 出现，但仍可按授权发现其他相关 Workspace 内容；导航不会自动发送、索引或创建任务。

**助理和能力有创建生命周期。** 新建草稿 → 检查 → 发布不可变样本版本 → 启用 → 绑定项目。Skill、能力包、MCP 描述分别有表单、版本、依赖和状态。MCP 启用只是模拟描述，不认证、不连接、不安装进程。完整五步助理编辑器、导入包验证、真实配置与模型构建器仍是生产设计，不在本版假装完成。

**协同执行使用真正关联的样本 Task。** 接受一个目标和累计预算后，生成三个有依赖的工作：Page 调研、Collection 检查，再由 Reviewer 汇总检查。可以看共同目标、分工、版本、消息和证据。Simulate next cycle 明确推进样本步骤，不伪装后台 agent。三个子任务完成仍不等于根任务完成；成果经既有精确审阅/发布后才完成根任务。

**Automation 与 Task 打通。** 创建草稿规则、无副作用预览、启用、模拟触发、重复同 occurrence 返回同 Task、暂停后续触发。暂停不删除已有任务。没有注册真实定时或 webhook。

**Page 旁有独立 AI Sidebar。** 普通 Page 中提问、明确附加当前选区、展开同一会话到完整 AI 页面、生成追加提案、按精确 Page 版本批准。Ask 不写入；有未保存人工草稿时阻止提交；旧选区不跨页面沿用。这仍是纯文本样本，不是主仓 block editor/IME/协作实现。

原有 A Studio/B Focus/C Console、明暗、手机导航、收藏/分享/移动、产物过期审阅和未知外部效果核查都保留。

## 建议按这条路径检查

Library 来源 → 用于 AI → Workspace context 检查 Page/Collection/history；随后创建助理并绑定 Project → Coordination 接受目标 → 三次显式模拟步骤 → 检查消息与产物 → Review & publish。最后打开 Private Page 的 Ask AI beside this Page，确认页面和完整 AI 界面使用同一会话、草稿不会被覆盖。

## 实测与未测

已执行严格 TypeScript 构建、**90 项模型/路由/存储测试、40 项 Chromium 场景**（旧版16、Workspace11、AI13），最终均通过。浏览器使用同一 standalone HTML 的 `set_content`；每个场景检查没有未捕获错误或网络请求。测试脚本和最终 digest 在仓库中。

测试的是合成数据和存储不可用的内存回退，**不证明真实 origin 持久化、实际 file:// 打开、生产 ACL、原生客户端、完整编辑器/IME/多人同步、真实模型/供应商执行、无人值守调度或完整无障碍合规**。之前 file-origin 测试被管理员策略阻止，保持 BLOCKED，不绕过、不计通过。

环境使用预装 Node22.16.0、TypeScript5.8.3、Chromium144.0.7559.96；依赖已锁定，未实际执行 npm ci。截图、预构建 HTML、源码和安全测试日志在交付 ZIP；没有公开托管或 Figma 文件。

```sh
npm test
python -m pip install -r tests/requirements.txt
python -m playwright install chromium
npm run test:ai-browser
npm run test:browser
```

代码是严格 TypeScript + 原生 DOM，不是生产 React/TanStack。选择交互后接回既有 React Shell、共享组件和真实领域接口；所有 PW/WNI/WAI 生产 gate 仍需实际工程证据。
