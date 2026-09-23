import { describe, expect, it } from "vitest";
import { en } from "./en";
import {
  htmlLang,
  resolveLocale,
  resolveLocaleFromSystem,
} from "./index";
import { zh } from "./zh";
import { zhTW } from "./zh-TW";

describe("resolveLocaleFromSystem", () => {
  it("maps zh-CN to zh", () => {
    expect(resolveLocaleFromSystem(["zh-CN"])).toBe("zh");
  });

  it("maps zh-Hans and zh-SG to zh", () => {
    expect(resolveLocaleFromSystem(["zh-Hans"])).toBe("zh");
    expect(resolveLocaleFromSystem(["zh-SG"])).toBe("zh");
  });

  it("maps zh-TW / zh-Hant / zh-HK to zh-TW", () => {
    expect(resolveLocaleFromSystem(["zh-TW"])).toBe("zh-TW");
    expect(resolveLocaleFromSystem(["zh-Hant"])).toBe("zh-TW");
    expect(resolveLocaleFromSystem(["zh-HK"])).toBe("zh-TW");
    expect(resolveLocaleFromSystem(["zh-MO"])).toBe("zh-TW");
  });

  it("maps en-US to en", () => {
    expect(resolveLocaleFromSystem(["en-US"])).toBe("en");
  });

  it("falls back unknown tags to en", () => {
    expect(resolveLocaleFromSystem(["ja-JP"])).toBe("en");
    expect(resolveLocaleFromSystem([])).toBe("en");
  });

  it("prefers the first matching navigator language", () => {
    expect(resolveLocaleFromSystem(["fr-FR", "zh-TW", "en"])).toBe("zh-TW");
  });
});

describe("resolveLocale", () => {
  it("stored zh | zh-TW | en wins over system", () => {
    expect(resolveLocale("zh", ["en-US"])).toBe("zh");
    expect(resolveLocale("zh-TW", ["zh-CN"])).toBe("zh-TW");
    expect(resolveLocale("en", ["zh-TW"])).toBe("en");
  });

  it("empty / system / junk follows system", () => {
    expect(resolveLocale(null, ["zh-CN"])).toBe("zh");
    expect(resolveLocale(undefined, ["zh-TW"])).toBe("zh-TW");
    expect(resolveLocale("", ["en-US"])).toBe("en");
    expect(resolveLocale("system", ["zh-CN"])).toBe("zh");
    expect(resolveLocale("de", ["ja"])).toBe("en");
  });
});

describe("htmlLang", () => {
  it("maps locale ids to html lang", () => {
    expect(htmlLang("zh")).toBe("zh-CN");
    expect(htmlLang("zh-TW")).toBe("zh-TW");
    expect(htmlLang("en")).toBe("en");
  });
});

describe("catalogs", () => {
  it("three locale tables share an identical key set", () => {
    const zhKeys = Object.keys(zh).sort();
    expect(Object.keys(zhTW).sort()).toEqual(zhKeys);
    expect(Object.keys(en).sort()).toEqual(zhKeys);
  });

  it("pill.speed.desc does not hardcode 1.2", () => {
    expect(zh["pill.speed.desc"]).not.toMatch(/1\.2/);
    expect(zhTW["pill.speed.desc"]).not.toMatch(/1\.2/);
    expect(en["pill.speed.desc"]).not.toMatch(/1\.2/);
  });

  it("locks CLI-vs-GUI and update FAQ copy in all locales", () => {
    expect(zh["faq.q10"]).toBe("开源 Grok App 和终端里的 grok 有什么区别？");
    expect(zh["faq.q11"]).toBe("怎么更新开源 Grok App？");
    expect(zh["faq.a10"]).toContain("/install/");
    expect(zh["faq.a10"]).toContain("不会替代 CLI");
    expect(zh["faq.a11"]).toContain("/changelog/");
    expect(zh["faq.a11"]).toContain("GitHub Releases");
    expect(zhTW["faq.q10"]).toContain("終端裡的 grok");
    expect(zhTW["faq.a10"]).toContain("/install/");
    expect(zhTW["faq.a11"]).toContain("/changelog/");
    expect(en["faq.q10"]).toMatch(/grok in the terminal/);
    expect(en["faq.a10"]).toMatch(/does not replace the CLI/);
    expect(en["faq.a10"]).toContain("/install/");
    expect(en["faq.q11"]).toMatch(/update open-source Grok App/i);
    expect(en["faq.a11"]).toContain("GitHub Releases");
    expect(en["faq.a11"]).toContain("/changelog/");
    expect(zh["desktop.relation.title"]).toBe("和本机 CLI 的关系");
    expect(zh["desktop.download.title"]).toBe("从哪里下载");
    expect(zh["desktop.updates.title"]).toBe("更新与版本");
    expect(zhTW["desktop.relation.body"]).toContain("不會替代 CLI");
    expect(en["desktop.download.body"]).toContain("GitHub Releases");
    expect(en["desktop.updates.body"]).toContain("/changelog/");
  });

  it("catalogs do not use unofficial disclaimers", () => {
    const blob = `${Object.values(zh).join("\n")}\n${Object.values(zhTW).join("\n")}\n${Object.values(en).join("\n")}`;
    expect(blob).not.toMatch(/非官方|unofficial|not an official|不是 xAI 官方|並非 xAI 官方/i);
  });
});
