import React from "react";

import CogIcon from "mdi-react/CogIcon";
import HomeIcon from "mdi-react/HomeIcon";
import InformationIcon from "mdi-react/InformationIcon";
import NewspaperVariantIcon from "mdi-react/NewspaperVariantIcon";
import ServerIcon from "mdi-react/ServerIcon";
import YoutubeTvIcon from "mdi-react/YoutubeTvIcon";

import GitHubIcon from "./Icons/GitHub";

import { romanizeNumber } from "../lib/utils";

export type SidenavActiveState =
    | "home"
    | "project"
    | "projectpage"
    | "fsrss"
    | "fsrsspage"
    | "settings"
    | "about";

interface SidenavProps {
    id: string;
    name?: string;
    privilige: "owner" | "server";
    show: boolean;
    active?: SidenavActiveState;
    appInfo?: {
        semver?: string;
        commit?: string;
    };
    onClose: () => void;
}

class AdminSidenav extends React.Component<SidenavProps, {}> {
    constructor(props: SidenavProps) {
        super(props);
        this.callOnClose = this.callOnClose.bind(this);
        this.closeSidebar = this.closeSidebar.bind(this);
    }

    callOnClose() {
        this.props.onClose();
    }

    closeSidebar() {
        this.callOnClose();
    }

    render() {
        const { privilige, active, show } = this.props;
        const appInfo = this.props.appInfo || {};
        const { semver, commit } = appInfo;
        const isAdmin = privilige === "owner";
        const curActive = active ?? "home";

        const blackLucent = show ? "block" : "hidden";
        const sidebarTransition = show ? "translate-x-0 ease-out" : "-translate-x-full ease-in";

        const adminPageUrl = isAdmin ? "/admin/peladen" : "/admin/proyek";
        const adminPageIcon = isAdmin ? (
            <ServerIcon className="text-sm" />
        ) : (
            <YoutubeTvIcon className="text-sm" />
        );

        const currentCopyright = new Date().getUTCFullYear();
        const romanizedCC = romanizeNumber(currentCopyright);

        const NormanClass =
            "py-2 pl-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 rounded flex flex-row items-center";
        const SelClass =
            "py-2 pl-2 text-sm text-gray-700 dark:text-gray-100 bg-gray-200 dark:bg-gray-800 rounded flex flex-row items-center";

        return (
            <>
                <div
                    className={
                        "fixed z-20 inset-0 bg-black opacity-50 transition-opacity lg:hidden " + blackLucent
                    }
                    onClick={this.closeSidebar}
                ></div>
                <div
                    className={
                        "fixed z-30 inset-y-0 left-0 w-60 transition duration-300 transform bg-white dark:bg-gray-900 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0 " +
                        sidebarTransition
                    }
                >
                    <div className="flex items-center justify-center mt-8">
                        <div className="flex items-center">
                            <span className="text-gray-800 dark:text-white text-2xl font-semibold">
                                naoTimes
                            </span>
                        </div>
                    </div>

                    <nav className="flex flex-col mt-10 px-4">
                        <a
                            href={curActive === "home" ? "#" : "/admin"}
                            className={curActive === "home" ? SelClass : NormanClass}
                        >
                            <HomeIcon className="text-sm" />
                            <span className="ml-1">Ikhtisar</span>
                        </a>
                        <a
                            href={curActive === "project" ? "#" : adminPageUrl}
                            className={
                                ["project", "projectpage"].includes(curActive)
                                    ? SelClass + " mt-3"
                                    : NormanClass + " mt-3"
                            }
                        >
                            {adminPageIcon}
                            <span className="ml-1">{isAdmin ? "Peladen" : "Proyek"}</span>
                        </a>
                        {!isAdmin && (
                            <a
                                href={curActive === "fsrss" ? "#" : "/admin/fansubrss"}
                                className={
                                    ["fsrss", "fsrsspage"].includes(curActive)
                                        ? SelClass + " mt-3"
                                        : NormanClass + " mt-3"
                                }
                            >
                                <NewspaperVariantIcon className="text-sm" />
                                <span className="ml-1">FansubRSS</span>
                            </a>
                        )}
                        <a
                            href={curActive === "settings" ? "#" : "/admin/atur"}
                            className={curActive === "settings" ? SelClass + " mt-3" : NormanClass + " mt-3"}
                        >
                            <CogIcon className="text-sm" />
                            <span className="ml-1">Pengaturan</span>
                        </a>
                        <a
                            href={curActive === "about" ? "#" : "/admin/tentang"}
                            className={curActive === "about" ? SelClass + " mt-3" : NormanClass + " mt-3"}
                        >
                            <InformationIcon className="text-sm" />
                            <span className="ml-1">Tentang</span>
                        </a>
                    </nav>

                    <div className="absolute items-end justify-start bottom-0 left-0 ml-4 mb-4 z-10">
                        {semver && (
                            <>
                                <div className="dark:text-gray-200 font-semibold flex flex-row mb-2 text-lg items-center">
                                    <a
                                        className="text-gray-900 dark:text-gray-100 hover:opacity-70 transition-opacity duration-200"
                                        href="https://github.com/noaione/naoTimesUI"
                                    >
                                        <GitHubIcon />
                                    </a>
                                    <span className="ml-2">v{semver}</span>
                                </div>
                            </>
                        )}
                        {commit && (
                            <>
                                <div className="dark:text-gray-200 font-semibold">
                                    Commit:{" "}
                                    <a
                                        className="text-gray-900 dark:text-gray-100 hover:opacity-80 transition-opacity duration-200"
                                        href={"https://github.com/noaione/naoTimesUI/commit/" + commit}
                                    >
                                        {commit.slice(0, 7)}
                                    </a>
                                </div>
                            </>
                        )}
                        <div className="dark:text-gray-200">© {romanizedCC} - naoTimesDev</div>
                    </div>
                </div>
            </>
        );
    }
}

export default AdminSidenav;
