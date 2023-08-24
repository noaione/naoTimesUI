import React from "react";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";

import PlusIcon from "mdi-react/PlusIcon";

import AdminLayout from "@/components/Admin";
import MetadataHead from "@/components/MetadataHead";
import SkeletonLoader from "@/components/Skeleton";
import RolePopup from "@/components/RolePopup";

import { expandRoleLocalized, expandRoleName, Nullable } from "@/lib/utils";
import { GetLatestProjectInfoDocument, LatestProjectFragment } from "@/lib/graphql/projects.generated";
import client from "@/lib/graphql/client";
import { UserSessFragment } from "@/lib/graphql/auth.generated";
import { AuthContext } from "@/components/AuthSuspense";
import { SERVER_UNSELECT } from "@/lib/graphql/error-code";
import ErrorModal from "@/components/ErrorModal";
import { CallbackModal } from "@/components/Modal";
import { buildImageUrl } from "@/components/ImageMetadata";
import { ProjectAssigneeInfo } from "@/lib/graphql/types.generated";

interface ProyekCardProps {
    proyek: LatestProjectFragment;
}

function getAssigneeNameV2(info?: Omit<ProjectAssigneeInfo, "integrations">) {
    if (!info) {
        return "Tidak diketahui";
    }
    if (!info.name) {
        return "Tidak diketahui";
    }
    return info.name;
}

class ProyekSimpleCard extends React.Component<ProyekCardProps> {
    constructor(props: ProyekCardProps) {
        super(props);
    }

    render() {
        const { proyek } = this.props;
        const { id, title, assignments, poster, statuses } = proyek;

        const lastStatus = statuses[0];

        return (
            <>
                <div className="w-full lg:max-w-full lg:flex bg-white dark:bg-gray-700 rounded-lg shadow-lg  break-all">
                    <div
                        onClick={() => Router.push("/admin/peladen/proyek/" + id)}
                        className="h-48 lg:h-auto lg:w-28 flex-none bg-cover rounded-t-lg lg:rounded-t-none lg:rounded-l-lg text-center overflow-hidden cursor-pointer"
                        style={{ backgroundImage: `url(${buildImageUrl(poster.image, "poster")})` }}
                        title={title}
                    />
                    <div className="p-4 flex flex-col justify-between leading-normal rounded-b-lg lg:rounded-b-none lg:rounded-r-lg">
                        <div className="flex flex-col py-1">
                            <Link
                                href={`/admin/peladen/proyek/${id}`}
                                className="text-xl font-bold align-top text-gray-900 dark:text-gray-200 no-underline hover:underline cursor-pointer"
                            >
                                {title}
                            </Link>
                            {lastStatus.isReleased ? (
                                <div className="text-base font-semibold text-green-500">Tamat</div>
                            ) : (
                                <div className="text-base font-semibold text-red-500">Proses</div>
                            )}
                            <div className="flex flex-row flex-wrap gap-1 pt-2 text-center">
                                {lastStatus.roles.map((role) => {
                                    const assignee = assignments.find((a) => a.key === role.key);
                                    const name = getAssigneeNameV2(assignee?.assignee);
                                    const override = expandRoleName(role.key);
                                    const expandedRole = expandRoleLocalized(role.key, role.name);
                                    const popuptext = `${expandedRole}: ${name}`;
                                    return (
                                        <RolePopup
                                            key={`${role.key}-project-${proyek.id}`}
                                            title={role.key}
                                            popupText={popuptext}
                                            overrideTitle={override}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

interface ProyekHomepageState {
    isLoading: boolean;
    projects: LatestProjectFragment[];
    cursor: Nullable<string>;
    error?: string;
    firstFetch: boolean;
    canLoadMore: boolean;
}

interface ProyekHomepageProps {
    user: UserSessFragment;
}

class ServerProyekHomepage extends React.Component<ProyekHomepageProps, ProyekHomepageState> {
    modalCb?: CallbackModal;

    constructor(props: ProyekHomepageProps) {
        super(props);
        this.showErrorCallback = this.showErrorCallback.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.state = {
            isLoading: true,
            cursor: null,
            projects: [],
            firstFetch: true,
            canLoadMore: true,
        };
    }

    showErrorCallback(error: string) {
        this.setState({ error });
        if (this.modalCb) {
            this.modalCb.showModal();
        }
    }

    async componentDidMount() {
        const { data, error } = await client.query({
            query: GetLatestProjectInfoDocument,
            variables: {
                includeLast: true,
            },
            fetchPolicy: "network-only",
        });
        if (error) {
            this.showErrorCallback(error.message);
            this.setState({ isLoading: false, firstFetch: false, canLoadMore: false });
        }

        if (data.latests.__typename === "Result") {
            if (data.latests.code === SERVER_UNSELECT) {
                Router.push("/admin");
            } else {
                this.showErrorCallback(data.latests.message);
                this.setState({
                    isLoading: false,
                    firstFetch: false,
                    canLoadMore: false,
                });
            }
            return;
        }

        this.setState({
            isLoading: false,
            error: undefined,
            projects: data.latests.nodes,
            firstFetch: false,
            canLoadMore: typeof data.latests.pageInfo.nextCursor === "string",
            cursor: data.latests.pageInfo.nextCursor,
        });
        setTimeout(() => {
            this.loadMore()
                .then(() => {})
                .catch(() => {});
        }, 1000);
    }

    async loadMore() {
        const { cursor, canLoadMore, isLoading } = this.state;
        if (isLoading) {
            return;
        }
        if (!canLoadMore) {
            return;
        }
        this.setState({ isLoading: true });

        const { data, error } = await client.query({
            query: GetLatestProjectInfoDocument,
            variables: {
                cursor: cursor,
                includeLast: true,
            },
            fetchPolicy: "network-only",
        });
        if (error) {
            this.showErrorCallback(error.message);
            this.setState({ isLoading: false, canLoadMore: false, cursor: null });
        }

        if (data.latests.__typename === "Result") {
            if (data.latests.code === SERVER_UNSELECT) {
                Router.push("/admin");
            } else {
                this.showErrorCallback(data.latests.message);
                this.setState({
                    isLoading: false,
                    canLoadMore: false,
                });
            }
            return;
        }

        this.setState({
            isLoading: false,
            error: undefined,
            projects: [...this.state.projects, ...data.latests.nodes],
            canLoadMore: typeof data.latests.pageInfo.nextCursor === "string",
            cursor: data.latests.pageInfo.nextCursor,
        });
        setTimeout(() => {
            this.loadMore()
                .then(() => {})
                .catch(() => {});
        }, 1000);
    }

    render() {
        const { isLoading, projects } = this.state;
        const { user } = this.props;
        console.log(isLoading, this.state.canLoadMore, this.state.cursor);

        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>Proyek :: naoTimesUI</title>
                    <MetadataHead.SEO title="Proyek" urlPath="/admin/peladen/proyek" />
                </Head>
                <AdminLayout user={user} title="Proyek" active="project">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex flex-row gap-2">
                            <Link
                                href="/admin/peladen/proyek/tambah"
                                className="flex flex-row px-3 py-2 rounded-lg bg-green-500 text-white transition hover:bg-green-700 duration-200 ease-in-out items-center"
                            >
                                <PlusIcon className="font-bold mr-1" />
                                <span className="font-semibold mt-0.5">Tambah</span>
                            </Link>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 mt-4">
                            {projects.length > 0 ? (
                                projects.map((project) => {
                                    return (
                                        <ProyekSimpleCard proyek={project} key={`project-${project.id}`} />
                                    );
                                })
                            ) : (
                                <>
                                    {!this.state.firstFetch && (
                                        <span className="font-bold dark:text-gray-200 text-xl">
                                            Tidak ada proyek yang terdaftar
                                        </span>
                                    )}
                                </>
                            )}
                            {isLoading && (
                                // repeat 5 times
                                <>
                                    {[...Array(5)].map((_, i) => (
                                        <SkeletonLoader.ProjectSingle key={`extra-loading-${i}`} />
                                    ))}
                                </>
                            )}
                        </div>
                        <ErrorModal onMounted={(cb) => (this.modalCb = cb)}>{this.state.error}</ErrorModal>
                    </div>
                </AdminLayout>
            </>
        );
    }
}

export default function WrappedServerProyekHomepage() {
    return (
        <AuthContext.Consumer>{(sess) => sess && <ServerProyekHomepage user={sess} />}</AuthContext.Consumer>
    );
}
