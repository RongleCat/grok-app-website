/**
 * 2026-09-04 · fix · refresh 锁 cache:no-store；Function 403 走 ungh / last-good
 * Timestamp: 2026-09-04
 * Change type: fix
 * What: 锁相对路径 /api/stars + cache:"no-store"；失败 paintedCount 仍是 baked；Function 测 ungh 与 Cache API
 * Why: 浏览器不得打 api.github.com；GitHub 限额 403 时边缘仍要吐出数字
 * Params & return: 无
 * Impact scope: src/stars.ts 与 functions/api/stars.ts
 * Risk: 无已知风险
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { onRequestGet } from "../functions/api/stars";
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
  it("fetches same-origin /api/stars with cache no-store and never api.github.com", async () => {
    const urls: string[] = [];
    const caches: Array<RequestCache | undefined> = [];
    const fetchFn = (async (input: RequestInfo | URL, init?: RequestInit) => {
      urls.push(String(input));
      caches.push(init?.cache);
      return new Response(JSON.stringify({ count: 1200 }), { status: 200 });
    }) as typeof fetch;
    const live = await refreshGithubStars("en", fetchFn);
    expect(STARS_API_URL).toBe("/api/stars");
    expect(STARS_API_URL).not.toContain("api.github.com");
    expect(urls).toEqual(["/api/stars"]);
    expect(caches).toEqual(["no-store"]);
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

describe("onRequestGet /api/stars", () => {
  const store = new Map<string, Response>();

  afterEach(() => {
    store.clear();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function stubCache(): void {
    vi.stubGlobal("caches", {
      default: {
        match: async (key: RequestInfo) => store.get(String(key))?.clone(),
        put: async (key: RequestInfo, res: Response) => {
          store.set(String(key), res.clone());
        },
      },
    });
  }

  it("falls back to ungh when GitHub returns 403", async () => {
    stubCache();
    const urls: string[] = [];
    vi.stubGlobal(
      "fetch",
      async (input: RequestInfo | URL) => {
        const url = String(input);
        urls.push(url);
        if (url.includes("api.github.com")) {
          return new Response("rate limited", { status: 403 });
        }
        if (url.includes("ungh.cc/repos/RongleCat/grok-app")) {
          return new Response(JSON.stringify({ repo: { stars: 1175 } }), {
            status: 200,
          });
        }
        return new Response(null, { status: 500 });
      },
    );

    const res = await onRequestGet({ env: {} });
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe(
      "public, max-age=60, s-maxage=600",
    );
    expect(await res.json()).toEqual({ count: 1175 });
    expect(urls.some((url) => url.includes("api.github.com"))).toBe(true);
    expect(urls.some((url) => url.includes("ungh.cc"))).toBe(true);
  });

  it("serves cached last-good without calling GitHub again", async () => {
    stubCache();
    let fetches = 0;
    vi.stubGlobal(
      "fetch",
      async (input: RequestInfo | URL) => {
        fetches += 1;
        const url = String(input);
        if (url.includes("api.github.com")) {
          return new Response(JSON.stringify({ stargazers_count: 1175 }), {
            status: 200,
          });
        }
        return new Response(null, { status: 500 });
      },
    );

    const first = await onRequestGet({ env: {} });
    expect(first.status).toBe(200);
    expect(await first.json()).toEqual({ count: 1175 });
    expect(fetches).toBe(1);

    const second = await onRequestGet({ env: {} });
    expect(second.status).toBe(200);
    expect(await second.json()).toEqual({ count: 1175 });
    expect(fetches).toBe(1);
  });

  it("returns 502 no-store when GitHub, ungh, and cache all miss", async () => {
    stubCache();
    vi.stubGlobal("fetch", async () => new Response(null, { status: 403 }));

    const res = await onRequestGet({ env: {} });
    expect(res.status).toBe(502);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(await res.text()).toBe("");
  });
});
