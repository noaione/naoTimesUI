import React from "react";
import Skeleton from "react-loading-skeleton";

function CardSkeleton() {
    return (
        <div className="p-5 bg-white dark:bg-gray-700 rounded shadow-md">
            <div className="flex flex-row items-center py-1">
                <div className="w-16 h-16">
                    <Skeleton circle className="w-full h-full !rounded-full naotimes-skeleton" />
                </div>
                <div className="w-[70%] ml-4">
                    <Skeleton className="!w-12 h-6 mb-1 naotimes-skeleton" />
                    <Skeleton className="naotimes-skeleton" />
                </div>
            </div>
        </div>
    );
}

export default function StatsCardSkeleton() {
    return (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </div>
    );
}
