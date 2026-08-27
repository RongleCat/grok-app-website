import { catalogs } from "./i18n/catalog";
import { htmlLang, isLocale, t, type Locale } from "./i18n/index";
import { GITHUB_REPO } from "./downloads";
import baked from "./generated/stars-meta.json";

/**
 * 2026-08-27 · add · GitHub 按钮 star 数
 * Timestamp: 2026-08-27
 * Change type: add
 * What: 缩写 / 精确格式化 / 构建回退 + 运行时刷新 + 本地缓存
 * Why: 按钮默认显示 1.1k，悬停/聚焦给精确数；失败不造假数
 * Params & return: bindGithubStars(locale) 无返回；纯函数返回字符串或 null
 * Impact scope: 首页 Hero 与 /opensource/ 的 data-github-stars 按钮
 * Risk: 未认证 GitHub API 每 IP 约 60 次/小时；靠 1 小时 localStorage 节流
 */

export const STARS_API_URL = `https://api.github.com/repos/${GITHUB_REPO}`;
export const STARS_STORAGE_KEY = "grok-app-site.stars";
export const STARS_TTL_MS = 60 * 60 * 1000;

export type StarsCache = {
  count: number;
  fetchedAt: number;
};

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

export function readStarsCache(
  storage: Pick<Storage, "getItem"> | null = defaultStorage(),
): StarsCache | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(STARS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StarsCache>;
    const count = parseStarCount(parsed.count);
    if (count === null || typeof parsed.fetchedAt !== "number" || !Number.isFinite(parsed.fetchedAt)) {
      return null;
    }
    return { count, fetchedAt: parsed.fetchedAt };
  } catch {
    return null;
  }
}

export function writeStarsCache(
  count: number,
  fetchedAt: number = Date.now(),
  storage: Pick<Storage, "setItem"> | null = defaultStorage(),
): void {
  const n = parseStarCount(count);
  if (n === null || !storage) return;
  try {
    storage.setItem(STARS_STORAGE_KEY, JSON.stringify({ count: n, fetchedAt }));
  } catch {
    /* 隐私模式或配额满 */
  }
}

export function cacheIsFresh(cache: StarsCache, now: number = Date.now()): boolean {
  return now - cache.fetchedAt < STARS_TTL_MS;
}

function defaultStorage(): Storage | null {
  try {
    if (typeof localStorage === "undefined") return null;
    return localStorage;
  } catch {
    return null;
  }
}

export function initialStarCount(
  storage: Pick<Storage, "getItem"> | null = defaultStorage(),
): number | null {
  return readStarsCache(storage)?.count ?? bakedStarCount();
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
  storage: (Pick<Storage, "getItem" | "setItem">) | null = defaultStorage(),
  now: number = Date.now(),
): Promise<number | null> {
  const cached = readStarsCache(storage);
  if (cached) {
    paintGithubStars(cached.count, locale);
    if (cacheIsFresh(cached, now)) return cached.count;
  }

  const live = await fetchStarCount(fetchFn);
  if (live === null) return paintedCount;
  writeStarsCache(live, now, storage);
  /* 请求返回后读 data-locale，避免刷新完成时用户已切语言 */
  paintGithubStars(live, localeAfterAsync(locale));
  return live;
}

export function bindGithubStars(locale: Locale): void {
  paintGithubStars(initialStarCount(), locale);
  void refreshGithubStars(locale);
}
