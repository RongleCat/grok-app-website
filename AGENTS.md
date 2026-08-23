# Agent notes — grok-app.com

本仓库是 **Grok App 官网**（`https://grok-app.com`），不是桌面端产品仓。  
桌面端产品仓：`https://github.com/RongleCat/grok-app`（本机常见路径 `~/Documents/self/tools/desktop-app/grok-app`）。

与 ronglecat 沟通默认中文。站点用户文案必须 **简体 / 繁體 / English** 三份齐全，按系统语言首屏选择；用户手动切换后持久化。见 [docs/llm-wiki/i18n.md](docs/llm-wiki/i18n.md)。

---

## 0. 硬性：Wiki 是唯一项目记忆

`docs/llm-wiki/` 是本仓 Agent 的**唯一可执行知识库**。禁止靠会话记忆、聊天摘要或「上次好像」继续干活。

### 开工前（必须）

1. 读 [docs/llm-wiki/README.md](docs/llm-wiki/README.md) 选条目。
2. 读 [docs/llm-wiki/status.md](docs/llm-wiki/status.md) 看当前真相。
3. 按任务再读对应页（设计 / 主题 / 下载 / 部署 / 文案）。
4. 下载与发版契约以 [docs/llm-wiki/downloads.md](docs/llm-wiki/downloads.md) 为准；上游原文在产品仓 `docs/llm-wiki/website-downloads.md`。

### 收工前（必须回写）

**任何操作结束都必须回写 Wiki。** 「操作」包括但不限于：改代码、改样式、改文案、加资源、部署、验权、绑域名、改下载 URL、改主题、修 bug、做调研结论、改栈、加依赖。

回写清单（缺一不可）：

1. 受影响的专题页改成**现在时**（删过时句，不追加「以后再说」堆）。
2. 更新 [docs/llm-wiki/status.md](docs/llm-wiki/status.md) 的状态表与「下一步」。
3. 在 [docs/llm-wiki/log.md](docs/llm-wiki/log.md) **追加**一条（禁止改写历史条目）。
4. 若新增/删除专题页，同步 [docs/llm-wiki/README.md](docs/llm-wiki/README.md)。

回写格式与判定见 [docs/llm-wiki/maintain.md](docs/llm-wiki/maintain.md)。  
**没回写 = 任务未完成。** 不得在回复里声称「做完了」却让 Wiki 停留在旧状态。

---

## 1. 先读哪一页

| 你要做的事 | 先读 |
|------------|------|
| 任意任务 | [README.md](docs/llm-wiki/README.md) + [status.md](docs/llm-wiki/status.md) + [maintain.md](docs/llm-wiki/maintain.md) |
| 落地页面 / 改视觉 | [design.md](docs/llm-wiki/design.md) + [theme.md](docs/llm-wiki/theme.md) + [content.md](docs/llm-wiki/content.md) |
| 文案 / 语言切换 | [i18n.md](docs/llm-wiki/i18n.md) + [content.md](docs/llm-wiki/content.md) |
| 多 Agent 落地 Goal | [docs/plans/GOAL-official-site.md](docs/plans/GOAL-official-site.md) |
| 下载按钮 / 版本号 / 短链 | [downloads.md](docs/llm-wiki/downloads.md) |
| Cloudflare / 域名 / 发版上线 | [deploy.md](docs/llm-wiki/deploy.md) |
| sitemap / llms.txt / JSON-LD / www 跳转 | [seo.md](docs/llm-wiki/seo.md) |
| 产品定位 / 范围 / 禁止事项 | [product.md](docs/llm-wiki/product.md) |
| 外部权威从哪来 | [sources.md](docs/llm-wiki/sources.md) |
| 开源页贡献者墙 / Issues 投稿 | [contributors.md](docs/llm-wiki/contributors.md) |
| 社区皮肤画廊 / 目录 fetch / Apply 深链 | [skins.md](docs/llm-wiki/skins.md) |

---

## 2. 范围边界

- **本仓只托管官网**：HTML/CSS/JS、图、短链 302、构建脚本。
- **安装包永远留在 GitHub Release**（`RongleCat/grok-app`）。禁止把 `.dmg` / `.exe` / `.zip` / AppImage / `.deb` / `.rpm` 提交进本仓。
- **禁止**用 Pages / Cloudflare 反代安装包字节。
- **禁止**按钮指向 `grok-desktop-latest`、`*.app.tar.gz`、`*.sig`、`latest.json`。
- **禁止**在浏览器里 `fetch` GitHub `downloads.json`（无 CORS）。构建时拉，或写死稳定 URL。
- 官网是产品门面，不是桌面端功能实现。社区画廊在 `/skins/`：运行时拉目录，Apply 只发 `grok://skin/import?url=` 深链。禁止 iframe github.io，禁止把 packs 打进构建。投稿外链 `https://github.com/RongleCat/grok-app-skin`。

---

## 3. 密钥

- Cloudflare / GitHub token **禁止**写入本仓任何文件（含 Wiki、`.env.example` 里的真值、commit message）。
- 本机可用环境变量 `CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`。
- 用户在聊天里贴过的 token 视为已暴露，Wiki 只记「已验权 / 缺哪项」，不记令牌字符串。

---

## 4. 设计与主题

- 整页效果图：`docs/llm-wiki/assets/landing-dark.png`。
- 工作台暗色：`docs/llm-wiki/assets/workbench-dark.png`。
- 工作台亮色：`docs/llm-wiki/assets/workbench-light.png`。
- 站点必须同时有 **暗色 / 亮色**。切换站点主题时，Hero 与主题展示区必须换对应工作台截图，不能只改 CSS 变量、画面仍是暗色图。
- **桌面宽度完整还原** `landing-dark.png`。窄屏按 [design.md](docs/llm-wiki/design.md) 重排，要求仍然好看，禁止只做等比缩小。
- 实现与 token 见 [theme.md](docs/llm-wiki/theme.md)。

---

## 5. 不要做的事

- 不要在本仓实现 Tauri / 桌面端逻辑。
- 不要把产品仓 `docs/llm-wiki/` 整目录复制过来；只吸收官网需要的契约，并在 [sources.md](docs/llm-wiki/sources.md) 留指针。
- 不要把过程稿、TODO、roadmap 写进用户可见页面。
- 不要在未回写 Wiki 的情况下结束一轮实现。
