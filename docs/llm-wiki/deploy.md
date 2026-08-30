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

- **禁止**把令牌写入本仓（含 workflow、Wiki、`.env.example` 真值、commit message）。
- GitHub Actions 读仓库 Secrets：`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`（只记名字，不记值）。
- 本机兜底同样用这两个环境变量名。
- 2026-08-17 用户提供过 User Token。本轮聊天又出现一张，用于创建 `grok-app` Pages、部署、绑域、写 DNS；**聊天里出现过的令牌视为已暴露**，建议 Dashboard 轮换，只把新值放进 Secrets / 环境变量。禁止写入本仓。
- 官网部署最低权限：
  - Account · Cloudflare Pages · **Edit**
  - Account · Workers Scripts · **Edit**（备用）
  - Zone `grok-app.com` · DNS · **Edit**
  - Zone · Zone Settings · **Edit**
  - Zone · Workers Routes · **Edit**（若走 Worker 路由）
- Cache Purge 不是上线阻断项。

## 推荐发版方式

**推 `main`（或手动 `workflow_dispatch`）走 GitHub Actions。** 工作流：`.github/workflows/deploy-pages.yml`。

1. 本仓是 Vite 静态站：CI 里 `pnpm test` 后 `pnpm build` 产出 `dist/`（`prebuild` 按 [downloads.md](./downloads.md) 拉 `downloads.json`；404 则用稳定 URL 回退）。
2. `cloudflare/wrangler-action@v3` 执行 `pages deploy dist --project-name=grok-app`。
3. 重叠的 `main` 部署会 `cancel-in-progress`。
4. 自定义域 `grok-app.com` / `www.grok-app.com` 与 Always HTTPS 已绑好，不必每发一版再绑。

`public/_redirects`：`www.grok-app.com/*` 301 到 `https://grok-app.com/:splat`；`/opensource` → `/opensource/`；`/faq` → `/faq/`。规范域是 apex。细则见 [seo.md](./seo.md)。

仓库根 `functions/api/stars.ts` 是 Pages Function：`GET /api/stars` 服务端拉 GitHub `stargazers_count`。`wrangler pages deploy dist` 从 **cwd 的 `functions/`** 拾取，不要把 Function 放进 `dist/`。`public/_routes.json` 只 `include` `/api/*`，静态页不走 Functions 计费。`_redirects` 没有会吞 `/api/*` 的通配。浏览器契约见 [stars.md](./stars.md)。

### 本机兜底（CI 不可用时）

```bash
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=...
pnpm install --frozen-lockfile
pnpm test
pnpm build
npx wrangler pages deploy dist --project-name=grok-app
```

已做：Pages 项目 `grok-app`、自定义域、Always HTTPS、源码仓 `RongleCat/grok-app-website`（`main` 公开）、GitHub Actions 推 `main` 自动发版。  
尚未做：产品仓 `repository_dispatch` 触发官网重建。

## 禁止

- 用 CF 橙色云去反代 GitHub 安装包。
- 把探测项目 `grok-app-website-probe` 当正式站留下。
- 把 Account ID 以外的密钥写进 git。
- 改 `api-model.com` 或删除 `cf-temp-email`（不是本仓范围）。
