const isProd = process.env.NODE_ENV === "production";

module.exports = {
    plugins: {
        "@tailwindcss/jit": {},
        autoprefixer: {},
        cssnano: isProd ? {} : false,
    },
};
