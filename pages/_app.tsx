import React from "react";

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

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default MyApp;
