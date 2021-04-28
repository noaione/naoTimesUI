import React from "react";
import Head from "next/head";

import AdminLayout from "../../components/AdminLayout";
import MetadataHead from "../../components/MetadataHead";

// Import all Settings Component
import SettingsComponent from "../../components/SettingsPage";

import dbConnect from "../../lib/dbConnect";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../lib/session";

import { UserProps } from "../../models/user";
import ErrorModal from "../../components/ErrorModal";
import { CallbackModal } from "../../components/Modal";
import { ShowtimesModel, ShowtimesProps } from "../../models/show";

interface SettingsHomepageState {
    isLoading: boolean;
    showModal: boolean;
    errText: string;
    serverData?: { [key: string]: any };
}

interface SettingsHomepageProps {
    serverProps?: ShowtimesProps;
    user?: UserProps & { loggedIn: boolean };
}

class SettingsHomepage extends React.Component<SettingsHomepageProps, SettingsHomepageState> {
    modalCb?: CallbackModal;

    constructor(props: SettingsHomepageProps) {
        super(props);
        this.state = {
            isLoading: true,
            showModal: false,
            errText: "",
        };
    }

    showErrorCallback(errText: string) {
        this.setState({ errText });
        this.modalCb.showModal();
    }

    render() {
        const { user } = this.props;
        const serverProps = this.props.serverProps || ({} as ShowtimesProps);
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Pengaturan - {pageTitle} :: naoTimesUI</title>
                    <MetadataHead.SEO title={"Pengaturan - " + pageTitle} urlPath="/admin/atur" />
                    <MetadataHead.CSSExtra />
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
    const user = req.session.get<IUserAuth>("user");

    if (!user) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    await dbConnect();
    let serverRes: ShowtimesProps;
    if (user.privilege === "server") {
        serverRes = (await ShowtimesModel.findOne(
            { id: { $eq: user.id } },
            { serverowner: 1, announce_channel: 1, _id: 0 }
        ).lean()) as ShowtimesProps;
    }

    return { props: { user: { loggedIn: true, ...user }, serverProps: serverRes } };
});

export default SettingsHomepage;
