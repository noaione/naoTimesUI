/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
const { watch } = require("gulp");

const RealGulp = require("./gulpfile");

const isProd = process.env.NODE_ENV === "production";

function jsWatch(cb) {
    RealGulp.bundle(cb, !isProd);
}

function jsNotifWatch(cb) {
    RealGulp.bundleNotification(cb, !isProd);
}

function cssWatch(cb) {
    RealGulp.css(cb, true);
}

exports.default = () => {
    watch(["lib/pages/**/*.js", "lib/projects.js", "lib/utils.js"], jsWatch);
    watch(["lib/notification.js", "lib/utils.js"], jsNotifWatch);
    watch(["src/**/*.css", "src/**/*.ts", "public/**/*.ejs", "lib/**/*.js", "src/**/*.pcss"], cssWatch);
};
