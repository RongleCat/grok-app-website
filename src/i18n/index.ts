export type Locale = "zh" | "zh-TW" | "en";
export type LocalePreference = Locale | "system";

export const LOCALE_STORAGE_KEY = "grok-app-site.locale";
export const LOCALES: readonly Locale[] = ["zh", "zh-TW", "en"];

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "zh" || value === "zh-TW" || value === "en";
}

export function htmlLang(locale: Locale): string {
  if (locale === "zh") return "zh-CN";
  if (locale === "zh-TW") return "zh-TW";
  return "en";
}

export function ogLocale(locale: Locale): string {
  if (locale === "zh") return "zh_CN";
  if (locale === "zh-TW") return "zh_TW";
  return "en_US";
}

export function resolveLocaleFromSystem(languages: readonly string[]): Locale {
  for (const raw of languages) {
    const tag = raw.trim().toLowerCase().replace(/_/g, "-");
    if (!tag) continue;
    if (
      tag.startsWith("zh-hant") ||
      tag.startsWith("zh-tw") ||
      tag.startsWith("zh-hk") ||
      tag.startsWith("zh-mo")
    ) {
      return "zh-TW";
    }
    if (tag === "zh" || tag.startsWith("zh-")) return "zh";
    if (tag === "en" || tag.startsWith("en-")) return "en";
  }
  return "en";
}

export function resolveLocale(
  stored: string | null | undefined,
  languages: readonly string[],
): Locale {
  if (isLocale(stored)) return stored;
  return resolveLocaleFromSystem(languages);
}

export function readStoredLocale(): string | null {
  try {
    return localStorage.getItem(LOCALE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function writeStoredLocale(value: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, value);
  } catch {
    /* private mode */
  }
}

export function systemLanguages(): readonly string[] {
  if (typeof navigator === "undefined") return ["en"];
  if (navigator.languages && navigator.languages.length > 0) {
    return navigator.languages;
  }
  return [navigator.language || "en"];
}

export function interpolate(template: string, vars?: Record<string, string>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => vars[name] ?? `{${name}}`);
}

export function t(
  table: Record<string, string>,
  key: string,
  vars?: Record<string, string>,
): string {
  const raw = table[key];
  if (raw == null) return key;
  return interpolate(raw, vars);
}

export function emphasizeGrok(text: string): string {
  return text.replace(/Grok/g, "<em>Grok</em>");
}

export function sameKeySet(
  a: Record<string, string>,
  b: Record<string, string>,
): boolean {
  const ak = Object.keys(a).sort();
  const bk = Object.keys(b).sort();
  if (ak.length !== bk.length) return false;
  return ak.every((k, i) => k === bk[i]);
}
