import { get, has } from "lodash";
import moment from "moment-timezone";

import { ShowAnimeProps, ShowtimesProps } from "../models/show";

export type Nullable<T> = T | null;
export type NoneType = null | undefined;
export type NoneAble<T> = T | NoneType;
export type JSTypeof =
    | "string"
    | "function"
    | "bigint"
    | "number"
    | "boolean"
    | "undefined"
    | "object"
    | "symbol"
    | "array"; // Extra addition

export function isNone(value: any): value is NoneType {
    return typeof value === "undefined" || value === null;
}

/**
 * Convert a string/number to a number using fallback if it's NaN (Not a number).
 * If fallback is not specified, it will return to_convert.
 * @param cb parseFloat or parseInt function that will be run
 * @param to_convert number or string to convert
 * @param fallback fallback number
 */
export function fallbackNaN<F extends Function, T, S>(cb: F, to_convert: T, fallback?: S): T | S {
    if (Number.isNaN(cb(to_convert))) {
        return isNone(fallback) ? to_convert : fallback;
    }
    return cb(to_convert);
}

export function determineSeason(month: number): number {
    if (month >= 0 && month <= 2) {
        return 0;
    }
    if (month >= 3 && month <= 5) {
        return 1;
    }
    if (month >= 6 && month <= 8) {
        return 2;
    }
    if (month >= 9 && month <= 11) {
        return 3;
    }
    if (month >= 12) {
        return 0;
    }
}

export function seasonNaming(season: 0 | 1 | 2 | 3): string {
    let seasonName: string;
    switch (season) {
        case 0:
            seasonName = "Winter";
            break;
        case 1:
            seasonName = "Spring";
            break;
        case 2:
            seasonName = "Summer";
            break;
        case 3:
            seasonName = "Fall";
            break;
        default:
            seasonName = "Unknown";
            break;
    }
    return seasonName;
}

export function filterToSpecificAnime(results: ShowtimesProps, anime_id: string) {
    const animeLists = results.anime.filter((res) => res.id === anime_id);
    return animeLists;
}

export function verifyExist(data: any, key: string, expected: JSTypeof) {
    if (isNone(data)) return false;
    if (isNone(data[key])) return false;
    if (expected === "array") {
        return Array.isArray(data[key]);
    }
    if (typeof data[key] !== expected) return false;
    return true;
}

export function romanizeNumber(number: number): string {
    if (Number.isNaN(number)) {
        return "NaN";
    }
    const digits = String(+number).split("");
    const romankeys = [
        "",
        "C",
        "CC",
        "CCC",
        "CD",
        "D",
        "DC",
        "DCC",
        "DCCC",
        "CM",
        "",
        "X",
        "XX",
        "XXX",
        "XL",
        "L",
        "LX",
        "LXX",
        "LXXX",
        "XC",
        "",
        "I",
        "II",
        "III",
        "IV",
        "V",
        "VI",
        "VII",
        "VIII",
        "IX",
    ];
    let roman = "";
    let i = 3;
    while (i--) {
        roman = (romankeys[+digits.pop() + i * 10] || "") + roman;
    }
    return Array(+digits.join("") + 1).join("M") + roman;
}

function rgbHexToRGBInt(hexStr: Nullable<string>): number {
    if (isNone(hexStr)) return 2012582;
    const hexedStr = hexStr.replace("#", "").toUpperCase();
    const R = parseInt(hexedStr.slice(0, 2), 16);
    const G = parseInt(hexedStr.slice(2, 4), 16);
    const B = parseInt(hexedStr.slice(4, 6), 16);
    return 256 * 256 * R + 256 * G + B;
}

function parseAnilistDate(dateKey: { year?: number; month?: number; day?: number }): Nullable<number> {
    const extensions = [];
    const dates = [];

    // Year
    const year = get(dateKey, "year", null);
    if (!isNone(year)) {
        extensions.push("YYYY");
        dates.push(year.toString());
    }

    // Month
    const month = get(dateKey, "month", null);
    if (!isNone(year)) {
        extensions.push("M");
        dates.push(month.toString());
    }

    // Day
    const day = get(dateKey, "day", null);
    if (!isNone(year)) {
        extensions.push("D");
        dates.push(day.toString());
    }

    if (dates.length < 2) {
        // Not enough data
        return null;
    }
    const parsed = moment(dates.join("-"), extensions.join("-"), true);
    return parsed.unix();
}

function intToStr(numberino: any): string {
    if (isNone(numberino)) return null;
    try {
        return numberino.toString();
    } catch (_e) {
        return null;
    }
}

function multiplyAnilistDate(startTime: number, episode: number): number {
    const WEEKS = 7 * 24 * 60 * 60;
    let expected = startTime;
    for (let i = 0; i < episode; i++) {
        expected += WEEKS;
    }
    return expected;
}

export function parseAnilistAPIResult(originalData: any, expected_episode = 1) {
    let rawResults = originalData;
    if (has(originalData, "data") && has(originalData.data, "Media")) {
        rawResults = originalData.data.Media;
    }
    // This will convert the data to the database format
    const anilistId = intToStr(rawResults.id);
    const malId = intToStr(rawResults.idMal);
    const animeTitle = get(rawResults, "title", {});
    const realTitle = animeTitle.romaji || animeTitle.english || animeTitle.native;
    const { coverImage } = rawResults;

    const startDate = parseAnilistDate(rawResults.startDate);

    // @ts-ignore
    const compiledData: ShowAnimeProps = {
        id: anilistId,
        mal_id: malId,
        title: realTitle,
        start_time: startDate,
        poster_data: {
            color: rgbHexToRGBInt(coverImage.color),
            url: coverImage.large || coverImage.medium,
        },
        status: [],
        aliases: [],
        kolaborasi: [],
        last_update: moment.utc().unix(),
    };

    const airingSchedules: any[] = get(rawResults, "airingSchedule.nodes", []);
    if (airingSchedules.length < 1 && isNone(startDate)) return compiledData;
    if (airingSchedules.length < 1) {
        for (let i = 0; i < expected_episode; i++) {
            let airingTime = null;
            if (!isNone(startDate)) {
                airingTime = multiplyAnilistDate(startDate, i + 1);
            }
            const statusSets = {
                episode: i + 1,
                is_done: false,
                progress: {
                    TL: false,
                    TLC: false,
                    ENC: false,
                    ED: false,
                    TM: false,
                    TS: false,
                    QC: false,
                },
                airtime: airingTime,
            };
            compiledData.status.push(statusSets);
        }
    } else {
        airingSchedules.forEach((node) => {
            let airtime = node.airingAt || null;
            if (isNone(airtime) && !isNone(startDate)) {
                airtime = multiplyAnilistDate(startDate, node.episode);
            }
            const statusSets = {
                episode: node.episode,
                is_done: false,
                progress: {
                    TL: false,
                    TLC: false,
                    ENC: false,
                    ED: false,
                    TM: false,
                    TS: false,
                    QC: false,
                },
                airtime,
            };
            compiledData.status.push(statusSets);
        });
    }

    return compiledData;
}
