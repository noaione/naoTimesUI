import React from "react";
import { DateTime } from "luxon";

import ChevronUp from "mdi-react/ChevronUpIcon";
import ChevronDown from "mdi-react/ChevronDownIcon";
import reactStringReplace from "react-string-replace";

import { IEmbedParams } from "./Interface";

import EpisodeCard from "./Episode";
import { ValidAccent } from "../ColorMap";
import ReactTimeAgoLocale from "../TimeAgo";

import { AvailableLocale, ValidLocale } from "@/lib/timeago";
import { EmbedProjectFragment } from "@/lib/graphql/projects.generated";
import { withTranslation, WithTranslation } from "react-i18next";
import ImageMetadataComponent from "../ImageMetadata";
import { Noto_Color_Emoji } from "next/font/google";
import { i18n } from "i18next";

function getSeasonIcon(month: number) {
    if (month >= 0 && month <= 2) {
        return "❄️";
    }
    if (month >= 3 && month <= 5) {
        return "🌸";
    }
    if (month >= 6 && month <= 8) {
        return "☀️";
    }
    if (month >= 9 && month <= 11) {
        return "🍂";
    }
    if (month >= 12) {
        return "❄️";
    }
}

function getSeasonName(month: number, year: number, locale: AvailableLocale, i18n: i18n): string {
    if (month >= 0 && month <= 2) {
        return i18n.t("season_year.winter", { lng: locale, year });
    }
    if (month >= 3 && month <= 5) {
        return i18n.t("season_year.spring", { lng: locale, year });
    }
    if (month >= 6 && month <= 8) {
        return i18n.t("season_year.summer", { lng: locale, year });
    }
    if (month >= 9 && month <= 11) {
        return i18n.t("season_year.fall", { lng: locale, year });
    }
    if (month >= 12) {
        return i18n.t("season_year.winter", { lng: locale, year });
    }
}

const notoEmoji = Noto_Color_Emoji({
    weight: "400",
    display: "swap",
    style: "normal",
    subsets: ["emoji"],
});

const borderTop = {
    borderTopWidth: "3px",
};

interface EmbedPageCardProps extends IEmbedParams {
    animeData: EmbedProjectFragment;
    serverInfo: { [srvId: string]: string | null };
}

interface EmbedPageCardState {
    dropdownOpen: boolean;
}

class EmbedPageCard extends React.Component<EmbedPageCardProps & WithTranslation, EmbedPageCardState> {
    constructor(props: EmbedPageCardProps & WithTranslation) {
        super(props);
        this.toggleDrop = this.toggleDrop.bind(this);
        this.state = {
            dropdownOpen: false,
        };
    }

    componentDidUpdate() {
        const message = JSON.stringify({ action: "resize", height: window.document.body.scrollHeight });
        // Broadcast resize action to everyone.
        window.parent.postMessage(message, "*");
    }

    toggleDrop() {
        const { dropdownOpen } = this.state;
        this.setState({ dropdownOpen: !dropdownOpen });
    }

    render() {
        const { animeData, accent, lang, serverInfo, i18n } = this.props;
        const { dropdownOpen } = this.state;

        let realAccent = "green";
        if (ValidAccent.includes(accent)) {
            realAccent = accent;
        }
        let realLang: AvailableLocale = "id";
        if (ValidLocale.includes(lang)) {
            realLang = lang;
        }

        const {
            id,
            title,
            poster: { image },
            statuses,
            updatedAt,
            external: { startTime },
        } = animeData;

        const unfinishedEpisode = statuses.filter((s) => !s.isReleased);
        if (unfinishedEpisode.length < 1) {
            return null;
        }
        const firstEpisode = unfinishedEpisode[0];
        const next3Episode = unfinishedEpisode.slice(1, 4);

        const bordering =
            realAccent === "none" ? "border-none" : `rounded-t-none border-t-4 role-accent-${realAccent}`;

        const buttonColor = dropdownOpen
            ? "text-gray-500 hover:text-gray-400 dark:text-gray-300"
            : "text-blue-500 hover:text-blue-400 dark:text-blue-300";

        const lastUpdated = i18n.t("last_update", { lng: realLang });
        const startTimeDt = DateTime.fromSeconds(startTime, { zone: "UTC" });
        const lastUpdateUnix = DateTime.fromISO(updatedAt, { zone: "UTC" }).toSeconds();

        const extraHiddenThing = dropdownOpen ? "" : "hidden ";
        const jointWith = Object.values(serverInfo).filter((r) => typeof r === "string");

        return (
            <>
                <div
                    className={
                        "shadow-md rounded-md overflow-hidden flex flex-row items-start relative bg-white dark:bg-gray-800 " +
                        bordering
                    }
                    style={realAccent === "none" ? {} : borderTop}
                >
                    <div className="hidden sm:block w-24 mt-3 ml-3 mb-8 relative flex-none">
                        <ImageMetadataComponent
                            image={image}
                            alt={`Poster Proyek ${title}`}
                            className="z-0 rounded-md"
                            width={230}
                            height={325}
                        />
                    </div>
                    <div className="text-xs h-full flex-grow px-3 pt-2 py-8 max-w-full flex flex-col">
                        <h1 className="font-semibold text-base text-gray-800 dark:text-gray-100 mt-0.5">
                            {title}
                        </h1>
                        {jointWith.length > 0 && (
                            <p className="text-sm italic text-gray-700 dark:text-gray-300 mt-2">
                                {i18n.t("collab", { lng: realLang, groups: jointWith.join(", ") })}
                            </p>
                        )}
                        <div>
                            <EpisodeCard
                                key={`episode-card-${id}-${firstEpisode.episode}`}
                                episode={firstEpisode.episode}
                                airingAt={firstEpisode.airingAt}
                                progress={firstEpisode.roles}
                                lang={realLang}
                                delayReason={firstEpisode.delayReason}
                            />
                        </div>
                        {next3Episode.length > 0 ? (
                            <>
                                <div className={extraHiddenThing + "grid grid-cols-2 justify-between"}>
                                    {next3Episode.map((ep) => {
                                        return (
                                            <EpisodeCard
                                                key={`episode-card-${id}-${ep.episode}`}
                                                episode={ep.episode}
                                                airingAt={ep.airingAt}
                                                progress={ep.roles}
                                                lang={realLang}
                                            />
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={this.toggleDrop}
                                    className={
                                        "flex flex-row mt-2 items-center transition hover:opacity-80 focus:outline-none " +
                                        buttonColor
                                    }
                                >
                                    <div className="h-5 w-5">
                                        {dropdownOpen ? (
                                            <ChevronUp className="-ml-1" />
                                        ) : (
                                            <ChevronDown className="-ml-1" />
                                        )}
                                    </div>
                                    {dropdownOpen ? (
                                        <div className="mt-1 text-left">
                                            {i18n.t("dropdown.collapse", { lng: realLang })}
                                        </div>
                                    ) : (
                                        <div className="mt-1 text-left">
                                            {i18n.t("dropdown.expand", {
                                                lng: realLang,
                                                count: next3Episode.length,
                                            })}
                                        </div>
                                    )}
                                </button>
                            </>
                        ) : null}
                    </div>
                    <div>
                        <div className="absolute bottom-2 left-3 text-xs text-gray-400 dark:text-gray-300">
                            <div className="flex flex-row gap-1 text-left">
                                {firstEpisode.delayReason && (
                                    <span className="z-10 inline-block h-4 w-4 relative text-blue-400 group">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow rounded rounded-bl-none absolute bottom-5 w-60 border bg-blue-100 text-blue-800 border-blue-400 px-2 py-2">
                                            {firstEpisode.delayReason}
                                        </span>
                                    </span>
                                )}
                                <span>
                                    {reactStringReplace(lastUpdated, "{{timeago}}", () => {
                                        return (
                                            <ReactTimeAgoLocale
                                                key={`utang-${id}-ts-${lastUpdateUnix}`}
                                                unix={lastUpdateUnix}
                                                locale={realLang}
                                            />
                                        );
                                    })}
                                </span>
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-gray-300">
                            <div className="flex flex-row text-right">
                                <span className={notoEmoji.className + " font-normal not-italic"}>
                                    {getSeasonIcon(startTimeDt.month)}
                                </span>
                                <span className="ml-0.5">
                                    {getSeasonName(startTimeDt.month, startTimeDt.year, realLang, i18n)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withTranslation()(EmbedPageCard);
