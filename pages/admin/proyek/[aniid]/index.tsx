import React from "react";
import Head from "next/head";

import { motion } from "framer-motion";

import AdminLayout from "@/components/AdminLayout";
import ErrorModal from "@/components/ErrorModal";
import MetadataHead from "@/components/MetadataHead";
import ProjectPageComponent from "@/components/ProjectPage";
import { CallbackModal } from "@/components/Modal";

import { UserSessFragment } from "@/lib/graphql/auth.generated";
import { GetProjectDocument, ProjectQueryInfoFragment } from "@/lib/graphql/projects.generated";
import client from "@/lib/graphql/client";
import { AuthContext } from "@/components/AuthSuspense";
import { InferGetStaticPropsType } from "next";
import SkeletonLoader from "@/components/Skeleton";
import { buildImageUrl } from "@/components/ImageMetadata";

interface ProyekPageProps {
    id: string;
    user: UserSessFragment;
}

interface ProyekPageState {
    errorText?: string;
    isSubmitting: boolean;
    loading: boolean;
    project?: ProjectQueryInfoFragment;
}

class ProyekMainPage extends React.Component<ProyekPageProps, ProyekPageState> {
    modalCb?: CallbackModal;

    constructor(props: ProyekPageProps) {
        super(props);
        this.showErrorCallback = this.showErrorCallback.bind(this);
        this.state = {
            isSubmitting: false,
            loading: true,
        };
    }

    showErrorCallback(errorText: string) {
        this.setState({ errorText });
        if (this.modalCb) {
            this.modalCb.showModal();
        }
    }

    async componentDidMount(): Promise<void> {
        const { data, error } = await client.query({
            query: GetProjectDocument,
            variables: {
                id: this.props.id,
            },
        });

        if (error) {
            this.showErrorCallback(error.message);
            return;
        }

        if (data.project.__typename === "Result") {
            this.showErrorCallback(data.project.message);
            return;
        }

        this.setState({
            project: data.project,
            loading: false,
        });
    }

    render() {
        const { loading, project } = this.state;
        const { user, id } = this.props;

        const title = project?.title || "Loading...";
        return (
            <>
                <Head>
                    <MetadataHead.Base />
                    <MetadataHead.Prefetch />
                    <title>{`${title} - Proyek :: naoTimesUI`}</title>
                    <MetadataHead.SEO title={`${title} - Proyek`} urlPath={`/admin/proyek/${id}`} />
                </Head>
                <AdminLayout user={user} title={title} active="projectpage">
                    {loading ? (
                        <SkeletonLoader.AdminOverview />
                    ) : (
                        <div className="container mx-auto px-6 py-8">
                            <div id="project-data" className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
                                <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-md">
                                    <div className="flex flex-col md:flex-row py-1">
                                        <div className="icon h-5/6 p-1 mx-auto md:mr-3 md:ml-0 z-[5]">
                                            <motion.img
                                                className="transition duration-300 ease-out transform hover:-translate-y-1"
                                                src={buildImageUrl(project?.poster?.image, "project")}
                                                initial={{ y: 50, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            />
                                        </div>
                                        <div className="flex flex-col md:w-1/2">
                                            <motion.div
                                                className="text-xl font-bold text-gray-900 dark:text-gray-200"
                                                initial={{ x: -25, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.1 }}
                                            >
                                                {title}
                                            </motion.div>
                                            <ProjectPageComponent.Aliases
                                                onErrorModal={this.showErrorCallback}
                                                aniId={id}
                                                aliases={project?.aliases ?? []}
                                            />
                                            <motion.div
                                                className="text-lg font-semibold text-gray-900 dark:text-gray-200 mt-1"
                                                initial={{ x: -30, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                Staf
                                            </motion.div>
                                            <div className="flex flex-col gap-2 mt-2">
                                                {project?.assignments.map((rrr, idx) => {
                                                    const name = rrr.assignee?.name || null;
                                                    const userId = rrr.assignee?.id as string;
                                                    let delayAni = 0.25;
                                                    if (idx > 0) {
                                                        delayAni = 0.25 + 0.1 * (idx + 1);
                                                    }

                                                    return (
                                                        <ProjectPageComponent.Staff
                                                            onErrorModal={this.showErrorCallback}
                                                            key={rrr.key + "-staff-" + id}
                                                            id={rrr.key}
                                                            name={name}
                                                            userId={userId}
                                                            animeId={id}
                                                            animateDelay={delayAni}
                                                        />
                                                    );
                                                })}
                                            </div>
                                            <div className="flex row mt-4 gap-3">
                                                <ProjectPageComponent.Deletion
                                                    onErrorModal={this.showErrorCallback}
                                                    id={id}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {loading ? (
                        <SkeletonLoader.StatsCard />
                    ) : (
                        <div className="container mx-auto px-6 py-4">
                            <motion.h2
                                className="flex flex-row gap-1 font-extrabold pb-3 dark:text-white items-center"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <span>Episode</span>
                            </motion.h2>
                            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                {project?.statuses.map((res, idx) => {
                                    let delayAni = 0.25;
                                    if (idx > 0) {
                                        delayAni = 0.25 + 0.1 * (idx + 1);
                                    }
                                    return (
                                        <ProjectPageComponent.Episode
                                            key={`anime-${id}-episode-${res.episode}`}
                                            onErrorModal={this.showErrorCallback}
                                            animeId={id}
                                            episode={res.episode}
                                            airTime={res.airingAt}
                                            status={res.roles}
                                            isReleased={res.isReleased}
                                            animateDelay={delayAni}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <ErrorModal onMounted={(cb) => (this.modalCb = cb)}>{this.state.errorText}</ErrorModal>
                </AdminLayout>
            </>
        );
    }
}

export function getStaticProps({ params }) {
    const { aniid } = params;

    return {
        props: {
            aniid,
        },
    };
}

export function getStaticPaths() {
    return {
        paths: [],
        fallback: true,
    };
}

export default function WrappedProyekMainPage(props: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <AuthContext.Consumer>
            {(sess) => sess && <ProyekMainPage id={props.aniid} user={sess} />}
        </AuthContext.Consumer>
    );
}
