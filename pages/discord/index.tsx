import React from "react";
import axios from "axios";
import Router from "next/router";
import withSession, { IUserDiscordMeta } from "@/lib/session";

import { motion } from "framer-motion";
import LogOutIcon from "mdi-react/LogoutIcon";

import type { IUserAuth, NextServerSideContextWithSession } from "@/lib/session";
import Head from "next/head";
import MetadataHead from "@/components/MetadataHead";
import SkeletonLoader from "@/components/Skeleton";
import { isNone, Nullable } from "@/lib/utils";

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
    selectedServer: Nullable<string>;
    registeredServers: RequestedServer[];
    unregisteredServers: RequestedServer[];
}

function DiscordServerSelect(props: {
    guild: RequestedServer;
    disabled?: boolean;
    selected?: boolean;
    mode: "register" | "unregister";
    onClick: (guild: RequestedServer) => void;
}) {
    const { guild, disabled, selected, mode } = props;
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
                            disabled ? "bg-green-800 cursor-not-allowed" : "bg-green-700 hover:bg-green-600"
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

export default class DiscordSelectionWebpage extends React.Component<ServerSideProps, DiscordSelectionState> {
    constructor(props: ServerSideProps) {
        super(props);
        this.state = {
            isLoading: true,
            selectedServer: null,
            registeredServers: [],
            unregisteredServers: [],
        };
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
        this.setState({ selectedServer: guild.id });
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
        } catch (e) {
            console.error(e);
            this.setState({ selectedServer: null });
            alert("Terjadi kesalahan");
        }
    }

    async createDiscordServer(guild: RequestedServer) {
        this.setState({ selectedServer: guild.id });
        console.info(`Creating ${guild.name}`);
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
                    <MetadataHead.SEO title="Discord Selection" urlPath="/discord" />
                </Head>
                <main className="bg-gray-900 font-inter h-screen text-white">
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
                    <h1 className="text-3xl mx-4 mt-6 font-bold">Managed Servers</h1>
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
                                        selected={this.state.selectedServer === guild.id}
                                        mode="register"
                                    />
                                ))}
                            </>
                        )}
                    </div>

                    <h1 className="text-3xl mx-4 mt-6 font-bold">Registerable Servers</h1>
                    <div className="mx-4 grid gap-7 sm:grid-cols-2 lg:grid-cols-4 items-center my-6">
                        {isLoading ? (
                            <SkeletonLoader.StatsCard />
                        ) : (
                            <>
                                {unregisteredServers.map((guild) => (
                                    <DiscordServerSelect
                                        key={`discord-unregistered-${guild.id}`}
                                        guild={guild}
                                        onClick={(guild) => {
                                            this.createDiscordServer(guild)
                                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                                .then(() => {})
                                                // eslint-disable-next-line @typescript-eslint/no-empty-function
                                                .catch(() => {});
                                        }}
                                        disabled={shouldDisable}
                                        selected={this.state.selectedServer === guild.id}
                                        mode="unregister"
                                    />
                                ))}
                            </>
                        )}
                    </div>
                </main>
            </>
        );
    }
}

export const getServerSideProps = withSession(async ({ req }: NextServerSideContextWithSession) => {
    const user = req.session.get<IUserAuth>("user");

    if (!user) {
        return {
            redirect: {
                destination: "/?cb=/discord",
                permanent: false,
            },
        };
    }

    const discordMeta = req.session.get<IUserDiscordMeta>("userDiscordMeta");
    if (!discordMeta) {
        return {
            redirect: {
                destination: "/discord/failure?error=5003",
                permanent: false,
            },
        };
    }
    return { props: { user: { loggedIn: true, ...user } } };
});
