#!/usr/bin/env node
/**
 * 2026-09-04 · fix · 构建期 GitHub 失败则读 ungh.cc repo.stars
 * Timestamp: 2026-09-04
 * Change type: fix
 * What: 先拉 GitHub REST，失败再拉 ungh；写入 src/generated/stars-meta.json
 * Why: CI 共用 IP 常 403，旧逻辑会把过期 count 继续烘焙进首屏
 * Params & return: 无入参；成功打印 count，两边都失败沿用旧文件或 { count: null }
 * Impact scope: pnpm prebuild / CI 构建产物
 * Risk: 未认证 GitHub 有速率上限；ungh 不可用时不覆盖已有有效 count
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/generated/stars-meta.json");
const GITHUB_URL = "https://api.github.com/repos/RongleCat/grok-app";
const UNGH_URL = "https://ungh.cc/repos/RongleCat/grok-app";
const USER_AGENT = "grok-app.com-stars";

function parseNonNegInt(raw) {
  if (typeof raw !== "number" || !Number.isFinite(raw) || raw < 0) return null;
  return Math.floor(raw);
}

function parseGithubCount(data) {
  if (!data || typeof data !== "object") return null;
  return parseNonNegInt(data.stargazers_count);
}

function parseUnghCount(data) {
  if (!data || typeof data !== "object") return null;
  return parseNonNegInt(data.repo?.stars);
}

async function readPrevious() {
  try {
    const prev = JSON.parse(await readFile(OUT, "utf8"));
    const count = parseNonNegInt(prev?.count);
    if (count !== null) return { count };
  } catch {
    /* first run or broken file */
  }
  return { count: null };
}

async function main() {
  await mkdir(dirname(OUT), { recursive: true });
  let next = await readPrevious();
  let live = null;
  try {
    const res = await fetch(GITHUB_URL, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": USER_AGENT,
      },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) live = parseGithubCount(await res.json());
  } catch {
    /* try ungh */
  }
  if (live === null) {
    try {
      const res = await fetch(UNGH_URL, {
        headers: { "User-Agent": USER_AGENT },
        redirect: "follow",
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) live = parseUnghCount(await res.json());
    } catch {
      /* keep previous */
    }
  }
  if (live !== null) next = { count: live };

  await writeFile(OUT, `${JSON.stringify(next, null, 2)}\n`);
  console.log(
    next.count === null
      ? "stargazers_count unavailable — GitHub button will hide the number"
      : `stargazers_count ${next.count}`,
  );
}

main();
