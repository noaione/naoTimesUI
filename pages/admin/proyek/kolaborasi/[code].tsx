import React from "react";
import Head from "next/head";

import { motion } from "framer-motion";

import AdminLayout from "@/components/AdminLayout";
import ErrorModal from "@/components/ErrorModal";
import MetadataHead from "@/components/MetadataHead";
import ProjectPageComponent from "@/components/ProjectPage";
import ProjectCollabComponent from "@/components/ProjectCollabPage";
import { CallbackModal } from "@/components/Modal";

import withSession, { IUserAuth, NextServerSideContextWithSession } from "@/lib/session";
import { isNone, Nullable, RoleProject } from "@/lib/utils";

import { KonfirmasiData } from "@/types/collab";
import prisma from "@/lib/prisma";
import { Project, ProjectCollabRequest } from "@prisma/client";

type KonfirmasiDataTanpaAnime = Omit<KonfirmasiData, "animeInfo">;
interface ProyekCollabConfirmationProps {
    user?: IUserAuth & { loggedIn: boolean };
    animeData: Project;
    kolebData: KonfirmasiDataTanpaAnime;
}

interface ProyekCollabConfirmationState {
    errorText: string;
}

class ProyekCollabConfirmationPage extends React.Component<
    ProyekCollabConfirmationProps,
    ProyekCollabConfirmationState
> {
    modalCb?: CallbackModal;

    constructor(props: ProyekCollabConfirmationProps) {
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
        const { user, animeData, kolebData } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";
        const { id, title, poster_data, assignments, status } = animeData;
        const { id: konfirmId, serverId: sourceServerId, serverName: sourceServerName } = kolebData;

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
                                        <motion.div
                                            className="font-medium text-gray-800 dark:text-gray-300"
                                            initial={{ x: -30, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            Kode: {konfirmId}
                                        </motion.div>
                                        <motion.div
                                            className="font-medium text-gray-800 dark:text-gray-300"
                                            initial={{ x: -30, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.25 }}
                                        >
                                            Inisiasi oleh: {sourceServerName}
                                        </motion.div>
                                        <motion.div
                                            className="text-lg font-semibold text-gray-900 dark:text-gray-200 mt-1"
                                            initial={{ x: -30, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            Staf
                                        </motion.div>
                                        <div className="flex flex-col gap-2 mt-2">
                                            {Object.keys(assignments).map((rrr, idx) => {
                                                const name = assignments[rrr].name || null;
                                                const userId = assignments[rrr].id as string;
                                                let delayAni = 0.35;
                                                if (idx > 0) {
                                                    delayAni = 0.35 + 0.1 * (idx + 1);
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
                                                        disableEditing
                                                    />
                                                );
                                            })}
                                        </div>
                                        <ProjectCollabComponent.CollabTargetConfirm
                                            konfirmId={konfirmId}
                                            sourceId={sourceServerId}
                                            targetId={user.id}
                                            animeId={id}
                                            onError={this.showErrorCallback}
                                        />
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
                            Episode
                        </motion.h2>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {status.map((res, idx) => {
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
                                        disableEditing
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
    let user = req.session.get<IUserAuth>("user");
    const { code } = params;

    if (!user) {
        return {
            redirect: {
                destination: `/?cb=/admin/proyek/kolaborasi/${code}`,
                permanent: false,
            },
        };
    }

    if (user.authType === "discord") {
        // override with server info
        user = req.session.get<IUserAuth>("userServer");
        if (!user) {
            return {
                redirect: {
                    destination: "/discord",
                    permanent: false,
                },
            };
        }
    }
    if (user.privilege === "owner") {
        return {
            notFound: true,
        };
    }

    console.info("Finding confirmation data...");
    const serverRes = await prisma.showtimesdatas.findFirst({
        where: {
            id: user.id,
        },
        select: {
            id: true,
            konfirmasi: true,
        },
    });
    let findKonfirmasi: Nullable<ProjectCollabRequest> = null;
    serverRes.konfirmasi.forEach((res) => {
        if (res.id === code && isNone(findKonfirmasi)) {
            findKonfirmasi = res;
        }
    });
    if (isNone(findKonfirmasi)) {
        console.info("The confirmation code return empty");
        return {
            notFound: true,
        };
    }
    console.info(`Confirmation data found: ${findKonfirmasi.id}`);

    console.info("Finding the target anime...");
    const targetServerRes = await prisma.showtimesdatas.findFirst({
        where: {
            id: findKonfirmasi.server_id,
        },
        select: {
            id: true,
            name: true,
            anime: true,
        },
    });
    if (isNone(targetServerRes)) {
        console.info("The fetch process return empty data...");
        return {
            notFound: true,
        };
    }
    let findAnime: Nullable<Project>;
    targetServerRes.anime.forEach((res) => {
        if (res.id === findKonfirmasi.anime_id && isNone(findAnime)) {
            findAnime = res;
        }
    });
    if (isNone(findAnime)) {
        console.info("The anime search process returned none...");
        return {
            notFound: true,
        };
    }
    console.info("Target anime found:", findAnime.id);
    const collabData: KonfirmasiDataTanpaAnime = {
        id: findKonfirmasi.id,
        serverId: targetServerRes.id,
        serverName: targetServerRes.name,
    };

    return { props: { user: { loggedIn: true, ...user }, animeData: findAnime, kolebData: collabData } };
});

export default ProyekCollabConfirmationPage;
