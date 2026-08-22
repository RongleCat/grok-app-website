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

  it("catalogs do not use unofficial disclaimers", () => {
    const blob = `${Object.values(zh).join("\n")}\n${Object.values(zhTW).join("\n")}\n${Object.values(en).join("\n")}`;
    expect(blob).not.toMatch(/非官方|unofficial|not an official|不是 xAI 官方|並非 xAI 官方/i);
  });
});
