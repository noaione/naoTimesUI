/**
 * Malay localization
 * Created by niskala <niskala5570@gmail.com>
 * Based on Indonesian localization
 * Created: 25 July 2024
 * Last Update: 25 July 2024
 *
 * (C) 2024 naoTimes Dev
 * MIT License
 */

import { ExtendedLocale } from "./_types";

const TimeAgoLocale: ExtendedLocale = {
    locale: "ms",
    long: {
        year: {
            previous: "tahun lepas",
            current: "tahun ini",
            next: "tahun depan",
            past: "{0} tahun yang lepas",
            future: "dalam {0} tahun",
        },
        quarter: {
            previous: "Suku tahun lepas",
            current: "suku tahun ini",
            next: "suku tahun berikutnya",
            past: "{0} suku tahun yang lepas",
            future: "dalam {0} suku tahun",
        },
        month: {
            previous: "bulan lepas",
            current: "bulan ini",
            next: "bulan berikutnya",
            past: "{0} bulan yang lepas",
            future: "dalam {0} bulan",
        },
        week: {
            previous: "minggu lepas",
            current: "minggu ini",
            next: "minggu depan",
            past: "{0} minggu yang lepas",
            future: "dalam {0} minggu",
        },
        day: {
            previous: {
                one: "semalam",
                two: "kelmarin",
                other: "semalam",
            },
            current: "hari ini",
            next: {
                one: "esok",
                two: "lusa",
                other: "esok",
            },
            past: "{0} hari yang lepas",
            future: "dalam {0} hari",
        },
        hour: {
            current: "sejam lagi",
            past: "{0} jam yang lepas",
            future: "dalam {0} jam",
        },
        minute: {
            current: "seminit lagi",
            past: "{0} minit yang lepas",
            future: "dalam {0} minit",
        },
        second: {
            current: "sekarang",
            past: "{0} saat yang lepas",
            future: "dalam {0} saat",
        },
    },
    short: {
        year: {
            previous: "tahun lepas",
            current: "tahun ini",
            next: "tahun depan",
            past: "{0} thn lepas",
            future: "dlm {0} thn",
        },
        quarter: {
            previous: "Suku tahun lepas",
            current: "suku tahun ini",
            next: "suku tahun berikutnya",
            past: "{0} suku thn. lepas",
            future: "dlm {0} suku thn.",
        },
        month: {
            previous: "bulan lepas",
            current: "bulan ini",
            next: "bulan berikutnya",
            past: "{0} bln lepas",
            future: "dlm {0} bln",
        },
        week: {
            previous: "minggu lepas",
            current: "minggu ini",
            next: "minggu depan",
            past: "{0} mgg lepas",
            future: "dlm {0} mgg",
        },
        day: {
            previous: {
                one: "semalam",
                two: "kelmarin",
                other: "semalam",
            },
            current: "hari ini",
            next: {
                one: "esok",
                two: "lusa",
                other: "esok",
            },
            past: "{0} h lepas",
            future: "dalam {0} h",
        },
        hour: {
            current: "sejam lg",
            past: "{0} jam lepas",
            future: "dalam {0} jam",
        },
        minute: {
            current: "1 mnt lg",
            past: "{0} mnt lepas",
            future: "dlm {0} mnt",
        },
        second: {
            current: "sekarang",
            past: "{0} saat lepas",
            future: "dlm {0} saat",
        },
    },
    narrow: {
        year: {
            previous: "tahun lepas",
            current: "tahun ini",
            next: "tahun depan",
            past: "{0} thn lepas",
            future: "dlm {0} thn",
        },
        quarter: {
            previous: "Suku tahun lepas",
            current: "suku tahun ini",
            next: "suku tahun berikutnya",
            past: "{0} suku thn. lepas",
            future: "dlm {0} suku thn.",
        },
        month: {
            previous: "bulan lepas",
            current: "bulan ini",
            next: "bulan berikutnya",
            past: "{0} bln lepas",
            future: "dlm {0} bln",
        },
        week: {
            previous: "minggu lepas",
            current: "minggu ini",
            next: "minggu depan",
            past: "{0} mgg lepas",
            future: "dlm {0} mgg",
        },
        day: {
            previous: "kelmarin",
            current: "hari ini",
            next: "esok",
            past: "{0} h lepas",
            future: "dalam {0} h",
        },
        hour: {
            current: "sejam lagi",
            past: "{0} jam lepas",
            future: "dalam {0} jam",
        },
        minute: {
            current: "1 mnt lg",
            past: "{0} mnt lepas",
            future: "dlm {0} mnt",
        },
        second: {
            current: "sekarang",
            past: "{0} saat lepas",
            future: "dlm {0} saat",
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
        second: "{0}saat",
        now: "sekarang",
    },
    "short-time": {
        year: "{0} thn.",
        month: "{0} bln.",
        week: "{0} mg.",
        day: "{0} hr.",
        hour: "{0} jam.",
        minute: "{0} mnt.",
        second: "{0} saat.",
    },
    "long-time": {
        year: "{0} tahun",
        month: "{0} bulan",
        week: "{0} minggu",
        day: "{0} hari",
        hour: "{0} jam",
        minute: "{0} minit",
        second: "{0} saat",
    },
    // Default quantify from the module.
    quantify: (_n) => "other",
};

const Locale = {
    ROLES: {
        TL: "Terjemahan",
        TLC: "Semak Terjemahan",
        ENC: "Pengekod Video",
        ED: "Editor Skrip",
        TM: "Pelaras Waktu",
        TS: "Penata Huruf",
        QC: "Tinjauan Akhir",
    },
    NO_PROGRESS: "Belum ada kemajuan",
    AIRED: "Tayang {0}", // (Tayang) xx hari lepas
    AIRING: "Tayang {0}", // (Tayang) dalam xx hari lepas
    SEASON: {
        WINTER: "Musim Sejuk {0}",
        SPRING: "Musim Bunga {0}",
        SUMMER: "Musim Panas {0}",
        FALL: "Musim Luruh {0}",
    },
    DROPDOWN: {
        // {{episode}} will be substitued with remaining episode
        EXPAND: "Lihat {0} episode selanjutnya...",
        RETRACT: "Tutup...",
    },
    LAST_UPDATE: "Diperbaharui {0}",
    EPISODE_NEEDS: "perlu",
    WAITING_RELEASE: "Menunggu diterbit...",
    COLLAB_WITH: "Dengan kerjasama {0}",
};

export { Locale, TimeAgoLocale };
