const isProd = process.env.NODE_ENV === "production";

module.exports = {
    plugins: ["postcss-import", "postcss-nested", "tailwindcss", "autoprefixer", isProd ? "cssnano" : null],
};
