import React from "react";
import Head from "next/head";
import Router from "next/router";
import { cloneDeep, has as loHas, sortBy } from "lodash";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import MeiliSearch from "meilisearch";

import { ValidAccent } from "@/components/ColorMap";
import MetadataHead from "@/components/MetadataHead";
import { IEmbedParams } from "@/components/EmbedPage/Interface";
import EmbedPageCard from "@/components/EmbedPage/Card";

import { LocaleMap } from "../i18n";
import { isNone, mapBoolean, Nullable } from "@/lib/utils";
import { SearchServer } from "@/lib/meili.data";
import client from "@/lib/graphql/client";
import { EmbedProjectFragment, GetEmbedProjectsDocument } from "@/lib/graphql/projects.generated";
import { GetServerNamesDocument } from "@/lib/graphql/servers.generated";
import { ProjectStatus } from "@/lib/graphql/types.generated";

interface EmbedUtangState {
    dark: string;
    accent?: (typeof ValidAccent)[number];
    lang?: keyof typeof LocaleMap & string;
}

function selectTime(statusSets: ProjectStatus[]) {
    let selected: Nullable<number> = null;
    statusSets.forEach((sets) => {
        if (typeof sets.airingAt === "number") {
            selected = sets.airingAt;
        }
    });
    return selected;
}

function filterAnimeData(projects: EmbedProjectFragment[]): EmbedProjectFragment[] {
    const newAnimeSets: EmbedProjectFragment[] = [];
    for (const project of projects) {
        const deepCopy = cloneDeep(project);
        if (isNone(deepCopy.external.startTime)) {
            deepCopy.external.startTime = selectTime(project.statuses);
        }
        let allDone = true;
        for (const status of deepCopy.statuses) {
            if (!status.isReleased) {
                allDone = false;
                break;
            }
        }
        if (!allDone) {
            newAnimeSets.push(deepCopy);
        }
    }
    return newAnimeSets;
}

function hasParamAndNotDefault(data: EmbedUtangState) {
    return (
        (loHas(data, "accent") && data.accent !== "green") ||
        (loHas(data, "lang") && data.lang !== "id") ||
        (loHas(data, "dark") && data.dark !== "false")
    );
}

class EmbedUtang extends React.Component<EmbedServerSide, EmbedUtangState> {
    constructor(props: EmbedServerSide) {
        super(props);
        this.propagateEventChange = this.propagateEventChange.bind(this);
        this.propagateHashChange = this.propagateHashChange.bind(this);
        this.state = {
            dark: this.props.dark,
            accent: this.props.accent || "green",
            lang: this.props.lang || "id",
        };
    }

    componentDidMount() {
        this.propagateHashChange();
        const isDark = mapBoolean(this.state.dark);
        if (isDark) {
            window.document.documentElement.classList.add("dark");
        }
        const message = JSON.stringify({ action: "resize", height: window.document.body.scrollHeight });
        // Broadcast resize action to everyone.
        window.parent.postMessage(message, "*");
        // Watch for incoming message
        window.addEventListener("message", this.propagateEventChange);
        // Detect for hash url change
        window.addEventListener("hashchange", this.propagateHashChange);

        // Use router replace to move the configuration from URL query to the hash
        if (
            hasParamAndNotDefault({ dark: this.props.dark, accent: this.props.accent, lang: this.props.lang })
        ) {
            Router.replace(
                {
                    pathname: "/embed",
                    query: {
                        id: this.props.id,
                    },
                    hash:
                        "#" +
                        new URLSearchParams({
                            dark: this.state.dark ? "true" : "false",
                            accent: this.state.accent,
                            lang: this.state.lang,
                        }).toString(),
                },
                undefined,
                // shallow mode, so it doesn't rerender the page
                { shallow: true }
            ).catch((_) => {
                return;
            });
        }
    }

    componentDidUpdate() {
        const message = JSON.stringify({ action: "resize", height: window.document.body.scrollHeight });
        // Broadcast resize action to everyone.
        window.parent.postMessage(message, "*");
    }

    componentWillUnmount() {
        window.removeEventListener("message", this.propagateEventChange);
        window.removeEventListener("hashchange", this.propagateHashChange);
    }

    propagateHashChange() {
        // get the hash
        const hash = window.location.hash;
        // strip out the # character
        const hashValue = hash.replace("#", "");
        // parse as query format
        const parsedHash = new URLSearchParams(hashValue);

        const dark = parsedHash.get("dark") || this.state.dark;
        const accent = parsedHash.get("accent") || this.state.accent;
        const lang = parsedHash.get("lang") || this.state.lang;

        // apply changes
        const isDark = mapBoolean(dark);
        if (isDark) {
            window.document.documentElement.classList.add("dark");
        } else {
            window.document.documentElement.classList.remove("dark");
        }

        // only update relevant state
        const updateState: Partial<EmbedUtangState> = {};
        if (dark !== this.state.dark) {
            updateState.dark = dark;
        }
        if (accent !== this.state.accent) {
            updateState.accent = accent as (typeof ValidAccent)[number];
        }
        if (lang !== this.state.lang) {
            updateState.lang = lang as keyof typeof LocaleMap & string;
        }
        if (Object.keys(updateState).length > 0) {
            this.setState(updateState as EmbedUtangState);
        }
    }

    propagateEventChange(event: MessageEvent<any>) {
        if (!event.data) {
            return;
        }
        let data: { [key: string]: any };
        try {
            data = JSON.parse(event.data);
        } catch (e) {
            // console.error("embed.propagateEventChange: No data received");
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
        const { id, server, otherServers, projects } = this.props;
        const { dark, lang, accent } = this.state;
        const realName = server.name || id;

        const prefixName = server.name ? "nama" : "ID";

        const encodedName = encodeURIComponent(realName);

        const animeData = filterAnimeData(projects);
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

        const projectData = sortBy(animeData, (o) => o.external.startTime).reverse();

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
                            res.collaborations?.servers.forEach((elem) => {
                                if (elem === server.id) {
                                    return;
                                }
                                const srvName = otherServers[elem];
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

async function paginatedEmbedQuery(projectIds: string[]): Promise<{
    projects: EmbedProjectFragment[];
    message: string | null;
}> {
    let mergedProjects = [];
    let failureMessage = null;
    let cursor = null;
    while (true) {
        const { data } = await client.query({
            query: GetEmbedProjectsDocument,
            variables: {
                cursor: cursor,
                ids: projectIds,
            },
        });
        if (data.projects.__typename === "Result") {
            failureMessage = data.projects.message;
            break;
        }
        const projects = data.projects.nodes;
        mergedProjects = mergedProjects.concat(projects);
        if (!data.projects.pageInfo.nextCursor) {
            break;
        }
        cursor = data.projects.pageInfo.nextCursor;
    }
    return { projects: mergedProjects, message: failureMessage };
}

async function paginatedEmbedQueryServerName(serverIds: string[]): Promise<{
    servers: { id: string; name: string }[];
    message: string | null;
}> {
    let mergedServers = [];
    let failureMessage = null;
    let cursor = null;
    while (true) {
        const { data } = await client.query({
            query: GetServerNamesDocument,
            variables: {
                cursor: cursor,
                ids: serverIds,
            },
        });
        if (data.servers.__typename === "Result") {
            failureMessage = data.servers.message;
            break;
        }
        const servers = data.servers.nodes;
        mergedServers = mergedServers.concat(servers);
        if (!data.servers.pageInfo.nextCursor) {
            break;
        }
        cursor = data.servers.pageInfo.nextCursor;
    }
    return { servers: mergedServers, message: failureMessage };
}

function isUUIDFormatted(uuid: string): boolean {
    const regexExp =
        /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return regexExp.test(uuid);
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

    const searcher = new MeiliSearch({
        host: process.env.MEILI_API,
        apiKey: process.env.MEILI_KEY,
    });

    const index = searcher.index("servers");

    const queryParams = isUUIDFormatted(newParamsSets.id)
        ? `id = ${newParamsSets.id}`
        : `integrations.id = ${newParamsSets.id} AND integrations.type = DISCORD_GUILD`;

    const results = await index.search("", {
        filter: [queryParams],
    });

    if (!results.hits) {
        return {
            notFound: true,
        };
    }

    const firstHits = results.hits[0] as SearchServer;
    const projects = firstHits.projects;
    console.log(projects);

    const allProjects = await paginatedEmbedQuery(projects);
    if (allProjects.message) {
        console.error(allProjects.message);
        return {
            notFound: true,
        };
    }

    const serverHits = [];
    for (const project of allProjects.projects) {
        if (project.collaborations?.servers) {
            for (const collab of project.collaborations.servers) {
                if (collab === firstHits.id) {
                    continue;
                }
                if (!serverHits.includes(collab)) {
                    serverHits.push(collab);
                }
            }
        }
    }

    const serverNameMapping: { [key: string]: string } = {};
    serverNameMapping[firstHits.id] = firstHits.name;
    if (serverHits.length) {
        const mappedServer = await paginatedEmbedQueryServerName(serverHits);
        if (mappedServer.servers) {
            for (const server of mappedServer.servers) {
                serverNameMapping[server.id] = server.name;
            }
        }
    }

    return {
        props: {
            server: firstHits,
            projects: allProjects.projects,
            otherServers: serverNameMapping,
            ...newParamsSets,
        },
    };
}

type EmbedServerSide = InferGetServerSidePropsType<typeof getServerSideProps>;

export default EmbedUtang;
