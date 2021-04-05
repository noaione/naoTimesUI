import $ from "cash-dom";

import * as Utils from "../../utils";

let browserGlobal;
if (typeof window !== "undefined") {
    // eslint-disable-next-line no-undef
    browserGlobal = window;
} else if (typeof global !== "undefined") {
    browserGlobal = global;
}

// Project page
function createRolePillsJQuery(rolecode, username, userid) {
    const $container = $(`
    <div class="text-base text-gray-900 items-center flex flex-row" aria-role-show="XX">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" aria-role-show="XX" class="staff-edit text-gray-900 dark:text-gray-200 mr-1 cursor-pointer transition-colors duration-200 hover:text-gray-700 dark:hover:text-gray-400">
            <path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" />
        </svg>
        <span class="px-2 rounded font-bold text-black">???</span>
    </div>
    `);
    $container.attr("aria-role-show", rolecode.toUpperCase());
    $container.find("svg").attr("aria-role-show", rolecode.toUpperCase());
    if (!Utils.isNone(userid)) {
        $container.attr("aria-role-id", userid);
    }
    username = username || "Tidak diketahui";
    let splitName = username.split("#");
    username = splitName.slice(0, splitName.length === 1 ? 1 : splitName.length - 1);
    $container
        .find("span")
        .addClass(Utils.roleColorPill(rolecode))
        .text(Utils.roleToIDUserThingy(rolecode) + ": " + username);
    return $container;
}

function createRolePillsEditorJQuery(rolecode, existingId) {
    const $container = $(`
        <div class="text-base text-gray-900 items-center flex flex-row" aria-role-show="XX">
            <button type="submit" aria-role-show="XX" class="show-edit-role-btn px-2 mr-2 py-1 bg-green-400 transition-colors hover:bg-green-500 duration-200">✔</button>
            <input class="show-role-edit w-full py-1" type="number" placeholder="xxxxxxxxxxxxxx" aria-role-show="XX">
        </div>
    `);
    $container.attr("aria-role-show", rolecode);
    console.info(rolecode, existingId);
    $container.find("input").attr("aria-role-show", rolecode);
    if (!Utils.isNone(existingId)) {
        $container.find("input").val(existingId);
    }
    $container.find("button").attr("aria-role-show", rolecode);

    return $container;
}

function createSliderCheck(rolecode, episode, checked = false) {
    const $container = $(`
        <div class="ml-2">
            <label class="inline-flex items-center">
                <input data-role="${rolecode}" type="checkbox" class="ep-role-toggler form-checkbox" data-episode="${episode}">
                <span class="ml-2 dark:text-white font-semibold">${Utils.roleToPrettyName(rolecode)}</span>
            </label>
        </div>
    `);

    if (checked) {
        $container.find("input").prop("checked", true);
    }
    return $container;
}

function createPartialEpisodeBoxProject(results, episode) {
    const $container = $(`
        <div data-episode="${episode}" class="flex flex-col episode-box">
            <span class="font-semibold mt-2 dark:text-gray-100" aria-ep-type="ongoing">⏰ Proses</span>
            <div class="flex-row pt-2 text-center flex flex-wrap gap-1" aria-ep-type="ongoing" aria-class="rolepills"></div>
            <span class="font-semibold mt-2 dark:text-gray-100" aria-ep-type="done">✔ Beres</span>
            <div class="flex-row pt-2 text-center flex flex-wrap gap-1" aria-ep-type="done" aria-class="rolepills"></div>
        </div>
    `);

    const $baseRolePills = $(
        `<div class="cursor-default group relative rounded border px-1 inline-block align-middle" />`
    );
    const $baseRolePillsPopup = $(
        `<div class="block z-50 rounded-sm px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow border text-xs absolute whitespace-nowrap left-1/2 transform bottom-6 text-center -translate-x-1/2" />`
    );

    let hasDone = false;
    let hasUndone = false;
    console.info(results);
    for (let [role_name, role_stat] of Object.entries(results.progress)) {
        const pillColor = Utils.roleColorPill(role_name);
        const titleRole = Utils.roleToIDUserThingy(role_name);
        const textRole = Utils.roleToPrettyName(role_name);

        let $rolePopup = $baseRolePillsPopup.clone().addClass(pillColor).text(titleRole);
        let $textSpan = $("<span />").text(textRole);
        let $rolePill = $baseRolePills
            .clone()
            .addClass(pillColor)
            .attr("data-role", role_name)
            .append($textSpan)
            .append($rolePopup);
        if (role_stat) {
            $container.find("div[aria-ep-type=done]").append($rolePill);
            hasDone = true;
        } else {
            $container.find("div[aria-ep-type=ongoing]").append($rolePill);
            hasUndone = true;
        }
    }

    if (!hasDone) {
        $container.find("div[aria-ep-type=done]").remove();
        $container.find("span[aria-ep-type=done]").remove();
    }

    if (!hasUndone) {
        $container.find("div[aria-ep-type=ongoing]").remove();
        $container.find("span[aria-ep-type=ongoing]").remove();
    }

    return $container;
}

function createEpisodeBoxProject(episode_status) {
    /// Base class
    const $container = $(`
    <div class="p-3 bg-white dark:bg-gray-700 rounded shadow-sm">
        <div class="flex flex-col py-1" aria-show-episode="XX">
            <div class="flex justify-between items-center">
                <div class="flex items-center font-bold text-black dark:text-gray-200" aria-ep-type="number">Episode
                    XX</div>
                <div class="flex items-center">
                    <button type="button" aria-show-episode="XX" data-current-type="show"
                        class="show-ep-edit focus:outline-none text-white text-sm py-1 px-3 rounded-md bg-red-500 hover:bg-red-600 hover:shadow-lg">Edit</button>
                </div>
            </div>
            <span class="font-semibold text-gray-800 dark:text-gray-300" aria-ep-type="rilis">📺 Rilis: ??</span>
            <span class="font-semibold text-gray-800 dark:text-gray-300" aria-ep-type="airtime">⌚ Tayang: ??</span>
            <div data-episode="${episode_status.episode}" class="flex flex-col episode-box">
                <span class="font-semibold mt-2 dark:text-gray-100" aria-ep-type="ongoing">⏰ Proses</span>
                <div class="flex-row pt-2 text-center flex flex-wrap gap-1" aria-ep-type="ongoing" aria-class="rolepills"></div>
                <span class="font-semibold mt-2 dark:text-gray-100" aria-ep-type="done">✔ Beres</span>
                <div class="flex-row pt-2 text-center flex flex-wrap gap-1" aria-ep-type="done" aria-class="rolepills"></div>
            </div>
        </div>
    </div>
    `);

    const $baseRolePills = $(
        `<div class="cursor-default group relative rounded border px-1 inline-block align-middle" />`
    );
    const $baseRolePillsPopup = $(
        `<div class="block z-50 rounded-sm px-2 py-1 pointer-events-none opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity shadow border text-xs absolute whitespace-nowrap left-1/2 transform bottom-6 text-center -translate-x-1/2" />`
    );

    $container.find("div[aria-show-episode=XX]").attr("aria-show-episode", episode_status.episode.toString());
    $container.find("div[aria-ep-type=number]").text(`Episode ${episode_status.episode}`);
    let airTimeText = "Tidak diketahui";
    if (Utils.has(episode_status, "airtime") && typeof episode_status.airtime === "number") {
        airTimeText = Utils.unixToWIB(episode_status.airtime);
    }
    const rilisSym = episode_status.is_done ? "✔" : "❌";
    $container.find("span[aria-ep-type=rilis]").text(`📺 Rilis: ${rilisSym}`);
    $container.find("span[aria-ep-type=airtime]").text(`⌚ Tayang: ${airTimeText}`);
    const $ariaDone = $container.find("div[aria-ep-type=done]");
    const $ariaOngoing = $container.find("div[aria-ep-type=ongoing]");
    $container.find("button").attr("aria-show-episode", episode_status.episode);

    const $finishedTask = [];
    const $unfinishedTask = [];
    for (let [role_name, role_stat] of Object.entries(episode_status.progress)) {
        const pillColor = Utils.roleColorPill(role_name);
        const titleRole = Utils.roleToIDUserThingy(role_name);
        const textRole = Utils.roleToPrettyName(role_name);

        let $rolePopup = $baseRolePillsPopup.clone().addClass(pillColor).text(titleRole);
        let $textSpan = $("<span />").text(textRole);
        let $rolePill = $baseRolePills
            .clone()
            .addClass(pillColor)
            .attr("data-role", role_name)
            .append($textSpan)
            .append($rolePopup);
        if (role_stat) {
            $finishedTask.push($rolePill);
        } else {
            $unfinishedTask.push($rolePill);
        }
    }

    if ($finishedTask.length > 0) {
        $finishedTask.forEach(($task) => {
            $ariaDone.append($task);
        });
    } else {
        $ariaDone.remove();
        $container.find("span[aria-ep-type=done]").remove();
    }

    if ($unfinishedTask.length > 0) {
        $unfinishedTask.forEach(($task) => {
            $ariaOngoing.append($task);
        });
    } else {
        $ariaOngoing.remove();
        $container.find("span[aria-ep-type=ongoing]").remove();
    }

    return $container;
}

let globalEpisodeCheckHandling = {};

function changeIntoCheckboxEpisode($this) {
    const episode = $this.attr("aria-show-episode");
    const $mainDiv = $(`div[aria-show-episode="${episode}"] > .episode-box > div[aria-class=rolepills]`);
    let collectedEpisodeSets = {};
    let $ongoingDiv;
    let $doneDiv;
    let $collectedJQDiv = $(
        `<div aria-class="ep-being-edited" class="flex flex-col pt-2 flex-wrap gap-1" />`
    );
    for (let i = 0; i < $mainDiv.length; i++) {
        const $elem = $($mainDiv[i]);
        if ($elem.attr("aria-ep-type") === "ongoing") {
            $ongoingDiv = $elem;
            const $elemChild = $elem.children();
            for (let j = 0; j < $elemChild.length; j++) {
                const $elemIn = $($elemChild[j]);
                collectedEpisodeSets[$elemIn.attr("data-role")] = false;
            }
        } else if ($elem.attr("aria-ep-type") === "done") {
            $doneDiv = $elem;
            const $elemChild = $elem.children();
            for (let j = 0; j < $elemChild.length; j++) {
                const $elemIn = $($elemChild[j]);
                collectedEpisodeSets[$elemIn.attr("data-role")] = true;
            }
        }
    }
    $collectedJQDiv.append(createSliderCheck("TL", episode, collectedEpisodeSets["TL"]));
    $collectedJQDiv.append(createSliderCheck("TLC", episode, collectedEpisodeSets["TLC"]));
    $collectedJQDiv.append(createSliderCheck("ENC", episode, collectedEpisodeSets["ENC"]));
    $collectedJQDiv.append(createSliderCheck("ED", episode, collectedEpisodeSets["ED"]));
    $collectedJQDiv.append(createSliderCheck("TM", episode, collectedEpisodeSets["TM"]));
    $collectedJQDiv.append(createSliderCheck("TS", episode, collectedEpisodeSets["TS"]));
    $collectedJQDiv.append(createSliderCheck("QC", episode, collectedEpisodeSets["QC"]));

    let collectorEpisode = [];
    const $OngoingSpan = $(`div[aria-show-episode="${episode}"] > .episode-box > span[aria-ep-type=ongoing]`);
    const $DoneSpan = $(`div[aria-show-episode="${episode}"] > .episode-box > span[aria-ep-type=done]`);
    console.info($OngoingSpan, $DoneSpan);
    if ($OngoingSpan.length > 0) {
        collectorEpisode.push($OngoingSpan);
    }
    if (!Utils.isNone($ongoingDiv)) {
        collectorEpisode.push($ongoingDiv);
    }
    if ($DoneSpan.length > 0) {
        collectorEpisode.push($DoneSpan);
    }
    if (!Utils.isNone($doneDiv)) {
        collectorEpisode.push($doneDiv);
    }
    globalEpisodeCheckHandling[episode] = collectorEpisode;
    collectorEpisode.forEach(($Elem) => {
        $Elem.remove();
    });
    return $collectedJQDiv;
}

function handleEpisodeEditSubmit(episode, callback) {
    const $allInputCheck = $(`input.ep-role-toggler[data-episode="${episode}"]`);
    const $mainRoot = $("main#root");
    let newRolesSets = [];
    for (let i = 0; i < $allInputCheck.length; i++) {
        let $jq = $($allInputCheck[i]);
        newRolesSets.push({ role: $jq.attr("data-role"), tick: $jq.prop("checked") });
    }

    Utils.requestAPISendData("put", "/api/showtimes/projek", {
        event: "status",
        changes: {
            roles: newRolesSets,
            anime_id: $mainRoot.attr("data-anime-id"),
            episode: episode,
        },
    })
        .then((res) => {
            if (!res.success) {
                if (typeof callback === "function") {
                    callback(new Error("Fuck"));
                }
            } else {
                if (typeof callback === "function") {
                    callback(res.results);
                }
            }
        })
        .catch((err) => {
            console.error(err);
            callback(new Error("Fuck"));
        });
}

function rehandleEpisodeEditBotan() {
    $(".show-ep-edit").on("click", function (e) {
        e.preventDefault();
        const $this = $(this);
        const episode = $this.attr("aria-show-episode");
        const $main = $(`div[aria-show-episode="${episode}"]`);
        if ($this.attr("data-current-type") === "show") {
            $main.append(changeIntoCheckboxEpisode($this));
            $this.attr("data-current-type", "edit");
            $this.text("Done");
            $this.addClass("bg-blue-500 hover:bg-blue-600").removeClass("bg-red-500 hover:bg-red-600");
        } else if ($this.attr("data-current-type") === "edit") {
            handleEpisodeEditSubmit(episode, function (newEpisodeResult) {
                console.info(newEpisodeResult);
                if (newEpisodeResult instanceof Error) {
                    const $episodeSets = globalEpisodeCheckHandling[episode];
                    const $ghost = $(`<div data-episode="${episode}" class="flex flex-col episode-box" />`);
                    for (let i = 0; i < $episodeSets.length; i++) {
                        $ghost.append($episodeSets[i]);
                    }
                    $main.append($ghost);
                    $("div[aria-class=ep-being-edited]").remove();
                    $this.attr("data-current-type", "show");
                    $this.text("Edit");
                    $this
                        .addClass("bg-red-500 hover:bg-red-600")
                        .removeClass("bg-blue-500 hover:bg-blue-600");
                } else {
                    const $NewContainer = createPartialEpisodeBoxProject(newEpisodeResult);
                    $main.append($NewContainer);
                    $("div[aria-class=ep-being-edited]").remove();
                    $this.attr("data-current-type", "show");
                    $this.text("Edit");
                    $this
                        .addClass("bg-red-500 hover:bg-red-600")
                        .removeClass("bg-blue-500 hover:bg-blue-600");
                }
            });
        }

        // rehandleEpisodeEditBotan();
    });
}

// Botan click
function rehandleStaffEditBotan() {
    console.info("called button reset on staff");
    $(".staff-edit").on("click", function (e) {
        e.preventDefault();
        const $this = $(this);
        const roleShow = $this.attr("aria-role-show");
        if (Utils.isNone(roleShow)) {
            return;
        }
        const existingId = $this.parent().attr("aria-role-id") || null;
        const $newContainer = createRolePillsEditorJQuery(roleShow, existingId);
        $(`div[aria-role-show=${roleShow}]`).replaceWith($newContainer);
        rehandleStaffEditBotan();
    });

    $(".show-edit-role-btn").on("click", function (ev) {
        ev.preventDefault();
        const $btnThis = $(this);
        const roleShow = $btnThis.attr("aria-role-show");
        if (Utils.isNone(roleShow)) {
            return;
        }
        const $inputFlow = $(`input[aria-role-show=${roleShow}]`);
        if (Utils.isNone($inputFlow.val())) {
            return;
        }
        if (isNaN(parseInt($inputFlow.val()))) {
            return;
        }
        $btnThis.prop("disabled", true);
        $btnThis.addClass("cursor-not-allowed");
        const realValue = $inputFlow.val();
        const $root = $("main[aria-type=projek-laman]");
        Utils.requestAPISendData("put", "/api/showtimes/projek", {
            event: "staff",
            changes: {
                role: roleShow,
                anime_id: $root.attr("data-anime-id"),
                user_id: realValue,
            },
        })
            .then((api_res) => {
                if (api_res.success) {
                    const $newNewContainer = createRolePillsJQuery(roleShow, api_res.name, api_res.id);
                    $(`div[aria-role-show=${roleShow}]`).replaceWith($newNewContainer);
                    rehandleStaffEditBotan();
                } else {
                    browserGlobal.location.reload();
                }
            })
            .catch((err) => {
                console.error(err);
                browserGlobal.location.reload();
            });
    });
}

export function handleProjectPage($ProjectPageRoot, PROJECT_DATA) {
    // Create
    const $projekRoles = $("div[aria-class=projek-roles]");
    $projekRoles.empty();
    for (let [role_name, role_data] of Object.entries(PROJECT_DATA.assignments)) {
        $projekRoles.append(createRolePillsJQuery(role_name, role_data.name, role_data.id));
    }
    const $projekAlias = $("div[aria-class=projek-alias]");
    $projekAlias.removeClass("py-2 px-6 bg-gray-400 animate-pulse rounded-lg mt-1");
    if (PROJECT_DATA.aliases.length < 1) {
        $projekAlias.text("Tidak ada alias");
    } else {
        $projekAlias.text("Alias: " + PROJECT_DATA.aliases.join(", "));
    }
    if (PROJECT_DATA.kolaborasi.length < 1) {
        $("div[aria-class=projek-kolaborasi]").remove();
    } else {
        $("div[aria-class=projek-kolaborasi]")
            .text("Kolaborasi dengan " + PROJECT_DATA.kolaborasi.join(", "))
            .removeClass("py-2 px-6 bg-gray-400 animate-pulse rounded-lg mt-1");
    }
    let $imgPoster = $(
        `<img class="transition duration-300 ease-out transform hover:-translate-y-1" />`
    ).attr("src", PROJECT_DATA.poster_data.url);
    $("div[aria-class=projek-poster]").empty().append($imgPoster);

    const $epDiv = $("#episode-data");
    $epDiv.empty();
    PROJECT_DATA.status.forEach((episodes) => {
        $epDiv.append(createEpisodeBoxProject(episodes));
    });

    // Handle edit botan click 🌿
    // Reason for doing this is because it needs to be resetted everytime something changed.
    rehandleStaffEditBotan();
    rehandleEpisodeEditBotan();

    // Handle delete botan
    $("#delete-btn").on("click", function (e) {
        e.preventDefault();
        $("#modal-deletion").attr("x-data", "{ showModal: true }");
    });

    $("#real-delete-btn").on("click", function (ev) {
        ev.preventDefault();
        const animeId = $ProjectPageRoot.attr("data-anime-id");
        Utils.requestAPISendData("delete", "/api/showtimes/projek", { anime_id: animeId })
            .then((res) => {
                if (!res.success) {
                    $("p[aria-type=modal-text-error]").text(res.message);
                    $("#modal-main").attr("x-data", "{ showModal: true }");
                } else {
                    // Redirect to the main project location
                    browserGlobal.location = `/admin/projek`;
                }
            })
            .catch((err) => {
                console.error(err);
                $("p[aria-type=modal-text-error]").text("Terjadi Kesalahan: " + err.toString());
                $("#modal-main").attr("x-data", "{ showModal: true }");
            });
    });
}
