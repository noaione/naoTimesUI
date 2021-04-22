import React from "react";
import Head from "next/head";

import withSession from "../../lib/session";

import { UserProps } from "../../models/user";
import AdminLayout from "../../components/AdminLayout";
import HeaderBase from "../../components/HeaderBase";

interface AdminHomepageState {
    isLoading: boolean;

    animeData?: { [key: string]: any };
    statsData?: { [key: string]: any }[];
}

interface AdminHomepageProps {
    user?: UserProps & { loggedIn: boolean };
}

class AdminHomepage extends React.Component<AdminHomepageProps, AdminHomepageState> {
    constructor(props: AdminHomepageProps) {
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
        if (this.state.animeData && this.state.statsData) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { user } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        return (
            <>
                <Head>
                    <title>{pageTitle} :: naoTimesUI</title>
                    <HeaderBase />
                </Head>
                <AdminLayout user={user}>
                    <div className="container mx-auto px-6 py-8">
                        <h2 className="font-light dark:text-gray-200 pb-4">Statistik</h2>
                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4"></div>
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

export default AdminHomepage;
