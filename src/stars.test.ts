/**
 * 2026-08-30 · fix · refresh 改打同源 /api/stars，失败不擦掉构建回退
 * Timestamp: 2026-08-30
 * Change type: fix
 * What: 锁相对路径 /api/stars；失败返回 null 且 paintedCount 仍是 baked
 * Why: 浏览器不得再请求 api.github.com；403 时数字必须留下
 * Params & return: 无
 * Impact scope: src/stars.ts 纯函数与 refreshGithubStars
 * Risk: 无已知风险
 */
import { describe, expect, it } from "vitest";
import {
  abbreviateStarCount,
  bakedStarCount,
  formatExactStarCount,
  paintGithubStars,
  paintedStarCount,
  parseStarCount,
  readLiveStarCount,
  readStargazersCount,
  refreshGithubStars,
  STARS_API_URL,
} from "./stars";

describe("abbreviateStarCount", () => {
  it("keeps counts under 1000 as-is", () => {
    expect(abbreviateStarCount(0)).toBe("0");
    expect(abbreviateStarCount(1)).toBe("1");
    expect(abbreviateStarCount(999)).toBe("999");
  });

  it("uses k with one decimal only when it is not a round thousand", () => {
    expect(abbreviateStarCount(1000)).toBe("1k");
    expect(abbreviateStarCount(1094)).toBe("1.1k");
    expect(abbreviateStarCount(1104)).toBe("1.1k");
    expect(abbreviateStarCount(1500)).toBe("1.5k");
    expect(abbreviateStarCount(1999)).toBe("2k");
    expect(abbreviateStarCount(10000)).toBe("10k");
    expect(abbreviateStarCount(10100)).toBe("10.1k");
  });

  it("never invents a number for invalid input", () => {
    expect(abbreviateStarCount(Number.NaN)).toBe("");
    expect(abbreviateStarCount(Number.POSITIVE_INFINITY)).toBe("");
    expect(abbreviateStarCount(-1)).toBe("");
  });
});

describe("formatExactStarCount", () => {
  it("keeps every digit of the exact count", () => {
    const exact = formatExactStarCount(1094, "en");
    expect(exact.replace(/\D/g, "")).toBe("1094");
    expect(exact).not.toMatch(/k/i);
  });
});

describe("parseStarCount / live and GitHub payloads", () => {
  it("accepts finite non-negative API values and rejects the rest", () => {
    expect(parseStarCount(1104)).toBe(1104);
    expect(parseStarCount(1104.9)).toBe(1104);
    expect(parseStarCount(-3)).toBeNull();
    expect(readLiveStarCount({ count: 1104 })).toBe(1104);
    expect(readLiveStarCount({ count: "1104" })).toBeNull();
    expect(readLiveStarCount({})).toBeNull();
    expect(readStargazersCount({ stargazers_count: 1104 })).toBe(1104);
    expect(readStargazersCount({ stargazers_count: "1104" })).toBeNull();
    expect(readStargazersCount({})).toBeNull();
  });
});

describe("refreshGithubStars", () => {
  it("fetches same-origin /api/stars and never api.github.com", async () => {
    const urls: string[] = [];
    const fetchFn = (async (input: RequestInfo | URL) => {
      urls.push(String(input));
      return new Response(JSON.stringify({ count: 1200 }), { status: 200 });
    }) as typeof fetch;
    const live = await refreshGithubStars("en", fetchFn);
    expect(STARS_API_URL).toBe("/api/stars");
    expect(STARS_API_URL).not.toContain("api.github.com");
    expect(urls).toEqual(["/api/stars"]);
    expect(urls.some((url) => url.includes("api.github.com"))).toBe(false);
    expect(live).toBe(1200);
    expect(bakedStarCount()).not.toBe(1200);
  });

  it("keeps the baked count when the live fetch fails", async () => {
    const baked = bakedStarCount();
    expect(baked).not.toBeNull();
    paintGithubStars(baked, "zh");
    expect(paintedStarCount()).toBe(baked);

    const fetchFn = (async () => new Response(null, { status: 502 })) as typeof fetch;
    const live = await refreshGithubStars("zh", fetchFn);
    expect(live).toBeNull();
    expect(paintedStarCount()).toBe(baked);
  });
});
