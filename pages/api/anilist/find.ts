import { NextApiRequest, NextApiResponse } from "next";

import axios from "axios";

import withSession from "../../../lib/session";
import { isNone, Nullable } from "../../../lib/utils";
import _ from "lodash";

interface SessionClass {
    get<T extends any>(key: string): Nullable<T>;
}

const SearchAnimeQuery = `
query ($search:String) {
    Page (page:1,perPage:10) {
        media(search:$search,type:ANIME) {
            id
            idMal
            format
            season
            seasonYear
            episodes
            startDate {
                year
            }
            title {
                romaji
                native
                english
            }
            coverImage {
                medium
                large
                extraLarge
            }
        }
    }
}
`;

async function searchAnime(query: string): Promise<any[]> {
    const req = await axios.post(
        "https://graphql.anilist.co",
        { query: SearchAnimeQuery, variables: { search: query } },
        {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            responseType: "json",
        }
    );
    const res = req.data;
    return _.get(res, "data.Page.media", []);
}

export default withSession(async (req: NextApiRequest & { session: SessionClass }, res: NextApiResponse) => {
    const queryParams = _.get(req.query, "q", _.get(req.query, "term"));
    if (isNone(queryParams)) {
        return res.status(400).json({ results: [] });
    }
    let selectedQuery: string;
    if (Array.isArray(queryParams)) {
        selectedQuery = queryParams[0].toString();
    } else {
        selectedQuery = queryParams.toString();
    }
    selectedQuery = decodeURIComponent(selectedQuery);
    const matchedRes = await searchAnime(selectedQuery);
    const repairedRes = matchedRes.map((result) => {
        const titleSets = result.title || {};
        const searchTitleMatch = titleSets.romaji || titleSets.english || titleSets.native;
        // used specficially for tom-select
        const finalized = {
            titlematch: searchTitleMatch,
            titlematchen: titleSets.english || searchTitleMatch,
            titlematchother: titleSets.native || searchTitleMatch,
        };
        // eslint-disable-next-line no-restricted-syntax
        for (const [key, value] of Object.entries(result)) {
            finalized[key] = value;
        }
        return finalized;
    });
    res.json({ results: repairedRes });
});
