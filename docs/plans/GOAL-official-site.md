# Goal — grok-app.com 官网落地（多 Agent 同步）

把本文件整份当合同。执行 Agent 先读仓库 `AGENTS.md` 与 `docs/llm-wiki/`，再认领航道。  
可复制的启动提示词：`docs/plans/GOAL-official-site.prompt.md`。  
可复制的单行 `/goal`：`docs/plans/GOAL-official-site.goal.txt`。

---

## Outcome

`grok-app.com` 仓库里有一套可本地预览、可部署到 Cloudflare Pages 的单页官网：

1. 桌面宽度完整还原 `docs/llm-wiki/assets/landing-dark.png`。
2. 亮/暗主题同构；切主题时 Hero 与皮肤主画面换成对应工作台图。
3. 简体 / 繁體 / English 三语齐全；首屏跟系统语言；用户手动切换后写入 localStorage 并在刷新后保持。
4. `1440 / 1280 / 1024 / 768 / 390` 五档自适应，窄屏重排后仍然干净，无横溢、无挡字、无点击热区过小。
5. 下载按钮走产品仓稳定 URL；构建时可拉 `downloads.json`，失败回退且保留 GitHub Releases 兜底。
6. 每次改动回写 `docs/llm-wiki/`。

站点上线绑域可以留到代码验收之后，不阻塞 Outcome 1–5。

---

## 必读（所有航道）

| 文件 | 为什么 |
|------|--------|
| `AGENTS.md` | Wiki 回写硬规则、密钥、范围 |
| `docs/llm-wiki/status.md` | 当前真相、航道占用 |
| `docs/llm-wiki/design.md` | 效果图还原 + 窄屏重排 |
| `docs/llm-wiki/theme.md` | 明暗与截图切换 |
| `docs/llm-wiki/i18n.md` | 语言探测与持久化 |
| `docs/llm-wiki/content.md` | 三语文案权威表 |
| `docs/llm-wiki/downloads.md` | 下载 URL 与禁止事项 |
| `docs/llm-wiki/deploy.md` | 仅 L6 需要 |

产品仓只在改下载契约时打开 `website-downloads.md`。不要复制产品仓整份 wiki。

---

## 技术锁（避免各 Agent 各搭一套）

| 项 | 决定 |
|----|------|
| 栈 | Vite + TypeScript + 原生 CSS。不用 React、不用 Tailwind、不用 UI 组件库 |
| 入口 | `index.html` + `src/main.ts` |
| 文案 | `src/i18n/{zh,zh-TW,en}.ts` + `t(locale, key)` |
| 主题 | `html[data-theme=dark\|light]`，键 `grok-app-site.theme` |
| 语言 | 键 `grok-app-site.locale`，算法见 i18n.md |
| 部署 | 静态 `dist/`，Cloudflare Pages |
| 图片 | `public/` 引用工作台与 Logo；Wiki `assets/` 仍是设计权威 |

理由：落地页要像素级对照 CSS，多 Agent 按文件切开比抢一个 React 树更安全。

---

## 航道与文件所有权

**同时最多一个 Agent 写同一文件。** 认领时先改 `status.md` 航道表：`idle | claimed:<agent> | done`。

### L0 骨架（先做完，其它航道才能并行）

负责人：1 个 Agent。不与其它航道并行写代码。

交付：

- `package.json` / `vite.config.ts` / `tsconfig.json`
- `index.html`：顶栏、各 section 空壳、`id` 与 design.md 一致
- `src/main.ts`：启动 theme + locale + 把 `data-i18n` 填进 DOM
- `src/theme.ts`、`src/i18n/index.ts`（运行时，不含三份文案大表）
- `src/styles/tokens.css`、`src/styles/base.css`
- `public/` 放入 Logo 与两张工作台图（从 wiki assets 复制，不删 wiki 原件）
- `npm` / `pnpm` 脚本：`dev`、`build`、`preview`

接口锁死给后面的人：

- 文案节点：`data-i18n="hero.title"`
- 主题：只改 `data-theme`，CSS 用变量
- section id：`#product` `#features` `#download` 以及 design.md 中的名字

### L1 顶栏 + Hero + 页脚（视觉主航道）

可与 L2 / L3 / L4 并行。

独占：`src/styles/header.css` `src/styles/hero.css` `src/styles/footer.css`  
可改：`index.html` 里 header / hero / footer 标记（不要动别人的 section 内部）

交付：桌面 1440 对照效果图的顶栏、Hero（含窗口框 + 三枚浮动胶囊）、页脚。语言控件占位：`#locale-switcher`。主题三点可用。

### L2 中段区块

可与 L1 / L3 / L4 并行。

独占：`src/styles/sections.css`  
可改：`index.html` 里 value / capabilities / skins / opensource

交付：三价值卡、六能力卡、皮肤四预览、开源横条。桌面构图贴效果图。

### L3 三语文案

可与 L1 / L2 / L4 并行。

独占：`src/i18n/zh.ts` `src/i18n/zh-TW.ts` `src/i18n/en.ts`  
可改：`#locale-switcher` 的行为（不要重做 L1 的顶栏布局）

交付：content.md 全 key 三份；切换立即生效；刷新保持手动选择；清存储后跟系统。

### L4 下载

可与 L1 / L2 / L3 并行。

独占：`src/downloads.ts` `src/styles/download.css` `scripts/fetch-downloads.mjs`  
可改：`index.html` 的 `#download`

交付：三主按钮 + 展开七包；稳定 URL；构建时拉 JSON，失败回退；GitHub Releases 兜底。禁止把包装进仓、禁止反代。

### L5 窄屏（L1–L4 桌面完成后再开）

独占：`src/styles/responsive.css`

只写媒体查询和必要的 mobile 辅助 class。禁止改 desktop 的 token 值来「将就」手机。按 design.md 五档验收。

### L6 质检与部署（L5 之后，或与 L5 尾部重叠只读）

可写：`.github/workflows/*`、`wrangler` 配置、`docs/llm-wiki/deploy.md` `status.md`  
禁止改视觉 CSS 除非质检出缺陷并在 status 登记。

部署用环境变量里的 token，不把密钥写入仓库。

---

## 同步协议

1. 开工：读 `status.md` 航道表。若目标航道不是 `idle`，不要抢。
2. 认领：把该行改成 `claimed:<短名>`，`log.md` 追加「认领 Lx」。
3. 干活：只写本航道独占文件。要动共享文件（`index.html`、`main.ts`）时只改自己的挂载点，提交前看 diff 是否越界。
4. 收工：航道标 `done`；专题页改现在时；`status.md` + `log.md` 回写。
5. 冲突：发现别人的文件必须改，在 `status.md` 的「航道请求」写一条，不要直接改。
6. 禁止 force-push、禁止改产品仓、禁止提交 `.env`。

---

## 集成检查点

| 点 | 何时 | 谁 | 过关 |
|----|------|----|------|
| C0 | L0 完成 | L0 | `pnpm dev` 能打开空壳；theme / locale runtime 可调用 |
| C1 | L1–L4 都 done | 任意收口 Agent | 1440 暗色对照效果图；三语可切；下载 href 正确 |
| C2 | L5 done | L5 或 L6 | 五档宽度无横溢、无挡字 |
| C3 | 可选 | L6 | Pages 预览 URL 可打开；域名绑定另议 |

---

## 验证

每航道结束至少：

- `pnpm build` 通过
- 本航道验收项自己点过
- Wiki 已回写

全站完成：

- 清 localStorage：系统 `zh-CN` / `zh-TW` / `en-US` 各开一次，语言对
- 手动切语言后刷新仍在
- 切暗/亮，Hero 图跟着换
- 1440 截图与 `landing-dark.png` 并排，结构能对上
- 390 与 768 截图：导航可用、胶囊不压 SuperGrok、下载钮可点
- 七个下载入口（或三主钮展开后的七包）指向 GitHub `latest/download` 稳定名
- 页面无安装包字节、无 `grok-desktop-latest`

---

## 约束

- 完整还原效果图；允许的偏差只有：语言控件、版权年 2026、速度胶囊不写 1.2s
- 皮肤 Apply 只发 `grok://` 深链（`/skins/`）；不做桌面端功能、不托管安装包
- 不把 Cloudflare / GitHub token 写入仓库
- 不在用户可见页面写 TODO、Agent、Wiki 字样
- 三语 key 必须同时存在

## 边界

可写：本仓库内站点源码、`public/`、构建脚本、`docs/llm-wiki/`、`docs/plans/`、后续 CI  
禁止：产品仓源码、本机 `~/.agents/secrets`、其它网站仓库、删除 `cf-temp-email`、改 `api-model.com`

## 迭代

一次只收一个航道。失败先看浏览器与 build 日志，再改同一航道。同一缺陷连打两轮仍不过，换证据（截图对比、计算样式），不要整页重写。

## 完成 / 暂停

完成：C1 + C2 过关，Wiki `status.md` 写明已实现项。  
暂停：需要生产域名最终确认、新的效果图、产品仓尚未提供的稳定别名导致无法验收下载（可先用稳定 URL + Releases 兜底继续）、或缺少 CF token 环境变量（只停 L6）。
