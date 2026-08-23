import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it, vi } from "vitest";
import { en } from "./i18n/en";
import { zh } from "./i18n/zh";
import { zhTW } from "./i18n/zh-TW";
import {
  applyHref,
  applyWallpaperCssVars,
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
  wallpaperCssVars,
  wallpaperFromScrim,
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
    expect(galleryCss).toContain("width: 100%");
    expect(galleryCss).toContain("@media (hover: hover)");
    expect(galleryCss).toContain(".g-card:hover .g-card-dock");
    expect(galleryCss).toContain(".g-card:focus-within .g-card-dock");
    expect(galleryCss).toContain("@media (hover: none)");
  });

  it("fills the card edge-to-edge with App wallpaper mix math", () => {
    expect(galleryCss).toMatch(/\.g-chrome\s*\{[^}]*inset:\s*0/);
    expect(galleryCss).toMatch(/\.g-chrome\s*\{[^}]*border-radius:\s*inherit/);
    expect(galleryCss).not.toMatch(/inset:\s*8%\s*7%\s*10%\s*7%/);
    expect(galleryCss).not.toMatch(/inset:\s*7%\s*6%\s*28%\s*6%/);
    expect(galleryCss).not.toMatch(/inset:\s*7%\s*6%\s*34%\s*6%/);
    expect(galleryCss).toContain("var(--wallpaper-mix-sidebar)");
    expect(galleryCss).toContain("var(--wallpaper-mix-main)");
    expect(galleryCss).toContain("var(--wallpaper-sidebar-blur)");
    expect(galleryCss).toContain("linear-gradient(");
    expect(galleryCss).toContain("105deg");
    expect(galleryCss).toContain("var(--wallpaper-scrim-opacity)");
    expect(galleryCss).not.toContain("--chrome-scrim");
    expect(galleryCss).toMatch(/\.g-card-dock\s*\{[^}]*z-index:\s*4/);
    expect(galleryCss).toMatch(/\.g-chrome\s*\{[^}]*z-index:\s*2/);
    expect(galleryCss).not.toContain(".g-card-stage::before");
    expect(galleryCss).not.toContain(".g-card-stage::after");
  });
});

describe("wallpaperFromScrim", () => {
  it("maps pack.scrim onto App mix / blur / opacity", () => {
    expect(wallpaperFromScrim(100)).toEqual({
      t: 1,
      opacity: 1,
      mixSidebar: 58,
      mixMain: 70,
      mixAside: 70,
      sidebarBlurPx: 22,
    });
    expect(wallpaperFromScrim(undefined)).toEqual(wallpaperFromScrim(100));
    expect(wallpaperFromScrim(null)).toEqual(wallpaperFromScrim(100));
    expect(wallpaperFromScrim(0)).toEqual({
      t: 0,
      opacity: 0,
      mixSidebar: 0,
      mixMain: 0,
      mixAside: 0,
      sidebarBlurPx: 0,
    });
    expect(wallpaperFromScrim(50)).toEqual({
      t: 0.5,
      opacity: 0.5,
      mixSidebar: 29,
      mixMain: 35,
      mixAside: 35,
      sidebarBlurPx: 11,
    });
    expect(wallpaperFromScrim(150)).toEqual(wallpaperFromScrim(100));
    expect(wallpaperFromScrim(-4)).toEqual(wallpaperFromScrim(0));
  });

  it("emits CSS variables and data-scrim on the card stage", () => {
    expect(wallpaperCssVars(100)).toEqual({
      "--wallpaper-scrim-opacity": "1",
      "--wallpaper-mix-sidebar": "58%",
      "--wallpaper-mix-main": "70%",
      "--wallpaper-mix-aside": "70%",
      "--wallpaper-sidebar-blur": "22px",
    });
    const props: Record<string, string> = {};
    const el = {
      style: {
        setProperty(name: string, value: string) {
          props[name] = value;
        },
      },
      dataset: {} as DOMStringMap,
    };
    applyWallpaperCssVars(el, undefined);
    expect(el.dataset.scrim).toBe("100");
    expect(props["--wallpaper-mix-sidebar"]).toBe("58%");
    expect(props["--wallpaper-scrim-opacity"]).toBe("1");
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
    expect(catalog.packs[0]?.scrim).toBeUndefined();
  });

  it("keeps pack.scrim when the catalog sends a number", () => {
    const catalog = parseCatalog({
      schemaVersion: 1,
      packs: [{ ...sample.packs[0], scrim: 100 }],
    });
    expect(catalog.packs[0]?.scrim).toBe(100);
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
