# grok-app.com

[Grok App](https://github.com/RongleCat/grok-app) 官方站点仓库：[RongleCat/grok-app-website](https://github.com/RongleCat/grok-app-website)。线上：`https://grok-app.com`。

安装包不在本仓，而在 GitHub Release。本仓只出页面和按钮。

## 本地预览

```bash
pnpm install
pnpm test
pnpm build
pnpm preview
```

静态产物在 `dist/`，可直接上传 Cloudflare Pages。

```bash
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=a0cf0b1e6db38184a5a438f627f79493
npx wrangler pages deploy dist --project-name grok-app
```

## Agent

先读 [AGENTS.md](./AGENTS.md) 与 [docs/llm-wiki/](docs/llm-wiki/)。  
任何改动结束后必须回写 Wiki（见 `docs/llm-wiki/maintain.md`）。

Goal 合同：[docs/plans/GOAL-official-site.md](docs/plans/GOAL-official-site.md)  
状态见 [docs/llm-wiki/status.md](docs/llm-wiki/status.md)。
