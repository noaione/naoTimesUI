import React from "react";
import Skeleton from "react-loading-skeleton";

function CardSkeleton() {
    return (
        <div className="w-full lg:max-w-full lg:flex bg-white dark:bg-gray-700 dark:text-white shadow-lg rounded-lg break-all">
            <div className="h-48 lg:w-28 flex-none rounded-t-lg lg:rounded-t-none lg:rounded-l-lg text-center overflow-hidden">
                <Skeleton className="skeleton-loader h-full pb-1 mt-[-0.22rem] pt-[0.22rem]" />
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 flex flex-col justify-between leading-normal rounded-b-lg lg:rounded-b-none lg:rounded-r-lg w-full">
                <div className="mb-8">
                    <Skeleton className="skeleton-loader h-6" />
                    <Skeleton className="skeleton-loader h-4 !w-14 my-2 mt-4" />
                    <div className="flex flex-row gap-1 -ml-1">
                        <Skeleton className="skeleton-loader px-1 py-2 !w-10 h-6 mx-1" count={7} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProjectOverviewSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3 mt-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </div>
    );
}
