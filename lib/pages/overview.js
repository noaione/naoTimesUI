import $ from "cash-dom";
import { CountUp } from "countup.js";

import * as Utils from "../utils";

function generateOngoingProjectJQuery(showsData) {
    if (showsData.code != 200) {
        console.error(`[OverviewProjects] Failed to fetch the shows data...`);
        return $(`<p class="text-center text-2xl text-gray-300 font-light" />`).text(showsData.message);
    }
    if (showsData.data.length < 1) {
        console.warn("[OverviewProjects] No ongoing projects");
        return $(`<p class="text-center text-2xl text-gray-300 font-light" />`).text(
            "Tidak ada proyek yang berlangsung"
        );
    }
    const $baseGrids = $(`<div class="grid gap-4 sm:grid-cols-1 lg:grid-cols-3" />`);
    const $baseCards = $(`<div class="p-2 bg-white dark:bg-gray-700 rounded shadow-sm self-start" />`);
    const $baseCardsInner = $(`<div class="flex pt-1" />`);
    const $baseContentCards = $(`<div class="flex flex-col py-1" />`);
    const $baseStatusPills = $(`<div class="flex-row pt-2 text-center flex flex-wrap gap-1" />`);
    const $baseImgLoc = $(`<a class="icon h-2/3 w-1/2 p-2" />`);
    const $baseRolePills = $(
        `<div class="cursor-default group relative rounded border px-1 inline-block align-middle" />`
    );
    const $baseRolePillsPopup = $(
        `<div class="block z-50 rounded-sm px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow border text-xs absolute whitespace-nowrap left-1/2 transform bottom-6 text-center -translate-x-1/2" />`
    );
    // const $basePill = $(`<div class="text-sm text-black rounded-full px-3 m-1" />`);
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
        $flexAnime.append($title).append($baseAnimeEpisode.clone().text(`Episode ${statuses.episode} sisa`));

        let $flexStatus = $baseStatusPills.clone();

        for (let [role_name, role_stat] of Object.entries(statuses.progress)) {
            if (role_stat) continue;
            let $statPill = $baseRolePills.clone();
            let $popupPill = $baseRolePillsPopup.clone();
            let colorPill = Utils.roleColorPill(role_name);
            let userRolePill = Utils.roleToIDUserThingy(role_name);

            let userAssign = assign[role_name] || {};
            let assigneeName = userAssign.name || "Tidak diketahui";
            let splitName = assigneeName.split("#");
            assigneeName = splitName.slice(0, splitName.length === 1 ? 1 : splitName.length - 1);

            $statPill.attr("title", userRolePill);
            $statPill.addClass(colorPill);
            $popupPill.addClass(colorPill).text(`${userRolePill}: ${assigneeName}`);
            $statPill.append($("<span />").text(Utils.roleToPrettyName(role_name)));
            $statPill.append($popupPill);
            $flexStatus.append($statPill);
        }
        $flexAnime.append($flexStatus);
        $innerCards.append($flexAnime);
        $cards.append($innerCards);
        $baseGrids.append($cards);
    });
    return $baseGrids;
}

function generateStatsData(statistics) {
    const isAdmin = !Utils.isNone(statistics.data.servers);
    let collectedCounter = [];
    if (!isAdmin) {
        // Server type
        collectedCounter.push({
            c: new CountUp("ostats-finished", statistics.data.finished),
            e: $("#ostats-finished"),
        });
        collectedCounter.push({
            c: new CountUp("ostats-ongoing", statistics.data.unfinished),
            e: $("#ostats-ongoing"),
        });
    } else {
        // Admin type
        collectedCounter.push({
            c: new CountUp("ostats-server", statistics.data.servers),
            e: $("#ostats-server"),
        });
        collectedCounter.push({
            c: new CountUp("ostats-anime", statistics.data.anime),
            e: $("#ostats-anime"),
        });
        collectedCounter.push({
            c: new CountUp("ostats-admin", statistics.data.admins),
            e: $("#ostats-admin"),
        });
        collectedCounter.push({
            c: new CountUp("ostats-project", statistics.data.project),
            e: $("#ostats-project"),
        });
    }
    console.info(`[OverviewStats] Collected ${collectedCounter.length} counter`);
    return collectedCounter;
}

export async function overviewProjectOngoing() {
    console.info("[OverviewProjects] Fetching latest ongoing projects...");
    const shows = await Utils.requestAPI("get", "showtimes/latestanime");
    return generateOngoingProjectJQuery(shows);
}

export async function overviewStats() {
    console.info("[OverviewStats] Fetching statistics...");
    const statistics = await Utils.requestAPI("get", "showtimes/stats");
    return generateStatsData(statistics);
}
