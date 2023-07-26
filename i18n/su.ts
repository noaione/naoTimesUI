/**
 * Sundanese localization
 * Created by noaione <noaione0809@gmail.com>
 * Created: 04 April 2021
 * Last Update: 12 April 2021
 *
 * (C) 2021 naoTimes Dev
 * MIT License
 */

import { ExtendedLocale } from "./_types";

const TimeAgoLocale: ExtendedLocale = {
    // @ts-ignore
    locale: "su",
    long: {
        year: {
            previous: "taun kapungkur",
            current: "taun ayeuna",
            next: "taun payun",
            past: "{0} taun nu kapungkur",
            future: "tina {0} taun",
        },
        quarter: {
            previous: "saparapat taun kapungkur",
            current: "saparapat taun ayeuna",
            next: "saparapat taun deui",
            past: "{0} saparapat taun kapungkur",
            future: "tina {0} saparapat taun",
        },
        month: {
            previous: "sasih kapungkur",
            current: "sasih ayeuna",
            next: "sasih payun",
            past: "{0} sasih nu kapungkur",
            future: "tina {0} sasih",
        },
        week: {
            previous: "minggu kapungkur",
            current: "minggu ayeuna",
            next: "minggu payun",
            past: "{0} minggu nu kapungkur",
            future: "tina {0} minggu",
        },
        day: {
            previous: "poe kapungkur",
            current: "poe ayeuna",
            next: "poe payun",
            past: "{0} poe nu kapungkur",
            future: "tina {0} poe",
        },
        hour: {
            current: "sejam deui",
            past: "{0} jam nu kapungkur",
            future: "tina {0} jam",
        },
        minute: {
            current: "semenit deui",
            past: "{0} menit nu kapungkur",
            future: "tina {0} menit",
        },
        second: {
            current: "sababaraha detik deui",
            past: "{0} detik nu kapungkur",
            future: "tina {0} detik",
        },
    },
    now: {
        now: {
            current: "ayeuna",
            future: "sakedap deui",
            past: "nembe",
        },
    },
    quantify: (_n) => "other",
};

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
    NO_PROGRESS: "Tacan aya kemajuan",
    AIRED: "Tayang {0}", // (Tayang) xx hari lalu
    AIRING: "Tayang {0}", // (Tayang) dalam xx hari lalu
    SEASON: {
        // {0} will be replace by year
        WINTER: "Usum Tiris {0}",
        SPRING: "Cinyusu {0}",
        SUMMER: "Usum Panas {0}",
        FALL: "Usum Muguran {0}",
    },
    DROPDOWN: {
        // {0} will be substitued with remaining episode
        EXPAND: "Tingali {0} episode salajengna...",
        RETRACT: "Tutup...",
    },
    LAST_UPDATE: "Diropéa {0}",
    EPISODE: "Episode {0}",
    EPISODE_NEEDS: "Episode {0} peryogi",
    WAITING_RELEASE: "Ngantosan dirilis...",
    COLLAB_WITH: "Babarengan jeung {0}",
};

export { Locale, TimeAgoLocale };
