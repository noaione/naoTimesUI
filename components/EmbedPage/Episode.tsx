import React from "react";
import { DateTime } from "luxon";

import RolePopup from "../RolePopup";

import { Locale, timeAgoLocale, translate, ValidLocale } from "../../i18n";
import type { ProjectEpisodeProgress } from "@prisma/client";

interface IEpisodeProps {
    airingAt?: number;
    episode: number;
    progress: ProjectEpisodeProgress;
    lang: Locale;
    delayReason?: string;
}

class EpisodeCard extends React.Component<IEpisodeProps> {
    constructor(props: IEpisodeProps) {
        super(props);
    }

    render() {
        const {
            progress: { custom: customProgress, ...progress },
            episode,
            airingAt,
            lang,
        } = this.props;
        const unfinishedStatus: string[] = [];
        const customTextMapping: { [key: string]: string } = {};
        customProgress.forEach((custom) => {
            if (!custom.done) {
                customTextMapping[custom.key] = custom.name;
            }
        });
        for (const [roleName, roleStat] of Object.entries(progress)) {
            if (!roleStat) {
                unfinishedStatus.push(roleName);
            }
        }
        const qcDex = unfinishedStatus.indexOf("QC");
        if (qcDex !== -1) {
            // insert custom text before QC
            unfinishedStatus.splice(qcDex, 0, ...Object.keys(customTextMapping));
        } else {
            // append custom text to the end
            unfinishedStatus.push(...Object.keys(customTextMapping));
        }
        const currentTime = DateTime.utc().toSeconds();
        let aired = true;
        if (airingAt && airingAt > currentTime) {
            aired = false;
        }
        let realLang: Locale = "id";
        if (lang && ValidLocale.includes(lang)) {
            realLang = lang;
        }
        const anyProgress = unfinishedStatus.length !== 7;
        const wrapMode = unfinishedStatus.length > 5 ? "flex-col" : "flex-row";
        const extraClass = unfinishedStatus.length > 4 ? "col-start-1 col-end-3" : "";

        let content: React.ReactNode;
        let shouldRenderPill = false;
        if (aired) {
            if (anyProgress) {
                if (unfinishedStatus.length > 0) {
                    content = (
                        <>
                            <div slot="2" className="flex flex-wrap gap-1 mt-1">
                                {unfinishedStatus.map((role) => {
                                    const customText = customTextMapping[role];
                                    if (customText) {
                                        return (
                                            <RolePopup
                                                key={`ep-${episode}-custom-${role}`}
                                                title={role}
                                                popupText={customText}
                                            />
                                        );
                                    }
                                    return (
                                        <RolePopup
                                            key={`ep-${episode}-${role}`}
                                            title={role}
                                            popupText={translate(`ROLES.${role}`, realLang)}
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
                                    {translate("WAITING_RELEASE", realLang)}
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
                                    {translate("AIRED", realLang, [timeAgoLocale(airingAt, realLang)])}
                                </time>
                            </div>
                            <div>
                                <span slot="0">{translate("NO_PROGRESS", realLang)}</span>
                            </div>
                        </>
                    );
                } else {
                    content = (
                        <>
                            <div>
                                <span slot="0">{translate("NO_PROGRESS", realLang)}</span>
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
                            {translate("AIRED", realLang, [timeAgoLocale(airingAt, realLang)])}
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
                        Episode <span slot="0">{episode.toString()}</span>{" "}
                        {shouldRenderPill ? translate("EPISODE_NEEDS", realLang) : ""}
                        {content}
                    </div>
                </div>
            </>
        );
    }
}

export default EpisodeCard;
