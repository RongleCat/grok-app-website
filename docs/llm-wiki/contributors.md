# 开源页贡献者墙

资料来自产品仓 Issues 投稿，整理后写入 `src/generated/contributors.json`，头像压进 `public/images/contributors/`。页面 `/opensource/` 的墙从该 JSON 渲染。

## 拉取

```text
gh issue list --repo RongleCat/grok-app --state open --limit 100
# 标题含「贡献者信息」或同期投稿（头像 / 展示名称 / 个人链接）
gh issue view <n> --repo RongleCat/grok-app --json number,title,state,author,body,url
```

不要在浏览器里 fetch GitHub。头像下载后压到约 240×240 JPEG，禁止把远程头像 URL 写进页面。

## 字段

| 字段 | 含义 |
|------|------|
| `id` | 稳定英文/拼音 slug，作文件名 |
| `name` | 投稿展示名称 |
| `avatar` | `/images/contributors/<id-or-login>.jpg` |
| `home` | 投稿留下的主页（优先个人站 / X，否则 GitHub） |
| `issue` | 产品仓 Issue 号 |
| `note` | 短注：已合并 PR 号，或他们留下的主页句柄 |

墙按 Issue 号升序。同一人只留一条。上墙后**关闭**对应 Issue，评论致谢并指向 `https://grok-app.com/opensource/`。产品仓若有人按「资料 Issue 保持打开」再打开，以官网已收录为准，再关回去。

## 当前墙（2026-08-18）

| Issue | 名称 | 主页 | 头像文件 | 备注 |
|------|------|------|----------|------|
| 637 | Yy-702 | https://github.com/Yy-702 | `yy-702.jpg` | PRs #603 #610 #611 #612 |
| 638 | Cenfangyu | https://x.com/cenfangyu17 | `cenfangyu.jpg` | X @cenfangyu17 |
| 639 | yuhao | https://yuhao.uno/ | `yuhao.jpg` | yuhao.uno |
| 640 | paradox | https://1parado.github.io/ | `paradox.jpg` | PRs #180 #129 #120 |
| 642 | falser101 | https://github.com/falser101 | `falser101.jpg` | PR #534 |
| 643 | WuKong | https://github.com/sutongwuyanzu | `sutongwuyanzu.jpg` | PR #648 |
| 649 | zYHao | https://github.com/Sixmin | `sixmin.jpg` | PR #531 |
| 678 | 江知 | https://github.com/oykb58246 | `jiangzhi.jpg` | PRs #668 #669 #672 |

## 禁止

- 把 Issue 正文、过程稿、未采用的投稿写进用户可见页面。
- 把头像二进制提交成超大原图；压到与现有文件同级（约 7–20KB）。
