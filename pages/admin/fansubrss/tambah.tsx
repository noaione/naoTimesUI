import React from "react";
import Head from "next/head";
import Link from "next/link";

import AdminLayout from "@/components/AdminLayout";
import MetadataHead from "@/components/MetadataHead";
import ErrorModal from "@/components/ErrorModal";
import FansubRSSCreateNew from "@/components/FansubRSS/CreateNew";
import { CallbackModal } from "@/components/Modal";

import { FansubRSSSchemas } from "@/lib/fsrss";
import withSession, { IUserAuth, NextServerSideContextWithSession } from "@/lib/session";
import { emitSocketAndWait } from "@/lib/socket";
import { isNone, Nullable } from "@/lib/utils";

interface FansubRSSTambahProps {
    user?: IUserAuth & { loggedIn: boolean };
    totalData: number;
    isPremium: boolean;
}

interface FansubRSSTambahState {
    errorText: string;
}

class FansubrssIndex extends React.Component<FansubRSSTambahProps, FansubRSSTambahState> {
    modalCb: CallbackModal;

    constructor(props: FansubRSSTambahProps) {
        super(props);
        this.showErrorCallback = this.showErrorCallback.bind(this);

        this.state = {
            errorText: "",
        };
    }

    showErrorCallback(errorText: string) {
        this.setState({ errorText });
        if (this.modalCb) {
            this.modalCb.showModal();
        }
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
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            Trakteer/Donasi
                                        </a>
                                    )}
                                    <Link href="/admin/fansubrss" passHref>
                                        <a className="text-center text-yellow-500 hover:text-yellow-600 duration-200 transition mt-2">
                                            Kembali
                                        </a>
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <FansubRSSCreateNew
                                id={this.props.user.id as string}
                                onErrorModal={this.showErrorCallback}
                            />
                        )}
                    </div>
                    <ErrorModal onMounted={(cb) => (this.modalCb = cb)}>{this.state.errorText}</ErrorModal>
                </AdminLayout>
            </>
        );
    }
}

export const getServerSideProps = withSession(async function ({ req }: NextServerSideContextWithSession) {
    let user = req.session.get<IUserAuth>("user");

    if (!user) {
        return {
            redirect: {
                destination: "/?cb=/admin/fansubrss/tambah",
                permanent: false,
            },
        };
    }

    if (user.authType === "discord") {
        // override with server info
        user = req.session.get<IUserAuth>("userServer");
        if (!user) {
            return {
                redirect: {
                    destination: "/discord",
                    permanent: false,
                },
            };
        }
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
        totalData = rssSchemas?.feeds?.length ?? 0;
    }

    return { props: { user: { loggedIn: true, ...user }, isPremium, totalData } };
});

export default FansubrssIndex;
