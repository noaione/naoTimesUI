// Import the locale here
import LocaleID from "./id";
import LocaleEN from "./en";
import LocaleJV from "./jv";
import LocaleSU from "./su";

import TimeAgo from "javascript-time-ago";
import moment from "moment-timezone";

// Import any timeAgo stuff here
import id from "javascript-time-ago/locale/id";
import en from "javascript-time-ago/locale/en";
import { jv, su } from "./timeago";

// Add new language mapping here.
const LocaleMap = {
    id: LocaleID,
    en: LocaleEN,
    jv: LocaleJV,
    su: LocaleSU,
};

// Add the new time-ago locale here.
// Call `TimeAgo.addLocale(MODULE)`
TimeAgo.addDefaultLocale(id);
TimeAgo.addLocale(en);
TimeAgo.addLocale(jv);
TimeAgo.addLocale(su);

export type Locale = keyof typeof LocaleMap;
// Add new TimeAgo language code here.
export type TimeAgoLocale = "id" | "en" | "jv" | "su";

export function translate(key: keyof typeof LocaleID, lang: Locale) {
    // Fallback to Indonesian
    const Locale = LocaleMap[lang] || LocaleID;
    return Locale[key];
}

export function timeAgoLocale(unix: number, lang: TimeAgoLocale): string {
    // Create a new TimeAgo class.
    const timeAgo = new TimeAgo(lang);
    // And then format it
    return timeAgo.format(moment.unix(unix).toDate());
}
