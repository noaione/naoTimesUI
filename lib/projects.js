const axios = require("axios").default;
const $ = require("jquery");
const select2 = require("select2");
select2();
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

function generateProjectOverviewJQuery(showsData) {
    if (showsData.code != 200) {
        console.error(`[ProjectListOverview] Failed to fetch the shows data...`);
        return $(`<p class="text-center text-2xl text-gray-300 font-light" />`).text(showsData.message);
    }
    if (showsData.data.length < 1) {
        console.warn("[ProjectListOverview] No ongoing projects");
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
    const $baseAnimeFinished = $(`<div class="text-base font-semibold" />`);

    showsData.data.forEach((anime_data) => {
        console.info(`[ProjectListOverview] Generating ${anime_data.title}...`);
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

        const assign = anime_data.assignments;

        let $flexAnime = $baseContentCards.clone();
        let colorFinished = anime_data.is_finished ? "text-green-500" : "text-red-500";
        let textFinished = anime_data.is_finished ? "Tamat" : "Belum tamat";
        $flexAnime
            .append($title)
            .append($baseAnimeFinished.clone().addClass(colorFinished).text(textFinished));

        let $flexStatus = $baseStatusPills.clone();

        for (let [role_name, assignee] of Object.entries(assign)) {
            let $statPill = $basePill.clone();
            let colorPill = roleColorPill(role_name);
            let userRolePill = roleToIDUserThingy(role_name);
            let assigneeName = assignee.name;

            assigneeName = assigneeName || "Tidak diketahui";
            let splitName = assigneeName.split("#");
            assigneeName = splitName.slice(0, splitName.length === 1 ? 1 : splitName.length - 1);

            $statPill.attr("title", userRolePill);
            $statPill.addClass(colorPill);
            $statPill.text(`${role_name}: ${assigneeName}`);
            $flexStatus.append($statPill);
        }
        $flexAnime.append($flexStatus);
        $innerCards.append($flexAnime);
        $cards.append($innerCards);
        $baseGrids.append($cards);
    });
    return $baseGrids;
}

async function projectOverviewPage() {
    console.info("[ProjectListOverview] Fetching project data...");
    const allshows = await requestAPI("get", "showtimes/projek");
    return generateProjectOverviewJQuery(allshows);
}

function searchAnimeForProject() {
    $("#anime-select").select2({
        ajax: {
            delay: 150,
            url: "/api/anilist/find",
            processResults: (data) => {
                return data.results;
            },
        },
        placeholder: "Cari Judul Anime",
        templateResult: (data) => {
            if (data.loading) {
                return data.text;
            }

            const formatType = data.format;
            const startDate = data.startDate || {};
            const rlsYear = startDate.year || "Unknown Year";
            const id = data.id;
            const title = data.title;
            const selTitle = title.romaji || title.english || title.native;

            const $containerText = $(`<div class="dark:text-white" />`);
            $containerText.text(`${selTitle} (${rlsYear}) [${formatType}] [${id}]`);
            return $containerText;
        },
        templateSelection: (data) => {
            const formatType = data.format;
            const startDate = data.startDate || {};
            const rlsYear = startDate.year || "Unknown Year";
            const id = data.id;
            const title = data.title || {};
            const selTitle = title.romaji || title.english || title.native;
            return `${selTitle} (${rlsYear}) [${formatType}] [${id}]`;
        },
    });
}

// Project page
function createRolePillsJQuery(rolecode, username) {
    const $container = $(`
    <div class="text-base text-gray-900 items-center flex flex-row" aria-role-show="XX">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-role-show="XX" class="staff-edit text-gray-900 dark:text-gray-200 mr-1 cursor-pointer hover:text-gray-700 dark:hover:text-gray-400">
            <path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" />
        </svg>
        <span class="rounded-full px-3 pb-1 font-bold">???</span>
    </div>
    `);
    $container.attr("aria-role-show", rolecode.toUpperCase());
    $container.find("svg").attr("aria-role-show", rolecode.toUpperCase());
    username = username || "Tidak diketahui";
    let splitName = username.split("#");
    username = splitName.slice(0, splitName.length === 1 ? 1 : splitName.length - 1);
    $container
        .find("span")
        .addClass(roleColorPill(rolecode))
        .text(roleToIDUserThingy(rolecode) + ": " + username);
    return $container;
}

const $OverflowRoot = $("#root[aria-type=overview]");
const $ProjectPageRoot = $("#root[aria-type=projek-laman]");
const $ProjectMainRoot = $("#root[aria-type=projek-main]");
const $RootLoader = $("#root-loading");
const $ProjectAdd = $("#anime-select");
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
    console.info("[ProjectPage] Detected project page");
    const PROJECT_DATA = browserGlobal.PROJECT_DATA;

    // Create
    const $projekRoles = $("div[aria-class=projek-roles]");
    $projekRoles.empty();
    for (let [role_name, role_data] of Object.entries(PROJECT_DATA.assignments)) {
        console.info(role_name, role_data);
        $projekRoles.append(createRolePillsJQuery(role_name, role_data.name));
    }
    if (PROJECT_DATA.aliases.length < 1) {
        $("div[aria-class=projek-alias]").text("Tidak ada alias");
    } else {
        $("div[aria-class=projek-alias]")
            .text("Alias: " + PROJECT_DATA.aliases.join(", "))
            .removeClass("animate-pulse");
    }
    if (PROJECT_DATA.kolaborasi.length < 1) {
        $("div[aria-class=projek-kolaborasi]").remove();
    } else {
        $("div[aria-class=projek-kolaborasi]")
            .text("Kolaborasi dengan " + PROJECT_DATA.kolaborasi.join(", "))
            .removeClass("animate-pulse");
    }
    $("img[aria-class=projek-poster]").attr("src", PROJECT_DATA.poster_data.url);

    // Handle edit botan click
    $(".show-ep-edit").on("click", function (e) {
        e.preventDefault();
        const $this = $(this);
        console.info("Episode edit:", $this);
    });
    $(".staff-edit").on("click", function (e) {
        e.preventDefault();
        const $this = $(this);
        console.info("Staff edit:", $this);
    });
} else if ($ProjectMainRoot.isValid()) {
    projectOverviewPage()
        .then((res) => {
            $("#projek-overview").replaceWith(res);
        })
        .catch((err) => {
            $("#projek-overview").replaceWith(
                $(`<p class="text-center text-2xl text-gray-300 font-light" />`).text(err.toString())
            );
        });
}
if ($ProjectAdd.isValid()) {
    searchAnimeForProject();
}
