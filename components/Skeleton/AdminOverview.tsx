import React from "react";
import Skeleton from "react-loading-skeleton";

function CardSkeleton() {
    return (
        <div className="w-full lg:max-w-full lg:flex bg-white dark:bg-gray-700 dark:text-white shadow-lg rounded-lg break-all">
            <div className="h-full lg:w-28 flex-none rounded-t-lg lg:rounded-t-none lg:rounded-l-lg text-center overflow-hidden">
                <Skeleton className="naotimes-skeleton" containerClassName="flex w-full h-full" />
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 flex flex-col justify-between leading-normal rounded-b-lg lg:rounded-b-none lg:rounded-r-lg w-full">
                <div className="mb-8">
                    <Skeleton className="naotimes-skeleton h-6" />
                    <Skeleton className="naotimes-skeleton h-4 !w-[50%] my-2 mt-4" />
                    <div className="inline-block w-full gap-1">
                        <Skeleton
                            className="naotimes-skeleton"
                            containerClassName="flex flex-row gap-1 h-6"
                            count={7}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminOverviewSkeleton() {
    return (
        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </div>
    );
}
