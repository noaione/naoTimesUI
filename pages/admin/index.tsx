import React from "react";
import Head from "next/head";
import Router from "next/router";

import { motion } from "framer-motion";

import client from "@/lib/graphql/client";
import { GetRegisteredServerDocument, SetServerDocument } from "@/lib/graphql/servers.generated";
import { ServerInfoFragment } from "@/lib/graphql/common.generated";
import MetadataHead from "@/components/MetadataHead";
import { UserSessFragment } from "@/lib/graphql/auth.generated";
import { Nullable } from "@/lib/utils";
import ImageMetadataComponent from "@/components/ImageMetadata";
import SkeletonLoader from "@/components/Skeleton";
import { AuthContext } from "@/components/AuthSuspense";
import AdminLayout from "@/components/Admin";
import ErrorModal from "@/components/ErrorModal";
import { CallbackModal } from "@/components/Modal";

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
        <div className="p-5 bg-gray-200 dark:bg-gray-700 dark:text-white rounded shadow-md">
            <div className="flex items-center pt-1">
                {server.avatar && (
                    <div className={"icon w-14 dark:text-white rounded-full mr-3 "}>
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
                    <div className="dark:text-gray-200 break-all font-semibold text-lg">{server.name}</div>
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
    modalCb?: CallbackModal;

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
                this.modalCb?.showModal();
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
            Router.replace("/admin/peladen");
        } else {
            this.setState({ error: data.selectServer.message, loadingSelect: false, selectedServer: null });
            this.modalCb?.showModal();
        }
    }

    render() {
        const { user } = this.props;
        const { loading: isLoading, servers, error } = this.state;

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Peladen :: naoTimesUI</title>
                    <MetadataHead.SEO
                        title="Peladen"
                        urlPath="/admin"
                        description="Daftar peladen yang terdaftar di naoTimesUI."
                    />
                </Head>
                <AdminLayout user={user} title="Peladen" active="servers">
                    <div className="container mx-auto px-6 py-8">
                        <motion.h1
                            className="text-3xl font-bold flex flex-row items-center dark:text-gray-200 pb-4"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Peladen yang di Kontrol
                        </motion.h1>
                        {isLoading ? (
                            <SkeletonLoader.StatsCard />
                        ) : (
                            <>
                                {servers.length ? (
                                    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
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
                                    </div>
                                ) : (
                                    <div className="text-xl font-light text-center mt-4">
                                        Tidak ada yang terdaftar!
                                    </div>
                                )}
                            </>
                        )}
                        <ErrorModal onMounted={(cb) => (this.modalCb = cb)}>{error}</ErrorModal>
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export default function WrappedServerListingPage() {
    return <AuthContext.Consumer>{(sess) => sess && <ServerListingPage user={sess} />}</AuthContext.Consumer>;
}
