// Import the locale here
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import moment from "moment-timezone";

import LocaleEN from "./en";
import LocaleID from "./id";
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
};

export const ValidLocale = Object.keys(LocaleMap);

// Add the new time-ago locale here.
// Call `TimeAgo.addLocale(MODULE)`
const TimeAgoLocaleExtra = [id, en, jv, su];
TimeAgoLocaleExtra.forEach((locale) => {
    // @ts-ignore
    TimeAgo.addLocale(locale);
});
TimeAgo.setDefaultLocale("id");

export type Locale = keyof typeof LocaleMap;
// Add new TimeAgo language code here.
export type TimeAgoLocale = "id" | "en" | "jv" | "su";

function walkKey(data: any, notations: string) {
    const splitNots = notations.split(".");
    splitNots.forEach((nots) => {
        if (isNone(data)) return;
        data = data[nots];
    });
    return data;
}

export function translate(key: string, lang: Locale, extras: string[] = null) {
    // Fallback to Indonesian
    const Locale = LocaleMap[lang] || LocaleID;
    let localized = walkKey(Locale, key);
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
    // Create a new TimeAgo class.
    const timeAgo = new TimeAgo(lang);
    // And then format it
    return timeAgo.format(moment.unix(unix).toDate());
}
