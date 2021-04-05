import $ from "cash-dom";

let browserGlobal;
if (typeof window !== "undefined") {
    // eslint-disable-next-line no-undef
    browserGlobal = window;
} else if (typeof global !== "undefined") {
    browserGlobal = global;
}

export function handleSettingsPage() {
    const hostname = browserGlobal.location.origin;
    const embedUrl = $("a#embed-url");
    const iframeBig = $("#embed-framing-big");
    const iframeSmall = $("#embed-framing-small");
    let serverId = embedUrl.attr("data-server-id");
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
    $("#embed-color").on("change", function () {
        accentColor = this.value;
        changeUrlInfo();
    });
    $("#embed-locale").on("change", function () {
        langLocale = this.value;
        changeUrlInfo();
    });
    $("#embed-dark").on("change", function () {
        if (this.checked) {
            embedDark = "true";
        } else {
            embedDark = "false";
        }
        changeUrlInfo();
    });
}
