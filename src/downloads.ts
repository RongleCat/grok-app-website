export const GITHUB_REPO = "RongleCat/grok-app";
export const LATEST_DOWNLOAD_PREFIX =
  `https://github.com/${GITHUB_REPO}/releases/latest/download/`;
export const RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;
export const LICENSE_URL = `https://github.com/${GITHUB_REPO}/blob/main/LICENSE`;
export const README_ZH_URL = `https://github.com/${GITHUB_REPO}/blob/main/README_ZH.md`;
export const README_URL = `https://github.com/${GITHUB_REPO}#readme`;
export const CHANGELOG_URL = `https://github.com/${GITHUB_REPO}/blob/main/CHANGELOG.md`;
export const SECURITY_URL = `https://github.com/${GITHUB_REPO}/blob/main/SECURITY.md`;

export const INSTALLER_FILES = {
  "mac-aarch64": "Grok_mac_aarch64.dmg",
  "mac-x64": "Grok_mac_x64.dmg",
  "windows-x64": "Grok_windows_x64-setup.exe",
  "windows-x64-portable": "Grok_windows_x64-portable.zip",
  "linux-x64-appimage": "Grok_linux_x64.AppImage",
  "linux-x64-deb": "Grok_linux_x64.deb",
  "linux-x64-rpm": "Grok_linux_x64.rpm",
} as const;

export type InstallerId = keyof typeof INSTALLER_FILES;

export const INSTALLER_IDS = Object.keys(INSTALLER_FILES) as InstallerId[];

export function installerUrl(id: InstallerId): string {
  return `${LATEST_DOWNLOAD_PREFIX}${INSTALLER_FILES[id]}`;
}

export function allInstallerUrls(): Record<InstallerId, string> {
  const out = {} as Record<InstallerId, string>;
  for (const id of INSTALLER_IDS) out[id] = installerUrl(id);
  return out;
}

export function isForbiddenDownloadUrl(url: string): boolean {
  return (
    url.includes("grok-desktop-latest") ||
    url.includes(".app.tar.gz") ||
    /\.sig(?:$|[?#])/.test(url) ||
    url.includes("latest.json")
  );
}

export function detectPreferredInstaller(
  ua: string,
  platform: string,
  architecture?: string,
): InstallerId {
  const hay = `${ua} ${platform}`.toLowerCase();
  if (/mac|darwin|iphone|ipad/.test(hay)) {
    const arch = (architecture ?? "").toLowerCase();
    if (arch === "x86_64" || arch === "x64" || arch === "amd64") return "mac-x64";
    return "mac-aarch64";
  }
  if (/win/.test(hay)) return "windows-x64";
  if (/linux/.test(hay)) return "linux-x64-appimage";
  return "mac-aarch64";
}

export type DownloadsMeta = {
  tag: string | null;
  fallback: boolean;
};

export function versionLabel(
  meta: DownloadsMeta,
  interpolate: (tag: string) => string,
  fallback: string,
): string {
  if (meta.tag) return interpolate(meta.tag);
  return fallback;
}
