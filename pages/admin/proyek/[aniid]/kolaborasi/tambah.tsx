import React from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";

import GoBackIcon from "mdi-react/ArrowLeftIcon";
import SwordIcon from "mdi-react/SwordCrossIcon";
import SelectAsync from "react-select/async";
import { ActionMeta } from "react-select";
import { motion } from "framer-motion";

import AdminLayout from "@/components/AdminLayout";
import ErrorModal from "@/components/ErrorModal";
import MetadataHead from "@/components/MetadataHead";
import LoadingCircle from "@/components/LoadingCircle";
import { CallbackModal } from "@/components/Modal";

import { IUserAuth, withSessionSsr } from "@/lib/session";
import { isNone, Nullable } from "@/lib/utils";

import { Project } from "@prisma/client";
import prisma from "@/lib/prisma";

function optionValueChannel(data: any) {
    const { id, name } = data;
    return `${name} (${id})`;
}

function matchFilterProper(data: any, inputValue: string) {
    const matchRe = new RegExp(`(${inputValue})`, "i");
    const dataID = data.id;
    const dataName = data.name;
    return Boolean(dataID.match(matchRe)) || Boolean(dataName.match(matchRe));
}

interface ProyekCollabPageProps {
    user?: IUserAuth & { loggedIn: boolean };
    animeData: Project;
}

interface ProyekCollabPageState {
    errorText: string;
    newCollab: string;
    newCollabName: string;
    confirmCode: string;
    isSubmit: boolean;
}

interface ChannelData {
    id: string;
    name: string;
}

class ProyekPageCollabAddition extends React.Component<ProyekCollabPageProps, ProyekCollabPageState> {
    modalCb?: CallbackModal;

    constructor(props: ProyekCollabPageProps) {
        super(props);
        this.showErrorCallback = this.showErrorCallback.bind(this);
        this.onServerSelection = this.onServerSelection.bind(this);
        this.loadServers = this.loadServers.bind(this);
        this.initiateNewCollab = this.initiateNewCollab.bind(this);
        this.state = {
            errorText: "",
            newCollab: "",
            newCollabName: "",
            confirmCode: "",
            isSubmit: false,
        };
    }

    loadServers(inputValue: string, callback: Function) {
        interface RawAPIResult {
            result: ChannelData[];
            message?: string;
            success: boolean;
        }

        axios
            .get<RawAPIResult>("/api/showtimes/servers", { responseType: "json" })
            .then((res) => {
                const results = res.data;
                let rawOptions = results.result;
                // Filter out anything that doesnt contain name
                rawOptions = rawOptions.filter((item) => typeof item.name === "string");
                // Filter out the current server ID
                rawOptions = rawOptions.filter((item) => item.id !== this.props.user?.id);
                const filteredResults = rawOptions.filter((item) => matchFilterProper(item, inputValue));
                callback(filteredResults);
            })
            .catch((err) => {
                console.error(err);
                callback([]);
            });
    }

    onServerSelection(data: any, action: ActionMeta<any>) {
        if (!["select-option", "clear"].includes(action.action)) {
            return;
        }
        if (action.action === "select-option") {
            const { id, name } = data;
            this.setState({
                newCollab: id,
                newCollabName: name,
            });
        } else if (action.action === "clear") {
            this.setState({
                newCollab: "",
                newCollabName: "",
            });
        }
    }

    showErrorCallback(errorText: string) {
        this.setState({ errorText });
        if (this.modalCb) {
            this.modalCb.showModal();
        }
    }

    async initiateNewCollab() {
        if (this.state.isSubmit) {
            return;
        }
        const {
            animeData: { id: animeId },
        } = this.props;
        const { newCollab } = this.state;
        if (newCollab.trim() === "") {
            this.showErrorCallback("Mohon pilih peladen terlebih dahulu!");
            return;
        }
        this.setState({ isSubmit: true });

        const frozenBajs = {
            targetId: newCollab,
        };
        const API_ROUTE = `/api/showtimes/proyek/collab/${animeId}/create`;

        try {
            const result = await fetch(API_ROUTE, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(frozenBajs),
            });
            const jsonResult = await result.json();
            if (jsonResult.success) {
                this.setState({
                    isSubmit: false,
                    confirmCode: jsonResult.data.id,
                });
            } else {
                this.showErrorCallback(jsonResult.message);
                this.setState({ isSubmit: false });
            }
        } catch (error) {
            console.log(error);
            if (error instanceof Error) {
                this.showErrorCallback("Terjadi kesalahan internal:\n" + error.toString());
            } else {
                this.showErrorCallback("Terjadi kesalahan internal yang tidak diketahui!");
            }
            this.setState({ isSubmit: false });
        }
    }

    render() {
        const { user, animeData } = this.props;
        const { isSubmit, confirmCode, newCollabName } = this.state;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";
        const { id, title, poster_data } = animeData;

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
                                        <motion.p
                                            initial={{ x: -25, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="text-gray-800 dark:text-gray-300 text-sm my-1"
                                        >
                                            Anda dapat memilih peladen yang sudah mendaftarkan diri untuk
                                            Showtimes. Cukup pilih dan berikan kode yang dibuat ke peladen
                                            tersebut.
                                        </motion.p>
                                        <motion.div
                                            initial={{ x: -25, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <SelectAsync
                                                className="w-full mt-1 rounded-lg"
                                                loadOptions={this.loadServers}
                                                getOptionLabel={optionValueChannel}
                                                filterOption={() => true}
                                                onChange={this.onServerSelection}
                                                placeholder="Pilih peladen..."
                                                inputId="collab-server-reactive-input"
                                                classNamePrefix="rselect"
                                                isDisabled={isSubmit}
                                                cacheOptions
                                                defaultOptions
                                                isClearable
                                            />
                                        </motion.div>
                                        {confirmCode.trim().length > 0 && (
                                            <div className="flex flex-col mt-2 text-gray-800 dark:text-gray-300 text-sm">
                                                <p>
                                                    <b>Kode</b>: {confirmCode}
                                                </p>
                                                <p>
                                                    <b>Peladen</b>: {newCollabName}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex row mt-4 gap-2">
                                            <motion.div
                                                className="flex flex-col"
                                                initial={{ y: -20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <button
                                                    className={`flex flex-row px-3 py-2 rounded-lg ${
                                                        isSubmit
                                                            ? "cursor-not-allowed bg-green-500"
                                                            : "bg-green-600 hover:bg-green-700"
                                                    } text-white transition duration-200 ease-in-out items-center`}
                                                    disabled={isSubmit}
                                                    onClick={this.initiateNewCollab}
                                                    aria-label="Inisiasi kolaborasi baru"
                                                    title="Inisiasi kolaborasi baru"
                                                >
                                                    {isSubmit ? (
                                                        <LoadingCircle className="ml-0 mr-2 mt-0" />
                                                    ) : (
                                                        <SwordIcon className="font-bold mr-1" />
                                                    )}
                                                    <span className="font-semibold mt-0.5">Inisiasi</span>
                                                </button>
                                            </motion.div>
                                            <motion.div
                                                className="flex flex-col"
                                                initial={{ y: -20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.45 }}
                                            >
                                                <Link href={`/admin/proyek/${id}/kolaborasi`} passHref>
                                                    <a
                                                        className={`flex flex-row px-3 py-2 rounded-lg ${
                                                            isSubmit
                                                                ? "cursor-not-allowed bg-blue-500"
                                                                : "bg-blue-600 hover:bg-blue-700"
                                                        } text-white transition duration-200 ease-in-out items-center`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            if (!isSubmit) {
                                                                Router.push(`/admin/proyek/${id}/kolaborasi`);
                                                            }
                                                        }}
                                                    >
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

export default ProyekPageCollabAddition;
