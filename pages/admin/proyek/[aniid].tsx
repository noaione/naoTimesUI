import { cloneDeep, difference, toString } from "lodash";
import React from "react";
import Head from "next/head";

import CheckAllIcon from "mdi-react/CheckAllIcon";
import PencilIcon from "mdi-react/PencilIcon";

import AdminLayout from "../../../components/AdminLayout";
import MetadataHead from "../../../components/MetadataHead";
import RolePopup from "../../../components/RolePopup";
import { RoleColorPalette } from "../../../components/ColorMap";

import dbConnect from "../../../lib/dbConnect";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../../lib/session";
import {
    expandRoleLocalized,
    expandRoleName,
    getAssigneeName,
    isNone,
    Nullable,
    StaffRoles,
} from "../../../lib/utils";

import { UserProps } from "../../../models/user";
import { ShowAnimeProps, ShowtimesModel, ShowtimesProps } from "../../../models/show";

interface ProyekPageProps {
    user?: UserProps & { loggedIn: boolean };
    animeData: ShowAnimeProps;
}

interface StaffProps {
    id: StaffRoles;
    animeId: string;
    userId: string;
    name?: string;
}

interface StaffState {
    isEdit: boolean;
    userId: string | number;
    name?: string;
    oldId: string | number;
}

class StaffList extends React.Component<StaffProps, StaffState> {
    constructor(props: StaffProps) {
        super(props);
        this.submitEditing = this.submitEditing.bind(this);
        this.state = {
            isEdit: false,
            userId: this.props.userId,
            name: this.props.name,
            oldId: this.props.userId,
        };
    }

    async submitEditing() {
        if (this.state.oldId === this.state.userId) {
            // Ignore if same, save some API calls.
            this.setState({ isEdit: false });
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;
        setTimeout(() => {
            outerThis.setState({ isEdit: false, oldId: this.state.userId });
        }, 2000);

        // const sendData = {
        //     role: this.props.id,
        //     animeId: this.props.animeId,
        //     userId: toString(this.props.userId),
        // };

        // const apiRes = await fetch("/api/showtimes/proyek/staff", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(sendData),
        // });

        // const jsonRes = await apiRes.json();
        // if (jsonRes.success) {
        //     this.setState({ userId: jsonRes.id, name: jsonRes.name, isEdit: false, oldId: jsonRes.id });
        // } else {
        //     this.setState({ isEdit: true });
        // }
    }

    render() {
        const { id } = this.props;
        const { userId, name, isEdit } = this.state;
        const roleColors = RoleColorPalette[id];
        const realName = typeof name === "string" ? name : "Tidak Diketahui";

        const assigneeName = getAssigneeName({ name: realName, id: toString(userId) });

        if (!isEdit) {
            return (
                <>
                    <div className="text-base text-gray-900 items-center flex flex-row">
                        <PencilIcon
                            className="text-gray-800 dark:text-gray-200 mr-1 hover:opacity-70 transition-opacity duration-200 ease-out"
                            onClick={() => this.setState({ isEdit: true })}
                        />
                        <span className={"px-2 rounded font-semibold " + roleColors}>
                            {expandRoleLocalized(id) + ": " + assigneeName}
                        </span>
                    </div>
                </>
            );
        }
        return (
            <>
                <div className="text-base text-gray-900 items-center flex flex-row">
                    <button
                        onClick={this.submitEditing}
                        className="px-2 py-1 mr-2 bg-green-400 transition-colors hover:bg-green-500 duration-200"
                    >
                        <CheckAllIcon className="text-gray-800" />
                    </button>
                    <input
                        className="form-input bg-gray-200 dark:bg-gray-500 w-full py-1 border-2 border-gray-200 dark:placeholder-gray-200 dark:border-gray-500 dark:text-gray-200 focus:border-yellow-500 dark:focus:border-yellow-500 transition duration-200"
                        type="number"
                        placeholder="xxxxxxxxxxxxxx"
                        value={this.state.userId}
                        onChange={(ev) => this.setState({ userId: ev.target.value })}
                    />
                </div>
            </>
        );
    }
}

function FinishedPopper() {
    return <span className="text-green-500">✔</span>;
}

function UnfinishedPopper() {
    return <span>❌</span>;
}

interface EpisodeStatuses {
    TL: boolean;
    TLC: boolean;
    ENC: boolean;
    ED: boolean;
    TM: boolean;
    TS: boolean;
    QC: boolean;
}

interface EpisodeBoxProps {
    episode: number;
    airTime?: number;
    status: EpisodeStatuses;
    isReleased: boolean;
}

interface EpisodeBoxHeaderProps extends Omit<EpisodeBoxProps, "status"> {
    isEdit: boolean;
    onClick(): void;
}

interface EpisodeBoxState {
    status: EpisodeStatuses;
    oldStatus: EpisodeStatuses;
    isEdit: boolean;
}

function EpisodeBoxHeader(props: EpisodeBoxHeaderProps) {
    const { episode, isReleased, airTime, isEdit } = props;
    let airTimeProper = "Tidak diketahui";
    if (typeof airTime === "number") {
        airTimeProper = new Date(airTime * 1000).toString();
    }
    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center font-bold text-black dark:text-gray-200">
                    Episode {episode.toString()}
                </div>
                <div className="flex items-center">
                    <button
                        onClick={props.onClick}
                        className={`focus:outline-none text-white text-sm py-1 px-3 rounded-md ${
                            isEdit ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"
                        } hover:shadow-lg`}
                    >
                        {isEdit ? "Beres" : "Edit"}
                    </button>
                </div>
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-300">
                📺 Rilis: {isReleased ? <FinishedPopper /> : <UnfinishedPopper />}
            </span>
            <span className="font-semibold text-gray-800 dark:text-gray-300">
                ⌚ Tayang: <span className="font-medium">{airTimeProper}</span>
            </span>
        </>
    );
}

interface IEpisodeBoxChecker {
    id: string;
    check: boolean;
    role: StaffRoles;
    onTicked(roleName: StaffRoles, checked: boolean): void;
}

function EpisodeBoxChecker(props: IEpisodeBoxChecker) {
    const CheckboxPalette = {
        TL: "text-red-600",
        TLC: "text-yellow-600",
        ENC: "text-green-600",
        ED: "text-blue-600",
        TM: "text-indigo-600",
        TS: "text-purple-600",
        QC: "text-pink-600",
    };

    return (
        <>
            <label id={props.id} className="inline-flex items-center mt-2">
                <input
                    type="checkbox"
                    checked={props.check}
                    onChange={(ev) => props.onTicked(props.role, ev.target.checked)}
                    className={"form-checkbox h-4 w-4 " + CheckboxPalette[props.role]}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-200 font-bold">
                    {expandRoleName(props.role)}
                </span>
            </label>
        </>
    );
}

function isStatusDifferent(status: EpisodeStatuses, oldStatus: EpisodeStatuses) {
    const redoneStatus = Object.entries(status).map(([name, stat]) => {
        return `${name}-${stat ? "true" : "false"}`;
    });
    const redoneOldStatus = Object.entries(oldStatus).map(([name, stat]) => {
        return `${name}-${stat ? "true" : "false"}`;
    });
    const diffs = difference(redoneStatus, redoneOldStatus);
    return diffs.length > 0;
}

class EpisodeBox extends React.Component<EpisodeBoxProps, EpisodeBoxState> {
    constructor(props: EpisodeBoxProps) {
        super(props);
        this.onEpisodeChangeSubmit = this.onEpisodeChangeSubmit.bind(this);
        this.toggleStatusCheck = this.toggleStatusCheck.bind(this);
        this.state = {
            status: cloneDeep(this.props.status),
            oldStatus: cloneDeep(this.props.status),
            isEdit: false,
        };
    }

    async onEpisodeChangeSubmit() {
        if (!isStatusDifferent(this.state.status, this.state.oldStatus)) {
            // Ignore if the content is same :)
            this.setState({ isEdit: false });
            return;
        }
        this.setState({ isEdit: false });
    }

    toggleStatusCheck(statusKey: keyof EpisodeStatuses, checked: boolean) {
        const { status } = this.state;
        status[statusKey] = checked;
        this.setState({ status });
    }

    render() {
        const { episode, airTime, isReleased } = this.props;
        const { status, isEdit } = this.state;

        if (!isEdit) {
            const unfinishedRoles = [];
            const finishedRoles = [];
            for (const [roleName, roleDone] of Object.entries(status)) {
                if (roleDone) {
                    finishedRoles.push(roleName);
                } else {
                    unfinishedRoles.push(roleName);
                }
            }

            return (
                <>
                    <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm">
                        <div className="flex flex-col py-1">
                            <EpisodeBoxHeader
                                onClick={() => this.setState({ isEdit: true })}
                                episode={episode}
                                airTime={airTime}
                                isEdit={this.state.isEdit}
                                isReleased={isReleased}
                            />
                            <div className="flex flex-col">
                                {unfinishedRoles.length > 0 && (
                                    <>
                                        <span className="font-semibold mt-2 dark:text-gray-100">
                                            ⏰ Proses
                                        </span>
                                        <div className="flex-row pt-2 text-center flex flex-wrap gap-1">
                                            {unfinishedRoles.map((roleName) => {
                                                const expanded = expandRoleLocalized(roleName);
                                                return (
                                                    <RolePopup
                                                        key={roleName + "-unfinished"}
                                                        title={roleName}
                                                        popupText={expanded}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                                {finishedRoles.length > 0 && (
                                    <>
                                        <span className="font-semibold mt-2 dark:text-gray-100">✔ Beres</span>
                                        <div className="flex-row pt-2 text-center flex flex-wrap gap-1">
                                            {finishedRoles.map((roleName) => {
                                                const expandedPop = expandRoleLocalized(roleName);
                                                const expanded = expandRoleName(roleName);
                                                return (
                                                    <RolePopup
                                                        key={roleName + "-finished"}
                                                        title={roleName}
                                                        popupText={expandedPop}
                                                        overrideTitle={expanded}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;

        return (
            <>
                <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm">
                    <div className="flex flex-col py-1">
                        <EpisodeBoxHeader
                            onClick={this.onEpisodeChangeSubmit}
                            episode={episode}
                            airTime={airTime}
                            isEdit={this.state.isEdit}
                            isReleased={isReleased}
                        />
                    </div>
                    <div className="flex flex-col">
                        {Object.keys(status).map((roleName) => {
                            return (
                                <EpisodeBoxChecker
                                    id={`role-tickbox-${roleName}`}
                                    key={`role-tickbox-${roleName}`}
                                    role={roleName as StaffRoles}
                                    onTicked={outerThis.toggleStatusCheck}
                                    check={outerThis.state.status[roleName]}
                                />
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}

class ProyekHomepage extends React.Component<ProyekPageProps, {}> {
    constructor(props: ProyekPageProps) {
        super(props);
    }

    render() {
        const { user, animeData } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";
        const { id, title, poster_data, assignments, status } = animeData;

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>
                        {title} - {pageTitle} :: naoTimesUI
                    </title>
                    <MetadataHead.SEO
                        title={title + " - " + pageTitle}
                        urlPath={"/admin/proyek/" + animeData.id}
                    />
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user} title={title} active="projectpage">
                    <div className="container mx-auto px-6 py-8">
                        <div id="project-data" className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
                            <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-md">
                                <div className="flex flex-col md:flex-row py-1">
                                    <div className="icon h-5/6 p-1 mx-auto md:mr-3 md:ml-0">
                                        <img
                                            className="transition duration-300 ease-out transform hover:-translate-y-1"
                                            src={poster_data.url}
                                        />
                                    </div>
                                    <div className="flex flex-col pb-2 md:w-1/2">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                                            {title}
                                        </div>
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-200 mt-1">
                                            Staf
                                        </div>
                                        <div className="flex flex-col gap-2 mt-2">
                                            {Object.keys(assignments).map((rrr) => {
                                                const name = assignments[rrr].name || null;
                                                const userId = assignments[rrr].id as string;

                                                return (
                                                    <StaffList
                                                        key={rrr + "-staff-" + userId}
                                                        id={rrr as StaffRoles}
                                                        name={name}
                                                        userId={userId}
                                                        animeId={id}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container mx-auto px-6 py-4">
                        <h2 className="font-extrabold pb-3 dark:text-white">Episode</h2>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {status.map((res) => {
                                return (
                                    <EpisodeBox
                                        key={`anime-${id}-episode-${res.episode}`}
                                        episode={res.episode}
                                        airTime={res.airtime}
                                        status={res.progress}
                                        isReleased={res.is_done}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({
    req,
    params,
}: NextServerSideContextWithSession) {
    const user = req.session.get<IUserAuth>("user") as UserProps;
    const { aniid } = params;

    if (!user) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    await dbConnect();
    const serverRes = (await ShowtimesModel.findOne({ id: { $eq: user.id } }).lean()) as ShowtimesProps;
    let findAnime: Nullable<ShowAnimeProps>;
    serverRes.anime.forEach((res) => {
        if (res.id === aniid && isNone(findAnime)) {
            findAnime = res;
        }
    });
    if (isNone(findAnime)) {
        return {
            notFound: true,
        };
    }

    return { props: { user: { loggedIn: true, ...user }, animeData: findAnime } };
});

export default ProyekHomepage;
