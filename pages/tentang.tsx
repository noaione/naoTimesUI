import Head from "next/head";
import React from "react";

import { motion } from "framer-motion";
import LoginIcon from "mdi-react/LoginIcon";

import MetadataHead from "../components/MetadataHead";
import Markdown from "../components/Markdown";
import MotionInView from "../components/MotionInView";
import TrakteerButton from "../components/TrakteerButton";

import { romanizeNumber } from "../lib/utils";
import { getAboutContent, getChangelogContent } from "../lib/postshelper";

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
                    <motion.header
                        className="flex justify-between items-center p-4 py-6 bg-gray-800"
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
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
                    </motion.header>
                    <div className="container mx-auto justify-center items-center">
                        <div className="container mx-auto px-6 py-8">
                            <MotionInView.div
                                id="about"
                                className="bg-gray-700 rounded shadow-lg text-gray-200"
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
                                className="p-3 bg-gray-700 rounded shadow-lg text-gray-200"
                                initial={{ y: 75, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Markdown>{changelogPage}</Markdown>
                            </MotionInView.div>
                        </div>
                    </div>
                </main>
                <TrakteerButton />
            </>
        );
    }
}

export async function getStaticProps() {
    const aboutPage = getAboutContent();
    const changelogPage = getChangelogContent();

    return {
        props: {
            aboutPage,
            changelogPage,
        },
    };
}

export default AdminAboutPage;
