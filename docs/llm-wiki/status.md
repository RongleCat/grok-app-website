# 当前状态

最后更新：2026-08-22。本页必须与仓库事实一致。

## 一句话

官网已上线。`/opensource/` 贡献者墙现为 8 人。投稿 Issues #637 #638 #639 #640 #642 #643 #649 #678 已关并致谢（曾被产品仓按「保持打开」再打开，2026-08-18 再次关闭）。聊天里出现过的 CF token 视为已暴露，建议 Dashboard 轮换。

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
| 本仓代码 | 已落地单页 | `index.html` + `src/` + `public/` |
| 栈 | Vite + TypeScript + 原生 CSS | 无 React、无 Tailwind |
| llm-wiki | 已建 | `docs/llm-wiki/` |
| AGENTS.md 回写规则 | 已写 | 仓库根 `AGENTS.md` §0 |
| 效果图入库 | 已收 | `docs/llm-wiki/assets/` 三张 PNG |
| 产品仓下载契约 | 已吸收到消费侧 | [downloads.md](./downloads.md) |
| `downloads.json` 现网 | 构建时可拉到 `v0.2.21`；失败回退稳定 URL | `src/generated/downloads-meta.json` + `scripts/fetch-downloads.mjs` |
| 域名 `grok-app.com` | 已绑 Pages，HTTPS 200 | Zone `2618ef7b6b819900070711e42a3c9db8` |
| DNS 记录 | 2 条 CNAME（apex + www → `grok-app.pages.dev`，橙色云） | 2026-08-17 API |
| Pages 正式项目 | `grok-app` | https://grok-app.pages.dev |
| CF 部署权限 | 本轮聊天令牌可写 Pages/DNS；视为已暴露 | 见 [deploy.md](./deploy.md)；令牌不入库 |
| 站点明暗主题 | 已实现 | 月亮/太阳图标；Hero/皮肤主图换 `workbench-*.webp` |
| 落地页 | 已实现 | 对照 [design.md](./design.md)；开源导航进 `/opensource/` |
| 开源页 | 已实现 | `opensource/index.html`；墙 8 人见 [contributors.md](./contributors.md)；投稿 Issues 已关；公众号 / 微信好友点开 `#qr-dialog` |
| 三语 i18n | 已实现 | [i18n.md](./i18n.md) [content.md](./content.md)；键 `grok-app-site.locale` |
| 窄屏自适应 | 已实现 | 1440 / 1280 / 1024 / 768 / 390 无横溢；汉堡三杠收紧，下拉贴按钮右下角打开 |
| 多 Agent Goal | C1 + C2 过关 | 本页 + `src/**/*.test.ts` |
| 短链 `/download/*` | 未实现 | [downloads.md](./downloads.md) §5 |
| 隐私政策 / 使用条款页 | 占位链到产品仓 SECURITY / README | [content.md](./content.md) |
| Git 远程 | 已推送 `main` | https://github.com/RongleCat/grok-app-website （公开，MIT） |

## 阻塞

1. 稳定下载别名已能拉到 `downloads.json`（本机构建见 `v0.2.21`）。若下次 404，按钮仍走写死的 `latest/download` 稳定名 + Releases 兜底。
2. 本轮聊天里出现过 CF User Token，视为已暴露；下次发版前在 Dashboard 轮换，只把新值放进环境变量。

## 下一步（给下一任 Agent）

有新 Issues 投稿时按 [contributors.md](./contributors.md) 更新 `src/generated/contributors.json`、压头像、deploy，然后关 Issue。聊天里出现过的 CF token 仍建议轮换。GitHub Actions / 产品仓 `repository_dispatch` 触发官网重建尚未做。
