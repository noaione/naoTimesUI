/***
 * @type {import("next").NextConfig}
 */
const moduleExports = {
    productionBrowserSourceMaps: true,
    swcMinify: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "api.naoti.me",
            },
            {
                protocol: "https",
                hostname: "msapi.naoti.me",
            },
            {
                protocol: "https",
                hostname: "stapi.naoti.me",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "8000",
            },
            {
                protocol: "http",
                hostname: "127.0.0.1",
                port: "8000",
            },
            // Remote images, temporary
            {
                protocol: "https",
                hostname: "**.anilist.co",
            },
            {
                protocol: "https",
                hostname: "**.tmdb.org",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Permissions-Policy",
                        value: "interest-cohort=()",
                    },
                ],
            },
        ];
    },
};

module.exports = moduleExports;
