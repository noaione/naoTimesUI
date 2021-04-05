/* eslint-disable @typescript-eslint/no-var-requires */
const { watch } = require("gulp");

const RealGulp = require("./gulpfile");

const isProd = process.env.NODE_ENV === "production";

exports.default = function () {
    watch("lib/**/*.js", function (cb) {
        RealGulp.bundle(cb, !isProd);
    });
};
