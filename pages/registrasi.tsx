import React from "react";
import Head from "next/head";
import Router from "next/router";

import AccountIcon from "mdi-react/AccountIcon";
import ServerIcon from "mdi-react/ServerIcon";

import MetadataHead from "../components/MetadataHead";
import LoginLayout from "../components/LoginLayout";
import LoadingCircle from "../components/LoadingCircle";

interface RegistrationState {
    errorMsg: string;
    submitting: boolean;
}

class RegistrationPage extends React.Component<{}, RegistrationState> {
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
        if (this.state.submitting) {
            return;
        }
        this.setState({ submitting: true });

        const body = {
            // @ts-ignore
            server: e.currentTarget.server.value,
            // @ts-ignore
            admin: e.currentTarget.admin.value,
        };

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const userObj = await res.json();
        if (userObj.success) {
            Router.push({ pathname: "/", query: { registered: body.server } }, "/");
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
                    <title>Registrasi :: naoTimesUI</title>
                    <MetadataHead.SEO title="Registrasi" urlPath="/admin" />
                    <MetadataHead.CSSExtra />
                </Head>
                <LoginLayout>
                    <div className="text-center mb-5">
                        <h1 className="font-bold text-3xl text-gray-900">Registrasi</h1>
                        <p className="mt-2">Mohon Invite Bot terlebih dahulu</p>
                        <p>Lalu masukan server ID anda di sini dan klik Registrasi</p>
                        <p>Admin ID, adalah User ID Discord</p>
                        <p>
                            Setelah registrasi, silakan periksa dengan perintah{" "}
                            <code className="text-red-500">!tagih</code>
                        </p>
                        {errorMsg && <p className="text-sm text-red-400 mt-2">Error: {errorMsg}</p>}
                    </div>
                    <div>
                        <form onSubmit={this.onSubmit}>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-6">
                                    <label className="text-xs font-semibold px-1">Server ID</label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                            <ServerIcon className="text-lg text-gray-400" />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            name="server"
                                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 transition-colors duration-400 ease-in-out border-gray-200 focus:outline-none focus:border-yellow-600"
                                            placeholder="xxxxxxxxxxxxxxxxxx"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-6">
                                    <label className="text-xs font-semibold px-1">Admin ID</label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                            <AccountIcon className="text-lg text-gray-400" />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            name="admin"
                                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 transition-colors duration-400 ease-in-out border-gray-200 focus:outline-none focus:border-yellow-600"
                                            placeholder="xxxxxxxxxxxxxxxxxx"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-5 text-center">
                                    <button
                                        type="submit"
                                        id="register-btn"
                                        className={`inline-flex items-center w-full max-w-xs mx-auto transition duration-200 ease-in-out ${
                                            submitting
                                                ? "bg-yellow-500"
                                                : "bg-yellow-600 hover:bg-yellow-800 focus:bg-yellow-700"
                                        } text-white rounded-lg px-3 py-3 font-semibold justify-center ${
                                            submitting ? "cursor-not-allowed opacity-60" : "opacity-100"
                                        }`}
                                        disabled={submitting}
                                    >
                                        {submitting && <LoadingCircle className="mt-0" />}
                                        Daftar
                                    </button>
                                    <a
                                        href="/"
                                        className="block mt-2 text-sm text-center text-gray-500 hover:text-gray-400 transition-colors duration-100"
                                    >
                                        Sudah Terdaftar?
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
                </LoginLayout>
            </>
        );
    }
}

export default RegistrationPage;
