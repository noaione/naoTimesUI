import React from "react";
import RolePopup from "./RolePopup";

import { AssignmentsData, expandRoleLocalized, expandRoleName, getAssigneeName } from "../lib/utils";

export interface ProjectOverview {
    id: string;
    title: string;
    poster: string;
    start_time: number;
    status: {
        airtime: number;
        episode: number;
        is_done: boolean;
        progress: { [key: string]: boolean };
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
        const { progress } = status;

        const unfinishedProgress = [];
        for (const [role, isDone] of Object.entries(progress)) {
            if (!isDone) {
                unfinishedProgress.push(role);
            }
        }

        return (
            <>
                <div className="p-2 bg-white dark:bg-gray-700 rounded shadow-sm self-start">
                    <div className="flex pt-1">
                        <a className="icon h-2/3 p-2 ml-1" href={"/admin/proyek/" + data.id}>
                            <img
                                src={data.poster}
                                className="transition duration-300 ease-out transform hover:-translate-y-1"
                                alt={"Poster for " + data.title}
                            />
                        </a>
                        <div className="flex flex-col py-1">
                            <a
                                className="text-xl font-bold align-top text-gray-900 dark:text-gray-200 no-underline hover:underline cursor-pointer"
                                href={"/admin/proyek/" + data.id}
                            >
                                {data.title}
                            </a>
                            <div className="text-base text-gray-400">
                                Episode {status.episode.toString()}
                                {unfinishedProgress.length > 0 && " sisa"}
                            </div>
                            <div className="flex-row pt-2 text-center flex flex-wrap gap-1">
                                {unfinishedProgress.length > 0 ? (
                                    unfinishedProgress.map((role) => {
                                        const name = getAssigneeName(assignments[role]);
                                        const override = expandRoleName(role);
                                        const popuptext = `${expandRoleLocalized(role)}: ${name}`;
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
