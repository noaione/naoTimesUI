const axios = require("axios").default;
const $ = require("jquery");
import "regenerator-runtime/runtime";
import { CountUp } from "countup.js/dist/countUp.umd";

$.fn.outerHTML = function () {
    return this[0].outerHTML;
};

$.fn.isValid = function () {
    return this.length > 0;
};

let browserGlobal;
if (typeof window !== "undefined") {
    // eslint-disable-next-line no-undef
    browserGlobal = window;
} else if (typeof global !== "undefined") {
    browserGlobal = global;
}

function isNone(data) {
    return data === null || data === undefined;
}

function roleColorPill(role) {
    role = role.toLowerCase();
    switch (role) {
        case "tl":
            return "bg-green-300";
        case "tlc":
            return "bg-yellow-300";
        case "enc":
            return "bg-red-300";
        case "ed":
            return "bg-blue-300";
        case "ts":
            return "bg-purple-300";
        case "tm":
            return "bg-pink-300";
        case "qc":
            return "bg-indigo-300";
        default:
            return "bg-gray-700 dark:bg-dary-300";
    }
}

function roleToPrettyName(role) {
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

function roleToIDUserThingy(role) {
    const roleCased = role.toLowerCase();
    switch (roleCased) {
        case "tl":
            return "Pengalih Bahasa";
        case "tlc":
            return "Pemeriksa Alih Bahasa";
        case "enc":
            return "Peramu Video";
        case "ed":
            return "Editor";
        case "ts":
            return "Penata Rias";
        case "tm":
            return "Penata Waktu";
        case "qc":
            return "Pemeriksa Akhir";
        default:
            return role;
    }
}

// Overview Projects
function generateOngoingProjectJQuery(showsData) {
    if (showsData.code != 200) {
        console.error(`[OverviewProjects] Failed to fetch the shows data...`);
        return $(`<p class="text-center text-2xl text-gray-300 font-light" />`).text(showsData.message);
    }
    if (showsData.data.length < 1) {
        console.warn("[OverviewProjects] No ongoing projects");
        return $(`<p class="text-center text-2xl text-gray-300 font-light" />`).text(
            "Tidak ada projek yang berlangsung"
        );
    }
    const $baseGrids = $(`<div class="grid gap-4 sm:grid-cols-1 lg:grid-cols-3" />`);
    const $baseCards = $(`<div class="p-2 bg-white dark:bg-gray-700 rounded shadow-sm self-start" />`);
    const $baseCardsInner = $(`<div class="flex pt-1" />`);
    const $baseContentCards = $(`<div class="flex flex-col py-1" />`);
    const $baseStatusPills = $(`<div class="flex-row pt-2 text-center flex flex-wrap" />`);
    const $baseImgLoc = $(`<a class="icon h-2/3 p-2" />`);
    const $basePill = $(`<div class="text-sm text-black rounded-full px-3 m-1" />`);
    const $baseAnimeTitle = $(
        // eslint-disable-next-line max-len
        `<a class="text-xl font-bold align-top text-gray-900 dark:text-gray-200 no-underline hover:underline" />`
    );
    const $baseAnimeEpisode = $(`<div class="text-base text-gray-400" />`);

    showsData.data.forEach((anime_data) => {
        console.info(`[OverviewProjects] Generating ${anime_data.title}...`);
        let $cards = $baseCards.clone();
        let $title = $baseAnimeTitle
            .clone()
            .text(anime_data.title)
            .addClass("cursor-pointer")
            .attr("href", `/admin/projek/${anime_data.id}`);
        let $imageCard = $baseImgLoc
            .clone()
            .append(
                $(`<img />`)
                    .attr("src", anime_data.poster)
                    .addClass("transition duration-300 ease-out transform hover:-translate-y-1")
            )
            .attr("href", `/admin/projek/${anime_data.id}`);
        let $innerCards = $baseCardsInner.clone();
        $innerCards.append($imageCard);

        const statuses = anime_data.status;
        const assign = anime_data.assignments;

        let $flexAnime = $baseContentCards.clone();
        $flexAnime.append($title).append($baseAnimeEpisode.clone().text(`Episode ${statuses.episode}`));

        let $flexStatus = $baseStatusPills.clone();

        for (let [role_name, role_stat] of Object.entries(statuses.progress)) {
            if (role_stat) continue;
            let $statPill = $basePill.clone();
            let colorPill = roleColorPill(role_name);
            let namePill = roleToPrettyName(role_name);
            let userRolePill = roleToIDUserThingy(role_name);

            let userAssign = assign[role_name];
            if (typeof userAssign === "undefined" || userAssign === null) {
                userAssign = "Unknown";
            } else {
                userAssign = userAssign.name;
            }
            $statPill.attr("title", `${userRolePill} - ${userAssign}`);
            $statPill.addClass(colorPill);
            $statPill.text(namePill);
            $flexStatus.append($statPill);
        }
        $flexAnime.append($flexStatus);
        $innerCards.append($flexAnime);
        $cards.append($innerCards);
        $baseGrids.append($cards);
    });
    return $baseGrids;
}

async function requestAPI(method, path) {
    try {
        const req = await axios.get(`/api/${path}`, { responseType: "json", method: method });
        return req.data;
    } catch (err) {
        if (err.response) {
            return err.response.data;
        }
        return { message: `An internal occured, ${err.toString()}`, code: 500 };
    }
}

async function overviewProjectOngoing() {
    console.info("[OverviewProjects] Fetching latest ongoing projects...");
    const shows = await requestAPI("get", "showtimes/latestanime");
    return generateOngoingProjectJQuery(shows);
}

async function overviewStats() {
    console.info("[OverviewStats] Fetching statistics...");
    const statistics = await requestAPI("get", "showtimes/stats");
    return statistics;
}

const $OverflowRoot = $("#root[aria-type=overview]");
const $ProjectPageRoot = $("#root[aria-type=projek-laman]");
const $RootLoader = $("#root-loading");
if ($OverflowRoot.isValid()) {
    console.info("[Projects] Detected Overview Page!");
    if (!isNone($RootLoader)) $RootLoader.remove();
    $OverflowRoot.removeClass("bg-gray-300 dark:bg-gray-600");
    const $overviewStats = $("#overview-stats");
    const isAdmin = $overviewStats.children().length === 4;
    if (!isAdmin) {
        overviewProjectOngoing()
            .then((res) => {
                $("#overview-progress").replaceWith(res);
            })
            .catch((err) => {
                $("#overview-progress").replaceWith(
                    $(`<p class="text-center text-2xl text-gray-300 font-light" />`).text(err.toString())
                );
            });
    }
    overviewStats().then((res) => {
        let collectedCounter = [];
        if (!isAdmin) {
            // Server type
            collectedCounter.push({
                c: new CountUp("ostats-finished", res.data.finished),
                e: $("#ostats-finished"),
            });
            collectedCounter.push({
                c: new CountUp("ostats-ongoing", res.data.unfinished),
                e: $("#ostats-ongoing"),
            });
        } else {
            // Admin type
            collectedCounter.push({
                c: new CountUp("ostats-server", res.data.servers),
                e: $("#ostats-server"),
            });
            collectedCounter.push({
                c: new CountUp("ostats-anime", res.data.anime),
                e: $("#ostats-anime"),
            });
            collectedCounter.push({
                c: new CountUp("ostats-admin", res.data.admins),
                e: $("#ostats-admin"),
            });
            collectedCounter.push({
                c: new CountUp("ostats-project", res.data.project),
                e: $("#ostats-project"),
            });
        }
        console.info(`[OverviewStats] Collected ${collectedCounter.length} counter`);
        collectedCounter.forEach((counter) => {
            counter.e.removeClass("animate-pulse");
            counter.c.start();
        });
    });
} else if ($ProjectPageRoot.isValid()) {
    const PROJECT_DATA = browserGlobal.PROJECT_DATA;
    const $ProjectRoot = $("#projek-data");
}
