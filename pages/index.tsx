import React from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";

import EyeIcon from "mdi-react/EyeIcon";
import EyeOffIcon from "mdi-react/EyeOffIcon";
import LockOutlineIcon from "mdi-react/LockOutlineIcon";
import ServerIcon from "mdi-react/ServerIcon";

import MetadataHead from "../components/MetadataHead";
import LoginLayout from "../components/LoginLayout";
import LoadingCircle from "../components/LoadingCircle";

import DiscordIcon from "@/components/Icons/Discord";
import { isNone } from "@/lib/utils";
import { LoginDocument } from "@/lib/graphql/auth.generated";
import client from "@/lib/graphql/client";
import { AuthContext } from "@/components/AuthSuspense";
import {
    SESSION_EXIST,
    USER_DISCORD_MIGRATE,
    USER_INVALID_PASSWORD,
    USER_NEED_MIGRATE,
    USER_NOT_FOUND,
} from "@/lib/graphql/error-code";

interface LoginState {
    errorMsg: string;
    submitting: boolean;
    peekPass: boolean;
    webBaseUrl: string;
}

function generateDiscordLogin(baseUrl: string) {
    let processEnv = process.env.NEXT_PUBLIC_API_V2_ENDPOINT;
    if (typeof processEnv !== "string") {
        return undefined;
    }

    if (processEnv.endsWith("/")) {
        processEnv = processEnv.substring(0, processEnv.length - 1);
    }

    const targetUrl = `${processEnv}/oauth2/discord/authorize`;
    const redirectUrlBack = `${baseUrl}/discord`;
    // Custom OAuth2 URL that support clickjacking prevention
    return `${targetUrl}?base_url=${processEnv}&redirect_url=${redirectUrlBack}`;
}

function translateError(error: string, errorCode?: string) {
    if (isNone(errorCode)) return error;
    switch (errorCode) {
        case USER_NEED_MIGRATE:
            return "Akun anda perlu migrasi ke versi baru. Silahkan hubungi admin untuk bantuan.";
        case USER_DISCORD_MIGRATE:
            return "Gunakan Discord untuk masuk atau reset password.";
        case USER_NOT_FOUND:
            return "Username tidak ditemukan.";
        case USER_INVALID_PASSWORD:
            return "Password salah.";
        default:
            return error;
    }
}

class LoginPage extends React.Component<{}, LoginState> {
    constructor(props: {}) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.toggleGooglyEye = this.toggleGooglyEye.bind(this);
        this.state = {
            errorMsg: "",
            submitting: false,
            peekPass: false,
            webBaseUrl: "",
        };
    }

    componentDidMount(): void {
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.substring(0, currentUrl.indexOf("/", currentUrl.indexOf("//") + 2));
        this.setState({ webBaseUrl: baseUrl });
    }

    async onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        this.setState({ submitting: true });

        const username = e.currentTarget.username.value;
        const password = e.currentTarget.password.value;

        const { data } = await client.mutate({
            mutation: LoginDocument,
            variables: {
                username,
                password,
            },
        });

        if (data.login.__typename === "Result") {
            if (data.login.code === SESSION_EXIST) {
                Router.push("/servers");
                return;
            }
            this.setState({
                errorMsg: translateError(data.login.message, data.login.code),
                submitting: false,
            });
        } else {
            localStorage.setItem("sessionToken", data.login.token);
            Router.push("/servers");
        }
    }

    toggleGooglyEye() {
        this.setState({ peekPass: !this.state.peekPass });
    }

    render() {
        const { errorMsg, submitting, webBaseUrl } = this.state;

        let discordUrl = null;
        if (webBaseUrl) {
            discordUrl = generateDiscordLogin(webBaseUrl);
        }
        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>naoTimesUI</title>
                    <MetadataHead.SEO />
                </Head>
                <LoginLayout>
                    <div className="text-center mb-5">
                        <h1 className="font-bold text-3xl text-gray-900">Masuk</h1>
                        {errorMsg && <p className="text-sm text-red-400 mt-2">Error: {errorMsg}</p>}
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
                                        id="sign-in-btn"
                                        className={`inline-flex items-center w-full max-w-xs mx-auto transition duraion-200 ease-in-out ${
                                            submitting
                                                ? "bg-yellow-500"
                                                : "bg-yellow-600 hover:bg-yellow-800 focus:bg-yellow-700"
                                        } text-white rounded-lg px-3 py-3 font-semibold justify-center ${
                                            submitting ? "cursor-not-allowed opacity-60" : "opacity-100"
                                        }`}
                                        disabled={submitting}
                                    >
                                        {submitting && <LoadingCircle className="mt-0" />}
                                        Masuk
                                    </button>
                                    <Link
                                        href="/registrasi"
                                        className="block mt-2 text-sm text-center text-gray-500 hover:text-gray-400 transition-colors duration-100"
                                    >
                                        Registrasi
                                    </Link>
                                    <Link
                                        href="/migrasi"
                                        className="block mt-2 text-sm text-center text-gray-500 hover:text-gray-400 transition-colors duration-100"
                                    >
                                        Reset/Migrasi
                                    </Link>
                                    <div className="flex flex-row justify-center gap-2">
                                        <a
                                            href="https://naoti.me/invite"
                                            target="_blank"
                                            rel="noreferrer noopener"
                                            className="block md:hidden mt-2 text-sm text-center text-blue-500 hover:text-blue-400 transition-colors duration-100"
                                        >
                                            Invite Bot
                                        </a>
                                        <span className="mt-1 font-light text-gray-400 block md:hidden">
                                            |
                                        </span>
                                        <Link
                                            href="/tentang"
                                            className="block md:hidden mt-2 text-sm text-center text-indigo-500 hover:text-indigo-400 transition-colors duration-100"
                                        >
                                            Tentang
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    {!isNone(discordUrl) && (
                        <div className="flex flex-row justify-center -my-1">
                            <Link
                                id="discord-sign-in-btn"
                                href={discordUrl}
                                className={`inline-flex items-center w-full max-w-xs mx-auto transition duraion-200 ease-in-out ${
                                    submitting
                                        ? "bg-[#121315]"
                                        : "bg-[#2c2f33] hover:bg-[#18191c] focus:bg-[#121315]"
                                } text-white rounded-lg px-3 py-3 font-semibold justify-center ${
                                    submitting ? "cursor-not-allowed opacity-60" : "opacity-100"
                                }`}
                                onClick={(ev) => {
                                    if (submitting) {
                                        ev.preventDefault();
                                    }
                                }}
                            >
                                <DiscordIcon />
                                <p className="ml-1">Masuk dengan Discord</p>
                            </Link>
                        </div>
                    )}
                </LoginLayout>
            </>
        );
    }
}

export default function WrappedLoginPage() {
    return <AuthContext.Consumer>{(_) => <LoginPage />}</AuthContext.Consumer>;
}
