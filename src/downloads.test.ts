import { describe, expect, it } from "vitest";
import {
  allInstallerUrls,
  detectPreferredInstaller,
  INSTALLER_FILES,
  INSTALLER_IDS,
  installerUrl,
  isForbiddenDownloadUrl,
  LATEST_DOWNLOAD_PREFIX,
  RELEASES_URL,
  versionLabel,
} from "./downloads";

const EXPECTED_FILES = [
  "Grok_mac_aarch64.dmg",
  "Grok_mac_x64.dmg",
  "Grok_windows_x64-setup.exe",
  "Grok_windows_x64-portable.zip",
  "Grok_linux_x64.AppImage",
  "Grok_linux_x64.deb",
  "Grok_linux_x64.rpm",
] as const;

describe("installerUrl", () => {
  it("builds seven latest/download URLs with stable filenames", () => {
    const urls = allInstallerUrls();
    expect(INSTALLER_IDS).toHaveLength(7);
    const hrefs = EXPECTED_FILES.map((name) => `${LATEST_DOWNLOAD_PREFIX}${name}`);
    expect(Object.values(urls).sort()).toEqual([...hrefs].sort());
    for (const name of EXPECTED_FILES) {
      expect(Object.values(INSTALLER_FILES)).toContain(name);
    }
    expect(installerUrl("mac-aarch64")).toBe(
      "https://github.com/RongleCat/grok-app/releases/latest/download/Grok_mac_aarch64.dmg",
    );
  });

  it("rejects forbidden updater / signature targets", () => {
    expect(
      isForbiddenDownloadUrl(
        "https://github.com/RongleCat/grok-app/releases/download/grok-desktop-latest/foo",
      ),
    ).toBe(true);
    expect(
      isForbiddenDownloadUrl(
        "https://github.com/RongleCat/grok-app/releases/latest/download/Grok.app.tar.gz",
      ),
    ).toBe(true);
    expect(isForbiddenDownloadUrl("https://example.com/latest.json")).toBe(true);
    expect(isForbiddenDownloadUrl("https://example.com/app.sig")).toBe(true);
    expect(
      isForbiddenDownloadUrl(installerUrl("windows-x64")),
    ).toBe(false);
  });

  it("keeps a GitHub Releases fallback", () => {
    expect(RELEASES_URL).toBe("https://github.com/RongleCat/grok-app/releases");
  });
});

describe("detectPreferredInstaller", () => {
  it("prefers Apple Silicon on Mac unless Intel is explicit", () => {
    expect(detectPreferredInstaller("Mozilla/5.0 Macintosh", "MacIntel")).toBe(
      "mac-aarch64",
    );
    expect(
      detectPreferredInstaller("Mozilla/5.0 Macintosh", "MacIntel", "x86_64"),
    ).toBe("mac-x64");
    expect(detectPreferredInstaller("Mozilla/5.0 Windows NT", "Win32")).toBe(
      "windows-x64",
    );
    expect(detectPreferredInstaller("Mozilla/5.0 X11 Linux", "Linux x86_64")).toBe(
      "linux-x64-appimage",
    );
  });
});

describe("versionLabel", () => {
  it("interpolates tag or uses fallback copy", () => {
    expect(
      versionLabel({ tag: "v1.2.3", fallback: false }, (tag) => `当前版本 ${tag}`, "见 GitHub Releases"),
    ).toBe("当前版本 v1.2.3");
    expect(
      versionLabel({ tag: null, fallback: true }, (tag) => `当前版本 ${tag}`, "见 GitHub Releases"),
    ).toBe("见 GitHub Releases");
  });
});
