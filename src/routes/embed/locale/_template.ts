/**
 * [LANGUAGE] localization
 * Created by [YOUR NAME] <[YOUR EMAIL]>
 * With the help of [HELPER NAME]
 * Created: [DD] [Month] [Year]
 * Last Update: [DD] [Month] [Year]
 *
 * (C) 2021 naoTimes Dev
 * MIT License
 */

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
    AIRED: "Aired {0}", // (Aired) xx days ago
    AIRING: "Airing {0}", // (Airing) in xx days
    SEASON: {
        // {0} will be replace by year
        WINTER: "Winter {0}",
        SPRING: "Spring {0}",
        SUMMER: "Summer {0}",
        FALL: "Fall {0}",
    },
    DROPDOWN: {
        // {0} will be substitued with remaining episode
        EXPAND: "See next {0} episode...",
        RETRACT: "Close...",
    },
    // {0} will be replaced by elapsed time
    LAST_UPDATE: "Updated {0}",
    EPISODE_NEEDS: "needs",
    WAITING_RELEASE: "Waiting for release...",
};

export default Locale;
