/**
 * Sundanese translation for javascript-time-ago module.
 * Created by noaione <noaione0809@gmail.com>
 * With the help of anonymous
 * Created: 03 April 2021
 * Last Update: 12 April 2021
 *
 * (C) 2021 naoTimes Dev
 * MIT License
 */

import { ExtendedLocale } from "./_types";

const Locale: ExtendedLocale = {
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
    quantify: (_n) => {
        return "other";
    },
};

export default Locale;
