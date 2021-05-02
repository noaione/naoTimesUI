import React from "react";
import Head from "next/head";

import AdminLayout from "../../../components/AdminLayout";
import ErrorModal from "../../../components/ErrorModal";
import MetadataHead from "../../../components/MetadataHead";
import ProjectPageComponent from "../../../components/ProjectPage";
import { CallbackModal } from "../../../components/Modal";

import dbConnect from "../../../lib/dbConnect";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../../lib/session";
import { isNone, Nullable, RoleProject } from "../../../lib/utils";

import { UserProps } from "../../../models/user";
import { ShowAnimeProps, ShowtimesModel, ShowtimesProps } from "../../../models/show";

interface ProyekPageProps {
    user?: UserProps & { loggedIn: boolean };
    animeData: ShowAnimeProps;
}

interface ProyekPageState {
    errorText: string;
}

class ProyekHomepage extends React.Component<ProyekPageProps, ProyekPageState> {
    modalCb?: CallbackModal;

    constructor(props: ProyekPageProps) {
        super(props);
        this.showErrorCallback = this.showErrorCallback.bind(this);
        this.state = {
            errorText: "",
        };
    }

    showErrorCallback(errorText: string) {
        this.setState({ errorText });
        if (this.modalCb) {
            this.modalCb.showModal();
        }
    }

    render() {
        const { user, animeData } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";
        const { id, title, poster_data, assignments, status, aliases } = animeData;

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>
                        {title} - {pageTitle} :: naoTimesUI
                    </title>
                    <MetadataHead.SEO
                        title={title + " - " + pageTitle}
                        urlPath={"/admin/proyek/" + animeData.id}
                    />
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user} title={title} active="projectpage">
                    <div className="container mx-auto px-6 py-8">
                        <div id="project-data" className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
                            <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-md">
                                <div className="flex flex-col md:flex-row py-1">
                                    <div className="icon h-5/6 p-1 mx-auto md:mr-3 md:ml-0">
                                        <img
                                            className="transition duration-300 ease-out transform hover:-translate-y-1"
                                            src={poster_data.url}
                                        />
                                    </div>
                                    <div className="flex flex-col md:w-1/2">
                                        <div className="text-xl font-bold text-gray-900 dark:text-gray-200">
                                            {title}
                                        </div>
                                        <ProjectPageComponent.Aliases
                                            onErrorModal={this.showErrorCallback}
                                            aniId={id}
                                            aliases={aliases}
                                        />
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-200 mt-1">
                                            Staf
                                        </div>
                                        <div className="flex flex-col gap-2 mt-2">
                                            {Object.keys(assignments).map((rrr) => {
                                                const name = assignments[rrr].name || null;
                                                const userId = assignments[rrr].id as string;

                                                return (
                                                    <ProjectPageComponent.Staff
                                                        onErrorModal={outerThis.showErrorCallback}
                                                        key={rrr + "-staff-" + id}
                                                        id={rrr as RoleProject}
                                                        name={name}
                                                        userId={userId}
                                                        animeId={id}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <ProjectPageComponent.Deletion
                                            onErrorModal={this.showErrorCallback}
                                            id={id}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container mx-auto px-6 py-4">
                        <h2 className="font-extrabold pb-3 dark:text-white">Episode</h2>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {status.map((res) => {
                                return (
                                    <ProjectPageComponent.Episode
                                        key={`anime-${id}-episode-${res.episode}`}
                                        onErrorModal={outerThis.showErrorCallback}
                                        animeId={id}
                                        episode={res.episode}
                                        airTime={res.airtime}
                                        status={res.progress}
                                        isReleased={res.is_done}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <ErrorModal onMounted={(cb) => (this.modalCb = cb)}>{this.state.errorText}</ErrorModal>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({
    req,
    params,
}: NextServerSideContextWithSession) {
    const user = req.session.get<IUserAuth>("user") as UserProps;
    const { aniid } = params;

    if (!user) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    if (user.privilege === "owner") {
        return {
            notFound: true,
        };
    }

    await dbConnect();
    const serverRes = (await ShowtimesModel.findOne({ id: { $eq: user.id } }).lean()) as ShowtimesProps;
    let findAnime: Nullable<ShowAnimeProps>;
    serverRes.anime.forEach((res) => {
        if (res.id === aniid && isNone(findAnime)) {
            findAnime = res;
        }
    });
    if (isNone(findAnime)) {
        return {
            notFound: true,
        };
    }

    return { props: { user: { loggedIn: true, ...user }, animeData: findAnime } };
});

export default ProyekHomepage;
