# 产品与范围

## 这是什么

**Grok App** 是给本机 [Grok Build](https://x.ai) CLI（`grok agent stdio`）用的开源桌面工作台：多项目、多会话、权限、媒体预览、自动化。  
技术栈（产品仓）：Tauri 2 + Rust · React + TypeScript + Vite。

**Grok App 不是 xAI 官方产品。** 站点页脚或次要位置必须有一句非官方说明，不能让访客以为这是 xAI.com 的官网。

作者公开身份：铁柱 AGI（X `@cgnot996`）。开源协议：MIT。  
产品仓：`https://github.com/RongleCat/grok-app`。  
官网仓：`https://github.com/RongleCat/grok-app-website`。

## 本仓是什么

本仓只做 **grok-app.com**：介绍产品、展示工作台、引导下载、链到 GitHub。

| 做 | 不做 |
|----|------|
| 落地页 + 明暗主题 | 桌面端功能、Tauri、Agent 运行时 |
| 简体 / 繁體 / English，跟系统或记住手动选择 | 只做一种语言、或用浏览器翻译凑数 |
| 下载按钮 / 可选短链 302 | 托管或反代安装包 |
| 构建时拉 `downloads.json` | 浏览器直拉 GitHub API / JSON |
| 工作台明暗截图展示 | 在官网里实现皮肤编辑器 |
| Cloudflare Pages 静态站 | 应用内自动更新（`grok-desktop-latest`） |

皮肤目录 `OFFICIAL_SKIN_CATALOG_URL` 在产品仓仍是空串。官网 **v1 不做** `.grokskin` / `grok://` Apply。以后要做必须先改本页范围，再改产品仓契约。

## 一句话定位（站点主标题用这个）

效果图已定稿：

- 主标题：让 Grok 真正开始工作
- 副标题：为 Grok Build 打造的开源桌面工作台

不要改成「AI 聊天客户端」或「xAI 官方桌面版」。

## 访客要完成的事

1. 3 秒内看懂这是开源桌面工作台，不是网页聊天。
2. 按自己的系统下到正确安装包（Mac ARM 默认不要导向 Intel）。
3. 能去 GitHub 看源码 / Release / 文档。
4. 能在站点上切换明暗，并看到对应工作台画面。
5. 系统语言或手动选择下，整页文案是简体、繁體或 English 之一。

## 与产品仓的关系

```text
RongleCat/grok-app          本仓 grok-app-website
  tag vX.Y.Z  ──────────►  构建时拉 downloads.json
  Release 资产（包）         按钮 href → GitHub latest/download
  website-downloads.md      本目录 downloads.md（消费侧）
```

发版流程、改文件名、改 `publish-website-downloads.py` —— 去产品仓。  
改按钮、短链、版本号展示 —— 在本仓，并回写 `downloads.md`。
