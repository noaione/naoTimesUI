import Head from "next/head";

export const Home = (): JSX.Element => (
    <div className="container">
        <Head>
            <title>naoTimes Web Panel</title>
        </Head>

        <main>
            <h1 className="title">Welcome to Next.js!</h1>
        </main>
        <style jsx global>{`
            html,
            body {
                padding: 0;
                margin: 0;
                font-family: monospace;
            }

            * {
                box-sizing: border-box;
            }
        `}</style>
    </div>
);

export default Home;
