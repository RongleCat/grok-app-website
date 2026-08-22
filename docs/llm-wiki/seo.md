# SEO / GEO

官网可抓取与 AI 引用的技术契约。改 meta、sitemap、JSON-LD、`llms.txt` 或 www 跳转前读本页。

规范域是 **apex**：`https://grok-app.com/`。`www.grok-app.com` 必须 301 到 apex。

## 公开 URL

| 路径 | 文件 | 说明 |
|------|------|------|
| `/` | `index.html` | 落地页 |
| `/opensource/` | `opensource/index.html` | 开源 / 作者 / 贡献者墙 |
| `/faq/` | `faq/index.html` | 6 条 FAQ + `FAQPage` JSON-LD |

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

## llms.txt

`public/llms.txt` 给 AI 爬虫的短简报，英文为主。必须写清：

- 是什么：unofficial open-source desktop workbench for the local Grok Build CLI
- 不是什么：not an official xAI product；不是网页聊天；不能替代本机 Grok Build CLI
- 平台、MIT、规范站 `https://grok-app.com/`、产品仓、Releases、作者 铁柱AGI `https://x.com/cgnot996`
- 5–8 条真实能力，不编评分

禁止其它 Grok 产品名、禁止「官方桌面端」「Grok 桌面版」。

## JSON-LD

首页 `@graph`：`Organization` + `WebSite`（`url` 都是 `https://grok-app.com/`）+ `SoftwareApplication`。

- `sameAs` 只放真实 URL：`https://github.com/RongleCat/grok-app`、`https://x.com/cgnot996`
- `softwareVersion` 必须等于 `src/generated/downloads-meta.json` 的 `tag`（当前 `v0.2.24`）。`fallback: true` 时不要写版本
- **禁止**编造 `aggregateRating` / `reviewCount`
- 开源页：`Organization` + `WebSite` + `WebPage`
- FAQ 页：`FAQPage`（6 问，文案与静态 HTML 简体一致）

`downloads-meta.json` 的 tag 变了，同步改首页 JSON-LD 的 `softwareVersion`（`src/markup.test.ts` 会核对）。

## Meta

公开页都要有：

- `meta name="robots" content="index,follow"`
- `link rel="canonical"` 指向 apex（不要 www）
- `og:image` 绝对地址 `https://grok-app.com/images/og.jpg`
- `twitter:card` = `summary_large_image`
- `twitter:site` / `twitter:creator` = `@cgnot996`

首页 `meta.description` / `brand.definition` 必须让爬虫在**静态 HTML**里读到「本机 Grok Build CLI 的开源桌面工作台 / 不是 xAI 官方产品」。不要只靠 JS 注入。Hero 主副标题仍按 [product.md](./product.md) 合同，不要改。

不要发明 Search Console 验证码或分析跟踪，除非用户给出真实代码。

## 文案禁区

全站用户文案、meta、`llms.txt`、FAQ、schema、本 Wiki：**不要**提其它 Grok 产品名，不要做对比页。禁用短语：`官方桌面端`、`Grok 桌面版`。
