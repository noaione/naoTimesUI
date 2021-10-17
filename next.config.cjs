// const { withSentryConfig } = require("@sentry/nextjs");
// const withPlugins = require("next-compose-plugins");
// const withBundleAnalyzer = require("@next/bundle-analyzer")({
//     enabled: process.env.ANALYZE === "true",
// });

import { withSentryConfig } from "@sentry/nextjs";
import withPlugins from "next-compose-plugins";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === "true" });

console.info("Is Bundle analyer enabled?", process.env.ANALYZE === "true");

const GITHUB_CI = process.env.GITHUB_WORKFLOW;
const SKIP_SENTRY = process.env.SKIP_SENTRY;
const IS_PREVIEW = process.env.VERCEL_ENV === "preview";
let skipSentry = false;
if (SKIP_SENTRY === "1") {
    skipSentry = true;
}
if (typeof GITHUB_CI === "string" && GITHUB_CI.length > 0) {
    skipSentry = true;
}
if (IS_PREVIEW) {
    skipSentry = true;
}

const moduleExports = {
    productionBrowserSourceMaps: true,
    experimental: {
        swcLoader: true,
        swcMinify: true,
        esmExternals: true,
    },
    typescript: {
        ignoreBuildErrors: process.env.NODE_ENV === "production",;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    webpack: (config, { dev, isServer, webpack }) => {
        if (!dev && !isServer) {
            Object.assign(config.resolve.alias, {
                react: "preact/compat",
                "react-dom/test-utils": "preact/test-utils",
                "react-dom": "preact/compat",
            });
        }
        return config;
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

console.info("Is Sentry dry run mode?", skipSentry);
const SentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
    dryRun: skipSentry,
};

const plugins = [
    [withBundleAnalyzer],
    (nextConfig) => withSentryConfig(nextConfig, SentryWebpackPluginOptions),
];

module.exports = withPlugins(plugins, moduleExports);
