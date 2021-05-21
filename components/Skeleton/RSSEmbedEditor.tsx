import React from "react";

import Skeleton from "react-loading-skeleton";

import MotionInView, { MotionViewVariants } from "../MotionInView";

function SkeletonInputBox() {
    return <Skeleton className="skeleton-loader h-10" />;
}

const AnimateFlyFromLeft25: MotionViewVariants = {
    hidden: {
        x: -25,
        opacity: 0,
    },
    visible: {
        x: 0,
        opacity: 1,
    },
};

const AnimateFlyFromLeft30: MotionViewVariants = {
    hidden: {
        x: -30,
        opacity: 0,
    },
    visible: {
        x: 0,
        opacity: 1,
    },
};

const AnimateFlyFromBottom30: MotionViewVariants = {
    hidden: {
        y: 30,
        opacity: 0,
    },
    visible: {
        y: 0,
        opacity: 1,
    },
};

export default function RSSEmbedEditorSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row w-full gap-4">
            <div className="flex flex-col w-full lg:w-1/2 gap-3">
                <MotionInView.div
                    className="flex flex-col"
                    initial="hidden"
                    animate="visible"
                    variants={AnimateFlyFromLeft25}
                    transition={{ delay: 0.2 }}
                >
                    <Skeleton className="skeleton-loader h-6 !w-14" />
                    <SkeletonInputBox />
                </MotionInView.div>

                <MotionInView.div
                    initial="hidden"
                    animate="visible"
                    variants={AnimateFlyFromLeft30}
                    transition={{ delay: 0.3 }}
                >
                    <Skeleton className="skeleton-loader h-6 !w-[3.75rem]" />
                </MotionInView.div>
                <MotionInView.div
                    className="flex flex-col -mt-2"
                    initial="hidden"
                    animate="visible"
                    variants={AnimateFlyFromLeft30}
                    transition={{ delay: 0.4 }}
                >
                    <Skeleton className="skeleton-loader h-4 !w-10" />
                    <SkeletonInputBox />
                </MotionInView.div>
                <MotionInView.div
                    className="flex flex-col"
                    initial="hidden"
                    animate="visible"
                    variants={AnimateFlyFromLeft30}
                    transition={{ delay: 0.5 }}
                >
                    <Skeleton className="skeleton-loader h-4 !w-[3.8rem]" />
                    <SkeletonInputBox />
                </MotionInView.div>
                <MotionInView.div
                    className="flex flex-col"
                    initial="hidden"
                    animate="visible"
                    variants={AnimateFlyFromLeft30}
                    transition={{ delay: 0.6 }}
                >
                    <Skeleton className="skeleton-loader h-4 !w-8" />
                    <SkeletonInputBox />
                </MotionInView.div>
                <div className="flex flex-col">
                    <MotionInView.div
                        initial="hidden"
                        animate="visible"
                        variants={AnimateFlyFromLeft30}
                        transition={{ delay: 0.7 }}
                    >
                        <Skeleton className="skeleton-loader h-4 !w-40" />
                    </MotionInView.div>
                    <div className="flex flex-col md:flex-row w-full gap-2">
                        <MotionInView.div
                            className="flex flex-col w-full"
                            initial="hidden"
                            animate="visible"
                            variants={AnimateFlyFromLeft30}
                            transition={{ delay: 0.75 }}
                        >
                            <Skeleton className="skeleton-loader h-4 !w-[3.4rem]" />
                            <SkeletonInputBox />
                        </MotionInView.div>
                        <MotionInView.div
                            className="flex flex-col w-full"
                            initial="hidden"
                            animate="visible"
                            variants={AnimateFlyFromLeft30}
                            transition={{ delay: 0.75 }}
                        >
                            <Skeleton className="skeleton-loader h-4 !w-[3.8rem]" />
                            <SkeletonInputBox />
                        </MotionInView.div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <MotionInView.div
                        initial="hidden"
                        animate="visible"
                        variants={AnimateFlyFromLeft30}
                        transition={{ delay: 0.8 }}
                    >
                        <Skeleton className="skeleton-loader h-4 !w-12" />
                    </MotionInView.div>
                    <div className="flex flex-col md:flex-row w-full gap-2">
                        <MotionInView.div
                            className="flex flex-col w-full"
                            initial="hidden"
                            animate="visible"
                            variants={AnimateFlyFromLeft30}
                            transition={{ delay: 0.85 }}
                        >
                            <Skeleton className="skeleton-loader h-4 !w-9" />
                            <SkeletonInputBox />
                        </MotionInView.div>
                        <MotionInView.div
                            className="flex flex-col w-full"
                            initial="hidden"
                            animate="visible"
                            variants={AnimateFlyFromLeft30}
                            transition={{ delay: 0.85 }}
                        >
                            <Skeleton className="skeleton-loader h-4 !w-9" />
                            <SkeletonInputBox />
                        </MotionInView.div>
                    </div>
                </div>
                <MotionInView.div
                    className="flex flex-row items-center gap-2"
                    initial="hidden"
                    animate="visible"
                    variants={AnimateFlyFromLeft30}
                    transition={{ delay: 0.9 }}
                >
                    <Skeleton className="skeleton-loader !w-5 h-5" />
                    <Skeleton className="skeleton-loader !w-36 h-4 mt-2" />
                </MotionInView.div>
                <div className="flex flex-col">
                    <MotionInView.div
                        initial="hidden"
                        animate="visible"
                        variants={AnimateFlyFromLeft30}
                        transition={{ delay: 1 }}
                    >
                        <Skeleton className="skeleton-loader h-4 !w-24" />
                    </MotionInView.div>
                    <div className="flex flex-row gap-2 w-full">
                        <MotionInView.div
                            className="flex flex-col w-full"
                            initial="hidden"
                            animate="visible"
                            variants={AnimateFlyFromLeft30}
                            transition={{ delay: 1.05 }}
                        >
                            <SkeletonInputBox />
                        </MotionInView.div>
                        <MotionInView.div
                            className="flex flex-col"
                            initial="hidden"
                            animate="visible"
                            variants={AnimateFlyFromLeft30}
                            transition={{ delay: 1.075 }}
                        >
                            <Skeleton className="skeleton-loader h-10 !w-14" />
                        </MotionInView.div>
                    </div>
                </div>
                <MotionInView.div
                    className="flex flex-col w-full"
                    initial="hidden"
                    animate="visible"
                    variants={AnimateFlyFromBottom30}
                    transition={{ delay: 1.1 }}
                >
                    <Skeleton className="skeleton-loader h-10" />
                </MotionInView.div>
            </div>
            <div className="flex flex-col w-full lg:w-1/2 h-full">
                <MotionInView.div
                    initial="hidden"
                    animate="visible"
                    variants={AnimateFlyFromLeft25}
                    transition={{ delay: 0.6 }}
                >
                    <Skeleton className="skeleton-loader h-6 !w-[5.5rem]" />
                </MotionInView.div>
                <MotionInView.div
                    className="w-full h-full flex flex-col overflow-hidden mt-2"
                    initial="hidden"
                    animate="visible"
                    variants={AnimateFlyFromBottom30}
                    transition={{ delay: 0.7 }}
                >
                    <Skeleton className="skeleton-loader h-[10rem] lg:h-[40.75rem]" />
                </MotionInView.div>
                <div className="flex flex-row mt-2 gap-2">
                    <MotionInView.div
                        className="flex flex-row items-center gap-1"
                        initial="hidden"
                        animate="visible"
                        variants={AnimateFlyFromBottom30}
                        transition={{ delay: 0.9 }}
                    >
                        <Skeleton className="skeleton-loader !w-5 h-5" />
                        <Skeleton className="skeleton-loader !w-24 h-4 mt-2" />
                    </MotionInView.div>
                    <MotionInView.div
                        className="flex flex-row items-center gap-1"
                        initial="hidden"
                        animate="visible"
                        variants={AnimateFlyFromBottom30}
                        transition={{ delay: 1 }}
                    >
                        <Skeleton className="skeleton-loader !w-5 h-5" />
                        <Skeleton className="skeleton-loader !w-20 h-4 mt-2" />
                    </MotionInView.div>
                </div>
            </div>
        </div>
    );
}
