module.exports = {
    purge: ["./public/**/*.{js,ts,jsx,tsx,ejs}", "./lib/**/*.{js,ts}", "./src/**/*.{js,ts,jsx,tsx,ejs}"],
    darkMode: "media", // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [require("@tailwindcss/forms")],
};
