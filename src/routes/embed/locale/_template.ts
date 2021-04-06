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
    // This will be combined with javascript-time-ago
    // Dont add the word `in` or `ago` to it.
    AIRED: "Aired", // (Aired) xx days ago
    AIRING: "Airing", // (Airing) in xx days
    SEASON: {
        WINTER: "Winter",
        SPRING: "Spring",
        SUMMER: "Summer",
        FALL: "Fall",
    },
    DROPDOWN: {
        // {{episode}} will be substitued with remainder of the episode
        // It's a templating style, please add it so it looks proper.
        EXPAND: "See next {{episode}} episode...",
        RETRACT: "Close...",
    },
    LAST_UPDATE: "Updated",
    EPISODE_NEEDS: "needs",
    WAITING_RELEASE: "Waiting for release...",
};

export default Locale;
