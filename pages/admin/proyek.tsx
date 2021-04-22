import React from "react";
import Head from "next/head";
import Router from "next/router";

import { UserProps } from "../../models/user";
import AdminLayout from "../../components/AdminLayout";
import HeaderBase from "../../components/HeaderBase";

interface ProyekHomepageState {
    isAuthenticating: boolean;
    isLoading: boolean;
    user?: UserProps & { loggedIn: boolean };

    animeData?: { [key: string]: any };
}

class ProyekHomepage extends React.Component<{}, ProyekHomepageState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            isAuthenticating: true,
            isLoading: true,
        };
    }

    async componentDidMount() {
        const userObj = await fetch("/api/auth/user");
        const jsonResp = await userObj.json();
        if (jsonResp.loggedIn) {
            this.setState({ isAuthenticating: false, user: jsonResp });
        } else {
            this.setState({ isAuthenticating: false });
            Router.push("/");
        }
    }

    componentDidUpdate() {
        if (this.state.animeData) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        if (this.state.isAuthenticating || !this.state.user) {
            return (
                <>
                    <Head>
                        <title>naoTimesUI</title>
                        <meta name="description" content="Sebuah WebUI untuk naoTimes" />
                        <HeaderBase />
                    </Head>
                    <main className="bg-white dark:bg-gray-900"></main>
                </>
            );
        }

        const { user } = this.state;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        return (
            <>
                <Head>
                    <title>Proyek - {pageTitle} :: naoTimesUI</title>
                    <meta name="description" content="Sebuah WebUI untuk naoTimes" />
                    <HeaderBase />
                </Head>
                <AdminLayout user={user} title="Proyek" active="project">
                    <div className="container mx-auto px-6 py-8">
                        <h2 className="font-light dark:text-gray-200 pb-4">Proyek</h2>
                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4"></div>
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export default ProyekHomepage;
