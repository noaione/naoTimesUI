import $ from "cash-dom";

import * as Utils from "../../utils";

function generateProjectOverviewJQuery(showsData) {
    if (showsData.code !== 200) {
        console.error(`[ProjectListOverview] Failed to fetch the shows data...`);
        return $(`<p class="text-center text-2xl text-gray-300 font-light" />`).text(showsData.message);
    }
    if (showsData.data.length < 1) {
        console.warn("[ProjectListOverview] No ongoing projects");
        return $(`<p class="text-center text-2xl text-gray-300 font-light" />`).text("Tidak ada proyek");
    }
    const $baseGrids = $(`<div class="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 mt-4" />`);
    const $baseCards = $(`<div class="p-2 bg-white dark:bg-gray-700 rounded shadow-sm self-start" />`);
    const $baseCardsInner = $(`<div class="flex pt-1" />`);
    const $baseContentCards = $(`<div class="flex flex-col py-1" />`);
    const $baseStatusPills = $(`<div class="flex-row pt-2 text-center flex flex-wrap gap-1" />`);
    const $baseImgLoc = $(`<a class="icon h-2/3 w-9/10 p-2" />`);
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
    const $baseAnimeFinished = $(`<div class="text-base font-semibold" />`);

    showsData.data.forEach((anime_data) => {
        console.info(`[ProjectListOverview] Generating ${anime_data.title}...`);
        const $cards = $baseCards.clone();
        const $title = $baseAnimeTitle
            .clone()
            .text(anime_data.title)
            .addClass("cursor-pointer")
            .attr("href", `/admin/projek/${anime_data.id}`);
        const $imageCard = $baseImgLoc
            .clone()
            .append(
                $(`<img />`)
                    .attr("src", anime_data.poster)
                    .addClass("transition duration-300 ease-out transform hover:-translate-y-1")
            )
            .attr("href", `/admin/projek/${anime_data.id}`);
        const $innerCards = $baseCardsInner.clone();
        $innerCards.append($imageCard);

        const assign = anime_data.assignments;

        const $flexAnime = $baseContentCards.clone();
        const colorFinished = anime_data.is_finished ? "text-green-500" : "text-red-500";
        const textFinished = anime_data.is_finished ? "Tamat" : "Proses";
        $flexAnime
            .append($title)
            .append($baseAnimeFinished.clone().addClass(colorFinished).text(textFinished));

        const $flexStatus = $baseStatusPills.clone();

        // eslint-disable-next-line no-restricted-syntax
        for (const [role_name, assignee] of Object.entries(assign)) {
            const $statPill = $baseRolePills.clone();
            const $popupPill = $baseRolePillsPopup.clone();
            const colorPill = Utils.roleColorPill(role_name);
            const userRolePill = Utils.roleToIDUserThingy(role_name);
            let assigneeName = assignee.name;

            assigneeName = assigneeName || "Tidak diketahui";
            const splitName = assigneeName.split("#");
            assigneeName = splitName.slice(0, splitName.length === 1 ? 1 : splitName.length - 1);

            $statPill.attr("title", userRolePill);
            $statPill.addClass(colorPill);
            $popupPill.addClass(colorPill).text(userRolePill);
            $statPill.append($("<span />").text(`${Utils.roleToPrettyName(role_name)}: ${assigneeName}`));
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

export async function projectOverviewPage() {
    console.info("[ProjectListOverview] Fetching project data...");
    const allshows = await Utils.requestAPI("get", "showtimes/projek");
    return generateProjectOverviewJQuery(allshows);
}
