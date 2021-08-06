import { Confirmations, KonfirmasiData } from "@/types/collab";
import Link from "next/link";
import React from "react";

function ConfirmCard(props: KonfirmasiData) {
    let realName = props.serverId;
    if (typeof props.serverName === "string") {
        realName = props.serverName;
    }
    return (
        <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm">
            <div className="flex flex-col py-1">
                <div className="flex items-center font-bold text-black dark:text-gray-200">
                    <Link href={`/admin/proyek/kolaborasi/${props.id}`} passHref>
                        <a className="hover:underline">{realName}</a>
                    </Link>
                </div>
                <p className="text-black dark:text-gray-200 leading-5 mt-1">Kode: {props.id}</p>
                <p className="text-black dark:text-gray-200 leading-5 mt-1">Server ID: {props.serverId}</p>
            </div>
        </div>
    );
}

interface ConfirmSectionProps {
    animeId: string;
}

interface ConfirmSectionState {
    isLoading: boolean;
    loadedContents: Confirmations;
}

export default class ConfirmSectionComponent extends React.Component<
    ConfirmSectionProps,
    ConfirmSectionState
> {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            loadedContents: [],
        };
    }

    async componentDidMount() {
        const fetched = await fetch(`/api/showtimes/proyek/collab/${this.props.animeId}/pending`);
        const loadedContents = await fetched.json();
        if (loadedContents.success) {
            this.setState({ loadedContents: loadedContents.data });
        }
        this.setState({ isLoading: false });
    }

    render() {
        const { isLoading, loadedContents } = this.state;
        return (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    <span className="dark:text-gray-200 text-gray-800 text-lg font-semibold animate-pulse">
                        Memuat...
                    </span>
                ) : (
                    <>
                        {loadedContents.length > 0 ? (
                            <>
                                {loadedContents.map((value) => {
                                    return <ConfirmCard key={`kkleft-${value.id}`} {...value} />;
                                })}
                            </>
                        ) : (
                            <span className="dark:text-gray-200 text-gray-800 text-lg font-semibold">
                                Tidak ada yang butuh dikonfirmasi.
                            </span>
                        )}
                    </>
                )}
            </div>
        );
    }
}
