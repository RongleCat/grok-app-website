# 站点文案（zh / zh-TW / en）

改文案先改本页，再改 `src/i18n/*`。三列必须同时改。  
语言解析见 [i18n.md](./i18n.md)。

品牌专名不译：`Grok`、`Grok App`、`Grok Build`、`SuperGrok`。

速度胶囊效果图写「平均响应 1.2s」，无公开基准。**三语都不要写死 1.2s**，用本表 `pill.speed.desc`。

版权年用 **2026**，不要照抄效果图 2024。

「成员隔离」是效果图原文；产品是本机多项目。三语按本表（会话隔离），不要写成团队 SaaS。

## meta

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `meta.title` | Grok App · 开源桌面工作台 | Grok App · 開源桌面工作臺 | Grok App · Open-source desktop workbench |
| `meta.description` | 为 Grok Build 打造的开源桌面工作台。多项目、多会话、权限与媒体预览。 | 為 Grok Build 打造的開源桌面工作臺。多專案、多會話、權限與媒體預覽。 | Open-source desktop workbench for Grok Build. Projects, sessions, permissions, and media preview. |
| `brand.disclaimer` | Grok App 不是 xAI 官方产品。它把本机 Grok Build CLI 收成桌面工作台。 | Grok App 並非 xAI 官方產品。它把本機 Grok Build CLI 收成桌面工作臺。 | Grok App is not an official xAI product. It turns the local Grok Build CLI into a desktop workbench. |

## header

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `nav.product` | 产品 | 產品 | Product |
| `nav.features` | 功能 | 功能 | Features |
| `nav.download` | 下载 | 下載 | Download |
| `nav.opensource` | 开源 | 開源 | Open Source |
| `cta.download` | 免费下载 | 免費下載 | Download Free |
| `locale.zh` | 简体 | 簡體 | Simplified |
| `locale.zhTW` | 繁體 | 繁體 | Traditional |
| `locale.en` | English | English | English |
| `locale.system` | 跟随系统 | 跟隨系統 | System |
| `locale.switcher` | 语言 | 語言 | Language |
| `menu.open` | 打开菜单 | 開啟選單 | Open menu |
| `menu.close` | 关闭菜单 | 關閉選單 | Close menu |
| `theme.dark` | 暗色 | 暗色 | Dark |
| `theme.light` | 亮色 | 亮色 | Light |
| `theme.system` | 跟随系统 | 跟隨系統 | System |

## hero

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `hero.title` | 让 Grok 真正开始工作 | 讓 Grok 真正開始工作 | Let Grok actually get to work |
| `hero.subtitle` | 为 Grok Build 打造的开源桌面工作台 | 為 Grok Build 打造的開源桌面工作臺 | The open-source desktop workbench built for Grok Build |
| `hero.ctaPrimary` | 免费下载 | 免費下載 | Download Free |
| `hero.ctaGithub` | GitHub 开源 | GitHub 開源 | GitHub |
| `pill.models.title` | 多模型支持 | 多模型支援 | Multi-model |
| `pill.models.desc` | Grok 4.6 及更多模型 | Grok 4.6 及更多模型 | Grok 4.6 and more |
| `pill.speed.title` | 快速响应 | 快速回應 | Fast response |
| `pill.speed.desc` | 本机直连 Grok Build | 本機直連 Grok Build | Talks to Grok Build on your machine |
| `pill.privacy.title` | 数据安全 | 資料安全 | Private by default |
| `pill.privacy.desc` | 本地优先，隐私可控 | 本機優先，隱私可控 | Local-first. You're in control. |

主标题里的 `Grok` 可做字重对比，三语都保留该专名。

## value

`value.kicker`：不只是聊天，更是完整的工作台 / 不只是聊天，更是完整的工作臺 / Not just chat. A full workbench.

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `value.chat.title` | 专注对话体验 | 專注對話體驗 | Focused conversations |
| `value.chat.body` | 清晰、精简、沉浸式交互，让你与 Grok 的每一次沟通都高效而专注。 | 清晰、精簡、沉浸式互動，讓你與 Grok 的每一次溝通都高效而專注。 | Clear, quiet, immersive. Every turn with Grok stays fast and on task. |
| `value.project.title` | 项目与知识管理 | 專案與知識管理 | Projects and knowledge |
| `value.project.body` | 将对话、文件、知识有序组织，让信息沉淀为可复用的资产。 | 將對話、檔案、知識有序組織，讓資訊沉澱為可重用的資產。 | Keep chats, files, and notes in order so they become something you can reuse. |
| `value.custom.title` | 高度可定制 | 高度可自訂 | Built to fit you |
| `value.custom.body` | 主题、模型、权限、快捷键…按照你的习惯，打造专属工作方式。 | 主題、模型、權限、快捷鍵…依照你的習慣，打造專屬工作方式。 | Themes, models, permissions, shortcuts — shape the bench around how you work. |

## capabilities

`cap.kicker`：更强大的能力，更自由的生产力 / 更強大的能力，更自由的生產力 / More power. More room to work.

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `cap.projects.title` | 多项目工作台 | 多專案工作臺 | Multi-project bench |
| `cap.projects.body` | 为不同目标创建独立项目，上下文、文件与会话隔离管理。 | 為不同目標建立獨立專案，上下文、檔案與會話隔離管理。 | Separate projects for separate goals. Context, files, and sessions stay isolated. |
| `cap.sessions.title` | 多会话并行 | 多會話並行 | Parallel sessions |
| `cap.sessions.body` | 同时与多个会话对话，高效处理复杂任务与多线思考。 | 同時與多個會話對話，高效處理複雜任務與多線思考。 | Talk to more than one session at once. Heavy work does not have to wait. |
| `cap.skins.title` | 丰富皮肤配置 | 豐富外觀設定 | Skins and appearance |
| `cap.skins.body` | 多种内置主题与细节选项，让工作台更贴合你的审美与场景。 | 多種內建主題與細節選項，讓工作臺更貼合你的審美與場景。 | Built-in themes and fine controls so the bench matches the room you work in. |
| `cap.media.title` | 文件与媒体预览 | 檔案與媒體預覽 | Files and media |
| `cap.media.body` | 支持多种文件类型预览，图文、代码、文档一目了然。 | 支援多種檔案類型預覽，圖文、程式碼、文件一目了然。 | Preview images, video, code, and documents without leaving the session. |
| `cap.perms.title` | 灵活权限模式 | 彈性權限模式 | Permission modes |
| `cap.perms.body` | 细粒度权限与审批流程，保障协作与信息安全。 | 細粒度權限與審批流程，保障協作與資訊安全。 | Fine-grained allow / ask / deny so tools stay under review. |
| `cap.auto.title` | 自动化任务 | 自動化任務 | Automations |
| `cap.auto.body` | 通过计划和触发器自动执行任务，让重复工作交给 Grok。 | 透過計畫和觸發器自動執行任務，讓重複工作交給 Grok。 | Plans and triggers take the repetitive work so Grok can run it. |

## skins

`skins.kicker`：换一种主题，工作台也换一种状态 / 換一種主題，工作臺也換一種狀態 / Change the theme. Change the room.

## opensource

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `oss.title` | 开源、透明，持续进化 | 開源、透明，持續進化 | Open, visible, still moving |
| `oss.body` | Grok App 基于开源协议构建，代码公开、社区共建、持续迭代。你的反馈与贡献，让它变得更好。 | Grok App 基於開源授權建構，程式碼公開、社群共建、持續迭代。你的回饋與貢獻，讓它變得更好。 | Grok App is MIT-licensed. The code is public, the community ships with it, and your reports make the next cut better. |
| `oss.cta` | 前往 GitHub | 前往 GitHub | Open GitHub |
| `oss.more` | 认识项目与贡献者 | 認識專案與貢獻者 | Meet the project and contributors |
| `oss.page.title` | 开源 · Grok App | 開源 · Grok App | Open Source · Grok App |
| `oss.page.desc` | Grok App 开源仓库、作者铁柱 AGI，以及提过 PR 的贡献者。 | Grok App 開源倉庫、作者鐵柱 AGI，以及提過 PR 的貢獻者。 | The Grok App repo, author 铁柱 AGI, and people who shipped PRs. |
| `oss.hero.kicker` | 开源 | 開源 | Open source |
| `oss.hero.title` | 代码公开，一起把它做下去 | 程式碼公開，一起把它做下去 | The code is public. Come build with it. |
| `oss.hero.body` | Grok App 是 MIT 协议的开源桌面工作台。把本机 Grok Build CLI 收成多项目、多会话、带权限与媒体预览的工作台。欢迎提 issue、开 PR、一起修。 | Grok App 是 MIT 授權的開源桌面工作臺。把本機 Grok Build CLI 收成多專案、多會話、帶權限與媒體預覽的工作臺。歡迎提 issue、開 PR、一起修。 | Grok App is an MIT-licensed desktop workbench. It turns the local Grok Build CLI into projects, sessions, permissions, and media preview. File issues. Open PRs. Stay. |
| `oss.repo.cta` | 打开 GitHub 仓库 | 打開 GitHub 倉庫 | Open the GitHub repo |
| `oss.author.kicker` | 作者 | 作者 | Author |
| `oss.author.name` | 铁柱 AGI | 鐵柱 AGI | 铁柱 AGI |
| `oss.author.role` | Grok App 作者 · 万象 AI 实验室技术支持 | Grok App 作者 · 萬象 AI 實驗室技術支援 | Grok App · Wanxiang AI Lab |
| `oss.author.bio` | AI Agent 实战派。用 n8n、Agent 和 AIGC 搭能跑的自动化系统，分享真实落地、踩坑和能抄的作业。Grok App 不是 xAI 官方产品。 | AI Agent 實戰派。用 n8n、Agent 和 AIGC 搭能跑的自動化系統，分享真實落地、踩坑和能抄的作業。Grok App 並非 xAI 官方產品。 | Hands-on Agent work. n8n, agents, and AIGC systems that actually run — plus the mistakes. Grok App is not an official xAI product. |
| `oss.author.x` | 关注 X @cgnot996 | 關注 X @cgnot996 | Follow @cgnot996 on X |
| `oss.author.wechat` | 公众号「铁柱AGI」 | 公眾號「鐵柱AGI」 | WeChat 铁柱AGI |
| `oss.author.wechatFriend` | 添加微信好友 | 加入微信好友 | Add on WeChat |
| `oss.qr.close` | 关闭 | 關閉 | Close |
| `oss.qr.mp.title` | 关注公众号「铁柱AGI」 | 關注公眾號「鐵柱AGI」 | Follow 铁柱AGI |
| `oss.qr.mp.alt` | 微信搜一搜 铁柱AGI | 微信搜一搜 鐵柱AGI | WeChat Search 铁柱AGI |
| `oss.qr.friend.title` | 添加微信好友 | 加入微信好友 | Add me on WeChat |
| `oss.qr.friend.alt` | 微信好友二维码 | 微信好友二維碼 | WeChat friend QR |
| `oss.wall.kicker` | 贡献者 | 貢獻者 | Contributors |
| `oss.wall.title` | 提过 PR 的同学 | 提過 PR 的同學 | People who opened PRs |
| `oss.wall.body` | 资料来自仓库 Issues 投稿。点卡片打开他们留下的主页。 | 資料來自倉庫 Issues 投稿。點卡片打開他們留下的主頁。 | Collected from GitHub Issues. Tap a card to open the homepage they left. |

## download

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `dl.title` | 准备好，让 Grok 开始工作了吗？ | 準備好，讓 Grok 開始工作了嗎？ | Ready to put Grok to work? |
| `dl.subtitle` | 选择适合你的平台，免费下载并立即体验。 | 選擇適合你的平台，免費下載並立即體驗。 | Pick your platform, download free, and start. |
| `dl.mac.title` | 下载 macOS | 下載 macOS | Download macOS |
| `dl.mac.sub` | Apple Silicon / Intel | Apple Silicon / Intel | Apple Silicon / Intel |
| `dl.win.title` | 下载 Windows | 下載 Windows | Download Windows |
| `dl.win.sub` | Windows 10/11 (64-bit) | Windows 10/11 (64-bit) | Windows 10/11 (64-bit) |
| `dl.linux.title` | 下载 Linux | 下載 Linux | Download Linux |
| `dl.linux.sub` | AppImage / DEB / RPM | AppImage / DEB / RPM | AppImage / DEB / RPM |
| `dl.macArm` | Apple Silicon | Apple Silicon | Apple Silicon |
| `dl.macIntel` | Intel | Intel | Intel |
| `dl.winSetup` | 安装版 | 安裝版 | Installer |
| `dl.winPortable` | 绿色版 | 免安裝版 | Portable |
| `dl.linuxAppImage` | AppImage（通用 / Arch） | AppImage（通用 / Arch） | AppImage (generic / Arch) |
| `dl.linuxDeb` | Debian / Ubuntu | Debian / Ubuntu | Debian / Ubuntu |
| `dl.linuxRpm` | Fedora / RHEL | Fedora / RHEL | Fedora / RHEL |
| `dl.allReleases` | 所有版本（GitHub Releases） | 所有版本（GitHub Releases） | All releases on GitHub |
| `dl.version` | 当前版本 {tag} | 目前版本 {tag} | Current version {tag} |
| `dl.versionFallback` | 见 GitHub Releases | 見 GitHub Releases | See GitHub Releases |

## footer

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `footer.copy` | © 2026 Grok App · 开源协议：MIT | © 2026 Grok App · 開源授權：MIT | © 2026 Grok App · MIT License |
| `footer.privacy` | 隐私政策 | 隱私權政策 | Privacy |
| `footer.terms` | 使用条款 | 使用條款 | Terms |
| `footer.docs` | 文档 | 文件 | Docs |
| `footer.changelog` | 更新日志 | 更新紀錄 | Changelog |

页脚链接目标见 [design.md](./design.md)。隐私 / 条款页尚未实现时可先链产品仓 README / SECURITY，并在 status 标明。
