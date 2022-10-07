import React from "react";
import axios, { AxiosError } from "axios";
import Router from "next/router";
import { withSessionSsr } from "@/lib/session";

import { motion } from "framer-motion";
import LogOutIcon from "mdi-react/LogoutIcon";

import type { IUserAuth } from "@/lib/session";
import Head from "next/head";
import MetadataHead from "@/components/MetadataHead";
import SkeletonLoader from "@/components/Skeleton";
import { isNone, Nullable } from "@/lib/utils";
import Modal, { CallbackModal, ModalProps } from "@/components/Modal";
import ErrorModal from "@/components/ErrorModal";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
interface ServerSideProps {
    user: IUserAuth & { loggedIn: boolean };
}

interface RequestedServer {
    id: string;
    name: string;
    avatar: string;
}

interface DiscordSelectionState {
    isLoading: boolean;
    selectedServer: Nullable<RequestedServer>;
    internalSelectedServer: Nullable<RequestedServer>;
    registeredServers: RequestedServer[];
    unregisteredServers: RequestedServer[];
    errorMsg: string;
}

function DiscordServerSelect(props: {
    guild: RequestedServer;
    disabled?: boolean;
    selected?: boolean;
    mode: "register" | "unregister";
    onClick: (guild: RequestedServer) => void;
}) {
    const { guild, disabled, selected, mode } = props;
    const colorado =
        mode === "register" ? "bg-blue-800 cursor-not-allowed" : "bg-green-800 cursor-not-allowed";
    const coloradoActive =
        mode === "register" ? "bg-blue-700 hover:bg-blue-600" : "bg-green-700 hover:bg-green-600";
    return (
        <div className="p-5 bg-gray-700 text-white rounded shadow-md">
            <div className="flex items-center pt-1">
                <div className={"icon w-14 text-white rounded-full mr-3 "}>
                    <img
                        className="w-full max-w-full max-h-full rounded-full"
                        src={props.guild.avatar}
                        alt={`${guild.name} Icon`}
                    />
                </div>
                <div className="flex flex-col w-full">
                    <div className="text-gray-200 break-all font-semibold text-lg">{guild.name}</div>
                    <button
                        disabled={props.disabled}
                        onClick={() => {
                            props.onClick(guild);
                        }}
                        className={`text-white break-all p-2 transition rounded-md my-1 ${
                            disabled ? colorado : coloradoActive
                        } ${selected ? "animate-pulse" : ""}`}
                    >
                        {mode === "register" ? "Akses" : "Buat"}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface DiscordRefreshedData {
    code: number;
    error?: string;
    success: boolean;
    data?: {
        r: RequestedServer[];
        u: RequestedServer[];
    };
}

interface ExtraModalCallback {
    executeAdd: () => void;
}

class DiscordConfirmationModal extends React.Component<ModalProps & ExtraModalCallback> {
    modalCb?: CallbackModal;

    constructor(props: ModalProps & ExtraModalCallback) {
        super(props);
        this.handleHide = this.handleHide.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    componentDidMount(): void {
        if (typeof this.props.onMounted === "function") {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const outerThis = this;
            this.props.onMounted({
                showModal: () => outerThis.handleShow(),
                hideModal: () => outerThis.handleHide(),
            });
        }
    }

    handleHide() {
        if (this.modalCb) {
            this.modalCb.hideModal();
        }
    }

    handleShow() {
        if (this.modalCb) {
            this.modalCb.showModal();
        }
    }

    toggleModal() {
        if (this.modalCb && this.modalCb.toggleModal) {
            this.modalCb.toggleModal();
        }
    }

    render() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { onMounted, onClose, ...props } = this.props;
        return (
            <Modal
                {...props}
                onMounted={(callback) => (this.modalCb = callback)}
                onClose={() => {
                    // Forward the onClose
                    if (typeof onClose === "function") {
                        onClose();
                    }
                }}
            >
                <Modal.Head>Apakah anda yakin?</Modal.Head>
                <Modal.Body>{this.props.children}</Modal.Body>
                <Modal.Footer className="gap-2">
                    <button
                        onClick={() => {
                            this.props.executeAdd();
                        }}
                        className="inline-flex justify-center font-semibold w-full px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none"
                    >
                        Tambah
                    </button>
                    <button
                        onClick={this.handleHide}
                        className="inline-flex justify-center font-semibold w-full px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none"
                    >
                        Batal
                    </button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default class DiscordSelectionWebpage extends React.Component<ServerSideProps, DiscordSelectionState> {
    callbackModal?: CallbackModal;
    errorModal?: CallbackModal;

    constructor(props: ServerSideProps) {
        super(props);
        this.state = {
            isLoading: true,
            selectedServer: null,
            internalSelectedServer: null,
            registeredServers: [],
            unregisteredServers: [],
            errorMsg: "",
        };

        this.refreshServerData = this.refreshServerData.bind(this);
        this.enterDiscordServer = this.enterDiscordServer.bind(this);
        this.createDiscordServer = this.createDiscordServer.bind(this);
        this.actuallyCreateDiscordServer = this.actuallyCreateDiscordServer.bind(this);
    }

    async refreshServerData() {
        try {
            const requestedServer = await axios.get<DiscordRefreshedData>("/api/auth/discord/servers");
            this.setState({
                registeredServers: requestedServer.data.data?.r ?? [],
                unregisteredServers: requestedServer.data.data?.u ?? [],
                isLoading: false,
            });
        } catch (e) {
            console.error(e);
        }
    }

    async componentDidMount() {
        await this.refreshServerData();
    }

    async enterDiscordServer(guild: RequestedServer) {
        this.setState({ selectedServer: guild, internalSelectedServer: guild });
        console.info(`Entering ${guild.name}`);

        try {
            const response = await axios.post<{ code: number; error?: string; success: boolean }>(
                "/api/auth/discord/access",
                {
                    id: guild.id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    responseType: "json",
                }
            );
            if (response.data.success) {
                Router.push("/admin");
            } else {
                this.setState({ selectedServer: null });
                alert(response.data.error ?? "Terjadi kesalahan");
            }
        } catch (e: unknown) {
            console.error(e);
            // check if axioserror
            this.setState({ selectedServer: null });
            if (e instanceof AxiosError) {
                const axiosError = e as AxiosError<{ code: number; error?: string; success: boolean }>;
                const errorMsg = axiosError.response?.data?.error ?? "Terjadi kesalahan internal";
                this.setState({ errorMsg });
                if (this.errorModal) {
                    this.errorModal.showModal();
                }
            } else {
                this.setState({ errorMsg: "Terjadi kesalahan internal" });
                if (this.errorModal) {
                    this.errorModal.showModal();
                }
            }
        }
    }

    createDiscordServer(guild: RequestedServer) {
        this.setState({ selectedServer: guild, internalSelectedServer: guild });
        console.info(`Creating ${guild.name}`);
        if (this.callbackModal) {
            this.callbackModal.showModal();
        }
    }

    async actuallyCreateDiscordServer() {
        const { internalSelectedServer } = this.state;
        if (isNone(internalSelectedServer)) {
            this.setState({ errorMsg: "Tidak ada server yang dipilih...?" });
            if (this.errorModal) {
                this.errorModal.showModal();
            }
            return;
        }
        // make sure we lock the state!
        console.info("Locking state...");
        this.setState({ selectedServer: internalSelectedServer });
        console.info(`Actuallly Creating ${internalSelectedServer.name}`);

        const body = {
            server: internalSelectedServer.id,
            admin: this.props.user.id,
        };

        const res = await fetch("/api/auth/discord/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const userObj = await res.json();
        if (userObj.success) {
            // success? execute access then route to admin
            await this.enterDiscordServer(internalSelectedServer);
        } else {
            this.setState({ errorMsg: userObj.error });
            if (this.errorModal) {
                this.errorModal.showModal();
            }
        }
    }

    render() {
        const { unregisteredServers, registeredServers, isLoading } = this.state;
        const shouldDisable = isLoading || !isNone(this.state.selectedServer);
        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Discord :: naoTimesUI</title>
                    <MetadataHead.SEO
                        title="Discord Selection"
                        urlPath="/discord"
                        description="Pilih peladen yang ingin anda akses atau buat!"
                    />
                </Head>
                <main className="font-inter bg-gray-900">
                    <motion.header
                        className="flex justify-between items-center p-4 py-6 bg-gray-800"
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center space-x4 lg:space-x-0">
                            <div>
                                <h1 className="text-2xl mx-4 lg:mx-2 font-semibold text-white">
                                    Discord Server
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={async (ev) => {
                                    ev.preventDefault();
                                    await fetch("/api/auth/logout");
                                    Router.push("/");
                                }}
                                title="Logout"
                                className="flex text-gray-200 transition-opacity duration-200 ease-in-out hover:opacity-70 focus:outline-none mb-1 cursor-pointer"
                            >
                                <LogOutIcon />
                            </button>
                        </div>
                    </motion.header>

                    {/* Create card handler */}
                    <h1 className="text-3xl mx-4 mt-6 font-bold">Peladen yang di Kontrol</h1>
                    <div className="mx-4 grid gap-7 sm:grid-cols-2 lg:grid-cols-4 items-center my-6">
                        {isLoading ? (
                            <SkeletonLoader.StatsCard />
                        ) : (
                            <>
                                {registeredServers.map((guild) => (
                                    <DiscordServerSelect
                                        key={`discord-registered-${guild.id}`}
                                        guild={guild}
                                        onClick={(guild) => {
                                            this.enterDiscordServer(guild)
                                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                                .then(() => {})
                                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                                .catch(() => {});
                                        }}
                                        disabled={shouldDisable}
                                        selected={this.state.selectedServer?.id === guild.id}
                                        mode="register"
                                    />
                                ))}
                            </>
                        )}
                    </div>

                    <h1 className="text-3xl mx-4 mt-6 font-bold">Peladen yang bisa didaftarkan</h1>
                    <div className="mx-4 grid gap-7 sm:grid-cols-2 lg:grid-cols-4 items-center my-6 lg:mt-6">
                        {isLoading ? (
                            <SkeletonLoader.StatsCard />
                        ) : (
                            <>
                                {unregisteredServers.map((guild) => (
                                    <DiscordServerSelect
                                        key={`discord-unregistered-${guild.id}`}
                                        guild={guild}
                                        onClick={(guild) => {
                                            this.createDiscordServer(guild);
                                        }}
                                        disabled={shouldDisable}
                                        selected={this.state.selectedServer?.id === guild.id}
                                        mode="unregister"
                                    />
                                ))}
                            </>
                        )}
                    </div>
                    <DiscordConfirmationModal
                        onMounted={(cb) => (this.callbackModal = cb)}
                        executeAdd={() => {
                            console.info(this.state.selectedServer);
                            this.actuallyCreateDiscordServer().then(noop).catch(noop);
                            if (this.callbackModal) {
                                this.callbackModal.hideModal();
                            }
                        }}
                    >
                        <p>
                            Ini akan menambahkan peladen <strong>{this.state.selectedServer?.name}</strong> ke
                            Showtimes
                        </p>
                    </DiscordConfirmationModal>
                    <ErrorModal onMounted={(cb) => (this.errorModal = cb)}>{this.state.errorMsg}</ErrorModal>
                </main>
            </>
        );
    }
}

export const getServerSideProps = withSessionSsr(async ({ req }) => {
    const user = req.session.user;

    if (!user) {
        return {
            redirect: {
                destination: "/?cb=/discord",
                permanent: false,
            },
        };
    }

    const discordMeta = req.session.userDiscordMeta;
    if (!discordMeta) {
        return {
            redirect: {
                destination: "/discord/failure?error=5003",
                permanent: false,
            },
        };
    }
    return { props: { user: { loggedIn: true, ...user }, forceDarkMode: true } };
});
