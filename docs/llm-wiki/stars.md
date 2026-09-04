# GitHub 按钮 star 数

首页 Hero「GitHub 开源」与 `/opensource/`「打开 GitHub 仓库」显示 `RongleCat/grok-app` 的 **stargazers_count**。页脚 MIT / 文档 / Releases 链不加数字。

## 显示规则

| 状态 | 可见 |
|------|------|
| 默认 | 原按钮文案保留；旁边是缩写（`1094` → `1.1k`，`999` 仍 `999`，`10000` → `10k`）。整千不带小数，否则一位小数。 |
| 悬停 / `:focus-visible` | 站点 token 小 tooltip，精确数（`1,104` / `1104` 按当前 locale `toLocaleString`） |
| 无数或非法值 | 只留原按钮，**不写 0、占位或假数** |
| 现网刷新失败 | **保留已画数字**（通常是构建回退），不藏、不擦 |

无障碍：`aria-label` = `{原按钮文案} · {github.stars}`，例如「GitHub 开源 · 1,104 颗星」。缩写对读屏隐藏在 label 里。

## 数据从哪来

仓库：`RongleCat/grok-app`（与 [downloads.md](./downloads.md) 同一产品仓，不是本官网仓）。

1. **构建期** `scripts/fetch-stars.mjs` 先拉 `https://api.github.com/repos/RongleCat/grok-app`（`User-Agent: grok-app.com-stars`），失败再拉 `https://ungh.cc/repos/RongleCat/grok-app` 的 `repo.stars`，写入 `src/generated/stars-meta.json`：`{ "count": <整数> }`（当前提交为 `1175`）。两边都失败则保留上次提交的有效 `count`；从未成功则 `{ "count": null }`。首屏先画这个数字，避免请求返回前按钮空着。
2. **运行时** 浏览器只请求同源 **`/api/stars`**（相对路径，`cache: "no-store"`）。`functions/api/stars.ts` 在边缘：先读 Workers `caches.default` 里上次成功的 `{ count }`（约 1 小时，避免共用 CF 出口打爆 GitHub 未认证 60 req/h）；未命中再打同一 GitHub REST（`User-Agent: grok-app.com-stars`）；GitHub 非 OK / 超时 / 坏 payload 则读 ungh `repo.stars`。返回 `{ "count": <整数> }`。成功则换成现网数字。失败保留已画的构建回退，不 `paint(null)`。不写 `localStorage`。成功响应 `Cache-Control: public, max-age=60, s-maxage=600`（浏览器 1 分钟、CDN 10 分钟）；失败 `502` + `no-store`。
3. **禁止**浏览器请求 `api.github.com`。未认证 REST 从访客 IP 会 403，控制台红字且数字消失。

可选：若 Pages Function 环境已有 `GITHUB_TOKEN` 或 `GH_TOKEN`，Function 带 `Authorization`。v1 不要求、不发明密钥。ungh 是公开镜像，不替代 token，只在 GitHub 限额/故障时顶住数字。

不要用 shields iframe、`github-buttons.js` 或其它第三方 badge。不要浏览器拉 `downloads.json`（无 CORS；那是下载契约）。

## 实现

| 文件 | 职责 |
|------|------|
| `functions/api/stars.ts` | `GET /api/stars` → `{ count }`；GitHub → ungh；`caches.default` 约 1h last-good；成功 `max-age=60, s-maxage=600` |
| `public/_routes.json` | 只对 `/api/*` 调用 Function，静态页不进 Functions 计费 |
| `src/stars.ts` | `abbreviateStarCount` / `formatExactStarCount` / 同源 `cache:"no-store"` fetch / `paintGithubStars` |
| `src/stars.test.ts` | 缩写规则；`refreshGithubStars` 打 `/api/stars` + `no-store`；失败保留 baked；Function 403→ungh / last-good |
| `src/generated/stars-meta.json` | 提交进仓的构建回退 |
| `src/main.ts` | `bindGithubStars`；`applyI18n` 里 `syncGithubStars` |
| `src/styles/base.css` | `.github-stars` / `.github-stars-tip` |
| 三语 `github.stars` | `{count} 颗星` / `{count} 顆星` / `{count} stars` |

HTML 钩子：`<a data-github-stars>` 内空的 `<span class="github-stars" data-github-stars-count hidden>`。`pnpm prebuild` 先跑 `fetch-stars.mjs`。

`wrangler pages deploy dist --project-name=grok-app` 从**仓库根**拾取 `functions/`，不是 `dist/functions`。现有 `public/_redirects` 没有 `/*` 通配，不会吞 `/api/stars`。www 主机规则只匹配 `www.grok-app.com`。

`/api/stars` 不是内容页：不进 `sitemap.xml` / `llms.txt`；`robots.txt` `Disallow: /api/`；Function 与 `_headers` 写 `X-Robots-Tag: noindex`。

## 禁止

- 浏览器请求 `api.github.com`
- 把 star 数写进 SEO title / description / `llms.txt` / JSON-LD
- 在 FAQ / 安装 / 皮肤页发明新的 GitHub 营销钮只为塞数字
- 文案出现「非官方 / unofficial」
