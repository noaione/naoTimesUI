import axios, { AxiosResponse } from "axios";
import { DateTime } from "luxon";
import { get, has } from "lodash";

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
export type RoleProject = "TL" | "TLC" | "ENC" | "ED" | "TM" | "TS" | "QC";

export interface AssignmentsData {
    id: string;
    name?: string;
}

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

/**
 * Check if two string array is different or not.
 *
 * It first check if there's any length difference, if there's just say yes
 * since it's already different.
 *
 * If the length is same, sort both of them, and create a simple for-loop
 * which will check if the same index of array1 and array2 is different or not.
 * If different, break the loop and return as true, otherwise false.
 *
 * Can be bad if the array is big, but who cares.
 * @param array1 First string array collection
 * @param array2 Second string array collection
 * @returns is the array different or not?
 */
export function isDifferent(array1: string[], array2: string[]) {
    if (array1.length !== array2.length) {
        return true;
    }
    let unmatching = false;
    array1.sort();
    array2.sort();
    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i]) {
            unmatching = true;
            break;
        }
    }
    return unmatching;
}

export function mapBoolean<T extends any>(input_data: T): boolean {
    if (isNone(input_data)) {
        return false;
    }
    let fstat = false;
    let data: any;
    if (typeof input_data === "string") {
        data = input_data.toLowerCase() as string;
    } else if (typeof input_data === "number") {
        data = input_data.toString().toLowerCase() as string;
    } else if (typeof input_data === "object") {
        data = JSON.stringify(input_data);
    } else {
        // @ts-ignore
        data = input_data.toString().toLowerCase();
    }
    switch (data) {
        case "y":
            fstat = true;
            break;
        case "enable":
            fstat = true;
            break;
        case "true":
            fstat = true;
            break;
        case "1":
            fstat = true;
            break;
        case "yes":
            fstat = true;
            break;
        default:
            break;
    }
    return fstat;
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
    return -1;
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
        // @ts-ignore
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
        extensions.push("yyyy");
        dates.push(year.toString());
    }

    // Month
    const month = get(dateKey, "month", null);
    if (!isNone(month)) {
        extensions.push("M");
        dates.push(month.toString());
    }

    // Day
    const day = get(dateKey, "day", null);
    if (!isNone(day)) {
        extensions.push("d");
        dates.push(day.toString());
    }

    if (dates.length < 2) {
        // Not enough data
        return null;
    }
    const parsed = DateTime.fromFormat(dates.join("-"), extensions.join("-"), { zone: "UTC" });
    return Math.floor(parsed.toSeconds());
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

interface AiringNode {
    id: string;
    episode: number;
    airingAt?: number;
}

function prefillAiringSchedule(airingSchedules: AiringNode[], expected = 1) {
    if (airingSchedules.length >= expected) {
        return airingSchedules;
    }
    const newSchedules: AiringNode[] = [];
    const firstEpisode = airingSchedules[0].episode;
    if (firstEpisode !== 1) {
        // prefill left.
        for (let i = 1; i < firstEpisode; i++) {
            newSchedules.push({
                id: `prefilled-ep-${i}`,
                episode: i,
                airingAt: undefined,
            });
        }
    }
    newSchedules.push(...airingSchedules);
    if (newSchedules.length < expected) {
        // prefill right.
        for (let i = newSchedules.length; i < expected; i++) {
            newSchedules.push({
                id: `prefilled-ep-${i}`,
                episode: i,
                airingAt: undefined,
            });
        }
    }
    return newSchedules;
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
        last_update: Math.floor(DateTime.utc().toSeconds()),
    };

    let airingSchedules: AiringNode[] = get(rawResults, "airingSchedule.nodes", []);
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
        airingSchedules = prefillAiringSchedule(airingSchedules, expected_episode);
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

export function expandRoleName(role: string) {
    const loweredRole = role.toLowerCase();
    switch (loweredRole) {
        case "enc":
            return "Encode";
        case "ed":
            return "Edit";
        case "tm":
            return "Timing";
        default:
            return role.toUpperCase();
    }
}

export function expandRoleLocalized(role: string) {
    const roleCased = role.toLowerCase();
    switch (roleCased) {
        case "tl":
            return "Penerjemah";
        case "tlc":
            return "Pemeriksa Terjemahan";
        case "enc":
            return "Peramu Video";
        case "ed":
            return "Penyunting";
        case "ts":
            return "Penata Rias";
        case "tm":
            return "Penyesuai Waktu";
        case "qc":
            return "Pemeriksa Akhir";
        default:
            return role;
    }
}

export function getAssigneeName(assignments: AssignmentsData) {
    if (!assignments) {
        return "Tidak diketahui";
    }
    if (!assignments.name) {
        return "Tidak diketahui";
    }
    const getname = assignments.name;
    const splitName = getname.split("#");
    return splitName.slice(0, splitName.length === 1 ? 1 : splitName.length - 1).join("#");
}

export async function parseFeed(url: string) {
    let axiosResp: AxiosResponse<any>;
    try {
        axiosResp = await axios.get("/api/feedcors", {
            headers: {
                "User-Agent": "naoTimesUI/1.1.0 (+https://github.com/noaione/naoTimesUI)",
            },
            responseType: "json",
            params: {
                url,
            },
        });
    } catch (e) {
        return [false, "Gagal mengambil RSS!"];
    }

    if (axiosResp.status !== 200) {
        return [false, `Terjadi kesalahan, ${axiosResp.statusText}`];
    }

    return [true, axiosResp.data];
}
