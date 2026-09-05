# 当前状态

最后更新：2026-09-05。本页必须与仓库事实一致。

## 一句话

官网已上线。推 `main` 走 GitHub Actions 构建并部署 Cloudflare Pages。搜索意图覆盖 Grok Desktop / Grok GUI / 桌面客户端，品牌短称「开源 Grok App」。站点不再写非官方免责声明。SEO/GEO 基础（www→apex 301、sitemap 6 URL、`llms.txt`、JSON-LD、`/faq/`、`/install/`、`/changelog/`）已在。社区皮肤画廊在 `/skins/`：等大 3–4 列（手机 2 列）、剪影跟 `html[data-theme]` 走、桌面 Apply 发 `grok://`、手机 toast。`/opensource/` 贡献者墙现为 8 人。聊天里出现过的 CF token 视为已暴露，建议 Dashboard 轮换。

## Goal 航道表

合同：`docs/plans/GOAL-official-site.md`

| 航道 | 状态 | 独占 |
|------|------|------|
| L0 骨架 | done | Vite / main / tokens / i18n runtime / theme |
| L1 顶栏 Hero 页脚 | done | header.css hero.css footer.css |
| L2 中段区块 | done | sections.css |
| L3 三语文案 | done | zh.ts zh-TW.ts en.ts |
| L4 下载 | done | downloads.ts download.css fetch-downloads |
| L5 窄屏 | done | responsive.css |
| L6 质检部署 | done | CI / wrangler |

状态只能是 `idle` / `claimed:<名>` / `done`。认领前先改本表。

## 航道请求

暂无。

## 状态表

| 项 | 状态 | 证据 |
|----|------|------|
| 本仓代码 | 已落地多页 | `index.html` + `opensource/` + `faq/` + `skins/` + `install/` + `changelog/` + `src/` + `public/` |
| 栈 | Vite + TypeScript + 原生 CSS | 无 React、无 Tailwind |
| llm-wiki | 已建 | `docs/llm-wiki/` |
| AGENTS.md 回写规则 | 已写 | 仓库根 `AGENTS.md` §0 |
| 效果图入库 | 已收 | `docs/llm-wiki/assets/` 三张 PNG |
| 产品仓下载契约 | 已吸收到消费侧 | [downloads.md](./downloads.md) |
| `downloads.json` 现网 | 构建时可拉到 `v0.2.31`；失败回退稳定 URL | `src/generated/downloads-meta.json` + `scripts/fetch-downloads.mjs` |
| 域名 `grok-app.com` | 已绑 Pages，HTTPS 200 | Zone `2618ef7b6b819900070711e42a3c9db8` |
| DNS 记录 | 2 条 CNAME（apex + www → `grok-app.pages.dev`，橙色云） | 2026-08-17 API |
| Pages 正式项目 | `grok-app` | https://grok-app.pages.dev |
| GitHub Actions 发版 | 推 `main` / `workflow_dispatch` 构建并部署 Pages | `.github/workflows/deploy-pages.yml` |
| CF 部署权限 | 仓库 Secrets `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`；聊天令牌视为已暴露 | 见 [deploy.md](./deploy.md)；令牌不入库 |
| 站点明暗主题 | 已实现 | 月亮/太阳图标；Hero/皮肤主图换 `workbench-*.webp` |
| Hero / 开源页 GitHub star | 已实现 | 首页 `hero.ctaGithub` 与 `/opensource/` `oss.repo.cta` 旁显示缩写；悬停/聚焦精确数；首屏画 `src/generated/stars-meta.json`；运行时浏览器只打同源 `/api/stars`（`cache: "no-store"`）。Function：`caches.default` 约 1h last-good → GitHub REST → `ungh.cc` `repo.stars`；成功 `max-age=60, s-maxage=600`；失败 502 `no-store`，客户端保留构建回退。浏览器不打 `api.github.com` / `ungh.cc`。契约 [stars.md](./stars.md) |
| 落地页 | 已实现 | 对照 [design.md](./design.md)；开源导航进 `/opensource/`；问答进 `/faq/`；皮肤进 `/skins/`；安装进 `/install/`；更新日志进 `/changelog/` |
| 页脚友情链接 | 已落地 | 五页页脚链 `https://usegrokbot.com/`，文案 `footer.grokbot` = Grok Bot；`rel="noopener noreferrer"`，无 `nofollow`；不进正文 / `llms.txt` |
| 社区皮肤画廊 | 已落地 `/skins/` | 等大网格（宽 4 / 中 3 / ≤640 最少 2）；精选不跨列；无 HUD 角标；`.g-chrome` `inset: 0` 铺满卡；`pack.scrim` → `wallpaperFromScrim` 写 `--wallpaper-*`（侧栏 mix 58%、主区 70%、blur 22px @100）；左重 105deg scrim；桌面 hover / 键盘才露出铺满整卡的 dock（精选一枚 chip + 短 Apply）；`hover: none` 露出底部紧凑条且不缩小 chrome；桌面 `grok://skin/import?url=`，手机 `gallery.applyMobile` toast；投稿外链 CONTRIBUTING |
| 开源页 | 已实现 | `opensource/index.html`；墙 8 人见 [contributors.md](./contributors.md)；投稿 Issues 已关；公众号 / 微信好友点开 `#qr-dialog` |
| FAQ 页 | 已实现 | `faq/index.html`；8 问三语（含 Desktop / GUI / 套壳）+ `FAQPage` JSON-LD；顶栏/页脚有链 |
| 安装指南 | 已实现 | `install/index.html`；三端下载/安装/首次 CLI/验收/排查；`HowTo` JSON-LD；版本走 `downloads-meta.json`；顶栏/页脚有链 |
| 更新日志 | 已实现 | `changelog/index.html`；v0.2.31–v0.2.26 稳定摘要；`WebPage` + `ItemList` JSON-LD；全站页脚 `footer.changelog` → `/changelog/` |
| www 规范化 | 源码已写，随 Actions 发版 | `public/_redirects`：`www.grok-app.com/*` 301 → apex；`/skins` 301 → `/skins/`；`/install` 301 → `/install/`；`/changelog` 301 → `/changelog/` |
| sitemap | 已实现 | `public/sitemap.xml` 6 条：`/` `/opensource/` `/faq/` `/skins/` `/install/` `/changelog/`；首页与安装页 `lastmod` 2026-09-05（版本文案随 `v0.2.31`）；changelog `lastmod` 2026-09-02（`markup.test.ts` 锁该日） |
| llms.txt | 已实现 | `public/llms.txt`；Also known as + 产品名 Grok App；画廊 URL 为本站 `/skins/`；安装指南 `/install/`；更新日志 `/changelog/` |
| JSON-LD / meta | 已实现 | 首页 SoftwareApplication + Organization + WebSite；皮肤页 CollectionPage；安装页 HowTo；更新日志 WebPage + ItemList；`alternateName`；`softwareVersion` 跟 `downloads-meta.json`（`v0.2.31`）；短 title；`twitter:site` `@cgnot996` |
| 站点语气 | 短称开源 Grok App | 无「非官方 / unofficial」；[product.md](./product.md) [content.md](./content.md) [seo.md](./seo.md) |
| SEO 契约 | 已写 | [seo.md](./seo.md) |
| 三语 i18n | 已实现 | [i18n.md](./i18n.md) [content.md](./content.md)；键 `grok-app-site.locale` |
| 窄屏自适应 | 已实现 | 1440 / 1280 / 1024 / 768 / 390 无横溢；汉堡三杠收紧，下拉贴按钮右下角打开 |
| 多 Agent Goal | C1 + C2 过关 | 本页 + `src/**/*.test.ts` |
| 短链 `/download/*` | 未实现 | [downloads.md](./downloads.md) §5 |
| 隐私政策 / 使用条款页 | 占位链到产品仓 SECURITY / README | [content.md](./content.md) |
| Git 远程 | 已推送 `main` | https://github.com/RongleCat/grok-app-website （公开，MIT） |

## 阻塞

1. 稳定下载别名已能拉到 `downloads.json`（本机构建见 `v0.2.31`）。若下次 404，按钮仍走写死的 `latest/download` 稳定名 + Releases 兜底。
2. 本轮聊天里出现过 CF User Token，视为已暴露；下次发版前在 Dashboard 轮换，只把新值放进环境变量。

## 下一步（给下一任 Agent）

下一任可做短链 `/download/*`（[downloads.md](./downloads.md) §5），或给现有页补 llms / JSON-LD 强化。有新稳定 Release 时按产品仓 notes 浓缩进 `/changelog/`（保持 2–5 条、newest-first），并改 sitemap `lastmod`。有新 Issues 投稿时按 [contributors.md](./contributors.md) 更新 `src/generated/contributors.json`、压头像、推 `main` 让 Actions 发版，然后关 Issue。改搜索文案先改 [content.md](./content.md) 与 [seo.md](./seo.md)，三语一起改。产品仓 README 改了安装步骤，先对 [downloads.md](./downloads.md) 再改 `/install/`。产品仓 `repository_dispatch` 触发官网重建尚未做。不要发明 Search Console 验证码。聊天里出现过的 CF token 仍建议轮换。皮肤目录或卡片字段变了，先对 [skins.md](./skins.md) 再改 `src/skins.ts`。画廊网格 / 剪影 / `scrim` 透明度 / hover dock / 手机 Apply 以 [skins.md](./skins.md) 为准。GitHub 按钮 star 数以 [stars.md](./stars.md) 为准：浏览器只打 `/api/stars`（`no-store`），边缘 GitHub 失败走 ungh / last-good，不要给页脚链加数字。
