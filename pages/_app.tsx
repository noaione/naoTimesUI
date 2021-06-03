import React from "react";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";
import { AnimatePresence, AnimateSharedLayout } from "framer-motion";

import "../styles/global.css";
import type { AppProps } from "next/app";

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

function NaoTimesUIApp({ Component, pageProps, router }: AppProps) {
    return (
        <AnimateSharedLayout>
            <AnimatePresence exitBeforeEnter key={router.route}>
                <Component {...pageProps} />
            </AnimatePresence>
        </AnimateSharedLayout>
    );
}

export default NaoTimesUIApp;
