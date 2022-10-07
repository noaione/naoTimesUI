const { withSentryConfig } = require("@sentry/nextjs");

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

/***
 * @type {import("next").NextConfig}
 */
const moduleExports = {
    productionBrowserSourceMaps: true,
    swcMinify: true,
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

function withWrappedSentry(config) {
    return withSentryConfig(config, SentryWebpackPluginOptions);
}

module.exports = () => {
    const plugins = [];
    if (!skipSentry) {
        plugins.push(withWrappedSentry);
    }
    const config = plugins.reduce((acc, next) => next(acc), { ...moduleExports });
    return config;
};
