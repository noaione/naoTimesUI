import React from "react";
import Head from "next/head";
import Router from "next/router";

import LogOutIcon from "mdi-react/LogoutIcon";
import GoBackIcon from "mdi-react/ArrowLeftIcon";

import MetadataHead from "@/components/MetadataHead";
import { motion } from "framer-motion";
import { AuthContext } from "@/components/AuthSuspense";
import { LogoutDocument } from "@/lib/graphql/auth.generated";
import client from "@/lib/graphql/client";
import Link from "next/link";
import { DISCORD_GUILD } from "@/lib/graphql/integration-type";
import { useMutation } from "@apollo/client";
import { AddServerDocument } from "@/lib/graphql/servers.generated";
import { IntegrationInputAction } from "@/lib/graphql/types.generated";

interface Integration {
    id: string;
    type: string;
    tempKey: string;
}

function ServerAddComponents() {
    const [name, setName] = React.useState<string | null>(null);
    const [errMsg, setErrMsg] = React.useState<string | null>(null);
    const [addServer, { loading }] = useMutation(AddServerDocument);
    const [integrations, setIntegrations] = React.useState<Integration[]>([]);

    return (
        <div className="flex flex-col mx-4 mt-2">
            <div className="w-full mt-2 mb-1 flex flex-col">
                <label className="font-medium dark:text-white mb-2">Nama</label>
                <input
                    type="text"
                    value={name}
                    className="form-darkable py-2 disabled:cursor-not-allowed"
                    placeholder="Nama Grup"
                    onChange={(ev) => setName(ev.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="w-full mt-2 mb-1 flex flex-col">
                <div className="flex flex-row w-full items-center mb-2">
                    <label className="font-medium dark:text-white">Integrasi</label>
                    <button
                        className="flex flex-row ml-1 px-2 py-0.5 text-sm rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:bg-blue-700 disabled:cursor-not-allowed duration-200 ease-in-out items-center hover:shadow-lg focus:outline-none"
                        disabled={loading}
                        onClick={() => {
                            setIntegrations([
                                ...integrations,
                                {
                                    id: "",
                                    type: DISCORD_GUILD,
                                    tempKey: Math.random().toString(36).substring(7),
                                },
                            ]);
                        }}
                    >
                        Tambah
                    </button>
                </div>
                {integrations &&
                    integrations.map((integration) => {
                        return (
                            // eslint-disable-next-line no-underscore-dangle
                            <div
                                className="flex flex-row w-full justify-between mb-2"
                                key={integration.tempKey}
                            >
                                <div className="flex flex-col w-full">
                                    <input
                                        type="text"
                                        className="form-darkable w-full py-2 disabled:cursor-not-allowed"
                                        placeholder="ID"
                                        defaultValue={integration.id}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="flex flex-col w-1/2 ml-2">
                                    <select
                                        className="form-select-darkable w-full py-2"
                                        defaultValue={integration.type}
                                        disabled={loading}
                                    >
                                        <option value="UNKNOWN">Tidak diketahui</option>
                                        <option value={DISCORD_GUILD}>Discord</option>
                                    </select>
                                </div>
                                <div className="flex flex-col ml-2">
                                    <button
                                        className="flex flex-row py-2 px-1 rounded-lg bg-red-600 text-white transition hover:bg-red-700 disabled:bg-red-700 disabled:cursor-not-allowed duration-200 ease-in-out items-center hover:shadow-lg focus:outline-none"
                                        disabled={loading}
                                        onClick={() => {
                                            setIntegrations(
                                                integrations.filter(
                                                    // eslint-disable-next-line no-underscore-dangle
                                                    (i) => i.tempKey !== integration.tempKey
                                                )
                                            );
                                        }}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                <button
                    className="px-2 py-2 text-center mt-4 font-bold rounded-lg bg-green-600 text-white transition hover:bg-green-700 disabled:bg-green-700 disabled:animate-pulse disabled:cursor-not-allowed duration-200 ease-in-out hover:shadow-lg focus:outline-none"
                    disabled={loading}
                    onClick={() => {
                        setErrMsg(null);
                        addServer({
                            variables: {
                                data: {
                                    integrations: integrations.map((i) => ({
                                        action: IntegrationInputAction.Upsert,
                                        id: i.id,
                                        type: i.type,
                                    })),
                                    name,
                                },
                            },
                            onCompleted(data, _) {
                                if (data.addServer.__typename === "Result") {
                                    setErrMsg(data.addServer.message);
                                    return;
                                }
                                Router.push("/servers");
                            },
                            onError(err) {
                                setErrMsg(err.message);
                            },
                        });
                    }}
                >
                    Tambah
                </button>
            </div>
            {errMsg && (
                <div className="text-lg font-light text-red-700 my-2 text-center dark:text-red-400">
                    {errMsg}
                </div>
            )}
        </div>
    );
}

function ServerAddPage() {
    return (
        <>
            <Head>
                <MetadataHead.Base />
                <MetadataHead.Prefetch />
                <title>Tambah Peladen :: naoTimesUI</title>
                <MetadataHead.SEO
                    title="Tambah Peladen"
                    urlPath="/servers/tambah"
                    description="Daftar baru peladen di naoTimesUI."
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
                            <h1 className="text-2xl mx-4 lg:mx-2 font-semibold text-white">Tambah Peladen</h1>
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
                    <span>Tambah Peladen</span>
                    <Link
                        href="/servers"
                        className="flex flex-row ml-2 px-2 pr-3 py-2 rounded-lg bg-yellow-600 text-white transition hover:bg-yellow-700 duration-200 ease-in-out items-center hover:shadow-lg text-lg focus:outline-none"
                    >
                        <GoBackIcon className="font-bold mr-1 mt-0.5" />
                        <span className="font-semibold mt-0.5">Kembali</span>
                    </Link>
                </motion.h1>
                <ServerAddComponents />
            </main>
        </>
    );
}

export default function WrappedServerAddPage() {
    return <AuthContext.Consumer>{(s) => s && <ServerAddPage />}</AuthContext.Consumer>;
}
