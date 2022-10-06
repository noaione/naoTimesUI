import Head from "next/head";
import React from "react";

import AdminLayout from "@/components/AdminLayout";
import MetadataHead from "@/components/MetadataHead";
import Markdown from "@/components/Markdown";
import MotionInView from "@/components/MotionInView";

import { romanizeNumber } from "@/lib/utils";
import { getAboutContent, getChangelogContent } from "@/lib/postshelper";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "@/lib/session";

interface AdminAboutProps {
    user?: IUserAuth & { loggedIn: boolean };
    aboutPage: string;
    changelogPage: string;
}

class AdminAboutPage extends React.Component<AdminAboutProps> {
    constructor(props: AdminAboutProps) {
        super(props);
    }

    render() {
        const { user, aboutPage, changelogPage } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        const currentYear = new Date().getFullYear();
        const genMarkdownURL = `[${romanizeNumber(
            currentYear
        )}](https://id.wikipedia.org/wiki/${currentYear})`;
        const aboutPageWithYear = aboutPage.replace("{{currentYear}}", genMarkdownURL);

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Tentang - {pageTitle} :: naoTimesUI</title>
                    <MetadataHead.SEO title={"Tentang - " + pageTitle} urlPath="/admin/tentang" />
                </Head>
                <AdminLayout user={user} active="about" title="Tentang">
                    <div className="container mx-auto px-6 py-8">
                        <MotionInView.div
                            id="about"
                            className="p-3 bg-white dark:bg-gray-700 rounded shadow-md dark:text-gray-200"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Markdown>{aboutPageWithYear}</Markdown>
                        </MotionInView.div>
                    </div>
                    <div className="container mx-auto px-6 py-8">
                        <MotionInView.div
                            id="changelog"
                            className="p-3 bg-white dark:bg-gray-700 rounded shadow-md dark:text-gray-200"
                            initial={{ y: 75, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Markdown>{changelogPage}</Markdown>
                        </MotionInView.div>
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
                destination: "/?cb=/admin/tentang",
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

    const changelogPage = getChangelogContent();
    const aboutPage = getAboutContent();

    return { props: { user: { loggedIn: true, ...user }, aboutPage, changelogPage } };
});

export default AdminAboutPage;
