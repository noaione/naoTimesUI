import React from "react";
import Head from "next/head";

import AdminLayout from "../../components/AdminLayout";
import MetadataHead from "../../components/MetadataHead";
import IkhtisarAnime, { ProjectOverview } from "../../components/IkhtisarAnime";
import SkeletonLoader from "../../components/Skeleton";
import StatsCard, { IStatsType } from "../../components/StatsCard";

import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../lib/session";

import { UserProps } from "../../models/user";

interface StatsData {
    key: IStatsType;
    data: number;
}

interface AdminHomepageState {
    isLoading: boolean;

    animeData?: { [key: string]: any }[];
    statsData?: StatsData[];
}

interface AdminAnimeProps {
    data?: { [key: string]: any }[];
}

interface AdminHomepageProps {
    user?: UserProps & { loggedIn: boolean };
}

class AdminAnimeSets extends React.Component<AdminAnimeProps> {
    constructor(props: AdminAnimeProps) {
        super(props);
    }

    render() {
        const { data } = this.props;

        return (
            <>
                {data.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
                        {data.map((res) => {
                            return (
                                <IkhtisarAnime key={`anime-card-${res.id}`} data={res as ProjectOverview} />
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-lg font-light mt-2 dark:text-white">Sudah selesai semua!</div>
                )}
            </>
        );
    }
}

class AdminHomepage extends React.Component<AdminHomepageProps, AdminHomepageState> {
    constructor(props: AdminHomepageProps) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    async componentDidMount() {
        const userObj = await fetch("/api/showtimes/stats");
        const jsonResp = await userObj.json();
        const success = [];
        if (jsonResp.code === 200) {
            this.setState({ statsData: jsonResp.data });
            success.push(1);
        }
        const animeObj = await fetch("/api/showtimes/latestanime");
        const animeResp = await animeObj.json();
        if (animeResp.code === 200) {
            this.setState({ animeData: animeResp.data });
            success.push(2);
        }
        if (success.length === 2) {
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { user } = this.props;
        const { isLoading, animeData, statsData } = this.state;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>{pageTitle} :: naoTimesUI</title>
                    <MetadataHead.SEO title={pageTitle} urlPath="/admin" />
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user}>
                    <div className="container mx-auto px-6 py-8">
                        <h2 className="font-light dark:text-gray-200 pb-4">Statistik</h2>
                        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
                            {isLoading ? (
                                <SkeletonLoader.StatsCard />
                            ) : (
                                statsData.map((res) => {
                                    return (
                                        <StatsCard
                                            key={`stats-card-${res.key}`}
                                            type={res.key as IStatsType}
                                            amount={res.data}
                                        />
                                    );
                                })
                            )}
                        </div>
                    </div>
                    <div className="container mx-auto px-6 py-8">
                        <h2 className="font-light dark:text-gray-200 pb-4">Sedang digarap</h2>
                        {isLoading ? <SkeletonLoader.AdminOverview /> : <AdminAnimeSets data={animeData} />}
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({ req }: NextServerSideContextWithSession) {
    const user = req.session.get<IUserAuth>("user");

    if (!user) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    return { props: { user: { loggedIn: true, ...user } } };
});

export default AdminHomepage;
