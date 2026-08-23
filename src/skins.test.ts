import { describe, expect, it, vi } from "vitest";
import {
  applyHref,
  CATALOG_FALLBACK,
  CATALOG_PRIMARY,
  fetchCatalog,
  packMatches,
  parseCatalog,
  wallPosition,
} from "./skins";

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
