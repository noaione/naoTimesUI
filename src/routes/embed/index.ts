import express from "express";
import ejs from "ejs";
import moment from "moment-timezone";
import TimeAgo from "javascript-time-ago";
import id from "javascript-time-ago/locale/id";

import { isNone, Nullable } from "../../lib/utils";
import { ShowAnimeProps, ShowtimesModel, ShowtimesProps } from "../../models/show";

TimeAgo.addDefaultLocale(id);
TimeAgo.setDefaultLocale("id");

const timeAgo = new TimeAgo("id");
const EmbedRouter = express.Router();
const startTime = new Date().getTime();

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

const RoleColorPalette = {
    TL: "bg-red-100 text-red-800 border-red-200",
    TLC: "bg-yellow-100 text-yellow-800 border-yellow-200",
    ENC: "bg-green-100 text-green-800 border-green-200",
    ED: "bg-blue-100 text-blue-800 border-blue-200",
    TM: "bg-indigo-100 text-indigo-800 border-indigo-200",
    TS: "bg-purple-100 text-purple-800 border-purple-200",
    QC: "bg-pink-100 text-pink-800 border-pink-200",
};

const RoleExpandedName = {
    TL: "Translasi",
    TLC: "Cek Translasi",
    ENC: "Olahan Video",
    ED: "Menggubah Skrip",
    TM: "Selaras Waktu",
    TS: "Tata Rias",
    QC: "Tinjauan Akhir",
};

function generateRole(roleName) {
    const $roleContainer = `
    <div class="cursor-default group relative rounded border px-1 inline-block align-middle <%- colors %>">
        <span><%- role %></span>
        <!-- Tooltip -->
        <div
            class="block z-50 rounded-sm px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow border text-xs absolute whitespace-nowrap left-1/2 transform bottom-6 text-center -translate-x-1/2 <%- colors %>"
        >
            <%- roleExpand %>
        </div>
    </div>
    `;

    return ejs.render($roleContainer, {
        role: roleName,
        roleExpand: RoleExpandedName[roleName],
        colors: RoleColorPalette[roleName],
    });
}

function generateEpisodeData(episodeStatus) {
    const unfinishedStatus = [];
    for (const [roleName, roleStat] of Object.entries(episodeStatus.progress)) {
        if (!roleStat) {
            unfinishedStatus.push(roleName);
        }
    }
    const currentTime = moment.utc().unix();
    let aired = true;
    if (episodeStatus.airtime && episodeStatus.airtime > currentTime) {
        aired = false;
    }
    let anyProgress = false;
    if (unfinishedStatus.length < 7) {
        anyProgress = true;
    }
    let shouldWrap = false;
    if (unfinishedStatus.length > 5) {
        shouldWrap = true;
    }
    const $baseEpisode = `
        <div class="text-gray-800 dark:text-gray-200 flex text-sm mt-2 <%- wrap_mode %> <%- extra_class %>">
            <div>
                Episode <span slot="0"><%- ep_no %></span>
                <%- content %>
            </div>
        </div>
    `;

    let content = "";
    if (aired) {
        const $RoleSlot = `
            <div slot="2" class="flex gap-1 mt-1">
                <%- content %>
            </div>
        `;
        const $TimeSlot = `
            <time slot="1" datetime="<%- dt_air %>">
                <%- content %>
            </time>
        `;
        let roleContent = "";
        if (anyProgress) {
            if (unfinishedStatus.length > 0) {
                let tempData = "";
                unfinishedStatus.forEach((role) => {
                    tempData += generateRole(role);
                });
                roleContent = ejs.render($RoleSlot, { content: tempData });
            } else {
                roleContent = "Menunggu dirilis!";
            }
            content = roleContent;
        } else {
            let airedContent = "";
            if (episodeStatus.airtime) {
                const airTimeMoment = moment.utc(episodeStatus.airtime * 1000);
                airedContent =
                    "<div class>" +
                    ejs.render($TimeSlot, {
                        dt_air: airTimeMoment.format(),
                        content: "Tayang " + timeAgo.format(airTimeMoment.toDate()),
                    }) +
                    "</div>";
                airedContent += `
                    <div class>
                    <span slot="0">Belum ada progress</span>
                    </div>
                `;
            } else {
                airedContent += `
                    <div class>
                    <span slot="0">Belum ada progress</span>
                    </div>
                `;
            }
            content = airedContent;
        }
    } else {
        const $TimeSlot = `
            <time slot="1" datetime="<%- dt_air %>">
                <%- content %>
            </time>
        `;
        const airTimeMoment = moment.utc(episodeStatus.airtime * 1000);
        content =
            "<div class>" +
            ejs.render($TimeSlot, {
                content: "Tayang " + timeAgo.format(airTimeMoment.toDate()),
                dt_air: airTimeMoment.format(),
            }) +
            "</div>";
    }

    let extraClass = "";
    if (unfinishedStatus.length > 4) {
        extraClass = "col-start-1 col-end-3";
    }
    return ejs.render($baseEpisode, {
        wrap_mode: shouldWrap ? "flex-col" : "flex-row",
        ep_no: episodeStatus.episode,
        extra_class: extraClass,
        content: content,
    });
}

function generateShowCard(animeData: ShowAnimeProps, accent: string): Nullable<string> {
    const title = animeData.title;
    const unfinishedEpisode = animeData.status.filter((episode) => !episode.is_done);
    if (unfinishedEpisode.length < 1) {
        return null;
    }
    const firstEpisode = unfinishedEpisode[0];

    const $appShowBase = `
        <div class="shadow-md rounded-md overflow-hidden flex flex-row items-start relative bg-white dark:bg-gray-700 <%- bordering %>">
            <%- content %>
        </div>
    `;

    const $imgBase = `
        <div class="hidden sm:block w-24 mt-3 ml-3 mb-8 relative flex-none">
            <img
                class="z-0 rounded-md"
                src="<%- poster_url %>"
                alt="Poster/Cover untuk Proyek <%- title %>"
            />
        </div>
    `;

    let mergedContent = "";
    const renderedImageBox = ejs.render($imgBase, { poster_url: animeData.poster_data.url, title });
    mergedContent += renderedImageBox;
    const genEpisode = generateEpisodeData(firstEpisode);

    const $mainShowArea = `
        <div class="text-xs h-full flex-grow px-3 pt-2 py-8 max-w-full flex flex-col">
            <h1 class="font-medium text-base text-gray-800 dark:text-gray-100">
                <%- title %>
                <%- content %>
            </h1>
        </div>
    `;
    let bordering = "";
    if (accent === "none") {
        bordering = "border-none";
    } else {
        bordering = `rounded-t-none border-t-2 border-${accent}-500 dark:border-${accent}-400`;
    }
    mergedContent += ejs.render($mainShowArea, { title: animeData.title, content: genEpisode });
    return ejs.render($appShowBase, { content: mergedContent, bordering });
}

function generateSSRMain(showData: ShowtimesProps, accent?: Nullable<string>) {
    // TODO: Close bracket
    const $container = `
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 px-1 pb-2 sm:px-2 sm:py-2 bg-transparent" style="position: relative;">
            <%- content %>
        </div>
    `;
    const validAccent = ["red", "yellow", "green", "blue", "indigo", "purple", "pink", "none"];
    let selAccent;
    if (isNone(accent)) {
        selAccent = "green";
    } else {
        accent = accent.toLowerCase();
        if (validAccent.includes(accent)) {
            selAccent = accent;
        } else {
            selAccent = "green";
        }
    }

    let compiledContent = "";
    showData.anime.forEach((anime) => {
        const renderedShow = generateShowCard(anime, selAccent);
        if (isNone(renderedShow)) return;
        compiledContent += renderedShow;
    });

    return ejs.render($container, { content: compiledContent });
}

EmbedRouter.get("/embed", async (req, res) => {
    const queryParams = req.query;
    if (isNone(queryParams.id)) {
        res.render("404", { path: "/embed", build_time: startTime });
    } else {
        const serverId = queryParams.id;
        const serverRes = await ShowtimesModel.findOne({ id: { $eq: serverId } });
        if (isNone(serverRes.anime)) {
            res.render("404", { path: `/embed?id=${serverId}`, build_time: startTime });
        } else {
            const accents = queryParams.accent;
            let accent: Nullable<any>;
            if (Array.isArray(accents)) {
                accent = accents[0];
            } else {
                accent = accents;
            }
            const generatedSSR = generateSSRMain(serverRes, accent);
            let isDark = false;
            if (!isNone(queryParams.dark) && mapBoolean(queryParams.dark)) {
                isDark = true;
            }
            res.render("embed", {
                server_id: serverId,
                generated_ssr: generatedSSR,
                darkMode: isDark ? "dark" : "",
            });
        }
    }
});

export { EmbedRouter };
