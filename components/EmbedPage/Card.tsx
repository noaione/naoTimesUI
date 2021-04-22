import React from "react";

import ChevronUp from "mdi-react/ChevronUpIcon";
import ChevronDown from "mdi-react/ChevronDownIcon";

import { IEmbedParams } from "./Interface";
import { ValidAccent } from "../ColorMap";
import { Locale, LocaleMap, translate, ValidLocale } from "../../i18n";
import { ShowAnimeProps } from "../../models/show";
import reactStringReplace from "react-string-replace";
import ReactTimeAgoLocale from "./TimeAgo";
import { DateTime } from "luxon";
import EpisodeCard from "./Episode";

function getSeason(month: number, year: number, locale: Locale): string {
    const yearS = year.toString();
    if (month >= 0 && month <= 2) {
        return `❄ ${translate("SEASON.WINTER", locale, [yearS])}`;
    }
    if (month >= 3 && month <= 5) {
        return `🌸 ${translate("SEASON.SPRING", locale, [yearS])}`;
    }
    if (month >= 6 && month <= 8) {
        return `☀ ${translate("SEASON.SUMMER", locale, [yearS])}`;
    }
    if (month >= 9 && month <= 11) {
        return `🍂 ${translate("SEASON.FALL", locale, [yearS])}`;
    }
    if (month >= 12) {
        return `❄ ${translate("SEASON.WINTER", locale, [yearS])}`;
    }
}

const borderTop = {
    borderTopWidth: "3px",
};

interface EmbedPageCardProps extends IEmbedParams {
    animeData: ShowAnimeProps;
}

interface EmbedPageCardState {
    dropdownOpen: boolean;
}

class EmbedPageCard extends React.Component<EmbedPageCardProps, EmbedPageCardState> {
    constructor(props: EmbedPageCardProps) {
        super(props);
        this.toggleDrop = this.toggleDrop.bind(this);
        this.state = {
            dropdownOpen: false,
        };
    }

    toggleDrop() {
        const { dropdownOpen } = this.state;
        this.setState({ dropdownOpen: !dropdownOpen });
    }

    render() {
        const { animeData, accent, lang } = this.props;
        const { dropdownOpen } = this.state;

        let realAccent = "green";
        if (ValidAccent.includes(accent)) {
            realAccent = accent;
        }
        let realLang: keyof typeof LocaleMap = "id";
        if (ValidLocale.includes(lang)) {
            realLang = lang;
        }

        const { id, title, poster_data, status, last_update, start_time } = animeData;
        const { url: poster_url } = poster_data;

        const unfinishedEpisode = status.filter((episode) => !episode.is_done);
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

        const lastUpdated = translate("LAST_UPDATE", realLang) as string;
        const startTime = DateTime.fromSeconds(start_time, { zone: "UTC" });

        const extraHiddenThing = dropdownOpen ? "" : "hidden ";

        return (
            <>
                <div
                    className={
                        "shadow-md rounded-md overflow-hidden flex flex-row items-start relative bg-white dark:bg-gray-800 " +
                        bordering
                    }
                    style={realAccent === "nonde" ? {} : borderTop}
                >
                    <div className="hidden sm:block w-24 mt-3 ml-3 mb-8 relative flex-none">
                        <img
                            className="z-0 rounded-md"
                            src={poster_url}
                            alt={"Poster untuk Proyek " + title}
                        />
                    </div>
                    <div className="text-xs h-full flex-grow px-3 pt-2 py-8 max-w-full flex flex-col">
                        <h1 className="font-medium text-base text-gray-800 dark:text-gray-100">{title}</h1>
                        <div>
                            <EpisodeCard
                                key={`episode-card-${id}-${firstEpisode.episode}`}
                                episode={firstEpisode.episode}
                                airingAt={firstEpisode.airtime}
                                progress={firstEpisode.progress}
                                lang={realLang}
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
                                                airingAt={ep.airtime}
                                                progress={ep.progress}
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
                                        <div className="mt-1">{translate("DROPDOWN.RETRACT", realLang)}</div>
                                    ) : (
                                        <div className="mt-1">
                                            {translate("DROPDOWN.EXPAND", realLang, [
                                                next3Episode.length.toString(),
                                            ])}
                                        </div>
                                    )}
                                </button>
                            </>
                        ) : null}
                    </div>
                    <div>
                        <div className="absolute bottom-2 left-3 text-xs text-gray-400 dark:text-gray-300">
                            <div className="flex flex-row gap-1 text-left">
                                <span>
                                    <div>
                                        {reactStringReplace(lastUpdated, "{0}", () => {
                                            return (
                                                <ReactTimeAgoLocale unix={last_update} locale={realLang} />
                                            );
                                        })}
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div className="absolute bottom-2 right-3 text-xs text-gray-400 dark:text-gray-300">
                            <div className="flex flex-row text-right">
                                <span>{getSeason(startTime.month, startTime.year, realLang)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default EmbedPageCard;
