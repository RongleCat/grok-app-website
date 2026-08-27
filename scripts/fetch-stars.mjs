#!/usr/bin/env node
/**
 * 2026-08-27 · add · 构建期拉取 RongleCat/grok-app 的 stargazers_count
 * Timestamp: 2026-08-27
 * Change type: add
 * What: 把公开 GitHub API 的 star 数写入 src/generated/stars-meta.json
 * Why: 首屏不依赖运行时请求；失败时保留上次提交的真实数字，禁止写假数
 * Params & return: 无入参；成功打印 count，失败沿用旧文件或 { count: null }
 * Impact scope: pnpm prebuild / CI 构建产物
 * Risk: 未认证 API 有速率上限；超时或 403 时不覆盖已有有效 count
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/generated/stars-meta.json");
const URL = "https://api.github.com/repos/RongleCat/grok-app";

function parseCount(data) {
  if (!data || typeof data !== "object") return null;
  const raw = data.stargazers_count;
  if (typeof raw !== "number" || !Number.isFinite(raw) || raw < 0) return null;
  return Math.floor(raw);
}

async function readPrevious() {
  try {
    const prev = JSON.parse(await readFile(OUT, "utf8"));
    const count = parseCount({ stargazers_count: prev?.count });
    if (count !== null) return { count };
  } catch {
    /* first run or broken file */
  }
  return { count: null };
}

async function main() {
  await mkdir(dirname(OUT), { recursive: true });
  let next = await readPrevious();
  try {
    const res = await fetch(URL, {
      headers: { Accept: "application/vnd.github+json" },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const count = parseCount(await res.json());
      if (count !== null) next = { count };
    }
  } catch {
    /* keep previous */
  }

  await writeFile(OUT, `${JSON.stringify(next, null, 2)}\n`);
  console.log(
    next.count === null
      ? "stargazers_count unavailable — GitHub button will hide the number"
      : `stargazers_count ${next.count}`,
  );
}

main();
