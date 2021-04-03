/**
 * Sundanese translation for javascript-time-ago module.
 * Created by noaione <noaione0809@gmail.com>
 * With the help of Kresendo <>
 * Created: 03 April 2021
 * Last Update: 03 April 2021
 *
 * (C) 2021 naoTimes Dev
 * MIT License
 */

import { ExtendedLocale } from "./_types";

const Locale: ExtendedLocale = {
    locale: "su",
    long: {
        year: {
            previous: "taun kamari",
            current: "taun ieu",
            next: "taun hareup",
            past: "{0} taun kamari",
            future: "tina {0} taun",
        },
        quarter: {
            previous: "kuartal kamari",
            current: "kuartal ieu",
            next: "kuartal hareup",
            past: "{0} bulan kamari",
            future: "tina {0} bulan deui",
        },
        month: {
            previous: "bulan kamari",
            current: "bulan ieu",
            next: "bulan hareup",
            past: "{0} bulan kamari",
            future: "tina {0} bulan deui",
        },
        week: {
            previous: "minggu kamari",
            current: "minggu ieu",
            next: "minggu hareup",
            past: "{0} minggu kamari",
            future: "tina {0} minggu deui",
        },
        day: {
            previous: "kamari",
            current: "",
            next: "",
            past: "{0} dinten kamari",
            future: "",
        },
        hour: {
            current: "",
            past: "",
            future: "",
        },
        minute: {
            current: "menit ieu",
            past: "menit kamari",
            future: "menit deui",
        },
        second: {
            current: "",
            past: "",
            future: "",
        },
    },
    now: {
        now: {
            current: "",
            future: "",
            past: "",
        },
    },
    quantify: (_n) => {
        return "other";
    },
};

export default Locale;
