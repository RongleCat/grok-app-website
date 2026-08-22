export type SiteTheme = "dark" | "light";
export type ThemePreference = SiteTheme | "system";

export const THEME_STORAGE_KEY = "grok-app-site.theme";

export const WORKBENCH = {
  dark: {
    src: "/images/workbench-dark.webp",
    fallback: "/images/workbench-dark.png",
  },
  light: {
    src: "/images/workbench-light.webp",
    fallback: "/images/workbench-light.png",
  },
} as const;

export function isThemePreference(value: string | null | undefined): value is ThemePreference {
  return value === "dark" || value === "light" || value === "system";
}

export function resolveTheme(
  stored: string | null | undefined,
  prefersLight: boolean,
): SiteTheme {
  if (stored === "light" || stored === "dark") return stored;
  if (stored === "system") return prefersLight ? "light" : "dark";
  return "dark";
}

export function readStoredTheme(): string | null {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeStoredTheme(value: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, value);
  } catch {
    /* private mode */
  }
}

export function applyTheme(theme: SiteTheme): void {
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#f5f5f4" : "#070708");
  swapWorkbenchImages(theme);
}

export function swapWorkbenchImages(theme: SiteTheme): void {
  const shot = WORKBENCH[theme];
  for (const img of document.querySelectorAll<HTMLImageElement>("[data-workbench]")) {
    img.src = shot.src;
    img.setAttribute("data-theme-src", theme);
  }
  for (const source of document.querySelectorAll<HTMLSourceElement>("[data-workbench-src]")) {
    source.srcset = shot.src;
  }
}

export function currentPreference(): ThemePreference {
  const stored = readStoredTheme();
  return isThemePreference(stored) ? stored : "dark";
}

export function initTheme(): SiteTheme {
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const theme = resolveTheme(readStoredTheme(), prefersLight);
  applyTheme(theme);
  return theme;
}

export function setThemePreference(pref: ThemePreference): SiteTheme {
  writeStoredTheme(pref);
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const theme = resolveTheme(pref, prefersLight);
  applyTheme(theme);
  syncThemeControls(pref);
  return theme;
}

export function syncThemeControls(pref: ThemePreference): void {
  for (const btn of document.querySelectorAll<HTMLElement>("[data-theme-set]")) {
    btn.setAttribute("aria-pressed", String(btn.getAttribute("data-theme-set") === pref));
  }
}
