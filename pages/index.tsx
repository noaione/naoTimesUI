import React from "react";
import Head from "next/head";
import Router from "next/router";

import LockOutlineIcon from "mdi-react/LockOutlineIcon";
import ServerIcon from "mdi-react/ServerIcon";

import withSession from "../lib/session";
import HeaderBase from "../components/HeaderBase";

interface LoginState {
    errorMsg: string;
}

class LoginPage extends React.Component<{}, LoginState> {
    constructor(props: any) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            errorMsg: "",
        };
    }

    async onSubmit(e: React.FormEvent<Element>) {
        e.preventDefault();

        const body = {
            // @ts-ignore
            server: e.currentTarget.server.value,
            // @ts-ignore
            password: e.currentTarget.password.value,
        };

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const userObj = await res.json();
        if (userObj.loggedIn) {
            Router.push("/admin");
        } else {
            this.setState({ errorMsg: userObj.error });
        }
    }

    render() {
        const { errorMsg } = this.state;
        return (
            <>
                <Head>
                    <title>naoTimesUI</title>
                    <meta name="description" content="Sebuah WebUI untuk naoTimes" />
                    <HeaderBase />
                </Head>
                <div className="min-w-screen min-h-screen bg-gray-900 flex items-center justify-center px-5 py-5 ">
                    <div
                        className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
                        style={{ maxWidth: "1000px" }}
                    >
                        <div className="relative md:flex w-full">
                            <div className="hidden md:block w-1/2 bg-gradient-to-br from-indigo-500 to-pink-300 p-10">
                                <img
                                    className="icon h-1/3 mb-2 ring-offset-indigo-800 transition-shadow duration-500 ease-in-out stack-shadow-6 hover:stack-shadow-3"
                                    src="/assets/img/nt192.png"
                                />
                                <div className="font-extrabold text-white text-3xl mb-3 mt-5">
                                    <span className="bg-gradient-to-br from-indigo-800 to-indigo-600 transition-shadow duration-500 ease-in-out rounded-none px-2 py-1 stack-shadow-3 hover:stack-shadow-5 ring-offset-gray-800">
                                        naoTimes
                                    </span>
                                </div>
                                <div className="font-semibold text-lg text-gray-100 mb-4">
                                    <p>Sebuah Bot Multifungsi dengan fitur utam tracking garapan Fansub</p>
                                </div>
                                <a
                                    className="font-semibold text-lg text-white hover:text-gray-200 transition-all duration-400 ease-in-out rounded-md bg-indigo-800 hover:bg-indigo-700 px-2 py-1 stack-shadow-2 hover:stack-shadow-3 ring-offset-indigo-900 mr-1"
                                    href="https://naoti.me/invite"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Invite!
                                </a>
                                <a
                                    className="font-semibold text-lg text-white hover:text-gray-200 transition-all duration-400 ease-in-out rounded-md bg-indigo-800 hover:bg-indigo-700 px-2 py-1 stack-shadow-2 hover:stack-shadow-3 ring-offset-indigo-900"
                                    href="https://discord.gg/7KyYecn"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Support Server
                                </a>
                            </div>

                            <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
                                <div className="text-center mb-10">
                                    <h1 className="font-bold text-3xl text-gray-900">Masuk</h1>
                                    <p>Password didapatkan melalui Bot</p>
                                    <p>
                                        Ketik <code className="text-red-500">!showui</code> di server discord
                                        anda
                                    </p>
                                    <p>
                                        Atau DM Bot dengan{" "}
                                        <code className="text-red-500">!showui server_id</code>
                                    </p>
                                    {errorMsg && (
                                        <p className="text-sm text-red-400 mt-2">Error: {errorMsg}</p>
                                    )}
                                </div>
                                <div>
                                    <form onSubmit={this.onSubmit}>
                                        <div className="flex -mx-3">
                                            <div className="w-full px-3 mb-6">
                                                <label className="text-xs font-semibold px-1">
                                                    Server ID
                                                </label>
                                                <div className="flex">
                                                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                                        <ServerIcon className="text-lg text-gray-400" />
                                                    </div>
                                                    <input
                                                        required
                                                        type="text"
                                                        name="server"
                                                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 transition-colors duraion-400 ease-in-out border-gray-200 outline-nones focus:border-yellow-600"
                                                        placeholder="xxxxxxxxxxxxxxxxxx"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex -mx-3">
                                            <div className="w-full px-3 mb-6">
                                                <label className="text-xs font-semibold px-1">Password</label>
                                                <div className="flex">
                                                    <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                                        <LockOutlineIcon className="text-lg text-gray-400" />
                                                    </div>
                                                    <input
                                                        required
                                                        type="password"
                                                        name="password"
                                                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 transition-colors duraion-400 ease-in-out border-gray-200 outline-nones focus:border-yellow-600"
                                                        placeholder="**************"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex -mx-3">
                                            <div className="w-full px-3 mb-5 text-center">
                                                <button
                                                    type="submit"
                                                    id="sign-in-btn"
                                                    className="block w-full max-w-xs mx-auto transition-colors duraion-200 ease-in-out bg-yellow-600 hover:bg-yellow-800 focus:bg-yellow-700 text-white rounded-lg px-3 py-3 font-semibold"
                                                >
                                                    Masuk
                                                </button>
                                                <a
                                                    href="/registrasi"
                                                    className="block mt-2 text-sm text-center text-gray-500 hover:text-gray-400 transition-colors duration-100"
                                                >
                                                    Registrasi
                                                </a>
                                                <a
                                                    href="https://naoti.me/invite"
                                                    className="block md:hidden mt-2 text-sm text-center text-blue-500 hover:text-blue-400 transition-colors duration-100"
                                                >
                                                    Invite Bot
                                                </a>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({ req, _s }) {
    const user = req.session.get("user");

    if (user) {
        return {
            redirect: {
                destination: "/admin",
                permanent: false,
            },
        };
    }

    return { props: {} };
});

export default LoginPage;
