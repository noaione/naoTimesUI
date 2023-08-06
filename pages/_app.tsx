import React from "react";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";
import { AnimatePresence } from "framer-motion";

import "../styles/global.css";
import "react-loading-skeleton/dist/skeleton.css";
import type { AppProps } from "next/app";
import client from "@/lib/graphql/client";
import { ApolloProvider } from "@apollo/client";
import AuthSuspense from "@/components/AuthSuspense";

const isDev = process.env.NODE_ENV === "development";

// Get the original warning function and assign it to new variables
const originalWarn = console.warn;
// Then rebind the function with some exception
// Suppress the Intl/TimeAgo warning about unsupported locales
// Since I'm using a custom unknown one which is not recognizable.
console.warn = (message?: any, ...optionalParams: any[]) => {
    // Check if it's a valid Intl warning
    if (typeof message === "string" && message.includes("locale is not supported")) {
        // If it's true, silent it completely.
        return;
    }
    // If it's not, run the original console.warn command.
    originalWarn(message, ...optionalParams);
};

const progress = new ProgressBar({
    size: 2,
    color: "#DE6115",
    className: "z-[99]",
    delay: 80,
});

Router.events.on("routeChangeStart", (url) => {
    console.log(`Loading: ${url}`);
    progress.start();
});
Router.events.on("routeChangeComplete", () => progress.finish());
Router.events.on("routeChangeError", () => progress.finish());

let DevModeBanner: () => JSX.Element | null = () => null;
if (process.env.NODE_ENV === "development") {
    DevModeBanner = () => {
        return (
            <div className="bottom-0 fixed w-full bg-red-400 text-center py-1 font-bold align-middle z-[999] backdrop-blur-sm bg-opacity-40 dark:text-white">
                ⚠ Development mode
            </div>
        );
    };
}

function NaoTimesUIApp({ Component, pageProps, router }: AppProps) {
    let showDevBanner = isDev;
    if (router.asPath.includes("/embed")) {
        showDevBanner = false;
    }

    return (
        <>
            {showDevBanner && <DevModeBanner />}
            <ApolloProvider client={client}>
                <AnimatePresence key={router.route}>
                    <AuthSuspense path={router.asPath}>
                        <Component {...pageProps} />
                    </AuthSuspense>
                </AnimatePresence>
            </ApolloProvider>
        </>
    );
}

export default NaoTimesUIApp;
