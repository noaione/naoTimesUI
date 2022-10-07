import { cloneDeep, difference } from "lodash";
import React from "react";

import LoadingCircle from "../LoadingCircle";
import MotionInView from "../MotionInView";
import RolePopup from "../RolePopup";
import { SettingsProps } from "../SettingsPage/base";

import { expandRoleLocalized, expandRoleName, RoleProject } from "../../lib/utils";
import type { ProjectEpisodeProgress } from "@prisma/client";

function FinishedPopper() {
    return <span className="text-green-500">✔</span>;
}

function UnfinishedPopper() {
    return <span>❌</span>;
}

function processStatus(status: ProjectEpisodeProgress) {
    const statusList = [];
    for (const [roleName, roleStat] of Object.entries(status)) {
        if (Array.isArray(roleStat)) {
            roleStat.forEach((role) => {
                statusList.push(`${role.key}-${role.done ? "true" : "false"}`);
            });
        } else {
            statusList.push(`${roleName}-${roleStat ? "true" : "false"}`);
        }
    }
    return statusList;
}

function isStatusDifferent(status: ProjectEpisodeProgress, oldStatus: ProjectEpisodeProgress) {
    const redoneStatus = processStatus(status);
    const redoneOldStatus = processStatus(oldStatus);
    const diffs = difference(redoneStatus, redoneOldStatus);
    return diffs.length > 0;
}

interface EpisodeBoxProps extends SettingsProps {
    animeId: string;
    episode: number;
    airTime?: number;
    status: ProjectEpisodeProgress;
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
    status: ProjectEpisodeProgress;
    oldStatus: ProjectEpisodeProgress;
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
    role: RoleProject;
    onTicked(roleName: RoleProject, checked: boolean): void;
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

    const expandedName = props.overrideName || expandRoleName(props.role);

    return (
        <>
            <label id={props.id} className="inline-flex items-center mt-2">
                <input
                    type="checkbox"
                    checked={props.check}
                    onChange={(ev) => props.onTicked(props.role, ev.target.checked)}
                    className={"form-checkbox h-4 w-4 " + CheckboxPalette[props.role] || FallbackPalette}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-200 font-bold">{expandedName}</span>
            </label>
        </>
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
            isEdit: false,
            isSubmit: false,
            isFirst: true,
        };
    }

    async onEpisodeChangeSubmit() {
        if (!isStatusDifferent(this.state.status, this.state.oldStatus)) {
            // Ignore if the content is same :)
            this.setState({ isEdit: false });
            return;
        }
        if (this.state.isSubmit) {
            return;
        }
        this.setState({ isSubmit: true });

        const {
            status: { custom: customStatus, ...status },
        } = this.state;

        const buildStatus = Object.keys(status).map((role) => {
            return {
                tick: status[role] as boolean,
                role,
            };
        });
        customStatus.forEach((custom) => {
            buildStatus.push({
                tick: custom.done,
                role: custom.key,
            });
        });

        const bodyBag = {
            event: "status",
            changes: {
                roles: buildStatus,
                anime_id: this.props.animeId,
                episode: this.props.episode,
            },
        };

        const apiRes = await fetch("/api/showtimes/proyek/ubah", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyBag),
        });

        const jsonRes = await apiRes.json();
        if (jsonRes.success) {
            const results = jsonRes.results;
            this.setState({
                status: cloneDeep(results.progress),
                oldStatus: cloneDeep(results.progress),
                isEdit: false,
                isSubmit: false,
            });
        } else {
            this.setState({ isEdit: false, isSubmit: false });
            this.props.onErrorModal(jsonRes.message);
        }
    }

    toggleStatusCheck(statusKey: keyof Omit<ProjectEpisodeProgress, "custom">, checked: boolean) {
        const { status } = this.state;
        console.info(status, statusKey, checked);
        // yeet custom type
        const isCustom = !["TL", "TLC", "ENC", "ED", "TM", "TS", "QC"].includes(statusKey);
        if (isCustom) {
            const customInfo = status.custom.findIndex((c) => c.key === statusKey);
            if (customInfo !== -1) {
                status.custom[customInfo].done = checked;
            }
        } else {
            status[statusKey] = checked;
        }
        this.setState({ status });
    }

    render() {
        const { episode, airTime, isReleased, animateDelay } = this.props;
        const {
            status: { custom: customProgress, QC: QCStatus, ...status },
            isEdit,
            isFirst,
        } = this.state;

        const customTextMapping: { [key: string]: string } = {};
        customProgress.forEach((custom) => {
            customTextMapping[custom.key] = custom.name;
        });

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

            customProgress.forEach((custom) => {
                if (custom.done) {
                    finishedRoles.push(custom.key);
                } else {
                    unfinishedRoles.push(custom.key);
                }
            });

            if (QCStatus) {
                finishedRoles.push("QC");
            } else {
                unfinishedRoles.push("QC");
            }
            const aniDelay = animateDelay || 0.25;
            // @ts-ignore

            return (
                <SimpleEpisodeViewContainer animate={isFirst} animateDelay={aniDelay}>
                    <div className="flex flex-col py-1">
                        <EpisodeBoxHeader
                            onClick={() => this.setState({ isEdit: true, isFirst: false })}
                            episode={episode}
                            airTime={airTime}
                            isEdit={this.state.isEdit}
                            isSubmit={this.state.isSubmit}
                            isReleased={isReleased}
                            disableEditing={this.props.disableEditing}
                        />
                        <div className="flex flex-col">
                            {unfinishedRoles.length > 0 && (
                                <>
                                    <span className="font-semibold mt-2 dark:text-gray-100">⏰ Proses</span>
                                    <div className="flex-row pt-2 text-center flex flex-wrap gap-1">
                                        {unfinishedRoles.map((roleName) => {
                                            const expanded =
                                                customTextMapping[roleName] || expandRoleLocalized(roleName);
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
                                            const expandedPop =
                                                customTextMapping[roleName] || expandRoleLocalized(roleName);
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
                </SimpleEpisodeViewContainer>
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outerThis = this;
        // @ts-ignore
        status.QC = QCStatus;

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
                            isReleased={isReleased}
                        />
                    </div>
                    <div className="flex flex-col">
                        {Object.keys(status).map((roleName) => {
                            return (
                                <EpisodeBoxChecker
                                    id={`role-tickbox-${roleName}`}
                                    key={`role-tickbox-${roleName}`}
                                    role={roleName as RoleProject}
                                    onTicked={outerThis.toggleStatusCheck}
                                    check={outerThis.state.status[roleName]}
                                />
                            );
                        })}
                        {customProgress.map((role) => {
                            return (
                                <EpisodeBoxChecker
                                    id={`role-tickbox-custom-${role.key}`}
                                    key={`role-tickbox-custom-${role.key}`}
                                    role={role.key as RoleProject}
                                    onTicked={outerThis.toggleStatusCheck}
                                    check={role.done}
                                    overrideName={role.name}
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
