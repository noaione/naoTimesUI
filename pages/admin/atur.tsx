import React from "react";
import Head from "next/head";

import AdminLayout from "@/components/AdminLayout";
import MetadataHead from "@/components/MetadataHead";

// Import all Settings Component
import SettingsComponent from "@/components/SettingsPage";

import prisma from "@/lib/prisma";
import type { showtimesdatas } from "@prisma/client";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "@/lib/session";

import ErrorModal from "@/components/ErrorModal";
import { CallbackModal } from "@/components/Modal";

interface SettingsHomepageState {
    errText: string;
    serverData?: { [key: string]: any };
}

type ServerPropsFromDB = Pick<showtimesdatas, "serverowner" | "announce_channel">;

interface SettingsHomepageProps {
    serverProps?: ServerPropsFromDB;
    user?: IUserAuth & { loggedIn: boolean };
}

class SettingsHomepage extends React.Component<SettingsHomepageProps, SettingsHomepageState> {
    modalCb?: CallbackModal;

    constructor(props: SettingsHomepageProps) {
        super(props);
        this.showErrorCallback = this.showErrorCallback.bind(this);
        this.state = {
            errText: "",
        };
    }

    showErrorCallback(errText: string) {
        this.setState({ errText });
        this.modalCb.showModal();
    }

    render() {
        const { user } = this.props;
        const serverProps = this.props.serverProps || ({} as ServerPropsFromDB);
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Pengaturan - {pageTitle} :: naoTimesUI</title>
                    <MetadataHead.SEO title={"Pengaturan - " + pageTitle} urlPath="/admin/atur" />
                </Head>
                <AdminLayout user={user} title="Pengaturan" active="settings">
                    <div className="container mx-auto px-6 py-8">
                        <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
                            <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-md">
                                <SettingsComponent.Announcer
                                    announcerId={serverProps.announce_channel}
                                    onErrorModal={this.showErrorCallback}
                                />
                                <SettingsComponent.Admin
                                    serverOwner={serverProps.serverowner}
                                    onErrorModal={this.showErrorCallback}
                                />
                                <SettingsComponent.ResetPass onErrorModal={this.showErrorCallback} />
                                <SettingsComponent.NameChange onErrorModal={this.showErrorCallback} />
                                <SettingsComponent.EmbedGen
                                    id={user.id}
                                    onErrorModal={this.showErrorCallback}
                                />
                                <SettingsComponent.DeleteServer
                                    id={user.id}
                                    onErrorModal={this.showErrorCallback}
                                />
                            </div>
                        </div>
                        <ErrorModal onMounted={(cb) => (this.modalCb = cb)}>{this.state.errText}</ErrorModal>
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({ req }: NextServerSideContextWithSession) {
    let user = req.session.get<IUserAuth>("user");

    if (!user) {
        return {
            redirect: {
                destination: "/?cb=/admin/atur",
                permanent: false,
            },
        };
    }

    if (user.authType === "discord") {
        // override with server info
        user = req.session.get<IUserAuth>("userServer");
        if (!user) {
            return {
                redirect: {
                    destination: "/discord",
                    permanent: false,
                },
            };
        }
    }

    if (user.privilege === "server") {
        const serverInfo = await prisma.showtimesdatas.findFirst({
            where: {
                id: user.id,
            },
            select: {
                serverowner: true,
                announce_channel: true,
                mongo_id: false,
            },
        });
        return { props: { user: { loggedIn: true, ...user }, serverProps: serverInfo } };
    }
    return { props: { user: { loggedIn: true, ...user }, serverProps: undefined } };
});

export default SettingsHomepage;
