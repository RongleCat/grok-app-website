# 外部权威与本机路径

本 Wiki 吸收结论。源头变更时对一下再改专题页，不要两边各写一套互相漂移。

## 产品仓（桌面端）

| 用途 | 路径 |
|------|------|
| 本机仓库 | `/Users/ronglecat/Documents/self/tools/desktop-app/grok-app` |
| GitHub | `https://github.com/RongleCat/grok-app` |
| 下载契约原文 | `docs/llm-wiki/website-downloads.md` |
| 发版流程 | `docs/llm-wiki/release.md` |
| 清单生成脚本 | `scripts/publish-website-downloads.py` |
| 设计 token | `docs/design-tokens.md` |
| 皮肤 / Apply 上游设计 | `docs/plans/2026-08-15-appearance-skin-share-design.md` |
| 中文 README | `README_ZH.md` |
| Agent 规则 | `AGENTS.md` |
| 工作台截图（产品自带） | `assets/screenshots/` |
| 微信公众号搜一搜图 | `assets/wechat/mp-search-scan.png`（README 页顶） |
| 微信个人二维码 | `assets/wechat/community-group-qr.png`（README 标交流群；官网按作者要求作添加好友） |

## 本仓

| 用途 | 路径 |
|------|------|
| 工作区 | `/Users/ronglecat/Documents/self/website/grok-app-website` |
| GitHub | `https://github.com/RongleCat/grok-app-website` |
| Agent 规则 | `AGENTS.md` |
| Wiki | `docs/llm-wiki/` |
| Goal 合同 | `docs/plans/GOAL-official-site.md` |
| Goal 启动提示词 | `docs/plans/GOAL-official-site.prompt.md` |
| 效果图 | `docs/llm-wiki/assets/landing-dark.png` |
| 暗色工作台 | `docs/llm-wiki/assets/workbench-dark.png` |
| 亮色工作台 | `docs/llm-wiki/assets/workbench-light.png` |

## 线上

| 用途 | URL |
|------|------|
| 目标站点 | `https://grok-app.com` |
| 开源页 | `https://grok-app.com/opensource/` |
| 安装指南 | `https://grok-app.com/install/` |
| 更新日志 | `https://grok-app.com/changelog/` |
| 社区皮肤画廊 | `https://grok-app.com/skins/` |
| 皮肤目录（主源） | `https://cdn.jsdelivr.net/gh/RongleCat/grok-app-skin@main/docs/catalog.json` |
| 皮肤目录（回退 / 给 App 复制） | `https://ronglecat.github.io/grok-app-skin/catalog.json` |
| 皮肤投稿 | `https://github.com/RongleCat/grok-app-skin/blob/main/CONTRIBUTING.md` |
| 贡献者投稿 | 产品仓 Issues（标题含「贡献者信息」及同期投稿）；整理规则见 [contributors.md](./contributors.md) |
| 最新下载前缀 | `https://github.com/RongleCat/grok-app/releases/latest/download/` |
| Releases 列表 | `https://github.com/RongleCat/grok-app/releases` |
| 产品仓公开 API（star 数，仅构建脚本与 Pages Function） | `https://api.github.com/repos/RongleCat/grok-app` |
| star 数回退镜像（仅构建脚本与 Pages Function；读 `repo.stars`） | `https://ungh.cc/repos/RongleCat/grok-app` |
| 官网 star 同源接口（浏览器只打这个） | `https://grok-app.com/api/stars` |
| 清单（下一枚正式 tag 后） | `…/latest/download/downloads.json` |

## 会话里已发生、但不要当长期权威的东西

- 聊天里贴过的 Cloudflare token：只作验权，不入库。
- 效果图页脚 `© 2024`：以 [content.md](./content.md) 的 2026 为准。
- 效果图「平均响应 1.2s」：未证实，见 [content.md](./content.md)。
