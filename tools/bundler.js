/* eslint-disable @typescript-eslint/no-unused-vars */
const browserify = require("browserify");
const fs = require("fs");
const path = require("path");

// Build projects.
const bundler = browserify({ debug: true });
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
bundler
    .bundle()
    .pipe(fs.createWriteStream(path.join(__dirname, "..", "public", "assets", "js", "projects.bundle.js")));
