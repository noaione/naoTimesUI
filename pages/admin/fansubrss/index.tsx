import React from "react";
import Head from "next/head";

import { motion } from "framer-motion";

import AdminLayout from "../../../components/AdminLayout";
import MetadataHead from "../../../components/MetadataHead";
import FansubRSSOverview from "../../../components/FansubRSS/Overview";

import { FansubRSSFeeds, FansubRSSSchemas } from "../../../lib/fsrss";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../../lib/session";
import { isNone, Nullable } from "../../../lib/utils";

import { UserProps } from "../../../models/user";

interface FansubrssIndexProps {
    user?: UserProps & { loggedIn: boolean };
    fansubRss: FansubRSSFeeds[];
    isPremium: boolean;
}

class FansubrssIndex extends React.Component<FansubrssIndexProps> {
    constructor(props: FansubrssIndexProps) {
        super(props);
    }

    render() {
        const { user, fansubRss } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>FansubRSS - {pageTitle} :: naoTimesUI</title>
                    <MetadataHead.SEO title={"FansubRSS - " + pageTitle} urlPath="/admin/fansubrss" />
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user} title="FansubRSS" active="fsrss">
                    <div className="container mx-auto px-6 py-8 justify-center">
                        {fansubRss.length > 0 ? (
                            <>
                                <div className="flex flex-col">
                                    <motion.div
                                        className="flex"
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <a
                                            href="/admin/fansubrss/tambah"
                                            className="px-3 py-2 bg-green-500 rounded text-white hover:bg-green-600 transition duration-200 font-bold"
                                        >
                                            Tambah
                                        </a>
                                    </motion.div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
                                        {fansubRss.map((feed, idx) => {
                                            let delay = 0.25;
                                            if (idx > 0) {
                                                delay = 0.25 + 0.1 * (idx + 1);
                                            }
                                            return (
                                                <FansubRSSOverview
                                                    key={`feed-${feed.id}`}
                                                    feed={feed}
                                                    animateDelay={delay}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col justify-center">
                                    <div className="text-xl font-bold text-center dark:text-gray-200">
                                        Tidak ada RSS yang terdaftar
                                    </div>
                                    <a
                                        href="/admin/fansubrss/tambah"
                                        className="text-center text-yellow-500 hover:text-yellow-600 duration-200 transition mt-2"
                                    >
                                        Tambah Baru
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({ req }: NextServerSideContextWithSession) {
    const user = req.session.get<IUserAuth>("user");
    const socketLib = await import("../../../lib/socket");

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

    const rssSchemas: Nullable<FansubRSSSchemas> = await socketLib.emitSocketAndWait("fsrss get", {
        id: user.id,
    });
    let fansubRSSFeeds: FansubRSSFeeds[];
    let isPremium = false;
    if (isNone(rssSchemas)) {
        fansubRSSFeeds = [];
    } else {
        fansubRSSFeeds = rssSchemas.feeds;
        isPremium = rssSchemas?.premium ?? false;
    }

    return { props: { user: { loggedIn: true, ...user }, fansubRss: fansubRSSFeeds, isPremium } };
});

export default FansubrssIndex;
