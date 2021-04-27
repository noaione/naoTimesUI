import React from "react";
import Head from "next/head";

import AdminLayout from "../../../components/AdminLayout";
import MetadataHead from "../../../components/MetadataHead";

import dbConnect from "../../../lib/dbConnect";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../../lib/session";
import { isNone, Nullable } from "../../../lib/utils";

import { UserProps } from "../../../models/user";
import { ShowAnimeProps, ShowtimesModel, ShowtimesProps } from "../../../models/show";

interface ProyekPageProps {
    user?: UserProps & { loggedIn: boolean };
    animeData: ShowAnimeProps;
}

class ProyekHomepage extends React.Component<ProyekPageProps, {}> {
    constructor(props: ProyekPageProps) {
        super(props);
    }

    render() {
        const { user, animeData } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";
        const { title } = animeData;

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>
                        {title} - {pageTitle} :: naoTimesUI
                    </title>
                    <MetadataHead.SEO
                        title={title + " - " + pageTitle}
                        urlPath={"/admin/proyek/" + animeData.id}
                    />
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user} title={title} active="projectpage">
                    <div className="container mx-auto px-6 py-8">
                        <h2 className="font-light dark:text-gray-200 pb-4">Proyek</h2>
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({
    req,
    params,
}: NextServerSideContextWithSession) {
    const user = req.session.get<IUserAuth>("user") as UserProps;
    const { aniid } = params;

    if (!user) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    await dbConnect();
    const serverRes = (await ShowtimesModel.findOne({ id: { $eq: user.id } }).lean()) as ShowtimesProps;
    let findAnime: Nullable<ShowAnimeProps>;
    serverRes.anime.forEach((res) => {
        if (res.id === aniid && isNone(findAnime)) {
            findAnime = res;
        }
    });
    if (isNone(findAnime)) {
        return {
            notFound: true,
        };
    }

    return { props: { user: { loggedIn: true, ...user }, animeData: findAnime } };
});

export default ProyekHomepage;
