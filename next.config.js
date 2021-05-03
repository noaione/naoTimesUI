// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

const GITHUB_CI = process.env.GITHUB_WORKFLOW;
const SKIP_SENTRY = process.env.SKIP_SENTRY;
let skipSentry = false;
if (SKIP_SENTRY === "1") {
    skipSentry = true;
}
if (typeof GITHUB_CI === "string" && GITHUB_CI.length > 0) {
    skipSentry = true;
}

const moduleExports = {
    future: {
        webpack5: true,
    },
    productionBrowserSourceMaps: true,
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

const SentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = skipSentry ? moduleExports : withSentryConfig(moduleExports, SentryWebpackPluginOptions);
