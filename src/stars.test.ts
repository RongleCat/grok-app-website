/**
 * 2026-08-28 · fix · 去掉 star 本地缓存单测，锁每次刷新都请求
 * Timestamp: 2026-08-28
 * Change type: fix
 * What: 保留缩写规则；refresh 必打 API；失败返回 null
 * Why: 用户要求刷新即拉 stargazers_count，禁止 TTL 短路
 * Params & return: 无
 * Impact scope: src/stars.ts 纯函数与 refreshGithubStars
 * Risk: 无已知风险
 */
import { describe, expect, it } from "vitest";
import {
  abbreviateStarCount,
  bakedStarCount,
  formatExactStarCount,
  parseStarCount,
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

describe("parseStarCount / readStargazersCount", () => {
  it("accepts finite non-negative API values and rejects the rest", () => {
    expect(parseStarCount(1104)).toBe(1104);
    expect(parseStarCount(1104.9)).toBe(1104);
    expect(parseStarCount(-3)).toBeNull();
    expect(readStargazersCount({ stargazers_count: 1104 })).toBe(1104);
    expect(readStargazersCount({ stargazers_count: "1104" })).toBeNull();
    expect(readStargazersCount({})).toBeNull();
  });
});

describe("refreshGithubStars", () => {
  it("always fetches the public API and returns the live count", async () => {
    const urls: string[] = [];
    const fetchFn = (async (input: RequestInfo | URL) => {
      urls.push(String(input));
      return new Response(JSON.stringify({ stargazers_count: 1200 }), { status: 200 });
    }) as typeof fetch;
    const live = await refreshGithubStars("en", fetchFn);
    expect(urls).toEqual([STARS_API_URL]);
    expect(live).toBe(1200);
    expect(bakedStarCount()).not.toBe(1200);
  });

  it("hides the count when the fetch fails", async () => {
    const fetchFn = (async () => new Response("rate limited", { status: 403 })) as typeof fetch;
    const live = await refreshGithubStars("zh", fetchFn);
    expect(live).toBeNull();
  });
});
