import React from "react";
import Head from "next/head";

import AdminLayout from "@/components/AdminLayout";
import MetadataHead from "@/components/MetadataHead";
import IkhtisarAnime from "@/components/IkhtisarAnime";
import SkeletonLoader from "@/components/Skeleton";
import StatsCard, { IStatsType } from "@/components/StatsCard";

import { UserSessFragment } from "@/lib/graphql/auth.generated";
import { useQuery } from "@apollo/client";
import { GetServerStatsDocument } from "@/lib/graphql/servers.generated";
import { GetLatestProjectInfoDocument } from "@/lib/graphql/projects.generated";
import { UserType } from "@/lib/graphql/types.generated";
import { AuthContext } from "@/components/AuthSuspense";

function ErrorText(props: { message: string }) {
    return (
        <div className="font-light dark:text-gray-200 mb-2">
            <span className="font-bold">Error:</span> {props.message}
        </div>
    );
}

function LatestProjectComponent() {
    const { loading, error, data } = useQuery(GetLatestProjectInfoDocument);
    if (loading) {
        return <SkeletonLoader.AdminOverview />;
    }
    if (error) {
        return <ErrorText message={error.message} />;
    }

    if (data.latests.__typename === "Result") {
        return <ErrorText message={data.latests.message} />;
    }

    const projectData = data.latests.nodes.filter((res) => res.statuses.length > 0);
    if (projectData.length === 0) {
        return <div className="text-lg font-light mt-2 dark:text-white">Sudah selesai semua!</div>;
    }
    return (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            {projectData.map((res) => {
                return <IkhtisarAnime key={`latest-project-${res.id}`} data={res} />;
            })}
        </div>
    );
}

function StatsComponent() {
    const { loading, error, data } = useQuery(GetServerStatsDocument);
    if (loading) {
        return <SkeletonLoader.StatsCard />;
    }
    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (data.stats.__typename === "Result") {
        return <div>Error: {data.stats.message}</div>;
    }

    const statsData = data.stats.nodes;
    return (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {statsData.map((res) => {
                return (
                    <StatsCard
                        key={`stats-card-${res.key}`}
                        type={res.key as IStatsType}
                        amount={res.value}
                    />
                );
            })}
        </div>
    );
}

interface AdminHomepageProps {
    user: UserSessFragment;
}

class AdminHomepage extends React.Component<AdminHomepageProps> {
    constructor(props: AdminHomepageProps) {
        super(props);
    }

    render() {
        const { user } = this.props;
        const pageTitle = user.privilege === UserType.Admin ? "Panel Admin" : "Panel Peladen";

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>{`${pageTitle} :: naoTimesUI`}</title>
                    <MetadataHead.SEO title={pageTitle} urlPath="/admin" />
                </Head>
                <AdminLayout user={user}>
                    <div className="container mx-auto px-6 py-8">
                        <h2 className="font-light dark:text-gray-200 pb-4">Statistik</h2>
                        <StatsComponent />
                    </div>
                    <div className="container mx-auto px-6 py-8">
                        <h2 className="font-light dark:text-gray-200 pb-4">Sedang digarap</h2>
                        <LatestProjectComponent />
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export default function WrappedAdminHomepage() {
    return <AuthContext.Consumer>{(sess) => sess && <AdminHomepage user={sess} />}</AuthContext.Consumer>;
}
