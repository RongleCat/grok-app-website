/**
 * 2026-08-30 · add · 同源 GET /api/stars，服务端拉 GitHub stargazers_count
 * Timestamp: 2026-08-30
 * Change type: add
 * What: Pages Function 用真实 User-Agent 请求产品仓 REST，返回 { count }
 * Why: 浏览器直打 api.github.com 会被未认证速率限制打成 403，控制台红字且数字消失
 * Params & return: onRequestGet → 200 JSON { count: number }；GitHub 失败 502 空 body
 * Impact scope: wrangler pages deploy 拾取仓库根 functions/；浏览器只打 /api/stars
 * Risk: 未配 token 时仍受 GitHub 未认证限额；失败不缓存，避免把 502 冻 90 秒
 */

const GITHUB_REPO_API = "https://api.github.com/repos/RongleCat/grok-app";
const USER_AGENT = "grok-app.com-stars";
/* 90 秒落在用户允许的 60–120s 边缘缓存区间，不是 localStorage TTL */
const CACHE_SECONDS = 90;

type Env = {
  GITHUB_TOKEN?: string;
  GH_TOKEN?: string;
};

function parseStargazersCount(payload: unknown): number | null {
  if (!payload || typeof payload !== "object") return null;
  const raw = (payload as { stargazers_count?: unknown }).stargazers_count;
  if (typeof raw !== "number" || !Number.isFinite(raw) || raw < 0) return null;
  return Math.floor(raw);
}

function jsonHeaders(cacheControl: string): HeadersInit {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": cacheControl,
    "X-Robots-Tag": "noindex",
  };
}

export async function onRequestGet(context: { env: Env }): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": USER_AGENT,
  };
  /* 若 Pages 环境已有 token 则带上，降低未认证 403；不要求、不发明密钥 */
  const token = context.env.GITHUB_TOKEN || context.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(GITHUB_REPO_API, {
      headers,
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      return new Response(null, {
        status: 502,
        headers: jsonHeaders("no-store"),
      });
    }
    const count = parseStargazersCount(await res.json());
    if (count === null) {
      return new Response(null, {
        status: 502,
        headers: jsonHeaders("no-store"),
      });
    }
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: jsonHeaders(`public, max-age=${CACHE_SECONDS}`),
    });
  } catch {
    return new Response(null, {
      status: 502,
      headers: jsonHeaders("no-store"),
    });
  }
}
