/**
 * 2026-08-30 · add · 锁 /api/stars 不得当内容页收录
 * Timestamp: 2026-08-30
 * Change type: add
 * What: sitemap / llms 不含 /api/stars；robots Disallow /api/；_headers noindex；_redirects 不吞 /api
 * Why: star 接口是 JSON，不是可抓取页面
 * Params & return: 无
 * Impact scope: SEO 静态契约测试
 * Risk: 无已知风险
 */
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
const skinsHtml = readFileSync(join(root, "skins/index.html"), "utf8");
const installHtml = readFileSync(join(root, "install/index.html"), "utf8");
const changelogHtml = readFileSync(join(root, "changelog/index.html"), "utf8");
const sitemap = readFileSync(join(root, "public/sitemap.xml"), "utf8");
const redirects = readFileSync(join(root, "public/_redirects"), "utf8");
const headers = readFileSync(join(root, "public/_headers"), "utf8");
const robots = readFileSync(join(root, "public/robots.txt"), "utf8");
const llms = readFileSync(join(root, "public/llms.txt"), "utf8");
const meta = JSON.parse(
  readFileSync(join(root, "src/generated/downloads-meta.json"), "utf8"),
) as { tag: string | null; fallback: boolean };
const publicPages = [html, ossHtml, faqHtml, skinsHtml, installHtml, changelogHtml];
const FORBIDDEN = ["官方桌面端", "Grok 桌面版"];
const THEME_GALLERY = "https://ronglecat.github.io/grok-app-skin/";
const SKINS_ROUTE = "/skins/";

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

describe("site footer", () => {
  it("points changelog on every public page to the on-site /changelog/ route", () => {
    for (const page of publicPages) {
      expect(page).toMatch(
        /<a data-footer="changelog"[^>]*href="\/changelog\/"/,
      );
      expect(page).not.toMatch(
        /<a data-footer="changelog"[^>]*CHANGELOG\.md/,
      );
    }
  });

  it("puts the Grok Bot friend link on every public page", () => {
    for (const page of publicPages) {
      expect(page).toContain('href="https://usegrokbot.com/"');
      expect(page).toContain('data-i18n="footer.grokbot"');
      expect(page).toContain('data-footer="grokbot"');
      expect(page).toMatch(
        /<a data-footer="grokbot"[^>]*rel="noopener noreferrer"/,
      );
      expect(page).not.toMatch(
        /<a data-footer="grokbot"[^>]*nofollow/,
      );
    }
    expect(zh["footer.grokbot"]).toBe("Grok Bot");
    expect(zhTW["footer.grokbot"]).toBe("Grok Bot");
    expect(en["footer.grokbot"]).toBe("Grok Bot");
    expect(llms).not.toContain("usegrokbot.com");
    expect(llms).not.toContain("Grok Bot");
  });
});

describe("community theme gallery", () => {
  it("links nav and footer on every public page to the internal /skins/ route", () => {
    for (const page of publicPages) {
      expect(page).toContain(`href="${SKINS_ROUTE}"`);
      expect(page).toContain('data-i18n="nav.themes"');
      expect(page).toContain('href="/install/"');
      expect(page).toContain('data-i18n="nav.install"');
      expect(page).not.toMatch(
        /href="https:\/\/ronglecat\.github\.io\/grok-app-skin\/"/,
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

describe("skins/index.html", () => {
  it("ships a runtime gallery shell without baked packs", () => {
    expect(skinsHtml).toContain('id="gallery-main"');
    expect(skinsHtml).toContain('id="gallery-grid"');
    expect(skinsHtml).toContain('id="gallery-status"');
    expect(skinsHtml).toContain('data-i18n="gallery.loading"');
    expect(skinsHtml).toContain('data-i18n="gallery.hero.title"');
    expect(skinsHtml).toContain(zh["gallery.hero.title"]);
    expect(skinsHtml).toContain(THEME_GALLERY + "catalog.json");
    expect(skinsHtml).toContain(
      "https://github.com/RongleCat/grok-app-skin/blob/main/CONTRIBUTING.md",
    );
    expect(skinsHtml).toContain('href="/skins/"');
    expect(skinsHtml).toContain('aria-current="page"');
    expect(skinsHtml).toContain('"@type": "CollectionPage"');
    expect(skinsHtml).not.toContain("white-chair-meadow");
    expect(skinsHtml).not.toContain("草原白椅");
    expect(zh).toHaveProperty("gallery.page.title");
    expect(en).toHaveProperty("gallery.apply");
  });
});

describe("install/index.html", () => {
  /* 2026-08-26 · add · 锁安装页可抓取正文、七个下载钩子与 HowTo，禁止假评分 */
  it("ships crawlable install steps, download hooks, and HowTo JSON-LD", () => {
    expect(installHtml).toContain('id="install-main"');
    expect(installHtml).toContain('id="install-download"');
    expect(installHtml).toContain('id="install-mac"');
    expect(installHtml).toContain('id="install-win"');
    expect(installHtml).toContain('id="install-linux"');
    expect(installHtml).toContain('id="install-first"');
    expect(installHtml).toContain('id="install-verify"');
    expect(installHtml).toContain('id="install-fix"');
    expect(installHtml).toContain(zh["install.hero.title"]);
    expect(installHtml).toContain(zh["install.mac.title"]);
    expect(installHtml).toContain(zh["install.first.title"]);
    expect(installHtml).toContain('href="/install/"');
    expect(installHtml).toContain('aria-current="page"');
    expect(installHtml).toContain('"@type": "HowTo"');
    expect(installHtml).not.toMatch(/aggregateRating|reviewCount|datePublished|dateModified/);
    expect(installHtml).not.toContain("grok-desktop-latest");
    for (const id of INSTALLER_IDS) {
      expect(installHtml).toContain(`data-installer="${id}"`);
    }
    expect(zh).toHaveProperty("install.page.title");
    expect(en).toHaveProperty("nav.install");
  });
});

describe("changelog/index.html", () => {
  /* 2026-09-02 · add · 锁更新日志可抓取正文、版本锚、WebPage JSON-LD，禁止假评分 */
  it("ships crawlable stable-release notes and WebPage JSON-LD", () => {
    expect(changelogHtml).toContain('id="changelog-main"');
    expect(changelogHtml).toContain(zh["changelog.hero.title"]);
    expect(changelogHtml).toContain(zh["changelog.page.title"]);
    expect(changelogHtml).toContain('href="/changelog/"');
    expect(changelogHtml).toContain('aria-current="page"');
    expect(changelogHtml).toContain('"@type": "WebPage"');
    expect(changelogHtml).toContain("https://grok-app.com/changelog/");
    expect(changelogHtml).not.toMatch(/aggregateRating|reviewCount/);
    expect(changelogHtml).not.toContain("softwareVersion");
    for (const tag of ["v0.2.30", "v0.2.29", "v0.2.28", "v0.2.27", "v0.2.26"]) {
      expect(changelogHtml).toContain(`id="${tag}"`);
      expect(changelogHtml).toContain(
        `https://github.com/RongleCat/grok-app/releases/tag/${tag}`,
      );
    }
    expect(zh).toHaveProperty("changelog.page.title");
    expect(en).toHaveProperty("changelog.hero.body");
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
    expect(redirects).toMatch(/\/skins\s+\/skins\/\s+301/);
    expect(redirects).toMatch(/\/install\s+\/install\/\s+301/);
    expect(redirects).toMatch(/\/changelog\s+\/changelog\/\s+301/);
    expect(redirects).not.toMatch(/\/api\//);
  });

  it("does not index /api/stars as a content page", () => {
    expect(sitemap).not.toContain("/api/stars");
    expect(llms).not.toContain("/api/stars");
    expect(robots).toContain("Disallow: /api/");
    expect(headers).toMatch(/\/api\/\*[\s\S]*X-Robots-Tag:\s*noindex/);
  });

  it("lists every public URL in sitemap.xml with lastmod", () => {
    expect(sitemap).toContain("<loc>https://grok-app.com/</loc>");
    expect(sitemap).toContain("<loc>https://grok-app.com/opensource/</loc>");
    expect(sitemap).toContain("<loc>https://grok-app.com/faq/</loc>");
    expect(sitemap).toContain("<loc>https://grok-app.com/skins/</loc>");
    expect(sitemap).toContain("<loc>https://grok-app.com/install/</loc>");
    expect(sitemap).toContain("<loc>https://grok-app.com/changelog/</loc>");
    expect(sitemap).toMatch(
      /<loc>https:\/\/grok-app\.com\/changelog\/<\/loc>\s*<lastmod>2026-09-02<\/lastmod>\s*<changefreq>weekly<\/changefreq>\s*<priority>0\.7<\/priority>/,
    );
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
    expect(llms).toContain("https://grok-app.com/skins/");
    expect(llms).toContain("https://grok-app.com/install/");
    expect(llms).toContain("https://grok-app.com/changelog/");
    expect(llms).toMatch(/Release notes live on-site at https:\/\/grok-app\.com\/changelog\//);
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
