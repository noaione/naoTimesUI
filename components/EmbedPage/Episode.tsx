import React from "react";
import { DateTime } from "luxon";

import RolePopup from "../RolePopup";

import { AvailableLocale, timeAgoLocale, ValidLocale } from "@/lib/i18n";
import { ProjectStatusRole } from "@/lib/graphql/types.generated";
import { withTranslation, WithTranslation } from "react-i18next";

interface IEpisodeProps {
    airingAt?: number;
    episode: number;
    progress: ProjectStatusRole[];
    lang: AvailableLocale;
    delayReason?: string;
}

class EpisodeCard extends React.Component<IEpisodeProps & WithTranslation> {
    constructor(props: IEpisodeProps & WithTranslation) {
        super(props);
    }

    render() {
        const { progress, episode, airingAt, lang, i18n } = this.props;
        const unfinishedProgress: ProjectStatusRole[] = [];
        for (const role of progress) {
            if (!role.done) {
                unfinishedProgress.push(role);
            }
        }
        const currentTime = DateTime.utc().toSeconds();
        let aired = true;
        if (airingAt && airingAt > currentTime) {
            aired = false;
        }
        let realLang: AvailableLocale = "id";
        if (lang && ValidLocale.includes(lang)) {
            realLang = lang;
        }

        const anyProgress = unfinishedProgress.length !== progress.length;
        const wrapMode = unfinishedProgress.length > 5 ? "flex-col" : "flex-row";
        const extraClass = unfinishedProgress.length > 4 ? "col-start-1 col-end-3" : "";

        let content: React.ReactNode;
        let shouldRenderPill = false;
        if (aired) {
            if (anyProgress) {
                if (unfinishedProgress.length > 0) {
                    content = (
                        <>
                            <div slot="2" className="flex flex-wrap gap-1 mt-1">
                                {unfinishedProgress.map((role) => {
                                    const roleKey = `roles.${role.key.toLowerCase()}`;
                                    let localized = i18n.t(roleKey, { lng: realLang }) || role.name;
                                    localized = localized === roleKey ? role.name : localized;
                                    return (
                                        <RolePopup
                                            key={`ep-${episode}-${role.key}`}
                                            title={role.key}
                                            popupText={localized}
                                        />
                                    );
                                })}
                            </div>
                        </>
                    );
                    shouldRenderPill = true;
                } else {
                    content = (
                        <>
                            <div slot="2" className="flex gap-1 mt-1">
                                <span className="text-lg font-light">
                                    {i18n.t("waiting_release", { lng: realLang })}
                                </span>
                            </div>
                        </>
                    );
                }
            } else {
                if (airingAt) {
                    const isoDate = DateTime.fromSeconds(airingAt, { zone: "UTC" }).toISO();
                    content = (
                        <>
                            <div>
                                <time slot="1" dateTime={isoDate}>
                                    {i18n.t("airing_on", {
                                        lng: realLang,
                                        timeago: timeAgoLocale(airingAt, realLang),
                                    })}
                                </time>
                            </div>
                            <div>
                                <span slot="0">{i18n.t("no_progress", { lng: realLang })}</span>
                            </div>
                        </>
                    );
                } else {
                    content = (
                        <>
                            <div>
                                <span slot="0">{i18n.t("no_progress", { lng: realLang })}</span>
                            </div>
                        </>
                    );
                }
            }
        } else {
            const isoDate = DateTime.fromSeconds(airingAt, { zone: "UTC" }).toISO();
            content = (
                <>
                    <div>
                        <time slot="1" dateTime={isoDate}>
                            {i18n.t("airing_at", {
                                lng: realLang,
                                timeago: timeAgoLocale(airingAt, realLang),
                            })}
                        </time>
                    </div>
                </>
            );
        }

        return (
            <>
                <div
                    className={
                        "text-gray-800 dark:text-gray-200 flex text-sm mt-2 " + wrapMode + " " + extraClass
                    }
                >
                    <div>
                        <span className="font-medium">
                            {shouldRenderPill
                                ? i18n.t("episode_needs", { lng: realLang, episode })
                                : i18n.t("episode", { lng: realLang, episode })}
                        </span>
                        {content}
                    </div>
                </div>
            </>
        );
    }
}

export default withTranslation()(EpisodeCard);
