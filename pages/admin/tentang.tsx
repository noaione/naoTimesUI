import fs from "fs";
import path from "path";

import Head from "next/head";
import React from "react";

import AdminLayout from "../../components/AdminLayout";
import MetadataHead from "../../components/MetadataHead";
import Markdown from "../../components/Markdown";

import { romanizeNumber } from "../../lib/utils";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../lib/session";

import { UserProps } from "../../models/user";

interface AdminAboutProps {
    user?: UserProps & { loggedIn: boolean };
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
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user} active="about" title="Tentang">
                    <div className="container mx-auto px-6 py-8">
                        <div
                            id="about"
                            className="p-3 bg-white dark:bg-gray-700 rounded shadow-md dark:text-gray-200"
                        >
                            <Markdown>{aboutPageWithYear}</Markdown>
                        </div>
                    </div>
                    <div className="container mx-auto px-6 py-8">
                        <div
                            id="changelog"
                            className="p-3 bg-white dark:bg-gray-700 rounded shadow-md dark:text-gray-200"
                        >
                            <Markdown>{changelogPage}</Markdown>
                        </div>
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

    const contentDir = path.join(process.cwd(), "pages", "contents");
    const aboutPage = fs.readFileSync(path.join(contentDir, "about.md")).toString();
    const changelogPage = fs.readFileSync(path.join(contentDir, "changelog.md")).toString();

    return { props: { user: { loggedIn: true, ...user }, aboutPage, changelogPage } };
});

export default AdminAboutPage;
