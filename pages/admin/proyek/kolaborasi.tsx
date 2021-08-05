import React from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";

import GoBackIcon from "mdi-react/ArrowLeftIcon";
import { motion } from "framer-motion";

import AdminLayout from "@/components/AdminLayout";
import MetadataHead from "@/components/MetadataHead";
import SkeletonLoader from "@/components/Skeleton";

import withSession, { IUserAuth, NextServerSideContextWithSession } from "@/lib/session";
import { UserProps } from "@/models/user";
import { CollabData, Collaborations, Confirmations, KonfirmasiData } from "@/types/collab";

interface CollabCardProps {
    collab?: CollabData;
    konfirmasi?: KonfirmasiData;
    tipe: "collab" | "confirm";
}

class CollaborationSimpleCard extends React.Component<CollabCardProps> {
    constructor(props: CollabCardProps) {
        super(props);
    }

    render() {
        const { collab, konfirmasi, tipe } = this.props;
        if (tipe === "confirm") {
            const { id: konfirmId, serverId, serverName, animeInfo } = konfirmasi;
            const {
                id: animeId,
                title,
                poster_data: { url: imageUrl },
            } = animeInfo;

            return (
                <div className="w-full lg:max-w-full lg:flex bg-white dark:bg-gray-700 rounded-lg shadow-lg  break-all">
                    <div
                        onClick={() => Router.push("/admin/proyek/" + animeId + "/kolaborasi/terima")}
                        className="h-48 lg:h-auto lg:w-28 flex-none bg-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg text-center overflow-hidden cursor-pointer"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                        title={title}
                    />
                    <div className="p-4 flex flex-col justify-between leading-normal rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
                        <div className="flex flex-col py-1">
                            <Link href={"/admin/proyek/" + animeId + "/kolaborasi/terima"} passHref>
                                <a className="text-xl font-bold align-top text-gray-900 dark:text-gray-200 no-underline hover:underline cursor-pointer">
                                    {title}
                                </a>
                            </Link>
                            <div className="flex flex-row flex-wrap gap-1 pt-2 text-center">
                                <div className="flex text-gray-700 dark:text-gray-200 text-left">
                                    <span>
                                        <span className="font-semibold mr-0.5">ID:</span>
                                        {serverId}
                                    </span>
                                </div>
                                <div className="flex text-gray-700 dark:text-gray-200 text-left">
                                    <span>
                                        <span className="font-semibold mr-0.5">Dari:</span>
                                        {serverName}
                                    </span>
                                </div>
                                <div className="flex text-gray-700 dark:text-gray-200 text-left">
                                    <span>
                                        <span className="font-semibold mr-0.5">Kode:</span>
                                        <code>{konfirmId}</code>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (tipe === "collab") {
            const { id, title, image, collaborations } = collab;
            return (
                <div className="w-full lg:max-w-full lg:flex bg-white dark:bg-gray-700 rounded-lg shadow-lg  break-all">
                    <div
                        onClick={() => Router.push("/admin/proyek/" + id + "/kolaborasi")}
                        className="h-48 lg:h-auto lg:w-28 flex-none bg-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg text-center overflow-hidden cursor-pointer"
                        style={{ backgroundImage: `url(${image})` }}
                        title={title}
                    />
                    <div className="p-4 flex flex-col justify-between leading-normal rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
                        <div className="flex flex-col py-1">
                            <Link href={"/admin/proyek/" + id + "/kolaborasi"} passHref>
                                <a className="text-xl font-bold align-top text-gray-900 dark:text-gray-200 no-underline hover:underline cursor-pointer">
                                    {title}
                                </a>
                            </Link>
                            <div className="flex flex-row flex-wrap gap-1 pt-2 text-center">
                                {collaborations.map((collab) => {
                                    return <span key={`collab-${collab.id}`}>{collab.name}</span>;
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }
}

interface KolaborasiMainState {
    isLoading: boolean;
    collabData?: Collaborations;
}

class KolaborasiMainComponent extends React.Component<{}, KolaborasiMainState> {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    async componentDidMount() {
        const userObj = await fetch("/api/showtimes/proyek/collab");
        const jsonResp = await userObj.json();
        if (jsonResp.success) {
            this.setState({ collabData: jsonResp.data, isLoading: false });
        }
    }

    render() {
        const { collabData, isLoading } = this.state;

        return (
            <div className="flex flex-col">
                <motion.h2
                    className="flex flex-row gap-1 font-extrabold pb-3 dark:text-white items-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    Berlangsung
                </motion.h2>
                {isLoading ? (
                    <SkeletonLoader.ProjectOverview />
                ) : (
                    <>
                        {collabData.length > 0 ? (
                            <div className="flex flex-col">
                                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 mt-4">
                                    {collabData.map((collab) => {
                                        return (
                                            <CollaborationSimpleCard
                                                key={`collab-o-${collab.id}`}
                                                collab={collab}
                                                tipe="collab"
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <span className="dark:text-gray-200 text-gray-700 text-lg font-semibold">
                                Tidak ada proyek kolaborasi yang terdaftar!
                            </span>
                        )}
                    </>
                )}
            </div>
        );
    }
}

interface KolaborasiPendingState {
    isLoading: boolean;
    collabData?: Confirmations;
}

class KolaborasiPendingComponent extends React.Component<{}, KolaborasiPendingState> {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    async componentDidMount() {
        const userObj = await fetch("/api/showtimes/proyek/collab/pending");
        const jsonResp = await userObj.json();
        if (jsonResp.success) {
            this.setState({ collabData: jsonResp.data, isLoading: false });
        }
    }

    render() {
        const { collabData, isLoading } = this.state;

        return (
            <div className="flex flex-col">
                <motion.h2
                    className="flex flex-row gap-1 font-extrabold pb-3 dark:text-white items-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Menunggu Konfirmasi
                </motion.h2>
                {isLoading ? (
                    <SkeletonLoader.ProjectOverview />
                ) : (
                    <>
                        {collabData.length > 0 ? (
                            <div className="flex flex-col">
                                <div className="flex flex-col lg:flex-row items-center text-gray-800 dark:text-gray-100">
                                    <span>Anda bisa menggunakan bot untuk konfirmasi dengan cara:</span>
                                    <code className="bg-gray-500 p-0.5 text-white lg:ml-2 rounded-sm bg-opacity-70">
                                        !kolaborasi konfirmasi {`[kode konfirmasi]`}
                                    </code>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 mt-4">
                                    {collabData.map((collab) => {
                                        return (
                                            <CollaborationSimpleCard
                                                key={`collab-c-${collab.serverId}-${collab.animeInfo.id}`}
                                                konfirmasi={collab}
                                                tipe="confirm"
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <span className="dark:text-gray-200 text-gray-700 text-lg font-semibold">
                                Tidak ada proyek kolaborasi yang harus diterima!
                            </span>
                        )}
                    </>
                )}
            </div>
        );
    }
}

interface KolaborasiHomepageProps {
    user?: UserProps & { loggedIn: boolean };
}

class KolaborasiHomepage extends React.Component<KolaborasiHomepageProps> {
    constructor(props: KolaborasiHomepageProps) {
        super(props);
    }

    render() {
        const { user } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Kolaborasi - {pageTitle} :: naoTimesUI</title>
                    <MetadataHead.SEO title={"Kolaborasi - " + pageTitle} urlPath="/admin/proyek" />
                </Head>
                <AdminLayout user={user} title="Kolaborasi" active="projectpage">
                    <div className="container mx-auto px-6 py-8 flex flex-col gap-4">
                        <KolaborasiMainComponent />
                        <KolaborasiPendingComponent />
                        <motion.div
                            className="flex"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link href="/admin/proyek" passHref>
                                <a className="flex flex-row px-3 py-2 rounded-lg bg-blue-500 text-white transition hover:bg-blue-700 duration-200 ease-in-out items-center">
                                    <GoBackIcon className="font-bold mr-1" />
                                    <span className="font-semibold mt-0.5">Kembali</span>
                                </a>
                            </Link>
                        </motion.div>
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
                destination: "/?cb=/admin/proyek/kolaborasi",
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

export default KolaborasiHomepage;
