const isProd = process.env.NODE_ENV === "production";

const usePlugins = ["postcss-import", "postcss-nested", "tailwindcss", "autoprefixer"];
if (isProd) {
    usePlugins.push("cssnano");
}

module.exports = {
    plugins: usePlugins,
};
