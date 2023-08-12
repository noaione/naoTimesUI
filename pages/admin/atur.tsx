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

interface UserSettingsHomepageState {
    errText: string;
}

interface UserSettingsHomepageProps {
    user: UserSessFragment;
}

class UserSettingsHomepage extends React.Component<UserSettingsHomepageProps, UserSettingsHomepageState> {
    modalCb?: CallbackModal;

    constructor(props: UserSettingsHomepageProps) {
        super(props);
        this.showErrorCallback = this.showErrorCallback.bind(this);
        this.state = {
            errText: "",
        };
    }

    showErrorCallback(errText: string) {
        this.setState({ errText });
        this.modalCb?.showModal();
    }

    render() {
        const { user } = this.props;

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Pengaturan Pengguna :: naoTimesUI</title>
                    <MetadataHead.SEO title="Pengaturan Pengguna" urlPath="/admin/atur" />
                </Head>
                <AdminLayout user={user} title="Pengaturan" active="usersettings">
                    <div className="container mx-auto px-6 py-8">
                        <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
                            <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-md">
                                <SettingsComponent.ResetPass onErrorModal={this.showErrorCallback} />
                            </div>
                        </div>
                        <ErrorModal onMounted={(cb) => (this.modalCb = cb)}>{this.state.errText}</ErrorModal>
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export default function WrappedUserSettingsHomepage() {
    return (
        <AuthContext.Consumer>{(sess) => sess && <UserSettingsHomepage user={sess} />}</AuthContext.Consumer>
    );
}
