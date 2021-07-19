import React from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";

import PlusIcon from "mdi-react/PlusIcon";

import AdminLayout from "@/components/AdminLayout";
import MetadataHead from "@/components/MetadataHead";
import SkeletonLoader from "@/components/Skeleton";

import withSession, { IUserAuth, NextServerSideContextWithSession } from "@/lib/session";
import { UserProps } from "@/models/user";
import { CollabData, Collaborations } from "@/types/collab";

class CollaborationSimpleCard extends React.Component<CollabData> {
    constructor(props: CollabData) {
        super(props);
    }

    render() {
        const { id, title, image, collaborations } = this.props;

        return (
            <div className="w-full lg:max-w-full lg:flex bg-white dark:bg-gray-700 rounded-lg shadow-lg  break-all">
                <div
                    onClick={() => Router.push("/admin/proyek/" + id + "/kolaborasi")}
                    className="h-48 lg:h-auto lg:w-28 flex-none bg-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg text-center overflow-hidden cursor-pointer"
                    style={{ backgroundImage: `url(${image})` }}
                    title={title}
                />
                <div className="p-4 flex flex-col justify-between leading-normal rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
                    <div className="flex flex-col py-1">
                        <Link href={"/admin/proyek/" + id + "/kolaborasi"} passHref>
                            <a className="text-xl font-bold align-top text-gray-900 dark:text-gray-200 no-underline hover:underline cursor-pointer">
                                {title}
                            </a>
                        </Link>
                        <div className="flex flex-row flex-wrap gap-1 pt-2 text-center">
                            {collaborations.map((collab) => {
                                return <span key={`collab-${collab.id}`}>{collab.name}</span>;
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

interface KolaborasiHomepageState {
    isLoading: boolean;
    collabData?: Collaborations;
}

interface KolaborasiHomepageProps {
    user?: UserProps & { loggedIn: boolean };
}

class KolaborasiHomepage extends React.Component<KolaborasiHomepageProps, KolaborasiHomepageState> {
    constructor(props: KolaborasiHomepageProps) {
        super(props);
        this.state = {
            isLoading: true,
        };
    }

    async componentDidMount() {
        const userObj = await fetch("/api/showtimes/proyek/collab");
        const jsonResp = await userObj.json();
        if (jsonResp.success) {
            this.setState({ collabData: jsonResp.data, isLoading: false });
        }
    }

    render() {
        const { isLoading, collabData } = this.state;
        const { user } = this.props;
        const pageTitle = user.privilege === "owner" ? "Panel Admin" : "Panel Peladen";

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Kolaborasi - {pageTitle} :: naoTimesUI</title>
                    <MetadataHead.SEO title={"Proyek - " + pageTitle} urlPath="/admin/proyek" />
                </Head>
                <AdminLayout user={user} title="Proyek" active="project">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex">
                            <Link href="/admin/proyek/tambah" passHref>
                                <a className="flex flex-row px-3 py-2 rounded-lg bg-green-500 text-white transition hover:bg-green-700 duration-200 ease-in-out items-center">
                                    <PlusIcon className="font-bold" />
                                    <span className="font-semibold mt-0.5">Tambah</span>
                                </a>
                            </Link>
                        </div>
                        {isLoading ? (
                            <SkeletonLoader.ProjectOverview />
                        ) : (
                            <>
                                {collabData.length > 0 ? (
                                    <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 mt-4">
                                        {collabData.map((proyek) => {
                                            return (
                                                <CollaborationSimpleCard
                                                    key={`proyek-${proyek.id}`}
                                                    {...proyek}
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <span className="font-bold dark:text-gray-200 text-xl">
                                        Tidak ada proyek kolaborasi yang terdaftar, daftar sekarang!
                                    </span>
                                )}
                            </>
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

    return { props: { user: { loggedIn: true, ...user } } };
});

export default KolaborasiHomepage;
