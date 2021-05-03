import React from "react";
import Head from "next/head";

import axios from "axios";
import SelectAsync from "react-select/async";
import { ActionMeta } from "react-select";
import { Dictionary } from "lodash";

import AdminLayout from "../../../components/AdminLayout";
import MetadataHead from "../../../components/MetadataHead";
import ErrorModal from "../../../components/ErrorModal";
import TemplateEngine from "../../../components/FansubRSS/TemplateEditor";
import SampleViewer from "../../../components/FansubRSS/SampleViewer";
import { CallbackModal } from "../../../components/Modal";

import { FansubRSSFeeds, FansubRSSSchemas } from "../../../lib/fsrss";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../../lib/session";
import { emitSocketAndWait } from "../../../lib/socket";
import { isNone, Nullable } from "../../../lib/utils";

import { UserProps } from "../../../models/user";

interface FansubrssIndexState {
    isLoading: boolean;
    errorText: string;
    sampleData?: Dictionary<any>[];
    feedUrl: string;
    feedChannel: string;
}

interface FansubrssIndexProps {
    user?: UserProps & { loggedIn: boolean };
    feed: FansubRSSFeeds;
}

async function parseFeed(url: string) {
    let axiosResp;
    try {
        axiosResp = await axios.get("/api/feedcors", {
            headers: {
                "User-Agent": "naoTimesUI/1.1.0 (+https://github.com/noaione/naoTimesUI)",
            },
            responseType: "json",
            params: {
                url,
            },
        });
    } catch (e) {
        return [false, "Gagal mengambil RSS!"];
    }

    return axiosResp.data;
}

function matchFilterProper(data: any, inputValue: string) {
    const matchRe = new RegExp(`(${inputValue})`, "i");
    const dataID = data.id;
    const dataName = data.name;
    return Boolean(dataID.match(matchRe)) || Boolean(dataName.match(matchRe));
}

const loadChannel = (inputValue: string, callback: Function) => {
    axios
        .get("/api/fsrss/channelfind", { responseType: "json" })
        .then((res) => {
            const results = res.data;
            const properResults = results.results.filter((e: any) => matchFilterProper(e, inputValue));
            callback(properResults);
        })
        .catch((err) => {
            console.error(err);
            callback([]);
        });
};

function optionValueChannel(data: any) {
    const { id, name } = data;
    return `#${name} (${id})`;
}

class FansubrssIndex extends React.Component<FansubrssIndexProps, FansubrssIndexState> {
    modalCb: CallbackModal;
    constructor(props: FansubrssIndexProps) {
        super(props);
        this.showErrorCallback = this.showErrorCallback.bind(this);
        this.onChannelSelection = this.onChannelSelection.bind(this);
        this.state = {
            errorText: "",
            isLoading: true,
            feedUrl: this.props.feed.feedUrl,
            feedChannel: this.props.feed.channel,
        };
    }

    onChannelSelection(data: any, action: ActionMeta<any>) {
        if (!["select-option", "clear"].includes(action.action)) {
            return;
        }
        if (action.action === "select-option") {
            const { id } = data;
            this.setState({
                feedChannel: id,
            });
        } else if (action.action === "clear") {
            this.setState({
                feedChannel: null,
            });
        }
    }

    showErrorCallback(errorText: string) {
        this.setState({ errorText });
        if (this.modalCb) {
            this.modalCb.showModal();
        }
    }

    async componentDidMount() {
        const sampleData = await parseFeed(this.props.feed.feedUrl);
        this.setState({ sampleData: sampleData.results[0], isLoading: false });
    }

    render() {
        const { user, feed } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Info - FansubRSS - {pageTitle} :: naoTimesUI</title>
                    <MetadataHead.SEO title={"Info - FansubRSS - " + pageTitle} urlPath="/admin/fansubrss" />
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user} title="Edit RSS" active="fsrsspage">
                    <div className="container mx-auto px-6 py-8 justify-center">
                        <div className="grid gap-2 grid-cols-1">
                            <div className="flex flex-col p-5 bg-white dark:bg-gray-700 rounded shadow-md">
                                <div className="flex flex-row justify-between items-center">
                                    <div className="flex">
                                        <p className="text-lg font-semibold dark:text-white break-all">
                                            Feed ID: {feed.id}
                                        </p>
                                    </div>
                                    <div className="flex">
                                        <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 duration-200 transition text-gray-100 text-sm rounded">
                                            Ubah
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-col mt-2">
                                    <label className="font-semibold dark:text-white text-sm">RSS URI</label>
                                    <input
                                        className="form-input w-full lg:w-1/2 mt-1 rounded-lg dark:bg-gray-800 dark:text-gray-200"
                                        value={this.state.feedUrl}
                                        onChange={(ev) => this.setState({ feedUrl: ev.target.value })}
                                    />
                                </div>
                                <div className="flex flex-col mt-2">
                                    <label className="font-semibold dark:text-white text-sm">#kanal</label>
                                    <label className="font-semibold dark:text-white text-sm">
                                        ID: {this.state.feedChannel}
                                    </label>
                                    <SelectAsync
                                        className="w-full lg:w-1/2 mt-1 dark:bg-gray-800"
                                        cacheOptions
                                        loadOptions={loadChannel}
                                        defaultOptions
                                        defaultValue={this.props.feed.channel}
                                        getOptionLabel={optionValueChannel}
                                        filterOption={() => true}
                                        onChange={this.onChannelSelection}
                                        placeholder="Ubah #kanal..."
                                        isClearable
                                    />
                                </div>
                                {this.state.isLoading ? (
                                    <span className="font-bold text-lg dark:text-white animate-pulse mt-2">
                                        Memuat sample...
                                    </span>
                                ) : (
                                    <SampleViewer sample={this.state.sampleData} />
                                )}
                            </div>
                        </div>
                        <div className="grid gap-2 grid-cols-1 mt-4">
                            <div className="flex flex-col p-5 bg-white dark:bg-gray-700 rounded shadow-md">
                                {this.state.isLoading ? (
                                    <span className="font-bold text-lg dark:text-white animate-pulse">
                                        Memuat editor...
                                    </span>
                                ) : (
                                    <TemplateEngine
                                        settings={feed}
                                        samples={this.state.sampleData}
                                        onErrorModal={this.showErrorCallback}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    <ErrorModal onMounted={(cb) => (this.modalCb = cb)}>{this.state.errorText}</ErrorModal>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({
    req,
    params,
}: NextServerSideContextWithSession) {
    const user = req.session.get<IUserAuth>("user");
    const { hashid } = params;

    if (!user) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
    if (user.privilege === "owner") {
        return {
            notFound: true,
        };
    }
    if (!hashid) {
        return {
            notFound: true,
        };
    }
    if (hashid.length < 1) {
        return {
            notFound: true,
        };
    }

    const rssSchemas: Nullable<FansubRSSSchemas> = await emitSocketAndWait("fsrss get", {
        id: user.id,
        hash: hashid,
    });
    if (isNone(rssSchemas)) {
        return {
            notFound: true,
        };
    }
    const isPremium = rssSchemas?.premium ?? false;
    const feed = rssSchemas.feeds[0];

    return { props: { user: { loggedIn: true, ...user }, isPremium, feed } };
});

export default FansubrssIndex;
