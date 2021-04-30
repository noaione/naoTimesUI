import React from "react";
import Head from "next/head";
import Router from "next/router";

import PlusIcon from "mdi-react/PlusIcon";

import AdminLayout from "../../../components/AdminLayout";
import MetadataHead from "../../../components/MetadataHead";
import LoadingCircle from "../../../components/LoadingCircle";
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
                <div className="w-full lg:max-w-full lg:flex bg-white dark:bg-gray-700 rounded-lg shadow-start break-all">
                    <div
                        onClick={() => Router.push("/admin/proyek/" + id)}
                        className="h-48 lg:h-auto lg:w-28 flex-none bg-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg text-center overflow-hidden cursor-pointer"
                        style={{ backgroundImage: `url(${poster})` }}
                        title={title}
                    />
                    <div className="p-4 flex flex-col justify-between leading-normal rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
                        <div className="flex flex-col py-1">
                            <a
                                className="text-xl font-bold align-top text-gray-900 dark:text-gray-200 no-underline hover:underline cursor-pointer"
                                href={"/admin/proyek/" + id}
                            >
                                {title}
                            </a>
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
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user} title="Proyek" active="project">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex">
                            <a
                                href="/admin/proyek/tambah"
                                className="flex flex-row px-3 py-2 rounded-lg bg-green-500 text-white transition hover:bg-green-700 duration-200 ease-in-out items-center"
                            >
                                <PlusIcon className="font-bold" />
                                <span className="font-semibold mt-0.5">Tambah</span>
                            </a>
                        </div>
                        {isLoading ? (
                            <div className="flex flex-row mt-4">
                                <LoadingCircle />
                                <p className="font-bold dark:text-gray-200 text-xl">Memuat...</p>
                            </div>
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
                destination: "/",
                permanent: false,
            },
        };
    }

    return { props: { user: { loggedIn: true, ...user } } };
});

export default ProyekHomepage;
