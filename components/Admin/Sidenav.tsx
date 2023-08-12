import React from "react";
import { romanizeNumber } from "@/lib/utils";
import { MdiReactIconProps } from "mdi-react";
import Link from "next/link";
import GitHubIcon from "../Icons/GitHub";
import HomeIcon from "mdi-react/HomeIcon";
import YoutubeTvIcon from "mdi-react/YoutubeTvIcon";
import PlusIcon from "mdi-react/PlusIcon";
import CogIcon from "mdi-react/CogIcon";
import ServerIcon from "mdi-react/ServerIcon";
import InformationIcon from "mdi-react/InformationIcon";

export type SidenavActiveState =
    | "home"
    | "project"
    | "projectpage"
    | "fsrss"
    | "fsrsspage"
    | "settings"
    | "usersettings"
    | "servers"
    | "serversadd"
    | "about";

export interface SideNavigationProps {
    name: string;
    icon: React.ReactElement<MdiReactIconProps>;
    active: boolean;
    href: string;
    highlightLink?: boolean;
    className?: string;
}

export function SideNavigation(props: SideNavigationProps) {
    const { name, icon: Icon, active, highlightLink, href, className } = props;

    const InactiveClass =
        "py-2 pl-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-800 rounded flex flex-row items-center";
    const ActiveClass =
        "py-2 pl-2 text-sm text-gray-700 dark:text-gray-100 bg-gray-200 dark:bg-gray-800 rounded flex flex-row items-center";

    const highlightActive = typeof highlightLink === "boolean" ? highlightLink : active;
    const UseClass = highlightActive ? ActiveClass : InactiveClass;

    return (
        <Link href={active ? "#" : href} className={`${UseClass} ${className ? className : ""}`}>
            {Icon}
            <span className="ml-1">{name}</span>
        </Link>
    );
}

export interface AdminSidenavProps {
    show: boolean;
    active?: SidenavActiveState;
    appInfo?: {
        semver?: string;
        commit?: string;
    };
    onClose: () => void;
    // this is a list of <SideNavigation> components
    navigations: React.ReactElement<SideNavigationProps>[];
}

export type ChildAdminSidenavProps = Omit<AdminSidenavProps, "navigations">;

function NaoTimesSideHeader() {
    return (
        <div className="flex items-center justify-center mt-8">
            <div className="flex items-center">
                <span className="text-gray-800 dark:text-white text-2xl font-semibold">
                    <span className="font-extralight tracking-wider">nao</span>
                    <span>Times</span>
                </span>
            </div>
        </div>
    );
}

export default function AdminSidenav(props: AdminSidenavProps) {
    const {
        show,
        navigations,
        appInfo: { semver, commit },
    } = props;

    const blackLucent = show ? "block" : "hidden";
    const sidebarTransition = show ? "translate-x-0 ease-out" : "-translate-x-full ease-in";

    const currentCopyright = new Date().getUTCFullYear();
    const romanizedCC = romanizeNumber(currentCopyright);

    return (
        <React.Fragment>
            <div
                className={`fixed inset-0 z-20 bg-black opacity-50 transition-opacity lg:hidden ${blackLucent}`}
                onClick={props.onClose}
            />
            <div
                className={`fixed z-30 inset-y-0 left-0 w-60 transition duration-300 transform bg-white dark:bg-gray-900 overflow-y-auto lg:translate-x-0 lg:static lg:inset-0 ${sidebarTransition}`}
            >
                <NaoTimesSideHeader />
                <nav className="flex flex-col mt-10 px-4">{navigations.map((Nav) => Nav)}</nav>
                <div className="absolute items-end justify-start bottom-0 left-0 ml-4 mb-4 z-10">
                    {semver && (
                        <div className="text-gray-900 dark:text-gray-200 font-semibold flex flex-row mb-2 text-lg items-center">
                            <Link
                                className="text-gray-900 dark:text-gray-100 hover:opacity-70 transition-opacity duration-200"
                                href="https://github.com/noaione/naoTimesUI"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                <GitHubIcon />
                            </Link>
                            <span className="ml-2">v{semver}</span>
                        </div>
                    )}
                    {commit && (
                        <div className="text-gray-900 dark:text-gray-200 font-semibold flex flex-row mb-2 text-lg items-center">
                            {"Commit: "}
                            <Link
                                className="text-gray-900 dark:text-gray-100 hover:opacity-70 transition-opacity duration-200"
                                href="https://github.com/noaione/naoTimesUI"
                                rel="noopener noreferrer"
                                target="_blank"
                            >
                                {commit.slice(0, 7)}
                            </Link>
                        </div>
                    )}
                    <div className="text-gray-900 dark:text-gray-200">© {romanizedCC} - naoTimesDev</div>
                </div>
            </div>
        </React.Fragment>
    );
}

export function AdminServerSidenav(props: ChildAdminSidenavProps) {
    const { active, ...restProps } = props;

    const curActive = active ?? "home";

    return (
        <AdminSidenav
            {...restProps}
            navigations={[
                <SideNavigation
                    key="admin-sidenav-serverhome"
                    name="Ikhtisar"
                    icon={<HomeIcon className="text-sm" />}
                    active={curActive === "home"}
                    href="/admin/peladen"
                />,
                <SideNavigation
                    key="admin-sidenav-serverprojects"
                    name="Proyek"
                    icon={<YoutubeTvIcon className="text-sm" />}
                    active={curActive === "project"}
                    highlightLink={["project", "projectpage"].includes(curActive)}
                    href="/admin/peladen/proyek"
                    className="mt-3"
                />,
                <SideNavigation
                    key="admin-sidenav-serversettings"
                    name="Pengaturan"
                    icon={<CogIcon className="text-sm" />}
                    active={curActive === "settings"}
                    href="/admin/peladen/atur"
                    className="mt-3"
                />,
            ]}
        />
    );
}

export function AdminUserSidenav(props: ChildAdminSidenavProps) {
    const { active, ...restProps } = props;

    const curActive = active ?? "home";

    return (
        <AdminSidenav
            {...restProps}
            navigations={[
                <SideNavigation
                    key="admin-sidenav-useradd"
                    name="Tambah"
                    icon={<PlusIcon className="text-sm" />}
                    active={curActive === "serversadd"}
                    href="/admin/tambah"
                />,
                <SideNavigation
                    key="admin-sidenav-userhome"
                    name="Peladen"
                    icon={<ServerIcon className="text-sm" />}
                    active={curActive === "servers"}
                    href="/admin"
                    className="mt-3"
                />,
                <SideNavigation
                    key="admin-sidenav-usersettings"
                    name="Pengaturan"
                    icon={<CogIcon className="text-sm" />}
                    active={curActive === "usersettings"}
                    href="/admin/atur"
                    className="mt-3"
                />,
                <SideNavigation
                    key="admin-sidenav-usersettings"
                    name="Tentang"
                    icon={<InformationIcon className="text-sm" />}
                    active={curActive === "about"}
                    href="/admin/tentang"
                    className="mt-3"
                />,
            ]}
        />
    );
}
