import type { Locale } from "./index";
import { en } from "./en";
import { zh } from "./zh";
import { zhTW } from "./zh-TW";

export const catalogs: Record<Locale, Record<string, string>> = {
  zh,
  "zh-TW": zhTW,
  en,
};
