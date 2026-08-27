import { catalogs } from "./i18n/catalog";
import {
  emphasizeGrok,
  htmlLang,
  isLocale,
  LOCALE_STORAGE_KEY,
  ogLocale,
  readStoredLocale,
  resolveLocale,
  systemLanguages,
  t,
  writeStoredLocale,
  type Locale,
} from "./i18n/index";
import {
  allInstallerUrls,
  CHANGELOG_URL,
  LICENSE_URL,
  README_URL,
  README_ZH_URL,
  RELEASES_URL,
  SECURITY_URL,
  versionLabel,
  type InstallerId,
} from "./downloads";
import {
  currentPreference,
  initTheme,
  setThemePreference,
  syncThemeControls,
  type ThemePreference,
} from "./theme";
import meta from "./generated/downloads-meta.json";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/header.css";
import "./styles/hero.css";
import "./styles/sections.css";
import "./styles/download.css";
import "./styles/footer.css";
import "./styles/responsive.css";
import "./styles/opensource.css";
import "./styles/faq.css";
import "./styles/gallery.css";
import "./styles/install.css";
import contributors from "./generated/contributors.json";
import { bindGallery, syncGalleryLocale } from "./skins";
import { bindGithubStars, syncGithubStars } from "./stars";

const HTML_KEYS = new Set(["hero.title", "dl.title"]);

function currentLocale(): Locale {
  return resolveLocale(readStoredLocale(), systemLanguages());
}

function applyI18n(locale: Locale): void {
  const table = catalogs[locale];
  document.documentElement.lang = htmlLang(locale);
  document.documentElement.setAttribute("data-locale", locale);
  const kind = pageKind(location.pathname);
  /* 2026-08-26 · add · 安装页用独立 title/description，避免套首页 meta */
  const titleKey =
    kind === "oss"
      ? "oss.page.title"
      : kind === "faq"
        ? "faq.page.title"
        : kind === "skins"
          ? "gallery.page.title"
          : kind === "install"
            ? "install.page.title"
            : "meta.title";
  const descKey =
    kind === "oss"
      ? "oss.page.desc"
      : kind === "faq"
        ? "faq.page.desc"
        : kind === "skins"
          ? "gallery.page.desc"
          : kind === "install"
            ? "install.page.desc"
            : "meta.description";
  document.title = t(table, titleKey);

  const desc = t(table, descKey);
  setMeta('meta[name="description"]', desc);
  setMeta('meta[name="keywords"]', t(table, "meta.keywords"));
  setMeta('meta[property="og:title"]', t(table, titleKey));
  setMeta('meta[property="og:description"]', desc);
  setMeta('meta[property="og:locale"]', ogLocale(locale));
  setMeta('meta[name="twitter:title"]', t(table, titleKey));
  setMeta('meta[name="twitter:description"]', desc);

  for (const el of document.querySelectorAll<HTMLElement>("[data-i18n]")) {
    const key = el.getAttribute("data-i18n");
    if (!key) continue;
    const vars = readVars(el);
    const text = t(table, key, vars);
    if (HTML_KEYS.has(key) || el.hasAttribute("data-i18n-html")) {
      el.innerHTML = emphasizeGrok(escapeHtml(text));
    } else {
      el.textContent = text;
    }
  }

  for (const el of document.querySelectorAll<HTMLElement>("[data-i18n-aria]")) {
    const key = el.getAttribute("data-i18n-aria");
    if (key) el.setAttribute("aria-label", t(table, key));
  }

  for (const el of document.querySelectorAll<HTMLElement>("[data-i18n-alt]")) {
    const key = el.getAttribute("data-i18n-alt");
    if (key) el.setAttribute("alt", t(table, key));
  }

  for (const el of document.querySelectorAll<HTMLElement>("[data-i18n-placeholder]")) {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) el.setAttribute("placeholder", t(table, key));
  }

  syncLocaleControls(locale);
  syncOpenQrDialog();
  syncGalleryLocale(locale);
  /* 2026-08-27 · add · 切语言后重写 star 精确数与 aria-label，不重新请求 */
  syncGithubStars(locale);
}

function readVars(el: HTMLElement): Record<string, string> | undefined {
  const raw = el.getAttribute("data-i18n-vars");
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return undefined;
  }
}

function pageKind(pathname: string): "home" | "oss" | "faq" | "skins" | "install" {
  if (pathname.includes("opensource")) return "oss";
  if (pathname.includes("faq")) return "faq";
  if (pathname.includes("skins")) return "skins";
  if (pathname.includes("install")) return "install";
  return "home";
}

function setMeta(selector: string, value: string): void {
  const el = document.querySelector(selector);
  if (el) el.setAttribute("content", value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function syncLocaleControls(locale: Locale): void {
  for (const btn of document.querySelectorAll<HTMLElement>("[data-locale-set]")) {
    btn.setAttribute("aria-pressed", String(btn.getAttribute("data-locale-set") === locale));
  }
}

function bindLocale(): void {
  document.querySelectorAll<HTMLElement>("[data-locale-set]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-locale-set");
      if (!isLocale(next)) return;
      writeStoredLocale(next);
      applyI18n(next);
    });
  });

  window.addEventListener("languagechange", () => {
    if (isLocale(readStoredLocale())) return;
    applyI18n(currentLocale());
  });
}

function bindTheme(): void {
  document.querySelectorAll<HTMLElement>("[data-theme-set]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const pref = btn.getAttribute("data-theme-set") as ThemePreference | null;
      if (pref === "dark" || pref === "light" || pref === "system") {
        setThemePreference(pref);
      }
    });
  });

  window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (event) => {
    if (currentPreference() !== "system") return;
    setThemePreference("system");
    void event;
  });
}

function bindDownloads(): void {
  const urls = allInstallerUrls();
  for (const el of document.querySelectorAll<HTMLAnchorElement>("[data-installer]")) {
    const id = el.getAttribute("data-installer") as InstallerId | null;
    if (!id || !(id in urls)) continue;
    el.href = urls[id];
    el.rel = "noopener noreferrer";
  }

  const fallback = document.querySelector<HTMLAnchorElement>("[data-releases]");
  if (fallback) fallback.href = RELEASES_URL;

  const version = document.querySelector<HTMLElement>("[data-version]");
  if (version) {
    const table = catalogs[currentLocale()];
    version.textContent = versionLabel(
      meta,
      (tag) => t(table, "dl.version", { tag }),
      t(table, "dl.versionFallback"),
    );
  }

  document.querySelectorAll<HTMLElement>("[data-dl-platform]").forEach((card) => {
    const summary = card.querySelector<HTMLElement>("summary, [data-dl-toggle]");
    summary?.addEventListener("click", () => {
      /* native details handles open */
    });
  });
}

function bindNav(): void {
  const header = document.querySelector("header.site-header");
  const burger = document.getElementById("nav-toggle");
  burger?.addEventListener("click", () => {
    const open = header?.getAttribute("data-nav-open") === "true";
    header?.setAttribute("data-nav-open", String(!open));
    burger.setAttribute("aria-expanded", String(!open));
  });

  document.querySelectorAll("nav a, .header-download").forEach((link) => {
    link.addEventListener("click", () => {
      header?.setAttribute("data-nav-open", "false");
      burger?.setAttribute("aria-expanded", "false");
    });
  });
}

const GROK_BOT_URL = "https://usegrokbot.com/";

function bindFooterLinks(): void {
  const map: Record<string, string> = {
    license: LICENSE_URL,
    privacy: SECURITY_URL,
    terms: README_URL,
    docs: README_ZH_URL,
    changelog: CHANGELOG_URL,
    grokbot: GROK_BOT_URL,
  };
  for (const [key, href] of Object.entries(map)) {
    document.querySelectorAll<HTMLAnchorElement>(`[data-footer="${key}"]`).forEach((a) => {
      a.href = href;
      a.rel = "noopener noreferrer";
    });
  }
}

function bindContributors(): void {
  const wall = document.querySelector("[data-contributor-wall]");
  if (!wall) return;
  const frag = document.createDocumentFragment();
  for (const person of contributors) {
    const card = document.createElement("a");
    card.className = "contrib-card";
    card.href = person.home;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    const img = document.createElement("img");
    img.src = person.avatar;
    img.alt = "";
    img.width = 96;
    img.height = 96;
    img.loading = "lazy";
    img.decoding = "async";
    const name = document.createElement("strong");
    name.textContent = person.name;
    const note = document.createElement("span");
    note.textContent = person.note;
    card.append(img, name, note);
    frag.append(card);
  }
  wall.replaceChildren(frag);
}

const QR_ASSETS = {
  mp: {
    src: "/images/wechat/mp-search-scan.png",
    titleKey: "oss.qr.mp.title",
    altKey: "oss.qr.mp.alt",
  },
  friend: {
    src: "/images/wechat/community-group-qr.png",
    titleKey: "oss.qr.friend.title",
    altKey: "oss.qr.friend.alt",
  },
} as const;

type QrId = keyof typeof QR_ASSETS;

function isQrId(value: string | null): value is QrId {
  return value === "mp" || value === "friend";
}

function qrDialog(): HTMLDialogElement | null {
  return document.querySelector("#qr-dialog");
}

function fillQrDialog(dialog: HTMLDialogElement, id: QrId): void {
  const spec = QR_ASSETS[id];
  const table = catalogs[currentLocale()];
  const title = dialog.querySelector<HTMLElement>("[data-qr-title]");
  const img = dialog.querySelector<HTMLImageElement>("[data-qr-img]");
  dialog.setAttribute("data-qr", id);
  if (title) title.textContent = t(table, spec.titleKey);
  if (img) {
    img.src = spec.src;
    img.alt = t(table, spec.altKey);
  }
}

function syncOpenQrDialog(): void {
  const dialog = qrDialog();
  if (!dialog?.open) return;
  const id = dialog.getAttribute("data-qr");
  if (isQrId(id)) fillQrDialog(dialog, id);
}

function bindQrDialog(): void {
  const dialog = qrDialog();
  if (!dialog) return;

  document.querySelectorAll<HTMLButtonElement>("[data-qr-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-qr-open");
      if (!isQrId(id)) return;
      fillQrDialog(dialog, id);
      dialog.showModal();
    });
  });

  dialog.querySelector("[data-qr-close]")?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

function boot(): void {
  initTheme();
  syncThemeControls(currentPreference());
  applyI18n(currentLocale());
  bindLocale();
  bindTheme();
  bindDownloads();
  bindNav();
  bindFooterLinks();
  bindContributors();
  bindQrDialog();
  bindGallery(currentLocale());
  bindGithubStars(currentLocale());
  document.documentElement.setAttribute("data-ready", "true");
}

boot();

export { applyI18n, currentLocale, LOCALE_STORAGE_KEY };
