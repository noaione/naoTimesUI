import React from "react";
import Head from "next/head";
import Router from "next/router";

import LockOutlineIcon from "mdi-react/LockOutlineIcon";
import ServerIcon from "mdi-react/ServerIcon";

import MetadataHead from "../components/MetadataHead";
import LoginSidebar from "../components/LoginSidebar";
import LoadingCircle from "../components/LoadingCircle";

import withSession, { IUserAuth, NextServerSideContextWithSession } from "../lib/session";

interface LoginRegistredProps {
    isRegistered?: boolean;
}

interface LoginState {
    errorMsg: string;
    submitting: boolean;
}

class LoginPage extends React.Component<LoginRegistredProps, LoginState> {
    constructor(props: any) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            errorMsg: "",
            submitting: false,
        };
    }

    async onSubmit(e: React.FormEvent<Element>) {
        e.preventDefault();
        this.setState({ submitting: true });

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
            this.setState({ errorMsg: userObj.error, submitting: false });
        }
    }

    render() {
        const { errorMsg, submitting } = this.state;
        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>naoTimesUI</title>
                    <MetadataHead.SEO />
                    <MetadataHead.CSSExtra />
                </Head>
                <div className="min-w-screen min-h-screen bg-gray-900 flex items-center justify-center px-5 py-5 ">
                    <div
                        className="bg-gray-100 text-gray-500 rounded-3xl shadow-xl w-full overflow-hidden"
                        style={{ maxWidth: "1000px" }}
                    >
                        <div className="relative md:flex w-full">
                            <LoginSidebar />

                            <div className="w-full md:w-1/2 py-10 px-5 md:px-10">
                                <div className="text-center mb-5">
                                    <h1 className="font-bold text-3xl text-gray-900">Masuk</h1>
                                    <p className="mt-2">Password didapatkan melalui Bot</p>
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
                                    {this.props.isRegistered && (
                                        <p className="text-sm text-blue-500 mt-2">
                                            Sukses, silakan jalankan !tagih di server anda
                                        </p>
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
                                                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 transition-colors duraion-400 ease-in-out border-gray-200 focus:border-yellow-600 focus:outline-none"
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
                                                        className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 transition-colors duraion-400 ease-in-out border-gray-200 focus:outline-none focus:border-yellow-600"
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
                                                    className={`inline-flex items-center w-full max-w-xs mx-auto transition-colors duraion-200 ease-in-out ${
                                                        submitting
                                                            ? "bg-yellow-500"
                                                            : "bg-yellow-600 hover:bg-yellow-800 focus:bg-yellow-700"
                                                    } text-white rounded-lg px-3 py-3 font-semibold justify-center ${
                                                        submitting ? "cursor-not-allowed" : ""
                                                    }`}
                                                    disabled={submitting}
                                                >
                                                    {submitting && <LoadingCircle className="mt-0" />}
                                                    Daftar
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

export const getServerSideProps = withSession(async function ({ req }: NextServerSideContextWithSession) {
    const user = req.session.get<IUserAuth>("user");
    // Catch the Next.js Router push event with query mask
    // eslint-disable-next-line no-underscore-dangle
    const NEXTJS_RouterQuery = req.__NEXT_INIT_QUERY || {};

    const { registered } = NEXTJS_RouterQuery;

    if (user && !registered) {
        return {
            redirect: {
                destination: "/admin",
                permanent: false,
            },
        };
    }
    if (typeof registered === "string") {
        if (user.id === registered) {
            return {
                redirect: {
                    destination: "/admin",
                    permanent: false,
                },
            };
        }
    }

    const justRegistered = typeof registered === "string";

    return { props: { isRegistered: justRegistered } };
});

export default LoginPage;
