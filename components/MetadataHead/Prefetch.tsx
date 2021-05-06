import React from "react";

export default function HeaderPrefetch() {
    return (
        <>
            {/* Preconnect and DNS-Prefetch */}
            <link rel="preconnect" href="https://s4.anilist.co" />
            <link rel="dns-prefetch" href="https://s4.anilist.co" />
            {/* Google Fonts */}
            <link rel="preconnect" href="https://fonts.gstatic.com" />
        </>
    );
}
