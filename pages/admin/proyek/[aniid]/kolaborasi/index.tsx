import React from "react";
import Head from "next/head";
import Link from "next/link";

import GoBackIcon from "mdi-react/ArrowLeftIcon";
import AddNewIcon from "mdi-react/AccountPlusOutlineIcon";
import { motion } from "framer-motion";

import AdminLayout from "@/components/AdminLayout";
import ErrorModal from "@/components/ErrorModal";
import MetadataHead from "@/components/MetadataHead";
import ProjectPageComponent from "@/components/ProjectPage";
import ProjectCollabComponent from "@/components/ProjectCollabPage";
import { CallbackModal } from "@/components/Modal";

import { IUserAuth, withSessionSsr } from "@/lib/session";
import { isNone, Nullable, RoleProject } from "@/lib/utils";
import { Project } from "@prisma/client";
import prisma from "@/lib/prisma";

interface ProyekCollabPageProps {
    user?: IUserAuth & { loggedIn: boolean };
    animeData: Project;
}

interface ProyekCollabPageState {
    errorText: string;
}

class ProyekPageCollab extends React.Component<ProyekCollabPageProps, ProyekCollabPageState> {
    modalCb?: CallbackModal;

    constructor(props: ProyekCollabPageProps) {
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
        const {
            id,
            title,
            poster_data,
            assignments: { custom: customAssignee, ...assignments },
            aliases,
            kolaborasi,
        } = animeData;

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;

        const customAssigneeName: { [role: string]: string } = {};
        customAssignee.forEach((o) => {
            customAssigneeName[o.key] = o.name;
        });

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>
                        Kolaborasi - {title} - {pageTitle} :: naoTimesUI
                    </title>
                    <MetadataHead.SEO
                        title={"Kolaborasi - " + title + " - " + pageTitle}
                        urlPath={"/admin/proyek/" + animeData.id + "/kolaborasi"}
                    />
                </Head>
                <AdminLayout user={user} title={title + " - Kolaborasi"} active="projectpage">
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
                                            disableEditing
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
                                                        disableEditing
                                                    />
                                                );
                                            })}
                                            {customAssignee.map((rrr, idx) => {
                                                const name = rrr.person.name || null;
                                                const userId = rrr.person.id as string;
                                                let delayAni = 0.25;
                                                if (idx >= 0) {
                                                    delayAni = 0.25 + 0.1 * (idx + 8);
                                                }

                                                return (
                                                    <ProjectPageComponent.Staff
                                                        onErrorModal={outerThis.showErrorCallback}
                                                        key={rrr.key + "-custom-staff-" + id}
                                                        id={rrr.key as RoleProject}
                                                        name={name}
                                                        userId={userId}
                                                        animeId={id}
                                                        animateDelay={delayAni}
                                                        assigneeName={customAssigneeName}
                                                        disableEditing
                                                    />
                                                );
                                            })}
                                        </div>
                                        <div className="flex row mt-4 gap-2">
                                            <motion.div
                                                className="flex flex-col"
                                                initial={{ y: -20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 1.1 }}
                                            >
                                                <Link href={`/admin/proyek/${id}`} passHref>
                                                    <a className="flex flex-row px-3 py-2 rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 duration-200 ease-in-out items-center">
                                                        <GoBackIcon className="font-bold mr-1" />
                                                        <span className="font-semibold mt-0.5">Kembali</span>
                                                    </a>
                                                </Link>
                                            </motion.div>
                                            <motion.div
                                                className="flex flex-col"
                                                initial={{ y: -20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 1.15 }}
                                            >
                                                <Link href={`/admin/proyek/${id}/kolaborasi/tambah`} passHref>
                                                    <a className="flex flex-row px-3 py-2 rounded-lg bg-green-600 text-white transition hover:bg-green-700 duration-200 ease-in-out items-center">
                                                        <AddNewIcon className="font-bold mr-1" />
                                                        <span className="font-semibold mt-0.5">Tambah</span>
                                                    </a>
                                                </Link>
                                            </motion.div>
                                            {kolaborasi.length > 0 && (
                                                <motion.div
                                                    className="flex flex-col"
                                                    initial={{ y: -20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 1.2 }}
                                                >
                                                    <ProjectCollabComponent.CollabSever
                                                        id={user.id}
                                                        animeId={id}
                                                        onError={this.showErrorCallback}
                                                    />
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container mx-auto px-6 py-4">
                        <motion.div className="flex flex-row gap-1 pb-3 items-center">
                            <div className="flex font-extrabold dark:text-white">Aktif</div>
                        </motion.div>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {kolaborasi.length > 0 ? (
                                <>
                                    {kolaborasi.map((kolebId) => {
                                        const selfId = { id: user.id, name: user.name };
                                        if (isNone(selfId.name)) {
                                            selfId.name = "[Anda sendiri]";
                                        } else {
                                            selfId.name += " [Anda sendiri]";
                                        }
                                        return (
                                            <ProjectCollabComponent.CollabCard
                                                key={`collab-active-${kolebId}`}
                                                id={kolebId}
                                                selfId={selfId}
                                            />
                                        );
                                    })}
                                </>
                            ) : (
                                <span className="dark:text-gray-200 text-gray-800 text-lg font-semibold">
                                    Tidak ada kolaborasi
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="container mx-auto px-6 py-4">
                        <motion.div className="flex flex-row gap-1 pb-3 items-center">
                            <div className="flex font-extrabold dark:text-white">Menunggu Konfirmasi</div>
                        </motion.div>
                        <ProjectCollabComponent.Confirms animeId={id} />
                    </div>
                    <ErrorModal onMounted={(cb) => (this.modalCb = cb)}>{this.state.errorText}</ErrorModal>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSessionSsr(async function ({ req, params }) {
    const { aniid } = params;
    let user = req.session.user;

    if (!user) {
        return {
            redirect: {
                destination: "/?cb=/admin/proyek/kolaborasi",
                permanent: false,
            },
        };
    }

    if (user.authType === "discord") {
        // override with server info
        user = req.session.userServer;
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

    const serverRes = await prisma.showtimesdatas.findFirst({
        where: {
            id: user.id,
        },
        select: {
            id: true,
            name: true,
            anime: true,
        },
    });
    let findAnime: Nullable<Project>;
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

export default ProyekPageCollab;
