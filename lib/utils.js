import axios from "axios";

export function isNone(data) {
    return data === null || data === undefined;
}

export function maybeStr(data) {
    if (typeof data === "number") {
        return data.toString();
    } else if (typeof data === "object") {
        return JSON.stringify(data);
    } else if (typeof data === "boolean") {
        return data ? "true" : "false";
    }
    return data;
}

// Implement a simple lodash has
export function has(objects, key) {
    if (Object.keys(objects).includes(key)) return true;
    return false;
}

export function roleColorPill(role) {
    role = role.toLowerCase();
    switch (role) {
        case "tl":
            return "bg-red-100 text-red-800 border-red-200";
        case "tlc":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "enc":
            return "bg-green-100 text-green-800 border-green-200";
        case "ed":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "ts":
            return "bg-purple-100 text-purple-800 border-purple-200";
        case "tm":
            return "bg-indigo-100 text-indigo-800 border-indigo-200";
        case "qc":
            return "bg-pink-200 text-pink-800 border-pink-300";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
}

export function roleToPrettyName(role) {
    role = role.toLowerCase();
    switch (role) {
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

export function roleToIDUserThingy(role) {
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

export function translateMonth(month) {
    switch (month.toLowerCase()) {
        case "january":
            return "Januari";
        case "february":
            return "Februari";
        case "march":
            return "Maret";
        case "may":
            return "Mei";
        case "june":
            return "Juni";
        case "july":
            return "Juli";
        case "august":
            return "Agustus";
        case "october":
            return "Oktober";
        case "december":
            return "Desember";
        case "aug":
            return "Agu";
        case "oct":
            return "Okt";
        case "dec":
            return "Des";
        default:
            return month;
    }
}

export function unixToWIB(unixTime) {
    const ms = unixTime * 1000;
    const date = new Date(ms);
    const month = translateMonth(date.toLocaleString("en-US", { month: "long" }));
    const firstPart = date.toLocaleString("en-US", { day: "2-digit" });
    const restOfTime = date.toLocaleString("en-US", {
        year: "numeric",
        hour: "2-digit",
        hour12: false,
        minute: "2-digit",
        timeZoneName: "short",
    });
    return `${firstPart} ${month} ${restOfTime}`;
}

export async function requestAPI(method, path, expectJSON = true) {
    const config = { method: method, url: `/api/${path}` };
    if (expectJSON) {
        config["responseType"] = "json";
    }
    try {
        const req = await axios(config);
        return req.data;
    } catch (err) {
        if (err.response) {
            return err.response.data;
        }
        return { message: `An internal occured, ${err.toString()}`, code: 500 };
    }
}

export async function requestAPISendData(method, path, jsonData) {
    try {
        const req = await axios({
            url: path,
            data: JSON.stringify(jsonData),
            method: method,
            headers: {
                "Content-Type": "application/json",
            },
        });
        return req.data;
    } catch (err) {
        if (err.response) {
            return err.response.data;
        }
        return { message: `An internal occured, ${err.toString()}`, code: 500, success: false };
    }
}
