import React from "react";

import { motion } from "framer-motion";

import AdminBanner from "./Banner";
import AdminHeader from "./Header";
import { AdminServerSidenav, AdminUserSidenav, SidenavActiveState } from "./Sidenav";

import packageJSON from "../../package.json";
import { UserSessFragment } from "@/lib/graphql/auth.generated";

interface AdminLayoutProps {
    user: UserSessFragment;
    active?: SidenavActiveState;
    title?: string;
    overflowX?: boolean;
    children: React.ReactNode;
}

export default function AdminLayout(props: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    const { version } = packageJSON;
    const { user, active, title, overflowX } = props;
    const realTitle = title ?? "Ikhtisar";
    let realOverflowX = false;
    if (typeof overflowX === "boolean") {
        realOverflowX = overflowX;
    }

    const { NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA } = process.env;
    const commit = NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ?? "";
    const appInfo = { semver: version, commit };

    const isInServer = typeof user.active?.id !== "undefined";

    return (
        <>
            <div className="flex h-screen bg-gray-100 dark:bg-gray-800 font-inter transition-colors duration-300">
                {isInServer ? (
                    <AdminServerSidenav
                        active={active}
                        show={sidebarOpen}
                        appInfo={appInfo}
                        onClose={() => setSidebarOpen(false)}
                    />
                ) : (
                    <AdminUserSidenav
                        active={active}
                        show={sidebarOpen}
                        appInfo={appInfo}
                        onClose={() => setSidebarOpen(false)}
                    />
                )}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <AdminBanner />
                    <AdminHeader user={user} title={realTitle} onOpen={() => setSidebarOpen(true)} />
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
                        {props.children}
                    </motion.main>
                </div>
            </div>
        </>
    );
}
