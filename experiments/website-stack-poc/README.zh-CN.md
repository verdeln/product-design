# Verdlen 官网技术栈 PoC

状态：非生产技术对比，仅使用合成公开内容。

本实验比较未来独立 Verdlen 官网的两条候选路线：

- `nuxt/`：Nuxt 4 + Nuxt Content + Nuxt UI。
- `tanstack-fumadocs/`：TanStack Start + Fumadocs。

两套实现必须覆盖同一组页面：自定义官网主页、Help、Editor SDK 文档、Template Catalog 与详情、中文 Help、搜索、robots/sitemap，以及可索引页面的初始 HTML/prerender。

PoC 不连接真实账号、Cloud、Analytics、Billing、付费模板 Payload、AI Provider 或 Workspace 数据。它不是最终 `verdeln/website` 仓库，也不能成为第二套产品权威。

GitHub Actions 会分别安装、构建、prerender、检查路由，并产出构建体积与源码复杂度证据。本地作者环境无法可靠连接 npm registry，因此本次不声称本地构建通过。

选型标准见 [criteria.md](criteria.md)。最终修改 `verdeln/docs` 中的官网技术决策前，应以真实 CI/PoC 证据为依据。
