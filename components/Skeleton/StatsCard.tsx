import React from "react";
import Skeleton from "react-loading-skeleton";

function CardSkeleton() {
    return (
        <div className="p-5 bg-white dark:bg-gray-700 rounded shadow-md">
            <div className="flex flex-row items-center py-1">
                <div className="w-14 h-14">
                    <Skeleton circle className="w-full h-full !rounded-full skeleton-loader" />
                </div>
                <div className="w-[70%] ml-4">
                    <Skeleton className="!w-12 h-6 mb-1 skeleton-loader" />
                    <Skeleton className="skeleton-loader" />
                </div>
            </div>
        </div>
    );
}

export default function StatsCardSkeleton() {
    return (
        <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
        </>
    );
}
