import React from "react";
import { UserProps } from "../models/user";
import AdminHeader from "./AdminHeader";
import AdminSidenav, { SidenavActiveState } from "./AdminSidenav";

import packageJSON from "../package.json";

interface AdminLayoutProps {
    user: UserProps;
    active?: SidenavActiveState;
    title?: string;
    overflowX?: boolean;
}

interface AdminLayoutState {
    sidebarOpen: boolean;
}

class AdminLayout extends React.Component<AdminLayoutProps, AdminLayoutState> {
    constructor(props: AdminLayoutProps) {
        super(props);
        this.openSidebar = this.openSidebar.bind(this);
        this.closeSidebar = this.closeSidebar.bind(this);
        this.state = {
            sidebarOpen: false,
        };
    }

    closeSidebar() {
        this.setState({ sidebarOpen: false });
    }

    openSidebar() {
        this.setState({ sidebarOpen: true });
    }

    render() {
        const { version } = packageJSON;
        const { user, active, title, overflowX } = this.props;
        const realTitle = title ?? "Ikhtisar";
        let realOverflowX = false;
        if (typeof overflowX === "boolean") {
            realOverflowX = overflowX;
        }
        const { NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA } = process.env;
        const commit = NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "";
        const appInfo = { semver: version, commit };
        return (
            <>
                <div className="flex h-screen bg-gray-100 dark:bg-gray-800 font-roboto transition-colors duration-300">
                    <AdminSidenav
                        id={user.id}
                        name={user.name}
                        privilige={user.privilege}
                        show={this.state.sidebarOpen}
                        active={active}
                        onClose={this.closeSidebar}
                        appInfo={appInfo}
                    />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <AdminHeader
                            id={user.id}
                            name={user.name}
                            privilige={user.privilege}
                            title={realTitle}
                            onOpen={this.openSidebar}
                        />
                        <main
                            id="root"
                            className={
                                realOverflowX
                                    ? "flex-1 overflow-x-auto overflow-y-auto"
                                    : "flex-1 overflow-x-hidden overflow-y-auto"
                            }
                        >
                            {this.props.children}
                        </main>
                    </div>
                </div>
            </>
        );
    }
}

export default AdminLayout;
