import axios, { AxiosResponse } from "axios";

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

export function mapBoolean<T>(input_data: T): boolean {
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

export function expandRoleLocalized(role: string, fallback: string = null) {
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
            return fallback || role;
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
