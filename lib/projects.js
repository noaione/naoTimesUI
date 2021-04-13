import $ from "cash-dom";

import ProjectPages from "./pages";
import * as Utils from "./utils";

let browserGlobal;
if (typeof window !== "undefined") {
    // eslint-disable-next-line no-undef
    browserGlobal = window;
} else if (typeof global !== "undefined") {
    browserGlobal = global;
}

/**
 * Check if the cash-dom Element a valid match or not
 * by checking the length of the result.
 * @returns {Boolean}
 */
$.fn.isValid = function isValid() {
    return this.length > 0;
};

const $OverflowRoot = $("#root[aria-type=overview]");
const $ProjectPageRoot = $("#root[aria-type=projek-laman]");
const $ProjectMainRoot = $("#root[aria-type=projek-main]");
const $RootLoader = $("#root-loading");
const $ProjectAdd = $("#anime-select");
const $SettingsPageRoot = $("#root[aria-type=settings]");
if ($OverflowRoot.isValid()) {
    console.info("[Projects] Detected Overview Page!");
    if (!Utils.isNone($RootLoader)) $RootLoader.remove();
    $OverflowRoot.removeClass("bg-gray-300 dark:bg-gray-600");
    const $overviewStats = $("#overviw-stats");
    const isAdmin = $overviewStats.children().length === 4;
    if (!isAdmin) {
        ProjectPages.overview
            .overviewProjectOngoing()
            .then((res) => {
                $("#overview-progress").replaceWith(res);
            })
            .catch((err) => {
                $("#overview-progress").replaceWith(
                    $(`<p class="text-center text-2xl text-gray-300 font-light" />`).text(err.toString())
                );
            });
    }
    ProjectPages.overview.overviewStats().then((res) => {
        res.forEach((counter) => {
            counter.e.removeClass("animate-pulse");
            counter.c.start();
        });
    });
} else if ($ProjectPageRoot.isValid()) {
    console.info("[ProjectPage] Detected project page");
    const { PROJECT_DATA } = browserGlobal;
    ProjectPages.project.page.handleProjectPage($ProjectPageRoot, PROJECT_DATA);
} else if ($ProjectMainRoot.isValid()) {
    ProjectPages.project.main
        .projectOverviewPage()
        .then((res) => {
            $("#projek-overview").replaceWith(res);
        })
        .catch((err) => {
            $("#projek-overview").replaceWith(
                $(`<p class="text-center text-2xl text-gray-300 font-light" />`).text(err.toString())
            );
        });
} else if ($SettingsPageRoot.isValid()) {
    ProjectPages.settings.handleSettingsPage();
}

if ($ProjectAdd.isValid()) {
    ProjectPages.project.add.handleProjectAdd($ProjectAdd);
}
