import { capitalize, get as loGet } from "lodash";
import React from "react";
import CountUp from "react-countup";

import PencilIcon from "mdi-react/PencilIcon";
import TVIcon from "mdi-react/TelevisionIcon";
import AdminIcon from "mdi-react/AccountIcon";
import DoneIcon from "mdi-react/CheckAllIcon";
import ServerIcon from "mdi-react/ServerIcon";

export type IStatsType = "anime" | "server" | "proyek" | "admin" | "ongoing" | "done" | "skeleton";

export interface IStatsProps {
    type: IStatsType;
    amount?: number;
}

function getIcon(type: IStatsType) {
    if (type === "anime") {
        return <TVIcon />;
    } else if (type === "done") {
        return <DoneIcon />;
    } else if (type === "admin") {
        return <AdminIcon />;
    } else if (type === "server") {
        return <ServerIcon />;
    } else if (["proyek", "ongoing"].includes(type)) {
        return <PencilIcon />;
    }
    return null;
}

function typeToName(type: IStatsType) {
    switch (type) {
        case "ongoing":
            return "Dikerjakan";
        case "done":
            return "Selesai";
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
            anime: "bg-blue-500",
            server: "bg-purple-500",
            proyek: "bg-yellow-500",
            admin: "bg-red-500",
            ongoing: "bg-yellow-500",
            done: "bg-green-500",
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
