import React from "react";

import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

function SkeletonInputBox() {
    return <Skeleton className="skeleton-loader h-10" />;
}

export default function RSSEmbedEditorSkeleton() {
    return (
        <div className="flex flex-col lg:flex-row w-full gap-4">
            <div className="flex flex-col w-full lg:w-1/2 gap-3">
                <motion.div
                    className="flex flex-col"
                    initial={{ x: -25, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <Skeleton className="skeleton-loader h-6 !w-14" />
                    <SkeletonInputBox />
                </motion.div>

                <motion.div
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Skeleton className="skeleton-loader h-6 !w-[3.75rem]" />
                </motion.div>
                <motion.div
                    className="flex flex-col -mt-2"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Skeleton className="skeleton-loader h-4 !w-10" />
                    <SkeletonInputBox />
                </motion.div>
                <motion.div
                    className="flex flex-col"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Skeleton className="skeleton-loader h-4 !w-[3.8rem]" />
                    <SkeletonInputBox />
                </motion.div>
                <motion.div
                    className="flex flex-col"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Skeleton className="skeleton-loader h-4 !w-8" />
                    <SkeletonInputBox />
                </motion.div>
                <div className="flex flex-col">
                    <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Skeleton className="skeleton-loader h-4 !w-40" />
                    </motion.div>
                    <div className="flex flex-col md:flex-row w-full gap-2">
                        <motion.div
                            className="flex flex-col w-full"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.75 }}
                        >
                            <Skeleton className="skeleton-loader h-4 !w-[3.4rem]" />
                            <SkeletonInputBox />
                        </motion.div>
                        <motion.div
                            className="flex flex-col w-full"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.75 }}
                        >
                            <Skeleton className="skeleton-loader h-4 !w-[3.8rem]" />
                            <SkeletonInputBox />
                        </motion.div>
                    </div>
                </div>
                <div className="flex flex-col">
                    <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Skeleton className="skeleton-loader h-4 !w-12" />
                    </motion.div>
                    <div className="flex flex-col md:flex-row w-full gap-2">
                        <motion.div
                            className="flex flex-col w-full"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.85 }}
                        >
                            <Skeleton className="skeleton-loader h-4 !w-9" />
                            <SkeletonInputBox />
                        </motion.div>
                        <motion.div
                            className="flex flex-col w-full"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.85 }}
                        >
                            <Skeleton className="skeleton-loader h-4 !w-9" />
                            <SkeletonInputBox />
                        </motion.div>
                    </div>
                </div>
                <motion.div
                    className="flex flex-row items-center gap-2"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                >
                    <Skeleton className="skeleton-loader !w-5 h-5" />
                    <Skeleton className="skeleton-loader !w-36 h-4 mt-2" />
                </motion.div>
                <div className="flex flex-col">
                    <motion.div
                        initial={{ x: -30, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                    >
                        <Skeleton className="skeleton-loader h-4 !w-24" />
                    </motion.div>
                    <div className="flex flex-row gap-2 w-full">
                        <motion.div
                            className="flex flex-col w-full"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.05 }}
                        >
                            <SkeletonInputBox />
                        </motion.div>
                        <motion.div
                            className="flex flex-col"
                            initial={{ x: -30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 1.075 }}
                        >
                            <Skeleton className="skeleton-loader h-10 !w-14" />
                        </motion.div>
                    </div>
                </div>
                <motion.div
                    className="flex flex-col w-full"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.1 }}
                >
                    <Skeleton className="skeleton-loader h-10" />
                </motion.div>
            </div>
            <div className="flex flex-col w-full lg:w-1/2 h-full">
                <Skeleton className="skeleton-loader h-6 !w-[5.5rem]" />
                <div className="w-full h-full flex flex-col overflow-hidden mt-2">
                    <Skeleton className="skeleton-loader h-[10rem] lg:h-[40.75rem]" />
                </div>
                <div className="flex flex-row mt-2 gap-2">
                    <div className="flex flex-row items-center gap-1">
                        <Skeleton className="skeleton-loader !w-5 h-5" />
                        <Skeleton className="skeleton-loader !w-24 h-4 mt-2" />
                    </div>
                    <div className="flex flex-row items-center gap-1">
                        <Skeleton className="skeleton-loader !w-5 h-5" />
                        <Skeleton className="skeleton-loader !w-20 h-4 mt-2" />
                    </div>
                </div>
            </div>
        </div>
    );
}
