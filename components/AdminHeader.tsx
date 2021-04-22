/* eslint-disable no-console */
import React from "react";

import AccountIcon from "mdi-react/AccountIcon";
import ShieldAccountIcon from "mdi-react/ShieldAccountIcon";
import MenuIcon from "mdi-react/MenuIcon";
import LightModeIcon from "mdi-react/LightbulbOnIcon";
import DarkModeIcon from "mdi-react/LightbulbOutlineIcon";

interface HeaderProps {
    id: string;
    name?: string;
    privilige: "owner" | "server";
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
        console.info(`toggle dropdown from ${this.state.dropdownOpen}`);
        this.setState({ dropdownOpen: !this.state.dropdownOpen });
    }

    handleClickOutsideDropdown(event: MouseEvent) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target as Node)) {
            this.setState({ dropdownOpen: false });
        }
    }

    toggleDarkMode() {
        this.setState({ isDarkMode: !this.state.isDarkMode });
    }

    render() {
        const { id, name, privilige, title } = this.props;
        const { isDarkMode } = this.state;

        const username = name || id;
        const isAdmin = privilige === "owner";
        const opacity = this.state.dropdownOpen ? "opacity-100" : "opacity-0";
        return (
            <>
                <header className="flex justify-between items-center p-6 bg-white dark:bg-gray-900">
                    <div className="flex items-center space-x4 lg:space-x-0">
                        <button
                            onClick={this.onMenuOpen}
                            className="text-gray-500 dark:text-gray-300 focus:outline-none lg:hidden"
                        >
                            <MenuIcon />
                        </button>

                        <div>
                            <h1 className="text-2xl ml-2 font-medium text-gray-800 dark:text-white">
                                {title || "Ikhtisar"}
                            </h1>
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
                                <h2 className="text-gray-700 dark:text-gray-300 text-sm hidden sm:block">
                                    {username}
                                </h2>
                                {isAdmin ? (
                                    <ShieldAccountIcon
                                        onClick={this.toggleDropdown}
                                        className="text-gray-700 dark:text-gray-300 object-cover transition-opacity duration-200 ease-in-out hover:opacity-70"
                                    />
                                ) : (
                                    <AccountIcon
                                        onClick={this.toggleDropdown}
                                        className="text-gray-700 dark:text-gray-300 object-cover transition-opacity duration-200 ease-in-out hover:opacity-70"
                                    />
                                )}
                            </button>
                            <div
                                ref={this.wrapperRef}
                                className={
                                    "absolute right-0 mt-2 w-48 bg-white rounded-md overflow-hidden shadow-xl z-10 transition ease-in-out duration-100 " +
                                    opacity
                                }
                            >
                                <a
                                    href="/api/auth/logout"
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-600 hover:text-white"
                                >
                                    Keluar
                                </a>
                            </div>
                        </div>
                    </div>
                </header>
            </>
        );
    }
}

export default AdminHeader;
