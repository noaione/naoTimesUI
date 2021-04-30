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

import { ExtendedLocale } from "./_types";

const TimeAgoLocale: ExtendedLocale = {
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
            previous: "kala wingi",
            current: "dinten puniki",
            next: {
                one: "benjing",
                two: "mben",
                other: "benjing",
            },
            past: "{0} dinten kala wingi",
            future: "lebet {0} dinten",
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
    now: {
        now: {
            current: "sapunika ugi",
            past: "sekedap wekdal malih",
            future: "nembe mawon",
        },
    },
    quantify: (_n) => "other",
};

/**
 * Javanese localization
 * Created by noaione <noaione0809@gmail.com>
 * Created: 04 April 2021
 * Last Update: 12 April 2021
 *
 * (C) 2021 naoTimes Dev
 * MIT License
 */

const Locale = {
    ROLES: {
        TL: "Terjemahan",
        TLC: "Cek Terjemahan",
        ENC: "Olahan Video",
        ED: "Menggubah Skrip",
        TM: "Selaras Waktu",
        TS: "Tata Rias",
        QC: "Tinjauan Akhir",
    },
    NO_PROGRESS: "Durung ana kemajuan",
    AIRED: "Siaran {0}", // (Tayang) xx hari lalu
    AIRING: "Siaran {0}", // (Tayang) dalam xx hari lalu
    SEASON: {
        WINTER: "Mangsa Adhem {0}",
        SPRING: "Mangsa Semi {0}",
        SUMMER: "Mangsa Panas {0}",
        FALL: "Mangsa Gugur {0}",
    },
    DROPDOWN: {
        // {{episode}} will be substitued with remaining episode
        EXPAND: "Deleng {0} episode sabanjure...",
        RETRACT: "Tutup...",
    },
    LAST_UPDATE: "Dianyari {0}",
    EPISODE_NEEDS: "betah",
    WAITING_RELEASE: "Ngenteni dirilis...",
};

export { Locale, TimeAgoLocale };
