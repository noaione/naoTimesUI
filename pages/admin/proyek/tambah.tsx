import axios from "axios";
import _ from "lodash";
import Head from "next/head";
import Router from "next/router";
import React from "react";

import AsyncSelect from "react-select/async";
import { ActionMeta } from "react-select";
import PlusIcon from "mdi-react/PlusIcon";

import AdminLayout from "../../../components/AdminLayout";
import MetadataHead from "../../../components/MetadataHead";
import LoadingCircle from "../../../components/LoadingCircle";
import { CallbackModal } from "../../../components/Modal";
import ErrorModal from "../../../components/ErrorModal";

import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../../lib/session";

import { UserProps } from "../../../models/user";

interface ProjectNewState {
    errTxt: string;
    aniId?: string;
    title?: string;
    episode?: number;
    poster?: string;
    staffTL?: string;
    staffTLC?: string;
    staffENC?: string;
    staffED?: string;
    staffTM?: string;
    staffTS?: string;
    staffQC?: string;
    animeSelected: boolean;
    shouldShowEpisode: boolean;
    isSubmitting: boolean;
}

interface ProjectNewProps {
    user: UserProps & { loggedIn: boolean };
}

function matchFilterProper(data: any, inputValue: string) {
    const matchRe = new RegExp(`(${inputValue})`, "i");
    let titleUncased = (data.titlematch as string) ?? "";
    let titleUncasedEN = (data.titlematchen as string) ?? "";
    let titleUncasedOther = (data.titlematchother as string) ?? "";
    titleUncased = titleUncased.toLowerCase();
    titleUncasedEN = titleUncasedEN.toLowerCase();
    titleUncasedOther = titleUncasedOther.toLowerCase();
    return titleUncased.match(matchRe) || titleUncasedEN.match(matchRe) || titleUncasedOther.match(matchRe);
}

const searchAnime = (inputValue: string, callback: Function) => {
    axios
        .get("/api/anilist/find", { params: { q: inputValue }, responseType: "json" })
        .then((res) => {
            const results = res.data;
            const parsedFiltered = results.results.filter((data) =>
                matchFilterProper(data, inputValue)
            ) as any[];
            console.info(
                `Found ${results.results.length} matches originally, filtered to ${parsedFiltered.length} matches`
            );
            callback(parsedFiltered);
        })
        .catch((err) => {
            console.error(err);
            callback([]);
        });
};

function optionValueAnime(data: any) {
    const { id, title } = data;
    const formatType = data.format;
    const startDate = data.startDate || {};
    const rlsYear = startDate.year || "Unknown Year";
    const selTitle = title.romaji || title.english || title.native;
    return `${selTitle} (${rlsYear}) [${formatType}] [${id}]`;
}

class ProjectAdditionComponents extends React.Component<ProjectNewProps, ProjectNewState> {
    modalCb?: CallbackModal;

    constructor(props: ProjectNewProps) {
        super(props);
        this.submitNewProject = this.submitNewProject.bind(this);
        this.onAnimeSelection = this.onAnimeSelection.bind(this);
        this.triggerModal = this.triggerModal.bind(this);
        this.state = {
            errTxt: "",
            poster: null,
            episode: 0,
            animeSelected: false,
            shouldShowEpisode: false,
            isSubmitting: false,
        };
    }

    async submitNewProject(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (this.state.isSubmitting) {
            return;
        }
        this.setState({ isSubmitting: true });
        const validRoles = [];
        for (const [stateKey, stateValue] of Object.entries(this.state)) {
            if (stateKey.startsWith("staff")) {
                validRoles.push({
                    role: stateKey.slice(5),
                    id: stateValue,
                });
            }
        }
        if (!this.state.aniId && !this.state.title) {
            this.setState({ errTxt: "Mohon pilih Anime terlebih dahulu" });
            this.triggerModal();
            return;
        }
        if (this.state.episode < 1) {
            this.setState({ errTxt: "Mohon masukan jumlah episode!" });
            this.triggerModal();
            return;
        }
        const sendThisJSON = {
            server: this.props.user.id,
            anime: {
                id: this.state.aniId,
                name: this.state.title,
                episode: this.state.episode,
            },
            roles: validRoles,
        };
        const res = await fetch("/api/showtimes/proyek/tambah", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(sendThisJSON),
        });
        const callbackAns = await res.json();
        if (callbackAns.success) {
            Router.push(`/admin/proyek/${this.state.aniId}`);
        } else {
            this.setState({ errTxt: callbackAns.message, isSubmitting: false });
            this.triggerModal();
            return;
        }
    }

    onAnimeSelection(data: any, action: ActionMeta<any>) {
        if (!["select-option", "clear"].includes(action.action)) {
            return;
        }
        if (action.action === "select-option") {
            const { id } = data;
            const totalEpisode = data.episodes || 0;
            const coverData = data.coverImage || {};
            const posterUrl = coverData.extralarge || coverData.large || coverData.medium || null;
            const title = data.title || {};
            const selTitle = title.romaji || title.english || title.native;
            this.setState({
                aniId: _.toString(id),
                episode: totalEpisode,
                poster: posterUrl,
                shouldShowEpisode: totalEpisode < 1,
                animeSelected: true,
                title: selTitle,
            });
        } else if (action.action === "clear") {
            this.setState({
                aniId: null,
                episode: 0,
                poster: null,
                shouldShowEpisode: false,
                animeSelected: false,
                title: null,
            });
        }
    }

    triggerModal() {
        if (this.modalCb) {
            this.modalCb.showModal();
        }
    }

    render() {
        const { poster, shouldShowEpisode } = this.state;
        const { user } = this.props;

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Tambah Proyek :: naoTimesUI</title>
                    <MetadataHead.SEO title="Tambah Proyek" urlPath="/admin/proyek/tambah" />
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user} title="Tambah Proyek" active="projectpage">
                    <div className="container mx-auto px-6 pt-8 pb-4">
                        <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
                            <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm">
                                <div className="flex flex-col lg:flex-row py-1">
                                    <div className="icon h-5/6 p-1 lg:mr-3">
                                        {poster ? (
                                            <img
                                                className="transition duration-300 ease-out transform hover:-translate-y-1"
                                                src={poster}
                                            />
                                        ) : (
                                            <div className="px-32 py-56 self-center lg:py-44 animate-pulse bg-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex flex-col pb-2">
                                        <form onSubmit={this.submitNewProject}>
                                            <div>
                                                <label className="text-xs font-semibold dark:text-white mb-1">
                                                    Anime
                                                </label>
                                                <AsyncSelect
                                                    id="anime-selector-reactive"
                                                    className="w-full rounded-lg"
                                                    cacheOptions
                                                    defaultOptions={false}
                                                    loadOptions={searchAnime}
                                                    onChange={this.onAnimeSelection}
                                                    getOptionLabel={optionValueAnime}
                                                    filterOption={() => true}
                                                    placeholder="Cari Anime..."
                                                    classNamePrefix="rselect"
                                                    isClearable
                                                />
                                            </div>
                                            <div className={`-mx-3 ${shouldShowEpisode ? "" : "hidden"}`}>
                                                <div className="w-full px-3 mb-1">
                                                    <label className="text-sm font-semibold dark:text-white mb-1">
                                                        Total Episode
                                                    </label>
                                                    <input
                                                        type="number"
                                                        placeholder="00"
                                                        value={this.state.episode}
                                                        onChange={(val) =>
                                                            this.setState({
                                                                episode: parseInt(val.target.value),
                                                            })
                                                        }
                                                        className="form-darkable w-full py-1"
                                                    />
                                                </div>
                                            </div>
                                            <div className="text-xs tracking-wide font-semibold text-red-400 mt-1">
                                                Role akan dibuat otomatis, cukup periksa Server anda untuk
                                                Role baru
                                            </div>
                                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-200 mt-2">
                                                Staf
                                            </div>
                                            <div className="text-xs tracking-wide font-semibold text-red-400">
                                                Mohon masukan ID Discord user, bisa dikosongkan
                                            </div>
                                            <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-2">
                                                <div className="flex -mx-3">
                                                    <div className="w-full px-3 mb-1">
                                                        <label
                                                            htmlFor="tlor-id"
                                                            className="text-sm font-semibold dark:text-white mb-1"
                                                        >
                                                            Penerjemah
                                                        </label>
                                                        <input
                                                            id="tlor-id"
                                                            value={this.state.staffTL}
                                                            onChange={(ev) =>
                                                                this.setState({ staffTL: ev.target.value })
                                                            }
                                                            type="text"
                                                            name="tlor-id"
                                                            data-role="TL"
                                                            className="form-darkable w-full py-1"
                                                            placeholder="xxxxxxxxxxxxxxxxxx"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex -mx-3">
                                                    <div className="w-full px-3 mb-1">
                                                        <label
                                                            htmlFor="tlcer-id"
                                                            className="text-sm font-semibold dark:text-white mb-1"
                                                        >
                                                            Pemeriksa Terjemahan
                                                        </label>
                                                        <input
                                                            id="tlcer-id"
                                                            value={this.state.staffTLC}
                                                            onChange={(ev) =>
                                                                this.setState({ staffTLC: ev.target.value })
                                                            }
                                                            type="text"
                                                            name="tlcer-id"
                                                            data-role="TLC"
                                                            className="form-darkable w-full py-1"
                                                            placeholder="xxxxxxxxxxxxxxxxxx"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex -mx-3">
                                                    <div className="w-full px-3 mb-1">
                                                        <label
                                                            htmlFor="enc-id"
                                                            className="text-sm font-semibold dark:text-white mb-1"
                                                        >
                                                            Peramu Video
                                                        </label>
                                                        <input
                                                            id="enc-id"
                                                            value={this.state.staffENC}
                                                            onChange={(ev) =>
                                                                this.setState({ staffENC: ev.target.value })
                                                            }
                                                            type="text"
                                                            name="enc-id"
                                                            data-role="ENC"
                                                            className="form-darkable w-full py-1"
                                                            placeholder="xxxxxxxxxxxxxxxxxx"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex -mx-3">
                                                    <div className="w-full px-3 mb-1">
                                                        <label
                                                            htmlFor="editor-id"
                                                            className="text-sm font-semibold dark:text-white mb-1"
                                                        >
                                                            Penyunting
                                                        </label>
                                                        <input
                                                            id="editor-id"
                                                            value={this.state.staffED}
                                                            onChange={(ev) =>
                                                                this.setState({ staffED: ev.target.value })
                                                            }
                                                            type="text"
                                                            name="editor-id"
                                                            data-role="ED"
                                                            className="form-darkable w-full py-1"
                                                            placeholder="xxxxxxxxxxxxxxxxxx"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex -mx-3">
                                                    <div className="w-full px-3 mb-1">
                                                        <label
                                                            htmlFor="tser-id"
                                                            className="text-sm font-semibold dark:text-white mb-1"
                                                        >
                                                            Penata Rias
                                                        </label>
                                                        <input
                                                            id="tser-id"
                                                            value={this.state.staffTS}
                                                            onChange={(ev) =>
                                                                this.setState({ staffTS: ev.target.value })
                                                            }
                                                            type="text"
                                                            name="tser-id"
                                                            data-role="TS"
                                                            className="form-darkable w-full py-1"
                                                            placeholder="xxxxxxxxxxxxxxxxxx"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex -mx-3">
                                                    <div className="w-full px-3 mb-1">
                                                        <label
                                                            htmlFor="timer-id"
                                                            className="text-sm font-semibold dark:text-white mb-1"
                                                        >
                                                            Penyesuai Waktu
                                                        </label>
                                                        <input
                                                            id="timer-id"
                                                            value={this.state.staffTM}
                                                            onChange={(ev) =>
                                                                this.setState({ staffTM: ev.target.value })
                                                            }
                                                            type="text"
                                                            name="timer-id"
                                                            data-role="TM"
                                                            className="form-darkable w-full py-1"
                                                            placeholder="xxxxxxxxxxxxxxxxxx"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex -mx-3">
                                                    <div className="w-full px-3 mb-1">
                                                        <label
                                                            htmlFor="qcer-id"
                                                            className="text-sm font-semibold dark:text-white mb-1"
                                                        >
                                                            Pemeriksa Akhir
                                                        </label>
                                                        <input
                                                            id="qcer-id"
                                                            value={this.state.staffQC}
                                                            onChange={(ev) =>
                                                                this.setState({ staffQC: ev.target.value })
                                                            }
                                                            type="text"
                                                            name="qcer-id"
                                                            data-role="QC"
                                                            className="form-darkable w-full py-1"
                                                            placeholder="xxxxxxxxxxxxxxxxxx"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex mt-2">
                                                <button
                                                    type="submit"
                                                    className={`rounded px-3 py-2 text-white transition ${
                                                        this.state.isSubmitting
                                                            ? "bg-green-500 cursor-not-allowed"
                                                            : "bg-green-600 hover:bg-green-700"
                                                    } duration-200 ease-in-out items-center flex flex-row focus:outline-none`}
                                                >
                                                    {this.state.isSubmitting ? (
                                                        <>
                                                            <LoadingCircle className="mt-0 ml-0" />
                                                            <span className="font-semibold mt-0.5 -ml-1">
                                                                Tambah
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PlusIcon className="font-bold" />
                                                            <span className="font-semibold mt-0.5">
                                                                Tambah
                                                            </span>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ErrorModal onMounted={(callback) => (this.modalCb = callback)}>
                        {this.state.errTxt}
                    </ErrorModal>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({ req }: NextServerSideContextWithSession) {
    const user = req.session.get<IUserAuth>("user");

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

    return { props: { user: { loggedIn: true, ...user } } };
});

export default ProjectAdditionComponents;
