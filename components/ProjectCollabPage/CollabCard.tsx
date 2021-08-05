import React from "react";

import { SimpleServerInfo } from "@/types/collab";

export default function CollabCardComponent(props: SimpleServerInfo) {
    const { id, name, selfId } = props;

    let realName = id;
    if (typeof name === "string") {
        realName = name;
    }
    if (id === selfId.id) {
        realName = selfId.name;
    }

    return (
        <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm">
            <div className="flex flex-col py-1">
                <div className="flex items-center font-bold text-black dark:text-gray-200">{realName}</div>
                <p className="text-black dark:text-gray-200 leading-5 mt-1">
                    Klik tombol <b className="text-red-500">Putuskan</b> untuk memberhentikan kolaborasi
                    dengan semua peladen lain.
                </p>
            </div>
        </div>
    );
}
