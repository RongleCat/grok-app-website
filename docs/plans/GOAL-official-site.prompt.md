# 启动 Goal 模式的提示词

把下面「编排器」或「单航道」整段复制给 Agent。不要只丢一句「开始做官网」。

所有 Agent 开工第一件事：读 `AGENTS.md`、`docs/llm-wiki/status.md`、`docs/plans/GOAL-official-site.md`。  
任何操作结束必须回写 Wiki。

---

## A. 编排器（一个人带多个子 Agent 时用这个）

```text
你是 grok-app.com 官网落地的编排器。不要自己实现全部视觉。

必读：
- /Users/ronglecat/Documents/self/website/grok-app-website/AGENTS.md
- docs/llm-wiki/status.md
- docs/llm-wiki/design.md
- docs/llm-wiki/i18n.md
- docs/llm-wiki/content.md
- docs/llm-wiki/downloads.md
- docs/plans/GOAL-official-site.md

执行顺序：
1. 若 L0 不是 done：先只做 L0 骨架（Vite + TS + 原生 CSS + theme/i18n runtime + 空 section）。做完回写 Wiki，标 L0 done。
2. L0 完成后，按 GOAL 文档的文件所有权，并行派出子 Agent 做 L1、L2、L3、L4。每个子 Agent 的提示词用本文件 B 段，填上航道号。同一文件不能两个 Agent 写。
3. L1–L4 都 done 后做集成检查 C1。
4. 再派 L5 做窄屏。C2 过关。
5. 需要上线再派 L6。没有 CLOUDFLARE_API_TOKEN 环境变量就暂停 L6，不要把 token 写入仓库。

约束：完整还原 landing-dark.png；三语；主题换图；禁止 React/Tailwind；禁止安装包进仓。
收工：更新 status.md 航道表和 log.md。
```

---

## B. 单航道执行（并行子 Agent 用这个，改尖括号里的航道）

```text
你只做 grok-app.com 官网的一个航道，不要越权改别人的文件。

仓库：/Users/ronglecat/Documents/self/website/grok-app-website
航道：L1   （改成 L1 / L2 / L3 / L4 / L5 / L6 之一）

开工：
1. 读 AGENTS.md、docs/llm-wiki/status.md、docs/plans/GOAL-official-site.md。
2. 确认该航道是 idle。把它改成 claimed:你的短名，并在 log.md 追加认领。
3. 再读该航道需要的 wiki 页：
   - L1 design.md + theme.md
   - L2 design.md + content.md
   - L3 i18n.md + content.md
   - L4 downloads.md + content.md
   - L5 design.md 窄屏章节
   - L6 deploy.md

实现时遵守 GOAL 文档的文件所有权。只写本航道独占文件。改 index.html 只动自己的挂载点。

验收按 GOAL 文档该航道交付物。跑 pnpm build。桌面航道对照 docs/llm-wiki/assets/landing-dark.png。

收工：航道标 done；回写相关 wiki；status.md + log.md。没回写不算完成。

禁止：React、Tailwind、提交安装包、提交 token、改产品仓、改其它航道 CSS。
```

---

## C. 一个人从头干到 C2（没有子 Agent 时）

直接把 `docs/plans/GOAL-official-site.goal.txt` 全文贴进支持 `/goal` 的客户端。  
或复制：

```text
/goal 在 grok-app-website 仓库落地可预览的 grok-app.com 单页：桌面完整还原 docs/llm-wiki/assets/landing-dark.png，亮暗主题切换时更换工作台截图，简体繁体英文三语按系统语言首屏选择且手动切换写入 localStorage 后刷新保持，并在 1440 1280 1024 768 390 五档自适应且窄屏重排仍然干净，下载按钮指向 GitHub latest/download 稳定文件名。
验证：先读 AGENTS.md 与 docs/llm-wiki 及 docs/plans/GOAL-official-site.md；按航道认领后实现；运行 pnpm build；用浏览器打开本地预览，核对三语、主题换图、五档宽度截图、七个下载 href。
约束：不引入 React 或 Tailwind；不托管或反代安装包；不写密钥进仓；不改产品仓；效果图仅允许语言控件、版权年 2026、速度文案不写 1.2 秒这三处偏差；每次改动回写 Wiki。
边界：只写本仓库站点源码、public、构建脚本、docs/llm-wiki 与 docs/plans；禁止改其它仓库和本机密钥文件。
迭代策略：先完成 L0 骨架再并行 L1 到 L4，然后 L5 窄屏，最后 L6；一次只收一个航道；失败先读 build 与页面再改；同一缺陷两轮不过就补截图对比，禁止整页推倒重来。
完成条件：GOAL-official-site.md 的 C1 与 C2 过关，status.md 已改成现在时，log.md 有本轮条目。
暂停条件：缺 Cloudflare 环境变量时只停部署；缺新效果图或产品决策时停视觉改版；稳定别名 404 时用 GitHub Releases 兜底继续，不要停整站。
```
