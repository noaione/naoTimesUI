import { DateTime } from "luxon";
import TimeAgo from "javascript-time-ago";

import TimeAgoLocaleID from "./id";
import TimeAgoLocaleEN from "javascript-time-ago/locale/en";
import TimeAgoLocaleSU from "./su";
import TimeAgoLocaleJV from "./jv";
import TimeAgoLocaleJP from "javascript-time-ago/locale/ja";

const TimeAgoLocaleExtra = [
    TimeAgoLocaleID,
    TimeAgoLocaleEN,
    TimeAgoLocaleJP,
    TimeAgoLocaleJV,
    TimeAgoLocaleSU,
];
TimeAgoLocaleExtra.forEach((locale) => {
    TimeAgo.addLocale(locale);
});

TimeAgo.setDefaultLocale("id");

export const ValidLocale = ["id", "en", "jv", "su", "ja", "jp"];
export type AvailableLocale = "id" | "en" | "jv" | "su" | "ja" | "jp";

export function timeAgoLocale(unix: number, lang: AvailableLocale): string {
    // Special case
    let realLang = lang;
    if (lang === "jp") {
        realLang = "ja";
    }
    // Create a new TimeAgo class.
    const timeAgo = new TimeAgo(realLang);
    // And then format it
    return timeAgo.format(DateTime.fromSeconds(unix, { zone: "UTC" }).toJSDate());
}
