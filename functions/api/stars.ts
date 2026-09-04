/**
 * 2026-09-04 · fix · GitHub 失败回退 ungh，并用 Cache API 记住上次成功 count
 * Timestamp: 2026-09-04
 * Change type: fix
 * What: GET /api/stars 先查 caches.default（约 1h）；未命中再打 GitHub REST，失败读 ungh.cc repo.stars
 * Why: Pages 共用出口 IP 易耗尽未认证 60 req/h，Function 502 后访客卡在构建回退缩写
 * Params & return: onRequestGet → 200 { count }；全失败 502 空 body + no-store
 * Impact scope: 边缘 Function；浏览器仍只打同源 /api/stars
 * Risk: Cache API 不可用时退化为每次 GitHub→ungh；成功响应 max-age=60 / s-maxage=600
 */

const GITHUB_REPO_API = "https://api.github.com/repos/RongleCat/grok-app";
const UNGH_REPO_API = "https://ungh.cc/repos/RongleCat/grok-app";
const USER_AGENT = "grok-app.com-stars";
const LAST_GOOD_URL = "https://grok-app.com/api/stars";
const LAST_GOOD_SECONDS = 3600;

type Env = {
  GITHUB_TOKEN?: string;
  GH_TOKEN?: string;
};

type CacheLike = {
  match: (req: RequestInfo) => Promise<Response | undefined>;
  put: (req: RequestInfo, res: Response) => Promise<void>;
};

function parseNonNegInt(raw: unknown): number | null {
  if (typeof raw !== "number" || !Number.isFinite(raw) || raw < 0) return null;
  return Math.floor(raw);
}

function parseStargazersCount(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  return parseNonNegInt((payload as { stargazers_count?: unknown }).stargazers_count);
}

function parseUnghStars(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  const repo = (payload as { repo?: { stars?: unknown } }).repo;
  if (!repo || typeof repo !== "object") return null;
  return parseNonNegInt((repo as { stars?: unknown }).stars);
}

function parseCachedCount(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  return parseNonNegInt((payload as { count?: unknown }).count);
}

function jsonHeaders(cacheControl: string): HeadersInit {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": cacheControl,
    "X-Robots-Tag": "noindex",
  };
}

function jsonCount(count: number): Response {
  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: jsonHeaders("public, max-age=60, s-maxage=600"),
  });
}

async function fetchCount(
  url: string,
  headers: Record<string, string>,
  parse: (payload: unknown) => number | null,
): Promise<number | null> {
  try {
    const res = await fetch(url, {
      headers,
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return parse(await res.json());
  } catch {
    return null;
  }
}

export async function onRequestGet(context: {
  env: Env;
  waitUntil?: (promise: Promise<unknown>) => void;
}): Promise<Response> {
  const cache = (globalThis as { caches?: { default?: CacheLike } }).caches
    ?.default;

  /* 约 1 小时内直接回上次成功 count，避免共用出口把 GitHub 60 req/h 打爆 */
  if (cache) {
    try {
      const hit = await cache.match(LAST_GOOD_URL);
      const lastGood = hit ? parseCachedCount(await hit.json()) : null;
      if (lastGood !== null) return jsonCount(lastGood);
    } catch {
      /* 当作未命中，继续拉源 */
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
  };
  const token = context.env.GITHUB_TOKEN || context.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  let count = await fetchCount(GITHUB_REPO_API, headers, parseStargazersCount);
  if (count === null) {
    count = await fetchCount(
      UNGH_REPO_API,
      { "User-Agent": USER_AGENT },
      parseUnghStars,
    );
  }

  if (count === null) {
    return new Response(null, {
      status: 502,
      headers: jsonHeaders("no-store"),
    });
  }

  if (cache) {
    const stored = new Response(JSON.stringify({ count }), {
      status: 200,
      headers: jsonHeaders(`public, max-age=${LAST_GOOD_SECONDS}`),
    });
    const put = cache.put(LAST_GOOD_URL, stored);
    if (typeof context.waitUntil === "function") context.waitUntil(put);
    else await put;
  }

  return jsonCount(count);
}
