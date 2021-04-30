import fs from "fs";
import path from "path";

import Head from "next/head";
import React from "react";

import LoginIcon from "mdi-react/LoginIcon";

import MetadataHead from "../components/MetadataHead";
import Markdown from "../components/Markdown";
import TrakteerButton from "../components/TrakteerButton";

import { romanizeNumber } from "../lib/utils";

interface AboutPageProps {
    aboutPage: string;
    changelogPage: string;
}

class AdminAboutPage extends React.Component<AboutPageProps> {
    constructor(props: AboutPageProps) {
        super(props);
    }

    render() {
        const { aboutPage, changelogPage } = this.props;

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
                    <MetadataHead.SEO title="Tentang" urlPath="/tentang" />
                    <MetadataHead.CSSExtra />
                </Head>
                <main className="bg-gray-900 font-inter">
                    <header className="flex justify-between items-center p-4 py-6 bg-gray-800">
                        <div className="flex items-center space-x4 lg:space-x-0">
                            <div>
                                <h1 className="text-2xl mx-4 lg:mx-2 font-medium text-white">Tentang</h1>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <a
                                href="/"
                                className="flex text-gray-200 transition-opacity duration-200 ease-in-out hover:opacity-70 focus:outline-none mb-1 cursor-pointer"
                            >
                                <LoginIcon />
                            </a>
                        </div>
                    </header>
                    <div className="container mx-auto justify-center items-center">
                        <div className="container mx-auto px-6 py-8">
                            <div
                                id="about"
                                className="p-3 bg-white dark:bg-gray-700 rounded shadow-lg dark:text-gray-200"
                            >
                                <Markdown>{aboutPageWithYear}</Markdown>
                            </div>
                        </div>
                        <div className="container mx-auto px-6 py-8">
                            <div
                                id="changelog"
                                className="p-3 bg-white dark:bg-gray-700 rounded shadow-lg dark:text-gray-200"
                            >
                                <Markdown>{changelogPage}</Markdown>
                            </div>
                        </div>
                    </div>
                </main>
                <TrakteerButton />
            </>
        );
    }
}

export async function getStaticProps() {
    const contentDir = path.join(process.cwd(), "pages", "contents");
    const aboutPage = fs.readFileSync(path.join(contentDir, "about.md")).toString();
    const changelogPage = fs.readFileSync(path.join(contentDir, "changelog.md")).toString();

    return {
        props: {
            aboutPage,
            changelogPage,
        },
    };
}

export default AdminAboutPage;
