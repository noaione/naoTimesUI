import React from "react";

import { MutateServerDocument } from "@/lib/graphql/servers.generated";
import { DISCORD_CHANNEL, PREFIX_ANNOUNCEMENT } from "@/lib/graphql/integration-type";
import { Integration, IntegrationInputAction } from "@/lib/graphql/types.generated";
import { useMutation } from "@apollo/client";

interface IntegrationState {
    id: string;
    type: string;
    tempKey: string;
}

interface AnnouncerSettingsProps {
    integrations: Integration[];
    onErrorModal: (message: string) => void;
}

function AnnouncerSettings(props: AnnouncerSettingsProps) {
    const initialSettings = props.integrations
        .filter((e) => e.type.startsWith(PREFIX_ANNOUNCEMENT))
        .map((e) => ({
            id: e.id,
            type: e.type,
            tempKey: Math.random().toString(36).substring(7),
        }));
    const [addServer, { loading }] = useMutation(MutateServerDocument);
    const [integrations, setIntegrations] = React.useState<IntegrationState[]>(initialSettings);

    return (
        <div className="flex flex-col mx-4 mt-2">
            <div className="w-full mt-2 mb-1 flex flex-col">
                <div className="flex flex-row w-full items-center mb-2">
                    <h3 className="font-semibold dark:text-white mb-2 text-lg">Ubah Kanal #announcer</h3>
                    <button
                        className="flex flex-row ml-1 px-2 py-0.5 text-sm rounded-lg bg-blue-600 text-white transition hover:bg-blue-700 disabled:bg-blue-700 disabled:cursor-not-allowed duration-200 ease-in-out items-center hover:shadow-lg focus:outline-none"
                        disabled={loading}
                        onClick={() => {
                            setIntegrations([
                                ...integrations,
                                {
                                    id: "",
                                    type: `${PREFIX_ANNOUNCEMENT}${DISCORD_CHANNEL}`,
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
                                        className="form-darkable w-full py-2"
                                        defaultValue={integration.type}
                                        disabled={loading}
                                    >
                                        <option value="UNKNOWN">Tidak diketahui</option>
                                        <option value={PREFIX_ANNOUNCEMENT + DISCORD_CHANNEL}>Discord</option>
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
                        addServer({
                            variables: {
                                data: {
                                    integrations: integrations.map((i) => ({
                                        action: IntegrationInputAction.Upsert,
                                        id: i.id,
                                        type: i.type,
                                    })),
                                },
                            },
                            onCompleted(data, _) {
                                if (data.updateServer.__typename === "Result") {
                                    props.onErrorModal(data.updateServer.message);
                                    return;
                                }
                                setIntegrations(
                                    data.updateServer.integrations.map((d) => ({
                                        id: d.id,
                                        type: d.type,
                                        tempKey: Math.random().toString(36).substring(7),
                                    }))
                                );
                            },
                            onError(err) {
                                props.onErrorModal(err.message);
                            },
                        });
                    }}
                >
                    Ubah
                </button>
            </div>
        </div>
    );
}

export default AnnouncerSettings;
