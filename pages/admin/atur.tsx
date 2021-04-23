import React from "react";

import AdminLayout from "../../components/AdminLayout";
import MetadataHead from "../../components/MetadataHead";

import withSession from "../../lib/session";

import { UserProps } from "../../models/user";

interface SettingsHomepageState {
    isLoading: boolean;
    serverData?: { [key: string]: any };
}

interface SettingsHomepageProps {
    user?: UserProps & { loggedIn: boolean };
}

class SettingsHomepage extends React.Component<SettingsHomepageProps, SettingsHomepageState> {
    constructor(props: SettingsHomepageProps) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    async componentDidMount() {
        // const userObj = await fetch("/api/auth/user");
        // const jsonResp = await userObj.json();
        // if (jsonResp.loggedIn) {
        //     this.setState({ isAuthenticating: false, user: jsonResp });
        // } else {
        //     this.setState({ isAuthenticating: false });
        //     Router.push("/");
        // }
    }

    componentDidUpdate() {
        if (this.state.serverData) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { user } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        return (
            <>
                <MetadataHead title={`Pengaturan - ${pageTitle}`} urlPath="/admin/atur" />
                <AdminLayout user={user} title="Pengaturan" active="settings">
                    <div className="container mx-auto px-6 py-8">
                        <h2 className="font-light dark:text-gray-200 pb-4">Settings</h2>
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({ req, _s }) {
    const user = req.session.get("user");

    if (!user) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return { props: { user: { loggedIn: true, ...user } } };
});

export default SettingsHomepage;
