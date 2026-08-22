#!/usr/bin/env node
/**
 * Build-time fetch of GitHub Release downloads.json.
 * Never called from the browser (no CORS). On 404 / bad JSON,
 * keep the committed fallback so buttons stay on stable latest/download URLs.
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "src/generated/downloads-meta.json");
const URL =
  "https://github.com/RongleCat/grok-app/releases/latest/download/downloads.json";

const FALLBACK = { tag: null, fallback: true };

function validate(data) {
  if (!data || typeof data !== "object") return null;
  if (data.schemaVersion !== 1) return null;
  const installers = data.installers;
  if (!installers || typeof installers !== "object") return null;
  if (!installers["mac-x64"] || !installers["windows-x64"]) return null;
  const tag =
    typeof data.tag === "string"
      ? data.tag
      : typeof data.version === "string"
        ? `v${data.version}`
        : null;
  return { tag, fallback: false };
}

async function main() {
  await mkdir(dirname(OUT), { recursive: true });
  let next = FALLBACK;
  try {
    const res = await fetch(URL, {
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const parsed = validate(await res.json());
      if (parsed) next = parsed;
    }
  } catch {
    /* keep fallback */
  }

  if (next.fallback) {
    try {
      const prev = JSON.parse(await readFile(OUT, "utf8"));
      if (prev && prev.tag && prev.fallback === false) next = prev;
    } catch {
      /* first run */
    }
  }

  await writeFile(OUT, `${JSON.stringify(next, null, 2)}\n`);
  console.log(
    next.fallback
      ? "downloads.json unavailable — using stable URL fallback"
      : `downloads.json tag ${next.tag}`,
  );
}

main();
