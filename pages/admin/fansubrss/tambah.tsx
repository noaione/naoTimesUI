import React from "react";
import Head from "next/head";

import AdminLayout from "../../../components/AdminLayout";
import MetadataHead from "../../../components/MetadataHead";

import { FansubRSSSchemas } from "../../../lib/fsrss";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../../lib/session";
import { emitSocketAndWait } from "../../../lib/socket";
import { isNone, Nullable } from "../../../lib/utils";

import { UserProps } from "../../../models/user";

interface FansubrssIndexState {
    isLoading: boolean;
    serverData?: { [key: string]: any };
}

interface FansubrssIndexProps {
    user?: UserProps & { loggedIn: boolean };
    totalData: number;
    isPremium: boolean;
}

class FansubrssIndex extends React.Component<FansubrssIndexProps, FansubrssIndexState> {
    constructor(props: FansubrssIndexProps) {
        super(props);
        this.state = {
            isLoading: true,
        };
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
                    <title>Tambah - FansubRSS - {pageTitle} :: naoTimesUI</title>
                    <MetadataHead.SEO
                        title={"Tambah - FansubRSS - " + pageTitle}
                        urlPath="/admin/fansubrss"
                    />
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user} title="Tambah - FansubRSS" active="fsrsspage">
                    <div className="container mx-auto px-6 py-8 justify-center">
                        <p>Rebuilding</p>
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
    if (user.privilege === "owner") {
        return {
            notFound: true,
        };
    }

    const rssSchemas: Nullable<FansubRSSSchemas> = await emitSocketAndWait("fsrss get", { id: user.id });
    let isPremium = false;
    let totalData = 0;
    if (!isNone(rssSchemas)) {
        isPremium = rssSchemas?.premium ?? false;
        totalData = rssSchemas.feeds.length;
    }

    return { props: { user: { loggedIn: true, ...user }, isPremium, totalData } };
});

export default FansubrssIndex;
