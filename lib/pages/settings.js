import $ from "cash-dom";

import { requestAPI, requestAPISendData } from "../utils";

let browserGlobal;
if (typeof window !== "undefined") {
    // eslint-disable-next-line no-undef
    browserGlobal = window;
} else if (typeof global !== "undefined") {
    browserGlobal = global;
}

let cachedAdminSets = [];

function isEqual(first, second) {
    const unmatchingData = [];
    first.forEach((a) => {
        if (!second.includes(a)) {
            unmatchingData.push(a);
        }
    });
    if (unmatchingData.length > 0) {
        return false;
    }
    return true;
}

const ADMIN_TEMPLATE_INPUT = `
<div class="w-full px-3 mb-1 flex flex-row">
    <input id="admin-edit" type="number" data-pos="1" name="adminid" class="show-admin-set w-full py-1 rounded-lg border-2 transition-colors duraion-400 ease-in-out border-gray-200 outline-nones focus:border-yellow-600" placeholder="xxxxxxxxxxxxxx">
    <button class="show-admin-remove mx-2 px-2 py-1 bg-red-500 hover:bg-red-600 transition-colors duration-150 rounded font-semibold text-white" data-pos="1">
        Hapus
    </button>
</div>
`;

function readjustPositionNumberingAdminInput() {
    const allInputBox = $("input.show-admin-set");
    for (let i = 0; i < allInputBox.length; i++) {
        const $input = $(allInputBox[i]);
        $input
            .parent()
            .find("input")
            .attr("data-pos", (i + 1).toString());
        $input
            .parent()
            .find("button")
            .attr("data-pos", (i + 1).toString());
    }
}

function resetAdminRemove() {
    $(".show-admin-remove").on("click", (ev) => {
        ev.preventDefault();
        // Destroy self
        $(this).parent().remove();
        readjustPositionNumberingAdminInput();
    });
}

function handleTheOtherAdminButton() {
    resetAdminRemove();

    $("#admin-add-btn").on("click", (ev) => {
        ev.preventDefault();
        const current = $("#admin-list-change").children().length;
        const $template = $(ADMIN_TEMPLATE_INPUT);
        $template.find("input").attr("data-pos", (current + 1).toString());
        $template.find("button").attr("data-pos", (current + 1).toString());
        $("#admin-list-change").append($template);
        resetAdminRemove();
    });
}

function handleEditingAdminForm() {
    const $mainTemplate = $(`<div id="admin-list-change" class="flex flex-col gap-1 -mx-3"></div>`);

    const $allAdmins = $("#admin-list").children();
    const adminsSets = [];
    for (let i = 0; i < $allAdmins.length; i++) {
        const $elem = $allAdmins[i];
        adminsSets.push($elem.textContent.slice(2));
    }

    cachedAdminSets = adminsSets;

    adminsSets.forEach((admin, index) => {
        const $template = $(ADMIN_TEMPLATE_INPUT);
        $template
            .find("input")
            .val(admin)
            .attr("data-pos", (index + 1).toString());
        $template.find("button").attr("data-pos", (index + 1).toString());
        $mainTemplate.append($template);
    });
    console.info($mainTemplate);
    $("#admin-list").replaceWith($mainTemplate);
    $("#admin-add-btn").removeClass("hidden");
    handleTheOtherAdminButton();
}

function popUpErrorBoxModal(message) {
    $("p[aria-type=modal-text]").text(message);
    $("#modal-main").attr("x-data", "{ showModal: true }");
}

function changeToNormalAdminList(adminSets) {
    const $TEMPLATE_MAIN = $(`<div id="admin-list" class="flex flex-col" />`);
    const sortedAdmin = adminSets.sort();
    for (let i = 0; i < sortedAdmin.length; i++) {
        const $template = $(`<span class="dark:text-white"></span>`);
        $template.text(`- ${sortedAdmin[i]}`);
        $TEMPLATE_MAIN.append($template);
    }
    $("#admin-list-change").replaceWith($TEMPLATE_MAIN);
    $("#admin-add-btn").addClass("hidden");
}

async function handleSubmitEditAdminForm() {
    const collectAllInput = $("input#admin-edit");
    const adminSets = [];
    for (let i = 0; i < collectAllInput.length; i++) {
        const val = $(collectAllInput[i]).val();
        if (val && val !== "" && val !== " ") {
            adminSets.push(val);
        }
    }
    if (adminSets.length < 1) {
        popUpErrorBoxModal("Tidak ada Admin ID yang di masukan!");
        return false;
    }

    if (isEqual(adminSets, cachedAdminSets)) {
        changeToNormalAdminList(cachedAdminSets);
        return true;
    }

    const results = await requestAPISendData("put", "/api/showtimes/admin", {
        adminids: adminSets,
    });
    if (results.code !== 200) {
        popUpErrorBoxModal(results.message);
        return false;
    }
    changeToNormalAdminList(adminSets);
    return true;
}

function handleAdminForm() {
    console.info("Handling admin form...");
    $("#admin-change-btn").on("click", (e) => {
        e.preventDefault();
        const { target } = e;
        const isSpan = target.nodeName.toLowerCase() === "span";
        let realElem = target;
        if (isSpan) {
            realElem = realElem.parentElement;
        }
        const $this = $(realElem);
        const currentRole = $this.attr("data-role");
        if (currentRole === "show") {
            handleEditingAdminForm();
            $this.attr("data-role", "edit");
        } else if (currentRole === "edit") {
            handleSubmitEditAdminForm()
                .then((success) => {
                    if (success) {
                        $this.attr("data-role", "show");
                    }
                })
                .catch((err) => console.error(err));
        }
    });
}

export function handleSettingsPage() {
    handleAdminForm();
    const hostname = browserGlobal.location.origin;
    const embedUrl = $("a#embed-url");
    const iframeBig = $("#embed-framing-big");
    const iframeSmall = $("#embed-framing-small");
    const serverId = embedUrl.attr("data-server-id");
    let accentColor = embedUrl.attr("data-accent");
    let langLocale = embedUrl.attr("data-lang");
    let embedDark = embedUrl.attr("data-dark");

    // eslint-disable-next-line no-inner-declarations
    function isDefaultOption(thing) {
        if (thing === "false") return true;
        if (thing === "green") return true;
        if (thing === "id") return true;
        return false;
    }

    // eslint-disable-next-line no-inner-declarations
    function changeUrlInfo() {
        let newUrl = `${hostname}/embed?id=${serverId}`;
        if (!isDefaultOption(accentColor)) {
            newUrl += `&accent=${accentColor}`;
        }
        if (!isDefaultOption(langLocale)) {
            newUrl += `&lang=${langLocale}`;
        }
        if (!isDefaultOption(embedDark)) {
            newUrl += `&dark=${embedDark}`;
        }
        embedUrl.attr("href", newUrl).text(newUrl);
        embedUrl.attr("data-accent", accentColor);
        embedUrl.attr("data-lang", langLocale);
        embedUrl.attr("data-dark", embedDark);
        iframeBig.attr("src", newUrl);
        iframeSmall.attr("src", newUrl);
    }
    $("#embed-color").on("change", () => {
        accentColor = this.value;
        changeUrlInfo();
    });
    $("#embed-locale").on("change", () => {
        langLocale = this.value;
        changeUrlInfo();
    });
    $("#embed-dark").on("change", () => {
        if (this.checked) {
            embedDark = "true";
        } else {
            embedDark = "false";
        }
        changeUrlInfo();
    });

    $("#remove-server-btn").on("click", (ev) => {
        ev.preventDefault();
        $("#modal-question").attr("x-data", `{ showModalQuestion: true }`);
    });

    $("#real-delete-btn").on("click", (ev) => {
        ev.preventDefault();
        requestAPI("delete", "showtimes/server", false)
            .then((d) => {
                if (d.code === 200) {
                    browserGlobal.location = "/";
                } else {
                    popUpErrorBoxModal("Gagal menghapus server, mohon coba lagi nanti atau kontak N4O.");
                }
            })
            .catch((err) => {
                popUpErrorBoxModal(err.toString());
            });
    });
}
