import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { en } from "./i18n/en";
import { zh } from "./i18n/zh";
import { zhTW } from "./i18n/zh-TW";
import {
  applyHref,
  CATALOG_FALLBACK,
  CATALOG_PRIMARY,
  dockChipKeys,
  fetchCatalog,
  MOBILE_APPLY_QUERY,
  mobileApplyBlocked,
  packMatches,
  parseCatalog,
  shouldBlockMobileApply,
  wallPosition,
} from "./skins";

const galleryCss = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "styles/gallery.css"),
  "utf8",
);

const sample = {
  schemaVersion: 1,
  packs: [
    {
      id: "white-chair-meadow",
      name: "草原白椅",
      nameEn: "White Chair Meadow",
      author: "RongleCat",
      previewUrl: "https://ronglecat.github.io/grok-app-skin/previews/white-chair-meadow.jpg",
      downloadUrl: "https://ronglecat.github.io/grok-app-skin/packs/white-chair-meadow.grokskin",
      tags: ["illustration", "green"],
      featured: true,
      hasWallpaper: true,
      skin: "default",
      focus: { cx: 0.5, cy: 0.4033942558746736 },
    },
  ],
};

describe("applyHref", () => {
  it("builds a grok skin import deep link from the pack download URL", () => {
    const url = "https://ronglecat.github.io/grok-app-skin/packs/white-chair-meadow.grokskin";
    expect(applyHref(url)).toBe(`grok://skin/import?url=${encodeURIComponent(url)}`);
  });
});

describe("mobile apply gate", () => {
  it("blocks only when the media query matches", () => {
    expect(shouldBlockMobileApply(true)).toBe(true);
    expect(shouldBlockMobileApply(false)).toBe(false);
  });

  it("reads the documented matchMedia query", () => {
    const matchMedia = vi.fn(() => ({ matches: true }));
    expect(mobileApplyBlocked(matchMedia)).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith(MOBILE_APPLY_QUERY);
    expect(MOBILE_APPLY_QUERY).toContain("max-width: 768px");
    expect(MOBILE_APPLY_QUERY).toContain("(hover: none) and (pointer: coarse)");
  });

  it("does not block when matchMedia is missing or throws", () => {
    expect(mobileApplyBlocked(undefined)).toBe(false);
    expect(
      mobileApplyBlocked(() => {
        throw new Error("no matchMedia");
      }),
    ).toBe(false);
  });

  it("ships three-locale mobile toast copy", () => {
    expect(zh["gallery.applyMobile"]).toBe("暂不支持手机端，请在电脑端尝试应用皮肤。");
    expect(zhTW["gallery.applyMobile"]).toBe("暫不支援手機端，請在電腦端嘗試套用皮膚。");
    expect(en["gallery.applyMobile"]).toBe(
      "Mobile isn’t supported yet — try applying the skin on desktop.",
    );
  });

  it("ships short Apply labels", () => {
    expect(zh["gallery.apply"]).toBe("应用");
    expect(zhTW["gallery.apply"]).toBe("套用");
    expect(en["gallery.apply"]).toBe("Apply");
  });
});

describe("dock chips", () => {
  it("keeps at most the Featured chip", () => {
    expect(dockChipKeys({ featured: true })).toEqual(["gallery.featured"]);
    expect(dockChipKeys({ featured: false })).toEqual([]);
    expect(dockChipKeys({})).toEqual([]);
  });
});

describe("gallery density CSS", () => {
  it("keeps equal-size cards and a 2-col mobile floor", () => {
    expect(galleryCss).toContain("repeat(auto-fill, minmax(min(100%, 240px), 1fr))");
    expect(galleryCss).toContain("repeat(2, minmax(0, 1fr))");
    expect(galleryCss).not.toMatch(/\.g-card-featured\s*\{[^}]*grid-column:\s*1\s*\/\s*-1/);
    expect(galleryCss).toContain("--chrome-bg:");
    expect(galleryCss).toContain("html[data-theme=\"light\"] .gallery-page");
  });

  it("uses a full-bleed hover overlay and a compact coarse-pointer bar", () => {
    expect(galleryCss).toMatch(/\.g-card-dock\s*\{[^}]*inset:\s*0/);
    expect(galleryCss).toContain("@media (hover: hover)");
    expect(galleryCss).toContain(".g-card:hover .g-card-dock");
    expect(galleryCss).toContain(".g-card:focus-within .g-card-dock");
    expect(galleryCss).toContain("@media (hover: none)");
  });
});

describe("parseCatalog", () => {
  it("accepts schemaVersion 1 packs and drops incomplete rows", () => {
    const catalog = parseCatalog({
      schemaVersion: 1,
      packs: [sample.packs[0], { id: "nope" }, null],
    });
    expect(catalog.packs).toHaveLength(1);
    expect(catalog.packs[0]?.id).toBe("white-chair-meadow");
  });

  it("rejects a missing or wrong schema", () => {
    expect(() => parseCatalog({ schemaVersion: 2, packs: [] })).toThrow("bad catalog");
    expect(() => parseCatalog({})).toThrow("bad catalog");
  });
});

describe("packMatches / wallPosition", () => {
  const pack = parseCatalog(sample).packs[0]!;

  it("filters by name, author, and tags", () => {
    expect(packMatches(pack, "")).toBe(true);
    expect(packMatches(pack, "草原")).toBe(true);
    expect(packMatches(pack, "ronglecat")).toBe(true);
    expect(packMatches(pack, "green")).toBe(true);
    expect(packMatches(pack, "ocean")).toBe(false);
  });

  it("uses focus as object-position percent", () => {
    expect(wallPosition(pack)).toBe("50% 40.3%");
    expect(wallPosition({})).toBe("50% 40%");
  });
});

describe("fetchCatalog", () => {
  it("falls back when the primary source fails", async function () {
    const load = vi.fn(async (url: string) => {
      if (url === CATALOG_PRIMARY) throw new Error("blocked");
      return {
        ok: true,
        json: async () => sample,
      } as Response;
    });
    const catalog = await fetchCatalog(load as unknown as typeof fetch);
    expect(load).toHaveBeenCalledWith(CATALOG_PRIMARY, { cache: "no-cache" });
    expect(load).toHaveBeenCalledWith(CATALOG_FALLBACK, { cache: "no-cache" });
    expect(catalog.packs[0]?.downloadUrl).toContain("white-chair-meadow.grokskin");
  });
});
