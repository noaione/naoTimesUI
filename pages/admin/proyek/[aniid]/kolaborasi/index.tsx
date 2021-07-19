import React from "react";
import Head from "next/head";
import Link from "next/link";

import GoBackIcon from "mdi-react/ArrowLeftIcon";
import { motion } from "framer-motion";

import AdminLayout from "@/components/AdminLayout";
import ErrorModal from "@/components/ErrorModal";
import MetadataHead from "@/components/MetadataHead";
import ProjectPageComponent from "@/components/ProjectPage";
import ProjectCollabComponent from "@/components/ProjectCollabPage";
import { CallbackModal } from "@/components/Modal";

import dbConnect from "@/lib/dbConnect";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "@/lib/session";
import { isNone, Nullable, RoleProject } from "@/lib/utils";

import { UserProps } from "@/models/user";
import { ShowAnimeProps, ShowtimesModel, ShowtimesProps } from "@/models/show";

interface ProyekCollabPageProps {
    user?: UserProps & { loggedIn: boolean };
    animeData: ShowAnimeProps;
}

interface ProyekCollabPageState {
    errorText: string;
}

class ProyekPageCollab extends React.Component<ProyekCollabPageProps, ProyekCollabPageState> {
    modalCb?: CallbackModal;

    constructor(props: ProyekCollabPageProps) {
        super(props);
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
        const { id, title, poster_data, assignments, aliases, kolaborasi } = animeData;

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;

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
                                        </div>
                                        <div className="flex row mt-4 gap-3">
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container mx-auto px-6 py-4">
                        <motion.h2 className="flex flex-row gap-1 font-extrabold pb-3 dark:text-white items-center">
                            Aktif
                        </motion.h2>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {kolaborasi.length > 0 ? (
                                <>
                                    {kolaborasi.map((kolebId) => {
                                        return (
                                            <ProjectCollabComponent.CollabCard
                                                key={`collab-active-${kolebId}`}
                                                id={kolebId}
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
                        <motion.h2 className="flex flex-row gap-1 font-extrabold pb-3 dark:text-white items-center">
                            Konfirmasi
                        </motion.h2>
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
    const user = req.session.get<IUserAuth>("user");
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
    const serverRes = (await ShowtimesModel.findOne(
        { id: { $eq: user.id } },
        { id: 1, name: 1, anime: 1 }
    ).lean()) as ShowtimesProps;
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

export default ProyekPageCollab;
