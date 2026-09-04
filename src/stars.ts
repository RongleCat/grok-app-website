import { catalogs } from "./i18n/catalog";
import { htmlLang, isLocale, t, type Locale } from "./i18n/index";
import baked from "./generated/stars-meta.json";

/**
 * 2026-09-04 · fix · 同源 /api/stars 用 cache:no-store，失败仍保留构建回退
 * Timestamp: 2026-09-04
 * Change type: fix
 * What: 首屏画 stars-meta.json；refresh 只打相对路径 /api/stars 且 cache:"no-store"；失败不 paint(null)
 * Why: 浏览器 HTTP 缓存会把旧 90s 响应冻住；边缘刷新失败时必须留下已画数字
 * Params & return: fetchStarCount 读 { count }；失败返回 null 但 paintedCount 不变
 * Impact scope: 首页 Hero 与 /opensource/ 的 data-github-stars 按钮
 * Risk: 本地 vite preview 没有 Function，live 失败时留下构建回退，无已知风险
 */

export const STARS_API_URL = "/api/stars";

let paintedCount: number | null = null;

export function parseStarCount(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
  return Math.floor(value);
}

/** 同源 Function 契约：{ count: <integer> } */
export function readLiveStarCount(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  return parseStarCount((payload as { count?: unknown }).count);
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

export function paintedStarCount(): number | null {
  return paintedCount;
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
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return readLiveStarCount(await res.json());
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
  /* 失败保留已画数字（通常是构建回退），不再 paint(null) 把按钮掏空 */
  if (live === null) return null;
  paintGithubStars(live, nextLocale);
  return live;
}

export function bindGithubStars(locale: Locale): void {
  paintGithubStars(bakedStarCount(), locale);
  void refreshGithubStars(locale);
}
