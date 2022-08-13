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

import withSession, { IUserAuth, IUserDiscordMeta, NextServerSideContextWithSession } from "../lib/session";
import DiscordIcon from "@/components/Icons/Discord";
import { isNone, Nullable } from "@/lib/utils";

interface LoginRegistredProps {
    discordClientId?: Nullable<string>;
    isRegistered?: boolean;
    discordIsLoggedIn?: boolean;
    callback?: string;
}

interface LoginState {
    errorMsg: string;
    submitting: boolean;
    peekPass: boolean;
    webBaseUrl: string;
}

// TODO: implement click jacking prevention
function generateDiscordLogin(baseUrl: string, discordId?: Nullable<string>) {
    // sample URL
    if (isNone(discordId)) {
        return undefined;
    }
    // https://discord.com/api/oauth2/authorize?client_id=XXXXXXXXX&redirect_uri=http%3A%2F%2F127.0.0.1%3A6700%2Fapi%2Fauth%2Fdiscord%2Fcallback&response_type=code&scope=identify%20email%20guilds
    const scopes = ["identify", "email", "guilds"];
    // get current webpage base url
    const redirectUrl = `${baseUrl}/api/auth/discord/callback`;
    // encode redirect url
    const redirectUrlEncoded = encodeURIComponent(redirectUrl);
    const url = `https://discord.com/api/oauth2/authorize?client_id=${discordId}&redirect_uri=${redirectUrlEncoded}&response_type=code&scope=${scopes.join(
        "%20"
    )}`;
    return url;
}

class LoginPage extends React.Component<LoginRegistredProps, LoginState> {
    constructor(props: any) {
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

    async onSubmit(e: React.FormEvent<Element>) {
        e.preventDefault();
        this.setState({ submitting: true });
        const { callback } = this.props;

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
            if (typeof callback === "string") {
                Router.push(callback);
            } else {
                Router.push("/admin");
            }
        } else {
            this.setState({ errorMsg: userObj.error, submitting: false });
        }
    }

    toggleGooglyEye() {
        this.setState({ peekPass: !this.state.peekPass });
    }

    render() {
        const { errorMsg, submitting, webBaseUrl } = this.state;
        const { discordClientId, discordIsLoggedIn } = this.props;

        let discordUrl = generateDiscordLogin(webBaseUrl, discordClientId);
        if (discordIsLoggedIn) {
            discordUrl = "/discord";
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
                        <p className="mt-2">Password didapatkan melalui Bot</p>
                        <p>
                            Ketik <code className="text-red-500">!showui</code> di server discord anda
                        </p>
                        <p>
                            Atau DM Bot dengan <code className="text-red-500">!showui server_id</code>
                        </p>
                        {errorMsg && <p className="text-sm text-red-400 mt-2">Error: {errorMsg}</p>}
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
                                    <label className="text-xs font-semibold px-1">Server ID</label>
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
                                    <Link href="/registrasi" passHref>
                                        <a className="block mt-2 text-sm text-center text-gray-500 hover:text-gray-400 transition-colors duration-100">
                                            Registrasi
                                        </a>
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
                                        <Link href="/tentang" passHref>
                                            <a className="block md:hidden mt-2 text-sm text-center text-indigo-500 hover:text-indigo-400 transition-colors duration-100">
                                                Tentang
                                            </a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    {!isNone(discordUrl) && (
                        <div className="flex flex-row justify-center -my-1">
                            <Link href={discordUrl} passHref>
                                <a
                                    id="discord-sign-in-btn"
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
                                </a>
                            </Link>
                        </div>
                    )}
                </LoginLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({ req }: NextServerSideContextWithSession) {
    const user = req.session.get<IUserAuth>("user");
    // Catch the Next.js Router push event with query mask
    // eslint-disable-next-line no-underscore-dangle
    const NEXTJS_RouterQuery = req.__NEXT_INIT_QUERY || {};
    let discordClientId = process.env.DISCORD_CLIENT_ID;

    // check discordClientId, if string empty, set to undefined.
    if (typeof discordClientId === "string" && discordClientId.length === 0) {
        discordClientId = null;
    }

    const { registered, cb } = NEXTJS_RouterQuery;
    const discordMeta = req.session.get<IUserDiscordMeta>("userDiscordMeta");
    const hasDiscordMeta = !isNone(discordMeta);

    if (user && !registered && !hasDiscordMeta) {
        return {
            redirect: {
                destination: "/admin",
                permanent: false,
            },
        };
    }
    if (typeof registered === "string" && !hasDiscordMeta) {
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
    let realCb = null;
    if (typeof cb === "string" && cb.startsWith("/")) {
        realCb = cb;
    }

    return {
        props: {
            isRegistered: justRegistered,
            callback: realCb,
            discordClientId,
            discordIsLoggedIn: hasDiscordMeta,
        },
    };
});

export default LoginPage;
