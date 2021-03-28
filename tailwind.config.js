let purge = [];
if (process.env.NODE_ENV === "production") {
    purge = ["./public/**/*.{js,ts,jsx,tsx,ejs}", "./src/**/*.{js,ts,jsx,tsx,ejs}"];
}

module.exports = {
    purge: purge,
    darkMode: "media", // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [require("@tailwindcss/forms")],
};
