import React from "react";

import LoadingCircle from "../LoadingCircle";
import Modal, { CallbackModal } from "../Modal";

import { EpisodeStatusProps } from "../../models/show";

interface EpisodeAddProps {
    animeId: string;
    lastStatus: EpisodeStatusProps;
    disabled?: boolean;
    onUpdated?: (newStatus: EpisodeStatusProps[]) => void;
    onError?: (errorText: string) => void;
}

interface EpisodeAddState {
    total: number;
    isSubmitting: boolean;
}

export default class EpisodeAddComponent extends React.Component<EpisodeAddProps, EpisodeAddState> {
    modalCb?: CallbackModal;

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.processChange = this.processChange.bind(this);
        this.state = {
            total: 0,
            isSubmitting: false,
        };
    }

    closeModal() {
        if (this.modalCb) {
            this.modalCb.hideModal();
        }
    }

    openModal() {
        if (this.modalCb) {
            this.modalCb.showModal();
        }
    }

    async processChange() {
        const { total, isSubmitting } = this.state;
        if (isSubmitting) {
            return;
        }
        const { animeId, lastStatus } = this.props;
        this.setState({ isSubmitting: true });
        if (total < 1) {
            this.closeModal();
            return;
        }

        const lastEpisode = lastStatus.episode;
        const allNewEpisode = [];
        for (let i = 0; i < total; i++) {
            allNewEpisode.push(i + 1 + lastEpisode);
        }
        const sendData = {
            event: "add",
            changes: {
                episodes: allNewEpisode,
                animeId,
            },
        };
        const request = await fetch("/api/showtimes/proyek/episode", {
            method: "POST",
            body: JSON.stringify(sendData),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const response = await request.json();
        this.closeModal();
        if (!response.success) {
            if (typeof this.props.onError === "function") {
                this.props.onError(response.message);
            }
        } else {
            if (typeof this.props.onUpdated === "function") {
                this.props.onUpdated(response.data);
            }
        }
    }

    render() {
        const { total, isSubmitting } = this.state;
        const { lastStatus, disabled } = this.props;

        let shouldBeDisabled = isSubmitting;
        if (disabled) {
            shouldBeDisabled = true;
        }

        return (
            <>
                <button
                    disabled={shouldBeDisabled}
                    className={`mb-4 mt-1 font-semibold ${
                        shouldBeDisabled
                            ? "bg-green-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                    } hover:shadow-lg transition duration-200 rounded-md text-lg py-1 px-3 focus:outline-none text-white`}
                    onClick={() => {
                        if (shouldBeDisabled) {
                            return;
                        }
                        this.openModal();
                    }}
                >
                    + Tambah Episode
                </button>
                <Modal
                    id="episode-modal"
                    forceOpen={isSubmitting}
                    onMounted={(cb) => (this.modalCb = cb)}
                    onClose={() => {
                        this.setState({ isSubmitting: false, total: 0 });
                    }}
                >
                    <Modal.Head>Tambah Episode</Modal.Head>
                    <Modal.Body>
                        <div className="flex flex-col">
                            <p>Ketik seberapa banyak episode baru yang ingin anda tambah</p>
                            <p>Ketika menekan tombol tambah, akan otomatis</p>
                            <input
                                className="form-darkable w-full mt-2"
                                value={total}
                                type="number"
                                min={0}
                                disabled={isSubmitting}
                                onChange={(e) => this.setState({ total: e.currentTarget.valueAsNumber })}
                            />
                            <div className="flex flex-col mt-2">
                                <div className="flex gap-1">
                                    <span className="font-bold">Last Episode:</span>
                                    <span>{lastStatus.episode}</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className="font-bold">Total New Episode:</span>
                                    <span>{total}</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className="font-bold">New Episode:</span>
                                    {total > 0 ? (
                                        <span className="break-words">
                                            {Array.from(
                                                { length: total },
                                                (v, i) => i + lastStatus.episode + 1
                                            ).join(", ")}
                                        </span>
                                    ) : (
                                        <span>None added</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="gap-2">
                        <button
                            onClick={this.processChange}
                            disabled={isSubmitting}
                            className={`inline-flex flex-row gap-0 items-center justify-center font-semibold w-full px-4 py-2 text-white ${
                                isSubmitting
                                    ? "bg-green-400 cursor-not-allowed"
                                    : "bg-green-500 hover:bg-green-700"
                            } rounded focus:outline-none`}
                        >
                            {isSubmitting && <LoadingCircle className="ml-0 mr-2 mt-0" />}
                            Tambah
                        </button>
                        <button
                            onClick={this.closeModal}
                            disabled={isSubmitting}
                            className={`inline-flex justify-center font-semibold w-full px-4 py-2 text-white ${
                                isSubmitting ? "bg-red-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-700"
                            } rounded focus:outline-none`}
                        >
                            Batal
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}
