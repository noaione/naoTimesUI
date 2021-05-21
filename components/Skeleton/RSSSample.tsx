import React from "react";

import Skeleton from "react-loading-skeleton";

import MotionInView from "../MotionInView";

function MainCardSkeleton({ delay }: { delay?: number }) {
    return (
        <MotionInView.div
            className="flex flex-col"
            initial={{ y: 35, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: delay || 0.25 }}
        >
            <Skeleton className="h-16 skeleton-loader" />
        </MotionInView.div>
    );
}

export default function RSSSampleSkeleton() {
    return (
        <>
            <MotionInView.div
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                <Skeleton className="skeleton-loader mt-6 !w-16 h-5" />
            </MotionInView.div>
            <div className="flex flex-col mt-2 gap-1">
                <MainCardSkeleton />
                <MainCardSkeleton delay={0.35} />
                <MainCardSkeleton delay={0.45} />
                <MainCardSkeleton delay={0.55} />
                <MainCardSkeleton delay={0.65} />
                <MainCardSkeleton delay={0.75} />
            </div>
        </>
    );
}
