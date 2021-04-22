import "../styles/global.css";

// Supress warning from TimeAgo or Intl
// Since it screamed about "locale is not supported" if I'm using a custom one.
const originalWarn = console.warn;
console.warn = (e, ...args) => {
    if (!e.includes("locale is not supported")) {
        originalWarn(e, ...args);
    }
};

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />;
}

export default MyApp;
