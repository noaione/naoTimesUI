import React from "react";
// eslint-disable-next-line @next/next/no-document-import-in-page
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

import { InlineJs } from "@kachkaev/react-inline-js";

import { isNone } from "../lib/utils";

const THEME_CHECKER_JS = `
// Helper
const isNullified = function(data) {
    return typeof data === "undefined" || data === null;
}

// Ignore this page
const isEmbedPage = location.pathname === "/embed";

// Check for first user preferences.
let userPreferDark;
let systemPreferDark = false;
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    systemPreferDark = true;
}
try {
    const themeStorage = localStorage.getItem("ntui.theme");
    if (!isNullified(themeStorage)) {
        userPreferDark = themeStorage === "dark" ? true : false;
    }
} catch (e) {};
if (isNullified(userPreferDark)) {
    if (systemPreferDark) {
        if (!isEmbedPage) document.documentElement.classList.add("dark");
        localStorage.setItem("ntui.theme", "dark");
    } else {
        localStorage.setItem("ntui.theme", "light");
    }
} else {
    if (userPreferDark && !isEmbedPage) {
        document.documentElement.classList.add("dark");
    }
}

// Theme toggler
const toggleTheme = function() {
    try {
        if (isEmbedPage) {
            const isDark = document.documentElement.classList.contains("dark");
            isDark ? document.documentElement.classList.remove("dark") : document.documentElement.classList.add("dark");
        }
        localStorage.setItem("ntui.theme", isDark ? "light" : "dark");
    } catch (e) {};
};
`;

interface ExtraProps {
    pathname: string;
}

class NaoTimesAppDocument extends Document<ExtraProps> {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        console.info(ctx.pathname);
        return { ...initialProps, pathname: ctx.pathname };
    }

    render() {
        const { PLAUSIBLE_DOMAIN_TRACK } = process.env;
        // Add Plausible
        let addTracking = false;
        if (!isNone(PLAUSIBLE_DOMAIN_TRACK) && PLAUSIBLE_DOMAIN_TRACK.trim().length > 0) {
            addTracking = true;
        }
        // get current route
        const isAdminRoute = this.props.pathname.startsWith("/admin");
        return (
            <Html prefix="og: https://ogp.me/ns#">
                <Head>
                    <InlineJs code={THEME_CHECKER_JS} />
                    {addTracking && (
                        <script
                            async
                            defer
                            data-domain={PLAUSIBLE_DOMAIN_TRACK}
                            src="https://tr.n4o.xyz/js/plausible.js"
                        />
                    )}
                    <link
                        href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700;800&display=swap"
                        rel="stylesheet"
                    />
                </Head>
                <body className={isAdminRoute ? "" : `bg-gray-900 text-white`}>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default NaoTimesAppDocument;
