import React from "react";
import Head from "next/head";
import { GetServerSidePropsContext } from "next";

import _ from "lodash";

import { ShowAnimeProps, ShowtimesModel, ShowtimesProps } from "../models/show";
import { isNone, mapBoolean, Nullable } from "../lib/utils";
import { IEmbedParams } from "../components/EmbedPage/Interface";
import EmbedPageCard from "../components/EmbedPage/Card";

interface EmbedUtangProps extends IEmbedParams {
    data: ShowtimesProps;
}

interface EmbedUtangState {
    dropdownOpen: boolean;
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

function filterAnimeData(animeData: ShowAnimeProps[]): ShowAnimeProps[] {
    const newAnimeSets = [];
    animeData.forEach((res) => {
        const deepCopy = _.cloneDeep(res);
        if (isNone(deepCopy.start_time)) {
            deepCopy.start_time = selectTime(res.status);
        }
        newAnimeSets.push(deepCopy);
    });
    return newAnimeSets;
}

class EmbedUtang extends React.Component<EmbedUtangProps, EmbedUtangState> {
    constructor(props: EmbedUtangProps) {
        super(props);
        this.state = {
            dropdownOpen: false,
        };
    }

    componentDidMount() {
        const { dark } = this.props;
        const isDark = mapBoolean(dark);
        if (isDark) {
            window.document.documentElement.classList.add("dark");
        }
        const message = JSON.stringify({ action: "resize", height: window.document.body.scrollHeight });
        // Broadcast resize action to everyone.
        window.parent.postMessage(message, "*");
    }

    componentDidUpdate() {
        const message = JSON.stringify({ action: "resize", height: window.document.body.scrollHeight });
        // Broadcast resize action to everyone.
        window.parent.postMessage(message, "*");
    }

    render() {
        const { id, data, lang, dark, accent } = this.props;

        const animeData = filterAnimeData(data.anime);
        if (animeData.length < 1) {
            return (
                <>
                    <Head>
                        <title>Tagih Utang - {id}</title>
                        <meta name="description" content={"Daftar Utang " + id} />
                    </Head>
                    <div id="root">
                        <div className="text-center text-2xl font-light mt-4">Tidak ada utang garapan!</div>
                    </div>
                </>
            );
        }

        const projectData = _.sortBy(animeData, (o) => o.start_time).reverse();

        return (
            <>
                <Head>
                    <title>Tagih Utang - {id}</title>
                    <meta name="description" content={"Daftar Utang " + id} />
                </Head>
                <div id="root">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 px-1 pb-2 sm:px-2 sm:py-2 bg-transparent relative">
                        {projectData.map((res) => {
                            return (
                                <EmbedPageCard
                                    key={"utang-ani-" + res.id}
                                    animeData={res}
                                    lang={lang}
                                    dark={dark}
                                    accent={accent}
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
    if (!_.has(newParamsSets, "id")) {
        return {
            notFound: true,
        };
    }
    if (!newParamsSets.id) {
        return {
            notFound: true,
        };
    }

    const serverRes = await ShowtimesModel.find({ id: { $eq: newParamsSets.id } });
    if (serverRes.length < 1) {
        return {
            notFound: true,
        };
    }

    const firstOccurences = serverRes[0];

    return {
        props: {
            data: firstOccurences,
            ...newParamsSets,
        },
    };
}

export default EmbedUtang;
