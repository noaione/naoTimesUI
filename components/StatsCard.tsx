import _, { capitalize } from "lodash";
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

        const coloredBG = _.get(TYPE_MAP, this.props.type, "bg-gray-300 dark:bg-gray-600");
        const extraClass = type === "skeleton" ? "animate-pulse" : "";
        let realAmount = 0;
        if (typeof amount === "number") {
            realAmount = amount;
        }

        const remAmount = type === "skeleton" ? "p-8" : "p-4";

        return (
            <>
                <div className="p-5 bg-white dark:bg-gray-700 rounded shadow-sm">
                    <div className="flex items-center pt-1">
                        <div
                            className={
                                "icon w-14 " +
                                remAmount +
                                " " +
                                coloredBG +
                                " text-white rounded-full mr-3 " +
                                extraClass
                            }
                        >
                            {type !== "skeleton" ? getIcon(type) : ""}
                        </div>
                        <div className="flex flex-col justify-center">
                            {type === "skeleton" ? (
                                <>
                                    <div className="font-bold px-20 py-3 rounded-md bg-gray-500 my-1 animate-pulse"></div>
                                    <div className="font-bold px-20 py-3 rounded-md bg-gray-500 my-1 animate-pulse"></div>
                                </>
                            ) : (
                                <>
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
                                    <div className="text-base text-gray-400">{typeToName(type)}</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default StatsCard;
