// Import the locale here
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import jp from "javascript-time-ago/locale/ja";
import moment from "moment-timezone";

import LocaleEN from "./en";
import LocaleID from "./id";
import LocaleJP from "./jp";
import LocaleJV from "./jv";
// eslint-disable-next-line import/order
import LocaleSU from "./su";

// Import any timeAgo stuff here

import { id, jv, su } from "./timeago";

import { isNone } from "../../../lib/utils";

// Add new language mapping here.
export const LocaleMap = {
    id: LocaleID,
    en: LocaleEN,
    jv: LocaleJV,
    su: LocaleSU,
    jp: LocaleJP,
    ja: LocaleJP,
};

export const ValidLocale = Object.keys(LocaleMap);

// Add the new time-ago locale here.
// Call `TimeAgo.addLocale(MODULE)`
const TimeAgoLocaleExtra = [id, en, jv, su, jp];
TimeAgoLocaleExtra.forEach((locale) => {
    // @ts-ignore
    TimeAgo.addLocale(locale);
});
TimeAgo.setDefaultLocale("id");

export type Locale = keyof typeof LocaleMap;
// Add new TimeAgo language code here.
export type TimeAgoLocale = "id" | "en" | "jv" | "su" | "ja" | "jp";

function walkKey(data: any, notations: string) {
    const splitNots = notations.split(".");
    splitNots.forEach((nots) => {
        if (isNone(data)) return;
        // eslint-disable-next-line no-param-reassign
        data = data[nots];
    });
    return data;
}

export function translate(key: string, lang: Locale, extras: string[] = null) {
    // Fallback to Indonesian
    const LocaleData = LocaleMap[lang] || LocaleID;
    let localized = walkKey(LocaleData, key);
    if (Array.isArray(extras)) {
        extras.forEach((val, idx) => {
            if (typeof localized === "string") {
                localized = localized.replace(`{${idx}}`, val);
            }
        });
    }
    return localized;
}

export function timeAgoLocale(unix: number, lang: TimeAgoLocale): string {
    // Special case
    let realLang = lang;
    if (lang === "jp") {
        realLang = "ja";
    }
    // Create a new TimeAgo class.
    const timeAgo = new TimeAgo(realLang);
    // And then format it
    return timeAgo.format(moment.unix(unix).toDate());
}
