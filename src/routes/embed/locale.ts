import TimeAgo from "javascript-time-ago";
import moment from "moment-timezone";
import id from "javascript-time-ago/locale/id";
import en from "javascript-time-ago/locale/en";

TimeAgo.addLocale(id);
TimeAgo.addLocale(en);

const ID = {
    ROLES: {
        TL: "Terjemahan",
        TLC: "Cek Terjemahan",
        ENC: "Olahan Video",
        ED: "Menggubah Skrip",
        TM: "Selaras Waktu",
        TS: "Tata Rias",
        QC: "Tinjauan Akhir",
    },
    NO_PROGRESS: "Belum ada progress",
    AIRED: "Tayang",
    AIRING: "Tayang",
    SEASON: {
        WINTER: "❄ Musim Dingin",
        SPRING: "🌸 Musim Semi",
        SUMMER: "🏖 Musim Panas",
        FALL: "🍂 Musim Gugur",
    },
    DROPDOWN: {
        EXPAND: "Lihat {{episode}} episode selanjutnya...",
        RETRACT: "Tutup...",
    },
    LAST_UPDATE: "Diperbaharui",
    EPISODE_NEEDS: "butuh",
    WAITING_RELEASE: "Menunggu dirilis...",
};
const EN = {
    ROLES: {
        TL: "Translating",
        TLC: "Translation Checking",
        ENC: "Encoding",
        ED: "Editing",
        TM: "Timing",
        TS: "Typesetting",
        QC: "Quality Checking",
    },
    NO_PROGRESS: "No progress",
    AIRED: "Aired",
    AIRING: "Airing",
    SEASON: {
        WINTER: "❄ Winter",
        SPRING: "🌸 Spring",
        SUMMER: "🏖 Summer",
        FALL: "🍂 Fall",
    },
    DROPDOWN: {
        EXPAND: "See next {{episode}} episode...",
        RETRACT: "Close...",
    },
    LAST_UPDATE: "Updated",
    EPISODE_NEEDS: "needs",
    WAITING_RELEASE: "Waiting for release...",
};

export function translate(key: keyof typeof ID, lang: "id" | "en") {
    if (lang === "id") {
        return ID[key];
    } else if (lang === "en") {
        return EN[key];
    }
    return EN[key];
}

export function timeAgoLocale(time: number, lang: "id" | "en" = "id"): string {
    const timeAgo = new TimeAgo(lang);
    return timeAgo.format(moment.utc(time * 1000).toDate());
}
