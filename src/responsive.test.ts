import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "styles/responsive.css"),
  "utf8",
);

describe("shipped header reflow at 768", () => {
  it("applies hamburger + nowrap CTA inside max-width: 768px, not only 719px", () => {
    const start = css.search(/@media\s*\(\s*max-width:\s*768px\s*\)/);
    expect(start).toBeGreaterThan(-1);
    const next = css.slice(start + 10).search(/@media\s*\(/);
    const body = next === -1 ? css.slice(start) : css.slice(start, start + 10 + next);
    expect(body).toContain(".nav-toggle");
    expect(body).toContain(".nav-cluster");
    expect(body).toMatch(/display:\s*grid/);
    expect(body).toContain("top: calc(100% + 8px)");
    expect(body).toContain("right: 0");
    expect(body).toContain(".header-download");
    expect(body).toContain("white-space: nowrap");
    expect(body).toContain("brand download burger");
    expect(body).toContain(".locale-switcher");
  });
});
