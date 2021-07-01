import React from "react";
import Router from "next/router";

import { SettingsProps } from "./base";

import Modal, { CallbackModal } from "../Modal";
import LoadingCircle from "../LoadingCircle";

import { generateWordSets } from "../../lib/words";

interface ExtendedDeleteProps extends SettingsProps {
    id: string;
}

interface DeleteState {
    targetCheck: string[];
    isSubmitting: boolean;
    passwordCheck: string;
    correctPassword: boolean;
}

function resetState(submit: boolean = false): DeleteState {
    return {
        targetCheck: generateWordSets(3),
        isSubmitting: submit,
        passwordCheck: "",
        correctPassword: false,
    };
}

class DeleteServerComponent extends React.Component<ExtendedDeleteProps, DeleteState> {
    modalCb: CallbackModal;

    constructor(props) {
        super(props);
        this.handleHide = this.handleHide.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.deleteServerForReal = this.deleteServerForReal.bind(this);
        this.verifyParaphrase = this.verifyParaphrase.bind(this);

        this.state = resetState();
    }

    async deleteServerForReal() {
        if (!this.state.correctPassword) {
            return;
        }
        if (this.state.isSubmitting) return;
        this.handleHide();
        this.setState(resetState(true));

        const results = await fetch("/api/showtimes/nuke", {
            method: "POST",
        });
        const jsonRes = await results.json();
        if (jsonRes.success) {
            Router.push("/");
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
                <div className="flex flex-col py-1 border-2 border-red-700 border-dashed mt-2">
                    <h3 className="font-semibold dark:text-white my-2 mx-3 text-lg">Zona Bahaya!</h3>
                    <div className="flex flex-row pb-2">
                        <div className="flex flex-col ml-2">
                            <button
                                onClick={this.handleShow}
                                className={`rounded text-white px-4 py-2 ${
                                    isSubmitting
                                        ? "bg-red-500 cursor-not-allowed opacity-60"
                                        : "bg-red-600 hover:bg-red-700 opacity-100"
                                } transition duration-200 flex flex-row items-center focus:outline-none`}
                            >
                                {isSubmitting && <LoadingCircle className="ml-0 mt-0" />}
                                <span className={isSubmitting ? "mt-0.5 font-semibold" : "font-semibold"}>
                                    Hapus Server
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
                <Modal
                    onMounted={(cb) => (this.modalCb = cb)}
                    onClose={() => {
                        this.setState(resetState());
                    }}
                >
                    <Modal.Head>Apakah anda yakin?</Modal.Head>
                    <Modal.Body>
                        <div>Server akan dihapus selama-lamanya dan data lama tidak dapat dikembalikan!</div>
                        <div>Mohon masukan parafrasa berikut untuk melanjutkan!</div>
                        <div className="mt-2 text-center text-red-400">
                            <code>{this.state.targetCheck.join("-")}</code>
                        </div>
                        <div className="mt-2">
                            <input
                                className="form-darkable w-full"
                                value={this.state.passwordCheck}
                                placeholder="Masukan parafrasa"
                                onChange={(ev) => {
                                    this.setState({ passwordCheck: ev.target.value });
                                    this.verifyParaphrase(ev.target.value);
                                }}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="gap-2">
                        <button
                            onClick={this.deleteServerForReal}
                            className={`inline-flex justify-center font-semibold w-full px-4 py-2 transition duration-200 text-white rounded focus:outline-none ${
                                this.state.correctPassword
                                    ? "bg-red-600 hover:bg-red-700 opacity-100"
                                    : "bg-red-400 cursor-not-allowed opacity-60"
                            }`}
                        >
                            Hapus
                        </button>
                        <button
                            onClick={this.handleHide}
                            className="inline-flex justify-center font-semibold w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none"
                        >
                            Tidak
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

export default DeleteServerComponent;
