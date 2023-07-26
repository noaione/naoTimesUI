import { cloneDeep, difference } from "lodash";
import React from "react";

import LoadingCircle from "../LoadingCircle";
import MotionInView from "../MotionInView";
import RolePopup from "../RolePopup";
import { SettingsProps } from "../SettingsPage/base";

import { expandRoleLocalized, expandRoleName } from "../../lib/utils";
import { ProjectStatusRole } from "@/lib/graphql/types.generated";
import client from "@/lib/graphql/client";
import { MutateProjectEpisodeStatusDocument } from "@/lib/graphql/projects.generated";

function FinishedPopper() {
    return <span className="text-green-500">✔</span>;
}

function UnfinishedPopper() {
    return <span>❌</span>;
}

function processStatus(status: ProjectStatusRole[]) {
    const statusList = [];
    for (const role of status) {
        statusList.push(`${role.key}-${role.done ? "true" : "false"}`);
    }
    return statusList;
}

function isStatusDifferent(status: ProjectStatusRole[], oldStatus: ProjectStatusRole[]) {
    const redoneStatus = processStatus(status);
    const redoneOldStatus = processStatus(oldStatus);
    const diffs = difference(redoneStatus, redoneOldStatus);
    return diffs.length > 0;
}

interface EpisodeBoxProps extends SettingsProps {
    animeId: string;
    episode: number;
    airTime?: number;
    status: ProjectStatusRole[];
    isReleased: boolean;
    animateDelay?: number;
    disableEditing?: boolean;
}

interface EpisodeBoxHeaderProps extends Omit<EpisodeBoxProps, "status" | "onErrorModal" | "animeId"> {
    isEdit: boolean;
    isSubmit: boolean;
    onClick(): void;
}

interface EpisodeBoxState {
    status: ProjectStatusRole[];
    oldStatus: ProjectStatusRole[];
    released: boolean;
    previousReleased: boolean;
    isEdit: boolean;
    isSubmit: boolean;
    isFirst: boolean;
}

function EpisodeBoxHeader(props: EpisodeBoxHeaderProps) {
    const { episode, isReleased, airTime, isEdit, isSubmit } = props;
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
                {!props.disableEditing && (
                    <div className="flex items-center">
                        <button
                            onClick={props.onClick}
                            className={`flex flex-row focus:outline-none transition duration-200 text-white text-sm py-1 px-3 rounded-md ${
                                isEdit
                                    ? isSubmit
                                        ? "bg-blue-400"
                                        : "bg-blue-500 hover:bg-blue-600"
                                    : isSubmit
                                    ? "bg-red-400"
                                    : "bg-red-500 hover:bg-red-600"
                            } hover:shadow-lg ${isSubmit ? "cursor-not-allowed opacity-60" : "opacity-100"}`}
                        >
                            {isSubmit && <LoadingCircle className="mt-0 ml-0 mr-2" />}
                            {isEdit ? "Beres" : "Edit"}
                        </button>
                    </div>
                )}
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
    role: ProjectStatusRole;
    onTicked(roleName: ProjectStatusRole, checked: boolean): void;
    overrideName?: string;
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
    const FallbackPalette = "text-gray-600";

    const expandedName = expandRoleName(props.role.key) || props.overrideName || props.role.key;

    return (
        <label id={props.id} className="inline-flex items-center mt-2">
            <input
                type="checkbox"
                checked={props.check}
                onChange={(ev) => props.onTicked(props.role, ev.target.checked)}
                className={"form-checkbox h-4 w-4 " + CheckboxPalette[props.role.key] || FallbackPalette}
            />
            <span className="ml-2 text-gray-700 dark:text-gray-200 font-bold">{expandedName}</span>
        </label>
    );
}

interface AniContainer {
    animate?: boolean;
    animateDelay?: number;
}

function SimpleEpisodeViewContainer(props: AniContainer & { children?: React.ReactNode }) {
    if (props.animate) {
        return (
            <MotionInView.div
                className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm"
                initial={{ y: 75, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
            >
                {props.children}
            </MotionInView.div>
        );
    }

    return <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm">{props.children}</div>;
}

class EpisodeComponent extends React.Component<EpisodeBoxProps, EpisodeBoxState> {
    constructor(props: EpisodeBoxProps) {
        super(props);
        this.onEpisodeChangeSubmit = this.onEpisodeChangeSubmit.bind(this);
        this.toggleStatusCheck = this.toggleStatusCheck.bind(this);
        this.state = {
            status: cloneDeep(this.props.status),
            oldStatus: cloneDeep(this.props.status),
            released: this.props.isReleased,
            previousReleased: this.props.isReleased,
            isEdit: false,
            isSubmit: false,
            isFirst: true,
        };
    }

    async onEpisodeChangeSubmit() {
        const shouldUpdate =
            isStatusDifferent(this.state.status, this.state.oldStatus) ||
            this.state.released !== this.state.previousReleased;
        if (!shouldUpdate) {
            // Ignore if the content is same :)
            this.setState({ isEdit: false });
            return;
        }
        if (this.state.isSubmit) {
            return;
        }
        const { animeId } = this.props;
        this.setState({ isSubmit: true });

        const { data, errors } = await client.mutate({
            mutation: MutateProjectEpisodeStatusDocument,
            variables: {
                id: animeId,
                episode: {
                    episode: this.props.episode,
                    roles: this.state.status.map((role) => ({
                        key: role.key,
                        value: role.done,
                    })),
                    release: this.state.released,
                },
            },
        });

        if (errors) {
            this.props.onErrorModal(errors.map((err) => err.message).join("\n"));
            this.setState({ isSubmit: false });
            return;
        }

        if (data.updateProjectEpisode.success) {
            this.setState({
                oldStatus: cloneDeep(this.state.status),
                previousReleased: this.state.released,
                released: this.state.released,
                status: cloneDeep(this.state.status),
                isEdit: false,
                isSubmit: false,
            });
        } else {
            this.props.onErrorModal(data.updateProjectEpisode.message);
            this.setState({ isSubmit: false });
        }
    }

    toggleStatusCheck(statusKey: ProjectStatusRole, checked: boolean) {
        const { status } = this.state;
        const index = status.findIndex((role) => role.key === statusKey.key);
        if (index !== -1) {
            const newState = cloneDeep(status);
            newState[index].done = checked;
            this.setState({ status: newState });
        }
    }

    render() {
        const { episode, airTime, animateDelay } = this.props;
        const { status, isEdit, isFirst, released } = this.state;

        if (!isEdit) {
            const unfinishedRoles: ProjectStatusRole[] = [];
            const finishedRoles: ProjectStatusRole[] = [];
            for (const role of status) {
                if (role.done) {
                    finishedRoles.push(role);
                } else {
                    unfinishedRoles.push(role);
                }
            }
            const aniDelay = animateDelay || 0.25;

            return (
                <SimpleEpisodeViewContainer animate={isFirst} animateDelay={aniDelay}>
                    <div className="flex flex-col py-1">
                        <EpisodeBoxHeader
                            onClick={() => this.setState({ isEdit: true, isFirst: false })}
                            episode={episode}
                            airTime={airTime}
                            isEdit={this.state.isEdit}
                            isSubmit={this.state.isSubmit}
                            isReleased={released}
                            disableEditing={this.props.disableEditing}
                        />

                        <div className="flex flex-col">
                            {unfinishedRoles.length > 0 && (
                                <>
                                    <span className="font-semibold mt-2 dark:text-gray-100">⏰ Proses</span>
                                    <div className="flex-row pt-2 text-center flex flex-wrap gap-1">
                                        {unfinishedRoles.map((role) => {
                                            const expanded = expandRoleLocalized(role.key, role.name);
                                            const override = expandRoleName(role.key);
                                            return (
                                                <RolePopup
                                                    key={`unfinished-episode-${episode}-${role.key}`}
                                                    title={role.key}
                                                    popupText={expanded}
                                                    overrideTitle={override}
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
                                        {finishedRoles.map((role) => {
                                            const expanded = expandRoleLocalized(role.key, role.name);
                                            const override = expandRoleName(role.key);
                                            return (
                                                <RolePopup
                                                    key={`finished-episode-${episode}-${role.key}`}
                                                    title={role.key}
                                                    popupText={expanded}
                                                    overrideTitle={override}
                                                />
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </SimpleEpisodeViewContainer>
            );
        }

        return (
            <>
                <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm">
                    <div className="flex flex-col py-1">
                        <EpisodeBoxHeader
                            onClick={this.onEpisodeChangeSubmit}
                            episode={episode}
                            airTime={airTime}
                            isEdit={this.state.isEdit}
                            isSubmit={this.state.isSubmit}
                            isReleased={released}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="inline-flex items-center mt-2">
                            <span className="text-gray-700 dark:text-gray-200 font-bold">Rilis?</span>
                            <input
                                type="checkbox"
                                checked={this.state.released}
                                onChange={(ev) => this.setState({ released: ev.target.checked })}
                                className="form-checkbox h-4 w-4 ml-2  text-gray-600"
                            />
                        </label>
                        {status.map((role) => {
                            return (
                                <EpisodeBoxChecker
                                    id={`role-tickbox-${role.key}`}
                                    key={`role-tickbox-${role.key}`}
                                    role={role}
                                    check={role.done}
                                    overrideName={role.name}
                                    onTicked={this.toggleStatusCheck}
                                />
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }
}

export default EpisodeComponent;
