/**
 * Indonesian localization
 * Created by noaione <noaione0809@gmail.com>
 * With the help from Kresendo
 * Created: 04 April 2021
 * Last Update: 04 April 2021
 *
 * (C) 2021 naoTimes Dev
 * MIT License
 */

import { ExtendedLocale } from "./_types";

const TimeAgoLocale: ExtendedLocale = {
    locale: "id",
    long: {
        year: {
            previous: "tahun lalu",
            current: "tahun ini",
            next: "tahun depan",
            past: "{0} tahun yang lalu",
            future: "dalam {0} tahun",
        },
        quarter: {
            previous: "Kuartal lalu",
            current: "kuartal ini",
            next: "kuartal berikutnya",
            past: "{0} kuartal yang lalu",
            future: "dalam {0} kuartal",
        },
        month: {
            previous: "bulan lalu",
            current: "bulan ini",
            next: "bulan berikutnya",
            past: "{0} bulan yang lalu",
            future: "dalam {0} bulan",
        },
        week: {
            previous: "minggu lalu",
            current: "minggu ini",
            next: "minggu depan",
            past: "{0} minggu yang lalu",
            future: "dalam {0} minggu",
        },
        day: {
            previous: {
                one: "kemarin",
                two: "kemarin dulu",
                other: "kemarin",
            },
            current: "hari ini",
            next: {
                one: "besok",
                two: "lusa",
                other: "besok",
            },
            past: "{0} hari yang lalu",
            future: "dalam {0} hari",
        },
        hour: {
            current: "sejam lagi",
            past: "{0} jam yang lalu",
            future: "dalam {0} jam",
        },
        minute: {
            current: "semenit lagi",
            past: "{0} menit yang lalu",
            future: "dalam {0} menit",
        },
        second: {
            current: "sekarang",
            past: "{0} detik yang lalu",
            future: "dalam {0} detik",
        },
    },
    short: {
        year: {
            previous: "tahun lalu",
            current: "tahun ini",
            next: "tahun depan",
            past: "{0} thn lalu",
            future: "dlm {0} thn",
        },
        quarter: {
            previous: "Kuartal lalu",
            current: "kuartal ini",
            next: "kuartal berikutnya",
            past: "{0} krtl. lalu",
            future: "dlm {0} krtl.",
        },
        month: {
            previous: "bulan lalu",
            current: "bulan ini",
            next: "bulan berikutnya",
            past: "{0} bln lalu",
            future: "dlm {0} bln",
        },
        week: {
            previous: "minggu lalu",
            current: "minggu ini",
            next: "minggu depan",
            past: "{0} mgg lalu",
            future: "dlm {0} mgg",
        },
        day: {
            previous: {
                one: "kemarin",
                two: "kemarin dulu",
                other: "kemarin",
            },
            current: "hari ini",
            next: {
                one: "besok",
                two: "lusa",
                other: "besok",
            },
            past: "{0} h lalu",
            future: "dalam {0} h",
        },
        hour: {
            current: "sejam lg",
            past: "{0} jam lalu",
            future: "dalam {0} jam",
        },
        minute: {
            current: "1 mnt lg",
            past: "{0} mnt lalu",
            future: "dlm {0} mnt",
        },
        second: {
            current: "sekarang",
            past: "{0} dtk lalu",
            future: "dlm {0} dtk",
        },
    },
    narrow: {
        year: {
            previous: "tahun lalu",
            current: "tahun ini",
            next: "tahun depan",
            past: "{0} thn lalu",
            future: "dlm {0} thn",
        },
        quarter: {
            previous: "Kuartal lalu",
            current: "kuartal ini",
            next: "kuartal berikutnya",
            past: "{0} krtl. lalu",
            future: "dlm {0} krtl.",
        },
        month: {
            previous: "bulan lalu",
            current: "bulan ini",
            next: "bulan berikutnya",
            past: "{0} bln lalu",
            future: "dlm {0} bln",
        },
        week: {
            previous: "minggu lalu",
            current: "minggu ini",
            next: "minggu depan",
            past: "{0} mgg lalu",
            future: "dlm {0} mgg",
        },
        day: {
            previous: "kemarin",
            current: "hari ini",
            next: "besok",
            past: "{0} h lalu",
            future: "dalam {0} h",
        },
        hour: {
            current: "sejam lagi",
            past: "{0} jam lalu",
            future: "dalam {0} jam",
        },
        minute: {
            current: "1 mnt lg",
            past: "{0} mnt lalu",
            future: "dlm {0} mnt",
        },
        second: {
            current: "sekarang",
            past: "{0} dtk lalu",
            future: "dlm {0} dtk",
        },
    },
    now: {
        now: {
            current: "sekarang",
            future: "beberapa saat lagi",
            past: "baru saja",
        },
    },
    mini: {
        year: "{0}thn",
        month: "{0}bln",
        week: "{0}mg",
        day: "{0}hr",
        hour: "{0}jam",
        minute: "{0}mnt",
        second: "{0}dtk",
        now: "sekarang",
    },
    "short-time": {
        year: "{0} thn.",
        month: "{0} bln.",
        week: "{0} mg.",
        day: "{0} hr.",
        hour: "{0} jam.",
        minute: "{0} mnt.",
        second: "{0} dtk.",
    },
    "long-time": {
        year: "{0} tahun",
        month: "{0} bulan",
        week: "{0} minggu",
        day: "{0} hari",
        hour: "{0} jam",
        minute: "{0} menit",
        second: "{0} detik",
    },
    // Default quantify from the module.
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
    NO_PROGRESS: "Belum ada progres",
    AIRED: "Tayang {0}", // (Tayang) xx hari lalu
    AIRING: "Tayang {0}", // (Tayang) dalam xx hari lalu
    SEASON: {
        WINTER: "Musim Dingin {0}",
        SPRING: "Musim Semi {0}",
        SUMMER: "Musim Panas {0}",
        FALL: "Musim Gugur {0}",
    },
    DROPDOWN: {
        // {{episode}} will be substitued with remaining episode
        EXPAND: "Lihat {0} episode selanjutnya...",
        RETRACT: "Tutup...",
    },
    LAST_UPDATE: "Diperbarui {0}",
    EPISODE_NEEDS: "butuh",
    WAITING_RELEASE: "Menunggu dirilis...",
    COLLAB_WITH: "Barengan sama {0}",
};

export { Locale, TimeAgoLocale };
