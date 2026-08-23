# 社区皮肤画廊

独立页：`/skins/`（`skins/index.html`）。视觉移植自 `ronglecat.github.io/grok-app-skin`：暗色优先、细网格底、等大 16:9 卡（壁纸铺满 + 跟站点主题走的毛玻璃工作台剪影）。默认态只有壁纸和剪影；名字 / 精选 chip / 应用 / 下载叠在铺满整卡的 `.g-card-dock` 上，桌面 hover 或键盘 `:focus-within` 才出现。精选只靠一枚 chip，不占整行。不要 iframe github.io。

## 卡片网格

实现：`src/styles/gallery.css` 的 `.gallery-grid`。

- 默认：`grid-template-columns: repeat(auto-fill, minmax(min(100%, 240px), 1fr));`
- 宽屏（`≥1100px`）：4 列
- 中屏（`641–1099px`）：3 列
- 窄屏（`≤640px`）：**最少 2 列** `repeat(2, minmax(0, 1fr))`
- 禁止 `.g-card-featured { grid-column: 1 / -1 }`。精选与其它卡同尺寸。
- 内容宽约 `min(1180px, 100% - 48px)`，Hero / 主区 padding 收紧，避免单卡四周空一圈。
- 2 列手机：精选 chip 隐藏，应用 / 下载并排、字号缩小，保证可点。

## 工作台剪影（跟站点主题 + 真 App）

皮肤包本身不锁亮暗。剪影必须跟 `html[data-theme]` 走，颜色走 `--chrome-*` 变量（站点主题切换即时重绘）。Dock 的 Apply / 下载仍用站点 lime。

| Token | `data-theme=dark` | `data-theme=light` |
|-------|-------------------|--------------------|
| `--chrome-bg` | `#0d0d0d` | `#f4f4f6` |
| `--chrome-sidebar` | `rgba(16,16,16,0.4–0.55)` 毛玻璃 | `rgba(255,255,255,0.38–0.55)` 毛玻璃 |
| `--chrome-main` | `rgba(21,21,21,0.7)` | `rgba(255,255,255,0.78–0.9)` |
| `--chrome-user` | `#2a2a2e` | `#e8e8ed` |
| `--chrome-border` | `rgba(255,255,255,0.08–0.12)` | `rgba(0,0,0,0.06–0.1)` |
| `--chrome-accent` | `#8aa4ff` | `#3d5fd9` |

剪影：左侧栏约 22%（品牌菱形 + 新建 pill + 3–4 行会话 + 头像）；主区细顶栏、右侧用户泡、左侧 AI 行、底栏 composer（加号 \| 输入 \| 发送）。壁纸上叠 `backdrop-filter` 霜玻璃；左侧偏重的软 scrim，不要整块黑罩。对照产品仓 `src/styles/tokens.css` + `skins.css`。

## 卡片 hover overlay

实现：`src/styles/gallery.css` 的 `.g-card-dock`。

- Dock 是铺满 `.g-card-stage` 的层：`position: absolute; inset: 0; border-radius: inherit`。禁止底条左右留缝。
- 软 scrim（上浅下深的暗渐变）盖在壁纸和剪影上，文字和按钮仍可读。
- `@media (hover: hover)`：默认 `opacity: 0` / `visibility: hidden`；`.g-card:hover .g-card-dock` 与 `.g-card:focus-within .g-card-dock` 才显示。`.g-card-stage` 有 `tabindex="0"`，键盘能先落到卡再落到按钮。
- `@media (hover: none)`：始终露出底部紧凑条（仍全宽贴边），剪影 `inset` 底部让出空间。
- 文案：左边皮肤名 + 作者；最多一枚 `gallery.featured` chip（仅 `pack.featured`）；右边 `gallery.apply` + `gallery.download`。不渲染 `gallery.skin` / `gallery.wallpaper` / `gallery.video`。
- Apply 短标签：zh `应用`、zh-TW `套用`、en `Apply`。下载仍是 `下载` / `Download`。

## 目录（运行时拉，不打进构建）

| 角色 | URL |
|------|-----|
| 主源 | `https://cdn.jsdelivr.net/gh/RongleCat/grok-app-skin@main/docs/catalog.json` |
| 回退 | `https://ronglecat.github.io/grok-app-skin/catalog.json` |
| 给用户复制的目录地址 | 回退那条（App「皮肤源」用） |

实现：`src/skins.ts` 的 `fetchCatalog` / `parseCatalog`。`schemaVersion` 必须是 `1`。卡片用包上的 `previewUrl` / `downloadUrl`，不要改写成相对路径。

包字段（v1）：`id`、`name`、`nameEn`、`description`、`descriptionEn`、`author`、`previewUrl`、`downloadUrl`、`tags`、`featured`、`focus{cx,cy}`、`scrim`、`hasWallpaper`、`skin`、`kind`、`credit` / `creditEn`、`bytes`、`sha256`。

## Apply / 下载 / 投稿

- 桌面 Apply：`grok://skin/import?url=` + `encodeURIComponent(downloadUrl)`，再 toast `gallery.applyHint`。只发深链，不在本仓实现 `.grokskin` 解析或桌面端逻辑。
- 手机 / 窄屏 Apply：`shouldBlockMobileApply` / `mobileApplyBlocked`。启发式 `matchMedia('(max-width: 768px), (hover: none) and (pointer: coarse)')`。命中则 `preventDefault()`，不发 `grok://`，toast `gallery.applyMobile`。
- 下载：链到该包 `downloadUrl`，手机端仍可用。
- 投稿：外链 `https://github.com/RongleCat/grok-app-skin/blob/main/CONTRIBUTING.md`。
- 品牌短称：开源 Grok App / Open-source Grok App。不要写非官方 / unofficial / Grok Bot。

## 导航

顶栏 / 页脚 / 首页功能卡 / 首页皮肤区 / 开源页 hero 的「皮肤 / 主題 / Themes」一律进 `/skins/`，不要再链 github.io 画廊首页。

## 实现路径

- 页：`skins/index.html`
- 逻辑：`src/skins.ts`
- 样式：`src/styles/gallery.css`
- 文案：`gallery.*` keys，见 [content.md](./content.md)
- Vite 入口：`vite.config.ts` 的 `skins`
- 重定向：`public/_redirects` 里 `/skins` → `/skins/` 301
