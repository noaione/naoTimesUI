import React from "react";
import { motion } from "framer-motion";

import { FansubRSSFeeds } from "../../lib/fsrss";

interface FSRSSProps {
    feed: FansubRSSFeeds;
    animateDelay?: number;
}

class FansubRSSOverview extends React.Component<FSRSSProps> {
    constructor(props: FSRSSProps) {
        super(props);
    }

    render() {
        const { feed, animateDelay } = this.props;
        const { id, channel, feedUrl } = feed;

        return (
            <motion.div
                className="p-5 bg-white dark:bg-gray-700 rounded shadow-md"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: animateDelay || 0.25 }}
            >
                <div className="flex flex-col justify-center">
                    <a
                        href={"/admin/fansubrss/" + id}
                        className="text-xl font-bold text-gray-900 dark:text-gray-200 hover:underline break-all"
                    >
                        {feedUrl}
                    </a>
                </div>
                <div className="text-base text-gray-400 break-all">ID: {id}</div>
                <div className="text-base text-gray-400 break-all">Channel ID: {channel}</div>
            </motion.div>
        );
    }
}

export default FansubRSSOverview;
