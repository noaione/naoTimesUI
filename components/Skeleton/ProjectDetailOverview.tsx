import React from "react";
import Skeleton from "react-loading-skeleton";

function ContainedEpisodeViewSkeleton() {
    return (
        <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm flex flex-col">
            <div className="flex flex-row justify-between">
                <Skeleton
                    containerTestId="episode-title"
                    className="naotimes-skeleton h-8"
                    containerClassName="w-1/2"
                />
                <Skeleton
                    containerTestId="episode-edit-btn"
                    className="naotimes-skeleton h-8"
                    containerClassName="w-1/6"
                />
            </div>
            <Skeleton
                containerTestId="release-text"
                className="naotimes-skeleton h-4"
                containerClassName="mt-2 w-1/2"
            />
            <Skeleton
                containerTestId="airing-time-text"
                className="naotimes-skeleton h-4"
                containerClassName="mt-1"
            />
            <Skeleton
                containerTestId="ongoing-head-text"
                className="naotimes-skeleton h-5"
                containerClassName="mt-3 w-1/2"
            />
            <Skeleton
                containerTestId="ongoing-role-container"
                className="naotimes-skeleton h-8"
                containerClassName="mt-2 flex flex-row gap-1"
                count={7}
            />
            <Skeleton
                containerTestId="done-head-text"
                className="naotimes-skeleton h-5"
                containerClassName="mt-3 w-1/2"
            />
            <Skeleton
                containerTestId="done-role-container"
                className="naotimes-skeleton h-8"
                containerClassName="mt-2 flex flex-row gap-1"
                count={7}
            />
        </div>
    );
}

export function ProjectDetailEpisodeSkeleton() {
    return (
        <div className="container mx-auto px-6 py-8 mb-6">
            <div className="flex flex-col">
                <Skeleton
                    containerTestId="episode-title-header"
                    className="naotimes-skeleton h-8"
                    containerClassName="w-1/2 md:w-1/6"
                />
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                    <ContainedEpisodeViewSkeleton />
                    <ContainedEpisodeViewSkeleton />
                    <ContainedEpisodeViewSkeleton />
                    <ContainedEpisodeViewSkeleton />
                    <ContainedEpisodeViewSkeleton />
                    <ContainedEpisodeViewSkeleton />
                </div>
            </div>
        </div>
    );
}

export default function ProjectDetailOverviewSkeleton() {
    return (
        <div className="container mx-auto px-6 py-8">
            <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
                <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-md">
                    <div className="flex flex-col md:flex-row">
                        <div className="h-[25rem] w-[16.6rem] p-1 mx-auto md:mr-3 md:ml-0">
                            <Skeleton
                                containerTestId="image-container"
                                containerClassName="w-full h-full"
                                className="naotimes-skeleton w-full h-full"
                            />
                        </div>
                        <div className="flex flex-col md:w-1/2 pt-2">
                            <Skeleton containerTestId="title-container" className="naotimes-skeleton h-6" />
                            <div className="flex flex-row w-full mt-2">
                                <Skeleton
                                    containerTestId="alias-container"
                                    className="naotimes-skeleton h-4"
                                    containerClassName="h-4 w-24 flex mr-2"
                                />
                                <Skeleton
                                    containerTestId="alias-container-edit"
                                    className="naotimes-skeleton h-4"
                                    containerClassName="h-4 w-8 flex"
                                />
                            </div>
                            <Skeleton
                                containerTestId="staff-text"
                                className="naotimes-skeleton h-6"
                                containerClassName="w-10 mt-2"
                            />
                            <Skeleton
                                count={7}
                                containerTestId="staff-container"
                                containerClassName="flex flex-col gap-1 mt-2"
                                className="naotimes-skeleton h-7"
                            />
                            <Skeleton
                                containerTestId="prediction-text"
                                className="naotimes-skeleton h-6"
                                containerClassName="mt-2"
                                style={{ width: "6rem" }}
                            />
                            <Skeleton
                                count={2}
                                containerTestId="prediction-container"
                                containerClassName="flex flex-row md:w-1/2 gap-1 mt-2"
                                className="naotimes-skeleton h-20"
                            />
                            <Skeleton
                                containerTestId="delete-container"
                                containerClassName="flex flex-row md:w-1/3 gap-1 mt-2"
                                className="naotimes-skeleton"
                                style={{
                                    height: "3.5rem",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
