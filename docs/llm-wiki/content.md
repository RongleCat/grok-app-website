# 站点文案（zh / zh-TW / en）

改文案先改本页，再改 `src/i18n/*`。三列必须同时改。  
语言解析见 [i18n.md](./i18n.md)。SEO 与别名见 [seo.md](./seo.md)。

品牌专名不译：`Grok`、`Grok App`、`Grok Build`、`SuperGrok`。

## 语气（作者铁柱 AGI · 2026-08-22）

短称：**开源 Grok App** / **open-source Grok App**。标题保持短，不要把长定语叠进 title / description。

站点**不要写**「非官方 / unofficial / 不是 xAI 官方产品」。需要定位时，只写它是本机 Grok Build CLI 的桌面工作台 / GUI。  
不要把产品改名为 Grok Desktop；Grok Desktop / Grok GUI / 客户端 只轻量出现在 meta、FAQ、`llms.txt`。  
不要自称唯一客户端；写明是社区工作台之一（`RongleCat/grok-app`）。  
不要抢纯「Grok 下载」网页聊天 / PWA 意图：面向 Grok Build CLI（编码 Agent），不是 grok.com 套壳。

速度胶囊效果图写「平均响应 1.2s」，无公开基准。**三语都不要写死 1.2s**，用本表 `pill.speed.desc`。

版权年用 **2026**，不要照抄效果图 2024。

「成员隔离」是效果图原文；产品是本机多项目。三语按本表（会话隔离），不要写成团队 SaaS。

## meta

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `meta.title` | 开源 Grok App · 桌面工作台 | 開源 Grok App · 桌面工作臺 | Open-source Grok App · desktop workbench |
| `meta.description` | 本机 Grok Build CLI 的桌面 GUI。多项目、多会话、权限与媒体预览。 | 本機 Grok Build CLI 的桌面 GUI。多專案、多會話、權限與媒體預覽。 | A desktop GUI for the local Grok Build CLI. Projects, sessions, permissions, and media preview. |
| `meta.keywords` | Grok App, Grok Desktop, Grok GUI, Grok Build GUI, Grok Build desktop, Grok 桌面客户端 | （同 zh） | （同 zh） |
| `brand.definition` | 开源 Grok App 是本机 Grok Build CLI 的桌面工作台。 | 開源 Grok App 是本機 Grok Build CLI 的桌面工作臺。 | Open-source Grok App is a desktop workbench for the local Grok Build CLI. |

## header

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `nav.product` | 产品 | 產品 | Product |
| `nav.features` | 功能 | 功能 | Features |
| `nav.download` | 下载 | 下載 | Download |
| `nav.opensource` | 开源 | 開源 | Open Source |
| `nav.themes` | 皮肤 | 主題 | Themes |
| `nav.faq` | 问答 | 問答 | FAQ |
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
| `hero.subtitle` | 为 Grok Build CLI 打造的开源桌面 GUI | 為 Grok Build CLI 打造的開源桌面 GUI | An open-source desktop GUI for the Grok Build CLI |
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

社区画廊在本站 `/skins/`。顶栏、页脚用 `nav.themes`。桌面 Apply 发 `grok://skin/import?url=`；手机 / 窄屏 toast `gallery.applyMobile`，不发深链。契约见 [skins.md](./skins.md)。

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `skins.note` | 社区外观包，给桌面端用。在画廊里点 Apply 会打开本机预览。 | 社群外觀包，給桌面端用。在畫廊裡點 Apply 會打開本機預覽。 | Community appearance packs for the desktop app. Apply opens a local preview. |
| `skins.cta` | 浏览社区皮肤 | 瀏覽社群主題 | Browse community themes |

## gallery（`/skins/`）

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `gallery.page.title` | 皮肤 · 开源 Grok App | 皮膚 · 開源 Grok App | Skins · Open-source Grok App |
| `gallery.page.desc` | 社区外观包。先看见工作台上的样子，再套用到开源 Grok App。 | 社群外觀包。先看見工作臺上的樣子，再套用到開源 Grok App。 | Community appearance packs. See them on the workbench, then apply in Open-source Grok App. |
| `gallery.kicker` | 皮肤仓库 | 皮膚倉庫 | Skin catalog |
| `gallery.hero.title` | 先看见工作台上的样子 | 先看見工作臺上的樣子 | See the workbench wearing the skin |
| `gallery.hero.body` | 每张卡片是 16:9 主题预览：壁纸铺满，上面叠一层开源 Grok App 的侧栏和对话。点应用只打开确认，不会改你现在的样子。 | 每張卡片是 16:9 主題預覽：壁紙鋪滿，上面疊一層開源 Grok App 的側欄和對話。點套用只打開確認，不會改你現在的樣子。 | Each card is a 16:9 theme preview: wallpaper fills the frame, with a translucent Open-source Grok App chrome on top. Apply opens a confirm dialog. It does not change your current look. |
| `gallery.copy` | 复制目录地址 | 複製目錄地址 | Copy catalog URL |
| `gallery.submit` | 提交一套 | 提交一套 | Submit a pack |
| `gallery.apply` | 应用 | 套用 | Apply |
| `gallery.applyMobile` | 暂不支持手机端，请在电脑端尝试应用皮肤。 | 暫不支援手機端，請在電腦端嘗試套用皮膚。 | Mobile isn’t supported yet — try applying the skin on desktop. |
| `gallery.download` | 下载 | 下載 | Download |
| `gallery.loading` | 正在读取皮肤目录… | 正在讀取皮膚目錄… | Loading the skin catalog… |

## opensource

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `oss.title` | 开源、透明，持续进化 | 開源、透明，持續進化 | Open, visible, still moving |
| `oss.body` | 开源 Grok App 是给本机 Grok Build CLI 用的桌面 GUI。代码公开、社区共建。你的反馈与贡献，让它变得更好。 | 開源 Grok App 是給本機 Grok Build CLI 用的桌面 GUI。程式碼公開、社群共建。你的回饋與貢獻，讓它變得更好。 | Open-source Grok App is a desktop GUI for the local Grok Build CLI. The code is public; your reports make the next cut better. |
| `oss.cta` | 前往 GitHub | 前往 GitHub | Open GitHub |
| `oss.more` | 认识项目与贡献者 | 認識專案與貢獻者 | Meet the project and contributors |
| `oss.page.title` | 开源 · Grok App | 開源 · Grok App | Open Source · Grok App |
| `oss.page.desc` | 开源 Grok App 仓库、作者铁柱 AGI，以及提过 PR 的贡献者。 | 開源 Grok App 倉庫、作者鐵柱 AGI，以及提過 PR 的貢獻者。 | The open-source Grok App repo, author 铁柱 AGI, and people who shipped PRs. |
| `oss.hero.kicker` | 开源 | 開源 | Open source |
| `oss.hero.title` | 代码公开，一起把它做下去 | 程式碼公開，一起把它做下去 | The code is public. Come build with it. |
| `oss.hero.body` | 开源 Grok App 是 MIT 协议的桌面 GUI。把本机 Grok Build CLI 收成多项目、多会话、带权限与媒体预览的工作台。欢迎提 issue、开 PR。 | 開源 Grok App 是 MIT 授權的桌面 GUI。把本機 Grok Build CLI 收成多專案、多會話、帶權限與媒體預覽的工作臺。歡迎提 issue、開 PR。 | Open-source Grok App is an MIT-licensed desktop GUI. It turns the local Grok Build CLI into projects, sessions, permissions, and media preview. File issues. Open PRs. |
| `oss.repo.cta` | 打开 GitHub 仓库 | 打開 GitHub 倉庫 | Open the GitHub repo |
| `oss.author.kicker` | 作者 | 作者 | Author |
| `oss.author.name` | 铁柱 AGI | 鐵柱 AGI | 铁柱 AGI |
| `oss.author.role` | Grok App 作者 · 万象 AI 实验室技术支持 | Grok App 作者 · 萬象 AI 實驗室技術支援 | Grok App · Wanxiang AI Lab |
| `oss.author.bio` | AI Agent 实战派。用 n8n、Agent 和 AIGC 搭能跑的自动化系统，分享真实落地、踩坑和能抄的作业。 | AI Agent 實戰派。用 n8n、Agent 和 AIGC 搭能跑的自動化系統，分享真實落地、踩坑和能抄的作業。 | Hands-on Agent work. n8n, agents, and AIGC systems that actually run — plus the mistakes. |
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

## faq

`/faq/` 静态页。JSON-LD `FAQPage` 用简体默认句，与 HTML 首屏一致。搜索别名放在问答正文，不要叠进 title。

| key | zh | zh-TW | en |
|-----|----|-------|-----|
| `faq.page.title` | 常见问题 · 开源 Grok App | 常見問題 · 開源 Grok App | FAQ · Open-source Grok App |
| `faq.page.desc` | 开源 Grok App 的下载、安装与常见问题。也有人搜 Grok Desktop、Grok GUI。 | 開源 Grok App 的下載、安裝與常見問題。也有人搜 Grok Desktop、Grok GUI。 | Downloads, install, and what Grok App is. People also search Grok Desktop and Grok GUI. |
| `faq.hero.kicker` | 常见问题 | 常見問題 | FAQ |
| `faq.hero.title` | 下载、安装与定位 | 下載、安裝與定位 | Download, install, and what this is |
| `faq.hero.body` | 开源 Grok App 是本机 Grok Build CLI 的桌面 GUI。下面是下载、安装和常见搜索。 | 開源 Grok App 是本機 Grok Build CLI 的桌面 GUI。下面是下載、安裝和常見搜尋。 | Open-source Grok App is a desktop GUI for the local Grok Build CLI. Downloads, install, and common searches. |
| `faq.q1` | Grok App 支持哪些系统？ | Grok App 支援哪些系統？ | Which platforms does Grok App support? |
| `faq.a1` | 提供 macOS（Apple Silicon / Intel）、Windows 10/11（64 位）和 Linux（AppImage / DEB / RPM）安装包。在首页下载区选择对应平台，或到 GitHub Releases 取包。 | 提供 macOS（Apple Silicon / Intel）、Windows 10/11（64 位元）和 Linux（AppImage / DEB / RPM）安裝包。在首頁下載區選擇對應平台，或到 GitHub Releases 取包。 | Installers are available for macOS (Apple Silicon / Intel), Windows 10/11 (64-bit), and Linux (AppImage / DEB / RPM). Pick your platform on the homepage download section, or get the files from GitHub Releases. |
| `faq.q2` | macOS 提示无法打开或来自身份不明的开发者怎么办？ | macOS 提示無法打開或來自身分不明的開發者怎麼辦？ | macOS says the app can’t be opened or is from an unidentified developer. What now? |
| `faq.a2` | 这是 macOS Gatekeeper 对非 App Store 应用的常见拦截。可在「系统设置 → 隐私与安全性」里允许打开，或按住 Control 点按应用图标后选择「打开」。只从 GitHub Releases 获取安装包。 | 這是 macOS Gatekeeper 對非 App Store 應用的常見攔截。可在「系統設定 → 隱私權與安全性」裡允許打開，或按住 Control 點按應用圖示後選擇「打開」。只從 GitHub Releases 取得安裝包。 | That is a common Gatekeeper prompt for apps outside the App Store. Allow it in System Settings → Privacy & Security, or Control-click the app icon and choose Open. Only download installers from GitHub Releases. |
| `faq.q3` | 需要先安装本机 Grok Build CLI 吗？ | 需要先安裝本機 Grok Build CLI 嗎？ | Do I need the local Grok Build CLI? |
| `faq.a3` | 需要。Grok App 是给本机 Grok Build CLI 用的桌面 GUI，不会替代 CLI 本身。请先在本机装好 Grok Build，再使用本应用。 | 需要。Grok App 是給本機 Grok Build CLI 用的桌面 GUI，不會替代 CLI 本身。請先在本機裝好 Grok Build，再使用本應用。 | Yes. Grok App is a desktop GUI for the local Grok Build CLI. It does not replace the CLI. Install Grok Build on your machine first, then use the app. |
| `faq.q4` | 在找 Grok Desktop 或 Grok GUI？ | 在找 Grok Desktop 或 Grok GUI？ | Looking for Grok Desktop or Grok GUI? |
| `faq.a4` | 产品名是 Grok App。它是社区开源的桌面工作台，给本机 Grok Build CLI 用的 GUI / 客户端。搜索 Grok Desktop、Grok Build Desktop、Grok CLI GUI、Grok 桌面、Grok 客户端的人，通常是在找这个。我们是其中一种社区工作台，仓库 RongleCat/grok-app。 | 產品名是 Grok App。它是社群開源的桌面工作臺，給本機 Grok Build CLI 用的 GUI / 客戶端。搜尋 Grok Desktop、Grok Build Desktop、Grok CLI GUI、Grok 桌面、Grok 客戶端的人，通常是在找這個。我們是其中一種社群工作臺，倉庫 RongleCat/grok-app。 | The product name is Grok App. It is a community open-source desktop workbench — a GUI / desktop client for the local Grok Build CLI. People also search for Grok Desktop, Grok Build Desktop, Grok CLI GUI, or GUI for Grok Build. We are one community workbench: RongleCat/grok-app. |
| `faq.q5` | 安装包在哪里下载？ | 安裝包在哪裡下載？ | Where do I download the installers? |
| `faq.a5` | 安装包只托管在 GitHub Releases。官网按钮指向这些发布资产，本站不托管、也不反代安装包文件。 | 安裝包只託管在 GitHub Releases。官網按鈕指向這些發布資產，本站不託管、也不反代安裝包檔案。 | Installers live only on GitHub Releases. The website buttons point at those release assets. This site does not host or proxy installer files. |
| `faq.q6` | 源码和开源协议是什么？ | 源碼和開源授權是什麼？ | Where is the source, and what is the license? |
| `faq.a6` | 源码在 GitHub 仓库 RongleCat/grok-app，协议为 MIT。欢迎提 issue 与 PR。作者铁柱 AGI 的 X 是 @cgnot996。 | 源碼在 GitHub 倉庫 RongleCat/grok-app，授權為 MIT。歡迎提 issue 與 PR。作者鐵柱 AGI 的 X 是 @cgnot996。 | The source is the RongleCat/grok-app repository on GitHub, licensed MIT. Issues and PRs are welcome. The author 铁柱 AGI is @cgnot996 on X. |
| `faq.q7` | 这是 Grok Build CLI 的图形界面吗？ | 這是 Grok Build CLI 的圖形介面嗎？ | Is this a GUI for the Grok Build CLI? |
| `faq.a7` | 是。开源 Grok App 把本机 Grok Build CLI 收成桌面 GUI：多项目、多会话、权限与媒体预览，不用一直盯着终端。先在本机装好 Grok Build，再打开本应用。 | 是。開源 Grok App 把本機 Grok Build CLI 收成桌面 GUI：多專案、多會話、權限與媒體預覽，不用一直盯著終端。先在本機裝好 Grok Build，再打開本應用。 | Yes. Open-source Grok App turns the local Grok Build CLI into a desktop GUI: projects, sessions, permissions, and media preview, so you are not stuck in the terminal. Install Grok Build on your machine first. |
| `faq.q8` | 这是 grok.com 网页聊天的套壳吗？ | 這是 grok.com 網頁聊天的套殼嗎？ | Is this a grok.com chat wrapper? |
| `faq.a8` | 不是。Grok App 面向 Grok Build（编码 Agent）的本机 CLI，不是 grok.com 聊天页或 PWA 的包装。网页聊天请去 grok.com。 | 不是。Grok App 面向 Grok Build（編碼 Agent）的本機 CLI，不是 grok.com 聊天頁或 PWA 的包裝。網頁聊天請去 grok.com。 | No. Grok App is for the local Grok Build CLI (the coding agent), not a wrapper around grok.com chat or a PWA. For web chat, go to grok.com. |

站点文案、meta、`llms.txt`、FAQ、schema **禁止**写「官方桌面端」「Grok 桌面版」，也不提其它 Grok 产品名做对比。不要写「非官方 / unofficial」。

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

页脚另有 `nav.faq`（问答）与 `nav.themes`（皮肤 / 主題 / Themes，进 `/skins/`）。链接目标见 [design.md](./design.md)。隐私 / 条款页尚未实现时可先链产品仓 README / SECURITY，并在 status 标明。
