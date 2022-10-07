/**
 * English localization
 * Created by noaione <noaione0809@gmail.com>
 * Created: 04 April 2021
 * Last Update: 04 April 2021
 *
 * (C) 2021 naoTimes Dev
 * MIT License
 */

import TimeAgoLocale from "javascript-time-ago/locale/en";

const Locale = {
    ROLES: {
        TL: "Translating",
        TLC: "Translation Checking",
        ENC: "Encoding",
        ED: "Editing",
        TM: "Timing",
        TS: "Typesetting",
        QC: "Quality Checking",
    },
    NO_PROGRESS: "No progress",
    AIRED: "Aired {0}", // (Aired) xx days agi
    AIRING: "Airing {0}", // (Airing) in xx days
    SEASON: {
        WINTER: "Winter {0}",
        SPRING: "Spring {0}",
        SUMMER: "Summer {0}",
        FALL: "Fall {0}",
    },
    DROPDOWN: {
        // {{episode}} will be substitued with remaining episode
        EXPAND: "See next {0} episode...",
        RETRACT: "Close...",
    },
    LAST_UPDATE: "Updated {0}",
    EPISODE_NEEDS: "needs",
    WAITING_RELEASE: "Waiting for release...",
    COLLAB_WITH: "Joint with {0}",
};

export { Locale, TimeAgoLocale };
