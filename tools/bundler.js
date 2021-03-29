/* eslint-disable @typescript-eslint/no-unused-vars */
const browserify = require("browserify");
const exorcist = require("exorcist");
const fs = require("fs");
const path = require("path");

// Build projects.
const bundler = browserify({ debug: process.env.NODE_ENV !== "production" });
console.info("=> Bundling projects.js");

bundler.add(path.join(__dirname, "..", "lib", "projects.js"));
bundler.transform("babelify", {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: { chrome: "60", ie: "11", esmodules: true },
            },
        ],
    ],
});

if (process.env.NODE_ENV === "production") {
    console.info("==> Minifying projects.js");
    bundler.transform("uglifyify", { global: true });
}

console.info("==> Saving projects.bundle.js");
const writeStream = fs.createWriteStream(
    path.join(__dirname, "..", "public", "assets", "js", "projects.bundle.js")
);
if (process.env.NODE_ENV !== "production") {
    bundler
        .bundle()
        .pipe(exorcist(path.join(__dirname, "..", "public", "assets", "js", "projects.bundle.map.js")))
        .pipe(writeStream);
} else {
    bundler.bundle().pipe(writeStream);
}
