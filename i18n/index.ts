import { DateTime } from "luxon";
import TimeAgo from "javascript-time-ago";

import { Locale as LocaleID, TimeAgoLocale as TimeAgoLocaleID } from "./id";
import { Locale as LocaleEN, TimeAgoLocale as TimeAgoLocaleEN } from "./en";
import { Locale as LocaleSU, TimeAgoLocale as TimeAgoLocaleSU } from "./su";
import { Locale as LocaleJV, TimeAgoLocale as TimeAgoLocaleJV } from "./jv";
import { Locale as LocaleJP, TimeAgoLocale as TimeAgoLocaleJP } from "./jp";
import { isNone } from "../lib/utils";

export const LocaleMap = {
    id: LocaleID,
    en: LocaleEN,
    su: LocaleSU,
    jv: LocaleJV,
    jp: LocaleJP,
};

export const ValidLocale = Object.keys(LocaleMap);

const TimeAgoLocaleExtra = [
    TimeAgoLocaleID,
    TimeAgoLocaleEN,
    TimeAgoLocaleJP,
    TimeAgoLocaleJV,
    TimeAgoLocaleSU,
];
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
    // @ts-ignore
    return timeAgo.format(DateTime.fromSeconds(unix, { zone: "UTC" }).toJSDate());
}
