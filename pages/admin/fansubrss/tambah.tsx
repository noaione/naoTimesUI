import React from "react";
import Head from "next/head";

import AdminLayout from "../../../components/AdminLayout";
import MetadataHead from "../../../components/MetadataHead";

import { FansubRSSSchemas } from "../../../lib/fsrss";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "../../../lib/session";
import { emitSocketAndWait } from "../../../lib/socket";
import { isNone, Nullable } from "../../../lib/utils";

import { UserProps } from "../../../models/user";

interface FansubRSSTambahState {
    isSubmit: boolean;
}

interface FansubRSSTambahProps {
    user?: UserProps & { loggedIn: boolean };
    totalData: number;
    isPremium: boolean;
}

class FansubrssIndex extends React.Component<FansubRSSTambahProps, FansubRSSTambahState> {
    constructor(props: FansubRSSTambahProps) {
        super(props);
        this.state = {
            isSubmit: false,
        };
    }

    async submitNewRSS() {
        if (this.state.isSubmit) {
            return;
        }

        this.setState({ isSubmit: true });
    }

    render() {
        const { user, isPremium, totalData } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        const limit = isPremium ? 5 : 1;
        let canAddNew = false;
        if (!isPremium && totalData < limit) {
            canAddNew = true;
        } else if (isPremium && totalData < limit) {
            canAddNew = true;
        }

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Tambah - FansubRSS - {pageTitle} :: naoTimesUI</title>
                    <MetadataHead.SEO
                        title={"Tambah - FansubRSS - " + pageTitle}
                        urlPath="/admin/fansubrss"
                    />
                    <MetadataHead.CSSExtra />
                </Head>
                <AdminLayout user={user} title="Tambah RSS" active="fsrsspage">
                    <div
                        className={`container mx-auto px-6 py-8 justify-center ${
                            !canAddNew && "text-center flex flex-col"
                        }`}
                    >
                        {!canAddNew ? (
                            <>
                                <p className="dark:text-white font-light text-center text-2xl">Maaf!</p>
                                <p className="dark:text-white font-semibold text-center text-lg">
                                    Anda telah menyampai batas untuk total RSS!
                                </p>
                                <code className="dark:text-blue-400 text-blue-500">{`Batas: ${limit}`}</code>
                                {!isPremium && (
                                    <div className="mt-2 flex flex-col dark:text-white">
                                        <p>Silakan donasi untuk mendapatkan akses RSS lebih banyak!</p>
                                        <p>
                                            Setelah donasi, mohon kontak{" "}
                                            <strong className="underline">N4O#8868</strong>
                                        </p>
                                    </div>
                                )}
                                <div className="flex flex-row text-center gap-2 justify-center">
                                    {!isPremium && (
                                        <a
                                            href="https://trakteer.id/noaione"
                                            className="text-pink-500 hover:text-pink-600 duration-200 transition mt-2"
                                        >
                                            Trakteer/Donasi
                                        </a>
                                    )}
                                    <a
                                        href="/admin/fansubrss"
                                        className="text-center text-yellow-500 hover:text-yellow-600 duration-200 transition mt-2"
                                    >
                                        Kembali
                                    </a>
                                </div>
                            </>
                        ) : (
                            <p className="dark:text-white font-light text-center text-2xl">Akan datang!</p>
                        )}
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
    if (user.privilege === "owner") {
        return {
            notFound: true,
        };
    }

    const rssSchemas: Nullable<FansubRSSSchemas> = await emitSocketAndWait("fsrss get", { id: user.id });
    let isPremium = false;
    let totalData = 0;
    if (!isNone(rssSchemas)) {
        isPremium = rssSchemas?.premium ?? false;
        totalData = rssSchemas.feeds.length;
    }

    return { props: { user: { loggedIn: true, ...user }, isPremium, totalData } };
});

export default FansubrssIndex;
