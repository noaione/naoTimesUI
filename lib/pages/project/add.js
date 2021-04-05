import $ from "cash-dom";
import TomSelect from "tom-select";

import * as Utils from "../../utils";

let browserGlobal;
if (typeof window !== "undefined") {
    // eslint-disable-next-line no-undef
    browserGlobal = window;
} else if (typeof global !== "undefined") {
    browserGlobal = global;
}

function injectAfterItemSelect($ProjectAdd, $ProjectEpisode, data) {
    const title = data.title;
    const selTitle = title.romaji || title.english || title.native;
    $ProjectAdd.attr("data-anime-selected", Utils.maybeStr(data.id));
    $ProjectAdd.attr("data-anime-selected-title", selTitle);
    let coverData = data.coverImage || {};
    let posterUrl = coverData.extralarge || coverData.large || coverData.medium;
    if (!Utils.isNone(posterUrl)) {
        let $imgPoster = $(
            `<img class="transition duration-300 ease-out transform hover:-translate-y-1" />`
        ).attr("src", posterUrl);
        $("div[aria-class=projek-poster]").empty().append($imgPoster);
    }
    let episodes = data.episodes || 0;
    if (episodes < 1) {
        // Show
        if ($ProjectEpisode.hasClass("hidden") && !$ProjectEpisode.hasClass("flex")) {
            $ProjectEpisode.removeClass("hidden").addClass("flex");
        } else if (!$ProjectEpisode.hasClass("hidden") && !$ProjectEpisode.hasClass("flex")) {
            $ProjectEpisode.addClass("flex");
        }
    } else {
        if ($ProjectEpisode.hasClass("flex") && !$ProjectEpisode.hasClass("hidden")) {
            $ProjectEpisode.removeClass("flex").addClass("hidden");
        } else if (!$ProjectEpisode.hasClass("flex") && !$ProjectEpisode.hasClass("hidden")) {
            $ProjectEpisode.addClass("hidden");
        }
    }
    $ProjectAdd.attr("data-anime-episode", episodes.toString());
}

function searchAnimeForProject(selector, $projectSelector, $projectEpisode) {
    const select = new TomSelect(selector, {
        valueField: "id",
        searchField: ["titlematch", "titlematchen", "titlematchother"],
        maxItems: 1,
        placeholder: "Mohon ketik judul",
        load: function (query, callback) {
            let url = "anilist/find?q=" + encodeURIComponent(query);
            Utils.requestAPI("get", url)
                .then((response) => {
                    callback(response.results);
                })
                .catch(() => {
                    callback();
                });
        },
        render: {
            option: function (data, _e) {
                const formatType = data.format;
                const startDate = data.startDate || {};
                const rlsYear = startDate.year || "Unknown Year";
                const id = data.id;
                const title = data.title;
                const selTitle = title.romaji || title.english || title.native;

                return `<div class="text-base ml-2">
                    ${selTitle} (${rlsYear}) [${formatType}] [${id}]
                </div>`;
            },
            item: function (data, _e) {
                injectAfterItemSelect($projectSelector, $projectEpisode, data);
                const formatType = data.format;
                const startDate = data.startDate || {};
                const rlsYear = startDate.year || "Unknown Year";
                const id = data.id;
                const title = data.title;
                const selTitle = title.romaji || title.english || title.native;

                return `<div class="text-base">
                    ${selTitle} (${rlsYear}) [${formatType}] [${id}]
                </div>`;
            },
            loading: function (_d, _e) {
                return `<div class="text-base ml-2">Memuat...</div>`;
            },
        },
    });
    return select;
}

export function handleProjectAdd($ProjectAdd) {
    const $ProjectEpisode = $("div[aria-class=project-episode]");
    searchAnimeForProject("#anime-select", $ProjectAdd, $ProjectEpisode);
    $("#episode-id").on("keyup", function (ev) {
        ev.preventDefault();
        const $this = $(this);
        const testString = isNaN(parseInt($this.val()));
        if (!testString) {
            $ProjectAdd.attr("data-anime-episode", parseInt($this.val()));
        }
    });

    // Intercept request
    $("#project-add-btn").on("click", function (ev) {
        ev.preventDefault();
        const $this = $(this);
        if ($this.prop("disabled")) {
            // Intercept and dont continue
            return;
        }

        let roleLists = [];
        $("input").each((idx, elem) => {
            const $elem = $(elem);
            if (Utils.isNone($elem.attr("data-role"))) return;
            if ($elem.attr("data-role") === "episode") return;
            let value = $elem.val();
            if (!value) {
                value = null;
            }
            roleLists.push({ role: $elem.attr("data-role"), id: value });
        });

        const episodeTotal = $ProjectAdd.attr("data-anime-episode");
        if (parseInt(episodeTotal) < 1) {
            return;
        }

        const animeId = $ProjectAdd.attr("data-anime-selected");
        const animeTitle = $ProjectAdd.attr("data-anime-selected-title");
        const $serverInput = $("input#server-id");

        const requestThis = {
            server: $serverInput.val(),
            anime: {
                id: animeId,
                name: animeTitle,
                episode: episodeTotal,
            },
            roles: roleLists,
        };

        console.info("To be requested: ", requestThis);
        $this.prop("disabled", true).addClass("cursor-not-allowed animate-pulse");
        Utils.requestAPISendData("post", "/api/showtimes/projek", requestThis)
            .then((res) => {
                if (!res.success) {
                    $("p[aria-type=modal-text]").text(res.message);
                    $("#modal-main").attr("x-data", "{ showModal: true }");
                } else {
                    browserGlobal.location = `/admin/projek/${animeId}`;
                }
                $this.prop("disabled", false).removeClass("cursor-not-allowed animate-pulse");
            })
            .catch((err) => {
                console.error(err);
                $this.prop("disabled", false).removeClass("cursor-not-allowed animate-pulse");
                $("p[aria-type=modal-text]").text("Terjadi Kesalahan: " + err.toString());
                $("#modal-main").attr("x-data", "{ showModal: true }");
            });
    });
}
