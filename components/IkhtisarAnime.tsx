import React from "react";
import Link from "next/link";
import Router from "next/router";

import RolePopup from "./RolePopup";

import { AssignmentsData, expandRoleLocalized, expandRoleName, getAssigneeName } from "../lib/utils";
import { ProjectEpisodeProgress } from "@prisma/client";

export interface ProjectOverview {
    id: string;
    title: string;
    poster: string;
    start_time: number;
    status: {
        airtime: number;
        episode: number;
        is_done: boolean;
        progress: ProjectEpisodeProgress;
    };
    assignments: { [key: string]: AssignmentsData };
}

interface IAnimeOverview {
    data: ProjectOverview;
}

class IkhtisarAnime extends React.Component<IAnimeOverview> {
    constructor(props: IAnimeOverview) {
        super(props);
    }

    render() {
        const { data } = this.props;
        const { status, assignments } = data;
        const {
            progress: { custom: customProgress, QC, ...progress },
        } = status;

        const unfinishedProgress = [];
        for (const [role, isDone] of Object.entries(progress)) {
            if (!isDone) {
                unfinishedProgress.push(role);
            }
        }
        const customTextMapping: { [key: string]: string } = {};
        customProgress.forEach((custom) => {
            customTextMapping[custom.key] = custom.name;
            if (!custom.done) {
                unfinishedProgress.push(custom.key);
            }
        });
        if (!QC) {
            unfinishedProgress.push("QC");
        }

        return (
            <>
                <div className="w-full lg:max-w-full lg:flex bg-white dark:bg-gray-700 dark:text-white shadow-lg rounded-lg break-all">
                    <div
                        onClick={() => Router.push("/admin/proyek/" + data.id)}
                        className="h-48 lg:h-auto lg:w-28 flex-none bg-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg text-center overflow-hidden cursor-pointer"
                        style={{ backgroundImage: `url(${data.poster})` }}
                        title={data.title}
                    />
                    <div className="bg-white dark:bg-gray-700 p-4 flex flex-col justify-between leading-normal rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
                        <div className="mb-8">
                            <div className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-1">
                                <Link href={"/admin/proyek/" + data.id} passHref>
                                    <a className="no-underline hover:underline cursor-pointer">
                                        {data.title}
                                    </a>
                                </Link>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-base mb-0.5">
                                Episode {status.episode.toString()}
                                {unfinishedProgress.length > 0 && " sisa"}
                            </p>
                            <div className="flex flex-row flex-wrap gap-1 text-center">
                                {unfinishedProgress.length > 0 ? (
                                    unfinishedProgress.map((role) => {
                                        const name = getAssigneeName(assignments[role]);
                                        const override = expandRoleName(role);
                                        const expandedRole =
                                            customTextMapping[role] || expandRoleLocalized(role);
                                        const popuptext = `${expandedRole}: ${name}`;
                                        return (
                                            <RolePopup
                                                key={`${role}-anime-${data.id}`}
                                                title={role}
                                                popupText={popuptext}
                                                overrideTitle={override}
                                            />
                                        );
                                    })
                                ) : (
                                    <div className="text-lg font-light text-gray-800 dark:text-gray-300">
                                        Menunggu rilis...
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default IkhtisarAnime;
