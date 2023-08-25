import { NamespacesNeeded, loadTranslations as ni18nLoadTranslations } from "ni18n";
import { ni18nConfig } from "../ni18n.config";

import { AvailableLocale, timeAgoLocale, ValidLocale } from "./timeago";

export async function loadTranslations(initialLocale?: string, namespacesNeeded?: NamespacesNeeded) {
    const path = await import("path");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const locales = path.resolve("./", "./public/locales");

    namespacesNeeded = namespacesNeeded ?? ni18nConfig.ns;

    return await ni18nLoadTranslations(ni18nConfig, initialLocale, namespacesNeeded);
}

export type { AvailableLocale };
export { timeAgoLocale, ValidLocale };
