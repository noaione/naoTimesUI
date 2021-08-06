import React from "react";
import Head from "next/head";
import Link from "next/link";

import CollabIcon from "mdi-react/AccountArrowRightOutlineIcon";
import { motion } from "framer-motion";

import AdminLayout from "../../../../components/AdminLayout";
import ErrorModal from "../../../../components/ErrorModal";
import LoadingCircle from "../../../../components/LoadingCircle";
import MetadataHead from "../../../../components/MetadataHead";
import ProjectPageComponent from "../../../../components/ProjectPage";
import { CallbackModal } from "../../../../components/Modal";

import dbConnect from "../../../../lib/dbConnect";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../../../lib/session";
import { isNone, Nullable, RoleProject } from "../../../../lib/utils";

import { UserProps } from "../../../../models/user";
import { EpisodeStatusProps, ShowAnimeProps, ShowtimesModel, ShowtimesProps } from "../../../../models/show";

interface RemovedEpisodeData {
    episode: number;
    index: number;
}

interface ProyekPageProps {
    user?: UserProps & { loggedIn: boolean };
    animeData: ShowAnimeProps;
}

interface ProyekPageState {
    errorText: string;
    episodeMod: boolean;
    deletedEpisode: number[];
    statusData: EpisodeStatusProps[];
    isSubmitting: boolean;
}

class ProyekMainPage extends React.Component<ProyekPageProps, ProyekPageState> {
    modalCb?: CallbackModal;

    constructor(props: ProyekPageProps) {
        super(props);
        this.showErrorCallback = this.showErrorCallback.bind(this);
        this.deleteEpisode = this.deleteEpisode.bind(this);
        this.deleteTheEpisode = this.deleteTheEpisode.bind(this);
        this.toggleModifyButton = this.toggleModifyButton.bind(this);
        this.addAndJoinEpisode = this.addAndJoinEpisode.bind(this);
        const {
            animeData: { status },
        } = props;
        this.state = {
            errorText: "",
            episodeMod: false,
            deletedEpisode: [],
            statusData: status,
            isSubmitting: false,
        };
    }

    showErrorCallback(errorText: string) {
        this.setState({ errorText });
        if (this.modalCb) {
            this.modalCb.showModal();
        }
    }

    deleteEpisode(episode: number) {
        this.setState((o) => ({ deletedEpisode: o.deletedEpisode.concat([episode]) }));
    }

    addAndJoinEpisode(episodes: EpisodeStatusProps[]) {
        this.setState((o) => ({
            statusData: o.statusData.concat(episodes),
            episodeMod: false,
            deletedEpisode: [],
        }));
    }

    async deleteTheEpisode() {
        const { episodeMod, isSubmitting, deletedEpisode, statusData } = this.state;
        if (!episodeMod) {
            return;
        }
        if (isSubmitting) {
            return;
        }
        if (deletedEpisode.length < 1) {
            this.setState({ isSubmitting: false, deletedEpisode: [] });
            return;
        }
        this.setState({ isSubmitting: true });
        const {
            animeData: { id },
        } = this.props;
        const sendData = {
            event: "remove",
            changes: {
                episodes: deletedEpisode,
                animeId: id,
            },
        };
        const request = await fetch("/api/showtimes/proyek/episode", {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const response = await request.json();
        if (!response.success) {
            this.showErrorCallback(response.message);
        } else {
            const removedEpisodeData = response.data as RemovedEpisodeData[];
            const removedEpisodes = removedEpisodeData.map((e) => e.episode);
            const newStatusData = statusData.filter((o) => !removedEpisodes.includes(o.episode));
            this.setState({ statusData: newStatusData });
        }
        this.setState({ isSubmitting: false, deletedEpisode: [], episodeMod: false });
    }

    toggleModifyButton() {
        if (this.state.episodeMod) {
            this.deleteTheEpisode()
                .then(() => {
                    return;
                })
                .catch(() => {
                    return;
                });
        } else {
            this.setState({ episodeMod: true });
        }
    }

    render() {
        const { episodeMod, isSubmitting, statusData } = this.state;
        const { user, animeData } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";
        const { id, title, poster_data, assignments, aliases } = animeData;

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
                </Head>
                <AdminLayout user={user} title={title} active="projectpage">
                    <div className="container mx-auto px-6 py-8">
                        <div id="project-data" className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
                            <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-md">
                                <div className="flex flex-col md:flex-row py-1">
                                    <div className="icon h-5/6 p-1 mx-auto md:mr-3 md:ml-0 z-[5]">
                                        <motion.img
                                            className="transition duration-300 ease-out transform hover:-translate-y-1"
                                            src={poster_data.url}
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        />
                                    </div>
                                    <div className="flex flex-col md:w-1/2">
                                        <motion.div
                                            className="text-xl font-bold text-gray-900 dark:text-gray-200"
                                            initial={{ x: -25, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            {title}
                                        </motion.div>
                                        <ProjectPageComponent.Aliases
                                            onErrorModal={this.showErrorCallback}
                                            aniId={id}
                                            aliases={aliases}
                                        />
                                        <motion.div
                                            className="text-lg font-semibold text-gray-900 dark:text-gray-200 mt-1"
                                            initial={{ x: -30, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            Staf
                                        </motion.div>
                                        <div className="flex flex-col gap-2 mt-2">
                                            {Object.keys(assignments).map((rrr, idx) => {
                                                const name = assignments[rrr].name || null;
                                                const userId = assignments[rrr].id as string;
                                                let delayAni = 0.25;
                                                if (idx > 0) {
                                                    delayAni = 0.25 + 0.1 * (idx + 1);
                                                }

                                                return (
                                                    <ProjectPageComponent.Staff
                                                        onErrorModal={outerThis.showErrorCallback}
                                                        key={rrr + "-staff-" + id}
                                                        id={rrr as RoleProject}
                                                        name={name}
                                                        userId={userId}
                                                        animeId={id}
                                                        animateDelay={delayAni}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <div className="flex row mt-4 gap-3">
                                            <ProjectPageComponent.Deletion
                                                onErrorModal={this.showErrorCallback}
                                                id={id}
                                            />
                                            <motion.div
                                                className="flex flex-col"
                                                initial={{ y: -20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 1.1 }}
                                            >
                                                <Link href={`/admin/proyek/${id}/kolaborasi`} passHref>
                                                    <a className="flex flex-row px-3 py-2 rounded-lg bg-yellow-600 text-white transition hover:bg-yellow-700 duration-200 ease-in-out items-center">
                                                        <CollabIcon className="font-bold mr-1" />
                                                        <span className="font-semibold mt-0.5">
                                                            Kolaborasi
                                                        </span>
                                                    </a>
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container mx-auto px-6 py-4">
                        <motion.h2
                            className="flex flex-row gap-1 font-extrabold pb-3 dark:text-white items-center"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span>Episode</span>
                            <button
                                disabled={isSubmitting}
                                className={`flex flex-row items-center ml-2 text-white font-semibold ${
                                    episodeMod
                                        ? isSubmitting
                                            ? "bg-green-400 cursor-not-allowed"
                                            : "bg-green-500 hover:bg-green-600"
                                        : "bg-blue-500 hover:bg-blue-600"
                                } hover:shadow-lg transition duration-200 rounded-md text-lg py-1 px-3 focus:outline-none`}
                                onClick={this.toggleModifyButton}
                            >
                                {isSubmitting && <LoadingCircle className="ml-0 mr-2 mt-0" />}
                                Modify
                            </button>
                            {episodeMod && (
                                <button
                                    disabled={isSubmitting}
                                    className={`flex flex-row items-center ml-2 text-white font-semibold ${
                                        isSubmitting
                                            ? "bg-red-400 cursor-not-allowed"
                                            : "bg-red-500 hover:bg-red-600"
                                    } hover:shadow-lg transition duration-200 rounded-md text-lg py-1 px-3 focus:outline-none`}
                                    onClick={() => {
                                        this.setState((pl) => ({
                                            episodeMod: !pl.episodeMod,
                                            deletedEpisode: [],
                                        }));
                                    }}
                                >
                                    Cancel
                                </button>
                            )}
                        </motion.h2>
                        {episodeMod && (
                            <ProjectPageComponent.EpisodeAdd
                                animeId={id}
                                lastStatus={statusData[statusData.length - 1]}
                                onError={this.showErrorCallback}
                                onUpdated={this.addAndJoinEpisode}
                                disabled={isSubmitting}
                            />
                        )}
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {!episodeMod
                                ? statusData.map((res, idx) => {
                                      let delayAni = 0.25;
                                      if (idx > 0) {
                                          delayAni = 0.25 + 0.1 * (idx + 1);
                                      }
                                      return (
                                          <ProjectPageComponent.Episode
                                              key={`anime-${id}-episode-${res.episode}`}
                                              onErrorModal={outerThis.showErrorCallback}
                                              animeId={id}
                                              episode={res.episode}
                                              airTime={res.airtime}
                                              status={res.progress}
                                              isReleased={res.is_done}
                                              animateDelay={delayAni}
                                          />
                                      );
                                  })
                                : statusData.map((res) => {
                                      return (
                                          <ProjectPageComponent.EpisodeModify
                                              key={`anime-${id}-${res.episode}`}
                                              episode={res.episode}
                                              onDeleted={this.deleteEpisode}
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

export default ProyekMainPage;
