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
const faqHtml = readFileSync(join(root, "faq/index.html"), "utf8");
const sitemap = readFileSync(join(root, "public/sitemap.xml"), "utf8");
const redirects = readFileSync(join(root, "public/_redirects"), "utf8");
const llms = readFileSync(join(root, "public/llms.txt"), "utf8");
const meta = JSON.parse(
  readFileSync(join(root, "src/generated/downloads-meta.json"), "utf8"),
) as { tag: string | null; fallback: boolean };
const publicPages = [html, ossHtml, faqHtml];
const FORBIDDEN = ["官方桌面端", "Grok 桌面版"];
const THEME_GALLERY = "https://ronglecat.github.io/grok-app-skin/";

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
    expect(html).toContain('href="/faq/"');
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

describe("community theme gallery", () => {
  it("links nav and footer on every public page to the external gallery", () => {
    for (const page of publicPages) {
      expect(page).toContain(THEME_GALLERY);
      expect(page).toContain('data-i18n="nav.themes"');
      expect(page).toContain('data-footer="themes"');
      expect(page).toMatch(
        /href="https:\/\/ronglecat\.github\.io\/grok-app-skin\/"[^>]*rel="noreferrer"/,
      );
    }
    expect(html).toContain('data-i18n="skins.note"');
    expect(html).toContain('data-i18n="skins.cta"');
    expect(ossHtml).toContain('data-i18n="skins.cta"');
    expect(zh["nav.themes"]).toBe("皮肤");
    expect(zhTW["nav.themes"]).toBe("主題");
    expect(en["nav.themes"]).toBe("Themes");
  });
});

describe("faq/index.html", () => {
  it("ships six static FAQs and a nav current page", () => {
    expect(faqHtml).toContain('id="faq-main"');
    expect(faqHtml).toContain('data-i18n="faq.q1"');
    expect(faqHtml).toContain('data-i18n="faq.q6"');
    expect(faqHtml).toContain('data-i18n="faq.q4"');
    expect(faqHtml).toContain('data-i18n="faq.q7"');
    expect(faqHtml).toContain('data-i18n="faq.q8"');
    expect(faqHtml).toContain(zh["faq.q4"]);
    expect(faqHtml).toContain(zh["faq.q7"]);
    expect(faqHtml).toContain(zh["faq.q8"]);
    expect(faqHtml).toContain('aria-current="page"');
    expect(faqHtml).toContain('href="/faq/"');
    expect(faqHtml).toContain('"@type": "FAQPage"');
    expect(zh).toHaveProperty("faq.page.title");
    expect(en).toHaveProperty("nav.faq");
  });
});

describe("SEO / GEO foundation", () => {
  it("301s www to apex and keeps trailing-slash rules", () => {
    expect(redirects).toMatch(
      /https:\/\/www\.grok-app\.com\/\*\s+https:\/\/grok-app\.com\/:splat\s+301/,
    );
    expect(redirects).toMatch(/\/opensource\s+\/opensource\/\s+301/);
    expect(redirects).toMatch(/\/faq\s+\/faq\/\s+301/);
  });

  it("lists every public URL in sitemap.xml with lastmod", () => {
    expect(sitemap).toContain("<loc>https://grok-app.com/</loc>");
    expect(sitemap).toContain("<loc>https://grok-app.com/opensource/</loc>");
    expect(sitemap).toContain("<loc>https://grok-app.com/faq/</loc>");
    expect(sitemap).toMatch(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/);
    expect(sitemap).toContain("<changefreq>weekly</changefreq>");
    expect(sitemap).toContain("<priority>1.0</priority>");
  });

  it("ships llms.txt with Desktop/GUI aliases and real URLs", () => {
    expect(llms).toMatch(/Also known as/i);
    expect(llms).toContain("The product name is **Grok App**");
    expect(llms).toContain("Grok Desktop");
    expect(llms).toContain("Grok GUI");
    expect(llms).toContain("https://grok-app.com/");
    expect(llms).toContain("https://ronglecat.github.io/grok-app-skin/");
    expect(llms).toContain("https://github.com/RongleCat/grok-app");
    expect(llms).toContain("https://github.com/RongleCat/grok-app/releases");
    expect(llms).toContain("MIT");
    expect(llms).toContain("铁柱AGI");
    expect(llms).toContain("https://x.com/cgnot996");
  });

  it("enriches homepage JSON-LD without invented ratings", () => {
    const match = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
    );
    expect(match).not.toBeNull();
    const data = JSON.parse(match![1]) as {
      "@graph": Array<Record<string, unknown>>;
    };
    const types = data["@graph"].map((node) => node["@type"]);
    expect(types).toEqual(
      expect.arrayContaining(["SoftwareApplication", "Organization", "WebSite"]),
    );
    const app = data["@graph"].find((node) => node["@type"] === "SoftwareApplication");
    if (!meta.fallback && meta.tag) {
      expect(app?.softwareVersion).toBe(meta.tag);
    } else {
      expect(app?.softwareVersion).toBeUndefined();
    }
    expect(app?.alternateName).toEqual(
      expect.arrayContaining(["Grok Desktop", "Grok GUI", "Grok Build GUI"]),
    );
    const blob = JSON.stringify(data);
    expect(blob).toContain("https://github.com/RongleCat/grok-app");
    expect(blob).toContain("https://x.com/cgnot996");
    expect(blob).not.toMatch(/aggregateRating|reviewCount/);
  });

  it("puts robots, twitter, and absolute og:image on every public page", () => {
    for (const page of publicPages) {
      expect(page).toContain('name="robots" content="index,follow"');
      expect(page).toContain('name="twitter:site" content="@cgnot996"');
      expect(page).toContain('name="twitter:creator" content="@cgnot996"');
      expect(page).toContain(
        'property="og:image" content="https://grok-app.com/images/og.jpg"',
      );
    }
    expect(html).toContain(zh["brand.definition"]);
    expect(html).toContain(zh["meta.description"]);
  });

  it("does not use forbidden product-comparison phrases", () => {
    const catalogs = [zh, zhTW, en].map((table) => Object.values(table).join("\n"));
    for (const blob of [...publicPages, sitemap, llms, ...catalogs]) {
      for (const phrase of FORBIDDEN) {
        expect(blob).not.toContain(phrase);
      }
    }
  });

  it("does not use unofficial disclaimers in user-facing copy", () => {
    const catalogs = [zh, zhTW, en].map((table) => Object.values(table).join("\n"));
    const banned = /非官方|unofficial|not an official|不是 xAI 官方|並非 xAI 官方/i;
    for (const blob of [...publicPages, llms, ...catalogs]) {
      expect(blob).not.toMatch(banned);
    }
    expect(zh).not.toHaveProperty("brand.disclaimer");
    expect(html).toContain('name="keywords"');
    expect(zh["meta.keywords"]).toContain("Grok Desktop");
  });
});
