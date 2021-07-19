import React from "react";

import { SimpleServerInfo } from "@/types/collab";

export default function CollabCardComponent(props: SimpleServerInfo) {
    const { id, name } = props;

    return (
        <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm">
            <div className="flex flex-col py-1">
                <div className="flex items-center font-bold text-black dark:text-gray-200">{id}</div>
                <p className="text-black dark:text-gray-200 leading-5 mt-1">
                    Klik tombol <b className="text-red-500">Hapus</b> lalu klik tombol{" "}
                    <b className="text-green-500">Ubah</b> untuk menghapus episode ini.
                </p>
                <p className="text-black dark:text-gray-200 leading-5 mt-1">
                    Anda dapat mengklik banyak episode!
                    <br />
                    Aksi ini <span className="text-red-400 font-semibold">tidak dapat dikembalikan!</span>
                </p>
            </div>
        </div>
    );
}
