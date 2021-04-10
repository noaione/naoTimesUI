/**
 * Japanese localization
 * Created by noaione <noaione0809@gmail.com>
 * Created: 10 April 2021
 * Last Update: 10 April 2021
 *
 * (C) 2021 naoTimes Dev
 * MIT License
 */

const Locale = {
    ROLES: {
        TL: "翻訳",
        TLC: "翻訳チェック",
        ENC: "符号づけ",
        ED: "編集",
        TM: "タイミング",
        TS: "組版",
        QC: "品証",
    },
    NO_PROGRESS: "進展なし",
    // This will be combined with javascript-time-ago
    // Dont add the word `in` or `ago` to it.
    AIRED: "{0}に放映された", // (Aired) xx days ago
    AIRING: "{0}に放映", // (Airing) in xx days
    SEASON: {
        WINTER: "{0}年冬",
        SPRING: "{0}年春",
        SUMMER: "{0}年夏",
        FALL: "{0}年秋",
    },
    DROPDOWN: {
        // {0} will be substitued with remainder of the episode
        // It's a templating style, please add it so it looks proper.
        EXPAND: "次の{0}つのエピソードを参照。。。",
        RETRACT: "閉める。。。",
    },
    LAST_UPDATE: "最終更新{0}",
    EPISODE_NEEDS: "要する",
    WAITING_RELEASE: "発売を待つ。。。",
};

export default Locale;
