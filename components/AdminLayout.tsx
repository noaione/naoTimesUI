import React from "react";

import { motion } from "framer-motion";

import AdminBanner from "./AdminBanner";
import AdminHeader from "./AdminHeader";
import AdminSidenav, { SidenavActiveState } from "./AdminSidenav";

import packageJSON from "../package.json";
import { UserSessFragment } from "@/lib/graphql/auth.generated";

interface AdminLayoutProps {
    user: UserSessFragment;
    active?: SidenavActiveState;
    title?: string;
    overflowX?: boolean;
    children: React.ReactNode;
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
                <div className="flex h-screen bg-gray-100 dark:bg-gray-800 font-inter transition-colors duration-300">
                    <AdminSidenav
                        id={user.id}
                        name={user.username}
                        privilige={user.privilege}
                        show={this.state.sidebarOpen}
                        active={active}
                        onClose={this.closeSidebar}
                        appInfo={appInfo}
                    />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <AdminBanner />
                        <AdminHeader
                            id={user.id}
                            name={user.username}
                            privilige={user.privilege}
                            title={realTitle}
                            onOpen={this.openSidebar}
                        />
                        <motion.main
                            id="root"
                            layoutId="root-container"
                            key={`${active ?? "home"}-${realTitle}`}
                            className={`flex-1 overflow-y-auto ${
                                realOverflowX ? "overflow-x-auto" : "overflow-x-hidden"
                            }`}
                            variants={{
                                zero: { opacity: 0 },
                                full: { opacity: 1 },
                            }}
                            transition={{ duration: 0.25 }}
                            initial="zero"
                            animate="full"
                            exit="zero"
                        >
                            {this.props.children}
                        </motion.main>
                    </div>
                </div>
            </>
        );
    }
}

export default AdminLayout;
