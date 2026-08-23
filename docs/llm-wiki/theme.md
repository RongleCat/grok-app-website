# 明暗主题

站点必须提供 **暗色** 与 **亮色**。用户要求：切换主题时，展示画面也要换，不能只换背景色。

## 权威截图

| 主题 | 工作台画面 | 用途 |
|------|------------|------|
| 暗色 | [assets/workbench-dark.png](./assets/workbench-dark.png) | Hero 窗口、暗色皮肤缩略主图 |
| 亮色 | [assets/workbench-light.png](./assets/workbench-light.png) | Hero 窗口、亮色皮肤缩略主图 |
| 整页暗色目标 | [assets/landing-dark.png](./assets/landing-dark.png) | 站点暗色布局与组件 |

两张工作台图是同一空状态、同一信息架构：侧栏（Grok / 新建会话 / 已安排 / 连接设备 / 项目树 / 铁柱AGI 47%）+ 主区 SuperGrok HEAVY + 「随心输入」composer（Grok 4.6 极高、替我审批）。  
差别只在 appearance：暗色近黑侧栏与主区；亮色白底、浅灰侧栏、深字。

## 行为

1. 在 `<html>` 上挂 `data-theme="dark" | "light"`（或等价 class）。默认 **暗色**（效果图主视觉是暗的）。
2. Header 右侧用月亮 / 太阳图标切换暗色与亮色（`data-theme-set="dark|light"`）。不再用三颗圆点。语言控件在顶栏左侧 Logo 旁，见 [i18n.md](./i18n.md)。
3. `prefers-color-scheme` 仅在用户未手动选择时生效。手动选择写入 `localStorage`（键名建议 `grok-app-site.theme`）。
4. **切到 dark**：所有 token 走暗色；Hero / 主题展示主画面换成 `workbench-dark.png`。
5. **切到 light**：所有 token 走亮色；Hero / 主题展示主画面换成 `workbench-light.png`。
6. 过渡短（~180–220ms），尊重 `prefers-reduced-motion`。
7. 皮肤预览条（绿 / 琥珀等产品皮肤）保持四张示意；其中代表「当前站点主题」的那一张应跟站点主题走（暗站高亮暗窗，亮站高亮亮窗）。

## Token 方向

站点暗色贴效果图与产品仓 `docs/design-tokens.md` 的克制黑：

| Token | Dark | Light（同构推断） |
|-------|------|-------------------|
| `--bg-app` | `#070708` / `#0d0d0d` | `#f5f5f4` / `#fafafa` |
| `--bg-elevated` | `#141416` | `#ffffff` |
| `--border` | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` |
| `--text-primary` | `rgba(255,255,255,0.92)` | `rgba(20,20,20,0.92)` |
| `--text-secondary` | `rgba(255,255,255,0.55)` | `rgba(20,20,20,0.55)` |
| `--cta-solid-bg` | 近白 | 近黑 |
| `--cta-solid-fg` | 近黑 | 近白 |
| `--radius-card` | `20–28px` | 同 |
| `--radius-pill` | `9999px` | 同 |

禁止：亮色只反转 `--bg` 却留下白字；禁止亮色 Hero 仍显示暗色工作台图。

产品仓皮肤 id（`default | rose | gothic | mist | ocean | ember`）是 **App 内皮肤**，不是站点主题。站点 v1 只做 light/dark。首页预览条上的绿/琥珀是示意。社区外观包画廊在 `/skins/`，运行时拉目录；Apply 发 `grok://` 深链。契约见 [skins.md](./skins.md)。

## 资源约定

实现：`src/theme.ts` 写 `html[data-theme]`，存储键 `grok-app-site.theme`。默认暗色；仅当存储值为 `system` 时跟 `prefers-color-scheme`。Hero 与皮肤「当前主题」缩略图走 `public/images/workbench-{dark,light}.webp`（同源 PNG 保留）。Wiki `assets/` 仍是设计权威。

替换截图时：

1. 覆盖 `docs/llm-wiki/assets/workbench-*.png`
2. 同步站点引用
3. 在本页注明拍摄版本 / 日期
