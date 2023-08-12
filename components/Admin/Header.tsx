/* eslint-disable no-console */
import React from "react";
import Router from "next/router";

import AccountIcon from "mdi-react/AccountIcon";
import ShieldAccountIcon from "mdi-react/ShieldAccountIcon";
import MenuIcon from "mdi-react/MenuIcon";
import LightModeIcon from "mdi-react/LightbulbOnIcon";
import DarkModeIcon from "mdi-react/LightbulbOutlineIcon";
import { motion } from "framer-motion";
import { UserType } from "@/lib/graphql/types.generated";
import client from "@/lib/graphql/client";
import { SetServerDocument } from "@/lib/graphql/servers.generated";
import { LogoutDocument, UserSessFragment } from "@/lib/graphql/auth.generated";

interface HeaderProps {
    user: UserSessFragment;
    title: string;
    onOpen: () => void;
}

interface HeaderState {
    dropdownOpen: boolean;
    isDarkMode: boolean;
    wrappedNodeRef?: React.LegacyRef<HTMLDivElement>;
}

type NullFucked = null | undefined;

const isNullified = function (data: any): data is NullFucked {
    return typeof data === "undefined" || data === null;
};

class AdminHeader extends React.Component<HeaderProps, HeaderState> {
    wrapperRef: React.RefObject<HTMLDivElement>;

    constructor(props: HeaderProps) {
        super(props);

        this.wrapperRef = React.createRef();
        this.onMenuOpen = this.onMenuOpen.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.toggleDarkMode = this.toggleDarkMode.bind(this);
        this.handleClickOutsideDropdown = this.handleClickOutsideDropdown.bind(this);

        this.state = {
            dropdownOpen: false,
            isDarkMode: false,
        };
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutsideDropdown);
        let userPreferDark: boolean | undefined;
        let systemPreferDark = false;
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            systemPreferDark = true;
        }

        try {
            const themeStorage = localStorage.getItem("ntui.theme");
            if (!isNullified(themeStorage)) {
                userPreferDark = themeStorage === "dark" ? true : false;
            }
        } catch (e) {}

        if (isNullified(userPreferDark)) {
            if (systemPreferDark) {
                this.setState({ isDarkMode: true });
            } else {
                this.setState({ isDarkMode: false });
            }
        } else {
            if (userPreferDark) {
                this.setState({ isDarkMode: true });
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutsideDropdown);
    }

    componentDidUpdate() {
        const { isDarkMode } = this.state;
        const root = window.document.documentElement;
        if (isDarkMode) {
            if (!root.classList.contains("dark")) {
                root.classList.add("dark");
            }
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("ntui.theme", isDarkMode ? "dark" : "light");
    }

    onMenuOpen() {
        this.props.onOpen();
    }

    toggleDropdown() {
        this.setState((prevState) => ({ dropdownOpen: !prevState.dropdownOpen }));
    }

    handleClickOutsideDropdown(event: MouseEvent) {
        if (!this.state.dropdownOpen) {
            // Don't run if dropdown is hidden;
            return;
        }
        // Extend the types
        let target = event.target as EventTarget & {
            nodeName: string;
            id: string;
            parentElement: HTMLElement;
        };
        if (target.nodeName.toLowerCase() === "path") {
            // <path> tags mean there's <svg> tags wrapping it, go up by one.
            target = target.parentElement;
        }
        const isToggler = target.id === "dropdown-toggler";
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target as Node) && !isToggler) {
            this.setState({ dropdownOpen: false });
        }
    }

    toggleDarkMode() {
        this.setState((prevState) => ({ isDarkMode: !prevState.isDarkMode }));
    }

    render() {
        const { user, title } = this.props;
        const { isDarkMode } = this.state;

        const username = user.active?.name ?? user.username ?? user.id;
        const isAdmin = user.privilege === UserType.Admin;
        const opacity = this.state.dropdownOpen ? "opacity-100" : "opacity-0";
        return (
            <>
                <header className="flex justify-between items-center p-6 py-8 bg-white dark:bg-gray-900">
                    <div className="flex items-center space-x4 lg:space-x-0">
                        <button
                            onClick={this.onMenuOpen}
                            className="text-gray-500 dark:text-gray-300 lg:hidden hover:opacity-70 duration-200 focus:outline-none"
                        >
                            <MenuIcon />
                        </button>

                        <div>
                            <motion.h1
                                className="text-2xl mx-4 lg:mx-2 font-semibold text-gray-800 dark:text-white"
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                            >
                                {title ?? "Ikhtisar"}
                            </motion.h1>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={this.toggleDarkMode}
                            className="flex text-gray-700 dark:text-gray-300 transition-opacity duration-200 ease-in-out hover:opacity-70 focus:outline-none mb-1"
                        >
                            {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
                        </button>
                        <div className="relative">
                            <button className="flex items-center space-x-2 relative focus:outline-none">
                                <h2 className="text-gray-700 dark:text-gray-300 text-sm cursor-text hidden sm:block select-text">
                                    {username}
                                </h2>
                                {isAdmin ? (
                                    <ShieldAccountIcon
                                        id="dropdown-toggler"
                                        onClick={this.toggleDropdown}
                                        className="text-gray-700 dark:text-gray-300 object-cover transition-opacity duration-200 ease-in-out hover:opacity-70"
                                    />
                                ) : (
                                    <AccountIcon
                                        id="dropdown-toggler"
                                        onClick={this.toggleDropdown}
                                        className="text-gray-700 dark:text-gray-300 object-cover transition-opacity duration-200 ease-in-out hover:opacity-70"
                                    />
                                )}
                            </button>
                            {this.state.dropdownOpen && (
                                <div
                                    ref={this.wrapperRef}
                                    className={
                                        "absolute right-0 mt-2 w-48 divide-y-[1px] divide-gray-700 dark:divide-gray-500 bg-white dark:bg-gray-700 rounded-md overflow-hidden shadow-xl z-10 transition ease-in-out duration-100 " +
                                        opacity
                                    }
                                >
                                    {user.active?.id && (
                                        <button
                                            onClick={async (ev) => {
                                                ev.preventDefault();
                                                const { data } = await client.mutate({
                                                    mutation: SetServerDocument,
                                                    variables: {
                                                        id: null,
                                                    },
                                                });
                                                if (data.selectServer.success) {
                                                    Router.replace("/admin");
                                                }
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-600 hover:text-white cursor-pointer w-full text-left"
                                        >
                                            Ganti Server
                                        </button>
                                    )}
                                    <button
                                        onClick={async (ev) => {
                                            ev.preventDefault();
                                            const { data } = await client.mutate({
                                                mutation: LogoutDocument,
                                            });
                                            if (data.logout.success) {
                                                localStorage.removeItem("sessionToken");
                                                Router.replace("/");
                                            }
                                        }}
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-purple-600 hover:text-white cursor-pointer w-full text-left"
                                    >
                                        Keluar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
            </>
        );
    }
}

export default AdminHeader;
