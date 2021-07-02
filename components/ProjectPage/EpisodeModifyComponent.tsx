import React from "react";

interface ModifyEpisodeProps {
    episode: number;
    onDeleted?: (episode: number) => void;
}

interface ModifyEpisodeState {
    deleted: boolean;
}

export default class EpisodeModifyComponent extends React.Component<ModifyEpisodeProps, ModifyEpisodeState> {
    constructor(props: ModifyEpisodeProps) {
        super(props);
        this.deleteButtonCallback = this.deleteButtonCallback.bind(this);
        this.state = {
            deleted: false,
        };
    }

    deleteButtonCallback(episode: number) {
        if (typeof this.props.onDeleted === "function") {
            this.props.onDeleted(episode);
        }
        this.setState({ deleted: true });
    }

    render() {
        const { episode } = this.props;
        const { deleted } = this.state;
        // Don't render if the episode deleted.
        if (deleted) {
            return null;
        }

        return (
            <div className="p-3 bg-white dark:bg-gray-700 rounded shadow-sm">
                <div className="flex flex-col py-1">
                    <div className="flex items-center font-bold text-black dark:text-gray-200">
                        Episode {episode.toString()}
                    </div>
                    <p className="text-black dark:text-gray-200 leading-5 mt-1">
                        Klik tombol <b className="text-red-500">Hapus</b> lalu klik tombol{" "}
                        <b className="text-green-500">Ubah</b> untuk menghapus episode ini.
                    </p>
                    <p className="text-black dark:text-gray-200 leading-5 mt-1">
                        Anda dapat mengklik banyak episode!
                        <br />
                        Aksi ini <span className="text-red-400 font-semibold">tidak dapat dikembalikan!</span>
                    </p>
                    <div className="mt-3">
                        <button
                            className="text-white font-semibold bg-red-500 hover:bg-red-600 hover:shadow-lg transition duration-200 rounded-md text-base py-2 px-3 focus:outline-none"
                            onClick={() => this.deleteButtonCallback(episode)}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
