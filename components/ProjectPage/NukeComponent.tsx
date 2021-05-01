import React from "react";
import Router from "next/router";

import Modal, { CallbackModal } from "../Modal";
import LoadingCircle from "../LoadingCircle";
import { SettingsProps } from "../SettingsPage/base";

import { generateWordSets } from "../../lib/words";

interface ExtendedNukeProps extends SettingsProps {
    id: string;
}

interface DeleteState {
    targetCheck: string[];
    isSubmitting: boolean;
    passwordCheck: string;
    correctPassword: boolean;
}

class NukeProjectComponent extends React.Component<ExtendedNukeProps, DeleteState> {
    modalCb: CallbackModal;

    constructor(props: ExtendedNukeProps) {
        super(props);
        this.handleHide = this.handleHide.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.deleteProjectForReal = this.deleteProjectForReal.bind(this);
        this.verifyParaphrase = this.verifyParaphrase.bind(this);

        this.state = {
            targetCheck: generateWordSets(3),
            isSubmitting: false,
            correctPassword: false,
            passwordCheck: "",
        };
    }

    async deleteProjectForReal() {
        if (!this.state.correctPassword) {
            return;
        }
        this.handleHide();
        this.setState({
            isSubmitting: true,
            passwordCheck: "",
            targetCheck: generateWordSets(3),
            correctPassword: false,
        });

        const results = await fetch("/api/showtimes/proyek/nuke", {
            method: "POST",
            body: JSON.stringify({ animeId: this.props.id }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const jsonRes = await results.json();
        if (jsonRes.success) {
            Router.push("/admin/proyek");
        } else {
            this.props.onErrorModal(jsonRes.message);
            this.setState({ isSubmitting: false });
        }
    }

    handleHide() {
        if (this.modalCb) {
            this.modalCb.hideModal();
        }
    }

    verifyParaphrase(targetCheck: string) {
        const joinedTarget = this.state.targetCheck.join("-");
        if (joinedTarget === targetCheck) {
            this.setState({ correctPassword: true });
        } else if (this.state.correctPassword && joinedTarget !== targetCheck) {
            this.setState({ correctPassword: false });
        }
    }

    handleShow() {
        if (this.modalCb && !this.state.isSubmitting) {
            this.modalCb.showModal();
        }
    }

    render() {
        const { isSubmitting } = this.state;

        return (
            <>
                <div className="flex row mt-4">
                    <div className="flex flex-col">
                        <button
                            onClick={this.handleShow}
                            className={`rounded text-white px-4 py-2 ${
                                isSubmitting ? "bg-red-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                            } transition-colors duration-200 flex flex-row items-center focus:outline-none`}
                        >
                            {isSubmitting && <LoadingCircle className="ml-0 mt-0" />}
                            <span className={isSubmitting ? "mt-0.5 font-semibold" : "font-semibold"}>
                                Hapus Proyek
                            </span>
                        </button>
                    </div>
                </div>
                <Modal onMounted={(cb) => (this.modalCb = cb)}>
                    <Modal.Head>Apakah anda yakin?</Modal.Head>
                    <Modal.Body>
                        <div>Proyek akan dihapus selama-lamanya dan data lama tidak dapat dikembalikan!</div>
                        <div>Mohon masukan parafrasa berikut untuk melanjutkan!</div>
                        <div className="mt-2 text-center text-red-400">
                            <code>{this.state.targetCheck.join("-")}</code>
                        </div>
                        <div className="mt-2">
                            <input
                                className="form-input rounded-lg w-full bg-gray-200 dark:bg-gray-800 dark:text-gray-300 border-2 dark:border-gray-800 focus:border-yellow-500 dark:focus:border-yellow-500 transition duration-200"
                                value={this.state.passwordCheck}
                                placeholder="Masukan parafrasa"
                                onChange={(ev) => {
                                    this.setState({ passwordCheck: ev.target.value });
                                    this.verifyParaphrase(ev.target.value);
                                }}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer innerClassName="gap-2">
                        <button
                            onClick={this.deleteProjectForReal}
                            className={`inline-flex justify-center font-semibold w-full px-4 py-2 text-white rounded focus:outline-none ${
                                this.state.correctPassword
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-red-400 cursor-not-allowed"
                            }`}
                        >
                            Hapus
                        </button>
                        <button
                            onClick={this.handleHide}
                            className="inline-flex justify-center font-semibold w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                            Tidak
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default NukeProjectComponent;
