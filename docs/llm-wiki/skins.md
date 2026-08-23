# 社区皮肤画廊

独立页：`/skins/`（`skins/index.html`）。视觉移植自 `ronglecat.github.io/grok-app-skin`：暗色优先、细网格底、16:9 卡（壁纸铺满 + 毛玻璃工作台剪影 + 底栏名字 / chips / Apply / 下载）。精选卡通栏；窄屏仍保持 16:9。不要 iframe github.io。

## 目录（运行时拉，不打进构建）

| 角色 | URL |
|------|-----|
| 主源 | `https://cdn.jsdelivr.net/gh/RongleCat/grok-app-skin@main/docs/catalog.json` |
| 回退 | `https://ronglecat.github.io/grok-app-skin/catalog.json` |
| 给用户复制的目录地址 | 回退那条（App「皮肤源」用） |

实现：`src/skins.ts` 的 `fetchCatalog` / `parseCatalog`。`schemaVersion` 必须是 `1`。卡片用包上的 `previewUrl` / `downloadUrl`，不要改写成相对路径。

包字段（v1）：`id`、`name`、`nameEn`、`description`、`descriptionEn`、`author`、`previewUrl`、`downloadUrl`、`tags`、`featured`、`focus{cx,cy}`、`scrim`、`hasWallpaper`、`skin`、`kind`、`credit` / `creditEn`、`bytes`、`sha256`。

## Apply / 下载 / 投稿

- Apply：`grok://skin/import?url=` + `encodeURIComponent(downloadUrl)`。只发深链，不在本仓实现 `.grokskin` 解析或桌面端逻辑。
- 下载：链到该包 `downloadUrl`。
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
