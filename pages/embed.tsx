import React from "react";
import Head from "next/head";
import { cloneDeep, has as loHas, sortBy } from "lodash";
import { GetServerSidePropsContext } from "next";

import { ValidAccent } from "@/components/ColorMap";
import MetadataHead from "@/components/MetadataHead";
import { IEmbedParams } from "@/components/EmbedPage/Interface";
import EmbedPageCard from "@/components/EmbedPage/Card";

import { LocaleMap } from "../i18n";
import prisma from "@/lib/prisma";
import { isNone, mapBoolean, Nullable } from "@/lib/utils";
import { Project } from "@prisma/client";

interface EmbedUtangProps extends IEmbedParams {
    name?: string;
    projectList: Project[];
    serverInfo: { [srvId: string]: string | null };
}

interface EmbedUtangState {
    dark: string;
    accent?: typeof ValidAccent[number];
    lang?: keyof typeof LocaleMap & string;
}

function selectTime(statusSets: any[]) {
    let selected: Nullable<number> = null;
    statusSets.forEach((sets) => {
        if (typeof sets.airtime === "number") {
            selected = sets.airtime;
        }
    });
    return selected;
}

function filterAnimeData(animeData: Project[]): Project[] {
    const newAnimeSets = [];
    animeData.forEach((res) => {
        const deepCopy = cloneDeep(res);
        if (isNone(deepCopy.start_time)) {
            deepCopy.start_time = selectTime(res.status);
        }
        let allDone = true;
        for (let i = 0; i < deepCopy.status.length; i++) {
            const stElem = deepCopy.status[i];
            if (!stElem.is_done) {
                allDone = false;
                break;
            }
        }
        if (!allDone) {
            newAnimeSets.push(deepCopy);
        }
    });
    return newAnimeSets;
}

class EmbedUtang extends React.Component<EmbedUtangProps, EmbedUtangState> {
    constructor(props: EmbedUtangProps) {
        super(props);
        this.propagateEventChange = this.propagateEventChange.bind(this);
        this.state = {
            dark: this.props.dark,
            accent: this.props.accent || "green",
            lang: this.props.lang || "id",
        };
    }

    componentDidMount() {
        const isDark = mapBoolean(this.state.dark);
        if (isDark) {
            window.document.documentElement.classList.add("dark");
        }
        const message = JSON.stringify({ action: "resize", height: window.document.body.scrollHeight });
        // Broadcast resize action to everyone.
        window.parent.postMessage(message, "*");
        // Watch for incoming message
        window.addEventListener("message", this.propagateEventChange);
    }

    componentDidUpdate() {
        const message = JSON.stringify({ action: "resize", height: window.document.body.scrollHeight });
        // Broadcast resize action to everyone.
        window.parent.postMessage(message, "*");
    }

    propagateEventChange(event: MessageEvent<any>) {
        if (!event.data) {
            return;
        }
        let data: { [key: string]: any };
        try {
            data = JSON.parse(event.data);
        } catch (e) {
            console.error("embed.propagateEventChange: No data received");
            return;
        }
        const root = window.document.documentElement;
        if (data.action === "setDark") {
            const isDark = mapBoolean(data.target);
            if (isDark) {
                if (!root.classList.contains("dark")) {
                    root.classList.add("dark");
                }
            } else {
                if (root.classList.contains("dark")) {
                    root.classList.remove("dark");
                }
            }
        } else if (data.action === "setAccent") {
            this.setState({ accent: data.target });
        } else if (data.action === "setLanguage") {
            this.setState({ lang: data.target });
        }
    }

    render() {
        const { id, name, projectList, serverInfo } = this.props;
        const { dark, lang, accent } = this.state;
        const realName = name || id;

        const prefixName = name ? "nama" : "ID";

        const encodedName = encodeURIComponent(realName);

        const animeData = filterAnimeData(projectList);
        if (animeData.length < 1) {
            return (
                <>
                    <Head>
                        <MetadataHead.Base />
                        <MetadataHead.Prefetch />
                        <title>{`Utang - ${realName} :: naoTimesUI`}</title>
                        <MetadataHead.SEO
                            title={`Utang - ${realName}`}
                            description={`Sebuah daftar utang untuk Fansub dengan ${prefixName} ${realName}, tidak ada utang!`}
                            image={`https://naotimes-og.glitch.me/large?name=${encodedName}&utang=0`}
                            urlPath={`/embed?id=${id}&lang=${lang}&accent=${accent}&dark=${dark}`}
                        />
                    </Head>
                    <div id="root">
                        <div className="text-center text-2xl font-light mt-4">Tidak ada utang garapan!</div>
                    </div>
                </>
            );
        }

        const projectData = sortBy(animeData, (o) => o.start_time).reverse();

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>{`Utang - ${realName} :: naoTimesUI`}</title>
                    <MetadataHead.SEO
                        title={`Utang - ${realName}`}
                        description={`Sebuah daftar utang untuk Fansub dengan ${prefixName} ${realName}, terdapat ${projectData.length} utang!`}
                        image={`https://naotimes-og.glitch.me/large?name=${encodedName}&utang=${projectData.length}`}
                        urlPath={`/embed?id=${id}&lang=${lang}&accent=${accent}&dark=${dark}`}
                    />
                </Head>
                <div id="root">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 px-1 pb-2 sm:px-2 sm:py-2 bg-transparent relative">
                        {projectData.map((res) => {
                            const selectInfo = {};
                            res.kolaborasi.forEach((elem) => {
                                const srvName = serverInfo[elem];
                                selectInfo[elem] = srvName || null;
                            });
                            return (
                                <EmbedPageCard
                                    key={"utang-ani-" + res.id}
                                    animeData={res}
                                    lang={lang}
                                    dark={dark}
                                    accent={accent}
                                    serverInfo={selectInfo}
                                />
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const defaultParams: IEmbedParams = {
        lang: "id",
        accent: "green",
        dark: "false",
    };
    const { query } = context;
    const newParamsSets: IEmbedParams = Object.assign({}, defaultParams, query);
    if (!loHas(newParamsSets, "id")) {
        return {
            notFound: true,
        };
    }
    if (!newParamsSets.id) {
        return {
            notFound: true,
        };
    }

    const serverRes = await prisma.showtimesdatas.findFirst({
        where: { id: newParamsSets.id },
        select: {
            name: true,
            anime: {
                select: {
                    id: true,
                    title: true,
                    poster_data: {
                        select: {
                            url: true,
                        },
                    },
                    start_time: true,
                    last_update: true,
                    status: true,
                    kolaborasi: true,
                },
            },
        },
    });

    const serverCollabName = {};
    const fetchServerName = [];
    if (serverRes.anime.length > 0) {
        serverRes.anime.forEach((res) => {
            if (res.kolaborasi.length > 0) {
                res.kolaborasi.forEach((collab) => {
                    if (collab !== newParamsSets.id && !fetchServerName.includes(collab)) {
                        fetchServerName.push(collab);
                    }
                });
            }
        });
    }

    console.info("Fetching collaboration server name:", fetchServerName);
    const serverCollabInfo = await prisma.showtimesdatas.findMany({
        where: { id: { in: fetchServerName } },
        select: { id: true, name: true },
    });
    serverCollabInfo.forEach((res) => {
        serverCollabName[res.id] = res.name;
    });

    return {
        props: {
            projectList: serverRes.anime,
            name: serverRes.name || null,
            serverInfo: serverCollabName,
            ...newParamsSets,
        },
    };
}

export default EmbedUtang;
