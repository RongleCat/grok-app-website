import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { INSTALLER_IDS, LATEST_DOWNLOAD_PREFIX, RELEASES_URL } from "./downloads";
import { en } from "./i18n/en";
import { zh } from "./i18n/zh";
import { zhTW } from "./i18n/zh-TW";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = readFileSync(join(root, "index.html"), "utf8");
const ossHtml = readFileSync(join(root, "opensource/index.html"), "utf8");

describe("shipped index.html", () => {
  it("exposes all seven installer hooks plus Releases fallback", () => {
    for (const id of INSTALLER_IDS) {
      expect(html).toContain(`data-installer="${id}"`);
    }
    expect(html).toContain('data-installer="mac-aarch64"');
    expect(html).toMatch(/class="dl-main"[^>]*data-installer="mac-aarch64"/);
    expect(html).toContain('data-releases');
    expect(html).toContain(RELEASES_URL);
    expect(html).not.toContain("grok-desktop-latest");
    expect(html).not.toContain(".app.tar.gz");
    expect(html).not.toContain("latest.json");
    expect(LATEST_DOWNLOAD_PREFIX).toContain("/releases/latest/download/");
  });

  it("has locale-aware first-paint meta and the required section ids", () => {
    expect(html).toContain('id="product"');
    expect(html).toContain('id="features"');
    expect(html).toContain('id="download"');
    expect(html).toContain('id="opensource"');
    expect(html).toContain('href="/opensource/"');
    expect(html).toContain('id="locale-switcher"');
    expect(html).toContain('viewBox="0 0 35 33"');
    expect(html).toContain('data-theme-set="dark"');
    expect(html).toContain('data-theme-set="light"');
    expect(html).not.toContain("theme-dots");
    expect(html).not.toContain("data-locale-toggle");
    expect(html).not.toMatch(/font-family:\s*var\(--serif\)/);
    expect(html).toContain('name="description"');
    expect(html).toContain('property="og:title"');
    expect(html).toContain(zh["meta.title"]);
    expect(html).toContain(zh["hero.title"]);
    expect(html).toContain('data-i18n="hero.title"');
    expect(Object.keys(zhTW)).toContain("hero.title");
    expect(Object.keys(en)).toContain("hero.title");
  });
});

describe("opensource/index.html", () => {
  it("opens WeChat QRs in a dialog instead of copying the account name", () => {
    expect(ossHtml).toContain('data-qr-open="mp"');
    expect(ossHtml).toContain('data-qr-open="friend"');
    expect(ossHtml).toContain('id="qr-dialog"');
    expect(ossHtml).not.toContain("data-copy=");
    expect(ossHtml).toContain('data-contributor-wall');
    expect(zh).toHaveProperty("oss.author.wechatFriend");
    expect(zh).toHaveProperty("oss.qr.mp.title");
    expect(zh).toHaveProperty("oss.qr.friend.title");
  });
});
