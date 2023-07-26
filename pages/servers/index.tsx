import React from "react";
import Head from "next/head";
import Router from "next/router";

import { motion } from "framer-motion";
import LogOutIcon from "mdi-react/LogoutIcon";

import client from "@/lib/graphql/client";
import { GetRegisteredServerDocument, SetServerDocument } from "@/lib/graphql/servers.generated";
import { ServerInfoFragment } from "@/lib/graphql/common.generated";
import MetadataHead from "@/components/MetadataHead";
import { LogoutDocument, UserSessFragment } from "@/lib/graphql/auth.generated";
import { Nullable } from "@/lib/utils";
import ImageMetadataComponent from "@/components/ImageMetadata";
import SkeletonLoader from "@/components/Skeleton";
import { AuthContext } from "@/components/AuthSuspense";
import PlusIcon from "mdi-react/PlusIcon";
import Link from "next/link";

interface ServerListingPageProps {
    servers: ServerInfoFragment[];
    loading: boolean;
    error: Nullable<string>;
    selectedServer: Nullable<ServerInfoFragment>;
    loadingSelect: boolean;
}

function ServerInfoCard(props: {
    server: ServerInfoFragment;
    disabled?: boolean;
    selected?: boolean;
    onClick: (server: ServerInfoFragment) => void;
}) {
    const { server, disabled, selected, onClick } = props;
    const colorado = "bg-green-800 cursor-not-allowed";
    const coloradoActive = "bg-green-700 hover:bg-green-600";
    return (
        <div className="p-5 bg-gray-700 text-white rounded shadow-md">
            <div className="flex items-center pt-1">
                {server.avatar && (
                    <div className={"icon w-14 text-white rounded-full mr-3 "}>
                        <ImageMetadataComponent
                            className="w-full max-w-full max-h-full rounded-full"
                            image={server.avatar}
                            alt="Server Avatar"
                            width={100}
                            height={100}
                        />
                    </div>
                )}

                <div className="flex flex-col w-full">
                    <div className="text-gray-200 break-all font-semibold text-lg">{server.name}</div>
                    <button
                        disabled={disabled}
                        onClick={() => {
                            onClick(server);
                        }}
                        className={`text-white break-all p-2 transition rounded-md my-1 ${
                            disabled ? colorado : coloradoActive
                        } ${selected ? "animate-pulse" : ""}`}
                    >
                        Akses
                    </button>
                </div>
            </div>
        </div>
    );
}

interface ServerProps {
    user: UserSessFragment;
}

class ServerListingPage extends React.Component<ServerProps, ServerListingPageProps> {
    constructor(props: ServerProps) {
        super(props);
        this.state = {
            servers: [],
            loading: true,
            error: null,
            selectedServer: null,
            loadingSelect: false,
        };
    }

    async componentDidMount() {
        let servers: ServerInfoFragment[] = [];
        let cursor: Nullable<string> = null;
        while (true) {
            const { data } = await client.query({
                query: GetRegisteredServerDocument,
                variables: {
                    cursor,
                },
            });
            // eslint-disable-next-line no-underscore-dangle
            if (data.servers.__typename === "Result") {
                this.setState({
                    error: data.servers.message,
                    loading: false,
                });
                return;
            }

            servers = [...servers, ...data.servers.nodes];

            if (!data.servers.pageInfo.nextCursor) {
                break;
            }

            cursor = data.servers.pageInfo.nextCursor;
        }

        this.setState({
            servers: servers,
            loading: false,
        });
    }

    async selectServer(server: ServerInfoFragment) {
        this.setState({ selectedServer: server, loadingSelect: true });

        const { data } = await client.mutate({
            mutation: SetServerDocument,
            variables: {
                id: server.id,
            },
        });

        if (data.selectServer.success) {
            Router.replace("/admin");
        } else {
            this.setState({ error: data.selectServer.message, loadingSelect: false, selectedServer: null });
        }
    }

    render() {
        const { loading: isLoading, servers, error } = this.state;

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Peladen :: naoTimesUI</title>
                    <MetadataHead.SEO
                        title="Peladen"
                        urlPath="/servers"
                        description="Daftar peladen yang terdaftar di naoTimesUI."
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
                                <h1 className="text-2xl mx-4 lg:mx-2 font-semibold text-white">Peladen</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={async (ev) => {
                                    ev.preventDefault();
                                    await client.mutate({
                                        mutation: LogoutDocument,
                                    });
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
                    <motion.h1
                        className="text-3xl mx-4 mt-6 font-bold flex flex-row items-center"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span>Peladen yang di Kontrol</span>
                        <Link
                            href="/servers/tambah"
                            className="flex flex-row ml-2 px-2 pr-3 py-2 rounded-lg bg-green-600 text-white transition hover:bg-green-700 duration-200 ease-in-out items-center hover:shadow-lg text-lg focus:outline-none"
                        >
                            <PlusIcon className="font-bold mr-1 mt-0.5" />
                            <span className="font-semibold mt-0.5">Tambah</span>
                        </Link>
                    </motion.h1>
                    {error && (
                        <div className="text-lg font-light my-2 text-center dark:text-white">{error}</div>
                    )}
                    <div className="mx-4 grid gap-7 sm:grid-cols-2 lg:grid-cols-4 items-center my-6">
                        {isLoading ? (
                            <SkeletonLoader.StatsCard />
                        ) : (
                            <>
                                {servers.map((server) => {
                                    const selected = this.state.selectedServer?.id === server.id;
                                    const loadingTopMost = this.state.loadingSelect;
                                    return (
                                        <ServerInfoCard
                                            key={server.id}
                                            server={server}
                                            selected={selected}
                                            disabled={loadingTopMost}
                                            onClick={(server) => {
                                                this.selectServer(server)
                                                    .then(() => {})
                                                    .catch((e) => console.error(e));
                                            }}
                                        />
                                    );
                                })}
                            </>
                        )}
                    </div>
                </main>
            </>
        );
    }
}

export default function WrappedServerListingPage() {
    return <AuthContext.Consumer>{(sess) => sess && <ServerListingPage user={sess} />}</AuthContext.Consumer>;
}
