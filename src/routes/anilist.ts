import axios from "axios";
import { ensureLoggedIn } from "connect-ensure-login";
import express from "express";
import { get } from "lodash";
import { isNone } from "../lib/utils";

const AnilistRoutes = express.Router();
const SearchAnimeQuery = `
query ($search:String) {
    Page (page:1,perPage:10) {
        media(search:$search,type:ANIME) {
            id
            idMal
            format
            season
            seasonYear
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
    return get(res, "data.Page.media", []);
}

AnilistRoutes.get("/find", ensureLoggedIn("/"), async (req, res) => {
    const queryParams = get(req.query, "q", get(req.query, "term"));
    if (isNone(queryParams)) {
        return res.status(400).json({ results: [] });
    }
    let selectedQuery: string;
    if (Array.isArray(queryParams)) {
        selectedQuery = queryParams[0].toString();
    } else {
        selectedQuery = queryParams.toString();
    }
    const matchedRes = await searchAnime(selectedQuery);
    res.json({ results: matchedRes });
});

export { AnilistRoutes };
