import { catalogs } from "./i18n/catalog";
import { t, type Locale } from "./i18n/index";

export const CATALOG_PRIMARY =
  "https://cdn.jsdelivr.net/gh/RongleCat/grok-app-skin@main/docs/catalog.json";
export const CATALOG_FALLBACK = "https://ronglecat.github.io/grok-app-skin/catalog.json";
export const CATALOG_PUBLIC = CATALOG_FALLBACK;
export const CONTRIBUTE_URL =
  "https://github.com/RongleCat/grok-app-skin/blob/main/CONTRIBUTING.md";

export type SkinFocus = {
  cx: number;
  cy: number;
};

export type SkinPack = {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  descriptionEn?: string;
  author?: string;
  previewUrl: string;
  downloadUrl: string;
  tags?: string[];
  featured?: boolean;
  focus?: SkinFocus;
  scrim?: number;
  hasWallpaper?: boolean;
  skin?: string;
  kind?: string;
  credit?: string;
  creditEn?: string;
  bytes?: number;
  sha256?: string;
};

export type SkinCatalog = {
  schemaVersion: number;
  packs: SkinPack[];
  updatedAt?: number;
  baseUrl?: string;
};

export function applyHref(downloadUrl: string): string {
  return `grok://skin/import?url=${encodeURIComponent(downloadUrl)}`;
}

/** Mobile / coarse-pointer heuristic: do not fire grok:// from phones. */
export const MOBILE_APPLY_QUERY =
  "(max-width: 768px), (hover: none) and (pointer: coarse)";

export function shouldBlockMobileApply(matches: boolean): boolean {
  return matches === true;
}

export function mobileApplyBlocked(
  matchMediaFn?: (query: string) => { matches: boolean },
): boolean {
  const query = matchMediaFn
    ?? (typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? (q: string) => window.matchMedia(q)
      : undefined);
  if (!query) return false;
  try {
    return shouldBlockMobileApply(query(MOBILE_APPLY_QUERY).matches);
  } catch {
    return false;
  }
}

export function wallPosition(pack: Pick<SkinPack, "focus">): string {
  const focus = pack.focus;
  if (focus && Number.isFinite(focus.cx) && Number.isFinite(focus.cy)) {
    return `${Math.round(focus.cx * 1000) / 10}% ${Math.round(focus.cy * 1000) / 10}%`;
  }
  return "50% 40%";
}

/** Pack `scrim` is 0–100. Missing / non-finite values use the App default of 100. */
export const DEFAULT_SCRIM = 100;

export type WallpaperScrim = {
  t: number;
  opacity: number;
  mixSidebar: number;
  mixMain: number;
  mixAside: number;
  sidebarBlurPx: number;
};

/** Maps pack.scrim onto the desktop App wallpaper mix / blur / opacity. */
export function wallpaperFromScrim(scrim?: number | null): WallpaperScrim {
  const n = typeof scrim === "number" && Number.isFinite(scrim) ? scrim : DEFAULT_SCRIM;
  const t = Math.min(100, Math.max(0, n)) / 100;
  return {
    t,
    opacity: t,
    mixSidebar: Math.round(58 * t),
    mixMain: Math.round(70 * t),
    mixAside: Math.round(70 * t),
    sidebarBlurPx: 22 * t,
  };
}

export function wallpaperCssVars(scrim?: number | null): Record<string, string> {
  const w = wallpaperFromScrim(scrim);
  return {
    "--wallpaper-scrim-opacity": String(w.opacity),
    "--wallpaper-mix-sidebar": `${w.mixSidebar}%`,
    "--wallpaper-mix-main": `${w.mixMain}%`,
    "--wallpaper-mix-aside": `${w.mixAside}%`,
    "--wallpaper-sidebar-blur": `${w.sidebarBlurPx}px`,
  };
}

export function applyWallpaperCssVars(
  el: { style: { setProperty(name: string, value: string): void }; dataset: DOMStringMap },
  scrim?: number | null,
): void {
  const w = wallpaperFromScrim(scrim);
  el.dataset.scrim = String(Math.round(w.t * 100));
  for (const [name, value] of Object.entries(wallpaperCssVars(scrim))) {
    el.style.setProperty(name, value);
  }
}

export function packName(pack: SkinPack, locale: Locale): string {
  if (locale === "en") return pack.nameEn || pack.name;
  return pack.name;
}

export function packMatches(pack: SkinPack, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    pack.name,
    pack.nameEn,
    pack.author,
    pack.description,
    pack.descriptionEn,
    pack.skin,
    pack.id,
    ...(pack.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export function parseCatalog(data: unknown): SkinCatalog {
  if (!data || typeof data !== "object") throw new Error("bad catalog");
  const raw = data as {
    schemaVersion?: unknown;
    packs?: unknown;
    updatedAt?: unknown;
    baseUrl?: unknown;
  };
  if (raw.schemaVersion !== 1 || !Array.isArray(raw.packs)) {
    throw new Error("bad catalog");
  }
  const packs: SkinPack[] = [];
  for (const item of raw.packs) {
    const pack = asPack(item);
    if (pack) packs.push(pack);
  }
  return {
    schemaVersion: 1,
    packs,
    updatedAt: typeof raw.updatedAt === "number" ? raw.updatedAt : undefined,
    baseUrl: typeof raw.baseUrl === "string" ? raw.baseUrl : undefined,
  };
}

function asPack(item: unknown): SkinPack | null {
  if (!item || typeof item !== "object") return null;
  const raw = item as Record<string, unknown>;
  if (typeof raw.id !== "string" || !raw.id) return null;
  if (typeof raw.name !== "string" || !raw.name) return null;
  if (typeof raw.previewUrl !== "string" || !raw.previewUrl) return null;
  if (typeof raw.downloadUrl !== "string" || !raw.downloadUrl) return null;
  const focusRaw = raw.focus;
  let focus: SkinFocus | undefined;
  if (focusRaw && typeof focusRaw === "object") {
    const f = focusRaw as { cx?: unknown; cy?: unknown };
    if (typeof f.cx === "number" && typeof f.cy === "number") {
      focus = { cx: f.cx, cy: f.cy };
    }
  }
  return {
    id: raw.id,
    name: raw.name,
    nameEn: str(raw.nameEn),
    description: str(raw.description),
    descriptionEn: str(raw.descriptionEn),
    author: str(raw.author),
    previewUrl: raw.previewUrl,
    downloadUrl: raw.downloadUrl,
    tags: Array.isArray(raw.tags)
      ? raw.tags.filter((tag): tag is string => typeof tag === "string")
      : undefined,
    featured: raw.featured === true,
    focus,
    scrim: typeof raw.scrim === "number" ? raw.scrim : undefined,
    hasWallpaper: raw.hasWallpaper === true,
    skin: str(raw.skin),
    kind: str(raw.kind),
    credit: str(raw.credit),
    creditEn: str(raw.creditEn),
    bytes: typeof raw.bytes === "number" ? raw.bytes : undefined,
    sha256: str(raw.sha256),
  };
}

function str(value: unknown): string | undefined {
  return typeof value === "string" && value ? value : undefined;
}

export async function fetchCatalog(
  load: typeof fetch = fetch,
  urls: readonly string[] = [CATALOG_PRIMARY, CATALOG_FALLBACK],
): Promise<SkinCatalog> {
  let lastError: unknown;
  for (const url of urls) {
    try {
      const res = await load(url, { cache: "no-cache" });
      if (!res.ok) throw new Error(`catalog ${res.status}`);
      return parseCatalog(await res.json());
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("catalog fetch failed");
}

type GalleryState = {
  packs: SkinPack[];
  filter: string;
  status: "loading" | "ready" | "error";
  locale: Locale;
};

const state: GalleryState = {
  packs: [],
  filter: "",
  status: "loading",
  locale: "zh",
};

let toastTimer = 0;

function table(): Record<string, string> {
  return catalogs[state.locale];
}

function toast(message: string): void {
  const el = document.getElementById("gallery-toast");
  if (!el) return;
  el.textContent = message;
  el.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    el.hidden = true;
  }, 3200);
}

function chromeEl(): HTMLElement {
  const root = document.createElement("div");
  root.className = "g-chrome";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML =
    '<div class="g-chrome-rail">' +
    '<div class="g-chrome-brand"><span class="g-chrome-logo"></span><span class="g-chrome-word"></span></div>' +
    '<div class="g-chrome-new"></div>' +
    '<div class="g-chrome-list"><i></i><i></i><i></i><i></i></div>' +
    '<div class="g-chrome-user"></div>' +
    "</div>" +
    '<div class="g-chrome-main">' +
    '<div class="g-chrome-bar"><span class="g-chrome-dot"></span><span class="g-chrome-bar-line"></span></div>' +
    '<div class="g-chrome-chat">' +
    '<div class="g-bubble g-bubble-user"><span></span></div>' +
    '<div class="g-bubble g-bubble-ai"><b></b><b></b><b></b></div>' +
    '<div class="g-bubble g-bubble-ai g-bubble-ai-short"><b></b></div>' +
    "</div>" +
    '<div class="g-chrome-composer"><span class="g-chrome-plus"></span><span class="g-chrome-field"></span><span class="g-chrome-send"></span></div>' +
    "</div>";
  return root;
}

/** Card dock shows at most the Featured chip. Skin / wallpaper / video chips stay off the card. */
export function dockChipKeys(pack: Pick<SkinPack, "featured">): readonly "gallery.featured"[] {
  return pack.featured === true ? (["gallery.featured"] as const) : [];
}

function chip(text: string, extra?: string): HTMLElement {
  const el = document.createElement("span");
  el.className = extra ? `g-chip ${extra}` : "g-chip";
  el.textContent = text;
  return el;
}

function cardEl(pack: SkinPack): HTMLElement {
  const messages = table();
  const li = document.createElement("li");
  li.className = pack.featured ? "g-card g-card-featured" : "g-card";

  const stage = document.createElement("article");
  stage.className = "g-card-stage";
  stage.tabIndex = 0;
  applyWallpaperCssVars(stage, pack.scrim);

  const img = document.createElement("img");
  img.className = "g-card-wall";
  img.src = pack.previewUrl;
  img.alt = packName(pack, state.locale);
  img.loading = "lazy";
  img.decoding = "async";
  img.style.objectPosition = wallPosition(pack);

  const scrim = document.createElement("div");
  scrim.className = "g-card-scrim";
  scrim.setAttribute("aria-hidden", "true");

  const dock = document.createElement("div");
  dock.className = "g-card-dock";

  const idBox = document.createElement("div");
  idBox.className = "g-card-id";
  const name = document.createElement("h3");
  name.className = "g-card-name";
  name.textContent = packName(pack, state.locale);
  const meta = document.createElement("p");
  meta.className = "g-card-meta";
  meta.textContent = t(messages, "gallery.author", { name: pack.author || "—" });
  const chipKeys = dockChipKeys(pack);
  const chips = chipKeys.length ? document.createElement("div") : null;
  if (chips) {
    chips.className = "g-chips";
    for (const key of chipKeys) {
      chips.append(chip(t(messages, key), key === "gallery.featured" ? "g-chip-hot" : undefined));
    }
  }

  const actions = document.createElement("div");
  actions.className = "g-card-actions";

  const apply = document.createElement("a");
  apply.className = "g-btn g-btn-accent g-btn-tiny";
  apply.href = applyHref(pack.downloadUrl);
  apply.textContent = t(messages, "gallery.apply");
  apply.addEventListener("click", (event) => {
    if (mobileApplyBlocked()) {
      event.preventDefault();
      toast(t(messages, "gallery.applyMobile"));
      return;
    }
    toast(t(messages, "gallery.applyHint"));
  });

  const download = document.createElement("a");
  download.className = "g-btn g-btn-ghost g-btn-tiny";
  download.href = pack.downloadUrl;
  download.download = `${pack.id}.grokskin`;
  download.rel = "noopener noreferrer";
  download.textContent = t(messages, "gallery.download");

  actions.append(apply, download);
  idBox.append(name, meta);
  if (chips) idBox.append(chips);
  dock.append(idBox, actions);
  stage.append(img, scrim, chromeEl(), dock);
  li.append(stage);
  return li;
}

function render(): void {
  const grid = document.getElementById("gallery-grid");
  const status = document.getElementById("gallery-status");
  const count = document.getElementById("gallery-count");
  const retry = document.getElementById("gallery-retry");
  if (!grid || !status || !count) return;

  const messages = table();
  if (retry) retry.hidden = state.status !== "error";
  if (state.status === "loading") {
    status.hidden = false;
    status.textContent = t(messages, "gallery.loading");
    count.textContent = "";
    grid.replaceChildren();
    return;
  }

  if (state.status === "error") {
    status.hidden = false;
    status.textContent = t(messages, "gallery.loadFail");
    count.textContent = "";
    grid.replaceChildren();
    return;
  }

  const shown = state.packs.filter((pack) => packMatches(pack, state.filter));
  count.textContent = t(messages, "gallery.count", { n: String(shown.length) });
  grid.replaceChildren();
  if (!shown.length) {
    status.hidden = false;
    status.textContent = t(messages, "gallery.empty");
    return;
  }
  status.hidden = true;
  const frag = document.createDocumentFragment();
  for (const pack of shown) frag.append(cardEl(pack));
  grid.append(frag);
}

async function copyCatalog(): Promise<void> {
  const messages = table();
  try {
    await navigator.clipboard.writeText(CATALOG_PUBLIC);
    toast(t(messages, "gallery.copied"));
  } catch {
    toast(t(messages, "gallery.copyFail"));
  }
}

async function loadCatalog(): Promise<void> {
  state.status = "loading";
  render();
  try {
    const catalog = await fetchCatalog();
    state.packs = catalog.packs;
    state.status = "ready";
  } catch (error) {
    console.error(error);
    state.packs = [];
    state.status = "error";
  }
  render();
}

export function syncGalleryLocale(locale: Locale): void {
  if (!document.getElementById("gallery-grid")) return;
  state.locale = locale;
  render();
}

export function bindGallery(locale: Locale): void {
  if (!document.getElementById("gallery-grid")) return;
  state.locale = locale;

  const url = document.getElementById("gallery-catalog-url");
  if (url) url.textContent = CATALOG_PUBLIC;

  document.querySelectorAll<HTMLAnchorElement>("[data-i18n='gallery.submit']").forEach((a) => {
    if (a.tagName === "A") a.href = CONTRIBUTE_URL;
  });

  document.getElementById("gallery-copy")?.addEventListener("click", () => {
    void copyCatalog();
  });

  document.getElementById("gallery-retry")?.addEventListener("click", () => {
    void loadCatalog();
  });

  const filter = document.querySelector<HTMLInputElement>("#gallery-filter");
  filter?.addEventListener("input", () => {
    state.filter = filter.value;
    if (state.status === "ready") render();
  });

  void loadCatalog();
}
