# GitHub 按钮 star 数

首页 Hero「GitHub 开源」与 `/opensource/`「打开 GitHub 仓库」显示 `RongleCat/grok-app` 的 **stargazers_count**。页脚 MIT / 文档 / Releases 链不加数字。

## 显示规则

| 状态 | 可见 |
|------|------|
| 默认 | 原按钮文案保留；旁边是缩写（`1094` → `1.1k`，`999` 仍 `999`，`10000` → `10k`）。整千不带小数，否则一位小数。 |
| 悬停 / `:focus-visible` | 站点 token 小 tooltip，精确数（`1,104` / `1104` 按当前 locale `toLocaleString`） |
| 无数或非法值 | 只留原按钮，**不写 0、占位或假数** |

无障碍：`aria-label` = `{原按钮文案} · {github.stars}`，例如「GitHub 开源 · 1,104 颗星」。缩写对读屏隐藏在 label 里。

## 数据从哪来

仓库：`RongleCat/grok-app`（与 [downloads.md](./downloads.md) 同一产品仓，不是本官网仓）。

1. **构建期** `scripts/fetch-stars.mjs` 拉 `https://api.github.com/repos/RongleCat/grok-app`，写入 `src/generated/stars-meta.json`：`{ "count": <整数> }`（当前提交为 `1105`）。失败则保留上次提交的有效 `count`；从未成功则 `{ "count": null }`。首屏先画这个数字，避免请求返回前按钮空着。
2. **运行时** 每次进页 / 刷新都请求同一公开 API。成功则换成现网 `stargazers_count`。失败藏数字、只留原按钮文案，不把构建回退当现网结果留下。不写 `localStorage`，没有 TTL 短路。

不要用 shields iframe、`github-buttons.js` 或其它第三方 badge。不要浏览器拉 `downloads.json`（无 CORS；那是下载契约）。

## 实现

| 文件 | 职责 |
|------|------|
| `src/stars.ts` | `abbreviateStarCount` / `formatExactStarCount` / fetch / `paintGithubStars` |
| `src/stars.test.ts` | 缩写规则；`refreshGithubStars` 必请求、失败返回 null |
| `src/generated/stars-meta.json` | 提交进仓的构建回退 |
| `src/main.ts` | `bindGithubStars`；`applyI18n` 里 `syncGithubStars` |
| `src/styles/base.css` | `.github-stars` / `.github-stars-tip` |
| 三语 `github.stars` | `{count} 颗星` / `{count} 顆星` / `{count} stars` |

HTML 钩子：`<a data-github-stars>` 内空的 `<span class="github-stars" data-github-stars-count hidden>`。`pnpm prebuild` 先跑 `fetch-stars.mjs`。

## 禁止

- 把 star 数写进 SEO title / description / `llms.txt` / JSON-LD
- 在 FAQ / 安装 / 皮肤页发明新的 GitHub 营销钮只为塞数字
- 文案出现「非官方 / unofficial」
