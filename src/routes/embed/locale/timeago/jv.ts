/**
 * Javanese translation for javascript-time-ago module.
 * Originally by ECMAScript Intl
 * Modified by noaione <noaione0809@gmail.com>
 * Created: 03 April 2021
 * Last Update: 03 April 2021
 *
 * (C) 2021 naoTimes Dev
 * MIT License
 */

import { ExtendedLocale } from "./_types";

const Locale: ExtendedLocale = {
    locale: "jv",
    long: {
        year: {
            previous: "taun wingi",
            current: "taun iki",
            next: "taun ngarep",
            past: "-{0} y",
            future: "+{0} y",
        },
        quarter: {
            previous: "last quarter",
            current: "this quarter",
            next: "next quarter",
            past: "-{0} Q",
            future: "+{0} Q",
        },
        month: {
            previous: "sasi wingi",
            current: "sasi iki",
            next: "sasi ngarep",
            past: "-{0} m",
            future: "+{0} m",
        },
        week: {
            previous: "pekan wingi",
            current: "pekan iki",
            next: "pekan ngarep",
            past: "-{0} w",
            future: "+{0} w",
        },
        day: {
            previous: "wingi",
            current: "saiki",
            next: "sesuk",
            past: "-{0} d",
            future: "+{0} d",
        },
        hour: {
            current: "this hour",
            past: "-{0} h",
            future: "+{0} h",
        },
        minute: {
            current: "this minute",
            past: "-{0} min",
            future: "+{0} min",
        },
        second: {
            current: "now",
            past: "-{0} s",
            future: "+{0} s",
        },
    },
    short: {
        year: {
            previous: "taun wingi",
            current: "taun iki",
            next: "taun ngarep",
            past: "-{0} y",
            future: "+{0} y",
        },
        quarter: {
            previous: "last quarter",
            current: "this quarter",
            next: "next quarter",
            past: "-{0} Q",
            future: "+{0} Q",
        },
        month: {
            previous: "sasi wingi",
            current: "sasi iki",
            next: "sasi ngarep",
            past: "-{0} m",
            future: "+{0} m",
        },
        week: {
            previous: "pekan wingi",
            current: "pekan iki",
            next: "pekan ngarep",
            past: "-{0} w",
            future: "+{0} w",
        },
        day: {
            previous: "wingi",
            current: "saiki",
            next: "sesuk",
            past: "-{0} d",
            future: "+{0} d",
        },
        hour: {
            current: "this hour",
            past: "-{0} h",
            future: "+{0} h",
        },
        minute: {
            current: "this minute",
            past: "-{0} min",
            future: "+{0} min",
        },
        second: {
            current: "now",
            past: "-{0} s",
            future: "+{0} s",
        },
    },
    narrow: {
        year: {
            previous: "taun wingi",
            current: "taun iki",
            next: "taun ngarep",
            past: "-{0} y",
            future: "+{0} y",
        },
        quarter: {
            previous: "last quarter",
            current: "this quarter",
            next: "next quarter",
            past: "-{0} Q",
            future: "+{0} Q",
        },
        month: {
            previous: "sasi wingi",
            current: "sasi iki",
            next: "sasi ngarep",
            past: "-{0} m",
            future: "+{0} m",
        },
        week: {
            previous: "pekan wingi",
            current: "pekan iki",
            next: "pekan ngarep",
            past: "-{0} w",
            future: "+{0} w",
        },
        day: {
            previous: "wingi",
            current: "saiki",
            next: "sesuk",
            past: "-{0} d",
            future: "+{0} d",
        },
        hour: {
            current: "this hour",
            past: "-{0} h",
            future: "+{0} h",
        },
        minute: {
            current: "this minute",
            past: "-{0} min",
            future: "+{0} min",
        },
        second: {
            current: "now",
            past: "-{0} s",
            future: "+{0} s",
        },
    },
    now: {
        now: {
            current: "saiki",
            past: "-{0} s",
            future: "+{0} s",
        },
    },
    quantify: (_n) => {
        return "other";
    },
};

export default Locale;
