import React from "react";
import Head from "next/head";

import AdminLayout from "../../../components/AdminLayout";
import MetadataHead from "../../../components/MetadataHead";

import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../../lib/session";

import { UserProps } from "../../../models/user";

interface FansubrssIndexState {
    isLoading: boolean;
    serverData?: { [key: string]: any };
}

interface FansubrssIndexProps {
    user?: UserProps & { loggedIn: boolean };
}

class FansubrssIndex extends React.Component<FansubrssIndexProps, FansubrssIndexState> {
    constructor(props: FansubrssIndexProps) {
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
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>FansubRSS - {pageTitle} :: naoTimesUI</title>
                    <MetadataHead.SEO title={"FansubRSS - " + pageTitle} urlPath="/admin/atur" />
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user} title="FansubRSS" active="fsrss">
                    <div className="container mx-auto px-6 py-8"></div>
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

    return { props: { user: { loggedIn: true, ...user } } };
});

export default FansubrssIndex;
