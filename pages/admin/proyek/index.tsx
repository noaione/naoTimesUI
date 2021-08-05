import React from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";

import PlusIcon from "mdi-react/PlusIcon";
import CollabIcon from "mdi-react/AccountArrowRightOutlineIcon";

import AdminLayout from "../../../components/AdminLayout";
import MetadataHead from "../../../components/MetadataHead";
import SkeletonLoader from "../../../components/Skeleton";
import RolePopup from "../../../components/RolePopup";

import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../../lib/session";
import {
    AssignmentsData,
    expandRoleLocalized,
    expandRoleName,
    getAssigneeName,
    RoleProject,
} from "../../../lib/utils";

import { UserProps } from "../../../models/user";

interface AnimeProyekData {
    id: string;
    title: string;
    assignments: { [role: string]: AssignmentsData };
    poster: string;
    is_finished: boolean;
}

interface ProyekCardProps {
    anime: AnimeProyekData;
}

class ProyekSimpleCard extends React.Component<ProyekCardProps> {
    constructor(props: ProyekCardProps) {
        super(props);
    }

    render() {
        const { anime } = this.props;
        const { id, title, assignments, poster, is_finished } = anime;

        function generateStatusText() {
            if (is_finished) {
                return <div className="text-base font-semibold text-green-500">Tamat</div>;
            }
            return <div className="text-base font-semibold text-red-500">Proses</div>;
        }

        return (
            <>
                <div className="w-full lg:max-w-full lg:flex bg-white dark:bg-gray-700 rounded-lg shadow-lg  break-all">
                    <div
                        onClick={() => Router.push("/admin/proyek/" + id)}
                        className="h-48 lg:h-auto lg:w-28 flex-none bg-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg text-center overflow-hidden cursor-pointer"
                        style={{ backgroundImage: `url(${poster})` }}
                        title={title}
                    />
                    <div className="p-4 flex flex-col justify-between leading-normal rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
                        <div className="flex flex-col py-1">
                            <Link href={"/admin/proyek/" + id} passHref>
                                <a className="text-xl font-bold align-top text-gray-900 dark:text-gray-200 no-underline hover:underline cursor-pointer">
                                    {title}
                                </a>
                            </Link>
                            {generateStatusText()}
                            <div className="flex flex-row flex-wrap gap-1 pt-2 text-center">
                                {Object.keys(assignments).map((roleName) => {
                                    const assigneeValues = assignments[roleName];
                                    const expandRole = expandRoleName(roleName);
                                    const titleRole = expandRoleLocalized(roleName);
                                    const name = getAssigneeName(assigneeValues);
                                    return (
                                        <RolePopup
                                            key={`${roleName}-anime-${id}`}
                                            title={roleName as RoleProject}
                                            popupText={titleRole}
                                            overrideTitle={`${expandRole}: ${name}`}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

interface ProyekHomepageState {
    isLoading: boolean;
    animeData?: AnimeProyekData[];
}

interface ProyekHomepageProps {
    user?: UserProps & { loggedIn: boolean };
}

class ProyekHomepage extends React.Component<ProyekHomepageProps, ProyekHomepageState> {
    constructor(props: ProyekHomepageProps) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    async componentDidMount() {
        const userObj = await fetch("/api/showtimes/proyek");
        const jsonResp = await userObj.json();
        if (jsonResp.code === 200) {
            this.setState({ animeData: jsonResp.data, isLoading: false });
        }
    }

    render() {
        const { isLoading, animeData } = this.state;
        const { user } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Proyek - {pageTitle} :: naoTimesUI</title>
                    <MetadataHead.SEO title={"Proyek - " + pageTitle} urlPath="/admin/proyek" />
                </Head>
                <AdminLayout user={user} title="Proyek" active="project">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex flex-row gap-2">
                            <Link href="/admin/proyek/tambah" passHref>
                                <a className="flex flex-row px-3 py-2 rounded-lg bg-green-500 text-white transition hover:bg-green-700 duration-200 ease-in-out items-center">
                                    <PlusIcon className="font-bold mr-1" />
                                    <span className="font-semibold mt-0.5">Tambah</span>
                                </a>
                            </Link>
                            <Link href="/admin/proyek/kolaborasi" passHref>
                                <a className="flex flex-row px-3 py-2 rounded-lg bg-yellow-500 text-white transition hover:bg-yellow-700 duration-200 ease-in-out items-center">
                                    <CollabIcon className="font-bold mr-1" />
                                    <span className="font-semibold mt-0.5">Kolaborasi</span>
                                </a>
                            </Link>
                        </div>
                        {isLoading ? (
                            <SkeletonLoader.ProjectOverview />
                        ) : (
                            <>
                                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 mt-4">
                                    {animeData.length > 0 ? (
                                        animeData.map((anime) => {
                                            return (
                                                <ProyekSimpleCard
                                                    anime={anime}
                                                    key={`anime-proyek-${anime.id}`}
                                                />
                                            );
                                        })
                                    ) : (
                                        <span className="font-bold dark:text-gray-200 text-xl">
                                            Tidak ada proyek yang terdaftar
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({ req }: NextServerSideContextWithSession) {
    const user = req.session.get<IUserAuth>("user");

    if (!user) {
        return {
            redirect: {
                destination: "/?cb=/admin/proyek",
                permanent: false,
            },
        };
    }
    if (user.privilege === "owner") {
        return {
            notFound: true,
        };
    }

    return { props: { user: { loggedIn: true, ...user } } };
});

export default ProyekHomepage;
