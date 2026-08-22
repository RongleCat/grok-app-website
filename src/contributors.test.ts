import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import contributors from "./generated/contributors.json";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

describe("contributor wall data", () => {
  it("has unique homes and local avatars", () => {
    expect(contributors.length).toBeGreaterThanOrEqual(8);
    const homes = contributors.map((c) => c.home);
    const issues = contributors.map((c) => c.issue);
    expect(new Set(homes).size).toBe(homes.length);
    expect(new Set(issues).size).toBe(issues.length);
    for (const person of contributors) {
      expect(person.name.length).toBeGreaterThan(0);
      expect(person.home).toMatch(/^https?:\/\//);
      expect(person.avatar.startsWith("/images/contributors/")).toBe(true);
      expect(existsSync(join(root, "public", person.avatar))).toBe(true);
      expect(person.issue).toBeGreaterThan(0);
    }
    expect(contributors.some((c) => c.issue === 678 && c.name === "江知")).toBe(true);
  });
});
