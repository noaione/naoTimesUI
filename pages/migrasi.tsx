import React from "react";
import Head from "next/head";
import Link from "next/link";

import EyeIcon from "mdi-react/EyeIcon";
import EyeOffIcon from "mdi-react/EyeOffIcon";
import LockOutlineIcon from "mdi-react/LockOutlineIcon";
import ServerIcon from "mdi-react/ServerIcon";

import MetadataHead from "../components/MetadataHead";
import LoginLayout from "../components/LoginLayout";
import LoadingCircle from "../components/LoadingCircle";
import client from "@/lib/graphql/client";
import { MigrateUserDocument } from "@/lib/graphql/auth.generated";

interface MigrasiState {
    errorMsg: string;
    peekPass: boolean;
    submitting: boolean;
    approvalCode?: string;
}

class MigrasiPage extends React.Component<{}, MigrasiState> {
    constructor(props: any) {
        super(props);
        this.toggleGooglyEye = this.toggleGooglyEye.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.state = {
            errorMsg: "",
            submitting: false,
            peekPass: false,
        };
    }

    async onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (this.state.submitting) {
            return;
        }
        this.setState({ submitting: true, errorMsg: "" });

        const username = e.currentTarget.username.value;
        const password = e.currentTarget.password.value;

        const { data, errors } = await client.mutate({
            mutation: MigrateUserDocument,
            variables: {
                username,
                password,
            },
        });

        if (errors) {
            console.error(errors);
            this.setState({ errorMsg: "Terjadi kesalahan pada server", submitting: false });
            return;
        }

        if (data.migrate.__typename === "Result") {
            this.setState({ errorMsg: data.migrate.message, submitting: false });
        } else {
            this.setState({ errorMsg: "", submitting: false, approvalCode: data.migrate.approvalCode });
        }
    }

    toggleGooglyEye() {
        this.setState({ peekPass: !this.state.peekPass });
    }

    render() {
        const { errorMsg, submitting, approvalCode } = this.state;
        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Registrasi :: naoTimesUI</title>
                    <MetadataHead.SEO title="Registrasi" urlPath="/admin" />
                </Head>
                <LoginLayout>
                    <div className="text-center mb-5">
                        <h1 className="font-bold text-3xl text-gray-900">Reset dan Migrasi</h1>
                        {errorMsg && <p className="text-sm text-red-400 mt-2">Error: {errorMsg}</p>}
                        {approvalCode && (
                            <>
                                <p className="text-sm text-green-600 mt-2">Sukses!</p>
                                <p>Mohon gunakan Bot untuk konfirmasi migrasi dengan:</p>
                                <p>
                                    <code>!ntui migrasi [username] [kode] [password]</code>
                                </p>
                            </>
                        )}
                    </div>
                    <div>
                        <form onSubmit={this.onSubmit}>
                            <div className="flex -mx-3">
                                <div className="w-full px-3 mb-6">
                                    <label className="text-xs font-semibold px-1">Username</label>
                                    <div className="flex">
                                        <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                                            <ServerIcon className="text-lg text-gray-400" />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            name="username"
                                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 transition-colors duration-400 ease-in-out border-gray-200 focus:outline-none focus:border-yellow-600"
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
                                            type={this.state.peekPass ? "text" : "password"}
                                            name="password"
                                            className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 transition-colors duraion-400 ease-in-out border-gray-200 focus:outline-none focus:border-yellow-600"
                                            placeholder="**************"
                                        />
                                        <div
                                            className={`absolute right-8 mt-2.5 md:right-12 duration-200 ${
                                                this.state.peekPass
                                                    ? "text-gray-500 hover:text-gray-600"
                                                    : "text-gray-400 hover:text-gray-500"
                                            } z-20`}
                                            onClick={this.toggleGooglyEye}
                                        >
                                            {this.state.peekPass ? <EyeOffIcon /> : <EyeIcon />}
                                        </div>
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
                                        Migrasi
                                    </button>
                                    <Link
                                        href="/"
                                        className="block mt-2 text-sm text-center text-gray-500 hover:text-gray-400 transition-colors duration-100"
                                    >
                                        Sudah Terdaftar?
                                    </Link>
                                    <Link
                                        href="/registrasi"
                                        className="block mt-2 text-sm text-center text-gray-500 hover:text-gray-400 transition-colors duration-100"
                                    >
                                        Daftarkan diri
                                    </Link>
                                    <a
                                        href="https://naoti.me/invite"
                                        className="block md:hidden mt-2 text-sm text-center text-blue-500 hover:text-blue-400 transition-colors duration-100"
                                        rel="noopener noreferrer"
                                        target="_blank"
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

export default MigrasiPage;
