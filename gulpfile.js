/* eslint-disable @typescript-eslint/no-var-requires */
const gulp = require("gulp");
const autoprefixer = require("autoprefixer");
const tailwind = require("tailwindcss");
const tailwindjit = require("@tailwindcss/jit");
const cssnano = require("cssnano");
const postcss = require("postcss");
const postcssImport = require("postcss-import");

const swc = require("gulp-swc");

const esbuild = require("esbuild");

const fs = require("fs");
const path = require("path");
const shelljs = require("shelljs");

const _ = require("lodash");
const winston = require("winston");

const loggerMain = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.colorize({ level: true, message: false }),
        winston.format.timestamp(),
        winston.format.printf((info) => {
            let initformat = `[${info["timestamp"]}][${info.level}]`;
            const squareMode = _.get(info, "squared", false);
            if (_.has(info, "fn") && _.has(info, "cls")) {
                if (squareMode) {
                    initformat += "[";
                } else {
                    initformat += " ";
                }
                initformat += `\u001b[35m${info["cls"]}\u001b[39m.\u001b[36m${info["fn"]}\u001b[39m`;
                if (squareMode) {
                    initformat += "]";
                } else {
                    initformat += "()";
                }
            } else if (!_.has(info, "fn") && _.has(info, "cls")) {
                if (squareMode) {
                    initformat += "[";
                } else {
                    initformat += " ";
                }
                initformat += `\u001b[35m${info["cls"]}\u001b[39m`;
                if (squareMode) {
                    initformat += "]";
                } else {
                    initformat += "()";
                }
            } else if (!_.has(info, "cls") && _.has(info, "fn")) {
                if (squareMode) {
                    initformat += "[";
                } else {
                    initformat += " ";
                }
                initformat += `\u001b[36m${info["fn"]}\u001b[39m`;
                if (squareMode) {
                    initformat += "]";
                } else {
                    initformat += "()";
                }
            }
            return initformat + `: ${info.message}`;
        })
    ),
    transports: [new winston.transports.Console()],
});

const isProd = process.env.NODE_ENV === "production";

function start(cb) {
    const logger = loggerMain.child({ cls: "GulpTasks" });
    logger.info(`Running task on ${process.env.NODE_ENV} mode`);
    cb();
}

function clean(cb) {
    const logger = loggerMain.child({ fn: "clean", cls: "GulpTasks" });
    logger.info("Cleaning dist folder");
    shelljs.rm("-R", path.join(__dirname, "dist"));
    logger.info("Cleaning generated files...");
    shelljs.rm(
        path.join(__dirname, "public", "assets", "main.css"),
        path.join(__dirname, "public", "assets", "js", "projects.bundle.js"),
        path.join(__dirname, "public", "assets", "js", "projects.bundle.map.js"),
        path.join(__dirname, "public", "assets", "js", "projects.bundle.js.map")
    );
    cb();
}

function transpile(cb) {
    const logger = loggerMain.child({ fn: "transpile", cls: "GulpTasks" });
    if (isProd) {
        logger.info("Transpiling ts file to js with swc");
        const config = fs.readFileSync(path.join(__dirname, ".swcrc")).toString();
        return gulp
            .src("src/**/*.ts")
            .pipe(swc(JSON.parse(config)))
            .pipe(gulp.dest("dist"));
    } else {
        logger.info("Running in non-production mode, not going to transpile ts files");
        cb();
    }
}

function css(cb) {
    const logger = loggerMain.child({ fn: "css", cls: "GulpTasks" });
    const cssSources = fs.readFileSync("src/styles.css");
    let plugins = [postcssImport, tailwind, autoprefixer];
    if (isProd) {
        plugins = [postcssImport, tailwindjit, autoprefixer, cssnano];
    }
    logger.info(
        `PostCSS+${plugins.length === 3 ? "TailwindJIT" : "Tailwind"} with ${plugins.length - 1} plugins`
    );
    postcss(plugins)
        .process(cssSources, { from: "src/styles.css", to: "public/assets/main.css" })
        .then((result) => {
            logger.info("Saving process css!");
            fs.writeFileSync("public/assets/main.css", result.css);
            if (result.map) {
                logger.info("Saving process css sourceMap");
                fs.writeFileSync("public/assets/main.css.map", result.map.toString());
            }
            cb();
        });
}

function bundle(cb, forceDev = false) {
    const logger = loggerMain.child({ fn: "bundle", cls: "GulpTasks" });
    let isDev = !isProd;
    if (forceDev) {
        isDev = true;
    }
    logger.info("Bundling projects.js!");
    esbuild
        .build({
            entryPoints: ["lib/projects.js"],
            bundle: true,
            outfile: "public/assets/js/projects.bundle.js",
            minify: !isDev,
            platform: "browser",
            sourcemap: isDev,
            target: ["chrome58", "firefox57", "safari11", "edge79", "es2015"],
            pure: ["console.log", "console.info"], // Strip any info log if minified
        })
        .then(() => {
            logger.info(`Successfully bundled files.`);
            cb();
        })
        .catch((err) => {
            logger.error("An error occured while trying to bundle JS file");
            console.error(err);
            cb(new Error(err));
        });
}

exports.bundle = bundle;
exports.css = css;
exports.default = gulp.series(start, clean, transpile, gulp.parallel(css, bundle));
