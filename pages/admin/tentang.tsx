import Head from "next/head";
import React from "react";

import AdminLayout from "@/components/Admin";
import MetadataHead from "@/components/MetadataHead";
import Markdown from "@/components/Markdown";
import MotionInView from "@/components/MotionInView";

import { romanizeNumber } from "@/lib/utils";
import { getAboutContent, getChangelogContent } from "@/lib/postshelper";
import { AuthContext } from "@/components/AuthSuspense";
import { UserSessFragment } from "@/lib/graphql/auth.generated";
import { InferGetStaticPropsType } from "next";

interface AdminAboutProps {
    user: UserSessFragment;
    aboutPage: string;
    changelogPage: string;
}

class AdminAboutPage extends React.Component<AdminAboutProps> {
    constructor(props: AdminAboutProps) {
        super(props);
    }

    render() {
        const { user, aboutPage, changelogPage } = this.props;

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
                    <title>Tentang :: naoTimesUI</title>
                    <MetadataHead.SEO title="Tentang" urlPath="/admin/tentang" />
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

export default function WrappedAdminAboutPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <AuthContext.Consumer>
            {(sess) =>
                sess && (
                    <AdminAboutPage
                        user={sess}
                        aboutPage={props.aboutPage}
                        changelogPage={props.changelogPage}
                    />
                )
            }
        </AuthContext.Consumer>
    );
}

export function getStaticProps() {
    const aboutPage = getAboutContent();
    const changelogPage = getChangelogContent();

    return {
        props: {
            aboutPage,
            changelogPage,
        },
    };
}
