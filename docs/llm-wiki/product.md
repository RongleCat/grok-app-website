# 产品与范围

## 这是什么

**Grok App** 是给本机 [Grok Build](https://x.ai) CLI（`grok agent stdio`）用的开源桌面工作台 / GUI：多项目、多会话、权限、媒体预览、自动化。  
对外短称：**开源 Grok App** / **open-source Grok App**。不要把产品改名为 Grok Desktop。  
技术栈（产品仓）：Tauri 2 + Rust · React + TypeScript + Vite。

站点不要写「非官方 / unofficial / 不是 xAI 官方产品」。需要定位时，只写它是本机 Grok Build CLI 的桌面工作台 / GUI。不要留一句只为声明身份的免责声明。  
不要自称唯一客户端；写明是社区工作台之一（`RongleCat/grok-app`）。  
不要抢纯「Grok 下载」网页聊天 / PWA 意图。

作者公开身份：铁柱 AGI（X `@cgnot996`）。开源协议：MIT。  
产品仓：`https://github.com/RongleCat/grok-app`。  
官网仓：`https://github.com/RongleCat/grok-app-website`。

## 本仓是什么

本仓只做 **grok-app.com**：介绍产品、展示工作台、引导下载、链到 GitHub。

| 做 | 不做 |
|----|------|
| 落地页 + `/opensource/` + `/faq/` + 明暗主题 | 桌面端功能、Tauri、Agent 运行时 |
| 简体 / 繁體 / English，跟系统或记住手动选择 | 只做一种语言、或用浏览器翻译凑数 |
| 下载按钮 / 可选短链 302 | 托管或反代安装包 |
| 构建时拉 `downloads.json` | 浏览器直拉 GitHub API / JSON |
| 工作台明暗截图展示；`/skins/` 运行时画廊 + Apply 深链 | 皮肤编辑器、`.grokskin` 解析、桌面端逻辑 |
| Cloudflare Pages 静态站 | 应用内自动更新（`grok-desktop-latest`） |

官网顶栏、页脚、功能卡与皮肤区链到 `/skins/`。画廊运行时拉目录；桌面 Apply 发 `grok://skin/import?url=`，手机 / 窄屏只 toast、不发深链。投稿外链皮肤仓 CONTRIBUTING。产品仓 `OFFICIAL_SKIN_CATALOG_URL` 以产品仓为准。契约见 [skins.md](./skins.md)。

## 一句话定位（站点主标题用这个）

效果图已定稿：

- 主标题：让 Grok 真正开始工作（锁定，不要改）
- 副标题：为 Grok Build CLI 打造的开源桌面 GUI
- 页脚 / 隐藏定义：开源 Grok App 是本机 Grok Build CLI 的桌面工作台。

标题保持短（`开源 Grok App · 桌面工作台` / `Open-source Grok App · desktop workbench`）。  
不要改成「AI 聊天客户端」或「Grok 桌面版 / 官方桌面端」。Grok Desktop / Grok GUI 只作为搜索别名出现在 meta / FAQ / `llms.txt`。

## 访客要完成的事

1. 3 秒内看懂这是开源桌面工作台，不是网页聊天。
2. 按自己的系统下到正确安装包（Mac ARM 默认不要导向 Intel）。
3. 能去 GitHub 看源码 / Release / 文档。
4. 能在站点上切换明暗，并看到对应工作台画面。
5. 系统语言或手动选择下，整页文案是简体、繁體或 English 之一。
6. 能从导航或页脚进入本站 `/skins/` 社区皮肤画廊。

## 与产品仓的关系

```text
RongleCat/grok-app          本仓 grok-app-website
  tag vX.Y.Z  ──────────►  构建时拉 downloads.json
  Release 资产（包）         按钮 href → GitHub latest/download
  website-downloads.md      本目录 downloads.md（消费侧）
```

发版流程、改文件名、改 `publish-website-downloads.py` —— 去产品仓。  
改按钮、短链、版本号展示 —— 在本仓，并回写 `downloads.md`。
