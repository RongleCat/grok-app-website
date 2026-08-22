# SEO / GEO

官网可抓取与 AI 引用的技术契约。改 meta、sitemap、JSON-LD、`llms.txt` 或 www 跳转前读本页。权威文案表：[content.md](./content.md)。

规范域是 **apex**：`https://grok-app.com/`。`www.grok-app.com` 必须 301 到 apex。

## 品牌与语气

- 产品名：**Grok App**。短称：**开源 Grok App** / **open-source Grok App**。
- 不要把产品改名为 Grok Desktop。
- 标题保持短。不要把长定语叠进 title / description。
- 站点不要写「非官方 / unofficial / 不是 xAI 官方产品」。需要定位时，只写本机 Grok Build CLI 的桌面工作台 / GUI。
- 不要自称唯一客户端。写明是社区工作台之一（`RongleCat/grok-app`）。
- 不要抢纯「Grok 下载」网页聊天 / PWA 意图。

## 公开 URL

| 路径 | 文件 | 说明 |
|------|------|------|
| `/` | `index.html` | 落地页 |
| `/opensource/` | `opensource/index.html` | 开源 / 作者 / 贡献者墙 |
| `/faq/` | `faq/index.html` | 8 条 FAQ + `FAQPage` JSON-LD |

`public/sitemap.xml` 必须列出上表全部 URL，每条带 `<lastmod>`（`YYYY-MM-DD`，内容变更日）、`changefreq`、`priority`。首页 `1.0` weekly，开源 `0.8` weekly，FAQ `0.6` monthly。改这些页面时同步改 lastmod。

`public/robots.txt` 指向 `https://grok-app.com/sitemap.xml`。

## www 规范化

`public/_redirects`（Cloudflare Pages）：

```text
/opensource  /opensource/  301
/faq  /faq/  301
https://www.grok-app.com/*  https://grok-app.com/:splat  301
```

不要用 302。不要把 apex 指回 www。

## 关键词地图（已落地）

| 簇 | 写法 | 落点 |
|----|------|------|
| 品牌 | Grok App · 开源 Grok App | 全站 title、Hero、页脚、JSON-LD `name` |
| Desktop | Grok Desktop, Grok Build Desktop | `meta.keywords`、FAQ q4、JSON-LD `alternateName`、`llms.txt` Also known as |
| GUI | Grok GUI, Grok Build GUI, Grok CLI GUI, GUI for Grok Build | Hero 副标题、meta description、FAQ q7、`alternateName`、`llms.txt` |
| 客户端 | Grok 桌面、Grok 客户端、Grok 桌面客户端、不用终端 | FAQ q4 / q7、`meta.keywords`、`llms.txt` |
| 本机 CLI | Grok Build CLI, 桌面工作台 | `brand.definition`、meta description、OSS 横条、FAQ q3 |
| 平台 | macOS / Windows / Linux 下载 | FAQ q1 / q5、下载区 |
| 次要 | ACP desktop shell | 只在 `llms.txt` Also known as，不进 title |
| 排除 | grok.com 聊天 / PWA / 纯 Grok 下载 | FAQ q8 明确不是 |

禁止拥有的说法：`官方桌面端`、`Grok 桌面版`。不要编竞品 bash，不要写假评价数。

### meta

| 页 | title（zh） | description 方向 |
|----|-------------|------------------|
| `/` | 开源 Grok App · 桌面工作台 | 本机 Grok Build CLI 的桌面 GUI。多项目、多会话、权限与媒体预览。 |
| `/opensource/` | 开源 · Grok App | 仓库与贡献者，短 |
| `/faq/` | 常见问题 · 开源 Grok App | 下载、安装与常见问题；轻提 Grok Desktop / Grok GUI |

`meta.keywords`（低权重，短列表，三语同一串）：

`Grok App, Grok Desktop, Grok GUI, Grok Build GUI, Grok Build desktop, Grok 桌面客户端`

公开页都要有：

- `meta name="robots" content="index,follow"`
- `link rel="canonical"` 指向 apex（不要 www）
- `og:image` 绝对地址 `https://grok-app.com/images/og.jpg`
- `twitter:card` = `summary_large_image`
- `twitter:site` / `twitter:creator` = `@cgnot996`

首页 `meta.description` / `brand.definition` 必须出现在**静态 HTML**。不要只靠 JS 注入。Hero 主标题仍按 [product.md](./product.md) 锁定。

不要发明 Search Console 验证码或分析跟踪，除非用户给出真实代码。

## llms.txt

`public/llms.txt` 给 AI 爬虫的短简报，英文为主。必须写清：

- 是什么：open-source Grok App，desktop workbench / GUI for the local Grok Build CLI
- 产品名是 Grok App
- Also known as：Grok Desktop、Grok GUI、Grok Build desktop client 等
- 不是什么：不是 grok.com 聊天套壳或 PWA；不能替代本机 Grok Build CLI
- 平台、MIT、规范站 `https://grok-app.com/`、产品仓、Releases、作者 铁柱AGI `https://x.com/cgnot996`
- 5–8 条真实能力，不编评分

禁止其它 Grok 产品名、禁止「官方桌面端」「Grok 桌面版」、禁止写 unofficial。

## JSON-LD

首页 `@graph`：`Organization` + `WebSite`（`url` 都是 `https://grok-app.com/`）+ `SoftwareApplication`。

- `name`: Grok App
- `alternateName`: Grok Desktop, Grok GUI, Grok Build GUI, Grok Build Desktop, Grok 桌面客户端
- `sameAs` 只放真实 URL：`https://github.com/RongleCat/grok-app`、`https://x.com/cgnot996`
- `softwareVersion` 必须等于 `src/generated/downloads-meta.json` 的 `tag`（当前 `v0.2.24`）。`fallback: true` 时不要写版本
- `description` 与 `meta.description` 同向，不要写 unofficial
- **禁止**编造 `aggregateRating` / `reviewCount`
- 开源页：`Organization` + `WebSite` + `WebPage`
- FAQ 页：`FAQPage`（与静态 HTML 简体问答一致，含 Desktop / GUI / 套壳三题）

`downloads-meta.json` 的 tag 变了，同步改首页 JSON-LD 的 `softwareVersion`（`src/markup.test.ts` 会核对）。

## 文案禁区

全站用户文案、meta、`llms.txt`、FAQ、schema：**不要**提其它 Grok 产品名，不要做对比页。禁用短语：`官方桌面端`、`Grok 桌面版`、`非官方`、`unofficial`、`not an official xAI product`。
