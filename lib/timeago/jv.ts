/**
 * Javanese translation for javascript-time-ago module.
 * Originally by ECMAScript Intl
 * Modified by noaione <noaione0809@gmail.com>
 * With the help of Anonymous person
 * Created: 03 April 2021
 * Last Update: 06 April 2021
 *
 * (C) 2021 naoTimes Dev
 * MIT License
 */

import { LocaleData } from "javascript-time-ago";

const TimeAgoLocale: LocaleData = {
    locale: "jv",
    long: {
        year: {
            previous: "warsa kala wingi",
            current: "warsa puniki",
            next: "warsa ngajeng",
            past: "{0} warsa ingkang rumiyin",
            future: "lebet {0} warsa",
        },
        quarter: {
            previous: "triwulan rumiyin/kala wingi",
            current: "triwulan puniki",
            next: "triwulan saklajengipun",
            past: "{0} triwulan ingkang rumiyin",
            future: "lebet {0} triwulan",
        },
        month: {
            previous: "sasi kala wingi",
            current: "sasi puniki",
            next: "sasi ngajeng",
            past: "{0} sasi ingkang rumiyin",
            future: "lebet {0} sasi",
        },
        week: {
            previous: "minggu kala wingi",
            current: "minggu puniki",
            next: "minggu ngajeng",
            past: "{0} minggu kala wingi",
            future: "lebet {0} minggu",
        },
        day: {
            past: {
                one: "kemarin",
                two: "kemarin dulu",
                few: "{0} dinten kala wingi",
                many: "{0} dinten kala wingi",
                other: "{0} dinten kala wingi",
            },
            future: {
                one: "besok",
                two: "lusa",
                few: "lebet beberapa dinten",
                many: "lebet {0} dinten",
                other: "lebet {0} dinten",
            },
        },
        hour: {
            current: "setunggal tabuh malih",
            past: "{0} tabuh ingkang rumiyin",
            future: "lebet {0} tabuh",
        },
        minute: {
            current: "setunggal menit malih",
            past: "{0} menit lajeng",
            future: "lebet {0} menit",
        },
        second: {
            current: "sekedap detik malih",
            past: "{0} detik ingkang rumiyin",
            future: "lebet {0} detik",
        },
    },
    short: {
        year: {
            previous: "warsa kala wingi",
            current: "warsa puniki",
            next: "warsa ngajeng",
            past: "{0} warsa ingkang rumiyin",
            future: "lebet {0} warsa",
        },
        quarter: {
            previous: "trwln rumiyin/kala wingi",
            current: "trwln puniki",
            next: "trwln saklajengipun",
            past: "{0} trwln ingkang rumiyin",
            future: "lebet {0} trwln",
        },
        month: {
            previous: "sasi kala wingi",
            current: "sasi puniki",
            next: "sasi ngajeng",
            past: "{0} sasi ingkang rumiyin",
            future: "lebet {0} sasi",
        },
        week: {
            previous: "mgg kala wingi",
            current: "mgg puniki",
            next: "mgg ngajeng",
            past: "{0} mgg kala wingi",
            future: "lebet {0} mgg",
        },
        day: {
            past: {
                one: "kmrn",
                two: "kmrn dulu",
                few: "{0} dntn kala wingi",
                many: "{0} dntn kala wingi",
                other: "{0} dntn kala wingi",
            },
            future: {
                one: "esok",
                two: "lusa",
                few: "lebet beberapa dntn",
                many: "lebet {0} dntn",
                other: "lebet {0} dntn",
            },
        },
        hour: {
            current: "setunggal tabuh malih",
            past: "{0} tabuh ingkang rumiyin",
            future: "lebet {0} tbg",
        },
        minute: {
            current: "setunggal menit malih",
            past: "{0} menit lajeng",
            future: "lebet {0} mnt",
        },
        second: {
            current: "sekedap dtk malih",
            past: "{0} dtk ingkang rumiyin",
            future: "lebet {0} dtk",
        },
    },
    narrow: {
        year: {
            previous: "warsa kala wingi",
            current: "warsa puniki",
            next: "warsa ngajeng",
            past: "{0} warsa ingkang rumiyin",
            future: "lebet {0} warsa",
        },
        quarter: {
            previous: "trwln rumiyin/kala wingi",
            current: "trwln puniki",
            next: "trwln saklajengipun",
            past: "{0} trwln ingkang rumiyin",
            future: "lebet {0} trwln",
        },
        month: {
            previous: "sasi kala wingi",
            current: "sasi puniki",
            next: "sasi ngajeng",
            past: "{0} sasi ingkang rumiyin",
            future: "lebet {0} sasi",
        },
        week: {
            previous: "mgg kala wingi",
            current: "mgg puniki",
            next: "mgg ngajeng",
            past: "{0} mgg kala wingi",
            future: "lebet {0} mgg",
        },
        day: {
            past: {
                one: "kmrn",
                two: "kmrn dulu",
                few: "{0} dntn kala wingi",
                many: "{0} dntn kala wingi",
                other: "{0} dntn kala wingi",
            },
            future: {
                one: "esok",
                two: "lusa",
                few: "lebet beberapa dntn",
                many: "lebet {0} dntn",
                other: "lebet {0} dntn",
            },
        },
        hour: {
            current: "setunggal tabuh malih",
            past: "{0} tabuh ingkang rumiyin",
            future: "lebet {0} tbg",
        },
        minute: {
            current: "setunggal menit malih",
            past: "{0} menit lajeng",
            future: "lebet {0} mnt",
        },
        second: {
            current: "sekedap dtk malih",
            past: "{0} dtk ingkang rumiyin",
            future: "lebet {0} dtk",
        },
    },
    now: {
        now: {
            current: "sapunika ugi",
            past: "sekedap wekdal malih",
            future: "nembe mawon",
        },
    },
    mini: {
        year: "{0}wrs",
        month: "{0}sasi",
        week: "{0}mg",
        day: "{0}dnt",
        hour: "{0}tbh",
        minute: "{0}mnt",
        second: "{0}dtk",
    },
};

export default TimeAgoLocale;
