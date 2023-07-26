import { capitalize, get as loGet } from "lodash";
import React from "react";
import CountUp from "react-countup";

import PencilIcon from "mdi-react/PencilIcon";
import TVIcon from "mdi-react/TelevisionIcon";
import AdminIcon from "mdi-react/AccountIcon";
import DoneIcon from "mdi-react/CheckAllIcon";
import ServerIcon from "mdi-react/ServerIcon";

export type IStatsType =
    | "STATS_PROJECT"
    | "STATS_SERVER"
    | "STATS_FINISHED"
    | "STATS_OWNERS"
    | "STATS_UNFINISHED"
    | "STATS_TOTAL"
    | "skeleton";

export interface IStatsProps {
    type: IStatsType;
    amount?: number;
}

function getIcon(type: IStatsType) {
    switch (type) {
        case "STATS_FINISHED":
            return <DoneIcon />;
        case "STATS_UNFINISHED":
            return <PencilIcon />;
        case "STATS_OWNERS":
            return <AdminIcon />;
        case "STATS_PROJECT":
            return <TVIcon />;
        case "STATS_SERVER":
            return <ServerIcon />;
        case "STATS_TOTAL":
            return <TVIcon />;
        default:
            return null;
    }
}

function typeToName(type: IStatsType) {
    switch (type) {
        case "STATS_UNFINISHED":
            return "Dikerjakan";
        case "STATS_FINISHED":
            return "Selesai";
        case "STATS_OWNERS":
            return "Pemilik";
        case "STATS_PROJECT":
            return "Proyek";
        case "STATS_SERVER":
            return "Peladen";
        case "STATS_TOTAL":
            return "Total";
        default:
            return capitalize(type);
    }
}

class StatsCard extends React.Component<IStatsProps> {
    constructor(props: IStatsProps) {
        super(props);
    }

    render() {
        const { type, amount } = this.props;
        const TYPE_MAP = {
            STATS_SERVER: "bg-purple-500",
            STATS_PROJECT: "bg-yellow-500",
            STATS_OWNERS: "bg-red-500",
            STATS_UNFINISHED: "bg-yellow-500",
            STATS_FINISHED: "bg-green-500",
            STATS_TOTAL: "bg-blue-500",
        };

        const coloredBG = loGet(TYPE_MAP, this.props.type, "bg-gray-300 dark:bg-gray-600");
        let realAmount = 0;
        if (typeof amount === "number") {
            realAmount = amount;
        }

        return (
            <>
                <div className="p-5 bg-white dark:bg-gray-700 rounded shadow-md">
                    <div className="flex items-center pt-1">
                        <div className={"icon w-14 p-4 " + coloredBG + " text-white rounded-full mr-3 "}>
                            {getIcon(type)}
                        </div>
                        <div className="flex flex-col justify-center">
                            <div>
                                <CountUp
                                    className="text-2xl font-bold text-gray-900 dark:text-gray-200"
                                    duration={2}
                                    useEasing
                                    start={0}
                                    formattingFn={(val) => val.toLocaleString()}
                                    end={realAmount}
                                />
                            </div>
                            <div className="text-base text-gray-400 break-all">{typeToName(type)}</div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default StatsCard;
