import { describe, expect, it } from "vitest";
import { resolveTheme, WORKBENCH } from "./theme";

describe("resolveTheme", () => {
  it("defaults to dark when nothing is stored", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(undefined, true)).toBe("dark");
    expect(resolveTheme("", false)).toBe("dark");
  });

  it("honors stored dark / light", () => {
    expect(resolveTheme("light", false)).toBe("light");
    expect(resolveTheme("dark", true)).toBe("dark");
  });

  it("follows prefers-color-scheme only when preference is system", () => {
    expect(resolveTheme("system", true)).toBe("light");
    expect(resolveTheme("system", false)).toBe("dark");
  });
});

describe("WORKBENCH", () => {
  it("maps each site theme to a distinct workbench file", () => {
    expect(WORKBENCH.dark.src).toContain("workbench-dark");
    expect(WORKBENCH.light.src).toContain("workbench-light");
    expect(WORKBENCH.dark.src).not.toBe(WORKBENCH.light.src);
  });
});
