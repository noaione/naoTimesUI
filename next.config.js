/***
 * @type {import("next").NextConfig}
 */
const moduleExports = {
    productionBrowserSourceMaps: true,
    swcMinify: true,
    images: {
        domains: ["localhost", "127.0.0.1", "api.naoti.me", "msapi.naoti.me", "stapi.naoti.me"],
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
