import { catalogs } from "./i18n/catalog";
import { htmlLang, isLocale, t, type Locale } from "./i18n/index";
import { GITHUB_REPO } from "./downloads";
import baked from "./generated/stars-meta.json";

/**
 * 2026-08-28 · fix · 每次进页都拉公开 API，去掉 localStorage 缓存
 * Timestamp: 2026-08-28
 * Change type: fix
 * What: 首屏画构建回退；refresh 必发网络请求；失败藏数字
 * Why: 用户要求刷新即更新 star，禁止 1 小时 TTL 短路
 * Params & return: bindGithubStars(locale) 无返回；fetch 失败返回 null
 * Impact scope: 首页 Hero 与 /opensource/ 的 data-github-stars 按钮
 * Risk: 未认证 GitHub API 每 IP 约 60 次/小时；刷新频繁时可能 403，此时藏数字
 */

export const STARS_API_URL = `https://api.github.com/repos/${GITHUB_REPO}`;

let paintedCount: number | null = null;

export function parseStarCount(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
  return Math.floor(value);
}

export function readStargazersCount(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  return parseStarCount((payload as { stargazers_count?: unknown }).stargazers_count);
}

/**
 * 默认可见缩写：不足 1000 原样；否则 k。
 * 十分位四舍五入后若为整数（整千）不带小数，否则一位小数。
 */
export function abbreviateStarCount(count: number): string {
  const n = parseStarCount(count);
  if (n === null) return "";
  if (n < 1000) return String(n);
  const rounded = Math.round(n / 100) / 10;
  if (Number.isInteger(rounded)) return `${rounded}k`;
  return `${rounded.toFixed(1)}k`;
}

export function formatExactStarCount(count: number, locale: Locale): string {
  const n = parseStarCount(count);
  if (n === null) return "";
  return n.toLocaleString(htmlLang(locale));
}

export function bakedStarCount(): number | null {
  return parseStarCount(baked.count);
}

function localeAfterAsync(fallback: Locale): Locale {
  if (typeof document === "undefined") return fallback;
  const raw = document.documentElement.getAttribute("data-locale");
  return isLocale(raw) ? raw : fallback;
}

export async function fetchStarCount(
  fetchFn: typeof fetch = fetch,
): Promise<number | null> {
  try {
    const res = await fetchFn(STARS_API_URL, {
      headers: { Accept: "application/vnd.github+json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return readStargazersCount(await res.json());
  } catch {
    return null;
  }
}

function starIcon(): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("width", "14");
  svg.setAttribute("height", "14");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "currentColor");
  path.setAttribute(
    "d",
    "M8 1.3 9.9 5.2l4.3.4-3.3 2.9.9 4.2L8 10.7 4.2 12.7l.9-4.2L1.8 5.6l4.3-.4L8 1.3Z",
  );
  svg.append(path);
  return svg;
}

function ensureSlot(link: HTMLElement): HTMLElement {
  let slot = link.querySelector<HTMLElement>("[data-github-stars-count]");
  if (!slot) {
    slot = document.createElement("span");
    slot.className = "github-stars";
    slot.setAttribute("data-github-stars-count", "");
    slot.hidden = true;
    link.append(slot);
  }
  return slot;
}

function clearStars(link: HTMLAnchorElement, slot: HTMLElement): void {
  slot.hidden = true;
  slot.replaceChildren();
  link.querySelector("[data-github-stars-tip]")?.remove();
  link.removeAttribute("aria-label");
}

export function paintGithubStars(count: number | null, locale: Locale): void {
  const n = parseStarCount(count);
  const abbrev = n === null ? "" : abbreviateStarCount(n);
  paintedCount = abbrev ? n : null;
  const table = catalogs[locale];
  const exact = paintedCount === null ? "" : formatExactStarCount(paintedCount, locale);
  const starsPhrase = exact ? t(table, "github.stars", { count: exact }) : "";

  if (typeof document === "undefined") return;
  for (const link of document.querySelectorAll<HTMLAnchorElement>("[data-github-stars]")) {
    const slot = ensureSlot(link);
    if (paintedCount === null || !exact) {
      clearStars(link, slot);
      continue;
    }

    let value = slot.querySelector<HTMLElement>("[data-github-stars-value]");
    if (!value) {
      value = document.createElement("span");
      value.setAttribute("data-github-stars-value", "");
    }
    value.textContent = abbrev;

    let tip = link.querySelector<HTMLElement>("[data-github-stars-tip]");
    if (!tip) {
      tip = document.createElement("span");
      tip.className = "github-stars-tip";
      tip.setAttribute("data-github-stars-tip", "");
      tip.setAttribute("role", "tooltip");
      tip.setAttribute("aria-hidden", "true");
    }
    tip.textContent = exact;

    if (!slot.querySelector("svg")) slot.prepend(starIcon());
    if (!value.isConnected) slot.append(value);
    if (!tip.isConnected) link.append(tip);
    slot.hidden = false;

    const label = link.querySelector("[data-i18n]")?.textContent?.trim() ?? "";
    link.setAttribute("aria-label", label ? `${label} · ${starsPhrase}` : starsPhrase);
  }
}

export function syncGithubStars(locale: Locale): void {
  if (paintedCount === null) return;
  paintGithubStars(paintedCount, locale);
}

export async function refreshGithubStars(
  locale: Locale,
  fetchFn: typeof fetch = fetch,
): Promise<number | null> {
  const live = await fetchStarCount(fetchFn);
  const nextLocale = localeAfterAsync(locale);
  /* 失败闭合：请求失败就藏数字，不把构建回退当现网结果留下 */
  if (live === null) {
    paintGithubStars(null, nextLocale);
    return null;
  }
  paintGithubStars(live, nextLocale);
  return live;
}

export function bindGithubStars(locale: Locale): void {
  paintGithubStars(bakedStarCount(), locale);
  void refreshGithubStars(locale);
}
