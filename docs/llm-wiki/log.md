# 操作日志

只追加，不改写历史。格式见 [maintain.md](./maintain.md)。

---

## 2026-08-22 · SEO/GEO Phase 0 技术基础进 main

- **操作者**：agent
- **触发**：用户要求官网可抓取 / AI 引用基础，并直接推 `main`（不要开 PR 等人审）
- **改动**：
  - `public/_redirects`：`www.grok-app.com/*` 301 → `https://grok-app.com/:splat`；保留 `/opensource` 与新增 `/faq` 去尾斜线规则
  - `public/sitemap.xml` 含 `/` `/opensource/` `/faq/`，带 `lastmod`（2026-08-22）
  - `public/llms.txt`：非官方本机 Grok Build CLI 工作台、MIT、平台、Releases、铁柱AGI
  - 首页 JSON-LD `@graph`：SoftwareApplication（`softwareVersion` 跟 `downloads-meta.json` 的 `v0.2.24`）+ Organization + WebSite；`sameAs` 仅 GitHub 与 `https://x.com/cgnot996`
  - 公开页补 `robots=index,follow`、`twitter:site` / `twitter:creator` `@cgnot996`；加强 `meta.description` 与静态 `brand.definition`
  - 新增 `/faq/` 六问三语 + `FAQPage` JSON-LD + 顶栏/页脚链接
- **Wiki**：seo.md（新）/ content / design / deploy / i18n / status / README / AGENTS / 本条
- **结果**：源码在 `main`；`pnpm test` 与 `pnpm build` 通过。线上要等下次 Pages deploy
- **未做 / 下一步**：本机 `wrangler pages deploy dist` 上线本轮静态文件；未加 Search Console 验证码、未加分析跟踪

---

## 2026-08-22 · 官网仓推送到 GitHub

- **操作者**：agent (grok)
- **触发**：用户要求「官网项目推送到 github」
- **改动**：
  - 本仓此前无 `.git`；`git init` 后首提交上 `main`
  - 新建公开仓 `https://github.com/RongleCat/grok-app-website`（homepage `https://grok-app.com`，MIT，与产品仓同协议）
  - 忽略 `node_modules/`、`dist/`、`.wrangler/`、`.env*`、`.gstack/`
  - `package.json` 写入 `repository` / `homepage`；根 README 链到该仓
- **Wiki**：status / sources / deploy / product / 本条
- **结果**：源码在 GitHub 公开；线上站点仍由本机 `wrangler pages deploy`，未接 GitHub Actions
- **未做 / 下一步**：有新 Issues 投稿时按 contributors.md 更新再 deploy；GitHub Actions 触发官网重建尚未做

---

## 2026-08-18 · 再次关闭投稿 Issues 并致谢

- **操作者**：agent (grok)
- **触发**：用户要求把提交信息 Issues 关掉，并感谢付出
- **改动**：
  - 产品仓曾留言「按维护约定保持打开」，8 个投稿 Issue 被重新打开
  - 再次关闭 #637 #638 #639 #640 #642 #643 #649 #678，评论：已上墙 + 致谢
- **Wiki**：contributors / status / 本条
- **结果**：8 个均为 CLOSED；开放列表里不再出现这批投稿
- **未做 / 下一步**：若产品仓再把资料 Issue 打开，按用户意图关回去

---

## 2026-08-18 · 同步贡献者墙并关闭投稿 Issues

- **操作者**：agent (grok)
- **触发**：拉取 grok-app Issues 开源贡献者信息，整理到本地，更新页面，关闭 Issues，发布线上
- **改动**：
  - 新增投稿 #678 江知：头像 `public/images/contributors/jiangzhi.jpg`，写入 `src/generated/contributors.json`（PRs #668 #669 #672）
  - WuKong 备注改为已合并 PR #648
  - 新增 [contributors.md](./contributors.md)；`AGENTS.md` / README 加路由
  - 构建顺带拉到 `downloads.json` tag `v0.2.21`
  - `wrangler pages deploy dist`，预览 `https://98a19307.grok-app.pages.dev`
  - 关闭产品仓 Issues #637 #638 #639 #640 #642 #643 #649 #678，评论指向 `/opensource/`
- **Wiki**：contributors / status / design / sources / README / 本条
- **结果**：https://grok-app.com/opensource/ 墙 8 人（含江知），头像 200；8 个投稿 Issue 已关
- **未做 / 下一步**：有新 Issues 投稿时按 contributors.md 更新再 deploy

---

## 2026-08-17 · 修移动端汉堡菜单

- **操作者**：agent (grok)
- **触发**：用户截图：三杠间隔过大；下拉在页面正中盖住标题，不在汉堡下方
- **改动**：
  - `nav` + 汉堡收进 `.nav-cluster`（`index.html` / `opensource/index.html`）
  - 三杠 `align-content: center` + `gap: 4px`，不再被 44px 格子撑开
  - 窄屏菜单 `position: absolute; top: calc(100% + 8px); right: 0` 贴按钮右下角
- **Wiki**：design / status / 本条
- **结果**：390/768 下拉贴汉堡右下（间距 8px、右对齐）；桌面顶栏胶囊导航不变。已 deploy，预览 `https://dde93aa0.grok-app.pages.dev`
- **未做 / 下一步**：无

---

## 2026-08-17 · 开源页墙间隔与微信二维码弹窗

- **操作者**：agent (grok)
- **触发**：墙说明与贡献者列表贴在一起；公众号要点开 README 图；再加添加微信好友二维码弹窗
- **改动**：
  - `.oss-wall .contrib-grid { margin-top: 28px }`
  - 复制产品仓 `assets/wechat/mp-search-scan.png`、`community-group-qr.png` 到 `public/images/wechat/`
  - 作者区两个按钮 `data-qr-open=mp|friend`，`#qr-dialog` 展示对应图
  - 去掉公众号复制「铁柱AGI」；三语补 `oss.author.wechatFriend` / `oss.qr.*`
- **Wiki**：design / content / sources / status / 本条
- **结果**：已 `wrangler pages deploy`，本次预览 `https://7bae9c10.grok-app.pages.dev`
- **未做 / 下一步**：有新 Issues 投稿时更新 `src/generated/contributors.json` 并再 deploy

---

## 2026-08-17 · 独立开源页与贡献者墙

- **操作者**：agent (grok)
- **触发**：用户要把「开源」做成单独页：仓库介绍、作者、X/公众号、Issues 投稿的 PR 成员墙
- **改动**：
  - 新增 `opensource/index.html`、`src/styles/opensource.css`
  - 导航改 `/opensource/`；落地页横条改链到该页
  - 贡献者数据 `src/generated/contributors.json`（Issues #637 #638 #639 #640 #642 #643 #649）
  - 头像压进 `public/images/contributors/`
- **Wiki**：design / content / status / 本条
- **结果**：已上线 https://grok-app.com/opensource/
- **未做 / 下一步**：有新 Issues 投稿时更新 `src/generated/contributors.json` 并再 deploy

---

## 2026-08-17 · 下载次级链接改为 hover 下划线

- **操作者**：agent (grok)
- **触发**：用户觉得卡片里 Apple Silicon / Intel 等链接下划线不好看
- **改动**：`src/styles/download.css` 的 `.dl-menu a` 与 `.dl-fallback` 默认无下划线、字色更弱；hover 才出现下划线；菜单与主按钮之间加一条细分割线
- **Wiki**：本条
- **结果**：已 `wrangler pages deploy`，生产会跟到最新部署
- **未做 / 下一步**：无

---

## 2026-08-17 · 部署 grok-app Pages 并绑域

- **操作者**：agent (grok)
- **触发**：用户在聊天提供 CF User Token，要求部署
- **改动**：
  - 创建 Pages 项目 `grok-app`，`wrangler pages deploy dist`
  - 绑定 `grok-app.com` / `www.grok-app.com`（active）
  - DNS：apex + www CNAME → `grok-app.pages.dev`（橙色云）
  - Zone Always HTTPS = on
  - 令牌未写入仓库；聊天中的值视为已暴露
- **Wiki**：deploy.md、status.md、本条
- **结果**：`https://grok-app.com` / `www` / `grok-app.pages.dev` 均 200，含新 Logo 与文字语言控件
- **未做 / 下一步**：Dashboard 轮换 token；后续发版用环境变量再 deploy

---

## 2026-08-17 · 顶栏 Logo / 限宽 / 文字语言 / 主题图标

- **操作者**：agent (grok)
- **触发**：用户要求用 Grok App 内 Logo、顶栏限宽左右分布、Grok 与英文改非衬线、语言不要圆形按钮、主题改明暗 Icon，然后部署
- **改动**：
  - Logo 换成产品仓 `IconGrokMark`（`public/logo.svg` + favicon）
  - `.header-inner` 限 `--max`，左 Logo+`简 / 繁 / EN`，右月亮/太阳 + 下载
  - 去掉 `--serif`，标题 Grok 与英文走系统非衬线
- **Wiki**：design / theme / i18n / status / 本条
- **结果**：本地预览已改完。`wrangler pages deploy` 因未设置 `CLOUDFLARE_API_TOKEN` 失败（L6 暂停）
- **未做 / 下一步**：导出 CF token 后 `npx wrangler pages deploy dist --project-name grok-app`

---

## 2026-08-17 · 建立 llm-wiki 与 Agent 回写规则

- **操作者**：agent
- **触发**：用户要求为 grok-app.com 先整理官网仓 LLM-Wiki；效果图 + 明暗工作台截图 + 产品仓 `website-downloads.md`；任何操作后必须回写 Wiki，并把该规则写入项目 Agent MD
- **改动**：
  - 新增 `AGENTS.md`、`CLAUDE.md`
  - 新增 `docs/llm-wiki/`：README、maintain、status、log、product、design、theme、content、downloads、deploy、sources
  - 收入效果图 `assets/landing-dark.png`、`workbench-dark.png`、`workbench-light.png`
  - 本轮未写前端、未部署、未把 CF token 写入仓库
- **Wiki**：本目录初版即本轮产物
- **结果**：后续 Agent 可以只靠本目录接手；回写协议已挂在 `AGENTS.md` §0
- **未做 / 下一步**：按 `status.md` 落地单页并接下载 URL

---

## 2026-08-17 · 补 .gitignore

- **操作者**：agent
- **触发**：本轮建仓，避免后续把 `.env` / token 提交进 git
- **改动**：新增根目录 `.gitignore`（`.env`、`node_modules`、`dist`、`.wrangler`）
- **Wiki**：本条
- **结果**：密钥文件默认不会入库
- **未做 / 下一步**：仍按 `status.md` 落地单页

---

## 2026-08-17 · 768 顶栏改汉堡，下载 CTA 单行

- **操作者**：agent (grok)
- **触发**：验收指出 768 仍用桌面顶栏，「免费下载」被挤成竖排四字
- **改动**：`src/styles/responsive.css` 顶栏重排提前到 `max-width: 768px`（汉堡 + 次行语言/主题 + CTA nowrap）；`header.css` 给 `.header-download` 加 `white-space: nowrap`；`src/responsive.test.ts` 锁住该断点
- **Wiki**：design.md 窄屏表、本条
- **结果**：768 不再用 72px 桌面顶栏挤 CTA
- **未做 / 下一步**：重拍 `w-768.png` 后继续 C2 收口

---

## 2026-08-17 · 落地可预览单页（L0–L5，C1/C2）

- **操作者**：agent (grok)
- **触发**：/goal 落地 grok-app.com 单页：对照效果图、三语、主题换图、五档宽度、七个稳定下载
- **改动**：
  - 新增 Vite 静态站：`package.json` `vite.config.ts` `tsconfig.json` `index.html` `src/**`
  - `public/images/` 工作台 WebP + OG；禁止安装包入库
  - 构建时 `scripts/fetch-downloads.mjs`；本机拉到 `downloads.json` tag `v0.2.20`，失败回退稳定 URL
  - 单测 `src/i18n/locale.test.ts` `src/downloads.test.ts` `src/theme.test.ts` `src/markup.test.ts`
  - 未部署、未写密钥
- **Wiki**：status / design / theme / i18n / downloads / content / 本条
- **结果**：`pnpm build` 两次通过；4173/4174 预览 200；无头 Chrome 核对三语、主题换图、五档无横溢、七个 href
- **未做 / 下一步**：L6 绑 Cloudflare Pages（缺环境变量则停部署）

---

## 2026-08-17 · 认领 L0 骨架

- **操作者**：agent (grok)
- **触发**：/goal 落地可预览 grok-app.com 单页；按 GOAL-official-site 航道先做 L0
- **改动**：`status.md` 航道表 L0 → `claimed:grok`
- **Wiki**：status.md、本条
- **结果**：L0 开工，尚未写前端文件
- **未做 / 下一步**：搭 Vite 骨架、theme/i18n runtime、public 工作台图

---

## 2026-08-17 · 三语、还原效果图、窄屏、多 Agent Goal

- **操作者**：agent
- **触发**：用户要求官网加英文与繁体、按系统语言自动切换且记住手动选择；必须完整还原效果图并做好窄屏；改完后给 Goal 文档与启动提示词
- **改动**：
  - 新增 `docs/llm-wiki/i18n.md`；重写 `content.md` 为 zh / zh-TW / en 全 key
  - `design.md` 增加完整还原清单与五档窄屏重排
  - 新增 `docs/plans/GOAL-official-site.md`、`.prompt.md`、`.goal.txt`
  - 更新 `AGENTS.md`、`README.md`、`status.md` 航道表
- **Wiki**：本条 + status / README / product / sources
- **结果**：合同已够多 Agent 按航道并行；前端代码仍未写
- **未做 / 下一步**：用 Goal 提示词启动 L0
