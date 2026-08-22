# 部署（Cloudflare + grok-app.com）

## 目标拓扑

```text
本仓静态构建（源码 https://github.com/RongleCat/grok-app-website ）
    → Cloudflare Pages 项目 grok-app
    → 自定义域 grok-app.com 与 www.grok-app.com
    → DNS 在 Cloudflare 本区（已 active）
```

安装包不走这条链路。下载按钮见 [downloads.md](./downloads.md)。

## 账号与区（已核对 2026-08-17）

| 项 | 值 |
|----|-----|
| Cloudflare 账号 | `c1210301104@gmail.com` |
| Account ID | `a0cf0b1e6db38184a5a438f627f79493` |
| Zone | `grok-app.com` |
| Zone ID | `2618ef7b6b819900070711e42a3c9db8` |
| 注册商 | Cloudflare Registrar |
| 注册日 / 到期 | 2026-08-16 / 2027-08-16 |
| NS | `gracie.ns.cloudflare.com` / `matias.ns.cloudflare.com`（公网一致） |
| 套餐 | Free Website |
| Zone 状态 | `active` |
| Pages 项目 | `grok-app`（https://grok-app.pages.dev ） |
| 自定义域 | `grok-app.com`、`www.grok-app.com` 均为 Pages active，HTTPS 200 |
| DNS | apex + www CNAME → `grok-app.pages.dev`，橙色云 |
| Always HTTPS | on |
| workers.dev 子域 | `grokappwebsiteprobe`（探测时创建，API 不能改名；自定义域不受影响） |
| 同账号其他区 | `api-model.com`（无关；有 Worker `cf-temp-email`） |

## 令牌

- **禁止**把令牌写入本仓。本机用 `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`。
- 2026-08-17 用户提供过 User Token。本轮聊天又出现一张，用于创建 `grok-app` Pages、部署、绑域、写 DNS；**聊天里出现过的令牌视为已暴露**，建议 Dashboard 轮换，只把新值放进环境变量。禁止写入本仓。
- 官网部署最低权限：
  - Account · Cloudflare Pages · **Edit**
  - Account · Workers Scripts · **Edit**（备用）
  - Zone `grok-app.com` · DNS · **Edit**
  - Zone · Zone Settings · **Edit**
  - Zone · Workers Routes · **Edit**（若走 Worker 路由）
- Cache Purge 不是上线阻断项。

## 推荐发版方式

1. 本仓是 Vite 静态站：`pnpm build` 产出 `dist/`。
2. CI 或本机：`wrangler pages deploy dist` / Pages Direct Upload。
3. 绑 `grok-app.com` + `www.grok-app.com`。
4. 打开 Always HTTPS（区设置可写）。
5. 构建步按 [downloads.md](./downloads.md) 拉 `downloads.json`；404 则用稳定 URL 回退。

已做：Pages 项目 `grok-app`、`wrangler pages deploy dist`、绑 `grok-app.com` / `www`、Always HTTPS、源码仓 `RongleCat/grok-app-website`（`main` 公开）。  
尚未做：GitHub Actions、产品仓 `repository_dispatch` 触发官网重建。当前发版仍是本机 `wrangler pages deploy dist`。

## 禁止

- 用 CF 橙色云去反代 GitHub 安装包。
- 把探测项目 `grok-app-website-probe` 当正式站留下。
- 把 Account ID 以外的密钥写进 git。
- 改 `api-model.com` 或删除 `cf-temp-email`（不是本仓范围）。
