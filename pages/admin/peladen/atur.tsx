import React from "react";
import Head from "next/head";

import AdminLayout from "@/components/Admin";
import MetadataHead from "@/components/MetadataHead";

// Import all Settings Component
import SettingsComponent from "@/components/SettingsPage";

import ErrorModal from "@/components/ErrorModal";
import { CallbackModal } from "@/components/Modal";
import { AuthContext } from "@/components/AuthSuspense";
import { UserSessFragment } from "@/lib/graphql/auth.generated";
import { ServerInfoFragment } from "@/lib/graphql/common.generated";
import client from "@/lib/graphql/client";
import { GetCurrentServerDocument } from "@/lib/graphql/servers.generated";

interface ServerSettingsHomepageState {
    errText: string;
    serverInfo?: ServerInfoFragment;
}

interface ServerSettingsHomepageProps {
    user: UserSessFragment;
}

class ServerSettingsHomepage extends React.Component<
    ServerSettingsHomepageProps,
    ServerSettingsHomepageState
> {
    modalCb?: CallbackModal;

    constructor(props: ServerSettingsHomepageProps) {
        super(props);
        this.showErrorCallback = this.showErrorCallback.bind(this);
        this.state = {
            errText: "",
            serverInfo: undefined,
        };
    }

    async componentDidMount(): Promise<void> {
        const { data, error } = await client.query({
            query: GetCurrentServerDocument,
        });

        if (error) {
            this.setState({ errText: error.message });
            return;
        }

        if (data.server.__typename === "Result") {
            this.setState({ errText: data.server.message });
            return;
        }

        this.setState({ serverInfo: data.server });
    }

    showErrorCallback(errText: string) {
        this.setState({ errText });
        this.modalCb?.showModal();
    }

    render() {
        const { user } = this.props;
        const { serverInfo } = this.state;

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>{`Pengaturan Peladen :: naoTimesUI`}</title>
                    <MetadataHead.SEO title="Pengaturan Peladen" urlPath="/admin/peladen/atur" />
                </Head>
                <AdminLayout user={user} title="Pengaturan" active="settings">
                    <div className="container mx-auto px-6 py-8">
                        <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
                            <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-md">
                                {serverInfo && (
                                    <>
                                        <SettingsComponent.Announcer
                                            integrations={serverInfo.integrations}
                                            onErrorModal={this.showErrorCallback}
                                        />
                                        <SettingsComponent.Admin
                                            serverOwner={serverInfo.owners}
                                            onErrorModal={this.showErrorCallback}
                                        />
                                        <SettingsComponent.NameChange onErrorModal={this.showErrorCallback} />
                                        <SettingsComponent.EmbedGen
                                            id={serverInfo.id}
                                            onErrorModal={this.showErrorCallback}
                                        />
                                        <SettingsComponent.DeleteServer
                                            id={serverInfo.id}
                                            onErrorModal={this.showErrorCallback}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                        <ErrorModal onMounted={(cb) => (this.modalCb = cb)}>{this.state.errText}</ErrorModal>
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export default function WrappedServerSettingsHomepage() {
    return (
        <AuthContext.Consumer>
            {(sess) => sess && <ServerSettingsHomepage user={sess} />}
        </AuthContext.Consumer>
    );
}
