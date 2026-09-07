#!/usr/bin/env node
/**
 * Build-time fetch of GitHub Release downloads.json.
 * Never called from the browser (no CORS). On 404 / bad JSON,
 * keep the committed fallback so buttons stay on stable latest/download URLs.
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/generated/downloads-meta.json");
const INDEX_HTML = join(ROOT, "index.html");
const SITEMAP = join(ROOT, "public/sitemap.xml");
const VERSION_SITEMAP_LOCS = [
  "https://grok-app.com/",
  "https://grok-app.com/install/",
  "https://grok-app.com/changelog/",
];
const URL =
  "https://github.com/RongleCat/grok-app/releases/latest/download/downloads.json";
const RELEASE_API =
  "https://api.github.com/repos/RongleCat/grok-app/releases/latest";

const FALLBACK = { tag: null, fallback: true };

/**
 * 2026-09-06 · add · downloads.json 404 时改走 latest Release tag
 * Timestamp: 2026-09-06
 * Change type: add
 * What: 清单缺失时读 GitHub latest Release 的 tag_name
 * Why: v0.2.32 资产尚未挂 downloads.json，latest/download 会 404；版本仍须对齐已发布 tag
 * Params & return: 成功返回 { tag, fallback: false }；draft / prerelease / 无 tag 返回 null
 * Impact scope: downloads-meta.json 与首页 JSON-LD softwareVersion
 * Risk: 未校验 installers 形状；按钮仍走写死的稳定 URL
 */
async function tagFromLatestRelease() {
  const res = await fetch(RELEASE_API, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "grok-app.com-downloads",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!data || data.draft || data.prerelease) return null;
  if (typeof data.tag_name !== "string" || !data.tag_name) return null;
  return { tag: data.tag_name, fallback: false };
}

/**
 * 2026-08-31 · add · 构建拉到 tag 后同步首页 JSON-LD softwareVersion
 * Timestamp: 2026-08-31
 * Change type: add
 * What: 把 index.html SoftwareApplication.softwareVersion 写成 downloads.json 的 tag
 * Why: 版本权威是现网 Release 清单，禁止只手改 HTML 而 meta / schema 漂移
 * Params & return: tag 为当前 Release（如 v0.2.29）；无 tag 或 fallback 时不改 HTML
 * Impact scope: 首页 JSON-LD；src/markup.test.ts 会核对 softwareVersion === meta.tag
 * Risk: 只替换已有 "softwareVersion" 字符串；JSON-LD 删掉该字段后本函数不再插入
 */
async function syncSoftwareVersion(tag, fallback) {
  if (fallback || !tag) return;
  const html = await readFile(INDEX_HTML, "utf8");
  // 匹配 JSON-LD 里已有的 "softwareVersion": "vX.Y.Z"
  const next = html.replace(
    /("softwareVersion":\s*")[^"]*(")/,
    `$1${tag}$2`,
  );
  if (next !== html) await writeFile(INDEX_HTML, next);
}

/**
 * 2026-09-07 · add · tag 变化时同步版本相关页 sitemap lastmod
 * Timestamp: 2026-09-07
 * Change type: add
 * What: `/` `/install/` `/changelog/` lastmod 写成当天 UTC
 * Why: 发版 bump 会改这三页正文；原先只手改前两页，测试又锁死 changelog 于 2026-09-02
 * Params & return: tag 与上次 downloads-meta 不同且非 fallback 才写；无返回值
 * Impact scope: public/sitemap.xml
 * Risk: 只替换已有 <loc> 后的 <lastmod>；CI 同 tag 重建不改日期
 */
function setLocLastmod(xml, loc, date) {
  const escaped = loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return xml.replace(
    new RegExp(`(<loc>${escaped}</loc>\\s*<lastmod>)[^<]+(</lastmod>)`),
    `$1${date}$2`,
  );
}

async function syncSitemapLastmod(tag, fallback, prevTag) {
  if (fallback || !tag || tag === prevTag) return;
  const today = new Date().toISOString().slice(0, 10);
  let xml = await readFile(SITEMAP, "utf8");
  for (const loc of VERSION_SITEMAP_LOCS) {
    xml = setLocLastmod(xml, loc, today);
  }
  await writeFile(SITEMAP, xml);
}

function validate(data) {
  if (!data || typeof data !== "object") return null;
  if (data.schemaVersion !== 1) return null;
  const installers = data.installers;
  if (!installers || typeof installers !== "object") return null;
  if (!installers["mac-x64"] || !installers["windows-x64"]) return null;
  const tag =
    typeof data.tag === "string"
      ? data.tag
      : typeof data.version === "string"
        ? `v${data.version}`
        : null;
  return { tag, fallback: false };
}

async function main() {
  await mkdir(dirname(OUT), { recursive: true });
  let next = FALLBACK;
  try {
    const res = await fetch(URL, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const parsed = validate(await res.json());
      if (parsed) next = parsed;
    }
  } catch {
    /* keep fallback */
  }

  if (next.fallback) {
    try {
      const fromRelease = await tagFromLatestRelease();
      if (fromRelease) next = fromRelease;
    } catch {
      /* keep fallback */
    }
  }

  let prevTag = null;
  try {
    const prev = JSON.parse(await readFile(OUT, "utf8"));
    if (prev && typeof prev.tag === "string") prevTag = prev.tag;
    if (next.fallback && prev && prev.tag && prev.fallback === false) next = prev;
  } catch {
    /* first run */
  }

  await writeFile(OUT, `${JSON.stringify(next, null, 2)}\n`);
  await syncSoftwareVersion(next.tag, next.fallback);
  await syncSitemapLastmod(next.tag, next.fallback, prevTag);
  console.log(
    next.fallback
      ? "downloads.json unavailable — using stable URL fallback"
      : `downloads.json tag ${next.tag}`,
  );
}

main();
