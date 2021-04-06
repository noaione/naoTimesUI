
const isProd = process.env.NODE_ENV === "production";

module.exports = {
    mode: isProd ? "jit" : "",
    purge: ["./public/**/*.{js,ts,jsx,tsx,ejs}", "./lib/**/*.{js,ts}", "./src/**/*.{js,ts,jsx,tsx,ejs}"],
    darkMode: "class", // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [require("@tailwindcss/forms"), require("@tailwindcss/custom-forms")],
};
