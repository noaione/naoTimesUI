/* eslint-disable no-console */
import $ from "cash-dom";
import TimeAgo from "javascript-time-ago";
import id from "javascript-time-ago/locale/id";
import io from "socket.io-client";

import { has } from "./utils";

TimeAgo.addLocale(id);
TimeAgo.setDefaultLocale("id");
const timeAgo = new TimeAgo("id");

// Connect to the same web thing
const socket = io();
let browserGlobal;
if (typeof window !== "undefined") {
    // eslint-disable-next-line no-undef
    browserGlobal = window;
} else if (typeof global !== "undefined") {
    browserGlobal = global;
}

browserGlobal.NTNotification = {};

const { userId } = browserGlobal;
console.info(`[Notification] Joining room for user ${userId}`);

const $NotifChild = $("#notif-child");

function generateKolaborasiNotif(notifData, notifId) {
    const timestamped = new Date(notifData.ts * 1000);
    const passed = timeAgo.format(timestamped);
    const $baseLink = $(`
        <a class="flex items-center px-4 py-3 text-gray-600 hover:text-white hover:bg-indigo-600 -mx-2">
            <p class="text-sm mx-2">
                🤝 <span class="font-semibold">Permintaan Kolaborasi Baru dari </span> ${notifData.msg.name} (${passed})
            </p>
        </a>
    `);
    $baseLink.attr("href", `/admin/projek/kolaborasi/terima/${notifId}`);
    $baseLink.attr("data-read", notifData.read ? "true" : "false");
    $baseLink.attr("data-type", "kolaborasi");
    $baseLink.attr("data-id", notifId);
    if (notifData.read) {
        $baseLink.removeClass("text-gray-600 hover:text-white").addClass("text-gray-300");
    }
    return $baseLink;
}

function generateNotification(notifData) {
    const [notifType, notifId] = notifData.id.split("-");
    switch (notifType) {
        case "koleb":
            $NotifChild.append(generateKolaborasiNotif(notifData, notifId));
            break;
        default:
            break;
    }
}

socket.on(`notificationpush-${userId}`, (rawNotif) => {
    console.log("Notification received:", rawNotif);
    const parsedNotification = JSON.parse(rawNotif);
    if (typeof parsedNotification === "object" && Array.isArray(parsedNotification)) {
        parsedNotification.forEach((eachNotif) => {
            if (!has(browserGlobal.NTNotification, eachNotif.id)) {
                browserGlobal.NTNotification[eachNotif.id] = eachNotif;
                generateNotification(eachNotif);
            }
        });
    } else if (typeof parsedNotification === "object") {
        if (!has(browserGlobal.NTNotification, parsedNotification.id)) {
            browserGlobal.NTNotification[parsedNotification.id] = parsedNotification;
            generateNotification(parsedNotification);
        }
    }
});

socket.emit("pollnotification", "a");
