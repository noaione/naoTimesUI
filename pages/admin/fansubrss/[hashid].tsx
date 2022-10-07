import React from "react";
import Head from "next/head";
import Router from "next/router";

import axios from "axios";
import SelectAsync from "react-select/async";
import { ActionMeta } from "react-select";
import { Dictionary } from "lodash";
import { motion } from "framer-motion";

import AdminLayout from "@/components/AdminLayout";
import MetadataHead from "@/components/MetadataHead";
import ErrorModal from "@/components/ErrorModal";
import LoadingCircle from "@/components/LoadingCircle";
import TemplateEngine from "@/components/FansubRSS/TemplateEditor";
import FansubRSSDeleteButton from "@/components/FansubRSS/DeleteButton";
import SampleViewer from "@/components/FansubRSS/SampleViewer";
import SkeletonLoader from "@/components/Skeleton";
import { CallbackModal } from "@/components/Modal";

import { FansubRSSFeeds, FansubRSSSchemas } from "@/lib/fsrss";
import { IUserAuth, withSessionSsr } from "@/lib/session";
import { emitSocketAndWait } from "@/lib/socket";
import { isNone, Nullable, parseFeed } from "@/lib/utils";

interface FansubRSSPageState {
    isLoading: boolean;
    errorText: string;
    sampleData?: Dictionary<any>[];
    feedChannel: string;
    isSubmit: boolean;
}

interface FansubRSSPageProps {
    user?: IUserAuth & { loggedIn: boolean };
    feed: FansubRSSFeeds;
}

interface ChannelSelect {
    id: string;
    name: string;
}

function matchFilterProper(data: ChannelSelect, inputValue: string) {
    const matchRe = new RegExp(`(${inputValue})`, "i");
    const dataID = data.id;
    const dataName = data.name;
    return Boolean(dataID.match(matchRe)) || Boolean(dataName.match(matchRe));
}

const loadChannel = (inputValue: string, callback: Function) => {
    axios
        .get<{ results: ChannelSelect[] }>("/api/fsrss/channelfind", { responseType: "json" })
        .then((res) => {
            const results = res.data;
            const properResults = results.results.filter((e) => matchFilterProper(e, inputValue));
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

class FansubRSSPage extends React.Component<FansubRSSPageProps, FansubRSSPageState> {
    modalCb: CallbackModal;
    constructor(props: FansubRSSPageProps) {
        super(props);
        this.showErrorCallback = this.showErrorCallback.bind(this);
        this.changeKanal = this.changeKanal.bind(this);
        this.onChannelSelection = this.onChannelSelection.bind(this);
        this.state = {
            errorText: "",
            isLoading: true,
            feedChannel: this.props.feed.channel,
            isSubmit: false,
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
                feedChannel: "",
            });
        }
    }

    showErrorCallback(errorText: string) {
        this.setState({ errorText });
        if (this.modalCb) {
            this.modalCb.showModal();
        }
    }

    async changeKanal() {
        if (this.state.isSubmit) {
            return;
        }
        if (this.state.feedChannel.trim().length < 1) {
            this.showErrorCallback("Mohon pilih #kanal terlebih dahulu!");
            return;
        }
        this.setState({ isSubmit: true });

        const bodyBag = {
            id: this.props.feed.id,
            changes: {
                channel: this.state.feedChannel,
            },
        };
        const apiRes = await fetch("/api/fsrss/update", {
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyBag),
            method: "POST",
        });

        const jsonRes = await apiRes.json();
        if (jsonRes.success) {
            Router.reload();
        } else {
            this.showErrorCallback(jsonRes.message);
            this.setState({ isSubmit: false });
        }
    }

    async componentDidMount() {
        const [isSuccess, sampleData] = await parseFeed(this.props.feed.feedUrl);
        if (!isSuccess) {
            this.showErrorCallback("Maaf, terjadi kesalahan ketika memproses sample mohon coba sesaat lagi");
        } else {
            this.setState({ sampleData: sampleData.results[0], isLoading: false });
        }
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
                </Head>
                <AdminLayout user={user} title="Edit RSS" active="fsrsspage">
                    <div className="container mx-auto px-6 py-8 justify-center">
                        <div className="grid gap-2 grid-cols-1">
                            <div className="flex flex-col p-5 bg-white dark:bg-gray-700 rounded shadow-md">
                                <div className="flex flex-col gap-2 lg:gap-0 lg:flex-row lg:justify-between lg:items-center">
                                    <div className="flex">
                                        <motion.p
                                            className="text-lg font-semibold dark:text-white break-all"
                                            initial={{ x: -35, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            Feed ID: {feed.id}
                                        </motion.p>
                                    </div>
                                    <FansubRSSDeleteButton
                                        id={feed.id}
                                        onErrorModal={this.showErrorCallback}
                                    />
                                </div>
                                <motion.div
                                    className="flex flex-col mt-2"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <label className="font-semibold dark:text-white text-sm">RSS URI</label>
                                    <input
                                        className="form-darkable w-full lg:w-1/2 mt-1"
                                        onFocus={(ev) => ev.target.select()}
                                        value={feed.feedUrl}
                                        readOnly
                                    />
                                </motion.div>
                                <motion.div
                                    className="flex flex-col mt-2"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <label className="font-semibold dark:text-white text-sm">#kanal</label>
                                    <label className="font-semibold dark:text-white text-sm">
                                        ID: {this.state.feedChannel}
                                    </label>
                                    <SelectAsync
                                        className="w-full lg:w-1/2 mt-1 rounded-lg"
                                        cacheOptions
                                        loadOptions={loadChannel}
                                        defaultOptions
                                        defaultValue={this.props.feed.channel}
                                        getOptionLabel={optionValueChannel}
                                        filterOption={() => true}
                                        onChange={this.onChannelSelection}
                                        placeholder="Ubah #kanal..."
                                        inputId="discord-channel-selector-input"
                                        classNamePrefix="rselect"
                                        isClearable
                                    />
                                    <motion.button
                                        className={`flex flex-row w-full lg:w-1/2 mt-2 px-3 py-2 rounded-lg ${
                                            this.state.isSubmit
                                                ? "bg-blue-400 cursor-not-allowed opacity-60"
                                                : "bg-blue-500 hover:bg-blue-600 opacity-100"
                                        } transition duration-200 text-white justify-center items-center`}
                                        onClick={this.changeKanal}
                                        initial={{ y: 35, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        {this.state.isSubmit && <LoadingCircle className="mt-0 ml-0 mr-2" />}
                                        <span className="font-semibold">Ubah</span>
                                    </motion.button>
                                </motion.div>
                                {this.state.isLoading ? (
                                    <SkeletonLoader.RSSSample />
                                ) : (
                                    <SampleViewer sample={this.state.sampleData} />
                                )}
                            </div>
                        </div>
                        <div className="grid gap-2 grid-cols-1 mt-4">
                            <div className="flex flex-col p-5 bg-white dark:bg-gray-700 rounded shadow-md">
                                {this.state.isLoading ? (
                                    <SkeletonLoader.RSSEditor />
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

export const getServerSideProps = withSessionSsr(async function ({ req, params }) {
    const { hashid } = params;
    let user = req.session.user;

    if (!user) {
        return {
            redirect: {
                destination: "/?cb=/admin/fansubrss",
                permanent: false,
            },
        };
    }

    if (user.authType === "discord") {
        // override with server info
        user = req.session.userServer;
        if (!user) {
            return {
                redirect: {
                    destination: "/discord",
                    permanent: false,
                },
            };
        }
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

export default FansubRSSPage;
