# 下载对接（官网消费侧）

本页是 **grok-app.com 怎么链到安装包** 的可执行契约。  
发版、改文件名、生成清单：以产品仓为准：

`/Users/ronglecat/Documents/self/tools/desktop-app/grok-app/docs/llm-wiki/website-downloads.md`

产品仓改了契约，先更新本页，再改站点。

## 1. 结论

| 问题 | 答案 |
|------|------|
| 文件放哪 | `RongleCat/grok-app` 的 GitHub Release，不放本仓 |
| 谁出流量 | GitHub CDN。本仓只托管页面和按钮 |
| 按钮怎么写 | `href` 指向 GitHub；或本站短链 **302** 到 GitHub。禁止反代、禁止把包装进 Pages |
| 怎么永远最新 | 稳定文件名 + `/releases/latest/download/…` |
| 版本号从哪来 | 构建时拉 `downloads.json`，不要浏览器现拉（CORS） |
| 现网（2026-09-02 核对） | 构建已拉到 `downloads.json` tag `v0.2.30`（产品仓正式 Release，2026-09-01）。若下次 404，按钮仍走写死的稳定 URL |

不要链到：

- `grok-desktop-latest`（应用内更新：`.app.tar.gz` / `latest.json`）
- `*.sig`、把 `SHA256SUMS` 当「下载 App」
- `latest.json`（Tauri updater，不是给人点的）

## 2. 稳定 URL

仓库：`RongleCat/grok-app`  
前缀：`https://github.com/RongleCat/grok-app/releases/latest/download/`

| 官网入口 | `installers` 键 | 稳定文件名 |
|----------|-----------------|------------|
| macOS Apple Silicon | `mac-aarch64` | `Grok_mac_aarch64.dmg` |
| macOS Intel | `mac-x64` | `Grok_mac_x64.dmg` |
| Windows 安装版（主按钮） | `windows-x64` | `Grok_windows_x64-setup.exe` |
| Windows 绿色版 | `windows-x64-portable` | `Grok_windows_x64-portable.zip` |
| Linux 通用 | `linux-x64-appimage` | `Grok_linux_x64.AppImage` |
| Debian 系 | `linux-x64-deb` | `Grok_linux_x64.deb` |
| Fedora / RHEL 系 | `linux-x64-rpm` | `Grok_linux_x64.rpm` |
| 机器清单 | — | `downloads.json` |

发版硬性：`mac-x64` 与 `windows-x64` 缺失则产品仓 checksums job 失败。四端 CI 全绿时上表 7 个包都会在。

### 给谁用

| 键 | 给谁 | 不要写成 |
|----|------|----------|
| `mac-aarch64` | M1–M4 Mac | 「Mac 通用」 |
| `mac-x64` | Intel Mac | 默认主按钮（现在大多数人是 ARM） |
| `windows-x64` | Win10/11 x64 安装 | 「Windows ARM」 |
| `windows-x64-portable` | 免安装 zip | 主下载 |
| `linux-x64-appimage` | 任意桌面发行版；Arch 走这条 | 某个发行版专包 |
| `linux-x64-deb` | Ubuntu / Debian / Mint / Pop!_OS | Fedora |
| `linux-x64-rpm` | Fedora / RHEL / openSUSE | Ubuntu |

没有：macOS universal、Windows ARM、Linux aarch64、AUR、Flatpak、Snap。

按钮必须用稳定名。版本化名（如 `Grok_0.2.19_x64.dmg`）会随 tag 变，写死会 404。

## 3. `downloads.json`

稳定地址（下一枚正式 tag 之后才保证存在）：

```text
https://github.com/RongleCat/grok-app/releases/latest/download/downloads.json
```

构建时：

```bash
curl -fsSL -L -o downloads.json \
  https://github.com/RongleCat/grok-app/releases/latest/download/downloads.json
```

`-L` 必须开。然后：

1. 校验 `schemaVersion === 1`，不认识的主版本拒绝静默猜测
2. 至少存在 `installers["mac-x64"]` 与 `installers["windows-x64"]`
3. 按钮 `href = installers[id].url`
4. 旁注版本：`tag` 或 `v` + `version`
5. 可选展示 `size`、`sha256`、`releaseUrl`

构建失败（404 / JSON 坏）：**不要发布空按钮**。保留上一份成功清单，或回退到第 2 节写死的稳定 URL，版本号写「见 GitHub Releases」。

字段形状以产品仓 `website-downloads.md` §4 为准。`label` 是英文短标签，UI 用 [content.md](./content.md) 做中文。

## 4. 探测系统（建议）

| 探测 | 默认键 |
|------|--------|
| macOS + ARM | `mac-aarch64` |
| macOS + Intel / 无法判断架构 | 主 CTA 宁可 ARM，并提供 Intel 次按钮 |
| Windows | `windows-x64` |
| Linux | `linux-x64-appimage`，旁边给 deb / rpm |

无法判断时列出 Mac ARM / Mac Intel / Windows / Linux，不要只剩一个按钮。

## 5. 短链（可选，尚未实现）

| 短路径 | 302 到 |
|--------|--------|
| `/download/mac` | `mac-aarch64` |
| `/download/mac-intel` | `mac-x64` |
| `/download/mac-arm` | `mac-aarch64` |
| `/download/windows` | `windows-x64` |
| `/download/windows-portable` | `windows-x64-portable` |
| `/download/linux` | `linux-x64-appimage` |
| `/download/linux-deb` | `linux-x64-deb` |
| `/download/linux-rpm` | `linux-x64-rpm` |

必须 HTTP 302/307，响应里不要出现安装包字节。Cloudflare 橙色云不要反代这些路径去拉 GitHub 大文件。

兜底链接始终保留：

```text
https://github.com/RongleCat/grok-app/releases
```

## 6. 禁止

1. 把安装包提交进本仓。
2. Pages / CF 代理下载安装包。
3. 按钮指向 `…/releases/download/grok-desktop-latest/…`。
4. 按钮指向 `*.app.tar.gz`、`*.sig`、`latest.json`。
5. 浏览器依赖 GitHub CORS。
6. 把某个历史版本号写进按钮路径。
7. 把 Linux 三种格式说成三个发行版官方源。

实现：`src/downloads.ts` 写死七个稳定 URL；`scripts/fetch-downloads.mjs` 构建时拉清单，写入 `src/generated/downloads-meta.json`（下载区 / 安装页 `data-version` 旁注），并同步首页 JSON-LD `softwareVersion`。按钮 `href` 不依赖 JSON 是否存在。

## 7. 验收（上线前）

- [x] 七个安装入口都直达 GitHub `latest/download` 稳定名，不是本站吐文件流
- [x] Mac 两个架构都在，默认不明显导向 Intel
- [x] Windows 主按钮是 setup.exe，绿色版是次入口
- [x] Linux 能看到 AppImage + deb + rpm
- [x] 若构建时拉了清单，页面版本号与 `downloads.json` 的 `tag` 一致（本机构建见 `v0.2.30`）
- [x] 国内访问失败时仍有 GitHub Releases 兜底
- [x] 没有链到 `grok-desktop-latest`
