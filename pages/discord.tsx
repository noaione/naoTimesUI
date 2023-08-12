import React from "react";
import Head from "next/head";

import { AuthContext } from "../components/AuthSuspense";
import MetadataHead from "../components/MetadataHead";
import client from "../lib/graphql/client";
import { SessionDocument } from "../lib/graphql/auth.generated";
import Router from "next/router";

interface DiscordCallbackPageProps {
    token?: string;
}

interface DiscordCallbackPageState {
    info: string;
    detail: string;
}

class DiscordCallbackPage extends React.Component<DiscordCallbackPageProps, DiscordCallbackPageState> {
    constructor(props: DiscordCallbackPageProps) {
        super(props);
        this.pushBack = this.pushBack.bind(this);
        this.state = {
            info: "Proses",
            detail: "Mohon tunggu sebentar...",
        };
    }

    pushBack() {
        setTimeout(() => {
            Router.push("/");
        }, 1500);
    }

    async componentDidMount() {
        // get window location query
        const query = new URLSearchParams(window.location.search);
        const token = query.get("token");
        if (!token) {
            this.setState({
                info: "Gagal",
                detail: "Tidak ada token yang diberikan.",
            });
            this.pushBack();
            return;
        }

        localStorage.setItem("sessionToken", token);

        const { data, error } = await client.query({
            query: SessionDocument,
        });

        if (error) {
            this.setState({
                info: "Gagal",
                detail: error.message,
            });
            this.pushBack();
            return;
        }

        if (data.session.__typename === "Result") {
            this.setState({
                info: "Gagal",
                detail: data.session.message ?? "Terjadi kesalahan yang tidak diketahui.",
            });
            this.pushBack();
            return;
        }

        // Login success
        this.setState({
            info: "Sukses",
            detail: "Anda akan diarahkan ke laman peladen...",
        });
        setTimeout(() => {
            Router.push("/admin");
        }, 1000);
    }

    render() {
        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Discord OAuth :: naoTimesUI</title>
                    <MetadataHead.SEO title="Discord OAuth2" description="Discord OAuth2" />
                </Head>
                <div className="bg-gray-900 text-white h-screen text-center w-screen flex flex-col items-center justify-center">
                    <div>
                        <h1 className="inline-block border-r border-gray-300 m-0 mr-5 py-3 pr-6 pl-0 text-2xl font-semibold align-top">
                            Proses
                        </h1>
                        <div className="inline-block text-left leading-10 h-10 align-middle items-center place-items-start justify-items-center">
                            <h2 className="text-sm font-normal mt-5 p-0 self-center place-self-center">
                                Mohon tunggu sebentar...
                            </h2>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default function WrappedDiscordCallbackPage(props: DiscordCallbackPageProps) {
    return <AuthContext.Consumer>{(_) => <DiscordCallbackPage token={props.token} />}</AuthContext.Consumer>;
}
