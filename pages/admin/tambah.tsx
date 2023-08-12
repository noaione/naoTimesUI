import React from "react";
import Head from "next/head";
import Router from "next/router";

import MetadataHead from "@/components/MetadataHead";
import { AuthContext } from "@/components/AuthSuspense";
import { UserSessFragment } from "@/lib/graphql/auth.generated";
import { DISCORD_GUILD } from "@/lib/graphql/integration-type";
import { useMutation } from "@apollo/client";
import { AddServerDocument } from "@/lib/graphql/servers.generated";
import { IntegrationInputAction } from "@/lib/graphql/types.generated";
import AdminLayout from "@/components/Admin";
import MotionInView from "@/components/MotionInView";

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
        <div className="flex flex-col mx-4 mb-2">
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
                    className="px-2 py-2 text-center mt-2 font-bold rounded-lg bg-green-600 text-white transition hover:bg-green-700 disabled:bg-green-700 disabled:animate-pulse disabled:cursor-not-allowed duration-200 ease-in-out hover:shadow-lg focus:outline-none"
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
                                Router.push("/admin");
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

interface ServerAddPageProps {
    user: UserSessFragment;
}

function ServerAddPage(props: ServerAddPageProps) {
    const { user } = props;
    return (
        <>
            <Head>
                <MetadataHead.Base />
                <MetadataHead.Prefetch />
                <title>Tambah Peladen :: naoTimesUI</title>
                <MetadataHead.SEO
                    title="Tambah Peladen"
                    urlPath="/admin/tambah"
                    description="Daftar baru peladen di naoTimesUI."
                />
            </Head>
            <AdminLayout user={user} title="Tambah Peladen" active="serversadd">
                <div className="container mx-auto px-6 py-8">
                    <MotionInView.div
                        id="about"
                        className="p-3 bg-white dark:bg-gray-700 rounded shadow-md dark:text-gray-200"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ServerAddComponents />
                    </MotionInView.div>
                </div>
            </AdminLayout>
        </>
    );
}

export default function WrappedServerAddPage() {
    return <AuthContext.Consumer>{(s) => s && <ServerAddPage user={s} />}</AuthContext.Consumer>;
}
