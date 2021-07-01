import React from "react";
import Router from "next/router";

import Modal, { CallbackModal } from "../Modal";
import LoadingCircle from "../LoadingCircle";
import MotionInView from "../MotionInView";
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

function resetState(submit: boolean = false): DeleteState {
    return {
        targetCheck: generateWordSets(3),
        isSubmitting: submit,
        passwordCheck: "",
        correctPassword: false,
    };
}

class FansubRSSDeleteButton extends React.Component<ExtendedNukeProps, DeleteState> {
    modalCb: CallbackModal;

    constructor(props: ExtendedNukeProps) {
        super(props);

        this.handleHide = this.handleHide.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.deleteRSSForReal = this.deleteRSSForReal.bind(this);
        this.verifyParaphrase = this.verifyParaphrase.bind(this);

        this.state = resetState();
    }

    async deleteRSSForReal() {
        if (!this.state.correctPassword) {
            return;
        }
        this.handleHide();
        this.setState(resetState(true));

        const results = await fetch("/api/fsrss/nuke", {
            method: "POST",
            body: JSON.stringify({ hashId: this.props.id }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const jsonRes = await results.json();
        if (jsonRes.success) {
            Router.push("/admin/fansubrss");
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
                <MotionInView.div
                    className="flex"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <button
                        onClick={this.handleShow}
                        className={`flex flex-row px-3 py-1 ${
                            this.state.isSubmitting
                                ? "bg-red-400 cursor-not-allowed opacity-60"
                                : "bg-red-500 hover:bg-red-600 opacity-100"
                        } duration-200 transition text-gray-100 text-sm rounded items-center focus:outline-none`}
                    >
                        {isSubmitting && <LoadingCircle className="ml-0 mt-0" />}
                        <span className={isSubmitting ? "-ml-1 font-semibold" : "font-semibold"}>Hapus</span>
                    </button>
                </MotionInView.div>

                <Modal
                    onMounted={(cb) => (this.modalCb = cb)}
                    onClose={() => {
                        this.setState(resetState());
                    }}
                >
                    <Modal.Head>Apakah anda yakin?</Modal.Head>
                    <Modal.Body>
                        <div>RSS akan dihapus selama-lamanya dan data lama tidak dapat dikembalikan!</div>
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
                            onClick={this.deleteRSSForReal}
                            className={`inline-flex justify-center font-semibold w-full px-4 py-2 transition duration-200 text-white rounded focus:outline-none ${
                                this.state.correctPassword
                                    ? "bg-red-600 hover:bg-red-700 opacity-60"
                                    : "bg-red-400 cursor-not-allowed opacity-100"
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

export default FansubRSSDeleteButton;
