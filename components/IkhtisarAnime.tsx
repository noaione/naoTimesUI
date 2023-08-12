import React from "react";
import Link from "next/link";
import Router from "next/router";

import RolePopup from "./RolePopup";

import { expandRoleLocalized, expandRoleName } from "../lib/utils";
import { LatestProjectFragment } from "@/lib/graphql/projects.generated";
import { ProjectAssigneeInfo, ProjectStatusRole } from "@/lib/graphql/types.generated";
import { buildImageUrl } from "./ImageMetadata";

interface IAnimeOverview {
    data: LatestProjectFragment;
}

function getAssigneeNameV2(info?: Omit<ProjectAssigneeInfo, "integrations">) {
    if (!info) {
        return "Tidak diketahui";
    }
    if (!info.name) {
        return "Tidak diketahui";
    }
    return info.name;
}

class IkhtisarAnime extends React.Component<IAnimeOverview> {
    constructor(props: IAnimeOverview) {
        super(props);
    }

    render() {
        const { data } = this.props;
        const { statuses, assignments, poster } = data;
        const { roles, episode } = statuses[0];

        const unfinishedProgress: ProjectStatusRole[] = [];
        for (const role of roles) {
            if (!role.done) {
                unfinishedProgress.push(role);
            }
        }

        return (
            <>
                <div className="w-full lg:max-w-full lg:flex bg-white dark:bg-gray-700 dark:text-white shadow-lg rounded-lg break-all">
                    <div
                        onClick={() => Router.push("/admin/peladen/proyek/" + data.id)}
                        className="h-48 lg:h-auto lg:w-28 flex-none bg-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg text-center overflow-hidden cursor-pointer"
                        style={{ backgroundImage: `url(${buildImageUrl(poster.image, "poster")})` }}
                        title={data.title}
                    />
                    <div className="bg-white dark:bg-gray-700 p-4 flex flex-col justify-between leading-normal rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
                        <div className="mb-8">
                            <div className="text-gray-900 dark:text-gray-100 text-xl font-bold mb-1">
                                <Link
                                    href={"/admin/peladen/proyek/" + data.id}
                                    className="no-underline hover:underline cursor-pointer"
                                >
                                    {data.title}
                                </Link>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-base mb-0.5">
                                Episode {episode.toString()}
                                {unfinishedProgress.length > 0 && " sisa"}
                            </p>
                            <div className="flex flex-row flex-wrap gap-1 text-center">
                                {unfinishedProgress.length > 0 ? (
                                    unfinishedProgress.map((role) => {
                                        const assignee = assignments.find((a) => a.key === role.key);
                                        const name = getAssigneeNameV2(assignee?.assignee);
                                        const override = expandRoleName(role.key);
                                        const expandedRole = expandRoleLocalized(role.key, role.name);
                                        const popuptext = `${expandedRole}: ${name}`;
                                        return (
                                            <RolePopup
                                                key={`${role.key}-anime-${data.id}`}
                                                title={role.key}
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
