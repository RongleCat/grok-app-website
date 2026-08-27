/**
 * 2026-08-27 · add · star 缩写与缓存单测
 * Timestamp: 2026-08-27
 * Change type: add
 * What: 锁 1094→1.1k / 999 / 10k，以及非法输入不造假数
 * Why: 可见数字规则是用户验收条件，避免回归成四位原样或假 0
 * Params & return: 无
 * Impact scope: src/stars.ts 纯函数
 * Risk: 无已知风险
 */
import { describe, expect, it } from "vitest";
import {
  abbreviateStarCount,
  cacheIsFresh,
  formatExactStarCount,
  parseStarCount,
  readStargazersCount,
  readStarsCache,
  STARS_STORAGE_KEY,
  STARS_TTL_MS,
  writeStarsCache,
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

describe("stars cache", () => {
  it("round-trips a valid count and expires after the TTL", () => {
    const store = new Map<string, string>();
    const storage = {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
    };
    writeStarsCache(1104, 1_000, storage);
    expect(store.has(STARS_STORAGE_KEY)).toBe(true);
    const cached = readStarsCache(storage);
    expect(cached).toEqual({ count: 1104, fetchedAt: 1_000 });
    expect(cacheIsFresh(cached!, 1_000 + STARS_TTL_MS - 1)).toBe(true);
    expect(cacheIsFresh(cached!, 1_000 + STARS_TTL_MS)).toBe(false);
  });
});
