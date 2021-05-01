import cors from "cors";
import { has } from "lodash";
import { DateTime } from "luxon";
import { NextApiRequest, NextApiResponse } from "next";

import dbConnect from "../../../../lib/dbConnect";
import { determineSeason, isNone, Nullable, seasonNaming } from "../../../../lib/utils";

import { ShowAnimeProps, ShowtimesModel } from "../../../../models/show";

const corsMiddleware = cors({
    methods: ["GET", "HEAD"],
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: typeof corsMiddleware) {
    return new Promise((resolve, reject) => {
        fn(req, res, (err) => {
            if (err instanceof Error) {
                return reject(err);
            }
            return resolve(err);
        });
    });
}

function selectServerID(serverId: string | string[]): string {
    if (Array.isArray(serverId)) {
        return serverId[0];
    }
    return serverId;
}

interface IResultOldDataset {
    id: string;
    title: string;
    episode: string | number;
    airing_time: number;
    staff: {
        TL: string;
        TLC: string;
        Encode: string;
        Edit: string;
        TS: string;
        Timing: string;
        QC: string;
    };
    status: {
        TL: boolean;
        TLC: boolean;
        Encode: boolean;
        Edit: boolean;
        TS: boolean;
        Timing: boolean;
        QC: boolean;
    };
}

interface IResultsOldStyles {
    data: IResultOldDataset[];
    name: string;
    total_data: number;
}

interface IResultOldSeasonKey {
    [season: string]: IResultsOldStyles;
}

function keyNamingRole(key: string) {
    switch (key) {
        case "ED":
            return "Edit";
        case "TM":
            return "Timing";
        case "ENC":
            return "Encode";
        default:
            return key;
    }
}

function parseStatusOldStyles(animeData: ShowAnimeProps[]): IResultOldSeasonKey {
    const seasonKeys: IResultOldSeasonKey = {};
    animeData.forEach((anime) => {
        let fetched = false;
        anime.status.forEach((status) => {
            if (!status.is_done && !fetched) {
                fetched = true;
                const mm = DateTime.fromSeconds(status.airtime, { zone: "UTC" });
                const seasonNo: number = determineSeason(mm.month);
                const year = mm.year;
                const ySeason = `${year}_${seasonNo}`;
                if (!has(seasonKeys, ySeason)) {
                    seasonKeys[ySeason] = {
                        data: [],
                        name: `${seasonNaming(seasonNo as 0 | 1 | 2 | 3)} ${year}`,
                        total_data: 0,
                    };
                }
                const newStatus = {};
                // eslint-disable-next-line no-restricted-syntax
                for (const [key, val] of Object.entries(status.progress)) {
                    newStatus[keyNamingRole(key)] = val;
                }
                const staffAssigned = {};
                // eslint-disable-next-line no-restricted-syntax
                for (const [staff, staffData] of Object.entries(anime.assignments)) {
                    staffAssigned[keyNamingRole(staff)] = staffData.name || "Tidak diketahui";
                }
                const dataToAdd: IResultOldDataset = {
                    id: anime.id,
                    title: anime.title,
                    episode: status.episode.toString(),
                    airing_time: status.airtime,
                    // @ts-ignore
                    status: newStatus,
                    // @ts-ignore
                    staff: staffAssigned,
                };
                seasonKeys[ySeason].data.push(dataToAdd);
                seasonKeys[ySeason].total_data++;
            }
        });
    });
    return seasonKeys;
}

export default async function serverStatusHandler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, corsMiddleware);

    const { serverid } = req.query;
    try {
        let animeSets: Nullable<ShowAnimeProps[]>;
        try {
            await dbConnect();
            const serverRes = await ShowtimesModel.findOne({ id: { $eq: selectServerID(serverid) } });
            // @ts-ignore
            animeSets = serverRes.anime;
            if (isNone(animeSets)) {
                res.status(404).json({ message: "Cannot find that server", status_code: 404 });
            } else {
                const results = parseStatusOldStyles(animeSets);
                res.json(results);
            }
        } catch (e) {
            res.status(404).json({ message: "Cannot find that server", status_code: 404 });
        }
        if (isNone(animeSets)) {
            res.status(404).json({ message: "Cannot find that server", status_code: 404 });
        } else {
            // parse
        }
    } catch (e) {
        res.status(500).json({ message: `An error occured, ${e.toString()}`, status_code: 500 });
    }
}
