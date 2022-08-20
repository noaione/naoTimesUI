import React from "react";
import Head from "next/head";
import Router from "next/router";

import MetadataHead from "@/components/MetadataHead";
import withSession, { NextServerSideContextWithSession } from "@/lib/session";
import { isNone } from "@/lib/utils";

interface Props {
    code: string;
    failure: boolean;
}

interface State {
    errorMsg?: string;
}

export default class DiscordCallbackPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            errorMsg: undefined,
        };
    }
    async componentDidMount() {
        const { code, failure } = this.props;
        if (failure) {
            return;
        }
        const currentUrl = window.location.href;
        const baseUrl = currentUrl.substring(0, currentUrl.indexOf("/", currentUrl.indexOf("//") + 2));

        try {
            const result = await fetch(`/api/auth/discord/exchange?base_url=${baseUrl}&code=${code}`);
            const data = await result.json();
            if (result.status !== 200) {
                this.setState({ errorMsg: data.error });
            } else {
                Router.push("/discord");
            }
        } catch (e) {
            console.error(e);
            this.setState({ errorMsg: "Terjadi kesalahan internal, mohon cek console" });
        }
    }

    render() {
        const { failure } = this.props;
        const { errorMsg } = this.state;
        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Discord OAuth2 :: naoTimesUI</title>
                    <MetadataHead.SEO
                        title="Discord OAuth2"
                        description="Autentikasi naoTimes dengan akun Discord anda!"
                        urlPath="/discord/callback"
                    />
                </Head>
                <div className="bg-gray-900 text-white h-screen text-center w-screen flex flex-col items-center justify-center">
                    <div>
                        <h1 className="text-xl font-semibold pb-0 md:pb-4">Discord OAuth2</h1>
                    </div>
                    <div>
                        <h1 className="hidden md:inline-block border-r border-gray-300 m-0 mr-5 py-3 pr-6 pl-0 text-2xl font-semibold align-top">
                            {failure ? <span>💢</span> : <span>🤔</span>}
                        </h1>
                        <div className="inline-block text-left leading-10 h-10 align-middle items-center place-items-start justify-items-center">
                            {failure ? (
                                <h2 className="text-sm font-normal mt-5 p-0 self-center place-self-center">
                                    Tidak dapat memproses login Discord, mohon ulangi!
                                </h2>
                            ) : (
                                <h2 className="text-sm font-normal mt-5 p-0 self-center place-self-center">
                                    Memproses login Discord...
                                </h2>
                            )}
                        </div>
                    </div>
                    {!isNone(errorMsg) && (
                        <div className="mt-3">
                            <p className="text-red-400">Error: {errorMsg}</p>
                        </div>
                    )}
                </div>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({ query }: NextServerSideContextWithSession) {
    // Catch the Next.js Router push event with query mask
    // eslint-disable-next-line no-underscore-dangle

    // check discordClientId, if string empty, set to undefined.
    const { code } = query;
    if (isNone(code)) {
        return {
            props: {
                code: "",
                failure: true,
            },
        };
    }
    const selectedCode = typeof code === "string" ? code : code[0];
    if (!selectedCode) {
        return {
            props: {
                code: "",
                failure: true,
            },
        };
    }
    return {
        props: {
            code: selectedCode,
            failure: false,
        },
    };
});
