import Link from "next/link";
import React from "react";

import { FansubRSSFeeds } from "../../lib/fsrss";
import MotionInView from "../MotionInView";

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
            <MotionInView.div
                className="p-5 bg-white dark:bg-gray-700 rounded shadow-md"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: animateDelay || 0.25 }}
            >
                <div className="flex flex-col justify-center">
                    <Link href={"/admin/fansubrss/" + id} passHref>
                        <a className="text-xl font-bold text-gray-900 dark:text-gray-200 hover:underline break-all">
                            {feedUrl}
                        </a>
                    </Link>
                </div>
                <div className="text-base text-gray-400 break-all">ID: {id}</div>
                <div className="text-base text-gray-400 break-all">Channel ID: {channel}</div>
            </MotionInView.div>
        );
    }
}

export default FansubRSSOverview;
