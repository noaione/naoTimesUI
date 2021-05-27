// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

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

function useESBuildMinify(config, options) {
    const terserIndex = config.optimization.minimizer.findIndex(
        (minimizer) => minimizer.constructor.name === "TerserPlugin"
    );
    if (terserIndex > -1) {
        config.optimization.minimizer.splice(terserIndex, 1, new ESBuildMinifyPlugin(options));
    }
}

function useESBuildLoader(config, options) {
    const tsLoader = config.module.rules.find((rule) => rule.test && rule.test.test(".ts"));
    if (tsLoader && tsLoader.use && tsLoader.use.loader) {
        tsLoader.use.loader = "esbuild-loader";
        tsLoader.use.options = options;
    }
    const jsLoader = config.module.rules.find((rule) => rule.test && rule.test.test(".js"));
    if (jsLoader && jsLoader.use && jsLoader.use.loader) {
        jsLoader.use.loader = "esbuild-loader";
        if (Object.keys(options).length > 0) {
            // eslint-disable-next-line dot-notation
            options["loader"] = "jsx";
        }
        jsLoader.use.options = options;
    }
}

const moduleExports = {
    future: {
        webpack5: true,
    },
    productionBrowserSourceMaps: true,
    webpack: (config, { webpack, isServer }) => {
        config.plugins.push(
            new webpack.ProvidePlugin({
                React: "react",
            })
        );

        useESBuildMinify(config);
        useESBuildLoader(config, {
            loader: "tsx",
            target: "es2015",
        });

        if (!isServer) {
            config.resolve.fallback.fs = false;
            config.resolve.fallback.net = false;
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
