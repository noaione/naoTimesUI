/* eslint-disable @typescript-eslint/no-var-requires */
const { watch } = require("gulp");

const RealGulp = require("./gulpfile");

const isProd = process.env.NODE_ENV === "production";

function jsWatch(cb) {
    RealGulp.bundle(cb, !isProd);
}

function cssWatch(cb) {
    RealGulp.css(cb, true);
}

exports.default = function () {
    watch("lib/**/*.js", jsWatch);
    watch(["src/**/*.css", "src/**/*.ts", "public/**/*.ejs", "lib/**/*.js"], cssWatch);
};
